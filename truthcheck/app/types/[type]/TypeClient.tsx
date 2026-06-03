'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MbtiType } from '@/lib/mbti';

interface Props {
  type: MbtiType;
}

const MONTHLY_PRICE = '4,99 €';
const ANNUAL_PRICE = '29,99 €';

export default function TypeClient({ type }: Props) {
  const { data: session } = useSession();
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';

  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authSent, setAuthSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const pendingRef = useRef(false);

  // ── Checkout: abonnement (mensuel par défaut, ou annuel) ──
  const doCheckout = useCallback(async (annual: boolean, email?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          quizSlug: 'personnalite',
          userEmail: email ?? session?.user?.email ?? undefined,
          ...(annual ? { annual: true } : {}),
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Erreur de paiement');
        setLoading(false);
      }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setLoading(false);
    }
  }, [session?.user?.email]);

  // Au retour d'OAuth/lien magique, déclenche le checkout en attente
  useEffect(() => {
    if (!session?.user || pendingRef.current) return;
    let flag = false;
    let annual = false;
    try {
      flag = sessionStorage.getItem('pending_checkout') === '1';
      annual = sessionStorage.getItem('pending_checkout_annual') === '1';
    } catch {}
    if (!flag) return;
    try {
      sessionStorage.removeItem('pending_checkout');
      sessionStorage.removeItem('pending_checkout_annual');
    } catch {}
    pendingRef.current = true;
    if ((session.user as { tier?: string }).tier !== 'premium') {
      void doCheckout(annual, session.user.email ?? undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  const handleUnlock = useCallback((annual: boolean) => {
    if (isPremium) return;
    if (!session?.user) {
      try {
        sessionStorage.setItem('pending_checkout', '1');
        sessionStorage.setItem('pending_checkout_annual', annual ? '1' : '0');
      } catch {}
      setShowAuthModal(true);
      return;
    }
    void doCheckout(annual);
  }, [isPremium, session?.user, doCheckout]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

  // ─────────────────────────────────────────────────────────────
  // PREMIUM : rapport complet révélé + accès aux 15 tests UrSecret
  // ─────────────────────────────────────────────────────────────
  if (isPremium) {
    return (
      <div className="mt-10 space-y-6">
        {/* Bannière débloqué */}
        <div className="rounded-2xl p-5 border text-center"
          style={{ borderColor: `${type.accentColor}40`, background: `${type.accentColor}12` }}>
          <p className="text-sm font-bold text-white">✦ Rapport complet débloqué — bienvenue dans UrSecret Premium</p>
        </div>

        <Section title="Tes traits de personnalité" accent={type.accentColor}>
          <div className="flex flex-wrap gap-2">
            {type.traits.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: `${type.accentColor}50`, color: type.accentColor, background: `${type.accentColor}15` }}>
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Qui es-tu vraiment ?" accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{type.fullDesc}</p>
        </Section>

        <Section title="En amour" accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{type.inLove}</p>
        </Section>

        <Section title="Au travail" accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{type.atWork}</p>
        </Section>

        <div className="grid sm:grid-cols-2 gap-6">
          <Section title="Tes forces" accent={type.accentColor}>
            <ul className="space-y-2">
              {type.strengths.map(s => (
                <li key={s} className="flex gap-2 text-sm text-zinc-300"><span className="text-green-400 mt-0.5">✓</span>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title="Tes angles morts" accent={type.accentColor}>
            <ul className="space-y-2">
              {type.weaknesses.map(s => (
                <li key={s} className="flex gap-2 text-sm text-zinc-300"><span className="text-amber-400 mt-0.5">!</span>{s}</li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title="Ta croissance personnelle" accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{type.growth}</p>
        </Section>

        <Section title="Célébrités de ton type" accent={type.accentColor}>
          <div className="flex flex-wrap gap-2">
            {type.famousExamples.map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">{f}</span>
            ))}
          </div>
        </Section>

        <Section title="Compatibilité relationnelle" accent={type.accentColor}>
          <div className="flex flex-wrap gap-3">
            {type.compatibleWith.map(c => (
              <a key={c} href={`/types/${c.toLowerCase()}`}
                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-zinc-300 hover:text-white hover:border-white/20 transition-all">
                {c}
              </a>
            ))}
          </div>
        </Section>

        {/* Pont vers UrSecret */}
        <div className="rounded-2xl p-6 border text-center"
          style={{ borderColor: `${type.accentColor}30`, background: 'linear-gradient(135deg, rgba(139,92,246,0.10), rgba(236,72,153,0.06))' }}>
          <h3 className="text-lg font-black text-white mb-2">Ton accès UrSecret est ouvert 🔓</h3>
          <p className="text-sm text-zinc-400 mb-4 max-w-sm mx-auto">
            Ton abonnement débloque aussi les 15 tests UrSecret : couple, amitié, manipulation, burnout, amour véritable…
          </p>
          <a href="/quizzes"
            className="inline-block px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
            style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)' }}>
            Découvrir les 15 tests UrSecret →
          </a>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // GRATUIT : teaser + paywall abonnement (façon Truity)
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Auth modal — crée ton compte d'abord */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false); }}
        >
          <div className="relative w-full max-w-sm rounded-2xl p-6 border border-white/10" style={{ background: '#111113' }}>
            <button onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors text-lg leading-none">✕</button>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-white font-black text-xl mb-2">Crée ton compte d&apos;abord</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pour garder ton rapport et tes résultats — même si tu reviens dans une semaine.
              </p>
            </div>
            {authSent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📬</div>
                <h3 className="text-white font-bold text-lg mb-2">Vérifie tes emails</h3>
                <p className="text-zinc-400 text-sm">Un lien de connexion a été envoyé à <span className="text-violet-400">{authEmail}</span></p>
                <p className="text-zinc-600 text-xs mt-3">Clique sur le lien, puis reviens ici.</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    try { sessionStorage.setItem('pending_checkout', '1'); } catch {}
                    void signIn('google', { callbackUrl: currentUrl });
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors mb-4"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuer avec Google
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-zinc-600 text-xs">ou par email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!authEmail.trim()) return;
                    setAuthLoading(true);
                    try { sessionStorage.setItem('pending_checkout', '1'); } catch {}
                    await signIn('email', { email: authEmail, callbackUrl: currentUrl, redirect: false });
                    setAuthSent(true);
                    setAuthLoading(false);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="ton@email.com" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-violet-500/60 transition-all"
                  />
                  <button type="submit" disabled={authLoading}
                    className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                    {authLoading ? 'Envoi…' : 'Recevoir mon lien de connexion'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 space-y-6">
        {/* Free: traits */}
        <Section title="Tes traits de personnalité" accent={type.accentColor}>
          <div className="flex flex-wrap gap-2">
            {type.traits.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: `${type.accentColor}50`, color: type.accentColor, background: `${type.accentColor}15` }}>
                {t}
              </span>
            ))}
          </div>
        </Section>

        {/* Free: short description */}
        <Section title="Qui es-tu vraiment ?" accent={type.accentColor}>
          <p className="text-zinc-400 text-sm leading-relaxed">{type.shortDesc}</p>
        </Section>

        {/* Paywall — abonnement */}
        <div className="relative rounded-2xl overflow-hidden border border-violet-500/30">
          <div className="px-6 py-5 blur-sm select-none pointer-events-none" aria-hidden>
            <h2 className="text-base font-bold text-white mb-2">Ton rapport complet {type.name}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              En amour, au travail, tes forces, tes angles morts, ta croissance personnelle — et des exemples de
              célébrités qui partagent ton type. Un rapport de 2000+ mots sur qui tu es vraiment...
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-[#09090b]/60 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-3xl mb-3">🔓</div>
            <h3 className="text-lg font-black text-white mb-1">Débloque ton rapport {type.code}</h3>
            <p className="text-sm text-zinc-400 mb-1 max-w-xs">
              Rapport complet <span className="text-white font-semibold">+ les 15 tests UrSecret</span>
            </p>
            <p className="text-xs text-zinc-500 mb-5">Amour · Carrière · Forces · Angles morts · Compatibilité</p>
            <button
              onClick={() => handleUnlock(false)}
              disabled={loading}
              className="w-full max-w-xs px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${type.accentColor}, #a78bfa)` }}
            >
              {loading ? 'Chargement…' : `Débloquer — ${MONTHLY_PRICE}/mois`}
            </button>
            <button
              onClick={() => handleUnlock(true)}
              disabled={loading}
              className="mt-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-60"
            >
              ou {ANNUAL_PRICE}/an — économise 50% ✦
            </button>
            <p className="text-xs text-zinc-600 mt-3">🛡️ Satisfait ou remboursé 7 jours · Annulable à tout moment</p>
          </div>
        </div>

        {/* Forces — floutées */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <div className="px-6 py-5 blur-sm select-none pointer-events-none" aria-hidden>
            <h2 className="text-base font-bold text-white mb-3">Tes forces</h2>
            <ul className="space-y-2">
              {type.strengths.map(s => (
                <li key={s} className="flex gap-2 text-sm text-zinc-400"><span className="text-green-400 mt-0.5">✓</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent flex items-end justify-center pb-6">
            <button onClick={() => handleUnlock(false)}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
              Voir mes forces et faiblesses →
            </button>
          </div>
        </div>
      </div>

      {/* Compatible types */}
      <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-base font-bold text-white mb-4">Compatibilité relationnelle</h2>
        <p className="text-xs text-zinc-500 mb-4">Types les plus compatibles avec {type.code} :</p>
        <div className="flex flex-wrap gap-3">
          {type.compatibleWith.map(c => (
            <a key={c} href={`/types/${c.toLowerCase()}`}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-zinc-300 hover:text-white hover:border-white/20 transition-all">
              {c}
            </a>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500">Analyse complète de ta compatibilité disponible dans ton rapport.</p>
          <button onClick={() => handleUnlock(false)} className="mt-3 text-xs font-medium hover:underline" style={{ color: type.accentColor }}>
            Débloquer mon rapport complet →
          </button>
        </div>
      </div>

      {/* Take the test CTA */}
      <div className="mt-8 p-5 rounded-2xl border border-white/10 text-center bg-white/3">
        <p className="text-sm text-zinc-400 mb-3">Tu n&apos;as pas encore passé le test ?</p>
        <a href="/quiz/personnalite"
          className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)' }}>
          Passer le test gratuitement →
        </a>
      </div>
    </>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: accent }} />
        {title}
      </h2>
      {children}
    </div>
  );
}
