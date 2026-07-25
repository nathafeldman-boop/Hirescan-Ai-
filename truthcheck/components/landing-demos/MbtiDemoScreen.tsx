'use client';

import { useEffect, useState } from 'react';
import { mbtiQuestions } from '@/lib/mbti';
import { mbtiTypesFree } from '@/lib/mbti-free';

// Scénario rejoué en boucle : 3 vraies questions du test (mêmes textes que
// /quiz/personnalite), une option qui se "sélectionne" toute seule après une
// pause de lecture, puis la révélation du résultat — 100% factice (aucune
// donnée réelle), pensé pour montrer le "gameplay" du test sans backend.
const SCRIPT: { qIndex: number; selected: 'A' | 'B' | null; duration: number }[] = [
  { qIndex: 0, selected: null, duration: 1100 },
  { qIndex: 0, selected: 'A', duration: 750 },
  { qIndex: 1, selected: null, duration: 1100 },
  { qIndex: 1, selected: 'B', duration: 750 },
  { qIndex: 2, selected: null, duration: 1100 },
  { qIndex: 2, selected: 'A', duration: 750 },
  { qIndex: -1, selected: null, duration: 3000 },
];

const REVEAL_TYPE = mbtiTypesFree['INFJ'];

export default function MbtiDemoScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const s = SCRIPT[step];
    const t = setTimeout(() => setStep((v) => (v + 1) % SCRIPT.length), s.duration);
    return () => clearTimeout(t);
  }, [step]);

  const s = SCRIPT[step];
  const isResult = s.qIndex === -1;
  const q = !isResult ? mbtiQuestions[s.qIndex] : null;
  const progress = isResult ? 1 : (s.qIndex + 1) / 3;

  return (
    <div className="w-full h-full flex flex-col px-4 pt-8 pb-5" style={{ background: 'var(--paper)' }}>
      <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--line)' }}>
        <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: 'var(--gold)', transition: 'width .5s ease' }} />
      </div>

      {!isResult && q ? (
        <div key={s.qIndex} style={{ animation: 'demoFadeIn .35s ease' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>Question {s.qIndex + 1}/12</p>
          <p className="font-display text-[15px] font-bold leading-snug mb-5" style={{ color: 'var(--ink)' }}>{q.text}</p>
          <div className="flex flex-col gap-2">
            {[{ letter: 'A' as const, opt: q.optionA }, { letter: 'B' as const, opt: q.optionB }].map((o) => (
              <div
                key={o.letter}
                className="rounded-xl px-3.5 py-3 text-xs font-semibold transition-all"
                style={{
                  background: s.selected === o.letter ? 'var(--gold-soft)' : 'var(--paper-panel)',
                  border: `1px solid ${s.selected === o.letter ? 'var(--gold-line)' : 'var(--line)'}`,
                  color: 'var(--ink)',
                  transform: s.selected === o.letter ? 'scale(1.02)' : 'none',
                }}
              >
                {o.opt.text}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ animation: 'demoPopIn .5s cubic-bezier(.34,1.56,.64,1)' }}>
          <div className="text-5xl mb-3">{REVEAL_TYPE.emoji}</div>
          <p className="font-display text-2xl font-black tracking-widest" style={{ color: 'var(--gold)' }}>{REVEAL_TYPE.code}</p>
          <p className="text-sm font-bold mt-1" style={{ color: 'var(--ink)' }}>{REVEAL_TYPE.name}</p>
          <p className="text-[11px] mt-2 max-w-[180px] leading-relaxed" style={{ color: '#78716c' }}>{REVEAL_TYPE.tagline}</p>
        </div>
      )}

      <style>{`
        @keyframes demoFadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes demoPopIn { from { opacity:0; transform:scale(.85) } to { opacity:1; transform:scale(1) } }
      `}</style>
    </div>
  );
}
