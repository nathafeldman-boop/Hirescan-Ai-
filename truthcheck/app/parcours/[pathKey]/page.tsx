import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import { getPath } from '@/lib/paths';
import { isLevelUnlockedForTier, getCommittedPathKey } from '@/lib/pathAccess';
import { hasPaidAccess } from '@/lib/plans';
import { resolvePathLevelsForUser } from '@/lib/pathBranching';
import PathMapClient from './PathMapClient';

export async function generateMetadata({ params }: { params: { pathKey: string } }): Promise<Metadata> {
  const path = getPath(params.pathKey);
  return {
    title: path ? `${path.title} | Parcours UrCecret` : 'Parcours | UrCecret',
    robots: { index: false, follow: false },
  };
}

export default async function PathMapPage({ params }: { params: { pathKey: string } }) {
  const path = getPath(params.pathKey);
  if (!path) notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?callbackUrl=/parcours/${path.key}`);

  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep) redirect(funnelStepPath(pendingStep));

  const [user, completions, allCompletions, resolvedLevels] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { tier: true } }),
    prisma.levelCompletion.findMany({ where: { userId: session.user.id, pathKey: path.key }, select: { levelIndex: true } }),
    prisma.levelCompletion.findMany({ where: { userId: session.user.id }, select: { pathKey: true } }),
    // Titres/emoji résolus selon la branche de CE compte (voir
    // lib/pathBranching.ts) — un niveau encore verrouillé dans la séquence
    // garde son titre "À découvrir" tant que le diagnostic n'est pas répondu.
    resolvePathLevelsForUser(path.key, session.user.id),
  ]);

  const completedIndices = new Set(completions.map((c) => c.levelIndex));
  const highestCompletedIndex = completions.reduce((max, c) => Math.max(max, c.levelIndex), -1);

  const countByPath: Record<string, number> = {};
  for (const c of allCompletions) countByPath[c.pathKey] = (countByPath[c.pathKey] ?? 0) + 1;
  const committedPathKey = getCommittedPathKey(countByPath);
  // Un autre parcours a déjà "engagé" ce compte (voir PATH_COMMIT_THRESHOLD) :
  // celui-ci se verrouille entièrement, sauf abonnement payant — réutilise le
  // même badge/CTA "🔒 → /pricing" que le verrouillage par palier gratuit,
  // pas besoin d'un état visuel séparé.
  const otherPathLocked = !!committedPathKey && committedPathKey !== path.key && !hasPaidAccess(user?.tier ?? 'free');

  const levels = resolvedLevels.map((l) => {
    const completed = completedIndices.has(l.index);
    const isNext = l.index === highestCompletedIndex + 1;
    const subscriptionLocked = !completed && (otherPathLocked || !isLevelUnlockedForTier(user?.tier ?? 'free', l.index));
    const sequenceLocked = !completed && l.index > highestCompletedIndex + 1;
    return {
      index: l.index,
      title: l.title,
      emoji: l.emoji,
      completed,
      playable: !completed && isNext && !subscriptionLocked,
      subscriptionLocked,
      sequenceLocked,
    };
  });

  return (
    <PathMapClient
      pathKey={path.key}
      title={path.title}
      tagline={path.tagline}
      totalLevels={path.levels.length}
      doneCount={completedIndices.size}
      levels={levels}
    />
  );
}
