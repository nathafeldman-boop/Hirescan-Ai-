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
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.2)',
  },
  {
    key: 'diplomates',
    title: 'Diplomates',
    desc: 'Empathiques, idéalistes, axés relations',
    codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    color: '#34d399',
    glow: 'rgba(52,211,153,0.2)',
  },
  {
    key: 'sentinelles',
    title: 'Sentinelles',
    desc: 'Organisés, fiables, attachés aux structures',
    codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.2)',
  },
  {
    key: 'explorateurs',
    title: 'Explorateurs',
    desc: 'Adaptables, pragmatiques, orientés action',
    codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.2)',
  },
];

const MBTI_LETTERS = [
  { letter: 'E/I', label: 'Extraversion · Introversion', color: '#818cf8', desc: 'Comment vous rechargez votre énergie : dans l\'action collective ou dans la solitude réflexive.' },
  { letter: 'N/S', label: 'Intuition · Sensation', color: '#34d399', desc: 'Comment vous traitez l\'information : abstraitement vers l\'avenir ou concrètement dans le présent.' },
  { letter: 'T/F', label: 'Pensée · Sentiment', color: '#fb923c', desc: 'Comment vous prenez vos décisions : par analyse logique ou par système de valeurs.' },
  { letter: 'J/P', label: 'Jugement · Perception', color: '#38bdf8', desc: 'Comment vous organisez votre vie : avec structure et planification ou avec flexibilité et spontanéité.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] overflow-x-hidden">

      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-[0.12] bg-violet-600" />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.08] bg-pink-600" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full blur-3xl opacity-[0.07] bg-violet-800" />
      </div>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(9,9,11,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Cecret</span>
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
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 tracking-wide"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
          >
            ✦ Test de personnalité — 100 questions
          </div>

          <h1 className="text-5xl sm:text-[60px] font-black leading-[1.05] mb-5 tracking-tight">
            <span className="text-white">Test MBTI — quel est</span><br />
            <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ton type ?
            </span>
          </h1>

          <p className="text-zinc-400 text-base max-w-sm mx-auto leading-relaxed mb-9">
            Parmi 16 profils psychologiques. Basé sur la théorie des types cognitifs de Myers-Briggs. Résultat complet en 12 minutes.
          </p>

          <Link
            href="/quiz/personnalite"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}
          >
            Découvrir mon type →
          </Link>
          <p className="text-zinc-600 text-xs mt-4">
            Gratuit · 12 minutes · Sans inscription
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-14 pt-10 border-t border-white/5">
            {[
              { value: '16', label: 'Profils distincts' },
              { value: '100', label: 'Questions calibrées' },
              { value: '0 €', label: 'Pour commencer' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
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
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(236,72,153,0.08))', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#a78bfa' }}>Mode duo</p>
              <h2 className="text-base font-black text-white mb-1">
                Test de compatibilité MBTI
              </h2>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
                Chacun répond séparément. Les deux profils sont comparés sur 4 dimensions cognitives.
              </p>
            </div>
            <Link
              href="/duo"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Tester la compatibilité →
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
                <div className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(180deg,${group.color},${group.color}80)` }} />
                <div>
                  <p className="font-black text-white text-sm">{group.title}</p>
                  <p className="text-zinc-500 text-xs">{group.desc}</p>
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
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div
                        className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-black mb-3 tracking-widest"
                        style={{ background: group.color + '20', color: group.color }}
                      >
                        {code}
                      </div>
                      <p className="font-bold text-white text-sm leading-snug mb-1">
                        {t.name}
                      </p>
                      <p className="text-zinc-500 text-xs leading-snug line-clamp-2">
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
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 text-center mb-3">Fonctionnement</p>
          <h2 className="text-2xl font-black text-white text-center mb-10">
            Les 4 dimensions du modèle MBTI
          </h2>
          <div className="space-y-3">
            {MBTI_LETTERS.map((item) => (
              <div
                key={item.letter}
                className="flex items-start gap-5 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="flex-shrink-0 w-14 h-12 rounded-lg flex items-center justify-center font-black text-xs"
                  style={{ background: item.color + '15', color: item.color }}
                >
                  {item.letter}
                </div>
                <div className="pt-0.5">
                  <p className="font-semibold text-white text-sm mb-1">{item.label}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Truth quizzes */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#a78bfa' }}>
            Questions secrètes
          </p>
          <h2 className="text-2xl font-black text-white text-center mb-2">
            Des révélations que tu n&apos;attendais pas
          </h2>
          <p className="text-zinc-500 text-center text-sm mb-8 max-w-xs mx-auto">
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
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xl flex-shrink-0">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm leading-snug">{q.q}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{q.sub}</p>
                </div>
                <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <Link href="/quizzes" className="block text-center mt-6 text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
            Voir tous les quiz →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-base font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Cecret</span>
          </span>
          <div className="flex items-center gap-6 text-zinc-600 text-xs">
            <Link href="/types" className="hover:text-zinc-200 transition-colors">16 types</Link>
            <Link href="/duo" className="hover:text-zinc-200 transition-colors">Compatibilité</Link>
            <Link href="/mentions-legales" className="hover:text-zinc-200 transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-zinc-200 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-zinc-700 text-xs">© 2025 UrCecret</p>
        </div>
      </footer>
    </main>
  );
}
