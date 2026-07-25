// Tags de vie perso — multi-sélection sur une entrée du journal. Liste fixe et
// courte (pas un système de tags libres) : plus facile à visualiser ensuite en
// radar/fréquence, et évite la dérive "un tag différent par jour" qui rendrait
// toute analyse illisible.

export interface JournalTag { key: string; label: string; emoji: string }

export const JOURNAL_TAGS: JournalTag[] = [
  { key: 'travail', label: 'Travail', emoji: '💼' },
  { key: 'amour', label: 'Amour', emoji: '❤️' },
  { key: 'famille', label: 'Famille', emoji: '👪' },
  { key: 'ecole', label: 'École', emoji: '📚' },
  { key: 'amis', label: 'Amis', emoji: '🤝' },
  { key: 'sommeil', label: 'Sommeil', emoji: '😴' },
  { key: 'sport', label: 'Sport', emoji: '🏃' },
];

export const JOURNAL_TAG_KEYS = JOURNAL_TAGS.map((t) => t.key);

export function tagByKey(key: string): JournalTag | undefined {
  return JOURNAL_TAGS.find((t) => t.key === key);
}
