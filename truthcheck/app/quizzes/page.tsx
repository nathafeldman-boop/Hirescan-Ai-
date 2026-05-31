import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';

export default function QuizzesPage() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ur
            </span>
            <span className="text-white">Secret</span>
          </span>
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Choisis ton quiz</span>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-3">
              30 questions · Résultats instantanés
            </p>
            <h1 className="text-3xl font-black text-white leading-tight">
              Quelle vérité veux-tu
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}découvrir ?
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="group relative rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02] active:scale-[0.99]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${quiz.accentColor}18 0%, transparent 70%)` }}
                />

                <div className="relative p-5 flex items-center gap-4">
                  {/* Emoji badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${quiz.accentColor}20`, border: `1px solid ${quiz.accentColor}30` }}
                  >
                    {quiz.emoji}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base leading-snug mb-1">{quiz.title}</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">{quiz.subtitle}</p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: quiz.accentColor }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Bottom accent bar */}
                <div
                  className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${quiz.accentColor}60, transparent)` }}
                />
              </Link>
            ))}
          </div>

          {/* Footer hint */}
          <p className="text-center text-zinc-600 text-xs mt-10 tracking-wide">
            🔒 100% anonyme · Zéro compte requis
          </p>
        </div>
      </div>
    </main>
  );
}
