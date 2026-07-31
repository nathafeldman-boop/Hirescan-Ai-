'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ElioAvatar from '@/components/ElioAvatar';
import type { PathLevelDef } from '@/lib/paths';

interface Recall {
  title: string;
  answer: string;
}

interface CompleteResponse {
  ok?: boolean;
  alreadyDone?: boolean;
  xpEarned?: number;
  insight?: string | null;
  error?: string;
}

export default function LevelPlayerClient({
  pathKey, level, totalLevels, alreadyCompleted, existingAnswer, existingInsight, recall, energyExhausted, energyCap,
}: {
  pathKey: string;
  level: PathLevelDef;
  totalLevels: number;
  alreadyCompleted: boolean;
  existingAnswer: string | null;
  existingInsight: string | null;
  recall: Recall | null;
  energyExhausted: boolean;
  energyCap: number;
}) {
  const content = level.content;
  const [reflexionAnswer, setReflexionAnswer] = useState('');
  const [quizValue, setQuizValue] = useState<string | null>(null);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(content.type === 'gratitude' ? Array(content.count).fill('') : []);
  const [affirmationAnswer, setAffirmationAnswer] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [journalAnswers, setJournalAnswers] = useState<string[]>(content.type === 'journal_guide' ? Array(content.prompts.length).fill('') : []);
  const [thought, setThought] = useState('');
  const [reframe, setReframe] = useState('');
  const [sorted, setSorted] = useState<Record<number, 'A' | 'B'>>({});
  const [breathingDone, setBreathingDone] = useState(false);
  const [challengeConfirmed, setChallengeConfirmed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ xpEarned: number; insight: string | null } | null>(null);

  const canSubmit = useMemo(() => {
    switch (content.type) {
      case 'reflexion': return reflexionAnswer.trim().length >= content.minLength;
      case 'quiz_situation': return !!quizValue;
      case 'gratitude': return gratitudeItems.every((i) => i.trim().length > 0);
      case 'affirmation': return affirmationAnswer.trim().length >= 3;
      case 'reconnaissance_emotion': return selectedEmotions.length > 0;
      case 'journal_guide': return journalAnswers.every((a) => a.trim().length > 0);
      case 'cognitif': return thought.trim().length >= 3 && reframe.trim().length >= 3;
      case 'tri_pensees': return Object.keys(sorted).length === content.items.length;
      case 'respiration': return breathingDone;
      case 'defi_reel': return challengeConfirmed;
      default: return false;
    }
  }, [content, reflexionAnswer, quizValue, gratitudeItems, affirmationAnswer, selectedEmotions, journalAnswers, thought, reframe, sorted, breathingDone, challengeConfirmed]);

  async function submit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);

    let body: Record<string, unknown> = { levelIndex: level.index };
    switch (content.type) {
      case 'reflexion': body = { ...body, answer: reflexionAnswer }; break;
      case 'quiz_situation': body = { ...body, value: quizValue }; break;
      case 'gratitude': body = { ...body, items: gratitudeItems }; break;
      case 'affirmation': body = { ...body, answer: affirmationAnswer }; break;
      case 'reconnaissance_emotion': body = { ...body, selected: selectedEmotions }; break;
      case 'journal_guide': body = { ...body, answers: journalAnswers }; break;
      case 'cognitif': body = { ...body, thought, reframe }; break;
      default: break;
    }

    try {
      const res = await fetch(`/api/paths/${pathKey}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data: CompleteResponse = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.error === 'energy_exhausted') setError(`Tu as utilisé toute ton énergie du jour (${energyCap} niveaux). Reviens demain !`);
        else setError('Un souci est survenu, réessaie dans un instant.');
        return;
      }
      setResult({ xpEarned: data.xpEarned ?? level.xp, insight: data.insight ?? null });
    } catch {
      setError('Erreur réseau, réessaie.');
    } finally {
      setSubmitting(false);
    }
  }

  const nextHref = level.index + 1 < totalLevels ? `/parcours/${pathKey}/niveau/${level.index + 1}` : `/parcours/${pathKey}`;

  return (
    <main className="min-h-screen px-5 py-8 pb-28" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="max-w-sm mx-auto">
        <Link href={`/parcours/${pathKey}`} className="text-xs inline-flex items-center gap-1.5 mb-6" style={{ color: '#a8a29e' }}>
          <span>←</span> Retour à la carte
        </Link>

        <div className="flex flex-col items-center text-center mb-7">
          <span className="text-4xl mb-3">{level.emoji}</span>
          <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Niveau {level.index + 1}/{totalLevels}</p>
          <h1 className="font-display text-xl font-black">{level.title}</h1>
        </div>

        {recall && !alreadyCompleted && (
          <div className="rounded-2xl px-4 py-3.5 mb-5" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
            <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>Il y a un moment, tu avais écrit :</p>
            <p className="text-[13px] italic" style={{ color: 'var(--ink)' }}>&laquo; {recall.answer} &raquo;</p>
          </div>
        )}

        <div className="ur-panel rounded-2xl px-5 py-5 mb-5">
          {alreadyCompleted ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{exercisePromptFor(content)}</p>
              {existingAnswer && (
                <div className="rounded-xl px-4 py-3" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
                  <p className="text-[11px] font-bold mb-1" style={{ color: '#a8a29e' }}>Ta réponse</p>
                  <p className="text-[13px]" style={{ color: 'var(--ink)' }}>{existingAnswer}</p>
                </div>
              )}
              {existingInsight && (
                <div className="rounded-xl px-4 py-3" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
                  <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>Ce que ça révèle sur toi</p>
                  <p className="text-[13px]" style={{ color: 'var(--ink)' }}>{existingInsight}</p>
                </div>
              )}
            </div>
          ) : (
            <ExerciseForm
              content={content}
              reflexionAnswer={reflexionAnswer} setReflexionAnswer={setReflexionAnswer}
              quizValue={quizValue} setQuizValue={setQuizValue}
              gratitudeItems={gratitudeItems} setGratitudeItems={setGratitudeItems}
              affirmationAnswer={affirmationAnswer} setAffirmationAnswer={setAffirmationAnswer}
              selectedEmotions={selectedEmotions} setSelectedEmotions={setSelectedEmotions}
              journalAnswers={journalAnswers} setJournalAnswers={setJournalAnswers}
              thought={thought} setThought={setThought}
              reframe={reframe} setReframe={setReframe}
              sorted={sorted} setSorted={setSorted}
              onBreathingDone={() => setBreathingDone(true)}
              challengeConfirmed={challengeConfirmed} setChallengeConfirmed={setChallengeConfirmed}
            />
          )}
        </div>

        {!alreadyCompleted && (
          <>
            {error && <p className="text-[12px] text-center mb-3" style={{ color: '#dc2626' }}>{error}</p>}
            {energyExhausted ? (
              <p className="text-[12px] text-center" style={{ color: '#a8a29e' }}>Tu as utilisé toute ton énergie du jour ({energyCap} niveaux). Reviens demain !</p>
            ) : (
              <button onClick={submit} disabled={!canSubmit || submitting} className="ur-btn-gold w-full py-3.5 text-sm disabled:opacity-40">
                {submitting ? 'Un instant…' : 'Valider ce niveau →'}
              </button>
            )}
          </>
        )}

        {alreadyCompleted && (
          <Link href={nextHref} className="ur-btn-gold w-full py-3.5 text-sm block text-center">
            {level.index + 1 < totalLevels ? 'Niveau suivant →' : 'Retour à la carte'}
          </Link>
        )}
      </div>

      {result && (
        <VictoryModal
          xpEarned={result.xpEarned}
          insight={result.insight}
          nextHref={nextHref}
          isLast={level.index + 1 >= totalLevels}
        />
      )}
    </main>
  );
}

function exercisePromptFor(content: PathLevelDef['content']): string {
  switch (content.type) {
    case 'reflexion': return content.question;
    case 'quiz_situation': return content.scenario;
    case 'gratitude': return content.instruction;
    case 'affirmation': return content.instruction;
    case 'reconnaissance_emotion': return content.situation;
    case 'journal_guide': return content.prompts.join(' — ');
    case 'cognitif': return content.instruction;
    case 'tri_pensees': return content.instruction;
    case 'respiration': return content.instruction;
    case 'defi_reel': return content.challenge;
    default: return '';
  }
}

function ExerciseForm(props: {
  content: PathLevelDef['content'];
  reflexionAnswer: string; setReflexionAnswer: (v: string) => void;
  quizValue: string | null; setQuizValue: (v: string) => void;
  gratitudeItems: string[]; setGratitudeItems: (v: string[]) => void;
  affirmationAnswer: string; setAffirmationAnswer: (v: string) => void;
  selectedEmotions: string[]; setSelectedEmotions: (v: string[]) => void;
  journalAnswers: string[]; setJournalAnswers: (v: string[]) => void;
  thought: string; setThought: (v: string) => void;
  reframe: string; setReframe: (v: string) => void;
  sorted: Record<number, 'A' | 'B'>; setSorted: (v: Record<number, 'A' | 'B'>) => void;
  onBreathingDone: () => void;
  challengeConfirmed: boolean; setChallengeConfirmed: (v: boolean) => void;
}) {
  const { content } = props;
  const inputStyle = { background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' };

  switch (content.type) {
    case 'reflexion':
      return (
        <div>
          <p className="text-sm mb-3 leading-relaxed">{content.question}</p>
          <textarea
            value={props.reflexionAnswer}
            onChange={(e) => props.setReflexionAnswer(e.target.value)}
            placeholder={content.placeholder}
            rows={4}
            className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      );

    case 'quiz_situation':
      return (
        <div>
          <p className="text-sm mb-3 leading-relaxed">{content.scenario}</p>
          <div className="flex flex-col gap-2">
            {content.options.map((o) => (
              <button
                key={o.value}
                onClick={() => props.setQuizValue(o.value)}
                className={`text-left text-sm rounded-xl px-4 py-3 transition-all ${props.quizValue === o.value ? 'quiz-opt-selected' : 'quiz-opt'}`}
                style={props.quizValue === o.value ? undefined : inputStyle}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      );

    case 'gratitude':
      return (
        <div>
          <p className="text-sm mb-3 leading-relaxed">{content.instruction}</p>
          <div className="flex flex-col gap-2">
            {props.gratitudeItems.map((v, i) => (
              <input
                key={i}
                value={v}
                onChange={(e) => { const next = [...props.gratitudeItems]; next[i] = e.target.value; props.setGratitudeItems(next); }}
                placeholder={content.placeholder}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            ))}
          </div>
        </div>
      );

    case 'affirmation':
      return (
        <div>
          <p className="text-sm mb-3 leading-relaxed">{content.instruction}</p>
          <p className="text-[13px] italic mb-3" style={{ color: '#8a7d5c' }}>{content.base}</p>
          <textarea
            value={props.affirmationAnswer}
            onChange={(e) => props.setAffirmationAnswer(e.target.value)}
            placeholder="Complète la phrase ici..."
            rows={3}
            className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      );

    case 'reconnaissance_emotion':
      return (
        <div>
          <p className="text-sm mb-3 leading-relaxed">{content.situation}</p>
          <div className="flex flex-wrap gap-2">
            {content.emotions.map((emo) => {
              const active = props.selectedEmotions.includes(emo);
              return (
                <button
                  key={emo}
                  onClick={() => {
                    if (active) props.setSelectedEmotions(props.selectedEmotions.filter((e) => e !== emo));
                    else props.setSelectedEmotions(content.multi ? [...props.selectedEmotions, emo] : [emo]);
                  }}
                  className="text-[13px] font-semibold rounded-full px-4 py-2 transition-all"
                  style={active ? { background: 'var(--gold)', color: 'var(--ink)' } : { background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                >
                  {emo}
                </button>
              );
            })}
          </div>
        </div>
      );

    case 'journal_guide':
      return (
        <div className="flex flex-col gap-4">
          {content.prompts.map((p, i) => (
            <div key={i}>
              <p className="text-sm mb-2 leading-relaxed">{p}</p>
              <textarea
                value={props.journalAnswers[i] ?? ''}
                onChange={(e) => { const next = [...props.journalAnswers]; next[i] = e.target.value; props.setJournalAnswers(next); }}
                rows={3}
                className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      );

    case 'cognitif':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed">{content.instruction}</p>
          <div>
            <p className="text-[11px] font-bold mb-1.5" style={{ color: '#a8a29e' }}>La pensée qui revient</p>
            <textarea value={props.thought} onChange={(e) => props.setThought(e.target.value)} placeholder={content.thoughtPlaceholder} rows={2} className="w-full rounded-xl px-3.5 py-3 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <p className="text-[11px] font-bold mb-1.5" style={{ color: '#a8a29e' }}>Reformulée, plus juste</p>
            <textarea value={props.reframe} onChange={(e) => props.setReframe(e.target.value)} placeholder={content.reframePlaceholder} rows={2} className="w-full rounded-xl px-3.5 py-3 text-sm outline-none" style={inputStyle} />
          </div>
        </div>
      );

    case 'tri_pensees':
      return (
        <div>
          <p className="text-sm mb-4 leading-relaxed">{content.instruction}</p>
          <div className="flex flex-col gap-2">
            {content.items.map((item, i) => {
              const assigned = props.sorted[i];
              return (
                <div key={i} className="rounded-xl px-3.5 py-3" style={inputStyle}>
                  <p className="text-[13px] mb-2">{item.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => props.setSorted({ ...props.sorted, [i]: 'A' })}
                      className="flex-1 text-[11.5px] font-bold rounded-full py-1.5"
                      style={assigned === 'A' ? { background: 'var(--gold)', color: 'var(--ink)' } : { background: 'var(--paper)', border: '1px solid var(--line)' }}
                    >
                      {content.categoryA}
                    </button>
                    <button
                      onClick={() => props.setSorted({ ...props.sorted, [i]: 'B' })}
                      className="flex-1 text-[11.5px] font-bold rounded-full py-1.5"
                      style={assigned === 'B' ? { background: 'var(--gold)', color: 'var(--ink)' } : { background: 'var(--paper)', border: '1px solid var(--line)' }}
                    >
                      {content.categoryB}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'respiration':
      return <RespirationInline content={content} onDone={props.onBreathingDone} />;

    case 'defi_reel':
      return (
        <div>
          <p className="text-sm mb-4 leading-relaxed">{content.challenge}</p>
          <button
            onClick={() => props.setChallengeConfirmed(!props.challengeConfirmed)}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3"
            style={props.challengeConfirmed ? { background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' } : inputStyle}
          >
            <span className="text-xl">{props.challengeConfirmed ? '✅' : '⬜'}</span>
            <span className="text-sm font-semibold">{content.confirmLabel}</span>
          </button>
        </div>
      );

    default:
      return null;
  }
}

function RespirationInline({ content, onDone }: { content: Extract<PathLevelDef['content'], { type: 'respiration' }>; onDone: () => void }) {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const durations = { inhale: content.inhaleSeconds, hold: content.holdSeconds, exhale: content.exhaleSeconds };
    const timer = setTimeout(() => {
      if (phase === 'inhale') setPhase('hold');
      else if (phase === 'hold') setPhase('exhale');
      else {
        if (cycle + 1 >= content.cycles) { setDone(true); onDone(); return; }
        setCycle((c) => c + 1);
        setPhase('inhale');
      }
    }, durations[phase] * 1000);
    return () => clearTimeout(timer);
  }, [phase, cycle, done, content, onDone]);

  const label = phase === 'inhale' ? 'Inspire' : phase === 'hold' ? 'Retiens' : 'Expire';
  const scale = phase === 'exhale' ? 0.85 : 1.3;
  const duration = phase === 'inhale' ? content.inhaleSeconds : phase === 'hold' ? content.holdSeconds : content.exhaleSeconds;

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <p className="text-sm mb-2 leading-relaxed text-center">{content.instruction}</p>
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 140, height: 140,
          background: 'var(--gold-soft)', border: '2px solid var(--gold-line)',
          transform: `scale(${scale})`, transition: `transform ${duration}s ease-in-out`,
        }}
      >
        <span className="font-display text-lg font-bold" style={{ color: 'var(--gold)' }}>{label}</span>
      </div>
      <p className="text-[12px]" style={{ color: '#a8a29e' }}>Cycle {Math.min(cycle + 1, content.cycles)}/{content.cycles}</p>
      {done && <p className="text-sm font-bold text-center" style={{ color: 'var(--ink)' }}>Voilà. Prêt(e) à continuer.</p>}
    </div>
  );
}

function VictoryModal({ xpEarned, insight, nextHref, isLast }: { xpEarned: number; insight: string | null; nextHref: string; isLast: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(21,18,31,0.6)', backdropFilter: 'blur(3px)' }}>
      <div className="w-full max-w-sm rounded-[28px] p-6 text-center" style={{ background: 'var(--paper)', border: '1px solid var(--gold-line)', animation: 'questCelebrateIn .4s cubic-bezier(.22,1,.36,1)' }}>
        <style>{`@keyframes questCelebrateIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
        <div className="flex justify-center mb-4"><ElioAvatar size={56} glow speaking /></div>
        <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Niveau terminé 🎉</p>
        <h2 className="font-display text-lg font-black mb-3" style={{ color: 'var(--ink)' }}>+{xpEarned} XP</h2>

        {insight && (
          <div className="rounded-2xl px-4 py-3.5 my-4 text-left" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
            <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>Ce que ça révèle sur toi</p>
            <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>{insight}</p>
          </div>
        )}

        <Link href={nextHref} className="ur-btn-gold w-full py-3 text-sm block text-center mt-2">
          {isLast ? 'Retour à la carte' : 'Niveau suivant →'}
        </Link>
      </div>
    </div>
  );
}
