import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ALL_MBTI_TYPES } from '@/lib/mbti';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import { checkAndRecordQuestCompletions } from '@/lib/quests';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { mbtiType, scores } = await req.json() as { mbtiType?: string; scores?: unknown };
  if (!mbtiType || !ALL_MBTI_TYPES.includes(mbtiType.toUpperCase())) {
    return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
  }

  // Validation légère des scores (4 axes attendus) — sinon on ignore juste.
  const validScores =
    scores && typeof scores === 'object' &&
    ['EI', 'SN', 'TF', 'JP'].every((a) => {
      const s = (scores as Record<string, unknown>)[a] as { letter?: unknown; pct?: unknown } | undefined;
      return s && typeof s.letter === 'string' && typeof s.pct === 'number';
    });

  const type = mbtiType.toUpperCase();

  // Root cause d'une vraie fuite de données trouvée en audit : sans ce
  // try/catch, un échec DB ici renvoyait un 500 générique jamais vérifié côté
  // client (voir les deux appels dans PersonnaliteClient.tsx, corrigés en
  // même temps) — l'utilisateur voyait son résultat s'afficher normalement en
  // croyant que tout avait marché, alors que son type n'était jamais
  // enregistré (perte invisible, indiscernable d'une vraie conversion).
  try {
    await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          mbtiType: type,
          mbtiTestCount: { increment: 1 },
          ...(validScores ? { mbtiScores: scores as object } : {}),
        },
      }),
      // Snapshot pour l'historique d'évolution (voir MbtiTestHistory) — jamais
      // écrasé, contrairement à User.mbtiType/mbtiScores.
      prisma.mbtiTestHistory.create({
        data: { userId: session.user.id, type, ...(validScores ? { scores: scores as object } : {}) },
      }),
    ]);
  } catch (e) {
    console.error('save-mbti failed:', e);
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }

  await logEvent(session.user.id, EVENTS.TEST_COMPLETED, { mbtiType: type });
  await checkAndRecordQuestCompletions(session.user.id);

  return NextResponse.json({ ok: true });
}
