import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page introuvable — UrCecret',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-7xl select-none">🔒</div>
      <h1 className="text-5xl font-black text-white mb-3">404</h1>
      <p className="text-zinc-400 text-lg mb-2">Cette page n&apos;existe pas… ou reste secrète.</p>
      <p className="text-zinc-600 text-sm mb-8 max-w-xs">
        Peut-être que l&apos;URL a changé, ou que ce contenu est réservé aux abonnés.
      </p>
      <Link
        href="/"
        className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
