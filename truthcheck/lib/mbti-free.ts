// ── Données MBTI GRATUITES ────────────────────────────────────────────────
// Champs sûrs pour le bundle client (composants 'use client'). Ne JAMAIS
// ajouter ici un champ payant (fullDesc, inLove, atWork, strengths,
// weaknesses, growth, famousExamples, compatibleWith) — voir mbti-premium.ts,
// qui n'est importé que côté serveur. Généré par extraction programmatique
// depuis lib/mbti.ts (intégrité vérifiée octet par octet), texte inchangé.

export interface MbtiTypeFree {
  code: string;
  name: string;
  tagline: string;
  emoji: string;
  accentColor: string;
  rarity: string;
  shortDesc: string;
  traits: string[];
}

export const mbtiTypesFree: Record<string, MbtiTypeFree> = {
  "INTJ": {
    "code": "INTJ",
    "name": "L'Architecte",
    "tagline": "Stratège visionnaire, perfectionniste solitaire",
    "emoji": "🏛️",
    "accentColor": "#6366f1",
    "rarity": "2%",
    "shortDesc": "L'Architecte est l'un des types les plus rares et les plus stratégiques. Tu vois les systèmes là où les autres voient du chaos. Tu planifies sur le long terme avec une précision redoutable, et tu n'as besoin de l'approbation de personne pour avancer.",
    "traits": [
      "Stratégique",
      "Indépendant",
      "Déterminé",
      "Perfectionniste",
      "Visionnaire"
    ]
  },
  "INTP": {
    "code": "INTP",
    "name": "Le Logicien",
    "tagline": "Penseur abstrait, chercheur de vérité ultime",
    "emoji": "🔬",
    "accentColor": "#8b5cf6",
    "rarity": "3%",
    "shortDesc": "Le Logicien est mû par une soif insatiable de comprendre comment les choses fonctionnent. Tu analyses, déconstruis, et reconstruis les idées avec une précision chirurgicale. Tu es le type de personne qui passe des heures dans ta tête à résoudre des problèmes que personne d'autre ne voit même.",
    "traits": [
      "Analytique",
      "Original",
      "Curieux",
      "Objectif",
      "Absent(e)"
    ]
  },
  "ENTJ": {
    "code": "ENTJ",
    "name": "Le Commandant",
    "tagline": "Né(e) pour diriger, intransigeant(e) sur l'excellence",
    "emoji": "⚔️",
    "accentColor": "#dc2626",
    "rarity": "3%",
    "shortDesc": "Le Commandant est le leader naturel du spectre des personnalités. Tu vois les inefficacités là où les autres voient la norme, et tu n'as aucune hésitation à tout réorganiser pour le mieux. Charismatique, ambitieux(se) et stratégique — tu es fait(e) pour prendre les commandes.",
    "traits": [
      "Leadership naturel",
      "Ambitieux(se)",
      "Décisif(ve)",
      "Efficace",
      "Exigeant(e)"
    ]
  },
  "ENTP": {
    "code": "ENTP",
    "name": "Le Débatteur",
    "tagline": "Provocateur intellectuel, amoureux du paradoxe",
    "emoji": "⚡",
    "accentColor": "#f59e0b",
    "rarity": "3%",
    "shortDesc": "Le Débatteur est l'avocat du diable par excellence. Tu adores questionner les idées reçues, retourner les arguments, et trouver les failles dans ce que tout le monde considère comme évident. Brillant(e), rapide et légèrement agaçant(e) pour ceux qui n'aiment pas être challengés.",
    "traits": [
      "Inventif(ve)",
      "Stratégique",
      "Entreprenant(e)",
      "Charismatique",
      "Provocateur(trice)"
    ]
  },
  "INFJ": {
    "code": "INFJ",
    "name": "L'Avocat",
    "tagline": "Le type le plus rare — visionnaire discret au grand cœur",
    "emoji": "🌙",
    "accentColor": "#7c3aed",
    "rarity": "1.5%",
    "shortDesc": "L'Avocat est le type le plus rare au monde. Tu combines une intuition profonde sur les motivations humaines avec un désir sincère de faire le bien. Tu vois ce que les autres ne voient pas, tu ressens ce que les autres ne disent pas, et tu portes souvent le poids du monde sur tes épaules.",
    "traits": [
      "Intuitif(ve)",
      "Altruiste",
      "Déterminé(e)",
      "Idéaliste",
      "Mystérieux(se)"
    ]
  },
  "INFP": {
    "code": "INFP",
    "name": "Le Médiateur",
    "tagline": "Rêveur idéaliste en quête de sens et d'authenticité",
    "emoji": "🌿",
    "accentColor": "#10b981",
    "rarity": "4%",
    "shortDesc": "Le Médiateur est mû par des valeurs profondes et une quête permanente d'authenticité. Tu ressens les émotions avec une intensité que peu comprennent, tu crois en un monde meilleur et tu consacres ton énergie à y contribuer à ta façon. Tu es souvent plus complexe que tu n'y parais.",
    "traits": [
      "Idéaliste",
      "Empathique",
      "Créatif(ve)",
      "Réservé(e)",
      "Fidèle à soi-même"
    ]
  },
  "ENFJ": {
    "code": "ENFJ",
    "name": "Le Protagoniste",
    "tagline": "Leader charismatique qui inspire par l'exemple",
    "emoji": "🌟",
    "accentColor": "#f97316",
    "rarity": "2.5%",
    "shortDesc": "Le Protagoniste est le leader du cœur. Tu as un don naturel pour percevoir les potentiels humains et pour inspirer les autres à se dépasser. Tu consacres ton énergie aux autres avec une générosité parfois épuisante, et tu portes souvent les problèmes de ceux que tu aimes comme si c'étaient les tiens.",
    "traits": [
      "Charismatique",
      "Altruiste",
      "Inspirant(e)",
      "Empathique",
      "Idéaliste"
    ]
  },
  "ENFP": {
    "code": "ENFP",
    "name": "Le Champion",
    "tagline": "Énergie contagieuse, imagination débordante",
    "emoji": "🦋",
    "accentColor": "#ec4899",
    "rarity": "8%",
    "shortDesc": "Le Champion voit le monde comme un terrain d'aventures infini. Tu es enthousiaste, créatif(ve) et profondément convaincu(e) que tout est possible. Tu as un talent rare pour connecter les gens et les idées de façon inattendue, et ton énergie est souvent contagieuse.",
    "traits": [
      "Enthousiaste",
      "Créatif(ve)",
      "Sociable",
      "Curieux(se)",
      "Imprévisible"
    ]
  },
  "ISTJ": {
    "code": "ISTJ",
    "name": "L'Inspecteur",
    "tagline": "Pilier de fiabilité absolue dans un monde chaotique",
    "emoji": "🗂️",
    "accentColor": "#64748b",
    "rarity": "13%",
    "shortDesc": "L'Inspecteur est la colonne vertébrale de toute organisation. Tu tiens tes engagements avec une rigueur que peu peuvent égaler. Méhodique, discret(e) et absolument fiable, tu fais partie des rares personnes qui font ce qu'elles disent, quand elles le disent.",
    "traits": [
      "Fiable",
      "Méthodique",
      "Honnête",
      "Patient(e)",
      "Traditionnel(le)"
    ]
  },
  "ISFJ": {
    "code": "ISFJ",
    "name": "Le Défenseur",
    "tagline": "Protecteur silencieux, loyal jusqu'à l'épuisement",
    "emoji": "🛡️",
    "accentColor": "#0ea5e9",
    "rarity": "13%",
    "shortDesc": "Le Défenseur est peut-être le type le plus généreux et le moins reconnu. Tu te sacrifies pour ceux que tu aimes avec une discrétion totale. Tu as une mémoire prodigieuse pour les détails qui comptent aux autres — leurs anniversaires, leurs plats préférés, leurs peurs secrètes.",
    "traits": [
      "Généreux(se)",
      "Loyal(e)",
      "Attentif(ve)",
      "Organisé(e)",
      "Discret(e)"
    ]
  },
  "ESTJ": {
    "code": "ESTJ",
    "name": "Le Directeur",
    "tagline": "Organisateur naturel, garant de l'ordre et de l'efficacité",
    "emoji": "📋",
    "accentColor": "#0891b2",
    "rarity": "11%",
    "shortDesc": "Le Directeur est la personne qui prend les commandes quand personne d'autre ne le fait. Tu as un sens naturel de l'organisation, tu sais déléguer efficacement et tu t'assures que tout le monde fait sa part. Tu n'as pas de patience pour les excuses.",
    "traits": [
      "Décisif(ve)",
      "Organisé(e)",
      "Loyal(e)",
      "Honnête",
      "Exigeant(e)"
    ]
  },
  "ESFJ": {
    "code": "ESFJ",
    "name": "Le Consul",
    "tagline": "Hôte/Hôtesse né(e), gardien(ne) de l'harmonie sociale",
    "emoji": "🤝",
    "accentColor": "#84cc16",
    "rarity": "12%",
    "shortDesc": "Le Consul est la personne qui s'assure que tout le monde va bien dans la pièce. Tu es profondément à l'écoute des besoins de ton entourage, tu crées des liens facilement et tu t'épanouis dans les environnements sociaux chaleureux.",
    "traits": [
      "Sociable",
      "Loyal(e)",
      "Attentif(ve)",
      "Organisé(e)",
      "Généreux(se)"
    ]
  },
  "ISTP": {
    "code": "ISTP",
    "name": "Le Technicien",
    "tagline": "Maître de la mécanique et de l'improvisation",
    "emoji": "🔧",
    "accentColor": "#78716c",
    "rarity": "5%",
    "shortDesc": "Le Technicien est fasciné par la façon dont les choses fonctionnent. Tu as un talent naturel pour comprendre les systèmes, les réparer et les optimiser. Tu es efficace, calme sous pression et tu préfères l'action aux théories.",
    "traits": [
      "Pragmatique",
      "Réservé(e)",
      "Curieux(se)",
      "Calme",
      "Indépendant(e)"
    ]
  },
  "ISFP": {
    "code": "ISFP",
    "name": "L'Artiste",
    "tagline": "Âme créative, sensible et profondément authentique",
    "emoji": "🎨",
    "accentColor": "#f472b6",
    "rarity": "9%",
    "shortDesc": "L'Artiste vit pleinement dans le moment présent, avec une sensibilité esthétique rare. Tu exprimes ta vision du monde à travers ce que tu crées — musique, art, cuisine, design ou simplement ta façon d'être. Tu es discret(e) mais profondément authentique.",
    "traits": [
      "Sensible",
      "Créatif(ve)",
      "Spontané(e)",
      "Loyal(e)",
      "Discret(e)"
    ]
  },
  "ESTP": {
    "code": "ESTP",
    "name": "L'Entrepreneur",
    "tagline": "Action d'abord, réflexion ensuite — et ça marche",
    "emoji": "🔥",
    "accentColor": "#ef4444",
    "rarity": "4%",
    "shortDesc": "L'Entrepreneur vit dans l'action, pas dans les plans. Tu perçois les opportunités avant les autres et tu passes à l'action sans te laisser paralyser par l'analyse. Charismatique, pragmatique et toujours au centre de ce qui se passe.",
    "traits": [
      "Audacieux(se)",
      "Direct(e)",
      "Perceptif(ve)",
      "Énergique",
      "Pragmatique"
    ]
  },
  "ESFP": {
    "code": "ESFP",
    "name": "L'Animateur",
    "tagline": "La vie est une scène — et tu es né(e) pour y briller",
    "emoji": "🎉",
    "accentColor": "#f59e0b",
    "rarity": "9%",
    "shortDesc": "L'Animateur est la vie de la fête — et pas par hasard. Tu as un don naturel pour créer de la joie autour de toi, pour mettre les gens à l'aise et pour transformer n'importe quelle situation ordinaire en moment mémorable.",
    "traits": [
      "Spontané(e)",
      "Enthousiaste",
      "Généreux(se)",
      "Amusant(e)",
      "Sensible"
    ]
  }
};

export const ALL_MBTI_TYPES = Object.keys(mbtiTypesFree);
