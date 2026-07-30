import type { Metadata } from 'next';
import Link from 'next/link';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Tests Psychologiques Gratuits 2025 — UrCecret',
  description: 'Tests psychologiques gratuits et anonymes : style d\'attachement, langages de l\'amour, gaslighting, burnout, dépression, narcissisme. Résultats instantanés basés sur des critères cliniques.',
  keywords: ['tests psychologiques gratuits', 'test style attachement', 'test langages amour', 'test gaslighting', 'test burnout', 'test dépression', 'test narcissisme', 'psychologie gratuit'],
  openGraph: {
    title: 'Tests Psychologiques Gratuits | UrCecret',
    description: 'Tests psychologiques anonymes avec résultats instantanés. Style d\'attachement, langages de l\'amour, burnout, dépression et plus.',
    url: `${BASE}/tests`,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Tests Psychologiques UrCecret' }],
  },
  alternates: { canonical: `${BASE}/tests` },
};

const testList = [
  { slug: 'style-attachement', emoji: '🫀', title: 'Test Style d\'Attachement', desc: 'Sécure, anxieux, évitant ou désorganisé ? Comprends tes schémas relationnels profonds.', color: '#b07d2b' },
  { slug: 'langages-amour', emoji: '💌', title: 'Test des 5 Langages de l\'Amour', desc: 'Découvre comment tu exprimes et reçois l\'amour selon Gary Chapman.', color: '#d17d52' },
  { slug: 'gaslight', emoji: '🫧', title: 'Test Gaslighting', desc: 'Suis-je victime de manipulation psychologique ? Évalue les signes en 12 questions.', color: '#a94e18' },
  { slug: 'burnout', emoji: '💤', title: 'Test Burnout', desc: 'Épuisement professionnel : où en es-tu ? Basé sur le Maslach Burnout Inventory.', color: '#f59e0b' },
  { slug: 'depression', emoji: '🌧️', title: 'Test Dépression', desc: 'Ai-je des signes de dépression ? Évaluation basée sur les critères DSM-5.', color: '#64748b' },
  { slug: 'narcissique', emoji: '🪞', title: 'Test Narcissisme', desc: 'Traits narcissiques vs trouble de personnalité : où se situe ton profil ?', color: '#c2611f' },
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
          { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Tests', item: `${BASE}/tests` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Tests Psychologiques Gratuits UrCecret',
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
      <main className="min-h-screen" style={{ background: '#f7f3ec', color: '#2b2622' }}>
        <header className="sticky top-0 z-20 backdrop-blur-md" style={{ background: 'rgba(247,243,236,0.9)', borderBottom: '1px solid #e8e0d4' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-black text-stone-900">
              Ur<span style={{ color: '#c2611f' }}>Cecret</span>
            </Link>
            <Link href="/quizzes" className="text-xs text-stone-400 hover:text-stone-900 transition-colors">Tous les quiz →</Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <p className="text-xs text-stone-400 uppercase tracking-[0.2em] font-semibold mb-3">Tests gratuits &amp; anonymes</p>
            <h1 className="font-display text-3xl font-black text-stone-900 leading-tight mb-4">
              Tests Psychologiques <span style={{ color: '#c2611f', fontStyle: 'italic' }}>Gratuits</span>
            </h1>
            <p className="text-stone-500 text-base leading-relaxed">
              Des guides complets et des tests basés sur des critères psychologiques établis.
              Résultats instantanés. Zéro compte requis.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {testList.map((test) => (
              <Link
                key={test.slug}
                href={`/tests/${test.slug}`}
                className="group rounded-2xl p-5 transition-all hover:scale-[1.01]"
                style={{ background: '#ffffff', border: '1px solid #e8e0d4', boxShadow: '0 1px 4px rgba(43,38,34,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${test.color}15`, border: `1px solid ${test.color}25` }}>
                    {test.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-stone-900 font-bold text-base leading-snug mb-1">{test.title}</h2>
                    <p className="text-stone-400 text-xs leading-relaxed">{test.desc}</p>
                  </div>
                  <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1"
                    style={{ color: test.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-stone-400 text-xs mt-10">
            100% anonyme · Zéro compte requis · Basé sur des critères cliniques
          </p>
        </div>
      </main>
    </>
  );
}
