import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolveFunnelStep, funnelStepPath, isTourPending } from '@/lib/funnelGate';
import { getPathForGoal } from '@/lib/paths';
import TourClient from './TourClient';

export const metadata: Metadata = {
  title: 'Découvre UrCecret | UrCecret',
  robots: { index: false, follow: false },
};

// ── Visite guidée : juste après le 1er Journal, avant le hub /decouverte ──
// But produit (demande explicite) : personne n'atteint le hub sans avoir déjà
// essayé Elio, le test MBTI et le Parcours — voir lib/funnelGate.ts. Chaque
// bouton pointe vers la vraie page de la fonctionnalité (rien de dupliqué ici,
// aucune de ces 3 pages n'est modifiée) ; "essayé" est recalculé à chaque
// chargement à partir de vraies données (comme le reste de l'app, jamais un
// flag posé à la main) — donc revenir ici après avoir testé une fonctionnalité
// montre automatiquement les choix restants.
export default async function TourPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/decouverte/tour');

  // Même garde que /decouverte : onboarding + 1er Journal d'abord.
  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep) redirect(funnelStepPath(pendingStep));

  // Déjà fait la visite — jamais la réafficher.
  if (!(await isTourPending(session.user.id))) redirect('/decouverte');

  const [user, chatCount, levelCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, mbtiType: true, onboardingGoal: true } }),
    prisma.chatMessage.count({ where: { userId: session.user.id, role: 'user' } }),
    prisma.levelCompletion.count({ where: { userId: session.user.id } }),
  ]);

  const hasMbti = !!user?.mbtiType;
  const hasChat = chatCount > 0;
  const hasParcours = levelCount > 0;

  const matchedPath = getPathForGoal(user?.onboardingGoal);
  const parcoursHref = matchedPath ? `/parcours/${matchedPath.key}` : '/parcours';

  return (
    <TourClient
      firstName={user?.name?.split(' ')[0] ?? null}
      hasMbti={hasMbti}
      hasChat={hasChat}
      hasParcours={hasParcours}
      parcoursHref={parcoursHref}
    />
  );
}
