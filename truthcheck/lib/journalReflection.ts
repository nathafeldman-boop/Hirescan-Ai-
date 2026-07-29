// ── Réflexion de Elio après chaque entrée du journal ─────────────────────────
// Volontairement DÉTERMINISTE (pas d'appel Mistral) : c'est le moment qui doit
// être INSTANTANÉ (pas de "Elio réfléchit…" après avoir tapé "Enregistrer") —
// et c'est la partie "premières analyses simples" du palier gratuit, voir
// lib/journalAccess.ts pour la partie IA (tendances/résumés), elle réservée
// aux abonnés/essai. Fonctions pures, importables côté client comme serveur.

export interface ReflectionEntry { mood: number; energy: number; stress: number }

export function simpleReflection(mood: number, energy: number, stress: number): string {
  if (mood >= 4 && stress <= 2) return 'Belle journée — savoure-la, elle compte.';
  if (mood >= 4) return 'Une bonne journée, même avec un peu de tension. Bien joué.';
  if (mood === 3 && energy <= 2) return 'Journée correcte mais fatigante. Pense à souffler un peu.';
  if (mood === 3) return 'Une journée dans la moyenne — rien à forcer, continue comme ça.';
  if (mood <= 2 && stress >= 4) return 'Journée difficile et sous tension. Sois indulgent avec toi-même ce soir.';
  if (mood <= 2) return "Journée difficile. C'est noté — demain est un autre jour.";
  return 'Journée notée. Reviens demain pour continuer ton suivi.';
}

// Comparaison au jour précédent — la "réponse magnifique" attendue juste après
// l'enregistrement. Retourne null si la veille n'a pas d'entrée ou si rien de
// notable ne ressort (le fallback simpleReflection() prend alors le relais).
export function compareToYesterday(today: ReflectionEntry, yesterday: ReflectionEntry | null): string | null {
  if (!yesterday) return null;

  const moodDelta = today.mood - yesterday.mood;
  const stressDelta = today.stress - yesterday.stress;
  const energyDelta = today.energy - yesterday.energy;

  if (stressDelta <= -2) return 'Tu sembles beaucoup plus serein aujourd\'hui qu\'hier.';
  if (moodDelta >= 2) return 'Ton humeur a nettement remonté par rapport à hier — bien joué.';
  if (energyDelta >= 2) return 'Ton énergie a fait un vrai bond depuis hier.';
  if (stressDelta >= 2) return 'Tu sembles plus tendu qu\'hier — prends un moment pour toi.';
  if (moodDelta <= -2) return 'Journée plus difficile qu\'hier. Ça arrive, sois indulgent avec toi-même.';
  if (energyDelta <= -2) return 'Ton énergie est nettement plus basse qu\'hier.';

  return null;
}

export function dailyReaction(today: ReflectionEntry, yesterday: ReflectionEntry | null): string {
  return compareToYesterday(today, yesterday) ?? simpleReflection(today.mood, today.energy, today.stress);
}
