export interface PainPageData {
  slug: string;
  emoji: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  intro: string;
  sectionTitle: string;
  section: string[];
  actionTitle: string;
  action: string;
  relatedQuiz?: { slug: string; label: string };
  ctaText: string;
  accentColor: string;
  faqs: { q: string; a: string }[];
}

export const PAIN_PAGES: Record<string, PainPageData> = {
  stress: {
    slug: 'stress',
    emoji: '🌊',
    h1: 'Comment gérer son stress au quotidien',
    metaTitle: 'Comment gérer son stress au quotidien — causes et solutions concrètes',
    metaDesc: "Comprendre d'où vient vraiment ton stress (pas juste le calmer sur le moment) et ce qui aide réellement à le gérer au jour le jour — avec un accompagnement personnalisé si tu veux aller plus loin.",
    keywords: ['gérer son stress', 'comment gérer le stress', 'stress au quotidien', 'anxiété quotidienne', 'trop penser', 'calmer son cerveau'],
    intro: "Le stress n'est pas un défaut de caractère — c'est une réponse physiologique (montée de cortisol et d'adrénaline) déclenchée quand ton cerveau perçoit une menace, réelle ou anticipée. Le problème n'est pas d'avoir cette réponse, mais qu'elle se déclenche trop souvent, pour des choses qui ne le justifient pas vraiment, sans qu'on sache pourquoi.",
    sectionTitle: "D'où vient vraiment ton stress",
    section: [
      "Stress ponctuel vs stress chronique — un stress ponctuel (un examen, un entretien) s'arrête une fois l'événement passé. Un stress chronique reste actif même sans menace immédiate, souvent nourri par la rumination : le cerveau rejoue un scénario au lieu de le résoudre.",
      "La surcharge mentale — accumuler trop de décisions à prendre, de choses à retenir, de tâches en attente, sature la mémoire de travail bien avant que tu t'en rendes compte consciemment.",
      "L'anticipation plutôt que le présent — une grande partie du stress moderne ne vient pas de ce qui se passe maintenant, mais de scénarios futurs que le cerveau simule en boucle, souvent la nuit, au moment où plus rien ne vient les interrompre.",
      "Le stress relationnel — un conflit non résolu ou une tension latente avec quelqu'un maintient le système d'alerte actif en continu, même en dehors des moments où on y pense consciemment.",
    ],
    actionTitle: 'Ce qui aide vraiment (au-delà de "respire")',
    action: "Nommer précisément ce qui stresse (pas \"tout\", mais LA chose exacte) réduit déjà l'intensité ressentie — c'est un effet documenté de la mise en mots des émotions. Ensuite, la régularité compte plus que l'intensité : un point quotidien de 2 minutes sur son niveau de stress et sa source repère les schémas (le même jour de la semaine, la même personne, le même sujet) qu'on ne voit jamais en y pensant seulement de façon ponctuelle. C'est exactement ce que permet un journal tenu chaque jour, avec quelqu'un (ou quelque chose) qui repère la tendance à ta place.",
    relatedQuiz: { slug: 'burnout', label: 'Suis-je en burnout ?' },
    ctaText: 'Commencer mon Journal, gratuit →',
    accentColor: '#35506B',
    faqs: [
      { q: 'Pourquoi je pense trop le soir alors que je veux dormir ?', a: "Le soir, il n'y a plus de tâche active pour occuper l'attention, donc le cerveau se tourne vers ce qui est resté non résolu dans la journée. C'est une rumination par défaut, pas un signe que le problème est plus grave la nuit — juste que rien d'autre ne la coupe." },
      { q: 'Le stress peut-il devenir physique ?', a: "Oui. Un stress prolongé maintient le cortisol élevé, ce qui peut affecter le sommeil, la digestion, les tensions musculaires (mâchoire, épaules) et la concentration. Ce n'est pas \"dans la tête\" au sens où ce serait imaginaire — les effets sont mesurables." },
      { q: "Est-ce qu'un test ou une appli peuvent remplacer un suivi pour un stress sévère ?", a: "Non. Un outil de suivi quotidien aide à repérer des schémas et à mieux se comprendre, mais un stress qui devient invalidant (impact sur le sommeil, le travail, la santé) mérite un avis médical ou un accompagnement thérapeutique, pas seulement un outil de self-tracking." },
    ],
  },

  'confiance-en-soi': {
    slug: 'confiance-en-soi',
    emoji: '🌱',
    h1: 'Comment reprendre confiance en soi',
    metaTitle: 'Comment reprendre confiance en soi — ce qui marche vraiment',
    metaDesc: "La confiance en soi ne se décrète pas d'un coup — elle se construit par des preuves accumulées. Comprendre ce qui la fait vraiment évoluer, et ce qui la maintient basse sans qu'on s'en rende compte.",
    keywords: ['reprendre confiance en soi', 'manque de confiance', 'estime de soi', 'comment avoir confiance en soi', 'se comparer aux autres'],
    intro: "La confiance en soi n'est pas un trait fixe qu'on a ou qu'on n'a pas — c'est ce que le psychologue Albert Bandura appelle le sentiment d'auto-efficacité : la conviction, construite par l'expérience, qu'on est capable de réussir ce qu'on entreprend. Elle se construit (et se démolit) par petites touches, pas par un déclic unique.",
    sectionTitle: 'Pourquoi ta confiance reste basse malgré tes efforts',
    section: [
      "Le biais de négativité — le cerveau retient beaucoup plus fortement un échec ou une critique qu'une réussite équivalente. Sans compenser activement, la balance penche naturellement vers le doute.",
      "La comparaison sociale constante — se comparer en continu (souvent via les réseaux sociaux) à la version la plus soignée de la vie des autres fausse systématiquement le jugement qu'on porte sur soi-même.",
      "Le perfectionnisme comme piège — viser la perfection avant d'agir empêche d'accumuler les petites preuves de compétence qui construisent justement la confiance — un cercle qui s'auto-entretient.",
      "Le dialogue intérieur critique — la façon dont on se parle à soi-même après un échec (\"je suis nul\" vs \"cette fois ça n'a pas marché\") a un impact direct et mesurable sur la confiance à long terme, indépendamment du résultat réel.",
    ],
    actionTitle: 'Ce qui construit réellement la confiance',
    action: "Bandura a montré que la source la plus fiable de confiance est l'expérience de maîtrise (\"mastery experience\") : réussir de petites choses concrètes, régulièrement, et surtout s'en souvenir consciemment — le cerveau oublie vite ses propres réussites s'il ne les note pas activement. Un suivi quotidien de ce qui a été accompli, même petit, construit une preuve accumulée que l'auto-critique ne peut plus ignorer aussi facilement.",
    relatedQuiz: { slug: 'auto-sabotage', label: 'Est-ce que je m\'auto-sabote ?' },
    ctaText: 'Découvrir mon profil de personnalité →',
    accentColor: '#7A4A1E',
    faqs: [
      { q: 'La confiance en soi peut-elle vraiment changer, ou est-ce inné ?', a: "Elle évolue tout au long de la vie — les recherches sur l'auto-efficacité de Bandura montrent qu'elle se construit principalement par l'expérience directe, pas par la personnalité de naissance. Une personne peut avoir peu confiance dans un domaine et beaucoup dans un autre." },
      { q: 'Pourquoi je doute de moi alors que les autres me trouvent compétent(e) ?', a: "C'est un décalage courant entre la compétence perçue par les autres et l'auto-évaluation, souvent lié au syndrome de l'imposteur — le biais de négativité fait retenir ses propres doutes plus fort que les retours positifs reçus." },
      { q: 'Faut-il arrêter de se comparer aux autres pour avoir confiance en soi ?', a: "Se comparer n'est pas le problème en soi — c'est se comparer sans contexte (à une version filtrée de la vie de quelqu'un d'autre) qui fausse le jugement. Se comparer à sa propre progression passée est en général bien plus constructif." },
    ],
  },

  emotions: {
    slug: 'emotions',
    emoji: '🎭',
    h1: 'Comment mieux comprendre ses émotions',
    metaTitle: 'Comment mieux comprendre ses émotions — au-delà de "bien" ou "mal"',
    metaDesc: "Identifier précisément ce qu'on ressent — pas juste \"bien\" ou \"mal\" — change concrètement la façon dont on gère une émotion forte. Voici pourquoi, et comment développer cette compétence.",
    keywords: ['comprendre ses émotions', 'gérer ses émotions', 'intelligence émotionnelle', 'identifier ses émotions', 'émotion forte'],
    intro: "La plupart des gens décrivent leur état émotionnel avec un vocabulaire très réduit : \"bien\", \"pas bien\", \"stressé\". Les chercheurs appellent la capacité à distinguer des émotions proches (frustration vs déception, par exemple) la granularité émotionnelle — et elle est directement liée à une meilleure régulation émotionnelle, pas juste à un vocabulaire plus riche.",
    sectionTitle: 'Pourquoi on a du mal à nommer ce qu\'on ressent',
    section: [
      "L'alexithymie légère — beaucoup de gens n'ont simplement jamais été entraînés à identifier finement leurs émotions, souvent parce que ce n'était pas encouragé dans leur environnement d'enfance.",
      "La confusion émotion / pensée — \"je sens que tu m'ignores\" décrit une interprétation, pas une émotion. La vraie émotion en dessous (blessure, colère, tristesse) reste souvent non identifiée.",
      "L'évitement actif — certaines émotions (la honte en particulier) sont si inconfortables que le cerveau évite de les regarder en face, ce qui les rend paradoxalement plus difficiles à réguler.",
      "Le mélange de plusieurs émotions à la fois — on peut ressentir du soulagement ET de la tristesse en même temps face au même événement ; ne pas les distinguer donne une impression confuse et difficile à gérer.",
    ],
    actionTitle: 'Développer sa granularité émotionnelle',
    action: "La méthode la plus documentée est simple : nommer l'émotion avec un mot précis, au moment où elle survient ou peu après, plutôt que la catégoriser en \"bien/mal\". Cette mise en mots (le \"affect labeling\") a un effet mesurable de réduction de l'intensité émotionnelle, indépendamment de toute autre action. Un Journal quotidien qui demande explicitement quelle émotion domine — pas juste l'humeur générale — entraîne directement cette compétence.",
    relatedQuiz: { slug: 'intelligence-emotionnelle', label: "Test d'intelligence émotionnelle" },
    ctaText: 'Commencer mon Journal émotionnel →',
    accentColor: '#6B3F52',
    faqs: [
      { q: 'Quelle est la différence entre une émotion et un sentiment ?', a: "Une émotion est une réaction physiologique et rapide (peur, colère, joie). Un sentiment est l'interprétation consciente et plus durable de cette émotion. On peut ressentir de la peur (émotion) et l'interpréter comme de l'anxiété face à l'avenir (sentiment)." },
      { q: 'Pourquoi certaines émotions reviennent-elles sans cause apparente ?', a: "Une émotion qui revient souvent sans déclencheur évident est en général liée à une pensée ou un souvenir automatique, pas toujours conscient sur le moment. Tenir un suivi régulier aide à repérer le contexte réel (heure, situation, personne) qui la précède." },
      { q: "Est-ce grave de ne pas savoir nommer ce qu'on ressent ?", a: "Non, ce n'est pas un défaut — c'est une compétence qui s'apprend comme une autre, à tout âge. La bonne nouvelle est que la granularité émotionnelle s'améliore avec la pratique régulière, pas seulement avec le temps qui passe." },
    ],
  },

  motivation: {
    slug: 'motivation',
    emoji: '🔥',
    h1: 'Comment retrouver de la motivation',
    metaTitle: 'Comment retrouver de la motivation quand on n\'a plus envie de rien',
    metaDesc: "La motivation ne se force pas par la volonté — elle se construit par l'action, dans l'ordre inverse de ce qu'on croit. Comprendre pourquoi elle disparaît et ce qui la fait vraiment revenir.",
    keywords: ['retrouver de la motivation', 'manque de motivation', 'plus envie de rien', 'perte de motivation', 'comment se motiver'],
    intro: "Contrairement à l'idée reçue, la motivation ne précède pas toujours l'action — elle en découle souvent. Commencer une petite action, même sans envie, génère une libération de dopamine liée à la progression perçue, ce qui régénère la motivation plutôt que l'inverse.",
    sectionTitle: 'Pourquoi la motivation disparaît',
    section: [
      "Des objectifs trop flous ou trop lointains — le cerveau a du mal à se motiver pour quelque chose d'abstrait ou dont l'échéance est trop éloignée ; c'est le principe du gradient de but : plus la récompense semble proche, plus l'effort augmente naturellement.",
      "L'absence de progrès visible — sans preuve concrète d'avancement, même un effort réel finit par sembler vain, ce qui éteint la motivation bien avant l'épuisement physique réel.",
      "La confusion avec la fatigue ou le burnout — un manque de motivation persistant peut aussi être un signal d'épuisement (mental ou physique) plutôt qu'un problème de discipline — la solution n'est alors pas de \"se forcer\" mais de récupérer.",
      "La procrastination liée à la peur de l'échec — reporter une tâche importante n'est souvent pas de la paresse mais une stratégie inconsciente d'évitement d'un jugement de valeur (\"si je ne le fais pas, je ne peux pas échouer\").",
    ],
    actionTitle: 'Ce qui relance vraiment la motivation',
    action: "Réduire la première action à une taille ridiculement petite (2 minutes, pas 2 heures) contourne la résistance initiale — une fois commencé, la dynamique de progrès prend souvent le relais. Rendre le progrès visible (une trace écrite, un suivi quotidien) compense l'absence de récompense externe immédiate, en donnant au cerveau une preuve concrète que l'effort mène quelque part.",
    ctaText: 'Découvrir mon parcours personnalisé →',
    accentColor: '#43502F',
    faqs: [
      { q: "Faut-il attendre d'être motivé(e) pour commencer une tâche ?", a: "Non — c'est souvent l'inverse qui fonctionne mieux : commencer une version minuscule de la tâche déclenche une dynamique qui régénère la motivation en cours de route, plutôt que d'attendre un déclic qui ne vient pas toujours." },
      { q: 'Comment savoir si c\'est un manque de motivation ou du burnout ?', a: "Un manque de motivation ponctuel touche une tâche ou un domaine précis. Le burnout se caractérise par un épuisement généralisé (physique, émotionnel, cognitif), souvent accompagné de troubles du sommeil et d'un désinvestissement global — dans ce cas, la solution est le repos, pas la discipline." },
      { q: 'Pourquoi je suis motivé(e) au début d\'un projet puis je lâche ?', a: "C'est un schéma très courant, lié à la nouveauté qui stimule naturellement l'attention et la dopamine. Sans système pour rendre le progrès visible une fois la nouveauté passée, la motivation retombe — d'où l'intérêt d'un suivi qui montre la progression réelle dans la durée." },
    ],
  },

  relations: {
    slug: 'relations',
    emoji: '🧑‍🤝‍🧑',
    h1: 'Comment améliorer ses relations',
    metaTitle: 'Comment améliorer ses relations — comprendre ses propres schémas',
    metaDesc: "Beaucoup de conflits relationnels se répètent parce qu'on ne voit pas le schéma derrière — pas parce que l'autre personne est \"le problème\". Comprendre ton propre fonctionnement change la dynamique.",
    keywords: ['améliorer ses relations', 'comprendre les autres', 'pourquoi mes relations échouent', 'schéma relationnel', 'compatibilité personnalité'],
    intro: "Beaucoup de tensions relationnelles ne viennent pas d'un désaccord ponctuel, mais d'un décalage plus profond dans la façon dont chacun perçoit, communique et réagit au stress — ce que la théorie de l'attachement (Bowlby, Ainsworth) et les modèles de personnalité décrivent comme des styles relationnels durables, formés tôt et souvent inconscients.",
    sectionTitle: 'Pourquoi les mêmes tensions reviennent',
    section: [
      "Le style d'attachement — une personne à tendance anxieuse cherche de la réassurance ; une personne à tendance évitante prend de la distance sous pression. Face à face, ces deux réactions s'aggravent mutuellement si personne ne comprend le mécanisme de l'autre.",
      "Les besoins de communication différents — certaines personnalités ont besoin de parler pour réfléchir, d'autres ont besoin de silence avant de répondre ; interpréter le silence de l'autre comme un désintérêt (ou l'inverse) crée des malentendus récurrents.",
      "Le schéma répétitif — remarquer qu'on est attiré(e) par le même type de personne, ou qu'on retombe dans la même dynamique de couple ou d'amitié, n'est pas un hasard : c'est souvent un pattern inconscient qui se répète tant qu'il n'est pas identifié consciemment.",
      "La projection — attribuer à l'autre une intention qu'il n'a pas exprimée (souvent basée sur une expérience passée avec quelqu'un d'autre) alimente des conflits qui n'ont, au fond, rien à voir avec la situation présente.",
    ],
    actionTitle: 'Ce qui change vraiment la dynamique',
    action: "Comprendre son propre fonctionnement (comment on réagit au stress, ce dont on a besoin pour se sentir en sécurité dans une relation) est le levier le plus direct — on ne peut pas changer l'autre, mais on peut changer sa propre réaction, ce qui modifie mécaniquement la dynamique entière. Un test de personnalité ou de style d'attachement donne un premier vocabulaire concret pour nommer ce schéma, souvent la première étape pour arrêter de le reproduire sans le voir.",
    relatedQuiz: { slug: 'style-attachement', label: "Test du style d'attachement" },
    ctaText: 'Découvrir mon profil de personnalité →',
    accentColor: '#8a5347',
    faqs: [
      { q: 'Pourquoi je choisis toujours le même type de partenaire ?', a: "C'est souvent lié à un schéma d'attachement formé tôt, qui rend certains types de dynamiques (parfois inconfortables) étrangement \"familières\" et donc attirantes, sans que ce soit un choix conscient." },
      { q: 'Le silence pendant une dispute est-il un mauvais signe ?', a: "Pas nécessairement — pour un style d'attachement évitant, le retrait est une façon de gérer le stress, pas un désintérêt. Pour l'autre personne, ce même silence peut être vécu comme un abandon. Le comprendre change complètement l'interprétation du conflit." },
      { q: 'Peut-on vraiment changer sa façon de fonctionner en relation ?', a: "Oui — les styles relationnels ne sont pas figés. La première étape, documentée comme la plus efficace, est de les identifier clairement : on ne peut pas ajuster un schéma qu'on ne voit pas." },
    ],
  },
};

export const PAIN_SLUGS = Object.keys(PAIN_PAGES);
