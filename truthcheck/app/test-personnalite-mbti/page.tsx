import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_MBTI_TYPES } from '@/lib/mbti';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Test de Personnalité MBTI Gratuit — Les 16 Types en Français',
  description: 'Passe le test de personnalité MBTI gratuit en français : 100 questions pour découvrir ton type parmi les 16 profils (INFJ, ENFP, INTJ, INTP…). Résultat instantané, sans inscription. Le test MBTI le plus complet en français.',
  keywords: [
    'test de personnalité MBTI', 'test MBTI gratuit', 'test MBTI en français',
    'les 16 personnalités', 'type MBTI', 'quel est mon type MBTI',
    'test personnalité gratuit', 'MBTI', '16 types de personnalité',
    'INFJ ENFP INTJ INTP', 'Myers Briggs français', 'test psychologique gratuit',
    'personnalité introverti extraverti', 'test de personnalité 16 types',
  ],
  alternates: { canonical: `${BASE}/test-personnalite-mbti` },
  openGraph: {
    title: 'Test de Personnalité MBTI Gratuit — 16 Types | UrCecret',
    description: 'Découvre ton type MBTI parmi les 16 profils. 100 questions, résultat instantané, gratuit et en français.',
    type: 'article',
    url: `${BASE}/test-personnalite-mbti`,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    images: [{ url: `${BASE}/api/og`, width: 1200, height: 630, alt: 'Test MBTI Gratuit — UrCecret' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test de Personnalité MBTI Gratuit',
    description: '100 questions · 16 types · Résultat instantané · Gratuit',
    images: [`${BASE}/api/og`],
  },
};

const GROUPS = [
  {
    name: 'Analystes',
    color: '#a94e18',
    emoji: '🔬',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    desc: 'Penseurs rationnels, stratèges et innovateurs.',
  },
  {
    name: 'Diplomates',
    color: '#d17d52',
    emoji: '🌸',
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    desc: 'Idéalistes empathiques, portés par leurs valeurs.',
  },
  {
    name: 'Sentinelles',
    color: '#0ea5e9',
    emoji: '🛡️',
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    desc: 'Fiables, organisés, piliers de la société.',
  },
  {
    name: 'Explorateurs',
    color: '#f59e0b',
    emoji: '🧭',
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    desc: 'Spontanés, adaptables, experts du moment présent.',
  },
];

const FAQ = [
  {
    q: "Qu'est-ce que le test de personnalité MBTI ?",
    a: "Le MBTI (Myers-Briggs Type Indicator) est un outil psychologique qui classe les individus en 16 types de personnalité selon 4 dimensions : Extraverti/Introverti (E/I), Sensitif/Intuitif (S/N), Pensant/Sentant (T/F), Judicatif/Perceptif (J/P). Créé par Isabel Briggs Myers et sa mère Katharine Cook Briggs dans les années 1940, il reste l'un des tests de personnalité les plus utilisés au monde.",
  },
  {
    q: "Combien de questions contient le test MBTI sur UrCecret ?",
    a: "Le test MBTI d'UrCecret contient 100 questions soigneusement sélectionnées pour maximiser la précision du résultat. Chaque question évalue l'une des 4 dimensions MBTI. Le test dure en moyenne 8 à 12 minutes.",
  },
  {
    q: "Le test MBTI d'UrCecret est-il vraiment gratuit ?",
    a: "Oui, le test de personnalité MBTI est entièrement gratuit sur UrCecret. Tu obtiens ton type (INFJ, ENFP, INTJ, etc.) sans inscription ni paiement. Une version Premium avec une analyse approfondie est disponible en option.",
  },
  {
    q: "Quelle est la différence entre les 16 types de personnalité ?",
    a: "Les 16 types MBTI se répartissent en 4 groupes : Analystes (INTJ, INTP, ENTJ, ENTP), Diplomates (INFJ, INFP, ENFJ, ENFP), Sentinelles (ISTJ, ISFJ, ESTJ, ESFJ) et Explorateurs (ISTP, ISFP, ESTP, ESFP). Chaque type a ses propres forces, faiblesses, style relationnel et orientations professionnelles.",
  },
  {
    q: "Quel est le type de personnalité MBTI le plus rare ?",
    a: "L'INFJ est le type le plus rare, représentant environ 1 à 2% de la population mondiale. Parmi les types les plus courants, on trouve l'ISFJ (~14%) et l'ESFJ (~12%).",
  },
  {
    q: "Mon résultat MBTI peut-il changer avec le temps ?",
    a: "Oui, le type MBTI peut évoluer selon les phases de vie, les expériences et la maturité personnelle. Il est recommandé de repasser le test tous les 2-3 ans. Certaines préférences restent stables (souvent E/I) tandis que d'autres peuvent évoluer.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Test de Personnalité MBTI Gratuit — Les 16 Types en Français',
  description: 'Guide complet sur le test de personnalité MBTI : les 16 types, comment interpréter son résultat, et le test gratuit en français.',
  author: { '@type': 'Organization', name: 'UrCecret', url: BASE },
  publisher: { '@type': 'Organization', name: 'UrCecret', logo: { '@type': 'ImageObject', url: `${BASE}/favicon.svg` } },
  url: `${BASE}/test-personnalite-mbti`,
  mainEntityOfPage: `${BASE}/test-personnalite-mbti`,
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Test MBTI', item: `${BASE}/test-personnalite-mbti` },
  ],
};

export default function TestPersonnaliteMbtiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#d17d52,#e0a380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
              <span className="text-gray-900">Cecret</span>
            </Link>
            <Link href="/quiz/personnalite" className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}>
              Passer le test →
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-6 flex gap-2 items-center">
            <Link href="/" className="hover:text-gray-700">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600">Test de personnalité MBTI</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
              Test de Personnalité MBTI Gratuit
            </h1>
            <p className="text-xl text-gray-500 mb-2">Découvre ton type parmi les 16 profils psychologiques</p>
            <p className="text-sm text-gray-400 mb-8">100 questions · Résultat instantané · Gratuit · En français</p>

            <Link
              href="/quiz/personnalite"
              className="inline-block px-8 py-4 rounded-2xl text-lg font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 8px 32px rgba(169,78,24,0.3)' }}
            >
              Passer le test MBTI gratuit →
            </Link>

            <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500">
              {[['🧪', '100 questions'], ['⚡', 'Résultat immédiat'], ['🔒', 'Sans inscription'], ['🇫🇷', 'En français']].map(([icon, label]) => (
                <div key={label as string} className="flex flex-col items-center gap-1">
                  <span className="text-lg">{icon}</span>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Intro */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Qu'est-ce que le test MBTI ?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Le <strong>test de personnalité MBTI</strong> (Myers-Briggs Type Indicator) est l'un des outils psychologiques les plus utilisés au monde. Développé par Isabel Briggs Myers et sa mère Katharine Cook Briggs dans les années 1940, il s'appuie sur les théories du psychologue Carl Jung pour identifier 16 types de personnalité distincts.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Chaque type est défini par une combinaison de 4 dimensions :
            </p>
            <ul className="space-y-2 mb-4 pl-4">
              {[
                ['E / I', 'Extraverti ou Introverti — comment tu recharges ton énergie'],
                ['S / N', 'Sensitif ou Intuitif — comment tu perçois le monde'],
                ['T / F', 'Pensant ou Sentant — comment tu prends tes décisions'],
                ['J / P', 'Judicatif ou Perceptif — comment tu t\'organises'],
              ].map(([dim, desc]) => (
                <li key={dim} className="flex gap-3 text-sm text-gray-600">
                  <span className="font-bold text-violet-600 w-8 flex-shrink-0">{dim}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Le test MBTI d'UrCecret compte <strong>100 questions</strong> pour maximiser la précision de ton résultat. Il est entièrement <strong>gratuit</strong>, disponible <strong>en français</strong>, et ne nécessite aucune inscription.
            </p>
          </section>

          {/* CTA milieu */}
          <div className="my-10 p-8 rounded-3xl text-center" style={{ background: 'linear-gradient(135deg,#f5f3ff,#fdf2f8)' }}>
            <p className="text-lg font-bold text-gray-900 mb-2">Prêt à découvrir ton type ?</p>
            <p className="text-sm text-gray-500 mb-5">100 questions · 8 à 12 minutes · Résultat parmi les 16 types MBTI</p>
            <Link
              href="/quiz/personnalite"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}
            >
              Commencer le test MBTI →
            </Link>
          </div>

          {/* 16 types */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Les 16 types de personnalité MBTI</h2>
            <p className="text-gray-500 text-sm mb-6">Clique sur un type pour voir son profil complet.</p>

            <div className="space-y-6">
              {GROUPS.map((group) => (
                <div key={group.name}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{group.emoji}</span>
                    <h3 className="text-base font-black text-gray-900">{group.name}</h3>
                    <span className="text-xs text-gray-400">— {group.desc}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {group.types.map((code) => (
                      <Link
                        key={code}
                        href={`/types/${code.toLowerCase()}`}
                        className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-400 transition-all hover:shadow-sm"
                      >
                        <span className="font-bold text-gray-900">{code}</span>
                        <span className="text-xs text-gray-400">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link href="/types" className="text-sm text-violet-600 hover:text-violet-800 font-medium">
                Voir le guide complet des 16 types →
              </Link>
            </div>
          </section>

          {/* Comment interpréter */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Comment interpréter ton résultat MBTI ?</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Une fois le test terminé, tu obtiens un code de 4 lettres — par exemple <strong>INFJ</strong>, <strong>ENFP</strong>, ou <strong>INTJ</strong>. Ce code est la combinaison de tes préférences sur les 4 dimensions.
              </p>
              <p>
                Chaque type a ses propres <strong>forces</strong>, <strong>faiblesses</strong>, <strong>style relationnel</strong>, et <strong>orientations professionnelles</strong>. Par exemple, les INFJ sont souvent décrits comme des idéalistes visionnaires, tandis que les ESTP sont des pragmatiques du moment présent.
              </p>
              <p>
                Le résultat n'est pas une cage : c'est un <strong>outil de connaissance de soi</strong>. Ton type peut évoluer légèrement avec le temps et ne définit pas ce que tu peux accomplir.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Questions fréquentes sur le test MBTI</h2>
            <div className="space-y-3">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group border border-gray-200 rounded-xl">
                  <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-gray-700 list-none flex justify-between items-center hover:text-gray-900 transition-colors">
                    {q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <div className="text-center py-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Quel est ton type MBTI ?</h2>
            <p className="text-gray-500 mb-6">100 questions · Gratuit · Résultat immédiat</p>
            <Link
              href="/quiz/personnalite"
              className="inline-block px-8 py-4 rounded-2xl text-lg font-black text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 8px 32px rgba(169,78,24,0.3)' }}
            >
              Passer le test MBTI gratuit →
            </Link>
            <p className="mt-4 text-xs text-gray-400">
              Déjà passé le test ?{' '}
              <Link href="/types" className="text-violet-600 hover:underline">Explorer les 16 types →</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
