'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: Props) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // phase 0 → title flies in (0ms)
    timerRef.current = setTimeout(() => setPhase(1), 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase === 1) timerRef.current = setTimeout(() => setPhase(2), 800);
    if (phase === 2) timerRef.current = setTimeout(() => setPhase(3), 900);
    if (phase === 3) timerRef.current = setTimeout(() => onComplete(), 700);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          animation: 'pulse-orb 1.5s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
          top: '30%',
          left: '60%',
          animation: 'float-right 2s ease-in-out infinite alternate',
        }}
      />

      {/* 3D lock icon */}
      <div
        className="mb-8 relative"
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: `perspective(600px) rotateY(${phase === 0 ? -40 : 0}deg) rotateX(${phase >= 1 ? -5 : 0}deg) scale(${phase >= 2 ? 1.1 : 1})`,
          transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
          filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.6))',
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <rect x="12" y="36" width="56" height="38" rx="8" fill="url(#lockGrad)" opacity="0.95" />
          <path d="M24 36V26C24 16.06 55.94 16.06 56 26V36" stroke="url(#lockGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="40" cy="54" r="5" fill="white" opacity="0.9" />
          <rect x="38" y="54" width="4" height="8" rx="2" fill="white" opacity="0.7" />
        </svg>
      </div>

      {/* Main title */}
      <div
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: `perspective(600px) translateY(${phase === 0 ? 30 : 0}px) rotateX(${phase === 0 ? 15 : 0}deg)`,
          transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
        }}
      >
        <h1 className="text-6xl font-black tracking-tight text-center mb-3">
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Ur
          </span>
          <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Secret
          </span>
        </h1>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: `translateY(${phase >= 1 ? 0 : 12}px)`,
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}
      >
        <p className="text-zinc-400 text-lg text-center font-medium tracking-wide">
          Tes vraies réponses. Rien que la vérité.
        </p>
      </div>

      {/* Pills */}
      <div
        className="flex items-center gap-3 mt-6"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: `translateY(${phase >= 2 ? 0 : 10}px)`,
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {['100% Anonyme', 'Résultats précis', 'Gratuit'].map((label) => (
          <span
            key={label}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border"
            style={{
              color: '#a78bfa',
              borderColor: 'rgba(139,92,246,0.3)',
              backgroundColor: 'rgba(139,92,246,0.08)',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Loading bar */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-white/10 rounded-full overflow-hidden"
        style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            width: phase === 1 ? '40%' : phase === 2 ? '80%' : '100%',
            transition: 'width 0.7s ease',
          }}
        />
      </div>

      <style>{`
        @keyframes pulse-orb {
          from { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
          to   { opacity: 1;   transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes float-right {
          from { transform: translate(0, 0); }
          to   { transform: translate(20px, -20px); }
        }
      `}</style>
    </div>
  );
}
