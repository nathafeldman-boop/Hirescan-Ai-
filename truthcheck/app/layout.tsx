import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = 'https://ursecret.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'UrSecret — Tes vraies réponses',
    template: '%s | UrSecret',
  },
  description:
    'UrSecret : des questionnaires précis et anonymes pour découvrir la vérité sur ton couple, tes amis, ta famille. Résultats instantanés, 100% gratuit.',
  keywords: [
    'UrSecret',
    'questionnaire anonyme',
    'quiz vérité',
    'mon partenaire me trompe',
    'suis-je adopté',
    'test couple',
    'quiz amitié',
    'orientation sexuelle quiz',
    'questionnaire psychologique',
    'vérité caché',
  ],
  authors: [{ name: 'UrSecret' }],
  creator: 'UrSecret',
  publisher: 'UrSecret',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'UrSecret',
    title: 'UrSecret — Tes vraies réponses',
    description: 'Des questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille. Résultats instantanés.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'UrSecret — Tes vraies réponses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrSecret — Tes vraies réponses',
    description: 'Des questionnaires anonymes pour découvrir la vérité. 100% gratuit.',
    images: ['/api/og'],
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      'application/rss+xml': `${BASE_URL}/feed.xml`,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#09090b] text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'UrSecret',
              url: BASE_URL,
              description:
                'Des questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille.',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Any',
              browserRequirements: 'Requires JavaScript',
              inLanguage: 'fr',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
                description: 'Quiz gratuit, analyse complète à 4,99€/mois',
              },
              author: { '@type': 'Organization', name: 'UrSecret', url: BASE_URL },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
