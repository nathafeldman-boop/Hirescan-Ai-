import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ALL_MBTI_TYPES } from '@/lib/mbti';

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

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      mbtiType: mbtiType.toUpperCase(),
      mbtiTestCount: { increment: 1 },
      ...(validScores ? { mbtiScores: scores as object } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
