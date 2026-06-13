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
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.12)',
    emoji: '📊',
  },
  {
    key: 'diplomates',
    title: 'Diplomates',
    desc: 'Empathiques, idéalistes, axés relations',
    codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    color: '#10b981',
    glow: 'rgba(16,185,129,0.12)',
    emoji: '🌱',
  },
  {
    key: 'sentinelles',
    title: 'Sentinelles',
    desc: 'Organisés, fiables, attachés aux structures',
    codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.12)',
    emoji: '🏛️',
  },
  {
    key: 'explorateurs',
    title: 'Explorateurs',
    desc: 'Adaptables, pragmatiques, orientés action',
    codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    color: '#f97316',
    glow: 'rgba(249,115,22,0.12)',
    emoji: '🎯',
  },
];

const MBTI_LETTERS = [
  { letter: 'E/I', emoji: '🧭', label: 'Extraversion · Introversion', color: '#7c3aed', desc: 'Comment vous rechargez votre énergie : dans l\'action collective ou dans la solitude réflexive.' },
  { letter: 'N/S', emoji: '🌟', label: 'Intuition · Sensation', color: '#10b981', desc: 'Comment vous traitez l\'information : abstraitement vers l\'avenir ou concrètement dans le présent.' },
  { letter: 'T/F', emoji: '🧠', label: 'Pensée · Sentiment', color: '#f97316', desc: 'Comment vous prenez vos décisions : par analyse logique ou par système de valeurs.' },
  { letter: 'J/P', emoji: '📅', label: 'Jugement · Perception', color: '#0ea5e9', desc: 'Comment vous organisez votre vie : avec structure et planification ou avec flexibilité et spontanéité.' },
];

function InAppBanner({ onClose }: { onClose: () => void }) {
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  };
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
      <span className="text-xl flex-shrink-0">📱</span>
      <p className="flex-1 text-white text-xs leading-snug">
        Pour payer, <strong>ouvre dans ton navigateur</strong> (⋯ → Ouvrir dans le navigateur)
      </p>
      <button onClick={copyLink} className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(124,58,237,0.25)', color: '#a78bfa' }}>
        Copier
      </button>
      <button onClick={onClose} className="flex-shrink-0 text-zinc-500 text-sm leading-none">✕</button>
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
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#faf9f7' }}>
      {inApp && !bannerDismissed && <InAppBanner onClose={() => setBannerDismissed(true)} />}

      {/* Subtle cream orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-[0.15] bg-violet-300" />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl opacity-[0.1] bg-pink-300" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full blur-3xl opacity-[0.08] bg-violet-200" />
      </div>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(250,249,247,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid #e7e5e0' : '1px solid transparent',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            <span style={{ background: 'linear-gradient(to right,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-stone-900">Cecret</span>
          </span>
          <div className="flex items-center gap-3">
            <UserMenu />
            <Link
              href="/quiz/personnalite"
              className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
            >
              Faire le test
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          {/* Floating crystal balls */}
          <div className="flex justify-center gap-3 mb-6 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }}>🔮</span>
            <span className="animate-bounce" style={{ animationDelay: '200ms', animationDuration: '2s' }}>✨</span>
            <span className="animate-bounce" style={{ animationDelay: '400ms', animationDuration: '2s' }}>🧠</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#7c3aed' }}
          >
            ✦ Test de personnalité — 100 questions
          </div>

          <h1 className="text-5xl sm:text-[56px] font-black leading-[1.05] mb-5 tracking-tight text-stone-900">
            Test MBTI — quel est<br />
            <span style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ton type ?
            </span>
          </h1>

          <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed mb-9">
            Parmi 16 profils psychologiques. Basé sur la théorie des types cognitifs de Myers-Briggs. Résultat complet en 12 minutes.
          </p>

          <Link
            href="/quiz/personnalite"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}
          >
            Découvrir mon type →
          </Link>
          <p className="text-stone-400 text-xs mt-4">
            Gratuit · 12 minutes · Sans inscription
          </p>

          {/* Features strip */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-stone-400 text-xs font-medium">Et aussi :</span>
            <a href="/duo" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.04]" style={{ background: 'white', border: '1px solid #e7e5e0', color: '#7c3aed' }}>
              💑 Test duo
            </a>
            <a href="/fusion" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.04]" style={{ background: 'white', border: '1px solid #e7e5e0', color: '#ec4899' }}>
              ⚗️ Quiz de groupe
            </a>
            <a href="/quizzes" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.04]" style={{ background: 'white', border: '1px solid #e7e5e0', color: '#6b7280' }}>
              🎯 15 quiz secrets
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-14 pt-10 border-t border-stone-200">
            {[
              { value: '16', label: 'Profils distincts', emoji: '🌈' },
              { value: '100', label: 'Questions calibrées', emoji: '🎯' },
              { value: '0 €', label: 'Pour commencer', emoji: '🎁' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-lg mb-1">{s.emoji}</div>
                <div className="text-2xl font-black text-stone-900">{s.value}</div>
                <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility CTA */}
      <section className="relative z-10 py-6 px-6">
        <div className="max-w-lg mx-auto">
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.06),rgba(236,72,153,0.04))', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#7c3aed' }}>💑 Mode duo</p>
              <h2 className="text-base font-black text-stone-900 mb-1">
                Test de compatibilité MBTI
              </h2>
              <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
                Chacun répond séparément. Les deux profils sont comparés sur 4 dimensions cognitives.
              </p>
            </div>
            <Link
              href="/duo"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 16px rgba(124,58,237,0.25)' }}
            >
              Tester la compatibilité →
            </Link>
          </div>

          {/* Fusion card */}
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-3"
            style={{ background: 'linear-gradient(135deg,rgba(236,72,153,0.06),rgba(124,58,237,0.04))', border: '1px solid rgba(236,72,153,0.15)' }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#ec4899' }}>⚗️ Mode groupe</p>
              <h2 className="text-base font-black text-stone-900 mb-1">
                Fusion — Quiz de groupe
              </h2>
              <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
                2 à 10 personnes répondent ensemble et découvrent le profil collectif de leur groupe.
              </p>
            </div>
            <Link
              href="/fusion"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#ec4899,#7c3aed)', boxShadow: '0 4px 16px rgba(236,72,153,0.25)' }}
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
                  <p className="font-black text-stone-900 text-sm">{group.title}</p>
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
                      className="block p-5 rounded-xl transition-all hover:scale-[1.02] group"
                      style={{ background: 'white', border: '1px solid #e7e5e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
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
          <h2 className="text-2xl font-black text-stone-900 text-center mb-10">
            Les 4 dimensions du modèle MBTI
          </h2>
          <div className="space-y-3">
            {MBTI_LETTERS.map((item) => (
              <div
                key={item.letter}
                className="flex items-start gap-5 p-4 rounded-xl"
                style={{ background: 'white', border: '1px solid #e7e5e0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
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
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#7c3aed' }}>
            🔍 Questions secrètes
          </p>
          <h2 className="text-2xl font-black text-stone-900 text-center mb-2">
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
                className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01] group"
                style={{ background: 'white', border: '1px solid #e7e5e0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
              >
                <span className="text-2xl flex-shrink-0">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm leading-snug">{q.q}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{q.sub}</p>
                </div>
                <svg className="w-4 h-4 text-stone-300 group-hover:text-violet-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <Link href="/quizzes" className="block text-center mt-6 text-sm font-semibold transition-colors" style={{ color: '#7c3aed' }}>
            Voir tous les quiz →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-stone-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-base font-black">
            <span style={{ background: 'linear-gradient(to right,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-stone-900">Cecret</span>
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
