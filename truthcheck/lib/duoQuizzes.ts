export interface DuoQuestion {
  text: string;
  options: [string, string, string, string]; // always exactly 4, score 0-3
}

export interface DuoQuiz {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  accentColor: string;
  questions: DuoQuestion[];
}

export const duoQuizzes: DuoQuiz[] = [
  {
    slug: 'duo-communication',
    title: 'Parlez-vous vraiment le même langage ?',
    subtitle: 'Ce que vous vous cachez sans le savoir',
    description: '10 questions pour voir si vous communiquez de la même façon — ou si vous vous parlez sans vraiment vous entendre.',
    emoji: '💬',
    accentColor: '#06b6d4',
    questions: [
      {
        text: 'Quand tu as un problème personnel, tu préfères...',
        options: [
          "Le garder pour toi et t'en sortir seul(e)",
          "Y réfléchir seul(e) avant d'en parler",
          "En parler assez rapidement avec ton/ta partenaire",
          "En faire une priorité et en parler immédiatement",
        ],
      },
      {
        text: 'Lors d\'une dispute, tu as tendance à...',
        options: [
          "Te murer dans le silence jusqu'à ce que ça passe",
          "Prendre du recul avant de reparler",
          "Vouloir régler ça dans les heures qui suivent",
          "Vouloir résoudre ça immédiatement, même si c'est long",
        ],
      },
      {
        text: 'Quand quelque chose te dérange dans la relation, tu...',
        options: [
          "N'en parles souvent pas pour éviter les tensions",
          "En parles si ça revient plusieurs fois",
          "En parles assez rapidement",
          "En parles dès que ça te pèse",
        ],
      },
      {
        text: 'Les mots d\'amour et les compliments, pour toi c\'est...',
        options: [
          "Gênant ou superflu — les actes suffisent",
          "Sympa mais pas essentiel",
          "Important et apprécié régulièrement",
          "Vital — tu en as vraiment besoin souvent",
        ],
      },
      {
        text: 'Quand ton/ta partenaire est de mauvaise humeur, tu...',
        options: [
          "Lui laisses de l'espace et attends que ça passe",
          "Poses une question discrète pour voir si tu peux aider",
          "Essaies de l'égayer activement",
          "Demandes directement ce qui ne va pas et veux en parler",
        ],
      },
      {
        text: 'Une communication saine dans un couple, pour toi c\'est...',
        options: [
          "Se respecter même sans tout se dire",
          "Pouvoir aborder la plupart des sujets",
          "Se dire l'essentiel avec honnêteté",
          "Tout se dire, même les choses difficiles à entendre",
        ],
      },
      {
        text: 'Quand tu n\'es pas disponible, ton/ta partenaire devrait...',
        options: [
          "Ne pas te déranger et attendre",
          "T'envoyer un message seulement si c'est important",
          "Pouvoir te contacter normalement",
          "Rester en contact régulièrement — c'est rassurant",
        ],
      },
      {
        text: 'Après une dispute résolue, tu as besoin de...',
        options: [
          "Passer à autre chose immédiatement",
          "Un peu de temps pour récupérer avant de repenser à ça",
          "Un moment de tendresse pour vraiment se réconcilier",
          "Comprendre ce qui s'est passé et en discuter à fond",
        ],
      },
      {
        text: 'Les non-dits dans un couple, pour toi c\'est...',
        options: [
          "Parfois nécessaire pour préserver la paix",
          "À éviter mais ça arrive à tout le monde",
          "Problématique sur le long terme",
          "Toujours destructeur — il faut tout dire",
        ],
      },
      {
        text: 'Quand ton/ta partenaire exprime une critique sur toi, tu...',
        options: [
          "Te défends ou prends de la distance",
          "Te fermes un peu avant d'y réfléchir seul(e)",
          "Écoutes même si c'est difficile",
          "L'accueilles ouvertement et veux en discuter",
        ],
      },
    ],
  },
  {
    slug: 'duo-compatibilite',
    title: 'Êtes-vous vraiment compatibles ?',
    subtitle: 'Les vraies questions que peu de couples osent se poser',
    description: '10 questions sur ce qui compte vraiment dans la vie — pour voir où vos chemins se croisent et où ils divergent.',
    emoji: '🧩',
    accentColor: '#8b5cf6',
    questions: [
      {
        text: 'L\'argent dans votre couple, ça devrait être...',
        options: [
          "Complètement séparé — chacun ses comptes",
          "Principalement séparé avec quelques dépenses partagées",
          "Partiellement fusionné avec un compte commun",
          "Totalement commun — on met tout en commun",
        ],
      },
      {
        text: 'Ton besoin de temps seul(e) est...',
        options: [
          "Minimal — tu es heureux/heureuse d'être toujours avec lui/elle",
          "Léger — quelques heures par semaine suffisent",
          "Important — tu as besoin de moments réguliers pour toi",
          "Essentiel — tu as besoin de beaucoup d'espace personnel",
        ],
      },
      {
        text: 'Les enfants dans ta vision de l\'avenir, c\'est...',
        options: [
          "Hors de question ou déjà réglé (pas d'enfants)",
          "Incertain — tu n'y as pas encore réfléchi sérieusement",
          "Envisagé — probablement oui mais pas urgent",
          "Certain — c'est quelque chose que tu veux vraiment",
        ],
      },
      {
        text: 'Dans 5 ans, tu te vois...',
        options: [
          "Dans la même ville mais peut-être dans un autre logement",
          "Peut-être dans une autre ville si une opportunité se présente",
          "Ouvert(e) à déménager dans un autre pays si ça fait sens",
          "Prêt(e) à tout changer de lieu de vie pour le bon projet",
        ],
      },
      {
        text: 'Tes ambitions professionnelles actuellement sont...',
        options: [
          "Stables — tu es bien là où tu es et tu veux le maintenir",
          "Modérées — quelques projets mais sans tout sacrifier",
          "Importantes — tu veux progresser et ça prend de la place",
          "Très intenses — ton travail/projet est une priorité centrale",
        ],
      },
      {
        text: 'La religion, la spiritualité ou tes croyances dans ta vie, c\'est...',
        options: [
          "Absent ou sans importance",
          "Présent mais discret, ça t'appartient",
          "Assez important — ça guide certains de tes choix",
          "Central — c'est une part essentielle de qui tu es",
        ],
      },
      {
        text: 'La famille (la tienne ou celle de ton/ta partenaire), ça prend...',
        options: [
          "Peu de place — tu es assez indépendant(e)",
          "Une place normale — des événements réguliers",
          "Une place importante — ils comptent beaucoup pour toi",
          "Une place très grande — la famille passe avant presque tout",
        ],
      },
      {
        text: 'Ton style de vie idéal ressemble à...',
        options: [
          "Calme et routinier — tu aimes la stabilité",
          "Équilibré — des habitudes avec des nouveautés",
          "Actif et social — sorties, rencontres, voyages réguliers",
          "Très dynamique — tu t'ennuies vite et aimes le changement",
        ],
      },
      {
        text: 'L\'intimité physique dans un couple pour toi c\'est...',
        options: [
          "Présente mais secondaire dans la relation",
          "Importante mais pas la priorité",
          "Très importante — c'est un pilier de la relation",
          "Essentielle — c'est un de tes principaux besoins",
        ],
      },
      {
        text: 'Si vous deviez traverser une longue séparation (distance, voyage), tu...',
        options: [
          "Penses que ça se passerait bien — la confiance est là",
          "Penses que ce serait difficile mais gérable",
          "As beaucoup de mal à imaginer ça — tu as besoin de proximité",
          "Penses que ça mettrait vraiment la relation en danger",
        ],
      },
    ],
  },
  {
    slug: 'duo-investissement',
    title: 'Qui de vous deux donne le plus dans cette relation ?',
    subtitle: 'Le déséquilibre que personne ne veut voir',
    description: '10 questions sur votre niveau d\'investissement réel dans la relation — pour voir si la balance est équilibrée ou non.',
    emoji: '⚖️',
    accentColor: '#f97316',
    questions: [
      {
        text: 'À quel point penses-tu à ton/ta partenaire dans ta journée ?',
        options: [
          "Peu — tu as ta vie et il/elle a la sienne",
          "Quand quelque chose te rappelle à lui/elle",
          "Régulièrement, assez souvent",
          "Très souvent — il/elle occupe beaucoup tes pensées",
        ],
      },
      {
        text: 'Quand ton/ta partenaire a besoin de toi, tu es...',
        options: [
          "Présent(e) si c'est vraiment urgent",
          "Disponible selon tes propres contraintes",
          "Là la plupart du temps",
          "Là sans exception — c'est une priorité absolue",
        ],
      },
      {
        text: 'Les efforts pour maintenir la flamme et l\'intimité, tu...',
        options: [
          "Comptes sur l'autre pour les initier",
          "Fais de temps en temps si l'envie est là",
          "Fais régulièrement — c'est important pour toi",
          "Fais constamment — tu veux garder cette relation vivante",
        ],
      },
      {
        text: 'Dans ta liste de priorités quotidiennes, ton/ta partenaire est...',
        options: [
          "Dans le fond — après le travail, tes amis, tes loisirs",
          "Important mais pas toujours en haut de la liste",
          "Souvent parmi tes premières pensées",
          "Toujours en haut — il/elle passe avant beaucoup de choses",
        ],
      },
      {
        text: 'Les compromis dans votre relation, tu...',
        options: [
          "En fais peu — tu ne veux pas perdre ce qui te définit",
          "En fais quand c'est vraiment nécessaire",
          "En fais volontiers pour que ça marche",
          "En fais beaucoup — parfois peut-être trop",
        ],
      },
      {
        text: 'Quand ton/ta partenaire est stressé(e) ou triste, tu...',
        options: [
          "Lui laisses de l'espace — tu n'imposes pas ta présence",
          "Es disponible si il/elle te le demande",
          "Essaies activement de l'aider ou de l'écouter",
          "Mets tout en pause pour être entièrement là pour lui/elle",
        ],
      },
      {
        text: 'Les projets communs (voyages, logement, avenir), tu...',
        options: [
          "Laisses souvent l'autre les initier et organiser",
          "Participes quand c'est proposé",
          "En proposes régulièrement et t'y investis",
          "En es le/la moteur — tu aimes construire ensemble",
        ],
      },
      {
        text: 'L\'évolution personnelle de ton/ta partenaire (ses projets, ses rêves), tu...',
        options: [
          "T'y intéresses peu — chacun sa vie",
          "T'y intéresses quand il/elle en parle",
          "En tiens compte activement dans vos décisions communes",
          "La portes comme si c'était la tienne — son succès est le tien",
        ],
      },
      {
        text: 'Ton/ta partenaire dans tes conversations avec tes amis/famille, tu...',
        options: [
          "En parles rarement",
          "En parles si on te pose des questions",
          "En parles naturellement et assez souvent",
          "En parles beaucoup — il/elle fait partie de tout ce que tu vis",
        ],
      },
      {
        text: 'Si tu devais résumer ton niveau d\'investissement actuel dans cette relation, tu dirais...',
        options: [
          "Présent(e) mais sans tout sacrifier pour ça",
          "Assez investi(e) — tu fais ta part",
          "Très investi(e) — cette relation compte vraiment",
          "Totalement investi(e) — c'est une priorité dans ta vie",
        ],
      },
    ],
  },
  {
    slug: 'duo-resilience',
    title: 'Votre amour survivra-t-il aux épreuves qui viennent ?',
    subtitle: 'La solidité de votre lien mise à nu',
    description: '10 questions sur la résistance de votre relation face aux crises — financières, personnelles, familiales, existentielles.',
    emoji: '🔒',
    accentColor: '#10b981',
    questions: [
      {
        text: 'Si vous deviez traverser une longue distance (séparation géographique), tu penses que...',
        options: [
          "Ça mettrait vraiment la relation en danger",
          "Ce serait difficile et incertain",
          "Ce serait dur mais vous y arriveriez",
          "La confiance est là — vous survivriez à ça",
        ],
      },
      {
        text: 'En cas de crise financière importante (perte d\'emploi, dettes), ton couple...',
        options: [
          "Pourrait se fragiliser — l'argent est une source de tension",
          "Serait mis à rude épreuve mais sans certitude",
          "Traverserait ça avec des difficultés mais ensemble",
          "Se resserrerait — les crises vous renforcent",
        ],
      },
      {
        text: 'Si l\'un de vous traversait une dépression ou une crise de santé mentale, l\'autre...',
        options: [
          "Aurait du mal à gérer — ce n'est pas ce qu'il/elle sait faire",
          "Serait présent(e) mais avec des limites",
          "Serait là et s'adapterait",
          "Serait un soutien total sans hésitation",
        ],
      },
      {
        text: 'Face aux pressions de vos familles respectives (désaccords, ingérences), votre couple...',
        options: [
          "A tendance à se diviser — les familles ont beaucoup de poids",
          "Navigue avec difficulté",
          "Maintient un front commun la plupart du temps",
          "Est une unité solide — vous vous choisissez mutuellement",
        ],
      },
      {
        text: 'Si l\'un de vous changeait profondément (nouvelles valeurs, nouvelles ambitions), tu...',
        options: [
          "Penses que ça pourrait remettre en cause tout",
          "Serais déconcerté(e) et incertain(e)",
          "Essaierais de t'adapter et de comprendre",
          "Accueillerais ce changement — les gens évoluent",
        ],
      },
      {
        text: 'En cas de grande tentation ou d\'opportunité qui vous éloignerait (travail, voyage), tu...',
        options: [
          "Suivrais l'opportunité — la relation devrait s'adapter",
          "Hésiterais longtemps avant de décider",
          "Chercherais un compromis qui préserve les deux",
          "Donnerais la priorité à la relation dans ta décision",
        ],
      },
      {
        text: 'Si vous traversiez une période sans passion ni projet commun, tu...',
        options: [
          "Commencerais à douter sérieusement",
          "Attendrais que ça repasse naturellement",
          "Essaierais d'initier quelque chose de nouveau",
          "Mettrais de l'énergie à raviver ce lien — ça mérite cet effort",
        ],
      },
      {
        text: 'La confiance dans votre relation est selon toi...',
        options: [
          "Fragile — il suffirait d'un événement pour la briser",
          "Présente mais avec des zones d'ombre",
          "Solide dans l'ensemble",
          "Très solide — c'est le socle de tout",
        ],
      },
      {
        text: 'En cas de désaccord profond sur quelque chose d\'important (valeur, projet de vie), vous...',
        options: [
          "Bloquez souvent sans vraiment avancer",
          "Avancez difficilement avec des tensions",
          "Finissez par trouver un terrain d'entente",
          "Trouvez toujours un moyen de vous comprendre",
        ],
      },
      {
        text: 'Dans 10 ans, tu vois cette relation...',
        options: [
          "Difficile à imaginer — l'avenir est flou",
          "Possible mais avec beaucoup de travail",
          "Probable — vous avez des bases solides",
          "Certaine — tu veux cette vie avec cette personne",
        ],
      },
    ],
  },
  {
    slug: 'duo-amour',
    title: 'Qui de vous deux aime le plus fort ?',
    subtitle: 'La vérité sur l\'intensité de vos sentiments',
    description: '10 questions sur l\'intensité réelle de ce que vous ressentez — pour voir si vous êtes au même niveau ou si l\'un des deux ressent plus fort.',
    emoji: '💘',
    accentColor: '#ec4899',
    questions: [
      {
        text: 'Quand tu penses à ton/ta partenaire, tu ressens...',
        options: [
          "De l'affection — une présence agréable dans ta vie",
          "De la tendresse et de l'attachement sincère",
          "Des sentiments forts et réguliers",
          "Un amour intense qui colore ta vie au quotidien",
        ],
      },
      {
        text: 'L\'idée que cette relation se termine te fait...',
        options: [
          "Peu de chose — tu t'en remettrais",
          "Un peu de peine — ça serait dommage",
          "Beaucoup de peine — c'est quelqu'un d'important",
          "Vraiment mal — tu ne peux pas imaginer ça",
        ],
      },
      {
        text: 'Dans 10 ans, toi et ton/ta partenaire c\'est...',
        options: [
          "Incertain — tu ne te projettes pas autant",
          "Peut-être — si tout se passe bien",
          "Probable — tu le/la vois dans ton avenir",
          "Évident — tu construis avec lui/elle",
        ],
      },
      {
        text: 'Le bonheur de ton/ta partenaire pour toi, c\'est...',
        options: [
          "Sa responsabilité — ce n'est pas ton rôle",
          "Quelque chose qui te touche sans être central",
          "Très important — ça compte vraiment pour toi",
          "Aussi important que le tien — voire plus",
        ],
      },
      {
        text: 'Quand tu imagines ta vie sans lui/elle...',
        options: [
          "Tu vois une vie normale — les gens se séparent",
          "Tu imagines une vie plus simple mais possible",
          "Tu imagines quelque chose d'incomplet",
          "Tu n'arrives pas vraiment à l'imaginer",
        ],
      },
      {
        text: 'Quand tu le/la vois après une séparation (même courte), tu...',
        options: [
          "Es content(e) mais c'est normal",
          "Ressens un plaisir sincère",
          "Ressens quelque chose de fort",
          "Ressens quelque chose d'intense que tu n'as avec personne d'autre",
        ],
      },
      {
        text: 'Ses défauts et ses difficultés, pour toi c\'est...',
        options: [
          "Quelque chose que tu tolères plus ou moins",
          "Quelque chose que tu acceptes",
          "Une partie de lui/elle que tu as choisi d'aimer",
          "Des choses que tu aimes aussi — ils font partie de lui/elle",
        ],
      },
      {
        text: 'Ferais-tu un grand sacrifice pour lui/elle (renoncer à quelque chose d\'important) ?',
        options: [
          "Probablement pas — tes priorités restent les tiennes",
          "Peut-être, dans certaines circonstances",
          "Oui, si c'est vraiment important pour lui/elle",
          "Sans hésiter — tu le ferais naturellement",
        ],
      },
      {
        text: 'Quand tu parles de lui/elle à tes proches, tu le fais...',
        options: [
          "Peu — c'est ta vie privée",
          "Quand on te pose des questions",
          "Naturellement et avec plaisir",
          "Avec beaucoup de chaleur et souvent",
        ],
      },
      {
        text: 'Si tu devais résumer ton niveau d\'amour pour lui/elle en ce moment...',
        options: [
          "Attachement sincère mais modéré",
          "Sentiments forts mais stables",
          "Amour clair et profond",
          "Amour intense — cette personne est au cœur de ta vie",
        ],
      },
    ],
  },
];

export function getDuoQuiz(slug: string): DuoQuiz | undefined {
  return duoQuizzes.find((q) => q.slug === slug);
}

export function getDuoInsight(slug: string, agreement: number): string {
  const map: Record<string, (a: number) => string> = {
    'duo-communication': (a) =>
      a >= 80
        ? "Vous communiquez de façon très alignée. C'est un socle solide — rare et précieux."
        : a >= 60
        ? "Quelques décalages dans votre façon de communiquer, mais rien d'insurmontable. La clé : en parler."
        : a >= 40
        ? "Vous avez des styles de communication assez différents. Ces divergences méritent d'être mises sur la table."
        : "Vous communiquez de façon très différente. Ce n'est pas un problème — mais l'ignorer en serait un.",
    'duo-compatibilite': (a) =>
      a >= 80
        ? "Vos projections de vie sont très alignées. Vous ne vous êtes pas choisi par hasard."
        : a >= 60
        ? "Quelques différences dans vos visions mais les fondations semblent compatibles. Parlez des divergences."
        : a >= 40
        ? "Vos visions de vie divergent sur plusieurs points importants. Ces sujets méritent une vraie conversation."
        : "Vos chemins de vie sont assez différents. Ce n'est pas rédhibitoire — mais ignorer ces divergences serait une erreur.",
    'duo-investissement': (a) =>
      a >= 80
        ? "Vous semblez investis de façon très similaire. C'est un équilibre rare qui mérite d'être reconnu."
        : a >= 60
        ? "Quelques différences dans votre niveau d'investissement, mais rien d'alarmant si vous en êtes conscients."
        : a >= 40
        ? "Un déséquilibre se dessine dans cette relation. Ces divergences méritent une conversation honnête."
        : "Le déséquilibre est significant. Savoir qui donne plus est la première étape pour en parler vraiment.",
    'duo-resilience': (a) =>
      a >= 80
        ? "Vous avez une vision très similaire de la solidité de votre lien. C'est un fondement précieux."
        : a >= 60
        ? "Quelques divergences dans votre perception de la résilience de votre couple — en parler renforce."
        : a >= 40
        ? "Vous ne voyez pas la solidité de votre relation de la même façon. Ces différences méritent attention."
        : "Vos perceptions de la solidité de votre lien sont très différentes. C'est une conversation importante à avoir.",
    'duo-amour': (a) =>
      a >= 80
        ? "Vous semblez ressentir avec la même intensité. Cette symétrie émotionnelle est un cadeau rare."
        : a >= 60
        ? "Quelques nuances dans l'intensité de vos sentiments — normal, les émotions ne se calibrent pas à l'identique."
        : a >= 40
        ? "Il y a un décalage dans l'intensité de ce que vous ressentez. En avoir conscience aide à mieux se comprendre."
        : "L'asymétrie émotionnelle est réelle et significative. Pas un problème en soi — mais en parler franchement est essentiel.",
  };
  return (
    map[slug]?.(agreement) ??
    (agreement >= 70
      ? "Vous êtes bien alignés — c'est plus rare qu'il n'y paraît."
      : agreement >= 40
      ? "Quelques divergences à explorer ensemble."
      : "Des différences importantes à mettre sur la table.")
  );
}

export function encodeDuoAnswers(answers: number[]): string {
  return btoa(answers.join(','));
}

export function decodeDuoAnswers(encoded: string): number[] | null {
  try {
    return atob(encoded).split(',').map(Number);
  } catch {
    return null;
  }
}

// ── Team code: compact 6-char stateless code (2 slug + 4 answers) ──────────
const SLUG_TO_CODE: Record<string, string> = {
  'duo-communication': 'CO',
  'duo-compatibilite': 'CA',
  'duo-investissement': 'IN',
  'duo-resilience': 'RE',
  'duo-amour': 'AM',
};
const CODE_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_TO_CODE).map(([k, v]) => [v, k])
);
const B32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function encodeTeamCode(slug: string, answers: number[]): string {
  const sc = SLUG_TO_CODE[slug] ?? 'XX';
  // Pack 10 × 2-bit answers into 20 bits, encode as 4 base32 chars (5 bits each)
  let bits = 0;
  for (const a of answers.slice(0, 10)) bits = (bits << 2) | (a & 3);
  let enc = '';
  for (let i = 0; i < 4; i++) { enc = B32[bits & 31] + enc; bits >>= 5; }
  return sc + enc;
}

export function decodeTeamCode(code: string): { slug: string; answers: number[] } | null {
  if (code.length !== 6) return null;
  const slug = CODE_TO_SLUG[code.slice(0, 2).toUpperCase()];
  if (!slug) return null;
  let bits = 0;
  for (const ch of code.slice(2).toUpperCase()) {
    const idx = B32.indexOf(ch);
    if (idx === -1) return null;
    bits = (bits << 5) | idx;
  }
  const answers: number[] = [];
  for (let i = 9; i >= 0; i--) { answers[i] = bits & 3; bits >>= 2; }
  return { slug, answers };
}

export function compareDuoAnswers(
  a: number[],
  b: number[],
): { aligned: number; close: number; divergent: number; details: ('aligned' | 'close' | 'divergent')[] } {
  const details = a.map((va, i) => {
    const diff = Math.abs(va - b[i]);
    if (diff === 0) return 'aligned' as const;
    if (diff === 1) return 'close' as const;
    return 'divergent' as const;
  });
  return {
    aligned: details.filter((d) => d === 'aligned').length,
    close: details.filter((d) => d === 'close').length,
    divergent: details.filter((d) => d === 'divergent').length,
    details,
  };
}
