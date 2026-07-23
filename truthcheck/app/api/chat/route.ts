import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callMistral, dailyLimitFor, parisDay, parisMonth, FREE_MONTHLY_LIMIT, MAX_HISTORY, ChatMessage } from '@/lib/chat';
import { buildCoachContext, coachSystemPrompt, coachSystemPromptFree, coachSystemPromptFreeNoTest } from '@/lib/coach';
import { hasPaidAccess } from '@/lib/plans';
import type { MbtiScores } from '@/lib/mbti';

export const dynamic = 'force-dynamic';

// Combien de messages on recharge pour l'affichage (mémoire visible).
const DISPLAY_HISTORY = 40;

// ── GET : recharge l'historique + l'état (quota, profil présent) ──
export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  const tier = (session?.user as { tier?: string } | undefined)?.tier;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  // Tout abonné payant (starter/plus/premium) = Nova personnalisée ; gratuit = bridée.
  const isPremium = hasPaidAccess(tier);
  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { mbtiType: true, chatBonusCredits: true, chatBonusDaily: true },
  }).catch(() => null);
  // Gratuit : quota MENSUEL (5/mois, clé "YYYY-MM"). Payant : quota journalier.
  const day = isPremium ? parisDay() : parisMonth();
  const usage = await prisma.chatUsage.findUnique({ where: { userId_day: { userId: uid, day } } }).catch(() => null);
  // Quota = base (palier) + bonus permanent parrainage. Les crédits
  // one-off s'ajoutent au "restant" affiché (ils prennent le relais après le quota).
  const limit = (isPremium ? dailyLimitFor(tier) : FREE_MONTHLY_LIMIT) + (user?.chatBonusDaily ?? 0);
  // Compte gratuit → coach bridé : on ne renvoie NI le type (header) NI l'historique
  // (qui pourrait contenir un ancien message révélant le type). Le résultat payant
  // reste derrière le paiement ; le coach fonctionne mais en version découverte.
  const rows = isPremium
    ? await prisma.chatMessage.findMany({
        where: { userId: uid },
        orderBy: { createdAt: 'desc' },
        take: DISPLAY_HISTORY,
        select: { role: true, content: true },
      }).catch(() => [])
    : [];

  return NextResponse.json({
    hasProfile: !!user?.mbtiType,
    mbtiType: isPremium ? (user?.mbtiType ?? null) : null,
    free: !isPremium,
    messages: rows.reverse(),
    remaining: Math.max(0, limit - (usage?.count ?? 0)) + (user?.chatBonusCredits ?? 0),
    limit,
    // Lien de parrainage : +3 messages à l'inscription d'un invité, +3/jour s'il paie.
    inviteCode: uid,
  });
}

// ── POST : un nouveau message → réponse du coach ──
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string; name?: string | null } | undefined;
  if (!user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  // Abonné payant (Starter/Plus/Premium) → coach personnalisé complet. Gratuit →
  // coach bridé (générique, sans le type). Voir le choix du prompt plus bas.
  const isPremium = hasPaidAccess(user.tier);

  // Rétro-compatible : nouvelle UI → { message } ; anciens clients en cache →
  // { messages: [...] } (on extrait le dernier message utilisateur). Évite de
  // casser un onglet ouvert avant la mise à jour.
  const body = await req.json().catch(() => null) as
    { message?: string; messages?: { role?: string; content?: string }[] } | null;
  let message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message && Array.isArray(body?.messages)) {
    const lastUser = [...body.messages].reverse().find((m) => m?.role === 'user' && typeof m?.content === 'string');
    message = (lastUser?.content ?? '').trim();
  }
  message = message.slice(0, 4000);
  if (!message) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { mbtiType: true, mbtiScores: true, name: true, chatBonusCredits: true, chatBonusDaily: true },
  }).catch(() => null);
  if (!dbUser) return NextResponse.json({ error: 'assistant_unavailable' }, { status: 502 });
  // Un abonné PAYANT paie justement pour le coach personnalisé selon SON test —
  // sans profil, on l'invite à le passer d'abord. Un compte GRATUIT, lui, peut
  // essayer Nova sans avoir fait le test (découverte) : elle répond en général
  // et rappelle à chaque réponse de faire le test (voir coachSystemPromptFreeNoTest).
  if (isPremium && !dbUser.mbtiType) {
    return NextResponse.json({ needsTest: true }, { status: 200 });
  }

  // Quota : payant = journalier (palier + bonus permanent) ; gratuit = 5/MOIS.
  // Au-delà, les crédits one-off (parrainage) prennent le relais, un par message.
  const limit = (isPremium ? dailyLimitFor(user.tier) : FREE_MONTHLY_LIMIT) + (dbUser.chatBonusDaily ?? 0);
  const day = isPremium ? parisDay() : parisMonth();
  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  }).catch(() => null);
  let useBonusCredit = false;
  if ((usage?.count ?? 0) >= limit) {
    if ((dbUser.chatBonusCredits ?? 0) > 0) {
      useBonusCredit = true;
    } else {
      return NextResponse.json({ error: 'quota_exceeded', limit, tier: user.tier ?? 'free' }, { status: 429 });
    }
  }

  // Contexte = N derniers messages (mémoire bornée). En gratuit, on NE recharge
  // PAS l'historique (il pourrait contenir un ancien message avec le type) →
  // le modèle bridé ne peut pas le ressortir.
  const prior = isPremium
    ? await prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: MAX_HISTORY,
        select: { role: true, content: true },
      }).catch(() => [])
    : [];
  const history: ChatMessage[] = [
    ...prior.reverse().map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: message },
  ];

  const scores = (dbUser.mbtiScores as unknown as MbtiScores | null) ?? null;
  const firstName = dbUser.name?.split(' ')[0] ?? null;
  // Payant → coach ancré sur le test complet. Gratuit + test fait → coach bridé
  // (générique, aucun type transmis). Gratuit + test PAS fait → coach découverte
  // (rappelle de faire le test à chaque réponse).
  const system = isPremium
    ? coachSystemPrompt(firstName, buildCoachContext(dbUser.mbtiType as string, scores))
    : dbUser.mbtiType
      ? coachSystemPromptFree(firstName)
      : coachSystemPromptFreeNoTest(firstName);

  const result = await callMistral(system, history);
  if (!result.ok || !result.reply) {
    if (result.error === 'not_configured') return NextResponse.json({ error: 'not_configured' }, { status: 503 });
    return NextResponse.json({ error: 'assistant_unavailable' }, { status: 502 });
  }

  // Persiste la paire + décompte 1 message
  await prisma.chatMessage.createMany({
    data: [
      { userId: user.id, role: 'user', content: message },
      { userId: user.id, role: 'assistant', content: result.reply },
    ],
  }).catch(() => {});
  const updated = await prisma.chatUsage.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  }).catch(() => null);
  // Message au-delà du quota → consomme un crédit bonus parrainage.
  let creditsLeft = dbUser.chatBonusCredits ?? 0;
  if (useBonusCredit) {
    const u = await prisma.user.update({
      where: { id: user.id },
      data: { chatBonusCredits: { decrement: 1 } },
      select: { chatBonusCredits: true },
    }).catch(() => null);
    creditsLeft = Math.max(0, u?.chatBonusCredits ?? creditsLeft - 1);
  }

  const remaining = Math.max(0, limit - (updated?.count ?? (usage?.count ?? 0) + 1)) + creditsLeft;
  return NextResponse.json({ reply: result.reply, remaining, limit });
}
