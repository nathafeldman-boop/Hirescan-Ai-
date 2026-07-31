'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface LevelNode {
  index: number;
  title: string;
  emoji: string;
  completed: boolean;
  playable: boolean;
  subscriptionLocked: boolean;
  sequenceLocked: boolean;
}

// Milestone visuel tous les 5 niveaux (coffre) — purement décoratif, aucune
// mécanique différente derrière (même complétion, même XP) : juste un repère
// visuel qui marque qu'on a passé une étape importante du chemin.
function isMilestone(index: number) {
  return (index + 1) % 5 === 0;
}

export default function PathMapClient({
  pathKey, title, tagline, totalLevels, doneCount, levels,
}: {
  pathKey: string;
  title: string;
  tagline: string;
  totalLevels: number;
  doneCount: number;
  levels: LevelNode[];
}) {
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  const pct = totalLevels > 0 ? Math.round((doneCount / totalLevels) * 100) : 0;

  return (
    <main className="min-h-screen px-5 py-8 pb-28" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <style>{`@keyframes pathPulse{0%,100%{box-shadow:0 0 0 0 var(--gold-soft)}50%{box-shadow:0 0 0 10px transparent}}`}</style>

      <div className="max-w-sm mx-auto">
        <Link href="/parcours" className="text-xs inline-flex items-center gap-1.5 mb-6" style={{ color: '#a8a29e' }}>
          <span>←</span> Tous les parcours
        </Link>

        <div className="text-center mb-6">
          <h1 className="font-display text-xl font-black mb-1.5">{title}</h1>
          <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: '#78716c' }}>{tagline}</p>
        </div>

        <div className="rounded-2xl px-5 py-3.5 mb-8" style={{ background: 'var(--ink)', border: '1px solid var(--gold-line)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-bold" style={{ color: 'var(--ink-text)' }}>{doneCount}/{totalLevels} niveaux</p>
            <p className="text-[12px]" style={{ color: 'var(--ink-text-muted)' }}>{pct}%</p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--gold)' }} />
          </div>
        </div>

        <div className="relative pb-4">
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2" style={{ background: 'var(--line)' }} />
          <div className="flex flex-col items-center gap-9 relative">
            {levels.map((l, i) => {
              const offset = i % 4 === 1 ? 40 : i % 4 === 3 ? -40 : 0;
              const isCurrent = l.playable;
              const href = l.completed || l.playable
                ? `/parcours/${pathKey}/niveau/${l.index}`
                : l.subscriptionLocked
                  ? '/pricing'
                  : null;

              return (
                <div
                  key={l.index}
                  ref={isCurrent ? currentRef : undefined}
                  className="relative z-10"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  {href ? (
                    <Link href={href} className="elio-hover-lift block">
                      <NodeInner node={l} />
                    </Link>
                  ) : (
                    <div className="cursor-not-allowed">
                      <NodeInner node={l} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function NodeInner({ node }: { node: LevelNode }) {
  const milestone = isMilestone(node.index);
  const size = milestone ? 76 : 60;

  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: milestone ? 30 : 24,
  };

  if (node.completed) {
    Object.assign(style, { background: 'var(--gold)', border: '3px solid var(--gold)', boxShadow: '0 4px 14px rgba(201,162,39,0.35)' });
  } else if (node.playable) {
    Object.assign(style, { background: 'var(--ink)', border: '3px solid var(--gold)', animation: 'pathPulse 2.2s ease-in-out infinite' });
  } else if (node.subscriptionLocked) {
    Object.assign(style, { background: 'var(--paper-panel)', border: '2px dashed var(--gold-line)' });
  } else {
    Object.assign(style, { background: 'var(--paper-panel)', border: '2px solid var(--line)', opacity: 0.55 });
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="rounded-full flex items-center justify-center flex-shrink-0" style={style}>
        {node.completed ? '✓' : node.subscriptionLocked || node.sequenceLocked ? '🔒' : milestone ? '🎁' : node.emoji}
      </div>
      <p
        className="text-[11px] font-bold text-center max-w-[92px] leading-tight"
        style={{ color: node.playable || node.completed ? 'var(--ink)' : '#a8a29e' }}
      >
        {node.title}
      </p>
    </div>
  );
}
