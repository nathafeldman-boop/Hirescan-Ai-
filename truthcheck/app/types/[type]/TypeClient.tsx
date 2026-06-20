'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MbtiType } from '@/lib/mbti';
import { mbtiTypesEn } from '@/lib/i18n/mbtiTypesEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';

interface Props {
  type: MbtiType;
}

const ONE_TIME_PRICE = '1,99 €';
const MONTHLY_PRICE = '9,99 €';
const ANNUAL_PRICE = '29,99 €';

export default function TypeClient({ type }: Props) {
  const { data: session, status } = useSession();
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';
  const sessionLoading = status === 'loading';
  const { lang } = useLang();
  const t = ui[lang].type;
  const enData = mbtiTypesEn[type.code] ?? {};
  const localType: MbtiType = lang === 'en' ? { ...type, ...enData } as MbtiType : type;

  const [loading, setLoading] = useState(false);

  // ── Checkout: paiement unique 1,99 € ──
  const doOneTime = useCallback(async (email?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          quizSlug: 'personnalite',
          typeCode: type.code,
          userEmail: email ?? session?.user?.email ?? undefined,
          oneTime: true,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) { window.location.href = data.url; }
      else { alert(data.error ?? 'Erreur de paiement'); setLoading(false); }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setLoading(false);
    }
  }, [session?.user?.email, type.code]);

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
          typeCode: type.code,
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

  const handleOneTime = useCallback(() => {
    if (isPremium) return;
    void doOneTime();
  }, [isPremium, doOneTime]);

  const handleUnlock = useCallback((annual: boolean) => {
    if (isPremium) return;
    void doCheckout(annual);
  }, [isPremium, doCheckout]);

  if (sessionLoading) {
    return (
      <div className="mt-10 flex justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PREMIUM : rapport complet révélé + accès aux 15 tests UrCecret
  // ─────────────────────────────────────────────────────────────
  if (isPremium) {
    return (
      <div className="mt-10 space-y-6">
        {/* Bannière débloqué */}
        <div className="rounded-2xl p-5 border text-center"
          style={{ borderColor: `${type.accentColor}50`, background: `${type.accentColor}15` }}>
          <p className="text-sm font-bold text-white">{t.unlockedBanner}</p>
        </div>

        <Section title={t.sectionTraits} accent={type.accentColor}>
          <div className="flex flex-wrap gap-2">
            {localType.traits.map(trait => (
              <span key={trait} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: `${type.accentColor}50`, color: type.accentColor, background: `${type.accentColor}15` }}>
                {trait}
              </span>
            ))}
          </div>
        </Section>

        <Section title={t.sectionWhoAreYou} accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{localType.fullDesc}</p>
        </Section>

        <Section title={t.sectionInLove} accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{localType.inLove}</p>
        </Section>

        <Section title={t.sectionAtWork} accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{localType.atWork}</p>
        </Section>

        <div className="grid sm:grid-cols-2 gap-6">
          <Section title={t.sectionStrengths} accent={type.accentColor}>
            <ul className="space-y-2">
              {localType.strengths.map(s => (
                <li key={s} className="flex gap-2 text-sm text-zinc-300"><span className="text-emerald-400 mt-0.5">✓</span>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title={t.sectionWeaknesses} accent={type.accentColor}>
            <ul className="space-y-2">
              {localType.weaknesses.map(s => (
                <li key={s} className="flex gap-2 text-sm text-zinc-300"><span className="text-amber-400 mt-0.5">!</span>{s}</li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title={t.sectionGrowth} accent={type.accentColor}>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{localType.growth}</p>
        </Section>

        <Section title={t.sectionFamous} accent={type.accentColor}>
          <div className="flex flex-wrap gap-2">
            {type.famousExamples.map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>{f}</span>
            ))}
          </div>
        </Section>

        <Section title={t.sectionCompatibility} accent={type.accentColor}>
          <div className="flex flex-wrap gap-3">
            {type.compatibleWith.map(c => (
              <a key={c} href={`/types/${c.toLowerCase()}`}
                className="px-4 py-2 rounded-lg text-sm font-bold text-zinc-300 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {c}
              </a>
            ))}
          </div>
        </Section>

        <div className="rounded-2xl p-6 border text-center"
          style={{ borderColor: `${type.accentColor}30`, background: `${type.accentColor}10` }}>
          <h3 className="text-lg font-black text-white mb-2">Ton accès UrCecret est ouvert 🔓</h3>
          <p className="text-sm text-zinc-400 mb-4 max-w-sm mx-auto">{t.quizzesDesc}</p>
          <a href="/duo"
            className="inline-block px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 20px rgba(169,78,24,0.3)' }}>
            Test de compatibilité →
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
      {/* ── Teaser ── */}
      <div className="mt-8 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: type.accentColor }}>
          Aperçu de ton profil
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {localType.traits.slice(0, 3).map(trait => (
            <span key={trait} className="px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{ borderColor: `${type.accentColor}50`, color: type.accentColor, background: `${type.accentColor}15` }}>
              {trait}
            </span>
          ))}
        </div>
        <p className="text-zinc-200 text-sm leading-relaxed">
          {localType.fullDesc.split(/(?<=[.!?])\s/)[0]}
        </p>
        <div className="relative mt-3 overflow-hidden" style={{ maxHeight: 54 }}>
          <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {localType.fullDesc.split(/(?<=[.!?])\s/).slice(1, 4).join(' ')}
            </p>
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.97) 65%)' }} />
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/8">
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[11px] text-zinc-500">Rapport complet verrouillé — traits, amour, travail, forces…</span>
        </div>
      </div>

      {/* ── Paiement impulsif 1,99 € ── */}
      <div className="mt-6 rounded-2xl border-2 p-6 text-center"
        style={{ borderColor: `${type.accentColor}60`, background: `${type.accentColor}10` }}>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 text-white"
          style={{ background: type.accentColor }}>
          RÉSULTAT {type.code}
        </div>
        <div className="text-4xl font-black text-white mb-1">{ONE_TIME_PRICE}</div>
        <p className="text-zinc-400 text-xs mb-5">{t.oneTimeDesc}</p>
        <button
          onClick={handleOneTime}
          disabled={loading}
          className="w-full max-w-xs px-7 py-4 rounded-xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          style={{ background: `linear-gradient(135deg,${type.accentColor},#d17d52)`, boxShadow: `0 6px 24px ${type.accentColor}40` }}
        >
          {loading ? t.loading : t.unlockOneTime(ONE_TIME_PRICE)}
        </button>
      </div>

      {/* ── Séparateur ── */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-zinc-600 text-xs font-medium">{t.orPremium}</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* ── Abonnement ── */}
      <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-zinc-400 mb-1">{t.paywallTagline}</p>
        <p className="text-xs text-zinc-500 mb-4">{t.paywallPlus}</p>
        <button
          onClick={() => handleUnlock(false)}
          disabled={loading}
          className="w-full max-w-xs px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 20px rgba(169,78,24,0.3)' }}
        >
          {loading ? t.loading : t.unlockMonthly(MONTHLY_PRICE)}
        </button>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 mb-3 text-left max-w-xs mx-auto">
          {['Rapport MBTI complet', 'Amour & compatibilité', 'Forces & faiblesses', 'Tous les 16 types', 'Accès aux quiz UrCecret', 'Annulable à tout moment'].map(b => (
            <li key={b} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="text-emerald-400 text-[10px]">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleUnlock(true)}
          disabled={loading}
          className="w-full max-w-xs mt-1 px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 text-white"
          style={{ background: 'rgba(194,97,31,0.15)', border: '1px solid rgba(194,97,31,0.35)' }}
        >
          {t.unlockAnnual(ANNUAL_PRICE)}
        </button>
        <p className="text-xs text-zinc-600 mt-3">{t.guarantee}</p>
      </div>

      <div className="text-center mt-5">
        <a
          href="/types"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          🔍 Voir les 16 types
        </a>
      </div>
    </>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: accent }} />
        {title}
      </h2>
      {children}
    </div>
  );
}
