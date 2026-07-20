'use client';

import { useRef, useState, useCallback } from 'react';

// Carrousel mobile des cartes de résultat — scroll-snap natif (swipe fluide),
// une carte centrée à la fois avec un aperçu de la suivante, points de pagination.
// Aucune dépendance : le snap CSS gère le swipe, un listener met à jour l'index.
const TYPES = ['infj', 'enfp', 'intj', 'entp', 'infp', 'istp'];

export default function CardCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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
    setActive(best);
  }, []);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
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
            onClick={() => scrollTo(i)}
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
