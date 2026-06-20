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
    <main className="min-h-screen" style={{ background: '#f7f3ec' }}>
      <header className="sticky top-0 z-20 backdrop-blur-md" style={{ background: 'rgba(247,243,236,0.9)', borderBottom: '1px solid #e8e0d4' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-black text-stone-900">
            Ur<span style={{ color: '#c2611f' }}>Cecret</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/quiz/personnalite" className="text-xs font-medium transition-colors transition-colors">
              Faire le test →
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(194,97,31,0.08)', border: '1px solid rgba(194,97,31,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c2611f' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c2611f' }}>Compatibilité MBTI</span>
          </div>
          <h1 className="font-display text-3xl font-black text-gray-900 leading-tight mb-3">
            Comparez vos{' '}
            <span style={{ background: 'linear-gradient(135deg,#d17d52,#e0a380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                style={{ background: 'linear-gradient(135deg,#c2611f,#d17d52)' }}>{n}</div>
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-xs text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
