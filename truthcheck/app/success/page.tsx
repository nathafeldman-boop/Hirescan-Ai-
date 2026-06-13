import Link from 'next/link';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import SuccessTracker from './SuccessTracker';

async function verifyAndUnlock(sessionId: string | undefined, resultId: string | undefined) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return { paid: false, email: null as string | null };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return { paid: false, email: null };

    if (resultId) {
      await prisma.quizResult.update({ where: { id: resultId }, data: { paid: true } }).catch(() => {});
    }

    const email = session.customer_details?.email ?? null;
    if (email) {
      await prisma.user.upsert({
        where: { email },
        create: { email, name: session.customer_details?.name ?? null, tier: 'premium' },
        update: { tier: 'premium' },
      }).catch(() => {});
    }

    return { paid: true, email };
  } catch {
    return { paid: false, email: null };
  }
}

// Generates a NextAuth-compatible magic link and stores the token in the DB.
// The link goes to /api/auth/callback/email which NextAuth handles natively.
async function sendMagicLink(email: string, callbackUrl: string): Promise<boolean> {
  try {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(`${rawToken}${process.env.NEXTAUTH_SECRET ?? ''}`).digest('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token: hashedToken } },
      create: { identifier: email, token: hashedToken, expires },
      update: { expires },
    });

    const base = (process.env.NEXTAUTH_URL ?? 'https://urcecret.site').replace(/\/$/, '');
    const magicUrl = `${base}/api/auth/callback/email?callbackUrl=${encodeURIComponent(callbackUrl)}&token=${rawToken}&email=${encodeURIComponent(email)}`;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return false;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'UrCecret <noreply@urcecret.site>',
        to: email,
        subject: 'Ton accès UrCecret est prêt',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 16px;background:#ffffff;">
            <h1 style="font-size:24px;font-weight:900;color:#111827;margin-bottom:8px;">Paiement confirmé !</h1>
            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin-bottom:24px;">
              Ton accès premium UrCecret est actif. Clique ci-dessous pour voir ton profil complet.
            </p>
            <a href="${magicUrl}"
              style="display:inline-block;padding:16px 32px;background:#111827;color:#ffffff;font-weight:700;text-decoration:none;border-radius:12px;font-size:15px;">
              Accéder à mon profil →
            </a>
            <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
              Ce lien est valable 24 heures. Si tu ne l'as pas demandé, ignore cet email.
            </p>
          </div>
        `,
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { result?: string; session_id?: string; typeCode?: string };
}) {
  const resultId = searchParams.result;
  const sessionId = searchParams.session_id;
  const typeCode = searchParams.typeCode?.toUpperCase();

  const { paid, email } = await verifyAndUnlock(sessionId, resultId);

  // Auto-send magic link so user can access their premium content with one click
  let magicLinkSent = false;
  if (paid && email) {
    const callbackUrl = typeCode ? `/types/${typeCode.toLowerCase()}` : '/dashboard';
    magicLinkSent = await sendMagicLink(email, callbackUrl);
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-violet-600" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-900/10 rounded-full blur-3xl" />
      </div>

      <SuccessTracker />
      <div className="relative z-10 text-center max-w-md">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          {typeCode ? `Profil ${typeCode} débloqué !` : 'Bienvenue dans UrCecret Premium'}
        </h1>

        {magicLinkSent && email ? (
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Un lien d'accès a été envoyé à{' '}
            <span className="text-white font-semibold">{email}</span>.{' '}
            Clique dessus pour voir ton profil complet — ça prend 10 secondes.
          </p>
        ) : (
          <p className="text-zinc-400 mb-8 leading-relaxed">
            {typeCode
              ? `Ton profil ${typeCode} et les 15 tests UrCecret sont maintenant débloqués.`
              : `Ton rapport complet et les 15 tests UrCecret sont maintenant débloqués.`}
          </p>
        )}

        <div className="space-y-3">
          {/* Email CTA — open email app */}
          {magicLinkSent && email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 8px 32px rgba(139,92,246,0.35)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Ouvrir mes emails →
            </a>
          )}

          {/* Direct link if no magic link was sent (user was already logged in) */}
          {!magicLinkSent && typeCode && (
            <Link
              href={`/types/${typeCode.toLowerCase()}`}
              className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 8px 32px rgba(139,92,246,0.35)' }}
            >
              Voir mon profil {typeCode} →
            </Link>
          )}

          {!magicLinkSent && resultId && (
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
            className="block w-full py-3 rounded-2xl font-semibold text-zinc-300 text-center border border-white/10 hover:border-white/20 transition-all text-sm"
          >
            Découvrir les 15 tests UrCecret →
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
