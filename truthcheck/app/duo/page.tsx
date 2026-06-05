import type { Metadata } from 'next';
import Link from 'next/link';
import { duoQuizzes } from '@/lib/duoQuizzes';
import UrCecretAnimatedBg from '@/components/UrCecretAnimatedBg';
import TeamCodeEntry from './TeamCodeEntry';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Mode Équipe — Comparez vos secrets | UrCecret',
  description: 'Rejoignez une partie avec un code ou un lien. Chacun répond seul, l\'IA compare vos secrets. Découvrez qui vous connaît vraiment.',
  keywords: ['quiz équipe', 'quiz groupe', 'test compatibilité', 'quiz couple', 'mode équipe UrCecret', 'quiz partenaire'],
  openGraph: {
    title: 'Mode Équipe — Comparez vos secrets | UrCecret',
    description: 'Rejoignez avec un code. Chacun répond seul. L\'IA révèle vos vraies divergences.',
    url: `${BASE}/duo`,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrCecret Mode Équipe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mode Équipe — Comparez vos secrets | UrCecret',
    description: 'Code d\'entrée · Chacun répond seul · Comparez vos secrets',
    images: ['/api/og'],
  },
  alternates: { canonical: `${BASE}/duo` },
};

export default function DuoPage() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col">
      <UrCecretAnimatedBg />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/quizzes" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ur
            </span>
            <span className="text-white">Cecret</span>
          </Link>
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">Équipe</span>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Mode Équipe — Nouveau</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight mb-3">
              Qui te connaît
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}vraiment ?
              </span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              Chaque joueur répond seul — sans voir les réponses des autres.
              Comparez vos secrets et découvrez qui se ressemble vraiment.
              <strong className="text-zinc-200"> Vous serez surpris.</strong>
            </p>
          </div>

          {/* Code entry */}
          <TeamCodeEntry />

          {/* How it works */}
          <div className="glass rounded-2xl p-5 mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Comment ça marche</p>
            <div className="space-y-3">
              {[
                { n: '1', icon: '🧩', text: 'Tu fais le quiz seul(e) — tes réponses restent cachées' },
                { n: '2', icon: '🔑', text: 'Tu partages le lien ou le code à tes coéquipier(s)' },
                { n: '3', icon: '💥', text: 'Ils répondent — les comparaisons s\'affichent. Prépare-toi.' },
              ].map(({ n, icon, text }) => (
                <div key={n} className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: 'white' }}
                  >
                    {n}
                  </div>
                  <span className="text-sm text-zinc-300">{icon} {text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz cards */}
          <div className="flex flex-col gap-4">
            {duoQuizzes.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/duo/${quiz.slug}`}
                className="group relative rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02] active:scale-[0.99]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${quiz.accentColor}18 0%, transparent 70%)` }}
                />
                <div className="relative p-5 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ background: `${quiz.accentColor}20`, border: `1px solid ${quiz.accentColor}30` }}
                  >
                    {quiz.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base leading-snug mb-1">{quiz.title}</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">{quiz.subtitle}</p>
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: quiz.accentColor }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div
                  className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${quiz.accentColor}60, transparent)` }}
                />
              </Link>
            ))}
          </div>

          <p className="text-center text-zinc-600 text-xs mt-10 tracking-wide">
            🔒 100% anonyme · Vos réponses individuelles restent privées · Min. 2 joueurs
          </p>
        </div>
      </div>
    </main>
  );
}
