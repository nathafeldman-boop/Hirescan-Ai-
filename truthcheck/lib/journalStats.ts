// ── Statistiques déterministes du Journal ───────────────────────────────────
// Tout ce qui peut se calculer à partir des données brutes (pas besoin de
// Nova/IA) : série, moyenne, évolution, meilleure/pire semaine, fréquence des
// tags. Gratuit pour tous — voir lib/journalAccess.ts pour ce qui, lui, reste
// réservé (tendances/résumés générés par IA). Fonctions pures, testables,
// importables côté client comme serveur.

import { JOURNAL_TAGS } from './journalTags';

// Formulations naturelles par tag, pour transformer une corrélation brute en
// phrase qui sonne humain — voir tagCorrelationInsight() plus bas.
const TAG_PHRASES: Record<string, string> = {
  travail: 'après avoir travaillé',
  amour: 'en amour',
  famille: 'en famille',
  ecole: "après l'école",
  amis: 'après avoir vu tes amis',
  sommeil: 'après une bonne nuit de sommeil',
  sport: 'après le sport',
};

export interface StatsEntry {
  day: string; // "YYYY-MM-DD"
  mood: number;
  energy: number;
  stress: number;
  tags?: string[] | null;
}

function dayToDate(day: string): Date {
  return new Date(day + 'T12:00:00');
}

function addDays(day: string, delta: number): string {
  const d = dayToDate(day);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

// Série actuelle : jours consécutifs remplis en remontant depuis aujourd'hui
// (ou hier, si aujourd'hui n'est pas encore rempli — la série n'est pas
// "cassée" tant que la journée n'est pas terminée).
export function computeStreak(entries: StatsEntry[], today: string): number {
  const days = new Set(entries.map((e) => e.day));
  let cursor = days.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// "Bonheur moyen" sur 10 (mood est sur 5) — arrondi à 1 décimale.
export function averageMoodOutOf10(entries: StatsEntry[]): number | null {
  if (entries.length === 0) return null;
  const avg = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
  return Math.round(avg * 2 * 10) / 10;
}

// Évolution : moyenne des 7 dernières entrées vs les 7 précédentes, en %.
// Null si pas assez d'historique pour que ce soit honnête (< 6 entrées).
export function moodEvolutionPct(entries: StatsEntry[]): number | null {
  if (entries.length < 6) return null;
  const sorted = [...entries].sort((a, b) => (a.day < b.day ? -1 : 1));
  const recent = sorted.slice(-7);
  const prior = sorted.slice(-14, -7);
  if (prior.length === 0) return null;
  const avg = (list: StatsEntry[]) => list.reduce((s, e) => s + e.mood, 0) / list.length;
  const recentAvg = avg(recent);
  const priorAvg = avg(prior);
  if (priorAvg === 0) return null;
  return Math.round(((recentAvg - priorAvg) / priorAvg) * 100);
}

// ISO week key "2026-W30" — pour grouper par semaine sans dépendance externe.
function isoWeekKey(day: string): string {
  const d = dayToDate(day);
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const week = 1 + Math.round(((target.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
  return `${target.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export interface WeekStat { week: string; avgMood: number; count: number }

export function bestAndWorstWeek(entries: StatsEntry[]): { best: WeekStat | null; worst: WeekStat | null } {
  if (entries.length === 0) return { best: null, worst: null };
  const byWeek = new Map<string, number[]>();
  for (const e of entries) {
    const key = isoWeekKey(e.day);
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(e.mood);
  }
  const weeks: WeekStat[] = [...byWeek.entries()].map(([week, moods]) => ({
    week,
    avgMood: Math.round((moods.reduce((s, m) => s + m, 0) / moods.length) * 10) / 10,
    count: moods.length,
  }));
  if (weeks.length === 0) return { best: null, worst: null };
  const sorted = [...weeks].sort((a, b) => b.avgMood - a.avgMood);
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}

// Fréquence des tags, normalisée 0-1 (pour le radar) — un axe par tag connu,
// même à 0, pour que la forme du radar reste comparable dans le temps.
export function tagFrequency(entries: StatsEntry[]): { key: string; label: string; emoji: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    for (const t of e.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const max = Math.max(1, ...counts.values());
  return JOURNAL_TAGS.map((t) => ({ key: t.key, label: t.label, emoji: t.emoji, value: (counts.get(t.key) ?? 0) / max }));
}

// Corrélation simple humeur/tag — 100% déterministe (pas d'IA). Repère un tag
// dont les jours associés ont une humeur nettement au-dessus de la moyenne
// des jours SANS ce tag, avec assez de données pour que ce soit honnête.
// Exemple type : "Tes meilleures journées arrivent souvent après avoir vu tes amis."
export function tagCorrelationInsight(entries: StatsEntry[]): string | null {
  const MIN_WITH_TAG = 3;
  const MIN_WITHOUT_TAG = 3;
  const MIN_DELTA = 0.6; // sur une échelle de 5

  let best: { tag: string; delta: number } | null = null;
  for (const tag of JOURNAL_TAGS) {
    const withTag = entries.filter((e) => e.tags?.includes(tag.key));
    const withoutTag = entries.filter((e) => !e.tags?.includes(tag.key));
    if (withTag.length < MIN_WITH_TAG || withoutTag.length < MIN_WITHOUT_TAG) continue;

    const avg = (list: StatsEntry[]) => list.reduce((s, e) => s + e.mood, 0) / list.length;
    const delta = avg(withTag) - avg(withoutTag);
    if (delta >= MIN_DELTA && (!best || delta > best.delta)) best = { tag: tag.key, delta };
  }

  if (!best) return null;
  const phrase = TAG_PHRASES[best.tag] ?? best.tag;
  return `Tes meilleures journées arrivent souvent ${phrase}.`;
}
