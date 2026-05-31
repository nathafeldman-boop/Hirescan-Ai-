export interface QuizOption {
  text: string;
  score: number;
}

export interface QuizQuestion {
  text: string;
  options: QuizOption[];
  tags?: {
    genders?: string[];
    situations?: string[];
    ageGroups?: string[];
  };
}

export interface QuizSession {
  firstName?: string;
  age?: string;
  gender?: string;
  situation?: string;
}

export interface ResultTier {
  min: number;
  max: number;
  emoji: string;
  title: string;
  message: string;
  color: string;
  glowColor: string;
}

export interface Quiz {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  accentColor: string;
  questions: QuizQuestion[];
  resultTiers: ResultTier[];
}

export const quizzes: Quiz[] = [
  {
    slug: 'infidelite',
    title: 'Mon/Ma partenaire me trompe ?',
    subtitle: 'Détecte les signes d\'infidélité',
    description: '30 questions pour analyser les comportements suspects dans ta relation.',
    emoji: '💔',
    gradientFrom: 'from-red-950/80',
    gradientTo: 'to-orange-950/80',
    borderColor: 'border-red-800/30',
    accentColor: '#ef4444',
    questions: [
      {
        text: 'Est-ce que ton/ta partenaire protège davantage son téléphone depuis quelque temps ?',
        options: [
          { text: 'Non, rien de spécial', score: 0 },
          { text: 'Il/Elle le retourne parfois face contre table', score: 1 },
          { text: 'Il/Elle change souvent de code et évite mon regard', score: 2 },
          { text: 'Son téléphone est toujours verrouillé et il/elle panique si je m\'approche', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire rentre plus tard que d\'habitude sans explication claire ?',
        options: [
          { text: 'Non, ses horaires sont réguliers', score: 0 },
          { text: 'De temps en temps, mais ça se justifie', score: 1 },
          { text: 'Souvent, avec des excuses vagues', score: 2 },
          { text: 'Très souvent, les histoires changent à chaque fois', score: 3 },
        ],
      },
      {
        text: 'As-tu remarqué un changement dans votre vie intime ?',
        options: [
          { text: 'Aucun changement notable', score: 0 },
          { text: 'Légèrement moins présent(e) qu\'avant', score: 1 },
          { text: 'Nettement moins d\'intérêt de sa part', score: 2 },
          { text: 'Notre vie intime est quasi inexistante depuis peu', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire est devenu(e) plus distant(e) émotionnellement ?',
        options: [
          { text: 'Non, on est toujours aussi proches', score: 0 },
          { text: 'Un peu moins disponible mais ça va', score: 1 },
          { text: 'Il/Elle semble souvent dans ses pensées', score: 2 },
          { text: 'On ne se parle presque plus vraiment', score: 3 },
        ],
      },
      {
        text: 'As-tu trouvé des messages, photos ou appels suspects ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Un message ambigu sans suite', score: 1 },
          { text: 'Plusieurs échanges qui m\'ont semblé bizarres', score: 2 },
          { text: 'Des preuves évidentes que j\'ai découvertes', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire s\'habille ou prend soin de lui/elle différemment ?',
        options: [
          { text: 'Aucun changement', score: 0 },
          { text: 'Un peu plus soigné(e) en certaines occasions', score: 1 },
          { text: 'Beaucoup plus soucieux/soucieuse de son apparence', score: 2 },
          { text: 'Transformation totale : nouveau style, nouveau parfum', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire te ment ou t\'a menti récemment sur sa localisation ?',
        options: [
          { text: 'Jamais, on se fait confiance', score: 0 },
          { text: 'Un petit mensonge sans importance', score: 1 },
          { text: 'Des incohérences dans ses histoires', score: 2 },
          { text: 'Plusieurs mensonges flagrants sur où il/elle était', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle de nouvelles amitiés que tu ne connais pas ?',
        options: [
          { text: 'Non, je connais tous ses amis', score: 0 },
          { text: 'Un ou deux nouveaux contacts normaux', score: 1 },
          { text: 'Des "collègues" dont il/elle parle mais que je n\'ai jamais rencontrés', score: 2 },
          { text: 'Des contacts mystérieux avec qui il/elle passe beaucoup de temps', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire est devenu(e) irritable ou défensif/défensive sans raison ?',
        options: [
          { text: 'Non, il/elle est d\'humeur stable', score: 0 },
          { text: 'Parfois nerveux/nerveuse pour un rien', score: 1 },
          { text: 'Souvent agressif/agressive quand je pose des questions', score: 2 },
          { text: 'Très défensif/défensive dès que j\'aborde certains sujets', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire travaille-t-il/elle plus que d\'habitude ou a-t-il/elle plus de "réunions" ?',
        options: [
          { text: 'Non, emploi du temps normal', score: 0 },
          { text: 'Quelques heures sup de temps en temps', score: 1 },
          { text: 'Régulièrement des sorties tardives liées au "travail"', score: 2 },
          { text: 'Constamment absent(e) pour des raisons professionnelles douteuses', score: 3 },
        ],
      },
      {
        text: 'As-tu remarqué des dépenses inhabituelles ou de l\'argent qui disparaît ?',
        options: [
          { text: 'Non, pas du tout', score: 0 },
          { text: 'De petites dépenses que je ne comprends pas', score: 1 },
          { text: 'Des retraits en liquide fréquents sans explication', score: 2 },
          { text: 'Des dépenses importantes que je ne peux pas vérifier', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire passe plus de temps sur les réseaux sociaux ou son téléphone ?',
        options: [
          { text: 'Non, habitudes normales', score: 0 },
          { text: 'Un peu plus sur le téléphone en général', score: 1 },
          { text: 'Souvent connecté(e) à des heures tardives', score: 2 },
          { text: 'Très actif/active et cache son écran quand je m\'approche', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire te compare-t-il/elle à d\'autres personnes ?',
        options: [
          { text: 'Jamais', score: 0 },
          { text: 'Très rarement, et c\'était bénin', score: 1 },
          { text: 'Parfois, et ça me blesse', score: 2 },
          { text: 'Souvent, et les comparaisons semblent trop précises', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire annule des plans avec toi de façon répétée ?',
        options: [
          { text: 'Non, il/elle est fiable', score: 0 },
          { text: 'Une ou deux fois pour de bonnes raisons', score: 1 },
          { text: 'Régulièrement, les excuses sont peu convaincantes', score: 2 },
          { text: 'Très souvent, je ne peux plus compter sur lui/elle', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire te dit-il/elle encore "je t\'aime" avec la même sincérité qu\'avant ?',
        options: [
          { text: 'Oui, toujours autant', score: 0 },
          { text: 'Moins souvent mais ça va', score: 1 },
          { text: 'Rarement, et ça semble mécanique', score: 2 },
          { text: 'Presque jamais ou semble gêné(e) de le dire', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'il/elle évite certains sujets de conversation ou devient évasif/évasive ?',
        options: [
          { text: 'Non, on peut tout se dire', score: 0 },
          { text: 'Il/Elle change de sujet de temps en temps', score: 1 },
          { text: 'Certains sujets sont clairement tabous', score: 2 },
          { text: 'Évite la plupart des conversations profondes', score: 3 },
        ],
      },
      {
        text: 'As-tu eu une intuition forte que quelque chose ne va pas ?',
        options: [
          { text: 'Non, je me sens rassuré(e)', score: 0 },
          { text: 'Une légère inquiétude par moments', score: 1 },
          { text: 'Souvent un mauvais pressentiment', score: 2 },
          { text: 'Mon instinct me crie que quelque chose se passe', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire sort-il/elle seul(e) plus souvent qu\'avant ?',
        options: [
          { text: 'Non, on sort ensemble comme d\'habitude', score: 0 },
          { text: 'Occasionnellement avec des amis', score: 1 },
          { text: 'Souvent sans vouloir que je l\'accompagne', score: 2 },
          { text: 'Constamment sans moi et refuse que je vienne', score: 3 },
        ],
      },
      {
        text: 'As-tu entendu des rumeurs sur l\'infidélité de ton/ta partenaire ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Une rumeur vague dont je ne sais pas quoi penser', score: 1 },
          { text: 'Plusieurs personnes ont fait des allusions', score: 2 },
          { text: 'Des témoignages directs de personnes de confiance', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire semble coupable ou évite ton regard ?',
        options: [
          { text: 'Non, il/elle me regarde dans les yeux', score: 0 },
          { text: 'Parfois un peu fuyant(e) sans raison apparente', score: 1 },
          { text: 'Souvent mal à l\'aise quand on est en tête-à-tête', score: 2 },
          { text: 'Évite clairement mon regard depuis quelque temps', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire rentre-t-il/elle avec une odeur différente (parfum étranger, alcool) ?',
        options: [
          { text: 'Non, jamais remarqué', score: 0 },
          { text: 'Une fois ou deux, ça peut s\'expliquer', score: 1 },
          { text: 'Régulièrement une odeur inhabituelle', score: 2 },
          { text: 'Souvent une odeur de parfum étranger que je ne connais pas', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire est devenu(e) plus critique de tes défauts ?',
        options: [
          { text: 'Non, il/elle est bienveillant(e)', score: 0 },
          { text: 'Un peu plus exigeant(e) ces derniers temps', score: 1 },
          { text: 'Très critique, semble chercher des défauts', score: 2 },
          { text: 'Très dur(e) avec moi, comme pour se justifier de quelque chose', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire est-il/elle moins présent(e) lors des moments en famille/couple ?',
        options: [
          { text: 'Non, toujours investi(e)', score: 0 },
          { text: 'Un peu distrait(e) parfois', score: 1 },
          { text: 'Souvent dans sa bulle même en groupe', score: 2 },
          { text: 'Physiquement là mais mentalement ailleurs', score: 3 },
        ],
      },
      {
        text: 'Est-ce que votre communication a changé (moins de messages, moins d\'appels) ?',
        options: [
          { text: 'Non, on communique comme avant', score: 0 },
          { text: 'Un peu moins de messages au quotidien', score: 1 },
          { text: 'Beaucoup moins de contacts spontanés', score: 2 },
          { text: 'Il/Elle ne m\'envoie presque plus de messages de lui/elle-même', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle réagi étrangement à la mention d\'une certaine personne ?',
        options: [
          { text: 'Non, tout est normal', score: 0 },
          { text: 'Une légère hésitation une fois', score: 1 },
          { text: 'Gêne visible quand je mentionne certain(e)s personnes', score: 2 },
          { text: 'Réaction très défensive ou change brusquement de sujet', score: 3 },
        ],
      },
      {
        text: 'Est-ce que les projets d\'avenir ensemble semblent moins importants pour lui/elle ?',
        options: [
          { text: 'Non, on planifie toujours ensemble', score: 0 },
          { text: 'Moins d\'enthousiasme pour certains projets', score: 1 },
          { text: 'Évite les discussions sur l\'avenir', score: 2 },
          { text: 'Semble ne plus vouloir construire quelque chose avec moi', score: 3 },
        ],
      },
      {
        text: 'As-tu surpris ton/ta partenaire à mentir sur des petites choses sans importance ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Un petit mensonge isolé', score: 1 },
          { text: 'Plusieurs petits mensonges qui s\'accumulent', score: 2 },
          { text: 'Ment régulièrement sur des détails qui n\'en valent pas la peine', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire t\'a-t-il/elle déjà trompé(e) par le passé ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Il/Elle a eu une relation avant nous qu\'il/elle a terminée bizarrement', score: 1 },
          { text: 'Il/Elle a déjà eu un écart qu\'il/elle m\'a avoué', score: 2 },
          { text: 'Il/Elle m\'a trompé(e) avant et on s\'en est "remis"', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire efface ses conversations ou son historique régulièrement ?',
        options: [
          { text: 'Non, je n\'ai jamais remarqué ça', score: 0 },
          { text: 'Peut-être, mais je n\'y ai pas fait attention', score: 1 },
          { text: 'Oui, j\'ai remarqué des conversations supprimées', score: 2 },
          { text: 'Oui, systématiquement et il/elle s\'énerve si je le remarque', score: 3 },
        ],
      },
      {
        text: 'Dans l\'ensemble, fais-tu encore confiance à ton/ta partenaire ?',
        options: [
          { text: 'Totalement, je n\'ai aucun doute', score: 0 },
          { text: 'Oui, mais avec quelques petits doutes', score: 1 },
          { text: 'De moins en moins, j\'ai du mal à le/la croire', score: 2 },
          { text: 'Non, la confiance est brisée', score: 3 },
        ],
      },
      {
        text: 'Ta partenaire a-t-elle des conversations régulières avec un ami masculin particulier en dehors de ta présence ?',
        options: [
          { text: 'Non, ses amitiés sont transparentes', score: 0 },
          { text: 'Elle a des amis garçons mais ça me semble normal', score: 1 },
          { text: 'Il y en a un qu\'elle mentionne souvent sans que je le connaisse bien', score: 2 },
          { text: 'Elle cache des échanges fréquents avec un garçon en particulier', score: 3 },
        ],
        tags: { genders: ['Un homme'] },
      },
      {
        text: 'Ton partenaire a-t-il des échanges fréquents avec une collègue féminine en dehors des horaires de travail ?',
        options: [
          { text: 'Non, ses contacts professionnels restent dans le cadre du travail', score: 0 },
          { text: 'Parfois, mais dans un cadre professionnel', score: 1 },
          { text: 'Il y a une collègue dont il parle souvent et à qui il écrit tard', score: 2 },
          { text: 'Il cache clairement ses échanges avec une personne du travail', score: 3 },
        ],
        tags: { genders: ['Une femme'] },
      },
      {
        text: 'Y a-t-il une personne dans l\'entourage de ton/ta partenaire dont la présence te dérange intuitivement ?',
        options: [
          { text: 'Non, je me sens bien avec tous ses proches', score: 0 },
          { text: 'Un léger inconfort sans raison précise', score: 1 },
          { text: 'Une personne en particulier dont je ne suis pas rassuré(e)', score: 2 },
          { text: 'Oui, et mon instinct me dit clairement que quelque chose se passe', score: 3 },
        ],
        tags: { genders: ['Non-binaire', 'Je préfère ne pas dire'] },
      },
      {
        text: 'Avez-vous arrêté de vous raconter les détails de votre journée comme vous le faisiez avant ?',
        options: [
          { text: 'Non, on se raconte toujours tout', score: 0 },
          { text: 'Un peu moins, mais c\'est normal après un moment', score: 1 },
          { text: 'Les conversations sont devenues plus superficielles', score: 2 },
          { text: 'On ne partage presque plus rien sur nos journées', score: 3 },
        ],
        tags: { situations: ['En couple'] },
      },
      {
        text: 'Ton/ta partenaire annule-t-il/elle des plans communs plus souvent ces derniers temps ?',
        options: [
          { text: 'Non, il/elle est toujours là comme prévu', score: 0 },
          { text: 'Quelques fois, avec des raisons valables', score: 1 },
          { text: 'Régulièrement, avec des explications vagues', score: 2 },
          { text: 'Systématiquement, et les excuses changent à chaque fois', score: 3 },
        ],
        tags: { situations: ['En couple'] },
      },
      {
        text: 'Les tensions actuelles dans votre relation te semblent-elles liées à une présence extérieure ?',
        options: [
          { text: 'Non, nos tensions viennent de nous deux', score: 0 },
          { text: 'J\'ai parfois ce soupçon mais sans preuve', score: 1 },
          { text: 'Quelques signes me laissent penser qu\'il y a quelqu\'un d\'autre', score: 2 },
          { text: 'J\'en suis presque certain(e), les indices s\'accumulent', score: 3 },
        ],
        tags: { situations: ['Compliqué'] },
      },
      {
        text: 'La personne que tu fréquentes adopte-t-elle des comportements que tu ne comprends pas ou qui te semblent suspects ?',
        options: [
          { text: 'Non, tout me semble clair et honnête', score: 0 },
          { text: 'Quelques zones d\'ombre sans gravité', score: 1 },
          { text: 'Des comportements que j\'ai du mal à m\'expliquer', score: 2 },
          { text: 'Des attitudes clairement suspectes qui me préoccupent', score: 3 },
        ],
        tags: { situations: ['Célibataire', 'Je ne sais pas'] },
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle radicalement changé de cercle d\'amis ou de fréquentations ces derniers mois ?',
        options: [
          { text: 'Non, ses amis sont les mêmes', score: 0 },
          { text: 'Il/Elle a de nouveaux amis mais ça me paraît normal', score: 1 },
          { text: 'Un groupe entier de nouvelles fréquentations que je ne connais pas', score: 2 },
          { text: 'Il/Elle a délaissé ses anciens amis pour des gens que je n\'ai jamais rencontrés', score: 3 },
        ],
        tags: { ageGroups: ['- de 18 ans', '18–24 ans'] },
      },
      {
        text: 'Est-ce que le travail sert souvent de prétexte pour des absences prolongées et imprévues ?',
        options: [
          { text: 'Non, son travail a des horaires stables', score: 0 },
          { text: 'Occasionnellement, mais les heures sup\' font partie de son métier', score: 1 },
          { text: 'De plus en plus souvent, les urgences professionnelles se multiplient', score: 2 },
          { text: 'Le travail justifie des absences à toutes heures, c\'est devenu un alibi permanent', score: 3 },
        ],
        tags: { ageGroups: ['25–34 ans'] },
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle renoué avec d\'anciens amis ou un ex sans t\'en informer spontanément ?',
        options: [
          { text: 'Non, il/elle me parle ouvertement de ses retrouvailles', score: 0 },
          { text: 'Il/Elle me l\'a dit après coup, mais sans se cacher', score: 1 },
          { text: 'J\'ai appris des retrouvailles par hasard, pas par lui/elle', score: 2 },
          { text: 'Je découvre régulièrement des contacts anciens qu\'il/elle me cache délibérément', score: 3 },
        ],
        tags: { ageGroups: ['35–44 ans', '45 ans et +'] },
      },
      {
        text: 'Est-ce que ton/ta partenaire répond différemment à ses messages quand tu es dans la pièce ?',
        options: [
          { text: 'Non, il/elle répond normalement devant moi', score: 0 },
          { text: 'Il/Elle attend parfois d\'être seul(e), mais ce n\'est pas systématique', score: 1 },
          { text: 'Souvent, il/elle prend ses distances pour répondre', score: 2 },
          { text: 'Il/Elle sort de la pièce ou cache son écran dès qu\'un message arrive', score: 3 },
        ],
      },
      {
        text: 'As-tu surpris(e) ton/ta partenaire à mentir sur un détail qui semblait sans importance ?',
        options: [
          { text: 'Jamais, il/elle est toujours cohérent(e)', score: 0 },
          { text: 'Une fois, mais c\'était vraiment anodin', score: 1 },
          { text: 'Plusieurs fois, et les explications ne collent pas', score: 2 },
          { text: 'Les petits mensonges se multiplient, ce qui me fait douter de tout', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire exprime plus d\'irritabilité envers toi sans raison apparente ?',
        options: [
          { text: 'Non, son humeur reste stable', score: 0 },
          { text: 'Un peu plus stressé(e) qu\'avant, mais ça reste gérable', score: 1 },
          { text: 'Oui, des disputes pour des riens sont devenues fréquentes', score: 2 },
          { text: 'Il/Elle semble chercher les occasions pour me faire des reproches', score: 3 },
        ],
      },
      {
        text: 'Ressens-tu que ton/ta partenaire est moins investi(e) dans la construction de votre avenir commun ?',
        options: [
          { text: 'Non, on projette encore beaucoup ensemble', score: 0 },
          { text: 'Un léger manque d\'enthousiasme, mais rien d\'alarmant', score: 1 },
          { text: 'Il/Elle évite de parler du futur ou change de sujet', score: 2 },
          { text: 'Il/Elle parle du futur au singulier, plus au pluriel', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire parle beaucoup d\'une personne en particulier, positivement ou négativement ?',
        options: [
          { text: 'Non, aucun prénom qui revient de façon obsessionnelle', score: 0 },
          { text: 'Un collègue ou ami mentionné normalement', score: 1 },
          { text: 'Un prénom revient souvent dans les conversations', score: 2 },
          { text: 'Il/Elle parle constamment de cette personne, même quand ça n\'a pas de rapport', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle récemment commencé à utiliser une application de messagerie que tu ne connaissais pas ?',
        options: [
          { text: 'Non, ses applications sont les mêmes qu\'avant', score: 0 },
          { text: 'Une nouvelle app apparue avec une explication logique', score: 1 },
          { text: 'Oui, sans vraiment d\'explication convaincante', score: 2 },
          { text: 'Oui, et il/elle la supprime ou cache son écran quand je suis là', score: 3 },
        ],
      },
      {
        text: 'As-tu remarqué que ton/ta partenaire garde son GPS ou sa localisation désactivé(e) ?',
        options: [
          { text: 'Non, la localisation est partagée normalement', score: 0 },
          { text: 'Il/Elle a toujours préféré ne pas partager sa localisation', score: 1 },
          { text: 'C\'est récent et sans explication', score: 2 },
          { text: 'Oui, et il/elle devient défensif/défensive si j\'en parle', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle des conversations téléphoniques qu\'il/elle abrège dès que tu entres dans la pièce ?',
        options: [
          { text: 'Non, jamais remarqué', score: 0 },
          { text: 'Une fois ou deux, mais c\'était professionnel', score: 1 },
          { text: 'Plusieurs fois, et il/elle semble gêné(e)', score: 2 },
          { text: 'Régulièrement, il/elle sort même de la pièce pour répondre', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire évite les photos ou les publications officielles de votre relation ?',
        options: [
          { text: 'Non, il/elle affiche notre relation normalement', score: 0 },
          { text: 'Il/Elle n\'a jamais été très fan des réseaux, c\'est son caractère', score: 1 },
          { text: 'Il/Elle évite de plus en plus d\'être photographié(e) avec moi', score: 2 },
          { text: 'Il/Elle a clairement dissimulé ou supprimé des preuves de notre relation', score: 3 },
        ],
      },
      {
        text: 'As-tu remarqué des changements dans ses habitudes de sommeil (couché(e) très tard, levé(e) tôt) ?',
        options: [
          { text: 'Non, ses habitudes sont régulières', score: 0 },
          { text: 'Quelques nuits courtes liées au stress', score: 1 },
          { text: 'Régulièrement debout tard sur son téléphone', score: 2 },
          { text: 'Fréquemment absent(e) du lit la nuit sans explication', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire fait des cadeaux ou des attentions inattendues sans raison particulière ?',
        options: [
          { text: 'Non, nos échanges sont normaux', score: 0 },
          { text: 'Quelques gestes sympas cohérents avec son caractère', score: 1 },
          { text: 'Des attentions soudaines qui semblent compensatoires', score: 2 },
          { text: 'Des cadeaux inhabituels qui me semblent motivés par la culpabilité', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle changé ses mots de passe ou son code de téléphone sans te le signaler ?',
        options: [
          { text: 'Non, rien n\'a changé', score: 0 },
          { text: 'Peut-être, mais ça ne m\'a pas semblé important', score: 1 },
          { text: 'Oui, et il/elle n\'en a pas parlé spontanément', score: 2 },
          { text: 'Oui, et il/elle est devenu(e) défensif/défensive quand j\'ai remarqué', score: 3 },
        ],
      },
      {
        text: 'Est-ce que la qualité générale de votre relation s\'est dégradée sans explication claire ?',
        options: [
          { text: 'Non, notre relation est stable', score: 0 },
          { text: 'Une légère traversée de crise normale', score: 1 },
          { text: 'Oui, une dégradation notable que je ne comprends pas', score: 2 },
          { text: 'Oui, tout s\'est détérioré rapidement et mystérieusement', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire évite-t-il/elle certains endroits que vous fréquentiez ensemble ?',
        options: [
          { text: 'Non, on va toujours aux mêmes endroits', score: 0 },
          { text: 'Quelques changements d\'habitudes naturels', score: 1 },
          { text: 'Il/Elle évite certains endroits sans vraiment expliquer pourquoi', score: 2 },
          { text: 'Clairement, il/elle refuse des endroits qu\'on fréquentait et c\'est récent', score: 3 },
        ],
      },
      {
        text: 'As-tu l\'impression que ton/ta partenaire vit une double vie entre ce qu\'il/elle dit faire et la réalité ?',
        options: [
          { text: 'Non, tout est cohérent', score: 0 },
          { text: 'Quelques petites incohérences sans gravité', score: 1 },
          { text: 'Des incohérences fréquentes qui me troublent', score: 2 },
          { text: 'Oui, clairement, les histoires ne collent jamais', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire répond-il/elle toujours à tes appels ou les laisse-t-il/elle parfois sans réponse ?',
        options: [
          { text: 'Toujours disponible ou rappelle rapidement', score: 0 },
          { text: 'Parfois indisponible pour de bonnes raisons', score: 1 },
          { text: 'Souvent injoignable pendant de longues périodes', score: 2 },
          { text: 'Régulièrement des appels manqués inexpliqués', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire semble-t-il/elle anxieux/anxieuse quand ta relation est mentionnée devant certaines personnes ?',
        options: [
          { text: 'Non, il/elle parle de nous normalement', score: 0 },
          { text: 'Très légèrement réservé(e) selon les contextes', score: 1 },
          { text: 'Parfois gêné(e) de façon inhabituelle', score: 2 },
          { text: 'Clairement mal à l\'aise devant certaines personnes précises', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire a des moments d\'absence mentale même quand il/elle est physiquement avec toi ?',
        options: [
          { text: 'Non, il/elle est présent(e) quand on est ensemble', score: 0 },
          { text: 'Parfois distrait(e) comme tout le monde', score: 1 },
          { text: 'Souvent dans ses pensées sans raison apparente', score: 2 },
          { text: 'Constamment absent(e) mentalement, comme si quelque chose l\'obsédait', score: 3 },
        ],
      },
      {
        text: 'Dans ton cœur, si tu pouvais connaître la vérité maintenant, serais-tu prêt(e) à l\'entendre ?',
        options: [
          { text: 'Oui, et je suis convaincu(e) qu\'il n\'y a rien à apprendre', score: 0 },
          { text: 'Probablement, même si ça m\'angoisse un peu', score: 1 },
          { text: 'J\'ai peur de ce que je pourrais découvrir', score: 2 },
          { text: 'Une partie de moi la connaît déjà mais refuse de l\'accepter', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire refuse catégoriquement toute forme de transparence dans votre relation ?',
        options: [
          { text: 'Non, il/elle est ouvert(e) et transparent(e)', score: 0 },
          { text: 'Il/Elle a besoin de son espace privé, ce qui est normal', score: 1 },
          { text: 'Devient défensif/défensive quand je demande des clarifications', score: 2 },
          { text: 'Refuse absolument toute transparence et devient agressif/agressive', score: 3 },
        ],
      },
      {
        text: 'Ressens-tu que ton/ta partenaire met de la distance entre vous intentionnellement ?',
        options: [
          { text: 'Non, on est proches comme avant', score: 0 },
          { text: 'Une légère distance liée à une période difficile', score: 1 },
          { text: 'Oui, une distance que je ne comprends pas', score: 2 },
          { text: 'Oui, clairement, comme s\'il/elle voulait s\'éloigner sans rompre', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire a changé sa façon de te présenter à son entourage ?',
        options: [
          { text: 'Non, il/elle me présente toujours comme son/sa partenaire', score: 0 },
          { text: 'Quelques maladresses sans gravité', score: 1 },
          { text: 'Parfois flou(e) dans la façon dont il/elle me présente', score: 2 },
          { text: 'Ne me présente plus ou utilise des termes vagues comme "un ami"', score: 3 },
        ],
      },
      {
        text: 'Ta partenaire est-elle moins démonstrative affectivement en public qu\'avant ?',
        options: [
          { text: 'Non, elle est toujours aussi affectueuse', score: 0 },
          { text: 'Légèrement moins, mais c\'est situationnel', score: 1 },
          { text: 'Clairement moins de contacts physiques en public', score: 2 },
          { text: 'Elle semble éviter tout signe d\'affection publique avec moi', score: 3 },
        ],
        tags: { genders: ['Un homme'] },
      },
      {
        text: 'Ton partenaire a-t-il adopté un nouveau style vestimentaire ou une nouvelle façon de se présenter inexpliquée ?',
        options: [
          { text: 'Non, son style est le même', score: 0 },
          { text: 'Quelques changements normaux dans le temps', score: 1 },
          { text: 'Un changement de style assez prononcé sans raison évidente', score: 2 },
          { text: 'Une transformation d\'image totale qui semble destinée à plaire à quelqu\'un d\'autre', score: 3 },
        ],
        tags: { genders: ['Une femme'] },
      },
      {
        text: 'Avez-vous eu une discussion sur la fidélité récemment qui t\'a laissé(e) avec des doutes ?',
        options: [
          { text: 'Non, on est alignés sur nos valeurs', score: 0 },
          { text: 'Une discussion normale sur nos attentes', score: 1 },
          { text: 'Une conversation qui m\'a laissé(e) avec une impression étrange', score: 2 },
          { text: 'Il/Elle a dit des choses qui m\'ont profondément inquiété(e)', score: 3 },
        ],
        tags: { situations: ['En couple'] },
      },
      {
        text: 'Les tensions actuelles dans votre relation semblent-elles liées à quelque chose que tu ne peux pas identifier ?',
        options: [
          { text: 'Non, les tensions ont des causes claires', score: 0 },
          { text: 'Peut-être, mais ça peut s\'expliquer autrement', score: 1 },
          { text: 'Oui, il y a quelque chose que je n\'arrive pas à nommer', score: 2 },
          { text: 'Clairement, les tensions semblent venir d\'une source extérieure cachée', score: 3 },
        ],
        tags: { situations: ['Compliqué'] },
      },
      {
        text: 'Ton/ta partenaire est-il/elle devenu(e) plus secret(ète) sur ses soirées avec ses amis ces derniers temps ?',
        options: [
          { text: 'Non, il/elle me dit toujours où il/elle va', score: 0 },
          { text: 'Un peu moins de détails, mais rien d\'alarmant', score: 1 },
          { text: 'Régulièrement vague sur qui il/elle voit et où', score: 2 },
          { text: 'Total manque de transparence sur ses sorties sociales', score: 3 },
        ],
        tags: { ageGroups: ['- de 18 ans', '18–24 ans'] },
      },
      {
        text: 'As-tu remarqué que ton/ta partenaire multiplie les déplacements professionnels inattendus ?',
        options: [
          { text: 'Non, son rythme professionnel est stable', score: 0 },
          { text: 'Quelques déplacements supplémentaires liés à son travail', score: 1 },
          { text: 'Beaucoup plus de voyages professionnels depuis peu', score: 2 },
          { text: 'Des déplacements qui semblent des prétextes plutôt que réellement professionnels', score: 3 },
        ],
        tags: { ageGroups: ['25–34 ans', '35–44 ans'] },
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle soudainement redécouvert un hobby qui l\'occupe souvent en dehors de la maison ?',
        options: [
          { text: 'Non, ses centres d\'intérêt sont stables', score: 0 },
          { text: 'Un regain d\'intérêt naturel pour des choses passées', score: 1 },
          { text: 'Une passion soudaine qui justifie des absences répétées', score: 2 },
          { text: 'Un hobby mystérieux que je ne peux pas vérifier', score: 3 },
        ],
        tags: { ageGroups: ['45 ans et +'] },
      },
      {
        text: 'Ton/ta partenaire prend-il/elle davantage soin de son corps (sport, régime) depuis peu sans vraiment l\'expliquer ?',
        options: [
          { text: 'Non, ses habitudes sont stables', score: 0 },
          { text: 'Un regain de forme normal et encouragé', score: 1 },
          { text: 'Un changement soudain et prononcé que je n\'avais pas vu venir', score: 2 },
          { text: 'Une transformation physique qui semble destinée à plaire à quelqu\'un d\'autre', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire semble-t-il/elle expert(e) pour justifier chaque absence avec une histoire très précise ?',
        options: [
          { text: 'Non, ses explications sont naturelles et simples', score: 0 },
          { text: 'Il/Elle explique ses absences normalement', score: 1 },
          { text: 'Les justifications sont parfois trop détaillées pour être spontanées', score: 2 },
          { text: 'Toujours une histoire très construite qui semble préparée à l\'avance', score: 3 },
        ],
      },
      {
        text: 'As-tu découvert des comptes en ligne ou des applications que ton/ta partenaire t\'avait cachés ?',
        options: [
          { text: 'Non, je connais tous ses comptes', score: 0 },
          { text: 'Peut-être, mais ça ne m\'a pas semblé suspect', score: 1 },
          { text: 'J\'ai découvert un compte que je ne connaissais pas', score: 2 },
          { text: 'Plusieurs comptes ou applications cachés découverts par hasard', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ton/ta partenaire est devenu(e) plus critique ou condescendant(e) envers toi sans raison valable ?',
        options: [
          { text: 'Non, il/elle est respectueux/respectueuse', score: 0 },
          { text: 'Quelques critiques légères liées au stress', score: 1 },
          { text: 'Souvent des remarques qui me diminuent', score: 2 },
          { text: 'Très dur(e) envers moi, comme s\'il/elle cherchait à se justifier', score: 3 },
        ],
      },
      {
        text: 'Ton/ta partenaire a-t-il/elle recommencé à utiliser des réseaux sociaux qu\'il/elle avait abandonnés ?',
        options: [
          { text: 'Non, ses habitudes en ligne sont stables', score: 0 },
          { text: 'Il/Elle est revenu(e) sur certains réseaux pour des raisons claires', score: 1 },
          { text: 'Oui, sans vraiment d\'explication convaincante', score: 2 },
          { text: 'Oui, et il/elle cache son activité sur ces plateformes', score: 3 },
        ],
      },
    ],
    resultTiers: [
      {
        min: 0, max: 20,
        emoji: '✅',
        title: 'Rien d\'alarmant',
        message: 'Les signaux que tu décris sont rassurants. Aucun indicateur significatif d\'infidélité n\'est détecté. La confiance est au cœur de votre relation — continue à la cultiver.',
        color: 'text-emerald-400',
        glowColor: '#10b981',
      },
      {
        min: 20, max: 40,
        emoji: '🤔',
        title: 'Quelques doutes',
        message: 'Il y a quelques petits signaux d\'alerte, mais rien d\'alarmant en soi. Toutes les relations traversent des périodes compliquées. Une discussion ouverte et honnête pourrait clarifier tes doutes.',
        color: 'text-yellow-400',
        glowColor: '#facc15',
      },
      {
        min: 40, max: 60,
        emoji: '⚠️',
        title: 'Signaux préoccupants',
        message: 'Il y a suffisamment de signaux pour être préoccupé(e). Ces comportements méritent une explication. Fais confiance à ton instinct et trouve le courage d\'en parler directement.',
        color: 'text-orange-400',
        glowColor: '#fb923c',
      },
      {
        min: 60, max: 80,
        emoji: '🚨',
        title: 'Forte probabilité',
        message: 'Les signaux sont nombreux et concordants. Ces comportements sont typiques d\'une infidélité. Tu mérites la vérité — affronte la situation plutôt que de laisser le doute te ronger.',
        color: 'text-red-400',
        glowColor: '#f87171',
      },
      {
        min: 80, max: 101,
        emoji: '💥',
        title: 'Presque certain(e)',
        message: 'Les indicateurs sont très forts et convergent vers une seule conclusion. Ne te torture plus avec le doute. Tu mérites une relation basée sur la vérité et le respect.',
        color: 'text-red-500',
        glowColor: '#ef4444',
      },
    ],
  },
  {
    slug: 'adopte',
    title: 'Suis-je adopté(e) ?',
    subtitle: 'Indices physiques, comportementaux et familiaux',
    description: '30 questions pour analyser les indices qui pourraient révéler une adoption.',
    emoji: '🧬',
    gradientFrom: 'from-violet-950/80',
    gradientTo: 'to-blue-950/80',
    borderColor: 'border-violet-800/30',
    accentColor: '#8b5cf6',
    questions: [
      {
        text: 'Te ressembles-tu physiquement à tes deux parents ?',
        options: [
          { text: 'Oui, on me dit souvent qu\'on voit la ressemblance', score: 0 },
          { text: 'Un peu, mais les traits varient', score: 1 },
          { text: 'Assez peu, je me distingue nettement de mes parents', score: 2 },
          { text: 'Je ne ressemble vraiment ni à ma mère ni à mon père', score: 3 },
        ],
      },
      {
        text: 'As-tu la même couleur de peau, d\'yeux ou de cheveux que tes parents ?',
        options: [
          { text: 'Oui, tout concorde', score: 0 },
          { text: 'Quelques légères différences explicables', score: 1 },
          { text: 'Différences notables qui nécessitent des explications généalogiques', score: 2 },
          { text: 'Différences très marquées et inexpliquées', score: 3 },
        ],
      },
      {
        text: 'Y a-t-il des photos de ta mère enceinte de toi ?',
        options: [
          { text: 'Oui, plein d\'albums photo', score: 0 },
          { text: 'Quelques photos', score: 1 },
          { text: 'Très peu, mais ça peut s\'expliquer', score: 2 },
          { text: 'Aucune photo de grossesse ni de naissance', score: 3 },
        ],
      },
      {
        text: 'As-tu accès à ton carnet de santé ou ton acte de naissance original ?',
        options: [
          { text: 'Oui, je les ai vus', score: 0 },
          { text: 'Je sais où ils sont mais je ne les ai pas regardés', score: 1 },
          { text: 'On m\'a dit qu\'ils sont quelque part mais je ne les trouve pas', score: 2 },
          { text: 'Ces documents semblent introuvables ou ont "disparu"', score: 3 },
        ],
      },
      {
        text: 'Tes parents ont-ils jamais refusé de répondre à des questions sur ta naissance ?',
        options: [
          { text: 'Non, ils répondent toujours clairement', score: 0 },
          { text: 'Parfois un peu évasifs mais ça se justifie', score: 1 },
          { text: 'Souvent mal à l\'aise quand j\'aborde le sujet', score: 2 },
          { text: 'Esquivent systématiquement ou se contredisent', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'un proche (oncle, tante, grand-parent) a déjà fait une allusion à "une histoire" ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Une remarque vague une fois', score: 1 },
          { text: 'Quelques allusions que j\'ai trouvées bizarres', score: 2 },
          { text: 'Des confidences directes sur une "vérité cachée"', score: 3 },
        ],
      },
      {
        text: 'As-tu des frères/sœurs qui se ressemblent entre eux mais pas à toi ?',
        options: [
          { text: 'Nous nous ressemblons tous', score: 0 },
          { text: 'Légères différences normales', score: 1 },
          { text: 'Mes frères/sœurs se ressemblent entre eux mais moins avec moi', score: 2 },
          { text: 'Je suis très différent(e) physiquement de mes frères/sœurs', score: 3 },
        ],
      },
      {
        text: 'As-tu un groupe sanguin incompatible avec tes parents biologiques supposés ?',
        options: [
          { text: 'Je ne sais pas', score: 0 },
          { text: 'Je connais et c\'est compatible', score: 0 },
          { text: 'Je connais et c\'est un peu étrange', score: 2 },
          { text: 'C\'est biologiquement impossible avec leurs groupes sanguins', score: 3 },
        ],
      },
      {
        text: 'As-tu eu un sentiment inexpliqué de ne pas "appartenir" à ta famille ?',
        options: [
          { text: 'Non, je me sens tout à fait à ma place', score: 0 },
          { text: 'Parfois une légère étrangeté', score: 1 },
          { text: 'Souvent un sentiment d\'être différent(e) sans raison claire', score: 2 },
          { text: 'Un fort sentiment d\'être extérieur(e) à ma famille depuis toujours', score: 3 },
        ],
      },
      {
        text: 'Tes parents sont-ils devenus parents très tardivement ou dans des conditions inhabituelles ?',
        options: [
          { text: 'Non, âge et circonstances très normales', score: 0 },
          { text: 'Un peu plus tardif que la moyenne', score: 1 },
          { text: 'Âge avancé ou circonstances jamais vraiment expliquées', score: 2 },
          { text: 'Conditions très particulières entourées de mystère', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ta personnalité ou tes goûts sont très différents de ceux de ta famille ?',
        options: [
          { text: 'Non, j\'ai beaucoup de traits en commun', score: 0 },
          { text: 'Quelques différences normales', score: 1 },
          { text: 'Assez différent(e) en valeurs et intérêts', score: 2 },
          { text: 'Je me sens radicalement différent(e) de toute ma famille', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà fait un test ADN et quelle en était la conclusion ?',
        options: [
          { text: 'Pas fait de test', score: 0 },
          { text: 'Résultats cohérents avec ma famille', score: 0 },
          { text: 'Résultats un peu surprenants mais pas alarmants', score: 1 },
          { text: 'Résultats très différents de ce que je croyais savoir', score: 3 },
        ],
      },
      {
        text: 'Y a-t-il des antécédents d\'infertilité ou de difficultés à concevoir dans ta famille ?',
        options: [
          { text: 'Pas à ma connaissance', score: 0 },
          { text: 'On m\'a mentionné des difficultés légères', score: 1 },
          { text: 'Plusieurs tentatives longues avant d\'avoir des enfants', score: 2 },
          { text: 'Infertilité connue ou traitements longs avant ma naissance', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ta famille évite certains sujets liés à ta petite enfance ?',
        options: [
          { text: 'Non, on en parle librement', score: 0 },
          { text: 'Légère pudeur sur certains souvenirs', score: 1 },
          { text: 'Certaines périodes semblent floues ou peu documentées', score: 2 },
          { text: 'Ma naissance et petite enfance sont un sujet tabou', score: 3 },
        ],
      },
      {
        text: 'Des amis proches ont-ils déjà remarqué que tu ne ressembles pas à tes parents ?',
        options: [
          { text: 'Jamais, tout le monde voit la ressemblance', score: 0 },
          { text: 'Un commentaire isolé une fois', score: 1 },
          { text: 'Plusieurs personnes l\'ont remarqué', score: 2 },
          { text: 'Commentaires fréquents sur ma dissemblance avec mes parents', score: 3 },
        ],
      },
      {
        text: 'Tes parents sont-ils d\'une ethnie ou nationalité très différente de la tienne visuellement ?',
        options: [
          { text: 'Non, tout est cohérent', score: 0 },
          { text: 'Légères nuances explicables par les ancêtres', score: 1 },
          { text: 'Différences importantes que j\'ai du mal à expliquer', score: 2 },
          { text: 'Différences ethniques évidentes et inexpliquées', score: 3 },
        ],
      },
      {
        text: 'Est-ce que certains membres de ta famille te traitent différemment des autres enfants ?',
        options: [
          { text: 'Non, je suis traité(e) comme tous les autres', score: 0 },
          { text: 'De légères différences d\'attitude', score: 1 },
          { text: 'Je semble traité(e) différemment par certains proches', score: 2 },
          { text: 'Un traitement clairement différent de mes frères/sœurs', score: 3 },
        ],
      },
      {
        text: 'As-tu des questionnements profonds ou récurrents sur "qui tu es vraiment" ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Rarement, et ça passe vite', score: 1 },
          { text: 'Parfois des questionnements sur mon identité', score: 2 },
          { text: 'Souvent une obsession pour mes vraies origines', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tes talents ou prédispositions semblent venir "de nulle part" dans ta famille ?',
        options: [
          { text: 'Non, je retrouve mes talents chez des membres de ma famille', score: 0 },
          { text: 'Quelques aptitudes un peu différentes', score: 1 },
          { text: 'Des talents spécifiques que personne dans ma famille n\'a', score: 2 },
          { text: 'Mon profil est totalement différent de toute ma famille', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà trouvé ou vu des documents légaux inhabituels chez tes parents ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Un document que je ne comprenais pas trop', score: 1 },
          { text: 'Des papiers administratifs qui m\'ont semblé bizarres', score: 2 },
          { text: 'Des papiers liés à une adoption ou tutelle que j\'ai découverts', score: 3 },
        ],
      },
      {
        text: 'Tes parents ont-ils des photos de toi bébé ou nourrisson ?',
        options: [
          { text: 'Oui, beaucoup', score: 0 },
          { text: 'Quelques-unes', score: 1 },
          { text: 'Très peu, curieusement moins que pour mes frères/sœurs', score: 2 },
          { text: 'Presque aucune photo avant l\'âge de 2-3 ans', score: 3 },
        ],
      },
      {
        text: 'Y a-t-il un "mystère" dans l\'histoire de ta naissance (pays différent, date floue) ?',
        options: [
          { text: 'Non, tout est clair', score: 0 },
          { text: 'Un détail mineur pas très clair', score: 1 },
          { text: 'Des éléments flous sur les conditions de ma naissance', score: 2 },
          { text: 'Des incohérences importantes dans l\'histoire de ma naissance', score: 3 },
        ],
      },
      {
        text: 'As-tu des demi-frères ou demi-sœurs dont tu aurais appris l\'existence tardivement ?',
        options: [
          { text: 'Non', score: 0 },
          { text: 'J\'en ai entendu parler vaguement', score: 1 },
          { text: 'J\'en ai découvert un(e) à un moment inattendu', score: 2 },
          { text: 'J\'ai découvert des demi-frères/sœurs dans des circonstances étranges', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu ressens une curiosité très forte pour tes "vraies" origines biologiques ?',
        options: [
          { text: 'Non, je connais mes origines et ça me suffit', score: 0 },
          { text: 'Parfois curieux/curieuse comme tout le monde', score: 1 },
          { text: 'Un besoin fort de comprendre d\'où je viens', score: 2 },
          { text: 'Une obsession pour retrouver mes origines biologiques', score: 3 },
        ],
      },
      {
        text: 'As-tu des traits physiques très différents de tous tes proches (taille, morphologie) ?',
        options: [
          { text: 'Non, je rentre dans la norme familiale', score: 0 },
          { text: 'Quelques différences explicables', score: 1 },
          { text: 'Assez différent(e) physiquement des membres de ma famille', score: 2 },
          { text: 'Je suis physiquement très différent(e) de toute ma famille étendue', score: 3 },
        ],
      },
      {
        text: 'Est-ce que le comportement de tes parents change quand tu parles de ta naissance ?',
        options: [
          { text: 'Non, ils sont sereins', score: 0 },
          { text: 'Légère hésitation parfois', score: 1 },
          { text: 'Clairement mal à l\'aise sur le sujet', score: 2 },
          { text: 'Réaction forte (nervosité, larmes, colère) quand j\'aborde ça', score: 3 },
        ],
      },
      {
        text: 'As-tu essayé de rechercher des ancêtres en ligne et les résultats semblaient incohérents ?',
        options: [
          { text: 'Je n\'ai pas fait de recherche', score: 0 },
          { text: 'J\'ai trouvé des choses qui collent à ce que je savais', score: 0 },
          { text: 'Quelques surprises mais rien de flagrant', score: 1 },
          { text: 'Les recherches montrent des incohérences majeures', score: 3 },
        ],
      },
      {
        text: 'Tes grands-parents évitent-ils de parler de la grossesse de ta mère ?',
        options: [
          { text: 'Non, tout est cohérent dans leurs récits', score: 0 },
          { text: 'Quelques omissions dans les histoires', score: 1 },
          { text: 'Des récits qui semblent contourner la question de la grossesse', score: 2 },
          { text: 'Impossibilité d\'obtenir des récits cohérents sur cette période', score: 3 },
        ],
      },
      {
        text: 'As-tu des maladies héréditaires différentes de celles de ta famille supposée ?',
        options: [
          { text: 'Non, le profil médical est cohérent', score: 0 },
          { text: 'Quelques légères différences', score: 1 },
          { text: 'Des maladies héréditaires dans ma famille que je n\'ai pas du tout', score: 2 },
          { text: 'Profils médicaux très différents sans explication', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà envisagé sérieusement que tu pourrais être adopté(e) ?',
        options: [
          { text: 'Non, cette idée ne m\'a jamais traversé l\'esprit', score: 0 },
          { text: 'Y ai pensé une fois en rigolant', score: 1 },
          { text: 'Cette question me préoccupe parfois sérieusement', score: 2 },
          { text: 'Je suis convaincu(e) que je suis adopté(e)', score: 3 },
        ],
      },
      {
        text: 'Y a-t-il des histoires familiales que ton père raconte différemment de ta mère ?',
        options: [
          { text: 'Non, leurs récits se complètent normalement', score: 0 },
          { text: 'De légères différences de mémoire, comme dans toutes les familles', score: 1 },
          { text: 'Des contradictions sur certains événements précis', score: 2 },
          { text: 'Des versions très différentes, surtout sur les événements entourant ma naissance', score: 3 },
        ],
        tags: { genders: ['Un homme'] },
      },
      {
        text: 'As-tu des traits physiques ou de personnalité que ni ta mère ni ton père ne partagent ?',
        options: [
          { text: 'Non, je me reconnais dans les deux', score: 0 },
          { text: 'Quelques différences, mais c\'est le cas dans beaucoup de familles', score: 1 },
          { text: 'Je ressemble à un côté de la famille mais pas à l\'autre', score: 2 },
          { text: 'Je ne ressemble vraiment à aucun des deux, ni physiquement ni de caractère', score: 3 },
        ],
        tags: { genders: ['Une femme'] },
      },
      {
        text: 'As-tu entamé des recherches indépendantes sur tes origines ou envisages-tu de le faire ?',
        options: [
          { text: 'Non, je n\'ai pas ce besoin', score: 0 },
          { text: 'J\'y pense parfois mais sans y avoir donné suite', score: 1 },
          { text: 'J\'ai commencé à chercher quelques informations discrètement', score: 2 },
          { text: 'J\'ai déjà entrepris des recherches sérieuses', score: 3 },
        ],
        tags: { situations: ['Célibataire'] },
      },
      {
        text: 'Ton/ta partenaire ou ses proches ont-ils jamais remarqué que tu ne ressembles pas à ta famille ?',
        options: [
          { text: 'Non, personne n\'en a jamais fait la remarque', score: 0 },
          { text: 'On a commenté une différence sans y attacher d\'importance', score: 1 },
          { text: 'Plusieurs personnes l\'ont remarqué, ce qui m\'a interpellé', score: 2 },
          { text: 'C\'est une remarque récurrente dans mon entourage', score: 3 },
        ],
        tags: { situations: ['En couple', 'Compliqué'] },
      },
      {
        text: 'Tes parents réagissent-ils de façon inhabituelle quand tu poses des questions directes sur ta naissance ?',
        options: [
          { text: 'Non, ils répondent facilement', score: 0 },
          { text: 'Ils sont parfois évasifs mais pas plus que sur d\'autres sujets', score: 1 },
          { text: 'Ils changent de sujet ou deviennent mal à l\'aise', score: 2 },
          { text: 'Ils s\'agitent ou refusent catégoriquement d\'en parler', score: 3 },
        ],
        tags: { ageGroups: ['- de 18 ans', '18–24 ans'] },
      },
      {
        text: 'As-tu eu facilement accès à tous tes documents d\'état civil originaux comme ton acte de naissance ?',
        options: [
          { text: 'Oui, sans aucune difficulté', score: 0 },
          { text: 'Un peu de délai, mais rien d\'anormal', score: 1 },
          { text: 'On me les a donnés avec réticence ou de façon incomplète', score: 2 },
          { text: 'Ces documents sont introuvables ou on refuse de me les montrer', score: 3 },
        ],
        tags: { ageGroups: ['25–34 ans', '35–44 ans'] },
      },
      {
        text: 'As-tu découvert tardivement des informations sur ton passé que ta famille t\'avait cachées ?',
        options: [
          { text: 'Non, je ne pense pas avoir de secrets de famille majeurs', score: 0 },
          { text: 'Des informations mineures découvertes par hasard', score: 1 },
          { text: 'Des révélations surprenantes sur mes origines ou mon histoire', score: 2 },
          { text: 'Des informations importantes cachées intentionnellement pendant des années', score: 3 },
        ],
        tags: { ageGroups: ['45 ans et +'] },
      },
      {
        text: 'As-tu trouvé chez toi des documents rangés à l\'écart ou apparemment dissimulés ?',
        options: [
          { text: 'Non, les documents de famille sont accessibles', score: 0 },
          { text: 'Des papiers anciens rangés normalement', score: 1 },
          { text: 'Des enveloppes ou dossiers auxquels je n\'avais pas accès', score: 2 },
          { text: 'Des documents clairement cachés que j\'ai découverts par accident', score: 3 },
        ],
      },
      {
        text: 'Y a-t-il des membres de la famille dont on évite soigneusement de parler ?',
        options: [
          { text: 'Non, tous les membres sont mentionnés librement', score: 0 },
          { text: 'Un parent éloigné dont on parle peu sans raison claire', score: 1 },
          { text: 'Un sujet tabou autour de certains membres de la famille', score: 2 },
          { text: 'Des proches dont le nom provoque un malaise évident quand je l\'évoque', score: 3 },
        ],
      },
      {
        text: 'As-tu un groupe sanguin incompatible avec celui de tes deux parents ?',
        options: [
          { text: 'Non, ou je n\'ai jamais vérifié et ça ne m\'inquiète pas', score: 0 },
          { text: 'Je ne connais pas les groupes sanguins de mes parents', score: 1 },
          { text: 'Il y a une incompatibilité théorique que j\'ai remarquée', score: 2 },
          { text: 'Mon groupe sanguin est biologiquement impossible avec les deux parents déclarés', score: 3 },
        ],
      },
      {
        text: 'Des membres de ta famille ont-ils déjà commenté combien tu es différent(e) de tous les autres ?',
        options: [
          { text: 'Non, jamais de façon significative', score: 0 },
          { text: 'Des taquineries légères sur une ressemblance lointaine', score: 1 },
          { text: 'Des remarques régulières sur combien je suis différent(e)', score: 2 },
          { text: 'Des commentaires récurrents sur le fait que je ne ressemble à personne dans la famille', score: 3 },
        ],
      },
      {
        text: 'As-tu réalisé ou envisages-tu de faire un test ADN pour en savoir plus sur tes origines ?',
        options: [
          { text: 'Non, je n\'en ressens pas le besoin', score: 0 },
          { text: 'J\'y ai pensé par curiosité sans lien avec un doute profond', score: 1 },
          { text: 'J\'envisage sérieusement d\'en faire un pour vérifier', score: 2 },
          { text: 'Je l\'ai fait ou je suis en attente de résultats', score: 3 },
        ],
      },
      {
        text: 'N\'as-tu jamais vu de photos de ta mère visiblement enceinte de toi dans les albums de famille ?',
        options: [
          { text: 'Si, il y en a plusieurs', score: 0 },
          { text: 'Il y en a peu, mais les grossesses étaient peu photographiées à l\'époque', score: 1 },
          { text: 'Je n\'en ai pas trouvé malgré mes recherches', score: 2 },
          { text: 'Aucune photo de grossesse n\'existe et on change de sujet quand j\'en parle', score: 3 },
        ],
      },
      {
        text: 'As-tu des prédispositions médicales héréditaires absentes de tout l\'arbre familial connu ?',
        options: [
          { text: 'Non, mon profil médical est cohérent avec ma famille', score: 0 },
          { text: 'Quelques petites différences sans caractère alarmant', score: 1 },
          { text: 'Des prédispositions qui ne s\'expliquent pas par l\'hérédité connue', score: 2 },
          { text: 'Des conditions médicales héréditaires absentes de tout l\'arbre familial', score: 3 },
        ],
      },
      {
        text: 'Tes grands-parents et oncles/tantes traitent-ils tous les enfants de la famille exactement de la même façon ?',
        options: [
          { text: 'Oui, tout le monde est traité pareil', score: 0 },
          { text: 'De légères préférences naturelles selon les affinités', score: 1 },
          { text: 'Je ressens parfois que je suis traité(e) un peu différemment', score: 2 },
          { text: 'La différence de traitement entre moi et les autres est notable et inexpliquée', score: 3 },
        ],
      },
      {
        text: 'Des personnes extérieures à ta famille ont-elles déjà remarqué que tu ne ressembles pas à tes parents ?',
        options: [
          { text: 'Non, on me dit souvent que je ressemble à l\'un ou l\'autre', score: 0 },
          { text: 'Quelques remarques anodines sur certaines différences', score: 1 },
          { text: 'Oui, plusieurs personnes l\'ont noté avec étonnement', score: 2 },
          { text: 'Régulièrement, et ça me frappe moi-même quand je nous compare', score: 3 },
        ],
      },
      {
        text: 'As-tu des traits physiques ou des capacités qui ne semblent correspondre à aucun membre de ta famille proche ?',
        options: [
          { text: 'Non, je retrouve mes traits dans la famille', score: 0 },
          { text: 'Un ou deux détails qui s\'expliquent par des générations précédentes', score: 1 },
          { text: 'Oui, plusieurs caractéristiques que personne d\'autre n\'a', score: 2 },
          { text: 'Je me sens physiquement et génétiquement très différent(e) de ma famille', score: 3 },
        ],
      },
      {
        text: 'Comment ta famille réagit-elle quand tu poses des questions sur ta naissance ou ta petite enfance ?',
        options: [
          { text: 'Avec plaisir — ils ont plein d\'anecdotes et de photos', score: 0 },
          { text: 'Normalement, même si les souvenirs sont parfois flous', score: 1 },
          { text: 'Ils changent vite de sujet ou restent vagues', score: 2 },
          { text: 'Une gêne visible ou un malaise difficile à interpréter', score: 3 },
        ],
      },
      {
        text: 'Y a-t-il des photos de ta mère enceinte ?',
        options: [
          { text: 'Oui, beaucoup — c\'est bien documenté', score: 0 },
          { text: 'Quelques-unes, c\'était une époque où on photographiait moins', score: 1 },
          { text: 'Très peu, et ça m\'a toujours semblé bizarre', score: 2 },
          { text: 'Aucune, et la question a été esquivée quand je l\'ai posée', score: 3 },
        ],
      },
      {
        text: 'As-tu un groupe sanguin ou des caractéristiques médicales héréditaires que personne dans ta famille ne partage ?',
        options: [
          { text: 'Non, tout correspond à ce qu\'on pourrait attendre génétiquement', score: 0 },
          { text: 'De légères différences facilement explicables', score: 1 },
          { text: 'Des incohérences qui m\'ont surpris(e) mais que j\'ai mises de côté', score: 2 },
          { text: 'Des éléments médicaux impossibles à expliquer par ma généalogie connue', score: 3 },
        ],
      },
      {
        text: 'As-tu un lien affectif particulier avec un(e) voisin(e) ou ami(e) de la famille qui dépasse tes liens avec tes parents ?',
        options: [
          { text: 'Non, mes liens les plus forts sont avec mes parents', score: 0 },
          { text: 'J\'ai des affinités avec certains adultes mais rien d\'inhabituel', score: 1 },
          { text: 'Oui, je me sens parfois plus compris(e) par quelqu\'un d\'extérieur', score: 2 },
          { text: 'Un lien très fort avec quelqu\'un d\'extérieur que je n\'arrive pas à m\'expliquer', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà surpris des adultes de ta famille parler à voix basse d\'un sujet qui s\'est arrêté à ton arrivée ?',
        options: [
          { text: 'Non, les conversations familiales sont généralement ouvertes', score: 0 },
          { text: 'Une ou deux fois, mais probablement pour des raisons banales', score: 1 },
          { text: 'Oui, et j\'avais le sentiment que ça me concernait', score: 2 },
          { text: 'Régulièrement dans mon enfance, avec un malaise palpable', score: 3 },
        ],
      },
      {
        text: 'Ta personnalité, tes valeurs ou tes intérêts sont-ils radicalement différents de ceux de tes parents ?',
        options: [
          { text: 'Non, on se ressemble beaucoup dans nos valeurs fondamentales', score: 0 },
          { text: 'Des différences normales entre générations', score: 1 },
          { text: 'Je suis assez différent(e) d\'eux, parfois ça m\'interpelle', score: 2 },
          { text: 'Je me sens fondamentalement différent(e), comme venu(e) d\'un autre monde', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu accès à des documents officiels qui semblaient incomplets ou incohérents ?',
        options: [
          { text: 'Non, tout ce que j\'ai vu était normal et cohérent', score: 0 },
          { text: 'Je n\'ai jamais vraiment cherché à vérifier', score: 1 },
          { text: 'J\'ai noté des lacunes sans savoir comment les interpréter', score: 2 },
          { text: 'Oui, des éléments qui ne correspondaient pas et qu\'on n\'a pas pu m\'expliquer', score: 3 },
        ],
      },
      {
        text: 'Tes passions intellectuelles, artistiques ou sportives sont-elles présentes chez tes parents ou dans ta fratrie ?',
        options: [
          { text: 'Oui, on partage beaucoup de goûts et de passions', score: 0 },
          { text: 'Quelques passions communes, d\'autres propres à moi', score: 1 },
          { text: 'Mes passions profondes sont absentes chez mes proches', score: 2 },
          { text: 'Personne dans ma famille ne partage ce qui me définit vraiment', score: 3 },
        ],
      },
      {
        text: 'Un(e) grand-parent ou un(e) vieille tante/oncle a-t-il/elle déjà fait une remarque étrange sur tes origines qui a été rapidement balayée ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Des remarques amusantes sur des ressemblances lointaines', score: 1 },
          { text: 'Une remarque ambiguë qui m\'a laissé(e) perplexe', score: 2 },
          { text: 'Oui, quelque chose qui a semblé gêner tout le monde', score: 3 },
        ],
      },
      {
        text: 'As-tu un prénom ou un surnom familial qui semble ne correspondre à aucune tradition familiale connue ?',
        options: [
          { text: 'Non, mon prénom a une histoire familiale claire', score: 0 },
          { text: 'Mon prénom est original mais a été choisi par goût', score: 1 },
          { text: 'Mon prénom n\'a pas vraiment d\'explication satisfaisante', score: 2 },
          { text: 'Mon prénom semble venir d\'ailleurs et personne n\'en parle vraiment', score: 3 },
        ],
      },
      {
        text: 'Tes parents ont-ils été inhabituellement protecteurs ou secrets sur certains aspects de ton passé ?',
        options: [
          { text: 'Non, ils ont toujours été ouverts sur notre histoire familiale', score: 0 },
          { text: 'Discrets sur certains sujets familiaux douloureux, normal', score: 1 },
          { text: 'Une protection qui m\'a parfois semblé disproportionnée', score: 2 },
          { text: 'Très secrets sur des sujets précis concernant mon enfance ou ma naissance', score: 3 },
        ],
      },
      {
        text: 'Ressens-tu une attirance inexpliquée pour explorer ton arbre généalogique ou retrouver des origines ?',
        options: [
          { text: 'Non, je connais bien mes origines et ça me suffit', score: 0 },
          { text: 'Une curiosité normale pour l\'histoire familiale', score: 1 },
          { text: 'Une envie assez forte de comprendre d\'où je viens vraiment', score: 2 },
          { text: 'Une obsession qui me fait sentir que quelque chose manque', score: 3 },
        ],
      },
      {
        text: 'As-tu jamais trouvé un objet mystérieux dans la maison familiale (lettre, photo, document) sans explication ?',
        options: [
          { text: 'Non, rien de particulièrement mystérieux', score: 0 },
          { text: 'Des vieilles affaires sans importance particulière', score: 1 },
          { text: 'Un ou deux éléments que je n\'ai jamais pu replacer dans l\'histoire familiale', score: 2 },
          { text: 'Oui, quelque chose qui m\'a troublé(e) et dont on n\'a jamais parlé', score: 3 },
        ],
      },
      {
        text: 'Te sens-tu parfois "étranger(ère)" dans les réunions de famille, sans pouvoir l\'expliquer ?',
        options: [
          { text: 'Non, je me sens complètement à ma place', score: 0 },
          { text: 'La timidité ou mes différences de caractère, rien d\'autre', score: 1 },
          { text: 'Parfois un sentiment d\'être à part, difficile à nommer', score: 2 },
          { text: 'Souvent le sentiment de ne pas vraiment appartenir à ce groupe', score: 3 },
        ],
      },
      {
        text: 'As-tu jamais fait ou envisagé sérieusement de faire un test ADN d\'ascendance ?',
        options: [
          { text: 'Non, je n\'en ressens pas le besoin', score: 0 },
          { text: 'Par curiosité culturelle générale, pas pour des doutes précis', score: 1 },
          { text: 'J\'y pense parfois en me demandant ce que ça révélerait', score: 2 },
          { text: 'Oui, avec une anxiété particulière à l\'idée des résultats', score: 3 },
        ],
      },
      {
        text: 'Ta mère a-t-elle déjà partagé des détails précis et spontanés sur ta grossesse et ta naissance ?',
        options: [
          { text: 'Oui, avec enthousiasme et beaucoup de détails', score: 0 },
          { text: 'Quelques souvenirs, comme pour n\'importe quelle naissance', score: 1 },
          { text: 'Peu de détails, toujours un peu vague sur cette période', score: 2 },
          { text: 'Elle change de sujet ou donne des réponses contradictoires', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu l\'intuition persistante qu\'un secret important te concernait dans ta famille ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'De vagues impressions d\'enfant qui ne m\'ont pas suivi', score: 1 },
          { text: 'Oui, une intuition qui revient de temps en temps', score: 2 },
          { text: 'Une certitude intérieure que quelque chose d\'important m\'a été caché', score: 3 },
        ],
      },
      {
        text: 'Quelle est ta réaction émotionnelle à l\'idée d\'être potentiellement adopté(e) ?',
        options: [
          { text: 'Ça ne me touche pas, je me sens sûr(e) de mes origines', score: 0 },
          { text: 'Curieux/se mais sans anxiété particulière', score: 1 },
          { text: 'Un mélange d\'inquiétude et de curiosité difficile à ignorer', score: 2 },
          { text: 'Une résonance émotionnelle forte, comme si une partie de moi y croyait', score: 3 },
        ],
      },
      {
        text: 'Les maladies ou conditions génétiques connues dans ta famille se retrouvent-elles chez toi ?',
        options: [
          { text: 'Oui, les prédispositions familiales me correspondent', score: 0 },
          { text: 'Quelques correspondances, d\'autres moins', score: 1 },
          { text: 'J\'ai des conditions que personne d\'autre dans ma famille n\'a', score: 2 },
          { text: 'Les profils médicaux semblent totalement différents', score: 3 },
        ],
      },
      {
        text: 'As-tu des talents ou des aptitudes que tes parents ne peuvent pas expliquer d\'où ils viennent ?',
        options: [
          { text: 'Non, mes talents s\'inscrivent dans la lignée familiale', score: 0 },
          { text: 'Des aptitudes que mes parents attribuent à "un ancêtre lointain"', score: 1 },
          { text: 'Des dons que personne dans la famille ne partage et qui semblent venir de nulle part', score: 2 },
          { text: 'Un talent dominant totalement absent chez mes parents et mes frères/sœurs', score: 3 },
        ],
      },
      {
        text: 'Ton style de pensée, ta logique ou ta façon d\'aborder les problèmes ressemblent-ils à ceux de tes parents ?',
        options: [
          { text: 'Oui, on se ressemble beaucoup dans notre façon de raisonner', score: 0 },
          { text: 'Des similitudes avec des nuances générationnelles', score: 1 },
          { text: 'Ma façon de penser est assez différente de la leur', score: 2 },
          { text: 'On semble fonctionner de façons fondamentalement différentes', score: 3 },
        ],
      },
      {
        text: 'Y a-t-il des membres de ta famille étendue qui semblent mal à l\'aise quand tu es présent(e) ?',
        options: [
          { text: 'Non, les relations familiales sont globalement naturelles', score: 0 },
          { text: 'Des tensions normales liées aux personnalités', score: 1 },
          { text: 'Un(e) ou deux personnes dont l\'attitude m\'a parfois semblé étrange', score: 2 },
          { text: 'Un malaise particulier chez certains membres que je n\'arrive pas à expliquer', score: 3 },
        ],
      },
      {
        text: 'Lorsque tu te regardes dans un miroir entouré(e) de ta famille, quelle est ta première impression ?',
        options: [
          { text: 'Je vois clairement des ressemblances avec eux', score: 0 },
          { text: 'Quelques ressemblances, d\'autres traits bien à moi', score: 1 },
          { text: 'Peu de ressemblances visibles, ça m\'a parfois frappé(e)', score: 2 },
          { text: 'L\'impression de voir un étranger parmi eux', score: 3 },
        ],
      },
      {
        text: 'T\'a-t-on déjà dit "tu es tombé(e) dans une bonne famille" en sous-entendant que vous n\'étiez pas d\'origine commune ?',
        options: [
          { text: 'Non, jamais quelque chose de ce genre', score: 0 },
          { text: 'Une blague anodine sans arrière-pensée apparente', score: 1 },
          { text: 'Une phrase qui m\'a fait réfléchir à l\'époque', score: 2 },
          { text: 'Oui, et ça m\'a profondément troublé(e)', score: 3 },
        ],
      },
      {
        text: 'Qu\'est-ce qui te pousse à passer ce quiz aujourd\'hui ?',
        options: [
          { text: 'Simple curiosité, pas de vraie raison derrière', score: 0 },
          { text: 'Des questions qui m\'ont effleuré l\'esprit parfois', score: 1 },
          { text: 'Des doutes qui me tracassent depuis un moment', score: 2 },
          { text: 'Une conviction intérieure que je cherche à confronter à la réalité', score: 3 },
        ],
      },
      {
        text: 'Si tu apprenais que tu es adopté(e), comment réagirais-tu ?',
        options: [
          { text: 'Avec incrédulité totale — c\'est impossible selon moi', score: 0 },
          { text: 'Avec surprise mais sans effondrement', score: 1 },
          { text: 'Avec un soulagement mêlé de tristesse', score: 2 },
          { text: 'Avec un sentiment que ça confirme ce que je ressentais depuis longtemps', score: 3 },
        ],
      },
      {
        text: 'As-tu un souvenir flou ou fragmenté de ton enfance que ta famille ne confirme pas ?',
        options: [
          { text: 'Non, mes souvenirs correspondent à ce que la famille raconte', score: 0 },
          { text: 'Quelques détails différents, normal selon les points de vue', score: 1 },
          { text: 'Un ou deux souvenirs que personne ne peut confirmer', score: 2 },
          { text: 'Des bribes de mémoire qui semblent appartenir à une autre version de mon enfance', score: 3 },
        ],
      },
      {
        text: 'Tes frères et sœurs (si tu en as) te traitent-ils comme l\'un des leurs de façon naturelle ?',
        options: [
          { text: 'Oui, les liens fraternels sont forts et naturels', score: 0 },
          { text: 'Des relations normales avec leurs hauts et bas habituels', score: 1 },
          { text: 'Une légère distance que j\'attribue aux différences de caractère', score: 2 },
          { text: 'Une distance inexpliquée ou des comportements qui m\'ont toujours intrigué(e)', score: 3 },
        ],
      },
    ],
    resultTiers: [
      {
        min: 0, max: 20,
        emoji: '👨‍👩‍👧',
        title: 'Très peu probable',
        message: 'Rien ne semble indiquer que tu sois adopté(e). Ta famille biologique semble bien être la tienne. Les quelques différences que tu notes sont tout à fait normales dans toutes les familles.',
        color: 'text-violet-300',
        glowColor: '#a78bfa',
      },
      {
        min: 20, max: 40,
        emoji: '🤷',
        title: 'Quelques interrogations',
        message: 'Quelques petites interrogations existent, mais rien d\'alarmant. La plupart des familles ont leurs petits mystères et leurs différences. Ces éléments ne sont pas suffisants pour conclure.',
        color: 'text-blue-400',
        glowColor: '#60a5fa',
      },
      {
        min: 40, max: 60,
        emoji: '🔍',
        title: 'Mérite réflexion',
        message: 'Plusieurs éléments méritent réflexion. Un test ADN ou une conversation honnête et bienveillante avec tes parents pourrait te donner la paix de l\'esprit que tu cherches.',
        color: 'text-yellow-400',
        glowColor: '#facc15',
      },
      {
        min: 60, max: 80,
        emoji: '🧩',
        title: 'Indices sérieux',
        message: 'Plusieurs indices concordants suggèrent une possible adoption. Tu mérites de connaître toute la vérité sur tes origines. Un dialogue honnête avec tes parents s\'impose.',
        color: 'text-orange-400',
        glowColor: '#fb923c',
      },
      {
        min: 80, max: 101,
        emoji: '📋',
        title: 'Très probable',
        message: 'Les indices sont nombreux et concordants. L\'hypothèse d\'une adoption est très plausible. Quelles que soient tes origines, tu mérites de connaître toute la vérité pour construire ton identité.',
        color: 'text-violet-400',
        glowColor: '#c084fc',
      },
    ],
  },
  {
    slug: 'amoureux',
    title: 'Suis-je amoureux/amoureuse ?',
    subtitle: 'Les signes qui ne trompent pas',
    description: '30 questions pour savoir si ce que tu ressens, c\'est vraiment de l\'amour.',
    emoji: '💕',
    gradientFrom: 'from-pink-950/80',
    gradientTo: 'to-rose-950/80',
    borderColor: 'border-pink-800/30',
    accentColor: '#ec4899',
    questions: [
      {
        text: 'Est-ce que tu penses à cette personne plusieurs fois par jour ?',
        options: [
          { text: 'Non, rarement', score: 0 },
          { text: 'Oui, de temps en temps', score: 1 },
          { text: 'Souvent, plusieurs fois par jour', score: 2 },
          { text: 'Constamment, c\'est difficile de penser à autre chose', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu souris spontanément quand tu reçois un message de cette personne ?',
        options: [
          { text: 'Non, c\'est neutre', score: 0 },
          { text: 'Parfois selon le contexte', score: 1 },
          { text: 'Souvent sans pouvoir m\'en empêcher', score: 2 },
          { text: 'Toujours, un grand sourire bête incontrôlable', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu ressens des "papillons dans le ventre" en présence de cette personne ?',
        options: [
          { text: 'Non, pas spécialement', score: 0 },
          { text: 'Légère excitation parfois', score: 1 },
          { text: 'Souvent une nervosité agréable', score: 2 },
          { text: 'Toujours, le cœur s\'emballe automatiquement', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu t\'intéresses sincèrement à ses goûts, passions et projets ?',
        options: [
          { text: 'Peu, comme pour n\'importe qui', score: 0 },
          { text: 'Oui, un peu plus qu\'à l\'habitude', score: 1 },
          { text: 'Beaucoup, j\'essaie même de partager ses intérêts', score: 2 },
          { text: 'Je mémorise tout et m\'intéresse passionnément à tout ce qui le/la touche', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu ressens de la jalousie quand tu le/la vois avec d\'autres personnes ?',
        options: [
          { text: 'Non, aucunement', score: 0 },
          { text: 'Un léger inconfort parfois', score: 1 },
          { text: 'Oui, un sentiment désagréable', score: 2 },
          { text: 'Très jaloux/jalouse, ça me ronge vraiment', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu prends soin de ton apparence davantage quand tu sais que tu vas le/la voir ?',
        options: [
          { text: 'Non, je suis pareil(le) avec tout le monde', score: 0 },
          { text: 'Un peu plus attentif/attentive', score: 1 },
          { text: 'Oui, je m\'y prépare avec soin', score: 2 },
          { text: 'Je passe un temps considérable à me préparer uniquement pour lui/elle', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu rougis ou bégaies en sa présence ?',
        options: [
          { text: 'Non, je suis totalement à l\'aise', score: 0 },
          { text: 'Parfois un peu intimidé(e)', score: 1 },
          { text: 'Souvent, je perds mes mots', score: 2 },
          { text: 'Toujours, c\'est ingérable tellement je suis gêné(e)', score: 3 },
        ],
      },
      {
        text: 'As-tu envie de partager tes joies et tes peines en premier avec cette personne ?',
        options: [
          { text: 'Non, j\'ai d\'autres personnes pour ça', score: 0 },
          { text: 'Parfois il/elle est le/la premier(e) que j\'appelle', score: 1 },
          { text: 'Souvent, il/elle est ma référence principale', score: 2 },
          { text: 'Toujours, c\'est à lui/elle que je pense instinctivement', score: 3 },
        ],
      },
      {
        text: 'Est-ce que son bonheur est aussi important que le tien ?',
        options: [
          { text: 'Non, pas plus que pour n\'importe qui d\'autre', score: 0 },
          { text: 'Oui, son bien-être me tient à cœur', score: 1 },
          { text: 'Très important, je ferais des sacrifices pour lui/elle', score: 2 },
          { text: 'Son bonheur passe parfois avant le mien sans que je le regrette', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu mémorises des détails que cette personne a mentionnés ?',
        options: [
          { text: 'Non, comme pour tout le monde', score: 0 },
          { text: 'Quelques détails importants', score: 1 },
          { text: 'Beaucoup de petits détails', score: 2 },
          { text: 'Tout : anniversaires, plats préférés, anecdotes, habitudes', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu imagines votre avenir ensemble ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Des pensées vagues de temps en temps', score: 1 },
          { text: 'Parfois des scénarios assez précis', score: 2 },
          { text: 'Souvent des projections très détaillées', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu cherches des occasions pour passer du temps avec cette personne ?',
        options: [
          { text: 'Non, si ça vient naturellement c\'est bien', score: 0 },
          { text: 'Parfois je crée des occasions', score: 1 },
          { text: 'Souvent je cherche des prétextes', score: 2 },
          { text: 'Toujours, j\'organise ma vie autour de ses disponibilités', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu trouves ses défauts attendrissants plutôt qu\'agaçants ?',
        options: [
          { text: 'Non, un défaut reste un défaut', score: 0 },
          { text: 'Certains oui', score: 1 },
          { text: 'La plupart du temps oui', score: 2 },
          { text: 'Je trouve tous ses "défauts" absolument adorables', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu analyses ses messages pour y trouver des sous-textes ?',
        options: [
          { text: 'Non, je prends tout au premier degré', score: 0 },
          { text: 'Parfois pour une phrase ambiguë', score: 1 },
          { text: 'Souvent pour comprendre ce qu\'il/elle "veut vraiment dire"', score: 2 },
          { text: 'Toujours, j\'analyse chaque mot et chaque emoji', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu as du mal à te concentrer quand il/elle est dans les parages ?',
        options: [
          { text: 'Non, je reste concentré(e) normalement', score: 0 },
          { text: 'Un peu distrait(e)', score: 1 },
          { text: 'Souvent difficile de penser à autre chose', score: 2 },
          { text: 'Je n\'arrive plus à me concentrer du tout', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu ressens une douleur à l\'idée de le/la perdre ou de ne plus jamais le/la voir ?',
        options: [
          { text: 'Non, ce serait dommage mais c\'est la vie', score: 0 },
          { text: 'Un peu triste à cette pensée', score: 1 },
          { text: 'Ça me perturbe vraiment', score: 2 },
          { text: 'L\'idée m\'est physiquement insupportable', score: 3 },
        ],
      },
      {
        text: 'Est-ce que son opinion sur toi compte beaucoup pour toi ?',
        options: [
          { text: 'Autant que celle d\'autres personnes', score: 0 },
          { text: 'Un peu plus', score: 1 },
          { text: 'Beaucoup, je veux qu\'il/elle ait une bonne image de moi', score: 2 },
          { text: 'C\'est l\'opinion qui compte le plus dans ma vie', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu cherches des points communs entre vous ?',
        options: [
          { text: 'Non, les différences sont intéressantes', score: 0 },
          { text: 'Oui, avec plaisir si je trouve', score: 1 },
          { text: 'Souvent, je note toutes les ressemblances', score: 2 },
          { text: 'Je surinterprète les moindres coïncidences comme des "signes du destin"', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu as parlé de cette personne à tes proches ?',
        options: [
          { text: 'Non, pas spécialement', score: 0 },
          { text: 'Une ou deux fois mentionné(e)', score: 1 },
          { text: 'J\'en parle assez régulièrement', score: 2 },
          { text: 'Je l\'amène dans presque toutes mes conversations', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens plus vivant(e) et joyeux/joyeuse en sa présence ?',
        options: [
          { text: 'Non, je suis le même/la même', score: 0 },
          { text: 'Un peu plus d\'énergie', score: 1 },
          { text: 'Nettement plus vivant(e) et joyeux/joyeuse', score: 2 },
          { text: 'C\'est comme si le monde entier devenait plus brillant', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu lui pardonnes plus facilement qu\'aux autres ?',
        options: [
          { text: 'Non, je suis équitable', score: 0 },
          { text: 'Un peu plus indulgent(e)', score: 1 },
          { text: 'Beaucoup plus tolérant(e)', score: 2 },
          { text: 'Je lui pardonnerais presque n\'importe quoi', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu surveilles ses réseaux sociaux régulièrement ?',
        options: [
          { text: 'Non, pas du tout', score: 0 },
          { text: 'Je regarde ses posts comme ceux des autres', score: 1 },
          { text: 'Je regarde ses stories/posts plus souvent que les autres', score: 2 },
          { text: 'Je vais régulièrement sur son profil même sans notification', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu ressens une fierté quand il/elle réussit quelque chose ?',
        options: [
          { text: 'Comme pour n\'importe qui', score: 0 },
          { text: 'Un peu plus', score: 1 },
          { text: 'Vraiment fier/fière comme si c\'était ma propre réussite', score: 2 },
          { text: 'Je rayonne de bonheur pour lui/elle, plus que pour moi-même', score: 3 },
        ],
      },
      {
        text: 'Est-ce que son contact physique (frôlement, accolade) te fait un effet particulier ?',
        options: [
          { text: 'Non, contact ordinaire', score: 0 },
          { text: 'Légèrement agréable', score: 1 },
          { text: 'Je me souviens de chaque contact', score: 2 },
          { text: 'Un simple frôlement me retourne complètement', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu compares les autres aux qualités de cette personne ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Parfois inconsciemment', score: 1 },
          { text: 'Souvent, personne ne semble être à la hauteur', score: 2 },
          { text: 'Tout le monde est comparé à lui/elle dans ma tête', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu as du mal à dormir en pensant à lui/elle ?',
        options: [
          { text: 'Non, je dors normalement', score: 0 },
          { text: 'Une ou deux nuits de pensées intrusives', score: 1 },
          { text: 'Parfois difficile de m\'endormir', score: 2 },
          { text: 'Souvent, je passe mes nuits à repenser à lui/elle', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu attends ses messages avec impatience ?',
        options: [
          { text: 'Non, comme tout le monde', score: 0 },
          { text: 'Un peu plus que la normale', score: 1 },
          { text: 'Oui, je regarde souvent mon téléphone', score: 2 },
          { text: 'Je guette mon téléphone constamment', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens mieux dans ta peau depuis que tu le/la connais ?',
        options: [
          { text: 'Non, pas de changement', score: 0 },
          { text: 'Un peu plus confiant(e)', score: 1 },
          { text: 'Oui, nettement plus épanoui(e)', score: 2 },
          { text: 'Il/Elle m\'a transformé(e) positivement, je suis une meilleure version de moi', score: 3 },
        ],
      },
      {
        text: 'Est-ce que l\'idée qu\'il/elle soit avec quelqu\'un d\'autre te brise le cœur ?',
        options: [
          { text: 'Non, tant que ça lui convient', score: 0 },
          { text: 'Un peu douloureux', score: 1 },
          { text: 'Vraiment difficile à accepter', score: 2 },
          { text: 'Cette pensée m\'est absolument insupportable', score: 3 },
        ],
      },
      {
        text: 'Si tu pouvais, passerais-tu toutes tes soirées avec cette personne ?',
        options: [
          { text: 'Non, j\'ai besoin de ma solitude', score: 0 },
          { text: 'Parfois ce serait sympa', score: 1 },
          { text: 'Oui, souvent', score: 2 },
          { text: 'Sans hésitation, je voudrais ne jamais le/la quitter', score: 3 },
        ],
      },
      {
        text: 'Deviens-tu facilement jaloux/jalouse quand d\'autres personnes s\'approchent d\'elle ?',
        options: [
          { text: 'Non, je lui fais pleinement confiance', score: 0 },
          { text: 'Une légère pointe de jalousie parfois, vite oubliée', score: 1 },
          { text: 'Oui, et ça m\'occupe l\'esprit un moment', score: 2 },
          { text: 'La jalousie est devenue envahissante', score: 3 },
        ],
        tags: { genders: ['Un homme'] },
      },
      {
        text: 'Ressens-tu une pointe d\'inquiétude quand il est entouré d\'autres filles ?',
        options: [
          { text: 'Non, ça ne me dérange absolument pas', score: 0 },
          { text: 'Légèrement, mais je sais que c\'est peu rationnel', score: 1 },
          { text: 'Oui, ça me préoccupe et j\'y pense plus qu\'il ne le faudrait', score: 2 },
          { text: 'Je cherche à contrôler ses fréquentations féminines', score: 3 },
        ],
        tags: { genders: ['Une femme'] },
      },
      {
        text: 'Depuis que vous êtes ensemble, ton attachement pour lui/elle a-t-il grandi plutôt que de s\'estomper ?',
        options: [
          { text: 'Non, la passion du début a naturellement diminué', score: 0 },
          { text: 'C\'est stable, ni en hausse ni en baisse', score: 1 },
          { text: 'Oui, je l\'apprécie davantage au fil du temps', score: 2 },
          { text: 'Mon attachement est de plus en plus fort, parfois ça me surprend moi-même', score: 3 },
        ],
        tags: { situations: ['En couple'] },
      },
      {
        text: 'Espères-tu secrètement que cette personne remarque tes efforts pour être présent(e) ?',
        options: [
          { text: 'Non, j\'agis naturellement sans arrière-pensée', score: 0 },
          { text: 'Parfois, j\'espère qu\'elle voit que je fais attention', score: 1 },
          { text: 'Oui, j\'adapte mes actions pour qu\'elle remarque', score: 2 },
          { text: 'Je calcule souvent mes comportements pour créer une impression sur elle', score: 3 },
        ],
        tags: { situations: ['Célibataire'] },
      },
      {
        text: 'Malgré les complications de votre situation, reviens-tu naturellement vers cette personne ?',
        options: [
          { text: 'Non, je m\'en éloigne quand ça devient compliqué', score: 0 },
          { text: 'Je reviens parfois, mais sans certitude', score: 1 },
          { text: 'Oui, quelque chose me ramène toujours vers elle', score: 2 },
          { text: 'Même quand je décide de m\'éloigner, je ne tiens pas longtemps', score: 3 },
        ],
        tags: { situations: ['Compliqué'] },
      },
      {
        text: 'Est-ce que cette personne te semble différente des autres avec qui tu as été avant ?',
        options: [
          { text: 'Non, c\'est une relation normale comme les autres', score: 0 },
          { text: 'Un peu différente, mais peut-être juste parce que c\'est récent', score: 1 },
          { text: 'Oui, quelque chose est clairement différent sans que je sache l\'expliquer', score: 2 },
          { text: 'C\'est incomparable avec tout ce que j\'ai vécu avant', score: 3 },
        ],
        tags: { ageGroups: ['- de 18 ans', '18–24 ans'] },
      },
      {
        text: 'Cette personne réveille-t-elle en toi des émotions que tu pensais avoir perdues ?',
        options: [
          { text: 'Non, rien de particulier', score: 0 },
          { text: 'Quelques émotions agréables mais rien de révélateur', score: 1 },
          { text: 'Oui, elle me fait ressentir des choses que je ne ressentais plus', score: 2 },
          { text: 'Elle a réveillé une partie de moi que je croyais définitivement endormie', score: 3 },
        ],
        tags: { ageGroups: ['35–44 ans', '45 ans et +'] },
      },
      {
        text: 'T\'intéresses-tu sincèrement à ce qui la/le préoccupe, même quand ça ne te concerne pas directement ?',
        options: [
          { text: 'Non, je peine à m\'intéresser à ses soucis', score: 0 },
          { text: 'Parfois, quand le sujet m\'interpelle aussi', score: 1 },
          { text: 'Oui, j\'essaie de vraiment comprendre ce qu\'elle vit', score: 2 },
          { text: 'Ses préoccupations deviennent les miennes automatiquement', score: 3 },
        ],
      },
      {
        text: 'Te projettes-tu dans un avenir partagé avec cette personne, même vaguement ?',
        options: [
          { text: 'Non, je vis le moment présent sans me projeter', score: 0 },
          { text: 'Parfois une image fugace, sans y attacher d\'importance', score: 1 },
          { text: 'Oui, des scénarios futurs me viennent naturellement', score: 2 },
          { text: 'Je me retrouve souvent à imaginer notre vie à deux en détail', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'elle/il te fait vraiment rire, pas juste sourire poliment ?',
        options: [
          { text: 'Non, notre humour n\'est pas vraiment compatible', score: 0 },
          { text: 'Parfois, pour certaines choses', score: 1 },
          { text: 'Oui, souvent, et ça me surprend parfois', score: 2 },
          { text: 'Elle est la personne qui me fait le plus rire dans ma vie', score: 3 },
        ],
      },
      {
        text: 'Trouves-tu ses défauts attendrissants plutôt qu\'agaçants ?',
        options: [
          { text: 'Non, ses défauts me dérangent comme ceux de n\'importe qui', score: 0 },
          { text: 'Ça dépend du défaut et du moment', score: 1 },
          { text: 'La plupart du temps, ses imperfections me semblent touchantes', score: 2 },
          { text: 'Je trouve ses défauts presque aussi séduisants que ses qualités', score: 3 },
        ],
      },
      {
        text: 'Modifies-tu ton comportement ou prends-tu soin de toi davantage pour lui/elle plaire ?',
        options: [
          { text: 'Non, je reste exactement pareil(le) qu\'avant', score: 0 },
          { text: 'Un petit effort de temps en temps', score: 1 },
          { text: 'Oui, je fais attention à mon image ou à certaines attitudes', score: 2 },
          { text: 'J\'ai adopté de nouvelles habitudes principalement pour être mieux à ses yeux', score: 3 },
        ],
      },
      {
        text: 'As-tu du mal à te concentrer sur autre chose quand il/elle te manque ?',
        options: [
          { text: 'Non, l\'absence ne m\'affecte pas particulièrement', score: 0 },
          { text: 'Un peu, mais je retrouve ma concentration', score: 1 },
          { text: 'Oui, son absence laisse un vide difficile à ignorer', score: 2 },
          { text: 'Son absence envahit mes pensées au point de me distraire vraiment', score: 3 },
        ],
      },
      {
        text: 'Lui fais-tu naturellement confiance, sans effort conscient ?',
        options: [
          { text: 'Non, la confiance ne vient pas naturellement', score: 0 },
          { text: 'Partiellement, mais avec quelques réserves', score: 1 },
          { text: 'Oui, je lui fais confiance sans vraiment avoir à y réfléchir', score: 2 },
          { text: 'La confiance que je lui accorde me surprend moi-même par son intensité', score: 3 },
        ],
      },
      {
        text: 'Ressens-tu de la tendresse pour lui/elle même sans raison particulière ?',
        options: [
          { text: 'Non, mes sentiments sont conditionnels', score: 0 },
          { text: 'Parfois, dans des moments précis', score: 1 },
          { text: 'Oui, régulièrement et spontanément', score: 2 },
          { text: 'Une tendresse profonde et constante qui ne demande aucune raison', score: 3 },
        ],
      },
      {
        text: 'Penses-tu à cette personne au moment où tu te réveilles le matin ?',
        options: [
          { text: 'Non, pas systématiquement', score: 0 },
          { text: 'Parfois, quand on s\'est vus récemment', score: 1 },
          { text: 'Souvent, c\'est l\'une de mes premières pensées', score: 2 },
          { text: 'Presque toujours, avant même d\'être pleinement réveillé(e)', score: 3 },
        ],
      },
      {
        text: 'Quand tu apprends que cette personne a vécu quelque chose de difficile, qu\'est-ce que tu ressens ?',
        options: [
          { text: 'De la sympathie normale', score: 0 },
          { text: 'De l\'inquiétude sincère pour elle', score: 1 },
          { text: 'Une vraie douleur comme si ça t\'était presque arrivé à toi', score: 2 },
          { text: 'Une souffrance physique et l\'envie urgente d\'être là pour elle', score: 3 },
        ],
      },
      {
        text: 'Imagines-tu parfois votre futur ensemble ?',
        options: [
          { text: 'Non, je vis dans le présent avec cette personne', score: 0 },
          { text: 'Ça m\'arrive vaguement, sans vraiment y croire', score: 1 },
          { text: 'Oui, j\'y pense et ça me semble possible', score: 2 },
          { text: 'Souvent et dans les détails — je me vois vraiment avec elle', score: 3 },
        ],
      },
      {
        text: 'Comment réagis-tu quand cette personne est avec quelqu\'un d\'autre ?',
        options: [
          { text: 'Aucune réaction particulière', score: 0 },
          { text: 'Un léger inconfort si c\'est quelqu\'un que je ne connais pas bien', score: 1 },
          { text: 'Une jalousie discrète mais bien présente', score: 2 },
          { text: 'Une jalousie difficile à gérer, même si je fais semblant que ça va', score: 3 },
        ],
      },
      {
        text: 'Est-ce que les petites choses qu\'elle fait (son rire, ses gestes, ses expressions) te marquent ?',
        options: [
          { text: 'Non, je la vois normalement', score: 0 },
          { text: 'Quelques détails qui m\'ont amusé(e)', score: 1 },
          { text: 'Oui, je remarque et j\'apprécie ses particularités', score: 2 },
          { text: 'Ses détails me fascinent et je m\'en souviens avec précision', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu modifies ta tenue ou ta façon de te présenter quand tu sais que tu vas la voir ?',
        options: [
          { text: 'Non, je suis pareil(le) qu\'avec n\'importe qui', score: 0 },
          { text: 'Un effort basique de présentation, comme pour tout le monde', score: 1 },
          { text: 'Oui, je fais attention à mon apparence quand je sais qu\'elle sera là', score: 2 },
          { text: 'Je prépare ma tenue à l\'avance et je veux être à mon meilleur', score: 3 },
        ],
      },
      {
        text: 'Quand tu es avec d\'autres gens sympas, est-ce que tu penses quand même à elle ?',
        options: [
          { text: 'Non, je profite pleinement de la compagnie', score: 0 },
          { text: 'De temps en temps, pas de façon obsessionnelle', score: 1 },
          { text: 'Souvent, elle s\'invite dans mes pensées même en société', score: 2 },
          { text: 'Presque toujours, les autres me semblent moins intéressants par comparaison', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ses opinions, ses goûts et ses jugements ont de l\'importance pour toi ?',
        options: [
          { text: 'Pas plus que ceux d\'un(e) ami(e) ordinaire', score: 0 },
          { text: 'Son avis m\'intéresse comme celui de quelqu\'un que j\'estime', score: 1 },
          { text: 'Son opinion compte vraiment pour moi et influence mes choix', score: 2 },
          { text: 'Son regard sur moi et sur les choses est déterminant dans mes décisions', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu arrives à être vraiment toi-même avec cette personne ?',
        options: [
          { text: 'Pas encore vraiment — on n\'est pas si proches', score: 0 },
          { text: 'Oui, comme avec n\'importe quelle connaissance sympa', score: 1 },
          { text: 'Oui, il y a une aisance particulière avec elle', score: 2 },
          { text: 'Avec elle plus qu\'avec n\'importe qui d\'autre', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu t\'intéresses sincèrement à ses projets, ses rêves, ses ambitions ?',
        options: [
          { text: 'Pas vraiment, on ne parle pas de ça', score: 0 },
          { text: 'Je l\'écoute poliment comme avec un(e) ami(e)', score: 1 },
          { text: 'Oui, ce qui compte pour elle compte pour moi', score: 2 },
          { text: 'Je veux activement participer à la réalisation de ses rêves', score: 3 },
        ],
      },
      {
        text: 'Quelle est ta réaction physique quand tu la vois de façon inattendue ?',
        options: [
          { text: 'Aucune réaction particulière', score: 0 },
          { text: 'Une petite surprise agréable', score: 1 },
          { text: 'Un léger accélérateur cardiaque, une sorte de chaleur', score: 2 },
          { text: 'Le cœur qui s\'emballe, un sourire impossible à contenir', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu gardes des souvenirs liés à elle (messages, photos, objets) ?',
        options: [
          { text: 'Non, pas particulièrement', score: 0 },
          { text: 'Des photos normales comme pour mes autres amis', score: 1 },
          { text: 'Oui, certains souvenirs me sont précieux', score: 2 },
          { text: 'J\'archive tout, je ne veux rien perdre de nos moments partagés', score: 3 },
        ],
      },
      {
        text: 'Est-ce que ses réussites te rendent heureux/se, même si elles ne te concernent pas directement ?',
        options: [
          { text: 'Pas vraiment, ça ne me touche pas beaucoup', score: 0 },
          { text: 'Oui, comme ça me rendrait heureux/se pour n\'importe qui', score: 1 },
          { text: 'Oui, avec une fierté sincère et personnelle', score: 2 },
          { text: 'Ses succès me rendent aussi heureux/se que les miens, voire plus', score: 3 },
        ],
      },
      {
        text: 'Quand tu apprends qu\'elle est intéressée par quelqu\'un d\'autre, comment réagis-tu ?',
        options: [
          { text: 'Je lui souhaite le meilleur sans réaction particulière', score: 0 },
          { text: 'Un léger pincement, vite oublié', score: 1 },
          { text: 'Une vraie tristesse qui s\'attarde', score: 2 },
          { text: 'Une douleur vive que je cache difficilement', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu envie de lui dire "je t\'aime" ou quelque chose d\'équivalent ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Une pensée fugace sans vraie conviction derrière', score: 1 },
          { text: 'Oui, l\'envie est là mais je la retiens', score: 2 },
          { text: 'Régulièrement, l\'envie monte forte mais les mots restent bloqués', score: 3 },
        ],
      },
      {
        text: 'Quand tu es séparé(e) d\'elle un long moment, qu\'est-ce que tu ressens ?',
        options: [
          { text: 'Rien de particulier, la vie suit son cours', score: 0 },
          { text: 'Un léger manque, comme avec un(e) bon(ne) ami(e)', score: 1 },
          { text: 'Un vrai manque que je remarque dans mon quotidien', score: 2 },
          { text: 'Une absence physique, comme si quelque chose d\'essentiel manquait', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu partages les bonnes nouvelles de ta vie en pensant à elle en premier ?',
        options: [
          { text: 'Non, j\'ai d\'autres personnes à qui je pense d\'abord', score: 0 },
          { text: 'Elle fait partie des personnes que j\'informerais', score: 1 },
          { text: 'Oui, souvent c\'est elle que je veux voir réagir', score: 2 },
          { text: 'Toujours — sa réaction est la première chose qui m\'importe', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu fais des efforts pour maintenir le contact avec elle même dans les périodes chargées ?',
        options: [
          { text: 'Non, si on ne se parle pas, ça ne me dérange pas', score: 0 },
          { text: 'Je réponds quand elle écrit, sans en faire plus', score: 1 },
          { text: 'Je prends des nouvelles régulièrement de mon côté', score: 2 },
          { text: 'Je trouve toujours un prétexte pour lui écrire ou la voir', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te souviens de détails importants de ce qu\'elle t\'a raconté, même des mois plus tard ?',
        options: [
          { text: 'Non, pas plus qu\'avec les autres', score: 0 },
          { text: 'Les grandes lignes, comme pour mes amis proches', score: 1 },
          { text: 'Oui, je me souviens de beaucoup de choses qu\'elle m\'a confiées', score: 2 },
          { text: 'Des détails précis qu\'elle-même a parfois oublié — je l\'écoute vraiment', score: 3 },
        ],
      },
      {
        text: 'Est-ce que certaines chansons, odeurs ou endroits te font penser immédiatement à elle ?',
        options: [
          { text: 'Non, rien de particulier ne m\'y ramène', score: 0 },
          { text: 'Un ou deux détails qui m\'y font penser parfois', score: 1 },
          { text: 'Oui, plusieurs éléments du quotidien me ramènent à elle', score: 2 },
          { text: 'Elle est partout — des associations constantes et involontaires', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu cherches à en apprendre le plus possible sur elle — son passé, ses peurs, ses rêves ?',
        options: [
          { text: 'Non, je ne cherche pas particulièrement à creuser', score: 0 },
          { text: 'On se raconte des choses, naturellement', score: 1 },
          { text: 'Oui, je m\'intéresse sincèrement à qui elle est en profondeur', score: 2 },
          { text: 'Je veux tout savoir d\'elle — j\'ai une curiosité insatiable pour sa vie', score: 3 },
        ],
      },
      {
        text: 'Est-ce que l\'idée de ne jamais lui avouer tes sentiments te pèse ?',
        options: [
          { text: 'Non, je n\'ai pas de sentiments particuliers à lui avouer', score: 0 },
          { text: 'Un peu, mais rien d\'insupportable', score: 1 },
          { text: 'Oui, parfois l\'idée d\'une occasion manquée me préoccupe', score: 2 },
          { text: 'Beaucoup — l\'idée de passer à côté de quelque chose de réel m\'angoisse', score: 3 },
        ],
      },
      {
        text: 'Quand elle te fait une remarque positive, comment ça te touche ?',
        options: [
          { text: 'Comme n\'importe quel compliment', score: 0 },
          { text: 'Agréablement, ça fait toujours plaisir', score: 1 },
          { text: 'Ça me touche plus que la plupart des compliments', score: 2 },
          { text: 'Un compliment d\'elle a une valeur que rien d\'autre n\'égale', score: 3 },
        ],
      },
      {
        text: 'Si elle te demandait de faire quelque chose d\'inconfortable (mais raisonnable) pour elle, le ferais-tu ?',
        options: [
          { text: 'Probablement pas si ça me coûte vraiment', score: 0 },
          { text: 'Oui, comme je le ferais pour un(e) bon(ne) ami(e)', score: 1 },
          { text: 'Oui, sans hésiter longtemps', score: 2 },
          { text: 'Oui — et je serais heureux/se de pouvoir faire quelque chose pour elle', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu t\'imagines présenter cette personne à ta famille ou à tes amis proches ?',
        options: [
          { text: 'Non, ce n\'est pas quelque chose qui me vient à l\'esprit', score: 0 },
          { text: 'Peut-être à terme, si on est plus proches', score: 1 },
          { text: 'Oui, j\'en ai envie et j\'y pense', score: 2 },
          { text: 'Oui, avec une fierté que j\'imagine déjà ressentir', score: 3 },
        ],
      },
      {
        text: 'Comment te sens-tu après avoir passé du temps avec elle ?',
        options: [
          { text: 'Normal — comme après avoir vu quelqu\'un de sympa', score: 0 },
          { text: 'Content(e), de bonne humeur', score: 1 },
          { text: 'Léger(ère) et chargé(e) d\'énergie positive', score: 2 },
          { text: 'Une légèreté rare, presque euphorique — comme rechargé(e) à bloc', score: 3 },
        ],
      },
      {
        text: 'Est-ce que son bien-être émotionnel a une influence sur le tien ?',
        options: [
          { text: 'Non, nos humeurs sont indépendantes', score: 0 },
          { text: 'Un peu, comme avec quelqu\'un dont je me soucie', score: 1 },
          { text: 'Oui, quand elle n\'est pas bien, je me sens moins bien aussi', score: 2 },
          { text: 'Fortement — son bonheur ou sa tristesse déteint vraiment sur moi', score: 3 },
        ],
      },
      {
        text: 'Quand elle sourit à quelqu\'un d\'autre que toi, qu\'est-ce que ça te fait ?',
        options: [
          { text: 'Rien de particulier', score: 0 },
          { text: 'Je suis content(e) qu\'elle soit bien entourée', score: 1 },
          { text: 'Un léger sentiment de vouloir être à la place de cet(te) autre', score: 2 },
          { text: 'Une envie forte que ce sourire soit pour toi', score: 3 },
        ],
      },
      {
        text: 'Si cette personne disparaissait de ta vie demain, comment imagines-tu que tu te sentirais dans 6 mois ?',
        options: [
          { text: 'Bien — la vie continue', score: 0 },
          { text: 'Un peu nostalgique, mais remis(e) rapidement', score: 1 },
          { text: 'Avec un vrai manque difficile à combler', score: 2 },
          { text: 'Avec un deuil profond, comme s\'il manquait quelque chose d\'essentiel', score: 3 },
        ],
      },
      {
        text: 'Si tu pouvais exaucer un vœu pour elle, que choisirais-tu ?',
        options: [
          { text: 'Je n\'y ai pas vraiment réfléchi', score: 0 },
          { text: 'Qu\'elle soit heureuse, comme je le souhaiterais à quiconque', score: 1 },
          { text: 'Qu\'elle réalise son plus grand rêve, même si ça ne me concerne pas', score: 2 },
          { text: 'Qu\'elle soit heureuse — et si c\'est avec moi, encore mieux', score: 3 },
        ],
      },
    ],
    resultTiers: [
      {
        min: 0, max: 20,
        emoji: '😊',
        title: 'Pas (encore) l\'amour',
        message: 'Ce n\'est probablement pas de l\'amour, plutôt de la sympathie ou de l\'amitié. Et c\'est déjà super ! Les sentiments peuvent évoluer, laisse les choses se faire naturellement.',
        color: 'text-sky-400',
        glowColor: '#38bdf8',
      },
      {
        min: 20, max: 40,
        emoji: '🌸',
        title: 'Quelque chose se développe',
        message: 'Tu ressens quelque chose d\'assez fort, mais ce n\'est peut-être pas encore l\'amour au sens plein. Les sentiments sont en train de se développer. Laisse les évoluer naturellement.',
        color: 'text-pink-300',
        glowColor: '#f9a8d4',
      },
      {
        min: 40, max: 60,
        emoji: '💓',
        title: 'Les signes sont là',
        message: 'Les signes sont là ! Tu sembles bien accroché(e). L\'amour est peut-être en train de naître. Ces sentiments sont assez forts pour mériter d\'être explorés.',
        color: 'text-pink-400',
        glowColor: '#f472b6',
      },
      {
        min: 60, max: 80,
        emoji: '❤️',
        title: 'Tu es amoureux/amoureuse',
        message: 'Tu es clairement amoureux/amoureuse ! Ces sentiments sont forts et sincères. La question n\'est plus de savoir si tu l\'aimes, mais ce que tu vas faire avec ça !',
        color: 'text-rose-400',
        glowColor: '#fb7185',
      },
      {
        min: 80, max: 101,
        emoji: '🔥',
        title: 'Éperdument amoureux/amoureuse',
        message: 'Tu es éperdument, profondément amoureux/amoureuse ! Ces sentiments sont intenses et envahissants. Qu\'est-ce que tu attends pour le/la lui dire ?!',
        color: 'text-rose-500',
        glowColor: '#f43f5e',
      },
    ],
  },
  {
    slug: 'vrais-amis',
    title: 'Mes amis sont-ils vrais ?',
    subtitle: 'Trahison, loyauté et faux semblants',
    description: '30 questions pour identifier les faux amis et ceux qui te méritent vraiment.',
    emoji: '👥',
    gradientFrom: 'from-emerald-950/80',
    gradientTo: 'to-teal-950/80',
    borderColor: 'border-emerald-800/30',
    accentColor: '#10b981',
    questions: [
      {
        text: 'Quand tu traverses une période difficile, cet(te) ami(e) est-il/elle présent(e) pour toi ?',
        options: [
          { text: 'Toujours là pour moi sans que j\'aie besoin de demander', score: 0 },
          { text: 'Disponible la plupart du temps', score: 1 },
          { text: 'Rarement disponible quand j\'en ai besoin', score: 2 },
          { text: 'Jamais vraiment là dans les moments importants', score: 3 },
        ],
      },
      {
        text: 'Est-ce que votre relation est équilibrée (tu donnes autant que tu reçois) ?',
        options: [
          { text: 'Oui, c\'est très équilibré', score: 0 },
          { text: 'Légèrement déséquilibré parfois', score: 1 },
          { text: 'Je donne souvent plus que je ne reçois', score: 2 },
          { text: 'Je donne tout et reçois très peu en retour', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) parle-t-il/elle de toi dans ton dos ?',
        options: [
          { text: 'Jamais à ma connaissance', score: 0 },
          { text: 'Un commentaire déplacé relayé une fois', score: 1 },
          { text: 'Plusieurs fois on m\'a rapporté des choses', score: 2 },
          { text: 'Régulièrement, je sais qu\'il/elle dit du mal de moi', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) est-il/elle sincèrement heureux/heureuse de tes succès ?',
        options: [
          { text: 'Toujours, il/elle célèbre mes victoires', score: 0 },
          { text: 'Généralement oui', score: 1 },
          { text: 'Parfois une attitude froide lors de mes réussites', score: 2 },
          { text: 'Jalousie évidente ou remarques négatives quand je réussis', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'il/elle te soutient devant les autres même dans des situations complexes ?',
        options: [
          { text: 'Il/Elle me défend tout en étant honnête avec moi en privé', score: 0 },
          { text: 'Généralement de mon côté', score: 1 },
          { text: 'Parfois ne prend pas ma défense ou reste neutre', score: 2 },
          { text: 'Rarement de mon côté, ou pire, se retourne contre moi', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te contacte-t-il/elle sans que tu en sois toujours à l\'initiative ?',
        options: [
          { text: 'Souvent, l\'initiative est bien partagée', score: 0 },
          { text: 'Parfois de son côté', score: 1 },
          { text: 'Rarement, c\'est presque toujours moi qui commence', score: 2 },
          { text: 'Jamais, si je n\'écris pas, plus aucune nouvelle', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'il/elle garde tes secrets ?',
        options: [
          { text: 'Toujours, je lui fais confiance à 100%', score: 0 },
          { text: 'Généralement oui', score: 1 },
          { text: 'Un secret a déjà été révélé une fois', score: 2 },
          { text: 'Mes confidences finissent souvent par être connues', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) t\'a-t-il/elle déjà trahi dans une situation importante ?',
        options: [
          { text: 'Jamais', score: 0 },
          { text: 'Une petite trahison légère une fois', score: 1 },
          { text: 'Une vraie trahison qu\'on a surmontée', score: 2 },
          { text: 'Une ou plusieurs trahisons graves', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te critique-t-il/elle en public plutôt qu\'en privé ?',
        options: [
          { text: 'Non, toujours respectueux/respectueuse et discret(e)', score: 0 },
          { text: 'Parfois un commentaire maladroit', score: 1 },
          { text: 'M\'a déjà critiqué(e) devant d\'autres personnes', score: 2 },
          { text: 'Me rabaisse souvent en public', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) t\'inclut-il/elle dans ses projets et sorties ?',
        options: [
          { text: 'Oui, je fais partie de ses projets', score: 0 },
          { text: 'La plupart du temps', score: 1 },
          { text: 'Parfois exclu(e) sans raison claire', score: 2 },
          { text: 'Souvent mis(e) à l\'écart de groupes communs', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) respecte-t-il/elle tes limites et tes refus ?',
        options: [
          { text: 'Toujours', score: 0 },
          { text: 'Généralement oui', score: 1 },
          { text: 'Parfois insistant(e) quand je refuse', score: 2 },
          { text: 'Ne respecte jamais mes "non"', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te contacte-t-il/elle uniquement quand il/elle a besoin de quelque chose ?',
        options: [
          { text: 'Non, il/elle prend des nouvelles naturellement', score: 0 },
          { text: 'Parfois ses messages coïncident avec des demandes', score: 1 },
          { text: 'Souvent, je remarque un schéma', score: 2 },
          { text: 'Toujours, il/elle n\'appelle que pour demander un service', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'il/elle minimise tes problèmes ou les prend à la légère ?',
        options: [
          { text: 'Jamais, il/elle prend mes problèmes au sérieux', score: 0 },
          { text: 'Parfois trop optimiste mais bien intentionné(e)', score: 1 },
          { text: 'Souvent il/elle relativise ou passe à autre chose vite', score: 2 },
          { text: 'Toujours, mes problèmes semblent insignifiants pour lui/elle', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te respecte-t-il/elle même quand vous n\'êtes pas d\'accord ?',
        options: [
          { text: 'Toujours, on peut débattre sainement', score: 0 },
          { text: 'Généralement oui', score: 1 },
          { text: 'Parfois les désaccords créent des tensions disproportionnées', score: 2 },
          { text: 'Devient agressif/agressive ou moqueur/moqueuse si je suis en désaccord', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) fait des efforts pour maintenir votre amitié ?',
        options: [
          { text: 'Oui, les efforts sont partagés', score: 0 },
          { text: 'Il/Elle fait des efforts', score: 1 },
          { text: 'Je fais nettement plus d\'efforts que lui/elle', score: 2 },
          { text: 'Je suis toujours celui/celle qui entretient la relation', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te présente-t-il/elle à ses autres amis et cercles sociaux ?',
        options: [
          { text: 'Oui, je connais ses amis', score: 0 },
          { text: 'Généralement oui', score: 1 },
          { text: 'Parfois j\'ai l\'impression d\'être caché(e)', score: 2 },
          { text: 'Il/Elle semble compartimenter ma présence dans sa vie', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'il/elle exagère ou invente des histoires à ton sujet ?',
        options: [
          { text: 'Jamais', score: 0 },
          { text: 'Une exagération sans malice une fois', score: 1 },
          { text: 'Quelques fois des histoires retouchées qui ne me flattent pas', score: 2 },
          { text: 'Régulièrement des ragots ou des choses inventées sur moi', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) t\'encourage-t-il/elle dans tes projets et ambitions ?',
        options: [
          { text: 'Toujours, il/elle est mon plus grand fan', score: 0 },
          { text: 'Généralement positif/positive', score: 1 },
          { text: 'Parfois tiède ou décourage subtilement', score: 2 },
          { text: 'Décourage souvent ou minimise mes ambitions', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens jugé(e) ou surveillé(e) par cet(te) ami(e) ?',
        options: [
          { text: 'Non, je me sens libre et à l\'aise', score: 0 },
          { text: 'Parfois un regard un peu critique', score: 1 },
          { text: 'Souvent une sensation d\'être évalué(e)', score: 2 },
          { text: 'Toujours, je dois peser mes mots et actions', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) agit différemment avec toi selon les contextes ?',
        options: [
          { text: 'Non, il/elle est toujours le/la même', score: 0 },
          { text: 'De légères différences normales', score: 1 },
          { text: 'Assez différent(e) en groupe, moins chaleureux/chaleureuse', score: 2 },
          { text: 'Une personne totalement différente selon l\'audience', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) a-t-il/elle cherché à te nuire par le passé ?',
        options: [
          { text: 'Jamais', score: 0 },
          { text: 'Un incident malheureux sans intention évidente', score: 1 },
          { text: 'Une action qui m\'a clairement nui', score: 2 },
          { text: 'Plusieurs fois de façon délibérée', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) te fait sentir inférieur(e) ou moins important(e) ?',
        options: [
          { text: 'Jamais, je me sens valorisé(e)', score: 0 },
          { text: 'Parfois un commentaire qui m\'a mis mal à l\'aise', score: 1 },
          { text: 'Souvent des remarques qui me diminuent', score: 2 },
          { text: 'Régulièrement, je sors de nos échanges en me sentant nul(le)', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te dit-il/elle ce que tu veux entendre plutôt que la vérité ?',
        options: [
          { text: 'Non, il/elle est toujours honnête avec moi', score: 0 },
          { text: 'Parfois il/elle adoucit la vérité', score: 1 },
          { text: 'Souvent il/elle évite de me contredire', score: 2 },
          { text: 'Toujours des mensonges confortables, jamais de vraie franchise', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) prend-il/elle toujours le parti des autres contre toi ?',
        options: [
          { text: 'Jamais, il/elle est de mon côté en général', score: 0 },
          { text: 'Parfois neutre', score: 1 },
          { text: 'Souvent contre moi dans les conflits', score: 2 },
          { text: 'Toujours contre moi face aux autres', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) manipule les situations à son avantage même si ça te nuit ?',
        options: [
          { text: 'Non', score: 0 },
          { text: 'Parfois un comportement un peu égoïste', score: 1 },
          { text: 'Assez souvent manipulateur/manipulatrice', score: 2 },
          { text: 'Régulièrement, je suis souvent manipulé(e)', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens à l\'aise de lui dire quand quelque chose te dérange ?',
        options: [
          { text: 'Totalement, on peut tout se dire', score: 0 },
          { text: 'Avec quelques précautions', score: 1 },
          { text: 'Difficile, j\'ai peur de sa réaction', score: 2 },
          { text: 'Impossible, ça finit toujours mal', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) reconnaît ses torts et s\'excuse quand il/elle a tort ?',
        options: [
          { text: 'Toujours, il/elle est humble', score: 0 },
          { text: 'La plupart du temps', score: 1 },
          { text: 'Rarement, il/elle ne s\'excuse jamais vraiment', score: 2 },
          { text: 'Jamais, il/elle retourne toujours la situation contre moi', score: 3 },
        ],
      },
      {
        text: 'As-tu eu l\'impression que cet(te) ami(e) était là pour tes avantages (argent, réseau, statut) ?',
        options: [
          { text: 'Non, je ne ressens rien de tel', score: 0 },
          { text: 'Une pensée fugace sans réelle conviction', score: 1 },
          { text: 'Parfois je me pose la question sérieusement', score: 2 },
          { text: 'Oui, j\'ai des preuves que c\'est une amitié intéressée', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cette amitié te prend de l\'énergie plutôt qu\'elle ne t\'en donne ?',
        options: [
          { text: 'Non, je me sens rechargé(e) après nos échanges', score: 0 },
          { text: 'Neutre, ni plus ni moins d\'énergie', score: 1 },
          { text: 'Souvent fatigué(e) ou vidé(e) après', score: 2 },
          { text: 'Toujours épuisé(e) par cette relation', score: 3 },
        ],
      },
      {
        text: 'Dans l\'ensemble, est-ce que cette amitié t\'apporte plus de bien-être que de souffrance ?',
        options: [
          { text: 'Oui, c\'est une amitié épanouissante', score: 0 },
          { text: 'Un peu des deux, mais globalement positive', score: 1 },
          { text: 'Plus de souffrance que de bien-être', score: 2 },
          { text: 'Cette amitié me pèse plus qu\'elle ne m\'apporte', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) respecte-t-il/elle ta relation de couple sans chercher à s\'y immiscer ?',
        options: [
          { text: 'Toujours, il/elle respecte pleinement ma vie amoureuse', score: 0 },
          { text: 'Généralement oui, avec quelques taquineries inoffensives', score: 1 },
          { text: 'Parfois il/elle critique mon/ma partenaire ou sème le doute', score: 2 },
          { text: 'Il/Elle cherche souvent à s\'interposer dans ma relation', score: 3 },
        ],
        tags: { situations: ['En couple', 'Compliqué'] },
      },
      {
        text: 'Cet(te) ami(e) te soutient-il/elle sans te faire sentir "en retard" dans la vie ?',
        options: [
          { text: 'Toujours, il/elle valorise mon chemin de vie tel qu\'il est', score: 0 },
          { text: 'Généralement oui, même si parfois maladroit(e)', score: 1 },
          { text: 'Parfois des remarques sur mon mode de vie qui me mettent mal à l\'aise', score: 2 },
          { text: 'Souvent des commentaires condescendants sur mes choix de vie', score: 3 },
        ],
        tags: { situations: ['Célibataire'] },
      },
      {
        text: 'Cette amitié va-t-elle au-delà des sorties et des moments festifs ?',
        options: [
          { text: 'Oui, on parle de vraies choses au-delà du fun', score: 0 },
          { text: 'La plupart du temps, on se connecte aussi sur des sujets profonds', score: 1 },
          { text: 'Rarement, notre lien tient surtout aux occasions sociales', score: 2 },
          { text: 'Non, si on ne sort pas ensemble, l\'amitié n\'existe presque pas', score: 3 },
        ],
        tags: { ageGroups: ['- de 18 ans', '18–24 ans'] },
      },
      {
        text: 'Votre amitié a-t-elle survécu à des changements importants dans vos vies (déménagement, travail, enfants) ?',
        options: [
          { text: 'Oui, on a traversé ces changements et on est restés proches', score: 0 },
          { text: 'La plupart des transitions, avec quelques périodes de distance normales', score: 1 },
          { text: 'Certains changements ont créé un fossé qui ne s\'est jamais refermé', score: 2 },
          { text: 'Il/Elle est absent(e) à chaque grande transition dans ma vie', score: 3 },
        ],
        tags: { ageGroups: ['25–34 ans', '35–44 ans'] },
      },
      {
        text: 'Avez-vous traversé ensemble des épreuves de vie significatives (deuil, maladie, divorce) ?',
        options: [
          { text: 'Oui, on s\'est soutenu(e)s à travers de vraies difficultés', score: 0 },
          { text: 'Quelques épreuves partagées, avec un soutien correct', score: 1 },
          { text: 'Il/Elle était absent(e) lors d\'une épreuve importante', score: 2 },
          { text: 'Cette personne n\'a jamais été là dans mes moments les plus difficiles', score: 3 },
        ],
        tags: { ageGroups: ['45 ans et +'] },
      },
      {
        text: 'Cet ami respecte-t-il tes décisions importantes sans chercher à les influencer contre ton gré ?',
        options: [
          { text: 'Toujours, il respecte pleinement mon autonomie', score: 0 },
          { text: 'Généralement oui, même s\'il donne parfois son avis', score: 1 },
          { text: 'Parfois il essaie d\'orienter mes choix selon ses préférences', score: 2 },
          { text: 'Souvent, il cherche à contrôler ou influencer mes décisions importantes', score: 3 },
        ],
        tags: { genders: ['Un homme'] },
      },
      {
        text: 'Cette amie est-elle sincèrement heureuse pour toi lors de tes réussites, sans jalousie ?',
        options: [
          { text: 'Toujours, ma réussite est aussi la sienne', score: 0 },
          { text: 'En général oui, même s\'il y a parfois une légère compétition inconsciente', score: 1 },
          { text: 'Je sens parfois une rivalité déguisée en encouragement', score: 2 },
          { text: 'Sa jalousie est évidente face à mes succès, elle les minimise ou les dénigre', score: 3 },
        ],
        tags: { genders: ['Une femme'] },
      },
      {
        text: 'Cet(te) ami(e) te dit-il/elle la vérité même quand ce n\'est pas ce que tu veux entendre ?',
        options: [
          { text: 'Toujours, avec bienveillance et honnêteté', score: 0 },
          { text: 'En général oui, mais avec beaucoup de précautions', score: 1 },
          { text: 'Il/Elle préfère se taire plutôt que me blesser', score: 2 },
          { text: 'Il/Elle ne m\'a jamais dit une vérité difficile, même quand j\'en avais besoin', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te défend-il/elle quand des personnes parlent de toi en mal en ton absence ?',
        options: [
          { text: 'Toujours, il/elle prend ma défense sans que je le demande', score: 0 },
          { text: 'La plupart du temps', score: 1 },
          { text: 'Rarement, il/elle reste neutre ou se tait', score: 2 },
          { text: 'Jamais, ou pire, il/elle acquiesce aux critiques', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) se souvient-il/elle des détails importants que tu lui as confiés ?',
        options: [
          { text: 'Oui, il/elle retient des choses dont je lui ai parlé il y a longtemps', score: 0 },
          { text: 'La plupart des choses importantes', score: 1 },
          { text: 'Rarement, j\'ai l\'impression de répéter les mêmes choses', score: 2 },
          { text: 'Jamais, ce que je lui confie semble ne pas l\'intéresser vraiment', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) cherche-t-il/elle à passer du temps avec toi ou seulement quand c\'est pratique ?',
        options: [
          { text: 'Il/Elle fait des efforts pour me voir même quand ce n\'est pas pratique', score: 0 },
          { text: 'La plupart du temps oui', score: 1 },
          { text: 'Principalement quand ça l\'arrange', score: 2 },
          { text: 'Seulement quand ça lui convient parfaitement, jamais d\'effort de sa part', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens libre d\'être toi-même sans te censurer en sa présence ?',
        options: [
          { text: 'Totalement, je suis 100% moi-même', score: 0 },
          { text: 'Presque toujours à l\'aise', score: 1 },
          { text: 'Je dois parfois filtrer ce que je dis ou fais', score: 2 },
          { text: 'Je joue souvent un rôle pour lui plaire ou éviter des conflits', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) t\'inclut-il/elle dans les grands moments de sa vie (nouvelles importantes, événements) ?',
        options: [
          { text: 'Toujours, je fais partie de ses moments importants', score: 0 },
          { text: 'La plupart du temps', score: 1 },
          { text: 'Parfois j\'apprends les grandes nouvelles par d\'autres', score: 2 },
          { text: 'Rarement inclus(e) dans les moments qui comptent pour lui/elle', score: 3 },
        ],
      },
      {
        text: 'Est-ce que votre amitié se remet naturellement après une dispute ou un silence ?',
        options: [
          { text: 'Oui, on revient toujours l\'un vers l\'autre naturellement', score: 0 },
          { text: 'En général oui, après un moment', score: 1 },
          { text: 'Les tensions durent longtemps avant de se dissiper vraiment', score: 2 },
          { text: 'Les disputes laissent des cicatrices durables ou ne se résolvent jamais', score: 3 },
        ],
      },
      {
        text: 'En situation d\'urgence ou de détresse réelle, cet(te) ami(e) serait-il/elle disponible pour toi ?',
        options: [
          { text: 'Oui, je sais que je peux compter sur lui/elle dans les pires moments', score: 0 },
          { text: 'Probablement oui pour les vraies urgences', score: 1 },
          { text: 'Je n\'en suis pas sûr(e), il/elle n\'a jamais été très réactif/réactive', score: 2 },
          { text: 'Non, il/elle ne serait pas là dans une vraie crise', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) initie-t-il/elle les plans et les prises de contact autant que toi ?',
        options: [
          { text: 'Oui, c\'est équilibré — on s\'appelle tous les deux', score: 0 },
          { text: 'Légèrement moins que moi, mais ça ne me dérange pas', score: 1 },
          { text: 'Non, c\'est presque toujours moi qui commence', score: 2 },
          { text: 'Si je n\'initie pas, on ne se parle pas — jamais de son côté', score: 3 },
        ],
      },
      {
        text: 'Comment réagit cet(te) ami(e) quand tu réussis quelque chose d\'important ?',
        options: [
          { text: 'Avec une joie sincère et un enthousiasme réel', score: 0 },
          { text: 'Content(e) pour moi, avec une réaction normale', score: 1 },
          { text: 'Une réaction tiède ou vite déviée vers autre chose', score: 2 },
          { text: 'Indifférence, ou une façon de minimiser mon succès', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) te juge ou te critique devant les autres ?',
        options: [
          { text: 'Non, jamais — il/elle me défend même si nécessaire', score: 0 },
          { text: 'Des taquineries légères qui restent dans les limites du respect', score: 1 },
          { text: 'Des remarques parfois déplacées qui me mettent mal à l\'aise', score: 2 },
          { text: 'Il/Elle me critique ou se moque de moi en public', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) respecte les secrets que tu lui confies ?',
        options: [
          { text: 'Toujours — c\'est quelqu\'un de discret et de digne de confiance', score: 0 },
          { text: 'En général oui, avec peut-être des exceptions mineures', score: 1 },
          { text: 'Pas toujours — certaines choses ont fuité', score: 2 },
          { text: 'Non, je ne peux pas vraiment lui faire confiance avec mes confidences', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) s\'intéresse-t-il/elle à ta vie en dehors de vos sorties communes ?',
        options: [
          { text: 'Oui, il/elle prend des nouvelles sincèrement', score: 0 },
          { text: 'Quand on se voit, on parle de tout y compris de ma vie', score: 1 },
          { text: 'Pas vraiment — les conversations restent superficielles', score: 2 },
          { text: 'Non, il/elle parle surtout de lui/elle-même', score: 3 },
        ],
      },
      {
        text: 'Que se passe-t-il si tu traverses une mauvaise passe et que tu en parles à cet(te) ami(e) ?',
        options: [
          { text: 'Il/Elle est là, disponible et à l\'écoute', score: 0 },
          { text: 'Présent(e) dans la mesure du possible', score: 1 },
          { text: 'Compatissant(e) mais souvent à court d\'idées ou de temps', score: 2 },
          { text: 'Il/Elle change de sujet ou ramène ça à lui/elle-même', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) te présente à d\'autres personnes de son entourage ?',
        options: [
          { text: 'Oui, je fais partie de son cercle plus large', score: 0 },
          { text: 'Parfois, quand l\'occasion se présente naturellement', score: 1 },
          { text: 'Rarement — nos amitiés semblent cloisonnées', score: 2 },
          { text: 'Jamais — il/elle semble garder ses mondes séparés', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) te dit des choses sincères même si ce n\'est pas facile à entendre ?',
        options: [
          { text: 'Oui, il/elle est honnête avec bienveillance', score: 0 },
          { text: 'Il/Elle fait des efforts pour me dire la vérité avec tact', score: 1 },
          { text: 'Il/Elle évite les sujets délicats pour ne pas heurter', score: 2 },
          { text: 'Il/Elle me dit toujours ce que je veux entendre, ce qui m\'inquiète', score: 3 },
        ],
      },
      {
        text: 'Est-ce que votre amitié survit aux longues périodes sans contact ?',
        options: [
          { text: 'Oui — on reprend là où on en était, sans rancœur', score: 0 },
          { text: 'Ça demande un peu de réchauffement mais ça va vite', score: 1 },
          { text: 'On perd du terrain à chaque pause et il faut tout reconstruire', score: 2 },
          { text: 'Si on ne se voit plus un temps, c\'est comme si l\'amitié s\'était effacée', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) t\'a déjà aidé sans rien attendre en retour ?',
        options: [
          { text: 'Oui, plusieurs fois et sincèrement', score: 0 },
          { text: 'Oui, dans des situations qui ne lui coûtaient pas trop', score: 1 },
          { text: 'Rarement, il/elle trouve souvent une raison de ne pas pouvoir', score: 2 },
          { text: 'Non, je ne l\'ai jamais vu(e) faire quelque chose de désintéressé pour moi', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) se souvient des dates importantes pour toi ?',
        options: [
          { text: 'Oui, souvent sans que j\'aie besoin de lui rappeler', score: 0 },
          { text: 'Les grandes occasions, oui', score: 1 },
          { text: 'Rarement, et ça me déçoit parfois', score: 2 },
          { text: 'Jamais — il/elle ne fait pas attention à ces choses-là', score: 3 },
        ],
      },
      {
        text: 'Comment cet(te) ami(e) réagit-il/elle quand tu as besoin d\'annuler des plans ?',
        options: [
          { text: 'Avec compréhension et souplesse', score: 0 },
          { text: 'Un peu déçu(e) mais sans rancœur', score: 1 },
          { text: 'Avec une certaine irritation difficile à ignorer', score: 2 },
          { text: 'De la mauvaise humeur ou de l\'hostilité qui dure', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens jugé(e) quand tu lui parles de tes échecs ou de tes doutes ?',
        options: [
          { text: 'Non, je me sens en sécurité pour être vulnérable avec lui/elle', score: 0 },
          { text: 'Il/Elle est généralement bienveillant(e), même si pas toujours parfait(e)', score: 1 },
          { text: 'Parfois une réaction qui me fait regretter d\'avoir été honnête', score: 2 },
          { text: 'Souvent — je filtre ce que je lui dis pour éviter d\'être jugé(e)', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) t\'a déjà désigné(e) comme référence ou t\'a inclus(e) dans quelque chose d\'important ?',
        options: [
          { text: 'Oui, je fais clairement partie de ses personnes de confiance', score: 0 },
          { text: 'À quelques occasions, oui', score: 1 },
          { text: 'Rarement, et ça m\'a parfois étonné(e)', score: 2 },
          { text: 'Non, jamais — je n\'ai pas l\'impression d\'être une priorité', score: 3 },
        ],
      },
      {
        text: 'Comment qualifierais-tu l\'équilibre "donner/recevoir" dans cette amitié ?',
        options: [
          { text: 'Équilibré — on s\'apporte mutuellement beaucoup', score: 0 },
          { text: 'Légèrement déséquilibré, mais dans des limites acceptables', score: 1 },
          { text: 'Je donne souvent plus que je ne reçois', score: 2 },
          { text: 'Je suis clairement plus investi(e) que lui/elle', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) se comporte de la même façon avec toi en privé et en public ?',
        options: [
          { text: 'Oui, il/elle est cohérent(e) avec moi dans tous les contextes', score: 0 },
          { text: 'Quelques ajustements naturels selon les situations', score: 1 },
          { text: 'Une certaine différence qui m\'a parfois interpellé(e)', score: 2 },
          { text: 'En public il/elle me traite parfois très différemment, ce qui me blesse', score: 3 },
        ],
      },
      {
        text: 'Lorsque tu traverses une période de bonheur, est-ce que cet(te) ami(e) le partage vraiment ?',
        options: [
          { text: 'Oui, il/elle est heureux/se pour moi de façon sincère et visible', score: 0 },
          { text: 'Il/Elle est content(e) même si l\'enthousiasme est mesuré', score: 1 },
          { text: 'Sa réaction est polie mais peu enthousiaste', score: 2 },
          { text: 'J\'ai l\'impression que mon bonheur le/la dérange ou l\'indiffère', score: 3 },
        ],
      },
      {
        text: 'Cet(te) ami(e) te consulte-t-il/elle pour des décisions importantes de sa vie ?',
        options: [
          { text: 'Oui, mon avis compte pour lui/elle', score: 0 },
          { text: 'Parfois, pour des sujets où je suis pertinent(e)', score: 1 },
          { text: 'Rarement — il/elle prend ses décisions sans vraiment m\'impliquer', score: 2 },
          { text: 'Jamais — je l\'apprends toujours après coup', score: 3 },
        ],
      },
      {
        text: 'Est-ce que les conversations avec cet(te) ami(e) sont équilibrées ou toujours centrées sur lui/elle ?',
        options: [
          { text: 'Équilibrées — on parle de nos deux vies', score: 0 },
          { text: 'Légèrement centrées sur lui/elle, mais ça m\'arrive aussi', score: 1 },
          { text: 'Souvent il/elle domine la conversation avec ses sujets', score: 2 },
          { text: 'Quand ça parle de moi, ça revient vite à lui/elle', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà senti que cet(te) ami(e) était jaloux/se de toi ?',
        options: [
          { text: 'Non, je ne l\'ai pas ressenti', score: 0 },
          { text: 'Peut-être des moments de compétition bienveillante', score: 1 },
          { text: 'Quelques réactions qui m\'ont semblé teintées de jalousie', score: 2 },
          { text: 'Oui, une jalousie qui s\'est manifestée de façons claires', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) t\'encourage à être la meilleure version de toi-même ?',
        options: [
          { text: 'Oui, il/elle me challenge et me soutient dans mes projets', score: 0 },
          { text: 'Il/Elle est généralement positif/ve envers mes initiatives', score: 1 },
          { text: 'Pas vraiment — il/elle ne semble pas investi(e) dans ma croissance', score: 2 },
          { text: 'Parfois ses réactions me donnent l\'impression de devoir rester "à ma place"', score: 3 },
        ],
      },
      {
        text: 'Si tu avais une urgence à 3h du matin, est-ce que tu pourrais appeler cet(te) ami(e) ?',
        options: [
          { text: 'Oui, sans hésiter — il/elle serait là', score: 0 },
          { text: 'Probablement oui si c\'est vraiment grave', score: 1 },
          { text: 'Je n\'ose pas vraiment, je ne suis pas sûr(e) de sa réaction', score: 2 },
          { text: 'Non, ce n\'est pas le genre de personne que j\'appellerais', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) tient les promesses qu\'il/elle te fait ?',
        options: [
          { text: 'Oui, il/elle est fiable et tient ses engagements', score: 0 },
          { text: 'La plupart du temps, avec quelques oublis compréhensibles', score: 1 },
          { text: 'Les promesses sont souvent oubliées ou différées', score: 2 },
          { text: 'Je n\'attends plus grand chose de ses promesses', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens mieux ou plus léger(ère) après avoir passé du temps avec cet(te) ami(e) ?',
        options: [
          { text: 'Oui, il/elle me fait du bien et recharge mes batteries', score: 0 },
          { text: 'En général oui, même si ce n\'est pas toujours le cas', score: 1 },
          { text: 'Ça dépend — parfois je repars fatigué(e) ou frustré(e)', score: 2 },
          { text: 'Souvent je repars vidé(e) ou mal à l\'aise', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu peux parler de tes valeurs ou convictions profondes avec cet(te) ami(e) ?',
        options: [
          { text: 'Oui, c\'est une amitié où on va en profondeur', score: 0 },
          { text: 'On en parle parfois, avec respect mutuel', score: 1 },
          { text: 'Ces sujets sont évités pour ne pas froisser', score: 2 },
          { text: 'Non, on reste en surface sur tout ce qui est important', score: 3 },
        ],
      },
      {
        text: 'Si tu prenais tes distances pendant quelques semaines, penses-tu que cet(te) ami(e) remarquerait et agirait ?',
        options: [
          { text: 'Oui, il/elle s\'en rendrait compte rapidement', score: 0 },
          { text: 'Il/Elle finirait par le remarquer et prendrait des nouvelles', score: 1 },
          { text: 'Peut-être après un bon moment sans nouvelles', score: 2 },
          { text: 'Probablement pas — il/elle attendrait indéfiniment', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) fait des efforts pour comprendre ton point de vue même quand vous n\'êtes pas d\'accord ?',
        options: [
          { text: 'Oui, les désaccords se passent avec respect et écoute mutuelle', score: 0 },
          { text: 'Il/Elle fait des efforts même si ce n\'est pas toujours facile', score: 1 },
          { text: 'Il/Elle a du mal à vraiment entendre un point de vue différent du sien', score: 2 },
          { text: 'Les désaccords se terminent souvent mal — il/elle ne cède jamais', score: 3 },
        ],
      },
      {
        text: 'Est-ce que cet(te) ami(e) parle positivement de toi derrière ton dos ?',
        options: [
          { text: 'Oui, des retours me sont parvenus qui le confirment', score: 0 },
          { text: 'Je pense que oui, même si je n\'en ai pas la preuve', score: 1 },
          { text: 'Je ne sais pas vraiment ce qu\'il/elle dit de moi', score: 2 },
          { text: 'J\'ai des raisons de penser qu\'il/elle ne me représente pas bien', score: 3 },
        ],
      },
      {
        text: 'Globalement, est-ce que cette amitié te donne de l\'énergie ou t\'en prend ?',
        options: [
          { text: 'Elle m\'en donne — c\'est une relation qui me nourrit', score: 0 },
          { text: 'Plutôt neutre, avec des hauts et des bas', score: 1 },
          { text: 'Elle me prend parfois plus qu\'elle ne m\'en donne', score: 2 },
          { text: 'Elle me vide — je ressors souvent épuisé(e) ou déçu(e)', score: 3 },
        ],
      },
      {
        text: 'Si cette amitié devait se terminer demain, quelle en serait la raison la plus probable ?',
        options: [
          { text: 'Aucune — je ne vois pas cette amitié se terminer', score: 0 },
          { text: 'L\'éloignement géographique ou les circonstances de vie', score: 1 },
          { text: 'Le déséquilibre croissant qui finira par lasser l\'un de nous', score: 2 },
          { text: 'Une déception ou trahison qui est déjà dans l\'air', score: 3 },
        ],
      },
    ],
    resultTiers: [
      {
        min: 0, max: 20,
        emoji: '🤝',
        title: 'Vrai(e) ami(e)',
        message: 'Tu as de la chance ! Cette personne semble être un(e) vrai(e) ami(e) sincère et fiable. Chéris cette amitié, les vrais amis sont rares et précieux.',
        color: 'text-emerald-400',
        glowColor: '#34d399',
      },
      {
        min: 20, max: 40,
        emoji: '😊',
        title: 'Amitié correcte',
        message: 'Quelques petites imperfections normales dans toute amitié. Personne n\'est parfait. Dans l\'ensemble, cette relation semble saine et bien intentionnée.',
        color: 'text-teal-400',
        glowColor: '#2dd4bf',
      },
      {
        min: 40, max: 60,
        emoji: '🤨',
        title: 'Amitié à questionner',
        message: 'Cette amitié mérite d\'être questionnée. Certains comportements ne sont pas ceux d\'un(e) vrai(e) ami(e). Une conversation directe s\'impose pour clarifier les choses.',
        color: 'text-yellow-400',
        glowColor: '#facc15',
      },
      {
        min: 60, max: 80,
        emoji: '⚠️',
        title: 'Relation toxique',
        message: 'Attention ! Cette personne présente beaucoup de comportements toxiques. Une amitié doit t\'élever, pas te faire du mal. Prends du recul et protège-toi.',
        color: 'text-orange-400',
        glowColor: '#fb923c',
      },
      {
        min: 80, max: 101,
        emoji: '🚩',
        title: 'Faux/Fausse ami(e)',
        message: 'Ce n\'est pas un(e) vrai(e) ami(e). Les signaux sont trop forts et trop nombreux. Tu mérites des personnes qui te respectent et te valorisent. Il est peut-être temps de t\'éloigner.',
        color: 'text-red-400',
        glowColor: '#f87171',
      },
    ],
  },
  {
    slug: 'orientation',
    title: 'Quelle est mon orientation ?',
    subtitle: 'Explore ton attirance sincère',
    description: '30 questions pour explorer honnêtement ton attirance et mieux te comprendre.',
    emoji: '🌈',
    gradientFrom: 'from-violet-950/80',
    gradientTo: 'to-pink-950/80',
    borderColor: 'border-violet-800/30',
    accentColor: '#a78bfa',
    questions: [
      {
        text: 'Quand tu imagines une relation romantique idéale, qui vois-tu à tes côtés ?',
        options: [
          { text: 'Quelqu\'un du sexe opposé, sans hésitation', score: 0 },
          { text: 'Principalement quelqu\'un du sexe opposé', score: 1 },
          { text: 'Cela dépend de la personne, pas du genre', score: 2 },
          { text: 'Quelqu\'un du même genre que moi', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà ressenti une attirance romantique pour quelqu\'un du même genre ?',
        options: [
          { text: 'Jamais', score: 0 },
          { text: 'Une fois, peut-être par curiosité', score: 1 },
          { text: 'Oui, plusieurs fois avec différentes personnes', score: 2 },
          { text: 'Oui, c\'est mon attirance principale', score: 3 },
        ],
      },
      {
        text: 'Quand tu regardes un film ou une série, à qui t\'identifies-tu le plus ?',
        options: [
          { text: 'Au personnage hétérosexuel sans me poser de questions', score: 0 },
          { text: 'Principalement aux personnages hétéros mais parfois aux autres', score: 1 },
          { text: 'Je m\'identifie à plein de personnages différents peu importe leur orientation', score: 2 },
          { text: 'Surtout aux personnages LGBTQ+', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu des rêves romantiques ou sensuels impliquant quelqu\'un du même genre ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Très rarement, sans signification pour moi', score: 1 },
          { text: 'Parfois, et cela m\'a surpris(e)', score: 2 },
          { text: 'Régulièrement et c\'est quelque chose que j\'apprécie', score: 3 },
        ],
      },
      {
        text: 'Comment te sens-tu en présence d\'une personne du même genre très attirante ?',
        options: [
          { text: 'Rien de spécial, comme avec n\'importe qui', score: 0 },
          { text: 'Une légère admiration, sans plus', score: 1 },
          { text: 'Une certaine fascination que je ne m\'explique pas toujours', score: 2 },
          { text: 'Une attirance claire, similaire à ce que je ressens pour le sexe opposé', score: 3 },
        ],
      },
      {
        text: 'Quand tu envisages l\'avenir, tu te vois...',
        options: [
          { text: 'Avec quelqu\'un du sexe opposé', score: 0 },
          { text: 'Probablement avec quelqu\'un du sexe opposé', score: 1 },
          { text: 'Avec n\'importe qui tant qu\'il y a une vraie connexion', score: 2 },
          { text: 'Avec quelqu\'un du même genre', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu envie d\'explorer une relation ou une expérience avec quelqu\'un du même genre ?',
        options: [
          { text: 'Non, l\'idée ne m\'attire pas', score: 0 },
          { text: 'Par curiosité intellectuelle seulement', score: 1 },
          { text: 'Oui, j\'y ai pensé sérieusement', score: 2 },
          { text: 'Oui et je l\'ai déjà exploré ou je souhaite vraiment le faire', score: 3 },
        ],
      },
      {
        text: 'Quand tu vois un couple de même genre dans la rue, ta première réaction est...',
        options: [
          { text: 'Indifférence totale, comme n\'importe quel couple', score: 0 },
          { text: 'Légère curiosité', score: 1 },
          { text: 'Une certaine fascination ou une identification subtile', score: 2 },
          { text: 'Une sorte d\'écho à ce que je ressens', score: 3 },
        ],
      },
      {
        text: 'L\'identité ou le genre d\'une personne joue-t-il un rôle dans ton attirance ?',
        options: [
          { text: 'Oui, je ne suis attiré(e) que par le sexe opposé', score: 0 },
          { text: 'Principalement, mais il y a des exceptions rares', score: 1 },
          { text: 'Non, la personne compte plus que son genre', score: 2 },
          { text: 'Non, je peux être attiré(e) par des personnes de tout genre', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà cherché des informations ou du contenu lié à l\'homosexualité ou à la bisexualité pour toi-même ?',
        options: [
          { text: 'Non, jamais pour moi-même', score: 0 },
          { text: 'Peut-être par curiosité générale', score: 1 },
          { text: 'Oui, pour mieux comprendre ce que je ressentais', score: 2 },
          { text: 'Oui, régulièrement pour explorer mon identité', score: 3 },
        ],
      },
      {
        text: 'Quand tu penses à l\'intimité physique, tu penses plutôt à...',
        options: [
          { text: 'Quelqu\'un du sexe opposé uniquement', score: 0 },
          { text: 'Surtout quelqu\'un du sexe opposé', score: 1 },
          { text: 'Cela varie selon les personnes, pas le genre', score: 2 },
          { text: 'Quelqu\'un du même genre', score: 3 },
        ],
      },
      {
        text: 'T\'es-tu déjà senti(e) différent(e) ou "pas à ta place" parmi tes amis concernant l\'attirance ?',
        options: [
          { text: 'Non, je me sens totalement normal(e)', score: 0 },
          { text: 'Très rarement, sans trop y penser', score: 1 },
          { text: 'Parfois, j\'ai du mal à m\'identifier à leurs centres d\'intérêt', score: 2 },
          { text: 'Souvent, mes attirances semblent différentes des leurs', score: 3 },
        ],
      },
      {
        text: 'Comment décris-tu ta réaction face à du contenu romantique ou érotique impliquant des personnes du même genre ?',
        options: [
          { text: 'Indifférence ou malaise', score: 0 },
          { text: 'Curiosité neutre', score: 1 },
          { text: 'Un certain intérêt que je ne peux pas totalement ignorer', score: 2 },
          { text: 'Attirance claire et naturelle', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu peur ou honte de certaines de tes pensées concernant ton orientation ?',
        options: [
          { text: 'Non, mes pensées semblent "normales"', score: 0 },
          { text: 'Très rarement, juste une légère gêne', score: 1 },
          { text: 'Parfois, j\'ai du mal à les accepter', score: 2 },
          { text: 'Oui, j\'ai vécu une lutte intérieure à ce sujet', score: 3 },
        ],
      },
      {
        text: 'Penses-tu parfois que tu pourrais être bisexuel(le) ou gay ?',
        options: [
          { text: 'Non, cette idée ne me correspond pas', score: 0 },
          { text: 'Ça m\'a traversé l\'esprit sans conviction', score: 1 },
          { text: 'Je me pose cette question sérieusement', score: 2 },
          { text: 'Oui, je pense que c\'est ce que je suis', score: 3 },
        ],
      },
      {
        text: 'Quand quelqu\'un du même genre te montre de l\'intérêt romantique, tu ressens...',
        options: [
          { text: 'Gêne ou cela me laisse indifférent(e)', score: 0 },
          { text: 'Surprise mais pas de sentiment particulier', score: 1 },
          { text: 'Une légère excitation ou intérêt que tu n\'attendais pas', score: 2 },
          { text: 'De la fierté et de l\'attraction réciproque', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu trouves certaines personnes du même genre "belles" dans un sens qui dépasse l\'admiration ?',
        options: [
          { text: 'Non, c\'est de l\'admiration neutre', score: 0 },
          { text: 'Parfois, mais sans attirance particulière', score: 1 },
          { text: 'Oui, une beauté qui m\'attire subtilement', score: 2 },
          { text: 'Oui, clairement et régulièrement', score: 3 },
        ],
      },
      {
        text: 'L\'étiquette "hétérosexuel(le)" te correspond-elle pleinement ?',
        options: [
          { text: 'Oui, totalement', score: 0 },
          { text: 'En grande partie oui', score: 1 },
          { text: 'Je me sens plus entre deux', score: 2 },
          { text: 'Non, elle ne me définit pas', score: 3 },
        ],
      },
      {
        text: 'Quand tu as une attirance pour quelqu\'un, c\'est généralement...',
        options: [
          { text: 'Systématiquement pour quelqu\'un du sexe opposé', score: 0 },
          { text: 'Très majoritairement du sexe opposé', score: 1 },
          { text: 'Environ égal entre les deux genres', score: 2 },
          { text: 'Majoritairement ou exclusivement pour quelqu\'un du même genre', score: 3 },
        ],
      },
      {
        text: 'Imaginons que tu te retrouves seul(e) avec quelqu\'un du même genre qui te plait vraiment. Tu penses...',
        options: [
          { text: 'Rien de romantique ne passerait par la tête', score: 0 },
          { text: 'Je serais mal à l\'aise avec cette idée', score: 1 },
          { text: 'L\'idée ne m\'est pas désagréable', score: 2 },
          { text: 'J\'aimerais que quelque chose se passe', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà confié à quelqu\'un tes doutes concernant ton orientation sexuelle ?',
        options: [
          { text: 'Non, pas de doutes à confier', score: 0 },
          { text: 'Non, mais j\'y ai pensé sans doutes réels', score: 1 },
          { text: 'Pas encore, mais j\'en ai besoin', score: 2 },
          { text: 'Oui, je l\'ai fait ou j\'ai très envie de le faire', score: 3 },
        ],
      },
      {
        text: 'Comment tu te sens en lisant ou regardant des histoires d\'amour entre personnes du même genre ?',
        options: [
          { text: 'C\'est une belle histoire mais ça ne me concerne pas', score: 0 },
          { text: 'Cela me touche comme n\'importe quelle belle histoire', score: 1 },
          { text: 'Cela me touche de façon particulière, comme si ça me parlait', score: 2 },
          { text: 'Je m\'y retrouve et cela m\'émeut profondément', score: 3 },
        ],
      },
      {
        text: 'Dans tes fantasmes les plus intimes, les personnes du même genre apparaissent...',
        options: [
          { text: 'Jamais', score: 0 },
          { text: 'Très rarement', score: 1 },
          { text: 'Assez souvent', score: 2 },
          { text: 'Régulièrement ou principalement', score: 3 },
        ],
      },
      {
        text: 'Si tu pouvais choisir ton orientation sans jugement social, tu choisirais...',
        options: [
          { text: 'D\'être hétérosexuel(le)', score: 0 },
          { text: 'D\'être principalement hétérosexuel(le)', score: 1 },
          { text: 'D\'être bisexuel(le)', score: 2 },
          { text: 'D\'être gay ou lesbien(ne)', score: 3 },
        ],
      },
      {
        text: 'La communauté LGBTQ+ te semble...',
        options: [
          { text: 'Une communauté sympathique mais qui ne me concerne pas', score: 0 },
          { text: 'Intéressante, je la respecte pleinement', score: 1 },
          { text: 'Un endroit où je pourrais me sentir compris(e)', score: 2 },
          { text: 'Une communauté dont je fais ou voudrais faire partie', score: 3 },
        ],
      },
      {
        text: 'As-tu du mal à définir clairement ton orientation en ce moment ?',
        options: [
          { text: 'Non, c\'est très clair pour moi', score: 0 },
          { text: 'Très légèrement, mais pas vraiment', score: 1 },
          { text: 'Oui, je me pose des questions', score: 2 },
          { text: 'Oui, c\'est une vraie source d\'interrogation', score: 3 },
        ],
      },
      {
        text: 'Ton regard sur la même personne change-t-il selon que tu t\'imagines une relation amicale vs romantique avec elle ?',
        options: [
          { text: 'Seulement si c\'est une personne du sexe opposé', score: 0 },
          { text: 'Principalement si c\'est une personne du sexe opposé', score: 1 },
          { text: 'Cela arrive avec des personnes des deux genres', score: 2 },
          { text: 'C\'est souvent le cas avec des personnes du même genre', score: 3 },
        ],
      },
      {
        text: 'Si tu devais noter ton attirance pour les personnes du même genre de 0 à 10, tu choisirais...',
        options: [
          { text: '0 – absolument aucune', score: 0 },
          { text: '1 à 3 – très faible ou ambiguë', score: 1 },
          { text: '4 à 6 – modérée et bien présente', score: 2 },
          { text: '7 à 10 – forte, similaire à mon attirance habituelle', score: 3 },
        ],
      },
      {
        text: 'Quand tu t\'imagines embrasser quelqu\'un du même genre...',
        options: [
          { text: 'L\'idée me met mal à l\'aise ou me laisse froid(e)', score: 0 },
          { text: 'C\'est étrange à imaginer', score: 1 },
          { text: 'Ce serait quelque chose que j\'aimerais peut-être tenter', score: 2 },
          { text: 'C\'est quelque chose que je désire', score: 3 },
        ],
      },
      {
        text: 'En toute honnêteté, te définirais-tu comme une personne hétérosexuelle ?',
        options: [
          { text: 'Oui, complètement et sans aucun doute', score: 0 },
          { text: 'Oui, probablement', score: 1 },
          { text: 'Je ne suis plus tout à fait sûr(e)', score: 2 },
          { text: 'Non, je pense que ce n\'est pas qui je suis', score: 3 },
        ],
      },
      {
        text: 'En tant qu\'homme, as-tu déjà ressenti une attirance physique pour un autre homme ?',
        options: [
          { text: 'Non, jamais de façon significative', score: 0 },
          { text: 'Une fois ou deux, peut-être par curiosité passagère', score: 1 },
          { text: 'Oui, plusieurs fois avec différentes personnes', score: 2 },
          { text: 'Oui, régulièrement et de façon très claire', score: 3 },
        ],
        tags: { genders: ['Un homme'] },
      },
      {
        text: 'En tant que femme, as-tu déjà ressenti une attirance romantique ou physique pour une autre femme ?',
        options: [
          { text: 'Non, jamais réellement', score: 0 },
          { text: 'Une légère curiosité une ou deux fois', score: 1 },
          { text: 'Oui, plusieurs fois avec des femmes différentes', score: 2 },
          { text: 'Oui, c\'est quelque chose que je ressens régulièrement', score: 3 },
        ],
        tags: { genders: ['Une femme'] },
      },
      {
        text: 'La relation que tu vis actuellement correspond-elle à l\'attirance que tu ressens profondément ?',
        options: [
          { text: 'Oui, pleinement et sans réserve', score: 0 },
          { text: 'En grande partie, avec quelques zones floues', score: 1 },
          { text: 'Pas vraiment, il y a une tension entre ce que je vis et ce que je ressens', score: 2 },
          { text: 'Non, je sens un décalage profond entre ma relation et mon attirance réelle', score: 3 },
        ],
        tags: { situations: ['En couple'] },
      },
      {
        text: 'Quand tu te projettes dans une future relation idéale, quel est le genre de la personne imaginée ?',
        options: [
          { text: 'Clairement quelqu\'un du sexe opposé', score: 0 },
          { text: 'Principalement quelqu\'un du sexe opposé', score: 1 },
          { text: 'Peu importe le genre, tant que la connexion est vraie', score: 2 },
          { text: 'Quelqu\'un du même genre', score: 3 },
        ],
        tags: { situations: ['Célibataire'] },
      },
      {
        text: 'Les catégories binaires d\'orientation (hétéro, gay) te semblent-elles suffisantes pour te décrire ?',
        options: [
          { text: 'Oui, elles me correspondent parfaitement', score: 0 },
          { text: 'Elles correspondent à peu près, avec quelques nuances', score: 1 },
          { text: 'Oui, je me sens à la frontière entre plusieurs catégories', score: 2 },
          { text: 'Complètement insuffisantes, aucune étiquette standard ne me décrit vraiment', score: 3 },
        ],
        tags: { genders: ['Non-binaire', 'Je préfère ne pas dire'] },
      },
      {
        text: 'Les étiquettes d\'orientation que tu connais reflètent-elles bien ce que tu ressens en ce moment ?',
        options: [
          { text: 'Oui, je sais très bien ce que je suis', score: 0 },
          { text: 'En grande partie, même si tout n\'est pas encore clair', score: 1 },
          { text: 'Pas vraiment, je me sens encore en exploration', score: 2 },
          { text: 'Non, ce que je ressens ne se range pas dans les étiquettes courantes', score: 3 },
        ],
        tags: { ageGroups: ['- de 18 ans', '18–24 ans'] },
      },
      {
        text: 'Ton orientation t\'a-t-elle semblé évoluer ou se nuancer au fil des années ?',
        options: [
          { text: 'Non, elle a toujours été claire et stable', score: 0 },
          { text: 'Légèrement nuancée avec le temps, mais sans changement fondamental', score: 1 },
          { text: 'Oui, j\'ai ressenti des évolutions notables dans mes attirances', score: 2 },
          { text: 'Oui, ce que je ressens aujourd\'hui est très différent de ce que je croyais être', score: 3 },
        ],
        tags: { ageGroups: ['25–34 ans', '35–44 ans', '45 ans et +'] },
      },
      {
        text: 'L\'attirance que tu ressens varie-t-elle selon le genre de la personne (émotionnellement ou physiquement) ?',
        options: [
          { text: 'Non, elle ne s\'applique qu\'aux personnes du sexe opposé', score: 0 },
          { text: 'Principalement pour le sexe opposé, mais avec quelques exceptions', score: 1 },
          { text: 'Elle varie selon les personnes sans distinction claire de genre', score: 2 },
          { text: 'L\'attirance pour le même genre est bien présente, tant physiquement qu\'émotionnellement', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu du mal à t\'identifier aux conversations sur l\'amour hétérosexuel autour de toi ?',
        options: [
          { text: 'Non, je m\'y reconnais pleinement', score: 0 },
          { text: 'Très rarement, sans que ça me préoccupe', score: 1 },
          { text: 'Parfois, un léger décalage que je n\'arrive pas à expliquer', score: 2 },
          { text: 'Souvent, comme si ces conversations ne me concernaient pas vraiment', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà ressenti de l\'anxiété ou de la confusion en essayant de comprendre ton orientation ?',
        options: [
          { text: 'Non, ça n\'a jamais été source de confusion', score: 0 },
          { text: 'Une légère incertitude passagère', score: 1 },
          { text: 'Oui, quelques périodes de questionnement intense', score: 2 },
          { text: 'Oui, c\'est un sujet qui génère beaucoup de stress et d\'interrogation en moi', score: 3 },
        ],
      },
      {
        text: 'As-tu un modèle clair en tête de ce à quoi ressemblerait ta relation amoureuse idéale ?',
        options: [
          { text: 'Oui, c\'est clairement une relation hétérosexuelle classique', score: 0 },
          { text: 'Plutôt une relation hétérosexuelle, mais sans rigidité absolue', score: 1 },
          { text: 'Mon modèle idéal n\'est pas défini par le genre de l\'autre personne', score: 2 },
          { text: 'Mon modèle idéal implique quelqu\'un du même genre', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu te sens à l\'aise pour parler de tes attirances avec des personnes de confiance ?',
        options: [
          { text: 'Oui, totalement, il n\'y a rien à cacher', score: 0 },
          { text: 'Oui, même si certains sujets restent délicats', score: 1 },
          { text: 'Difficilement, je garde une partie de mes ressentis pour moi', score: 2 },
          { text: 'Non, je n\'ose pas en parler par peur du jugement', score: 3 },
        ],
      },
      {
        text: 'Penses-tu que ton orientation peut évoluer avec le temps, ou la vois-tu comme quelque chose de fixe ?',
        options: [
          { text: 'Fixe, j\'en suis certain(e)', score: 0 },
          { text: 'Globalement stable avec quelques nuances possibles', score: 1 },
          { text: 'Je crois qu\'elle peut évoluer, et c\'est ce qui se passe pour moi', score: 2 },
          { text: 'Pour moi, l\'orientation est fluide et je le vis ainsi', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà consciemment exploré ou cherché à mieux comprendre ton attirance pour le même genre ?',
        options: [
          { text: 'Non, il n\'y avait rien à explorer', score: 0 },
          { text: 'Par curiosité intellectuelle, sans lien avec un questionnement personnel', score: 1 },
          { text: 'Oui, j\'ai cherché à comprendre certaines pensées ou réactions', score: 2 },
          { text: 'Oui, activement, via des lectures, des expériences ou des discussions', score: 3 },
        ],
      },
      {
        text: 'La représentation de personnages LGBTQ+ dans les médias te touche-t-elle personnellement ?',
        options: [
          { text: 'Non, je la vois comme celle de n\'importe quel personnage', score: 0 },
          { text: 'Elle me touche comme toute représentation de diversité humaine', score: 1 },
          { text: 'Parfois, certaines représentations me parlent d\'une façon particulière', score: 2 },
          { text: 'Oui, je m\'y identifie souvent et me sens représenté(e)', score: 3 },
        ],
      },
      {
        text: 'Quand tu imagines une relation amoureuse idéale, quel est le genre de la personne que tu vois ?',
        options: [
          { text: 'Clairement du sexe opposé, sans ambiguïté', score: 0 },
          { text: 'Principalement du sexe opposé avec une légère curiosité pour l\'autre', score: 1 },
          { text: 'Les deux genres me semblent possibles selon la personne', score: 2 },
          { text: 'Une personne du même sexe ou sans genre défini', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà ressenti une attraction romantique (pas seulement physique) pour quelqu\'un du même sexe ?',
        options: [
          { text: 'Non, jamais — uniquement pour le sexe opposé', score: 0 },
          { text: 'Une admiration qui s\'est peut-être un peu approchée de l\'attraction', score: 1 },
          { text: 'Oui, pour une personne en particulier qui m\'a fait remettre en question', score: 2 },
          { text: 'Oui, plusieurs fois et de façon claire', score: 3 },
        ],
      },
      {
        text: 'Comment réagis-tu quand une personne du même sexe te fait un compliment sincère ?',
        options: [
          { text: 'Comme n\'importe quel compliment — avec plaisir normal', score: 0 },
          { text: 'Bien — j\'apprécie les compliments quelle que soit leur source', score: 1 },
          { text: 'Avec un léger trouble que je ne m\'explique pas toujours', score: 2 },
          { text: 'Avec une résonance émotionnelle plus forte qu\'avec quelqu\'un du sexe opposé', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà rêvé de façon romantique ou sexuelle d\'une personne du même sexe ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'Peut-être vaguement, sans que ça soit marquant', score: 1 },
          { text: 'Oui, un ou deux rêves précis qui m\'ont laissé(e) perplexe', score: 2 },
          { text: 'Oui, et ces rêves ont été parmi les plus intenses', score: 3 },
        ],
      },
      {
        text: 'Comment te sens-tu dans un environnement très LGBTQ+-friendly (bar, événement, communauté) ?',
        options: [
          { text: 'À l\'aise en tant qu\'allié(e) mais sans me sentir appartenir à ce groupe', score: 0 },
          { text: 'Confortable — j\'aime les environnements inclusifs', score: 1 },
          { text: 'Particulièrement à l\'aise, plus qu\'en environnement traditionnel', score: 2 },
          { text: 'Un sentiment de trouver ma place, de me sentir vu(e) et compris(e)', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu envie d\'explorer ton orientation sexuelle de façon concrète ?',
        options: [
          { text: 'Non, mon orientation me semble claire et établie', score: 0 },
          { text: 'Une curiosité théorique sans envie de passage à l\'acte', score: 1 },
          { text: 'Oui, une envie réelle mais que je n\'ai pas encore actualisée', score: 2 },
          { text: 'Oui, et c\'est une direction que je sens vraiment importante pour moi', score: 3 },
        ],
      },
      {
        text: 'Lorsque tu vois un couple de même sexe dans la rue, quelle est ta réaction intérieure ?',
        options: [
          { text: 'Aucune réaction — je les vois comme n\'importe quel couple', score: 0 },
          { text: 'Un regard bienveillant, j\'aime voir toutes les formes d\'amour', score: 1 },
          { text: 'Une légère envie, comme une projection possible pour moi', score: 2 },
          { text: 'Un écho émotionnel fort, comme si ça me parlait de moi', score: 3 },
        ],
      },
      {
        text: 'Quelle est ton attitude face aux étiquettes d\'orientation sexuelle (gay, bi, hétéro, etc.) ?',
        options: [
          { text: 'Elles me correspondent et m\'aident à me situer', score: 0 },
          { text: 'Utiles socialement, mais imparfaites pour capturer la réalité', score: 1 },
          { text: 'Je me sens un peu à l\'étroit dans les catégories disponibles', score: 2 },
          { text: 'Elles ne me correspondent pas et je préfère m\'en passer', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu du mal à déterminer si ton admiration pour une personne du même sexe était de l\'admiration ou de l\'attraction ?',
        options: [
          { text: 'Non, pour moi c\'est toujours clair', score: 0 },
          { text: 'Une ou deux fois dans le passé, sans suite', score: 1 },
          { text: 'Oui, plusieurs fois sans vraiment trancher', score: 2 },
          { text: 'Régulièrement — la frontière est floue pour moi', score: 3 },
        ],
      },
      {
        text: 'Comment te sens-tu par rapport à ton orientation sexuelle actuelle ?',
        options: [
          { text: 'Très à l\'aise et sûr(e) de moi', score: 0 },
          { text: 'À l\'aise, avec une curiosité que je gère bien', score: 1 },
          { text: 'Des questions que je ne sais pas encore comment résoudre', score: 2 },
          { text: 'Une incertitude ou une tension qui m\'accompagne au quotidien', score: 3 },
        ],
      },
      {
        text: 'Est-ce que tu trouves des personnes du même sexe physiquement attractives ?',
        options: [
          { text: 'Non, je remarque uniquement l\'attractivité du sexe opposé', score: 0 },
          { text: 'Je reconnais objectivement la beauté physique sans attraction', score: 1 },
          { text: 'Oui, parfois je ressens quelque chose qui ressemble à de l\'attraction', score: 2 },
          { text: 'Oui, clairement et régulièrement', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà évité de partager tes pensées sur ton orientation avec quelqu\'un de proche ?',
        options: [
          { text: 'Non, mon orientation est quelque chose d\'ouvert pour moi', score: 0 },
          { text: 'Par pudeur, comme pour tout ce qui est intime', score: 1 },
          { text: 'Oui, par peur de la réaction ou de me tromper moi-même', score: 2 },
          { text: 'Oui, et ce silence me pèse', score: 3 },
        ],
      },
      {
        text: 'Quand tu imagines embrasser quelqu\'un du même sexe, qu\'est-ce que ça évoque en toi ?',
        options: [
          { text: 'Rien de particulier — pas quelque chose que j\'imagine pour moi', score: 0 },
          { text: 'Neutre — l\'idée ne me dérange pas mais ne m\'attire pas vraiment', score: 1 },
          { text: 'Une légère curiosité accompagnée d\'une certaine gêne', score: 2 },
          { text: 'Une attirance réelle que cette question fait remonter', score: 3 },
        ],
      },
      {
        text: 'As-tu un modèle ou une figure publique LGBTQ+ à qui tu t\'identifies de façon personnelle ?',
        options: [
          { text: 'Non, pas d\'identification personnelle à ce titre', score: 0 },
          { text: 'J\'admire des figures LGBTQ+ pour leurs parcours sans identification personnelle', score: 1 },
          { text: 'Oui, quelqu\'un dont le cheminement me touche de près', score: 2 },
          { text: 'Oui, et cette identification me révèle quelque chose sur moi-même', score: 3 },
        ],
      },
      {
        text: 'Comment vis-tu intérieurement le regard social sur ton orientation ?',
        options: [
          { text: 'Sans tension — mon orientation correspond aux normes attendues', score: 0 },
          { text: 'Avec une certaine sérénité même si les choses pourraient être compliquées', score: 1 },
          { text: 'Avec une prudence liée à ce que les gens pourraient penser', score: 2 },
          { text: 'Avec une tension réelle entre ce que je vis et ce que je montre', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà utilisé un réseau social ou une appli de rencontre pour des personnes du même sexe, même par curiosité ?',
        options: [
          { text: 'Non, jamais', score: 0 },
          { text: 'J\'y ai jeté un coup d\'œil par curiosité sans vraiment m\'y aventurer', score: 1 },
          { text: 'Oui, et cette expérience m\'a appris quelque chose sur moi', score: 2 },
          { text: 'Oui, et c\'était une expérience qui correspond à qui je suis', score: 3 },
        ],
      },
      {
        text: 'Si tu pouvais choisir ton orientation librement, sans aucun jugement social, que choisirais-tu ?',
        options: [
          { text: 'La même qu\'actuellement — je suis à l\'aise', score: 0 },
          { text: 'La même, mais je me serais permis plus d\'exploration', score: 1 },
          { text: 'Quelque chose de plus ouvert ou fluide', score: 2 },
          { text: 'Une orientation différente de ce que je présente actuellement', score: 3 },
        ],
      },
      {
        text: 'Lorsque tu parles de quelqu\'un qui te plaît à un ami de confiance, précises-tu instinctivement le genre de cette personne ?',
        options: [
          { text: 'Oui, le genre est une information naturelle que je donne', score: 0 },
          { text: 'Je le précise parfois sans y penser', score: 1 },
          { text: 'Non, j\'ai tendance à rester vague sur ce point', score: 2 },
          { text: 'Délibérément non — je ne veux pas avoir à l\'expliquer', score: 3 },
        ],
      },
      {
        text: 'Est-ce que le concept de "spectre de l\'orientation" (Kinsey) te parle davantage qu\'une catégorie fixe ?',
        options: [
          { text: 'Non, je me sens clairement d\'un côté ou de l\'autre', score: 0 },
          { text: 'C\'est un concept intéressant mais qui ne me concerne pas vraiment', score: 1 },
          { text: 'Oui, je me situe quelque part sur ce spectre plutôt qu\'aux extrêmes', score: 2 },
          { text: 'Oui, et ça décrit beaucoup mieux ma réalité qu\'une étiquette simple', score: 3 },
        ],
      },
      {
        text: 'As-tu des pensées sur ton orientation que tu n\'as jamais dites à voix haute à personne ?',
        options: [
          { text: 'Non, je suis assez ouvert(e) sur ce sujet', score: 0 },
          { text: 'Des réflexions intimes normales que je garde pour moi', score: 1 },
          { text: 'Oui, des pensées spécifiques sur mon orientation que je n\'ose pas formuler', score: 2 },
          { text: 'Oui — et les articuler ici me fait quelque chose', score: 3 },
        ],
      },
      {
        text: 'Quand tu regardes un film avec une scène romantique entre deux personnes du même sexe, comment réagis-tu ?',
        options: [
          { text: 'Comme devant n\'importe quelle scène romantique', score: 0 },
          { text: 'Avec bienveillance mais sans résonance personnelle', score: 1 },
          { text: 'Avec une forme d\'émotion ou d\'identification discrète', score: 2 },
          { text: 'Avec une émotion forte, comme si ça me représentait', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà cherché des informations sur l\'orientation sexuelle de façon personnelle (pas académique) ?',
        options: [
          { text: 'Non, aucune recherche personnelle de ce type', score: 0 },
          { text: 'Par curiosité générale sur la diversité humaine', score: 1 },
          { text: 'Oui, pour mieux comprendre ce que je pouvais ressentir', score: 2 },
          { text: 'Oui, comme une démarche personnelle importante', score: 3 },
        ],
      },
      {
        text: 'As-tu des proches LGBTQ+ avec qui tu as des conversations que tu ne peux pas avoir avec tes autres amis ?',
        options: [
          { text: 'Non, mes conversations sont similaires avec tout le monde', score: 0 },
          { text: 'On parle de sujets différents, normalement liés à leurs expériences', score: 1 },
          { text: 'Oui, je me sens parfois plus libre de certains sujets avec eux/elles', score: 2 },
          { text: 'Oui — avec eux/elles je peux aborder des choses que j\'évite ailleurs', score: 3 },
        ],
      },
      {
        text: 'Dans quel contexte penses-tu le plus souvent à ton orientation sexuelle ?',
        options: [
          { text: 'Rarement ou jamais — c\'est une évidence stable', score: 0 },
          { text: 'Quand j\'y suis confronté(e) socialement ou culturellement', score: 1 },
          { text: 'Régulièrement, comme un sujet de réflexion interne', score: 2 },
          { text: 'Souvent — c\'est quelque chose qui occupe une place réelle dans mon esprit', score: 3 },
        ],
      },
      {
        text: 'Est-ce qu\'il t\'arrive de te sentir attiré(e) par quelqu\'un sans que le genre soit le premier critère ?',
        options: [
          { text: 'Non, le genre est un critère fondamental et premier pour moi', score: 0 },
          { text: 'Rarement, la personnalité peut tout changer mais le genre reste important', score: 1 },
          { text: 'Oui, certaines personnes me touchent indépendamment de leur genre', score: 2 },
          { text: 'Souvent — je suis plus attiré(e) par une énergie ou une façon d\'être que par un genre', score: 3 },
        ],
      },
      {
        text: 'Comment décrirais-tu ta curiosité concernant les relations non-hétérosexuelles ?',
        options: [
          { text: 'Aucune curiosité particulière — ça ne me concerne pas', score: 0 },
          { text: 'La curiosité intellectuelle d\'un observateur bienveillant', score: 1 },
          { text: 'Une curiosité plus personnelle que je n\'assume pas toujours', score: 2 },
          { text: 'Une aspiration réelle, pas juste de la curiosité', score: 3 },
        ],
      },
      {
        text: 'Si tu découvrais demain que tu es LGBTQ+, quelle serait ta première réaction ?',
        options: [
          { text: 'De la surprise totale — ça ne correspond pas à ce que je vis', score: 0 },
          { text: 'Étonnement suivi d\'une acceptation relativement rapide', score: 1 },
          { text: 'Un mélange de soulagement et de questions à résoudre', score: 2 },
          { text: 'La confirmation de quelque chose que je pressentais depuis un moment', score: 3 },
        ],
      },
      {
        text: 'As-tu déjà eu du mal à définir ton orientation sexuelle en une phrase simple ?',
        options: [
          { text: 'Non, je saurais le dire clairement et simplement', score: 0 },
          { text: 'Ce n\'est pas simple à exprimer mais globalement ça se résume bien', score: 1 },
          { text: 'Oui, les mots disponibles ne capturent pas bien ma réalité', score: 2 },
          { text: 'Oui — et cette difficulté en dit peut-être beaucoup sur ma situation', score: 3 },
        ],
      },
      {
        text: 'Quelle proportion de tes fantasmes romantiques implique des personnes du même sexe ?',
        options: [
          { text: 'Aucune — uniquement le sexe opposé', score: 0 },
          { text: 'Très peu — c\'est marginal', score: 1 },
          { text: 'Une part non négligeable', score: 2 },
          { text: 'Une part importante ou la majorité', score: 3 },
        ],
      },
      {
        text: 'Si la société était totalement neutre sur l\'orientation sexuelle, penses-tu que tu vivrais les choses différemment ?',
        options: [
          { text: 'Non, rien ne changerait fondamentalement pour moi', score: 0 },
          { text: 'Je serais peut-être plus curieux/se sans peur du regard', score: 1 },
          { text: 'Oui, je m\'autoriserais probablement plus de choses', score: 2 },
          { text: 'Oui, profondément — je vivrais et m\'exprimerais très différemment', score: 3 },
        ],
      },
    ],
    resultTiers: [
      {
        min: 0, max: 20,
        emoji: '🏳️',
        title: 'Hétérosexuel(le)',
        message: 'Tes réponses indiquent une attirance clairement orientée vers le sexe opposé. Tu es à l\'aise avec ton orientation et c\'est tout à fait naturel. La diversité des orientations fait partie de la beauté humaine.',
        color: 'text-blue-400',
        glowColor: '#60a5fa',
      },
      {
        min: 20, max: 40,
        emoji: '💭',
        title: 'Principalement hétéro',
        message: 'Tu es majoritairement attiré(e) par le sexe opposé, mais il existe quelques nuances. Il est normal de ressentir une légère curiosité sans que cela remette en cause ton orientation. La sexualité est un spectre.',
        color: 'text-teal-400',
        glowColor: '#2dd4bf',
      },
      {
        min: 40, max: 60,
        emoji: '🌈',
        title: 'Bisexuel(le) / En exploration',
        message: 'Tes réponses suggèrent une attirance qui ne se limite pas à un seul genre. Tu pourrais te retrouver dans la bisexualité ou simplement être en exploration. Prends le temps d\'explorer sans pression.',
        color: 'text-violet-400',
        glowColor: '#a78bfa',
      },
      {
        min: 60, max: 80,
        emoji: '🏳️‍🌈',
        title: 'Probablement gay/lesbien(ne)',
        message: 'Tes réponses pointent fortement vers une attirance principale pour le même genre. Il est possible que tu sois gay ou lesbien(ne). Sache que tu n\'es pas seul(e) dans ce chemin.',
        color: 'text-pink-400',
        glowColor: '#f472b6',
      },
      {
        min: 80, max: 101,
        emoji: '💜',
        title: 'Gay / Lesbien(ne)',
        message: 'Tes réponses indiquent très clairement une attirance pour le même genre. Que ce soit une confirmation ou une découverte, sache que c\'est une part magnifique de qui tu es. Tu mérites d\'être toi-même, pleinement.',
        color: 'text-purple-400',
        glowColor: '#c084fc',
      },
    ],
  },
];

export function getAllQuizzes(): Quiz[] {
  return quizzes;
}

export function selectQuestions(questions: QuizQuestion[], session: QuizSession = {}): QuizQuestion[] {
  const untagged = questions.filter((q) => !q.tags);
  const tagged = questions.filter((q) => !!q.tags);

  const matching = tagged.filter((q) => {
    const { genders, situations, ageGroups } = q.tags!;
    return (
      (!genders || !session.gender || genders.includes(session.gender)) &&
      (!situations || !session.situation || situations.includes(session.situation)) &&
      (!ageGroups || !session.age || ageGroups.includes(session.age))
    );
  });
  const nonMatching = tagged.filter((q) => !matching.includes(q));

  // 25 universal + up to 5 personalized (matching profile first, then fallback)
  const personalized = [...matching, ...nonMatching].slice(0, 5);
  return [...untagged.slice(0, 25), ...personalized];
}

export function getQuizBySlug(slug: string): Quiz | undefined {
  return quizzes.find((q) => q.slug === slug);
}

export function getResultTier(quiz: Quiz, percentage: number): ResultTier {
  const tier = quiz.resultTiers.find(
    (t) => percentage >= t.min && percentage < t.max
  );
  return tier ?? quiz.resultTiers[quiz.resultTiers.length - 1];
}
