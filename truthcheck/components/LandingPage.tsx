'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { mbtiTypes } from '@/lib/mbti';

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
  { letter: 'E/I', emoji: '🧭', label: 'Extraversion · Introversion', color: '#a94e18', desc: 'Comment vous rechargez votre énergie : dans l\'action collective ou dans la solitude réflexive.' },
  { letter: 'N/S', emoji: '🌟', label: 'Intuition · Sensation', color: '#566b45', desc: 'Comment vous traitez l\'information : abstraitement vers l\'avenir ou concrètement dans le présent.' },
  { letter: 'T/F', emoji: '🧠', label: 'Pensée · Sentiment', color: '#b07d2b', desc: 'Comment vous prenez vos décisions : par analyse logique ou par système de valeurs.' },
  { letter: 'J/P', emoji: '📅', label: 'Jugement · Perception', color: '#3f6b6b', desc: 'Comment vous organisez votre vie : avec structure et planification ou avec flexibilité et spontanéité.' },
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isInAppBrowser(navigator.userAgent || '')) setInApp(true);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden relative" style={{ background: '#f7f3ec', color: '#2b2622' }}>
      {inApp && !bannerDismissed && <InAppBanner onClose={() => setBannerDismissed(true)} />}

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
              href="/commencer"
              className="text-sm font-bold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: CLAY, boxShadow: '0 2px 10px rgba(169,78,24,0.25)' }}
            >
              Faire le test
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-36 pb-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-7 tracking-wide"
            style={{ background: 'rgba(169,78,24,0.07)', border: '1px solid rgba(169,78,24,0.18)', color: CLAY }}
          >
            Test de personnalité · 100 questions
          </div>

          <h1 className="font-display text-5xl sm:text-[58px] font-black leading-[1.04] mb-5 tracking-tight" style={{ color: '#2b2622' }}>
            Quel est<br />
            <span style={{ color: CLAY, fontStyle: 'italic' }}>vraiment</span> ton type ?
          </h1>

          <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed mb-9">
            Parmi 16 profils psychologiques. Basé sur la théorie des types cognitifs de Myers-Briggs. Ton résultat complet en 12 minutes.
          </p>

          <Link
            href="/commencer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: CLAY, boxShadow: '0 6px 24px rgba(169,78,24,0.28)' }}
          >
            Découvrir mon type →
          </Link>
          <p className="text-stone-400 text-xs mt-4">
            Gratuit · 12 minutes · Sans inscription
          </p>

          {/* Features strip */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-stone-400 text-xs font-medium">Et aussi :</span>
            <a href="/duo" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.04]" style={{ background: '#fff', border: '1px solid #e4d9c8', color: '#566b45' }}>
              💑 Test duo
            </a>
            <a href="/fusion" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.04]" style={{ background: '#fff', border: '1px solid #e4d9c8', color: CLAY }}>
              ⚗️ Quiz de groupe
            </a>
            <a href="/quizzes" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.04]" style={{ background: '#fff', border: '1px solid #e4d9c8', color: '#78716c' }}>
              🎯 15 quiz secrets
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-14 pt-10" style={{ borderTop: '1px solid #e4d9c8' }}>
            {[
              { value: '16', label: 'Profils distincts' },
              { value: '100', label: 'Questions calibrées' },
              { value: '0 €', label: 'Pour commencer' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-black" style={{ color: '#2b2622' }}>{s.value}</div>
                <div className="text-xs text-stone-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-4 px-4">
        <div className="max-w-lg mx-auto space-y-3">
          {[
            { msg: "j'ai peur c'est vraiment moi 😰 c'est hyper précis je comprends enfin pourquoi je réagis comme ça", who: "Camille, 24 ans" },
            { msg: "j'ai pris l'abonnement à 10€ j'utilise vraiment tous les jours maintenant, ça vaut largement le coup", who: "Lucas, 22 ans" },
            { msg: "le suivi sur 15 jours est vraiment incroyable 🙏 je me sens tellement mieux dans ma peau", who: "Jade, 27 ans" },
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
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 text-center mb-3">Fonctionnement</p>
          <h2 className="font-display text-3xl font-black text-stone-900 text-center mb-10">
            Les 4 dimensions du modèle MBTI
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

      {/* Truth quizzes */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: CLAY }}>
            🔍 Questions secrètes
          </p>
          <h2 className="font-display text-3xl font-black text-stone-900 text-center mb-2">
            Des révélations que tu n&apos;attendais pas
          </h2>
          <p className="text-stone-500 text-center text-sm mb-8 max-w-xs mx-auto">
            Anonyme. Résultat immédiat. Sans inscription.
          </p>
          <div className="space-y-2">
            {[
              { href: '/quiz/infidelite', q: 'Mon/ma partenaire me trompe ?', sub: '8 comportements analysés · 2 minutes', emoji: '💔' },
              { href: '/quiz/amoureux', q: 'Suis-je vraiment amoureux(se) ?', sub: 'Amour, attachement ou habitude — analyse différenciée', emoji: '❤️' },
              { href: '/quiz/vrais-amis', q: 'Sont-ils de vrais amis ?', sub: 'Dynamiques de réciprocité dans tes amitiés proches', emoji: '🤝' },
              { href: '/quiz/manipule', q: 'Suis-je manipulé(e) ?', sub: 'Gaslighting, contrôle émotionnel, emprise — détection', emoji: '🎭' },
            ].map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="flex items-center gap-4 p-4 rounded-xl transition-all hover:-translate-y-0.5 group"
                style={{ background: '#fff', border: '1px solid #ece2d4' }}
              >
                <span className="text-2xl flex-shrink-0">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm leading-snug">{q.q}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{q.sub}</p>
                </div>
                <svg className="w-4 h-4 text-stone-300 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <Link href="/quizzes" className="block text-center mt-6 text-sm font-semibold transition-colors" style={{ color: CLAY }}>
            Voir tous les quiz →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6" style={{ borderTop: '1px solid #e4d9c8' }}>
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
    </main>
  );
}
