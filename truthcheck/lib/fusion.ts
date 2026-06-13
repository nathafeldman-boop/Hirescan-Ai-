// ─── Fusion — groupe personality engine ──────────────────────────────────────
// 50 questions · 3 options each · 6 archetypes · random 15-question draw

export type FusionArchetype = 'V' | 'A' | 'S' | 'D' | 'E' | 'R';
export type FusionAnswer = 'A' | 'B' | 'C';

export interface FusionQuestion {
  id: number;
  text: string;
  optionA: { text: string; archetype: FusionArchetype };
  optionB: { text: string; archetype: FusionArchetype };
  optionC: { text: string; archetype: FusionArchetype };
}

export interface FusionType {
  id: FusionArchetype;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  forces: string[];
  faiblesses: string[];
  risques: string[];
  potentiel: string;
  style: string;
  accentColor: string;
}

// ─── 50-question bank ─────────────────────────────────────────────────────────

export const fusionQuestions: FusionQuestion[] = [
  { id: 1,  text: "Quand le groupe doit trancher entre deux options, il préfère...", optionA: { text: "Débattre jusqu'à la meilleure solution logique", archetype: 'S' }, optionB: { text: "S'assurer que tout le monde est à l'aise avec le choix", archetype: 'D' }, optionC: { text: "Tester rapidement et voir ce qui fonctionne", archetype: 'E' } },
  { id: 2,  text: "Face à un nouveau projet, la première réaction collective est de...", optionA: { text: "Imaginer tout ce que ça pourrait devenir", archetype: 'V' }, optionB: { text: "Définir les étapes et les responsabilités", archetype: 'A' }, optionC: { text: "Questionner si c'est vraiment la bonne direction", archetype: 'R' } },
  { id: 3,  text: "Quand quelqu'un propose une idée originale, le groupe tend à...", optionA: { text: "S'emballer et chercher comment aller encore plus loin", archetype: 'E' }, optionB: { text: "Analyser les risques et les implications", archetype: 'S' }, optionC: { text: "Voir comment l'intégrer dans ce qui existe déjà", archetype: 'D' } },
  { id: 4,  text: "Le style de leadership naturel du groupe est...", optionA: { text: "Un leader fort qui trace la direction", archetype: 'S' }, optionB: { text: "Un système où tout le monde co-décide", archetype: 'D' }, optionC: { text: "Chacun fait ce qu'il fait le mieux, sans hiérarchie rigide", archetype: 'E' } },
  { id: 5,  text: "Quand ça va mal dans le groupe, la réaction collective est de...", optionA: { text: "Analyser ce qui a merdé et corriger le tir", archetype: 'S' }, optionB: { text: "Se soutenir et avancer ensemble", archetype: 'D' }, optionC: { text: "Tout remettre en question et repartir sur de nouvelles bases", archetype: 'R' } },
  { id: 6,  text: "Pour ce groupe, le succès c'est...", optionA: { text: "Atteindre l'objectif fixé avec rigueur", archetype: 'A' }, optionB: { text: "Créer quelque chose que personne n'avait encore fait", archetype: 'V' }, optionC: { text: "Que tout le monde soit fier de la façon dont ça s'est passé", archetype: 'D' } },
  { id: 7,  text: "En réunion, ce groupe préfère...", optionA: { text: "Un agenda clair avec des points définis à l'avance", archetype: 'A' }, optionB: { text: "Laisser la conversation se dérouler naturellement", archetype: 'E' }, optionC: { text: "Commencer par les enjeux stratégiques, puis détailler", archetype: 'S' } },
  { id: 8,  text: "Face à deux approches très différentes, le groupe...", optionA: { text: "Compare les avantages et inconvénients objectivement", archetype: 'S' }, optionB: { text: "Tente de combiner les deux en quelque chose de nouveau", archetype: 'V' }, optionC: { text: "Vote ou trouve un compromis acceptable pour tous", archetype: 'D' } },
  { id: 9,  text: "Le rapport du groupe à la routine est...", optionA: { text: "On l'accepte quand elle sert l'objectif global", archetype: 'S' }, optionB: { text: "On la fuit — la variété est notre moteur", archetype: 'E' }, optionC: { text: "On la structure pour être plus efficace", archetype: 'A' } },
  { id: 10, text: "Quand une règle semble injuste ou dépassée, le groupe...", optionA: { text: "La suit quand même pour éviter les frictions", archetype: 'D' }, optionB: { text: "La remet en question et propose une alternative", archetype: 'R' }, optionC: { text: "L'analyse avant de décider quoi en faire", archetype: 'S' } },
  { id: 11, text: "Notre façon de travailler ressemble à...", optionA: { text: "Un tableau blanc rempli d'idées dans tous les sens", archetype: 'V' }, optionB: { text: "Un plan projet structuré avec des jalons clairs", archetype: 'A' }, optionC: { text: "Une succession d'expériences qu'on affine au fil du temps", archetype: 'E' } },
  { id: 12, text: "Pour ce groupe, la créativité c'est...", optionA: { text: "Le moteur principal de tout ce qu'on fait", archetype: 'V' }, optionB: { text: "Un outil parmi d'autres quand les problèmes le nécessitent", archetype: 'S' }, optionC: { text: "Ce qui émerge naturellement quand on collabore bien", archetype: 'D' } },
  { id: 13, text: "Face à l'incertitude, ce groupe...", optionA: { text: "Cartographie ce qu'on sait et ce qu'on ne sait pas", archetype: 'A' }, optionB: { text: "Fait confiance à son instinct collectif", archetype: 'E' }, optionC: { text: "Cherche le scénario le plus probable et planifie", archetype: 'S' } },
  { id: 14, text: "Notre rapport aux délais est...", optionA: { text: "Sacrés — on s'organise pour les respecter", archetype: 'A' }, optionB: { text: "Flexibles — la qualité et l'impact priment", archetype: 'V' }, optionC: { text: "À négocier selon l'avancement réel", archetype: 'E' } },
  { id: 15, text: "Quand on doit innover, on préfère...", optionA: { text: "Chercher ce que personne n'a encore essayé", archetype: 'R' }, optionB: { text: "Améliorer ce qui existe en le poussant au maximum", archetype: 'S' }, optionC: { text: "Partir des besoins réels et construire depuis là", archetype: 'D' } },
  { id: 16, text: "Notre ambition collective est de...", optionA: { text: "Changer quelque chose de fondamental dans notre domaine", archetype: 'V' }, optionB: { text: "Être la référence incontestable dans notre secteur", archetype: 'S' }, optionC: { text: "Créer un environnement où chacun s'épanouit", archetype: 'D' } },
  { id: 17, text: "Quand une tâche est répétitive et nécessaire, le groupe...", optionA: { text: "L'automatise ou l'optimise dès que possible", archetype: 'A' }, optionB: { text: "La partage équitablement pour ne pas épuiser quelqu'un", archetype: 'D' }, optionC: { text: "La délègue au plus efficient pour avancer", archetype: 'S' } },
  { id: 18, text: "Le groupe apprend mieux...", optionA: { text: "En testant et en se trompant", archetype: 'E' }, optionB: { text: "En étudiant ce que les meilleurs ont fait avant", archetype: 'S' }, optionC: { text: "En débattant et confrontant les points de vue", archetype: 'R' } },
  { id: 19, text: "Notre rapport à la compétition est...", optionA: { text: "On préfère collaborer plutôt que concurrencer", archetype: 'D' }, optionB: { text: "La compétition nous motive — on veut être les meilleurs", archetype: 'S' }, optionC: { text: "On se bat contre nous-mêmes — c'est notre standard qui compte", archetype: 'V' } },
  { id: 20, text: "Quand le groupe réussit quelque chose d'important, il...", optionA: { text: "Analyse ce qui a marché pour le reproduire", archetype: 'A' }, optionB: { text: "Célèbre ensemble et recharge ses batteries", archetype: 'D' }, optionC: { text: "Se demande déjà comment aller encore plus loin", archetype: 'V' } },
  { id: 21, text: "Face à un conflit interne, ce groupe a tendance à...", optionA: { text: "L'adresser frontalement et tout mettre sur la table", archetype: 'R' }, optionB: { text: "Chercher le compromis qui satisfait tout le monde", archetype: 'D' }, optionC: { text: "Identifier la source du problème et le résoudre", archetype: 'S' } },
  { id: 22, text: "Quand quelqu'un ne tient pas ses engagements...", optionA: { text: "On lui en parle directement et on ajuste", archetype: 'S' }, optionB: { text: "On cherche d'abord à comprendre pourquoi", archetype: 'D' }, optionC: { text: "On redistribue les tâches pragmatiquement", archetype: 'A' } },
  { id: 23, text: "Les désaccords dans ce groupe sont vus comme...", optionA: { text: "Des signaux à traiter rapidement pour avancer", archetype: 'A' }, optionB: { text: "Des opportunités d'enrichir la réflexion collective", archetype: 'E' }, optionC: { text: "Naturels et parfois utiles pour progresser", archetype: 'R' } },
  { id: 24, text: "Quand quelqu'un propose une idée que personne n'aime, le groupe...", optionA: { text: "Explique honnêtement pourquoi ça ne marche pas", archetype: 'R' }, optionB: { text: "Cherche les aspects positifs à conserver", archetype: 'D' }, optionC: { text: "Demande des précisions avant de se prononcer", archetype: 'S' } },
  { id: 25, text: "La cohésion du groupe repose sur...", optionA: { text: "Des valeurs et une vision partagées", archetype: 'V' }, optionB: { text: "La confiance bâtie à travers les projets passés", archetype: 'A' }, optionC: { text: "Le respect mutuel et la bienveillance quotidienne", archetype: 'D' } },
  { id: 26, text: "Quand la pression monte, le groupe...", optionA: { text: "Se resserre et s'entraide encore plus", archetype: 'D' }, optionB: { text: "Se concentre sur l'essentiel et élimine le superflu", archetype: 'S' }, optionC: { text: "Puise dans sa créativité pour trouver des solutions inattendues", archetype: 'E' } },
  { id: 27, text: "Notre tolérance à l'ambiguïté est...", optionA: { text: "Faible — on préfère des rôles et responsabilités clairs", archetype: 'A' }, optionB: { text: "Haute — on se sent à l'aise dans le flou", archetype: 'E' }, optionC: { text: "Moyenne — on tolère l'incertitude si on a une direction", archetype: 'V' } },
  { id: 28, text: "Quand un projet échoue, le groupe...", optionA: { text: "Fait un post-mortem rigoureux pour ne pas répéter", archetype: 'A' }, optionB: { text: "En tire les enseignements et repart directement", archetype: 'E' }, optionC: { text: "Prend le temps de digérer avant de repartir", archetype: 'D' } },
  { id: 29, text: "Ce qui soude le plus ce groupe c'est...", optionA: { text: "Les défis qu'on a surmontés ensemble", archetype: 'S' }, optionB: { text: "Les moments de création et d'invention commune", archetype: 'V' }, optionC: { text: "Le respect et la compréhension profonde de chacun", archetype: 'D' } },
  { id: 30, text: "En cas de désaccord stratégique majeur, on...", optionA: { text: "Suit la personne qui a le plus d'expertise sur le sujet", archetype: 'S' }, optionB: { text: "Vote — la majorité tranche", archetype: 'D' }, optionC: { text: "Expérimente les deux approches si c'est possible", archetype: 'E' } },
  { id: 31, text: "Notre style de communication est plutôt...", optionA: { text: "Direct et factuel — on va droit au but", archetype: 'S' }, optionB: { text: "Chaleureux et inclusif — on s'assure que tout le monde est entendu", archetype: 'D' }, optionC: { text: "Imaginatif et associatif — on suit les idées où elles mènent", archetype: 'V' } },
  { id: 32, text: "Dans ce groupe, les réunions sont...", optionA: { text: "Efficaces et courtes — on respecte le temps de chacun", archetype: 'A' }, optionB: { text: "Ouvertes — les meilleures idées émergent souvent de l'informel", archetype: 'E' }, optionC: { text: "Importantes pour maintenir la cohésion", archetype: 'D' } },
  { id: 33, text: "Quand le groupe doit convaincre quelqu'un, il mise sur...", optionA: { text: "Des arguments logiques et des données solides", archetype: 'S' }, optionB: { text: "Une vision inspirante et des exemples concrets", archetype: 'V' }, optionC: { text: "La confiance et les relations humaines", archetype: 'D' } },
  { id: 34, text: "Le ton naturel de ce groupe est...", optionA: { text: "Enthousiaste et énergique", archetype: 'E' }, optionB: { text: "Calme et réfléchi", archetype: 'A' }, optionC: { text: "Passionné et direct, parfois tranchant", archetype: 'R' } },
  { id: 35, text: "Quand on décrit ce groupe à l'extérieur, on parle surtout de...", optionA: { text: "Ce qu'on a accompli et nos résultats concrets", archetype: 'A' }, optionB: { text: "Ce qu'on veut créer et où on veut aller", archetype: 'V' }, optionC: { text: "Comment on fonctionne ensemble et nos valeurs", archetype: 'D' } },
  { id: 36, text: "La décision finale appartient...", optionA: { text: "À celui qui a le plus de recul sur la situation", archetype: 'S' }, optionB: { text: "Au collectif après un vrai débat", archetype: 'D' }, optionC: { text: "À celui dont c'est la responsabilité directe", archetype: 'A' } },
  { id: 37, text: "Ce groupe communique mieux...", optionA: { text: "Par écrit — on structure nos pensées avant", archetype: 'A' }, optionB: { text: "À l'oral — les échanges font émerger les idées", archetype: 'E' }, optionC: { text: "De façon directe, en tête-à-tête quand c'est important", archetype: 'R' } },
  { id: 38, text: "Pour attirer de nouveaux membres, on mise sur...", optionA: { text: "Notre vision et ce qu'on va accomplir ensemble", archetype: 'V' }, optionB: { text: "Notre culture et la qualité de nos relations", archetype: 'D' }, optionC: { text: "Nos résultats et notre expertise prouvée", archetype: 'S' } },
  { id: 39, text: "Quand quelqu'un fait une erreur, on...", optionA: { text: "L'analyse calmement pour éviter qu'elle se reproduise", archetype: 'A' }, optionB: { text: "Passe à autre chose — l'erreur fait partie du process", archetype: 'E' }, optionC: { text: "S'assure que la personne se sent soutenue malgré tout", archetype: 'D' } },
  { id: 40, text: "Notre feedback est généralement...", optionA: { text: "Précis et orienté amélioration", archetype: 'S' }, optionB: { text: "Encourageant avant d'être critique", archetype: 'D' }, optionC: { text: "Honnête même si ça peut faire mal — c'est ça qu'on respecte", archetype: 'R' } },
  { id: 41, text: "Pour ce groupe, la prise de risque c'est...", optionA: { text: "Nécessaire pour avancer — on accepte de se tromper", archetype: 'E' }, optionB: { text: "Calculée — on évalue bien avant de sauter", archetype: 'S' }, optionC: { text: "Parfois indispensable pour rompre avec le statu quo", archetype: 'R' } },
  { id: 42, text: "Notre horizon temporel privilégié est...", optionA: { text: "Le long terme — on construit quelque chose qui dure", archetype: 'V' }, optionB: { text: "Le moyen terme — on planifie sur 3 à 6 mois", archetype: 'A' }, optionC: { text: "L'immédiat — on s'adapte en temps réel", archetype: 'E' } },
  { id: 43, text: "Ce qui motive le plus ce groupe c'est...", optionA: { text: "Créer quelque chose de nouveau et de significatif", archetype: 'V' }, optionB: { text: "Atteindre l'excellence dans ce qu'on fait", archetype: 'S' }, optionC: { text: "Progresser ensemble et voir chacun s'épanouir", archetype: 'D' } },
  { id: 44, text: "Notre rapport à l'autorité externe est...", optionA: { text: "On la respecte mais on sait quand la remettre en question", archetype: 'R' }, optionB: { text: "On joue selon les règles tout en cherchant à les influencer", archetype: 'S' }, optionC: { text: "On s'en affranchit quand elle ne sert pas notre objectif", archetype: 'E' } },
  { id: 45, text: "La plus grande force de ce groupe c'est...", optionA: { text: "Sa capacité à voir ce que les autres ne voient pas encore", archetype: 'V' }, optionB: { text: "Son organisation et sa rigueur dans l'exécution", archetype: 'A' }, optionC: { text: "Sa cohésion et sa capacité à traverser les épreuves ensemble", archetype: 'D' } },
  { id: 46, text: "Notre rapport à la nouveauté est...", optionA: { text: "On la cherche activement — c'est notre mode naturel", archetype: 'E' }, optionB: { text: "On la crée nous-mêmes plutôt que de l'attendre", archetype: 'R' }, optionC: { text: "On l'évalue soigneusement avant de l'adopter", archetype: 'S' } },
  { id: 47, text: "Dans 5 ans, ce groupe aura...", optionA: { text: "Transformé quelque chose de fondamental dans son domaine", archetype: 'V' }, optionB: { text: "Construit quelque chose de solide et qui dure", archetype: 'A' }, optionC: { text: "Créé des opportunités inédites que personne n'avait anticipées", archetype: 'E' } },
  { id: 48, text: "Ce qui rend ce groupe différent des autres c'est...", optionA: { text: "Sa manière d'aborder les problèmes sous un angle inattendu", archetype: 'R' }, optionB: { text: "La qualité de ses relations et de son fonctionnement interne", archetype: 'D' }, optionC: { text: "Son ambition et sa capacité à penser grand", archetype: 'V' } },
  { id: 49, text: "Ce groupe au sommet de sa forme ressemble à...", optionA: { text: "Une machine bien huilée qui avance avec régularité", archetype: 'A' }, optionB: { text: "Une équipe de sportifs en état de flow collectif", archetype: 'E' }, optionC: { text: "Un conseil stratégique qui décode les situations complexes", archetype: 'S' } },
  { id: 50, text: "Ce que ce groupe laissera comme trace c'est...", optionA: { text: "Un modèle que d'autres voudront reproduire", archetype: 'V' }, optionB: { text: "Des résultats concrets et mesurables", archetype: 'A' }, optionC: { text: "L'impact positif sur les personnes qui en font partie", archetype: 'D' } },
];

// ─── 6 Fusion types ───────────────────────────────────────────────────────────

export const fusionTypes: Record<FusionArchetype, FusionType> = {
  V: {
    id: 'V',
    name: 'Les Visionnaires',
    emoji: '🔭',
    tagline: 'Vous voyez ce que les autres ne verront que demain',
    description: "Votre groupe ne se contente pas du présent — il l'anticipe. Les Visionnaires sont des penseurs en avance sur leur temps, animés par des idées qui dérangent, fascinent et finalement transforment. Quand vous vous réunissez, quelque chose de nouveau émerge toujours.",
    forces: ['Capacité à anticiper les tendances', 'Pensée créative et originale', 'Inspiration naturelle pour les autres', 'Vision long-terme cohérente', 'Aptitude rare à créer du sens'],
    faiblesses: ["Difficulté à passer de l'idée à l'exécution", 'Impatience avec les détails pratiques', 'Tendance à sous-estimer les contraintes', 'Risque de dispersion sur trop de projets'],
    risques: ["Perdre de vue les priorités immédiates", "Frustration si l'environnement ne suit pas votre rythme"],
    potentiel: "Vous avez le potentiel de créer quelque chose que personne n'a encore osé. Vos idées méritent d'être structurées et portées jusqu'au bout — c'est là que votre impact sera maximum.",
    style: "Associatif, enthousiaste, ouvert. Vous passez d'une idée à l'autre avec une fluidité qui peut dérouter mais qui est en réalité votre plus grande force.",
    accentColor: '#7c3aed',
  },
  A: {
    id: 'A',
    name: 'Les Architectes',
    emoji: '🏗️',
    tagline: 'Vous construisez ce que les autres ne font que rêver',
    description: "Les Architectes transforment les idées en réalité. Votre groupe est la force tranquille qui avance avec méthode, sans bruit, mais avec une efficacité redoutable. Là où d'autres improvisent, vous construisez des systèmes qui durent.",
    forces: ['Organisation et rigueur exemplaires', 'Fiabilité et respect des engagements', 'Capacité à gérer la complexité', 'Clarté dans les rôles et responsabilités', 'Qualité d\'exécution constante'],
    faiblesses: ['Résistance au changement de cap', "Difficulté à s'adapter à l'imprévu", "Tendance à trop planifier avant d'agir", 'Rigidité potentielle dans les méthodes'],
    risques: ["S'enfermer dans des process au détriment de l'innovation", 'Sous-estimer la dimension humaine et relationnelle'],
    potentiel: "Votre capacité à transformer les idées en systèmes fonctionnels est rare. Cultivez aussi l'adaptabilité — les meilleurs Architectes sont ceux qui savent quand revoir les plans.",
    style: "Structuré, précis, factuel. Vous préférez les écrits aux discussions orales et les décisions basées sur des données réelles.",
    accentColor: '#0891b2',
  },
  S: {
    id: 'S',
    name: 'Les Stratèges',
    emoji: '♟️',
    tagline: "Vous pensez à cinq coups d'avance",
    description: "Les Stratèges sont les maîtres du jeu. Votre groupe analyse, anticipe et positionne. Vous avez un don naturel pour voir les opportunités avant les autres et pour naviguer dans les environnements complexes avec une clarté désarmante.",
    forces: ['Analyse rapide et pertinente des situations', 'Leadership naturel et décision assumée', 'Capacité à prioriser sous pression', 'Sens de la compétition sain et motivant', 'Vision à la fois stratégique et tactique'],
    faiblesses: ["Impatience avec ceux qui pensent moins vite", 'Difficulté à laisser place aux émotions dans les décisions', 'Risque de négliger le chemin au profit du résultat'],
    risques: ['Épuiser les membres moins orientés performance', 'Négliger la culture d\'équipe au profit des objectifs'],
    potentiel: "Vos résultats seront remarquables si vous apprenez à emmener tout le monde avec vous. Un bon Stratège gagne les batailles. Un grand Stratège gagne sans perdre ses alliés.",
    style: "Direct, analytique, orienté résultats. Vos réunions sont efficaces et vos décisions, rapides et assumées.",
    accentColor: '#dc2626',
  },
  D: {
    id: 'D',
    name: 'Les Diplomates',
    emoji: '🕊️',
    tagline: 'Vous créez les espaces où les gens s\'épanouissent',
    description: "Les Diplomates sont le ciment du monde. Votre groupe possède une intelligence émotionnelle collective rare : vous créez des environnements où chacun se sent entendu, valorisé et capable du meilleur. Cette harmonie est votre plus grande force — et votre plus grand défi.",
    forces: ['Intelligence émotionnelle collective élevée', 'Capacité à résoudre les conflits avec bienveillance', 'Loyauté et cohésion exceptionnelles', 'Inclusion naturelle et écoute profonde', 'Stabilité dans les moments de crise'],
    faiblesses: ['Évitement des confrontations nécessaires', 'Décisions parfois lentes par souci de consensus', 'Difficulté à trancher quand ça déplairait à quelqu\'un', "Risque de prioriser l'harmonie sur la performance"],
    risques: ["Accumuler des non-dits qui finissent par exploser", "Manquer d'ambition collective par peur de déstabiliser"],
    potentiel: "Votre capacité à créer de la cohésion est rare et précieuse. Apprenez à dire les vérités difficiles avec bienveillance — c'est ça la vraie diplomatie.",
    style: "Chaleureux, inclusif, à l'écoute. Vous prenez le temps d'intégrer tout le monde avant d'avancer.",
    accentColor: '#0ea5e9',
  },
  E: {
    id: 'E',
    name: 'Les Explorateurs',
    emoji: '🧭',
    tagline: 'Vous trouvez des chemins là où les autres ne voient que des murs',
    description: "Les Explorateurs ne connaissent pas la monotonie. Votre groupe est en perpétuel mouvement, curieux de tout, adaptable à l'extrême. Vous apprenez en faisant, échouez vite pour recommencer mieux, et votre énergie collective est contagieuse.",
    forces: ['Adaptabilité et flexibilité exceptionnelles', 'Créativité dans la résolution de problèmes', 'Énergie et enthousiasme naturels', 'Apprentissage rapide par expérimentation', 'Capacité à pivoter sans se déstabiliser'],
    faiblesses: ['Difficulté à maintenir le cap sur le long terme', 'Tendance à la dispersion', 'Impatience avec les processus et la planification', "Risque d'abandonner des projets avant leur terme"],
    risques: ['Manquer de rigueur dans l\'exécution', 'Brûler des étapes importantes par impatience'],
    potentiel: "Votre capacité d'adaptation est une arme extraordinaire dans un monde qui change vite. Cultivez aussi la patience — les plus grandes aventures prennent du temps.",
    style: "Dynamique, informel, associatif. Vous vous ennuyez vite des formats rigides et préférez les échanges spontanés.",
    accentColor: '#f59e0b',
  },
  R: {
    id: 'R',
    name: 'Les Rebelles',
    emoji: '⚡',
    tagline: 'Vous existez pour changer ce que tout le monde accepte',
    description: "Les Rebelles sont les perturbateurs positifs. Votre groupe remet en question ce que les autres tiennent pour acquis. Vous n'acceptez pas le statu quo et vous avez une capacité rare à pointer les incohérences que tout le monde fait semblant de ne pas voir.",
    forces: ['Courage de remettre en question le statu quo', 'Pensée indépendante et originale', 'Capacité à voir les angles morts collectifs', 'Honnêteté parfois déroutante mais toujours utile', 'Potentiel disruptif élevé'],
    faiblesses: ['Difficulté à accepter les compromis nécessaires', 'Tendance à la confrontation pour la confrontation', 'Risque d\'isolement si le contexte n\'est pas prêt', 'Impatience avec les processus établis'],
    risques: ['Aliéner des partenaires importants', 'Passer pour des agitateurs plutôt que des innovateurs'],
    potentiel: "Votre force de remise en question est précieuse. Apprenez à choisir vos batailles — et à construire des coalitions. Un Rebelle seul peut déranger. Une équipe de Rebelles organisés peut changer le monde.",
    style: "Direct, parfois provocateur, toujours honnête. Vous dites ce que les autres pensent sans oser le formuler.",
    accentColor: '#ec4899',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateFusionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function selectRandomQuestions(count = 15): number[] {
  const ids = fusionQuestions.map(q => q.id);
  const shuffled = [...ids].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export interface ParticipantAnswers {
  answers: Record<number, FusionAnswer>;
}

export interface FusionResult {
  type: FusionType;
  compatibility: number; // 60-100
  dominantForce: string;
  mainRisk: string;
}

export function computeFusionResult(
  questionIds: number[],
  participants: ParticipantAnswers[]
): FusionResult {
  if (participants.length === 0 || questionIds.length === 0) {
    return {
      type: fusionTypes['D'],
      compatibility: 70,
      dominantForce: fusionTypes['D'].forces[0],
      mainRisk: fusionTypes['D'].risques[0],
    };
  }

  const scores: Record<FusionArchetype, number> = { V: 0, A: 0, S: 0, D: 0, E: 0, R: 0 };
  const questions = fusionQuestions.filter(q => questionIds.includes(q.id));

  // Tally archetype points from all participants
  for (const p of participants) {
    for (const q of questions) {
      const ans = p.answers[q.id];
      if (!ans) continue;
      const pole = ans === 'A' ? q.optionA.archetype : ans === 'B' ? q.optionB.archetype : q.optionC.archetype;
      scores[pole]++;
    }
  }

  // Winning archetype
  const winner = (Object.entries(scores) as [FusionArchetype, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // Compatibility: how much participants agreed
  let agreedScore = 0;
  let totalComparisons = 0;
  for (const q of questions) {
    const answerCounts: Record<string, number> = {};
    for (const p of participants) {
      const a = p.answers[q.id];
      if (a) answerCounts[a] = (answerCounts[a] ?? 0) + 1;
    }
    const maxCount = Math.max(...Object.values(answerCounts), 0);
    agreedScore += maxCount / participants.length;
    totalComparisons++;
  }
  const avgAgreement = totalComparisons > 0 ? agreedScore / totalComparisons : 0.7;
  const compatibility = Math.round(60 + avgAgreement * 40);

  const type = fusionTypes[winner];
  return {
    type,
    compatibility,
    dominantForce: type.forces[0],
    mainRisk: type.risques[0],
  };
}
