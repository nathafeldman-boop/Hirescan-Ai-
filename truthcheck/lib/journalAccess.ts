// ── Accès aux fonctionnalités du Journal émotionnel ─────────────────────────
// Un seul endroit qui décrit qui a accès à quoi — un changement de règle
// (durée d'essai, quelle feature devient premium) se fait ICI, pas éparpillé
// dans les routes API. La SAISIE du jour (humeur/énergie/stress/note/photo)
// reste toujours gratuite : c'est l'ANALYSE (Elio + recul sur l'historique)
// qui a un palier.
//
//  - simpleReflection : 1 phrase déterministe après chaque entrée (gratuit,
//    toujours) — voir lib/journalReflection.ts.
//  - trendInsights     : tendances multi-jours détectées par Elio (IA).
//  - periodSummary     : résumé Elio d'une période (semaine/mois).
//  - history           : navigation du calendrier au-delà du mois en cours +
//                         meilleure/pire semaine, radar émotionnel, heatmap
//                         (tout ce qui demande plusieurs semaines de recul).
//
// Ces 3 débloqués pour :
//  - les abonnés payants (starter/plus/premium — voir lib/plans.ts) ;
//  - OU un nouveau compte encore dans sa période d'essai découverte.

import { hasPaidAccess } from './plans';

export const JOURNAL_TRIAL_DAYS = 7;

export interface JournalAccess {
  trendInsights: boolean;
  periodSummary: boolean;
  history: boolean;
  inTrial: boolean;
  trialDaysLeft: number; // 0 si hors essai (abonné ou essai expiré)
}

export function journalAccessFor(tier: string | undefined | null, accountCreatedAt: Date): JournalAccess {
  const daysSinceSignup = Math.floor((Date.now() - accountCreatedAt.getTime()) / (24 * 60 * 60 * 1000));
  const trialDaysLeft = Math.max(0, JOURNAL_TRIAL_DAYS - daysSinceSignup);
  const paid = hasPaidAccess(tier);
  const inTrial = !paid && trialDaysLeft > 0;
  const advanced = paid || inTrial;

  return {
    trendInsights: advanced,
    periodSummary: advanced,
    history: advanced,
    inTrial,
    trialDaysLeft: paid ? 0 : trialDaysLeft,
  };
}
