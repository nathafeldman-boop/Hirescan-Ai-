import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DecouverteClient from './DecouverteClient';

export const metadata: Metadata = {
  title: 'Que veux-tu découvrir sur toi ? | UrCecret',
  description: 'Test de personnalité, coach IA, journal émotionnel, analyse de relations, quiz — choisis ton expérience et commence à mieux te connaître.',
  alternates: { canonical: 'https://urcecret.site/decouverte' },
};

// Le hub est la nouvelle étape du funnel entre la landing et les
// fonctionnalités — on demande la connexion ICI plutôt que de laisser chaque
// carte rediriger séparément vers /login (compat/journal le font déjà, mais
// Nova/quiz non) : un seul mur de connexion, avant de choisir l'expérience.
export default async function DecouvertePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/decouverte');

  return <DecouverteClient />;
}
