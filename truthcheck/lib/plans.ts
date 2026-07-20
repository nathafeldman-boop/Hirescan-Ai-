// ── Abonnements UrCecret ─────────────────────────────────────────────────────
// Un seul endroit qui décrit les paliers payants.
//
//  - free    : gratuit (test MBTI seulement ; PAS d'accès au Coach IA)
//  - plus    : abonnement 5€/mois → MBTI débloqué + Coach IA (30 messages/jour)
//  - premium : abonnements 9,99€/mois ou 29,99€/an → MBTI débloqué + Coach (50/jour)
//
// Les IDs de prix Stripe ne sont PAS secrets (ils apparaissent côté client dans
// n'importe quelle intégration Stripe), mais restent surchargables par variable
// d'environnement si besoin.

export const PLUS_PRICE_ID = process.env.STRIPE_PLUS_PRICE_ID || 'price_1TuIYlRd6r34OMU6YitKmqi6';

// Un abonné "plus" (5€) OU "premium" (10€) a accès au contenu MBTI payant.
export function hasPremiumAccess(tier?: string | null): boolean {
  return tier === 'plus' || tier === 'premium';
}
