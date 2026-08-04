export interface ComparisonRow {
  label: string;
  urcecret: string;
  other: string;
}

export interface ComparisonPageData {
  slug: string;
  otherName: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  intro: string;
  fairnessNote: string;
  rows: ComparisonRow[];
  verdict: string;
  faqs: { q: string; a: string }[];
}

export const COMPARISON_PAGES: Record<string, ComparisonPageData> = {
  chatgpt: {
    slug: 'chatgpt',
    otherName: 'ChatGPT',
    h1: 'UrCecret vs ChatGPT pour mieux se comprendre',
    metaTitle: 'UrCecret vs ChatGPT pour se comprendre soi-même — les vraies différences',
    metaDesc: "Peut-on utiliser ChatGPT à la place d'une application de développement personnel comme UrCecret ? Comparaison honnête : ce que chaque outil fait bien, et ce qu'il ne fait pas.",
    keywords: ['urcecret vs chatgpt', 'chatgpt développement personnel', 'ia pour se comprendre soi-même', 'test personnalité vs chatgpt'],
    intro: "De plus en plus de gens demandent directement à ChatGPT de les aider à mieux se comprendre — et ça peut être un bon point de départ. La question n'est pas laquelle des deux IA est \"meilleure\" en général, mais ce que chacune fait structurellement bien pour cet usage précis.",
    fairnessNote: "ChatGPT est un excellent outil généraliste pour réfléchir à voix haute — ce n'est pas une critique de l'outil, mais une différence d'objectif : ChatGPT est conçu pour répondre à n'importe quelle question, UrCecret est conçu spécifiquement pour la connaissance de soi dans la durée.",
    rows: [
      { label: 'Point de départ', urcecret: 'Un test de personnalité structuré (16 types, fonctions cognitives) qui donne un vocabulaire commun dès le premier jour.', other: "Une page blanche — il faut savoir quoi demander, et reformuler le contexte à chaque nouvelle conversation." },
      { label: 'Mémoire de ton profil', urcecret: "Ton profil, ton objectif personnel et l'historique de ton Journal sont automatiquement réinjectés dans chaque échange avec Elio.", other: "Dépend de la mémoire activée par défaut sur le compte, généralement plus générale et moins structurée autour d'un profil psychologique précis." },
      { label: 'Suivi dans le temps', urcecret: "Un Journal quotidien dédié qui construit un historique consultable de ton humeur et de ton évolution.", other: "Pas de suivi structuré natif — chaque conversation reste indépendante sauf recherche manuelle dans l'historique." },
      { label: 'Parcours guidés', urcecret: "Des programmes de 15 niveaux par objectif (confiance, stress, relations...) qui s'adaptent à tes réponses.", other: "Aucun programme structuré — tout dépend des questions que tu poses toi-même." },
      { label: 'Coût', urcecret: 'Test gratuit, accompagnement à partir de 1,99 €/mois.', other: 'Gratuit en usage limité, abonnement Plus à partir de ~20$/mois pour un usage plus large (pas spécifique au développement personnel).' },
    ],
    verdict: "Si tu veux poser une question précise une seule fois, ChatGPT fait très bien le travail. Si tu veux un accompagnement structuré qui garde ton profil et ton objectif en mémoire au fil des semaines, c'est exactement ce pour quoi UrCecret est construit.",
    faqs: [
      { q: 'Puis-je juste demander à ChatGPT mon type MBTI ?', a: "Oui, mais sans un vrai test structuré, ChatGPT devine à partir de ce que tu lui racontes — le résultat dépend fortement de la façon dont tu formules la conversation, contrairement à un test standardisé à questions fixes." },
      { q: 'UrCecret utilise-t-il aussi de l\'intelligence artificielle ?', a: "Oui — Elio, le coach conversationnel d'UrCecret, est propulsé par des modèles de langage, mais il est spécifiquement configuré avec ton profil de personnalité et ton historique, contrairement à une conversation généraliste." },
      { q: 'Est-ce que je peux utiliser les deux ?', a: "Beaucoup d'utilisateurs le font — le test UrCecret comme point de départ structuré, puis ChatGPT ou Elio pour approfondir selon le moment. Ce ne sont pas des outils mutuellement exclusifs." },
    ],
  },

  '16personalities': {
    slug: '16personalities',
    otherName: '16Personalities',
    h1: 'UrCecret vs 16Personalities',
    metaTitle: 'UrCecret vs 16Personalities — quel test de personnalité choisir ?',
    metaDesc: 'Les deux tests utilisent un cadre à 16 types, mais ne proposent pas la même chose après le résultat. Comparaison sur le contenu, la langue, et l\'accompagnement dans la durée.',
    keywords: ['urcecret vs 16personalities', '16personalities alternative', 'meilleur test mbti', 'test personnalité français'],
    intro: "16Personalities est l'un des tests de personnalité les plus connus au monde, basé sur un cadre à 16 types proche du MBTI. UrCecret utilise le même type de cadre théorique (les 16 types issus de la typologie jungienne) — la vraie différence se joue après le résultat.",
    fairnessNote: "16Personalities a un rapport détaillé et bien construit — ce n'est pas un test moins sérieux. La différence porte sur ce qui se passe une fois le résultat obtenu, pas sur la qualité du test lui-même.",
    rows: [
      { label: 'Langue et marché', urcecret: 'Conçu et rédigé en français dès le départ, pas une traduction.', other: 'Outil anglophone, traduit dans de nombreuses langues dont le français.' },
      { label: 'Après le résultat', urcecret: "Un coach IA (Elio) qui continue la conversation, un Journal quotidien, et des parcours guidés par objectif.", other: 'Un rapport détaillé à lire, sans accompagnement continu intégré après la lecture.' },
      { label: 'Suivi dans le temps', urcecret: "Historique du Journal consultable, pensé pour un usage quotidien.", other: 'Le résultat reste statique — pas de suivi d\'évolution intégré à l\'outil gratuit.' },
      { label: 'Coût', urcecret: 'Test gratuit, profil complet + coach IA à partir de 1,99 €/mois.', other: 'Test gratuit, rapport premium en paiement unique ou abonnement.' },
    ],
    verdict: "Les deux tests reposent sur un cadre théorique proche. Le choix se fait surtout sur ce que tu veux après avoir lu ton résultat : un rapport à lire une fois (16Personalities), ou un accompagnement qui continue au quotidien (UrCecret).",
    faqs: [
      { q: '16Personalities et UrCecret donnent-ils le même résultat ?', a: "Les deux s'appuient sur un cadre à 16 types proche, donc le type obtenu est généralement cohérent d'un test à l'autre, même si les questions posées et l'algorithme précis diffèrent." },
      { q: 'Pourquoi refaire un test si j\'ai déjà mon type via 16Personalities ?', a: "Si tu connais déjà ton type, tu peux passer directement à l'accompagnement (Elio, Journal, parcours) sans refaire tout le test — l'intérêt d'UrCecret n'est pas de retrouver ton type, mais ce qui vient après." },
    ],
  },
};

export const COMPARISON_SLUGS = Object.keys(COMPARISON_PAGES);
