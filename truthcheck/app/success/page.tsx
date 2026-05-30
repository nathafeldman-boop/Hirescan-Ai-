import Link from 'next/link';

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { result?: string };
}) {
  const resultId = searchParams.result;

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-violet-600" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">Paiement réussi !</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Bienvenue dans UrSecret Premium. Tu peux maintenant accéder à ton analyse complète.
        </p>

        <div className="space-y-3">
          {resultId && (
            <Link
              href={`/share/${resultId}`}
              className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              Voir mon analyse complète →
            </Link>
          )}
          <Link
            href="/onboarding"
            className="block w-full py-3 rounded-2xl font-medium text-zinc-400 hover:text-white text-center bg-white/5 hover:bg-white/10 border border-white/8 transition-all"
          >
            Faire un autre quiz
          </Link>
        </div>
      </div>
    </main>
  );
}
