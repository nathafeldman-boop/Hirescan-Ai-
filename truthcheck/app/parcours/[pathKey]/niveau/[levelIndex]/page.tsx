import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parisDay } from '@/lib/chat';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import { getPath, getLevel } from '@/lib/paths';
import { canCompleteLevel, dailyEnergyFor, getCommittedPathKey } from '@/lib/pathAccess';
import { resolveLevelForUser } from '@/lib/pathBranching';
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

  const [user, pathCompletions, allCompletions, todayCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { tier: true } }),
    prisma.levelCompletion.findMany({ where: { userId: session.user.id, pathKey: path.key }, select: { levelIndex: true, answer: true, insight: true, xpEarned: true } }),
    prisma.levelCompletion.findMany({ where: { userId: session.user.id }, select: { pathKey: true } }),
    prisma.levelCompletion.count({ where: { userId: session.user.id, day: parisDay() } }),
  ]);

  const existing = pathCompletions.find((c) => c.levelIndex === levelIndex);
  const highestCompletedIndex = pathCompletions.reduce((max, c) => Math.max(max, c.levelIndex), -1);
  const countByPath: Record<string, number> = {};
  for (const c of allCompletions) countByPath[c.pathKey] = (countByPath[c.pathKey] ?? 0) + 1;

  const access = canCompleteLevel({
    tier: user?.tier ?? 'free',
    pathKey: path.key,
    committedPathKey: getCommittedPathKey(countByPath),
    levelIndex,
    highestCompletedIndex,
    completionsToday: todayCount,
    alreadyCompletedThisLevel: !!existing,
  });

  // Pas encore atteint dans l'ordre, réservé aux abonnés, ou un AUTRE
  // parcours a déjà "engagé" ce compte : rien d'utile à montrer ici, on
  // renvoie vers l'endroit qui explique pourquoi (carte ou pricing) plutôt
  // que d'afficher un niveau inaccessible.
  if (!access.allowed && access.reason === 'locked_sequence') redirect(`/parcours/${path.key}`);
  if (!access.allowed && access.reason === 'requires_subscription') redirect('/pricing');
  if (!access.allowed && access.reason === 'other_path_locked') redirect('/pricing');

  // Contenu réel de ce niveau pour CE compte — identique au niveau statique
  // sauf si `branch` est défini (voir lib/pathBranching.ts) : dans ce cas,
  // le vrai texte dépend de la réponse donnée au niveau diagnostic.
  const resolvedLevel = (await resolveLevelForUser(path.key, levelIndex, session.user.id)) ?? level;

  let recall: { title: string; answer: string } | null = null;
  if (resolvedLevel.content.type === 'reflexion' && resolvedLevel.content.recallLevelIndex !== undefined) {
    const recallIdx = resolvedLevel.content.recallLevelIndex;
    const recallCompletion = pathCompletions.find((c) => c.levelIndex === recallIdx);
    const recallLevel = getLevel(path.key, recallIdx);
    if (recallCompletion?.answer && recallLevel) {
      recall = { title: recallLevel.title, answer: recallCompletion.answer };
    }
  }

  return (
    <LevelPlayerClient
      pathKey={path.key}
      level={resolvedLevel}
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
