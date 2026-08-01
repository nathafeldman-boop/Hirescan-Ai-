import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Marque la visite guidée comme terminée (voir app/decouverte/tour) — posé
// une seule fois, jamais "dé-posé", même sémantique que onboardingCompletedAt.
// Idempotent : un second appel ne fait rien de plus.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { tourCompletedAt: new Date() },
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
