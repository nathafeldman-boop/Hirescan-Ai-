import type { Metadata } from 'next';
import Link from 'next/link';

const BASE = 'https://ursecret.vercel.app';

export const metadata: Metadata = {
  title: 'Tests Psychologiques Gratuits 2025 — UrSecret',
  description: 'Tests psychologiques gratuits et anonymes : style d\'attachement, langages de l\'amour, gaslighting, burnout, dépression, narcissisme. Résultats instantanés basés sur des critères cliniques.',
  keywords: ['tests psychologiques gratuits', 'test style attachement', 'test langages amour', 'test gaslighting', 'test burnout', 'test dépression', 'test narcissisme', 'psychologie gratuit'],
  openGraph: {
    title: 'Tests Psychologiques Gratuits | UrSecret',
    description: 'Tests psychologiques anonymes avec résultats instantanés. Style d\'attachement, langages de l\'amour, burnout, dépression et plus.',
    url: `${BASE}/tests`,
    siteName: 'UrSecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Tests Psychologiques UrSecret' }],
  },
  alternates: { canonical: `${BASE}/tests` },
};

const testList = [
  { slug: 'style-attachement', emoji: '🫀', title: 'Test Style d\'Attachement', desc: 'Sécure, anxieux, évitant ou désorganisé ? Comprends tes schémas relationnels profonds.', color: '#6366f1' },
  { slug: 'langages-amour', emoji: '💌', title: 'Test des 5 Langages de l\'Amour', desc: 'Découvre comment tu exprimes et reçois l\'amour selon Gary Chapman.', color: '#ec4899' },
  { slug: 'gaslight', emoji: '🫧', title: 'Test Gaslighting', desc: 'Suis-je victime de manipulation psychologique ? Évalue les signes en 12 questions.', color: '#7c3aed' },
  { slug: 'burnout', emoji: '💤', title: 'Test Burnout', desc: 'Épuisement professionnel : où en es-tu ? Basé sur le Maslach Burnout Inventory.', color: '#f59e0b' },
  { slug: 'depression', emoji: '🌧️', title: 'Test Dépression', desc: 'Ai-je des signes de dépression ? Évaluation basée sur les critères DSM-5.', color: '#64748b' },
  { slug: 'narcissique', emoji: '🪞', title: 'Test Narcissisme', desc: 'Traits narcissiques vs trouble de personnalité : où se situe ton profil ?', color: '#a855f7' },
  { slug: 'infidelite', emoji: '💔', title: 'Test Infidélité', desc: 'Mon partenaire me trompe-t-il ? Analyse 30 signaux comportementaux.', color: '#ef4444' },
  { slug: 'manipule', emoji: '🎭', title: 'Test Manipulation', desc: 'Suis-je dans une relation manipulatrice ? Gaslighting, chantage émotionnel, emprise.', color: '#f97316' },
  { slug: 'relation-toxique', emoji: '⚠️', title: 'Test Relation Toxique', desc: 'Ma relation est-elle saine ou toxique ? Évalue les signes objectivement.', color: '#dc2626' },
];

export default function TestsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'UrSecret', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Tests', item: `${BASE}/tests` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Tests Psychologiques Gratuits UrSecret',
        numberOfItems: testList.length,
        itemListElement: testList.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: t.title,
          url: `${BASE}/tests/${t.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#09090b] text-white">
        <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
              <span className="text-white">Secret</span>
            </Link>
            <Link href="/quizzes" className="text-xs text-zinc-500 hover:text-white transition-colors">Tous les quiz →</Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-3">Tests gratuits & anonymes</p>
            <h1 className="text-3xl font-black text-white leading-tight mb-4">
              Tests Psychologiques{' '}
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Gratuits
              </span>
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed">
              Des guides complets et des tests basés sur des critères psychologiques établis.
              Résultats instantanés. Zéro compte requis.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {testList.map((test) => (
              <Link
                key={test.slug}
                href={`/tests/${test.slug}`}
                className="group rounded-2xl border border-white/8 p-5 transition-all hover:border-white/20 hover:scale-[1.01]"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${test.color}20`, border: `1px solid ${test.color}30` }}>
                    {test.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white font-bold text-base leading-snug mb-1">{test.title}</h2>
                    <p className="text-zinc-500 text-xs leading-relaxed">{test.desc}</p>
                  </div>
                  <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1"
                    style={{ color: test.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-zinc-600 text-xs mt-10">
            🔒 100% anonyme · Zéro compte requis · Basé sur des critères cliniques
          </p>
        </div>
      </main>
    </>
  );
}
