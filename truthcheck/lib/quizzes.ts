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
  // ─── QUIZ : AUTO-SABOTAGE ─────────────────────────────────────────────────
  {
    slug: 'auto-sabotage',
    title: 'Est-ce que tu te mets des bâtons dans les roues sans t\'en rendre compte ?',
    subtitle: 'Un quiz pour repérer, en douceur, les schémas d\'auto-sabotage qui freinent ta progression',
    description: '30 questions pour comprendre comment la procrastination, le perfectionnisme ou la peur de réussir peuvent, sans que tu le voies, te mettre des bâtons dans les roues.',
    emoji: '🪤',
    gradientFrom: 'from-orange-950/80',
    gradientTo: 'to-rose-950/80',
    borderColor: 'border-orange-800/30',
    accentColor: '#f97316',
    questions: [
      { text: 'Quand une tâche importante t\'attend, qu\'est-ce qui se passe le plus souvent ?', options: [{ text: 'Je m\'y mets assez vite, même si ce n\'est pas parfait', score: 0 }, { text: 'Je repousse un peu, mais je finis par m\'y mettre à temps', score: 1 }, { text: 'Je trouve mille choses "urgentes" à faire avant, jusqu\'à la dernière minute', score: 2 }, { text: 'Je repousse tellement que je finis par ne plus avoir le temps de bien faire, ou je ne la fais pas du tout', score: 3 }] },
      { text: 'Tu as un projet qui te tient à cœur depuis longtemps. Où en es-tu réellement ?', options: [{ text: 'J\'avance dessus régulièrement, même à petits pas', score: 0 }, { text: 'J\'avance par vagues, avec des pauses plus ou moins longues', score: 1 }, { text: 'J\'y pense beaucoup plus que je n\'agis dessus', score: 2 }, { text: 'Il est toujours "sur le point de commencer" depuis des mois, voire des années', score: 3 }] },
      { text: 'Le fameux ménage, rangement ou tâche administrative qui traîne depuis un moment, c\'est plutôt...', options: [{ text: 'Réglé rapidement, je préfère ne pas y penser après', score: 0 }, { text: 'Fait avec un peu de retard, mais fait', score: 1 }, { text: 'Repoussé jusqu\'à ce que ça devienne vraiment gênant', score: 2 }, { text: 'Une source de stress permanent que j\'évite en pensant à autre chose', score: 3 }] },
      { text: 'Tu rends un travail (mail, dossier, création) : comment tu te sens juste avant de l\'envoyer ?', options: [{ text: 'Satisfait(e), je sais que j\'ai fait de mon mieux avec le temps que j\'avais', score: 0 }, { text: 'Un peu anxieux(se) mais je l\'envoie sans trop tarder', score: 1 }, { text: 'Je le relis et le modifie encore et encore avant de me résoudre à l\'envoyer', score: 2 }, { text: 'Je repousse l\'envoi car "ce n\'est jamais assez bien", parfois jusqu\'à rater l\'échéance', score: 3 }] },
      { text: 'Si un résultat n\'est pas exactement comme tu l\'imaginais, tu as tendance à...', options: [{ text: 'L\'accepter, en te disant que c\'est déjà bien', score: 0 }, { text: 'Ressentir une petite déception vite oubliée', score: 1 }, { text: 'Te concentrer surtout sur ce qui cloche, en minimisant le reste', score: 2 }, { text: 'Considérer que c\'est presque un échec, même si les autres trouvent ça très bien', score: 3 }] },
      { text: 'Est-ce qu\'il t\'arrive de ne pas commencer un projet parce que tu ne sais pas si tu pourras le faire "parfaitement" ?', options: [{ text: 'Non, je préfère avancer imparfaitement plutôt que ne rien faire', score: 0 }, { text: 'Rarement, ça m\'arrive mais je me débloque vite', score: 1 }, { text: 'Assez souvent, l\'idée de mal faire me freine', score: 2 }, { text: 'Très souvent, je préfère ne pas essayer plutôt que risquer un résultat imparfait', score: 3 }] },
      { text: 'On te propose de porter un projet devant tout le monde (présentation, prise de parole, mise en avant). Ta première réaction intérieure ?', options: [{ text: 'Une pointe de stress, vite remplacée par de l\'envie', score: 0 }, { text: 'Du stress, mais j\'accepte en général', score: 1 }, { text: 'Une petite voix qui cherche des excuses pour refuser ou déléguer', score: 2 }, { text: 'Un refus quasi automatique, ou j\'accepte puis je sabote ma préparation', score: 3 }] },
      { text: 'Quand tu réussis quelque chose de visible, qu\'est-ce qui te traverse l\'esprit ?', options: [{ text: 'De la fierté simple, que j\'assume', score: 0 }, { text: 'De la fierté, teintée d\'un peu de gêne à en parler', score: 1 }, { text: 'L\'impression que ce n\'était "pas si dur" ou que j\'ai eu de la chance', score: 2 }, { text: 'La peur que les gens attendent encore plus de moi maintenant, ou que ça ne dure pas', score: 3 }] },
      { text: 'Est-ce qu\'il t\'arrive de minimiser tes réussites devant les autres, presque instinctivement ?', options: [{ text: 'Non, je les partage assez naturellement', score: 0 }, { text: 'Parfois, par politesse plus que par malaise réel', score: 1 }, { text: 'Souvent, j\'ai du mal à recevoir un compliment sans le dévier', score: 2 }, { text: 'Presque toujours, comme si me faire discret(e) était plus sûr que d\'être vu(e)', score: 3 }] },
      { text: 'Après une erreur, la voix dans ta tête te dit plutôt...', options: [{ text: '"C\'est humain, qu\'est-ce que j\'apprends de ça ?"', score: 0 }, { text: '"Bon, pas terrible, mais ça arrive."', score: 1 }, { text: '"Tu aurais dû faire mieux."', score: 2 }, { text: '"Typique, tu rates toujours ce genre de choses."', score: 3 }] },
      { text: 'Quand tu penses à toi-même, en général...', options: [{ text: 'Je me parle avec plutôt de la bienveillance', score: 0 }, { text: 'Je suis assez neutre, ni trop dur(e) ni trop indulgent(e)', score: 1 }, { text: 'Je suis souvent mon propre critique le plus sévère', score: 2 }, { text: 'Je me juge d\'une façon que je n\'accepterais jamais qu\'on utilise envers un(e) ami(e)', score: 3 }] },
      { text: 'Environ combien de fois par jour une pensée du type "je ne suis pas à la hauteur" te traverse ?', options: [{ text: 'Presque jamais', score: 0 }, { text: 'De temps en temps, sans que ça m\'affecte trop', score: 1 }, { text: 'Assez régulièrement, ça finit par peser', score: 2 }, { text: 'Très souvent, presque en fond sonore permanent', score: 3 }] },
      { text: 'Une opportunité intéressante mais incertaine se présente (voyage, formation, rencontre). Ta tendance ?', options: [{ text: 'Je saute dessus, l\'incertitude m\'excite plus qu\'elle ne m\'effraie', score: 0 }, { text: 'J\'hésite un peu puis je me lance', score: 1 }, { text: 'Je trouve des raisons logiques de ne pas y aller, même si l\'envie est là', score: 2 }, { text: 'Je la laisse passer, en me disant que "ce n\'est pas le bon moment" — comme souvent', score: 3 }] },
      { text: 'Depuis combien de temps n\'as-tu pas essayé quelque chose qui te faisait vraiment un peu peur ?', options: [{ text: 'Récemment, c\'est plutôt fréquent chez moi', score: 0 }, { text: 'Il y a quelques mois', score: 1 }, { text: 'Je ne m\'en souviens plus vraiment', score: 2 }, { text: 'Ça fait si longtemps que l\'idée même me semble étrangère', score: 3 }] },
      { text: 'Quand une habitude ne te convient plus (routine, relation, job), qu\'est-ce qui se passe le plus souvent ?', options: [{ text: 'Je commence à ajuster les choses assez tôt', score: 0 }, { text: 'J\'attends un peu, mais je finis par changer', score: 1 }, { text: 'Je reste dedans bien plus longtemps que ce que je voudrais admettre', score: 2 }, { text: 'Je reste, même quand je sais que ça ne me convient plus depuis longtemps', score: 3 }] },
      { text: 'Dans une relation qui commence bien, qu\'est-ce qui a tendance à se passer chez toi ?', options: [{ text: 'Je me laisse porter par l\'histoire, en restant attentif(ve)', score: 0 }, { text: 'Je reste prudent(e) un moment, puis je me détends', score: 1 }, { text: 'Je cherche presque malgré moi ce qui pourrait clocher', score: 2 }, { text: 'Je finis souvent par créer une distance ou un conflit, sans trop savoir pourquoi', score: 3 }] },
      { text: 'Quand quelqu\'un se rapproche vraiment de toi émotionnellement, ta réaction intérieure ?', options: [{ text: 'J\'accueille ça avec plaisir', score: 0 }, { text: 'Un peu de vulnérabilité, mais ça passe', score: 1 }, { text: 'Une envie de reprendre un peu de distance pour "souffler"', score: 2 }, { text: 'Un besoin presque irrépressible de fuir ou de tout remettre en question', score: 3 }] },
      { text: 'Après une dispute ou un désaccord avec un proche, tu as tendance à...', options: [{ text: 'En reparler assez vite pour clarifier les choses', score: 0 }, { text: 'Laisser un peu retomber la pression avant d\'en reparler', score: 1 }, { text: 'Éviter le sujet, en espérant que ça se tasse tout seul', score: 2 }, { text: 'Laisser la distance s\'installer, parfois au point de mettre la relation en danger', score: 3 }] },
      { text: 'Une promotion ou une opportunité de carrière se présente, mais elle demande de sortir de ta zone connue. Tu...', options: [{ text: 'Je me positionne sans trop hésiter', score: 0 }, { text: 'J\'hésite, puis je tente ma chance', score: 1 }, { text: 'Je me trouve "pas encore prêt(e)", même quand les autres pensent le contraire', score: 2 }, { text: 'Je laisse passer, en me convainquant que ce n\'était de toute façon "pas pour moi"', score: 3 }] },
      { text: 'Quand tu es proche d\'un objectif professionnel important, remarques-tu un schéma particulier chez toi ?', options: [{ text: 'Non, je continue sur ma lancée normalement', score: 0 }, { text: 'Un peu de stress, sans plus', score: 1 }, { text: 'J\'ai tendance à ralentir ou à me distraire, sans trop comprendre pourquoi', score: 2 }, { text: 'Il m\'arrive de tout faire capoter juste avant d\'arriver au but', score: 3 }] },
      { text: 'Face à un retour constructif de ton manager ou d\'un collègue, ta réaction la plus fréquente ?', options: [{ text: 'Je l\'accueille comme une info utile', score: 0 }, { text: 'Ça me pique un peu, puis je l\'intègre', score: 1 }, { text: 'Je me braque intérieurement, même si je ne le montre pas', score: 2 }, { text: 'Je l\'entends comme une confirmation que "je ne suis pas assez bien", point final', score: 3 }] },
      { text: 'Quand tu te sens fatigué(e) ou pas bien, ta première réaction est plutôt de...', options: [{ text: 'M\'accorder du repos sans culpabiliser', score: 0 }, { text: 'Ralentir un peu, en culpabilisant légèrement', score: 1 }, { text: 'Pousser quand même, en ignorant les signaux de mon corps', score: 2 }, { text: 'Repousser tout soin de moi jusqu\'à ce que ça devienne difficile à ignorer', score: 3 }] },
      { text: 'Face à un rendez-vous médical ou un bilan de santé à prendre, tu as tendance à...', options: [{ text: 'Le prendre assez rapidement', score: 0 }, { text: 'Le prendre, avec un peu de retard', score: 1 }, { text: 'Le repousser tant que rien ne devient urgent', score: 2 }, { text: 'L\'éviter carrément, même quand une petite voix me dit que je devrais y aller', score: 3 }] },
      { text: 'Quand tu te fixes un objectif bien-être (sommeil, sport, alimentation), qu\'est-ce qui se passe le plus souvent ?', options: [{ text: 'Je tiens mes engagements avec de la souplesse', score: 0 }, { text: 'Je tiens un moment, puis je relâche, puis je reprends', score: 1 }, { text: 'Je commence fort puis j\'abandonne dès le premier obstacle', score: 2 }, { text: 'Je sabote presque volontairement dès que ça commence à porter ses fruits', score: 3 }] },
      { text: 'Quand il s\'agit de regarder tes comptes ou ton budget en face, tu...', options: [{ text: 'Je regarde régulièrement, sans stress particulier', score: 0 }, { text: 'Je regarde de temps en temps, avec un peu d\'appréhension', score: 1 }, { text: 'J\'évite de regarder de trop près, "je verrai plus tard"', score: 2 }, { text: 'Je préfère ne pas savoir, même quand je sens que quelque chose ne va pas', score: 3 }] },
      { text: 'Face à une décision financière importante (épargne, investissement, négociation de salaire), tu as tendance à...', options: [{ text: 'Me renseigner et avancer, même avec de l\'incertitude', score: 0 }, { text: 'Prendre mon temps, puis me décider', score: 1 }, { text: 'Repousser la décision indéfiniment, "le temps de réfléchir encore"', score: 2 }, { text: 'Laisser les autres décider à ma place, ou ne rien faire du tout par peur de me tromper', score: 3 }] },
      { text: 'Quand tu gagnes ou reçois de l\'argent de façon inattendue, que se passe-t-il souvent ?', options: [{ text: 'Je réfléchis calmement à ce que j\'en fais', score: 0 }, { text: 'Je le dépense un peu vite, sans trop de regrets', score: 1 }, { text: 'Je le dépense presque aussitôt, comme pour m\'en débarrasser', score: 2 }, { text: 'J\'ai l\'impression de ne pas "mériter" de le garder, et je trouve vite un moyen de le perdre', score: 3 }] },
      { text: 'Face à un choix important avec plusieurs bonnes options, ta tendance naturelle ?', options: [{ text: 'Je choisis en un temps raisonnable, avec les infos que j\'ai', score: 0 }, { text: 'J\'hésite un peu, puis je tranche', score: 1 }, { text: 'Je tourne en rond longtemps, en cherchant "LA" bonne réponse', score: 2 }, { text: 'Je reste bloqué(e) si longtemps que la décision finit par se prendre sans moi', score: 3 }] },
      { text: 'Une fois une décision prise, que se passe-t-il dans ta tête ?', options: [{ text: 'Je passe à autre chose, sereinement', score: 0 }, { text: 'J\'y repense un peu, puis je lâche prise', score: 1 }, { text: 'Je doute et remets en question mon choix pendant un moment', score: 2 }, { text: 'Je regrette presque systématiquement, peu importe ce que j\'ai choisi', score: 3 }] },
      { text: 'Quand tu dois trancher seul(e), sans avis extérieur pour te rassurer, tu te sens...', options: [{ text: 'À l\'aise, je fais confiance à mon jugement', score: 0 }, { text: 'Un peu incertain(e), mais capable', score: 1 }, { text: 'Mal à l\'aise, j\'ai besoin de valider auprès de quelqu\'un', score: 2 }, { text: 'Presque paralysé(e), au point de préférer ne rien décider du tout', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '😊', title: 'Tu tiens plutôt bien la barre', message: 'Tu avances vers ce que tu veux sans trop te mettre d\'obstacles inutiles sur le chemin. Ça ne veut pas dire que tu n\'as jamais peur ou que tu es à l\'abri du doute — simplement que tu ne les laisses pas prendre le volant. Continue à cultiver cette confiance, elle n\'est jamais acquise pour toujours.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🙂', title: 'Quelques cailloux, rien de dramatique', message: 'Il t\'arrive de freiner un peu tes propres élans, souvent sans t\'en rendre compte, mais rien qui ne détermine ta trajectoire. Ce sont des réflexes ponctuels de protection, pas des habitudes profondément ancrées. Repérer ces petits moments où tu hésites à avancer est déjà la moitié du chemin.', color: 'text-teal-400', glowColor: '#14b8a6' },
      { min: 40, max: 60, emoji: '😌', title: 'Un schéma commence à se dessiner', message: 'Une partie de toi avance, une autre freine discrètement, souvent au moment où ça compte le plus. Ce n\'est pas un manque de volonté — c\'est probablement une façon, ancienne et apprise, de te protéger d\'un risque, d\'un jugement ou d\'une déception. Un schéma qu\'on commence à voir est un schéma qu\'on peut commencer à désamorcer.', color: 'text-amber-400', glowColor: '#f59e0b' },
      { min: 60, max: 80, emoji: '😔', title: 'Tu te mets pas mal de bâtons dans les roues', message: 'Tu te freines souvent, et sur plusieurs fronts à la fois, avec des obstacles que personne d\'autre ne t\'impose. Ce n\'est ni de la paresse ni un défaut de caractère : c\'est un système de protection devenu trop actif, qui te coûte aujourd\'hui plus qu\'il ne te protège vraiment. Regarder ça en face, comme tu viens de le faire, compte déjà comme un premier pas.', color: 'text-orange-400', glowColor: '#f97316' },
      { min: 80, max: 101, emoji: '💔', title: 'Le mode protection a pris toute la place', message: 'Le sabotage n\'est plus un réflexe ponctuel chez toi : il s\'est installé un peu partout — dans ton travail, tes relations, ta santé ou tes finances. Ça ne dit rien de ta valeur, ça dit qu\'une part de toi a appris, à un moment donné, que se freiner était plus sûr qu\'avancer. Ce schéma peut se desserrer, doucement, et tu n\'as pas à le faire seul(e).', color: 'text-rose-400', glowColor: '#f43f5e' },
    ],
  },
  // ─── QUIZ : RÔLE FAMILIAL ─────────────────────────────────────────────────
  {
    slug: 'role-familial',
    title: 'Quel rôle as-tu appris à jouer dans ta famille ?',
    subtitle: 'Le rôle silencieux que tu as adopté enfant — et qui te façonne encore',
    description: '30 questions inspirées des théories des systèmes familiaux pour identifier le rôle que tu as appris à jouer enfant, et ce qu\'il te coûte encore aujourd\'hui.',
    emoji: '🎭',
    gradientFrom: 'from-amber-950/80',
    gradientTo: 'to-rose-950/80',
    borderColor: 'border-amber-800/30',
    accentColor: '#f59e0b',
    questions: [
      { text: 'Enfant, quand il y avait une tension à la maison, qu\'est-ce que tu faisais le plus souvent ?', options: [{ text: 'Rien de particulier, ça ne me concernait pas vraiment', score: 0 }, { text: 'Je remarquais l\'ambiance mais je continuais à vivre ma vie', score: 1 }, { text: 'Je cherchais à comprendre ce qui se passait pour anticiper la suite', score: 2 }, { text: 'J\'essayais activement de calmer le jeu ou de réconforter tout le monde', score: 3 }] },
      { text: 'Quand tu étais triste ou en colère, enfant, qu\'est-ce qui se passait généralement ?', options: [{ text: 'On prenait le temps de m\'écouter vraiment', score: 0 }, { text: 'On me consolait, même imparfaitement', score: 1 }, { text: 'Je devais vite passer à autre chose', score: 2 }, { text: 'Je gardais ça pour moi, comme un poids en plus pour mes parents', score: 3 }] },
      { text: 'À quel âge as-tu commencé à gérer des tâches "d\'adulte" (courses, papiers, veiller sur un frère ou une sœur, rassurer un parent) ?', options: [{ text: 'Jamais vraiment, ou seulement des tâches adaptées à mon âge', score: 0 }, { text: 'Vers l\'adolescence, comme beaucoup', score: 1 }, { text: 'Plus jeune que la plupart de mes amis', score: 2 }, { text: 'Très tôt, j\'ai l\'impression d\'avoir été un petit adulte dès l\'enfance', score: 3 }] },
      { text: 'Dans ta famille, qui étais-tu censé être pour que "tout aille bien" ?', options: [{ text: 'Je n\'avais pas de rôle particulier, j\'étais juste l\'enfant', score: 0 }, { text: 'On attendait de moi que je sois sage, sans plus', score: 1 }, { text: 'J\'avais un rôle assez précis (le raisonnable, le bon élève, le calme...)', score: 2 }, { text: 'La famille comptait sur moi pour tenir un équilibre fragile', score: 3 }] },
      { text: 'Comment réagissais-tu si tes parents se disputaient ?', options: [{ text: 'Ça ne m\'atteignait pas particulièrement', score: 0 }, { text: 'Ça me rendait triste mais je n\'intervenais pas', score: 1 }, { text: 'Je faisais quelque chose pour changer l\'ambiance (blague, question, activité)', score: 2 }, { text: 'Je me sentais responsable de les réconcilier ou d\'apaiser la situation', score: 3 }] },
      { text: 'Aujourd\'hui, quand quelqu\'un que tu aimes est contrarié, ton premier réflexe est de...', options: [{ text: 'Le laisser vivre son émotion sans te sentir obligé(e) d\'agir', score: 0 }, { text: 'Lui demander comment tu peux l\'aider, sans pression', score: 1 }, { text: 'Ressentir une urgence intérieure à régler la situation', score: 2 }, { text: 'Tout faire pour arranger les choses, même au prix de tes propres besoins', score: 3 }] },
      { text: 'Enfant, avais-tu le droit de dire "non" ou d\'exprimer un désaccord ?', options: [{ text: 'Oui, facilement, on m\'écoutait', score: 0 }, { text: 'Oui, mais parfois ça créait des frictions', score: 1 }, { text: 'Rarement, c\'était souvent mal reçu', score: 2 }, { text: 'Presque jamais, je savais que ça ne servait à rien', score: 3 }] },
      { text: 'Quand tu réussissais quelque chose (bonnes notes, exploit), que ressentais-tu surtout ?', options: [{ text: 'De la fierté simple, pour moi-même', score: 0 }, { text: 'De la joie de partager ça avec mes proches', score: 1 }, { text: 'Un soulagement, comme si j\'avais évité une déception', score: 2 }, { text: 'Que je venais de mériter un peu plus d\'amour ou d\'attention', score: 3 }] },
      { text: 'Aujourd\'hui, comment vis-tu l\'échec ou l\'erreur ?', options: [{ text: 'Ça arrive, je me pardonne assez vite', score: 0 }, { text: 'Ça me travaille un peu mais ça passe', score: 1 }, { text: 'Je le vis comme une remise en question profonde de ma valeur', score: 2 }, { text: 'Une peur intense d\'avoir déçu ou d\'être démasqué(e)', score: 3 }] },
      { text: 'Dans les repas ou réunions de famille, quel était ton rôle spontané ?', options: [{ text: 'Je participais comme un enfant parmi d\'autres', score: 0 }, { text: 'J\'écoutais surtout, discret(ète)', score: 1 }, { text: 'Je faisais le lien, la traduction entre les uns et les autres', score: 2 }, { text: 'Je détendais l\'atmosphère par l\'humour dès que ça devenait tendu', score: 3 }] },
      { text: 'Quand un parent allait mal (fatigue, tristesse, stress), que faisais-tu ?', options: [{ text: 'Rien de spécial, je n\'en étais pas vraiment conscient(e)', score: 0 }, { text: 'Je le remarquais mais ça restait l\'affaire des adultes', score: 1 }, { text: 'Je faisais attention à ne pas en rajouter, à être facile à vivre', score: 2 }, { text: 'J\'essayais de le/la réconforter ou de prendre soin de lui/elle', score: 3 }] },
      { text: 'Aujourd\'hui, arrives-tu à demander de l\'aide quand tu en as besoin ?', options: [{ text: 'Oui, naturellement', score: 0 }, { text: 'Oui, mais ça demande un effort', score: 1 }, { text: 'Rarement, je préfère me débrouiller seul(e)', score: 2 }, { text: 'Presque jamais, ça me met mal à l\'aise voire coupable', score: 3 }] },
      { text: 'Petit(e), quand quelque chose n\'allait pas dans la famille, avais-tu l\'impression que c\'était...', options: [{ text: 'Une affaire d\'adultes qui ne me concernait pas', score: 0 }, { text: 'Quelque chose que je pouvais observer sans m\'y mêler', score: 1 }, { text: 'Un peu de ma responsabilité, sans trop savoir pourquoi', score: 2 }, { text: 'Vraiment de ma responsabilité de faire en sorte que ça s\'arrange', score: 3 }] },
      { text: 'Comment décrirais-tu l\'attention reçue enfant, comparée aux préoccupations de tes parents ?', options: [{ text: 'J\'étais clairement une priorité', score: 0 }, { text: 'J\'avais ma place, même si les parents avaient leurs soucis', score: 1 }, { text: 'J\'avais l\'impression de passer souvent après leurs problèmes', score: 2 }, { text: 'Mes besoins comptaient moins que le fait de ne pas en rajouter', score: 3 }] },
      { text: 'Quand tu étais en désaccord avec un parent, comment cela se passait-il généralement ?', options: [{ text: 'On en discutait, mon avis avait du poids', score: 0 }, { text: 'On finissait par trouver un terrain d\'entente', score: 1 }, { text: 'Je cédais souvent pour éviter le conflit', score: 2 }, { text: 'J\'apprenais vite qu\'il valait mieux ne rien dire du tout', score: 3 }] },
      { text: 'Aujourd\'hui, à quelle fréquence dis-tu "ça va" alors que ce n\'est pas vraiment le cas ?', options: [{ text: 'Rarement, je dis assez facilement ce qui ne va pas', score: 0 }, { text: 'De temps en temps, selon les personnes', score: 1 }, { text: 'Souvent, c\'est presque un réflexe', score: 2 }, { text: 'Presque systématiquement, je n\'aime pas être un poids pour les autres', score: 3 }] },
      { text: 'Enfant, te souviens-tu d\'avoir dû être "le/la plus fort(e)" de la famille, émotionnellement ?', options: [{ text: 'Non, je n\'ai pas ce souvenir', score: 0 }, { text: 'Un peu, dans certaines situations ponctuelles', score: 1 }, { text: 'Oui, assez régulièrement', score: 2 }, { text: 'Oui, c\'était presque attendu de moi en permanence', score: 3 }] },
      { text: 'Comment as-tu appris à gérer les tensions ou les non-dits dans ta famille ?', options: [{ text: 'Il n\'y en avait pas vraiment, ou on en parlait ouvertement', score: 0 }, { text: 'Je les remarquais sans chercher à les résoudre', score: 1 }, { text: 'Je développais un humour ou une légèreté pour détendre l\'atmosphère', score: 2 }, { text: 'Je devenais hyper vigilant(e), toujours à l\'affût du moindre changement de climat', score: 3 }] },
      { text: 'Aujourd\'hui, comment vis-tu le fait de "ne rien faire" (repos, farniente) sans culpabilité ?', options: [{ text: 'Très bien, je me repose sans arrière-pensée', score: 0 }, { text: 'Plutôt bien, avec un petit effort parfois', score: 1 }, { text: 'Difficilement, j\'ai vite l\'impression de perdre mon temps', score: 2 }, { text: 'Presque impossible, je me sens coupable si je ne suis pas utile', score: 3 }] },
      { text: 'Dans ta fratrie ou ta famille élargie, avais-tu l\'impression d\'être...', options: [{ text: 'Un enfant comme les autres, sans étiquette particulière', score: 0 }, { text: 'Plutôt le/la calme ou le/la discret(ète)', score: 1 }, { text: 'Celui/celle qu\'on félicitait pour sa maturité', score: 2 }, { text: 'Celui/celle sur qui on comptait, presque comme un pilier de la famille', score: 3 }] },
      { text: 'Petit(e), qu\'arrivait-il quand quelque chose se passait mal à la maison (dispute, problème financier, crise) ?', options: [{ text: 'On me protégeait de ces sujets', score: 0 }, { text: 'J\'en entendais parler, sans plus', score: 1 }, { text: 'On me mettait un peu dans la confidence, comme un soutien', score: 2 }, { text: 'Je me retrouvais à porter une partie du poids, parfois plus qu\'un parent', score: 3 }] },
      { text: 'Aujourd\'hui, dans tes relations (amicales, amoureuses), qui es-tu le plus souvent ?', options: [{ text: 'Quelqu\'un qui reçoit autant qu\'il/elle donne', score: 0 }, { text: 'Quelqu\'un d\'attentif, sans que ça déséquilibre trop la relation', score: 1 }, { text: 'Souvent celui/celle qui écoute, soutient, porte les autres', score: 2 }, { text: 'Le pilier sur lequel tout le monde s\'appuie, même quand toi tu vas mal', score: 3 }] },
      { text: 'As-tu le souvenir d\'avoir été puni(e), grondé(e) ou blâmé(e) plus facilement que les autres dans ta famille ?', options: [{ text: 'Non, pas particulièrement', score: 0 }, { text: 'Occasionnellement, comme n\'importe quel enfant', score: 1 }, { text: 'Assez souvent, j\'avais l\'impression d\'être plus souvent pointé(e) du doigt', score: 2 }, { text: 'Régulièrement, j\'étais un peu celui/celle par qui les problèmes arrivaient', score: 3 }] },
      { text: 'Comment décrirais-tu ta place dans les photos ou souvenirs de famille ?', options: [{ text: 'Bien présente, on parle facilement de moi', score: 0 }, { text: 'Présente, sans que ce soit un sujet particulier', score: 1 }, { text: 'Un peu en retrait, je passais souvent inaperçu(e)', score: 2 }, { text: 'Presque absente, j\'ai l\'impression d\'avoir grandi un peu à côté de la famille', score: 3 }] },
      { text: 'Aujourd\'hui, à quel point sais-tu identifier facilement ce dont TU as besoin (et pas ce dont les autres ont besoin) ?', options: [{ text: 'Très facilement, je connais bien mes besoins', score: 0 }, { text: 'Plutôt bien, avec un peu de réflexion', score: 1 }, { text: 'C\'est flou, je pense souvent d\'abord aux autres', score: 2 }, { text: 'Très difficilement, j\'ai du mal à savoir ce que JE veux vraiment', score: 3 }] },
      { text: 'Enfant, l\'humour ou la légèreté était-il ton moyen principal de gérer les moments difficiles ?', options: [{ text: 'Non, je n\'avais pas ce réflexe', score: 0 }, { text: 'Parfois, comme beaucoup d\'enfants', score: 1 }, { text: 'Assez souvent, ça détendait l\'atmosphère', score: 2 }, { text: 'Presque systématiquement, c\'était ma façon d\'exister et de faire diversion', score: 3 }] },
      { text: 'Aujourd\'hui, comment réagis-tu face à un conflit avec un proche ?', options: [{ text: 'Je l\'aborde directement, sans trop d\'appréhension', score: 0 }, { text: 'Ça me stresse un peu, mais je fais face', score: 1 }, { text: 'J\'évite autant que possible, quitte à ravaler ce que je ressens', score: 2 }, { text: 'Je fais tout pour désamorcer la situation avant même qu\'elle n\'éclate, quitte à m\'effacer', score: 3 }] },
      { text: 'Petit(e), avais-tu l\'impression que l\'amour de tes parents dépendait de ta capacité à te comporter d\'une certaine façon (sage, performant, discret, drôle...) ?', options: [{ text: 'Non, je me sentais aimé(e) inconditionnellement', score: 0 }, { text: 'Un peu, dans certains moments', score: 1 }, { text: 'Oui, assez régulièrement je sentais que je devais mériter leur attention', score: 2 }, { text: 'Oui, très clairement, l\'amour semblait conditionné à mon rôle ou mes résultats', score: 3 }] },
      { text: 'Aujourd\'hui, comment te sens-tu quand on prend soin de TOI, sans que tu aies rien à faire en retour ?', options: [{ text: 'Naturellement bien, je peux recevoir sans arrière-pensée', score: 0 }, { text: 'Bien, même si ça peut me surprendre un peu', score: 1 }, { text: 'Mal à l\'aise, j\'ai envie de rendre la pareille rapidement', score: 2 }, { text: 'Très inconfortable, comme si je ne le méritais pas ou que ça créait une dette', score: 3 }] },
      { text: 'Si tu devais résumer ton enfance en une phrase, ce serait plutôt...', options: [{ text: 'J\'ai eu le droit d\'être un enfant, insouciant(e) et léger(ère)', score: 0 }, { text: 'J\'ai grandi normalement, avec mes hauts et mes bas', score: 1 }, { text: 'J\'ai grandi vite, en gardant beaucoup pour moi', score: 2 }, { text: 'J\'ai été un petit adulte avant l\'heure, sur qui la famille comptait', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '😊', title: 'L\'enfant qui a pu être un enfant', message: 'Tu as visiblement grandi dans un climat où tu n\'as pas eu besoin de jouer un rôle précis pour que la famille tienne debout — tu as pu être simplement un enfant. Ce n\'est pas rien : beaucoup n\'ont pas eu cette chance, et cela t\'a probablement donné une base de sécurité intérieure solide. Continue à cultiver cette liberté d\'être toi-même.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🙂', title: 'L\'enfant sage', message: 'Tu as sans doute appris, par petites touches, à être "facile" — celui ou celle qui ne fait pas de vagues, qui s\'adapte, qui sent quand il vaut mieux ne pas trop en demander. Aujourd\'hui, ça peut se traduire par une petite difficulté à affirmer tes besoins. La bonne nouvelle, c\'est que ce pli reste souple.', color: 'text-sky-400', glowColor: '#38bdf8' },
      { min: 40, max: 60, emoji: '🕊️', title: 'Le médiateur, la médiatrice', message: 'Tout indique que tu as grandi en apprenant à sentir les tensions avant qu\'elles n\'éclatent, et à faire en sorte que tout le monde s\'entende. Aujourd\'hui, ce réflexe peut te coûter cher : peur du conflit, tendance à t\'effacer pour préserver la paix. Ce rôle t\'a bien servi hier — tu as le droit d\'apprendre que le désaccord ne détruit pas les liens.', color: 'text-amber-400', glowColor: '#f59e0b' },
      { min: 60, max: 80, emoji: '🦸', title: 'Le petit héros, la petite héroïne', message: 'Il semble que tu aies très tôt porté une part de responsabilité qui dépassait ton âge — réconforter un parent, veiller sur un frère ou une sœur. C\'est le profil de l\'enfant parentifié : compétent, fiable, rassurant bien avant l\'heure. Aujourd\'hui, cela peut se traduire par une hyper-indépendance ou une difficulté à recevoir de l\'aide. Ce rôle peut aujourd\'hui être assoupli, pour apprendre aussi à être porté(e).', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 80, max: 101, emoji: '👑', title: 'Le petit adulte', message: 'Ton parcours suggère que tu as dû, très jeune, devenir une sorte de pilier familial — porter les inquiétudes des adultes, gérer le climat émotionnel de la maison. Ce n\'était ni ton choix ni ta faute, mais une adaptation brillante à une situation qui te dépassait. Ce que tu as appris à faire si jeune, tu peux aussi apprendre à le déposer, petit à petit.', color: 'text-rose-400', glowColor: '#fb7185' },
    ],
  },
  {
    slug: 'amoureux',
    title: 'Ce que tu ressens, c\'est vraiment de l\'amour ?',
    subtitle: 'La différence entre l\'amour vrai et l\'illusion',
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
    title: 'Tes amis seraient-ils là si tu avais vraiment besoin d\'eux ?',
    subtitle: 'Ce que les vrais amis font vraiment',
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
  // ─── QUIZ : INTELLIGENCE ÉMOTIONNELLE ─────────────────────────────────────
  {
    slug: 'intelligence-emotionnelle',
    title: 'Quel est ton niveau d\'intelligence émotionnelle ?',
    subtitle: 'Découvre comment tu gères tes émotions, celles des autres, et tes relations — d\'après le modèle de référence en psychologie',
    description: 'Un test complet en 30 questions basé sur les 5 piliers de l\'intelligence émotionnelle définis par le psychologue Daniel Goleman.',
    emoji: '🧠',
    gradientFrom: 'from-sky-950/80',
    gradientTo: 'to-indigo-950/80',
    borderColor: 'border-sky-800/30',
    accentColor: '#6366f1',
    questions: [
      { text: 'Pendant une réunion tendue, tu sens une boule au ventre monter. Sur le moment, tu…', options: [{ text: 'Tu ne remarques rien de spécial, tu continues comme si de rien n\'était', score: 0 }, { text: 'Tu sens que "quelque chose ne va pas" mais tu ne saurais pas dire quoi', score: 1 }, { text: 'Tu identifies que tu es stressé, sans plus de précision', score: 2 }, { text: 'Tu identifies précisément l\'émotion (frustration, injustice…) et ce qui l\'a déclenchée', score: 3 }] },
      { text: 'Après une dispute avec un proche, quand tu essaies de comprendre ce que tu as ressenti, tu…', options: [{ text: 'Tu dis juste que "c\'était nul" sans pouvoir en dire plus', score: 0 }, { text: 'Tu sais que tu étais "énervé", rien de plus fin', score: 1 }, { text: 'Tu distingues par exemple la colère de la déception', score: 2 }, { text: 'Tu identifies plusieurs émotions superposées et leur origine', score: 3 }] },
      { text: 'Avant de prendre une décision importante (changer de poste, rompre, déménager), tu…', options: [{ text: 'Tu décides sans vraiment te demander ce que tu ressens, seulement ce qui est "logique"', score: 0 }, { text: 'Tu remarques une intuition, mais tu la mets de côté', score: 1 }, { text: 'Tu prends un moment pour identifier ce que tu ressens, en plus des faits', score: 2 }, { text: 'Tu écoutes à la fois tes émotions et la raison, et tu cherches d\'où vient chaque ressenti avant de trancher', score: 3 }] },
      { text: 'Un ami proche te demande "comment tu vas vraiment, sans le masque ?" Ta première réaction intérieure est…', options: [{ text: 'Tu es un peu perdu, tu ne sais pas trop comment répondre à ça', score: 0 }, { text: 'Tu réponds par une formule toute faite sans creuser', score: 1 }, { text: 'Tu prends une seconde pour sentir ce qui se passe en toi et tu donnes une réponse assez juste', score: 2 }, { text: 'Tu sais immédiatement nommer ce que tu ressens et pourquoi, même si c\'est inconfortable', score: 3 }] },
      { text: 'Tu remarques que tu es irritable depuis plusieurs jours sans raison évidente. Tu…', options: [{ text: 'Tu n\'y prêtes pas vraiment attention, "c\'est comme ça"', score: 0 }, { text: 'Tu le remarques mais tu penses que ça va passer tout seul', score: 1 }, { text: 'Tu te demandes ce qui a pu déclencher ça récemment', score: 2 }, { text: 'Tu identifies la cause profonde et tu ajustes en conséquence', score: 3 }] },
      { text: 'Quand tu relis un message que tu as écrit sous le coup de l\'émotion, tu…', options: [{ text: 'Tu ne relis jamais avant d\'envoyer', score: 0 }, { text: 'Tu relis pour la forme, sans remettre en question le fond', score: 1 }, { text: 'Tu réalises après coup que le ton trahissait une émotion que tu n\'avais pas identifiée sur le moment', score: 2 }, { text: 'Tu reconnais en le relisant l\'émotion précise qui a guidé chaque mot', score: 3 }] },
      { text: 'Un collègue te coupe la parole pour la troisième fois en réunion. Ta réaction…', options: [{ text: 'Tu hausses le ton pour reprendre la main, agacé', score: 0 }, { text: 'Tu te braques intérieurement et tu décroches de la discussion', score: 1 }, { text: 'Tu prends une respiration et tu attends la fin pour reprendre calmement', score: 2 }, { text: 'Tu nommes calmement la situation sans agressivité ni retrait', score: 3 }] },
      { text: 'Tu reçois un mail cinglant de ton manager juste avant un rendez-vous important. Tu…', options: [{ text: 'Tu répliques immédiatement, sous le coup de la colère', score: 0 }, { text: 'Tu rumines pendant tout le rendez-vous suivant, distrait', score: 1 }, { text: 'Tu mets le mail de côté mentalement pour rester concentré, puis tu y reviens plus tard', score: 2 }, { text: 'Tu prends deux minutes pour te recentrer et tu abordes ton rendez-vous pleinement présent', score: 3 }] },
      { text: 'Quelqu\'un te critique publiquement, de façon un peu injuste. Sur l\'instant, tu…', options: [{ text: 'Tu réponds sèchement, pour remettre les choses à leur place tout de suite', score: 0 }, { text: 'Tu encaisses en silence mais tu es tendu pour le reste de la journée', score: 1 }, { text: 'Tu restes calme sur le moment et tu en reparles en privé un peu plus tard', score: 2 }, { text: 'Tu restes posé, tu poses une question pour comprendre son point de vue, puis tu clarifies calmement', score: 3 }] },
      { text: 'Un projet sur lequel tu as beaucoup investi est annulé du jour au lendemain. Ta première réaction…', options: [{ text: 'Tu exploses de frustration devant l\'équipe', score: 0 }, { text: 'Tu te renfermes et tu deviens distant plusieurs jours', score: 1 }, { text: 'Tu es déçu mais tu arrives à continuer ta journée sans que ça déborde trop', score: 2 }, { text: 'Tu laisses la déception s\'exprimer un instant, puis tu te reconcentres sur ce que tu peux contrôler', score: 3 }] },
      { text: 'Tu es épuisé et sous pression, et un proche te demande un service de dernière minute. Tu…', options: [{ text: 'Tu refuses sèchement, à bout de nerfs', score: 0 }, { text: 'Tu acceptes en soupirant, avec une pointe de ressentiment visible', score: 1 }, { text: 'Tu prends une seconde avant de répondre honnêtement sur ta disponibilité', score: 2 }, { text: 'Tu exprimes calmement ta limite du moment, sans culpabiliser ni agresser', score: 3 }] },
      { text: 'Tu es sur le point d\'envoyer un message important quand une pensée impulsive te traverse. Tu…', options: [{ text: 'Tu l\'envoies immédiatement, sans réfléchir', score: 0 }, { text: 'Tu hésites mais tu l\'envoies quand même, un peu vite', score: 1 }, { text: 'Tu attends quelques minutes avant d\'envoyer, pour être sûr', score: 2 }, { text: 'Tu laisses volontairement passer un délai avant de répondre à froid', score: 3 }] },
      { text: 'Un projet auquel tu croyais échoue complètement après des mois de travail. Quelques semaines plus tard, tu…', options: [{ text: 'Tu as perdu toute envie de te relancer sur quelque chose de similaire', score: 0 }, { text: 'Tu retentes, mais avec beaucoup moins d\'enthousiasme et de confiance', score: 1 }, { text: 'Tu identifies ce qui a raté et tu retentes une approche différente', score: 2 }, { text: 'Tu vois l\'échec comme une information utile et tu repars avec une motivation intacte', score: 3 }] },
      { text: 'Tu vises un objectif à long terme mais les résultats tardent à venir. Tu…', options: [{ text: 'Tu abandonnes assez vite si les résultats ne sont pas rapides', score: 0 }, { text: 'Tu continues par obligation, sans grand enthousiasme', score: 1 }, { text: 'Tu gardes le cap la plupart du temps, avec des baisses de motivation ponctuelles', score: 2 }, { text: 'Tu restes engagé sur la durée en te reconnectant régulièrement à ce qui donne du sens à cet objectif', score: 3 }] },
      { text: 'Face à une tâche difficile et peu gratifiante mais nécessaire, tu…', options: [{ text: 'Tu la repousses systématiquement tant que tu peux', score: 0 }, { text: 'Tu la fais à contrecœur, au dernier moment', score: 1 }, { text: 'Tu t\'y mets sans plaisir particulier mais tu la termines correctement', score: 2 }, { text: 'Tu trouves un moyen de lui donner du sens pour t\'y engager pleinement', score: 3 }] },
      { text: 'Quand tu reçois un retour négatif sur ton travail, ta réaction dans les jours qui suivent…', options: [{ text: 'Tu restes démotivé longtemps, ça t\'atteint profondément', score: 0 }, { text: 'Tu es down un moment puis tu passes à autre chose sans vraiment en tirer de leçon', score: 1 }, { text: 'Tu es déçu mais tu regardes assez vite ce que tu peux améliorer', score: 2 }, { text: 'Tu accueilles le retour comme une opportunité de progresser et tu l\'utilises concrètement', score: 3 }] },
      { text: 'Le matin d\'une journée qui s\'annonce difficile, ton état d\'esprit est plutôt…', options: [{ text: 'Tu redoutes la journée avant même qu\'elle commence', score: 0 }, { text: 'Tu es résigné, tu subis la journée sans trop y croire', score: 1 }, { text: 'Tu restes globalement optimiste malgré l\'appréhension', score: 2 }, { text: 'Tu abordes la journée avec la conviction que tu peux influencer positivement la façon dont elle se passe', score: 3 }] },
      { text: 'Tu compares parfois ta progression à celle d\'autres personnes de ton âge. Cela te…', options: [{ text: 'Décourage souvent et te donne l\'impression d\'être en retard', score: 0 }, { text: 'Met une pression qui nuit plus qu\'elle ne t\'aide', score: 1 }, { text: 'Stimule un peu, sans trop t\'affecter', score: 2 }, { text: 'Sert surtout d\'inspiration, ta vraie mesure du progrès restant ton propre chemin', score: 3 }] },
      { text: 'Un collègue te répond de façon sèche alors que d\'habitude il est chaleureux. Tu…', options: [{ text: 'Tu ne remarques pas vraiment de différence', score: 0 }, { text: 'Tu remarques que le ton a changé mais tu passes à autre chose', score: 1 }, { text: 'Tu te demandes s\'il traverse quelque chose de difficile en ce moment', score: 2 }, { text: 'Tu perçois le changement, tu en identifies probablement la cause, et tu ajustes ta façon de lui parler', score: 3 }] },
      { text: 'Un proche te raconte un problème sans te demander explicitement conseil. Tu…', options: [{ text: 'Tu lui donnes tout de suite ta solution, pensant l\'aider', score: 0 }, { text: 'Tu l\'écoutes, mais surtout en attendant ton tour de parler de toi', score: 1 }, { text: 'Tu l\'écoutes attentivement et tu poses quelques questions', score: 2 }, { text: 'Tu sens qu\'il a surtout besoin d\'être entendu, et tu ajustes ton écoute avant de proposer quoi que ce soit', score: 3 }] },
      { text: 'Pendant une réunion, tu sens une tension silencieuse entre deux collègues, sans qu\'aucun mot ne soit dit. Tu…', options: [{ text: 'Tu ne le perçois pas du tout, tout te semble normal', score: 0 }, { text: 'Tu sens une ambiance bizarre mais tu ne saurais pas dire pourquoi', score: 1 }, { text: 'Tu identifies qu\'il y a une tension entre ces deux personnes précisément', score: 2 }, { text: 'Tu perçois la tension, en devines probablement la cause, et tu adaptes ta façon d\'animer l\'échange', score: 3 }] },
      { text: 'Quelqu\'un te partage une bonne nouvelle importante pour lui, mais qui te touche personnellement de façon compliquée. Tu…', options: [{ text: 'Tu minimises sa nouvelle ou tu changes vite de sujet', score: 0 }, { text: 'Tu le félicites poliment mais sans réelle sincérité', score: 1 }, { text: 'Tu arrives à te réjouir sincèrement pour lui malgré ton inconfort', score: 2 }, { text: 'Tu ressens sa joie avec lui, tout en accueillant séparément ton propre inconfort sans que cela n\'entache ton soutien', score: 3 }] },
      { text: 'Dans un désaccord, tu remarques que l\'autre personne campe sur sa position de façon inhabituelle. Tu…', options: [{ text: 'Tu penses juste qu\'elle est têtue ou de mauvaise foi', score: 0 }, { text: 'Tu insistes sur tes arguments sans chercher à comprendre son point de vue', score: 1 }, { text: 'Tu te demandes ce qui pourrait expliquer sa réaction si rigide', score: 2 }, { text: 'Tu cherches activement ce qu\'il y a derrière avant de continuer le débat', score: 3 }] },
      { text: 'Un membre de ton équipe semble en difficulté mais ne dit rien. Tu…', options: [{ text: 'Tu attends qu\'il vienne t\'en parler de lui-même', score: 0 }, { text: 'Tu remarques que quelque chose cloche, sans plus', score: 1 }, { text: 'Tu prends de ses nouvelles directement, de façon générale', score: 2 }, { text: 'Tu crées un espace pour qu\'il puisse s\'exprimer, en posant des questions précises et bienveillantes', score: 3 }] },
      { text: 'Un désaccord éclate en réunion entre deux points de vue opposés dans ton équipe. Tu…', options: [{ text: 'Tu restes en retrait, en espérant que ça se règle sans toi', score: 0 }, { text: 'Tu prends parti pour l\'un des deux camps assez vite', score: 1 }, { text: 'Tu essaies de calmer le jeu en changeant de sujet', score: 2 }, { text: 'Tu aides les deux parties à clarifier leurs besoins respectifs et à trouver un terrain d\'entente concret', score: 3 }] },
      { text: 'Tu dois annoncer une décision impopulaire à ton équipe ou à tes proches. Tu…', options: [{ text: 'Tu évites d\'en parler le plus longtemps possible', score: 0 }, { text: 'Tu l\'annonces brutalement, sans préparer le terrain', score: 1 }, { text: 'Tu prépares ce que tu vas dire, avec quelques précautions', score: 2 }, { text: 'Tu anticipes les réactions probables, choisis le bon moment et restes disponible pour les questions', score: 3 }] },
      { text: 'Tu veux convaincre quelqu\'un d\'un point de vue différent du sien. Ta stratégie est plutôt de…', options: [{ text: 'Répéter ton argument plus fort jusqu\'à ce qu\'il cède', score: 0 }, { text: 'Insister sur les faits qui te donnent raison', score: 1 }, { text: 'Essayer de comprendre son point de vue avant d\'exposer le tien', score: 2 }, { text: 'Partir de ce qui compte pour lui, relier ton point de vue à ses propres priorités, et construire l\'accord ensemble', score: 3 }] },
      { text: 'Dans ton cercle proche ou professionnel, quand un conflit larvé s\'installe entre deux personnes que tu connais, tu…', options: [{ text: 'Tu évites soigneusement le sujet et les deux personnes concernées', score: 0 }, { text: 'Tu prends parti pour l\'une d\'elles sans chercher plus loin', score: 1 }, { text: 'Tu écoutes chacune séparément si l\'occasion se présente', score: 2 }, { text: 'Tu crées, si c\'est ta place, un espace pour que les deux puissent s\'exprimer et avancer vers une solution', score: 3 }] },
      { text: 'On te confie un rôle de coordination sur un projet avec des personnalités très différentes. Tu…', options: [{ text: 'Tu appliques la même méthode avec tout le monde, sans distinction', score: 0 }, { text: 'Tu t\'adaptes un minimum, mais surtout par instinct', score: 1 }, { text: 'Tu ajustes ta communication selon les personnes, de façon assez naturelle', score: 2 }, { text: 'Tu identifies consciemment ce qui motive et ce qui rassure chaque personne, et tu adaptes ton style pour créer une vraie cohésion', score: 3 }] },
      { text: 'Après un différend avec quelqu\'un d\'important pour toi, pour renouer le contact, tu…', options: [{ text: 'Tu attends que l\'autre fasse le premier pas', score: 0 }, { text: 'Tu fais comme si rien ne s\'était passé, sans en reparler', score: 1 }, { text: 'Tu fais un geste vers l\'autre, sans forcément aborder le fond du problème', score: 2 }, { text: 'Tu prends l\'initiative d\'une conversation honnête, en reconnaissant ta part et en cherchant à réparer la relation', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '🌱', title: 'En développement', message: 'Tu es souvent submergé par tes émotions, ou celles des autres, avant même d\'avoir eu le temps de les comprendre — et c\'est un point de départ totalement normal, pas un verdict. L\'intelligence émotionnelle se muscle comme n\'importe quelle compétence. Ta priorité : apprendre à nommer précisément ce que tu ressens au moment même où ça arrive.', color: 'text-slate-400', glowColor: '#94a3b8' },
      { min: 20, max: 40, emoji: '🌤️', title: 'En construction', message: 'Tu perçois déjà pas mal de choses chez toi et chez les autres, mais tes réactions prennent parfois le dessus avant que tu aies pu les canaliser. Certains réflexes commencent à s\'installer. Le prochain palier consiste à travailler la pause entre ce que tu ressens et ce que tu fais — cette fraction de seconde qui change tout sous pression.', color: 'text-sky-400', glowColor: '#38bdf8' },
      { min: 40, max: 60, emoji: '⚖️', title: 'En équilibre', message: 'Tu as une intelligence émotionnelle globalement équilibrée : tu sais souvent ce que tu ressens et tu arrives, la plupart du temps, à ne pas te laisser déborder. Certains contextes (le stress, la fatigue, les enjeux relationnels forts) font encore chuter ta régulation ou ton empathie. Continue à observer tes schémas dans ces moments précis.', color: 'text-teal-400', glowColor: '#2dd4bf' },
      { min: 60, max: 80, emoji: '💡', title: 'Solide intelligence émotionnelle', message: 'Tu as une intelligence émotionnelle solide : tu identifies bien tes émotions, tu sais généralement les canaliser, et les autres se sentent souvent compris en ta présence. Travaille en particulier ta capacité à rester pleinement toi-même quand les enjeux sont élevés, pas seulement quand tout va bien.', color: 'text-violet-400', glowColor: '#a78bfa' },
      { min: 80, max: 101, emoji: '✨', title: 'Intelligence émotionnelle remarquable', message: 'Tu affiches une intelligence émotionnelle remarquable : tu te connais bien, tu régules tes réactions avec finesse, tu restes motivé face aux obstacles, tu lis les autres avec justesse et tu navigues les relations avec aisance. Le prochain niveau pour toi n\'est plus d\'acquérir ces compétences mais de les transmettre.', color: 'text-amber-400', glowColor: '#fbbf24' },
    ],
  },
  // ─── QUIZ 6 : NARCISSIQUE ─────────────────────────────────────────────────
  {
    slug: 'narcissique',
    title: 'Les gens t\'évitent-ils sans que tu saches pourquoi ?',
    subtitle: 'Ce que tes comportements disent vraiment de toi',
    description: '30 questions pour évaluer si tu présentes des traits narcissiques dans tes relations.',
    emoji: '🪞',
    gradientFrom: 'from-amber-950/80',
    gradientTo: 'to-yellow-950/80',
    borderColor: 'border-amber-800/30',
    accentColor: '#f59e0b',
    questions: [
      { text: 'As-tu tendance à penser que tu es meilleur(e) que la plupart des gens dans ce que tu fais ?', options: [{ text: 'Non, je me compare peu aux autres', score: 0 }, { text: 'Parfois dans certains domaines', score: 1 }, { text: 'Souvent, je sais que j\'excelle', score: 2 }, { text: 'Oui, je suis clairement supérieur(e) à la majorité', score: 3 }] },
      { text: 'Quand quelqu\'un te critique, quelle est ta réaction habituelle ?', options: [{ text: 'J\'essaie de comprendre si la critique est fondée', score: 0 }, { text: 'Légèrement blessé(e) mais j\'y réfléchis', score: 1 }, { text: 'Je me défends fermement et je réfute', score: 2 }, { text: 'Je ressens une colère intense et je cherche à humilier la personne', score: 3 }] },
      { text: 'Est-ce que tu as souvent l\'impression que les autres ne comprennent pas ta valeur ?', options: [{ text: 'Non, je me sens généralement reconnu(e)', score: 0 }, { text: 'Parfois dans certaines situations', score: 1 }, { text: 'Souvent, les gens sous-estiment mes capacités', score: 2 }, { text: 'Toujours, personne n\'est vraiment à ma hauteur', score: 3 }] },
      { text: 'Dans une conversation, combien de temps passes-tu à écouter l\'autre versus parler de toi ?', options: [{ text: 'J\'écoute au moins autant que je parle', score: 0 }, { text: 'Peut-être un peu plus sur moi parfois', score: 1 }, { text: 'Je ramène souvent le sujet à moi', score: 2 }, { text: 'Les conversations tournent presque toujours autour de moi', score: 3 }] },
      { text: 'Est-ce que tu as besoin que les autres t\'admirent ou te complimentent régulièrement ?', options: [{ text: 'Non, les compliments sont agréables mais non nécessaires', score: 0 }, { text: 'Appréciable mais pas indispensable', score: 1 }, { text: 'Oui, j\'aime être reconnu(e) et l\'absence me dérange', score: 2 }, { text: 'Oui, j\'en ai vraiment besoin pour me sentir bien', score: 3 }] },
      { text: 'Quand un ami vit un succès, quelle est ta réaction sincère ?', options: [{ text: 'Je suis sincèrement heureux/heureuse pour lui/elle', score: 0 }, { text: 'Content(e) pour lui/elle, mais j\'espère aussi briller', score: 1 }, { text: 'Je ressens parfois de la jalousie ou de la compétition', score: 2 }, { text: 'Son succès m\'agace, je veux être le/la meilleur(e)', score: 3 }] },
      { text: 'Est-ce que tu as tendance à utiliser les relations pour avancer dans tes objectifs ?', options: [{ text: 'Non, mes relations sont basées sur l\'affect sincère', score: 0 }, { text: 'Parfois les deux se rejoignent naturellement', score: 1 }, { text: 'J\'avoue que j\'évalue parfois l\'utilité d\'une relation', score: 2 }, { text: 'Oui, les personnes "utiles" ont ma priorité', score: 3 }] },
      { text: 'Est-ce que tu te fâches facilement quand les choses ne se passent pas comme tu le veux ?', options: [{ text: 'Je m\'adapte facilement', score: 0 }, { text: 'Un peu frustré(e) mais ça passe', score: 1 }, { text: 'Oui, j\'ai du mal à accepter de ne pas obtenir ce que je veux', score: 2 }, { text: 'Je réagis fortement, parfois de façon disproportionnée', score: 3 }] },
      { text: 'Ressens-tu de l\'empathie quand quelqu\'un est en détresse devant toi ?', options: [{ text: 'Oui, je me sens touché(e) par la douleur des autres', score: 0 }, { text: 'Généralement oui, selon les situations', score: 1 }, { text: 'Parfois, mais ça me coûte et je préfère changer de sujet', score: 2 }, { text: 'Rarement, je trouve ça difficile à comprendre ou à ressentir', score: 3 }] },
      { text: 'Penses-tu avoir droit à des privilèges ou à un traitement spécial ?', options: [{ text: 'Non, je m\'attends aux mêmes règles que tout le monde', score: 0 }, { text: 'Parfois dans des contextes où j\'ai plus d\'expertise', score: 1 }, { text: 'Souvent, je mérite mieux que la moyenne', score: 2 }, { text: 'Oui, les règles ordinaires ne me s\'appliquent pas vraiment', score: 3 }] },
      { text: 'Arrives-tu à reconnaître facilement tes torts dans un conflit ?', options: [{ text: 'Oui, je peux m\'excuser quand j\'ai tort', score: 0 }, { text: 'Avec du temps, généralement oui', score: 1 }, { text: 'J\'ai beaucoup de mal à admettre mes erreurs', score: 2 }, { text: 'Rarement, ce sont presque toujours les autres qui ont tort', score: 3 }] },
      { text: 'Est-ce que tu utilises la culpabilisation ou la manipulation pour obtenir ce que tu veux ?', options: [{ text: 'Non, je communique directement', score: 0 }, { text: 'Peut-être inconsciemment parfois', score: 1 }, { text: 'Je reconnais que j\'use de stratégies pour influencer', score: 2 }, { text: 'Oui, si ça marche, je l\'utilise sans hésiter', score: 3 }] },
      { text: 'Est-ce que tu fantasmes souvent sur ton succès futur, ta célébrité ou ton pouvoir ?', options: [{ text: 'Non, je vis plutôt dans le présent', score: 0 }, { text: 'De temps en temps comme tout le monde', score: 1 }, { text: 'Souvent, j\'imagine un avenir brillant', score: 2 }, { text: 'Très souvent, je me vois comme quelqu\'un de destiné à la grandeur', score: 3 }] },
      { text: 'Est-ce que tu te sens facilement supérieur(e) aux personnes qui ont moins réussi que toi ?', options: [{ text: 'Non, je ne juge pas les gens sur leur succès', score: 0 }, { text: 'Parfois une légère fierté de ma position', score: 1 }, { text: 'Souvent, je compare et me sens au-dessus', score: 2 }, { text: 'Oui, les gens ordinaires me semblent clairement inférieurs', score: 3 }] },
      { text: 'Est-ce que tu as du mal à maintenir des amitiés profondes et durables ?', options: [{ text: 'Non, j\'ai des amis de longue date', score: 0 }, { text: 'Quelques relations durables mais pas beaucoup', score: 1 }, { text: 'Les relations profondes me semblent difficiles à entretenir', score: 2 }, { text: 'Oui, la plupart des relations finissent quand je n\'en tire plus rien', score: 3 }] },
      { text: 'Est-ce que tu aimes dominer les conversations ou les groupes ?', options: [{ text: 'Non, je laisse la parole aux autres facilement', score: 0 }, { text: 'Parfois quand je suis passionné(e)', score: 1 }, { text: 'Souvent, j\'aime être le centre d\'attention', score: 2 }, { text: 'Toujours, je me sens mal à l\'aise quand je ne suis pas le foyer', score: 3 }] },
      { text: 'Arrives-tu à demander pardon sincèrement quand tu as blessé quelqu\'un ?', options: [{ text: 'Oui, m\'excuser sincèrement m\'est naturel', score: 0 }, { text: 'Avec difficulté mais j\'y arrive', score: 1 }, { text: 'Rarement, sauf si j\'y suis vraiment obligé(e)', score: 2 }, { text: 'Non, s\'excuser me semble une forme de faiblesse', score: 3 }] },
      { text: 'Est-ce que tu as l\'habitude d\'exagérer tes réalisations pour impressionner les autres ?', options: [{ text: 'Non, je reste honnête sur mes succès', score: 0 }, { text: 'Peut-être un peu d\'enthousiasme parfois', score: 1 }, { text: 'Souvent, j\'embellis un peu pour paraître plus impressionnant(e)', score: 2 }, { text: 'Oui, l\'image que je projette importe plus que la réalité', score: 3 }] },
      { text: 'Est-ce que les critiques ou l\'indifférence des autres t\'affectent profondément ?', options: [{ text: 'Pas vraiment, j\'ai confiance en moi indépendamment', score: 0 }, { text: 'Légèrement, comme tout le monde', score: 1 }, { text: 'Oui, le rejet ou les critiques me blessent très fort', score: 2 }, { text: 'Enormément, et ça peut déclencher une colère ou une dépression', score: 3 }] },
      { text: 'Est-ce que tu penses que les règles sociales s\'appliquent moins à toi qu\'aux autres ?', options: [{ text: 'Non, les règles existent pour tout le monde', score: 0 }, { text: 'Dans certaines situations exceptionnelles peut-être', score: 1 }, { text: 'Souvent je trouve les règles trop contraignantes pour moi', score: 2 }, { text: 'Oui, je suis différent(e) et les règles ordinaires ne me concernent pas', score: 3 }] },
      { text: 'Est-ce que tu trouves normal d\'attendre que les autres s\'adaptent à toi plutôt que l\'inverse ?', options: [{ text: 'Non, l\'adaptation est réciproque', score: 0 }, { text: 'Parfois selon les situations', score: 1 }, { text: 'Souvent, les autres doivent composer avec mes besoins', score: 2 }, { text: 'Oui, les autres ont naturellement à s\'ajuster à moi', score: 3 }] },
      { text: 'Est-ce que tu blâmes facilement les autres quand quelque chose tourne mal ?', options: [{ text: 'Non, j\'analyse objectivement et reconnais ma part', score: 0 }, { text: 'Parfois, mais j\'y reviens ensuite', score: 1 }, { text: 'Souvent, le problème vient rarement de moi', score: 2 }, { text: 'Toujours, mes erreurs ont toujours une explication externe', score: 3 }] },
      { text: 'Est-ce que tu aides les autres sans attendre quelque chose en retour ?', options: [{ text: 'Oui, j\'aime aider sincèrement', score: 0 }, { text: 'Généralement, avec un peu de satisfaction personnelle', score: 1 }, { text: 'Rarement, j\'attends une forme de réciprocité ou de reconnaissance', score: 2 }, { text: 'Non, si ça ne me profite pas, je n\'aide pas', score: 3 }] },
      { text: 'Tes proches te décrivent-ils parfois comme "égoïste" ou "centré(e) sur toi-même" ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Une ou deux fois dans des contextes spécifiques', score: 1 }, { text: 'Plusieurs fois, et ça m\'a surpris(e)', score: 2 }, { text: 'Régulièrement, c\'est une critique récurrente', score: 3 }] },
      { text: 'Est-ce que tu penses sincèrement que tu mérites plus que ce que tu as actuellement ?', options: [{ text: 'Non, je suis reconnaissant(e) de ce que j\'ai', score: 0 }, { text: 'Parfois en pensant à l\'avenir', score: 1 }, { text: 'Souvent, mes efforts méritent mieux', score: 2 }, { text: 'Oui, je suis clairement en dessous de ce que je mérite', score: 3 }] },
      { text: 'Quand tu aides quelqu\'un, est-ce que tu t\'assures qu\'il le sait et t\'en soit reconnaissant ?', options: [{ text: 'Non, j\'aide discrètement', score: 0 }, { text: 'Parfois, j\'aime qu\'on remarque', score: 1 }, { text: 'Souvent, la reconnaissance est importante pour moi', score: 2 }, { text: 'Toujours, aider sans reconnaissance n\'a aucun intérêt', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '😊', title: 'Empathie saine', message: 'Tu présentes peu ou pas de traits narcissiques. Tu sembles avoir une bonne conscience de toi-même et une empathie sincère pour les autres. Continue à cultiver ces qualités relationnelles.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🤔', title: 'Quelques traits prononcés', message: 'Tu as quelques tendances à te mettre en avant, ce qui est humain. Cependant, certaines réponses suggèrent des zones où travailler ton empathie et ton écoute des autres.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Tendances narcissiques', message: 'Plusieurs traits narcissiques émergent dans tes réponses. Ces schémas peuvent impacter tes relations. Une réflexion honnête sur ton rapport aux autres serait bénéfique.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Narcissisme probable', message: 'Tes réponses indiquent un niveau élevé de traits narcissiques. Ces comportements peuvent blesser ton entourage et nuire à tes relations. Un accompagnement professionnel pourrait t\'aider.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '💥', title: 'Personnalité narcissique', message: 'Tes réponses correspondent fortement à un profil de personnalité narcissique. Ce n\'est pas un jugement : c\'est une réalité qui peut se travailler avec un professionnel de santé mentale.', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
  // ─── QUIZ 7 : MON EX ──────────────────────────────────────────────────────
  // ─── QUIZ : TOURNER LA PAGE ───────────────────────────────────────────────
  {
    slug: 'tourner-la-page',
    title: 'As-tu vraiment tourné la page ?',
    subtitle: 'Ce que ton corps, ton sommeil et tes pensées disent de ton deuil amoureux',
    description: '30 questions pour comprendre où tu en es vraiment dans ton processus de deuil après une rupture, entre rumination, nostalgie et reconstruction de toi-même.',
    emoji: '💔',
    gradientFrom: 'from-rose-950/80',
    gradientTo: 'to-violet-950/80',
    borderColor: 'border-rose-800/30',
    accentColor: '#fb7185',
    questions: [
      { text: 'À quelle fréquence penses-tu encore à cette relation dans une journée normale ?', options: [{ text: 'Rarement, ça ne traverse mon esprit que de temps en temps', score: 0 }, { text: 'Quelques fois par semaine, sans que ça m\'envahisse', score: 1 }, { text: 'Presque tous les jours, ça revient sans que je le veuille', score: 2 }, { text: 'Plusieurs fois par heure, je n\'arrive pas à faire autrement', score: 3 }] },
      { text: 'Quand une pensée pour lui/elle surgit, que se passe-t-il ensuite ?', options: [{ text: 'Elle passe, je reviens vite à ce que je faisais', score: 0 }, { text: 'Je m\'y attarde un peu puis je passe à autre chose', score: 1 }, { text: 'Je pars dans un scénario mental qui dure de longues minutes', score: 2 }, { text: 'Je peux y rester bloqué(e) pendant des heures', score: 3 }] },
      { text: 'Rejoues-tu certaines scènes ou disputes de la relation dans ta tête ?', options: [{ text: 'Jamais, ou alors ça ne me fait plus rien', score: 0 }, { text: 'Rarement, et sans intensité particulière', score: 1 }, { text: 'Souvent, en cherchant ce que j\'aurais dû dire ou faire', score: 2 }, { text: 'Constamment, comme un film qui tourne en boucle', score: 3 }] },
      { text: 'As-tu regardé son profil ou ses réseaux sociaux ces derniers jours ?', options: [{ text: 'Non, je ne les regarde plus du tout', score: 0 }, { text: 'Une fois, presque par hasard', score: 1 }, { text: 'Plusieurs fois, en me disant que c\'est la dernière', score: 2 }, { text: 'Tous les jours, parfois plusieurs fois par jour', score: 3 }] },
      { text: 'Que ressens-tu en tombant sur une photo ou une story de lui/elle ?', options: [{ text: 'Rien de particulier, ou une pointe de nostalgie qui passe vite', score: 0 }, { text: 'Un petit pincement, gérable', score: 1 }, { text: 'Un vrai coup au cœur qui me perturbe pour un moment', score: 2 }, { text: 'Une vague d\'angoisse ou de tristesse qui me gâche la journée', score: 3 }] },
      { text: 'As-tu déjà utilisé un moyen détourné (faux profil, ami(e) qui va voir pour toi) pour savoir ce qu\'il/elle devient ?', options: [{ text: 'Jamais', score: 0 }, { text: 'Une fois, il y a longtemps', score: 1 }, { text: 'Ça m\'est arrivé récemment', score: 2 }, { text: 'Je le fais régulièrement', score: 3 }] },
      { text: 'Quand tu rencontres quelqu\'un de nouveau, que se passe-t-il dans ta tête ?', options: [{ text: 'Je le/la vois pour qui il/elle est, sans comparaison', score: 0 }, { text: 'La comparaison arrive parfois, brièvement', score: 1 }, { text: 'Je compare souvent, presque malgré moi', score: 2 }, { text: 'Je ne peux pas m\'empêcher de tout mesurer à l\'aune de mon ex', score: 3 }] },
      { text: 'Cherches-tu chez les autres des qualités ou des traits qui te rappellent ton ex ?', options: [{ text: 'Non, pas du tout', score: 0 }, { text: 'Peut-être inconsciemment, mais ça ne me définit pas', score: 1 }, { text: 'Oui, je m\'en rends compte et ça m\'inquiète un peu', score: 2 }, { text: 'Oui, clairement, je cherche presque une version améliorée de la même personne', score: 3 }] },
      { text: 'As-tu l\'impression que personne ne sera "aussi bien" que ton ex ?', options: [{ text: 'Non, je crois sincèrement que je peux être heureux/heureuse avec quelqu\'un d\'autre', score: 0 }, { text: 'Parfois j\'en doute, mais globalement non', score: 1 }, { text: 'Cette pensée revient souvent', score: 2 }, { text: 'J\'en suis presque convaincu(e)', score: 3 }] },
      { text: 'Quand tu repenses à la relation, de quoi te souviens-tu en premier ?', options: [{ text: 'Un mélange honnête des bons et des mauvais moments', score: 0 }, { text: 'Plutôt les bons moments, mais je n\'oublie pas le reste', score: 1 }, { text: 'Surtout les bons moments, je minimise ce qui n\'allait pas', score: 2 }, { text: 'Une version quasi parfaite, comme si les problèmes n\'avaient jamais existé', score: 3 }] },
      { text: 'Arrives-tu à te souvenir des raisons concrètes qui ont mené à la rupture ?', options: [{ text: 'Oui, clairement, et je comprends pourquoi c\'était nécessaire', score: 0 }, { text: 'Oui, même si ça reste difficile à accepter', score: 1 }, { text: 'Vaguement, j\'ai tendance à les minimiser', score: 2 }, { text: 'Non, avec le recul je me dis presque que c\'était une erreur de partir', score: 3 }] },
      { text: 'T\'arrive-t-il de romancer des détails, une date, un lieu qui vous étaient chers ?', options: [{ text: 'Non, ces détails ne me touchent plus vraiment', score: 0 }, { text: 'Un peu, sans que ça m\'affecte', score: 1 }, { text: 'Oui, régulièrement, avec un vrai pincement au cœur', score: 2 }, { text: 'Oui, ces dates ou ces lieux sont devenus presque sacrés pour moi', score: 3 }] },
      { text: 'Peux-tu vivre un bon moment (sortie, rire, succès) sans que la relation te retraverse l\'esprit ?', options: [{ text: 'Oui, complètement', score: 0 }, { text: 'Oui, la plupart du temps', score: 1 }, { text: 'Une part de moi y repense encore, avec un peu de culpabilité', score: 2 }, { text: 'Non, j\'ai l\'impression de ne pas avoir le droit d\'être heureux/heureuse', score: 3 }] },
      { text: 'Comment réagis-tu quand tu passes une soirée agréable sans penser à lui/elle ?', options: [{ text: 'Je m\'en réjouis simplement, sans arrière-pensée', score: 0 }, { text: 'Je le remarque avec soulagement', score: 1 }, { text: 'Une pointe de culpabilité surgit, comme si je le/la trahissais', score: 2 }, { text: 'Je culpabilise vraiment, comme si je n\'avais pas le droit d\'avancer', score: 3 }] },
      { text: 'Te sens-tu autorisé(e) à être heureux/heureuse dans ta nouvelle vie, même si cette personne n\'y est plus ?', options: [{ text: 'Oui, sans hésitation', score: 0 }, { text: 'Oui, globalement', score: 1 }, { text: 'Une partie de moi en doute encore', score: 2 }, { text: 'Non, j\'ai l\'impression que mon bonheur serait presque une trahison', score: 3 }] },
      { text: 'Que se passe-t-il dans ton corps quand tu penses fort à cette personne ?', options: [{ text: 'Rien de particulier', score: 0 }, { text: 'Une légère tension, qui passe vite', score: 1 }, { text: 'Le cœur qui s\'accélère, la gorge qui se serre', score: 2 }, { text: 'Des symptômes marqués : boule au ventre, mal de tête, tremblements', score: 3 }] },
      { text: 'Comment réagit ton corps si tu tombes sur lui/elle par surprise, dans la rue ou à un événement ?', options: [{ text: 'Calme, aucune réaction notable', score: 0 }, { text: 'Un petit sursaut, vite passé', score: 1 }, { text: 'Des mains moites, un souffle coupé', score: 2 }, { text: 'Une vraie panique, l\'envie de fuir ou de me figer', score: 3 }] },
      { text: 'As-tu remarqué des tensions physiques (mâchoire serrée, épaules crispées) liées au souvenir de la relation ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Très rarement', score: 1 }, { text: 'De temps en temps, surtout en période de fatigue', score: 2 }, { text: 'Souvent, mon corps semble porter encore cette histoire', score: 3 }] },
      { text: 'Comment parles-tu de ton ex à tes proches aujourd\'hui ?', options: [{ text: 'Avec calme et recul, comme un chapitre refermé', score: 0 }, { text: 'Plutôt sereinement, même si le sujet reste sensible', score: 1 }, { text: 'Avec encore beaucoup d\'émotion ou d\'amertume', score: 2 }, { text: 'Je ne peux pas en parler sans pleurer, m\'énerver ou revenir dessus longuement', score: 3 }] },
      { text: 'Utilises-tu encore "on" ou "nous" en pensant à des projets, même après la rupture ?', options: [{ text: 'Non, jamais, je parle clairement au passé', score: 0 }, { text: 'Ça m\'arrive de loin en loin, sans y penser', score: 1 }, { text: 'Régulièrement, presque sans m\'en rendre compte', score: 2 }, { text: 'Oui, c\'est encore ma façon naturelle de penser à mon avenir', score: 3 }] },
      { text: 'Quand quelqu\'un te demande "comment ça va après la rupture ?", que réponds-tu vraiment ?', options: [{ text: 'Que ça va, sincèrement', score: 0 }, { text: 'Que c\'est encore un peu difficile mais que ça avance', score: 1 }, { text: 'Que c\'est toujours compliqué, en essayant de minimiser', score: 2 }, { text: 'Je n\'arrive pas à répondre sans que tout ressorte', score: 3 }] },
      { text: 'Comment est ton sommeil depuis la rupture ?', options: [{ text: 'Normal, comme avant', score: 0 }, { text: 'Un peu perturbé au début, redevenu normal', score: 1 }, { text: 'Encore irrégulier, des nuits difficiles reviennent', score: 2 }, { text: 'Très perturbé, insomnies fréquentes liées à cette personne', score: 3 }] },
      { text: 'Et ton appétit ou tes habitudes alimentaires ?', options: [{ text: 'Inchangés', score: 0 }, { text: 'Légèrement affectés au début, stabilisés depuis', score: 1 }, { text: 'Encore fluctuants selon les jours', score: 2 }, { text: 'Toujours très perturbés, trop ou pas assez', score: 3 }] },
      { text: 'Ton énergie et ta motivation générale ont-elles retrouvé leur niveau d\'avant ?', options: [{ text: 'Oui, complètement', score: 0 }, { text: 'Presque complètement', score: 1 }, { text: 'Partiellement, il y a des jours plus creux', score: 2 }, { text: 'Non, je me sens encore à plat une bonne partie du temps', score: 3 }] },
      { text: 'Où en es-tu avec l\'idée de rencontrer quelqu\'un de nouveau ?', options: [{ text: 'J\'y suis ouvert(e) et ça ne m\'angoisse pas', score: 0 }, { text: 'J\'y pense sereinement, à mon rythme', score: 1 }, { text: 'L\'idée m\'angoisse ou me semble encore prématurée', score: 2 }, { text: 'Je n\'y arrive pas, ou je le fais sans y croire vraiment', score: 3 }] },
      { text: 'Si tu sors avec quelqu\'un ou envisages un date, que se passe-t-il ?', options: [{ text: 'Je suis présent(e) et curieux/curieuse, sans arrière-pensée', score: 0 }, { text: 'Un peu de nervosité normale, rien de plus', score: 1 }, { text: 'Je me surprends à chercher les défauts par rapport à mon ex', score: 2 }, { text: 'Je me sens coupable ou je sabote la rencontre sans le vouloir', score: 3 }] },
      { text: 'As-tu remarqué des schémas qui se répètent quand tu essaies de tourner la page (fuite, précipitation, évitement) ?', options: [{ text: 'Non, je me sens libre dans mes choix', score: 0 }, { text: 'Un peu, mais je les identifie et les gère', score: 1 }, { text: 'Oui, je me reconnais dans des schémas que j\'ai du mal à changer', score: 2 }, { text: 'Oui, et ils m\'empêchent clairement d\'avancer', score: 3 }] },
      { text: 'Qu\'as-tu appris sur toi-même depuis cette rupture ?', options: [{ text: 'Beaucoup de choses claires, que je peux nommer facilement', score: 0 }, { text: 'Quelques leçons, encore en train de se préciser', score: 1 }, { text: 'Je sais que j\'ai changé mais je n\'arrive pas encore à mettre des mots dessus', score: 2 }, { text: 'Rien pour l\'instant, je suis encore trop pris(e) dans la douleur', score: 3 }] },
      { text: 'Sens-tu que cette expérience t\'a rendu(e) plus fort(e) ou plus lucide sur toi-même ?', options: [{ text: 'Oui, clairement', score: 0 }, { text: 'Oui, en partie', score: 1 }, { text: 'Pas encore, mais je sens que ça viendra', score: 2 }, { text: 'Non, j\'ai plutôt l\'impression d\'avoir perdu une partie de moi-même', score: 3 }] },
      { text: 'Si tu devais résumer où tu en es aujourd\'hui, dirais-tu que cette histoire a fini de t\'apprendre ce qu\'elle avait à t\'apprendre ?', options: [{ text: 'Oui, ce chapitre est refermé et je l\'ai intégré', score: 0 }, { text: 'Presque, il reste juste quelques détails à digérer', score: 1 }, { text: 'Pas vraiment, j\'ai l\'impression qu\'il reste du travail à faire', score: 2 }, { text: 'Non, j\'ai le sentiment que cette histoire n\'est pas terminée pour moi', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '🌱', title: 'La page est tournée', message: 'Tu as traversé le deuil de cette relation et tu en es sorti(e) avec une vraie clarté intérieure. Tu peux repenser à cette histoire sans qu\'elle te submerge, et c\'est un signe puissant de guérison réelle. Continue à cultiver ce que tu as appris de toi-même. La guérison n\'est pas un état figé mais un équilibre à entretenir.', color: 'text-emerald-400', glowColor: '#34d399' },
      { min: 20, max: 40, emoji: '🌤️', title: 'Sur la bonne voie', message: 'Tu as fait un chemin considérable, et il ne reste que quelques fils à démêler. Il est normal qu\'une pensée ou une image revienne parfois te chatouiller le cœur, ça ne veut pas dire que tu recules. Essaie d\'observer les derniers déclencheurs sans les fuir ni les nourrir. Tu es beaucoup plus proche de l\'autre rive que tu ne le penses.', color: 'text-sky-400', glowColor: '#38bdf8' },
      { min: 40, max: 60, emoji: '🌗', title: 'En plein travail de deuil', message: 'Tu es en plein cœur du processus, cette phase où la tristesse, la colère et la nostalgie se mélangent sans logique apparente. C\'est exactement à ce stade que le deuil amoureux est censé être inconfortable : il n\'y a pas de raccourci, seulement du temps et de la douceur envers toi-même. Tu n\'es pas en retard sur un calendrier qui n\'existe pas.', color: 'text-amber-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🌊', title: 'Encore très attaché(e)', message: 'Le lien est encore vif, et certains schémas (vérifier, comparer, idéaliser) alimentent une boucle qui t\'épuise plus qu\'elle ne t\'aide à avancer. Ce n\'est pas un échec, c\'est le signe que cette relation comptait vraiment. Un premier pas concret : réduire d\'un cran l\'exposition à ses réseaux pendant une semaine, juste pour observer ce que ça change.', color: 'text-rose-400', glowColor: '#fb7185' },
      { min: 80, max: 101, emoji: '🌪️', title: 'Le cœur encore accroché', message: 'Cette rupture occupe encore une place immense dans ton quotidien, ton corps et ton sommeil, et ce n\'est en rien une honte : certains attachements mettent du temps à se dénouer. Le premier pas n\'est pas de "oublier" mais de te faire accompagner pour traverser ça sans t\'épuiser seul(e). Tu n\'as pas à porter ce poids sans aide.', color: 'text-violet-400', glowColor: '#c084fc' },
    ],
  },
  // ─── QUIZ 8 : MANIPULÉ(E) ─────────────────────────────────────────────────
  {
    slug: 'manipule',
    title: 'Cette personne te contrôle sans que tu t\'en rendes compte ?',
    subtitle: 'Les techniques de manipulation que personne ne voit',
    description: '30 questions pour identifier si quelqu\'un dans ta vie te manipule émotionnellement.',
    emoji: '🎭',
    gradientFrom: 'from-purple-950/80',
    gradientTo: 'to-fuchsia-950/80',
    borderColor: 'border-purple-800/30',
    accentColor: '#a855f7',
    questions: [
      { text: 'Cette personne te fait-elle souvent te sentir coupable sans raison claire ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Parfois, mais ça peut s\'expliquer', score: 1 }, { text: 'Souvent, même pour des choses mineures', score: 2 }, { text: 'Constamment, je me sens toujours en faute', score: 3 }] },
      { text: 'Est-ce que cette personne nie des faits qui se sont réellement passés, te faisant douter de ta mémoire ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Rarement, et ça peut être un malentendu', score: 1 }, { text: 'Parfois, ça me laisse confus(e)', score: 2 }, { text: 'Souvent, j\'ai du mal à distinguer ce qui est réel', score: 3 }] },
      { text: 'Cette personne t\'isole-t-elle progressivement de tes amis ou ta famille ?', options: [{ text: 'Non, elle encourage mes relations', score: 0 }, { text: 'Légèrement, mais sans intention apparente', score: 1 }, { text: 'Oui, des critiques récurrentes sur mes proches', score: 2 }, { text: 'Clairement, elle s\'interpose entre moi et mes proches', score: 3 }] },
      { text: 'As-tu l\'impression de marcher sur des œufs pour éviter ses réactions ?', options: [{ text: 'Non, je me sens libre', score: 0 }, { text: 'Parfois dans certains sujets sensibles', score: 1 }, { text: 'Souvent, j\'anticipe ses réactions', score: 2 }, { text: 'Constamment, sa réaction guide tous mes comportements', score: 3 }] },
      { text: 'Cette personne utilise-t-elle tes confidences pour te blesser ou te contrôler ?', options: [{ text: 'Non, mes confidences sont respectées', score: 0 }, { text: 'Une fois dans le feu d\'une dispute', score: 1 }, { text: 'Parfois, certaines choses que j\'ai dites se retournent contre moi', score: 2 }, { text: 'Oui, régulièrement mes aveux deviennent des armes', score: 3 }] },
      { text: 'Est-ce que cette personne change d\'avis selon ce qui lui arrange, sans cohérence ?', options: [{ text: 'Non, elle est consistante', score: 0 }, { text: 'Des changements d\'humeur normaux', score: 1 }, { text: 'Souvent incohérente, ce qui me déstabilise', score: 2 }, { text: 'Constamment, les règles changent à son avantage', score: 3 }] },
      { text: 'As-tu du mal à prendre des décisions sans l\'accord de cette personne ?', options: [{ text: 'Non, je prends mes décisions librement', score: 0 }, { text: 'Je consulte parfois mais sans obligation', score: 1 }, { text: 'Souvent j\'ai besoin de son approbation', score: 2 }, { text: 'Je ne décide presque plus rien seul(e)', score: 3 }] },
      { text: 'Cette personne joue-t-elle les victimes quand tu essaies de défendre tes intérêts ?', options: [{ text: 'Non, elle prend mes besoins au sérieux', score: 0 }, { text: 'Parfois légèrement sensible aux critiques', score: 1 }, { text: 'Souvent, mes demandes deviennent ses souffrances', score: 2 }, { text: 'Toujours, dès que j\'exprime un besoin elle souffre', score: 3 }] },
      { text: 'Est-ce que cette personne te dévalorise régulièrement, même subtilement ?', options: [{ text: 'Non, elle me valorise', score: 0 }, { text: 'Des taquineries légères', score: 1 }, { text: 'Des remarques qui me font me sentir moins bien', score: 2 }, { text: 'Des critiques constantes sur qui je suis', score: 3 }] },
      { text: 'Ton estime de toi a-t-elle baissé depuis que tu fréquentes cette personne ?', options: [{ text: 'Non, elle me renforce', score: 0 }, { text: 'Légèrement mais pour d\'autres raisons', score: 1 }, { text: 'Oui, je me sens moins bien dans ma peau', score: 2 }, { text: 'Fortement, je ne me reconnais plus', score: 3 }] },
      { text: 'Cette personne te fait-elle sentir que tu as de la chance qu\'elle soit dans ta vie ?', options: [{ text: 'Non, nos relations sont équilibrées', score: 0 }, { text: 'Parfois elle me rappelle ses efforts', score: 1 }, { text: 'Souvent, comme si j\'avais un privilège d\'être avec elle', score: 2 }, { text: 'Constamment, comme si je devais être reconnaissant(e) de sa présence', score: 3 }] },
      { text: 'Est-ce que tes émotions sont minimisées ou tournées en ridicule ?', options: [{ text: 'Non, mes émotions sont respectées', score: 0 }, { text: 'Parfois peu de sensibilité de sa part', score: 1 }, { text: 'Souvent on me dit que je réagis trop', score: 2 }, { text: 'Toujours, mes ressentis sont moqués ou ignorés', score: 3 }] },
      { text: 'Est-ce que cette personne change ton humeur systématiquement quand elle entre dans la pièce ?', options: [{ text: 'Non, sa présence est neutre ou positive', score: 0 }, { text: 'Parfois selon son humeur', score: 1 }, { text: 'Souvent je me crispe quand elle arrive', score: 2 }, { text: 'Toujours, une anxiété s\'installe à sa présence', score: 3 }] },
      { text: 'Esta personne prend-elle souvent le mérite de tes réussites ?', options: [{ text: 'Non, elle reconnaît mes efforts', score: 0 }, { text: 'Parfois une appropriation légère', score: 1 }, { text: 'Souvent mes succès lui reviennent en partie', score: 2 }, { text: 'Toujours, mes accomplissements sont attribués à son aide', score: 3 }] },
      { text: 'Est-ce que la relation te laisse épuisé(e) émotionnellement ?', options: [{ text: 'Non, elle me ressource', score: 0 }, { text: 'Parfois fatigué(e) mais normal', score: 1 }, { text: 'Souvent vidé(e) après nos échanges', score: 2 }, { text: 'Toujours, la relation m\'épuise profondément', score: 3 }] },
      { text: 'Cette personne menace-t-elle de partir ou de te nuire quand tu n\'obéis pas ?', options: [{ text: 'Jamais', score: 0 }, { text: 'Des menaces légères dans le feu de la colère', score: 1 }, { text: 'Parfois des ultimatums', score: 2 }, { text: 'Régulièrement comme moyen de contrôle', score: 3 }] },
      { text: 'As-tu l\'impression que tu ne peux pas être toi-même avec cette personne ?', options: [{ text: 'Non, je suis moi-même', score: 0 }, { text: 'Légèrement sur certains sujets', score: 1 }, { text: 'Souvent je filtre ce que je dis', score: 2 }, { text: 'Je suis complètement différent(e) avec elle', score: 3 }] },
      { text: 'Cette personne t\'accuse-t-elle de choses que toi-même tu ne fais pas mais qu\'elle fait ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Un malentendu rare', score: 1 }, { text: 'Parfois, de façon déconcertante', score: 2 }, { text: 'Souvent, elle me reproche ses propres comportements', score: 3 }] },
      { text: 'Tes amis ou proches t\'ont-ils exprimé des inquiétudes sur cette relation ?', options: [{ text: 'Non, ils approuvent', score: 0 }, { text: 'Une remarque isolée', score: 1 }, { text: 'Plusieurs personnes ont exprimé des doutes', score: 2 }, { text: 'Tout mon entourage est préoccupé par cette relation', score: 3 }] },
      { text: 'Est-ce que tu te justifies constamment de tes actions auprès de cette personne ?', options: [{ text: 'Non, je n\'ai pas à me justifier de tout', score: 0 }, { text: 'Parfois pour éviter les conflits', score: 1 }, { text: 'Souvent, je dois expliquer mes moindres faits', score: 2 }, { text: 'Toujours, sans justification il y a conflit', score: 3 }] },
      { text: 'As-tu perdu confiance en ton jugement depuis que tu fréquentes cette personne ?', options: [{ text: 'Non, j\'ai confiance en moi', score: 0 }, { text: 'Légèrement plus d\'hésitations', score: 1 }, { text: 'Souvent je doute de mes perceptions', score: 2 }, { text: 'Complètement, je ne fais plus confiance à ce que je ressens', score: 3 }] },
      { text: 'Cette personne est-elle très différente en public et en privé avec toi ?', options: [{ text: 'Non, elle est la même', score: 0 }, { text: 'Plus réservée en public, normal', score: 1 }, { text: 'Assez différente, ce qui me déroute', score: 2 }, { text: 'Totalement différente, irréconnaissable', score: 3 }] },
      { text: 'Est-ce que tu évites certains sujets avec elle pour éviter ses réactions ?', options: [{ text: 'Non, je peux tout aborder', score: 0 }, { text: 'Quelques sujets délicats', score: 1 }, { text: 'De nombreux sujets sont devenus tabous', score: 2 }, { text: 'Je censure la plupart de mes pensées', score: 3 }] },
      { text: 'Cette personne utilise-t-elle l\'amour ou l\'affection comme récompense ou punition ?', options: [{ text: 'Non, son affection est constante', score: 0 }, { text: 'Parfois plus froide après un désaccord', score: 1 }, { text: 'Clairement son affection est conditionnelle', score: 2 }, { text: 'Oui, c\'est son principal outil de contrôle', score: 3 }] },
      { text: 'Dans l\'ensemble, as-tu le sentiment que cette relation te nuit plus qu\'elle ne te fait du bien ?', options: [{ text: 'Non, elle m\'apporte beaucoup', score: 0 }, { text: 'Quelques hauts et bas normaux', score: 1 }, { text: 'Souvent je me demande ce que j\'y gagne', score: 2 }, { text: 'Clairement, cette relation me détruit plus qu\'elle ne me construit', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '✅', title: 'Relation saine', message: 'Les signaux de manipulation sont peu présents. Ta relation semble équilibrée. Continue à observer si les dynamiques changent.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🤔', title: 'Quelques déséquilibres', message: 'Quelques comportements méritent attention. Ces éléments seuls ne définissent pas une manipulation mais il vaut mieux garder un œil dessus.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Manipulation possible', message: 'Plusieurs signaux concordent avec des schémas de manipulation. Tu mérites une relation où tu te sens respecté(e) et libre. Parler à un proche ou un professionnel peut aider.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Manipulation probable', message: 'Les signaux sont nombreux et forts. Tu montres les signes classiques d\'une personne soumise à une manipulation émotionnelle. Ta liberté et ton bien-être méritent protection.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '🆘', title: 'Manipulation évidente', message: 'Tes réponses dessinent clairement une relation de manipulation. Ce n\'est pas de ta faute. Tu mérites mieux. Cherche du soutien auprès d\'un proche ou d\'un professionnel de confiance.', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
  // ─── QUIZ 9 : DOIS-JE ROMPRE ──────────────────────────────────────────────
  {
    slug: 'rompre',
    title: 'Ta relation te rend-elle plus heureux/heureuse ou plus seul(e) ?',
    subtitle: 'La vérité que tu repousses depuis trop longtemps',
    description: '30 questions pour t\'aider à décider si ta relation mérite d\'être poursuivie.',
    emoji: '💔',
    gradientFrom: 'from-rose-950/80',
    gradientTo: 'to-red-950/80',
    borderColor: 'border-rose-800/30',
    accentColor: '#f43f5e',
    questions: [
      { text: 'Est-ce que tu penses encore à un avenir heureux avec ton/ta partenaire ?', options: [{ text: 'Oui, souvent et avec enthousiasme', score: 0 }, { text: 'Parfois, mais avec des doutes', score: 1 }, { text: 'Rarement, l\'avenir me semble flou', score: 2 }, { text: 'Non, je n\'arrive plus à imaginer un avenir ensemble', score: 3 }] },
      { text: 'Est-ce que tu te sens respecté(e) dans cette relation ?', options: [{ text: 'Oui, totalement', score: 0 }, { text: 'Généralement oui, avec des exceptions', score: 1 }, { text: 'De moins en moins', score: 2 }, { text: 'Non, le manque de respect est constant', score: 3 }] },
      { text: 'Êtes-vous capables de résoudre vos conflits de façon constructive ?', options: [{ text: 'Oui, on communique bien', score: 0 }, { text: 'Avec effort, généralement', score: 1 }, { text: 'Les conflits restent souvent sans résolution', score: 2 }, { text: 'Non, chaque dispute laisse des cicatrices', score: 3 }] },
      { text: 'Est-ce que tu te sens toi-même dans cette relation ?', options: [{ text: 'Oui, pleinement', score: 0 }, { text: 'Largement, avec quelques ajustements', score: 1 }, { text: 'J\'ai perdu une partie de moi dans cette relation', score: 2 }, { text: 'Non, je me sens étranger(ère) à moi-même', score: 3 }] },
      { text: 'Est-ce que tu te sens heureux/heureuse dans cette relation au quotidien ?', options: [{ text: 'Oui, principalement', score: 0 }, { text: 'Parfois oui, parfois non', score: 1 }, { text: 'Rarement, les bons moments se font rares', score: 2 }, { text: 'Non, je suis globalement malheureux/malheureuse', score: 3 }] },
      { text: 'Faites-vous encore des projets concrets ensemble ?', options: [{ text: 'Oui, régulièrement', score: 0 }, { text: 'Quelques projets mais moins qu\'avant', score: 1 }, { text: 'Presque plus, on vit au jour le jour', score: 2 }, { text: 'Non, les projets communs ont disparu', score: 3 }] },
      { text: 'Ton/ta partenaire te soutient-il/elle dans tes objectifs personnels ?', options: [{ text: 'Oui, c\'est un soutien solide', score: 0 }, { text: 'Généralement oui', score: 1 }, { text: 'Peu, les soutiens sont rares', score: 2 }, { text: 'Non, il/elle freine ou s\'oppose à mes aspirations', score: 3 }] },
      { text: 'Avez-vous encore une intimité (physique ou émotionnelle) satisfaisante ?', options: [{ text: 'Oui, on est proches', score: 0 }, { text: 'Ça a diminué mais c\'est normal', score: 1 }, { text: 'L\'intimité s\'est beaucoup détériorée', score: 2 }, { text: 'Non, nous sommes devenus des étrangers', score: 3 }] },
      { text: 'Est-ce que tu as des pensées récurrentes de rupture ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'De temps en temps dans les moments difficiles', score: 1 }, { text: 'Souvent, la rupture me semble parfois inévitable', score: 2 }, { text: 'Très souvent, c\'est une pensée presque constante', score: 3 }] },
      { text: 'Est-ce que tu idéalises ta vie sans ton/ta partenaire ?', options: [{ text: 'Non, je préfère notre vie ensemble', score: 0 }, { text: 'Parfois un fantasme passager', score: 1 }, { text: 'Souvent, je m\'imagine mieux sans lui/elle', score: 2 }, { text: 'Toujours, ma vie serait clairement meilleure seul(e)', score: 3 }] },
      { text: 'Est-ce que les problèmes dans votre relation semblent insolubles ?', options: [{ text: 'Non, on peut tout résoudre', score: 0 }, { text: 'Certains sont difficiles mais pas impossibles', score: 1 }, { text: 'Plusieurs problèmes semblent sans issue', score: 2 }, { text: 'Oui, j\'ai l\'impression qu\'on tourne en rond éternellement', score: 3 }] },
      { text: 'Fais-tu des compromis constants qui t\'éloignent de toi-même ?', options: [{ text: 'Non, nos compromis sont équilibrés', score: 0 }, { text: 'Quelques sacrifices raisonnables', score: 1 }, { text: 'Je cède souvent trop sur des choses importantes', score: 2 }, { text: 'Je me sacrifie constamment sans réciprocité', score: 3 }] },
      { text: 'Est-ce que tu as essayé de travailler activement sur les problèmes sans succès ?', options: [{ text: 'On n\'a pas eu à le faire', score: 0 }, { text: 'On a essayé et ça a fonctionné un peu', score: 1 }, { text: 'On a essayé mais les mêmes problèmes reviennent', score: 2 }, { text: 'Malgré tous les efforts, rien ne change', score: 3 }] },
      { text: 'Ta relation affecte-t-elle négativement d\'autres domaines de ta vie ?', options: [{ text: 'Non, au contraire elle m\'aide', score: 0 }, { text: 'Quelques effets mineurs', score: 1 }, { text: 'Oui, mon travail ou ma santé en souffre', score: 2 }, { text: 'Tous les domaines de ma vie en pâtissent', score: 3 }] },
      { text: 'Partages-tu encore les mêmes valeurs fondamentales que ton/ta partenaire ?', options: [{ text: 'Oui, on est alignés', score: 0 }, { text: 'Quelques divergences mais pas fondamentales', score: 1 }, { text: 'Des différences de valeurs importantes sont apparues', score: 2 }, { text: 'Non, nos visions sont incompatibles', score: 3 }] },
      { text: 'Est-ce que la confiance entre vous est intacte ?', options: [{ text: 'Oui, totalement', score: 0 }, { text: 'Quelques accrocs mais ça tient', score: 1 }, { text: 'La confiance a été sérieusement entamée', score: 2 }, { text: 'Non, la confiance est brisée', score: 3 }] },
      { text: 'Est-ce que rester dans cette relation est dû à l\'amour ou à la peur de partir ?', options: [{ text: 'À l\'amour, clairement', score: 0 }, { text: 'Les deux, mais surtout l\'amour', score: 1 }, { text: 'La peur prend une place grandissante', score: 2 }, { text: 'Principalement la peur : de la solitude, du changement', score: 3 }] },
      { text: 'Tes proches te conseillent-ils de partir ?', options: [{ text: 'Non, ils soutiennent ma relation', score: 0 }, { text: 'Certains ont des réserves', score: 1 }, { text: 'Plusieurs me suggèrent de réfléchir', score: 2 }, { text: 'Tout mon entourage me conseille de partir', score: 3 }] },
      { text: 'Est-ce que vous riez encore ensemble régulièrement ?', options: [{ text: 'Oui, souvent', score: 0 }, { text: 'Parfois, moins qu\'avant', score: 1 }, { text: 'Rarement, la légèreté a disparu', score: 2 }, { text: 'Non, l\'atmosphère est constamment lourde', score: 3 }] },
      { text: 'Est-ce que tu t\'imagines encore lui/elle dire "je t\'aime" avec sincérité ?', options: [{ text: 'Oui, facilement', score: 0 }, { text: 'Avec quelques doutes', score: 1 }, { text: 'Difficilement, les mots semblent vides', score: 2 }, { text: 'Non, ces mots ont perdu tout sens pour moi', score: 3 }] },
      { text: 'Est-ce que ton bonheur dépend de sa présence ou de son absence ?', options: [{ text: 'Sa présence me rend heureux/heureuse', score: 0 }, { text: 'Variable selon les moments', score: 1 }, { text: 'Je me sens parfois mieux sans lui/elle', score: 2 }, { text: 'Son absence me soulage plus qu\'elle ne me manque', score: 3 }] },
      { text: 'Y a-t-il eu des comportements inacceptables (violence, tromperie) non résolus ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Un incident difficile mais résolu', score: 1 }, { text: 'Des éléments graves qui n\'ont pas été vraiment traités', score: 2 }, { text: 'Des comportements intolérables qui continuent', score: 3 }] },
      { text: 'Est-ce que tu attends que les choses "redeviennent comme avant" ?', options: [{ text: 'Non, c\'est déjà bien maintenant', score: 0 }, { text: 'Un peu, mais avec confiance', score: 1 }, { text: 'Oui, j\'attends un retour qui ne vient pas', score: 2 }, { text: 'J\'attends depuis longtemps sans voir de changement', score: 3 }] },
      { text: 'Si tu pouvais recommencer, choisirais-tu à nouveau cette relation ?', options: [{ text: 'Oui, sans hésitation', score: 0 }, { text: 'Probablement oui', score: 1 }, { text: 'Je ne suis plus sûr(e)', score: 2 }, { text: 'Non, je ne la choisirais plus', score: 3 }] },
      { text: 'Dans l\'ensemble, ta relation te rend-elle meilleur(e) ou te tire-t-elle vers le bas ?', options: [{ text: 'Elle m\'élève et me construit', score: 0 }, { text: 'Globalement positive malgré les défis', score: 1 }, { text: 'Elle me pèse plus qu\'elle ne m\'aide', score: 2 }, { text: 'Elle me détruit progressivement', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '💪', title: 'Traversée de crise', message: 'Votre relation semble globalement solide. Les difficultés actuelles ressemblent davantage à une crise passagère. Continuez à communiquer et à vous soutenir mutuellement.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🤔', title: 'Relation fragilisée', message: 'Ta relation traverse une période difficile avec des problèmes réels à adresser. Une thérapie de couple ou une communication plus profonde pourrait aider avant d\'envisager la rupture.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Doutes légitimes', message: 'Tes doutes sont fondés par des réalités concrètes. Prends le temps d\'évaluer honnêtement si cette relation peut vraiment évoluer ou si elle te retient dans un état de stagnation.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Rupture probable', message: 'Les signaux sont nombreux et indiquent que cette relation ne te convient plus. Rester par peur ou habitude n\'est pas une base saine. Tu mérites d\'être heureux/heureuse.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '🚪', title: 'Il est temps de partir', message: 'Tes réponses indiquent clairement que cette relation te fait plus de mal que de bien. Partir n\'est pas un échec. C\'est parfois l\'acte le plus courageux et le plus aimant envers toi-même.', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
  // ─── QUIZ 10 : JALOUX ─────────────────────────────────────────────────────
  {
    slug: 'jaloux',
    title: 'Ta jalousie va-t-elle détruire ta relation sans que tu le veuilles ?',
    subtitle: 'Ce niveau de jalousie est-il normal ou dangereux',
    description: '30 questions pour savoir si ta jalousie est saine ou problématique dans ta relation.',
    emoji: '😤',
    gradientFrom: 'from-orange-950/80',
    gradientTo: 'to-yellow-950/80',
    borderColor: 'border-orange-800/30',
    accentColor: '#f97316',
    questions: [
      { text: 'Est-ce que tu vérifies le téléphone ou les réseaux de ton/ta partenaire ?', options: [{ text: 'Jamais, je respecte son intimité', score: 0 }, { text: 'Très rarement, et seulement avec son accord', score: 1 }, { text: 'Parfois quand je suis inquiet(e)', score: 2 }, { text: 'Régulièrement, je surveille ses activités', score: 3 }] },
      { text: 'Est-ce que tu ressens de la jalousie quand ton/ta partenaire parle à d\'autres personnes ?', options: [{ text: 'Non, je lui fais confiance', score: 0 }, { text: 'Rarement, dans des contextes particuliers', score: 1 }, { text: 'Souvent, surtout avec certaines personnes', score: 2 }, { text: 'Toujours, même les conversations anodines m\'affectent', score: 3 }] },
      { text: 'Est-ce que tu poses des questions répétées sur où il/elle était ou avec qui ?', options: [{ text: 'Non, j\'accepte ses explications', score: 0 }, { text: 'Parfois pour ma tranquillité d\'esprit', score: 1 }, { text: 'Souvent, j\'ai besoin de détails précis', score: 2 }, { text: 'Toujours, et même ça ne me suffit pas', score: 3 }] },
      { text: 'Est-ce que tu t\'opposes aux amitiés de ton/ta partenaire avec des personnes du sexe opposé ?', options: [{ text: 'Non, la confiance est ma base', score: 0 }, { text: 'Parfois un peu d\'inquiétude', score: 1 }, { text: 'Souvent, certaines amitiés me dérangent', score: 2 }, { text: 'Oui, j\'essaie d\'éviter certaines fréquentations', score: 3 }] },
      { text: 'Est-ce que tu essaies de contrôler où va ton/ta partenaire et avec qui ?', options: [{ text: 'Non, il/elle est libre', score: 0 }, { text: 'Parfois je manifeste mes préférences', score: 1 }, { text: 'Souvent j\'essaie d\'influencer ses sorties', score: 2 }, { text: 'Oui, j\'exerce un contrôle sur ses activités', score: 3 }] },
      { text: 'Est-ce que la jalousie provoque des disputes dans ta relation ?', options: [{ text: 'Jamais', score: 0 }, { text: 'Très rarement', score: 1 }, { text: 'Régulièrement', score: 2 }, { text: 'Très souvent, c\'est une source majeure de conflits', score: 3 }] },
      { text: 'Est-ce que tu surveilles la localisation ou les horaires de ton/ta partenaire ?', options: [{ text: 'Non, ce n\'est pas nécessaire', score: 0 }, { text: 'Parfois par habitude', score: 1 }, { text: 'Souvent, pour savoir où il/elle est', score: 2 }, { text: 'En permanence, j\'ai besoin de connaître sa position', score: 3 }] },
      { text: 'Est-ce que la jalousie t\'envahit même quand il n\'y a aucune raison objective ?', options: [{ text: 'Non, ma jalousie est toujours fondée', score: 0 }, { text: 'Rarement sans raison', score: 1 }, { text: 'Parfois, une anxiété sans cause précise', score: 2 }, { text: 'Souvent, j\'imagine des scénarios sans preuve', score: 3 }] },
      { text: 'Est-ce que tu lis les messages ou emails de ton/ta partenaire ?', options: [{ text: 'Jamais', score: 0 }, { text: 'Une fois dans un moment de panique', score: 1 }, { text: 'Parfois quand l\'occasion se présente', score: 2 }, { text: 'Régulièrement, c\'est devenu une habitude', score: 3 }] },
      { text: 'Est-ce que tu te sens menacé(e) par les exs de ton/ta partenaire ?', options: [{ text: 'Non, le passé reste le passé', score: 0 }, { text: 'Légèrement mais sans obsession', score: 1 }, { text: 'Souvent, je pense à eux/elles', score: 2 }, { text: 'Constamment, je les vois comme une menace réelle', score: 3 }] },
      { text: 'Est-ce que tu as déjà suivi ou espionné ton/ta partenaire ?', options: [{ text: 'Jamais', score: 0 }, { text: 'Une fois dans un moment de panique extrême', score: 1 }, { text: 'Quelques fois', score: 2 }, { text: 'Plusieurs fois', score: 3 }] },
      { text: 'Est-ce que ta jalousie te rend agressif/agressive ou froid(e) ?', options: [{ text: 'Non, je gère mes émotions', score: 0 }, { text: 'Parfois un peu de distance', score: 1 }, { text: 'Souvent je réagis mal', score: 2 }, { text: 'Toujours, je peux devenir violent(e) verbalement', score: 3 }] },
      { text: 'Est-ce que tu interprètes les messages ou comportements anodins de façon négative ?', options: [{ text: 'Non, je pense le mieux par défaut', score: 0 }, { text: 'Parfois je sur-interprète', score: 1 }, { text: 'Souvent, je cherche des signaux', score: 2 }, { text: 'Toujours, tout me semble suspect', score: 3 }] },
      { text: 'Est-ce que tu exiges de connaître tous les détails de la vie sociale de ton/ta partenaire ?', options: [{ text: 'Non, il/elle a son espace privé', score: 0 }, { text: 'Parfois je suis curieux/curieuse', score: 1 }, { text: 'Souvent j\'ai besoin de savoir', score: 2 }, { text: 'Toujours, l\'omission me semble une trahison', score: 3 }] },
      { text: 'Est-ce que ta jalousie a déjà éloigné quelqu\'un de toi ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Quelques tensions isolées', score: 1 }, { text: 'Oui, une relation en a souffert', score: 2 }, { text: 'Oui, plusieurs relations ont été brisées par elle', score: 3 }] },
      { text: 'Est-ce que tu penses souvent que ton/ta partenaire te trompe sans preuve ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Très rarement dans des moments d\'insécurité', score: 1 }, { text: 'Parfois', score: 2 }, { text: 'Souvent, c\'est une pensée récurrente', score: 3 }] },
      { text: 'Est-ce que tu es jaloux/jalouse des succès ou des relations sociales de ton/ta partenaire ?', options: [{ text: 'Non, je suis fier/fière', score: 0 }, { text: 'Rarement une légère piqûre', score: 1 }, { text: 'Parfois ses succès m\'affectent', score: 2 }, { text: 'Souvent, tout semble une menace', score: 3 }] },
      { text: 'Est-ce que tu utilises des reproches ou du chantage quand tu te sens jaloux/jalouse ?', options: [{ text: 'Non, je communique sereinement', score: 0 }, { text: 'Parfois une pique que je regrette', score: 1 }, { text: 'Souvent des reproches dans la dispute', score: 2 }, { text: 'Oui, c\'est ma façon de gérer la jalousie', score: 3 }] },
      { text: 'Ton/ta partenaire t\'a-t-il/elle dit que ta jalousie lui pose un problème ?', options: [{ text: 'Non, jamais abordé', score: 0 }, { text: 'Une fois légèrement', score: 1 }, { text: 'Plusieurs fois avec insistance', score: 2 }, { text: 'Souvent, c\'est un sujet de conflit majeur', score: 3 }] },
      { text: 'Est-ce que tu te sens apaisé(e) temporairement après avoir vérifié ou interrogé, puis ça revient ?', options: [{ text: 'Non, ma confiance est stable', score: 0 }, { text: 'Parfois un soulagement bref', score: 1 }, { text: 'Souvent le cycle vérifie-soulagement-doute recommence', score: 2 }, { text: 'Toujours, c\'est un cycle sans fin', score: 3 }] },
      { text: 'Est-ce que ta jalousie vient de ton histoire personnelle plutôt que des actions de ton/ta partenaire ?', options: [{ text: 'Non, ma confiance est solide', score: 0 }, { text: 'Peut-être des cicatrices du passé', score: 1 }, { text: 'Oui, des blessures passées alimentent ma jalousie', score: 2 }, { text: 'Clairement, mon passé dicte mes réactions', score: 3 }] },
      { text: 'Est-ce que tu testes ton/ta partenaire pour voir s\'il/elle te trahit ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Très rarement dans un moment d\'anxiété', score: 1 }, { text: 'Parfois des petits tests', score: 2 }, { text: 'Régulièrement, je mets en place des situations tests', score: 3 }] },
      { text: 'Est-ce que ta jalousie te cause de l\'anxiété ou du stress au quotidien ?', options: [{ text: 'Non, je vis sereinement', score: 0 }, { text: 'Parfois un peu d\'inquiétude', score: 1 }, { text: 'Souvent, ça pèse sur mon quotidien', score: 2 }, { text: 'Tout le temps, c\'est épuisant', score: 3 }] },
      { text: 'Dans l\'ensemble, penses-tu que ta jalousie est excessive ?', options: [{ text: 'Non, elle est proportionnée', score: 0 }, { text: 'Peut-être un peu élevée', score: 1 }, { text: 'Oui, je sais qu\'elle dépasse la mesure', score: 2 }, { text: 'Oui, elle est hors de contrôle', score: 3 }] },
      { text: 'Est-ce que ton/ta partenaire doit constamment te rassurer pour apaiser ta jalousie ?', options: [{ text: 'Non, j\'ai confiance en moi', score: 0 }, { text: 'Parfois un peu de réassurance', score: 1 }, { text: 'Souvent, j\'ai besoin d\'être rassuré(e)', score: 2 }, { text: 'En permanence, et ça ne suffit jamais longtemps', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '💚', title: 'Jalousie saine', message: 'Ta jalousie est dans des limites normales et saines. Une légère jalousie témoigne souvent de l\'importance que tu accordes à ta relation. Continue ainsi.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🟡', title: 'Vigilance normale', message: 'Quelques réactions jalouses mais rien d\'alarmant. Assure-toi que la communication avec ton/ta partenaire reste ouverte pour ne pas laisser ces inquiétudes s\'amplifier.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Jalousie excessive', message: 'Ta jalousie dépasse la norme et peut créer des tensions dans ta relation. Identifier ses sources (insécurité, blessures passées) est la première étape pour mieux la gérer.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Jalousie problématique', message: 'Ta jalousie affecte significativement ta relation et ton bien-être. Un accompagnement professionnel peut t\'aider à briser ce cycle et à retrouver une relation de confiance.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '💥', title: 'Jalousie toxique', message: 'Tes comportements jaloux sont très intenses et peuvent blesser ton/ta partenaire et te blesser toi. C\'est une souffrance qui mérite une aide professionnelle. Tu mérites la paix intérieure.', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
  // ─── QUIZ 11 : RELATION TOXIQUE ───────────────────────────────────────────
  {
    slug: 'relation-toxique',
    title: 'Est-ce que cette relation te détruit lentement ?',
    subtitle: 'Les 7 signes qu\'on refuse toujours de voir',
    description: '30 questions pour identifier si ta relation présente des schémas toxiques.',
    emoji: '🚫',
    gradientFrom: 'from-red-950/80',
    gradientTo: 'to-pink-950/80',
    borderColor: 'border-red-900/30',
    accentColor: '#dc2626',
    questions: [
      { text: 'Est-ce que tu te sens régulièrement inférieur(e) ou diminué(e) dans cette relation ?', options: [{ text: 'Non, je me sens valorisé(e)', score: 0 }, { text: 'Parfois lors de disputes', score: 1 }, { text: 'Souvent, les remarques me blessent', score: 2 }, { text: 'Constamment, je me sens nul(le) avec cette personne', score: 3 }] },
      { text: 'Est-ce que l\'un de vous deux contrôle les finances de l\'autre ?', options: [{ text: 'Non, on gère ensemble de façon équilibrée', score: 0 }, { text: 'On partage parfois mais c\'est transparent', score: 1 }, { text: 'L\'un contrôle l\'accès aux ressources', score: 2 }, { text: 'Oui, je n\'ai pas accès librement à l\'argent', score: 3 }] },
      { text: 'Est-ce qu\'il y a des épisodes de violence verbale, émotionnelle ou physique ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Des mots dépassés dans la colère, rares et regrettés', score: 1 }, { text: 'Des incidents réguliers pas totalement résolus', score: 2 }, { text: 'Oui, des comportements violents récurrents', score: 3 }] },
      { text: 'Est-ce que l\'un de vous deux isole l\'autre de son réseau social ?', options: [{ text: 'Non, on encourage nos amitiés respectives', score: 0 }, { text: 'Parfois des critiques légères sur certains amis', score: 1 }, { text: 'Des efforts pour limiter certaines relations', score: 2 }, { text: 'Oui, je suis progressivement coupé(e) de mes proches', score: 3 }] },
      { text: 'Est-ce que tu ressens de la peur de l\'humeur ou des réactions de l\'autre ?', options: [{ text: 'Non, je me sens en sécurité', score: 0 }, { text: 'Légèrement lors de tensions', score: 1 }, { text: 'Souvent, j\'anticipe ses réactions', score: 2 }, { text: 'Constamment, je marche sur des œufs', score: 3 }] },
      { text: 'Est-ce qu\'il y a des cycles de réconciliation après des épisodes difficiles ?', options: [{ text: 'Nos disputes se résolvent normalement', score: 0 }, { text: 'Parfois des tensions qui passent', score: 1 }, { text: 'Des cycles de rupture-réconciliation récurrents', score: 2 }, { text: 'Oui, des cycles très intenses avec de fausses accalmies', score: 3 }] },
      { text: 'Est-ce que l\'un contrôle les décisions importantes de l\'autre ?', options: [{ text: 'Non, on décide ensemble', score: 0 }, { text: 'Parfois de l\'influence normale', score: 1 }, { text: 'L\'un domine souvent les décisions', score: 2 }, { text: 'Oui, je n\'ai presque plus de pouvoir décisionnel', score: 3 }] },
      { text: 'Est-ce que les promesses de changement ne sont jamais tenues ?', options: [{ text: 'Les engagements pris sont respectés', score: 0 }, { text: 'Quelques promesses non tenues sans gravité', score: 1 }, { text: 'Des promesses répétées sans suivi réel', score: 2 }, { text: 'Toujours des promesses, jamais de changement durable', score: 3 }] },
      { text: 'Est-ce que tu te sens responsable des émotions et humeurs de l\'autre ?', options: [{ text: 'Non, chacun gère ses émotions', score: 0 }, { text: 'Parfois un peu de responsabilité émotionnelle', score: 1 }, { text: 'Souvent je me sens coupable de son état', score: 2 }, { text: 'Toujours, son bonheur ou sa colère me revient', score: 3 }] },
      { text: 'Est-ce que ta santé physique ou mentale en souffre ?', options: [{ text: 'Non, je me sens bien', score: 0 }, { text: 'Un peu de stress lié à la relation', score: 1 }, { text: 'Oui, des effets sur mon sommeil ou mon anxiété', score: 2 }, { text: 'Oui, je suis clairement en mauvaise santé à cause de cette relation', score: 3 }] },
      { text: 'Est-ce que l\'un de vous utilise les enfants, la famille ou la honte comme levier ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Quelques remarques maladroites', score: 1 }, { text: 'Parfois utilisés dans les conflits', score: 2 }, { text: 'Oui, régulièrement utilisés comme outil de pression', score: 3 }] },
      { text: 'Est-ce que ton identité ou tes passions ont disparu depuis cette relation ?', options: [{ text: 'Non, je reste moi-même', score: 0 }, { text: 'Quelques ajustements naturels', score: 1 }, { text: 'J\'ai perdu beaucoup de mes centres d\'intérêt', score: 2 }, { text: 'Je ne sais plus vraiment qui je suis', score: 3 }] },
      { text: 'Est-ce qu\'on te fait sentir que personne d\'autre ne voudrait de toi ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Un commentaire blessant rare', score: 1 }, { text: 'Parfois des sous-entendus', score: 2 }, { text: 'Oui, je commence à le croire', score: 3 }] },
      { text: 'Est-ce que la relation te donne plus d\'anxiété que de sécurité ?', options: [{ text: 'Non, je me sens en sécurité', score: 0 }, { text: 'Un équilibre instable', score: 1 }, { text: 'Souvent plus d\'anxiété', score: 2 }, { text: 'Toujours, cette relation m\'angoisse', score: 3 }] },
      { text: 'Est-ce que tu dois obtenir la permission pour des activités normales ?', options: [{ text: 'Non, j\'ai ma liberté', score: 0 }, { text: 'On se consulte par respect', score: 1 }, { text: 'J\'évite certaines choses pour éviter les conflits', score: 2 }, { text: 'Oui, je dois demander l\'autorisation', score: 3 }] },
      { text: 'Est-ce que tes succès sont sabotés ou minimisés par l\'autre ?', options: [{ text: 'Non, on célèbre ensemble', score: 0 }, { text: 'Parfois peu d\'enthousiasme', score: 1 }, { text: 'Souvent mes réussites sont réduites', score: 2 }, { text: 'Toujours sabotés ou attribués à la chance', score: 3 }] },
      { text: 'Est-ce que les mêmes problèmes reviennent en boucle sans résolution ?', options: [{ text: 'Non, on résout vraiment les conflits', score: 0 }, { text: 'Quelques sujets récurrents gérables', score: 1 }, { text: 'Oui, les mêmes disputes reviennent', score: 2 }, { text: 'Oui, on tourne en rond depuis des années', score: 3 }] },
      { text: 'Est-ce que tu te sens épuisé(e) après avoir passé du temps avec cette personne ?', options: [{ text: 'Non, je me sens bien', score: 0 }, { text: 'Parfois légèrement fatigué(e)', score: 1 }, { text: 'Souvent vidé(e) émotionnellement', score: 2 }, { text: 'Toujours épuisé(e), la relation me pompe toute mon énergie', score: 3 }] },
      { text: 'Est-ce que tu mentirais à tes proches sur l\'état de ta relation pour les rassurer ?', options: [{ text: 'Non, je suis transparent(e)', score: 0 }, { text: 'Quelques omissions pour éviter les inquiétudes', score: 1 }, { text: 'Souvent je cache la réalité', score: 2 }, { text: 'Constamment, personne ne connaît la vraie situation', score: 3 }] },
      { text: 'Restes-tu dans cette relation par peur plutôt que par amour ?', options: [{ text: 'Non, je reste par amour sincère', score: 0 }, { text: 'Un peu des deux', score: 1 }, { text: 'La peur prend plus de place que l\'amour', score: 2 }, { text: 'Principalement par peur des conséquences si je pars', score: 3 }] },
      { text: 'Tes amis ou proches expriment-ils leur inquiétude pour toi ?', options: [{ text: 'Non, ils approuvent la relation', score: 0 }, { text: 'Quelques réserves légères', score: 1 }, { text: 'Plusieurs personnes ont exprimé des doutes', score: 2 }, { text: 'Tout le monde s\'inquiète pour moi', score: 3 }] },
      { text: 'Est-ce que des incidents graves ont eu lieu (tromperies, violences, humiliations) ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Un incident isolé résolu', score: 1 }, { text: 'Plusieurs incidents sérieux', score: 2 }, { text: 'Des comportements graves et récurrents', score: 3 }] },
      { text: 'Est-ce que cette relation t\'éloigne de la meilleure version de toi-même ?', options: [{ text: 'Non, elle m\'aide à grandir', score: 0 }, { text: 'Peu d\'impact dans un sens ou dans l\'autre', score: 1 }, { text: 'Oui, je stagne ou régresse', score: 2 }, { text: 'Oui, je suis clairement une version dégradée de moi-même', score: 3 }] },
      { text: 'Est-ce que tu as déjà pensé que cette relation met ta sécurité en danger ?', options: [{ text: 'Non, je me sens en sécurité', score: 0 }, { text: 'Rarement, dans des contextes très tendus', score: 1 }, { text: 'Parfois, cette pensée m\'a traversé l\'esprit', score: 2 }, { text: 'Oui, ma sécurité est réellement en jeu', score: 3 }] },
      { text: 'Dans l\'ensemble, cette relation te fait-elle souffrir plus qu\'elle ne te rend heureux/heureuse ?', options: [{ text: 'Non, le bonheur domine', score: 0 }, { text: 'Difficile à dire, c\'est équilibré', score: 1 }, { text: 'La souffrance l\'emporte souvent', score: 2 }, { text: 'Clairement, cette relation me fait plus de mal que de bien', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '✅', title: 'Relation saine', message: 'Peu de signaux toxiques dans ta relation. Les difficultés que tu traverses semblent normales. Continue à entretenir la communication et le respect mutuel.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🟡', title: 'Signaux à surveiller', message: 'Quelques dynamiques méritent attention. Ces éléments ne définissent pas une relation toxique mais valent la peine d\'être abordés ouvertement avec ton/ta partenaire.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Relation déséquilibrée', message: 'Ta relation présente plusieurs dynamiques problématiques. La communication et peut-être l\'aide d\'un professionnel sont nécessaires pour rétablir un équilibre sain.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Toxicité importante', message: 'Les schémas que tu décris correspondent à une relation toxique. Ta santé physique et mentale mérite protection. Cherche du soutien et pose-toi des questions sur la suite.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '🆘', title: 'Relation très toxique', message: 'Tes réponses décrivent une relation profondément toxique. Ta sécurité et ton bien-être sont prioritaires. Parle à quelqu\'un de confiance. Tu mérites une vie sans cette souffrance.', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
  // ─── QUIZ 12 : CRUSH ──────────────────────────────────────────────────────
  // ─── QUIZ : SCHÉMA AMOUREUX ───────────────────────────────────────────────
  {
    slug: 'schema-amoureux',
    title: 'Pourquoi tombes-tu toujours pour le même type de personne ?',
    subtitle: 'Le schéma amoureux inconscient qui choisit à ta place',
    description: '30 questions pour identifier le schéma répétitif qui guide tes choix amoureux, et comprendre pourquoi tu craques toujours pour le même type de personne.',
    emoji: '🧲',
    gradientFrom: 'from-fuchsia-950/80',
    gradientTo: 'to-purple-950/80',
    borderColor: 'border-fuchsia-800/30',
    accentColor: '#c026d3',
    questions: [
      { text: 'Quand tu rencontres quelqu\'un, ce qui te fait vibrer immédiatement, c\'est plutôt...', options: [{ text: 'Sa gentillesse et sa disponibilité pour moi', score: 0 }, { text: 'Un mélange équilibré d\'alchimie et de sécurité', score: 1 }, { text: 'Une tension, un mystère, quelque chose d\'insaisissable chez lui/elle', score: 2 }, { text: 'Une intensité immédiate, presque électrique, que je ne peux pas expliquer', score: 3 }] },
      { text: 'Avec le recul, tes ex se ressemblent...', options: [{ text: 'Pas du tout, chacun(e) était très différent(e)', score: 0 }, { text: 'Un peu, sur des valeurs communes positives', score: 1 }, { text: 'Beaucoup, un même genre de personnalité revient', score: 2 }, { text: 'Étrangement, presque le même profil à chaque fois', score: 3 }] },
      { text: 'Une personne stable, disponible, qui t\'aime sans jouer au chat et à la souris, te fait ressentir...', options: [{ text: 'En sécurité et attiré(e)', score: 0 }, { text: 'Bien, même si ça manque un peu de piquant au début', score: 1 }, { text: 'Un ennui difficile à expliquer', score: 2 }, { text: 'Un désintérêt presque immédiat, comme si "trop simple" tuait l\'attirance', score: 3 }] },
      { text: 'Quand quelqu\'un est chaleureux et exprime clairement son intérêt pour toi dès le début, tu...', options: [{ text: 'Te sens rassuré(e) et tu t\'ouvres facilement', score: 0 }, { text: 'Apprécies, mais tu restes un peu prudent(e)', score: 1 }, { text: 'Te méfies, tu te demandes ce qu\'il/elle cache', score: 2 }, { text: 'Perds vite l\'intérêt, "trop facile" ne t\'attire pas', score: 3 }] },
      { text: 'Dans tes relations passées, combien de fois as-tu joué le rôle de "celui/celle qui sauve" l\'autre (de ses problèmes, ses failles, son passé) ?', options: [{ text: 'Jamais vraiment, on s\'est portés mutuellement', score: 0 }, { text: 'Une fois, dans une relation particulière', score: 1 }, { text: 'Souvent, c\'est un rôle qui me va bien', score: 2 }, { text: 'Presque toujours, j\'ai l\'impression que c\'est mon rôle dans le couple', score: 3 }] },
      { text: 'Face à quelqu\'un qui te dit clairement ce qu\'il/elle veut et reste constant(e) dans ses messages, tu penses plutôt...', options: [{ text: '"Enfin quelqu\'un de clair, ça me va très bien"', score: 0 }, { text: '"C\'est agréable, mais est-ce qu\'il y a un peu de challenge ?"', score: 1 }, { text: '"C\'est presque suspect d\'être aussi facile"', score: 2 }, { text: '"Ça manque de piment, je préfère l\'incertitude"', score: 3 }] },
      { text: 'Quand tu repenses à ton enfance, ta relation avec la figure parentale la plus "compliquée émotionnellement"...', options: [{ text: 'N\'a pas vraiment de lien avec qui je choisis aujourd\'hui', score: 0 }, { text: 'A peut-être influencé certains de mes choix, sans plus', score: 1 }, { text: 'Ressemble beaucoup à un type de partenaire que j\'ai choisi', score: 2 }, { text: 'Ressemble presque trait pour trait à mes partenaires récurrents', score: 3 }] },
      { text: 'Un(e) partenaire qui a du mal à exprimer ses émotions et qui reste distant(e) par moments te semble...', options: [{ text: 'Difficile à vivre, ce n\'est pas pour moi', score: 0 }, { text: 'Un défi que je peux accepter si le reste va bien', score: 1 }, { text: 'Familier, presque rassurant dans sa distance', score: 2 }, { text: 'Intrigant — je veux justement être celle/celui qui perce cette carapace', score: 3 }] },
      { text: 'As-tu déjà ignoré un red flag évident (mensonge, incohérence, manque de respect) parce que l\'alchimie était trop forte pour t\'en éloigner ?', options: [{ text: 'Non, un red flag clair est un signal d\'arrêt pour moi', score: 0 }, { text: 'Une ou deux fois, avec le recul', score: 1 }, { text: 'Assez souvent, oui', score: 2 }, { text: 'Presque systématiquement — l\'alchimie l\'emporte toujours sur mes doutes', score: 3 }] },
      { text: 'Ce qui te fait dire "il/elle est fait(e) pour moi", c\'est plutôt...', options: [{ text: 'La façon dont je me sens en sécurité et respecté(e) avec cette personne', score: 0 }, { text: 'Un mélange de connexion émotionnelle et d\'alchimie', score: 1 }, { text: 'Une sensation de déjà-vu, comme si je connaissais déjà cette dynamique', score: 2 }, { text: 'Un sentiment intense de "familier", même si je ne saurais pas dire pourquoi', score: 3 }] },
      { text: 'Une relation qui avance calmement, sans hauts et bas dramatiques, te donne l\'impression...', options: [{ text: 'Que c\'est exactement ce que je recherche', score: 0 }, { text: 'Que c\'est bien, avec un soupçon de banalité parfois', score: 1 }, { text: 'Que quelque chose manque, comme si ce n\'était "pas assez"', score: 2 }, { text: 'Que ce n\'est pas vraiment de l\'amour — l\'amour "doit" un peu faire mal', score: 3 }] },
      { text: 'Combien de tes partenaires avaient un point commun avec un parent (comportement, absence, froideur, imprévisibilité) ?', options: [{ text: 'Aucun que je vois', score: 0 }, { text: 'Peut-être un(e) seul(e)', score: 1 }, { text: 'Plusieurs, avec le recul', score: 2 }, { text: 'Presque tous, c\'est troublant quand j\'y pense', score: 3 }] },
      { text: 'Quand une relation devient "trop facile", ta réaction inconsciente est souvent de...', options: [{ text: 'Continuer à en profiter pleinement', score: 0 }, { text: 'Chercher un peu de piment sainement (nouveauté, projets)', score: 1 }, { text: 'Provoquer une petite tension ou un test pour voir si ça résiste', score: 2 }, { text: 'Perdre progressivement intérêt, comme si le calme signifiait "ça ne compte pas"', score: 3 }] },
      { text: 'As-tu déjà pensé "je sais que ce n\'est pas bon pour moi mais je n\'arrive pas à partir" ?', options: [{ text: 'Jamais vécu ça', score: 0 }, { text: 'Une fois, dans un contexte particulier', score: 1 }, { text: 'Plusieurs fois dans ma vie amoureuse', score: 2 }, { text: 'C\'est presque une phrase récurrente dans mon histoire', score: 3 }] },
      { text: 'Ce que tu ressens face à quelqu\'un d\'imprévisible (chaud/froid, présent/absent), c\'est souvent...', options: [{ text: 'De la fatigue, je m\'en éloigne vite', score: 0 }, { text: 'De la confusion, mais je garde mes distances', score: 1 }, { text: 'Une attirance renforcée, l\'incertitude m\'accroche', score: 2 }, { text: 'Une forme d\'obsession, je pense à cette personne sans arrêt', score: 3 }] },
      { text: 'Tu choisis généralement tes partenaires en fonction de...', options: [{ text: 'Comment ils/elles me traitent au quotidien, sur la durée', score: 0 }, { text: 'Un équilibre entre ressenti immédiat et compatibilité réelle', score: 1 }, { text: 'Ce que je ressens dans l\'instant, l\'intensité prime', score: 2 }, { text: 'Un feeling immédiat que je ne questionne jamais, même quand les faits disent le contraire', score: 3 }] },
      { text: 'As-tu remarqué que tu es plus attiré(e) par des personnes pas totalement disponibles (en couple, loin, indécises, "compliquées") ?', options: [{ text: 'Non, je recherche plutôt des personnes disponibles', score: 0 }, { text: 'Ça m\'est arrivé occasionnellement', score: 1 }, { text: 'C\'est un schéma que je reconnais chez moi', score: 2 }, { text: 'C\'est presque systématique, l\'indisponibilité m\'attire particulièrement', score: 3 }] },
      { text: 'Une personne qui te complimente sincèrement et régulièrement te fait ressentir...', options: [{ text: 'De la joie simple, je le/la crois', score: 0 }, { text: 'Du bien, avec une retenue naturelle', score: 1 }, { text: 'Un léger malaise, comme si ce n\'était "pas mérité"', score: 2 }, { text: 'De la méfiance : "pourquoi il/elle fait ça, qu\'est-ce qu\'il/elle veut"', score: 3 }] },
      { text: 'Dans une relation, es-tu plus souvent celui/celle qui donne beaucoup plus (émotionnellement, en efforts, en attention) que l\'autre ?', options: [{ text: 'Non, c\'est généralement équilibré', score: 0 }, { text: 'Parfois, selon les périodes', score: 1 }, { text: 'Souvent, je donne plus que je ne reçois', score: 2 }, { text: 'Presque toujours, c\'est un schéma qui revient sans cesse', score: 3 }] },
      { text: 'Quand tu penses à un(e) ex qui t\'a fait souffrir, ce que tu ressens surtout, c\'est...', options: [{ text: 'Du soulagement d\'être passé(e) à autre chose', score: 0 }, { text: 'De la nostalgie ponctuelle mais pas de regret', score: 1 }, { text: 'Un manque étrange malgré tout ce qui s\'est passé', score: 2 }, { text: 'Une attirance persistante, comme si cette personne me manquait au sens propre', score: 3 }] },
      { text: 'Ta définition de "l\'amour" ressemble le plus à...', options: [{ text: 'Se sentir en sécurité, respecté(e) et soutenu(e)', score: 0 }, { text: 'Un mélange de sécurité et d\'excitation', score: 1 }, { text: 'Une intensité qui inclut un peu de souffrance, "ça fait partie du jeu"', score: 2 }, { text: 'Le manque, l\'incertitude, l\'attente — sinon ce n\'est pas "vraiment" de l\'amour', score: 3 }] },
      { text: 'As-tu déjà eu l\'impression de revivre exactement la même rupture, avec des personnes différentes mais un scénario identique ?', options: [{ text: 'Non, chaque histoire a été différente', score: 0 }, { text: 'Vaguement, sur un ou deux points', score: 1 }, { text: 'Oui, plusieurs fois le même scénario se répète', score: 2 }, { text: 'Oui, de façon troublante — c\'est presque le même film à chaque fois', score: 3 }] },
      { text: 'Face à quelqu\'un de "trop gentil" ou "trop investi" trop vite, ta première pensée est...', options: [{ text: '"Quelle chance, c\'est rare et précieux"', score: 0 }, { text: '"C\'est agréable, on verra si ça dure"', score: 1 }, { text: '"Ça sent le désespoir" ou "il/elle en fait trop"', score: 2 }, { text: '"Ça m\'ennuie déjà" — je préfère devoir le/la conquérir', score: 3 }] },
      { text: 'Dans ton enfance, as-tu dû "gérer" les émotions d\'un parent (anxiété, tristesse, colère) plus que l\'inverse ?', options: [{ text: 'Non, j\'étais l\'enfant, pas le parent émotionnel de la maison', score: 0 }, { text: 'Un peu, occasionnellement', score: 1 }, { text: 'Oui, régulièrement je m\'occupais de son état émotionnel', score: 2 }, { text: 'Oui, c\'était presque mon rôle principal dans la famille', score: 3 }] },
      { text: 'Les personnes qui t\'attirent le plus ont souvent un point commun : elles sont...', options: [{ text: 'Fiables et cohérentes dans leurs actes', score: 0 }, { text: 'Intéressantes, sans trait particulier récurrent', score: 1 }, { text: 'Un peu inaccessibles émotionnellement, ça m\'intrigue', score: 2 }, { text: 'Difficiles à cerner, changeantes — j\'ai besoin de "décoder" la personne', score: 3 }] },
      { text: 'Ce qui te fait rester dans une relation qui ne te rend pas heureux/heureuse, c\'est souvent...', options: [{ text: 'Rien, je pars quand ce n\'est pas sain', score: 0 }, { text: 'L\'espoir que ça s\'améliore, pour un temps raisonnable', score: 1 }, { text: 'La peur de perdre "l\'alchimie" qu\'on ne retrouve pas ailleurs', score: 2 }, { text: 'Un sentiment de familiarité si fort qu\'il l\'emporte sur tout, même la souffrance', score: 3 }] },
      { text: 'Quand tu compares "ce qui te fait du bien" et "ce qui te fait vibrer" chez tes partenaires...', options: [{ text: 'Les deux vont ensemble, naturellement', score: 0 }, { text: 'Les deux sont presque toujours alignés', score: 1 }, { text: 'Ce sont souvent deux personnes différentes', score: 2 }, { text: 'Ce qui me fait vibrer et ce qui me fait du bien ne se sont presque jamais rencontrés', score: 3 }] },
      { text: 'As-tu déjà entendu (de proches, d\'un thérapeute) que tu choisis "toujours le même type" de partenaire ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Une remarque isolée, sans plus', score: 1 }, { text: 'Oui, plusieurs proches me l\'ont fait remarquer', score: 2 }, { text: 'Oui, c\'est une remarque récurrente, et je sais qu\'ils ont raison', score: 3 }] },
      { text: 'Si tu devais nommer honnêtement ce que tu recherches inconsciemment chez un(e) partenaire, ce serait plutôt...', options: [{ text: 'Quelqu\'un qui m\'apporte de la stabilité et de la réciprocité', score: 0 }, { text: 'Un mélange de stabilité et d\'un peu de mystère', score: 1 }, { text: 'Quelqu\'un que je dois convaincre, rassurer ou "gagner"', score: 2 }, { text: 'Quelqu\'un qui recrée exactement ce sentiment familier de mon enfance, même si je sais que c\'est douloureux', score: 3 }] },
      { text: 'Aujourd\'hui, si tu pouvais changer une seule chose dans ta façon de choisir un(e) partenaire, ce serait...', options: [{ text: 'Rien, je suis déjà aligné(e) avec ce qui est sain pour moi', score: 0 }, { text: 'Rester un peu plus attentif/attentive aux détails au début', score: 1 }, { text: 'Apprendre à ressentir de l\'attirance pour la stabilité, pas seulement l\'intensité', score: 2 }, { text: 'Tout — je sais que je reproduis un schéma et je ne sais pas encore comment en sortir', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '🌱', title: 'Un choix qui te ressemble', message: 'Tes réponses montrent que tu choisis surtout en fonction de ce qui est bon pour toi sur la durée — pas seulement de ce qui te fait vibrer sur l\'instant. Ça ne veut pas dire que tu ne ressens jamais d\'attirance intense, mais elle ne prend pas le pas sur ta sécurité et ton bien-être. Continue à faire confiance à ce discernement : c\'est rare, et ça se construit.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🌤️', title: 'Le schéma effleure, sans t\'emporter', message: 'Dans l\'ensemble, tu choisis plutôt bien — mais certaines réponses montrent qu\'un vieux réflexe refait surface par moments, en particulier face à quelqu\'un de trop disponible ou trop stable. Repérer le moment précis où l\'ennui s\'installe face à la stabilité est la clé pour ne pas le laisser diriger tes choix.', color: 'text-teal-400', glowColor: '#2dd4bf' },
      { min: 40, max: 60, emoji: '🔄', title: 'Un schéma qui commence à se répéter', message: 'Un schéma se dessine clairement dans tes réponses : une attirance qui revient pour des personnes distantes, imprévisibles, ou pour qui tu dois beaucoup donner avant de recevoir. Ce n\'est pas un défaut de caractère — c\'est probablement une dynamique apprise très tôt. Une fois nommé, ce schéma perd une grande partie de son pouvoir automatique.', color: 'text-amber-400', glowColor: '#fbbf24' },
      { min: 60, max: 80, emoji: '🧩', title: 'Le même scénario, un autre visage', message: 'Tes réponses dessinent un schéma net : tu es attiré(e) de façon récurrente par des personnes émotionnellement indisponibles, chaotiques, ou qui ont besoin d\'être sauvées — et tu t\'y investis pleinement, parfois au prix de toi-même. Ce n\'est pas figé — ce que tu as appris à ressentir comme "de l\'amour", tu peux apprendre à le redéfinir.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 80, max: 101, emoji: '🪞', title: 'Un schéma profondément ancré', message: 'Le schéma est profondément ancré : tes réponses montrent une attirance quasi systématique pour l\'indisponibilité, l\'instabilité ou le rôle de sauveur/sauveuse. Ce n\'est ni une fatalité ni un jugement sur qui tu es. Ce genre de schéma se transforme, souvent avec l\'aide d\'un accompagnement centré sur l\'attachement — et l\'avoir vu aussi clairement aujourd\'hui est déjà un pas immense.', color: 'text-rose-400', glowColor: '#fb7185' },
    ],
  },
  // ─── QUIZ 13 : BURNOUT ────────────────────────────────────────────────────
  {
    slug: 'burnout',
    title: 'Ton corps t\'envoie un signal d\'alarme que tu ignores ?',
    subtitle: 'Les symptômes du burnout avant qu\'il soit trop tard',
    description: '30 questions pour identifier si tu es en état de burnout ou en voie de l\'être.',
    emoji: '💤',
    gradientFrom: 'from-slate-950/80',
    gradientTo: 'to-gray-950/80',
    borderColor: 'border-slate-800/30',
    accentColor: '#64748b',
    questions: [
      { text: 'Est-ce que tu te réveilles déjà épuisé(e) même après une nuit de sommeil complète ?', options: [{ text: 'Non, je me réveille généralement reposé(e)', score: 0 }, { text: 'Parfois des matins difficiles', score: 1 }, { text: 'Souvent, le sommeil ne me repose plus', score: 2 }, { text: 'Toujours, la fatigue est permanente', score: 3 }] },
      { text: 'As-tu perdu l\'enthousiasme pour ton travail ou tes activités ?', options: [{ text: 'Non, je suis toujours motivé(e)', score: 0 }, { text: 'Un peu moins qu\'avant mais ça va', score: 1 }, { text: 'Souvent, la motivation est très basse', score: 2 }, { text: 'Complètement, plus aucun enthousiasme', score: 3 }] },
      { text: 'Est-ce que tu ressens du cynisme ou une indifférence croissante envers ton travail ?', options: [{ text: 'Non, je m\'y investis sincèrement', score: 0 }, { text: 'Quelques moments de lassitude', score: 1 }, { text: 'Souvent, beaucoup de choses me semblent sans intérêt', score: 2 }, { text: 'Tout me semble vain, je n\'y crois plus', score: 3 }] },
      { text: 'Est-ce que tu as du mal à te concentrer ou à terminer des tâches simples ?', options: [{ text: 'Non, ma concentration est normale', score: 0 }, { text: 'Parfois un peu dispersé(e)', score: 1 }, { text: 'Souvent, je dois me forcer pour terminer des tâches banales', score: 2 }, { text: 'Toujours, la moindre tâche me semble insurmontable', score: 3 }] },
      { text: 'Est-ce que tu te sens émotionnellement détaché(e) de ce que tu fais ?', options: [{ text: 'Non, je reste impliqué(e)', score: 0 }, { text: 'Un peu de distance parfois', score: 1 }, { text: 'Souvent, je fais les choses mécaniquement', score: 2 }, { text: 'Complètement, je me sens un robot', score: 3 }] },
      { text: 'Est-ce que ta productivité a significativement baissé ?', options: [{ text: 'Non, je suis efficace', score: 0 }, { text: 'Légèrement moins efficace', score: 1 }, { text: 'Nettement moins performant(e)', score: 2 }, { text: 'Très basse, et ça m\'inquiète', score: 3 }] },
      { text: 'As-tu des manifestations physiques (maux de tête, tensions, douleurs) liées au stress ?', options: [{ text: 'Non, je suis en bonne forme', score: 0 }, { text: 'Quelques tensions passagères', score: 1 }, { text: 'Régulièrement des symptômes physiques', score: 2 }, { text: 'Tous les jours, mon corps souffre du stress', score: 3 }] },
      { text: 'Est-ce que la simple idée d\'aller travailler te pèse énormément ?', options: [{ text: 'Non, j\'y vais volontiers', score: 0 }, { text: 'Parfois un peu d\'appréhension', score: 1 }, { text: 'Souvent une résistance forte', score: 2 }, { text: 'Toujours, c\'est un effort immense chaque jour', score: 3 }] },
      { text: 'As-tu l\'impression que tes efforts ne sont jamais reconnus ni récompensés ?', options: [{ text: 'Non, je me sens valorisé(e)', score: 0 }, { text: 'Parfois moins de reconnaissance que souhaité', score: 1 }, { text: 'Souvent mes efforts semblent ignorés', score: 2 }, { text: 'Jamais de reconnaissance, quoi que je fasse', score: 3 }] },
      { text: 'Est-ce que tu as du mal à déconnecter du travail pendant tes temps libres ?', options: [{ text: 'Non, je déconnecte bien', score: 0 }, { text: 'Parfois des pensées liées au travail le soir', score: 1 }, { text: 'Souvent impossible de ne pas y penser', score: 2 }, { text: 'Toujours, le travail occupe même mes rêves', score: 3 }] },
      { text: 'Est-ce que tu irrites ou t\'énerves plus facilement qu\'avant ?', options: [{ text: 'Non, je suis stable émotionnellement', score: 0 }, { text: 'Un peu plus sensible aux petites choses', score: 1 }, { text: 'Souvent irritable pour un rien', score: 2 }, { text: 'Très irritable, ça affecte mes relations', score: 3 }] },
      { text: 'As-tu perdu l\'intérêt pour des activités qui te passionnaient avant ?', options: [{ text: 'Non, mes passions restent vivantes', score: 0 }, { text: 'Quelques activités délaissées temporairement', score: 1 }, { text: 'Beaucoup de choses ne m\'intéressent plus', score: 2 }, { text: 'Plus rien ne me donne envie', score: 3 }] },
      { text: 'Est-ce que tu manges moins bien ou tu as des troubles du sommeil ?', options: [{ text: 'Non, mes habitudes sont stables', score: 0 }, { text: 'Quelques légères perturbations', score: 1 }, { text: 'Des changements notables dans mes habitudes', score: 2 }, { text: 'Sommeil très perturbé et alimentation chaotique', score: 3 }] },
      { text: 'As-tu l\'impression d\'être "vide" ou sans énergie en fin de journée ?', options: [{ text: 'Non, j\'ai encore de l\'énergie', score: 0 }, { text: 'Parfois une fatigue normale', score: 1 }, { text: 'Souvent épuisé(e) dès 18h', score: 2 }, { text: 'Toujours à plat dès le milieu de journée', score: 3 }] },
      { text: 'Est-ce que tu as réduit tes contacts sociaux parce que tu manques d\'énergie ?', options: [{ text: 'Non, ma vie sociale est normale', score: 0 }, { text: 'Légèrement moins de sorties', score: 1 }, { text: 'Souvent, j\'évite les interactions pour me préserver', score: 2 }, { text: 'Je me suis isolé(e), plus d\'énergie pour personne', score: 3 }] },
      { text: 'As-tu le sentiment que le travail t\'a volé ta personnalité ou ta joie de vivre ?', options: [{ text: 'Non, je reste moi-même', score: 0 }, { text: 'Un peu submergé(e) parfois', score: 1 }, { text: 'Souvent, je ne reconnais plus la personne que j\'étais', score: 2 }, { text: 'Complètement, je suis une coquille vide', score: 3 }] },
      { text: 'Est-ce que tu remets à demain des tâches que tu faisais facilement avant ?', options: [{ text: 'Non, je suis organisé(e)', score: 0 }, { text: 'Parfois de la procrastination', score: 1 }, { text: 'Souvent, je repousse tout', score: 2 }, { text: 'Tout s\'accumule, je suis paralysé(e)', score: 3 }] },
      { text: 'Est-ce que tu pleures ou tu ressens une tristesse intense sans raison précise ?', options: [{ text: 'Non, mon humeur est stable', score: 0 }, { text: 'Quelques moments de baisse de moral', score: 1 }, { text: 'Souvent une tristesse qui surgit', score: 2 }, { text: 'Des pleurs fréquents que je ne contrôle pas', score: 3 }] },
      { text: 'Est-ce que tu as du mal à prendre des décisions même simples ?', options: [{ text: 'Non, je décide facilement', score: 0 }, { text: 'Parfois j\'hésite plus', score: 1 }, { text: 'Souvent la décision me semble impossible', score: 2 }, { text: 'Je suis paralysé(e) face aux décisions', score: 3 }] },
      { text: 'Quelqu\'un dans ton entourage t\'a-t-il exprimé de l\'inquiétude pour toi ?', options: [{ text: 'Non, tout le monde me trouve bien', score: 0 }, { text: 'Une remarque passagère', score: 1 }, { text: 'Plusieurs personnes ont manifesté leur inquiétude', score: 2 }, { text: 'Tout mon entourage s\'inquiète pour moi', score: 3 }] },
      { text: 'As-tu eu des pensées de tout abandonner, de fuir ou de disparaître ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Un fantasme de vacances prolongées', score: 1 }, { text: 'Souvent l\'envie de tout lâcher', score: 2 }, { text: 'Des pensées très intenses d\'échapper à tout', score: 3 }] },
      { text: 'Est-ce que ton système immunitaire semble affaibli (maladies fréquentes) ?', options: [{ text: 'Non, je suis rarement malade', score: 0 }, { text: 'Quelques maladies saisonnières', score: 1 }, { text: 'Plus souvent malade que d\'habitude', score: 2 }, { text: 'Malade très souvent depuis quelque temps', score: 3 }] },
      { text: 'Est-ce que tu te remets difficilement des week-ends ou des vacances ?', options: [{ text: 'Non, le repos me régénère', score: 0 }, { text: 'Le retour est parfois difficile', score: 1 }, { text: 'Le repos ne suffit plus à me récupérer', score: 2 }, { text: 'Même après des vacances je suis épuisé(e)', score: 3 }] },
      { text: 'Dans l\'ensemble, est-ce que ton équilibre vie pro/vie perso est complètement déréglé ?', options: [{ text: 'Non, j\'ai un bon équilibre', score: 0 }, { text: 'Légèrement déséquilibré', score: 1 }, { text: 'Oui, le professionnel envahit tout', score: 2 }, { text: 'Je n\'ai plus de vie personnelle du tout', score: 3 }] },
      { text: 'As-tu consulté un médecin ou un professionnel pour des symptômes liés au stress ?', options: [{ text: 'Non, je n\'en ai pas eu besoin', score: 0 }, { text: 'J\'y ai pensé mais pas encore', score: 1 }, { text: 'J\'en ai parlé à un médecin', score: 2 }, { text: 'Oui, et les résultats confirment un état préoccupant', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '😌', title: 'Épuisement passager', message: 'Tu présentes peu de signes de burnout. La fatigue que tu ressens semble normale. Prends soin de toi et veillez à maintenir un bon équilibre.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '😓', title: 'Fatigue accumulée', message: 'Tu accumules de la fatigue et certains signaux méritent attention. C\'est le bon moment pour réévaluer ta charge de travail et prendre soin de toi avant que ça empire.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Pré-burnout', message: 'Tu es dans une zone de vulnérabilité. Les signes de pré-burnout sont présents. Agis maintenant : parles-en à un médecin, allège ta charge et priorise ton bien-être.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Burnout en cours', message: 'Tes réponses correspondent à un état de burnout avancé. C\'est une urgence de santé. Consulte un médecin ou un professionnel de santé mentale le plus vite possible.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '🆘', title: 'Burnout sévère', message: 'Tes symptômes sont très intenses et correspondent à un burnout sévère. Tu as besoin d\'aide immédiatement. Ne reste pas seul(e) avec ça — parle à un médecin maintenant.', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
  // ─── QUIZ 14 : DÉPRESSION ─────────────────────────────────────────────────
  {
    slug: 'depression',
    title: 'Ce que tu ressens chaque matin, c\'est normal ou pas ?',
    subtitle: 'La frontière entre la tristesse et quelque chose de plus grave',
    description: '30 questions pour identifier si tu présentes des signes qui méritent une attention médicale.',
    emoji: '😔',
    gradientFrom: 'from-indigo-950/80',
    gradientTo: 'to-blue-950/80',
    borderColor: 'border-indigo-800/30',
    accentColor: '#6366f1',
    questions: [
      { text: 'Est-ce que tu te sens triste ou vide la plupart du temps ?', options: [{ text: 'Non, mon humeur est généralement positive', score: 0 }, { text: 'Parfois une mélancolie passagère', score: 1 }, { text: 'Souvent, une tristesse s\'est installée', score: 2 }, { text: 'Presque tout le temps, une tristesse profonde', score: 3 }] },
      { text: 'As-tu perdu l\'intérêt pour des choses que tu aimais faire avant ?', options: [{ text: 'Non, mes passions me passionnent toujours', score: 0 }, { text: 'Moins d\'enthousiasme pour certaines choses', score: 1 }, { text: 'La plupart de mes centres d\'intérêt m\'indiffèrent', score: 2 }, { text: 'Rien ne m\'intéresse ou ne me donne de plaisir', score: 3 }] },
      { text: 'Est-ce que tu te sens sans énergie ou fatigué(e) en permanence ?', options: [{ text: 'Non, j\'ai de l\'énergie', score: 0 }, { text: 'Parfois fatigué(e) sans raison', score: 1 }, { text: 'Souvent épuisé(e) même sans effort', score: 2 }, { text: 'Toujours, un épuisement total permanent', score: 3 }] },
      { text: 'As-tu des difficultés à te concentrer ou à prendre des décisions simples ?', options: [{ text: 'Non, ma concentration est bonne', score: 0 }, { text: 'Légèrement moins concentré(e)', score: 1 }, { text: 'Souvent du mal à me concentrer', score: 2 }, { text: 'Impossible de me concentrer sur quoi que ce soit', score: 3 }] },
      { text: 'Est-ce que ton sommeil est perturbé (trop peu ou trop) ?', options: [{ text: 'Non, je dors normalement', score: 0 }, { text: 'Quelques nuits difficiles', score: 1 }, { text: 'Souvent des troubles du sommeil', score: 2 }, { text: 'Mon sommeil est complètement déréglé', score: 3 }] },
      { text: 'Est-ce que ton appétit a changé (trop peu ou trop manger) ?', options: [{ text: 'Non, j\'ai un appétit normal', score: 0 }, { text: 'Quelques variations légères', score: 1 }, { text: 'Des changements notables dans mes habitudes alimentaires', score: 2 }, { text: 'Je mange très peu ou de façon compulsive', score: 3 }] },
      { text: 'As-tu des pensées négatives récurrentes sur toi-même ?', options: [{ text: 'Non, j\'ai une bonne estime de moi', score: 0 }, { text: 'Parfois des doutes normaux', score: 1 }, { text: 'Souvent des pensées négatives sur ma valeur', score: 2 }, { text: 'Constamment, je me sens nul(le) ou sans valeur', score: 3 }] },
      { text: 'Est-ce que tu pleures souvent sans raison apparente ?', options: [{ text: 'Non, rarement', score: 0 }, { text: 'Quelques larmes lors de moments sensibles', score: 1 }, { text: 'Souvent des pleurs que je ne comprends pas', score: 2 }, { text: 'Plusieurs fois par jour, sans pouvoir m\'arrêter', score: 3 }] },
      { text: 'As-tu du mal à ressentir de la joie ou du plaisir même dans des moments positifs ?', options: [{ text: 'Non, je ressens du bonheur normalement', score: 0 }, { text: 'Parfois moins de plaisir', score: 1 }, { text: 'Souvent incapable de vraiment profiter', score: 2 }, { text: 'Rien ne me procure de plaisir', score: 3 }] },
      { text: 'Est-ce que tu t\'es isolé(e) de tes amis ou ta famille ?', options: [{ text: 'Non, je maintiens mes relations sociales', score: 0 }, { text: 'Quelques sorties annulées', score: 1 }, { text: 'Souvent, j\'évite les autres', score: 2 }, { text: 'Je ne vois presque plus personne', score: 3 }] },
      { text: 'As-tu eu des pensées que la vie ne vaut pas la peine ou de ne plus être là ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Un passage fugace très rare', score: 1 }, { text: 'Parfois ces pensées surgissent', score: 2 }, { text: 'Souvent, et ça m\'effraye', score: 3 }] },
      { text: 'Est-ce que tu as du mal à commencer des tâches ou à sortir du lit ?', options: [{ text: 'Non, je me lève facilement', score: 0 }, { text: 'Quelques matins difficiles', score: 1 }, { text: 'Souvent, un effort considérable pour me lever', score: 2 }, { text: 'Presque impossible de sortir du lit certains jours', score: 3 }] },
      { text: 'Est-ce que tu ressens une culpabilité ou honte excessive ?', options: [{ text: 'Non, je ne me blame pas inutilement', score: 0 }, { text: 'Parfois des remords', score: 1 }, { text: 'Souvent, je me sens coupable de tout', score: 2 }, { text: 'Un sentiment de honte profond et constant', score: 3 }] },
      { text: 'Est-ce que ton corps se sent lourd ou lent à réagir ?', options: [{ text: 'Non, je me sens normal', score: 0 }, { text: 'Parfois une lenteur inhabituelle', score: 1 }, { text: 'Souvent, tout me semble difficile physiquement', score: 2 }, { text: 'Mon corps semble ne plus répondre normalement', score: 3 }] },
      { text: 'As-tu du mal à voir un avenir positif pour toi ?', options: [{ text: 'Non, j\'ai des projets et de l\'espoir', score: 0 }, { text: 'Parfois pessimiste', score: 1 }, { text: 'Souvent, l\'avenir me semble sombre', score: 2 }, { text: 'Je n\'arrive pas à imaginer un avenir positif', score: 3 }] },
      { text: 'Est-ce que ta douleur émotionnelle se manifeste physiquement (maux de tête, douleurs) ?', options: [{ text: 'Non, pas de manifestation physique', score: 0 }, { text: 'Quelques douleurs légères liées au stress', score: 1 }, { text: 'Souvent des douleurs inexpliquées', score: 2 }, { text: 'Des douleurs physiques constantes sans cause médicale', score: 3 }] },
      { text: 'Est-ce que tu as diminué ton hygiène de vie ou personnelle ?', options: [{ text: 'Non, je prends soin de moi', score: 0 }, { text: 'Quelques jours moins soigné(e)', score: 1 }, { text: 'Souvent, les efforts de base me semblent inutiles', score: 2 }, { text: 'Mon hygiène et mes soins sont très négligés', score: 3 }] },
      { text: 'Est-ce que tu ressens un sentiment de désespoir ou d\'impuissance ?', options: [{ text: 'Non, je me sens capable d\'agir', score: 0 }, { text: 'Parfois une impression de blocage', score: 1 }, { text: 'Souvent, une impression que rien ne peut changer', score: 2 }, { text: 'Constamment, tout me semble sans issue', score: 3 }] },
      { text: 'Est-ce que ton humeur déprimée dure depuis plus de deux semaines ?', options: [{ text: 'Non, ça passe assez vite', score: 0 }, { text: 'Une à deux semaines parfois', score: 1 }, { text: 'Plusieurs semaines', score: 2 }, { text: 'Depuis plusieurs mois', score: 3 }] },
      { text: 'Tes proches ont-ils remarqué un changement dans ton humeur ou comportement ?', options: [{ text: 'Non, tout le monde me trouve normal(e)', score: 0 }, { text: 'Quelques remarques légères', score: 1 }, { text: 'Plusieurs personnes s\'inquiètent', score: 2 }, { text: 'Tout le monde est préoccupé par mon état', score: 3 }] },
      { text: 'As-tu eu recours à l\'alcool, aux drogues ou à d\'autres substances pour te sentir mieux ?', options: [{ text: 'Non, jamais', score: 0 }, { text: 'Un verre de plus pour décompresser parfois', score: 1 }, { text: 'Oui, j\'utilise des substances pour fuir', score: 2 }, { text: 'Oui, c\'est devenu un besoin régulier', score: 3 }] },
      { text: 'As-tu l\'impression d\'être un fardeau pour tes proches ?', options: [{ text: 'Non, je sais que j\'ai de la valeur pour eux', score: 0 }, { text: 'Parfois cette pensée surgit', score: 1 }, { text: 'Souvent, je préférerais ne pas leur causer de soucis', score: 2 }, { text: 'Toujours, je pense qu\'ils seraient mieux sans moi', score: 3 }] },
      { text: 'Est-ce que les petites choses quotidiennes te demandent un effort immense ?', options: [{ text: 'Non, les routines me viennent naturellement', score: 0 }, { text: 'Parfois un peu plus d\'effort', score: 1 }, { text: 'Souvent, les gestes simples semblent lourds', score: 2 }, { text: 'Tout est épuisant, même les choses les plus simples', score: 3 }] },
      { text: 'Dans l\'ensemble, est-ce que tu te sens bien dans ta peau et dans ta vie ?', options: [{ text: 'Oui, globalement bien', score: 0 }, { text: 'Des hauts et des bas', score: 1 }, { text: 'Souvent mal dans ma peau', score: 2 }, { text: 'Non, je souffre profondément et constamment', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '💚', title: 'Humeur normale', message: 'Tu ne présentes pas de signes significatifs de dépression. Les difficultés que tu traverses semblent situationnelles et normales. Prends soin de toi.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '💙', title: 'Légère tristesse', message: 'Quelques signes méritent attention. Parle à quelqu\'un de confiance et prends soin de ton équilibre. Si les symptômes persistent, consulte un professionnel.', color: 'text-blue-400', glowColor: '#60a5fa' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Signes dépressifs présents', message: 'Plusieurs symptômes correspondent à un état dépressif. Ce n\'est pas une faiblesse. Consulte un médecin ou un psychologue pour être accompagné(e). Tu mérites du soutien.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Épisode dépressif possible', message: 'Tes réponses indiquent un épisode dépressif significatif. Il est important de consulter un professionnel de santé mentale. Tu n\'as pas à affronter ça seul(e).', color: 'text-violet-400', glowColor: '#a78bfa' },
      { min: 80, max: 101, emoji: '🆘', title: 'Consulte un professionnel', message: 'Tes symptômes sont très intenses. Parles-en à un médecin ou un psychologue maintenant. En cas de pensées de ne plus être là, contacte immédiatement le 3114 (numéro national de prévention du suicide).', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
  // ─── QUIZ 15 : VRAI AMOUR ─────────────────────────────────────────────────
  {
    slug: 'vrai-amour',
    title: 'Ce que tu vis, c\'est de l\'amour ou juste de l\'attachement ?',
    subtitle: 'Beaucoup confondent les deux — et le payent cher',
    description: '30 questions pour savoir si ce que tu ressens est un amour véritable et durable.',
    emoji: '❤️‍🔥',
    gradientFrom: 'from-red-950/80',
    gradientTo: 'to-rose-950/80',
    borderColor: 'border-red-800/30',
    accentColor: '#e11d48',
    questions: [
      { text: 'Est-ce que tu penses à cette personne spontanément tout au long de la journée ?', options: [{ text: 'Non, pas particulièrement', score: 0 }, { text: 'Parfois, comme pour tout le monde', score: 1 }, { text: 'Souvent, elle occupe naturellement mes pensées', score: 2 }, { text: 'Constamment, elle est dans chaque moment de ma journée', score: 3 }] },
      { text: 'Est-ce que son bonheur est aussi important que le tien ?', options: [{ text: 'Non, mes besoins passent d\'abord', score: 0 }, { text: 'Parfois, selon les situations', score: 1 }, { text: 'Souvent, je veux qu\'il/elle soit heureux/heureuse', score: 2 }, { text: 'Toujours, son bonheur est une priorité sincère pour moi', score: 3 }] },
      { text: 'Est-ce que tu l\'aimes avec ses défauts, pas seulement ses qualités ?', options: [{ text: 'Je ne l\'ai pas encore vu(e) avec ses défauts', score: 0 }, { text: 'J\'essaie de les accepter', score: 1 }, { text: 'Oui, ses imperfections font partie de ce que j\'aime', score: 2 }, { text: 'Oui, je l\'aime entièrement pour ce qu\'il/elle est vraiment', score: 3 }] },
      { text: 'Est-ce que tu imagines ta vie future avec cette personne à long terme ?', options: [{ text: 'Non, je vis au jour le jour', score: 0 }, { text: 'Parfois une image floue', score: 1 }, { text: 'Souvent des projections positives', score: 2 }, { text: 'Toujours, je la vois dans mon avenir le plus lointain', score: 3 }] },
      { text: 'Est-ce que tu te sens plus toi-même avec cette personne qu\'avec n\'importe qui d\'autre ?', options: [{ text: 'Non, je joue un rôle avec elle', score: 0 }, { text: 'À peu près autant qu\'avec mes autres proches', score: 1 }, { text: 'Oui, je me sens libéré(e) d\'être moi-même', score: 2 }, { text: 'Totalement, c\'est la seule personne avec qui je suis pleinement moi', score: 3 }] },
      { text: 'Est-ce que tu ressens une envie sincère de la soutenir dans ses projets ?', options: [{ text: 'Pas particulièrement', score: 0 }, { text: 'Normalement, comme pour un ami', score: 1 }, { text: 'Oui, son succès me tient à cœur', score: 2 }, { text: 'Profondément, je ferais tout pour l\'aider à réussir', score: 3 }] },
      { text: 'Est-ce que son absence te manque physiquement et émotionnellement ?', options: [{ text: 'Non, je m\'y habitue facilement', score: 0 }, { text: 'Un peu, comme pour quelqu\'un d\'important', score: 1 }, { text: 'Souvent, son absence crée un vide réel', score: 2 }, { text: 'Profondément, son absence me pèse tout le temps', score: 3 }] },
      { text: 'Est-ce que tu acceptes ses zones d\'ombre et ses blessures passées ?', options: [{ text: 'Je n\'en suis pas encore là', score: 0 }, { text: 'J\'essaie mais c\'est parfois difficile', score: 1 }, { text: 'Oui, je comprends d\'où vient son histoire', score: 2 }, { text: 'Totalement, son passé fait partie de qui il/elle est', score: 3 }] },
      { text: 'Est-ce que tu ressens une paix et une sécurité dans cette relation ?', options: [{ text: 'Non, c\'est souvent tendu', score: 0 }, { text: 'Parfois, selon les moments', score: 1 }, { text: 'Souvent, je me sens en sécurité', score: 2 }, { text: 'Toujours, c\'est la relation la plus apaisante que j\'aie eue', score: 3 }] },
      { text: 'Est-ce que tu respectes profondément qui cette personne est ?', options: [{ text: 'Pas vraiment', score: 0 }, { text: 'Globalement, malgré quelques réserves', score: 1 }, { text: 'Oui, j\'ai un respect sincère pour elle', score: 2 }, { text: 'Profondément, je la respecte dans toutes ses dimensions', score: 3 }] },
      { text: 'Est-ce que cette relation te donne envie d\'être une meilleure version de toi-même ?', options: [{ text: 'Non, ça ne change rien', score: 0 }, { text: 'Un peu, elle m\'inspire parfois', score: 1 }, { text: 'Souvent, sa présence m\'élève', score: 2 }, { text: 'Toujours, je veux être meilleur(e) pour moi et pour lui/elle', score: 3 }] },
      { text: 'Est-ce que tu as confiance en cette personne profondément ?', options: [{ text: 'Non, j\'ai des doutes importants', score: 0 }, { text: 'Partiellement', score: 1 }, { text: 'Oui, une confiance solide', score: 2 }, { text: 'Totalement, sans réserve', score: 3 }] },
      { text: 'Est-ce que tu arrives à communiquer honnêtement sur tes vrais sentiments ?', options: [{ text: 'Non, je garde tout pour moi', score: 0 }, { text: 'Parfois avec difficulté', score: 1 }, { text: 'Souvent, la communication est ouverte', score: 2 }, { text: 'Toujours, c\'est la relation la plus honnête que j\'aie eue', score: 3 }] },
      { text: 'Est-ce que tu ressens de la fierté quand tu parles de cette personne aux autres ?', options: [{ text: 'Non, pas particulièrement', score: 0 }, { text: 'Un peu', score: 1 }, { text: 'Oui, j\'aime parler d\'elle', score: 2 }, { text: 'Enormément, je suis fier/fière d\'elle', score: 3 }] },
      { text: 'Est-ce que vos valeurs fondamentales sont alignées ?', options: [{ text: 'Non, on est très différents', score: 0 }, { text: 'Quelques points communs', score: 1 }, { text: 'Largement alignés', score: 2 }, { text: 'Profondément en accord sur ce qui compte vraiment', score: 3 }] },
      { text: 'Est-ce que tu éprouves une attraction qui va bien au-delà du physique ?', options: [{ text: 'Non, c\'est principalement physique', score: 0 }, { text: 'Un peu des deux', score: 1 }, { text: 'Oui, sa personnalité m\'attire autant', score: 2 }, { text: 'Profondément, l\'attirance est totale et profonde', score: 3 }] },
      { text: 'Est-ce que vous traversez les difficultés ensemble plutôt que de vous diviser ?', options: [{ text: 'Non, les problèmes nous séparent', score: 0 }, { text: 'Ça dépend des situations', score: 1 }, { text: 'Souvent, on fait équipe', score: 2 }, { text: 'Toujours, les épreuves nous soudent', score: 3 }] },
      { text: 'Est-ce que tu ressens que cette relation est différente de toutes celles que tu as eues ?', options: [{ text: 'Non, ça me semble assez similaire', score: 0 }, { text: 'Un peu différente', score: 1 }, { text: 'Oui, distinctement différente', score: 2 }, { text: 'Totalement, c\'est la première fois que je ressens quelque chose d\'aussi fort', score: 3 }] },
      { text: 'Est-ce que tu veux encore lui parler et le/la voir même après avoir passé du temps ensemble ?', options: [{ text: 'Non, je sature assez vite', score: 0 }, { text: 'Parfois', score: 1 }, { text: 'Souvent, le temps avec lui/elle semble trop court', score: 2 }, { text: 'Toujours, on ne se lasse jamais vraiment l\'un de l\'autre', score: 3 }] },
      { text: 'Est-ce que tu penses à lui/elle positivement plutôt que par anxiété ou obsession ?', options: [{ text: 'Surtout de l\'anxiété ou obsession', score: 0 }, { text: 'Un mélange des deux', score: 1 }, { text: 'Principalement des pensées positives', score: 2 }, { text: 'Toujours des pensées chaleureuses et sereines', score: 3 }] },
      { text: 'Est-ce que cette relation apporte de la joie et de la sérénité dans ta vie globalement ?', options: [{ text: 'Non, plutôt des soucis', score: 0 }, { text: 'Quelques bons moments', score: 1 }, { text: 'Souvent, elle est une source de bonheur', score: 2 }, { text: 'Toujours, c\'est la chose la plus belle dans ma vie', score: 3 }] },
      { text: 'Est-ce que tu aimes cette personne librement, sans avoir besoin de la changer ?', options: [{ text: 'Non, je voudrais qu\'elle change sur beaucoup de points', score: 0 }, { text: 'Quelques petites choses que j\'aimerais différentes', score: 1 }, { text: 'Oui, je l\'accepte largement comme elle est', score: 2 }, { text: 'Totalement, je ne voudrais rien changer en elle', score: 3 }] },
      { text: 'Est-ce que son rire ou sa présence te réchauffe le cœur ?', options: [{ text: 'Non, pas particulièrement', score: 0 }, { text: 'Un peu', score: 1 }, { text: 'Souvent oui, sa présence me fait du bien', score: 2 }, { text: 'Toujours, sa simple présence me rend heureux/heureuse', score: 3 }] },
      { text: 'Dans ton cœur le plus profond, est-ce que tu sais que tu l\'aimes vraiment ?', options: [{ text: 'Non, je ne suis pas sûr(e)', score: 0 }, { text: 'Je pense, mais avec des doutes', score: 1 }, { text: 'Oui, je le crois sincèrement', score: 2 }, { text: 'Oui, sans aucun doute, je le sais', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '🤍', title: 'Attraction sans amour', message: 'Ce que tu ressens semble davantage de l\'attraction ou de l\'attachement que de l\'amour véritable. C\'est déjà beau, mais l\'amour profond comporte d\'autres dimensions encore à explorer.', color: 'text-zinc-400', glowColor: '#a1a1aa' },
      { min: 20, max: 40, emoji: '💛', title: 'Affection sincère', message: 'Tu ressens une affection sincère et des sentiments réels. C\'est un beau début. L\'amour peut grandir et s\'approfondir avec le temps et l\'engagement mutuel.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '🧡', title: 'Amour naissant', message: 'Tes sentiments ont les contours d\'un amour véritable. La profondeur est là, elle se consolide. Prends soin de cette relation, elle a un beau potentiel.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '❤️', title: 'Amour véritable', message: 'Ce que tu ressens correspond aux caractéristiques d\'un amour véritable. Respect, confiance, soutien mutuel — les bases sont solides. Chéris cette relation.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '❤️‍🔥', title: 'Amour profond et rare', message: 'Ce que tu décris est un amour profond et authentique. Une connexion rare qui mérite d\'être protégée et cultivée chaque jour. Tu as trouvé quelque chose de précieux.', color: 'text-rose-400', glowColor: '#fb7185' },
    ],
  },
  // ─── QUIZ 16 : STYLE D'ATTACHEMENT ───────────────────────────────────────────
  {
    slug: 'style-attachement',
    title: 'Ton style d\'attachement révèle tout sur tes relations',
    subtitle: 'Sécure, anxieux, évitant — lequel es-tu vraiment ?',
    description: '12 questions pour identifier ton style d\'attachement et comprendre pourquoi tes relations se passent comme elles se passent.',
    emoji: '🫀',
    gradientFrom: 'from-indigo-950/80',
    gradientTo: 'to-violet-950/80',
    borderColor: 'border-indigo-800/30',
    accentColor: '#6366f1',
    questions: [
      { text: 'Quand ton/ta partenaire ne répond pas pendant plusieurs heures, tu...', options: [{ text: 'Penses à autre chose naturellement', score: 0 }, { text: 'Vérifies ton téléphone une ou deux fois', score: 1 }, { text: 'Commences à imaginer le pire', score: 2 }, { text: 'Envoies plusieurs messages pour avoir une réponse', score: 3 }] },
      { text: 'La proximité émotionnelle dans une relation te...', options: [{ text: 'Fait te sentir en sécurité et ancré(e)', score: 0 }, { text: 'Plaît mais tu gardes une part de toi', score: 1 }, { text: 'Rend parfois nerveux/nerveuse', score: 2 }, { text: 'Fait fuir ou te sentir étouffé(e)', score: 3 }] },
      { text: 'Quand une relation se passe bien, tu...', options: [{ text: 'En profites pleinement sans anxiété', score: 0 }, { text: 'Es heureux/heureuse mais tu guettes', score: 1 }, { text: 'T\'attends à ce que ça tourne mal bientôt', score: 2 }, { text: 'Crées de la distance par réflexe', score: 3 }] },
      { text: 'Dans tes relations passées, le schéma répété est...', options: [{ text: 'Des relations stables et durables', score: 0 }, { text: 'Des hauts et des bas mais dans l\'ensemble bien', score: 1 }, { text: 'Beaucoup de peur d\'être abandonné(e)', score: 2 }, { text: 'Une tendance à partir avant d\'être quitté(e)', score: 3 }] },
      { text: 'Face à un conflit dans ta relation, tu...', options: [{ text: 'En parles calmement pour trouver une solution', score: 0 }, { text: 'Exprimes ton malaise, parfois avec intensité', score: 1 }, { text: 'Deviens très anxieux/anxieuse et insistant(e)', score: 2 }, { text: 'Préfères t\'isoler plutôt qu\'en parler', score: 3 }] },
      { text: 'Exprimer tes besoins affectifs à quelqu\'un, c\'est...', options: [{ text: 'Naturel et nécessaire pour toi', score: 0 }, { text: 'Possible mais un peu difficile', score: 1 }, { text: 'Très difficile, tu as peur du rejet', score: 2 }, { text: 'Quelque chose que tu évites au maximum', score: 3 }] },
      { text: 'Quand ton/ta partenaire veut du temps seul(e), tu...', options: [{ text: 'Respectes complètement son espace', score: 0 }, { text: 'Acceptes en faisant attention à toi', score: 1 }, { text: 'Te demandes si c\'est un rejet', score: 2 }, { text: 'Te sens soulagé(e) d\'avoir de la distance', score: 3 }] },
      { text: 'Faire confiance à quelqu\'un dans une relation, pour toi c\'est...', options: [{ text: 'Quelque chose qui se donne assez naturellement', score: 0 }, { text: 'Possible mais ça prend du temps', score: 1 }, { text: 'Très difficile, tu as souvent été déçu(e)', score: 2 }, { text: 'Quelque chose que tu ne fais jamais vraiment', score: 3 }] },
      { text: 'Quand ton/ta partenaire sort avec des amis sans toi, tu...', options: [{ text: 'Profites de ton temps de ton côté', score: 0 }, { text: 'Es content(e) mais tu penses à lui/elle', score: 1 }, { text: 'Te demandes ce qu\'il/elle fait et avec qui', score: 2 }, { text: 'Ressens un malaise ou une envie de te retirer', score: 3 }] },
      { text: 'Si tu devais décrire ta relation idéale, ce serait...', options: [{ text: 'Un équilibre entre sécurité et liberté', score: 0 }, { text: 'Une relation très proche et fusionnelle', score: 1 }, { text: 'Quelque chose d\'intense mais tu as peur de le perdre', score: 2 }, { text: 'Quelque chose de léger sans trop d\'engagement', score: 3 }] },
      { text: 'Quand quelqu\'un te montre de l\'affection ou de la tendresse, tu...', options: [{ text: 'Accueilles ça chaleureusement', score: 0 }, { text: 'Apprécies mais tu ne sais pas toujours comment répondre', score: 1 }, { text: 'En veux encore plus et tu as peur que ça s\'arrête', score: 2 }, { text: 'Te sens parfois mal à l\'aise ou envahi(e)', score: 3 }] },
      { text: 'Dans l\'ensemble, tu dirais que tes relations amoureuses...', options: [{ text: 'T\'apportent sécurité et épanouissement', score: 0 }, { text: 'Sont globalement bonnes avec quelques tensions', score: 1 }, { text: 'Sont souvent source d\'anxiété et de doutes', score: 2 }, { text: 'Te font souvent te sentir piégé(e) ou incompris(e)', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 22, emoji: '🟢', title: 'Attachement Sécure', message: 'Tu as un style d\'attachement sécure. Tu es à l\'aise avec la proximité et tu peux aussi rester indépendant(e). Tu communiques tes besoins, tu fais confiance sans anxiété excessive. C\'est le style le plus sain — et le plus rare.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 22, max: 44, emoji: '🟡', title: 'Attachement Anxieux', message: 'Tu as tendance vers un style d\'attachement anxieux. Tu t\'investis énormément dans tes relations mais tu as souvent peur d\'être abandonné(e). Tu cherches beaucoup de réassurance. La bonne nouvelle : c\'est le style le plus travaillable.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 44, max: 66, emoji: '🔵', title: 'Attachement Évitant', message: 'Tu as un style d\'attachement évitant. Tu valorises ton indépendance au point de créer de la distance émotionnelle, souvent sans le vouloir. Tu as appris à ne compter que sur toi-même. La connexion profonde est possible, mais ça demande un travail sur soi.', color: 'text-blue-400', glowColor: '#60a5fa' },
      { min: 66, max: 101, emoji: '🔴', title: 'Attachement Désorganisé', message: 'Tu as des traits d\'attachement désorganisé (ou craintif-évitant). Tu veux la proximité mais elle te fait peur. Tu peux alterner entre chercher l\'amour et t\'en éloigner. C\'est souvent lié à des blessures passées. Un suivi thérapeutique peut transformer ça.', color: 'text-red-400', glowColor: '#f87171' },
    ],
  },
  // ─── QUIZ 17 : LANGAGES DE L'AMOUR ───────────────────────────────────────────
  {
    slug: 'langages-amour',
    title: 'Quel est ton vrai langage de l\'amour ?',
    subtitle: 'Celui que ton/ta partenaire ne parle peut-être pas',
    description: '10 questions pour découvrir comment tu donnes et reçois l\'amour — et pourquoi tu te sens parfois incompris(e).',
    emoji: '💌',
    gradientFrom: 'from-pink-950/80',
    gradientTo: 'to-rose-950/80',
    borderColor: 'border-pink-800/30',
    accentColor: '#ec4899',
    questions: [
      { text: 'Ce qui te touche le plus dans une relation amoureuse, c\'est...', options: [{ text: 'Les caresses, les câlins, le contact physique', score: 0 }, { text: 'Les mots tendres et les compliments sincères', score: 1 }, { text: 'Passer du temps de qualité ensemble, sans distraction', score: 2 }, { text: 'Quand il/elle fait quelque chose concrètement pour toi', score: 3 }] },
      { text: 'Tu te sens le plus aimé(e) quand...', options: [{ text: 'Ton/ta partenaire t\'embrasse ou te prend la main spontanément', score: 0 }, { text: 'Il/Elle te dit "je suis fier/fière de toi" ou "tu es incroyable"', score: 1 }, { text: 'Il/Elle met son téléphone de côté pour être 100% présent(e)', score: 2 }, { text: 'Il/Elle prépare le repas ou règle un problème à ta place', score: 3 }] },
      { text: 'Tu te sens le moins aimé(e) quand...', options: [{ text: 'Il n\'y a plus de contact physique entre vous', score: 0 }, { text: 'Ton/ta partenaire ne te complimente plus ou est froid(e) dans ses mots', score: 1 }, { text: 'Vos soirées sont sur écrans séparés sans vraie connexion', score: 2 }, { text: 'Tout repose sur toi et il/elle ne s\'implique jamais concrètement', score: 3 }] },
      { text: 'Le geste le plus romantique que quelqu\'un puisse faire pour toi...', options: [{ text: 'Un massage surprise après une longue journée', score: 0 }, { text: 'Un message vocal pour te dire à quel point tu comptes', score: 1 }, { text: 'Déconnecter du monde entier pour une journée juste avec toi', score: 2 }, { text: 'Régler ce problème qui te stressait depuis des semaines', score: 3 }] },
      { text: 'Après une dispute, tu te réconcilies le mieux avec...', options: [{ text: 'Un long câlin qui efface tout', score: 0 }, { text: 'Des mots sincères qui reconnaissent la douleur de l\'autre', score: 1 }, { text: 'Du temps de qualité partagé en silence ou en discutant calmement', score: 2 }, { text: 'Un geste concret — préparer quelque chose, aider à quelque chose', score: 3 }] },
      { text: 'Quand tu n\'es pas bien, ce dont tu as le plus besoin...', options: [{ text: 'Être tenu(e) dans les bras de ton/ta partenaire', score: 0 }, { text: 'Qu\'on te dise que tu es fort(e) et qu\'on te soutient', score: 1 }, { text: 'Qu\'on soit là, présent(e), sans forcément parler', score: 2 }, { text: 'Qu\'on prenne en charge quelque chose pour te soulager', score: 3 }] },
      { text: 'Ce qui te dérange le plus chez un(e) partenaire, c\'est...', options: [{ text: 'Quelqu\'un de distant physiquement, peu tactile', score: 0 }, { text: 'Quelqu\'un qui ne te dit jamais ce qu\'il/elle ressent ou pense de toi', score: 1 }, { text: 'Quelqu\'un toujours sur son téléphone, jamais vraiment là', score: 2 }, { text: 'Quelqu\'un qui ne fait jamais rien concrètement pour toi', score: 3 }] },
      { text: 'Lors d\'une belle soirée en amoureux, ce qui la rendrait parfaite...', options: [{ text: 'Rester enlacé(e)s toute la nuit', score: 0 }, { text: 'Qu\'il/elle te dise les mots qui font vraiment du bien', score: 1 }, { text: 'Une vraie conversation profonde, présents l\'un pour l\'autre', score: 2 }, { text: 'Qu\'il/elle ait tout organisé pour toi, dans les moindres détails', score: 3 }] },
      { text: 'Montrer de l\'amour à quelqu\'un, pour toi c\'est...', options: [{ text: 'Le toucher, lui donner de l\'affection physique', score: 0 }, { text: 'Lui écrire, lui dire verbalement ce que tu ressens', score: 1 }, { text: 'Être complètement présent(e) quand vous êtes ensemble', score: 2 }, { text: 'Agir — faire des choses pour lui simplifier la vie', score: 3 }] },
      { text: 'Si ton/ta partenaire avait un budget illimité pour toi, ce que tu préférerais...', options: [{ text: 'Un weekend spa juste pour se retrouver corps à corps', score: 0 }, { text: 'Une lettre manuscrite + une déclaration devant les gens que tu aimes', score: 1 }, { text: 'Une semaine sans téléphone, juste tous les deux au bout du monde', score: 2 }, { text: 'Qu\'il/elle règle ce gros problème qui te pèse depuis longtemps', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 8, emoji: '🤝', title: 'Toucher Physique', message: 'Ton langage de l\'amour principal, c\'est le toucher physique. Les câlins, la proximité corporelle, les caresses — c\'est comme ça que tu te sens aimé(e) et que tu aimes. Sans ça, même avec les plus beaux mots, tu te sens distant(e). Assure-toi que ton/ta partenaire le sache.', color: 'text-rose-400', glowColor: '#fb7185' },
      { min: 8, max: 17, emoji: '💬', title: 'Mots d\'Affirmation', message: 'Ton langage de l\'amour, c\'est les mots d\'affirmation. Les compliments, les déclarations, les messages tendres — les mots ont un poids immense pour toi. Un "je suis fier(e) de toi" peut faire ta journée. Le silence ou la froideur verbale te blesse profondément.', color: 'text-violet-400', glowColor: '#a78bfa' },
      { min: 17, max: 25, emoji: '⏳', title: 'Temps de Qualité', message: 'Ton langage de l\'amour, c\'est le temps de qualité. Être ensemble vraiment — présents, sans distraction — c\'est ce qui compte le plus. Tu ne veux pas juste être dans la même pièce : tu veux une vraie connexion. Quand ton/ta partenaire est là à 100%, tu te sens pleinement aimé(e).', color: 'text-cyan-400', glowColor: '#22d3ee' },
      { min: 25, max: 101, emoji: '🛠️', title: 'Actes de Service', message: 'Ton langage de l\'amour, c\'est les actes de service. Quand quelqu\'un fait quelque chose concrètement pour toi — cuisine, règle un problème, s\'occupe d\'un truc qui te stressait — tu te sens profondément aimé(e). Pour toi, l\'amour ne se dit pas, il se prouve.', color: 'text-emerald-400', glowColor: '#10b981' },
    ],
  },
  // ─── QUIZ 18 : GASLIGHTING ────────────────────────────────────────────────────
  {
    slug: 'gaslight',
    title: 'Est-ce que ton/ta partenaire te fait douter de toi ?',
    subtitle: 'Ce qu\'on t\'a peut-être appris à normaliser',
    description: '12 questions pour détecter si tu es victime de manipulation psychologique dans ta relation.',
    emoji: '🫧',
    gradientFrom: 'from-violet-950/80',
    gradientTo: 'to-purple-950/80',
    borderColor: 'border-violet-800/30',
    accentColor: '#7c3aed',
    questions: [
      { text: 'Ton/ta partenaire nie avoir dit ou fait des choses que tu as clairement vécues...', options: [{ text: 'Jamais — il/elle reconnaît les faits', score: 0 }, { text: 'Très rarement, et ça se clarifie vite', score: 1 }, { text: 'Parfois, et ça me laisse confus(e)', score: 2 }, { text: 'Souvent, au point que je doute de ma mémoire', score: 3 }] },
      { text: 'Il/Elle dit que tu es "trop sensible" ou "excessif/excessive" quand tu exprimes tes émotions...', options: [{ text: 'Non, mes émotions sont validées', score: 0 }, { text: 'Rarement, dans des moments de stress', score: 1 }, { text: 'Souvent, j\'ai appris à minimiser ce que je ressens', score: 2 }, { text: 'Toujours, je ne sais plus si mes réactions sont normales', score: 3 }] },
      { text: 'Tu t\'excuses souvent dans cette relation, parfois sans savoir exactement pourquoi...', options: [{ text: 'Non, mes excuses ont toujours une raison claire', score: 0 }, { text: 'Parfois par habitude relationnelle', score: 1 }, { text: 'Souvent, pour désamorcer la tension', score: 2 }, { text: 'Tout le temps, même quand ce n\'est pas ma faute', score: 3 }] },
      { text: 'Tu remets en question ta propre version des événements après avoir parlé avec lui/elle...', options: [{ text: 'Non, ma perception reste stable', score: 0 }, { text: 'Parfois, si la discussion est convaincante', score: 1 }, { text: 'Souvent, je finis par croire que j\'avais tort', score: 2 }, { text: 'Systématiquement, sa version remplace toujours la mienne', score: 3 }] },
      { text: 'Tu te sens moins sûr(e) de toi et plus confus(e) qu\'avant cette relation...', options: [{ text: 'Non, cette relation me renforce', score: 0 }, { text: 'Légèrement, peut-être pour d\'autres raisons', score: 1 }, { text: 'Oui, clairement depuis que je suis avec lui/elle', score: 2 }, { text: 'Énormément, je ne me reconnais plus vraiment', score: 3 }] },
      { text: 'Il/Elle minimise ou tourne en dérision tes émotions, tes peurs ou tes besoins...', options: [{ text: 'Jamais, il/elle prend mes ressentis au sérieux', score: 0 }, { text: 'Rarement', score: 1 }, { text: 'Parfois, au point que j\'évite d\'en parler', score: 2 }, { text: 'Régulièrement, je me sens stupide de ressentir ce que je ressens', score: 3 }] },
      { text: 'Tu as l\'impression que les faits changent selon ce dont il/elle a besoin pour avoir raison...', options: [{ text: 'Non, il/elle est honnête sur les faits', score: 0 }, { text: 'Parfois, mais ça peut s\'expliquer par sa mémoire', score: 1 }, { text: 'Souvent, l\'histoire de nos disputes est réécrite', score: 2 }, { text: 'Toujours, les faits deviennent ce qui l\'arrange', score: 3 }] },
      { text: 'Tu marches sur des œufs pour éviter de provoquer sa réaction...', options: [{ text: 'Non, je me sens libre d\'être moi-même', score: 0 }, { text: 'Légèrement sur certains sujets', score: 1 }, { text: 'Souvent, je surveille ce que je dis', score: 2 }, { text: 'En permanence, j\'anticipe chaque réaction', score: 3 }] },
      { text: 'Il/Elle utilise tes proches, tes amis ou ta famille pour valider sa version contre la tienne...', options: [{ text: 'Jamais', score: 0 }, { text: 'Très rarement', score: 1 }, { text: 'Cela m\'est arrivé quelques fois', score: 2 }, { text: 'Oui, il/elle s\'assure que les autres croient sa version', score: 3 }] },
      { text: 'Quand tu exposes ton ressenti, il/elle détourne la conversation vers ses propres blessures...', options: [{ text: 'Non, il/elle écoute et répond à ce que je dis', score: 0 }, { text: 'Parfois, mais ce n\'est pas systématique', score: 1 }, { text: 'Souvent, mes ressentis finissent toujours par parler de lui/elle', score: 2 }, { text: 'Toujours, c\'est moi qui finis par le/la consoler', score: 3 }] },
      { text: 'Tu te demandes parfois si tu es "fou/folle" ou si tu vois les choses de façon irrationnelle...', options: [{ text: 'Non, je me fais confiance', score: 0 }, { text: 'Très rarement', score: 1 }, { text: 'Parfois, ça m\'arrive à cause de ses réactions', score: 2 }, { text: 'Souvent, cette idée revient régulièrement', score: 3 }] },
      { text: 'Dans l\'ensemble, cette relation te fait-elle te sentir diminué(e), confus(e) ou inférieur(e) ?', options: [{ text: 'Non, elle me fait me sentir fort(e)', score: 0 }, { text: 'Un peu, mais c\'est peut-être moi', score: 1 }, { text: 'Oui, clairement elle m\'affaiblit', score: 2 }, { text: 'Profondément, je ne suis plus qui j\'étais', score: 3 }] },
    ],
    resultTiers: [
      { min: 0, max: 20, emoji: '✅', title: 'Relation saine', message: 'Aucun signe de manipulation psychologique détecté. Tu sembles dans une relation où ta perception de la réalité est respectée. Continue à faire confiance à tes ressentis — c\'est une force.', color: 'text-emerald-400', glowColor: '#10b981' },
      { min: 20, max: 40, emoji: '🤔', title: 'Quelques signaux d\'alerte', message: 'Quelques comportements méritent attention. Ils peuvent venir du stress ou de mauvaises habitudes de communication. Mais si ces schémas se répètent, parles-en directement — ou à un professionnel.', color: 'text-yellow-400', glowColor: '#facc15' },
      { min: 40, max: 60, emoji: '⚠️', title: 'Manipulation probable', message: 'Plusieurs signes de manipulation psychologique sont présents. Tu remets en question ta propre réalité à cause de lui/elle. C\'est le début d\'un gaslighting. Tu mérites quelqu\'un qui renforce ta confiance, pas qui l\'érode.', color: 'text-orange-400', glowColor: '#fb923c' },
      { min: 60, max: 80, emoji: '🚨', title: 'Gaslighting avéré', message: 'Tes réponses indiquent clairement un gaslighting en cours. Tu doutes de toi, de ta mémoire, de tes émotions — non pas parce que tu as tort, mais parce qu\'on te conditionne à douter. Ce n\'est pas de l\'amour. Parles-en à quelqu\'un de confiance.', color: 'text-red-400', glowColor: '#f87171' },
      { min: 80, max: 101, emoji: '🆘', title: 'Situation critique', message: 'Ce que tu décris est une manipulation psychologique grave. Tu es peut-être si habitué(e) à douter de toi que tu ne réalises plus à quel point ça a changé qui tu es. Tu mérites mieux. Contacte un professionnel ou une ligne d\'aide dès que possible.', color: 'text-red-500', glowColor: '#ef4444' },
    ],
  },
];

export function getAllQuizzes(): Quiz[] {
  return quizzes;
}

export function selectQuestions(questions: QuizQuestion[], session: QuizSession = {}): QuizQuestion[] {
  const untagged = questions.filter((q) => !q.tags);
  const tagged = questions.filter((q) => !!q.tags);

  // Le plafond "25 universelles + 5 personnalisées" ne concerne QUE les quiz
  // à pool de questions taguées (amoureux, vrais-amis...) — pour tous les
  // autres (aucune question taguée), on affiche l'intégralité du set fixe,
  // sinon un quiz à 30 questions se retrouvait tronqué à 25 sans raison.
  if (tagged.length === 0) return untagged;

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
