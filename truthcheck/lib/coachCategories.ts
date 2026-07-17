// Catégories de questions proposées par le coach IA — données pures (aucune
// dépendance), donc sûres à importer côté client ('use client').
export interface CoachCategory { key: string; label: string; emoji: string; prompts: string[] }

export const COACH_CATEGORIES: CoachCategory[] = [
  { key: 'relations', label: 'Relations', emoji: '❤️', prompts: [
    'Pourquoi je reproduis toujours les mêmes schémas en amour ?',
    'Avec quel type de personne je suis le plus compatible, et pourquoi ?',
    'Comment mieux gérer les conflits sans me fermer ?',
  ] },
  { key: 'travail', label: 'Travail', emoji: '💼', prompts: [
    'Quel environnement de travail me correspond vraiment ?',
    'Comment me faire entendre en réunion sans me trahir ?',
    'Pourquoi je me démotive une fois la nouveauté passée ?',
  ] },
  { key: 'etudes', label: 'Études', emoji: '📚', prompts: [
    'Quelle méthode de travail colle à mon profil ?',
    'Comment rester concentré quand un sujet m’ennuie ?',
    'Quelle orientation aurait du sens pour moi ?',
  ] },
  { key: 'confiance', label: 'Confiance en soi', emoji: '💪', prompts: [
    'Pourquoi je doute autant de moi ?',
    'Comment arrêter de me comparer aux autres ?',
    'Comment m’affirmer sans culpabiliser ?',
  ] },
  { key: 'motivation', label: 'Motivation', emoji: '🚀', prompts: [
    'Comment tenir mes objectifs sur la durée ?',
    'Pourquoi je procrastine sur ce qui compte pour moi ?',
    'Qu’est-ce qui me motive vraiment, au fond ?',
  ] },
  { key: 'decision', label: 'Prise de décision', emoji: '🧠', prompts: [
    'Pourquoi j’ai autant de mal à me décider ?',
    'Comment trancher sans ruminer pendant des jours ?',
    'Est-ce que je décide plus avec la tête ou le cœur ?',
  ] },
  { key: 'comprendre', label: 'Comprendre ma personnalité', emoji: '🔍', prompts: [
    'Explique-moi ma face cachée, celle que je montre sous stress.',
    'Quelle est ma plus grande force que je sous-estime ?',
    'Quel est mon plus gros angle mort ?',
  ] },
];
