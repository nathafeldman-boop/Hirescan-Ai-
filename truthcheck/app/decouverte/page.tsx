import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import DecouverteClient from './DecouverteClient';

export const metadata: Metadata = {
  title: 'Que veux-tu découvrir sur toi ? | UrCecret',
  description: 'Test de personnalité, coach IA, journal émotionnel, analyse de relations, quiz — choisis ton expérience et commence à mieux te connaître.',
  alternates: { canonical: 'https://urcecret.site/decouverte' },
  robots: { index: false, follow: false }, // hub applicatif privé (compte requis)
};

// Le hub est la nouvelle étape du funnel entre la landing et les
// fonctionnalités — on demande la connexion ICI plutôt que de laisser chaque
// carte rediriger séparément vers /login (compat/journal le font déjà, mais
// Elio/quiz non) : un seul mur de connexion, avant de choisir l'expérience.
// Depuis le funnel /bienvenue → /journal, c'est aussi le premier écran
// "maison" qu'un nouvel inscrit voit après avoir déjà donné un peu de lui —
// d'où le prénom + la quête "profil incomplet" (voir DecouverteClient).
export default async function DecouvertePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/decouverte');

  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep) redirect(funnelStepPath(pendingStep));

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, mbtiType: true },
  });

  return (
    <DecouverteClient
      firstName={user?.name?.split(' ')[0] ?? null}
      hasProfile={!!user?.mbtiType}
    />
  );
}
