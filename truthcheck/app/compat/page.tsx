import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import CompatClient from './CompatClient';

export const metadata: Metadata = {
  title: 'Compatibilité amoureuse | UrCecret',
  description: 'Découvre ta compatibilité avec ton/ta partenaire grâce à l\'analyse de personnalité par IA.',
  alternates: { canonical: 'https://urcecret.site/compat' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

export default async function CompatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true },
  });
  if (!user) redirect('/login');

  return <CompatClient isPaid={hasPaidAccess(user.tier)} />;
}
