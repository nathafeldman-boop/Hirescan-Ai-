import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getQuizBySlug } from '@/lib/quizzes';
import QuizClient from './QuizClient';

const BASE = 'https://ursecret.vercel.app';

const ALL_SLUGS = [
  'infidelite', 'adopte', 'amoureux', 'vrais-amis', 'orientation',
  'narcissique', 'mon-ex', 'manipule', 'rompre', 'jaloux',
  'relation-toxique', 'crush', 'burnout', 'depression', 'vrai-amour',
  'style-attachement', 'langages-amour', 'gaslight',
];

const faqData: Record<string, { q: string; a: string }[]> = {
  infidelite: [
    { q: 'Comment savoir si mon/ma partenaire me trompe ?', a: "Les signaux incluent des changements de comportement soudains, une protection accrue du téléphone, des absences inexpliquées, moins d'intimité et une distance émotionnelle. Notre quiz analyse 30 comportements précis." },
    { q: "Quels sont les signes les plus courants d'infidélité ?", a: "Protection du téléphone, changements d'habitudes, moins d'intérêt pour le couple, nouvelles dépenses inexpliquées, attitude défensive aux questions. Notre test les évalue tous." },
    { q: "Mon/Ma partenaire cache son téléphone — est-ce suspect ?", a: "Cacher son téléphone est un signal mais pas une preuve. Il doit être combiné avec d'autres comportements. Notre quiz analyse l'ensemble du tableau comportemental." },
    { q: "Qu'est-ce que l'infidélité émotionnelle ?", a: "L'infidélité émotionnelle désigne une connexion affective intense avec quelqu'un d'autre, sans relation physique. Elle est souvent plus destructrice que l'infidélité physique." },
    { q: 'Ce quiz est-il fiable pour détecter une infidélité ?', a: "Notre quiz est basé sur des comportements documentés par des psychologues. Il ne constitue pas une preuve mais un outil d'analyse objective pour évaluer si vos doutes sont justifiés." },
  ],
  adopte: [
    { q: 'Comment savoir si je suis adopté(e) ?', a: "Plusieurs indices peuvent suggérer une adoption non divulguée : différences physiques marquées avec les parents, réactions étranges à certaines questions, documents familiaux inaccessibles. Notre quiz analyse 30 indices." },
    { q: 'Quels signes peuvent indiquer que je suis adopté(e) ?', a: "Ne pas se reconnaître dans sa famille, avoir été élevé différemment, des zones d'ombre dans l'histoire familiale, ou une intuition persistante. Notre quiz évalue ces éléments." },
    { q: 'Peut-on faire un test ADN pour savoir si on est adopté(e) ?', a: "Oui, un test ADN de parentalité peut confirmer une filiation biologique. Des services comme 23andMe ou MyHeritage permettent de trouver des membres de famille biologique." },
    { q: 'Comment parler à mes parents de mes doutes ?', a: "Choisissez un moment calme, exprimez vos sentiments sans accusation, expliquez que savoir la vérité est important pour votre identité. La communication reste l'approche la plus directe." },
    { q: 'Est-il normal de se demander si on est adopté(e) ?', a: "Oui, de nombreuses personnes se posent cette question. La curiosité sur ses origines est profondément humaine. Notre quiz aide à évaluer si vos doutes méritent d'être explorés." },
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
  orientation: [
    { q: 'Comment découvrir mon orientation sexuelle ?', a: "L'orientation se révèle progressivement à travers vos attirances émotionnelles et physiques. Une réflexion honnête sur ces attirances est un bon point de départ." },
    { q: 'Est-il normal de ne pas savoir quelle est mon orientation ?', a: "Absolument. De nombreuses personnes questionnent leur orientation à tout âge. La sexualité est un spectre, et se poser des questions est une démarche courageuse et légitime." },
    { q: 'Quelle est la différence entre bisexuel(le) et pansexuel(le) ?', a: "La bisexualité désigne l'attirance pour deux genres ou plus. La pansexualité désigne l'attirance indépendamment du genre. Les deux termes sont valides." },
    { q: "Ce quiz peut-il m'aider à comprendre mon orientation ?", a: "Notre quiz n'a pas pour vocation de vous étiqueter, mais d'aider à explorer vos attirances de façon structurée et anonyme. Il peut être un point de départ pour une réflexion personnelle." },
    { q: "L'orientation sexuelle peut-elle changer ?", a: "Oui, certaines personnes vivent une évolution de leur orientation au fil du temps. C'est un phénomène documenté. L'identité sexuelle est fluide pour beaucoup." },
  ],
  narcissique: [
    { q: 'Comment savoir si je suis narcissique ?', a: "Le narcissisme se caractérise par un besoin excessif d'admiration, un manque d'empathie, un sentiment de supériorité et une sensibilité extrême à la critique. Notre quiz évalue ces traits sur 30 questions." },
    { q: 'Quelle est la différence entre confiance en soi et narcissisme ?', a: "La confiance en soi est stable et n'a pas besoin de validation externe. Le narcissisme repose sur la supériorité vis-à-vis des autres et un besoin constant de reconnaissance." },
    { q: 'Le narcissisme peut-il se soigner ?', a: "Oui, avec un accompagnement psychothérapeutique adapté. La thérapie cognitivo-comportementale et la psychothérapie analytique peuvent aider à développer plus d'empathie et réduire les comportements problématiques." },
    { q: 'Peut-on être un peu narcissique sans avoir une personnalité narcissique ?', a: "Oui, le narcissisme est un spectre. Avoir certains traits ne signifie pas avoir un trouble de la personnalité narcissique (TPN). Ce quiz évalue la présence et l'intensité de ces traits." },
    { q: "Qu'est-ce que la blessure narcissique ?", a: "La blessure narcissique désigne la réaction violente d'une personne narcissique face à une critique ou un rejet. Elle peut se manifester par de la colère, du mépris ou de la honte intense." },
  ],
  'mon-ex': [
    { q: 'Comment savoir si mon ex veut revenir ?', a: "Les signaux incluent des contacts fréquents sans raison, la nostalgie affichée, la jalousie face à vos nouvelles fréquentations, et les tentatives de se retrouver. Notre quiz analyse 30 comportements précis." },
    { q: 'Est-ce que mon ex qui me like sur les réseaux veut revenir ?', a: "Les interactions sur les réseaux peuvent signaler un attachement mais ne prouvent pas une volonté de retour. Elles doivent être combinées à d'autres signaux pour être significatives." },
    { q: 'Combien de temps faut-il pour qu\'un ex tourne la page ?', a: "Il n'existe pas de délai universel. Cela dépend de la durée de la relation, de la raison de la rupture et du profil de chaque personne. Certains mettent des semaines, d'autres des années." },
    { q: 'Faut-il reprendre contact avec un ex ?', a: "Cela dépend de vos motivations. Si c'est pour clore quelque chose ou par nostalgie sincère, cela peut être pertinent. Si c'est par peur de la solitude, mieux vaut y réfléchir à deux fois." },
    { q: 'Est-il possible de renouer avec un ex avec succès ?', a: "Oui, certains couples se reforment avec succès, surtout si les raisons de la rupture ont réellement changé. La communication honnête est essentielle pour que le retour ne reproduise pas les mêmes schémas." },
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
  crush: [
    { q: 'Comment savoir si mon crush m\'aime en secret ?', a: "Les signaux incluent : regards prolongés, recherche de proximité physique, attention particulière à vos paroles, nervosité en votre présence, et efforts pour se retrouver dans le même endroit que vous." },
    { q: 'Comment interpréter les regards de mon crush ?', a: "Un regard prolongé, un sourire accompagné d'un regard fuyant par timidité, ou des coups d'œil répétés vers vous dans un groupe sont souvent des signaux d'intérêt romantique." },
    { q: 'Faut-il avouer ses sentiments à son crush ?', a: "Oser exprimer ses sentiments est souvent libérateur. Si vous ressentez beaucoup de signaux positifs, le risque en vaut souvent la chandelle. L'incertitude peut durer indéfiniment sans action." },
    { q: 'Comment se comporter avec son crush ?', a: "Soyez naturel(le), montrez de l'intérêt sincère pour lui/elle, créez des occasions de passer du temps ensemble, et osez l'humour et la légèreté pour créer une connexion." },
    { q: 'Est-ce que les amis peuvent voir l\'attirance entre deux personnes ?', a: "Oui, les observateurs extérieurs remarquent souvent des dynamiques que les personnes concernées minimisent. Si plusieurs personnes de votre entourage le suggèrent, c'est souvent significatif." },
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
    keywords: [quiz.title, quiz.subtitle, 'quiz anonyme', 'test psychologique', 'questionnaire', 'résultats instantanés', 'UrSecret'],
    openGraph: {
      title: `${title} | UrSecret`,
      description,
      url: `${BASE}/quiz/${quiz.slug}`,
      siteName: 'UrSecret',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: `/api/og?quiz=${quiz.slug}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | UrSecret`,
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
          { '@type': 'ListItem', position: 1, name: 'UrSecret', item: BASE },
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
        publisher: { '@type': 'Organization', name: 'UrSecret', url: BASE },
      },
    ],
  };

  const hasGuide = ['style-attachement', 'langages-amour', 'gaslight', 'burnout', 'depression', 'narcissique', 'infidelite', 'manipule', 'relation-toxique'].includes(quiz.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizClient quiz={quiz} />
      {/* Hidden but crawlable FAQ for SEO */}
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }} aria-hidden="true">
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
