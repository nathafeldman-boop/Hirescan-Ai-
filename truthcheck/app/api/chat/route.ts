import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callMistral, dailyLimitFor, parisDay, MAX_HISTORY, ChatMessage } from '@/lib/chat';
import { buildCoachContext, coachSystemPrompt } from '@/lib/coach';
import { hasPremiumAccess } from '@/lib/plans';
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

  // Coach réservé aux abonnés (Plus/Premium). Pour un compte gratuit on ne révèle
  // NI le type NI l'historique → le résultat reste derrière le paiement.
  if (!hasPremiumAccess(tier)) {
    const u = await prisma.user.findUnique({ where: { id: uid }, select: { mbtiType: true } }).catch(() => null);
    return NextResponse.json({ locked: true, hasProfile: !!u?.mbtiType, mbtiType: null, messages: [], remaining: 0, limit: 0 });
  }

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { mbtiType: true } }).catch(() => null);
  const day = parisDay();
  const usage = await prisma.chatUsage.findUnique({ where: { userId_day: { userId: uid, day } } }).catch(() => null);
  const limit = dailyLimitFor(tier);
  const rows = await prisma.chatMessage.findMany({
    where: { userId: uid },
    orderBy: { createdAt: 'desc' },
    take: DISPLAY_HISTORY,
    select: { role: true, content: true },
  }).catch(() => []);

  return NextResponse.json({
    hasProfile: !!user?.mbtiType,
    mbtiType: user?.mbtiType ?? null,
    messages: rows.reverse(),
    remaining: Math.max(0, limit - (usage?.count ?? 0)),
    limit,
  });
}

// ── POST : un nouveau message → réponse du coach ──
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string; name?: string | null } | undefined;
  if (!user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  // Verrou paiement : le coach (qui révèle le type + le profil) est réservé aux
  // abonnés. Un compte gratuit ne peut PAS l'utiliser → plus de fuite du résultat.
  if (!hasPremiumAccess(user.tier)) {
    return NextResponse.json({ error: 'payment_required', tier: user.tier ?? 'free' }, { status: 402 });
  }

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

  // Le coach a besoin du test : sans type, on invite à le passer (sans appel payant).
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { mbtiType: true, mbtiScores: true, name: true },
  }).catch(() => null);
  if (!dbUser?.mbtiType) {
    return NextResponse.json({ needsTest: true }, { status: 200 });
  }

  // Quota du jour
  const limit = dailyLimitFor(user.tier);
  const day = parisDay();
  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  }).catch(() => null);
  if ((usage?.count ?? 0) >= limit) {
    return NextResponse.json({ error: 'quota_exceeded', limit, tier: user.tier ?? 'free' }, { status: 429 });
  }

  // Contexte = profil coach + N derniers messages (mémoire bornée)
  const prior = await prisma.chatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: MAX_HISTORY,
    select: { role: true, content: true },
  }).catch(() => []);
  const history: ChatMessage[] = [
    ...prior.reverse().map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: message },
  ];

  const scores = (dbUser.mbtiScores as unknown as MbtiScores | null) ?? null;
  const firstName = dbUser.name?.split(' ')[0] ?? null;
  const system = coachSystemPrompt(firstName, buildCoachContext(dbUser.mbtiType, scores));

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

  const remaining = Math.max(0, limit - (updated?.count ?? (usage?.count ?? 0) + 1));
  return NextResponse.json({ reply: result.reply, remaining, limit });
}
