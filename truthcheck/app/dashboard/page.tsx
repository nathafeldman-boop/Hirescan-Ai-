import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasProfileAccess } from '@/lib/plans';
import { teaserLines } from '@/lib/mbtiTeaser';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Mon profil | UrCecret',
  description: 'Ton type de personnalité, ton historique et tes résultats.',
  alternates: { canonical: 'https://urcecret.site/dashboard' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      tier: true,
      mbtiType: true,
      mbtiTestCount: true,
      createdAt: true,
    },
  });

  if (!user) redirect('/login');

  // Root cause d'une vraie fuite de conversion : DashboardClient est un
  // Client Component, donc TOUT ce qu'on lui passe en props part dans le
  // HTML (charge d'hydratation React), même ce que le JSX choisit de ne pas
  // afficher visuellement. Passer mbtiType en clair pour un compte non payant
  // et compter sur le composant pour "juste ne pas l'afficher" laissait le
  // code lisible via un simple clic droit → Afficher le code source — donc
  // on décide ICI, côté serveur, ce qui a le droit de quitter le serveur :
  // le code à 4 lettres n'est jamais envoyé au client tant que ce n'est pas
  // payé (même principe que ResultTeaser dans PersonnaliteClient.tsx).
  const hasProfile = hasProfileAccess(user.tier);
  const hasSealedType = !hasProfile && !!user.mbtiType;

  return (
    <DashboardClient
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        tier: user.tier,
        mbtiType: hasProfile ? user.mbtiType : null,
        hasSealedType,
        sealedTeaserLines: hasSealedType ? teaserLines(user.mbtiType!) : null,
        mbtiTestCount: user.mbtiTestCount,
        memberSince: user.createdAt.toISOString(),
      }}
    />
  );
}
