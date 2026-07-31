import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parisDay } from '@/lib/chat';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import { getPath, getLevel } from '@/lib/paths';
import { canCompleteLevel, dailyEnergyFor } from '@/lib/pathAccess';
import LevelPlayerClient from './LevelPlayerClient';

export const metadata: Metadata = {
  title: 'Parcours | UrCecret',
  robots: { index: false, follow: false },
};

export default async function LevelPage({ params }: { params: { pathKey: string; levelIndex: string } }) {
  const path = getPath(params.pathKey);
  const levelIndex = Number(params.levelIndex);
  const level = path ? getLevel(path.key, levelIndex) : undefined;
  if (!path || !level) notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?callbackUrl=/parcours/${path.key}/niveau/${levelIndex}`);

  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep) redirect(funnelStepPath(pendingStep));

  const [user, pathCompletions, todayCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { tier: true } }),
    prisma.levelCompletion.findMany({ where: { userId: session.user.id, pathKey: path.key }, select: { levelIndex: true, answer: true, insight: true, xpEarned: true } }),
    prisma.levelCompletion.count({ where: { userId: session.user.id, day: parisDay() } }),
  ]);

  const existing = pathCompletions.find((c) => c.levelIndex === levelIndex);
  const highestCompletedIndex = pathCompletions.reduce((max, c) => Math.max(max, c.levelIndex), -1);

  const access = canCompleteLevel({
    tier: user?.tier ?? 'free',
    levelIndex,
    highestCompletedIndex,
    completionsToday: todayCount,
    alreadyCompletedThisLevel: !!existing,
  });

  // Pas encore atteint dans l'ordre, ou réservé aux abonnés : rien d'utile à
  // montrer ici, on renvoie vers l'endroit qui explique pourquoi (carte ou
  // pricing) plutôt que d'afficher un niveau inaccessible.
  if (!access.allowed && access.reason === 'locked_sequence') redirect(`/parcours/${path.key}`);
  if (!access.allowed && access.reason === 'requires_subscription') redirect('/pricing');

  let recall: { title: string; answer: string } | null = null;
  if (level.content.type === 'reflexion' && level.content.recallLevelIndex !== undefined) {
    const recallIdx = level.content.recallLevelIndex;
    const recallCompletion = pathCompletions.find((c) => c.levelIndex === recallIdx);
    const recallLevel = getLevel(path.key, recallIdx);
    if (recallCompletion?.answer && recallLevel) {
      recall = { title: recallLevel.title, answer: recallCompletion.answer };
    }
  }

  return (
    <LevelPlayerClient
      pathKey={path.key}
      level={level}
      totalLevels={path.levels.length}
      alreadyCompleted={!!existing}
      existingAnswer={existing?.answer ?? null}
      existingInsight={existing?.insight ?? null}
      recall={recall}
      energyExhausted={!access.allowed && access.reason === 'energy_exhausted'}
      energyCap={dailyEnergyFor(user?.tier ?? 'free')}
    />
  );
}
