'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

// Carrousel mobile des cartes de résultat — scroll-snap natif (swipe fluide),
// une carte centrée à la fois avec un aperçu de la suivante, points de pagination.
// Aucune dépendance : le snap CSS gère le swipe, un listener met à jour l'index.
const TYPES = ['infj', 'enfp', 'intj', 'entp', 'infp', 'istp'];

export default function CardCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // Pause temporaire de l'auto-play quand l'utilisateur interagit (swipe/tap).
  const pausedUntil = useRef(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // La carte active = celle dont le centre est le plus proche du centre du viewport.
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

  // Pause quand l'utilisateur reprend la main (5 s après la dernière interaction).
  const pause = useCallback(() => { pausedUntil.current = Date.now() + 5000; }, []);

  // Auto-play : avance d'une carte toutes les 2,8 s, boucle à la première.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      const el = trackRef.current;
      if (!el || document.hidden) return;
      // Ne défile pas si l'élément n'est pas visible à l'écran (perf + pertinence).
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const next = (activeRef.current + 1) % TYPES.length;
      scrollTo(next);
    }, 2800);
    return () => clearInterval(id);
  }, [scrollTo]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={pause}
        onTouchStart={pause}
        onWheel={pause}
        className="flex gap-4 overflow-x-auto pb-1 -mx-6 px-6 no-scrollbar"
        style={{ scrollSnapType: 'x mandatory', scrollPadding: '0 1.5rem', WebkitOverflowScrolling: 'touch' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        {TYPES.map((c, i) => (
          <div
            key={c}
            className="flex-shrink-0"
            style={{
              scrollSnapAlign: 'center',
              width: 'min(72vw, 260px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              opacity: i === active ? 1 : 0.5,
              transform: i === active ? 'scale(1)' : 'scale(0.92)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/card?type=${c}`}
              alt={`Exemple de carte ${c.toUpperCase()}`}
              loading="lazy"
              decoding="async"
              className="w-full rounded-2xl"
              style={{ border: '1px solid var(--line-ink)', boxShadow: i === active ? '0 18px 50px rgba(0,0,0,0.45)' : 'none' }}
            />
          </div>
        ))}
      </div>

      {/* Points de pagination */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {TYPES.map((c, i) => (
          <button
            key={c}
            onClick={() => { pause(); scrollTo(i); }}
            aria-label={`Voir la carte ${c.toUpperCase()}`}
            className="rounded-full transition-all"
            style={{
              width: i === active ? 22 : 7,
              height: 7,
              background: i === active ? 'var(--gold)' : 'rgba(250,246,236,0.28)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
