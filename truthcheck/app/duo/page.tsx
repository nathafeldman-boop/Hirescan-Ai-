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
    <main className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <header className="sticky top-0 z-20 backdrop-blur-md" style={{ background: 'rgba(242,236,222,0.9)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl italic font-bold" style={{ color: 'var(--ink)' }}>
            UrCecret
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/quiz/personnalite" className="text-xs font-medium transition-colors" style={{ color: 'var(--ink)' }}>
              Faire le test →
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10 ur-reveal">
          <div className="ur-badge mb-5" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }}>
            <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: 'var(--gold)' }} />
            <span className="ur-label">Compatibilité MBTI</span>
          </div>
          <h1 className="font-display text-3xl font-black leading-tight mb-3" style={{ color: 'var(--ink)' }}>
            Comparez vos <em className="italic" style={{ color: 'var(--gold)' }}>personnalités</em>
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
            Sélectionnez vos deux types MBTI. L&apos;IA analyse votre compatibilité sur 4 dimensions et révèle vos forces et tensions naturelles.
          </p>
        </div>

        <DuoMbtiClient />

        {/* How it works */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center ur-fade-2">
          {[
            { n: '1', icon: '🧠', text: 'Chacun fait le test MBTI' },
            { n: '2', icon: '🔗', text: 'Partagez vos types' },
            { n: '3', icon: '💡', text: 'Découvrez votre alchimie' },
          ].map(({ n, icon, text }) => (
            <div key={n} className="text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-black"
                style={{ background: 'var(--ink)', color: 'var(--ink-text)' }}>{n}</div>
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-xs text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
