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
// Donc : CHAQUE point d'entrée réel de l'app (Hub, test MBTI, Journal, Elio,
// quête) revérifie l'état à chaque chargement plutôt que de faire confiance
// à un redirect ponctuel — "le système doit reprendre exactement où
// l'utilisateur s'est arrêté", jamais l'envoyer de force sur le MBTI.
export type FunnelStep = 'onboarding' | 'journal';

export async function resolveFunnelStep(userId: string): Promise<FunnelStep | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { onboardingCompletedAt: true } });
  if (!user) return null;
  if (!user.onboardingCompletedAt) return 'onboarding';

  const journalCount = await prisma.journalEntry.count({ where: { userId } });
  if (journalCount === 0) return 'journal';

  return null; // parcours de démarrage terminé — libre d'aller où il veut
}

export function funnelStepPath(step: FunnelStep): string {
  return step === 'onboarding' ? '/bienvenue' : '/journal';
}

// ── Visite guidée (après le 1er Journal, avant le hub) ──────────────────────
// Volontairement une fonction À PART de resolveFunnelStep/FunnelStep, jamais
// fusionnée dedans : celui-ci est réutilisé tel quel par /quiz/personnalite,
// /chat et /parcours/* — exactement les 3 pages vers lesquelles la visite
// guidée doit envoyer les gens. Si "tour" devenait un FunnelStep au même
// titre que "onboarding"/"journal", ces 3 pages redirigeraient IMMÉDIATEMENT
// vers /decouverte/tour dès qu'on les visite pendant la visite — boucle
// infinie. isTourPending n'est donc appelée QUE par les pages "récompense"
// (/decouverte, /quetes), jamais par les 3 pages de la visite elles-mêmes.
export async function isTourPending(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tourCompletedAt: true } });
  return !!user && !user.tourCompletedAt;
}
