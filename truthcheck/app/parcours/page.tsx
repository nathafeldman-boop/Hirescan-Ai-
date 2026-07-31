import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import { PATH_CATALOG } from '@/lib/paths';
import { ONBOARDING_GOALS } from '@/lib/onboardingFunnel';
import ParcoursHubClient from './ParcoursHubClient';

export const metadata: Metadata = {
  title: 'Parcours | UrCecret',
  robots: { index: false, follow: false },
};

// Hub des Parcours — un chemin de progression par objectif du questionnaire
// d'accueil (voir lib/onboardingFunnel.ts::ONBOARDING_GOALS). Un seul est
// construit pour l'instant ("Reprendre confiance en moi", voir lib/paths.ts),
// les 6 autres apparaissent "Bientôt disponible" plutôt que d'être cachés —
// pour que la promesse du questionnaire d'accueil reste visible même non
// tenue partout, et donner envie de revenir.
export default async function ParcoursPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/parcours');

  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep) redirect(funnelStepPath(pendingStep));

  const [user, completions] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, onboardingGoal: true } }),
    prisma.levelCompletion.findMany({ where: { userId: session.user.id }, select: { pathKey: true, levelIndex: true } }),
  ]);

  const doneCountByPath = new Map<string, number>();
  for (const c of completions) doneCountByPath.set(c.pathKey, (doneCountByPath.get(c.pathKey) ?? 0) + 1);

  const goals = ONBOARDING_GOALS.map((goal) => {
    const path = PATH_CATALOG.find((p) => p.onboardingGoal === goal);
    if (!path) return { goal, available: false as const };
    return {
      goal,
      available: true as const,
      key: path.key,
      title: path.title,
      tagline: path.tagline,
      emoji: path.emoji,
      totalLevels: path.levels.length,
      doneCount: doneCountByPath.get(path.key) ?? 0,
    };
  });

  return (
    <ParcoursHubClient
      firstName={user?.name?.split(' ')[0] ?? null}
      onboardingGoal={user?.onboardingGoal ?? null}
      goals={goals}
    />
  );
}
