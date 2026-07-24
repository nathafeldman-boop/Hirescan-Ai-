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
import InAppBrowserBanner from '@/components/InAppBrowserBanner';
import { Suspense } from 'react';
import AffiliateTracker from '@/components/AffiliateTracker';
import Analytics from '@/components/Analytics';
import ChatFab from '@/components/ChatFab';

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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UrCecret',
  alternateName: ['UrCecret', 'urcecret.site'],
  url: BASE,
  logo: `${BASE}/logo-oracle.png`,
  description: 'Test de personnalité MBTI gratuit — 16 types psychologiques en français.',
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
  description: 'Test MBTI gratuit — découvre ton type de personnalité parmi 16 profils.',
  inLanguage: ['fr-FR', 'en-US'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE}/quiz/personnalite`,
    },
  },
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
        <link rel="search" type="application/opensearchdescription+xml" title="UrCecret" href="/opensearch.xml" />
      </head>
      <body className="min-h-screen bg-ink text-white antialiased">
        <Providers>
          <Tracker />
          <InAppBrowserBanner />
          <Suspense fallback={null}>
            <AffiliateTracker />
          </Suspense>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <ChatFab />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
