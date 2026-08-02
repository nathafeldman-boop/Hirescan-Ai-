import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Redirige vers la fiche du VRAI type de CE compte, sans jamais faire
// transiter le code par le HTML du dashboard — voir app/dashboard/page.tsx.
// Un compte non payant qui clique "Débloquer mon profil complet" arrive donc
// sur /types/[code] sans que ce code n'ait jamais figuré dans la page
// d'origine (visible ou dans la charge d'hydratation React).
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.redirect(new URL('/login', req.url));

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { mbtiType: true } });
  if (!user?.mbtiType) return NextResponse.redirect(new URL('/quiz/personnalite', req.url));

  return NextResponse.redirect(new URL(`/types/${user.mbtiType.toLowerCase()}`, req.url));
}
