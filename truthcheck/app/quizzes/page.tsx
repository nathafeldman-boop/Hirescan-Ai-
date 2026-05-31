import type { Metadata } from 'next';
import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';

const BASE = 'https://ursecret.vercel.app';

export const metadata: Metadata = {
  title: 'Tous les quizzes — UrSecret',
  description: '5 questionnaires anonymes : infidélité, adoption, amour, amitié, orientation sexuelle. Résultats instantanés, 100% gratuit, zéro compte requis.',
  keywords: ['quiz anonyme', 'questionnaire psychologique', 'test infidélité', 'test amour', 'orientation sexuelle quiz', 'suis-je adopté', 'vrais amis quiz', 'UrSecret'],
  openGraph: {
    title: 'Tous les quizzes | UrSecret',
    description: '5 questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille.',
    url: `${BASE}/quizzes`,
    siteName: 'UrSecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrSecret — Tous les quizzes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tous les quizzes | UrSecret',
    description: '5 questionnaires anonymes. 100% gratuit.',
    images: ['/api/og'],
  },
  alternates: { canonical: `${BASE}/quizzes` },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'UrSecret', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Quizzes', item: `${BASE}/quizzes` },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Tous les quizzes UrSecret',
      description: 'Questionnaires anonymes pour découvrir la vérité sur tes relations',
      numberOfItems: 5,
      itemListElement: [
        { '@type': 'ListItem', position: 1, url: `${BASE}/quiz/infidelite`,  name: 'Mon/Ma partenaire me trompe ?' },
        { '@type': 'ListItem', position: 2, url: `${BASE}/quiz/adopte`,      name: 'Suis-je adopté(e) ?' },
        { '@type': 'ListItem', position: 3, url: `${BASE}/quiz/amoureux`,    name: 'Suis-je vraiment amoureux/amoureuse ?' },
        { '@type': 'ListItem', position: 4, url: `${BASE}/quiz/vrais-amis`,  name: 'Sont-ils mes vrais amis ?' },
        { '@type': 'ListItem', position: 5, url: `${BASE}/quiz/orientation`, name: 'Quelle est mon orientation ?' },
      ],
    },
    {
      '@type': 'WebPage',
      name: 'Tous les quizzes UrSecret',
      url: `${BASE}/quizzes`,
      inLanguage: 'fr',
      isPartOf: { '@id': `${BASE}/#website` },
    },
  ],
};

const iconGradients: Record<string, string> = {
  infidelite:   'linear-gradient(145deg, #7f1d1d 0%, #2c0909 55%, #0d0202 100%)',
  adopte:       'linear-gradient(145deg, #3730a3 0%, #1e1b4b 55%, #06050e 100%)',
  amoureux:     'linear-gradient(145deg, #9d174d 0%, #4a0d26 55%, #14020c 100%)',
  'vrais-amis': 'linear-gradient(145deg, #065f46 0%, #022c20 55%, #01090a 100%)',
  orientation:  'linear-gradient(145deg, #6d28d9 0%, #4c1d5e 55%, #1a020e 100%)',
};

export default function QuizzesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizzesContent />
    </>
  );
}

function QuizzesContent() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-violet-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-pink-600/8 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ur
            </span>
            <span className="text-white">Secret</span>
          </span>
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Choisis ton quiz</span>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-3">
              30 questions · Résultats instantanés
            </p>
            <h1 className="text-3xl font-black text-white leading-tight">
              Quelle vérité veux-tu
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}découvrir ?
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="group flex items-center gap-4 p-4 rounded-[20px] transition-all duration-150 active:scale-[0.98]"
                style={{
                  background: '#141418',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-[28px] flex-shrink-0"
                  style={{ background: iconGradients[quiz.slug] ?? `${quiz.accentColor}30` }}
                >
                  {quiz.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-[15px] leading-snug">{quiz.title}</p>
                  <p className="text-zinc-500 text-[13px] mt-[3px] leading-relaxed">{quiz.subtitle}</p>
                </div>

                {/* Chevron */}
                <svg
                  className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: quiz.accentColor }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          <p className="text-center text-zinc-600 text-xs mt-10 tracking-wide">
            🔒 100% anonyme · Zéro compte requis
          </p>
        </div>
      </div>
    </main>
  );
}
