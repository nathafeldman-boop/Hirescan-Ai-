// ── Funnel d'accueil (page /bienvenue) ──────────────────────────────────────
// Options partagées entre le formulaire (BienvenueClient) et la validation
// serveur (POST /api/onboarding) — une seule liste, jamais deux qui divergent.

export const AGE_RANGES = ['-18', '18-24', '25-34', '35-44', '45+'] as const;

export const GENDERS = ['Femme', 'Homme', 'Autre', 'Je préfère ne pas dire'] as const;

// Ce qui a amené la personne aujourd'hui — distinct de ONBOARDING_GOALS
// (l'objectif de fond, "pourquoi dans la vie") : ici c'est "qu'est-ce qui
// t'a attiré dans l'appli maintenant", pensé pour le trafic publicitaire à
// intention précise (ex. Google Ads sur "test MBTI") qui veut une réponse
// immédiate sur ce qu'il va trouver. Purement déclaratif (comme le reste de
// /bienvenue) : sert à rassurer tout de suite ("encore quelques étapes et
// tu y es"), pas encore injecté dans les prompts d'Elio.
export const ONBOARDING_INTERESTS = [
  'Mon test de personnalité (MBTI)',
  'Un coach IA qui me comprend',
  'Comparer ma compatibilité avec mes proches',
  'Suivre mes émotions au quotidien',
  'Un accompagnement pour progresser',
] as const;

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
