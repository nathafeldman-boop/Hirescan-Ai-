'use client';

import { useEffect, useState } from 'react';

// Grille démo (28 cases, 4 semaines) — index → emoji d'humeur pour les
// journées "remplies". Purement illustratif (voir demande produit : jamais de
// vraies données). Les cases se remplissent une par une puis un insight de
// Elio apparaît — le "gameplay" du Journal, rejoué en boucle.
const FILLED: Record<number, string> = {
  2: '🙂', 3: '😄', 5: '😐',
  7: '😄', 8: '🙂', 11: '😞', 12: '🙂', 13: '😄',
  15: '😄', 16: '🙂', 17: '🙂',
  21: '🙂', 23: '😄', 24: '😄',
};
const FILLED_ORDER = Object.keys(FILLED).map(Number);
const REVEAL_INTERVAL = 160;
const INSIGHT_TEXT = 'Ton humeur est meilleure le week-end 😊';

export default function JournalDemoScreen() {
  const [revealed, setRevealed] = useState(0);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    if (revealed < FILLED_ORDER.length) {
      const t = setTimeout(() => setRevealed((v) => v + 1), REVEAL_INTERVAL);
      return () => clearTimeout(t);
    }
    if (!showInsight) {
      const t = setTimeout(() => setShowInsight(true), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setShowInsight(false); setRevealed(0); }, 2800);
    return () => clearTimeout(t);
  }, [revealed, showInsight]);

  return (
    <div className="w-full h-full flex flex-col px-4 pt-8 pb-5" style={{ background: 'var(--paper)' }}>
      <p className="font-display text-sm font-black mb-4" style={{ color: 'var(--ink)' }}>📖 Juillet</p>

      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <span key={i} className="text-center text-[8px] font-bold" style={{ color: '#a8a29e' }}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }).map((_, i) => {
          const revealedIndex = FILLED_ORDER.indexOf(i);
          const isFilled = revealedIndex !== -1 && revealedIndex < revealed;
          return (
            <div
              key={i}
              className="aspect-square rounded-lg flex items-center justify-center text-[11px]"
              style={{
                background: isFilled ? 'var(--gold-soft)' : 'var(--paper-panel)',
                border: '1px solid var(--line)',
                animation: isFilled ? 'demoCellPop .3s cubic-bezier(.34,1.56,.64,1)' : undefined,
              }}
            >
              {isFilled ? FILLED[i] : ''}
            </div>
          );
        })}
      </div>

      <div className="flex-1" />

      {showInsight && (
        <div className="rounded-xl px-3.5 py-3" style={{ background: 'var(--ink)', animation: 'demoInsightIn .4s cubic-bezier(.34,1.56,.64,1)' }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>✦ Elio</p>
          <p className="text-[11px] leading-snug" style={{ color: '#FAF6EC' }}>{INSIGHT_TEXT}</p>
        </div>
      )}

      <style>{`
        @keyframes demoCellPop { from { opacity:0; transform:scale(.4) } to { opacity:1; transform:scale(1) } }
        @keyframes demoInsightIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
}
