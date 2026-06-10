import type { Metadata } from 'next';
import Link from 'next/link';
import DuoMbtiClient from './DuoMbtiClient';
import UserMenu from '@/components/UserMenu';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Test de compatibilité MBTI — Comparez vos personnalités | UrCecret',
  description: 'Découvrez votre compatibilité MBTI avec votre partenaire, ami ou collègue. Analyse complète des 4 dimensions de personnalité. Gratuit et instantané.',
  keywords: ['compatibilité MBTI', 'test couple MBTI', 'compatibilité personnalité', 'MBTI couple', 'test compatibilité'],
  alternates: { canonical: `${BASE}/duo` },
  openGraph: {
    title: 'Test de compatibilité MBTI | UrCecret',
    description: 'Sélectionnez vos types MBTI et découvrez votre compatibilité réelle.',
    url: `${BASE}/duo`,
    type: 'website',
  },
};

export default function DuoPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-gray-900">Cecret</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/quiz/personnalite" className="text-xs text-violet-600 font-medium hover:text-violet-700 transition-colors">
              Faire le test →
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-600 text-xs font-semibold uppercase tracking-widest">Compatibilité MBTI</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">
            Comparez vos{' '}
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              personnalités
            </span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            Sélectionnez vos deux types MBTI. L&apos;IA analyse votre compatibilité sur 4 dimensions et révèle vos forces et tensions naturelles.
          </p>
        </div>

        <DuoMbtiClient />

        {/* How it works */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            { n: '1', icon: '🧠', text: 'Chacun fait le test MBTI' },
            { n: '2', icon: '🔗', text: 'Partagez vos types' },
            { n: '3', icon: '💡', text: 'Découvrez votre alchimie' },
          ].map(({ n, icon, text }) => (
            <div key={n} className="text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>{n}</div>
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-xs text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
