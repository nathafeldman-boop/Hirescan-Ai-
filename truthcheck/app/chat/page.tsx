import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import ChatClient from './ChatClient';

export const metadata: Metadata = {
  title: 'Assistant personnalité — Chatbot IA | UrCecret',
  description: 'Discute avec l\'assistant IA UrCecret pour mieux comprendre ta personnalité, ton type MBTI et tes fonctions cognitives.',
  alternates: { canonical: 'https://urcecret.site/chat' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

export default async function ChatPage() {
  // Pas de mur de connexion ici — ChatClient gère elle-même son propre écran
  // de connexion (voir la branche !session?.user). On ne fait que rediriger
  // les comptes DÉJÀ connectés mais dont le parcours de démarrage n'est pas
  // terminé — voir lib/funnelGate.ts.
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    const pendingStep = await resolveFunnelStep(session.user.id);
    if (pendingStep) redirect(funnelStepPath(pendingStep));
  }

  return <ChatClient />;
}
