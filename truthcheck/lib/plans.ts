// ── Abonnements UrCecret ─────────────────────────────────────────────────────
// Un seul endroit qui décrit les paliers.
//
//  - free     : gratuit — test MBTI + Nova découverte (5 messages PAR MOIS)
//  - unlocked : 1,99€ UNE FOIS (pas un abonnement) → juste le résultat MBTI
//               débloqué à vie. PAS de Nova personnalisée (sinon un achat à
//               1,99€ vaudrait autant qu'un abonnement — voir historique :
//               c'était exactement le bug corrigé en introduisant Starter).
//  - starter  : abonnement 1,99€/mois → profil MBTI débloqué + Nova (5 msg/jour)
//  - plus     : abonnement 5€/mois → MBTI débloqué + Coach IA (30 messages/jour)
//  - premium  : abonnements 9,99€/mois ou 29,99€/an → MBTI débloqué + Coach (50/jour)
//
// Les IDs de prix Stripe ne sont PAS secrets (ils apparaissent côté client dans
// n'importe quelle intégration Stripe), mais restent surchargables par variable
// d'environnement si besoin.

export const PLUS_PRICE_ID = process.env.STRIPE_PLUS_PRICE_ID || 'price_1TuIYlRd6r34OMU6YitKmqi6';

// Abonnement Starter 1,99€/mois (produit prod_UvbsvlC5t2TyBX).
export const STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID || 'price_1TvkeeRd6r34OMU670sEzLfb';

// Rang de chaque palier — sert à ne jamais RÉTROGRADER un utilisateur (ex: un
// abonné Plus qui rachète le 1,99€ one-shot par erreur reste 'plus', il ne
// redescend pas en 'unlocked'). Voir webhook + /success.
export const TIER_RANK: Record<string, number> = { free: 0, unlocked: 1, starter: 2, plus: 3, premium: 4 };

// Un abonné "plus" (5€) OU "premium" (10€) a accès au contenu MBTI payant.
export function hasPremiumAccess(tier?: string | null): boolean {
  return tier === 'plus' || tier === 'premium';
}

// Nova personnalisée : réservée aux ABONNEMENTS (starter/plus/premium). Un
// déblocage ponctuel ('unlocked', 1,99€ one-shot) n'y donne PAS accès.
export function hasPaidAccess(tier?: string | null): boolean {
  return tier === 'starter' || tier === 'plus' || tier === 'premium';
}

// Accès au PROFIL MBTI complet (résultat, 16 types, célébrités…) : tout
// abonné payant, OU un déblocage ponctuel 'unlocked'. Plus large que
// hasPaidAccess — c'est justement ce qui distingue "voir mon résultat" de
// "avoir Nova".
export function hasProfileAccess(tier?: string | null): boolean {
  return tier === 'unlocked' || hasPaidAccess(tier);
}
