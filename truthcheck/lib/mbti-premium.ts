// ── Données MBTI PAYANTES — SERVEUR UNIQUEMENT ──────────────────────────────
// ⚠️ Ne JAMAIS importer ce fichier depuis un composant 'use client' ni depuis
// tout module que du code client importe, même indirectement. Il ne doit
// être utilisé que par : routes API (après vérification serveur du paiement/
// tier), pages serveur (RSC), scripts d'email/cron. Toute importation client
// ferait fuiter le contenu payant des 16 types dans le bundle JS public,
// consultable sans payer via les devtools. Texte identique à l'original
// (extraction programmatique vérifiée octet par octet depuis lib/mbti.ts).

export interface MbtiTypePremium {
  fullDesc: string;
  inLove: string;
  atWork: string;
  strengths: string[];
  weaknesses: string[];
  growth: string;
  famousExamples: string[];
  compatibleWith: string[];
}

export const mbtiTypesPremium: Record<string, MbtiTypePremium> = {
  "INTJ": {
    "fullDesc": "Les INTJ représentent une combinaison rare : l'intuition d'un visionnaire et la rigueur d'un stratège. Tu fonctionnes avec des systèmes mentaux complexes que peu de gens comprennent. Tu es capable d'anticiper des problèmes que les autres n'ont pas encore vus, et tu élabores des plans pour les résoudre bien avant qu'ils se manifestent. Cette capacité de prévision te rend redoutablement efficace — mais parfois incompris(e) de ton entourage.",
    "inLove": "En amour, l'INTJ cherche un(e) partenaire intellectuellement stimulant(e) qui respecte son besoin d'indépendance. Tu n'es pas démonstratif(ve) mais tes actes valent mille mots affectueux. Tu peux sembler froid(e), mais ta loyauté est totale envers ceux que tu choisis. Tu as du mal à exprimer tes émotions verbalement et tu préfères les montrer à travers tes actions et ton engagement.",
    "atWork": "Au travail, l'INTJ excelle dans les postes qui exigent vision à long terme et autonomie. Tu es fait(e) pour diriger des projets complexes, pas pour des réunions sans fin. Tu produis ton meilleur travail quand on te fait confiance et qu'on te laisse de la marge. Les environnements bureaucratiques t'étouffent.",
    "strengths": [
      "Pensée stratégique à long terme",
      "Capacité à résoudre des problèmes complexes",
      "Autonomie et autodiscipline",
      "Confiance en ses propres analyses",
      "Efficacité et orientation résultats"
    ],
    "weaknesses": [
      "Tendance à l'arrogance intellectuelle",
      "Difficulté à exprimer ses émotions",
      "Impatience envers les \"moins rapides\"",
      "Rigidité face aux plans qui changent",
      "Isolement social par choix"
    ],
    "growth": "Ton plus grand défi : accepter que l'intelligence émotionnelle est aussi une forme d'intelligence. Apprends à valoriser les contributions des autres même quand leur raisonnement est différent du tien. Exprime tes sentiments — pas parce que c'est nécessaire à ta survie, mais parce que ça enrichit ta vie et tes relations.",
    "famousExamples": [
      "Elon Musk",
      "Nikola Tesla",
      "Friedrich Nietzsche",
      "Isaac Newton",
      "Mark Zuckerberg"
    ],
    "compatibleWith": [
      "ENFP",
      "ENTP",
      "INFJ",
      "INFP"
    ]
  },
  "INTP": {
    "fullDesc": "Les INTP sont les philosophes et théoriciens du spectre. Tu as un don naturel pour voir les incohérences dans les systèmes de pensée que les autres tiennent pour acquis. Ta curiosité intellectuelle n'a pas de limites — tu peux passer d'un sujet à un autre en suivant le fil de ta logique interne, accumulant des connaissances dans des domaines très variés. Tu valorises la vérité au-dessus de tout, y compris au-dessus du confort social.",
    "inLove": "En amour, tu cherches une connexion intellectuelle profonde avant tout. Sans stimulation mentale, une relation t'ennuie rapidement. Tu peux sembler absent(e) ou distant(e), mais c'est souvent parce que ton esprit est ailleurs — pas parce que tu t'en fiches. Tu as du mal avec les attentes émotionnelles non formulées.",
    "atWork": "Tu brilles dans les domaines qui exigent pensée originale : sciences, tech, philosophie, recherche. Tu trouves la routine étouffante mais tu es capable de te concentrer pendant des heures sur ce qui t'intéresse. Tu travailles mieux seul(e) et tu préfères les idées aux procédures.",
    "strengths": [
      "Pensée analytique hors pair",
      "Créativité dans la résolution de problèmes",
      "Objectivité radicale",
      "Apprentissage rapide et autodidacte",
      "Ouverture à remettre en question ses propres croyances"
    ],
    "weaknesses": [
      "Procrastination chronique",
      "Difficulté à finaliser les projets",
      "Insensibilité involontaire",
      "Tendance à trop analyser les décisions simples",
      "Négligence des besoins pratiques quotidiens"
    ],
    "growth": "Ton défi principal est de passer de la réflexion à l'action. Tes idées méritent d'exister dans le monde réel, pas seulement dans ta tête. Apprends aussi à reconnaître les besoins émotionnels des autres — pas parce que c'est logique, mais parce que les relations humaines ont leur propre forme de richesse.",
    "famousExamples": [
      "Albert Einstein",
      "Bill Gates",
      "Blaise Pascal",
      "René Descartes",
      "Larry Page"
    ],
    "compatibleWith": [
      "ENTJ",
      "ESTJ",
      "INFJ",
      "ENFJ"
    ]
  },
  "ENTJ": {
    "fullDesc": "Les ENTJ sont rarissimes parmi les personnes qui atteignent réellement leurs ambitions démesurées. Tu combines vision à long terme, capacité d'exécution et magnétisme naturel. Tu vois chaque défi comme une opportunité d'optimisation. Tu es à l'aise pour prendre des décisions difficiles et tu n'attends pas le consensus pour avancer. Cette énergie fait de toi un(e) leader redoutable — mais parfois un(e) partenaire ou ami(e) épuisant(e).",
    "inLove": "En amour, tu cherches quelqu'un qui partage tes ambitions et qui peut te tenir tête intellectuellement. Tu n'as aucune patience pour les jeux ou l'ambiguïté. Tu es direct(e) — parfois trop — mais ta loyauté envers ton partenaire est absolue. Tu dois apprendre à ralentir et à laisser de l'espace à l'autre.",
    "atWork": "Tu es dans ton élément en position de leadership. PDG, entrepreneur, direction de projets : tu te nourris de responsabilités et de défis complexes. Tu peux avoir du mal à déléguer parce que tu sais que tu ferais mieux. Apprends à faire confiance à ton équipe.",
    "strengths": [
      "Vision stratégique exceptionnelle",
      "Capacité de décision sous pression",
      "Énergie et motivation contagieuses",
      "Efficacité dans l'exécution",
      "Pensée à grande échelle"
    ],
    "weaknesses": [
      "Impatience avec les autres",
      "Tendance à dominer les conversations",
      "Difficulté à reconnaître ses erreurs",
      "Manque d'empathie apparent",
      "Exigences irréalistes envers les autres"
    ],
    "growth": "Tu dois apprendre que diriger ne signifie pas tout contrôler. Les meilleures équipes naissent de la confiance, pas de la domination. Développe ton empathie — elle te rendra non seulement plus humain(e), mais aussi plus efficace.",
    "famousExamples": [
      "Napoleon Bonaparte",
      "Gordon Ramsay",
      "Sheryl Sandberg",
      "Jack Welch",
      "Franklin Roosevelt"
    ],
    "compatibleWith": [
      "INTP",
      "INFP",
      "ISTP",
      "INTJ"
    ]
  },
  "ENTP": {
    "fullDesc": "Les ENTP vivent dans le monde des idées et des possibilités. Tu as une capacité unique à voir les problèmes sous des angles inattendus et à générer des solutions originales que personne d'autre n'aurait pensé. Tu t'ennuies vite avec la routine et tu as besoin de stimulation intellectuelle constante. Tu peux débattre des deux côtés d'un argument avec une égale aisance — ce qui t'amuse, mais peut dérouter les autres.",
    "inLove": "En amour, tu cherches quelqu'un qui peut te suivre intellectuellement et qui aime autant que toi les échanges stimulants. Tu fuis l'ennui et la prévisibilité. Tu as besoin d'un(e) partenaire qui te challenge sans te juger. Tu peux parfois débattre dans les moments où l'autre a besoin d'empathie.",
    "atWork": "Tu es fait(e) pour l'entrepreneuriat, le conseil, la création, ou tout domaine qui récompense la pensée originale. Tu excelles dans les phases de brainstorming et de démarrage, mais tu peux perdre de l'intérêt une fois que les idées passent à l'exécution routinière.",
    "strengths": [
      "Pensée créative et originale",
      "Capacité à voir les systèmes sous tous les angles",
      "Charisme et capacité à convaincre",
      "Adaptabilité intellectuelle",
      "Humour et vivacité d'esprit"
    ],
    "weaknesses": [
      "Difficulté à finir ce qu'on commence",
      "Tendance à l'arrogance intellectuelle",
      "Insensibilité aux émotions des autres",
      "Procrastination sur les tâches routinières",
      "Débat parfois pour le plaisir de débattre"
    ],
    "growth": "Apprends à reconnaître quand les autres ont besoin d'être écoutés, pas challengés. Toutes les conversations ne sont pas des débats. Travaille aussi ta persévérance : tes meilleures idées méritent d'être menées jusqu'au bout.",
    "famousExamples": [
      "Thomas Edison",
      "Leonardo da Vinci",
      "Benjamin Franklin",
      "Steve Jobs",
      "Voltaire"
    ],
    "compatibleWith": [
      "INFJ",
      "INTJ",
      "INFP",
      "ENFP"
    ]
  },
  "INFJ": {
    "fullDesc": "L'INFJ est souvent décrit comme le type \"paradoxal\" : introverti(e) mais capable d'une connexion humaine profonde, idéaliste mais pragmatique dans l'action, créatif(ve) mais organisé(e). Tu as une rare capacité à percevoir les dynamiques sous-jacentes dans les relations et les groupes — parfois avant même que les concernés s'en rendent compte. Cette intuition peut être un don extraordinaire ou une source d'épuisement selon comment tu l'utilises.",
    "inLove": "En amour, tu cherches la connexion profonde ou rien. Le small talk et les relations superficielles t'épuisent. Quand tu aimes, tu aimes totalement et tu peux avoir tendance à t'oublier toi-même pour l'autre. Ton plus grand défi : poser des limites sans te sentir coupable.",
    "atWork": "Tu excelles dans les métiers qui donnent du sens : psychologie, écriture, conseil, enseignement, accompagnement. Tu as besoin de sentir que ton travail contribue à quelque chose de plus grand. Les environnements compétitifs et cyniques t'épuisent rapidement.",
    "strengths": [
      "Intuition sociale exceptionnelle",
      "Profondeur d'engagement et loyauté",
      "Créativité et vision à long terme",
      "Capacité à comprendre les motivations cachées",
      "Détermination quand une cause le vaut"
    ],
    "weaknesses": [
      "Tendance au perfectionnisme paralysant",
      "Difficulté à poser des limites",
      "Épuisement empathique (absorbe les émotions des autres)",
      "Tendance à l'isolement quand débordé(e)",
      "\"Door slam\" : coupure soudaine des relations toxiques"
    ],
    "growth": "Ton plus grand travail intérieur : apprendre à te mettre en priorité sans culpabilité. Tu ne peux pas verser de l'eau d'une cruche vide. Tes besoins comptent autant que ceux des autres — accepter cela est ta plus grande victoire.",
    "famousExamples": [
      "Martin Luther King",
      "Nelson Mandela",
      "Lady Gaga",
      "Noam Chomsky",
      "Fyodor Dostoïevski"
    ],
    "compatibleWith": [
      "ENFP",
      "ENTP",
      "INFP",
      "INTJ"
    ]
  },
  "INFP": {
    "fullDesc": "Les INFP sont les gardiens de leurs valeurs. Tu vis selon un code moral intérieur très développé et tu n'es pas facilement influençable par les normes sociales. Tu as une riche vie intérieure que tu partages rarement. Tu es capable d'une créativité et d'une sensibilité artistique extraordinaires, mais tu luttes souvent avec le sentiment de ne jamais vraiment appartenir au monde tel qu'il est.",
    "inLove": "En amour, tu es à la fois le partenaire le plus loyal et le plus difficile à satisfaire. Tu cherches une connexion authentique et profonde, pas une relation de confort. Tu as tendance à idéaliser ton/ta partenaire au début, puis à être déçu(e) quand la réalité émerge. Apprends à aimer les êtres réels, imparfaits.",
    "atWork": "Tu t'épanouis dans les métiers créatifs, humanitaires ou qui ont un sens profond. Écriture, art, psychologie, travail social, enseignement. La bureaucratie et les environnements impersonnels t'étouffent. Tu as besoin d'autonomie et de savoir que ton travail change quelque chose.",
    "strengths": [
      "Empathie profonde et authentique",
      "Créativité et pensée originale",
      "Loyauté absolue envers ses valeurs",
      "Capacité à inspirer les autres",
      "Flexibilité et ouverture d'esprit"
    ],
    "weaknesses": [
      "Tendance à l'idéalisation",
      "Hypersensibilité aux critiques",
      "Difficulté à prendre des décisions pratiques",
      "Procrastination émotionnelle",
      "Se prend parfois trop au sérieux"
    ],
    "growth": "Apprends à distinguer ce qui mérite ton investissement émotionnel de ce qui ne le mérite pas. Toutes les causes ne valent pas ton épuisement. Et rappelle-toi : ton bonheur n'est pas un luxe, c'est une nécessité.",
    "famousExamples": [
      "J.R.R. Tolkien",
      "William Shakespeare",
      "Frédéric Chopin",
      "Johnny Depp",
      "Björk"
    ],
    "compatibleWith": [
      "ENFJ",
      "ENTJ",
      "INFJ",
      "ENFP"
    ]
  },
  "ENFJ": {
    "fullDesc": "Les ENFJ sont nés pour connecter et pour guider. Tu comprends instinctivement les motivations et les besoins des gens qui t'entourent, et tu utilises cette compréhension pour les aider à grandir. Tu es souvent le pilier émotionnel de ton entourage — ce qui est une force, mais aussi une source d'épuisement si tu ne prends pas soin de toi.",
    "inLove": "En amour, tu es dévoué(e), attentif(ve) et profondément investi(e). Tu anticipes les besoins de ton partenaire parfois avant même qu'il/elle les exprime. Ton risque : t'oublier toi-même dans la relation. Apprends à recevoir autant que tu donnes.",
    "atWork": "Tu excelles dans les rôles qui impliquent leadership humain, enseignement, coaching, accompagnement ou communication. Tu motives les équipes naturellement et tu crées des environnements où chacun se sent valorisé.",
    "strengths": [
      "Intelligence émotionnelle élevée",
      "Communication naturelle et persuasive",
      "Capacité à fédérer les équipes",
      "Altruisme sincère",
      "Vision et sens de l'organisation"
    ],
    "weaknesses": [
      "Tendance à prendre en charge les problèmes des autres",
      "Difficulté à dire non",
      "Trop grande sensibilité aux conflits",
      "Oubli de ses propres besoins",
      "Idéalisme parfois déconnecté de la réalité"
    ],
    "growth": "Apprends à reconnaître que tu ne peux pas sauver tout le monde, et que ce n'est pas ton rôle. Prends soin de toi avec la même générosité que tu offres aux autres.",
    "famousExamples": [
      "Barack Obama",
      "Oprah Winfrey",
      "Bono",
      "Emma Watson",
      "Malala Yousafzai"
    ],
    "compatibleWith": [
      "INFP",
      "ISFP",
      "INFJ",
      "INTJ"
    ]
  },
  "ENFP": {
    "fullDesc": "Les ENFP sont les catalyseurs du monde. Tu vois le potentiel partout — dans les gens, les idées, les projets — et tu as un enthousiasme naturel qui t'ouvre toutes les portes. Tu peux sembler dispersé(e) aux yeux des autres, mais en réalité tu suis une logique interne riche et cohérente.",
    "inLove": "En amour, tu es passionné(e), romantique et attentif(ve). Tu fuis la routine et tu as besoin d'un(e) partenaire qui te surprend et te stimule. Tu aimes profondément mais tu peux avoir du mal avec la stabilité émotionnelle à long terme.",
    "atWork": "Tu t'épanouis dans les rôles créatifs, relationnels ou entrepreneuriaux. Tu es excellent(e) pour lancer des projets et insuffler de l'énergie à une équipe. L'exécution répétitive t'ennuie vite.",
    "strengths": [
      "Créativité et pensée associative",
      "Empathie et connexion humaine",
      "Adaptabilité",
      "Enthousiasme communicatif",
      "Vision des possibilités"
    ],
    "weaknesses": [
      "Difficulté à finaliser les projets",
      "Hypersensibilité émotionnelle",
      "Procrastination",
      "Trop d'idées, pas assez d'action",
      "Tendance à l'idéalisation des personnes"
    ],
    "growth": "Canalise ton énergie. Choisis 2-3 projets qui comptent vraiment et suis-les jusqu'au bout. Ta puissance réside dans ta capacité à terminer, pas juste à commencer.",
    "famousExamples": [
      "Robin Williams",
      "Walt Disney",
      "Salvador Dali",
      "Quentin Tarantino",
      "Coco Chanel"
    ],
    "compatibleWith": [
      "INFJ",
      "INTJ",
      "ENFJ",
      "ENTJ"
    ]
  },
  "ISTJ": {
    "fullDesc": "Les ISTJ sont les gardiens des traditions et des procédures. Tu respectes les règles établies parce que tu comprends qu'elles existent pour une bonne raison. Tu travailles de façon méthodique et tu détestes les imprévus qui bouleversent ta planification. Ta fiabilité est légendaire — tout le monde sait qu'on peut compter sur toi.",
    "inLove": "En amour, tu es loyal(e) et stable. Tu exprime ton amour à travers des actes concrets plutôt que des grandes déclarations. Tu peux sembler distant(e) émotionnellement, mais ton engagement est profond et durable.",
    "atWork": "Tu excelles dans les rôles qui exigent précision, responsabilité et fiabilité : comptabilité, droit, logistique, médecine, administration. Tu es le/la meilleur(e) pour gérer les systèmes complexes et t'assurer que tout fonctionne correctement.",
    "strengths": [
      "Fiabilité absolue",
      "Sens aigu des responsabilités",
      "Rigueur et précision",
      "Pragmatisme",
      "Capacité à maintenir le cap sur le long terme"
    ],
    "weaknesses": [
      "Résistance au changement",
      "Rigidité dans les opinions",
      "Difficulté à exprimer les émotions",
      "Tendance au surmenage",
      "Jugement parfois trop rapide des autres"
    ],
    "growth": "Le monde change. Ta force est ta fiabilité — mais elle devient une faiblesse si tu refuses de t'adapter. Ouvre-toi à de nouvelles façons de faire, même si elles semblent moins efficaces au départ.",
    "famousExamples": [
      "Angela Merkel",
      "Warren Buffett",
      "Jeff Bezos",
      "Condoleezza Rice",
      "Hermione Granger"
    ],
    "compatibleWith": [
      "ESFP",
      "ESTP",
      "ISFJ",
      "ISFP"
    ]
  },
  "ISFJ": {
    "fullDesc": "Les ISFJ portent le monde sur leurs épaules sans se plaindre. Tu as un sens aigu du devoir envers les autres et tu donnes souvent plus que tu ne reçois. Ta générosité est authentique mais elle peut t'épuiser si tu ne poses pas de limites.",
    "inLove": "En amour, tu es le partenaire idéal pour quelqu'un qui cherche de la stabilité, de la chaleur et de la présence. Tu es attentif(ve) aux besoins de l'autre et tu les anticipes. Ton risque : ne pas exprimer tes propres besoins par peur de déranger.",
    "atWork": "Tu excelles dans les métiers du soin, de l'accompagnement et de l'organisation. Soins infirmiers, enseignement, RH, travail social. Tu es indispensable dans toute équipe, mais tu mérites d'être reconnu(e) à ta juste valeur.",
    "strengths": [
      "Générosité sincère",
      "Attention aux détails et aux besoins des autres",
      "Fiabilité et loyauté",
      "Patience exceptionnelle",
      "Sens de l'organisation"
    ],
    "weaknesses": [
      "Tendance à s'oublier pour les autres",
      "Difficulté à dire non",
      "Trop grande sensibilité aux critiques",
      "Résistance au changement",
      "Tendance à éviter les conflits à tout prix"
    ],
    "growth": "Tes besoins méritent autant d'attention que ceux des autres. Apprends à demander ce dont tu as besoin sans te sentir coupable. La vraie générosité commence par prendre soin de soi.",
    "famousExamples": [
      "Mère Teresa",
      "Kate Middleton",
      "Rosa Parks",
      "Beyoncé",
      "Vin Diesel"
    ],
    "compatibleWith": [
      "ESFP",
      "ESTP",
      "ISTJ",
      "ESTJ"
    ]
  },
  "ESTJ": {
    "fullDesc": "Les ESTJ sont les piliers de la société. Tu crois au travail bien fait, aux règles claires et aux responsabilités assumées. Tu t'es construit(e) à la force du poignet et tu n'as que peu de patience pour ceux qui cherchent des raccourcis.",
    "inLove": "En amour, tu es loyal(e) et tu assumes tes responsabilités. Tu exprimes ton amour à travers des actes concrets et tu attends la même chose en retour. Tu peux parfois être trop rigide — apprends à lâcher prise.",
    "atWork": "Tu es dans ton élément en management, administration, finance, droit, ou tout rôle qui exige organisation et leadership. Tu sais motiver une équipe par l'exemple et l'exigence.",
    "strengths": [
      "Sens de l'organisation et de la planification",
      "Leadership naturel et autorité",
      "Fiabilité et honnêteté",
      "Efficacité dans l'exécution",
      "Sens des responsabilités"
    ],
    "weaknesses": [
      "Rigidité dans les opinions",
      "Difficulté à accepter les méthodes non conventionnelles",
      "Tendance à juger rapidement",
      "Manque d'empathie apparent",
      "Résistance au changement"
    ],
    "growth": "Il existe souvent plusieurs façons d'atteindre un objectif. Ta façon n'est pas toujours la seule bonne. Développe ta tolérance aux approches différentes des tiennes.",
    "famousExamples": [
      "Michelle Obama",
      "Hillary Clinton",
      "Judge Judy",
      "Sonia Sotomayor",
      "Sam Walton"
    ],
    "compatibleWith": [
      "ISFP",
      "ISTP",
      "ISFJ",
      "ISTJ"
    ]
  },
  "ESFJ": {
    "fullDesc": "Les ESFJ sont les ciments sociaux de leurs communautés. Tu t'investis profondément dans les relations et tu as un talent naturel pour créer des environnements où les gens se sentent bienvenus et valorisés.",
    "inLove": "En amour, tu es chaleureux(se), attentif(ve) et profondément investi(e). Tu prends soin de ton/ta partenaire avec enthousiasme. Tu as besoin d'être apprécié(e) et de recevoir autant que tu donnes.",
    "atWork": "Tu excelles dans les rôles de service, de coordination ou de soin : RH, enseignement, soins, événementiel. Tu crées des équipes soudées et tu gardes le moral de tout le monde.",
    "strengths": [
      "Intelligence émotionnelle",
      "Loyauté et dévouement",
      "Sens de l'organisation",
      "Communication empathique",
      "Capacité à créer des liens solides"
    ],
    "weaknesses": [
      "Trop grande dépendance à l'approbation des autres",
      "Difficultés à gérer les critiques",
      "Tendance à éviter les conflits",
      "Rigidité dans les valeurs traditionnelles",
      "Oubli de ses propres besoins"
    ],
    "growth": "Ta valeur ne dépend pas de l'approbation des autres. Apprends à te faire confiance même quand tout le monde n'est pas d'accord avec toi.",
    "famousExamples": [
      "Taylor Swift",
      "Bill Clinton",
      "Jennifer Lopez",
      "Danny Glover",
      "Elton John"
    ],
    "compatibleWith": [
      "ISFP",
      "ISTP",
      "INFP",
      "INFJ"
    ]
  },
  "ISTP": {
    "fullDesc": "Les ISTP sont les artisans du spectre. Tu possèdes une compréhension intuitive des mécanismes — qu'il s'agisse de machines, de systèmes ou de situations humaines. Tu agis avec précision et tu n'utilises jamais deux mots quand un suffit.",
    "inLove": "En amour, tu es loyal(e) mais tu as besoin de beaucoup d'espace. Tu exprimes ton affection à travers des actes pratiques plutôt que des déclarations verbales. Tu peux sembler distant(e) mais c'est ta façon d'être.",
    "atWork": "Tu excelles dans l'ingénierie, la mécanique, les métiers techniques, les arts martiaux, le sport de compétition, la médecine d'urgence. Tu aimes résoudre des problèmes concrets avec des outils réels.",
    "strengths": [
      "Pensée logique et pratique",
      "Calme sous pression extrême",
      "Compréhension intuitive des mécanismes",
      "Adaptabilité",
      "Efficacité dans l'action"
    ],
    "weaknesses": [
      "Difficulté à exprimer ses émotions",
      "Imprévisibilité",
      "Manque d'intérêt pour les règles et la structure",
      "Insensibilité involontaire",
      "Tendance à l'ennui rapide"
    ],
    "growth": "Les relations humaines ont leur propre mécanique. Investis autant de curiosité dans ta vie émotionnelle que dans tes projets techniques.",
    "famousExamples": [
      "Clint Eastwood",
      "Bruce Lee",
      "Michael Jordan",
      "Dalida",
      "Tom Cruise"
    ],
    "compatibleWith": [
      "ESTJ",
      "ESFJ",
      "ENTJ",
      "ENTP"
    ]
  },
  "ISFP": {
    "fullDesc": "Les ISFP portent un monde intérieur riche que peu de gens ont la chance d'explorer. Tu perçois la beauté là où les autres ne la voient pas et tu exprimes tes émotions profondes à travers des créations plutôt que des mots.",
    "inLove": "En amour, tu es tendre, attentif(ve) et tu crées des moments inoubliables. Tu aimes profondément mais tu as du mal à exprimer tes besoins verbalement. Apprends à communiquer ce que tu ressens.",
    "atWork": "Tu t'épanouis dans les arts, le design, la musique, la mode, la gastronomie, les métiers du soin. Tu as besoin d'autonomie créative et d'un environnement qui valorise ta sensibilité.",
    "strengths": [
      "Sensibilité esthétique exceptionnelle",
      "Empathie et gentillesse",
      "Authenticité",
      "Créativité et originalité",
      "Présence dans le moment"
    ],
    "weaknesses": [
      "Évitement des conflits",
      "Difficulté à planifier sur le long terme",
      "Hypersensibilité aux critiques",
      "Tendance à l'isolement en cas de stress",
      "Manque de confiance en soi"
    ],
    "growth": "Ton authenticité est ta plus grande force. Cesse de la minimiser pour plaire aux autres. Le monde a besoin de ce que toi seul(e) peux créer.",
    "famousExamples": [
      "Michael Jackson",
      "Britney Spears",
      "Prince",
      "Lana Del Rey",
      "David Bowie"
    ],
    "compatibleWith": [
      "ESTJ",
      "ESFJ",
      "ENFJ",
      "ENFP"
    ]
  },
  "ESTP": {
    "fullDesc": "Les ESTP sont les acteurs naturels de la vie. Tu lis les situations avec une acuité impressionnante et tu prends des décisions instantanées que les autres mettent des heures à analyser. Tu t'ennuies vite et tu as besoin de stimulation constante.",
    "inLove": "En amour, tu es spontané(e), passionné(e) et tu crées des souvenirs intenses. Tu peux avoir du mal avec les engagements à long terme si la relation manque d'excitation. La routine est ton ennemi.",
    "atWork": "Tu excelles dans les métiers qui exigent réactivité et action : ventes, trading, gestion de crise, entrepreneur, sport professionnel, urgentiste.",
    "strengths": [
      "Réactivité et décision rapide",
      "Charisme naturel",
      "Pragmatisme",
      "Lecture des situations humaines",
      "Résistance au stress"
    ],
    "weaknesses": [
      "Impatience",
      "Prise de risques excessifs",
      "Difficulté à planifier long terme",
      "Insensibilité involontaire",
      "Ennui rapide dans la stabilité"
    ],
    "growth": "L'action sans réflexion crée des chaos. Apprends à faire une pause avant de décider dans les situations à forts enjeux émotionnels.",
    "famousExamples": [
      "Ernest Hemingway",
      "Madonna",
      "Donald Trump",
      "Mike Tyson",
      "Nicolas Sarkozy"
    ],
    "compatibleWith": [
      "ISFJ",
      "ISTJ",
      "INFJ",
      "INTJ"
    ]
  },
  "ESFP": {
    "fullDesc": "Les ESFP vivent intensément dans le présent. Tu t'intéresses aux gens, aux expériences et aux plaisirs sensoriels. Tu as une capacité naturelle à créer des connexions et à mettre tout le monde à l'aise.",
    "inLove": "En amour, tu es passionné(e), attentif(ve) et tu crées une atmosphère de légèreté et de joie. Tu as besoin d'un(e) partenaire qui participe à la vie avec toi, pas qui la regarde.",
    "atWork": "Tu t'épanouis dans la performance, le service, la vente, l'enseignement, les métiers artistiques. Tu as besoin de contact humain et de variété.",
    "strengths": [
      "Don pour créer de la connexion",
      "Adaptabilité et spontanéité",
      "Empathie pratique",
      "Énergie positive contagieuse",
      "Sens de l'esthétique"
    ],
    "weaknesses": [
      "Difficulté avec les projets à long terme",
      "Évitement des situations difficiles",
      "Hypersensibilité",
      "Tendance à l'impulsivité",
      "Concentration parfois insuffisante"
    ],
    "growth": "La profondeur n'exclut pas la joie. Explore aussi les relations et projets qui demandent un investissement dans la durée.",
    "famousExamples": [
      "Marilyn Monroe",
      "Will Smith",
      "Jamie Oliver",
      "Adele",
      "Justin Bieber"
    ],
    "compatibleWith": [
      "ISTJ",
      "ISFJ",
      "INTJ",
      "INFJ"
    ]
  }
};
