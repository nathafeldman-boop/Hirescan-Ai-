import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TruthCheck — Découvre les vérités cachées',
  description: 'Des questionnaires de 30 questions pour découvrir les vérités qui t\'entourent. Infidélité, adoption, amour, vrais amis.',
  openGraph: {
    title: 'TruthCheck',
    description: 'Découvre les vérités cachées qui t\'entourent',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#09090b] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
