'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { mbtiTypes } from '@/lib/mbti';
import SocialProofToast from './SocialProofToast';

const GROUPS = [
  {
    key: 'analystes',
    title: 'Analystes',
    desc: 'Rationnels, stratèges, orientés systèmes',
    codes: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    color: '#a94e18',
    glow: 'rgba(169,78,24,0.10)',
    emoji: '📊',
  },
  {
    key: 'diplomates',
    title: 'Diplomates',
    desc: 'Empathiques, idéalistes, axés relations',
    codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    color: '#566b45',
    glow: 'rgba(86,107,69,0.10)',
    emoji: '🌱',
  },
  {
    key: 'sentinelles',
    title: 'Sentinelles',
    desc: 'Organisés, fiables, attachés aux structures',
    codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    color: '#3f6b6b',
    glow: 'rgba(63,107,107,0.10)',
    emoji: '🏛️',
  },
  {
    key: 'explorateurs',
    title: 'Explorateurs',
    desc: 'Adaptables, pragmatiques, orientés action',
    codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    color: '#b07d2b',
    glow: 'rgba(176,125,43,0.10)',
    emoji: '🎯',
  },
];

const MBTI_LETTERS = [
  { letter: 'E/I', emoji: '🧭', label: 'Extraversion · Introversion', color: '#a94e18', desc: 'Indique si ta fonction cognitive dominante est dirigée vers l\'extérieur (action, personnes) ou vers l\'intérieur (réflexion, solitude). Ce n\'est pas la timidité — c\'est la direction de ton énergie.' },
  { letter: 'N/S', emoji: '🌟', label: 'Intuition · Sensation', color: '#566b45', desc: 'Tes deux fonctions de perception. Jung distingue la Sensation (concret, présent, détails) de l\'iNtuition (abstrait, futur, patterns). L\'une est dominante, l\'autre auxiliaire dans ton stack.' },
  { letter: 'T/F', emoji: '🧠', label: 'Pensée · Sentiment', color: '#b07d2b', desc: 'Tes deux fonctions de jugement. La Pensée (logique, systèmes, objectivité) et le Sentiment (valeurs, harmonie, impact humain). Ces fonctions déterminent comment tu décides — pas ce que tu ressens.' },
  { letter: 'J/P', emoji: '📅', label: 'Jugement · Perception', color: '#3f6b6b', desc: 'Révèle quelle fonction est en surface : une fonction de Jugement (T ou F) te donne une structure visible ; une fonction de Perception (N ou S) te rend plus adaptable. Mais ton intérieur est souvent l\'inverse.' },
];

const CLAY = '#a94e18';

function InAppBanner({ onClose }: { onClose: () => void }) {
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  };
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: '#2b2622', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 8px 32px rgba(0,0,0,0.28)' }}>
      <span className="text-xl flex-shrink-0">📖</span>
      <p className="flex-1 text-white text-xs leading-snug" style={{ fontFamily: 'var(--font-sans)' }}>
        Pour voir tes résultats, <strong>ouvre dans ton navigateur</strong> (⋯ → Ouvrir dans le navigateur)
      </p>
      <button onClick={copyLink} className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(224,163,128,0.22)', color: '#e0a380' }}>
        Copier
      </button>
      <button onClick={onClose} className="flex-shrink-0 text-stone-400 text-sm leading-none">✕</button>
    </div>
  );
}

function isInAppBrowser(ua: string): boolean {
  const isAndroidWebView = /Android/.test(ua) && /\bwv\b/.test(ua);
  const isIOSWebView = /iP(hone|ad|od)/.test(ua) && /AppleWebKit/.test(ua) && !/Safari/.test(ua);
  const isSocialApp = /FBAN|FBAV|Instagram|TikTok|BytedanceWebview|MicroMessenger|Snapchat|musical_ly|trill|ZhiLiao/.test(ua);
  return isAndroidWebView || isIOSWebView || isSocialApp;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [fromTiktok, setFromTiktok] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setStickyVisible(window.scrollY > 320);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    if (isInAppBrowser(ua)) setInApp(true);
    const p = new URLSearchParams(window.location.search);
    const isTiktokUA = /TikTok|BytedanceWebview|musical_ly|trill/i.test(ua);
    setFromTiktok(p.get('utm_source') === 'tiktok' || p.get('utm_medium') === 'paid' || isTiktokUA);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden relative" style={{ background: '#f7f3ec', color: '#2b2622' }}>
      <SocialProofToast />
      {/* InAppBanner intentionnellement retiré de la landing — le banner est géré sur la page de résultats uniquement pour ne pas bloquer le traffic ads TikTok/Instagram */}
      {false && inApp && !bannerDismissed && <InAppBanner onClose={() => setBannerDismissed(true)} />}

      {/* Paper grain — handcrafted texture */}
      <div className="grain-overlay" />

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(247,243,236,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #e4d9c8' : '1px solid transparent',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight font-display" style={{ color: '#2b2622' }}>
            Ur<span style={{ color: CLAY }}>Cecret</span>
          </span>
          <div className="flex items-center gap-3">
            <UserMenu />
            <Link
              href="/quiz/personnalite"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:opacity-90 active:scale-[0.97] whitespace-nowrap"
              style={{ background: '#131110', color: '#f5f1e8', boxShadow: '0 6px 18px rgba(19,17,16,0.22)' }}
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-36 pb-12 px-6 text-center">
        <div className="max-w-xl mx-auto">

          {/* Live social proof pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(169,78,24,0.07)', border: '1px solid rgba(169,78,24,0.18)', color: CLAY }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            {fromTiktok ? 'Ce test circule sur TikTok en ce moment' : 'Test de personnalité · Résultat immédiat'}
          </div>

          <h1 className="font-display font-black mb-5 tracking-tight" style={{ color: '#2b2622', fontSize: 'clamp(2rem, 9vw, 3.4rem)', lineHeight: 1.06, wordBreak: 'break-word' }}>
            {fromTiktok ? (
              <>Tu réagis différemment <span style={{ color: CLAY, fontStyle: 'italic' }}>des autres</span> — voilà pourquoi</>
            ) : (
              <>Quel est <span style={{ color: CLAY, fontStyle: 'italic' }}>vraiment</span> ton type de personnalité ?</>
            )}
          </h1>

          <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed mb-8">
            {fromTiktok
              ? 'Ton type MBTI explique comment ton cerveau traite le monde. 16 profils distincts basés sur Jung. Résultat en moins de 3 minutes.'
              : 'Basé sur les 8 fonctions cognitives de Carl Jung. 16 profils distincts. Ton analyse complète en moins de 3 minutes.'}
          </p>

          <Link
            href="/quiz/personnalite"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] whitespace-nowrap"
            style={{ background: '#131110', color: '#f5f1e8', boxShadow: '0 14px 36px rgba(19,17,16,0.3)' }}
          >
            Découvrir mon type →
          </Link>
          <p className="text-stone-400 text-xs mt-3.5">
            Gratuit · Résultat immédiat · Sans inscription
          </p>

          {/* Trust strip right under the CTA — where the click decision happens */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span style={{ color: '#e0a380', letterSpacing: 1, fontSize: 13 }}>★★★★★</span>
            <span className="text-xs font-bold" style={{ color: '#2b2622' }}>4,9</span>
            <span className="text-xs text-stone-400">· +12 000 tests ce mois</span>
          </div>
          <div className="flex justify-center -space-x-2 mt-3">
            {['#a94e18', '#566b45', '#3f6b6b', '#b07d2b', '#8a3e16'].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white" style={{ background: c }} />
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-12 pt-8" style={{ borderTop: '1px solid #e4d9c8' }}>
            {[
              { value: '15 quiz', label: 'Différents thèmes' },
              { value: '+10 000', label: 'Résultats ce mois' },
              { value: 'Gratuit', label: 'Pour commencer' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-black" style={{ color: '#2b2622' }}>{s.value}</div>
                <div className="text-xs text-stone-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi c'est différent — rangées éditoriales, pas des cartes ── */}
      <section className="relative z-10 pb-12 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-bold uppercase text-center mb-6" style={{ color: CLAY, letterSpacing: '0.24em' }}>
            Pourquoi ce test est différent
          </p>
          {[
            { n: '01', t: 'Les 4 lettres, tout le monde te les donne.', d: 'Le pourquoi — comment tu aimes, décides, te sabotes — c\'est ça que ton profil explique.' },
            { n: '02', t: 'Fondé sur les 8 fonctions cognitives de Jung.', d: 'Pas un quiz de magazine : le modèle qui décrit comment ton cerveau traite le monde.' },
            { n: '03', t: 'Écrit pour être relu toute ta vie.', d: 'Avant un entretien, au début d\'une relation, dans un conflit, à chaque grande décision.' },
          ].map((r, i, arr) => (
            <div key={r.n} className={`flex items-start gap-5 py-5${i < arr.length - 1 ? ' border-b' : ''}`}
                 style={{ borderColor: '#e8e0d0' }}>
              <span className="font-display flex-shrink-0" style={{ fontSize: 15, color: CLAY, fontWeight: 600, marginTop: 2 }}>{r.n}</span>
              <div>
                <p className="text-[15px] font-bold text-stone-900 leading-snug" style={{ letterSpacing: '-0.01em' }}>{r.t}</p>
                <p className="text-[13px] text-stone-500 mt-1" style={{ lineHeight: 1.6 }}>{r.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2 : MBTI pour traffic TikTok, quiz thématiques pour trafic organique ── */}
      <section className="relative z-10 pb-10 px-5">
        <div className="max-w-lg mx-auto">
          {fromTiktok ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: CLAY }}>
                🧠 Les 4 familles MBTI
              </p>
              <h2 className="font-display text-2xl font-black text-stone-900 text-center mb-1">
                Quel type es-tu vraiment ?
              </h2>
              <p className="text-stone-400 text-center text-xs mb-5">
                16 profils · Fonctions cognitives de Jung · Résultat en 5 min
              </p>
              <div className="space-y-2">
                {[
                  { href: '/quiz/personnalite', emoji: '📊', q: 'Analytique (INTJ · INTP · ENTJ · ENTP)', sub: 'Stratèges, rationnels, orientés systèmes' },
                  { href: '/quiz/personnalite', emoji: '🌱', q: 'Diplomate (INFJ · INFP · ENFJ · ENFP)',  sub: 'Empathiques, idéalistes, axés relations' },
                  { href: '/quiz/personnalite', emoji: '🏛️', q: 'Sentinelle (ISTJ · ISFJ · ESTJ · ESFJ)', sub: 'Organisés, fiables, attachés aux structures' },
                  { href: '/quiz/personnalite', emoji: '🎯', q: 'Explorateur (ISTP · ISFP · ESTP · ESFP)', sub: 'Adaptables, pragmatiques, orientés action' },
                ].map((q) => (
                  <Link
                    key={q.q}
                    href={q.href}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: '#fff', border: '1px solid #ece2d4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <span className="text-2xl flex-shrink-0">{q.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm leading-snug">{q.q}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{q.sub}</p>
                    </div>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(169,78,24,0.08)' }}>
                      <svg className="w-3.5 h-3.5" style={{ color: CLAY }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/quiz/personnalite" className="block text-center mt-4 text-xs font-semibold transition-colors" style={{ color: CLAY }}>
                Faire le test complet →
              </Link>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: CLAY }}>
                🔍 Questions secrètes
              </p>
              <h2 className="font-display text-2xl font-black text-stone-900 text-center mb-1">
                Des révélations que tu n&apos;attendais pas
              </h2>
              <p className="text-stone-400 text-center text-xs mb-5">
                Anonyme · Résultat immédiat · Sans inscription
              </p>
              <div className="space-y-2">
                {[
                  { href: '/quiz/personnalite', q: 'Quel est vraiment mon type MBTI ?',   sub: 'Effrayant de précision · 16 profils · résultat en 3 min', emoji: '🧠' },
                  { href: '/quiz/infidelite',   q: 'Mon/ma partenaire me trompe ?',       sub: '8 comportements analysés · 2 minutes',                  emoji: '💔' },
                  { href: '/quiz/amoureux',     q: 'Suis-je vraiment amoureux(se) ?',     sub: 'Amour, attachement ou habitude — analyse différenciée', emoji: '❤️' },
                  { href: '/quiz/manipule',     q: 'Suis-je manipulé(e) ?',               sub: 'Gaslighting, contrôle émotionnel, emprise — détection', emoji: '🎭' },
                  { href: '/quiz/vrais-amis',   q: 'Sont-ils de vrais amis ?',            sub: 'Dynamiques de réciprocité dans tes amitiés proches',    emoji: '🤝' },
                ].map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: '#fff', border: '1px solid #ece2d4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <span className="text-2xl flex-shrink-0">{q.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm leading-snug">{q.q}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{q.sub}</p>
                    </div>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(169,78,24,0.08)' }}>
                      <svg className="w-3.5 h-3.5" style={{ color: CLAY }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/quizzes" className="block text-center mt-4 text-xs font-semibold transition-colors" style={{ color: CLAY }}>
                Voir tous les quiz →
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-4 px-4">
        <div className="max-w-lg mx-auto space-y-3">
          {[
            { msg: "j'ai fait le quiz infidélité à 2h du matin… j'avais 78%. Deux semaines après j'avais ma réponse. L'analyse était précise à un niveau qui m'a mis mal à l'aise 😰", who: "Camille, 24 ans" },
            { msg: "INTJ depuis 3 ans sur 16personalities — ici l'analyse des fonctions cognitives m'a appris des trucs que je ne savais pas sur moi-même. C'est pas le même niveau.", who: "Lucas, 22 ans" },
            { msg: "j'ai envoyé le lien du quiz amoureux à mon meilleur ami sans lui dire pourquoi. Il a eu 82%. On s'est parlé pour la première fois en vrai après ça 🙏", who: "Jade, 27 ans" },
          ].map(({ msg, who }) => (
            <div
              key={who}
              className="flex items-start gap-3 rounded-2xl px-4 py-3"
              style={{ background: '#fff', border: '1px solid #ece2d4' }}
            >
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white" style={{ background: CLAY }}>
                {who[0]}
              </div>
              <div>
                <p className="text-stone-700 text-sm leading-relaxed">{msg}</p>
                <p className="text-stone-400 text-xs mt-1">— {who}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compatibility CTA */}
      <section className="relative z-10 py-6 px-6">
        <div className="max-w-lg mx-auto">
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{ background: '#fff', border: '1px solid #ece2d4' }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#566b45' }}>💑 Mode duo</p>
              <h2 className="font-display text-lg font-black text-stone-900 mb-1">
                Test de compatibilité MBTI
              </h2>
              <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
                Chacun répond séparément. Les deux profils sont comparés sur 4 dimensions cognitives.
              </p>
            </div>
            <Link
              href="/duo"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: '#566b45', boxShadow: '0 2px 10px rgba(86,107,69,0.22)' }}
            >
              Tester la compatibilité →
            </Link>
          </div>

          {/* Fusion card */}
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-3"
            style={{ background: '#fff', border: '1px solid #ece2d4' }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: CLAY }}>⚗️ Mode groupe</p>
              <h2 className="font-display text-lg font-black text-stone-900 mb-1">
                Fusion — Quiz de groupe
              </h2>
              <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
                2 à 10 personnes répondent ensemble et découvrent le profil collectif de leur groupe.
              </p>
            </div>
            <Link
              href="/fusion"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: CLAY, boxShadow: '0 2px 10px rgba(169,78,24,0.22)' }}
            >
              Lancer un Fusion →
            </Link>
          </div>
        </div>
      </section>

      {/* 4 family sections */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          {GROUPS.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{group.emoji}</span>
                <div>
                  <p className="font-display font-black text-stone-900 text-base">{group.title}</p>
                  <p className="text-stone-400 text-xs">{group.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {group.codes.map((code) => {
                  const t = mbtiTypes[code];
                  return (
                    <Link
                      key={code}
                      href={`/types/${code.toLowerCase()}`}
                      className="block p-5 rounded-xl transition-all hover:-translate-y-0.5 group"
                      style={{ background: '#fff', border: '1px solid #ece2d4' }}
                    >
                      <div
                        className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-black mb-3 tracking-widest"
                        style={{ background: group.color + '15', color: group.color }}
                      >
                        {code}
                      </div>
                      <p className="font-bold text-stone-900 text-sm leading-snug mb-1">
                        {t.name}
                      </p>
                      <p className="text-stone-400 text-xs leading-snug line-clamp-2">
                        {t.tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MBTI letters explanation */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 text-center mb-3">Fonctionnement · Théorie de Carl Jung</p>
          <h2 className="font-display text-3xl font-black text-stone-900 text-center mb-10">
            Les 4 dimensions — 8 fonctions cognitives
          </h2>
          <div className="space-y-3">
            {MBTI_LETTERS.map((item) => (
              <div
                key={item.letter}
                className="flex items-start gap-5 p-4 rounded-xl"
                style={{ background: '#fff', border: '1px solid #ece2d4' }}
              >
                <div
                  className="flex-shrink-0 w-14 h-12 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: item.color + '12' }}
                >
                  {item.emoji}
                </div>
                <div className="pt-0.5">
                  <p className="font-semibold text-stone-900 text-sm mb-1">{item.label}</p>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 pb-24 sm:pb-8" style={{ borderTop: '1px solid #e4d9c8' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-base font-black">
            Ur<span style={{ color: CLAY }}>Cecret</span>
          </span>
          <div className="flex items-center gap-6 text-stone-400 text-xs">
            <Link href="/types" className="hover:text-stone-700 transition-colors">16 types</Link>
            <Link href="/duo" className="hover:text-stone-700 transition-colors">Compatibilité</Link>
            <Link href="/fusion" className="hover:text-stone-700 transition-colors">Fusion</Link>
            <Link href="/mentions-legales" className="hover:text-stone-700 transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-stone-700 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-stone-400 text-xs">© 2025 UrCecret</p>
        </div>
      </footer>

      {/* Sticky mobile CTA — visible after 320px scroll, hidden on desktop */}
      {stickyVisible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
          style={{ padding: '12px 16px 28px', background: 'linear-gradient(to top, rgba(247,243,236,1) 65%, transparent)' }}
        >
          <Link
            href="/quiz/personnalite"
            className="block w-full text-center py-4 rounded-full font-bold text-base transition-all active:scale-[0.98]"
            style={{ background: '#131110', color: '#f5f1e8', boxShadow: '0 12px 30px rgba(19,17,16,0.32)' }}
          >
            Découvrir mon type →
          </Link>
        </div>
      )}
    </main>
  );
}
