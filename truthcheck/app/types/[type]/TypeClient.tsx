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
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
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
          style={{ borderColor: `${type.accentColor}40`, background: `${type.accentColor}10` }}>
          <p className="text-sm font-bold text-gray-900">{t.unlockedBanner}</p>
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
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{localType.fullDesc}</p>
        </Section>

        <Section title={t.sectionInLove} accent={type.accentColor}>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{localType.inLove}</p>
        </Section>

        <Section title={t.sectionAtWork} accent={type.accentColor}>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{localType.atWork}</p>
        </Section>

        <div className="grid sm:grid-cols-2 gap-6">
          <Section title={t.sectionStrengths} accent={type.accentColor}>
            <ul className="space-y-2">
              {localType.strengths.map(s => (
                <li key={s} className="flex gap-2 text-sm text-gray-700"><span className="text-green-500 mt-0.5">✓</span>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title={t.sectionWeaknesses} accent={type.accentColor}>
            <ul className="space-y-2">
              {localType.weaknesses.map(s => (
                <li key={s} className="flex gap-2 text-sm text-gray-700"><span className="text-amber-500 mt-0.5">!</span>{s}</li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title={t.sectionGrowth} accent={type.accentColor}>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{localType.growth}</p>
        </Section>

        <Section title={t.sectionFamous} accent={type.accentColor}>
          <div className="flex flex-wrap gap-2">
            {type.famousExamples.map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 text-gray-700">{f}</span>
            ))}
          </div>
        </Section>

        <Section title={t.sectionCompatibility} accent={type.accentColor}>
          <div className="flex flex-wrap gap-3">
            {type.compatibleWith.map(c => (
              <a key={c} href={`/types/${c.toLowerCase()}`}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-all">
                {c}
              </a>
            ))}
          </div>
        </Section>

        <div className="rounded-2xl p-6 border text-center"
          style={{ borderColor: `${type.accentColor}30`, background: `${type.accentColor}08` }}>
          <h3 className="text-lg font-black text-gray-900 mb-2">Ton accès UrCecret est ouvert 🔓</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{t.quizzesDesc}</p>
          <a href="/duo"
            className="inline-block px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
            style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)' }}>
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
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: type.accentColor }}>
          Aperçu de ton profil
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {localType.traits.slice(0, 3).map(trait => (
            <span key={trait} className="px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{ borderColor: `${type.accentColor}50`, color: type.accentColor, background: `${type.accentColor}12` }}>
              {trait}
            </span>
          ))}
        </div>
        <p className="text-gray-800 text-sm leading-relaxed">
          {localType.fullDesc.split(/(?<=[.!?])\s/)[0]}
        </p>
        <div className="relative mt-3 overflow-hidden" style={{ maxHeight: 54 }}>
          <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
            <p className="text-gray-500 text-sm leading-relaxed">
              {localType.fullDesc.split(/(?<=[.!?])\s/).slice(1, 4).join(' ')}
            </p>
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(249,250,251,0.97) 65%)' }} />
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-gray-200">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[11px] text-gray-400">Rapport complet verrouillé — traits, amour, travail, forces…</span>
        </div>
      </div>

      {/* ── Paiement impulsif 1,99 € ── */}
      <div className="mt-6 rounded-2xl border-2 p-6 text-center"
        style={{ borderColor: type.accentColor, background: `${type.accentColor}08` }}>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 text-white"
          style={{ background: type.accentColor }}>
          RÉSULTAT {type.code}
        </div>
        <div className="text-4xl font-black text-gray-900 mb-1">{ONE_TIME_PRICE}</div>
        <p className="text-gray-500 text-xs mb-5">{t.oneTimeDesc}</p>
        <button
          onClick={handleOneTime}
          disabled={loading}
          className="w-full max-w-xs px-7 py-4 rounded-xl font-black text-white text-base transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
          style={{ background: type.accentColor, boxShadow: `0 6px 24px ${type.accentColor}50` }}
        >
          {loading ? t.loading : t.unlockOneTime(ONE_TIME_PRICE)}
        </button>
      </div>

      {/* ── Séparateur ── */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-xs font-medium">{t.orPremium}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── Abonnement ── */}
      <div className="rounded-2xl border border-gray-200 p-5 text-center bg-gray-50">
        <p className="text-xs text-gray-500 mb-1">{t.paywallTagline}</p>
        <p className="text-xs text-gray-400 mb-4">{t.paywallPlus}</p>
        <button
          onClick={() => handleUnlock(false)}
          disabled={loading}
          className="w-full max-w-xs px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 4px 20px rgba(139,92,246,0.25)' }}
        >
          {loading ? t.loading : t.unlockMonthly(MONTHLY_PRICE)}
        </button>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 mb-3 text-left max-w-xs mx-auto">
          {['Rapport MBTI complet', 'Amour & compatibilité', 'Forces & faiblesses', 'Tous les 16 types', 'Accès aux quiz UrCecret', 'Annulable à tout moment'].map(b => (
            <li key={b} className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="text-emerald-500 text-[10px]">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleUnlock(true)}
          disabled={loading}
          className="w-full max-w-xs mt-1 px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 disabled:opacity-60 border border-violet-300 text-violet-600 hover:border-violet-400 hover:bg-violet-50"
        >
          {t.unlockAnnual(ANNUAL_PRICE)}
        </button>
        <p className="text-xs text-gray-400 mt-3">{t.guarantee}</p>
      </div>

      <div className="text-center mt-5">
        <a
          href="/types"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all"
        >
          🔍 Voir les 16 types
        </a>
      </div>
    </>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
      <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: accent }} />
        {title}
      </h2>
      {children}
    </div>
  );
}
