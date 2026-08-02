import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callMistral, dailyLimitFor, parisDay, parisMonth, FREE_MONTHLY_LIMIT, MAX_HISTORY, ChatMessage } from '@/lib/chat';
import { buildCoachContext, coachSystemPrompt, coachSystemPromptFree, coachSystemPromptFreeNoTest } from '@/lib/coach';
import { summarizeJournalForAnalysis } from '@/lib/advancedAnalysis';
import { generateQuiz } from '@/lib/customQuiz';
import { hasPaidAccess } from '@/lib/plans';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import { checkAndRecordQuestCompletions } from '@/lib/quests';
import type { MbtiScores } from '@/lib/mbti';

export const dynamic = 'force-dynamic';

// Demande explicite (dans la conversation) de créer un test à partager — Elio
// ne peut pas "promettre" un test en texte libre, donc on détecte l'intention
// et on déclenche directement la vraie génération (même pipeline que le bouton
// dédié /api/quiz-builder/create), plutôt que de laisser le modèle bluffer.
const QUIZ_INTENT_RE = /\b(cr[ée]e?r?|g[ée]n[èe]re?r?|fabrique|invente)\b[\w\s'-]{0,30}\b(test|quizz?)\b/i;

// Combien de messages on recharge pour l'affichage (mémoire visible).
const DISPLAY_HISTORY = 40;

// Photo envoyée à Elio (vision, mistral-small-latest) : data URI base64, taille
// plafonnée pour rester raisonnable en coût/latence (~4,5 Mo décodés).
const MAX_IMAGE_DATA_URI_LENGTH = 6_000_000;

// Usage gratuit = somme de toutes les lignes ChatUsage du mois courant (Paris),
// pas juste celle du jour — le compte gratuit a un quota MENSUEL (voir
// FREE_MONTHLY_LIMIT dans lib/chat.ts), les lignes restent au jour près pour
// rester compatibles avec le quota journalier des paliers payants.
async function getFreeMonthlyUsage(userId: string): Promise<number> {
  const rows = await prisma.chatUsage.findMany({
    where: { userId, day: { startsWith: parisMonth() } },
    select: { count: true },
  }).catch(() => []);
  return rows.reduce((sum, r) => sum + r.count, 0);
}

// ── GET : recharge l'historique + l'état (quota, profil présent) ──
export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  const tier = (session?.user as { tier?: string } | undefined)?.tier;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  // Tout abonné payant (starter/plus/premium) = Elio personnalisé ; gratuit = bridé.
  const isPremium = hasPaidAccess(tier);
  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { mbtiType: true, chatBonusCredits: true, chatBonusDaily: true },
  }).catch(() => null);
  // Palier payant → quota journalier (voir lib/chat.ts) ; gratuit → quota
  // MENSUEL, somme de tout le mois courant plutôt qu'une seule journée.
  const day = parisDay();
  const usage = isPremium
    ? await prisma.chatUsage.findUnique({ where: { userId_day: { userId: uid, day } } }).catch(() => null)
    : null;
  const usedCount = isPremium ? (usage?.count ?? 0) : await getFreeMonthlyUsage(uid);
  // Quota = base (palier, mensuel en gratuit) + bonus permanent parrainage —
  // ces bonus s'appliquent à TOUT le monde, gratuit compris : le but est de
  // motiver (quêtes à effort réel, parrainage), pas de fermer la porte. Voir
  // lib/quests.ts pour les quêtes qui ont un vrai rewardCredits (streaks,
  // parrainage...) — les 3 quêtes triviales du funnel de démarrage
  // (onboarding, 1er journal, 1er message) n'en donnent plus, elles.
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
    remaining: Math.max(0, limit - usedCount) + (user?.chatBonusCredits ?? 0),
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
    { message?: string; messages?: { role?: string; content?: string }[]; imageBase64?: string } | null;
  let message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message && Array.isArray(body?.messages)) {
    const lastUser = [...body.messages].reverse().find((m) => m?.role === 'user' && typeof m?.content === 'string');
    message = (lastUser?.content ?? '').trim();
  }
  message = message.slice(0, 4000);

  // Photo optionnelle (Elio vision) — data URI envoyée par le client.
  const rawImage = typeof body?.imageBase64 === 'string' ? body.imageBase64 : '';
  let imageDataUri: string | null = null;
  if (rawImage) {
    if (!/^data:image\/(jpe?g|png|webp|gif);base64,/i.test(rawImage)) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    if (rawImage.length > MAX_IMAGE_DATA_URI_LENGTH) {
      return NextResponse.json({ error: 'image_too_large' }, { status: 413 });
    }
    imageDataUri = rawImage;
  }

  if (!message && !imageDataUri) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { mbtiType: true, mbtiScores: true, name: true, chatBonusCredits: true, chatBonusDaily: true, onboardingGoal: true },
  }).catch(() => null);
  if (!dbUser) return NextResponse.json({ error: 'assistant_unavailable' }, { status: 502 });
  // Un abonné PAYANT paie justement pour le coach personnalisé selon SON test —
  // sans profil, on l'invite à le passer d'abord. Un compte GRATUIT, lui, peut
  // essayer Elio sans avoir fait le test (découverte) : il répond en général
  // et rappelle à chaque réponse de faire le test (voir coachSystemPromptFreeNoTest).
  if (isPremium && !dbUser.mbtiType) {
    return NextResponse.json({ needsTest: true }, { status: 200 });
  }

  // Quota : palier payant → journalier ; compte GRATUIT → mensuel, somme de
  // tout le mois courant (voir FREE_MONTHLY_LIMIT dans lib/chat.ts). Le bonus
  // permanent parrainage et les crédits one-off s'appliquent à TOUT le monde,
  // gratuit compris — motiver un vrai effort (streaks, parrainage) doit
  // rapporter, même en gratuit (voir lib/quests.ts : les 3 quêtes triviales
  // du funnel de démarrage, elles, ne donnent plus de crédits).
  const limit = (isPremium ? dailyLimitFor(user.tier) : FREE_MONTHLY_LIMIT) + (dbUser.chatBonusDaily ?? 0);
  const day = parisDay();
  // La ligne du JOUR reste la seule à incrémenter (voir plus bas) même pour
  // un compte gratuit — seule la LECTURE du quota agrège tout le mois.
  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  }).catch(() => null);
  const usedCount = isPremium ? (usage?.count ?? 0) : await getFreeMonthlyUsage(user.id);
  let useBonusCredit = false;
  if (usedCount >= limit) {
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
  // Photo : contenu multimodal pour CE tour uniquement (jamais réinjecté dans
  // l'historique rechargé — voir lib/chat.ts). Sans photo, un simple texte.
  const currentUserContent: ChatMessage['content'] = imageDataUri
    ? [
        { type: 'text', text: message || 'Qu\'est-ce que tu penses de cette photo ?' },
        { type: 'image_url', image_url: imageDataUri },
      ]
    : message;

  const history: ChatMessage[] = [
    ...prior.reverse().map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: currentUserContent },
  ];

  const scores = (dbUser.mbtiScores as unknown as MbtiScores | null) ?? null;
  const firstName = dbUser.name?.split(' ')[0] ?? null;
  // Elio qui "connaît" le journal — réservé aux abonnés, comme le reste du
  // coaching personnalisé. Requête légère (14 derniers jours, pas de note/
  // photo) : même fonction de résumé que le Profil avancé, pour rester
  // cohérent entre les deux features et ne pas dupliquer la logique.
  const journalEntries = isPremium
    ? await prisma.journalEntry.findMany({
        where: { userId: user.id },
        select: { day: true, mood: true, energy: true, stress: true },
        orderBy: { day: 'desc' },
        take: 14,
      }).catch(() => [])
    : [];
  const journalSummary = summarizeJournalForAnalysis(journalEntries);
  // Payant → coach ancré sur le test complet (+ journal s'il y en a assez).
  // Gratuit + test fait → coach bridé (générique, aucun type transmis).
  // Gratuit + test PAS fait → coach découverte (rappelle de faire le test).
  const system = isPremium
    ? coachSystemPrompt(firstName, buildCoachContext(dbUser.mbtiType as string, scores, journalSummary), dbUser.onboardingGoal)
    : dbUser.mbtiType
      ? coachSystemPromptFree(firstName, dbUser.onboardingGoal)
      : coachSystemPromptFreeNoTest(firstName, dbUser.onboardingGoal);

  let result: { ok: boolean; reply?: string; error?: string };
  if (isPremium && !imageDataUri && QUIZ_INTENT_RE.test(message)) {
    const topic = message.slice(0, 200);
    const quiz = await generateQuiz(topic);
    const saved = quiz
      ? await prisma.customQuiz.create({
          data: {
            creatorId: user.id,
            topic,
            title: quiz.title,
            intro: quiz.intro,
            questions: quiz.questions as object,
            resultBands: quiz.resultBands as object,
            disclaimer: quiz.disclaimer,
          },
        }).catch(() => null)
      : null;
    // Si la génération structurée échoue (thème qui a fait dévier le modèle),
    // on le dit clairement plutôt que de laisser Elio improviser un faux test
    // en texte libre — ça ressemblait à un vrai test mais ce n'était qu'un
    // copier-coller, sans lien partageable derrière.
    result = saved
      ? { ok: true, reply: `✨ Ton test "${quiz!.title}" est prêt !\n\nEnvoie ce lien à qui tu veux, aucun compte n'est nécessaire pour le faire :\nhttps://urcecret.site/q/${saved.id}` }
      : { ok: true, reply: "Oups, ce thème est passé de travers pour le format test (ça arrive sur des sujets un peu piquants 😅). Reformule-le un peu différemment — par exemple \"qui est le/la plus bordélique du groupe\" plutôt que \"toxique\" — et je te le fais tout de suite." };
  } else {
    result = await callMistral(system, history);
  }
  if (!result.ok || !result.reply) {
    if (result.error === 'not_configured') return NextResponse.json({ error: 'not_configured' }, { status: 503 });
    return NextResponse.json({ error: 'assistant_unavailable' }, { status: 502 });
  }

  // Persiste la paire + décompte 1 message. On ne stocke JAMAIS la photo elle-
  // même (juste un texte/légende) — évite d'alourdir la DB et les tours suivants.
  await prisma.chatMessage.createMany({
    data: [
      { userId: user.id, role: 'user', content: message || (imageDataUri ? '[Photo envoyée]' : '') },
      { userId: user.id, role: 'assistant', content: result.reply },
    ],
  }).catch(() => {});
  const updated = await prisma.chatUsage.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  }).catch(() => null);
  // Message au-delà du quota → consomme un crédit bonus (quête/parrainage),
  // gratuit compris — voir le calcul de `limit` plus haut.
  let creditsLeft = dbUser.chatBonusCredits ?? 0;
  if (useBonusCredit) {
    const u = await prisma.user.update({
      where: { id: user.id },
      data: { chatBonusCredits: { decrement: 1 } },
      select: { chatBonusCredits: true },
    }).catch(() => null);
    creditsLeft = Math.max(0, u?.chatBonusCredits ?? creditsLeft - 1);
  }

  const newUsedCount = isPremium ? (updated?.count ?? (usage?.count ?? 0) + 1) : usedCount + 1;
  const remaining = Math.max(0, limit - newUsedCount) + creditsLeft;
  await logEvent(user.id, EVENTS.NOVA_MESSAGE_SENT);
  const newlyCompletedQuests = await checkAndRecordQuestCompletions(user.id);
  return NextResponse.json({ reply: result.reply, remaining, limit, newlyCompletedQuests });
}

// ── DELETE : efface l'historique de conversation (pas le quota, pas le profil) ──
export async function DELETE() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  await prisma.chatMessage.deleteMany({ where: { userId: uid } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
