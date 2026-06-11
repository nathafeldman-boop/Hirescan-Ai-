import type { Metadata } from 'next';
import Link from 'next/link';
import PersonnaliteClient from './PersonnaliteClient';
import UserMenu from '@/components/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Test MBTI Gratuit — 16 Types de Personnalité en Français',
  description: 'Test de personnalité MBTI gratuit : 100 questions pour découvrir ton profil parmi les 16 types — INFJ, ENFP, INTJ, INTP, ESFP, ISFJ, ENTJ et plus. Résultat instantané, sans inscription. Le test MBTI le plus complet en français.',
  keywords: [
    'test MBTI', 'MBTI gratuit', 'test de personnalité MBTI', '16 types MBTI',
    'INFJ', 'ENFP', 'INTJ', 'INTP', 'ENFJ', 'ENTP', 'INFP', 'ISFJ',
    'ESFP', 'ESTJ', 'ISTP', 'ISFP', 'ESTP', 'ENTJ', 'ESFJ', 'ISTJ',
    'test personnalité gratuit', 'type de personnalité', 'quel est mon type MBTI',
    'test MBTI en français', 'personnalité Myers Briggs', '16 personnalités',
    'test psychologique gratuit', 'profil MBTI', 'test introversion extraversion',
  ],
  alternates: { canonical: `${BASE}/quiz/personnalite` },
  openGraph: {
    title: 'Test MBTI Gratuit — 16 Types de Personnalité | UrCecret',
    description: 'Découvre ton type MBTI en 100 questions. INFJ, ENFP, INTJ, INTP et 12 autres profils. Gratuit, instantané, en français.',
    type: 'website',
    url: `${BASE}/quiz/personnalite`,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Test MBTI Gratuit — UrCecret' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test MBTI Gratuit — 16 Types de Personnalité',
    description: 'Découvre ton profil MBTI en 100 questions. Gratuit, instantané.',
    images: ['/api/og'],
  },
};

const TYPE_PREVIEW = [
  { code: 'INFJ', name: "L'Avocat", emoji: '🌙', color: '#7c3aed', rarity: '1.5%' },
  { code: 'ENFP', name: 'Le Champion', emoji: '🦋', color: '#ec4899', rarity: '8%' },
  { code: 'INTJ', name: "L'Architecte", emoji: '🏛️', color: '#6366f1', rarity: '2%' },
  { code: 'ISFJ', name: 'Le Défenseur', emoji: '🛡️', color: '#0ea5e9', rarity: '13%' },
  { code: 'ENTP', name: 'Le Débatteur', emoji: '⚡', color: '#f59e0b', rarity: '3%' },
  { code: 'INFP', name: 'Le Médiateur', emoji: '🌿', color: '#10b981', rarity: '4%' },
  { code: 'ESTJ', name: 'Le Directeur', emoji: '📋', color: '#0891b2', rarity: '11%' },
  { code: 'ESFP', name: "L'Animateur", emoji: '🎉', color: '#f59e0b', rarity: '9%' },
];

const quizSchema = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: 'Test MBTI Gratuit — 16 Types de Personnalité',
  description: 'Test de personnalité MBTI gratuit en français. 24 questions pour découvrir ton type parmi les 16 profils psychologiques : INFJ, ENFP, INTJ, INTP, ESFP, ISFJ, ENTJ et plus.',
  url: `${BASE}/quiz/personnalite`,
  inLanguage: 'fr',
  isAccessibleForFree: true,
  educationalLevel: 'beginner',
  about: { '@type': 'Thing', name: 'MBTI — Myers-Briggs Type Indicator' },
  provider: { '@type': 'Organization', name: 'UrCecret', url: BASE },
  hasPart: [
    { '@type': 'Question', name: 'Quel est mon type MBTI ?' },
    { '@type': 'Question', name: 'Suis-je introverti ou extraverti ?' },
    { '@type': 'Question', name: 'Comment fonctionner avec mon type de personnalité ?' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qu\'est-ce que le test MBTI ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le MBTI (Myers-Briggs Type Indicator) est un test de personnalité basé sur les travaux de Carl Jung. Il identifie 16 types de personnalité selon 4 dimensions : Extraversion/Introversion, Sensation/Intuition, Pensée/Sentiment, Jugement/Perception.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels sont les 16 types MBTI ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les 16 types MBTI sont : INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP, ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP.',
      },
    },
    {
      '@type': 'Question',
      name: 'Le test MBTI est-il gratuit ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, le test MBTI UrCecret est entièrement gratuit. 24 questions, résultat instantané, sans inscription ni email requis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps dure le test MBTI ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le test MBTI UrCecret comprend 24 questions et dure en moyenne 5 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le type MBTI le plus rare ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'L\'INFJ est le type MBTI le plus rare, représentant environ 1 à 2% de la population mondiale.',
      },
    },
  ],
};

export default function PersonnalitePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Server-rendered SEO content — hidden visually */}
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        <h1>Test MBTI Gratuit — 16 Types de Personnalité en Français</h1>
        <p>
          Test de personnalité MBTI gratuit : découvre ton type parmi les 16 profils psychologiques.
          24 questions pour savoir si tu es INFJ, ENFP, INTJ, INTP, ESFP ou l&apos;un des 11 autres types MBTI.
          Résultat instantané, sans inscription.
        </p>
        <ul>
          <li>INFJ — L&apos;Avocat (1.5%)</li><li>INFP — Le Médiateur (4%)</li>
          <li>INTJ — L&apos;Architecte (2%)</li><li>INTP — Le Logicien (3%)</li>
          <li>ENFJ — Le Protagoniste (2.5%)</li><li>ENFP — Le Champion (8%)</li>
          <li>ENTJ — Le Commandant (1.8%)</li><li>ENTP — Le Débatteur (3.2%)</li>
          <li>ISFJ — Le Défenseur (13%)</li><li>ISFP — L&apos;Aventurier (8.8%)</li>
          <li>ISTJ — L&apos;Inspecteur (11.6%)</li><li>ISTP — Le Virtuose (5.4%)</li>
          <li>ESFJ — Le Consul (12%)</li><li>ESFP — L&apos;Animateur (8.5%)</li>
          <li>ESTJ — Le Directeur (8.7%)</li><li>ESTP — L&apos;Entrepreneur (4.3%)</li>
        </ul>
      </div>

      {/* Hero landing page */}
      <main className="min-h-screen bg-white text-gray-900">
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
              <span className="text-gray-900">Cecret</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/types" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">16 types MBTI →</Link>
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-xs text-violet-600 font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Gratuit · 12 minutes · Résultat instantané
          </div>

          <h1 className="text-4xl sm:text-5xl font-black mb-5 leading-tight text-gray-900">
            Test{' '}
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MBTI
            </span>
            {' '}Gratuit — Quel est ton type ?
          </h1>

          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            100 questions · 16 types de personnalité · INFJ, ENFP, INTJ et plus.
            Le test MBTI le plus complet en français — résultat instantané.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12 text-center">
            {[
              { n: '2,3M', label: 'tests passés' },
              { n: '16', label: 'types distincts' },
              { n: '12 min', label: 'en moyenne' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="text-2xl font-black text-gray-900">{n}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Type preview grid */}
          <div className="grid grid-cols-4 gap-2 mb-12 max-w-xl mx-auto">
            {TYPE_PREVIEW.map(t => (
              <div
                key={t.code}
                className="rounded-lg p-3 text-center border bg-gray-50"
                style={{ borderColor: `${t.color}40` }}
              >
                <div className="text-xl mb-1">{t.emoji}</div>
                <div className="text-xs font-bold text-gray-900">{t.code}</div>
                <div className="text-xs text-gray-500 leading-tight">{t.name}</div>
              </div>
            ))}
          </div>

          <PersonnaliteClient />

          {/* How it works */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: '🎯', title: '100 questions ciblées', desc: '25 questions par dimension psychologique. Pas de bonnes ou mauvaises réponses.' },
              { icon: '⚡', title: 'Résultat immédiat', desc: 'Ton type parmi les 16 profils en moins de 12 minutes. Gratuit, sans inscription.' },
              { icon: '🔓', title: 'Rapport complet en option', desc: 'Relations, carrière, forces, croissance personnelle. Accessible avec Premium.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* SEO text */}
          <div className="mt-16 text-left space-y-4 text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
            <h2 className="text-base font-bold text-gray-900">Pourquoi passer ce test de personnalité ?</h2>
            <p>
              La théorie des 16 types de personnalité est l&apos;un des modèles psychologiques les plus utilisés au
              monde. Basé sur les travaux de Carl Jung, puis développé par Isabel Briggs Myers et Katharine Cook
              Briggs, il identifie 16 profils distincts à partir de 4 dimensions cognitives fondamentales.
            </p>
            <p>
              Comprendre ton type de personnalité t&apos;aide à mieux comprendre comment tu te ressources, prends des
              décisions, traites l&apos;information et organises ta vie. Ce n&apos;est pas une case dans laquelle t&apos;enfermer —
              c&apos;est un miroir qui révèle tes forces naturelles.
            </p>
            <h2 className="text-base font-bold text-gray-900">Comment fonctionne ce test ?</h2>
            <p>
              Notre test analyse tes préférences sur 4 axes : <strong className="text-gray-700">Extraversion vs Introversion</strong> (où tu
              puises ton énergie), <strong className="text-gray-700">Sensation vs Intuition</strong> (comment tu perçois l&apos;information),
              <strong className="text-gray-700"> Pensée vs Sentiment</strong> (comment tu prends des décisions), et <strong className="text-gray-700">Jugement vs Perception</strong> (comment
              tu organises ta vie). Le résultat : l&apos;un des 16 types comme INFJ, ENFP, INTJ, ou ESFP.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
