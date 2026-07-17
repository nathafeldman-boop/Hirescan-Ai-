'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { DuoQuiz } from '@/lib/duoQuizzes';
import { decodeDuoAnswers, encodeDuoAnswers, compareDuoAnswers, getDuoInsight } from '@/lib/duoQuizzes';
import Seal from '@/components/Seal';

interface Props {
  quiz: DuoQuiz;
}

type Phase = 'intro' | 'quiz' | 'results';

const LABEL = ['Jamais', 'Rarement', 'Souvent', 'Toujours'];

function AlignmentDot({ status }: { status: 'aligned' | 'close' | 'divergent' }) {
  const colors = {
    aligned: '#10b981',
    close: '#f59e0b',
    divergent: '#ef4444',
  };
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: colors[status] }}
    />
  );
}

export default function DuoCompareClient({ quiz }: Props) {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>('intro');
  const [partnerAnswers, setPartnerAnswers] = useState<number[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [showMidHook, setShowMidHook] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const aParam = searchParams.get('a');
    if (aParam) {
      const decoded = decodeDuoAnswers(aParam);
      setPartnerAnswers(decoded);
    }
  }, [searchParams]);

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
    const MID = Math.floor(quiz.questions.length / 2) - 1;

    setTimeout(() => {
      if (isLast) {
        setAnswers(newAnswers);
        setPhase('results');
        setTransitioning(false);
      } else if (currentIndex === MID) {
        setShowMidHook(true);
        setTimeout(() => {
          setShowMidHook(false);
          setAnswers(newAnswers);
          setCurrentIndex((prev) => prev + 1);
          setSelected(null);
          setTransitioning(false);
        }, 2200);
      } else {
        setAnswers(newAnswers);
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setTransitioning(false);
      }
    }, 300);
  }

  // Reveal results one by one
  useEffect(() => {
    if (phase !== 'results') return;
    if (revealedCount >= quiz.questions.length) return;
    const t = setTimeout(() => setRevealedCount((n) => n + 1), 120);
    return () => clearTimeout(t);
  }, [phase, revealedCount, quiz.questions.length]);

  /* ── INVALID LINK ── */
  if (!partnerAnswers || partnerAnswers.length !== quiz.questions.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--ink)' }}>
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-5">🔗</div>
          <h1 className="font-display text-2xl font-black text-white mb-3">Lien invalide ou incomplet</h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Ce lien ne contient pas les réponses de ton/ta partenaire. Demande-lui de
            refaire le quiz depuis le début.
          </p>
          <Link href="/duo" className="ur-btn-gold inline-flex items-center gap-2 px-5 py-3 text-sm">
            ← Aller au Mode Duo
          </Link>
        </div>
      </main>
    );
  }

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--ink)' }}>
        <div className="w-full max-w-md text-center">
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{ background: `${quiz.accentColor}20`, border: `1.5px solid ${quiz.accentColor}40` }}
          >
            {quiz.emoji}
          </div>
          <div className="ur-badge mb-4" style={{ border: '1px solid var(--line-ink)', background: 'var(--ink-soft)', color: 'var(--ink-text-muted)' }}>
            <span className="w-2 h-2 rounded-full mr-2 bg-green-400" />
            <span>Réponses de ton/ta partenaire reçues ✓</span>
          </div>
          <h1 className="font-display text-2xl font-black text-white mb-3 leading-tight">{quiz.title}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Réponds maintenant à ton tour. Dès que tu auras terminé,
            vous verrez vos réponses comparées question par question.
          </p>

          <button
            onClick={() => setPhase('quiz')}
            className="w-full py-4 rounded-xl font-black text-white text-base transition-all active:scale-[0.98] mb-4"
            style={{
              background: `linear-gradient(135deg, ${quiz.accentColor}cc, ${quiz.accentColor})`,
              boxShadow: `0 4px 24px ${quiz.accentColor}40`,
            }}
          >
            Je réponds à mon tour →
          </button>
          <Link href="/duo" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Mode Duo
          </Link>
        </div>
      </main>
    );
  }

  /* ── RESULTS ── */
  if (phase === 'results') {
    const comparison = compareDuoAnswers(partnerAnswers, answers);
    const agreementPct = Math.round((comparison.aligned / quiz.questions.length) * 100);
    const insight = getDuoInsight(quiz.slug, agreementPct);

    const insightColor =
      agreementPct >= 70 ? '#10b981' : agreementPct >= 40 ? '#f59e0b' : '#ef4444';
    const insightEmoji =
      agreementPct >= 70 ? '💚' : agreementPct >= 40 ? '🔶' : '🔴';

    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ink)' }}>
        {/* Mid-reveal hook */}
        {showMidHook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(21,18,31,0.96)' }}>
            <div className="text-center px-6">
              <div className="flex justify-center mb-5"><Seal size={56} spin /></div>
              <p className="text-white font-black text-2xl mb-2">L&apos;IA analyse vos réponses…</p>
              <p className="text-zinc-500 text-sm">Les divergences apparaissent</p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-20 border-b backdrop-blur-md" style={{ background: 'rgba(21,18,31,0.85)', borderColor: 'var(--line-ink)' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/duo" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Mode Duo
            </Link>
            <span className="text-sm font-medium text-zinc-300">{quiz.emoji} Résultats</span>
            <span className="w-16" />
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-md">

            {/* Score ring */}
            <div className="flex flex-col items-center mb-8">
              <svg width="160" height="160" viewBox="0 0 180 180" className="mb-4">
                <defs>
                  <linearGradient id="duoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={`${insightColor}80`} />
                    <stop offset="100%" stopColor={insightColor} />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                  cx="90" cy="90" r="72"
                  fill="none"
                  stroke="url(#duoGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 72}`}
                  strokeDashoffset={`${2 * Math.PI * 72 * (1 - agreementPct / 100)}`}
                  transform="rotate(-90 90 90)"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
                <text x="90" y="84" textAnchor="middle" fill="white" fontSize="28" fontWeight="900" fontFamily="Inter, sans-serif">
                  {agreementPct}%
                </text>
                <text x="90" y="104" textAnchor="middle" fill="#71717a" fontSize="11" fontFamily="Inter, sans-serif">
                  alignés
                </text>
              </svg>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: `${insightColor}18`, color: insightColor, border: `1px solid ${insightColor}40` }}
              >
                {insightEmoji} {insight}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: 'Identiques', value: comparison.aligned, color: '#10b981' },
                { label: 'Proches', value: comparison.close, color: '#f59e0b' },
                { label: 'Divergents', value: comparison.divergent, color: '#ef4444' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-2xl p-3 text-center"
                  style={{ background: `${color}12`, border: `1px solid ${color}30` }}
                >
                  <p className="text-2xl font-black" style={{ color }}>{value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Question-by-question */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                Comparaison question par question
              </p>
              <div className="space-y-3">
                {quiz.questions.map((q, i) => {
                  const pA = partnerAnswers[i];
                  const pB = answers[i];
                  const diff = Math.abs(pA - pB);
                  const status = diff === 0 ? 'aligned' : diff === 1 ? 'close' : 'divergent';
                  const isRevealed = i < revealedCount;

                  return (
                    <div
                      key={i}
                      className="ur-panel-ink p-4 transition-all duration-500"
                      style={{ opacity: isRevealed ? 1 : 0, transform: isRevealed ? 'translateY(0)' : 'translateY(8px)' }}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <AlignmentDot status={status} />
                        <p className="text-xs text-zinc-400 leading-relaxed">{q.text}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className="rounded-lg px-3 py-2 text-xs"
                          style={{ background: `${quiz.accentColor}15`, border: `1px solid ${quiz.accentColor}30` }}
                        >
                          <p className="text-zinc-500 text-[10px] mb-0.5 uppercase tracking-widest">Partenaire A</p>
                          <p className="text-white font-semibold leading-snug">{q.options[pA]}</p>
                        </div>
                        <div
                          className="rounded-lg px-3 py-2 text-xs"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <p className="text-zinc-500 text-[10px] mb-0.5 uppercase tracking-widest">Partenaire B</p>
                          <p className="text-white font-semibold leading-snug">{q.options[pB]}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-5 mb-6 text-center"
              style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}
            >
              <p className="text-white font-bold text-sm mb-1">Découvrez d&apos;autres vérités sur votre couple</p>
              <p className="text-zinc-500 text-xs mb-4">5 quiz duo disponibles · 100% anonyme</p>
              <Link href="/duo" className="ur-btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm">
                Voir tous les quiz duo →
              </Link>
              <div className="mt-3">
                <Link
                  href="/quizzes"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold text-zinc-300 hover:text-white transition-all"
                  style={{ borderColor: 'var(--line-ink)' }}
                >
                  🏠 Voir tous les quizzes
                </Link>
              </div>
            </div>

            <p className="text-center text-zinc-600 text-xs">
              🔒 Vos réponses individuelles restent privées
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ── QUIZ ── */
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ink)' }}>
      {showMidHook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(21,18,31,0.96)', backdropFilter: 'blur(4px)' }}>
          <div className="text-center px-6">
            <div className="text-5xl mb-5">🧠</div>
            <p className="text-white font-black text-2xl mb-2">L&apos;IA analyse tes réponses…</p>
            <p className="text-zinc-500 text-sm mb-6">La comparaison se prépare</p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: quiz.accentColor,
                    animation: 'bounce 0.8s ease-in-out infinite',
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <header
        className="sticky top-0 backdrop-blur-md border-b z-20"
        style={{ background: 'rgba(21,18,31,0.85)', borderColor: 'var(--line-ink)' }}
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

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ${
            transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="ur-panel-ink p-6 sm:p-8 mb-6">
            <div className="ur-label text-xs mb-4" style={{ color: 'var(--gold)' }}>
              Question {currentIndex + 1}
            </div>
            <p className="font-display text-xl sm:text-2xl font-semibold text-white leading-relaxed">{question.text}</p>
          </div>

          <div className="space-y-3 mb-8">
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left px-5 py-3.5 rounded-2xl border transition-all duration-150 text-sm font-semibold flex items-center gap-3"
                  style={isSelected
                    ? { borderColor: 'var(--gold)', backgroundColor: 'var(--gold-soft)', color: 'var(--gold)' }
                    : { borderColor: 'var(--line-ink)', backgroundColor: 'var(--ink-soft)', color: 'var(--ink-text)' }}
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200"
                    style={
                      isSelected
                        ? { borderColor: 'var(--gold)', backgroundColor: 'var(--gold)' }
                        : { borderColor: 'var(--line-ink)' }
                    }
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" style={{ color: 'var(--ink)' }} fill="currentColor" viewBox="0 0 20 20">
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
            {isLast ? 'Voir la comparaison →' : 'Question suivante →'}
          </button>
        </div>
      </div>
    </main>
  );
}
