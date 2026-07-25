// Données pures (pas d'appel Mistral, pas de secret) — importables aussi bien
// côté client (formulaire de questionnaire) que côté serveur (lib/friendCompat.ts).

export type RelationType = 'ami' | 'couple' | 'famille';

export const RELATION_TYPES: { value: RelationType; label: string; emoji: string }[] = [
  { value: 'ami', label: 'Ami(e)', emoji: '🤝' },
  { value: 'couple', label: 'Couple', emoji: '❤️' },
  { value: 'famille', label: 'Famille', emoji: '👪' },
];

export interface CompatQuestion { id: string; text: string; options: string[] }

// Questions de PERCEPTION — jamais "comment TU es", toujours "comment ELLE
// est, d'après ce que tu vois d'elle au quotidien". Volontairement courtes,
// 4 options chacune, pour rester un questionnaire d'une minute.
export const COMPAT_QUESTIONS: CompatQuestion[] = [
  { id: 'social', text: 'En groupe, cette personne est plutôt…', options: [
    'Au centre, elle anime', 'À l\'aise, mais sans forcer', 'En retrait, elle observe', 'Ça dépend totalement du groupe',
  ] },
  { id: 'decisions', text: 'Quand elle prend une décision importante, elle se base sur…', options: [
    'La logique et les faits', 'Ce qu\'elle ressent et les gens concernés', 'Un mélange des deux, selon le sujet', 'Son instinct, sans trop réfléchir',
  ] },
  { id: 'conflict', text: 'Face à un désaccord, elle a tendance à…', options: [
    'Dire directement ce qui ne va pas', 'Éviter le conflit, laisser retomber', 'Chercher un compromis tout de suite', 'Ruminer avant d\'en reparler plus tard',
  ] },
  { id: 'organisation', text: 'Côté organisation, elle est plutôt…', options: [
    'Très structurée, elle planifie', 'Spontanée, elle s\'adapte sur le moment', 'Structurée au travail, spontanée sinon', 'Ça dépend vraiment des périodes',
  ] },
  { id: 'emotions', text: 'Elle exprime ses émotions…', options: [
    'Ouvertement, on sait toujours où elle en est', 'Avec retenue, il faut la connaître', 'Par des gestes plus que des mots', 'Difficilement, même avec elle-même',
  ] },
  { id: 'energy', text: 'Ce qui la ressource le plus, c\'est…', options: [
    'Voir du monde, sortir', 'Du temps seule, au calme', 'Une activité qui la passionne', 'Être avec ses proches, en petit comité',
  ] },
  { id: 'values', text: 'Ce qui compte le plus pour elle, c\'est…', options: [
    'La réussite et l\'ambition', 'L\'harmonie et les relations sincères', 'La liberté et l\'indépendance', 'La stabilité et la sécurité',
  ] },
  { id: 'stress', text: 'Sous pression, elle devient plutôt…', options: [
    'Encore plus efficace et concentrée', 'Anxieuse, elle a besoin d\'être rassurée', 'Distante, elle se replie', 'Irritable, à fleur de peau',
  ] },
];
