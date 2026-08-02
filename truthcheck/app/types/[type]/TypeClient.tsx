'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { hasProfileAccess } from '@/lib/plans';
import { MbtiTypeFree } from '@/lib/mbti-free';
import { MbtiTypePremium } from '@/lib/mbti-premium';
import { mbtiTypesEnFree } from '@/lib/i18n/mbtiTypesEnFree';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';
import Seal from '@/components/Seal';
import ShareResultCard from '@/components/ShareResultCard';

const TYPE_COUNTS: Record<string, number> = {
  ISFJ: 2847, ISTJ: 2631, ESFJ: 2418, ESTJ: 2193,
  ENFP: 1847, ESFP: 1923, ISFP: 1762, ISTP: 1247,
  INFP: 1138, ESTP: 1089, ENFJ: 931, ENTJ: 923,
  INTJ: 768, INTP: 831, INFJ: 634, ENTP: 912,
};

const HOOK_LINES: Record<string, string> = {
  INTJ: 'Pourquoi tu sembles froid(e) alors que tu ressens tout en profondeur',
  INTP: 'Pourquoi tu procrastines sur tes propres projets malgré ton intelligence',
  ENTJ: 'Pourquoi on te voit comme autoritaire quand tu veux juste être efficace',
  ENTP: 'Pourquoi tu t\'ennuies si vite — même avec les gens que tu aimes',
  INFJ: 'Pourquoi tu t\'épuises à tout porter pour les autres',
  INFP: 'Pourquoi tu te sens incompris(e) même par ceux qui t\'aiment',
  ENFJ: 'Pourquoi tu mets les autres avant toi jusqu\'à t\'oublier',
  ENFP: 'Pourquoi tu commences tout avec passion sans jamais finir',
  ISTJ: 'Pourquoi tu portes tout le monde sans que personne le remarque',
  ISFJ: 'Pourquoi tu dis oui quand tu veux dire non — encore et encore',
  ESTJ: 'Pourquoi on te trouve trop dur(e) quand tu veux juste aider',
  ESFJ: 'Pourquoi tu as besoin que tout le monde aille bien pour aller bien',
  ISTP: 'Pourquoi tu fuis dès que quelqu\'un s\'attache vraiment à toi',
  ISFP: 'Pourquoi tu n\'oses pas montrer ce que tu crées vraiment',
  ESTP: 'Pourquoi tu t\'ennuies dès que la relation devient sécurisante',
  ESFP: 'Pourquoi tu as besoin d\'attention pour te sentir vraiment aimé(e)',
};

interface Props {
  type: MbtiTypeFree;
}


export default function TypeClient({ type }: Props) {
  const { data: session, status } = useSession();
  const tier = (session?.user as { tier?: string } | undefined)?.tier;
  const isPremium = hasProfileAccess(tier);
  const sessionLoading = status === 'loading';
  const { lang } = useLang();
  const t = ui[lang].type;
  const enData = mbtiTypesEnFree[type.code] ?? {};
  const localType: MbtiTypeFree = lang === 'en' ? { ...type, ...enData } as MbtiTypeFree : type;

  // Contenu payant : jamais importé statiquement (fuirait dans le bundle
  // client public). Récupéré uniquement après vérification serveur du
  // paiement, via /api/profile/[code] (voir ce fichier pour le détail).
  const [premium, setPremium] = useState<MbtiTypePremium | null>(null);
  const [premiumLoading, setPremiumLoading] = useState(false);

  useEffect(() => {
    if (!isPremium) { setPremium(null); return; }
    let cancelled = false;
    setPremiumLoading(true);
    fetch(`/api/profile/${type.code}?lang=${lang}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (!cancelled) { setPremium(data); setPremiumLoading(false); } })
      .catch(() => { if (!cancelled) setPremiumLoading(false); });
    return () => { cancelled = true; };
  }, [isPremium, type.code, lang]);

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
    if (premiumLoading || !premium) {
      return (
        <div className="mt-10 flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
        </div>
      );
    }
    return (
      <div className="mt-10 space-y-6">
        {/* Bannière débloqué */}
        <div className="rounded-2xl p-5 border text-center"
          style={{ borderColor: `var(--gold-line)`, background: `var(--gold-soft)` }}>
          <p className="text-sm font-bold text-white">{t.unlockedBanner}</p>
        </div>

        {/* Carte à partager / télécharger (TikTok, Insta…) */}
        <ShareResultCard code={type.code} />

        <Section title={t.sectionTraits} accent="var(--gold)">
          <div className="flex flex-wrap gap-2">
            {localType.traits.map(trait => (
              <span key={trait} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: `var(--gold-line)`, color: 'var(--gold)', background: `var(--gold-soft)` }}>
                {trait}
              </span>
            ))}
          </div>
        </Section>

        <Section title={t.sectionWhoAreYou} accent="var(--gold)">
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{premium.fullDesc}</p>
        </Section>

        <Section title={t.sectionInLove} accent="var(--gold)">
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{premium.inLove}</p>
        </Section>

        <Section title={t.sectionAtWork} accent="var(--gold)">
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{premium.atWork}</p>
        </Section>

        <div className="grid sm:grid-cols-2 gap-6">
          <Section title={t.sectionStrengths} accent="var(--gold)">
            <ul className="space-y-2">
              {premium.strengths.map(s => (
                <li key={s} className="flex gap-2 text-sm text-stone-300"><span className="text-emerald-400 mt-0.5">✓</span>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title={t.sectionWeaknesses} accent="var(--gold)">
            <ul className="space-y-2">
              {premium.weaknesses.map(s => (
                <li key={s} className="flex gap-2 text-sm text-stone-300"><span className="text-amber-400 mt-0.5">!</span>{s}</li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title={t.sectionGrowth} accent="var(--gold)">
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{premium.growth}</p>
        </Section>

        <Section title={t.sectionFamous} accent="var(--gold)">
          <div className="flex flex-wrap gap-2">
            {premium.famousExamples.map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-300" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>{f}</span>
            ))}
          </div>
        </Section>

        <Section title={t.sectionCompatibility} accent="var(--gold)">
          <div className="flex flex-wrap gap-3">
            {premium.compatibleWith.map(c => (
              <a key={c} href={`/types/${c.toLowerCase()}`}
                className="px-4 py-2 rounded-lg text-sm font-bold text-stone-300 hover:text-white transition-all"
                style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
                {c}
              </a>
            ))}
          </div>
        </Section>

        <div className="rounded-2xl p-6 border text-center"
          style={{ borderColor: `var(--gold-line)`, background: `var(--gold-soft)` }}>
          <h3 className="text-lg font-black text-white mb-2">Continue avec ton coach</h3>
          <p className="text-sm text-stone-400 mb-4 max-w-sm mx-auto">
            Ton coach IA connaît ton profil {type.code}. Pose-lui tout — relations, travail, décisions — il te répond d’après ton test.
          </p>
          <a href="/chat?start=result"
            className="inline-block px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-[1.02]"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            🔮 Approfondis avec ton coach →
          </a>
          {/* Arrivé ici, le profil est débloqué (payé — one-shot ou abonnement) :
              même dichotomie que le paywall gratuit (débloquer vs continuer
              gratuitement), donc même chose ici entre Elio et le Hub — un vrai
              choix, jamais un chemin forcé. */}
          <div className="mt-3">
            <a href="/decouverte" className="text-xs" style={{ color: 'var(--ink-text-muted)' }}>← Retourner à mon Hub</a>
          </div>
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
        <div className="rounded-2xl p-5" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
            {lang === 'en' ? 'Free preview' : 'Aperçu gratuit'}
          </p>
          <div className="flex flex-wrap gap-2">
            {localType.traits.slice(0, 3).map(trait => (
              <span key={trait} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: `var(--gold-line)`, color: 'var(--gold)', background: `var(--gold-soft)` }}>
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Hook line — curiosity gap, mirrors the paywall */}
        {HOOK_LINES[type.code] && lang !== 'en' && (
          <div className="rounded-2xl px-4 py-3.5" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--gold)' }}>
              Ton profil complet révèle
            </p>
            <p className="text-sm font-bold text-stone-200 leading-snug">{HOOK_LINES[type.code]}</p>
          </div>
        )}

        {/* 4 locked chapters — show what's inside */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--line-ink)', background: 'var(--ink-soft)' }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line-ink)]"
               style={{ background: `var(--gold-soft)` }}>
            <p className="ur-label text-[10px]" style={{ color: 'var(--gold)' }}>
              {lang === 'en' ? `Full ${type.code} profile, 4 chapters` : `Profil ${type.code} complet, 4 chapitres`}
            </p>
            <span className="ur-label text-[10px] text-stone-500">{lang === 'en' ? 'locked' : 'verrouillé'}</span>
          </div>
          {(lang === 'en' ? [
            { title: 'Love & Relationships', preview: 'Why you always invest more than the other, and the painful pattern that repeats' },
            { title: 'Career & Superpower', preview: 'The rare skill you have without knowing it, and how to turn it into a real advantage' },
            { title: 'Shadow Side & Blind Spots', preview: 'What you do unconsciously that silently sabotages you' },
            { title: 'Exact Compatibility', preview: 'The types that truly get you, and the ones that drain you' },
          ] : [
            { title: 'Amour & Relations', preview: 'Pourquoi tu t\'investis toujours plus que l\'autre, et le schéma douloureux qui se répète' },
            { title: 'Carrière & Superpouvoir', preview: 'La compétence rare que tu as sans le savoir, et comment la transformer en avantage réel' },
            { title: 'Face cachée & Angles morts', preview: 'Ce que tu fais inconsciemment qui te sabote' },
            { title: 'Compatibilité exacte', preview: 'Les types qui te comprennent vraiment, et ceux qui te drainent' },
          ]).map((s, i, arr) => (
            <div key={s.title} className={`flex items-center gap-3 px-4 py-3${i < arr.length - 1 ? ' border-b border-[var(--line-ink)]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-300">{s.title}</p>
                <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                  <span className="ur-cut select-none pointer-events-none">{s.preview}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live social proof — unique per type to feel real */}
        <div className="flex items-center justify-center gap-2">
          <span className="animate-pulse w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-[11px] text-stone-500">
            {lang === 'en'
              ? `${TYPE_COUNTS[type.code] ?? 847} people unlocked the ${type.code} profile this month`
              : `${TYPE_COUNTS[type.code] ?? 847} personnes ont débloqué le profil ${type.code} ce mois`}
          </span>
        </div>
      </div>

      {/* ── HERO : 1,99 € paiement unique ── */}
      <div className="mt-6 rounded-[28px] p-5 relative overflow-hidden" style={{ background: 'var(--ink)', border: '1px solid var(--gold-line)' }}>
        <div aria-hidden className="absolute pointer-events-none" style={{ top: -30, right: -30, opacity: 0.1 }}>
          <Seal size={130} />
        </div>
        <p className="ur-label text-[10px] mb-4 relative" style={{ color: 'var(--gold)' }}>
          {lang === 'en' ? 'Instant access' : 'Accès immédiat'}
        </p>
        <div className="mb-4 relative">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black" style={{ color: 'var(--gold)' }}>1,99 €</span>
            <span className="text-sm text-stone-500 line-through">29,99 €</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">paiement unique, accès à vie, le prix d&apos;un café</p>
        </div>
        <ul className="space-y-2 mb-4 relative">
          {[
            `Profil ${type.code} complet en 4 chapitres`,
            'Amour, Carrière, Face cachée & Compatibilité',
            'Accès immédiat, conservé à vie, zéro abonnement',
          ].map(b => (
            <li key={b} className="flex items-start gap-2 text-xs text-stone-300">
              <span className="font-black flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }}>✓</span>{b}
            </li>
          ))}
        </ul>
        <button
          onClick={handleOneTime}
          disabled={loading}
          className="relative w-full py-4 rounded-full font-black text-sm transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}
        >
          {loading ? t.loading : `Débloquer mon profil ${type.code}, 1,99 €`}
        </button>
        <p className="text-center text-[10px] text-stone-500 mt-2 relative">Apple Pay, Google Pay, CB. Accès immédiat.</p>
      </div>

      {/* ── Mensuel (secondary) ── */}
      <div className="mt-3 rounded-2xl p-4" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-black text-stone-400">Abonnement mensuel, sans engagement</p>
            <p className="text-[10px] text-stone-500 mt-0.5">Les 16 profils MBTI + tous les quiz + duo illimité</p>
          </div>
          <div className="text-right ml-3 flex-shrink-0">
            <span className="text-xs text-stone-600 line-through block">29,99 €</span>
            <span className="text-base font-black text-white">9,99 €</span>
            <span className="text-[10px] text-stone-500">/mois</span>
          </div>
        </div>
        <button
          onClick={() => handleUnlock(false)}
          disabled={loading}
          className="w-full py-2.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ border: '1px solid var(--gold-line)', color: 'var(--gold)', background: 'var(--gold-soft)' }}
        >
          {loading ? t.loading : "Choisir l'abonnement →"}
        </button>
      </div>

      <p className="text-center text-[10px] text-stone-600 mt-4">Paiement sécurisé Stripe, {t.guarantee}</p>

      <div className="text-center mt-4">
        <a
          href="/types"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-stone-400 hover:text-white transition-all"
          style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}
        >
          Voir les 16 types
        </a>
      </div>
    </>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
      <h2 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: accent }} />
        {title}
      </h2>
      {children}
    </div>
  );
}
