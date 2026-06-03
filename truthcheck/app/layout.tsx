import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Providers from './Providers';

const BASE = 'https://ursecret.vercel.app';

export const metadata: Metadata = {
  title: {
    template: '%s | UrSecret',
    default: 'UrSecret — Tests Psychologiques Gratuits en Français',
  },
  description: 'Tests psychologiques gratuits et anonymes en français. Style d\'attachement, langages de l\'amour, gaslighting, burnout, dépression, narcissisme. Résultats instantanés.',
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
  alternates: {
    canonical: BASE,
    languages: {
      'fr-FR': BASE,
      'fr': BASE,
      'x-default': BASE,
    },
  },
  openGraph: {
    title: 'UrSecret — Tests Psychologiques Gratuits',
    description: 'Tests psychologiques anonymes en français. Résultats instantanés.',
    type: 'website',
    siteName: 'UrSecret',
    locale: 'fr_FR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-FR">
      <body className="min-h-screen bg-[#09090b] text-white antialiased flex flex-col">
        <Providers>
          <div className="flex-1">{children}</div>
        </Providers>
        <footer className="border-t border-white/5 bg-[#09090b]" style={{ position: 'relative', zIndex: 10 }}>
          <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-zinc-600">© {new Date().getFullYear()} UrSecret — France 🇫🇷</span>
            <nav className="flex flex-wrap items-center gap-4 justify-center">
              <Link href="/mentions-legales" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Mentions légales</Link>
              <Link href="/politique-confidentialite" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Confidentialité</Link>
              <Link href="/cgu" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">CGU</Link>
              <Link href="/quizzes" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Tous les quiz</Link>
              <Link href="/tests" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Guides psy</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
