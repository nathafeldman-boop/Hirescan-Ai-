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

  const { mbtiType } = await req.json() as { mbtiType?: string };
  if (!mbtiType || !ALL_MBTI_TYPES.includes(mbtiType.toUpperCase())) {
    return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      mbtiType: mbtiType.toUpperCase(),
      mbtiTestCount: { increment: 1 },
    },
  });

  return NextResponse.json({ ok: true });
}
