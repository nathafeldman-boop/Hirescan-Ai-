'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { mbtiTypes } from '@/lib/mbti';

const GROUPS = [
  {
    key: 'analystes',
    title: 'Analystes',
    desc: 'Stratèges rationnels et visionnaires',
    codes: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    bg: '#ede9fe',
    textColor: '#7c3aed',
  },
  {
    key: 'diplomates',
    title: 'Diplomates',
    desc: 'Idéalistes empathiques et inspirants',
    codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    bg: '#d1fae5',
    textColor: '#059669',
  },
  {
    key: 'sentinelles',
    title: 'Sentinelles',
    desc: 'Fiables, organisés et protecteurs',
    codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    bg: '#e0f2fe',
    textColor: '#0284c7',
  },
  {
    key: 'explorateurs',
    title: 'Explorateurs',
    desc: 'Spontanés, adaptables et aventureux',
    codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    bg: '#fef9c3',
    textColor: '#d97706',
  },
];

const MBTI_LETTERS = [
  { letter: 'E', label: 'Extraverti', color: '#7c3aed', bg: '#ede9fe', desc: 'Dynamisés par les interactions sociales, à l\'aise dans l\'action et le groupe.' },
  { letter: 'I', label: 'Introverti', color: '#9333ea', bg: '#f3e8ff', desc: 'Rechargent leur énergie dans la solitude, penseurs profonds et réfléchis.' },
  { letter: 'N', label: 'iNtuitif', color: '#059669', bg: '#d1fae5', desc: 'Orientés vers les idées abstraites, les possibilités et le futur.' },
  { letter: 'S', label: 'Sensitif', color: '#0284c7', bg: '#e0f2fe', desc: 'Ancrés dans le concret, les faits et l\'expérience directe.' },
  { letter: 'T', label: 'Pensée', color: '#d97706', bg: '#fef9c3', desc: 'Décisions basées sur la logique et l\'analyse objective.' },
  { letter: 'F', label: 'Sentiment', color: '#db2777', bg: '#fce7f3', desc: 'Décisions guidées par les valeurs et l\'impact humain.' },
  { letter: 'J', label: 'Jugement', color: '#7c3aed', bg: '#ede9fe', desc: 'Organisés, planificateurs, préfèrent la structure et la clarté.' },
  { letter: 'P', label: 'Perception', color: '#059669', bg: '#d1fae5', desc: 'Flexibles, spontanés, ouverts aux nouvelles informations.' },
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
        style={{ boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.08)' : 'none' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tight">
            <span style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ur
            </span>
            <span className="text-gray-900">Cecret</span>
          </span>
          <div className="flex items-center gap-3">
            <UserMenu />
            <Link
              href="/quiz/personnalite"
              className="text-sm font-bold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center bg-white">
        <div className="max-w-xl mx-auto">
          <h1 className="text-5xl sm:text-[64px] font-black text-gray-900 leading-tight mb-6 tracking-tight">
            Test des 16<br />personnalités
          </h1>
          <p className="text-gray-500 text-lg max-w-sm mx-auto leading-relaxed mb-10">
            Obtenez une description précise de qui vous êtes parmi les 16 personnalités et découvrez les motivations derrière vos actions.
          </p>
          <Link
            href="/quiz/personnalite"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              boxShadow: '0 8px 30px rgba(124,58,237,0.35)',
            }}
          >
            Commencer le test →
          </Link>
          <p className="text-gray-400 text-sm mt-5">
            Gratuit · 12 minutes · Résultat immédiat
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-12">
            {[
              { value: '50K+', label: 'Profils analysés' },
              { value: '4.9★', label: 'Satisfaction' },
              { value: '100%', label: 'Gratuit' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility CTA — hero placement */}
      <section className="py-12 px-6 text-center border-b border-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            ✨ Nouveau
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Test de compatibilité MBTI
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-7 max-w-sm mx-auto">
            Chacun répond séparément. L&apos;IA compare vos deux profils et révèle votre niveau de compatibilité réelle — sans filtre.
          </p>
          <Link
            href="/duo"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              boxShadow: '0 8px 30px rgba(124,58,237,0.35)',
            }}
          >
            💑 Tester notre compatibilité →
          </Link>
        </div>
      </section>

      {/* 4 family sections */}
      {GROUPS.map((group) => (
        <section key={group.key} style={{ background: group.bg }} className="relative overflow-hidden">
          {/* Huge watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ opacity: 0.1 }}
          >
            <span
              className="font-black uppercase"
              style={{
                fontSize: 'clamp(72px, 20vw, 160px)',
                color: group.textColor,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {group.title.toUpperCase()}
            </span>
          </div>

          {/* Header label */}
          <div className="relative z-10 text-center pt-10 pb-2 px-6">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: group.textColor }}>
              {group.title} — {group.desc}
            </p>
          </div>

          {/* Type entries */}
          <div className="relative z-10 max-w-sm mx-auto px-6">
            {group.codes.map((code, idx) => {
              const t = mbtiTypes[code];
              return (
                <Link
                  key={code}
                  href={`/types/${code.toLowerCase()}`}
                  className="block text-center py-12 transition-opacity hover:opacity-75"
                  style={{
                    borderBottom: idx < group.codes.length - 1
                      ? `1px solid ${group.textColor}20`
                      : 'none',
                  }}
                >
                  <div className="text-[100px] leading-none mb-5">{t.emoji}</div>
                  <h2 className="text-3xl font-black mb-2" style={{ color: group.textColor }}>
                    {t.name}
                  </h2>
                  <p className="text-xl font-bold text-gray-600 mb-3">{code}</p>
                  <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
                    {t.tagline}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Bottom wave spacer */}
          <div className="h-8" />
        </section>
      ))}

      {/* MBTI letters explanation */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            Signification des lettres MBTI
          </h2>
          <div className="space-y-6">
            {MBTI_LETTERS.map((item) => (
              <div key={item.letter} className="flex items-start gap-5">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: item.color }}
                >
                  {item.letter}
                </div>
                <div className="pt-1">
                  <p className="font-bold text-gray-900 text-base mb-1 uppercase tracking-wide text-sm">{item.label}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Truth quizzes — high-intent entry points */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#7c3aed' }}>
            Quiz vérité
          </p>
          <h2 className="text-3xl font-black text-gray-900 text-center mb-2 tracking-tight">
            Les vérités que tu n&apos;osais pas chercher
          </h2>
          <p className="text-gray-500 text-center text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Des questions difficiles. Des réponses précises. Anonyme, instantané.
          </p>
          <div className="space-y-3">
            {[
              { href: '/quiz/infidelite', emoji: '💔', q: 'Mon/ma partenaire me trompe ?', sub: '8 comportements analysés · Résultat en 2 min' },
              { href: '/quiz/amoureux', emoji: '❤️', q: 'Suis-je vraiment amoureux(se) ?', sub: "Amour ou attachement ? L'IA dit la vérité" },
              { href: '/quiz/vrais-amis', emoji: '🫂', q: 'Sont-ils mes vrais amis ?', sub: 'Identifie les dynamiques toxiques dans tes amitiés' },
              { href: '/quiz/manipule', emoji: '🎭', q: 'Suis-je manipulé(e) ?', sub: 'Reconnaître le gaslighting et les comportements de contrôle' },
            ].map((q) => (
              <Link key={q.href} href={q.href}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
              >
                <span className="text-3xl flex-shrink-0">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors text-sm leading-snug">{q.q}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{q.sub}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-violet-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <Link href="/quizzes" className="block text-center mt-6 text-sm text-gray-400 hover:text-violet-600 transition-colors">
            Voir les 15 quiz vérité →
          </Link>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black">
            <span style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ur
            </span>
            <span className="text-gray-400">Cecret</span>
          </span>
          <div className="flex items-center gap-6 text-gray-400 text-xs">
            <Link href="/types" className="hover:text-gray-700 transition-colors">16 types</Link>
            <Link href="/duo" className="hover:text-gray-700 transition-colors">Compatibilité</Link>
            <Link href="/mentions-legales" className="hover:text-gray-700 transition-colors">Légal</Link>
            <Link href="/politique-confidentialite" className="hover:text-gray-700 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-gray-300 text-xs">© 2025 UrCecret</p>
        </div>
      </footer>
    </main>
  );
}
