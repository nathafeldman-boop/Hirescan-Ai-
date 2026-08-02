import { prisma } from './db';

// ── Séquence obligatoire avant le hub ────────────────────────────────────────
// Après le funnel de démarrage (onboarding + 1er Journal, voir funnelGate.ts),
// on ajoute un second palier, VOLONTAIREMENT séparé du premier : faire tester
// les 4 autres fonctionnalités principales — une vraie action sur chacune,
// pas juste une visite — avant de laisser entrer sur /decouverte. But :
// maximiser l'exposition aux fonctionnalités (donc à la conversion) avant que
// la personne ne "s'installe" dans le hub.
//
// Fichier et fonction À PART de funnelGate.ts, et SEUL /decouverte la
// consulte — ni /quetes, ni /quiz/personnalite, ni /chat, ni /parcours ne le
// font. Ce sont exactement les pages vers lesquelles cette séquence redirige :
// les faire se re-vérifier elles-mêmes provoquerait une redirection vers une
// page qui vous y renvoie aussitôt (voir l'incident du tour guidé précédent,
// où isTourPending() avait dû être gardée séparée de resolveFunnelStep pour
// la même raison).
//
// Progression : on avance vers /decouverte uniquement en y retournant (ex.
// bouton "Home" de la barre de navigation) une fois l'action faite — pas de
// redirection automatique enchaînée d'une étape à l'autre.
export type OnboardingSequenceStep = 'quetes' | 'mbti' | 'elio' | 'parcours';

// Ne s'applique qu'aux comptes créés à partir de ce moment — les comptes déjà
// actifs avant l'ajout de cette séquence ne doivent JAMAIS se retrouver
// bloqués hors de leur propre hub du jour au lendemain (ils ont pu ne jamais
// avoir touché Elio ou le Parcours et utiliser l'app depuis des semaines).
const SEQUENCE_ENFORCED_FROM = new Date('2026-08-02T00:00:00Z');

export async function resolveOnboardingSequenceStep(userId: string): Promise<OnboardingSequenceStep | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true, mbtiType: true } });
  if (!user || user.createdAt < SEQUENCE_ENFORCED_FROM) return null;

  const [questCompletions, dailyQuestDone, elioMessage, levelCompletion] = await Promise.all([
    prisma.questCompletion.findMany({ where: { userId }, select: { questKey: true } }),
    prisma.dailyQuestCompletion.findFirst({ where: { userId }, select: { id: true } }),
    prisma.chatMessage.findFirst({ where: { userId, role: 'user' }, select: { id: true } }),
    prisma.levelCompletion.findFirst({ where: { userId }, select: { id: true } }),
  ]);

  // onboarding_done et first_journal sont déjà acquis à ce stade du funnel
  // (voir funnelGate.ts) — ne comptent pas comme LA vraie action attendue ici.
  const hasRealQuest = questCompletions.some((c) => c.questKey !== 'onboarding_done' && c.questKey !== 'first_journal');
  if (!hasRealQuest && !dailyQuestDone) return 'quetes';
  if (!user.mbtiType) return 'mbti';
  if (!elioMessage) return 'elio';
  if (!levelCompletion) return 'parcours';
  return null;
}

export function onboardingSequencePath(step: OnboardingSequenceStep): string {
  switch (step) {
    case 'quetes': return '/quetes';
    case 'mbti': return '/quiz/personnalite';
    case 'elio': return '/chat';
    case 'parcours': return '/parcours';
  }
}
