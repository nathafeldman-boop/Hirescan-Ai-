import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import { dailyLimitFor, parisDay } from '@/lib/chat';
import { generateFriendCompat, COMPAT_QUESTIONS, RELATION_TYPES, type RelationType } from '@/lib/friendCompat';
import { computeCompatScore } from '@/lib/friendCompatScore';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import type { MbtiScores } from '@/lib/mbti';

export const dynamic = 'force-dynamic';

// Compatibilité avec un ami/couple/famille — le SCORE (déterministe, gratuit,
// voir lib/friendCompatScore.ts) est ouvert à tout le monde : la saisie et le
// premier résultat ne doivent jamais être un mur. Seule l'analyse approfondie
// d'Elio (commonPoints/differences/strengths/watchPoints/summary) reste
// payante, et consomme le quota du jour comme les autres features Elio.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string; mbtiType?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  const isPaid = hasPaidAccess(user.tier);

  const body = await req.json().catch(() => null) as {
    personName?: string;
    relationType?: string;
    answers?: { questionId: string; choiceIndex: number }[];
  } | null;

  const personName = (body?.personName ?? '').trim().slice(0, 60);
  const relationType = body?.relationType as RelationType | undefined;
  if (!personName || !relationType || !RELATION_TYPES.some((r) => r.value === relationType)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!Array.isArray(body?.answers) || body.answers.length !== COMPAT_QUESTIONS.length) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const answersForPrompt: { question: string; choice: string }[] = [];
  const answersToStore: { questionId: string; choiceLabel: string }[] = [];
  for (const a of body.answers) {
    const q = COMPAT_QUESTIONS.find((qq) => qq.id === a.questionId);
    const choice = q?.options[a.choiceIndex];
    if (!q || choice === undefined) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    answersForPrompt.push({ question: q.text, choice });
    answersToStore.push({ questionId: q.id, choiceLabel: choice });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { mbtiType: true, mbtiScores: true } });

  // Score + headline : gratuits, déterministes, jamais bloqués par un quota.
  const { score, headline } = computeCompatScore((dbUser?.mbtiScores as unknown as MbtiScores | null) ?? null, body.answers);

  // Le score gratuit ci-dessus est déjà acquis quoi qu'il arrive. L'analyse
  // approfondie d'Elio s'ajoute PAR-DESSUS si le compte est payant ET a
  // encore du quota — mais un quota épuisé ou un échec de génération ne doit
  // jamais faire perdre le score gratuit qu'un compte gratuit aurait, lui,
  // obtenu sans condition.
  let deep: Awaited<ReturnType<typeof generateFriendCompat>> = null;
  let remaining: number | undefined;
  let limit: number | undefined;

  if (isPaid) {
    const day = parisDay();
    limit = dailyLimitFor(user.tier);
    const usage = await prisma.chatUsage.upsert({
      where: { userId_day: { userId: user.id, day } },
      create: { userId: user.id, day, count: 0 },
      update: {},
    }).catch(() => null);

    if ((usage?.count ?? 0) < limit) {
      deep = await generateFriendCompat(relationType, personName, dbUser?.mbtiType ?? null, answersForPrompt);
      if (deep) {
        const updated = await prisma.chatUsage.update({
          where: { userId_day: { userId: user.id, day } },
          data: { count: { increment: 1 } },
        }).catch(() => null);
        remaining = Math.max(0, limit - (updated?.count ?? (usage?.count ?? 0) + 1));
      }
    }
  }

  const saved = await prisma.compatibilityCheck.create({
    data: {
      userId: user.id,
      personName,
      relationType,
      answers: answersToStore,
      score,
      headline,
      ...(deep ? {
        commonPoints: deep.commonPoints,
        differences: deep.differences,
        strengths: deep.strengths,
        watchPoints: deep.watchPoints,
        summary: deep.summary,
      } : {}),
    },
  });

  await logEvent(user.id, EVENTS.COMPAT_CREATED, { paid: isPaid });

  return NextResponse.json({ ok: true, id: saved.id, remaining, limit });
}
