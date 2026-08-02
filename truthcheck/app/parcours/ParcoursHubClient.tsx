'use client';

import Link from 'next/link';
import ElioAvatar from '@/components/ElioAvatar';
import { goalPhrase } from '@/lib/onboardingGoalCopy';

interface GoalEntry {
  goal: string;
  available: boolean;
  key?: string;
  title?: string;
  tagline?: string;
  emoji?: string;
  totalLevels?: number;
  doneCount?: number;
  locked?: boolean;
}

function GoalCard({ entry, isOwnGoal, committedPathTitle }: { entry: GoalEntry; isOwnGoal: boolean; committedPathTitle: string | null }) {
  if (!entry.available) {
    return (
      <div
        className="flex items-start gap-3.5 rounded-2xl px-4 py-3.5 opacity-60"
        style={{ background: 'var(--paper)', border: '1px dashed var(--line)' }}
      >
        <span className="text-2xl flex-shrink-0">🔒</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{entry.goal}</p>
          <p className="text-[11.5px] mt-0.5" style={{ color: '#a8a29e' }}>Bientôt disponible</p>
        </div>
      </div>
    );
  }

  if (entry.locked) {
    return (
      <Link
        href="/pricing"
        className="elio-hover-lift flex items-start gap-3.5 rounded-2xl px-4 py-3.5"
        style={{ background: 'var(--paper)', border: '1px dashed var(--gold-line)' }}
      >
        <span className="text-2xl flex-shrink-0 opacity-70">🔒</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{entry.title}</p>
          <p className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: '#a8a29e' }}>
            {committedPathTitle ? `Tu avances déjà sur « ${committedPathTitle} » — passe à l'abonnement pour débloquer celui-ci aussi` : "Passe à l'abonnement pour débloquer"}
          </p>
        </div>
      </Link>
    );
  }

  const pct = entry.totalLevels ? Math.round(((entry.doneCount ?? 0) / entry.totalLevels) * 100) : 0;
  const started = (entry.doneCount ?? 0) > 0;

  return (
    <Link
      href={`/parcours/${entry.key}`}
      className="elio-hover-lift block rounded-2xl px-4 py-3.5"
      style={{
        background: isOwnGoal ? 'var(--ink)' : 'var(--paper-panel)',
        border: `1px solid ${isOwnGoal ? 'var(--gold-line)' : 'var(--line)'}`,
      }}
    >
      <div className="flex items-start gap-3.5">
        <span className="text-2xl flex-shrink-0">{entry.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: isOwnGoal ? 'var(--ink-text)' : 'var(--ink)' }}>{entry.title}</p>
          <p className="text-[12px] mt-0.5" style={{ color: isOwnGoal ? 'var(--ink-text-muted)' : '#8a7d5c', lineHeight: 1.4 }}>{entry.tagline}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isOwnGoal ? 'rgba(255,255,255,0.12)' : 'var(--line)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--gold)' }} />
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: isOwnGoal ? 'var(--ink-text-faint)' : '#a8a29e' }}>
          {started ? `${entry.doneCount}/${entry.totalLevels} niveaux` : 'Pas encore commencé'}
        </p>
      </div>
    </Link>
  );
}

export default function ParcoursHubClient({
  firstName, onboardingGoal, goals, committedPathTitle,
}: {
  firstName: string | null;
  onboardingGoal: string | null;
  goals: GoalEntry[];
  committedPathTitle: string | null;
}) {
  const ownGoal = goals.find((g) => g.goal === onboardingGoal);
  const otherGoals = goals.filter((g) => g.goal !== onboardingGoal);
  const phrase = goalPhrase(onboardingGoal);

  return (
    <main className="min-h-screen px-5 py-8 pb-28" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="max-w-sm mx-auto">
        <Link href="/decouverte" className="text-xs inline-flex items-center gap-1.5 mb-6" style={{ color: '#a8a29e' }}>
          <span>←</span> Retour au hub
        </Link>

        <div className="flex flex-col items-center text-center mb-7">
          <ElioAvatar size={56} glow />
          <p className="ur-label text-[10px] mt-4 mb-2" style={{ color: 'var(--gold)' }}>Ton Parcours</p>
          <h1 className="font-display text-2xl font-black mb-2">
            {phrase
              ? (firstName ? `${firstName}, ton parcours pour ${phrase}` : `Ton parcours pour ${phrase}`)
              : (firstName ? `${firstName}, avance à ton rythme` : 'Avance à ton rythme')}
          </h1>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
            Une carte de niveaux, pensée pour ça — chaque étape te rapproche un peu plus de ton objectif.
          </p>
        </div>

        {ownGoal && (
          <div className="mb-7">
            <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>Ton objectif</p>
            <GoalCard entry={ownGoal} isOwnGoal committedPathTitle={committedPathTitle} />
          </div>
        )}

        {otherGoals.length > 0 && (
          <div>
            <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>Les autres parcours</p>
            <div className="flex flex-col gap-2">
              {otherGoals.map((g) => <GoalCard key={g.goal} entry={g} isOwnGoal={false} committedPathTitle={committedPathTitle} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
