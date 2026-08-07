import { prisma } from './db';

// ── Garde-fou du funnel de démarrage ─────────────────────────────────────────
// Le redirect "automatique" au moment de l'inscription (pages.newUser dans
// lib/auth.ts, resolvePostAuthDestination pour le flux OTP) ne suffit pas à
// lui seul : NextAuth ne le déclenche que sur un signup VRAIMENT neuf (voir
// node_modules/next-auth/core/lib/callback-handler.js — un cookie de session
// déjà présent, un compte lié après coup, etc. font passer isNewUser à false
// et sautent complètement ce redirect). Un utilisateur peut aussi
// abandonner le questionnaire ou le premier Journal en cours de route, ou
// revenir des mois plus tard sur un vieux lien.
//
// Donc : CHAQUE point d'entrée réel de l'app (Hub, Journal, Elio, quête,
// parcours) revérifie l'état à chaque chargement plutôt que de faire
// confiance à un redirect ponctuel — "le système doit reprendre exactement
// où l'utilisateur s'est arrêté".
//
// Ordre du parcours de démarrage, décision du 07/08 (test réel du funnel
// par le fondateur) : onboarding -> test MBTI -> paywall (payant ou
// "continuer gratuitement") -> Journal -> libre. Avant cette date c'était
// onboarding -> Journal directement, et le test MBTI était volontairement
// EXCLU de ce garde-fou ("jamais l'envoyer de force sur le MBTI") — ça
// contredisait maintenant tout le travail fait ce soir pour justement en
// faire la première étape, d'où ce step 'mbti' ajouté entre les deux.
export type FunnelStep = 'onboarding' | 'mbti' | 'journal';

export async function resolveFunnelStep(userId: string): Promise<FunnelStep | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { onboardingCompletedAt: true, mbtiType: true } });
  if (!user) return null;
  if (!user.onboardingCompletedAt) return 'onboarding';

  // Le test MBTI n'est exigé QUE tant qu'aucune entrée de Journal n'existe —
  // jamais rétroactivement sur un compte déjà engagé (des mois d'historique
  // de Journal, jamais fait le test car il n'était pas encore obligatoire à
  // l'époque). Sans ce garde, resolveFunnelStep aurait bloqué CHAQUE
  // utilisateur existant sans mbtiType sur toutes les pages qui l'appellent
  // (Hub, Elio, quêtes, parcours), pas seulement les nouveaux inscrits.
  const journalCount = await prisma.journalEntry.count({ where: { userId } });
  if (journalCount === 0) {
    if (!user.mbtiType) return 'mbti';
    return 'journal';
  }

  return null; // parcours de démarrage terminé — libre d'aller où il veut
}

export function funnelStepPath(step: FunnelStep): string {
  if (step === 'onboarding') return '/bienvenue';
  if (step === 'mbti') return '/quiz/personnalite';
  return '/journal';
}
