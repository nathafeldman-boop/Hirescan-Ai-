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
