import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { journalAccessFor } from '@/lib/journalAccess';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import JournalClient from './JournalClient';

export const metadata: Metadata = {
  title: 'Journal émotionnel | UrCecret',
  description: 'Suis tes émotions au quotidien et découvre tes tendances grâce à l\'IA.',
  alternates: { canonical: 'https://urcecret.site/journal' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

export default async function JournalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, tier: true, createdAt: true, wantsDailyReminder: true, onboardingCompletedAt: true, onboardingGoal: true },
  });

  if (!user) redirect('/login');
  // Le Journal EST l'étape "journal" du funnel — mais si une étape d'avant
  // n'a jamais été faite (lien direct, reconnexion après abandon en cours de
  // route…), on ne laisse jamais quelqu'un la sauter. 'journal' est exclu
  // exprès : c'est l'étape que cette page sert elle-même (même raison que le
  // même exclude sur /quiz/personnalite) — voir lib/funnelGate.ts pour
  // l'ordre complet (onboarding -> test MBTI -> Journal).
  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep && pendingStep !== 'journal') redirect(funnelStepPath(pendingStep));

  const access = journalAccessFor(user.tier, user.createdAt);

  return (
    <JournalClient
      firstName={user.name?.split(' ')[0] ?? null}
      onboardingGoal={user.onboardingGoal}
      access={{ trendInsights: access.trendInsights, history: access.history, inTrial: access.inTrial, trialDaysLeft: access.trialDaysLeft }}
      wantsDailyReminder={user.wantsDailyReminder}
    />
  );
}
