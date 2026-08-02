// ── Accès & rythme du Parcours ───────────────────────────────────────────────
// Aucun compteur mutable (énergie restante, série, XP total) n'est stocké sur
// User ou ailleurs : tout se recalcule ici à partir des lignes LevelCompletion
// déjà écrites — même philosophie que le streak du Journal
// (lib/journalStats.ts::computeStreak) et QuestCompletion comme source unique
// de vérité pour les quêtes.
import { hasPaidAccess } from './plans';

// Les 10 premiers niveaux de CHAQUE parcours sont gratuits — assez pour
// installer l'habitude et laisser sentir la mécanique avant de payer (voir
// lib/plans.ts pour la grille de paliers existante ; aucun nouveau SKU créé
// pour le Parcours, il vient enrichir starter/plus/premium).
export const FREE_LEVEL_LIMIT = 10;

// "Énergie" quotidienne = nombre de niveaux complétables par jour, tous
// parcours confondus. Sert à étaler la progression dans le temps (une
// habitude se construit sur plusieurs jours, pas en une seule session) plutôt
// qu'à punir un échec — il n'y a jamais d'échec possible sur ces exercices.
const DAILY_ENERGY: Record<string, number> = {
  free: 3,
  unlocked: 3,
  starter: 6,
  plus: 10,
  premium: 999,
};

export function dailyEnergyFor(tier: string | null | undefined): number {
  return DAILY_ENERGY[tier ?? 'free'] ?? DAILY_ENERGY.free;
}

export function isLevelUnlockedForTier(tier: string | null | undefined, levelIndex: number): boolean {
  return levelIndex < FREE_LEVEL_LIMIT || hasPaidAccess(tier);
}

// Au-delà de ce nombre de niveaux complétés dans UN parcours, ce parcours
// devient "le sien" et les 6 autres se verrouillent (voir getCommittedPathKey)
// — évite qu'un compte gratuit picore 10 niveaux gratuits dans chacun des 7
// parcours (70 niveaux gratuits au lieu de 10) : au 3e niveau, il faut choisir.
export const PATH_COMMIT_THRESHOLD = 2;

// Premier parcours dans lequel le compte a dépassé PATH_COMMIT_THRESHOLD
// niveaux complétés — celui-ci reste jouable, tous les autres se verrouillent
// (sauf abonnement payant, qui débloque tout comme avant). `null` tant
// qu'aucun parcours n'a été assez entamé pour "engager" le compte.
export function getCommittedPathKey(completionCountByPath: Record<string, number>): string | null {
  for (const [key, count] of Object.entries(completionCountByPath)) {
    if (count > PATH_COMMIT_THRESHOLD) return key;
  }
  return null;
}

export type AccessDenialReason = 'locked_sequence' | 'requires_subscription' | 'energy_exhausted' | 'other_path_locked';

export interface AccessCheckInput {
  tier: string | null | undefined;
  pathKey: string;
  committedPathKey: string | null; // résultat de getCommittedPathKey pour ce compte
  levelIndex: number;
  highestCompletedIndex: number; // -1 si aucun niveau complété sur ce parcours
  completionsToday: number; // tous parcours confondus, jour Paris courant
  alreadyCompletedThisLevel: boolean;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: AccessDenialReason;
}

// Un niveau déjà complété reste toujours consultable/rejouable (jamais
// bloqué par l'énergie, la séquence ou l'engagement sur un autre parcours) —
// seule une PREMIÈRE complétion est gardée par ces règles.
export function canCompleteLevel(input: AccessCheckInput): AccessCheckResult {
  if (input.alreadyCompletedThisLevel) return { allowed: true };
  if (input.committedPathKey && input.committedPathKey !== input.pathKey && !hasPaidAccess(input.tier)) {
    return { allowed: false, reason: 'other_path_locked' };
  }
  if (input.levelIndex > input.highestCompletedIndex + 1) return { allowed: false, reason: 'locked_sequence' };
  if (!isLevelUnlockedForTier(input.tier, input.levelIndex)) return { allowed: false, reason: 'requires_subscription' };
  if (input.completionsToday >= dailyEnergyFor(input.tier)) return { allowed: false, reason: 'energy_exhausted' };
  return { allowed: true };
}

// Série de jours consécutifs avec au moins un niveau complété, en remontant
// depuis aujourd'hui (ou hier si aujourd'hui n'est pas encore rempli — même
// convention que le Journal : la série n'est pas cassée tant que la journée
// n'est pas terminée).
export function computePathStreak(completionDays: string[], today: string): number {
  const days = new Set(completionDays);
  const addDays = (day: string, delta: number) => {
    const d = new Date(day + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    return d.toISOString().slice(0, 10);
  };
  let cursor = days.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
