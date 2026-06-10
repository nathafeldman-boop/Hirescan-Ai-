import type { Metadata } from 'next';
import Link from 'next/link';
import { duoQuizzes } from '@/lib/duoQuizzes';
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
    <main className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ur
            </span>
            <span className="text-gray-900">Cecret</span>
          </Link>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Compatibilité</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-violet-600 text-xs font-semibold uppercase tracking-widest">Test de compatibilité MBTI</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">
              Comparez vos
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}personnalités
              </span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Chacun répond séparément au test MBTI.
              L&apos;IA compare vos deux profils et révèle votre niveau de compatibilité réelle.
              <strong className="text-gray-700"> Sans filtre.</strong>
            </p>
          </div>

          {/* Code entry */}
          <TeamCodeEntry />

          {/* How it works */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Comment ça marche</p>
            <div className="space-y-3">
              {[
                { n: '1', icon: '🧠', text: 'Chacun fait le test MBTI séparément — les résultats restent cachés' },
                { n: '2', icon: '🔗', text: 'Partagez le lien ou le code à votre partenaire' },
                { n: '3', icon: '💡', text: 'L\'IA révèle votre compatibilité MBTI. Préparez-vous.' },
              ].map(({ n, icon, text }) => (
                <div key={n} className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black text-white"
                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}
                  >
                    {n}
                  </div>
                  <span className="text-sm text-gray-600">{icon} {text}</span>
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
                className="group relative rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] bg-white"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${quiz.accentColor}08 0%, transparent 70%)` }}
                />
                <div className="relative p-5 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ background: `${quiz.accentColor}12`, border: `1px solid ${quiz.accentColor}25` }}
                  >
                    {quiz.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-bold text-base leading-snug mb-1">{quiz.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{quiz.subtitle}</p>
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 text-gray-400"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs mt-10 tracking-wide">
            🔒 100% anonyme · Vos réponses individuelles restent privées
          </p>
        </div>
      </div>
    </main>
  );
}
