// ── Réflexion simple, gratuite, après chaque entrée du journal ──────────────
// Volontairement DÉTERMINISTE (pas d'appel Mistral) : c'est la partie
// "premières analyses simples" du palier gratuit — voir lib/journalAccess.ts
// pour la partie IA (tendances/résumés), elle réservée aux abonnés/essai.
// Fonction pure, importable côté client comme serveur.

export function simpleReflection(mood: number, energy: number, stress: number): string {
  if (mood >= 4 && stress <= 2) return 'Belle journée — savoure-la, elle compte.';
  if (mood >= 4) return 'Une bonne journée, même avec un peu de tension. Bien joué.';
  if (mood === 3 && energy <= 2) return 'Journée correcte mais fatigante. Pense à souffler un peu.';
  if (mood === 3) return 'Une journée dans la moyenne — rien à forcer, continue comme ça.';
  if (mood <= 2 && stress >= 4) return 'Journée difficile et sous tension. Sois indulgent avec toi-même ce soir.';
  if (mood <= 2) return "Journée difficile. C'est noté — demain est un autre jour.";
  return 'Journée notée. Reviens demain pour continuer ton suivi.';
}
