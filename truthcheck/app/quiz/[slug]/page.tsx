import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuizBySlug } from '@/lib/quizzes';
import QuizClient from './QuizClient';

const BASE = 'https://ursecret.vercel.app';

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
};

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return [
    { slug: 'infidelite' },
    { slug: 'adopte' },
    { slug: 'amoureux' },
    { slug: 'vrais-amis' },
    { slug: 'orientation' },
  ];
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
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizClient quiz={quiz} />
    </>
  );
}
