import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';

export const metadata: Metadata = {
  title: {
    default: 'UrCecret — Tes vraies réponses',
    template: '%s | UrCecret',
  },
  description: 'Des questionnaires précis pour découvrir les vérités que tu ressens. 100% anonyme.',
  keywords: ['UrCecret', 'urcecret', 'quiz anonyme', 'test personnalité', 'questionnaire couple', 'quiz psychologique'],
  authors: [{ name: 'UrCecret', url: 'https://urcecret.site' }],
  creator: 'UrCecret',
  publisher: 'UrCecret',
  metadataBase: new URL('https://urcecret.site'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
      'en-US': '/',
    },
  },
  manifest: '/manifest.json',
  verification: {
    google: [
      'I8y7x7GMiFMyPn3Y8kpjSNQ-wJEEkLBB5ENx1Q5GI1A',
      '-dq9UWE1VHRVHgWUyp6OHvWHfuZ3gnIQqgJAfL6qa3Q',
    ],
  },
  openGraph: {
    title: 'UrCecret — Tes vraies réponses',
    description: 'Tes vraies réponses. Rien que la vérité.',
    type: 'website',
    siteName: 'UrCecret',
    locale: 'fr_FR',
    url: 'https://urcecret.site',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@urcecret',
    creator: '@urcecret',
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
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UrCecret',
  alternateName: ['UrCecret', 'urcecret.site'],
  url: 'https://urcecret.site',
  logo: 'https://urcecret.site/favicon.svg',
  description: 'Questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille.',
  foundingDate: '2024',
  sameAs: [],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'UrCecret',
  alternateName: 'urcecret.site',
  url: 'https://urcecret.site',
  description: 'Questionnaires anonymes pour découvrir les vérités que tu ressens.',
  inLanguage: ['fr-FR', 'en-US'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://urcecret.site/quizzes',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
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
      <body className="min-h-screen bg-[#09090b] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
