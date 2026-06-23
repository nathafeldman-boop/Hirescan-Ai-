'use client';

import { useEffect, useState } from 'react';

// Recurring, tasteful "X vient de débloquer son profil" notifications.
// Proven conversion lever on quiz funnels — creates live activity + FOMO.
// Subtle bottom-left card, fades in/out, dismissable, never blocks content.

const NAMES = [
  'Camille', 'Lucas', 'Jade', 'Théo', 'Emma', 'Hugo', 'Léa', 'Nathan',
  'Manon', 'Inès', 'Marc', 'Zoé', 'Antoine', 'Sarah', 'Maxime', 'Chloé',
  'Alex', 'Lucie', 'Sophie', 'Nicolas', 'Marie', 'Paul', 'Clara', 'Enzo',
];
const TYPES = ['INFJ', 'INFP', 'ENFP', 'ENFJ', 'INTJ', 'INTP', 'ENTP', 'ISFJ', 'ISTP', 'ESFP', 'ESTP', 'ISFP'];
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes', 'Bruxelles', 'Genève', 'Montréal'];
const ACTIONS = [
  'vient de débloquer son profil',
  'vient de débloquer son analyse complète',
  'vient de payer son profil',
  'a lu son analyse cette semaine',
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Toast {
  name: string;
  type: string;
  city: string;
  action: string;
  mins: number;
}

function makeToast(): Toast {
  return {
    name: rand(NAMES),
    type: rand(TYPES),
    city: rand(CITIES),
    action: rand(ACTIONS),
    mins: 1 + Math.floor(Math.random() * 14),
  };
}

export default function SocialProofToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const cycle = () => {
      setToast(makeToast());
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 4800);
      showTimer = setTimeout(cycle, 4800 + 9000 + Math.random() * 4000);
    };

    // first toast after a short delay so it doesn't pop before the page finishes rendering
    showTimer = setTimeout(cycle, 2000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [dismissed]);

  if (dismissed || !toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        zIndex: 40,
        maxWidth: 290,
        transform: visible ? 'translateY(0)' : 'translateY(140%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          background: '#ffffff',
          border: '1px solid #ece2d4',
          borderRadius: 14,
          padding: '11px 13px',
          boxShadow: '0 8px 28px rgba(43,38,34,0.14)',
        }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#a94e18,#d17d52)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 15,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {toast.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12.5, color: '#2b2622', lineHeight: 1.35, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
            <strong>{toast.name}</strong> · {toast.city}<br />
            {toast.action} <strong style={{ color: '#a94e18' }}>{toast.type}</strong>
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 10.5, color: '#a8a29e', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            il y a {toast.mins} min
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          style={{ background: 'none', border: 'none', color: '#d6d3d1', fontSize: 15, cursor: 'pointer', lineHeight: 1, flexShrink: 0, padding: 2 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
