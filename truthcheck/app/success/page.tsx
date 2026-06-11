import Link from 'next/link';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import SuccessTracker from './SuccessTracker';

async function verifyAndUnlock(sessionId: string | undefined, resultId: string | undefined) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return false;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return false;

    // Mark result as paid immediately (don't wait for webhook)
    if (resultId) {
      await prisma.quizResult.update({
        where: { id: resultId },
        data: { paid: true },
      }).catch(() => {});
    }

    // Create or upgrade user by email
    const email = session.customer_details?.email;
    if (email) {
      await prisma.user.upsert({
        where: { email },
        create: {
          email,
          name: session.customer_details?.name ?? null,
          tier: 'premium',
        },
        update: { tier: 'premium' },
      }).catch(() => {});
    }

    return true;
  } catch {
    return false;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { result?: string; session_id?: string };
}) {
  const resultId = searchParams.result;
  const sessionId = searchParams.session_id;

  const paid = await verifyAndUnlock(sessionId, resultId);

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-violet-600" />
      </div>

      <SuccessTracker />
      <div className="relative z-10 text-center max-w-md">
        <div
          className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">Bienvenue dans UrCecret Premium ✦</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Ton rapport complet et <span className="text-white font-semibold">les 15 tests UrCecret</span> sont
          maintenant débloqués. Couple, amitié, manipulation, burnout, amour véritable…
        </p>

        <div className="space-y-3">
          {resultId && (
            <Link
              href={`/share/${resultId}`}
              className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 8px 32px rgba(139,92,246,0.35)' }}
            >
              Voir mon analyse complète →
            </Link>
          )}
          <Link
            href="/quizzes"
            className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 8px 32px rgba(139,92,246,0.35)' }}
          >
            Découvrir mes 15 tests UrCecret →
          </Link>
        </div>

        {!paid && (
          <p className="mt-6 text-xs text-zinc-600">
            Si ton analyse ne s&apos;affiche pas, attends quelques secondes et réessaie.
          </p>
        )}
      </div>
    </main>
  );
}
