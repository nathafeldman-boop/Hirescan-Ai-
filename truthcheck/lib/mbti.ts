// MBTI-equivalent personality test — French version
// 4 dimensions × 6 questions = 24 questions total
// E/I · S/N · T/F · J/P

export interface MbtiQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  optionA: { text: string; pole: 'E' | 'S' | 'T' | 'J' };
  optionB: { text: string; pole: 'I' | 'N' | 'F' | 'P' };
}

export interface MbtiType {
  code: string;
  name: string;
  tagline: string;
  emoji: string;
  accentColor: string;
  rarity: string; // % de la population
  shortDesc: string; // free — 3 phrases
  traits: string[];
  // paid sections
  fullDesc: string;
  inLove: string;
  atWork: string;
  strengths: string[];
  weaknesses: string[];
  growth: string;
  famousExamples: string[];
  compatibleWith: string[];
}

export const mbtiQuestions: MbtiQuestion[] = [
  // ── E vs I ──
  { id: 1,  dimension: 'EI', text: 'En soirée entre amis, tu te sens plutôt…',
    optionA: { text: 'Rechargé(e) et stimulé(e) par les échanges', pole: 'E' },
    optionB: { text: 'Épuisé(e) et tu as envie de rentrer', pole: 'I' } },
  { id: 2,  dimension: 'EI', text: 'Pour travailler efficacement, tu préfères…',
    optionA: { text: 'Un open space, ça me stimule', pole: 'E' },
    optionB: { text: 'Être seul(e) dans un espace calme', pole: 'I' } },
  { id: 3,  dimension: 'EI', text: 'Après une journée chargée, tu te ressources…',
    optionA: { text: 'En sortant voir du monde', pole: 'E' },
    optionB: { text: 'En restant seul(e) chez toi', pole: 'I' } },
  { id: 4,  dimension: 'EI', text: 'Face à un groupe d\'inconnus, tu…',
    optionA: { text: 'Vas naturellement vers les autres', pole: 'E' },
    optionB: { text: 'Attends qu\'on t\'approche d\'abord', pole: 'I' } },
  { id: 5,  dimension: 'EI', text: 'Tes meilleures idées viennent…',
    optionA: { text: 'En échangeant avec d\'autres', pole: 'E' },
    optionB: { text: 'En réfléchissant seul(e)', pole: 'I' } },
  { id: 6,  dimension: 'EI', text: 'Comment tu te décrirais spontanément ?',
    optionA: { text: 'Expressif(ve) et sociable', pole: 'E' },
    optionB: { text: 'Réservé(e) et introspectif(ve)', pole: 'I' } },

  // ── S vs N ──
  { id: 7,  dimension: 'SN', text: 'En résolvant un problème, tu te concentres sur…',
    optionA: { text: 'Les faits concrets et ce qui est prouvé', pole: 'S' },
    optionB: { text: 'Les possibilités et schémas sous-jacents', pole: 'N' } },
  { id: 8,  dimension: 'SN', text: 'Tu fais plus confiance à…',
    optionA: { text: 'Ton expérience et tes sens', pole: 'S' },
    optionB: { text: 'Ton intuition et tes pressentiments', pole: 'N' } },
  { id: 9,  dimension: 'SN', text: 'Face à une nouvelle tâche, tu préfères…',
    optionA: { text: 'Des instructions claires étape par étape', pole: 'S' },
    optionB: { text: 'Comprendre le concept global et improviser', pole: 'N' } },
  { id: 10, dimension: 'SN', text: 'Ce qui t\'intéresse le plus dans un projet…',
    optionA: { text: 'Le comment : l\'exécution pratique', pole: 'S' },
    optionB: { text: 'Le pourquoi : le sens et la vision', pole: 'N' } },
  { id: 11, dimension: 'SN', text: 'Tu es plutôt quelqu\'un de…',
    optionA: { text: 'Réaliste et ancré(e) dans le présent', pole: 'S' },
    optionB: { text: 'Imaginatif(ve) et tourné(e) vers l\'avenir', pole: 'N' } },
  { id: 12, dimension: 'SN', text: 'Dans une conversation, tu retiens surtout…',
    optionA: { text: 'Les faits et détails précis', pole: 'S' },
    optionB: { text: 'Les connexions et le sens global', pole: 'N' } },

  // ── T vs F ──
  { id: 13, dimension: 'TF', text: 'En prenant une décision difficile, tu te bases sur…',
    optionA: { text: 'La logique et l\'analyse objective', pole: 'T' },
    optionB: { text: 'Tes valeurs et l\'impact humain', pole: 'F' } },
  { id: 14, dimension: 'TF', text: 'Face à un conflit, tu cherches d\'abord…',
    optionA: { text: 'La solution logique, même si elle dérange', pole: 'T' },
    optionB: { text: 'L\'harmonie et que tout le monde se sente bien', pole: 'F' } },
  { id: 15, dimension: 'TF', text: 'Quand un ami a tort, tu…',
    optionA: { text: 'Le lui dis franchement', pole: 'T' },
    optionB: { text: 'Trouves une façon douce d\'aborder le sujet', pole: 'F' } },
  { id: 16, dimension: 'TF', text: 'Ce qui compte le plus dans une décision…',
    optionA: { text: 'Que ce soit juste et cohérent', pole: 'T' },
    optionB: { text: 'Que tout le monde soit à l\'aise', pole: 'F' } },
  { id: 17, dimension: 'TF', text: 'On te décrit plutôt comme…',
    optionA: { text: 'Rationnel(le) et objectif(ve)', pole: 'T' },
    optionB: { text: 'Empathique et chaleureux(se)', pole: 'F' } },
  { id: 18, dimension: 'TF', text: 'La critique est utile si elle est…',
    optionA: { text: 'Honnête, même si c\'est dur à entendre', pole: 'T' },
    optionB: { text: 'Bienveillante et respectueuse des émotions', pole: 'F' } },

  // ── J vs P ──
  { id: 19, dimension: 'JP', text: 'Ton espace de travail et ton agenda sont…',
    optionA: { text: 'Organisés, structurés, planifiés', pole: 'J' },
    optionB: { text: 'Flexibles, tu t\'adaptes au fil de l\'eau', pole: 'P' } },
  { id: 20, dimension: 'JP', text: 'Face à un projet important, tu…',
    optionA: { text: 'Planifies en avance et tu suis le plan', pole: 'J' },
    optionB: { text: 'Gardes tes options ouvertes et improvises', pole: 'P' } },
  { id: 21, dimension: 'JP', text: 'Quand un projet est terminé, tu ressens…',
    optionA: { text: 'Du soulagement — c\'est fini, enfin !', pole: 'J' },
    optionB: { text: 'De l\'ennui — tu passes déjà à autre chose', pole: 'P' } },
  { id: 22, dimension: 'JP', text: 'Tes délais, tu…',
    optionA: { text: 'Les respectes toujours, tu anticipes', pole: 'J' },
    optionB: { text: 'Travailles souvent à la dernière minute', pole: 'P' } },
  { id: 23, dimension: 'JP', text: 'Ta liste de tâches est…',
    optionA: { text: 'Détaillée et mise à jour régulièrement', pole: 'J' },
    optionB: { text: 'Approximative ou inexistante', pole: 'P' } },
  { id: 24, dimension: 'JP', text: 'Tu te décrirais plutôt comme…',
    optionA: { text: 'Méthodique et structuré(e)', pole: 'J' },
    optionB: { text: 'Spontané(e) et adaptable', pole: 'P' } },
];

export function computeMbtiType(answers: Record<number, 'A' | 'B'>): string {
  let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;
  for (const q of mbtiQuestions) {
    const ans = answers[q.id];
    if (!ans) continue;
    const pole = ans === 'A' ? q.optionA.pole : q.optionB.pole;
    if (pole === 'E') E++;
    else if (pole === 'I') I++;
    else if (pole === 'S') S++;
    else if (pole === 'N') N++;
    else if (pole === 'T') T++;
    else if (pole === 'F') F++;
    else if (pole === 'J') J++;
    else if (pole === 'P') P++;
  }
  return `${E >= I ? 'E' : 'I'}${S >= N ? 'S' : 'N'}${T >= F ? 'T' : 'F'}${J >= P ? 'J' : 'P'}`;
}

export const mbtiTypes: Record<string, MbtiType> = {
  INTJ: {
    code: 'INTJ', name: "L'Architecte", tagline: "Stratège visionnaire, perfectionniste solitaire", emoji: '🏛️', accentColor: '#6366f1', rarity: '2%',
    shortDesc: "L'Architecte est l'un des types les plus rares et les plus stratégiques. Tu vois les systèmes là où les autres voient du chaos. Tu planifies sur le long terme avec une précision redoutable, et tu n'as besoin de l'approbation de personne pour avancer.",
    traits: ['Stratégique', 'Indépendant', 'Déterminé', 'Perfectionniste', 'Visionnaire'],
    fullDesc: "Les INTJ représentent une combinaison rare : l'intuition d'un visionnaire et la rigueur d'un stratège. Tu fonctionnes avec des systèmes mentaux complexes que peu de gens comprennent. Tu es capable d'anticiper des problèmes que les autres n'ont pas encore vus, et tu élabores des plans pour les résoudre bien avant qu'ils se manifestent. Cette capacité de prévision te rend redoutablement efficace — mais parfois incompris(e) de ton entourage.",
    inLove: "En amour, l'INTJ cherche un(e) partenaire intellectuellement stimulant(e) qui respecte son besoin d'indépendance. Tu n'es pas démonstratif(ve) mais tes actes valent mille mots affectueux. Tu peux sembler froid(e), mais ta loyauté est totale envers ceux que tu choisis. Tu as du mal à exprimer tes émotions verbalement et tu préfères les montrer à travers tes actions et ton engagement.",
    atWork: "Au travail, l'INTJ excelle dans les postes qui exigent vision à long terme et autonomie. Tu es fait(e) pour diriger des projets complexes, pas pour des réunions sans fin. Tu produis ton meilleur travail quand on te fait confiance et qu'on te laisse de la marge. Les environnements bureaucratiques t'étouffent.",
    strengths: ['Pensée stratégique à long terme', 'Capacité à résoudre des problèmes complexes', 'Autonomie et autodiscipline', 'Confiance en ses propres analyses', 'Efficacité et orientation résultats'],
    weaknesses: ['Tendance à l\'arrogance intellectuelle', 'Difficulté à exprimer ses émotions', 'Impatience envers les "moins rapides"', 'Rigidité face aux plans qui changent', 'Isolement social par choix'],
    growth: "Ton plus grand défi : accepter que l'intelligence émotionnelle est aussi une forme d'intelligence. Apprends à valoriser les contributions des autres même quand leur raisonnement est différent du tien. Exprime tes sentiments — pas parce que c'est nécessaire à ta survie, mais parce que ça enrichit ta vie et tes relations.",
    famousExamples: ['Elon Musk', 'Mark Zuckerberg', 'Friedrich Nietzsche', 'Isaac Newton', 'Michelle Obama'],
    compatibleWith: ['ENFP', 'ENTP', 'INFJ', 'INFP'],
  },
  INTP: {
    code: 'INTP', name: "Le Logicien", tagline: "Penseur abstrait, chercheur de vérité ultime", emoji: '🔬', accentColor: '#8b5cf6', rarity: '3%',
    shortDesc: "Le Logicien est mû par une soif insatiable de comprendre comment les choses fonctionnent. Tu analyses, déconstruis, et reconstruis les idées avec une précision chirurgicale. Tu es le type de personne qui passe des heures dans ta tête à résoudre des problèmes que personne d'autre ne voit même.",
    traits: ['Analytique', 'Original', 'Curieux', 'Objectif', 'Absent(e)'],
    fullDesc: "Les INTP sont les philosophes et théoriciens du spectre. Tu as un don naturel pour voir les incohérences dans les systèmes de pensée que les autres tiennent pour acquis. Ta curiosité intellectuelle n'a pas de limites — tu peux passer d'un sujet à un autre en suivant le fil de ta logique interne, accumulant des connaissances dans des domaines très variés. Tu valorises la vérité au-dessus de tout, y compris au-dessus du confort social.",
    inLove: "En amour, tu cherches une connexion intellectuelle profonde avant tout. Sans stimulation mentale, une relation t'ennuie rapidement. Tu peux sembler absent(e) ou distant(e), mais c'est souvent parce que ton esprit est ailleurs — pas parce que tu t'en fiches. Tu as du mal avec les attentes émotionnelles non formulées.",
    atWork: "Tu brilles dans les domaines qui exigent pensée originale : sciences, tech, philosophie, recherche. Tu trouves la routine étouffante mais tu es capable de te concentrer pendant des heures sur ce qui t'intéresse. Tu travailles mieux seul(e) et tu préfères les idées aux procédures.",
    strengths: ['Pensée analytique hors pair', 'Créativité dans la résolution de problèmes', 'Objectivité radicale', 'Apprentissage rapide et autodidacte', 'Ouverture à remettre en question ses propres croyances'],
    weaknesses: ['Procrastination chronique', 'Difficulté à finaliser les projets', 'Insensibilité involontaire', 'Tendance à trop analyser les décisions simples', 'Négligence des besoins pratiques quotidiens'],
    growth: "Ton défi principal est de passer de la réflexion à l'action. Tes idées méritent d'exister dans le monde réel, pas seulement dans ta tête. Apprends aussi à reconnaître les besoins émotionnels des autres — pas parce que c'est logique, mais parce que les relations humaines ont leur propre forme de richesse.",
    famousExamples: ['Albert Einstein', 'Bill Gates', 'Blaise Pascal', 'René Descartes', 'Larry Page'],
    compatibleWith: ['ENTJ', 'ESTJ', 'INFJ', 'ENFJ'],
  },
  ENTJ: {
    code: 'ENTJ', name: "Le Commandant", tagline: "Né(e) pour diriger, intransigeant(e) sur l'excellence", emoji: '⚔️', accentColor: '#dc2626', rarity: '3%',
    shortDesc: "Le Commandant est le leader naturel du spectre des personnalités. Tu vois les inefficacités là où les autres voient la norme, et tu n'as aucune hésitation à tout réorganiser pour le mieux. Charismatique, ambitieux(se) et stratégique — tu es fait(e) pour prendre les commandes.",
    traits: ['Leadership naturel', 'Ambitieux(se)', 'Décisif(ve)', 'Efficace', 'Exigeant(e)'],
    fullDesc: "Les ENTJ sont rarissimes parmi les personnes qui atteignent réellement leurs ambitions démesurées. Tu combines vision à long terme, capacité d'exécution et magnétisme naturel. Tu vois chaque défi comme une opportunité d'optimisation. Tu es à l'aise pour prendre des décisions difficiles et tu n'attends pas le consensus pour avancer. Cette énergie fait de toi un(e) leader redoutable — mais parfois un(e) partenaire ou ami(e) épuisant(e).",
    inLove: "En amour, tu cherches quelqu'un qui partage tes ambitions et qui peut te tenir tête intellectuellement. Tu n'as aucune patience pour les jeux ou l'ambiguïté. Tu es direct(e) — parfois trop — mais ta loyauté envers ton partenaire est absolue. Tu dois apprendre à ralentir et à laisser de l'espace à l'autre.",
    atWork: "Tu es dans ton élément en position de leadership. PDG, entrepreneur, direction de projets : tu te nourris de responsabilités et de défis complexes. Tu peux avoir du mal à déléguer parce que tu sais que tu ferais mieux. Apprends à faire confiance à ton équipe.",
    strengths: ['Vision stratégique exceptionnelle', 'Capacité de décision sous pression', 'Énergie et motivation contagieuses', 'Efficacité dans l\'exécution', 'Pensée à grande échelle'],
    weaknesses: ['Impatience avec les autres', 'Tendance à dominer les conversations', 'Difficulté à reconnaître ses erreurs', 'Manque d\'empathie apparent', 'Exigences irréalistes envers les autres'],
    growth: "Tu dois apprendre que diriger ne signifie pas tout contrôler. Les meilleures équipes naissent de la confiance, pas de la domination. Développe ton empathie — elle te rendra non seulement plus humain(e), mais aussi plus efficace.",
    famousExamples: ['Napoleon Bonaparte', 'Gordon Ramsay', 'Sheryl Sandberg', 'Jack Welch', 'Franklin Roosevelt'],
    compatibleWith: ['INTP', 'INFP', 'ISTP', 'INTJ'],
  },
  ENTP: {
    code: 'ENTP', name: "Le Débatteur", tagline: "Provocateur intellectuel, amoureux du paradoxe", emoji: '⚡', accentColor: '#f59e0b', rarity: '3%',
    shortDesc: "Le Débatteur est l'avocat du diable par excellence. Tu adores questionner les idées reçues, retourner les arguments, et trouver les failles dans ce que tout le monde considère comme évident. Brillant(e), rapide et légèrement agaçant(e) pour ceux qui n'aiment pas être challengés.",
    traits: ['Inventif(ve)', 'Stratégique', 'Entreprenant(e)', 'Charismatique', 'Provocateur(trice)'],
    fullDesc: "Les ENTP vivent dans le monde des idées et des possibilités. Tu as une capacité unique à voir les problèmes sous des angles inattendus et à générer des solutions originales que personne d'autre n'aurait pensé. Tu t'ennuies vite avec la routine et tu as besoin de stimulation intellectuelle constante. Tu peux débattre des deux côtés d'un argument avec une égale aisance — ce qui t'amuse, mais peut dérouter les autres.",
    inLove: "En amour, tu cherches quelqu'un qui peut te suivre intellectuellement et qui aime autant que toi les échanges stimulants. Tu fuis l'ennui et la prévisibilité. Tu as besoin d'un(e) partenaire qui te challenge sans te juger. Tu peux parfois débattre dans les moments où l'autre a besoin d'empathie.",
    atWork: "Tu es fait(e) pour l'entrepreneuriat, le conseil, la création, ou tout domaine qui récompense la pensée originale. Tu excelles dans les phases de brainstorming et de démarrage, mais tu peux perdre de l'intérêt une fois que les idées passent à l'exécution routinière.",
    strengths: ['Pensée créative et originale', 'Capacité à voir les systèmes sous tous les angles', 'Charisme et capacité à convaincre', 'Adaptabilité intellectuelle', 'Humour et vivacité d\'esprit'],
    weaknesses: ['Difficulté à finir ce qu\'on commence', 'Tendance à l\'arrogance intellectuelle', 'Insensibilité aux émotions des autres', 'Procrastination sur les tâches routinières', 'Débat parfois pour le plaisir de débattre'],
    growth: "Apprends à reconnaître quand les autres ont besoin d'être écoutés, pas challengés. Toutes les conversations ne sont pas des débats. Travaille aussi ta persévérance : tes meilleures idées méritent d'être menées jusqu'au bout.",
    famousExamples: ['Thomas Edison', 'Leonardo da Vinci', 'Celine Dion', 'Steve Jobs', 'Barack Obama'],
    compatibleWith: ['INFJ', 'INTJ', 'INFP', 'ENFP'],
  },
  INFJ: {
    code: 'INFJ', name: "L'Avocat", tagline: "Le type le plus rare — visionnaire discret au grand cœur", emoji: '🌙', accentColor: '#7c3aed', rarity: '1.5%',
    shortDesc: "L'Avocat est le type le plus rare au monde. Tu combines une intuition profonde sur les motivations humaines avec un désir sincère de faire le bien. Tu vois ce que les autres ne voient pas, tu ressens ce que les autres ne disent pas, et tu portes souvent le poids du monde sur tes épaules.",
    traits: ['Intuitif(ve)', 'Altruiste', 'Déterminé(e)', 'Idéaliste', 'Mystérieux(se)'],
    fullDesc: "L'INFJ est souvent décrit comme le type \"paradoxal\" : introverti(e) mais capable d'une connexion humaine profonde, idéaliste mais pragmatique dans l'action, créatif(ve) mais organisé(e). Tu as une rare capacité à percevoir les dynamiques sous-jacentes dans les relations et les groupes — parfois avant même que les concernés s'en rendent compte. Cette intuition peut être un don extraordinaire ou une source d'épuisement selon comment tu l'utilises.",
    inLove: "En amour, tu cherches la connexion profonde ou rien. Le small talk et les relations superficielles t'épuisent. Quand tu aimes, tu aimes totalement et tu peux avoir tendance à t'oublier toi-même pour l'autre. Ton plus grand défi : poser des limites sans te sentir coupable.",
    atWork: "Tu excelles dans les métiers qui donnent du sens : psychologie, écriture, conseil, enseignement, accompagnement. Tu as besoin de sentir que ton travail contribue à quelque chose de plus grand. Les environnements compétitifs et cyniques t'épuisent rapidement.",
    strengths: ['Intuition sociale exceptionnelle', 'Profondeur d\'engagement et loyauté', 'Créativité et vision à long terme', 'Capacité à comprendre les motivations cachées', 'Détermination quand une cause le vaut'],
    weaknesses: ['Tendance au perfectionnisme paralysant', 'Difficulté à poser des limites', 'Épuisement empathique (absorbe les émotions des autres)', 'Tendance à l\'isolement quand débordé(e)', '"Door slam" : coupure soudaine des relations toxiques'],
    growth: "Ton plus grand travail intérieur : apprendre à te mettre en priorité sans culpabilité. Tu ne peux pas verser de l'eau d'une cruche vide. Tes besoins comptent autant que ceux des autres — accepter cela est ta plus grande victoire.",
    famousExamples: ['Martin Luther King', 'Nelson Mandela', 'Lady Gaga', 'Noam Chomsky', 'Taylor Swift'],
    compatibleWith: ['ENFP', 'ENTP', 'INFP', 'INTJ'],
  },
  INFP: {
    code: 'INFP', name: "Le Médiateur", tagline: "Rêveur idéaliste en quête de sens et d'authenticité", emoji: '🌿', accentColor: '#10b981', rarity: '4%',
    shortDesc: "Le Médiateur est mû par des valeurs profondes et une quête permanente d'authenticité. Tu ressens les émotions avec une intensité que peu comprennent, tu crois en un monde meilleur et tu consacres ton énergie à y contribuer à ta façon. Tu es souvent plus complexe que tu n'y parais.",
    traits: ['Idéaliste', 'Empathique', 'Créatif(ve)', 'Réservé(e)', 'Fidèle à soi-même'],
    fullDesc: "Les INFP sont les gardiens de leurs valeurs. Tu vis selon un code moral intérieur très développé et tu n'es pas facilement influençable par les normes sociales. Tu as une riche vie intérieure que tu partages rarement. Tu es capable d'une créativité et d'une sensibilité artistique extraordinaires, mais tu luttes souvent avec le sentiment de ne jamais vraiment appartenir au monde tel qu'il est.",
    inLove: "En amour, tu es à la fois le partenaire le plus loyal et le plus difficile à satisfaire. Tu cherches une connexion authentique et profonde, pas une relation de confort. Tu as tendance à idéaliser ton/ta partenaire au début, puis à être déçu(e) quand la réalité émerge. Apprends à aimer les êtres réels, imparfaits.",
    atWork: "Tu t'épanouis dans les métiers créatifs, humanitaires ou qui ont un sens profond. Écriture, art, psychologie, travail social, enseignement. La bureaucratie et les environnements impersonnels t'étouffent. Tu as besoin d'autonomie et de savoir que ton travail change quelque chose.",
    strengths: ['Empathie profonde et authentique', 'Créativité et pensée originale', 'Loyauté absolue envers ses valeurs', 'Capacité à inspirer les autres', 'Flexibilité et ouverture d\'esprit'],
    weaknesses: ['Tendance à l\'idéalisation', 'Hypersensibilité aux critiques', 'Difficulté à prendre des décisions pratiques', 'Procrastination émotionnelle', 'Se prend parfois trop au sérieux'],
    growth: "Apprends à distinguer ce qui mérite ton investissement émotionnel de ce qui ne le mérite pas. Toutes les causes ne valent pas ton épuisement. Et rappelle-toi : ton bonheur n'est pas un luxe, c'est une nécessité.",
    famousExamples: ['J.R.R. Tolkien', 'William Shakespeare', 'Frédéric Chopin', 'Johnny Depp', 'Björk'],
    compatibleWith: ['ENFJ', 'ENTJ', 'INFJ', 'ENFP'],
  },
  ENFJ: {
    code: 'ENFJ', name: "Le Protagoniste", tagline: "Leader charismatique qui inspire par l'exemple", emoji: '🌟', accentColor: '#f97316', rarity: '2.5%',
    shortDesc: "Le Protagoniste est le leader du cœur. Tu as un don naturel pour percevoir les potentiels humains et pour inspirer les autres à se dépasser. Tu consacres ton énergie aux autres avec une générosité parfois épuisante, et tu portes souvent les problèmes de ceux que tu aimes comme si c'étaient les tiens.",
    traits: ['Charismatique', 'Altruiste', 'Inspirant(e)', 'Empathique', 'Idéaliste'],
    fullDesc: "Les ENFJ sont nés pour connecter et pour guider. Tu comprends instinctivement les motivations et les besoins des gens qui t'entourent, et tu utilises cette compréhension pour les aider à grandir. Tu es souvent le pilier émotionnel de ton entourage — ce qui est une force, mais aussi une source d'épuisement si tu ne prends pas soin de toi.",
    inLove: "En amour, tu es dévoué(e), attentif(ve) et profondément investi(e). Tu anticipes les besoins de ton partenaire parfois avant même qu'il/elle les exprime. Ton risque : t'oublier toi-même dans la relation. Apprends à recevoir autant que tu donnes.",
    atWork: "Tu excelles dans les rôles qui impliquent leadership humain, enseignement, coaching, accompagnement ou communication. Tu motives les équipes naturellement et tu crées des environnements où chacun se sent valorisé.",
    strengths: ['Intelligence émotionnelle élevée', 'Communication naturelle et persuasive', 'Capacité à fédérer les équipes', 'Altruisme sincère', 'Vision et sens de l\'organisation'],
    weaknesses: ['Tendance à prendre en charge les problèmes des autres', 'Difficulté à dire non', 'Trop grande sensibilité aux conflits', 'Oubli de ses propres besoins', 'Idéalisme parfois déconnecté de la réalité'],
    growth: "Apprends à reconnaître que tu ne peux pas sauver tout le monde, et que ce n'est pas ton rôle. Prends soin de toi avec la même générosité que tu offres aux autres.",
    famousExamples: ['Barack Obama', 'Oprah Winfrey', 'Martin Luther King', 'Emma Watson', 'Malala Yousafzai'],
    compatibleWith: ['INFP', 'ISFP', 'INFJ', 'INTJ'],
  },
  ENFP: {
    code: 'ENFP', name: "Le Champion", tagline: "Énergie contagieuse, imagination débordante", emoji: '🦋', accentColor: '#ec4899', rarity: '8%',
    shortDesc: "Le Champion voit le monde comme un terrain d'aventures infini. Tu es enthousiaste, créatif(ve) et profondément convaincu(e) que tout est possible. Tu as un talent rare pour connecter les gens et les idées de façon inattendue, et ton énergie est souvent contagieuse.",
    traits: ['Enthousiaste', 'Créatif(ve)', 'Sociable', 'Curieux(se)', 'Imprévisible'],
    fullDesc: "Les ENFP sont les catalyseurs du monde. Tu vois le potentiel partout — dans les gens, les idées, les projets — et tu as un enthousiasme naturel qui t'ouvre toutes les portes. Tu peux sembler dispersé(e) aux yeux des autres, mais en réalité tu suis une logique interne riche et cohérente.",
    inLove: "En amour, tu es passionné(e), romantique et attentif(ve). Tu fuis la routine et tu as besoin d'un(e) partenaire qui te surprend et te stimule. Tu aimes profondément mais tu peux avoir du mal avec la stabilité émotionnelle à long terme.",
    atWork: "Tu t'épanouis dans les rôles créatifs, relationnels ou entrepreneuriaux. Tu es excellent(e) pour lancer des projets et insuffler de l'énergie à une équipe. L'exécution répétitive t'ennuie vite.",
    strengths: ['Créativité et pensée associative', 'Empathie et connexion humaine', 'Adaptabilité', 'Enthousiasme communicatif', 'Vision des possibilités'],
    weaknesses: ['Difficulté à finaliser les projets', 'Hypersensibilité émotionnelle', 'Procrastination', 'Trop d\'idées, pas assez d\'action', 'Tendance à l\'idéalisation des personnes'],
    growth: "Canalise ton énergie. Choisis 2-3 projets qui comptent vraiment et suis-les jusqu'au bout. Ta puissance réside dans ta capacité à terminer, pas juste à commencer.",
    famousExamples: ['Robin Williams', 'Walt Disney', 'Salvador Dali', 'Quentin Tarantino', 'Coco Chanel'],
    compatibleWith: ['INFJ', 'INTJ', 'ENFJ', 'ENTJ'],
  },
  ISTJ: {
    code: 'ISTJ', name: "L'Inspecteur", tagline: "Pilier de fiabilité absolue dans un monde chaotique", emoji: '🗂️', accentColor: '#64748b', rarity: '13%',
    shortDesc: "L'Inspecteur est la colonne vertébrale de toute organisation. Tu tiens tes engagements avec une rigueur que peu peuvent égaler. Méhodique, discret(e) et absolument fiable, tu fais partie des rares personnes qui font ce qu'elles disent, quand elles le disent.",
    traits: ['Fiable', 'Méthodique', 'Honnête', 'Patient(e)', 'Traditionnel(le)'],
    fullDesc: "Les ISTJ sont les gardiens des traditions et des procédures. Tu respectes les règles établies parce que tu comprends qu'elles existent pour une bonne raison. Tu travailles de façon méthodique et tu détestes les imprévus qui bouleversent ta planification. Ta fiabilité est légendaire — tout le monde sait qu'on peut compter sur toi.",
    inLove: "En amour, tu es loyal(e) et stable. Tu exprime ton amour à travers des actes concrets plutôt que des grandes déclarations. Tu peux sembler distant(e) émotionnellement, mais ton engagement est profond et durable.",
    atWork: "Tu excelles dans les rôles qui exigent précision, responsabilité et fiabilité : comptabilité, droit, logistique, médecine, administration. Tu es le/la meilleur(e) pour gérer les systèmes complexes et t'assurer que tout fonctionne correctement.",
    strengths: ['Fiabilité absolue', 'Sens aigu des responsabilités', 'Rigueur et précision', 'Pragmatisme', 'Capacité à maintenir le cap sur le long terme'],
    weaknesses: ['Résistance au changement', 'Rigidité dans les opinions', 'Difficulté à exprimer les émotions', 'Tendance au surmenage', 'Jugement parfois trop rapide des autres'],
    growth: "Le monde change. Ta force est ta fiabilité — mais elle devient une faiblesse si tu refuses de t'adapter. Ouvre-toi à de nouvelles façons de faire, même si elles semblent moins efficaces au départ.",
    famousExamples: ['Angela Merkel', 'Warren Buffett', 'Jeff Bezos', 'Condoleezza Rice', 'Hermione Granger'],
    compatibleWith: ['ESFP', 'ESTP', 'ISFJ', 'ISFP'],
  },
  ISFJ: {
    code: 'ISFJ', name: "Le Défenseur", tagline: "Protecteur silencieux, loyal jusqu'à l'épuisement", emoji: '🛡️', accentColor: '#0ea5e9', rarity: '13%',
    shortDesc: "Le Défenseur est peut-être le type le plus généreux et le moins reconnu. Tu te sacrifies pour ceux que tu aimes avec une discrétion totale. Tu as une mémoire prodigieuse pour les détails qui comptent aux autres — leurs anniversaires, leurs plats préférés, leurs peurs secrètes.",
    traits: ['Généreux(se)', 'Loyal(e)', 'Attentif(ve)', 'Organisé(e)', 'Discret(e)'],
    fullDesc: "Les ISFJ portent le monde sur leurs épaules sans se plaindre. Tu as un sens aigu du devoir envers les autres et tu donnes souvent plus que tu ne reçois. Ta générosité est authentique mais elle peut t'épuiser si tu ne poses pas de limites.",
    inLove: "En amour, tu es le partenaire idéal pour quelqu'un qui cherche de la stabilité, de la chaleur et de la présence. Tu es attentif(ve) aux besoins de l'autre et tu les anticipes. Ton risque : ne pas exprimer tes propres besoins par peur de déranger.",
    atWork: "Tu excelles dans les métiers du soin, de l'accompagnement et de l'organisation. Soins infirmiers, enseignement, RH, travail social. Tu es indispensable dans toute équipe, mais tu mérites d'être reconnu(e) à ta juste valeur.",
    strengths: ['Générosité sincère', 'Attention aux détails et aux besoins des autres', 'Fiabilité et loyauté', 'Patience exceptionnelle', 'Sens de l\'organisation'],
    weaknesses: ['Tendance à s\'oublier pour les autres', 'Difficulté à dire non', 'Trop grande sensibilité aux critiques', 'Résistance au changement', 'Tendance à éviter les conflits à tout prix'],
    growth: "Tes besoins méritent autant d'attention que ceux des autres. Apprends à demander ce dont tu as besoin sans te sentir coupable. La vraie générosité commence par prendre soin de soi.",
    famousExamples: ['Mère Teresa', 'Kate Middleton', 'Rosa Parks', 'Beyoncé', 'Vin Diesel'],
    compatibleWith: ['ESFP', 'ESTP', 'ISTJ', 'ESTJ'],
  },
  ESTJ: {
    code: 'ESTJ', name: "Le Directeur", tagline: "Organisateur naturel, garant de l'ordre et de l'efficacité", emoji: '📋', accentColor: '#0891b2', rarity: '11%',
    shortDesc: "Le Directeur est la personne qui prend les commandes quand personne d'autre ne le fait. Tu as un sens naturel de l'organisation, tu sais déléguer efficacement et tu t'assures que tout le monde fait sa part. Tu n'as pas de patience pour les excuses.",
    traits: ['Décisif(ve)', 'Organisé(e)', 'Loyal(e)', 'Honnête', 'Exigeant(e)'],
    fullDesc: "Les ESTJ sont les piliers de la société. Tu crois au travail bien fait, aux règles claires et aux responsabilités assumées. Tu t'es construit(e) à la force du poignet et tu n'as que peu de patience pour ceux qui cherchent des raccourcis.",
    inLove: "En amour, tu es loyal(e) et tu assumes tes responsabilités. Tu exprimes ton amour à travers des actes concrets et tu attends la même chose en retour. Tu peux parfois être trop rigide — apprends à lâcher prise.",
    atWork: "Tu es dans ton élément en management, administration, finance, droit, ou tout rôle qui exige organisation et leadership. Tu sais motiver une équipe par l'exemple et l'exigence.",
    strengths: ['Sens de l\'organisation et de la planification', 'Leadership naturel et autorité', 'Fiabilité et honnêteté', 'Efficacité dans l\'exécution', 'Sens des responsabilités'],
    weaknesses: ['Rigidité dans les opinions', 'Difficulté à accepter les méthodes non conventionnelles', 'Tendance à juger rapidement', 'Manque d\'empathie apparent', 'Résistance au changement'],
    growth: "Il existe souvent plusieurs façons d'atteindre un objectif. Ta façon n'est pas toujours la seule bonne. Développe ta tolérance aux approches différentes des tiennes.",
    famousExamples: ['Michelle Obama', 'Hillary Clinton', 'Judge Judy', 'Sonia Sotomayor', 'Sam Walton'],
    compatibleWith: ['ISFP', 'ISTP', 'ISFJ', 'ISTJ'],
  },
  ESFJ: {
    code: 'ESFJ', name: "Le Consul", tagline: "Hôte/Hôtesse né(e), gardien(ne) de l'harmonie sociale", emoji: '🤝', accentColor: '#84cc16', rarity: '12%',
    shortDesc: "Le Consul est la personne qui s'assure que tout le monde va bien dans la pièce. Tu es profondément à l'écoute des besoins de ton entourage, tu crées des liens facilement et tu t'épanouis dans les environnements sociaux chaleureux.",
    traits: ['Sociable', 'Loyal(e)', 'Attentif(ve)', 'Organisé(e)', 'Généreux(se)'],
    fullDesc: "Les ESFJ sont les ciments sociaux de leurs communautés. Tu t'investis profondément dans les relations et tu as un talent naturel pour créer des environnements où les gens se sentent bienvenus et valorisés.",
    inLove: "En amour, tu es chaleureux(se), attentif(ve) et profondément investi(e). Tu prends soin de ton/ta partenaire avec enthousiasme. Tu as besoin d'être apprécié(e) et de recevoir autant que tu donnes.",
    atWork: "Tu excelles dans les rôles de service, de coordination ou de soin : RH, enseignement, soins, événementiel. Tu crées des équipes soudées et tu gardes le moral de tout le monde.",
    strengths: ['Intelligence émotionnelle', 'Loyauté et dévouement', 'Sens de l\'organisation', 'Communication empathique', 'Capacité à créer des liens solides'],
    weaknesses: ['Trop grande dépendance à l\'approbation des autres', 'Difficultés à gérer les critiques', 'Tendance à éviter les conflits', 'Rigidité dans les valeurs traditionnelles', 'Oubli de ses propres besoins'],
    growth: "Ta valeur ne dépend pas de l'approbation des autres. Apprends à te faire confiance même quand tout le monde n'est pas d'accord avec toi.",
    famousExamples: ['Taylor Swift', 'Bill Clinton', 'Jennifer Lopez', 'Danny Glover', 'Elton John'],
    compatibleWith: ['ISFP', 'ISTP', 'INFP', 'INFJ'],
  },
  ISTP: {
    code: 'ISTP', name: "Le Technicien", tagline: "Maître de la mécanique et de l'improvisation", emoji: '🔧', accentColor: '#78716c', rarity: '5%',
    shortDesc: "Le Technicien est fasciné par la façon dont les choses fonctionnent. Tu as un talent naturel pour comprendre les systèmes, les réparer et les optimiser. Tu es efficace, calme sous pression et tu préfères l'action aux théories.",
    traits: ['Pragmatique', 'Réservé(e)', 'Curieux(se)', 'Calme', 'Indépendant(e)'],
    fullDesc: "Les ISTP sont les artisans du spectre. Tu possèdes une compréhension intuitive des mécanismes — qu'il s'agisse de machines, de systèmes ou de situations humaines. Tu agis avec précision et tu n'utilises jamais deux mots quand un suffit.",
    inLove: "En amour, tu es loyal(e) mais tu as besoin de beaucoup d'espace. Tu exprimes ton affection à travers des actes pratiques plutôt que des déclarations verbales. Tu peux sembler distant(e) mais c'est ta façon d'être.",
    atWork: "Tu excelles dans l'ingénierie, la mécanique, les métiers techniques, les arts martiaux, le sport de compétition, la médecine d'urgence. Tu aimes résoudre des problèmes concrets avec des outils réels.",
    strengths: ['Pensée logique et pratique', 'Calme sous pression extrême', 'Compréhension intuitive des mécanismes', 'Adaptabilité', 'Efficacité dans l\'action'],
    weaknesses: ['Difficulté à exprimer ses émotions', 'Imprévisibilité', 'Manque d\'intérêt pour les règles et la structure', 'Insensibilité involontaire', 'Tendance à l\'ennui rapide'],
    growth: "Les relations humaines ont leur propre mécanique. Investis autant de curiosité dans ta vie émotionnelle que dans tes projets techniques.",
    famousExamples: ['Clint Eastwood', 'Bruce Lee', 'Michael Jordan', 'Dalida', 'Tom Cruise'],
    compatibleWith: ['ESTJ', 'ESFJ', 'ENTJ', 'ENTP'],
  },
  ISFP: {
    code: 'ISFP', name: "L'Artiste", tagline: "Âme créative, sensible et profondément authentique", emoji: '🎨', accentColor: '#f472b6', rarity: '9%',
    shortDesc: "L'Artiste vit pleinement dans le moment présent, avec une sensibilité esthétique rare. Tu exprimes ta vision du monde à travers ce que tu crées — musique, art, cuisine, design ou simplement ta façon d'être. Tu es discret(e) mais profondément authentique.",
    traits: ['Sensible', 'Créatif(ve)', 'Spontané(e)', 'Loyal(e)', 'Discret(e)'],
    fullDesc: "Les ISFP portent un monde intérieur riche que peu de gens ont la chance d'explorer. Tu perçois la beauté là où les autres ne la voient pas et tu exprimes tes émotions profondes à travers des créations plutôt que des mots.",
    inLove: "En amour, tu es tendre, attentif(ve) et tu crées des moments inoubliables. Tu aimes profondément mais tu as du mal à exprimer tes besoins verbalement. Apprends à communiquer ce que tu ressens.",
    atWork: "Tu t'épanouis dans les arts, le design, la musique, la mode, la gastronomie, les métiers du soin. Tu as besoin d'autonomie créative et d'un environnement qui valorise ta sensibilité.",
    strengths: ['Sensibilité esthétique exceptionnelle', 'Empathie et gentillesse', 'Authenticité', 'Créativité et originalité', 'Présence dans le moment'],
    weaknesses: ['Évitement des conflits', 'Difficulté à planifier sur le long terme', 'Hypersensibilité aux critiques', 'Tendance à l\'isolement en cas de stress', 'Manque de confiance en soi'],
    growth: "Ton authenticité est ta plus grande force. Cesse de la minimiser pour plaire aux autres. Le monde a besoin de ce que toi seul(e) peux créer.",
    famousExamples: ['Michael Jackson', 'Britney Spears', 'Prince', 'Lana Del Rey', 'David Bowie'],
    compatibleWith: ['ESTJ', 'ESFJ', 'ENFJ', 'ENFP'],
  },
  ESTP: {
    code: 'ESTP', name: "L'Entrepreneur", tagline: "Action d'abord, réflexion ensuite — et ça marche", emoji: '🔥', accentColor: '#ef4444', rarity: '4%',
    shortDesc: "L'Entrepreneur vit dans l'action, pas dans les plans. Tu perçois les opportunités avant les autres et tu passes à l'action sans te laisser paralyser par l'analyse. Charismatique, pragmatique et toujours au centre de ce qui se passe.",
    traits: ['Audacieux(se)', 'Direct(e)', 'Perceptif(ve)', 'Énergique', 'Pragmatique'],
    fullDesc: "Les ESTP sont les acteurs naturels de la vie. Tu lis les situations avec une acuité impressionnante et tu prends des décisions instantanées que les autres mettent des heures à analyser. Tu t'ennuies vite et tu as besoin de stimulation constante.",
    inLove: "En amour, tu es spontané(e), passionné(e) et tu crées des souvenirs intenses. Tu peux avoir du mal avec les engagements à long terme si la relation manque d'excitation. La routine est ton ennemi.",
    atWork: "Tu excelles dans les métiers qui exigent réactivité et action : ventes, trading, gestion de crise, entrepreneur, sport professionnel, urgentiste.",
    strengths: ['Réactivité et décision rapide', 'Charisme naturel', 'Pragmatisme', 'Lecture des situations humaines', 'Résistance au stress'],
    weaknesses: ['Impatience', 'Prise de risques excessifs', 'Difficulté à planifier long terme', 'Insensibilité involontaire', 'Ennui rapide dans la stabilité'],
    growth: "L'action sans réflexion crée des chaos. Apprends à faire une pause avant de décider dans les situations à forts enjeux émotionnels.",
    famousExamples: ['Ernest Hemingway', 'Madonna', 'Donald Trump', 'Mike Tyson', 'Nicolas Sarkozy'],
    compatibleWith: ['ISFJ', 'ISTJ', 'INFJ', 'INTJ'],
  },
  ESFP: {
    code: 'ESFP', name: "L'Animateur", tagline: "La vie est une scène — et tu es né(e) pour y briller", emoji: '🎉', accentColor: '#f59e0b', rarity: '9%',
    shortDesc: "L'Animateur est la vie de la fête — et pas par hasard. Tu as un don naturel pour créer de la joie autour de toi, pour mettre les gens à l'aise et pour transformer n'importe quelle situation ordinaire en moment mémorable.",
    traits: ['Spontané(e)', 'Enthousiaste', 'Généreux(se)', 'Amusant(e)', 'Sensible'],
    fullDesc: "Les ESFP vivent intensément dans le présent. Tu t'intéresses aux gens, aux expériences et aux plaisirs sensoriels. Tu as une capacité naturelle à créer des connexions et à mettre tout le monde à l'aise.",
    inLove: "En amour, tu es passionné(e), attentif(ve) et tu crées une atmosphère de légèreté et de joie. Tu as besoin d'un(e) partenaire qui participe à la vie avec toi, pas qui la regarde.",
    atWork: "Tu t'épanouis dans la performance, le service, la vente, l'enseignement, les métiers artistiques. Tu as besoin de contact humain et de variété.",
    strengths: ['Don pour créer de la connexion', 'Adaptabilité et spontanéité', 'Empathie pratique', 'Énergie positive contagieuse', 'Sens de l\'esthétique'],
    weaknesses: ['Difficulté avec les projets à long terme', 'Évitement des situations difficiles', 'Hypersensibilité', 'Tendance à l\'impulsivité', 'Concentration parfois insuffisante'],
    growth: "La profondeur n'exclut pas la joie. Explore aussi les relations et projets qui demandent un investissement dans la durée.",
    famousExamples: ['Marilyn Monroe', 'Will Smith', 'Jamie Oliver', 'Adele', 'Justin Bieber'],
    compatibleWith: ['ISTJ', 'ISFJ', 'INTJ', 'INFJ'],
  },
};

export const ALL_MBTI_TYPES = Object.keys(mbtiTypes);
