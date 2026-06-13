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
    bg: '#fafafa',
    textColor: '#4f46e5',
  },
  {
    key: 'diplomates',
    title: 'Diplomates',
    desc: 'Empathiques, idéalistes, axés relations',
    codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    bg: '#fafafa',
    textColor: '#059669',
  },
  {
    key: 'sentinelles',
    title: 'Sentinelles',
    desc: 'Organisés, fiables, attachés aux structures',
    codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    bg: '#fafafa',
    textColor: '#0284c7',
  },
  {
    key: 'explorateurs',
    title: 'Explorateurs',
    desc: 'Adaptables, pragmatiques, orientés action',
    codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    bg: '#fafafa',
    textColor: '#b45309',
  },
];

const MBTI_LETTERS = [
  { letter: 'E/I', label: 'Extraversion · Introversion', color: '#4f46e5', desc: 'Comment vous rechargez votre énergie : dans l\'action collective ou dans la solitude réflexive.' },
  { letter: 'N/S', label: 'Intuition · Sensation', color: '#059669', desc: 'Comment vous traitez l\'information : abstraitement vers l\'avenir ou concrètement dans le présent.' },
  { letter: 'T/F', label: 'Pensée · Sentiment', color: '#b45309', desc: 'Comment vous prenez vos décisions : par analyse logique ou par système de valeurs.' },
  { letter: 'J/P', label: 'Jugement · Perception', color: '#0284c7', desc: 'Comment vous organisez votre vie : avec structure et planification ou avec flexibilité et spontanéité.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300"
        style={{ boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none', borderBottom: scrolled ? '1px solid #f3f4f6' : '1px solid transparent' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-gray-900">
            UrCecret
          </span>
          <div className="flex items-center gap-3">
            <UserMenu />
            <Link
              href="/quiz/personnalite"
              className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#111827' }}
            >
              Faire le test
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center bg-white">
        <div className="max-w-xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-500 mb-8 tracking-wide uppercase">
            Test de personnalité — 100 questions
          </div>
          <h1 className="text-5xl sm:text-[60px] font-black text-gray-900 leading-[1.05] mb-5 tracking-tight">
            Quel est votre<br />type MBTI ?
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed mb-9">
            Un profil psychologique parmi 16 types. Basé sur la théorie des types cognitifs de Myers-Briggs. Résultat complet inclus.
          </p>
          <Link
            href="/quiz/personnalite"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#111827' }}
          >
            Passer le test gratuitement
          </Link>
          <p className="text-gray-400 text-xs mt-4">
            Gratuit · 12 minutes · Sans inscription
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-12 pt-10 border-t border-gray-100">
            {[
              { value: '16', label: 'Types de personnalité' },
              { value: '100', label: 'Questions calibrées' },
              { value: '0 €', label: 'Test de base' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility CTA */}
      <section className="py-12 px-6 border-t border-b border-gray-100 bg-gray-50">
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Mode duo</p>
            <h2 className="text-xl font-black text-gray-900 mb-1">
              Test de compatibilité MBTI
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Chacun répond séparément. Les deux profils sont comparés sur 4 dimensions cognitives.
            </p>
          </div>
          <Link
            href="/duo"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
            style={{ background: '#111827' }}
          >
            Tester la compatibilité
          </Link>
        </div>
      </section>

      {/* 4 family sections */}
      {GROUPS.map((group, groupIdx) => (
        <section key={group.key} style={{ background: group.bg }} className="border-b border-gray-100">
          {/* Header */}
          <div className="max-w-5xl mx-auto px-6 pt-10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ background: group.textColor }} />
              <div>
                <p className="font-black text-gray-900 text-sm">{group.title}</p>
                <p className="text-gray-400 text-xs">{group.desc}</p>
              </div>
            </div>
          </div>

          {/* Type grid */}
          <div className="max-w-5xl mx-auto px-6 pb-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {group.codes.map((code) => {
                const t = mbtiTypes[code];
                return (
                  <Link
                    key={code}
                    href={`/types/${code.toLowerCase()}`}
                    className="block p-5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div
                      className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-black mb-3 tracking-widest"
                      style={{ background: group.textColor + '12', color: group.textColor }}
                    >
                      {code}
                    </div>
                    <p className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-gray-700">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs leading-snug line-clamp-2">
                      {t.tagline}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* MBTI letters explanation */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-3">Fonctionnement</p>
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">
            Les 4 dimensions du modèle MBTI
          </h2>
          <div className="space-y-4">
            {MBTI_LETTERS.map((item) => (
              <div key={item.letter} className="flex items-start gap-5 p-4 rounded-xl border border-gray-100">
                <div
                  className="flex-shrink-0 w-14 h-12 rounded-lg flex items-center justify-center font-black text-xs"
                  style={{ background: item.color + '10', color: item.color }}
                >
                  {item.letter}
                </div>
                <div className="pt-0.5">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.label}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Truth quizzes */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-center text-gray-400 mb-3">
            Quiz relationnels
          </p>
          <h2 className="text-2xl font-black text-gray-900 text-center mb-2">
            Des questions que vous n&apos;osiez pas poser
          </h2>
          <p className="text-gray-500 text-center text-sm mb-8 max-w-xs mx-auto">
            Anonyme. Résultat immédiat. Sans inscription.
          </p>
          <div className="space-y-2">
            {[
              { href: '/quiz/infidelite', q: 'Mon/ma partenaire me trompe ?', sub: '8 comportements analysés · 2 minutes' },
              { href: '/quiz/amoureux', q: 'Suis-je vraiment amoureux(se) ?', sub: 'Amour, attachement ou habitude — analyse différenciée' },
              { href: '/quiz/vrais-amis', q: 'Sont-ils de vrais amis ?', sub: 'Dynamiques de réciprocité dans vos amitiés proches' },
              { href: '/quiz/manipule', q: 'Suis-je manipulé(e) ?', sub: 'Gaslighting, contrôle émotionnel, emprise — détection' },
            ].map((q) => (
              <Link key={q.href} href={q.href}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{q.q}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{q.sub}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-600 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <Link href="/quizzes" className="block text-center mt-6 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            Voir tous les quiz →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-base font-black text-gray-900">UrCecret</span>
          <div className="flex items-center gap-6 text-gray-400 text-xs">
            <Link href="/types" className="hover:text-gray-700 transition-colors">16 types</Link>
            <Link href="/duo" className="hover:text-gray-700 transition-colors">Compatibilité</Link>
            <Link href="/mentions-legales" className="hover:text-gray-700 transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-gray-700 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-gray-300 text-xs">© 2025 UrCecret</p>
        </div>
      </footer>
    </main>
  );
}
