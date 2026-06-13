'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SuiviData, SuiviJour, PHASE_LABELS } from '@/lib/suivi';

const PHASES: SuiviJour['phase'][] = ['moi', 'relations', 'projet'];

const PHASE_CONFIG = {
  moi:       { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.3)',  glow: 'rgba(124,58,237,0.2)'  },
  relations: { color: '#ec4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)', glow: 'rgba(236,72,153,0.2)' },
  projet:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', glow: 'rgba(16,185,129,0.2)' },
};

export default function SuiviClient({ suivi }: { suivi: SuiviData }) {
  const [phase, setPhase] = useState<SuiviJour['phase']>('moi');
  const [dayIndex, setDayIndex] = useState(0);

  const joursPhase = suivi.jours.filter(j => j.phase === phase);
  const jour = joursPhase[dayIndex] ?? joursPhase[0];
  const cfg = PHASE_CONFIG[phase];

  const completedDays = suivi.jours.filter(j => j.phase === phase).indexOf(jour) + 1;
  const progress = Math.round((completedDays / 5) * 100);

  const handlePhase = (p: SuiviJour['phase']) => { setPhase(p); setDayIndex(0); };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full blur-3xl opacity-[0.06]"
          style={{ background: cfg.color }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20" style={{ background: 'rgba(9,9,11,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Cecret</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">
              {suivi.emoji} {suivi.typeCode}
            </span>
            <Link href={`/types/${suivi.typeCode.toLowerCase()}`}
              className="text-xs text-zinc-500 hover:text-white transition-colors">
              ← Mon profil
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{suivi.emoji}</div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
            ✦ Programme Suivi 15 jours — Premium
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{suivi.typeCode} · {suivi.typeName}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">{suivi.intro}</p>
        </div>

        {/* Phase navigation */}
        <div className="flex gap-2 mb-6">
          {PHASES.map(p => {
            const c = PHASE_CONFIG[p];
            const active = p === phase;
            return (
              <button
                key={p}
                onClick={() => handlePhase(p)}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: active ? c.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? c.border : 'rgba(255,255,255,0.08)'}`,
                  color: active ? c.color : '#71717a',
                  boxShadow: active ? `0 0 20px ${c.glow}` : 'none',
                }}
              >
                {PHASE_LABELS[p]}
              </button>
            );
          })}
        </div>

        {/* Day dots */}
        <div className="flex items-center gap-2 mb-6 px-1">
          {joursPhase.map((j, i) => (
            <button
              key={j.jour}
              onClick={() => setDayIndex(i)}
              className="relative flex-1 h-2 rounded-full transition-all"
              style={{
                background: i === dayIndex ? cfg.color : i < dayIndex ? cfg.color + '60' : 'rgba(255,255,255,0.1)',
                boxShadow: i === dayIndex ? `0 0 12px ${cfg.color}` : 'none',
              }}
            >
              <span className="sr-only">Jour {j.jour}</span>
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
          <span>Jour {jour.jour}/15</span>
          <span style={{ color: cfg.color }}>{progress}% de la phase complétée</span>
        </div>

        {/* Day card */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${cfg.border}`, boxShadow: `0 0 40px ${cfg.glow}` }}>

          {/* Day header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {jour.jour}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: cfg.color }}>
                {PHASE_LABELS[phase]} · Jour {jour.jour}
              </p>
              <h2 className="text-lg font-black text-white leading-snug">{jour.titre}</h2>
            </div>
          </div>

          {/* Conseil */}
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">💡 Insight du jour</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{jour.conseil}</p>
          </div>

          {/* Exercice */}
          <div className="rounded-xl p-4" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: cfg.color }}>
              ✍️ Exercice du jour
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#e4e4e7' }}>{jour.exercice}</p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => {
              if (dayIndex > 0) { setDayIndex(dayIndex - 1); }
              else {
                const pi = PHASES.indexOf(phase);
                if (pi > 0) { handlePhase(PHASES[pi - 1]); setDayIndex(4); }
              }
            }}
            disabled={phase === 'moi' && dayIndex === 0}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa' }}>
            ← Précédent
          </button>
          <button
            onClick={() => {
              if (dayIndex < joursPhase.length - 1) { setDayIndex(dayIndex + 1); }
              else {
                const pi = PHASES.indexOf(phase);
                if (pi < PHASES.length - 1) { handlePhase(PHASES[pi + 1]); }
              }
            }}
            disabled={phase === 'projet' && dayIndex === joursPhase.length - 1}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-30"
            style={{ background: `linear-gradient(135deg,${cfg.color},${cfg.color}dd)`, boxShadow: `0 4px 20px ${cfg.glow}`, color: 'white' }}>
            Suivant →
          </button>
        </div>

        {/* All days overview */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest">Tous les jours</p>
          <div className="space-y-1">
            {suivi.jours.map((j, i) => {
              const c = PHASE_CONFIG[j.phase];
              const isCurrentPhase = j.phase === phase;
              const idx = suivi.jours.filter(x => x.phase === j.phase).indexOf(j);
              const isCurrent = isCurrentPhase && idx === dayIndex;
              return (
                <button
                  key={j.jour}
                  onClick={() => { handlePhase(j.phase); setDayIndex(suivi.jours.filter(x => x.phase === j.phase).indexOf(j)); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all"
                  style={{
                    background: isCurrent ? c.bg : 'transparent',
                    border: `1px solid ${isCurrent ? c.border : 'transparent'}`,
                  }}>
                  <span className="text-[11px] font-black w-8 flex-shrink-0" style={{ color: isCurrent ? c.color : '#52525b' }}>
                    J{j.jour}
                  </span>
                  <span className="text-[11px] flex-1 truncate" style={{ color: isCurrent ? '#e4e4e7' : '#71717a' }}>
                    {j.titre}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: c.bg, color: c.color }}>
                    {j.phase}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href={`/types/${suivi.typeCode.toLowerCase()}`}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Retour à mon profil {suivi.typeCode}
          </Link>
        </div>
      </div>
    </main>
  );
}
