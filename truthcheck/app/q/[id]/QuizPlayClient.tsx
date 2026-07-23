'use client';

import { useState } from 'react';
import Link from 'next/link';
import Seal from '@/components/Seal';

interface Props {
  id: string;
  title: string;
  intro: string;
  disclaimer: string;
  questions: { text: string; options: string[] }[];
}

type Result = { title: string; description: string; disclaimer: string; creatorInviteId: string };

export default function QuizPlayClient({ id, title, intro, disclaimer, questions }: Props) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [shared, setShared] = useState(false);

  const submit = async (finalAnswers: number[]) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/quiz-builder/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) { setError('Oups, ce test a un souci. Réessaie dans un instant.'); setSubmitting(false); return; }
      setResult(data);
    } catch {
      setError('Erreur réseau. Réessaie.');
    } finally {
      setSubmitting(false);
    }
  };

  const choose = (optionIndex: number) => {
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (current + 1 >= questions.length) {
      void submit(next);
    } else {
      setCurrent(current + 1);
    }
  };

  const shareQuiz = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${title} — fais ce test 👀`;
    try {
      if (navigator.share) { await navigator.share({ title, text, url }); return; }
    } catch { /* partage annulé */ }
    try { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 2500); } catch {}
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10" style={{ background: 'var(--paper)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-2">
          <Link href="/" className="text-lg font-display italic" style={{ color: 'var(--ink)' }}>
            <span style={{ color: 'var(--gold)' }}>Ur</span>Cecret
          </Link>
        </div>

        {result ? (
          // ── Écran de résultat ──
          <div className="mt-8 text-center">
            <div className="flex justify-center mb-5"><Seal size={64} color="var(--gold)" spin /></div>
            <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>Ton résultat</p>
            <h1 className="font-display text-2xl font-black mb-3" style={{ color: 'var(--ink)' }}>{result.title}</h1>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: '#57534e' }}>{result.description}</p>
            <p className="text-[11px] mb-7 leading-relaxed" style={{ color: '#a8a29e' }}>{result.disclaimer}</p>

            <button
              onClick={shareQuiz}
              className="w-full py-3 rounded-full font-bold text-sm mb-3 transition-all active:scale-[0.98]"
              style={{ border: '1px solid var(--line)', color: 'var(--ink)', background: 'var(--paper-panel)' }}
            >
              {shared ? '✅ Lien copié !' : '📤 Partager ce test'}
            </button>

            <div className="rounded-2xl p-5 mt-2" style={{ background: 'var(--ink)' }}>
              <p className="font-display text-lg mb-1" style={{ color: '#FAF6EC' }}>Toi aussi, découvre TON vrai profil</p>
              <p className="text-xs mb-4" style={{ color: 'rgba(250,246,236,0.6)' }}>
                Le vrai test de personnalité UrCecret — gratuit, résultat en 3 minutes.
              </p>
              <Link
                href={`/quiz/personnalite?invite=${result.creatorInviteId}`}
                className="block w-full py-3.5 rounded-full font-bold text-sm text-center"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              >
                Faire mon test →
              </Link>
            </div>
          </div>
        ) : !started ? (
          // ── Écran d'intro ──
          <div className="mt-8 text-center">
            <div className="flex justify-center mb-5"><Seal size={56} color="var(--gold)" /></div>
            <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>Test créé sur UrCecret</p>
            <h1 className="font-display text-2xl font-black mb-3" style={{ color: 'var(--ink)' }}>{title}</h1>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: '#57534e' }}>{intro}</p>
            <button
              onClick={() => setStarted(true)}
              className="ur-btn-gold w-full py-3.5 text-sm"
            >
              Commencer →
            </button>
            <p className="text-[11px] mt-4 leading-relaxed" style={{ color: '#a8a29e' }}>{disclaimer}</p>
          </div>
        ) : (
          // ── Question courante ──
          <div className="mt-8">
            <div className="flex justify-between text-xs mb-2" style={{ color: '#a8a29e' }}>
              <span>Question {current + 1}/{questions.length}</span>
              <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden mb-8" style={{ background: 'var(--line)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%`, background: 'var(--gold)' }} />
            </div>
            <h2 className="font-display text-xl leading-snug mb-7 text-center" style={{ color: 'var(--ink)', fontWeight: 600 }}>
              {questions[current].text}
            </h2>
            <div className="flex flex-col gap-2.5">
              {questions[current].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={submitting}
                  className="w-full text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper-panel)', color: 'var(--ink)' }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {error && <p className="text-center text-xs mt-5" style={{ color: '#dc2626' }}>{error}</p>}
            {submitting && <p className="text-center text-xs mt-5" style={{ color: '#a8a29e' }}>Calcul du résultat…</p>}
          </div>
        )}
      </div>
    </main>
  );
}
