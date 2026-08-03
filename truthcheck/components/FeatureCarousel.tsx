'use client';

import Link from 'next/link';
import { useRef, useState, useCallback, useEffect } from 'react';
import PhoneMockup from './PhoneMockup';
import MbtiDemoScreen from './landing-demos/MbtiDemoScreen';
import ElioDemoScreen from './landing-demos/ElioDemoScreen';
import JournalDemoScreen from './landing-demos/JournalDemoScreen';

// Les 3 démos "3 façons de te comprendre" tenaient chacune une section pleine
// largeur empilée (~3 écrans à faire défiler juste pour les voir toutes) —
// regroupées ici en un seul carrousel horizontal, même mécanique que
// CardCarousel (scroll-snap natif, pas de dépendance, auto-play + pagination).
const SLIDES = [
  {
    key: 'mbti',
    dark: false,
    bg: 'var(--paper)',
    label: '🧠 Test de personnalité',
    title: 'Découvre qui tu es, vraiment',
    desc: "Basé sur les 8 fonctions cognitives de Carl Jung. Réponds honnêtement, Elio s'occupe du reste.",
    Demo: MbtiDemoScreen,
    cta: 'Faire mon test →',
  },
  {
    key: 'elio',
    dark: true,
    bg: 'var(--ink)',
    label: '🤖 Ton IA personnelle',
    title: 'Une IA qui apprend à te connaître',
    desc: 'Analyse une conversation, comprend tes émotions, crée des tests personnalisés, répond à tes questions.',
    Demo: ElioDemoScreen,
    cta: 'Découvrir Elio →',
  },
  {
    key: 'journal',
    dark: false,
    bg: 'var(--paper-panel)',
    label: '📖 Journal émotionnel',
    title: 'Note ton humeur, découvre ton évolution',
    desc: 'Un calendrier qui se remplit chaque jour, et Elio qui repère tes tendances au fil du temps.',
    Demo: JournalDemoScreen,
    cta: 'Commencer mon journal →',
  },
];

export default function FeatureCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedUntil = useRef(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const children = Array.from(el.children) as HTMLElement[];
    let best = 0;
    let bestDist = Infinity;
    children.forEach((c, i) => {
      const cCenter = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cCenter - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    activeRef.current = best;
    setActive(best);
  }, []);

  const scrollTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' });
  }, []);

  const pause = useCallback(() => { pausedUntil.current = Date.now() + 5000; }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      const el = trackRef.current;
      if (!el || document.hidden) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const next = (activeRef.current + 1) % SLIDES.length;
      scrollTo(next);
    }, 4200);
    return () => clearInterval(id);
  }, [scrollTo]);

  return (
    <div className="relative">
      {/* Hors du track scrollable : une <style> comme premier enfant serait
          comptée dans el.children par onScroll/scrollTo et décalerait tous
          les index d'une case (pagination et auto-play cassés). */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={pause}
        onTouchStart={pause}
        onWheel={pause}
        className="flex gap-4 overflow-x-auto pb-1 -mx-6 px-6 no-scrollbar"
        style={{ scrollSnapType: 'x mandatory', scrollPadding: '0 1.5rem', WebkitOverflowScrolling: 'touch' }}
      >
        {SLIDES.map((s, i) => {
          const Demo = s.Demo;
          return (
            <div
              key={s.key}
              className="flex-shrink-0 rounded-[28px] pt-7 pb-6 px-5 text-center"
              style={{
                scrollSnapAlign: 'center',
                width: 'min(84vw, 304px)',
                background: s.bg,
                border: s.dark ? 'none' : '1px solid var(--line-ink)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                opacity: i === active ? 1 : 0.55,
                transform: i === active ? 'scale(1)' : 'scale(0.94)',
              }}
            >
              <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>{s.label}</p>
              <h3 className="font-display text-[19px] font-black mb-2 leading-tight" style={{ color: s.dark ? '#FAF6EC' : '#1c1917' }}>
                {s.title}
              </h3>
              <p className="text-[12.5px] mb-5" style={{ color: s.dark ? 'rgba(250,246,236,0.55)' : '#78716c', lineHeight: 1.5 }}>
                {s.desc}
              </p>
              <div className="fc-float mb-6">
                <PhoneMockup dark={s.dark}><Demo /></PhoneMockup>
              </div>
              <Link href="/decouverte" className="ur-btn-gold inline-flex px-6 py-3 text-[13px]">
                {s.cta}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Points de pagination */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => { pause(); scrollTo(i); }}
            aria-label={`Voir ${s.title}`}
            className="rounded-full transition-all"
            style={{ width: i === active ? 22 : 7, height: 7, background: i === active ? 'var(--gold)' : 'rgba(120,113,108,0.28)' }}
          />
        ))}
      </div>

      <style>{`
        .fc-float { animation: fcFloat 6s ease-in-out infinite; }
        @keyframes fcFloat { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @media (prefers-reduced-motion: reduce) {
          .fc-float { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
