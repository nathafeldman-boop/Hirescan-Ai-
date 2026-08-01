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
  // Parcours adaptatif : quand renseigné, title/emoji/content sont remplacés
  // dynamiquement selon la réponse donnée par CE compte au niveau diagnostic
  // `fromLevelIndex` (voir lib/pathBranching.ts) — ex: "d'où vient ton
  // stress" à un niveau détermine si les niveaux suivants parlent de
  // pression au travail, de ruminations, ou de relations. Les valeurs
  // title/emoji/content ci-dessus servent de repli tant que la branche n'est
  // pas encore résolue (avant que le niveau diagnostic soit répondu).
  branch?: {
    fromLevelIndex: number;
    variants: Record<string, { title: string; emoji: string; content: ExerciseContent }>;
  };
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

// ── Parcours "Gérer mon stress" — deuxième parcours, et premier à être
// ADAPTATIF : à partir du niveau 4, le contenu dépend de la réponse donnée
// au niveau 1 (diagnostic "d'où vient ton stress"), voir
// lib/pathBranching.ts. Même longueur/rythme que "confiance" (15 niveaux,
// 10 gratuits) mais le milieu du parcours n'est pas le même texte pour tout
// le monde : pression au travail, ruminations, ou relations — jamais un
// parcours générique qui irait à n'importe qui.
const STRESS_LEVELS: PathLevelDef[] = [
  {
    index: 0,
    title: 'Respire, tout de suite',
    emoji: '🌬️',
    xp: 10,
    content: {
      type: 'respiration',
      instruction: "Avant même de comprendre d'où vient ton stress, calme le corps. 4 respirations, suis le rythme.",
      inhaleSeconds: 4,
      holdSeconds: 4,
      exhaleSeconds: 6,
      cycles: 4,
    },
  },
  {
    index: 1,
    title: "D'où vient ton stress",
    emoji: '🎯',
    xp: 10,
    content: {
      type: 'quiz_situation',
      scenario: "Si tu devais pointer UNE seule source à ton stress ces derniers temps, ce serait plutôt...",
      options: [
        { label: 'Le travail, les obligations, la charge mentale', value: 'travail' },
        { label: 'Mes pensées qui tournent en boucle', value: 'pensees' },
        { label: 'Mes relations avec les autres', value: 'relations' },
      ],
    },
  },
  {
    index: 2,
    title: 'Ce que ça fait dans le corps',
    emoji: '🫁',
    xp: 15,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quand le stress monte fort, qu\'est-ce que tu ressens le plus ?',
      emotions: ['Oppression', 'Irritabilité', 'Fatigue', 'Agitation', 'Vide', 'Peur'],
      multi: true,
    },
  },
  {
    index: 3,
    title: 'Ce que tu fais déjà',
    emoji: '🧰',
    xp: 15,
    content: {
      type: 'reflexion',
      question: "Qu'est-ce que tu fais déjà aujourd'hui, même un petit truc, pour tenir le coup ?",
      placeholder: 'Une habitude, un réflexe, même imparfait...',
      minLength: 10,
    },
  },
  // ── Niveaux 4 à 9 : branchés selon le niveau 1 ──────────────────────────
  {
    index: 4,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'reflexion', question: '…', placeholder: '…', minLength: 1 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        travail: {
          title: 'Repérer la surcharge',
          emoji: '📋',
          content: { type: 'reflexion', question: 'Quelle tâche ou obligation pèse le plus sur toi cette semaine ?', placeholder: 'Sois précis·e, une seule chose...', minLength: 10 },
        },
        pensees: {
          title: 'La pensée qui revient',
          emoji: '🌀',
          content: { type: 'reflexion', question: 'Quelle pensée tourne en boucle dans ta tête ces derniers jours ?', placeholder: 'Écris-la telle qu\'elle te vient...', minLength: 10 },
        },
        relations: {
          title: 'La relation qui pèse',
          emoji: '🧑‍🤝‍🧑',
          content: { type: 'reflexion', question: 'Quelle relation te demande le plus d\'énergie ces derniers temps ?', placeholder: 'Sans juger, juste décrire...', minLength: 10 },
        },
      },
    },
  },
  {
    index: 5,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'defi_reel', challenge: '…', confirmLabel: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        travail: {
          title: 'Une limite à poser',
          emoji: '🛑',
          content: { type: 'defi_reel', challenge: 'Aujourd\'hui : dis non à une seule sollicitation, ou reporte une tâche non-urgente, sans te justifier pendant 10 minutes.', confirmLabel: 'Je l\'ai fait' },
        },
        pensees: {
          title: 'Interrompre la boucle',
          emoji: '✋',
          content: { type: 'defi_reel', challenge: 'La prochaine fois que la pensée revient : dis-toi "stop" à voix haute, puis change immédiatement d\'activité pendant au moins 2 minutes.', confirmLabel: 'Je l\'ai fait' },
        },
        relations: {
          title: 'Un besoin à exprimer',
          emoji: '💬',
          content: { type: 'defi_reel', challenge: 'Dis à quelqu\'un ce dont tu as besoin, clairement — pas ce que tu ne veux pas, ce que tu VEUX.', confirmLabel: 'Je l\'ai fait' },
        },
      },
    },
  },
  {
    index: 6,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'tri_pensees', instruction: '…', categoryA: '…', categoryB: '…', items: [] },
    branch: {
      fromLevelIndex: 1,
      variants: {
        travail: {
          title: 'Prioriser sans culpabiliser',
          emoji: '🗂️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque tâche selon ce qu\'elle est vraiment, pas ce qu\'elle a l\'air d\'être.',
            categoryA: 'Urgent',
            categoryB: 'Peut attendre',
            items: [
              { text: 'Répondre à un message qui n\'a rien d\'urgent', category: 'B' },
              { text: 'Une échéance qui tombe demain', category: 'A' },
              { text: 'Ranger sa boîte mail', category: 'B' },
              { text: 'Un problème qui bloque quelqu\'un d\'autre en ce moment', category: 'A' },
              { text: 'Anticiper un projet dans 3 semaines', category: 'B' },
              { text: 'Un imprévu qui doit être géré aujourd\'hui', category: 'A' },
            ],
          },
        },
        pensees: {
          title: 'Trier le vrai du bruit',
          emoji: '🧺',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque pensée selon sa nature, pas selon à quel point elle te semble vraie sur le moment.',
            categoryA: 'Un fait',
            categoryB: 'Une peur qui parle',
            items: [
              { text: 'Je n\'ai pas eu de réponse, donc j\'ai fait quelque chose de mal.', category: 'B' },
              { text: 'J\'ai un rendez-vous à 15h.', category: 'A' },
              { text: 'Tout le monde va s\'en apercevoir.', category: 'B' },
              { text: 'J\'ai terminé cette tâche hier.', category: 'A' },
              { text: 'Si je me trompe une fois, c\'est fini.', category: 'B' },
              { text: 'Il pleut aujourd\'hui.', category: 'A' },
            ],
          },
        },
        relations: {
          title: 'Donner vs recevoir',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque comportement selon ce qu\'il représente pour toi, honnêtement.',
            categoryA: 'Je donne trop',
            categoryB: 'Je m\'autorise à recevoir',
            items: [
              { text: 'Dire oui alors que je n\'ai pas envie', category: 'A' },
              { text: 'Accepter de l\'aide sans culpabiliser', category: 'B' },
              { text: 'M\'excuser pour des choses qui ne dépendent pas de moi', category: 'A' },
              { text: 'Demander un service quand j\'en ai besoin', category: 'B' },
              { text: 'Absorber les émotions des autres', category: 'A' },
              { text: 'Prendre du temps rien que pour moi', category: 'B' },
            ],
          },
        },
      },
    },
  },
  {
    index: 7,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'cognitif', instruction: '…', thoughtPlaceholder: '…', reframePlaceholder: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        travail: {
          title: 'La pensée qui met la pression',
          emoji: '⚙️',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te met le plus la pression au travail, puis reformule-la plus juste.',
            thoughtPlaceholder: 'Ex : "Je dois tout faire parfaitement."',
            reframePlaceholder: 'Ex : "Je peux faire du bon travail sans qu\'il soit parfait."',
          },
        },
        pensees: {
          title: 'Reformuler la pensée',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Reprends la pensée qui tourne en boucle (niveau précédent), et essaie de la reformuler, plus juste envers toi-même.',
            thoughtPlaceholder: 'La pensée telle qu\'elle revient...',
            reframePlaceholder: 'Ex : "C\'est une pensée, pas un fait."',
          },
        },
        relations: {
          title: 'La pensée qui empêche de poser une limite',
          emoji: '🚧',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui t\'empêche de poser une limite dans cette relation, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Si je dis non, je vais le/la décevoir."',
            reframePlaceholder: 'Ex : "Poser une limite ne veut pas dire que je ne tiens pas à cette personne."',
          },
        },
      },
    },
  },
  {
    index: 8,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'respiration', instruction: '…', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        travail: {
          title: 'Une pause qui compte',
          emoji: '☕',
          content: { type: 'respiration', instruction: 'Une vraie pause de 2 minutes, sans écran. Suis le rythme.', inhaleSeconds: 4, holdSeconds: 7, exhaleSeconds: 8, cycles: 4 },
        },
        pensees: {
          title: 'Couper la boucle',
          emoji: '🧵',
          content: { type: 'respiration', instruction: 'Quand la pensée revient trop fort, ce rythme aide à reprendre la main sur le corps avant l\'esprit.', inhaleSeconds: 4, holdSeconds: 7, exhaleSeconds: 8, cycles: 5 },
        },
        relations: {
          title: 'Respirer avant de répondre',
          emoji: '⏸️',
          content: { type: 'respiration', instruction: 'La prochaine fois qu\'une interaction te met sous tension, prends ce temps avant de répondre.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
      },
    },
  },
  {
    index: 9,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'affirmation', base: '…', instruction: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        travail: {
          title: 'Ce que le travail ne doit pas prendre',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Mon travail ne définit pas ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        pensees: {
          title: 'Ce qui reste vrai',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Même si cette pensée revient, ______ reste vrai.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        relations: {
          title: 'Ce que je mérite',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Je mérite des relations où ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
      },
    },
  },
  // ── Niveaux 10 à 14 : partagés, clôture du parcours ─────────────────────
  {
    index: 10,
    title: 'Ta trousse à outils',
    emoji: '🧰',
    xp: 20,
    content: {
      type: 'journal_guide',
      prompts: [
        'Parmi les exercices précédents, lequel t\'a semblé le plus utile ?',
        'Comment tu peux le refaire facilement la prochaine fois que le stress monte ?',
      ],
    },
  },
  {
    index: 11,
    title: 'Reconnaître les signaux tôt',
    emoji: '🚨',
    xp: 20,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quel est LE premier signal, dans ton corps ou ta tête, qui te dit que le stress commence à monter ?',
      emotions: ['Tension dans les épaules', 'Pensées qui s\'accélèrent', 'Irritabilité', 'Envie de fuir', 'Mâchoire serrée', 'Souffle court'],
      multi: false,
    },
  },
  {
    index: 12,
    title: 'Ta phrase refuge',
    emoji: '🛟',
    xp: 20,
    content: {
      type: 'affirmation',
      base: 'Quand ça monte, je me dis : ______.',
      instruction: 'Écris une phrase courte que tu pourras te répéter la prochaine fois — puis lis-la à voix haute.',
    },
  },
  {
    index: 13,
    title: 'Le chemin parcouru',
    emoji: '🧭',
    xp: 25,
    content: {
      type: 'reflexion',
      question: 'Est-ce que tu gères différemment maintenant, comparé à ce que tu faisais avant ?',
      placeholder: 'Même un petit changement compte...',
      minLength: 10,
      recallLevelIndex: 3,
      recallIntro: 'Voici ce que tu avais écrit sur ce que tu faisais déjà pour tenir le coup :',
    },
  },
  {
    index: 14,
    title: 'Ton plan anti-stress',
    emoji: '🏁',
    xp: 30,
    content: {
      type: 'journal_guide',
      prompts: [
        'Qu\'est-ce que tu as appris sur tes déclencheurs de stress ?',
        'Qu\'est-ce que tu veux mettre en place cette semaine ?',
      ],
    },
  },
];

// ── Parcours "Mieux comprendre mes émotions" — troisième parcours adaptatif :
// à partir du niveau 4, le contenu dépend de la réponse au niveau 1
// (diagnostic : ce qui est le plus difficile face à une émotion forte —
// confusion, submersion, ou évitement).
const EMOTIONS_LEVELS: PathLevelDef[] = [
  {
    index: 0,
    title: 'Là, maintenant',
    emoji: '🎭',
    xp: 10,
    content: {
      type: 'reconnaissance_emotion',
      situation: "Avant toute chose : là, maintenant, qu'est-ce que tu ressens ?",
      emotions: ['Calme', 'Fatigue', 'Anxiété', 'Tristesse', 'Irritation', 'Confusion', 'Joie', 'Vide'],
      multi: true,
    },
  },
  {
    index: 1,
    title: 'Ce qui est le plus dur',
    emoji: '🎯',
    xp: 10,
    content: {
      type: 'quiz_situation',
      scenario: "Quand une émotion forte monte, qu'est-ce qui est le plus difficile pour toi ?",
      options: [
        { label: "Je n'arrive pas à savoir ce que je ressens vraiment", value: 'confusion' },
        { label: 'Je ressens tout trop fort, ça me submerge', value: 'submersion' },
        { label: 'Je préfère ne rien ressentir, je coupe', value: 'evitement' },
      ],
    },
  },
  {
    index: 2,
    title: 'Ce que ça fait dans le corps',
    emoji: '🫀',
    xp: 15,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quand une émotion forte arrive, qu\'est-ce que tu remarques le plus dans ton corps ?',
      emotions: ['Gorge serrée', 'Poitrine lourde', 'Ventre noué', 'Chaleur au visage', 'Tremblements', 'Rien, comme coupé·e'],
      multi: true,
    },
  },
  {
    index: 3,
    title: 'Ce que tu fais déjà',
    emoji: '🧰',
    xp: 15,
    content: {
      type: 'reflexion',
      question: "Aujourd'hui, quand une émotion est trop forte, qu'est-ce que tu fais déjà pour la traverser ?",
      placeholder: 'Même un réflexe imparfait...',
      minLength: 10,
    },
  },
  // ── Niveaux 4 à 9 : branchés selon le niveau 1 ──────────────────────────
  {
    index: 4,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'reflexion', question: '…', placeholder: '…', minLength: 1 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        confusion: {
          title: 'Repérer le signal',
          emoji: '🔎',
          content: { type: 'reflexion', question: "Décris une situation récente où tu ne savais pas ce que tu ressentais. Qu'est-ce qui s'est passé juste avant ?", placeholder: 'Le contexte, même flou...', minLength: 10 },
        },
        submersion: {
          title: 'Nommer la vague',
          emoji: '🌊',
          content: { type: 'reflexion', question: "Décris la dernière fois qu'une émotion t'a submergé·e. Qu'est-ce qui l'a déclenchée ?", placeholder: 'Le moment, le déclencheur...', minLength: 10 },
        },
        evitement: {
          title: 'Ce que tu évites de ressentir',
          emoji: '🚪',
          content: { type: 'reflexion', question: 'Quelle émotion as-tu le plus tendance à repousser ou ignorer ?', placeholder: 'Sans te juger...', minLength: 10 },
        },
      },
    },
  },
  {
    index: 5,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'defi_reel', challenge: '…', confirmLabel: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        confusion: {
          title: 'Un mot pour ce que tu ressens',
          emoji: '🏷️',
          content: { type: 'defi_reel', challenge: "Aujourd'hui, à 3 moments différents, arrête-toi 10 secondes et nomme UN mot pour ce que tu ressens, même approximatif.", confirmLabel: "Je l'ai fait" },
        },
        submersion: {
          title: 'Faire de la place',
          emoji: '🖐️',
          content: { type: 'defi_reel', challenge: "La prochaine fois qu'une émotion monte fort, dis-toi \"j'ai le droit de ressentir ça\" avant de réagir, et attends 60 secondes avant de répondre à qui que ce soit.", confirmLabel: "Je l'ai fait" },
        },
        evitement: {
          title: 'Rester avec',
          emoji: '🧘',
          content: { type: 'defi_reel', challenge: "La prochaine fois qu'une émotion arrive, reste avec elle 30 secondes sans la chasser ni faire autre chose pour l'éviter.", confirmLabel: "Je l'ai fait" },
        },
      },
    },
  },
  {
    index: 6,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'tri_pensees', instruction: '…', categoryA: '…', categoryB: '…', items: [] },
    branch: {
      fromLevelIndex: 1,
      variants: {
        confusion: {
          title: 'Sensation ou pensée',
          emoji: '🧩',
          content: {
            type: 'tri_pensees',
            instruction: "Range chaque phrase selon sa nature.",
            categoryA: 'Une sensation dans le corps',
            categoryB: 'Une pensée sur la situation',
            items: [
              { text: 'Ma gorge est serrée', category: 'A' },
              { text: 'Il va sûrement m\'en vouloir', category: 'B' },
              { text: 'Mon ventre est noué', category: 'A' },
              { text: 'Je vais tout rater', category: 'B' },
              { text: 'Ma respiration s\'accélère', category: 'A' },
              { text: 'Ça veut dire que je suis nul·le', category: 'B' },
            ],
          },
        },
        submersion: {
          title: 'Calme la vague ou l\'amplifie',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque réaction selon son effet sur toi, honnêtement.',
            categoryA: 'Calme la vague',
            categoryB: 'Amplifie la vague',
            items: [
              { text: 'Respirer lentement', category: 'A' },
              { text: 'Ressasser en boucle ce qui s\'est passé', category: 'B' },
              { text: 'Nommer ce que je ressens à voix haute', category: 'A' },
              { text: 'Me dire que je ne devrais pas ressentir ça', category: 'B' },
              { text: 'Bouger, marcher un peu', category: 'A' },
              { text: 'Répondre tout de suite, sous le coup de l\'émotion', category: 'B' },
            ],
          },
        },
        evitement: {
          title: 'Vrai besoin ou fuite',
          emoji: '🚧',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque comportement selon ce qu\'il représente vraiment pour toi.',
            categoryA: 'M\'aide à avancer',
            categoryB: 'M\'éloigne de ce que je ressens',
            items: [
              { text: 'Me plonger dans le travail pour ne plus y penser', category: 'B' },
              { text: 'Prendre 2 minutes pour sentir ce qui se passe en moi', category: 'A' },
              { text: 'Scroller pour ne pas ressentir', category: 'B' },
              { text: 'En parler à quelqu\'un de confiance', category: 'A' },
              { text: 'Faire comme si de rien n\'était', category: 'B' },
              { text: 'Écrire ce que je ressens', category: 'A' },
            ],
          },
        },
      },
    },
  },
  {
    index: 7,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'cognitif', instruction: '…', thoughtPlaceholder: '…', reframePlaceholder: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        confusion: {
          title: 'Reformuler la confusion',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui revient quand tu ne sais pas ce que tu ressens, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Je ne sais jamais ce que je ressens."',
            reframePlaceholder: 'Ex : "Je peux apprendre à mieux reconnaître mes émotions, petit à petit."',
          },
        },
        submersion: {
          title: 'Reformuler la vague',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te fait peur quand une émotion monte, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Cette émotion va m\'engloutir."',
            reframePlaceholder: 'Ex : "Une émotion, même forte, finit toujours par redescendre."',
          },
        },
        evitement: {
          title: 'Reformuler l\'évitement',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te pousse à couper tes émotions, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Ressentir ça, c\'est dangereux ou faible."',
            reframePlaceholder: 'Ex : "Ressentir n\'est pas un défaut, c\'est une information."',
          },
        },
      },
    },
  },
  {
    index: 8,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'respiration', instruction: '…', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        confusion: {
          title: 'Se poser pour sentir',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Avant de nommer ce que tu ressens, pose ton attention sur ta respiration. Suis le rythme.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
        submersion: {
          title: 'Redescendre la vague',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Quand l\'émotion est trop forte, ce rythme plus long aide le corps à redescendre. Suis-le.', inhaleSeconds: 4, holdSeconds: 7, exhaleSeconds: 8, cycles: 5 },
        },
        evitement: {
          title: 'Rouvrir doucement',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Ce rythme t\'aide à rester présent·e avec ce que tu ressens, sans le couper. Suis-le.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
      },
    },
  },
  {
    index: 9,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'affirmation', base: '…', instruction: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        confusion: {
          title: 'Le droit de ne pas savoir',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Je n\'ai pas besoin de nommer parfaitement ce que je ressens pour ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        submersion: {
          title: 'Ça va redescendre',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Même quand ça monte fort, ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        evitement: {
          title: 'Le droit de ressentir',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'J\'ai le droit de ressentir ______, sans que ça fasse de moi ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
      },
    },
  },
  // ── Niveaux 10 à 14 : partagés, clôture du parcours ─────────────────────
  {
    index: 10,
    title: 'Ta trousse à outils',
    emoji: '🧰',
    xp: 20,
    content: {
      type: 'journal_guide',
      prompts: [
        "Parmi les exercices précédents, lequel t'a semblé le plus utile ?",
        'Comment tu peux le refaire facilement la prochaine fois ?',
      ],
    },
  },
  {
    index: 11,
    title: 'Reconnaître les signaux tôt',
    emoji: '🚨',
    xp: 20,
    content: {
      type: 'reconnaissance_emotion',
      situation: "Quel est LE premier signal, dans ton corps, qui te dit qu'une émotion forte commence à monter ?",
      emotions: ['Gorge qui se serre', 'Cœur qui accélère', 'Envie de fuir ou de couper', 'Pensées qui s\'emballent', 'Chaleur au visage', 'Tension dans les épaules'],
      multi: false,
    },
  },
  {
    index: 12,
    title: 'Ta phrase refuge',
    emoji: '🛟',
    xp: 20,
    content: {
      type: 'affirmation',
      base: 'Quand une émotion monte fort, je me dis : ______.',
      instruction: 'Écris une phrase courte que tu pourras te répéter la prochaine fois — puis lis-la à voix haute.',
    },
  },
  {
    index: 13,
    title: 'Le chemin parcouru',
    emoji: '🧭',
    xp: 25,
    content: {
      type: 'reflexion',
      question: 'Est-ce que tu traverses tes émotions différemment maintenant, comparé à avant ?',
      placeholder: 'Même un petit changement compte...',
      minLength: 10,
      recallLevelIndex: 3,
      recallIntro: 'Voici ce que tu avais écrit sur ce que tu faisais déjà pour traverser une émotion forte :',
    },
  },
  {
    index: 14,
    title: 'Ton plan émotionnel',
    emoji: '🏁',
    xp: 30,
    content: {
      type: 'journal_guide',
      prompts: [
        'Qu\'est-ce que tu as appris sur la façon dont tu vis tes émotions ?',
        'Qu\'est-ce que tu veux mettre en place cette semaine ?',
      ],
    },
  },
];

// ── Parcours "Améliorer mes relations" — quatrième parcours adaptatif :
// branche sur le niveau 1 (limites / communication / conflits).
const RELATIONS_LEVELS: PathLevelDef[] = [
  {
    index: 0,
    title: 'Une relation qui pèse',
    emoji: '🧑‍🤝‍🧑',
    xp: 10,
    content: {
      type: 'reflexion',
      question: 'Pense à une relation qui te demande beaucoup d\'énergie en ce moment. Qu\'est-ce qui te vient tout de suite ?',
      placeholder: 'Le premier mot, la première image...',
      minLength: 10,
    },
  },
  {
    index: 1,
    title: 'Ce qui est le plus dur',
    emoji: '🎯',
    xp: 10,
    content: {
      type: 'quiz_situation',
      scenario: 'Dans tes relations, qu\'est-ce qui est le plus difficile pour toi en ce moment ?',
      options: [
        { label: 'Poser mes limites, dire non', value: 'limites' },
        { label: 'Exprimer ce que je ressens ou ce dont j\'ai besoin', value: 'communication' },
        { label: 'Gérer les désaccords sans que ça dégénère', value: 'conflits' },
      ],
    },
  },
  {
    index: 2,
    title: 'Ce que ça te fait ressentir',
    emoji: '🎭',
    xp: 15,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Dans cette relation, qu\'est-ce que tu ressens le plus souvent ?',
      emotions: ['Frustration', 'Culpabilité', 'Épuisement', 'Tristesse', 'Colère', 'Solitude'],
      multi: true,
    },
  },
  {
    index: 3,
    title: 'Ce que tu fais déjà',
    emoji: '🧰',
    xp: 15,
    content: {
      type: 'reflexion',
      question: 'Qu\'est-ce que tu fais déjà, aujourd\'hui, pour gérer cette relation ?',
      placeholder: 'Même un réflexe imparfait...',
      minLength: 10,
    },
  },
  // ── Niveaux 4 à 9 : branchés selon le niveau 1 ──────────────────────────
  {
    index: 4,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'reflexion', question: '…', placeholder: '…', minLength: 1 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        limites: {
          title: 'Le dernier oui de trop',
          emoji: '🛑',
          content: { type: 'reflexion', question: 'Repense à la dernière fois où tu as dit oui alors que tu voulais dire non. Qu\'est-ce qui t\'en a empêché·e ?', placeholder: 'Sois honnête, sans te juger...', minLength: 10 },
        },
        communication: {
          title: 'Ce que tu n\'arrives pas à dire',
          emoji: '🤐',
          content: { type: 'reflexion', question: 'Qu\'est-ce que tu aimerais dire à cette personne, mais que tu gardes pour toi ?', placeholder: 'Écris-le comme si personne ne le lisait...', minLength: 10 },
        },
        conflits: {
          title: 'Le dernier désaccord',
          emoji: '💥',
          content: { type: 'reflexion', question: 'Repense au dernier désaccord qui a mal tourné. Qu\'est-ce qui a fait que ça a dégénéré ?', placeholder: 'Le moment où ça a basculé...', minLength: 10 },
        },
      },
    },
  },
  {
    index: 5,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'defi_reel', challenge: '…', confirmLabel: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        limites: {
          title: 'Dire non',
          emoji: '🛑',
          content: { type: 'defi_reel', challenge: 'Aujourd\'hui : dis non à une sollicitation, sans te justifier pendant 10 minutes.', confirmLabel: 'Je l\'ai fait' },
        },
        communication: {
          title: 'Exprimer un besoin',
          emoji: '💬',
          content: { type: 'defi_reel', challenge: 'Exprime un besoin clairement à quelqu\'un aujourd\'hui, en commençant par "J\'ai besoin de...".', confirmLabel: 'Je l\'ai fait' },
        },
        conflits: {
          title: 'Écouter jusqu\'au bout',
          emoji: '👂',
          content: { type: 'defi_reel', challenge: 'La prochaine fois qu\'un désaccord arrive, écoute l\'autre jusqu\'au bout avant de répondre quoi que ce soit.', confirmLabel: 'Je l\'ai fait' },
        },
      },
    },
  },
  {
    index: 6,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'tri_pensees', instruction: '…', categoryA: '…', categoryB: '…', items: [] },
    branch: {
      fromLevelIndex: 1,
      variants: {
        limites: {
          title: 'Vraie limite ou culpabilité',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque phrase selon ce qu\'elle est vraiment.',
            categoryA: 'Une vraie limite',
            categoryB: 'Une culpabilité',
            items: [
              { text: 'Je n\'ai pas la disponibilité pour ça cette semaine', category: 'A' },
              { text: 'Je devrais toujours être là pour tout le monde', category: 'B' },
              { text: 'Ça dépasse ce que je peux donner en ce moment', category: 'A' },
              { text: 'Si je dis non, je suis quelqu\'un de mauvais·e', category: 'B' },
              { text: 'J\'ai besoin de temps pour moi', category: 'A' },
              { text: 'Un non va détruire la relation', category: 'B' },
            ],
          },
        },
        communication: {
          title: 'Besoin clair ou reproche',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque phrase selon sa nature.',
            categoryA: 'Un besoin clair',
            categoryB: 'Un reproche déguisé',
            items: [
              { text: 'J\'ai besoin qu\'on se parle calmement', category: 'A' },
              { text: 'Tu ne penses jamais à moi', category: 'B' },
              { text: 'J\'aimerais qu\'on prévoie du temps ensemble', category: 'A' },
              { text: 'Tu es toujours en retard, comme d\'habitude', category: 'B' },
              { text: 'J\'ai besoin d\'être rassuré·e sur ça', category: 'A' },
              { text: 'Tu ne m\'écoutes jamais vraiment', category: 'B' },
            ],
          },
        },
        conflits: {
          title: 'Fait avancer ou envenime',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque réaction selon son effet sur un désaccord.',
            categoryA: 'Aide à avancer',
            categoryB: 'Envenime',
            items: [
              { text: 'Reformuler ce que l\'autre vient de dire', category: 'A' },
              { text: 'Ressortir de vieux reproches', category: 'B' },
              { text: 'Dire "je" plutôt que "tu"', category: 'A' },
              { text: 'Couper la parole', category: 'B' },
              { text: 'Faire une pause si ça monte trop', category: 'A' },
              { text: 'Vouloir avoir raison à tout prix', category: 'B' },
            ],
          },
        },
      },
    },
  },
  {
    index: 7,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'cognitif', instruction: '…', thoughtPlaceholder: '…', reframePlaceholder: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        limites: {
          title: 'La peur derrière le oui',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui t\'empêche de dire non, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Si je dis non, je vais le/la décevoir."',
            reframePlaceholder: 'Ex : "Poser une limite ne fait pas de moi quelqu\'un de mauvais·e."',
          },
        },
        communication: {
          title: 'La peur de parler',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui t\'empêche d\'exprimer ce que tu ressens, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Si je dis ce que je pense, ça va être pire."',
            reframePlaceholder: 'Ex : "Exprimer ce que je ressens, c\'est prendre soin de la relation."',
          },
        },
        conflits: {
          title: 'La peur du désaccord',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te fait paniquer face à un désaccord, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Un désaccord veut dire qu\'on ne s\'entend plus."',
            reframePlaceholder: 'Ex : "On peut ne pas être d\'accord et rester proches."',
          },
        },
      },
    },
  },
  {
    index: 8,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'respiration', instruction: '…', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        limites: {
          title: 'Se poser avant de répondre',
          emoji: '⏸️',
          content: { type: 'respiration', instruction: 'Avant de répondre à une demande, prends ce temps pour sentir ce que TOI tu veux vraiment.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
        communication: {
          title: 'Se centrer avant de parler',
          emoji: '⏸️',
          content: { type: 'respiration', instruction: 'Avant une conversation importante, prends ce temps pour clarifier ce que tu veux dire.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
        conflits: {
          title: 'Respirer avant de répondre',
          emoji: '⏸️',
          content: { type: 'respiration', instruction: 'La prochaine fois qu\'un désaccord monte en tension, prends ce temps avant de répondre.', inhaleSeconds: 4, holdSeconds: 7, exhaleSeconds: 8, cycles: 4 },
        },
      },
    },
  },
  {
    index: 9,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'affirmation', base: '…', instruction: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        limites: {
          title: 'Le droit de dire non',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Poser une limite ne fait pas de moi ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        communication: {
          title: 'Le droit d\'exprimer',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Exprimer ce que je ressens, c\'est ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        conflits: {
          title: 'Ce que je mérite',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Un désaccord ne menace pas ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
      },
    },
  },
  // ── Niveaux 10 à 14 : partagés, clôture du parcours ─────────────────────
  {
    index: 10,
    title: 'Ta trousse à outils',
    emoji: '🧰',
    xp: 20,
    content: {
      type: 'journal_guide',
      prompts: [
        'Parmi les exercices précédents, lequel t\'a semblé le plus utile ?',
        'Comment tu peux le réutiliser dans une relation, cette semaine ?',
      ],
    },
  },
  {
    index: 11,
    title: 'Reconnaître les signaux tôt',
    emoji: '🚨',
    xp: 20,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quel est LE premier signal qui te dit qu\'une relation commence à te peser ?',
      emotions: ['Envie d\'éviter la personne', 'Irritabilité anticipée', 'Fatigue avant même l\'interaction', 'Ruminations après coup', 'Serrement dans la poitrine', 'Envie de tout annuler'],
      multi: false,
    },
  },
  {
    index: 12,
    title: 'Ta phrase refuge',
    emoji: '🛟',
    xp: 20,
    content: {
      type: 'affirmation',
      base: 'Dans une relation difficile, je me dis : ______.',
      instruction: 'Écris une phrase courte que tu pourras te répéter la prochaine fois — puis lis-la à voix haute.',
    },
  },
  {
    index: 13,
    title: 'Le chemin parcouru',
    emoji: '🧭',
    xp: 25,
    content: {
      type: 'reflexion',
      question: 'Est-ce que tu gères cette relation différemment maintenant, comparé à avant ?',
      placeholder: 'Même un petit changement compte...',
      minLength: 10,
      recallLevelIndex: 3,
      recallIntro: 'Voici ce que tu avais écrit sur ce que tu faisais déjà pour gérer cette relation :',
    },
  },
  {
    index: 14,
    title: 'Ton plan relationnel',
    emoji: '🏁',
    xp: 30,
    content: {
      type: 'journal_guide',
      prompts: [
        'Qu\'est-ce que tu as appris sur ta façon d\'être en relation ?',
        'Qu\'est-ce que tu veux mettre en place cette semaine ?',
      ],
    },
  },
];

// ── Parcours "Retrouver de la motivation" — cinquième parcours adaptatif :
// branche sur le niveau 1 (fatigue / perte de sens / peur de l'échec).
const MOTIVATION_LEVELS: PathLevelDef[] = [
  {
    index: 0,
    title: 'Le tout petit pas',
    emoji: '🐾',
    xp: 10,
    content: {
      type: 'defi_reel',
      challenge: 'Pense à une chose que tu remets à plus tard. Fais-en UNE toute petite partie, moins de 2 minutes, là tout de suite.',
      confirmLabel: 'Je l\'ai fait',
    },
  },
  {
    index: 1,
    title: 'Ce qui te freine',
    emoji: '🎯',
    xp: 10,
    content: {
      type: 'quiz_situation',
      scenario: 'Quand tu manques de motivation, c\'est surtout à cause de quoi ?',
      options: [
        { label: 'Je suis épuisé·e, je n\'ai plus d\'énergie', value: 'fatigue' },
        { label: 'Je ne sais plus pourquoi je fais tout ça, ça n\'a plus de sens', value: 'sens' },
        { label: 'J\'ai peur d\'échouer, donc je repousse', value: 'peur_echec' },
      ],
    },
  },
  {
    index: 2,
    title: 'Ce que ça te fait ressentir',
    emoji: '🎭',
    xp: 15,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quand tu penses à ce qui te démotive, qu\'est-ce que tu ressens ?',
      emotions: ['Lassitude', 'Culpabilité', 'Vide', 'Anxiété', 'Découragement', 'Colère contre toi-même'],
      multi: true,
    },
  },
  {
    index: 3,
    title: 'Ce qui t\'a déjà relancé·e',
    emoji: '🧰',
    xp: 15,
    content: {
      type: 'reflexion',
      question: 'Repense à une fois où tu as réussi à te relancer après un coup de mou. Qu\'est-ce qui a aidé ?',
      placeholder: 'Même un petit déclic...',
      minLength: 10,
    },
  },
  // ── Niveaux 4 à 9 : branchés selon le niveau 1 ──────────────────────────
  {
    index: 4,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'reflexion', question: '…', placeholder: '…', minLength: 1 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        fatigue: {
          title: 'Où part ton énergie',
          emoji: '🔋',
          content: { type: 'reflexion', question: 'Où est-ce que ton énergie part le plus, en ce moment, même dans des choses qui semblent anodines ?', placeholder: 'Sois précis·e...', minLength: 10 },
        },
        sens: {
          title: 'Depuis quand',
          emoji: '🕳️',
          content: { type: 'reflexion', question: 'Depuis quand as-tu l\'impression que ça n\'a plus vraiment de sens ? Qu\'est-ce qui a changé ?', placeholder: 'Un moment, un déclic, une usure progressive...', minLength: 10 },
        },
        peur_echec: {
          title: 'Ce que tu repousses',
          emoji: '⏳',
          content: { type: 'reflexion', question: 'Qu\'est-ce que tu repousses le plus, par peur de ne pas réussir ?', placeholder: 'Sans te juger...', minLength: 10 },
        },
      },
    },
  },
  {
    index: 5,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'defi_reel', challenge: '…', confirmLabel: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        fatigue: {
          title: 'Un vrai repos',
          emoji: '🛋️',
          content: { type: 'defi_reel', challenge: 'Accorde-toi aujourd\'hui 10 minutes de vrai repos, sans écran, sans culpabiliser.', confirmLabel: 'Je l\'ai fait' },
        },
        sens: {
          title: 'Une raison de continuer',
          emoji: '🧭',
          content: { type: 'defi_reel', challenge: 'Écris une seule raison, même petite, pour laquelle ça vaut le coup de continuer aujourd\'hui.', confirmLabel: 'Je l\'ai fait' },
        },
        peur_echec: {
          title: 'Le premier pas',
          emoji: '🐾',
          content: { type: 'defi_reel', challenge: 'Fais le tout premier petit pas de la tâche que tu repousses le plus — juste le premier, rien de plus.', confirmLabel: 'Je l\'ai fait' },
        },
      },
    },
  },
  {
    index: 6,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'tri_pensees', instruction: '…', categoryA: '…', categoryB: '…', items: [] },
    branch: {
      fromLevelIndex: 1,
      variants: {
        fatigue: {
          title: 'Recharge ou vide',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque activité selon son effet réel sur ton énergie.',
            categoryA: 'Me recharge',
            categoryB: 'Me vide',
            items: [
              { text: 'Dormir suffisamment', category: 'A' },
              { text: 'Enchaîner sans pause', category: 'B' },
              { text: 'Une vraie coupure le week-end', category: 'A' },
              { text: 'Dire oui à tout par peur de décevoir', category: 'B' },
              { text: 'Bouger un peu, prendre l\'air', category: 'A' },
              { text: 'Scroller au lieu de me reposer vraiment', category: 'B' },
            ],
          },
        },
        sens: {
          title: 'Vraiment moi ou habitude',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque activité selon ce qu\'elle représente vraiment pour toi.',
            categoryA: 'Compte vraiment pour moi',
            categoryB: 'Je le fais par habitude ou pression',
            items: [
              { text: 'Ça correspond à ce que je veux construire', category: 'A' },
              { text: 'Je le fais parce que "c\'est comme ça"', category: 'B' },
              { text: 'Ça me ressemble', category: 'A' },
              { text: 'Je le fais pour éviter le jugement des autres', category: 'B' },
              { text: 'Ça a du sens même dans les moments durs', category: 'A' },
              { text: 'Je ne sais même plus pourquoi je continue', category: 'B' },
            ],
          },
        },
        peur_echec: {
          title: 'Vrai risque ou peur',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque pensée selon sa nature.',
            categoryA: 'Un vrai risque',
            categoryB: 'Une peur qui exagère',
            items: [
              { text: 'Si j\'essaie, je vais forcément échouer', category: 'B' },
              { text: 'Cette tâche demande une compétence que je n\'ai pas encore', category: 'A' },
              { text: 'Si je rate, tout le monde va s\'en moquer', category: 'B' },
              { text: 'Il me faut du temps pour bien faire ça', category: 'A' },
              { text: 'Une erreur ici serait la fin de tout', category: 'B' },
              { text: 'Je peux ajuster si ça ne marche pas du premier coup', category: 'A' },
            ],
          },
        },
      },
    },
  },
  {
    index: 7,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'cognitif', instruction: '…', thoughtPlaceholder: '…', reframePlaceholder: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        fatigue: {
          title: 'Reformuler l\'épuisement',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui t\'empêche de te reposer, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Je devrais avoir plus d\'énergie que ça."',
            reframePlaceholder: 'Ex : "Se reposer, c\'est ce qui me permet de tenir dans la durée."',
          },
        },
        sens: {
          title: 'Reformuler la perte de sens',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te vient quand ça n\'a plus de sens, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Si ça n\'a plus de sens, il faut tout arrêter."',
            reframePlaceholder: 'Ex : "Le sens peut revenir autrement, sans tout arrêter d\'un coup."',
          },
        },
        peur_echec: {
          title: 'Reformuler l\'échec',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te vient face au risque d\'échouer, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Si j\'échoue, ça veut dire que je suis nul·le."',
            reframePlaceholder: 'Ex : "Échouer une fois, c\'est apprendre une fois — pas une sentence."',
          },
        },
      },
    },
  },
  {
    index: 8,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'respiration', instruction: '…', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        fatigue: {
          title: 'Une vraie pause',
          emoji: '☕',
          content: { type: 'respiration', instruction: 'Une vraie pause de 2 minutes, sans écran. Suis le rythme.', inhaleSeconds: 4, holdSeconds: 7, exhaleSeconds: 8, cycles: 4 },
        },
        sens: {
          title: 'Se reconnecter',
          emoji: '🧭',
          content: { type: 'respiration', instruction: 'Avant de continuer, prends ce temps pour te reconnecter à ce qui compte pour toi.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
        peur_echec: {
          title: 'Se calmer avant d\'agir',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Avant de te lancer dans ce que tu repousses, prends ce temps pour calmer le corps.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
      },
    },
  },
  {
    index: 9,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'affirmation', base: '…', instruction: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        fatigue: {
          title: 'Le droit de se reposer',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Me reposer ne fait pas de moi ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        sens: {
          title: 'Ce qui compte pour moi',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Ce qui compte vraiment pour moi, c\'est ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        peur_echec: {
          title: 'Même si j\'échoue',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Même si j\'échoue, ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
      },
    },
  },
  // ── Niveaux 10 à 14 : partagés, clôture du parcours ─────────────────────
  {
    index: 10,
    title: 'Ta trousse à outils',
    emoji: '🧰',
    xp: 20,
    content: {
      type: 'journal_guide',
      prompts: [
        'Parmi les exercices précédents, lequel t\'a semblé le plus utile ?',
        'Comment tu peux le réutiliser la prochaine fois que la motivation baisse ?',
      ],
    },
  },
  {
    index: 11,
    title: 'Reconnaître les signaux tôt',
    emoji: '🚨',
    xp: 20,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quel est LE premier signal qui te dit que ta motivation commence à baisser ?',
      emotions: ['Envie de tout reporter', 'Fatigue dès le matin', 'Irritabilité', 'Perte d\'intérêt', 'Auto-critique qui monte', 'Envie de fuir dans autre chose'],
      multi: false,
    },
  },
  {
    index: 12,
    title: 'Ta phrase refuge',
    emoji: '🛟',
    xp: 20,
    content: {
      type: 'affirmation',
      base: 'Quand la motivation baisse, je me dis : ______.',
      instruction: 'Écris une phrase courte que tu pourras te répéter la prochaine fois — puis lis-la à voix haute.',
    },
  },
  {
    index: 13,
    title: 'Le chemin parcouru',
    emoji: '🧭',
    xp: 25,
    content: {
      type: 'reflexion',
      question: 'Est-ce que tu te relances différemment maintenant, comparé à avant ?',
      placeholder: 'Même un petit changement compte...',
      minLength: 10,
      recallLevelIndex: 3,
      recallIntro: 'Voici ce que tu avais écrit sur ce qui t\'a déjà aidé à te relancer :',
    },
  },
  {
    index: 14,
    title: 'Ton plan de relance',
    emoji: '🏁',
    xp: 30,
    content: {
      type: 'journal_guide',
      prompts: [
        'Qu\'est-ce que tu as appris sur ce qui te démotive vraiment ?',
        'Qu\'est-ce que tu veux mettre en place cette semaine pour tenir dans la durée ?',
      ],
    },
  },
];

// ── Parcours "Mieux me comprendre" — sixième parcours adaptatif, angle
// "pourquoi je fonctionne comme ça" (distinct de "connaitre", qui explore
// plutôt QUI on est). Branche sur le niveau 1 : réactions / décisions /
// autosabotage.
const COMPRENDRE_LEVELS: PathLevelDef[] = [
  {
    index: 0,
    title: 'Un moment surprenant',
    emoji: '🤔',
    xp: 10,
    content: {
      type: 'reflexion',
      question: 'Repense à un moment récent où tu t\'es surpris·e toi-même, en bien ou en mal. Qu\'est-ce qui s\'est passé ?',
      placeholder: 'Le moment, ce qui t\'a étonné·e...',
      minLength: 10,
    },
  },
  {
    index: 1,
    title: 'Ce qui est le plus flou',
    emoji: '🎯',
    xp: 10,
    content: {
      type: 'quiz_situation',
      scenario: 'Qu\'est-ce qui te semble le plus difficile à comprendre chez toi, en ce moment ?',
      options: [
        { label: 'Pourquoi je réagis parfois très fort à certaines choses', value: 'reactions' },
        { label: 'Pourquoi j\'ai autant de mal à me décider', value: 'decisions' },
        { label: 'Pourquoi je me mets parfois des bâtons dans les roues', value: 'autosabotage' },
      ],
    },
  },
  {
    index: 2,
    title: 'Ce que ça te fait ressentir',
    emoji: '🎭',
    xp: 15,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quand tu repenses à ce fonctionnement chez toi, qu\'est-ce que tu ressens ?',
      emotions: ['Confusion', 'Frustration', 'Curiosité', 'Agacement contre toi-même', 'Résignation', 'Envie de comprendre'],
      multi: true,
    },
  },
  {
    index: 3,
    title: 'Ce que tu as déjà remarqué',
    emoji: '🧰',
    xp: 15,
    content: {
      type: 'reflexion',
      question: 'Qu\'est-ce que tu as déjà remarqué, par toi-même, sur ce fonctionnement chez toi ?',
      placeholder: 'Même une intuition, un début de piste...',
      minLength: 10,
    },
  },
  // ── Niveaux 4 à 9 : branchés selon le niveau 1 ──────────────────────────
  {
    index: 4,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'reflexion', question: '…', placeholder: '…', minLength: 1 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        reactions: {
          title: 'Ce qui déclenche',
          emoji: '⚡',
          content: { type: 'reflexion', question: 'Quelle situation te fait réagir le plus fort, presque malgré toi ?', placeholder: 'Décris-la précisément...', minLength: 10 },
        },
        decisions: {
          title: 'La décision qui bloque',
          emoji: '🔀',
          content: { type: 'reflexion', question: 'Repense à une décision récente où tu as tourné en rond. Qu\'est-ce qui bloquait vraiment ?', placeholder: 'Le vrai obstacle, pas juste "je ne savais pas"...', minLength: 10 },
        },
        autosabotage: {
          title: 'Le frein que tu te mets',
          emoji: '🚧',
          content: { type: 'reflexion', question: 'Repense à un moment récent où tu as senti que tu te mettais toi-même des bâtons dans les roues. Lequel ?', placeholder: 'Sans te juger, juste décrire...', minLength: 10 },
        },
      },
    },
  },
  {
    index: 5,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'defi_reel', challenge: '…', confirmLabel: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        reactions: {
          title: 'La pause de 10 secondes',
          emoji: '⏸️',
          content: { type: 'defi_reel', challenge: 'La prochaine fois qu\'une réaction forte monte, attends 10 secondes avant de répondre, et observe juste ce qui se passe en toi.', confirmLabel: 'Je l\'ai fait' },
        },
        decisions: {
          title: 'Choisir sans reporter',
          emoji: '✅',
          content: { type: 'defi_reel', challenge: 'Prends UNE petite décision aujourd\'hui sans la reporter, même imparfaite.', confirmLabel: 'Je l\'ai fait' },
        },
        autosabotage: {
          title: 'Le pas suivant quand même',
          emoji: '🐾',
          content: { type: 'defi_reel', challenge: 'Repère-toi une fois aujourd\'hui en train de te freiner toi-même, et fais quand même le petit pas suivant.', confirmLabel: 'Je l\'ai fait' },
        },
      },
    },
  },
  {
    index: 6,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'tri_pensees', instruction: '…', categoryA: '…', categoryB: '…', items: [] },
    branch: {
      fromLevelIndex: 1,
      variants: {
        reactions: {
          title: 'Réaction ou automatisme',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque réaction selon ce qu\'elle représente pour toi.',
            categoryA: 'Une réaction qui me ressemble vraiment',
            categoryB: 'Un automatisme hérité',
            items: [
              { text: 'Défendre une valeur importante pour moi', category: 'A' },
              { text: 'Exploser parce que ça me rappelle une vieille blessure', category: 'B' },
              { text: 'Poser une limite claire', category: 'A' },
              { text: 'Réagir comme on réagissait chez moi, enfant', category: 'B' },
              { text: 'Dire ce que je pense vraiment', category: 'A' },
              { text: 'Réagir plus fort que la situation ne le mérite', category: 'B' },
            ],
          },
        },
        decisions: {
          title: 'Aide ou bloque',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque pensée selon son effet sur tes décisions.',
            categoryA: 'M\'aide à choisir',
            categoryB: 'Me fait tourner en rond',
            items: [
              { text: 'Qu\'est-ce qui compte le plus pour moi ici ?', category: 'A' },
              { text: 'Et si je regrettais mon choix ?', category: 'B' },
              { text: 'Je peux ajuster si ça ne marche pas', category: 'A' },
              { text: 'Il faut que je sois sûr·e à 100%', category: 'B' },
              { text: 'Je fais au mieux avec ce que je sais', category: 'A' },
              { text: 'Il y a forcément un meilleur choix que je n\'ai pas encore vu', category: 'B' },
            ],
          },
        },
        autosabotage: {
          title: 'Protège ou sabote',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque comportement selon ce qu\'il fait vraiment pour toi.',
            categoryA: 'Me protège vraiment',
            categoryB: 'Me sabote',
            items: [
              { text: 'Prendre le temps de me préparer', category: 'A' },
              { text: 'Tout reporter jusqu\'à la dernière minute', category: 'B' },
              { text: 'Demander de l\'aide quand j\'en ai besoin', category: 'A' },
              { text: 'Me convaincre que je n\'y arriverai pas avant même d\'essayer', category: 'B' },
              { text: 'Fixer des objectifs réalistes', category: 'A' },
              { text: 'Trouver une excuse pour ne pas commencer', category: 'B' },
            ],
          },
        },
      },
    },
  },
  {
    index: 7,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'cognitif', instruction: '…', thoughtPlaceholder: '…', reframePlaceholder: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        reactions: {
          title: 'Reformuler la réaction',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui accompagne tes réactions fortes, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Je ne me contrôle pas."',
            reframePlaceholder: 'Ex : "Ma réaction a une raison d\'être, même si elle est parfois trop forte."',
          },
        },
        decisions: {
          title: 'Reformuler l\'indécision',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te bloque avant de choisir, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Je dois être sûr·e à 100% avant de choisir."',
            reframePlaceholder: 'Ex : "Je peux choisir avec les informations que j\'ai maintenant, et ajuster ensuite."',
          },
        },
        autosabotage: {
          title: 'Reformuler le sabotage',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te pousse à te freiner toi-même, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Je ne mérite pas de réussir."',
            reframePlaceholder: 'Ex : "J\'ai le droit d\'avancer, même imparfaitement."',
          },
        },
      },
    },
  },
  {
    index: 8,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'respiration', instruction: '…', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        reactions: {
          title: 'Reprendre la main',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Quand une réaction forte monte, ce rythme aide à reprendre la main avant de répondre.', inhaleSeconds: 4, holdSeconds: 7, exhaleSeconds: 8, cycles: 4 },
        },
        decisions: {
          title: 'Clarifier l\'esprit',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Avant de trancher, prends ce temps pour clarifier ton esprit. Suis le rythme.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
        autosabotage: {
          title: 'Se recentrer',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Avant de commencer ce que tu repousses, prends ce temps pour te recentrer.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
      },
    },
  },
  {
    index: 9,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'affirmation', base: '…', instruction: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        reactions: {
          title: 'Ça a un sens',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Mes réactions ont un sens, même quand ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        decisions: {
          title: 'Je peux choisir',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Je peux choisir même sans être sûr·e de ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        autosabotage: {
          title: 'Je mérite d\'avancer',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Je mérite d\'avancer, même quand ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
      },
    },
  },
  // ── Niveaux 10 à 14 : partagés, clôture du parcours ─────────────────────
  {
    index: 10,
    title: 'Ta trousse à outils',
    emoji: '🧰',
    xp: 20,
    content: {
      type: 'journal_guide',
      prompts: [
        'Parmi les exercices précédents, lequel t\'a appris le plus sur toi ?',
        'Comment tu peux t\'en resservir la prochaine fois ?',
      ],
    },
  },
  {
    index: 11,
    title: 'Reconnaître les signaux tôt',
    emoji: '🚨',
    xp: 20,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quel est LE premier signal qui te dit que ce fonctionnement est en train de se déclencher ?',
      emotions: ['Tension soudaine', 'Envie de fuir la situation', 'Pensées qui s\'accélèrent', 'Voix intérieure critique', 'Envie de tout reporter', 'Besoin de contrôler'],
      multi: false,
    },
  },
  {
    index: 12,
    title: 'Ta phrase refuge',
    emoji: '🛟',
    xp: 20,
    content: {
      type: 'affirmation',
      base: 'Quand je ne me comprends pas, je me dis : ______.',
      instruction: 'Écris une phrase courte que tu pourras te répéter la prochaine fois — puis lis-la à voix haute.',
    },
  },
  {
    index: 13,
    title: 'Le chemin parcouru',
    emoji: '🧭',
    xp: 25,
    content: {
      type: 'reflexion',
      question: 'Qu\'est-ce qui a changé dans ta compréhension de toi-même depuis le début de ce parcours ?',
      placeholder: 'Même un petit changement compte...',
      minLength: 10,
      recallLevelIndex: 3,
      recallIntro: 'Voici ce que tu avais déjà remarqué, par toi-même, sur ce fonctionnement :',
    },
  },
  {
    index: 14,
    title: 'Ce que tu retiens de toi',
    emoji: '🏁',
    xp: 30,
    content: {
      type: 'journal_guide',
      prompts: [
        'Qu\'est-ce que tu as appris sur ta façon de fonctionner ?',
        'Comment veux-tu utiliser cette compréhension, maintenant ?',
      ],
    },
  },
];

// ── Parcours "Apprendre à mieux me connaître" — septième parcours adaptatif,
// angle "qui je suis" (valeurs / envies / fonctionnement) — distinct de
// "comprendre", qui explore plutôt le POURQUOI des réactions.
const CONNAITRE_LEVELS: PathLevelDef[] = [
  {
    index: 0,
    title: 'En une phrase',
    emoji: '💭',
    xp: 10,
    content: {
      type: 'reflexion',
      question: 'Si on te demandait maintenant "qui es-tu vraiment ?", que dirais-tu en une phrase, sans trop réfléchir ?',
      placeholder: 'La première chose qui te vient...',
      minLength: 10,
    },
  },
  {
    index: 1,
    title: 'Ce qui est le plus flou',
    emoji: '🎯',
    xp: 10,
    content: {
      type: 'quiz_situation',
      scenario: 'Qu\'est-ce qui te semble le plus flou aujourd\'hui, sur qui tu es ?',
      options: [
        { label: 'Ce qui compte vraiment pour moi, mes valeurs', value: 'valeurs' },
        { label: 'Ce que je veux vraiment, mes envies', value: 'envies' },
        { label: 'Comment je fonctionne, mes forces et mes limites', value: 'fonctionnement' },
      ],
    },
  },
  {
    index: 2,
    title: 'Ce que ça te fait ressentir',
    emoji: '🎭',
    xp: 15,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quand tu penses à cette question "qui suis-je ?", qu\'est-ce que tu ressens ?',
      emotions: ['Curiosité', 'Malaise', 'Excitation', 'Confusion', 'Impatience', 'Calme'],
      multi: true,
    },
  },
  {
    index: 3,
    title: 'Ce que tu sais déjà',
    emoji: '🧰',
    xp: 15,
    content: {
      type: 'reflexion',
      question: 'Qu\'est-ce que tu sais déjà, avec certitude, sur toi ?',
      placeholder: 'Même une seule chose, mais dont tu es sûr·e...',
      minLength: 10,
    },
  },
  // ── Niveaux 4 à 9 : branchés selon le niveau 1 ──────────────────────────
  {
    index: 4,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'reflexion', question: '…', placeholder: '…', minLength: 1 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        valeurs: {
          title: 'Un moment aligné',
          emoji: '🧭',
          content: { type: 'reflexion', question: 'Repense à un moment où tu t\'es senti·e vraiment aligné·e avec toi-même. Qu\'est-ce qui comptait, ce jour-là ?', placeholder: 'Le contexte, ce qui comptait vraiment...', minLength: 10 },
        },
        envies: {
          title: 'Si rien ne t\'arrêtait',
          emoji: '🌅',
          content: { type: 'reflexion', question: 'Si rien ne t\'en empêchait, qu\'est-ce que tu ferais différemment dans ta vie ?', placeholder: 'Laisse-toi rêver un peu...', minLength: 10 },
        },
        fonctionnement: {
          title: 'Quand tu es toi-même',
          emoji: '🔧',
          content: { type: 'reflexion', question: 'Dans quelles situations tu te sens le plus "toi-même", le plus naturel·le ?', placeholder: 'Décris une situation précise...', minLength: 10 },
        },
      },
    },
  },
  {
    index: 5,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'defi_reel', challenge: '…', confirmLabel: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        valeurs: {
          title: 'Choisir selon toi',
          emoji: '🧭',
          content: { type: 'defi_reel', challenge: 'Aujourd\'hui, fais un choix, même petit, en fonction de ce qui compte vraiment pour toi — pas de ce qu\'on attend de toi.', confirmLabel: 'Je l\'ai fait' },
        },
        envies: {
          title: 'Nommer une envie oubliée',
          emoji: '✨',
          content: { type: 'defi_reel', challenge: 'Note une envie que tu as mise de côté depuis longtemps, sans la juger ni te dire qu\'elle est irréaliste.', confirmLabel: 'Je l\'ai fait' },
        },
        fonctionnement: {
          title: 'S\'observer sans juger',
          emoji: '👁️',
          content: { type: 'defi_reel', challenge: 'Observe-toi une fois aujourd\'hui dans l\'action, sans te juger — juste noter ce que tu remarques sur ta façon de faire.', confirmLabel: 'Je l\'ai fait' },
        },
      },
    },
  },
  {
    index: 6,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'tri_pensees', instruction: '…', categoryA: '…', categoryB: '…', items: [] },
    branch: {
      fromLevelIndex: 1,
      variants: {
        valeurs: {
          title: 'Vraiment à moi ou attendu',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque phrase selon son origine.',
            categoryA: 'Vraiment à moi',
            categoryB: 'Attendu par les autres',
            items: [
              { text: 'Je veux être honnête, même quand c\'est inconfortable', category: 'A' },
              { text: 'Je dois réussir pour que mes parents soient fiers', category: 'B' },
              { text: 'La liberté compte énormément pour moi', category: 'A' },
              { text: 'Je dois avoir une vie qui ressemble à celle des autres', category: 'B' },
              { text: 'Prendre soin des gens que j\'aime, c\'est essentiel pour moi', category: 'A' },
              { text: 'Je dois suivre le chemin qu\'on a tracé pour moi', category: 'B' },
            ],
          },
        },
        envies: {
          title: 'Vraie envie ou pression',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque envie selon son origine réelle.',
            categoryA: 'Une vraie envie à moi',
            categoryB: 'Une pression extérieure',
            items: [
              { text: 'Ça m\'attire depuis que je suis enfant', category: 'A' },
              { text: 'Tout le monde fait ça, donc je devrais aussi', category: 'B' },
              { text: 'Rien que d\'y penser, ça m\'anime', category: 'A' },
              { text: 'C\'est ce qu\'il "faut" vouloir à mon âge', category: 'B' },
              { text: 'J\'y reviens sans arrêt dans mes pensées', category: 'A' },
              { text: 'Ça impressionnerait les autres', category: 'B' },
            ],
          },
        },
        fonctionnement: {
          title: 'Force ou limite',
          emoji: '⚖️',
          content: {
            type: 'tri_pensees',
            instruction: 'Range chaque trait selon ce qu\'il est vraiment pour toi.',
            categoryA: 'Une force chez moi',
            categoryB: 'Une limite chez moi',
            items: [
              { text: 'Je remarque des détails que d\'autres ratent', category: 'A' },
              { text: 'J\'ai du mal à démarrer sans cadre clair', category: 'B' },
              { text: 'J\'écoute vraiment les gens', category: 'A' },
              { text: 'Je remets facilement les choses à plus tard', category: 'B' },
              { text: 'Je m\'adapte vite aux imprévus', category: 'A' },
              { text: 'J\'ai du mal à dire ce dont j\'ai besoin', category: 'B' },
            ],
          },
        },
      },
    },
  },
  {
    index: 7,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'cognitif', instruction: '…', thoughtPlaceholder: '…', reframePlaceholder: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        valeurs: {
          title: 'Reformuler la pression',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te pousse à vouloir ce que les autres attendent, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Je devrais vouloir ce que les autres attendent de moi."',
            reframePlaceholder: 'Ex : "Ce qui compte pour moi a le droit d\'être différent de ce qu\'on attend."',
          },
        },
        envies: {
          title: 'Reformuler l\'envie',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te fait douter de tes envies, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Ce que je veux n\'est pas raisonnable."',
            reframePlaceholder: 'Ex : "Avoir cette envie ne m\'oblige à rien, mais j\'ai le droit de l\'écouter."',
          },
        },
        fonctionnement: {
          title: 'Reformuler la différence',
          emoji: '🔁',
          content: {
            type: 'cognitif',
            instruction: 'Repère la pensée qui te fait te comparer aux autres, puis reformule-la.',
            thoughtPlaceholder: 'Ex : "Je devrais fonctionner comme tout le monde."',
            reframePlaceholder: 'Ex : "Ma façon de fonctionner a ses forces, même si elle est différente."',
          },
        },
      },
    },
  },
  {
    index: 8,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 15,
    content: { type: 'respiration', instruction: '…', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
    branch: {
      fromLevelIndex: 1,
      variants: {
        valeurs: {
          title: 'Se recentrer sur soi',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Avant de continuer, prends ce temps pour te recentrer sur ce qui compte vraiment pour toi.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
        envies: {
          title: 'Écouter ses envies',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Prends ce temps pour laisser émerger, sans forcer, ce que tu as vraiment envie de faire.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
        fonctionnement: {
          title: 'S\'observer calmement',
          emoji: '🌬️',
          content: { type: 'respiration', instruction: 'Prends ce temps pour observer, sans juger, comment tu te sens là, maintenant.', inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6, cycles: 4 },
        },
      },
    },
  },
  {
    index: 9,
    title: 'À découvrir',
    emoji: '🔒',
    xp: 20,
    content: { type: 'affirmation', base: '…', instruction: '…' },
    branch: {
      fromLevelIndex: 1,
      variants: {
        valeurs: {
          title: 'Ce qui compte pour moi',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Ce qui compte vraiment pour moi, c\'est ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        envies: {
          title: 'Le droit de vouloir',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'J\'ai le droit de vouloir ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
        fonctionnement: {
          title: 'Je fonctionne bien quand',
          emoji: '🪞',
          content: { type: 'affirmation', base: 'Je fonctionne bien quand ______.', instruction: 'Complète cette phrase avec ce qui est vrai pour toi, puis lis-la à voix haute.' },
        },
      },
    },
  },
  // ── Niveaux 10 à 14 : partagés, clôture du parcours ─────────────────────
  {
    index: 10,
    title: 'Ta trousse à outils',
    emoji: '🧰',
    xp: 20,
    content: {
      type: 'journal_guide',
      prompts: [
        'Parmi les exercices précédents, lequel t\'a appris le plus sur toi ?',
        'Comment tu peux garder ça en tête au quotidien ?',
      ],
    },
  },
  {
    index: 11,
    title: 'Reconnaître ce qui te ressemble',
    emoji: '✨',
    xp: 20,
    content: {
      type: 'reconnaissance_emotion',
      situation: 'Quand tu fais quelque chose qui te ressemble vraiment, qu\'est-ce que tu ressens ?',
      emotions: ['Alignement', 'Calme', 'Énergie', 'Fierté', 'Légèreté', 'Confiance'],
      multi: false,
    },
  },
  {
    index: 12,
    title: 'Ta phrase refuge',
    emoji: '🛟',
    xp: 20,
    content: {
      type: 'affirmation',
      base: 'Quand je doute de qui je suis, je me dis : ______.',
      instruction: 'Écris une phrase courte que tu pourras te répéter la prochaine fois — puis lis-la à voix haute.',
    },
  },
  {
    index: 13,
    title: 'Le chemin parcouru',
    emoji: '🧭',
    xp: 25,
    content: {
      type: 'reflexion',
      question: 'Qu\'est-ce que tu comprends de toi maintenant, que tu ne voyais pas clairement avant ce parcours ?',
      placeholder: 'Même un petit changement compte...',
      minLength: 10,
      recallLevelIndex: 3,
      recallIntro: 'Voici ce que tu savais déjà, avec certitude, sur toi :',
    },
  },
  {
    index: 14,
    title: 'Qui tu es, aujourd\'hui',
    emoji: '🏁',
    xp: 30,
    content: {
      type: 'journal_guide',
      prompts: [
        'Qu\'est-ce que tu as appris sur qui tu es, pendant ce parcours ?',
        'Comment veux-tu continuer à mieux te connaître, maintenant ?',
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
  {
    key: 'stress',
    onboardingGoal: 'Gérer mon stress',
    title: 'Gérer mon stress',
    tagline: '15 niveaux qui s\'adaptent à toi, selon d\'où vient vraiment ton stress.',
    emoji: '🌊',
    accentVar: '--fam-nt',
    levels: STRESS_LEVELS,
  },
  {
    key: 'emotions',
    onboardingGoal: 'Mieux comprendre mes émotions',
    title: 'Mieux comprendre mes émotions',
    tagline: '15 niveaux qui s\'adaptent à ce qui est le plus dur pour toi face à une émotion forte.',
    emoji: '🎭',
    accentVar: '--fam-nf',
    levels: EMOTIONS_LEVELS,
  },
  {
    key: 'relations',
    onboardingGoal: 'Améliorer mes relations',
    title: 'Améliorer mes relations',
    tagline: '15 niveaux qui s\'adaptent à ce qui te pèse le plus dans tes relations.',
    emoji: '🧑‍🤝‍🧑',
    accentVar: '--fam-sj',
    levels: RELATIONS_LEVELS,
  },
  {
    key: 'motivation',
    onboardingGoal: 'Retrouver de la motivation',
    title: 'Retrouver de la motivation',
    tagline: '15 niveaux qui s\'adaptent à ce qui te freine vraiment.',
    emoji: '🔥',
    accentVar: '--fam-sp',
    levels: MOTIVATION_LEVELS,
  },
  {
    key: 'comprendre',
    onboardingGoal: 'Mieux me comprendre',
    title: 'Mieux me comprendre',
    tagline: '15 niveaux qui s\'adaptent à ce qui est le plus flou dans ton fonctionnement.',
    emoji: '🤔',
    accentVar: '--fam-nt',
    levels: COMPRENDRE_LEVELS,
  },
  {
    key: 'connaitre',
    onboardingGoal: 'Apprendre à mieux me connaître',
    title: 'Apprendre à mieux me connaître',
    tagline: '15 niveaux qui s\'adaptent à ce qui est le plus flou sur qui tu es.',
    emoji: '💭',
    accentVar: '--fam-nf',
    levels: CONNAITRE_LEVELS,
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
