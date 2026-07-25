'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppTabBar from '@/components/AppTabBar';
import { RELATION_TYPES, COMPAT_QUESTIONS, type RelationType } from '@/lib/friendCompatQuestions';

type Step = 'intro' | 'questions' | 'loading';

export default function CompatClient({ isPaid }: { isPaid: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [personName, setPersonName] = useState('');
  const [relationType, setRelationType] = useState<RelationType | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(COMPAT_QUESTIONS.length).fill(null));
  const [error, setError] = useState<string | null>(null);

  async function submit(finalAnswers: (number | null)[]) {
    setStep('loading');
    setError(null);
    try {
      const res = await fetch('/api/compat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personName,
          relationType,
          answers: COMPAT_QUESTIONS.map((q, i) => ({ questionId: q.id, choiceIndex: finalAnswers[i] })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) { setError('Cette fonctionnalité est réservée aux abonnés.'); }
        else if (res.status === 429) { setError('Tu as atteint ta limite de messages Nova pour aujourd\'hui.'); }
        else { setError('Nova n\'a pas réussi à générer le résultat. Réessaie dans un instant.'); }
        setStep('questions');
        return;
      }
      router.push(`/compat/${data.id}`);
    } catch {
      setError('Une erreur est survenue. Réessaie.');
      setStep('questions');
    }
  }

  function selectAnswer(choiceIndex: number) {
    const next = [...answers];
    next[currentQ] = choiceIndex;
    setAnswers(next);
    if (currentQ < COMPAT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 180);
    } else {
      setTimeout(() => void submit(next), 180);
    }
  }

  if (!isPaid) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-24" style={{ background: 'var(--paper)' }}>
        <div className="text-4xl mb-4">👥</div>
        <h1 className="font-display text-2xl font-black mb-2" style={{ color: 'var(--ink)' }}>Compatibilité avec un ami</h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
          Compare ton profil à celui d&apos;un ami, ton/ta partenaire ou un membre de ta famille — réservé aux abonnés Nova.
        </p>
        <Link href="/pricing" className="ur-btn-gold px-7 py-3.5 text-sm">
          Débloquer Nova →
        </Link>
        <Link href="/chat" className="mt-5 text-xs" style={{ color: '#a8a29e' }}>← Retour à Nova</Link>
        <AppTabBar />
      </main>
    );
  }

  if (step === 'loading') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--paper)' }}>
        <div className="w-10 h-10 rounded-full animate-spin mb-4" style={{ border: '3px solid var(--gold-line)', borderTopColor: 'var(--gold)' }} />
        <p className="text-sm" style={{ color: '#78716c' }}>Nova compare vos profils…</p>
      </main>
    );
  }

  if (step === 'questions') {
    const q = COMPAT_QUESTIONS[currentQ];
    return (
      <main className="min-h-screen flex flex-col pb-24" style={{ background: 'var(--paper)' }}>
        <div className="max-w-lg mx-auto w-full px-6 pt-8">
          <div className="flex items-center gap-1.5 mb-8">
            {COMPAT_QUESTIONS.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= currentQ ? 'var(--gold)' : 'var(--line)' }} />
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
            Question {currentQ + 1}/{COMPAT_QUESTIONS.length}
          </p>
          <h2 className="font-display text-xl font-black mb-6 leading-snug" style={{ color: 'var(--ink)' }}>{q.text}</h2>

          <div className="flex flex-col gap-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className="text-left px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98]"
                style={{
                  background: answers[currentQ] === i ? 'var(--gold-soft)' : 'var(--paper-panel)',
                  border: `1px solid ${answers[currentQ] === i ? 'var(--gold-line)' : 'var(--line)'}`,
                  color: 'var(--ink)',
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-center mt-5" style={{ color: '#c2611f' }}>{error}</p>}
        </div>
      </main>
    );
  }

  // intro
  return (
    <main className="min-h-screen flex flex-col pb-24" style={{ background: 'var(--paper)' }}>
      <div className="max-w-lg mx-auto w-full px-6 pt-10 text-center">
        <div className="text-4xl mb-4">👥</div>
        <h1 className="font-display text-2xl font-black mb-2" style={{ color: 'var(--ink)' }}>Compatibilité</h1>
        <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: '#78716c' }}>
          Réponds à quelques questions sur cette personne — Nova compare vos profils et te dit ce qui vous rapproche.
        </p>

        <div className="text-left mb-6">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Son prénom</p>
          <input
            value={personName}
            onChange={(e) => setPersonName(e.target.value.slice(0, 60))}
            placeholder="Ex : Léa"
            className="w-full text-sm rounded-xl px-4 py-3 outline-none"
            style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          />
        </div>

        <div className="text-left mb-8">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Votre relation</p>
          <div className="grid grid-cols-3 gap-2">
            {RELATION_TYPES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRelationType(r.value)}
                className="flex flex-col items-center gap-1 py-3 rounded-2xl transition-all active:scale-95"
                style={{
                  background: relationType === r.value ? 'var(--gold-soft)' : 'var(--paper-panel)',
                  border: `1px solid ${relationType === r.value ? 'var(--gold-line)' : 'var(--line)'}`,
                }}
              >
                <span className="text-xl leading-none">{r.emoji}</span>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--ink)' }}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setCurrentQ(0); setStep('questions'); }}
          disabled={!personName.trim() || !relationType}
          className="ur-btn-gold w-full py-3.5 text-sm disabled:opacity-40"
        >
          Commencer →
        </button>
      </div>

      <AppTabBar />
    </main>
  );
}
