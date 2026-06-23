'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MbtiType } from '@/lib/mbti';
import { mbtiTypesEn } from '@/lib/i18n/mbtiTypesEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';

const TYPE_COUNTS: Record<string, number> = {
  ISFJ: 2847, ISTJ: 2631, ESFJ: 2418, ESTJ: 2193,
  ENFP: 1847, ESFP: 1923, ISFP: 1762, ISTP: 1247,
  INFP: 1138, ESTP: 1089, ENFJ: 931, ENTJ: 923,
  INTJ: 768, INTP: 831, INFJ: 634, ENTP: 912,
};

interface Props {
  type: MbtiType;
}


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
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{localType.fullDesc}</p>
        </Section>

        <Section title={t.sectionInLove} accent={type.accentColor}>
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{localType.inLove}</p>
        </Section>

        <Section title={t.sectionAtWork} accent={type.accentColor}>
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{localType.atWork}</p>
        </Section>

        <div className="grid sm:grid-cols-2 gap-6">
          <Section title={t.sectionStrengths} accent={type.accentColor}>
            <ul className="space-y-2">
              {localType.strengths.map(s => (
                <li key={s} className="flex gap-2 text-sm text-stone-300"><span className="text-emerald-400 mt-0.5">✓</span>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title={t.sectionWeaknesses} accent={type.accentColor}>
            <ul className="space-y-2">
              {localType.weaknesses.map(s => (
                <li key={s} className="flex gap-2 text-sm text-stone-300"><span className="text-amber-400 mt-0.5">!</span>{s}</li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title={t.sectionGrowth} accent={type.accentColor}>
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{localType.growth}</p>
        </Section>

        <Section title={t.sectionFamous} accent={type.accentColor}>
          <div className="flex flex-wrap gap-2">
            {type.famousExamples.map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-300" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>{f}</span>
            ))}
          </div>
        </Section>

        <Section title={t.sectionCompatibility} accent={type.accentColor}>
          <div className="flex flex-wrap gap-3">
            {type.compatibleWith.map(c => (
              <a key={c} href={`/types/${c.toLowerCase()}`}
                className="px-4 py-2 rounded-lg text-sm font-bold text-stone-300 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {c}
              </a>
            ))}
          </div>
        </Section>

        <div className="rounded-2xl p-6 border text-center"
          style={{ borderColor: `${type.accentColor}30`, background: `${type.accentColor}10` }}>
          <h3 className="text-lg font-black text-white mb-2">Ton accès UrCecret est ouvert 🔓</h3>
          <p className="text-sm text-stone-400 mb-4 max-w-sm mx-auto">{t.quizzesDesc}</p>
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
      <div className="mt-8 space-y-3">
        {/* Free preview: traits + first sentence */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: type.accentColor }}>
            {lang === 'en' ? 'Free preview' : 'Aperçu gratuit'}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {localType.traits.slice(0, 3).map(trait => (
              <span key={trait} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: `${type.accentColor}50`, color: type.accentColor, background: `${type.accentColor}15` }}>
                {trait}
              </span>
            ))}
          </div>
          <p className="text-stone-200 text-sm leading-relaxed">
            {localType.fullDesc.split(/(?<=[.!?])\s/)[0]}
          </p>
        </div>

        {/* 4 locked chapters — show what's inside */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5"
               style={{ background: `${type.accentColor}18` }}>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: type.accentColor }}>
              {lang === 'en' ? `Full ${type.code} profile · 4 chapters` : `Profil ${type.code} complet · 4 chapitres`}
            </p>
            <span className="text-[10px] text-stone-500">🔒 verrouillé</span>
          </div>
          {(lang === 'en' ? [
            { icon: '💕', title: 'Love & Relationships', preview: 'Why you always invest more than the other — and the painful pattern that repeats...' },
            { icon: '💼', title: 'Career & Superpower', preview: 'The rare skill you have without knowing it — and how to turn it into a real advantage...' },
            { icon: '🌑', title: 'Shadow Side & Blind Spots', preview: 'What you do unconsciously that silently sabotages you — nobody dares to say it...' },
            { icon: '🎯', title: 'Exact Compatibility', preview: `Your most compatible types: ${localType.compatibleWith?.join(', ') ?? '…'} — and the ones that drain you...` },
          ] : [
            { icon: '💕', title: 'Amour & Relations', preview: localType.inLove?.slice(0, 90) ?? 'Pourquoi tu t\'investis toujours plus que l\'autre — et le schéma douloureux qui se répète...' },
            { icon: '💼', title: 'Carrière & Superpouvoir', preview: localType.atWork?.slice(0, 90) ?? 'La compétence rare que tu as sans le savoir — et comment la transformer en avantage réel...' },
            { icon: '🌑', title: 'Face cachée & Angles morts', preview: localType.growth?.slice(0, 90) ?? 'Ce que tu fais inconsciemment qui te sabote — et que personne n\'ose te dire en face...' },
            { icon: '🎯', title: 'Compatibilité exacte', preview: localType.compatibleWith ? `Tes types les plus compatibles : ${localType.compatibleWith.join(', ')} — et ceux qui te drainent systématiquement…` : 'Les 3 types qui te comprennent vraiment — et les 2 profils qui te drainent à coup sûr...' },
          ]).map((s, i, arr) => (
            <div key={s.title} className={`flex items-center gap-3 px-4 py-3${i < arr.length - 1 ? ' border-b border-white/5' : ''}`}>
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-300">{s.title}</p>
                <p className="text-[11px] text-stone-500 leading-tight mt-0.5 blur-[4px] select-none pointer-events-none">{s.preview}</p>
              </div>
              <span className="text-stone-600 text-xs">🔒</span>
            </div>
          ))}
        </div>

        {/* Live social proof — unique per type to feel real */}
        <div className="flex items-center justify-center gap-2">
          <span className="animate-pulse w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-[11px] text-stone-500">
            {lang === 'en'
              ? `⭐ ${TYPE_COUNTS[type.code] ?? 847} people unlocked the ${type.code} profile this month`
              : `⭐ ${TYPE_COUNTS[type.code] ?? 847} personnes ont débloqué le profil ${type.code} ce mois`}
          </span>
        </div>
      </div>

      {/* ── HERO : Mensuel (MRR) ── */}
      <div className="mt-6 rounded-2xl p-5 relative" style={{ background: 'rgba(169,78,24,0.10)', border: '2px solid rgba(169,78,24,0.45)' }}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap" style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 2px 10px rgba(169,78,24,0.4)' }}>
            🔥 LE PLUS POPULAIRE
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 mb-3">
          <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#e0a380' }}>
            Mensuel · sans engagement
          </span>
          <div className="text-right">
            <span className="text-xs text-stone-500 line-through mr-1">29,99 €</span>
            <span className="text-xl font-black text-white">9,99 €</span>
            <span className="text-stone-400 text-xs">/mois</span>
            <p className="text-[10px] text-stone-500">soit 0,33 €/jour</p>
          </div>
        </div>
        <ul className="space-y-2 mb-4">
          {[
            `Profil ${type.code} complet : amour, carrière, face cachée`,
            'Les 16 types MBTI débloqués (comprends les autres)',
            'Tous les quiz + test de compatibilité duo illimité',
            'Annulable en 1 clic — sans engagement',
          ].map(b => (
            <li key={b} className="flex items-start gap-2 text-xs text-stone-300">
              <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: '#e0a380' }}>✓</span>{b}
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleUnlock(false)}
          disabled={loading}
          className="w-full py-4 rounded-xl font-black text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 20px rgba(169,78,24,0.4)' }}
        >
          {loading ? t.loading : '🔓 Commencer pour 9,99 €/mois →'}
        </button>
        <p className="text-center text-[10px] text-stone-500 mt-2">Apple Pay · Google Pay · CB · Résiliation en 1 clic</p>
      </div>

      {/* ── Annuel (best value) ── */}
      <div className="mt-3 rounded-2xl p-4 relative" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="absolute top-0 right-0 text-white text-[9px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-xl" style={{ background: '#1f7a4d' }}>
          −75% · MEILLEURE VALEUR
        </span>
        <div className="flex items-center justify-between mb-1 pr-28">
          <span className="text-[11px] font-black uppercase tracking-widest text-stone-400">🗓 Annuel</span>
          <div className="text-right">
            <span className="text-xs text-stone-600 line-through mr-1">119,88 €</span>
            <span className="text-lg font-black text-white">29,99 €</span>
            <span className="text-stone-500 text-xs">/an</span>
          </div>
        </div>
        <p className="text-[10px] font-bold mb-3" style={{ color: '#34d399' }}>= 2,50 €/mois · économise 90 €</p>
        <button
          onClick={() => handleUnlock(true)}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ border: '1.5px solid #1f7a4d', color: '#34d399', background: 'rgba(31,122,77,0.08)' }}
        >
          {loading ? t.loading : "Choisir l'annuel — 2,50 €/mois →"}
        </button>
      </div>

      {/* ── 1,99 € (entrée petit prix) ── */}
      <div className="mt-3 rounded-xl px-4 py-3.5" style={{ background: 'rgba(169,78,24,0.06)', border: '1.5px solid rgba(169,78,24,0.35)' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#e0a380' }}>⚡ Juste mon profil {type.code}</span>
          <div>
            <span className="text-xs text-stone-600 line-through mr-1">9,99 €</span>
            <span className="text-sm font-black text-white">1,99 €</span>
          </div>
        </div>
        <p className="text-[11px] text-stone-400 mb-2.5">Paiement unique · pas d&apos;abonnement · accès à vie</p>
        <button
          onClick={handleOneTime}
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ border: '1.5px solid rgba(169,78,24,0.5)', background: 'rgba(169,78,24,0.12)', color: '#e0a380' }}
        >
          {loading ? t.loading : `⚡ Commencer pour 1,99 € →`}
        </button>
      </div>

      <p className="text-center text-[10px] text-stone-600 mt-4">🔒 Paiement sécurisé Stripe · {t.guarantee}</p>

      <div className="text-center mt-4">
        <a
          href="/types"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-400 hover:text-white transition-all"
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
      <h2 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: accent }} />
        {title}
      </h2>
      {children}
    </div>
  );
}
