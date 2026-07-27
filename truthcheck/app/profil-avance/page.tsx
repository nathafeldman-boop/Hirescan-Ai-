import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import ProfilAvanceClient from './ProfilAvanceClient';

export const metadata: Metadata = {
  title: 'Profil avancé | UrCecret',
  description: 'Analyse détaillée de ta personnalité : fonctions cognitives, forces et axes de développement.',
  alternates: { canonical: 'https://urcecret.site/profil-avance' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

export default async function ProfilAvancePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true, mbtiType: true },
  });
  if (!user) redirect('/login');

  return <ProfilAvanceClient isPaid={hasPaidAccess(user.tier)} hasTest={!!user.mbtiType} />;
}
