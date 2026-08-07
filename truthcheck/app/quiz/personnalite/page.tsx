import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import PersonnaliteClient from './PersonnaliteClient';
import UserMenu from '@/components/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Test MBTI Gratuit — 16 Types de Personnalité en Français',
  description: 'Test de personnalité MBTI gratuit : 24 questions pour découvrir ton profil parmi les 16 types — INFJ, ENFP, INTJ, INTP, ESFP, ISFJ, ENTJ et plus. Résultat instantané, sans inscription. Le test MBTI le plus complet en français.',
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
    description: 'Découvre ton type MBTI en 24 questions. INFJ, ENFP, INTJ, INTP et 12 autres profils. Gratuit, instantané, en français.',
    type: 'website',
    url: `${BASE}/quiz/personnalite`,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Test MBTI Gratuit — UrCecret' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test MBTI Gratuit — 16 Types de Personnalité',
    description: 'Découvre ton profil MBTI en 24 questions. Gratuit, instantané.',
    images: ['/api/og'],
  },
};

const TYPE_PREVIEW = [
  { code: 'INFJ', name: "L'Avocat", emoji: '🌙', color: '#a94e18', rarity: '1.5%' },
  { code: 'ENFP', name: 'Le Champion', emoji: '🦋', color: '#d17d52', rarity: '8%' },
  { code: 'INTJ', name: "L'Architecte", emoji: '🏛️', color: '#b07d2b', rarity: '2%' },
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

export default async function PersonnalitePage() {
  // Le test reste accessible SANS compte (promesse marketing "gratuit, sans
  // inscription" — voir les FAQ/schema ci-dessus) : on ne gate donc QUE les
  // comptes déjà connectés dont le parcours de démarrage n'est pas terminé —
  // voir lib/funnelGate.ts. 'mbti' est exclu exprès : c'est justement l'étape
  // que cette page sert, donc rediriger dessus créerait une boucle sur
  // elle-même (repéré le 07/08 : router.push('/quiz/personnalite') depuis
  // /bienvenue était systématiquement annulé en ~30ms par ce garde-fou avant
  // le fix, renvoyant tout le monde direct sur le Journal).
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    const pendingStep = await resolveFunnelStep(session.user.id);
    if (pendingStep && pendingStep !== 'mbti') redirect(funnelStepPath(pendingStep));
  }

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
      <main className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
        <header className="sticky top-0 z-20" style={{ borderBottom: '1px solid var(--line)', background: 'rgba(242,236,222,0.9)', backdropFilter: 'blur(10px)' }}>
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ color: 'var(--gold)' }}>Ur</span>
              <span style={{ color: 'var(--ink)' }}>Cecret</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/types" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">16 types MBTI →</Link>
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="quiz-page-wrap max-w-3xl mx-auto px-4 py-16 text-center">
          {/* Décor marketing/SEO au-dessus du quiz — masqué pendant le test via
              body.quiz-active (voir globals) mais conservé dans le DOM pour Google. */}
          <div className="quiz-chrome">
          {/* Crest — emblème de marque, sur surface claire (le champ crème du
              médaillon se fond dans --paper). Version WebP légère (~26 Ko). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-oracle-256.webp"
            alt="UrCecret"
            width={104}
            height={104}
            className="mx-auto mb-6 ur-reveal"
            style={{ width: 104, height: 104 }}
          />
          {/* Badge */}
          <div className="ur-badge mb-8 gap-2" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)' }} />
            Gratuit · 3 minutes · Résultat instantané
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-black mb-5 leading-tight" style={{ color: 'var(--ink)' }}>
            Test{' '}
            <em className="not-italic" style={{ color: 'var(--gold)' }}>MBTI</em>
            {' '}Gratuit — Quel est ton type ?
          </h1>

          <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto leading-relaxed">
            24 questions · 16 types de personnalité · INFJ, ENFP, INTJ et plus.
            Le test MBTI en français — résultat instantané en moins de 3 minutes.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12 text-center">
            {[
              { n: '2,3M', label: 'tests passés' },
              { n: '16', label: 'types distincts' },
              { n: '3 min', label: 'en moyenne' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-black" style={{ color: 'var(--ink)' }}>{n}</div>
                <div className="text-xs text-stone-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Type preview grid */}
          <div className="grid grid-cols-4 gap-2 mb-12 max-w-xl mx-auto">
            {TYPE_PREVIEW.map(t => (
              <div
                key={t.code}
                className="ur-panel rounded-lg p-3 text-center"
                style={{ borderColor: `${t.color}40` }}
              >
                <div className="text-xl mb-1">{t.emoji}</div>
                <div className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{t.code}</div>
                <div className="text-xs text-stone-500 leading-tight">{t.name}</div>
              </div>
            ))}
          </div>
          </div>{/* /quiz-chrome (au-dessus) */}

          <PersonnaliteClient />

          {/* Décor marketing/SEO sous le quiz — masqué pendant le test. */}
          <div className="quiz-chrome">
          {/* How it works */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: '🎯', title: '24 questions ciblées', desc: '6 questions par dimension psychologique. Pas de bonnes ou mauvaises réponses.' },
              { icon: '⚡', title: 'Résultat immédiat', desc: 'Ton type parmi les 16 profils en moins de 3 minutes. Gratuit, sans inscription.' },
              { icon: '🔓', title: 'Rapport complet en option', desc: 'Relations, carrière, forces, croissance personnelle. Accessible avec Premium.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="ur-panel p-5">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ink)' }}>{title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* SEO text */}
          <div className="mt-16 text-left space-y-4 text-sm text-stone-500 leading-relaxed max-w-2xl mx-auto">
            <h2 className="text-base font-bold" style={{ color: 'var(--ink)' }}>Pourquoi passer ce test de personnalité ?</h2>
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
            <h2 className="text-base font-bold" style={{ color: 'var(--ink)' }}>Comment fonctionne ce test ?</h2>
            <p>
              Notre test analyse tes préférences sur 4 axes : <strong style={{ color: 'var(--ink)' }}>Extraversion vs Introversion</strong> (où tu
              puises ton énergie), <strong style={{ color: 'var(--ink)' }}>Sensation vs Intuition</strong> (comment tu perçois l&apos;information),
              <strong style={{ color: 'var(--ink)' }}> Pensée vs Sentiment</strong> (comment tu prends des décisions), et <strong style={{ color: 'var(--ink)' }}>Jugement vs Perception</strong> (comment
              tu organises ta vie). Le résultat : l&apos;un des 16 types comme INFJ, ENFP, INTJ, ou ESFP.
            </p>
          </div>
          </div>{/* /quiz-chrome (dessous) */}
        </div>
      </main>
    </>
  );
}
