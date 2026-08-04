import type { Metadata } from 'next';
import { Playfair_Display, Instrument_Sans } from 'next/font/google';
import './globals.css';
import Providers from './Providers';

// « L'Oracle » type system — Playfair Display (high-contrast didone, the
// dramatic, mystical/editorial register: tarot title cards, astrology decks)
// + Instrument Sans (body/UI, neutral workhorse).
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  style: ['normal', 'italic'],
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
import Tracker from './Tracker';
import InAppGate from '@/components/InAppGate';
import { Suspense } from 'react';
import AffiliateTracker from '@/components/AffiliateTracker';
import Analytics from '@/components/Analytics';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import GlobalTabBar from '@/components/GlobalTabBar';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: {
    default: 'UrCecret — Test MBTI Gratuit · 16 Types de Personnalité',
    template: '%s | UrCecret',
  },
  description: 'Découvre ton type de personnalité MBTI parmi les 16 profils psychologiques : INFJ, ENFP, INTJ, INTP, ESFP et plus. Test gratuit, 24 questions, résultat instantané. Le test de personnalité le plus complet en français.',
  keywords: [
    'test MBTI', 'MBTI gratuit', 'test de personnalité', '16 types de personnalité',
    'type MBTI', 'MBTI français', 'test personnalité gratuit', '16 personnalités',
    'INFJ', 'ENFP', 'INTJ', 'INTP', 'ENFJ', 'ENTP', 'INFP', 'ISFJ',
    'ESFP', 'ESTJ', 'ISTP', 'ISFP', 'ESTP', 'ENTJ', 'ESFJ', 'ISTJ',
    'UrCecret', 'urcecret', 'urcecret.site', 'test psychologique',
    'profil personnalité', 'type personnalité', 'quiz personnalité',
  ],
  authors: [{ name: 'UrCecret', url: BASE }],
  creator: 'UrCecret',
  publisher: 'UrCecret',
  metadataBase: new URL(BASE),
  alternates: {
    canonical: '/',
    languages: { 'fr-FR': '/' },
  },
  manifest: '/manifest.json',
  verification: {
    google: [
      'I8y7x7GMiFMyPn3Y8kpjSNQ-wJEEkLBB5ENx1Q5GI1A',
      '-dq9UWE1VHRVHgWUyp6OHvWHfuZ3gnIQqgJAfL6qa3Q',
    ],
  },
  openGraph: {
    title: 'UrCecret — Test MBTI Gratuit · 16 Types de Personnalité',
    description: 'Découvre ton type MBTI parmi les 16 profils psychologiques. Test gratuit, 24 questions, résultat instantané.',
    type: 'website',
    siteName: 'UrCecret',
    locale: 'fr_FR',
    url: BASE,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@urcecret',
    creator: '@urcecret',
    title: 'UrCecret — Test MBTI Gratuit',
    description: 'Découvre ton type de personnalité MBTI. 16 profils · 24 questions · Gratuit.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    // Google Search n'affiche un favicon que si c'est un carré multiple de 48px.
    icon: [
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-96.png',
    apple: '/apple-icon.png',
  },
};

// ── Description canonique GEO ────────────────────────────────────────────
// Une seule source de vérité, réutilisée telle quelle dans les 3 schémas
// ci-dessous (Organization, WebSite, SoftwareApplication) et à recopier mot
// pour mot sur toute présence externe (Product Hunt, AlternativeTo,
// annuaires...) — la cohérence des mêmes faits répétés partout est
// elle-même un signal que les moteurs génératifs pondèrent. Volontairement
// plus large que "test MBTI" : reflète le vrai produit (accompagnement
// continu par IA, pas un résultat ponctuel) pour matcher aussi les
// requêtes sur la confiance en soi, le stress, les émotions.
const CANONICAL_DESCRIPTION =
  "UrCecret est une application française de développement personnel propulsée par l'IA : test de personnalité MBTI (16 types), journal émotionnel quotidien, coach IA (Elio) qui s'adapte à ton objectif personnel, et parcours guidés pour reprendre confiance en soi, gérer son stress, mieux comprendre tes émotions et tes relations.";

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UrCecret',
  alternateName: ['UrCecret', 'urcecret.site'],
  url: BASE,
  logo: `${BASE}/logo-oracle.png`,
  description: CANONICAL_DESCRIPTION,
  foundingDate: '2024',
  sameAs: [],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE}/#website`,
  name: 'UrCecret',
  alternateName: 'urcecret.site',
  url: BASE,
  description: CANONICAL_DESCRIPTION,
  inLanguage: ['fr-FR', 'en-US'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE}/quiz/personnalite`,
    },
  },
};

// ── GEO (moteurs génératifs — ChatGPT, Claude, Perplexity) ──────────────────
// Distinct d'Organization/WebSite ci-dessus : c'est le type schema.org que
// ces moteurs pillent le plus directement pour répondre à "quelle
// application pour X" (nom, catégorie, prix, ce que fait l'app en une
// phrase). Pas d'aggregateRating : aucune note réelle collectée à ce jour,
// en inventer une serait un contenu structuré trompeur (pénalisé par
// Google, et contraire à l'idée même d'être une source fiable pour une IA).
const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'UrCecret',
  url: BASE,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  description: CANONICAL_DESCRIPTION,
  inLanguage: 'fr-FR',
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter',
      price: '1.99',
      priceCurrency: 'EUR',
      priceValidUntil: '2027-12-31',
      description: 'Profil de personnalité complet débloqué + coach IA Elio, sans engagement.',
    },
    {
      '@type': 'Offer',
      name: 'Test de personnalité',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Test MBTI gratuit, résultat immédiat, sans inscription.',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${instrumentSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        <link rel="search" type="application/opensearchdescription+xml" title="UrCecret" href="/opensearch.xml" />
      </head>
      <body className="min-h-screen bg-ink text-white antialiased">
        <Providers>
          <Tracker />
          <InAppGate />
          <Suspense fallback={null}>
            <AffiliateTracker />
          </Suspense>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <VercelAnalytics />
          {children}
          <Suspense fallback={null}>
            <GlobalTabBar />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
