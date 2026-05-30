'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Props {
  onComplete: () => void;
}

// Each "scene" is a full-screen moment
type Scene = 0 | 1 | 2 | 3 | 4 | 5;

export default function IntroAnimation({ onComplete }: Props) {
  const [scene, setScene] = useState<Scene>(0);
  const [lineA, setLineA] = useState(false);
  const [lineB, setLineB] = useState(false);
  const [items, setItems] = useState<boolean[]>([false, false, false]);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function t(fn: () => void, ms: number) {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }

  useEffect(() => {
    // Scene 0 → logo alone (0–900ms)
    t(() => setScene(1), 900);

    // Scene 1 → "#1 APP" builds (900ms)
    t(() => setLineA(true), 1050);
    t(() => setLineB(true), 1600);
    t(() => setScene(2), 2800);

    // Scene 2 → press logos (2800ms)
    t(() => setScene(3), 4800);

    // Scene 3 → feature bullets appear one by one
    t(() => setItems([true, false, false]), 5100);
    t(() => setItems([true, true, false]), 5700);
    t(() => setItems([true, true, true]), 6300);
    t(() => setScene(4), 7800);

    // Scene 4 → quiz mockup
    t(() => setScene(5), 10000);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  function skip() {
    timers.current.forEach(clearTimeout);
    setExiting(true);
    setTimeout(onComplete, 400);
  }

  const PRESS = ['Le Monde', 'Cosmopolitan', 'Brut.', 'Konbini', 'L\'Obs'];

  const BULLETS = [
    { emoji: '💔', text: 'Infidélité détectée en 3 min' },
    { emoji: '🧠', text: 'IA sans filtre, sans jugement' },
    { emoji: '🔒', text: '100% anonyme, zéro compte requis' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
      onClick={scene < 5 ? skip : undefined}
    >
      {/* Skip button */}
      {scene < 5 && (
        <button
          className="absolute top-12 right-6 text-xs text-white/30 hover:text-white/60 transition-colors z-50 tracking-widest uppercase"
          onClick={skip}
        >
          Passer →
        </button>
      )}

      {/* ─── SCENE 0 + 1: Logo + Big headline ─── */}
      <div
        className="absolute inset-0 flex flex-col items-start justify-center px-8"
        style={{
          opacity: scene <= 1 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: scene <= 1 ? 'auto' : 'none',
        }}
      >
        {/* Logo mark */}
        <div
          className="mb-10"
          style={{
            opacity: 1,
            transform: scene === 1 ? 'translateY(-20px) scale(0.7)' : 'translateY(0) scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.34,1.3,0.64,1)',
          }}
        >
          <span
            className="text-2xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            UrSecret
          </span>
        </div>

        {/* Line A */}
        <div
          style={{
            opacity: lineA ? 1 : 0,
            transform: lineA ? 'translateY(0)' : 'translateY(60px)',
            transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <span
            className="block font-black leading-none"
            style={{
              fontSize: 'clamp(64px, 18vw, 96px)',
              background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 60%, #fb7185 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}
          >
            #1 APP
          </span>
        </div>

        {/* Line B */}
        <div
          style={{
            opacity: lineB ? 1 : 0,
            transform: lineB ? 'translateY(0)' : 'translateY(60px)',
            transition: 'opacity 0.55s ease 0.05s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s',
          }}
        >
          <span
            className="block font-black leading-none text-white"
            style={{
              fontSize: 'clamp(64px, 18vw, 96px)',
              letterSpacing: '-0.03em',
              opacity: 0.9,
            }}
          >
            DE VÉRITÉ.
          </span>
        </div>
      </div>

      {/* ─── SCENE 2: Press ─── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
        style={{
          opacity: scene === 2 ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: scene === 2 ? 'auto' : 'none',
        }}
      >
        <p
          className="text-white/40 text-sm tracking-[0.25em] uppercase mb-10"
          style={{
            opacity: scene === 2 ? 1 : 0,
            transform: scene === 2 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s ease 0.1s',
          }}
        >
          — Vu dans la presse —
        </p>
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          {PRESS.map((name, i) => (
            <span
              key={name}
              className="text-white font-bold text-xl tracking-tight"
              style={{
                opacity: scene === 2 ? 1 : 0,
                transform: scene === 2 ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.45s ease ${0.15 + i * 0.1}s, transform 0.45s ease ${0.15 + i * 0.1}s`,
              }}
            >
              {name}
            </span>
          ))}
          <span
            className="text-white/30 text-sm mt-2"
            style={{
              opacity: scene === 2 ? 1 : 0,
              transition: 'opacity 0.4s ease 0.7s',
            }}
          >
            et bien d&apos;autres...
          </span>
        </div>
      </div>

      {/* ─── SCENE 3: Features ─── */}
      <div
        className="absolute inset-0 flex flex-col items-start justify-center px-8"
        style={{
          opacity: scene === 3 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: scene === 3 ? 'auto' : 'none',
        }}
      >
        <p className="text-white/40 text-sm tracking-widest uppercase mb-8">
          Pourquoi UrSecret ?
        </p>
        <div className="flex flex-col gap-7">
          {BULLETS.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-4"
              style={{
                opacity: items[i] ? 1 : 0,
                transform: items[i] ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <span className="text-3xl flex-shrink-0 mt-0.5">{b.emoji}</span>
              <span
                className="font-black text-white leading-tight"
                style={{ fontSize: 'clamp(22px, 6vw, 30px)' }}
              >
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SCENE 4: Quiz mockup ─── */}
      <div
        className="absolute inset-0 flex flex-col bg-black"
        style={{
          opacity: scene === 4 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: scene === 4 ? 'auto' : 'none',
        }}
      >
        <div className="px-8 pt-16 pb-6">
          <p
            className="font-black text-white leading-tight mb-8"
            style={{ fontSize: 'clamp(32px, 9vw, 48px)' }}
          >
            Obtiens ta<br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              réponse définitive
            </span>
          </p>
        </div>

        {/* Mockup card */}
        <div className="mx-6 rounded-3xl overflow-hidden border border-white/10"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
          <div className="p-5 border-b border-white/8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">💔</span>
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Infidélité · Q.12/30</span>
            </div>
            <p className="text-white font-bold text-base leading-snug mt-3">
              Ton/ta partenaire consulte-t-il/elle son téléphone différemment en ta présence ?
            </p>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[
              'Non, aucun comportement inhabituel',
              'Parfois, mais ça me semblait anodin',
              'Oui, et ça m\'a mis mal à l\'aise',
              'Il/Elle cache activement son écran',
            ].map((opt, i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: i === 2
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))'
                    : 'rgba(255,255,255,0.05)',
                  color: i === 2 ? '#e2e8f0' : 'rgba(255,255,255,0.45)',
                  border: i === 2 ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        {/* Instant answers teaser */}
        <div className="mx-6 mt-4">
          <p className="text-white/30 text-xs text-center tracking-wide">
            👇 Résultats instantanés · IA sans filtre
          </p>
        </div>
      </div>

      {/* ─── SCENE 5: Final CTA ─── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
        style={{
          opacity: scene === 5 ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: scene === 5 ? 'auto' : 'none',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.2) 0%, transparent 60%)',
        }}
      >
        <p
          className="font-black text-white text-center leading-tight mb-3"
          style={{ fontSize: 'clamp(40px, 11vw, 60px)', letterSpacing: '-0.03em' }}
        >
          Prêt(e) pour<br />
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            la vérité ?
          </span>
        </p>
        <p className="text-white/40 text-sm text-center mb-12 tracking-wide">
          2 minutes · 30 questions · 1 réponse définitive
        </p>

        <Link
          href="/onboarding"
          className="w-full max-w-xs py-5 rounded-2xl font-black text-white text-center text-lg transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            boxShadow: '0 10px 50px rgba(139,92,246,0.5)',
          }}
          onClick={onComplete}
        >
          Découvrir mes vérités →
        </Link>

        <button
          onClick={onComplete}
          className="mt-5 text-white/25 text-sm hover:text-white/50 transition-colors"
        >
          Passer →
        </button>
      </div>
    </div>
  );
}
