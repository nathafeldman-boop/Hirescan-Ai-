'use client';

import { useEffect, useState } from 'react';
import NovaAvatar from '@/components/NovaAvatar';

// Conversation 100% scriptée, rejouée en boucle — même style visuel que le
// vrai chat (bulles, avatar, indicateur "tape…") mais aucune vraie donnée ni
// appel API : le "gameplay" de Nova, pensé pour la landing.
const MESSAGES = [
  { role: 'user' as const, text: 'Comment tu vois ma journée ?' },
  { role: 'nova' as const, text: 'Tu sembles plus apaisé les jours où tu vois tes amis 😊' },
  { role: 'user' as const, text: 'Analyse ma conversation avec Léa' },
  { role: 'nova' as const, text: "Je détecte un style d'attachement sécure, plutôt rassurant." },
];

const SCRIPT: { visibleCount: number; typing: boolean; duration: number }[] = [
  { visibleCount: 0, typing: false, duration: 700 },
  { visibleCount: 1, typing: false, duration: 1300 },
  { visibleCount: 1, typing: true, duration: 900 },
  { visibleCount: 2, typing: false, duration: 2200 },
  { visibleCount: 3, typing: false, duration: 1300 },
  { visibleCount: 3, typing: true, duration: 900 },
  { visibleCount: 4, typing: false, duration: 2800 },
];

export default function NovaDemoScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const s = SCRIPT[step];
    const t = setTimeout(() => setStep((v) => (v + 1) % SCRIPT.length), s.duration);
    return () => clearTimeout(t);
  }, [step]);

  const s = SCRIPT[step];

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--ink)' }}>
      <div className="flex items-center gap-2 px-4 pt-8 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <NovaAvatar size={22} />
        <span className="font-display text-xs font-bold" style={{ color: '#FAF6EC' }}>Nova</span>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }} />
      </div>

      <div className="flex-1 px-3.5 py-4 flex flex-col gap-2.5 overflow-hidden">
        {MESSAGES.slice(0, s.visibleCount).map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end gap-1.5'}`} style={{ animation: 'demoBubbleIn .3s ease' }}>
            {m.role === 'nova' && <div style={{ width: 18 }}><NovaAvatar size={18} /></div>}
            <div
              className="max-w-[75%] rounded-2xl px-3 py-2 text-[11px] leading-snug"
              style={m.role === 'user'
                ? { background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: '#FAF6EC' }
                : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAF6EC' }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {s.typing && (
          <div className="flex items-end gap-1.5" style={{ animation: 'demoBubbleIn .3s ease' }}>
            <div style={{ width: 18 }}><NovaAvatar size={18} /></div>
            <div className="rounded-2xl px-3.5 py-2.5 flex gap-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes demoBubbleIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}
