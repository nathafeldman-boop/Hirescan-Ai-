import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';

export const dynamic = 'force-dynamic';

// Historique d'évolution du type MBTI — voir prisma/schema.prisma::MbtiTestHistory.
// Même logique de palier que les autres features "regarder en arrière"
// (Profil avancé, Journal) : gratuit voit juste combien de fois il/elle a
// testé, l'historique détaillé (dates, types, scores) est réservé aux abonnés.
const MAX_ROWS = 50;

export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { tier: true } });
  if (!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const count = await prisma.mbtiTestHistory.count({ where: { userId: uid } });

  if (!hasPaidAccess(user.tier)) {
    return NextResponse.json({ ok: true, locked: true, count });
  }

  const history = await prisma.mbtiTestHistory.findMany({
    where: { userId: uid },
    select: { type: true, scores: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: MAX_ROWS,
  });

  return NextResponse.json({ ok: true, locked: false, count, history });
}
