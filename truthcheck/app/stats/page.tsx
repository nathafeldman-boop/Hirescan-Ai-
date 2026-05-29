import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getAllQuizzes, getResultTier } from '@/lib/quizzes';

const TIER_LABELS = ['0–20%', '20–40%', '40–60%', '60–80%', '80–100%'];

async function getStats() {
  const all = await prisma.quizResult.findMany({ orderBy: { createdAt: 'desc' } });
  const quizzes = getAllQuizzes();

  const byQuiz = quizzes.map((quiz) => {
    const results = all.filter((r) => r.quizSlug === quiz.slug);
    const count = results.length;
    const avgScore =
      count > 0 ? Math.round(results.reduce((s, r) => s + r.score, 0) / count) : 0;

    const distribution = [0, 0, 0, 0, 0];
    for (const r of results) {
      distribution[Math.min(4, Math.floor(r.score / 20))]++;
    }

    return { quiz, count, avgScore, distribution };
  });

  const recent = all.slice(0, 8);

  return { total: all.length, byQuiz, recent };
}

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const { total, byQuiz, recent } = await getStats();
  const quizzes = getAllQuizzes();

  return (
    <main className="min-h-screen bg-[#09090b]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Accueil
            </Link>
            <h1 className="text-3xl font-black text-white">📊 Statistiques</h1>
            <p className="text-zinc-500 text-sm mt-1">Données en temps réel sur les quiz TruthCheck</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-white tabular-nums">{total.toLocaleString('fr-FR')}</div>
            <div className="text-sm text-zinc-500">quiz complétés</div>
          </div>
        </div>

        {/* Quiz stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {byQuiz.map(({ quiz, count, avgScore, distribution }) => {
            const tier = getResultTier(quiz, avgScore);
            const max = Math.max(...distribution, 1);

            return (
              <div
                key={quiz.slug}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{quiz.emoji}</span>
                  <div>
                    <h2 className="font-bold text-white text-sm leading-snug">{quiz.title}</h2>
                    <span className="text-xs text-zinc-500">{count} résultat{count !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {count > 0 ? (
                  <>
                    {/* Average */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-zinc-500">Score moyen</span>
                      <span className="text-lg font-bold tabular-nums" style={{ color: tier.glowColor }}>
                        {avgScore}% {tier.emoji}
                      </span>
                    </div>

                    {/* Distribution bars */}
                    <div className="space-y-1.5">
                      {distribution.map((val, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-600 w-12 shrink-0">{TIER_LABELS[i]}</span>
                          <div className="flex-1 h-4 bg-white/5 rounded-sm overflow-hidden">
                            <div
                              className="h-full rounded-sm transition-all duration-700"
                              style={{
                                width: `${(val / max) * 100}%`,
                                backgroundColor: quiz.accentColor + 'cc',
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-zinc-500 w-4 text-right tabular-nums">{val}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-zinc-600 text-sm text-center py-4">Aucun résultat pour l&apos;instant</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent results */}
        {recent.length > 0 && (
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="font-bold text-white mb-4 text-sm">Derniers résultats</h2>
            <div className="space-y-2">
              {recent.map((r) => {
                const quiz = quizzes.find((q) => q.slug === r.quizSlug);
                if (!quiz) return null;
                const tier = getResultTier(quiz, r.score);
                return (
                  <Link
                    key={r.id}
                    href={`/share/${r.id}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{quiz.emoji}</span>
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        {quiz.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tabular-nums" style={{ color: tier.glowColor }}>
                        {r.score}%
                      </span>
                      <span className="text-sm">{tier.emoji}</span>
                      <svg className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
