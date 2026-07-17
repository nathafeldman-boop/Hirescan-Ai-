import Link from 'next/link';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { mbtiTypes } from '@/lib/mbti-server';
import SuccessTracker from './SuccessTracker';
import SuccessUpsellButton from './SuccessUpsellButton';
import ShareResultCard from '@/components/ShareResultCard';

async function verifyAndUnlock(sessionId: string | undefined, resultId: string | undefined, typeCode: string | undefined) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return { paid: false, email: null as string | null, affiliateSlug: null as string | null, isOneTime: false, amountEur: 0 };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return { paid: false, email: null, affiliateSlug: null, isOneTime: false, amountEur: 0 };
    const isOneTime = session.metadata?.oneTime === 'true' || session.mode === 'payment';
    // Montant réel vérifié par Stripe — jamais une valeur codée en dur, pour que
    // le pixel "purchase" envoyé aux plateformes pub (TikTok/GA4) reflète la
    // vraie valeur de la vente et n'en fausse pas l'optimisation.
    const amountEur = (session.amount_total ?? 0) / 100;

    if (resultId) {
      await prisma.quizResult.update({ where: { id: resultId }, data: { paid: true } }).catch(() => {});
    }

    // Normalisé en minuscules : NextAuth (EmailProvider) stocke les emails en
    // lowercase, mais Stripe renvoie l'email tel que saisi au checkout (casse
    // libre) — voir app/api/webhook/route.ts pour le même correctif.
    const email = session.customer_details?.email?.toLowerCase().trim() ?? null;
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

    return { paid: true, email, affiliateSlug, isOneTime, amountEur };
  } catch {
    return { paid: false, email: null, affiliateSlug: null, isOneTime: false, amountEur: 0 };
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

    const typeLabel = callbackUrl.includes('/types/') ? callbackUrl.split('/types/')[1]?.toUpperCase()?.split('?')[0] : null;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'UrCecret <noreply@urcecret.site>',
        to: email,
        subject: typeLabel ? `✅ Ton profil ${typeLabel} est débloqué — accède-y ici` : '✅ Ton accès UrCecret est prêt',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 16px;background:#15121F;">
            <h1 style="font-size:11px;font-weight:800;color:#C9A227;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 20px">UrCecret</h1>
            <h2 style="font-size:22px;font-weight:900;color:#FAF6EC;margin:0 0 12px;line-height:1.3">
              ${typeLabel ? `Ton profil ${typeLabel} est débloqué 🔓` : 'Ton accès est prêt 🔓'}
            </h2>
            <p style="color:rgba(250,246,236,0.55);font-size:15px;line-height:1.7;margin:0 0 24px">
              ${typeLabel ? `Ton analyse complète ${typeLabel} — amour, carrière, face cachée, compatibilité — t'attend. Clique pour y accéder maintenant.` : 'Ton accès UrCecret Premium est actif. Clique ci-dessous pour accéder à ton profil.'}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:0 0 24px">
                <a href="${magicUrl}"
                  style="display:inline-block;padding:16px 36px;background:#C9A227;color:#15121F;font-weight:700;text-decoration:none;border-radius:999px;font-size:15px">
                  ${typeLabel ? `Voir mon profil ${typeLabel} →` : 'Accéder à mon profil →'}
                </a>
              </td></tr>
            </table>
            <p style="color:rgba(250,246,236,0.35);font-size:12px;margin:0 0 8px;text-align:center">
              Paiement sécurisé par Stripe · Satisfait ou remboursé 7 jours
            </p>
            <p style="color:rgba(250,246,236,0.25);font-size:11px;margin:0;text-align:center">
              Ce lien est valable 24 heures.
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
      background: 'var(--ink)',
      border: `1px solid ${accent}44`,
      borderRadius: '20px',
      padding: '28px 24px',
      maxWidth: '360px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 12px 40px rgba(0,0,0,0.35)`,
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

  const { paid, email, affiliateSlug, isOneTime, amountEur } = await verifyAndUnlock(sessionId, resultId, typeCode);

  let magicLinkSent = false;
  if (paid && email) {
    const callbackUrl = typeCode ? `/types/${typeCode.toLowerCase()}` : '/dashboard';
    magicLinkSent = await sendMagicLink(email, callbackUrl);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-white" style={{ background: 'var(--ink)' }}>
      <SuccessTracker paid={paid} amountEur={amountEur} />
      <div className="relative z-10 w-full max-w-xl">

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="font-display text-3xl font-black text-white mb-2">
            {paid && typeCode ? `Profil ${typeCode} débloqué !` : 'Bienvenue dans UrCecret ✨'}
          </h1>
          {paid && typeCode && (
            <p className="text-sm" style={{ color: 'var(--ink-text-muted)' }}>Résultat 1/2 — ton profil MBTI est prêt.</p>
          )}
        </div>

        {/* Carte partageable — enregistrable en photo pour les réseaux */}
        {paid && typeCode && mbtiTypes[typeCode] && (
          <div className="mb-6">
            <ShareResultCard code={typeCode} />
          </div>
        )}

        {/* ── 2ème résultat — choix du quiz ── */}
        {paid && typeCode && (
          <div className="ur-panel-ink mb-6" style={{ padding: '20px 20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>🎁</span>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: 'var(--ink-text)' }}>Résultat 2/2 — ton quiz offert</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-text-muted)' }}>Fais-en un maintenant, ton résultat est déjà débloqué</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { href: '/quiz/infidelite',      emoji: '💔', label: 'Infidélité' },
                { href: '/quiz/amoureux',         emoji: '❤️', label: 'Suis-je amoureux ?' },
                { href: '/quiz/manipule',         emoji: '🎭', label: 'Manipulé(e) ?' },
                { href: '/quiz/vrais-amis',       emoji: '🤝', label: 'Vrais amis ?' },
                { href: '/quiz/relation-toxique', emoji: '⚠️', label: 'Relation toxique' },
                { href: '/quiz/burnout',          emoji: '🔥', label: 'Burnout' },
              ].map(q => (
                <Link
                  key={q.href}
                  href={q.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 12,
                    background: 'var(--ink)', border: '1px solid var(--line-ink)',
                    textDecoration: 'none', color: 'var(--ink-text)',
                    fontSize: 13, fontWeight: 600,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{q.emoji}</span>
                  <span style={{ lineHeight: 1.2 }}>{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {paid && typeCode && affiliateSlug && mbtiTypes[typeCode] && (
          <div style={{ marginBottom: '32px' }}>
            <MbtiShareCard typeCode={typeCode} affiliateSlug={affiliateSlug} />

            <div className="ur-panel-ink" style={{
              marginTop: '20px',
              padding: '20px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎵</div>
              <p style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--ink-text)',
                marginBottom: '6px',
              }}>Partage sur TikTok &amp; gagne des prix</p>
              <p style={{
                fontSize: '13px',
                color: 'var(--ink-text-muted)',
                marginBottom: '12px',
                lineHeight: '1.5',
              }}>
                Filme ta réaction, montre ta carte, ajoute le lien en bio — chaque vente via ton lien augmente la cagnotte.
              </p>
              <div style={{
                background: 'var(--ink)',
                border: '1px solid var(--line-ink)',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '12px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: 'var(--gold)',
                wordBreak: 'break-all',
              }}>
                https://urcecret.site/?ref={affiliateSlug}
              </div>
              <Link
                href="/cagnotte"
                className="ur-btn-gold"
                style={{
                  display: 'inline-flex',
                  padding: '12px 24px',
                  fontSize: '14px',
                  textDecoration: 'none',
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
              <p className="leading-relaxed mb-2" style={{ color: 'var(--ink-text-muted)' }}>
                Un lien d&apos;accès a été envoyé à{' '}
                <span style={{ color: 'var(--gold)' }} className="font-semibold">{email}</span>.
              </p>
              <p className="text-sm" style={{ color: 'var(--ink-text-faint)' }}>Ouvre ton appli mail et clique le lien — ça prend 10 secondes.</p>
            </div>
          ) : (
            <div>
              <p className="leading-relaxed mb-2" style={{ color: 'var(--ink-text-muted)' }}>
                {paid && typeCode
                  ? `Ton profil ${typeCode} est débloqué — fais défiler pour le lire intégralement.`
                  : `Ton accès UrCecret est actif. Fais défiler pour découvrir ton analyse.`}
              </p>
              <p className="text-xs" style={{ color: 'var(--ink-text-faint)' }}>💡 Ajoute cette page en favori pour y revenir.</p>
            </div>
          )}

          <div className="space-y-3 max-w-sm mx-auto">
            {!typeCode && resultId && (
              <Link
                href={`/share/${resultId}`}
                className="ur-btn-gold block w-full py-4 text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Voir mon analyse complète →
              </Link>
            )}

            <Link
              href="/quizzes"
              className="ur-panel-ink block w-full py-3 font-semibold text-center transition-all text-sm hover:opacity-90"
              style={{ color: 'var(--ink-text-muted)' }}
            >
              Découvrir les 15 tests UrCecret →
            </Link>

            {/* Upsell one-time → monthly (drive MRR) */}
            {paid && isOneTime && typeCode && (
              <div className="rounded-2xl p-5 text-left mt-1" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="ur-label text-[10px]" style={{ color: 'var(--gold)' }}>Profite de ta lancée 🔥</p>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>Offre unique</span>
                </div>
                <p className="text-sm font-black text-white mb-1 leading-snug">
                  Tu viens de voir ton profil {typeCode}. Et les autres types qui te rendent fou·folle ?
                </p>
                <p className="text-xs mb-3 leading-snug" style={{ color: 'var(--ink-text-muted)' }}>
                  Avec l&apos;accès complet, tu vois aussi leurs profils — et tu comprends enfin pourquoi vous vous comprenez (ou pas).
                </p>
                <ul className="space-y-1.5 mb-4">
                  {[
                    `Les 15 autres types MBTI débloqués (dont celui de tes proches)`,
                    '💕 Quiz amour, infidélité, compatibilité — réponses honnêtes',
                    '🎭 Test de manipulation · 🤝 Vrais amis · 💔 Relation toxique',
                    'Résiliable en 1 clic — aucun engagement',
                  ].map(q => (
                    <li key={q} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ink-text-muted)' }}>
                      <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }}>✓</span>{q}
                    </li>
                  ))}
                </ul>
                <SuccessUpsellButton typeCode={typeCode} email={email} />
                <p className="text-center text-[10px] mt-2" style={{ color: 'var(--ink-text-faint)' }}>Apple Pay · Google Pay · Résiliable en 1 clic</p>
              </div>
            )}
          </div>
        </div>

        {!paid && (
          <p className="text-center mt-6 text-xs" style={{ color: 'var(--ink-text-faint)' }}>
            Si ton analyse ne s&apos;affiche pas, attends quelques secondes et réessaie.
          </p>
        )}

        {paid && typeCode && (() => {
          const t = mbtiTypes[typeCode];
          if (!t) return null;
          return (
            <div className="max-w-xl mx-auto px-4 pb-16 space-y-4">
              <div className="ur-panel-ink p-6 text-center" style={{ borderTop: `3px solid ${t.accentColor}` }}>
                <div className="text-5xl mb-3">{t.emoji}</div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: t.accentColor }}>{t.code}</p>
                <h2 className="font-display text-2xl font-black text-white mb-2">{t.name}</h2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--ink-text-muted)' }}>{t.tagline}</p>
                <span className="ur-badge" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}>{t.rarity} de la population</span>
              </div>

              <div className="ur-panel-ink p-5">
                <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Profil complet</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-text-muted)' }}>{t.fullDesc}</p>
              </div>

              <div className="ur-panel-ink p-5">
                <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Traits principaux</p>
                <div className="flex flex-wrap gap-2">
                  {t.traits.map(tr => (
                    <span key={tr} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${t.accentColor}18`, border: `1px solid ${t.accentColor}40`, color: t.accentColor }}>{tr}</span>
                  ))}
                </div>
              </div>

              <div className="ur-panel-ink p-5">
                <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>En amour ❤️</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-text-muted)' }}>{t.inLove}</p>
              </div>
              <div className="ur-panel-ink p-5">
                <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Au travail 💼</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-text-muted)' }}>{t.atWork}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="ur-panel-ink p-4">
                  <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Forces ✨</p>
                  <ul className="space-y-1.5">
                    {t.strengths.map(s => <li key={s} className="text-xs flex gap-1.5" style={{ color: 'var(--ink-text-muted)' }}><span className="flex-shrink-0" style={{ color: 'var(--gold)' }}>+</span>{s}</li>)}
                  </ul>
                </div>
                <div className="ur-panel-ink p-4">
                  <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Points fragiles ⚡</p>
                  <ul className="space-y-1.5">
                    {t.weaknesses.map(w => <li key={w} className="text-xs flex gap-1.5" style={{ color: 'var(--ink-text-muted)' }}><span className="flex-shrink-0" style={{ color: 'var(--ink-text-faint)' }}>−</span>{w}</li>)}
                  </ul>
                </div>
              </div>

              <div className="ur-panel-ink p-5">
                <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Croissance personnelle 🌱</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-text-muted)' }}>{t.growth}</p>
              </div>

              <div className="ur-panel-ink p-5">
                <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Compatibles avec 💞</p>
                <div className="flex flex-wrap gap-2">
                  {t.compatibleWith.map(c => (
                    <span key={c} className="ur-badge" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }}>{c}</span>
                  ))}
                </div>
              </div>

              {t.famousExamples.length > 0 && (
                <div className="ur-panel-ink p-5">
                  <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-faint)' }}>Célébrités {t.code}</p>
                  <p className="text-sm" style={{ color: 'var(--ink-text-muted)' }}>{t.famousExamples.join(' · ')}</p>
                </div>
              )}

              {email && (
                <div className="ur-panel-ink p-5 text-center">
                  <p className="text-sm mb-3" style={{ color: 'var(--ink-text-muted)' }}>Connecte-toi pour retrouver ton profil à tout moment</p>
                  <Link href="/auth/signin" className="ur-btn-gold inline-flex px-6 py-3 text-sm">
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
