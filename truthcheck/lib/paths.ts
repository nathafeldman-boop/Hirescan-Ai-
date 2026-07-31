// ── Parcours de progression ──────────────────────────────────────────────────
// Remplace les anciens quiz par un vrai parcours gamifié, façon carte de
// progression : chaque objectif du questionnaire d'accueil (voir
// lib/onboardingFunnel.ts::ONBOARDING_GOALS) a SON parcours dédié, construit
// autour de mécaniques variées plutôt que d'un simple enchaînement de
// questions. Le catalogue vit en CODE (contenu éditorial), même logique que
// lib/quests.ts — seule la complétion vit en base (voir LevelCompletion dans
// schema.prisma).
//
// Volontairement PAS de "vies"/"cœurs" façon Duolingo : ces exercices sont
// introspectifs, jamais "réussis ou ratés" — punir une réponse honnête sur
// soi-même serait contre-productif. La seule limite est l'ÉNERGIE quotidienne
// (voir lib/pathAccess.ts), qui borne le rythme sans jamais sanctionner le
// contenu d'une réponse.

export type ExerciseType =
  | 'reflexion'
  | 'quiz_situation'
  | 'respiration'
  | 'defi_reel'
  | 'tri_pensees'
  | 'gratitude'
  | 'affirmation'
  | 'reconnaissance_emotion'
  | 'journal_guide'
  | 'cognitif';

export interface ReflexionContent {
  type: 'reflexion';
  question: string;
  placeholder: string;
  minLength: number;
  // Si renseigné, affiche la réponse donnée à un niveau précédent du MÊME
  // parcours avant la question — sert aux niveaux "callback" qui montrent le
  // chemin parcouru (voir niveau 13 du parcours confiance).
  recallLevelIndex?: number;
  recallIntro?: string;
}

export interface QuizSituationContent {
  type: 'quiz_situation';
  scenario: string;
  options: { label: string; value: string }[];
}

export interface RespirationContent {
  type: 'respiration';
  instruction: string;
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
}

export interface DefiReelContent {
  type: 'defi_reel';
  challenge: string;
  confirmLabel: string;
}

export interface TriPenseesContent {
  type: 'tri_pensees';
  instruction: string;
  categoryA: string;
  categoryB: string;
  items: { text: string; category: 'A' | 'B' }[];
}

export interface GratitudeContent {
  type: 'gratitude';
  instruction: string;
  count: number;
  placeholder: string;
}

export interface AffirmationContent {
  type: 'affirmation';
  base: string;
  instruction: string;
}

export interface EmotionContent {
  type: 'reconnaissance_emotion';
  situation: string;
  emotions: string[];
  multi: boolean;
}

export interface JournalGuideContent {
  type: 'journal_guide';
  prompts: string[];
}

export interface CognitifContent {
  type: 'cognitif';
  instruction: string;
  thoughtPlaceholder: string;
  reframePlaceholder: string;
}

export type ExerciseContent =
  | ReflexionContent
  | QuizSituationContent
  | RespirationContent
  | DefiReelContent
  | TriPenseesContent
  | GratitudeContent
  | AffirmationContent
  | EmotionContent
  | JournalGuideContent
  | CognitifContent;

export interface PathLevelDef {
  index: number; // 0-based, position dans le parcours
  title: string;
  emoji: string;
  xp: number;
  content: ExerciseContent;
}

export interface PathDef {
  key: string;
  onboardingGoal: string; // doit matcher EXACTEMENT lib/onboardingFunnel.ts::ONBOARDING_GOALS
  title: string;
  tagline: string;
  emoji: string;
  accentVar: string; // variable CSS de app/globals.css, ex. "--fam-nf"
  levels: PathLevelDef[];
}

// ── Parcours "Reprendre confiance en moi" — premier parcours, sert de tête de
// pont pour les 6 autres (à construire un par un, voir lib/onboardingFunnel.ts).
const CONFIANCE_LEVELS: PathLevelDef[] = [
  {
    index: 0,
    title: 'Ce qui te fait douter',
    emoji: '🌫️',
    xp: 10,
    content: {
      type: 'reflexion',
      question: "Qu'est-ce qui t'a fait douter de toi récemment ?",
      placeholder: 'Une situation, une phrase, un regard...',
      minLength: 10,
    },
  },
  {
    index: 1,
    title: 'Nommer ce que tu ressens',
    emoji: '🎭',
    xp: 10,
    content: {
      type: 'reconnaissance_emotion',
      situation: "Repense à ce moment où tu as douté de toi. Qu'est-ce que tu as ressenti, précisément ?",
      emotions: ['Honte', 'Peur', 'Tristesse', 'Colère', 'Confusion', 'Solitude'],
      multi: true,
    },
  },
  {
    index: 2,
    title: 'Trier tes pensées',
    emoji: '🧺',
    xp: 15,
    content: {
      type: 'tri_pensees',
      instruction: "Range chaque phrase dans la bonne colonne, selon ce qu'elle fait pour toi.",
      categoryA: "M'aide à avancer",
      categoryB: 'Me tire vers le bas',
      items: [
        { text: 'Je fais de mon mieux avec ce que je sais.', category: 'A' },
        { text: 'Je ne suis pas à la hauteur.', category: 'B' },
        { text: "Une erreur ne définit pas qui je suis.", category: 'A' },
        { text: 'Les autres réussissent mieux que moi.', category: 'B' },
        { text: "J'ai le droit d'apprendre en avançant.", category: 'A' },
        { text: 'Je vais encore décevoir.', category: 'B' },
      ],
    },
  },
  {
    index: 3,
    title: 'Revenir au calme',
    emoji: '🌬️',
    xp: 10,
    content: {
      type: 'respiration',
      instruction: "Avant d'aller plus loin, prends 4 respirations lentes. Suis le rythme.",
      inhaleSeconds: 4,
      holdSeconds: 4,
      exhaleSeconds: 6,
      cycles: 4,
    },
  },
  {
    index: 4,
    title: 'Face à la critique',
    emoji: '💬',
    xp: 15,
    content: {
      type: 'quiz_situation',
      scenario: "Un collègue critique ton travail devant les autres. Qu'est-ce qui se passe le plus souvent en toi ?",
      options: [
        { label: "Je me dis qu'il a sûrement raison, je suis nul(le).", value: 'auto_devalorisation' },
        { label: "Je me braque et je veux prouver qu'il a tort.", value: 'defense' },
        { label: "Je me sens mal sur le coup, puis j'essaie de comprendre le fond.", value: 'ajustement' },
      ],
    },
  },
  {
    index: 5,
    title: 'Ce que tu as, vraiment',
    emoji: '💎',
    xp: 15,
    content: {
      type: 'gratitude',
      instruction: 'Écris 3 qualités que tu as, même si une petite voix en toi en doute.',
      count: 3,
      placeholder: 'Une qualité...',
    },
  },
  {
    index: 6,
    title: "Une fois où tu as réussi malgré la peur",
    emoji: '🏔️',
    xp: 20,
    content: {
      type: 'journal_guide',
      prompts: [
        "Raconte un moment où tu as fait quelque chose malgré la peur de ne pas y arriver.",
        "Qu'est-ce que ça dit de toi, que tu l'aies fait quand même ?",
      ],
    },
  },
  {
    index: 7,
    title: 'Le compliment',
    emoji: '✨',
    xp: 20,
    content: {
      type: 'defi_reel',
      challenge: "Aujourd'hui : fais un compliment sincère à quelqu'un, ET si on t'en fait un, réponds juste \"merci\" — sans le minimiser.",
      confirmLabel: "Je l'ai fait",
    },
  },
  {
    index: 8,
    title: 'Repérer la pensée qui bloque',
    emoji: '🔍',
    xp: 20,
    content: {
      type: 'cognitif',
      instruction: "Repère une pensée qui revient souvent et qui te freine. Puis essaie de la reformuler, plus juste envers toi-même.",
      thoughtPlaceholder: 'Ex : "Je vais forcément échouer."',
      reframePlaceholder: 'Ex : "Je ne sais pas encore ce qui va se passer, et c\'est normal d\'essayer."',
    },
  },
  {
    index: 9,
    title: "Une phrase pour toi",
    emoji: '🪞',
    xp: 20,
    content: {
      type: 'affirmation',
      base: 'Je suis capable de ______, même si je doute parfois.',
      instruction: "Complète cette phrase avec ce qui est vrai pour toi aujourd'hui, puis lis-la à voix haute.",
    },
  },
  {
    index: 10,
    title: 'Recevoir un compliment',
    emoji: '🎁',
    xp: 20,
    content: {
      type: 'quiz_situation',
      scenario: "On te félicite sincèrement pour quelque chose que tu as fait. Ta première réaction intérieure ?",
      options: [
        { label: "Je pense que la personne exagère ou ne voit pas la vérité.", value: 'minimisation' },
        { label: "Je me sens gêné(e), je change vite de sujet.", value: 'fuite' },
        { label: "Je laisse ça me toucher, même quelques secondes.", value: 'accueil' },
      ],
    },
  },
  {
    index: 11,
    title: 'Un moment de fierté',
    emoji: '🌟',
    xp: 20,
    content: {
      type: 'reconnaissance_emotion',
      situation: "Repense à un moment récent, même petit, où tu t'es senti(e) fier/fière de toi. Qu'est-ce que ça a réveillé ?",
      emotions: ['Fierté', 'Soulagement', 'Joie', 'Surprise', 'Confiance', 'Gratitude'],
      multi: true,
    },
  },
  {
    index: 12,
    title: 'Le chemin parcouru',
    emoji: '🧭',
    xp: 25,
    content: {
      type: 'reflexion',
      question: "Qu'est-ce qui a changé depuis, dans ta façon de te voir ?",
      placeholder: 'Même un tout petit changement compte...',
      minLength: 10,
      recallLevelIndex: 0,
      recallIntro: 'Voici ce que tu avais écrit au tout premier niveau de ce parcours :',
    },
  },
  {
    index: 13,
    title: 'Face au miroir',
    emoji: '🪟',
    xp: 25,
    content: {
      type: 'defi_reel',
      challenge: "Devant un miroir, dis à voix haute 3 choses que tu apprécies chez toi. Vraiment, à voix haute.",
      confirmLabel: "Je l'ai fait",
    },
  },
  {
    index: 14,
    title: 'Ce que tu emportes',
    emoji: '🏁',
    xp: 30,
    content: {
      type: 'journal_guide',
      prompts: [
        'Qu\'est-ce que tu as appris sur toi pendant ce parcours ?',
        "Comment veux-tu continuer à cultiver cette confiance, maintenant ?",
      ],
    },
  },
];

export const PATH_CATALOG: PathDef[] = [
  {
    key: 'confiance',
    onboardingGoal: 'Reprendre confiance en moi',
    title: 'Reprendre confiance en moi',
    tagline: '15 niveaux pour réapprendre à te faire confiance, à ton rythme.',
    emoji: '🌱',
    accentVar: '--fam-sp',
    levels: CONFIANCE_LEVELS,
  },
];

export function getPath(key: string): PathDef | undefined {
  return PATH_CATALOG.find((p) => p.key === key);
}

export function getPathForGoal(onboardingGoal: string | null | undefined): PathDef | undefined {
  if (!onboardingGoal) return undefined;
  return PATH_CATALOG.find((p) => p.onboardingGoal === onboardingGoal);
}

export function getLevel(pathKey: string, levelIndex: number): PathLevelDef | undefined {
  return getPath(pathKey)?.levels.find((l) => l.index === levelIndex);
}
