import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import QueteClient from './QueteClient';

export const metadata: Metadata = {
  title: 'Apprends à mieux te connaître | UrCecret',
  robots: { index: false, follow: false }, // étape applicative privée (compte requis)
};

// Écran intermédiaire entre la notification "Ton profil n'est pas encore
// complet 🛑" du Hub et le test lui-même — voir DecouverteClient.tsx. Cliquer
// sur la notification n'envoie plus directement au quiz : ça ouvre cette
// quête, qui pose l'intention ("apprends à mieux te connaître") avant l'action.
// Si le profil est déjà complet, plus rien à faire ici → retour au Hub.
export default async function QuetePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/quete');

  const [user, journalCount, compatCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, mbtiType: true } }),
    prisma.journalEntry.count({ where: { userId: session.user.id } }),
    prisma.compatibilityCheck.count({ where: { userId: session.user.id } }),
  ]);

  if (!user) redirect('/login');
  if (user.mbtiType) redirect('/decouverte');

  return (
    <QueteClient
      firstName={user.name?.split(' ')[0] ?? null}
      hasJournalEntry={journalCount > 0}
      hasCompat={compatCount > 0}
    />
  );
}
