// Échelles partagées du Journal (humeur/énergie/stress/émotion) — un seul
// endroit pour ces constantes, réutilisées par la page principale, la fiche
// de détail d'une journée et la timeline.

export const MOODS = [
  { value: 1, emoji: '😞', label: 'Difficile' },
  { value: 2, emoji: '😕', label: 'Pas top' },
  { value: 3, emoji: '😐', label: 'Neutre' },
  { value: 4, emoji: '🙂', label: 'Bien' },
  { value: 5, emoji: '😄', label: 'Super' },
] as const;

export const ENERGY_LEVELS = [
  { value: 1, emoji: '🥱', label: 'Épuisé' },
  { value: 2, emoji: '😴', label: 'Faible' },
  { value: 3, emoji: '🙂', label: 'Correcte' },
  { value: 4, emoji: '💪', label: 'Bonne' },
  { value: 5, emoji: '⚡', label: 'Au top' },
] as const;

export const STRESS_LEVELS = [
  { value: 1, emoji: '😌', label: 'Zen' },
  { value: 2, emoji: '🙂', label: 'Calme' },
  { value: 3, emoji: '😐', label: 'Neutre' },
  { value: 4, emoji: '😬', label: 'Tendu' },
  { value: 5, emoji: '🤯', label: 'Sous tension' },
] as const;

export const EMOTIONS = ['😊 Joie', '😌 Sérénité', '🙏 Gratitude', '🥰 Amour', '😲 Surprise', '😠 Colère', '😢 Tristesse', '😰 Anxiété'] as const;

export function moodEmoji(mood: number): string {
  return MOODS.find((m) => m.value === mood)?.emoji ?? '·';
}

// Couleur associée à une humeur — utilisée par le calendrier et la heatmap.
// Dégradé du rouge/orange (difficile) au vert/or (super), cohérent avec les
// tokens de marque (--gold reste la couleur d'accent dominante).
export function moodColor(mood: number): string {
  switch (mood) {
    case 1: return '#c2611f';
    case 2: return '#d68a4a';
    case 3: return '#c9a227';
    case 4: return '#8ea23a';
    case 5: return '#4a9d5f';
    default: return '#c9a227';
  }
}
