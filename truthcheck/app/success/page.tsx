import Link from 'next/link';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { mbtiTypes } from '@/lib/mbti';
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
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#faf9f7' }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.1] bg-violet-500" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl" />
      </div>

      <SuccessTracker />
      <div className="relative z-10 text-center max-w-md w-full">
        {/* Success illustration */}
        <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>🎉</div>

        <h1 className="text-3xl font-black text-stone-900 mb-3">
          {typeCode ? `Profil ${typeCode} débloqué !` : 'Bienvenue dans UrCecret ✨'}
        </h1>

        {magicLinkSent && email ? (
          <div className="mb-8">
            <p className="text-stone-500 leading-relaxed mb-2">
              Un lien d&apos;accès a été envoyé à{' '}
              <span style={{ color: '#a94e18' }} className="font-semibold">{email}</span>.
            </p>
            <p className="text-stone-400 text-sm">Ouvre ton appli mail et clique le lien — ça prend 10 secondes.</p>
          </div>
        ) : (
          <p className="text-stone-500 mb-8 leading-relaxed">
            {typeCode
              ? `Ton profil ${typeCode} et les 15 tests UrCecret sont maintenant débloqués.`
              : `Ton rapport complet et les 15 tests UrCecret sont maintenant débloqués.`}
          </p>
        )}

        <div className="space-y-3 max-w-sm mx-auto">
          {/* Email CTA */}
          {magicLinkSent && email && (
            <p className="text-sm text-stone-500">
              Un lien a été envoyé à <strong style={{ color: '#a94e18' }}>{email}</strong> pour accéder à nouveau plus tard.
            </p>
          )}

          {/* Direct link if no typeCode but resultId exists */}
          {!typeCode && resultId && (
            <Link
              href={`/share/${resultId}`}
              className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 8px 32px rgba(169,78,24,0.3)' }}
            >
              Voir mon analyse complète →
            </Link>
          )}

          <Link
            href="/quizzes"
            className="block w-full py-3 rounded-2xl font-semibold text-stone-600 text-center transition-all text-sm hover:bg-stone-100"
            style={{ background: 'white', border: '1px solid #e7e5e0' }}
          >
            Découvrir les 15 tests UrCecret →
          </Link>
        </div>

        {!paid && (
          <p className="mt-6 text-xs text-stone-400">
            Si ton analyse ne s&apos;affiche pas, attends quelques secondes et réessaie.
          </p>
        )}
      </div>

      {/* MBTI profile displayed inline — no redirect, no login required */}
      {paid && typeCode && (() => {
        const t = mbtiTypes[typeCode];
        if (!t) return null;
        return (
          <div className="relative z-10 max-w-xl mx-auto mt-8 px-4 pb-16 space-y-4">
            {/* Type header */}
            <div className="rounded-2xl p-6 text-center" style={{ background: 'white', border: '1px solid #e7e5e0', borderTop: `3px solid ${t.accentColor}` }}>
              <div className="text-5xl mb-3">{t.emoji}</div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: t.accentColor }}>{t.code}</p>
              <h2 className="text-2xl font-black text-stone-900 mb-2">{t.name}</h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-3">{t.tagline}</p>
              <span className="inline-block bg-stone-100 text-stone-500 text-xs px-3 py-1 rounded-full">{t.rarity} de la population</span>
            </div>

            {/* Full desc */}
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">Profil complet</p>
              <p className="text-stone-700 text-sm leading-relaxed">{t.fullDesc}</p>
            </div>

            {/* Traits */}
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-3">Traits principaux</p>
              <div className="flex flex-wrap gap-2">
                {t.traits.map(tr => (
                  <span key={tr} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${t.accentColor}18`, border: `1px solid ${t.accentColor}40`, color: t.accentColor }}>{tr}</span>
                ))}
              </div>
            </div>

            {/* In love & at work */}
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-pink-500 mb-3">En amour ❤️</p>
              <p className="text-stone-700 text-sm leading-relaxed">{t.inLove}</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-sky-500 mb-3">Au travail 💼</p>
              <p className="text-stone-700 text-sm leading-relaxed">{t.atWork}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-green-500 mb-3">Forces ✨</p>
                <ul className="space-y-1.5">
                  {t.strengths.map(s => <li key={s} className="text-xs text-stone-700 flex gap-1.5"><span className="text-green-500 flex-shrink-0">+</span>{s}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-orange-400 mb-3">Points fragiles ⚡</p>
                <ul className="space-y-1.5">
                  {t.weaknesses.map(w => <li key={w} className="text-xs text-stone-700 flex gap-1.5"><span className="text-orange-400 flex-shrink-0">−</span>{w}</li>)}
                </ul>
              </div>
            </div>

            {/* Growth */}
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-yellow-500 mb-3">Croissance personnelle 🌱</p>
              <p className="text-stone-700 text-sm leading-relaxed">{t.growth}</p>
            </div>

            {/* Compatible with */}
            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-pink-500 mb-3">Compatibles avec 💞</p>
              <div className="flex flex-wrap gap-2">
                {t.compatibleWith.map(c => (
                  <span key={c} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(224,163,128,0.1)', border: '1px solid rgba(224,163,128,0.3)', color: '#d17d52' }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Famous */}
            {t.famousExamples.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Célébrités {t.code}</p>
                <p className="text-stone-600 text-sm">{t.famousExamples.join(' · ')}</p>
              </div>
            )}

            {/* Sign in CTA */}
            {email && (
              <div className="rounded-2xl p-5 text-center" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-stone-500 text-sm mb-3">Connecte-toi pour retrouver ton profil à tout moment</p>
                <Link href="/auth/signin" className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}>
                  Se connecter avec {email} →
                </Link>
              </div>
            )}
          </div>
        );
      })()}
    </main>
  );
}
