// ── Funnel d'accueil (page /bienvenue) ──────────────────────────────────────
// Options partagées entre le formulaire (BienvenueClient) et la validation
// serveur (POST /api/onboarding) — une seule liste, jamais deux qui divergent.

export const AGE_RANGES = ['-18', '18-24', '25-34', '35-44', '45+'] as const;

export const GENDERS = ['Femme', 'Homme', 'Autre', 'Je préfère ne pas dire'] as const;

// Objectif principal — UNE seule question, choix unique (pas de "raison" +
// "focus" séparés : ça allongeait le questionnaire pour un gain marginal).
export const ONBOARDING_GOALS = [
  'Mieux me comprendre',
  'Reprendre confiance en moi',
  'Gérer mon stress',
  'Mieux comprendre mes émotions',
  'Améliorer mes relations',
  'Retrouver de la motivation',
  'Apprendre à mieux me connaître',
] as const;

// ── Où envoyer quelqu'un juste après une connexion réussie ──────────────────
// Utilisé par app/api/auth/verify-code/route.ts (l'équivalent "OTP email" du
// magic-link NextAuth). Le flux Google/magic-link natif, lui, passe par
// `pages.newUser` dans lib/auth.ts — NextAuth gère déjà ce cas nativement,
// pas besoin de dupliquer cette logique là-bas.
//
// Règle : on ne redirige vers l'accueil-questionnaire QUE si la destination
// demandée est un point d'entrée du funnel principal (test/hub/chat/journal
// ou racine) — jamais si elle pointe vers un funnel indépendant (ex. les
// résultats d'un quiz relationnel type /quiz/vrais-amis/results), sous peine
// de détourner un utilisateur qui voulait juste voir SES résultats.
const MAIN_FUNNEL_ENTRY_POINTS = new Set(['/', '/quiz/personnalite', '/decouverte', '/chat', '/journal']);

export function resolvePostAuthDestination(needsOnboarding: boolean, requestedPath: string | null | undefined): string {
  const pathOnly = (requestedPath ?? '/').split('?')[0];
  if (needsOnboarding && MAIN_FUNNEL_ENTRY_POINTS.has(pathOnly)) return '/bienvenue';
  return requestedPath && requestedPath.length > 0 ? requestedPath : '/decouverte';
}
