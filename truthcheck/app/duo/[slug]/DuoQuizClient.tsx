'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DuoQuiz } from '@/lib/duoQuizzes';
import { encodeDuoAnswers } from '@/lib/duoQuizzes';

interface Props {
  quiz: DuoQuiz;
}

type Phase = 'intro' | 'quiz' | 'share';

export default function DuoQuizClient({ quiz }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const question = quiz.questions[currentIndex];
  const progress = (currentIndex / quiz.questions.length) * 100;
  const isLast = currentIndex === quiz.questions.length - 1;

  function handleSelect(i: number) {
    if (transitioning) return;
    setSelected(i);
  }

  function handleNext() {
    if (selected === null || transitioning) return;
    setTransitioning(true);
    const newAnswers = [...answers, selected];

    setTimeout(() => {
      if (isLast) {
        const encoded = encodeDuoAnswers(newAnswers);
        const link = `${window.location.origin}/duo/${quiz.slug}/compare?a=${encoded}`;
        setShareLink(link);
        setPhase('share');
        setTransitioning(false);
      } else {
        setAnswers(newAnswers);
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setTransitioning(false);
      }
    }, 300);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  function shareNative() {
    if (navigator.share) {
      void navigator.share({
        title: `UrSecret · ${quiz.title}`,
        text: 'Réponds à ce quiz et compare tes réponses avec les miennes 👀',
        url: shareLink,
      });
    } else {
      copyLink();
    }
  }

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#09090b' }}>
        <div className="w-full max-w-md text-center">
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{ background: `${quiz.accentColor}20`, border: `1.5px solid ${quiz.accentColor}40` }}
          >
            {quiz.emoji}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: quiz.accentColor }} />
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Mode Duo</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-3 leading-tight">{quiz.title}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">{quiz.description}</p>

          <div className="glass rounded-2xl p-4 mb-8 text-left space-y-3">
            {[
              'Tu réponds seul(e) — tes réponses restent cachées',
              'Tu envoies le lien à ton/ta partenaire',
              'Les comparaisons s\'affichent ensemble',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: `${quiz.accentColor}30`, color: quiz.accentColor }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-300">{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('quiz')}
            className="w-full py-4 rounded-xl font-black text-white text-base transition-all active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${quiz.accentColor}cc, ${quiz.accentColor})`,
              boxShadow: `0 4px 24px ${quiz.accentColor}40`,
            }}
          >
            Je commence mon quiz →
          </button>

          <Link href="/duo" className="block mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Retour au Mode Duo
          </Link>
        </div>
      </main>
    );
  }

  /* ── SHARE ── */
  if (phase === 'share') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#09090b' }}>
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-5">🔗</div>
          <h2 className="text-2xl font-black text-white mb-2">Tes réponses sont prêtes !</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Envoie ce lien à ton/ta partenaire. Quand il/elle aura répondu,
            vous verrez vos réponses comparées ensemble.
          </p>

          {/* Link box */}
          <div
            className="rounded-2xl p-4 mb-4 border text-left"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${quiz.accentColor}40` }}
          >
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest font-semibold">Ton lien personnalisé</p>
            <p className="text-xs text-zinc-300 break-all font-mono leading-relaxed">{shareLink}</p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={shareNative}
              className="w-full py-4 rounded-xl font-black text-white text-base transition-all active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${quiz.accentColor}cc, ${quiz.accentColor})`,
                boxShadow: `0 4px 24px ${quiz.accentColor}40`,
              }}
            >
              📤 Partager avec mon/ma partenaire
            </button>
            <button
              onClick={copyLink}
              className="w-full py-3 rounded-xl font-semibold text-sm text-zinc-200 bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-all"
            >
              {copied ? '✅ Copié !' : '📋 Copier le lien'}
            </button>
          </div>

          <div
            className="rounded-2xl p-4 text-left"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-xs text-zinc-500 mb-1 font-semibold">⚠️ Note importante</p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tes réponses sont encodées dans le lien. Garde-le privé — ne le partage
              qu&apos;avec la personne concernée.
            </p>
          </div>

          <Link href="/duo" className="block mt-6 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Faire un autre quiz duo
          </Link>
        </div>
      </main>
    );
  }

  /* ── QUIZ ── */
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#09090b' }}>
      {/* Header */}
      <header
        className="sticky top-0 backdrop-blur-md border-b border-white/5 z-20"
        style={{ background: 'rgba(9,9,11,0.85)' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => { setPhase('intro'); setCurrentIndex(0); setAnswers([]); setSelected(null); }}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-zinc-300">{quiz.emoji} {quiz.title}</span>
          </div>
          <span className="text-sm text-zinc-500 tabular-nums">
            {currentIndex + 1}/{quiz.questions.length}
          </span>
        </div>
        <div className="h-1 bg-white/5">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${quiz.accentColor}88, ${quiz.accentColor})`,
            }}
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ${
            transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: quiz.accentColor }}>
              Question {currentIndex + 1}
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">{question.text}</p>
          </div>

          <div className="space-y-3 mb-8" style={{ '--quiz-accent': quiz.accentColor } as React.CSSProperties}>
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`quiz-opt${isSelected ? ' quiz-opt-selected' : ''}`}
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200"
                    style={
                      isSelected
                        ? { borderColor: quiz.accentColor, backgroundColor: quiz.accentColor }
                        : { borderColor: 'rgba(255,255,255,0.3)' }
                    }
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null || transitioning}
            className="w-full py-4 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={
              selected !== null
                ? {
                    background: `linear-gradient(135deg, ${quiz.accentColor}cc, ${quiz.accentColor})`,
                    boxShadow: `0 4px 24px ${quiz.accentColor}40`,
                  }
                : { background: 'rgba(255,255,255,0.05)', color: '#71717a' }
            }
          >
            {isLast ? 'Générer mon lien de partage →' : 'Question suivante →'}
          </button>
        </div>
      </div>
    </main>
  );
}
