export interface QuizOption {
  text: string;
  score: number;
}

export interface QuizQuestion {
  text: string;
  options: QuizOption[];
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

const quizzes: Quiz[] = [
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

export function getQuizBySlug(slug: string): Quiz | undefined {
  return quizzes.find((q) => q.slug === slug);
}

export function getResultTier(quiz: Quiz, percentage: number): ResultTier {
  const tier = quiz.resultTiers.find(
    (t) => percentage >= t.min && percentage < t.max
  );
  return tier ?? quiz.resultTiers[quiz.resultTiers.length - 1];
}
