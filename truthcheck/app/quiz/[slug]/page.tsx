import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getQuizBySlug } from '@/lib/quizzes';
import QuizClient from './QuizClient';

const BASE = 'https://urcecret.site';

const ALL_SLUGS = [
  'auto-sabotage', 'role-familial', 'amoureux', 'vrais-amis', 'intelligence-emotionnelle',
  'narcissique', 'tourner-la-page', 'manipule', 'rompre', 'jaloux',
  'relation-toxique', 'schema-amoureux', 'burnout', 'depression', 'vrai-amour',
  'style-attachement', 'langages-amour', 'gaslight',
];

const faqData: Record<string, { q: string; a: string }[]> = {
  'auto-sabotage': [
    { q: "Qu'est-ce que l'auto-sabotage, exactement ?", a: "L'auto-sabotage désigne les comportements, souvent inconscients, par lesquels on se crée soi-même des obstacles qui compliquent l'atteinte de ses propres objectifs. Les psychologues Steven Berglas et Edward Jones ont montré dès les années 1970 que ce mécanisme (\"self-handicapping\") sert à se protéger d'un échec potentiel en s'aménageant une excuse à l'avance." },
    { q: 'Pourquoi je procrastine alors que je sais que ça va me nuire ?', a: "Les recherches du psychologue Piers Steel montrent que la procrastination n'est presque jamais un problème de gestion du temps, mais un problème de régulation émotionnelle : on repousse une tâche pour éviter l'inconfort qu'elle génère, comme la peur de l'échec ou du jugement." },
    { q: "Peut-on vraiment sortir d'un schéma d'auto-sabotage ?", a: "Oui : ces schémas s'apprennent, généralement pour de bonnes raisons — se protéger d'une déception, d'un jugement, d'une pression — ce qui veut dire qu'ils peuvent aussi se désapprendre progressivement, en commençant par repérer le moment précis où le mécanisme s'active." },
  ],
  'role-familial': [
    { q: 'Qu\'est-ce qu\'un "rôle familial" en psychologie ?', a: "En thérapie familiale systémique, notamment dans les travaux de Virginia Satir, on observe que chaque enfant tend à adopter inconsciemment un rôle (le héros, le médiateur, le bouc émissaire, l'enfant invisible, le boute-en-train...) pour aider la famille à maintenir un certain équilibre. Ce rôle n'est jamais choisi consciemment." },
    { q: 'Pourquoi ces rôles se manifestent-ils encore à l\'âge adulte ?', a: "Les stratégies apprises dans l'enfance pour se sentir en sécurité ou utile deviennent souvent des réflexes automatiques qui perdurent bien après avoir quitté le foyer familial : difficulté à demander de l'aide, peur du conflit, besoin de \"mériter\" l'attention des autres." },
    { q: 'Peut-on vraiment se libérer d\'un rôle familial appris ?', a: "Oui : un rôle appris reste un comportement, pas une identité définitive. Prendre conscience du rôle qu'on a tenu est souvent la première étape pour commencer à le desserrer en douceur, en réapprenant à exprimer ses propres besoins sans culpabilité." },
  ],
  amoureux: [
    { q: 'Comment savoir si je suis vraiment amoureux/amoureuse ?', a: "L'amour véritable se distingue par une pensée constante pour l'autre, une envie de partager sa vie, un souci sincère de son bien-être et une attraction qui va au-delà du physique." },
    { q: "Quelle est la différence entre l'amour et l'attachement ?", a: "L'amour inclut le désir de bonheur de l'autre indépendamment du vôtre. L'attachement est centré sur le besoin que l'autre comble les vôtres." },
    { q: "Comment distinguer l'amour de l'amitié ?", a: "L'amour romantique implique une attirance et un désir d'avenir commun. L'amitié est une affection profonde sans ces composantes. Notre quiz mesure précisément ces nuances." },
    { q: "Suis-je amoureux/amoureuse ou juste habitué(e) ?", a: "L'habitude se traduit par un vide à l'idée d'être seul(e), sans excitation. L'amour implique une envie active de la présence de l'autre, pas juste une peur de son absence." },
    { q: "À quel moment peut-on dire qu'on est amoureux/amoureuse ?", a: "Il n'y a pas de moment unique. Certains le ressentent rapidement, d'autres après des mois. Notre quiz explore les signaux clés identifiés par les psychologues." },
  ],
  'vrais-amis': [
    { q: 'Comment reconnaître un faux ami ?', a: "Un faux ami est présent dans les bons moments mais absent dans les difficultés, parle de vous dans votre dos, envie vos succès ou profite de votre générosité sans réciprocité." },
    { q: 'Quels comportements caractérisent une vraie amitié ?', a: "Réciprocité, respect, soutien dans les moments difficiles, honnêteté bienveillante et absence de jalousie. Notre quiz évalue 30 comportements précis." },
    { q: 'Comment savoir si mes amis me veulent vraiment du bien ?', a: "Observez comment ils réagissent à vos succès, s'ils sont là dans les moments difficiles, s'ils vous écoutent vraiment et respectent vos limites." },
    { q: "Qu'est-ce qu'une amitié toxique ?", a: "Une amitié qui vous laisse systématiquement fatigué(e), diminué(e) ou mal à l'aise — via des critiques répétées, de la manipulation ou un manque de respect persistant." },
    { q: "Est-il normal d'avoir des doutes sur ses amitiés ?", a: "Oui, questionner la qualité de ses relations amicales est sain et mature. Cela témoigne d'une conscience de soi et du respect que vous vous accordez." },
  ],
  'intelligence-emotionnelle': [
    { q: "Qu'est-ce que l'intelligence émotionnelle exactement ?", a: "L'intelligence émotionnelle désigne la capacité à percevoir, comprendre et réguler ses propres émotions, tout en étant capable de reconnaître et d'influencer celles des autres. Le concept a été popularisé par le psychologue Daniel Goleman, autour de cinq compétences : conscience de soi, maîtrise de soi, motivation, empathie et compétences sociales." },
    { q: "L'intelligence émotionnelle peut-elle vraiment s'améliorer ?", a: "Oui : contrairement à une idée reçue, ce n'est pas un trait de personnalité fixe mais un ensemble de compétences qui se renforcent avec la pratique. Tenir un carnet émotionnel, pratiquer la pause avant de réagir, ou s'entraîner à l'écoute active produisent des progrès mesurables en quelques semaines." },
    { q: "Pourquoi l'intelligence émotionnelle est-elle importante au travail ?", a: "De nombreuses études l'associent à une meilleure gestion du stress, des relations professionnelles plus fluides et un leadership plus efficace. Pour Goleman, elle serait même un meilleur prédicteur de réussite professionnelle sur le long terme que le seul QI technique." },
  ],
  narcissique: [
    { q: 'Comment savoir si je suis narcissique ?', a: "Le narcissisme se caractérise par un besoin excessif d'admiration, un manque d'empathie, un sentiment de supériorité et une sensibilité extrême à la critique. Notre quiz évalue ces traits sur 30 questions." },
    { q: 'Quelle est la différence entre confiance en soi et narcissisme ?', a: "La confiance en soi est stable et n'a pas besoin de validation externe. Le narcissisme repose sur la supériorité vis-à-vis des autres et un besoin constant de reconnaissance." },
    { q: 'Le narcissisme peut-il se soigner ?', a: "Oui, avec un accompagnement psychothérapeutique adapté. La thérapie cognitivo-comportementale et la psychothérapie analytique peuvent aider à développer plus d'empathie et réduire les comportements problématiques." },
    { q: 'Peut-on être un peu narcissique sans avoir une personnalité narcissique ?', a: "Oui, le narcissisme est un spectre. Avoir certains traits ne signifie pas avoir un trouble de la personnalité narcissique (TPN). Ce quiz évalue la présence et l'intensité de ces traits." },
    { q: "Qu'est-ce que la blessure narcissique ?", a: "La blessure narcissique désigne la réaction violente d'une personne narcissique face à une critique ou un rejet. Elle peut se manifester par de la colère, du mépris ou de la honte intense." },
  ],
  'tourner-la-page': [
    { q: 'Combien de temps faut-il vraiment pour tourner la page après une rupture ?', a: "Il n'existe aucune durée universelle : la guérison dépend de la durée de la relation, de l'attachement en jeu et du soutien reçu. Ce qui compte n'est pas le nombre de mois écoulés, mais si la douleur évolue avec le temps ou si elle reste identique." },
    { q: 'Est-ce normal de penser encore à son ex plusieurs mois après la rupture ?', a: "Oui, tout à fait normal, surtout si ces pensées deviennent moins fréquentes et moins douloureuses avec le temps. Ce qui mérite attention, c'est quand la pensée reste intacte en intensité ou s'accompagne de rumination ou de vérifications compulsives des réseaux sociaux." },
    { q: 'Pourquoi je compare tous mes nouveaux partenaires à mon ex malgré moi ?', a: "Ce réflexe vient souvent d'un attachement encore actif : le cerveau utilise la relation passée comme référence par défaut tant qu'aucun nouveau schéma n'a pris sa place. Cela s'atténue en travaillant sur l'acceptation de la rupture." },
  ],
  manipule: [
    { q: 'Comment savoir si je suis manipulé(e) ?', a: "Les signes incluent : sentiment constant de culpabilité, doutes sur votre propre perception, isolement progressif, épuisement émotionnel après les interactions, et peur des réactions de l'autre." },
    { q: "Qu'est-ce que le gaslighting ?", a: "Le gaslighting est une technique de manipulation qui consiste à faire douter quelqu'un de sa propre réalité, mémoire ou perceptions. La victime finit par ne plus faire confiance à son propre jugement." },
    { q: 'Que faire si je suis manipulé(e) ?', a: "Cherchez du soutien auprès d'un proche de confiance ou d'un professionnel. Documentez les comportements. Posez des limites claires. Dans les cas graves, éloignez-vous de la situation." },
    { q: 'La manipulation est-elle toujours consciente ?', a: "Pas nécessairement. Certaines personnes manipulent sans en être pleinement conscientes, souvent par insécurité. Cela ne rend pas les comportements moins nocifs pour la victime." },
    { q: 'Comment se remettre d\'une relation manipulatrice ?', a: "La récupération demande du temps. Un soutien psychologique professionnel est souvent nécessaire pour reconstruire l'estime de soi et la confiance dans son propre jugement." },
  ],
  rompre: [
    { q: 'Comment savoir si je dois rompre ?', a: "Les signaux incluent : une tristesse chronique, le sentiment de ne plus être soi-même, l'absence de projets communs, un manque de respect persistant, et l'idéalisation d'une vie sans l'autre." },
    { q: 'Est-il normal d\'avoir peur de rompre ?', a: "Oui, la peur de la solitude, du changement ou de blesser l'autre sont des réactions humaines. Mais rester par peur plutôt que par amour n'est sain ni pour toi ni pour ton/ta partenaire." },
    { q: 'Faut-il essayer une thérapie de couple avant de rompre ?', a: "Dans de nombreux cas, oui. La thérapie de couple peut aider à clarifier si les problèmes sont solvables ou si la séparation est la meilleure option pour les deux parties." },
    { q: 'Comment rompre sans blesser l\'autre ?', a: "Une rupture fait toujours mal. L'important est d'être honnête, respectueux(se), et de choisir le bon moment et lieu. Évitez les ruptures par message et expliquez vos raisons clairement." },
    { q: 'Comment se remettre d\'une rupture ?', a: "Accordez-vous du temps, entourez-vous de proches, reprenez des activités qui vous font du bien. Un soutien psychologique peut aider dans les ruptures difficiles. Le deuil d'une relation est réel et légitime." },
  ],
  jaloux: [
    { q: 'Comment savoir si ma jalousie est excessive ?', a: "La jalousie devient excessive quand elle vous pousse à surveiller, contrôler ou accuser votre partenaire sans preuves, ou quand elle cause des disputes régulières et affecte votre bien-être." },
    { q: 'Quelles sont les causes de la jalousie ?', a: "La jalousie excessive naît souvent d'une faible estime de soi, de blessures passées (trahisons, abandons), d'un style d'attachement anxieux ou d'une insécurité profonde." },
    { q: 'La jalousie peut-elle être saine ?', a: "Une jalousie légère et ponctuelle, exprimée sans comportements de contrôle, peut témoigner d'un attachement. Elle devient problématique quand elle pousse à des comportements envahissants." },
    { q: 'Comment gérer la jalousie ?', a: "Travaillez sur l'estime de soi, communiquez ouvertement avec votre partenaire, et si nécessaire, consultez un thérapeute pour explorer les sources profondes de votre insécurité." },
    { q: 'La jalousie peut-elle détruire une relation ?', a: "Oui, une jalousie non gérée peut créer un climat d'étouffement qui finit par pousser le/la partenaire à partir. Elle peut aussi devenir une prophétie auto-réalisatrice." },
  ],
  'relation-toxique': [
    { q: 'Comment reconnaître une relation toxique ?', a: "Une relation toxique se caractérise par un manque de respect, des comportements de contrôle, une communication destructrice, de la jalousie excessive, des cycles de rupture-réconciliation et une détérioration de l'estime de soi." },
    { q: 'Peut-on changer une relation toxique ?', a: "Oui, si les deux parties reconnaissent les problèmes et s'engagent réellement à changer, souvent avec l'aide d'un thérapeute. Mais si une seule personne fait des efforts, le changement est rare." },
    { q: 'Pourquoi est-il difficile de quitter une relation toxique ?', a: "La dépendance émotionnelle, la peur de la solitude, la manipulation et les cycles de réconciliation créent des liens très forts qui rendent la séparation difficile malgré la souffrance." },
    { q: 'Quelle est la différence entre une relation difficile et toxique ?', a: "Une relation difficile a des problèmes mais les deux partenaires se respectent et cherchent des solutions. Une relation toxique a un schéma de comportements nocifs persistants qui détruisent progressivement l'estime de soi." },
    { q: 'Que faire si je suis dans une relation toxique ?', a: "Parlez à un proche ou un professionnel, documentez les comportements, posez des limites. Si votre sécurité est en jeu, cherchez de l'aide immédiatement auprès des autorités ou d'associations spécialisées." },
  ],
  'schema-amoureux': [
    { q: 'Pourquoi je tombe toujours amoureux/amoureuse du même type de personne ?', a: "Ce phénomène s'explique en partie par la répétition compulsive, un concept freudien : le cerveau recherche inconsciemment des dynamiques familières, souvent apprises dans l'enfance, même quand elles sont douloureuses. L'attirance immédiate peut être un signal de familiarité plutôt que de compatibilité réelle." },
    { q: "Ce test est-il la même chose qu'un test de style d'attachement ?", a: "Non. Un test de style d'attachement évalue ta façon générale de vivre la proximité et la sécurité dans une relation. Ce quiz se concentre spécifiquement sur le TYPE de personne que tu choisis de façon récurrente, et sur la dynamique précise que tu recrées à chaque fois." },
    { q: 'Peut-on vraiment changer son schéma amoureux ?', a: "Oui. Un schéma appris peut être désappris, en plusieurs étapes : le reconnaître, comprendre son origine, puis s'exposer consciemment à des dynamiques différentes jusqu'à ce qu'elles deviennent, elles aussi, familières." },
  ],
  burnout: [
    { q: 'Comment savoir si je suis en burnout ?', a: "Le burnout se manifeste par un épuisement persistant, du cynisme envers le travail, une efficacité réduite, des symptômes physiques et une difficulté à déconnecter. Notre quiz évalue ces 5 dimensions clés." },
    { q: 'Quelle est la différence entre le stress et le burnout ?', a: "Le stress est une réponse temporaire à une surcharge. Le burnout est un état d'épuisement chronique profond qui touche l'énergie, les émotions et la motivation de façon durable." },
    { q: 'Que faire si je suis en burnout ?', a: "Consultez un médecin en priorité. Un arrêt de travail peut être nécessaire. La psychothérapie aide à comprendre les causes. Des changements dans l'organisation du travail sont souvent indispensables." },
    { q: 'Le burnout peut-il toucher quelqu\'un qui aime son travail ?', a: "Oui, paradoxalement les personnes les plus investies et perfectionnistes sont souvent plus à risque. L'engagement excessif sans limites est un facteur de risque important." },
    { q: 'Combien de temps dure un burnout ?', a: "La récupération varie de quelques semaines à plusieurs mois ou années selon la sévérité. Une intervention précoce est essentielle pour éviter un burnout profond aux conséquences durables." },
  ],
  depression: [
    { q: 'Comment savoir si je suis déprimé(e) ?', a: "La dépression se caractérise par une tristesse persistante, une perte d'intérêt, un manque d'énergie, des troubles du sommeil et de l'appétit, une faible estime de soi et des difficultés à se concentrer, durant plus de deux semaines." },
    { q: 'Quelle est la différence entre tristesse et dépression ?', a: "La tristesse est une émotion normale et passagère. La dépression est un trouble persistant qui affecte le fonctionnement quotidien, dure plusieurs semaines et ne répond pas aux mêmes stratégies." },
    { q: 'Ce quiz peut-il diagnostiquer une dépression ?', a: "Non, ce quiz n'est pas un outil de diagnostic médical. Il peut vous aider à identifier des signes et vous encourager à consulter un professionnel si nécessaire. Seul un médecin peut diagnostiquer une dépression." },
    { q: 'Que faire si je pense être déprimé(e) ?', a: "Consultez un médecin généraliste ou un psychiatre. Ne restez pas seul(e) avec ça. La dépression est une maladie qui se traite efficacement avec un accompagnement adapté (thérapie, médicaments si nécessaire)." },
    { q: "Où appeler en cas de pensées suicidaires ?", a: "En France, appelez le 3114, le numéro national de prévention du suicide, disponible 24h/24 et 7j/7. Des professionnels sont là pour vous écouter et vous aider." },
  ],
  'vrai-amour': [
    { q: 'Comment savoir si c\'est le vrai amour ?', a: "Le vrai amour se distingue par une acceptation inconditionnelle, l'envie du bonheur de l'autre, un sentiment de sécurité et de liberté d'être soi-même, et une attraction qui dépasse le physique." },
    { q: 'Quelle est la différence entre l\'amour et la passion ?', a: "La passion est intense mais souvent éphémère, centrée sur l'excitation et le désir. L'amour véritable intègre la passion mais y ajoute la confiance, le respect et l'engagement durable." },
    { q: 'Peut-on aimer vraiment quelqu\'un dès le début de la relation ?', a: "On peut ressentir un coup de foudre et des sentiments forts très tôt. Mais l'amour profond se construit avec le temps, la connaissance réelle de l'autre et l'épreuve des difficultés partagées." },
    { q: "Peut-on confondre amour et dépendance affective ?", a: "Oui. La dépendance affective ressemble à l'amour mais est centrée sur la peur de la perte plutôt que le vrai bien-être de l'autre. Un thérapeute peut aider à distinguer les deux." },
    { q: 'Le vrai amour nécessite-t-il des efforts ?', a: "Oui, l'amour durable demande un engagement actif : communication, respect des besoins de l'autre, et travail commun sur les difficultés. L'amour n'est pas seulement un sentiment, c'est aussi une décision quotidienne." },
  ],
  'style-attachement': [
    { q: 'Quels sont les 4 styles d\'attachement ?', a: "Les 4 styles d'attachement identifiés par la psychologie sont : sécure (à l'aise avec la proximité et l'autonomie), anxieux (peur de l'abandon, besoin de réassurance), évitant (peur de la dépendance, distance émotionnelle), et désorganisé (mélange anxiété-évitement, souvent lié à des traumatismes)." },
    { q: 'Comment se forme le style d\'attachement ?', a: "Le style d'attachement se forme dans l'enfance à travers les interactions avec les figures d'attachement (parents, proches). Des relations précoces sécurisantes favorisent un attachement sécure. Les traumatismes ou négligences favorisent les styles insécures." },
    { q: 'Peut-on changer son style d\'attachement ?', a: "Oui, absolument. Avec un travail thérapeutique, des relations sécurisantes et de la prise de conscience, il est possible d'évoluer vers un attachement plus sécure. C'est un processus long mais réel." },
    { q: 'Quel style d\'attachement est compatible avec qui ?', a: "Les personnes à attachement sécure sont généralement compatibles avec tous les styles. Deux personnes anxieuses peuvent créer une dynamique fusionnelle. Un anxieux et un évitant forment souvent une relation 'poursuite-retrait' douloureuse." },
    { q: 'L\'attachement évitant signifie-t-il qu\'on ne veut pas d\'amour ?', a: "Non. Les personnes à attachement évitant veulent de l'amour autant que les autres mais ont appris à se protéger en maintenant de la distance. Ce n'est pas un manque de sentiment, c'est une stratégie de protection inconsciente." },
  ],
  'langages-amour': [
    { q: 'Quels sont les 5 langages de l\'amour ?', a: "Les 5 langages de l\'amour identifiés par Gary Chapman sont : les mots d'affirmation (compliments, déclarations), les actes de service (faire des choses pour l'autre), la réception de cadeaux, le temps de qualité (présence totale), et le toucher physique (câlins, contact)." },
    { q: 'Comment savoir quel est mon langage de l\'amour ?', a: "Observez comment vous exprimez naturellement votre amour, ce qui vous touche le plus quand quelqu'un vous aime, et ce dont l'absence vous blesse le plus. Ces trois indicateurs révèlent votre langage principal." },
    { q: 'Est-il possible d\'avoir plusieurs langages de l\'amour principaux ?', a: "Oui, beaucoup de personnes ont un langage principal et un secondaire. L'important est de connaître vos priorités pour communiquer vos besoins à votre partenaire." },
    { q: 'Que faire si mon partenaire et moi n\'avons pas le même langage ?', a: "C'est très courant. La clé est de communiquer clairement vos besoins et d'apprendre à exprimer de l'amour dans le langage de l'autre, même si ce n'est pas le vôtre naturellement." },
    { q: 'Le langage de l\'amour peut-il changer avec le temps ?', a: "Oui, il peut évoluer selon les phases de vie. Les nouveaux parents peuvent valoriser davantage les actes de service. Les périodes de stress peuvent amplifier le besoin de mots d'affirmation." },
  ],
  gaslight: [
    { q: 'Qu\'est-ce que le gaslighting ?', a: "Le gaslighting est une forme de manipulation psychologique dans laquelle une personne amène l'autre à douter de sa propre réalité, mémoire, perceptions ou santé mentale. C'est une tactique de contrôle particulièrement destructrice car elle érode progressivement la confiance en soi." },
    { q: 'Comment reconnaître si je suis victime de gaslighting ?', a: "Les signes incluent : douter constamment de votre propre mémoire, vous sentir 'fou/folle', vous excuser en permanence, sentir que vous êtes trop sensible, vous sentir moins confiant(e) qu'avant, et constater que les faits 'changent' selon votre partenaire." },
    { q: 'Le gaslighting est-il toujours intentionnel ?', a: "Pas nécessairement. Certaines personnes gaslightent inconsciemment, souvent par peur du conflit ou par mécanisme de défense. Intentionnel ou non, les effets sur la victime sont les mêmes." },
    { q: 'Que faire si je suis victime de gaslighting ?', a: "Documentez les événements par écrit, cherchez une perspective extérieure de confiance, consultez un thérapeute, et prenez de la distance si nécessaire. Dans les cas graves, une ligne d'aide ou des associations spécialisées peuvent vous soutenir." },
    { q: 'Le gaslighting peut-il détruire durablement la confiance en soi ?', a: "Oui, surtout si le gaslighting dure depuis longtemps. Mais la reconstruction est possible avec un accompagnement professionnel. Reconnaître que vous avez été manipulé(e) est la première étape vers la guérison." },
  ],
};

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const quiz = getQuizBySlug(params.slug);
  if (!quiz) return {};

  const title = `${quiz.emoji} ${quiz.title}`;
  const description = `${quiz.subtitle} — 30 questions anonymes et instantanées. Analyse personnalisée. 100% gratuit, zéro compte requis.`;

  return {
    title,
    description,
    keywords: [quiz.title, quiz.subtitle, 'quiz anonyme', 'test psychologique', 'questionnaire', 'résultats instantanés', 'UrCecret'],
    openGraph: {
      title: `${title} | UrCecret`,
      description,
      url: `${BASE}/quiz/${quiz.slug}`,
      siteName: 'UrCecret',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: `/api/og?quiz=${quiz.slug}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | UrCecret`,
      description,
      images: [`/api/og?quiz=${quiz.slug}`],
    },
    alternates: { canonical: `${BASE}/quiz/${quiz.slug}` },
  };
}

export default function QuizPage({ params }: PageProps) {
  const quiz = getQuizBySlug(params.slug);
  if (!quiz) notFound();

  const faqs = faqData[quiz.slug] ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Quizzes', item: `${BASE}/quizzes` },
          { '@type': 'ListItem', position: 3, name: quiz.title, item: `${BASE}/quiz/${quiz.slug}` },
        ],
      },
      ...(faqs.length > 0 ? [{
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }] : []),
      {
        '@type': 'WebPage',
        name: quiz.title,
        description: quiz.subtitle,
        url: `${BASE}/quiz/${quiz.slug}`,
        inLanguage: 'fr',
        isPartOf: { '@id': BASE },
        publisher: { '@type': 'Organization', name: 'UrCecret', url: BASE },
      },
    ],
  };

  const hasGuide = ['style-attachement', 'langages-amour', 'gaslight', 'burnout', 'depression', 'narcissique', 'manipule', 'relation-toxique'].includes(quiz.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizClient quiz={quiz} />
      {/* Server-rendered SEO content: H1 + FAQ visible to Google crawlers */}
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }} aria-hidden="true">
        <h1>{quiz.emoji} {quiz.title} — {quiz.subtitle}</h1>
        {hasGuide && (
          <Link href={`/tests/${quiz.slug}`}>
            Guide complet : {quiz.title}
          </Link>
        )}
        {faqs.map(({ q, a }, i) => (
          <div key={i}>
            <h2>{q}</h2>
            <p>{a}</p>
          </div>
        ))}
      </div>
    </>
  );
}
