import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import BienvenueClient from './BienvenueClient';

export const metadata: Metadata = {
  title: 'Bienvenue | UrCecret',
  robots: { index: false, follow: false }, // étape applicative privée (compte requis)
};

// Premier écran vu par un compte fraîchement créé — voir `pages.newUser` dans
// lib/auth.ts (flux Google/magic-link) et resolvePostAuthDestination dans
// lib/onboardingFunnel.ts (flux OTP par email). Jamais rejoué une fois
// répondu (onboardingCompletedAt) : un utilisateur qui revient ici par un
// vieux lien ou un bouton "retour" repart directement vers le Journal.
export default async function BienvenuePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/bienvenue');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, onboardingCompletedAt: true },
  });
  if (!user) redirect('/login');
  if (user.onboardingCompletedAt) redirect('/journal');

  return <BienvenueClient prefillName={user.name} />;
}
