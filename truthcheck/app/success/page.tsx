import Link from 'next/link';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { mbtiTypes } from '@/lib/mbti';
import SuccessTracker from './SuccessTracker';

async function verifyAndUnlock(sessionId: string | undefined, resultId: string | undefined, typeCode: string | undefined) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return { paid: false, email: null as string | null, affiliateSlug: null as string | null };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return { paid: false, email: null, affiliateSlug: null };

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

    let affiliateSlug: string | null = null;
    if (email) {
      const existing = await prisma.affiliate.findFirst({ where: { email } }).catch(() => null);
      if (existing) {
        affiliateSlug = existing.slug;
      } else {
        const randomHex = crypto.randomBytes(2).toString('hex');
        const slug = `${typeCode?.toLowerCase() ?? 'mbti'}-${randomHex}`;
        const created = await prisma.affiliate.create({
          data: {
            slug,
            name: session.customer_details?.name ?? email.split('@')[0],
            email,
            commissionPct: 50,
          },
        }).catch(() => null);
        affiliateSlug = created?.slug ?? null;
      }
    }

    return { paid: true, email, affiliateSlug };
  } catch {
    return { paid: false, email: null, affiliateSlug: null };
  }
}

async function sendMagicLink(email: string, callbackUrl: string): Promise<boolean> {
  try {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(`${rawToken}${process.env.NEXTAUTH_SECRET ?? ''}`).digest('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

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

function MbtiShareCard({ typeCode, affiliateSlug }: { typeCode: string; affiliateSlug: string }) {
  const t = mbtiTypes[typeCode];
  if (!t) return null;
  const referralUrl = `https://urcecret.site/?ref=${affiliateSlug}`;
  const accent = t.accentColor;

  return (
    <div style={{
      background: `linear-gradient(145deg, #0d0d0d 0%, #1a1a1a 40%, ${accent}22 100%)`,
      border: `1px solid ${accent}44`,
      borderRadius: '20px',
      padding: '28px 24px',
      maxWidth: '360px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 0 40px ${accent}33, 0 20px 60px rgba(0,0,0,0.5)`,
    }}>
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: accent,
          fontFamily: 'system-ui, sans-serif',
        }}>UrCecret</div>
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#ffffff55',
          fontFamily: 'system-ui, sans-serif',
          background: `${accent}22`,
          border: `1px solid ${accent}44`,
          borderRadius: '6px',
          padding: '3px 8px',
        }}>{t.rarity}</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '56px', lineHeight: '1', marginBottom: '12px' }}>{t.emoji}</div>
        <div style={{
          fontSize: '36px',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.05em',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: '1',
          marginBottom: '4px',
        }}>{t.code}</div>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: accent,
          fontFamily: 'system-ui, sans-serif',
          marginBottom: '8px',
        }}>{t.name}</div>
        <div style={{
          fontSize: '12px',
          color: '#ffffff77',
          fontFamily: 'system-ui, sans-serif',
          fontStyle: 'italic',
          lineHeight: '1.4',
        }}>&ldquo;{t.tagline}&rdquo;</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
        {t.traits.slice(0, 4).map(trait => (
          <span key={trait} style={{
            fontSize: '10px',
            fontWeight: 700,
            color: accent,
            background: `${accent}18`,
            border: `1px solid ${accent}40`,
            borderRadius: '20px',
            padding: '4px 10px',
            fontFamily: 'system-ui, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>{trait}</span>
        ))}
      </div>

      <div style={{
        borderTop: `1px solid ${accent}22`,
        paddingTop: '14px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '9px',
          color: '#ffffff44',
          fontFamily: 'system-ui, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '4px',
        }}>Mon lien</div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: accent,
          fontFamily: 'monospace',
          wordBreak: 'break-all',
        }}>{referralUrl}</div>
      </div>
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { result?: string; session_id?: string; typeCode?: string };
}) {
  const resultId = searchParams.result;
  const sessionId = searchParams.session_id;
  const typeCode = searchParams.typeCode?.toUpperCase();

  const { paid, email, affiliateSlug } = await verifyAndUnlock(sessionId, resultId, typeCode);

  let magicLinkSent = false;
  if (paid && email) {
    const callbackUrl = typeCode ? `/types/${typeCode.toLowerCase()}` : '/dashboard';
    magicLinkSent = await sendMagicLink(email, callbackUrl);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f3ec' }}>
      <SuccessTracker />
      <div className="relative z-10 w-full max-w-xl">

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="font-display text-3xl font-black text-stone-900 mb-3">
            {typeCode ? `Profil ${typeCode} débloqué !` : 'Bienvenue dans UrCecret ✨'}
          </h1>
        </div>

        {paid && typeCode && affiliateSlug && mbtiTypes[typeCode] && (
          <div style={{ marginBottom: '32px' }}>
            <MbtiShareCard typeCode={typeCode} affiliateSlug={affiliateSlug} />

            <div style={{
              marginTop: '20px',
              background: '#111827',
              borderRadius: '16px',
              padding: '20px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎵</div>
              <p style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: 'system-ui, sans-serif',
                marginBottom: '6px',
              }}>Partage sur TikTok &amp; gagne des prix</p>
              <p style={{
                fontSize: '13px',
                color: '#9ca3af',
                fontFamily: 'system-ui, sans-serif',
                marginBottom: '12px',
                lineHeight: '1.5',
              }}>
                Filme ta réaction, montre ta carte, ajoute le lien en bio — chaque vente via ton lien augmente la cagnotte.
              </p>
              <div style={{
                background: '#1f2937',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '12px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: mbtiTypes[typeCode]?.accentColor ?? '#d17d52',
                wordBreak: 'break-all',
              }}>
                https://urcecret.site/?ref={affiliateSlug}
              </div>
              <Link
                href="/cagnotte"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, ${mbtiTypes[typeCode]?.accentColor ?? '#a94e18'}, ${mbtiTypes[typeCode]?.accentColor ?? '#a94e18'}bb)`,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                🏆 Voir la cagnotte du mois →
              </Link>
            </div>
          </div>
        )}

        <div className="text-center space-y-4 mb-8">
          {magicLinkSent && email ? (
            <div>
              <p className="text-stone-500 leading-relaxed mb-2">
                Un lien d&apos;accès a été envoyé à{' '}
                <span style={{ color: '#a94e18' }} className="font-semibold">{email}</span>.
              </p>
              <p className="text-stone-400 text-sm">Ouvre ton appli mail et clique le lien — ça prend 10 secondes.</p>
            </div>
          ) : (
            <div>
              <p className="text-stone-500 leading-relaxed mb-2">
                {typeCode
                  ? `Ton profil ${typeCode} est débloqué — fais défiler pour le lire intégralement.`
                  : `Ton accès UrCecret est actif. Fais défiler pour découvrir ton analyse.`}
              </p>
              <p className="text-stone-400 text-xs">💡 Ajoute cette page en favori pour y revenir.</p>
            </div>
          )}

          <div className="space-y-3 max-w-sm mx-auto">
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
        </div>

        {!paid && (
          <p className="text-center mt-6 text-xs text-stone-400">
            Si ton analyse ne s&apos;affiche pas, attends quelques secondes et réessaie.
          </p>
        )}

        {paid && typeCode && (() => {
          const t = mbtiTypes[typeCode];
          if (!t) return null;
          return (
            <div className="max-w-xl mx-auto px-4 pb-16 space-y-4">
              <div className="rounded-2xl p-6 text-center" style={{ background: 'white', border: '1px solid #e7e5e0', borderTop: `3px solid ${t.accentColor}` }}>
                <div className="text-5xl mb-3">{t.emoji}</div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: t.accentColor }}>{t.code}</p>
                <h2 className="text-2xl font-black text-stone-900 mb-2">{t.name}</h2>
                <p className="text-stone-500 text-sm leading-relaxed mb-3">{t.tagline}</p>
                <span className="inline-block bg-stone-100 text-stone-500 text-xs px-3 py-1 rounded-full">{t.rarity} de la population</span>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Profil complet</p>
                <p className="text-stone-700 text-sm leading-relaxed">{t.fullDesc}</p>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Traits principaux</p>
                <div className="flex flex-wrap gap-2">
                  {t.traits.map(tr => (
                    <span key={tr} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${t.accentColor}18`, border: `1px solid ${t.accentColor}40`, color: t.accentColor }}>{tr}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">En amour ❤️</p>
                <p className="text-stone-700 text-sm leading-relaxed">{t.inLove}</p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Au travail 💼</p>
                <p className="text-stone-700 text-sm leading-relaxed">{t.atWork}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Forces ✨</p>
                  <ul className="space-y-1.5">
                    {t.strengths.map(s => <li key={s} className="text-xs text-stone-700 flex gap-1.5"><span className="text-stone-400 flex-shrink-0">+</span>{s}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Points fragiles ⚡</p>
                  <ul className="space-y-1.5">
                    {t.weaknesses.map(w => <li key={w} className="text-xs text-stone-700 flex gap-1.5"><span className="text-stone-500 flex-shrink-0">−</span>{w}</li>)}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Croissance personnelle 🌱</p>
                <p className="text-stone-700 text-sm leading-relaxed">{t.growth}</p>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Compatibles avec 💞</p>
                <div className="flex flex-wrap gap-2">
                  {t.compatibleWith.map(c => (
                    <span key={c} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(224,163,128,0.1)', border: '1px solid rgba(224,163,128,0.3)', color: '#d17d52' }}>{c}</span>
                  ))}
                </div>
              </div>

              {t.famousExamples.length > 0 && (
                <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Célébrités {t.code}</p>
                  <p className="text-stone-600 text-sm">{t.famousExamples.join(' · ')}</p>
                </div>
              )}

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
      </div>
    </main>
  );
}
