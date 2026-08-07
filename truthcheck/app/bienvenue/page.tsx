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
// vieux lien ou un bouton "retour" repart directement vers le test MBTI s'il
// ne l'a pas encore fait, sinon le Journal — même logique que BienvenueClient
// .finish() (voir ce fichier) : le test est la vraie porte d'entrée tant
// qu'il n'est pas fait, pas seulement pour ceux qui viennent de finir
// l'onboarding à l'instant.
export default async function BienvenuePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/bienvenue');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, onboardingCompletedAt: true, mbtiType: true },
  });
  if (!user) redirect('/login');
  if (user.onboardingCompletedAt) redirect(user.mbtiType ? '/journal' : '/quiz/personnalite');

  return <BienvenueClient prefillName={user.name} />;
}
