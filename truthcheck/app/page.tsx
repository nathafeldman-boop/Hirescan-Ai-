import Link from 'next/link';
import { getAllQuizzes } from '@/lib/quizzes';

export default function HomePage() {
  const quizzes = getAllQuizzes();

  return (
    <main className="min-h-screen bg-[#09090b] relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-0 w-80 h-80 bg-pink-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-60 bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            30 questions · Résultats instantanés · 100% gratuit
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Truth
            </span>
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Check
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Découvre les <span className="text-white font-medium">vérités cachées</span> qui t&apos;entourent.
            Des questionnaires honnêtes pour des réponses claires.
          </p>
        </div>

        {/* Quiz grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {quizzes.map((quiz, i) => (
            <Link
              key={quiz.slug}
              href={`/quiz/${quiz.slug}`}
              className="group relative block rounded-2xl overflow-hidden border border-white/8 transition-all duration-300 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Card background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${quiz.gradientFrom} ${quiz.gradientTo} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
              />
              <div className="absolute inset-0 bg-[#09090b]/40" />

              {/* Glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${quiz.accentColor}22 0%, transparent 70%)`,
                }}
              />

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl sm:text-5xl">{quiz.emoji}</span>
                  <span className="text-xs text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/8">
                    30 questions
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                  {quiz.title}
                </h2>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  {quiz.description}
                </p>

                <div
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 group-hover:gap-3"
                  style={{ color: quiz.accentColor }}
                >
                  Commencer le test
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3 mt-12">
          <p className="text-center text-xs text-zinc-600">
            Ces questionnaires sont à titre indicatif et ne remplacent pas une conversation sincère.
          </p>
          <Link
            href="/stats"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Voir les statistiques
          </Link>
        </div>
      </div>
    </main>
  );
}
