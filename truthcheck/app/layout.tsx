import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';

export const metadata: Metadata = {
  title: 'UrCecret — Tes vraies réponses',
  description: 'Des questionnaires précis pour découvrir les vérités que tu ressens. 100% anonyme.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  verification: {
    google: [
      'I8y7x7GMiFMyPn3Y8kpjSNQ-wJEEkLBB5ENx1Q5GI1A',
      '-dq9UWE1VHRVHgWUyp6OHvWHfuZ3gnIQqgJAfL6qa3Q',
    ],
  },
  openGraph: {
    title: 'UrCecret',
    description: 'Tes vraies réponses. Rien que la vérité.',
    type: 'website',
    siteName: 'UrCecret',
    locale: 'fr_FR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#09090b] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
