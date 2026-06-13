'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Quiz, QuizSession } from '@/lib/quizzes';
import { selectQuestions } from '@/lib/quizzes';
import UrCecretAnimatedBg from '@/components/UrCecretAnimatedBg';
import QuizAtmosphereBg from '@/components/QuizAtmosphereBg';
import { track } from '@/lib/analytics';

interface Props {
  quiz: Quiz;
}

const QUIZ_SLIDES: Record<string, string[]> = {
  infidelite: [
    '/infidelite-bg-1.jpg',
    '/infidelite-bg-2.jpg',
    '/infidelite-bg-3.jpg',
    '/infidelite-bg-4.jpg',
    '/infidelite-bg-5.jpg',
  ],
  adopte: [
    '/adopte-bg-1.jpg',
    '/adopte-bg-2.jpg',
    '/adopte-bg-3.jpg',
    '/adopte-bg-4.jpg',
    '/adopte-bg-5.jpg',
  ],
  amoureux: [
    '/amoureux-bg-1.jpg',
    '/amoureux-bg-2.jpg',
    '/amoureux-bg-3.jpg',
    '/amoureux-bg-4.jpg',
    '/amoureux-bg-5.jpg',
  ],
  'vrais-amis': [
    '/vrais-amis-bg-1.jpg',
    '/vrais-amis-bg-2.jpg',
    '/vrais-amis-bg-3.jpg',
    '/vrais-amis-bg-4.jpg',
    '/vrais-amis-bg-5.jpg',
  ],
};

export default function QuizClient({ quiz }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showMidHook, setShowMidHook] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ursecret_session');
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const slides = QUIZ_SLIDES[quiz.slug] ?? null;

  useEffect(() => {
    if (!slides) return;
    setBgIndex(0);
    const id = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [quiz.slug, slides?.length]);

  const questions = useMemo(
    () => selectQuestions(quiz.questions, session),
    [quiz.questions, session]
  );

  const question = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(optionIndex: number) {
    if (transitioning) return;
    setSelected(optionIndex);
  }

  function handleNext() {
    if (selected === null || transitioning) return;
    setTransitioning(true);

    const score = question.options[selected].score;
    const newTotal = totalScore + score;

    const MID_HOOK_INDEX = Math.floor(questions.length / 2) - 1;

    setTimeout(() => {
      if (isLast) {
        const maxScore = questions.length * 3;
        const percentage = Math.round((newTotal / maxScore) * 100);
        setShowAnalysis(true);
        let prog = 0;
        const iv = setInterval(() => {
          prog += 1.2;
          setAnalysisProgress(Math.min(100, prog));
          if (prog >= 100) {
            clearInterval(iv);
            track('quiz_complete', { quiz: quiz.slug, content_name: quiz.title });
            setTimeout(() => router.push(`/quiz/${quiz.slug}/results?score=${percentage}`), 400);
          }
        }, 70);
      } else if (currentIndex === MID_HOOK_INDEX) {
        setShowMidHook(true);
        setTimeout(() => {
          setShowMidHook(false);
          setTotalScore(newTotal);
          setCurrentIndex((prev) => prev + 1);
          setSelected(null);
          setTransitioning(false);
        }, 2200);
      } else {
        setTotalScore(newTotal);
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setTransitioning(false);
      }
    }, 350);
  }

  if (!question) return null;

  const greeting = session.firstName ? `, ${session.firstName}` : '';

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#09090b' }}>

      {/* ── INTRO SCREEN — commitment + anticipation (Typeform/Noom style) ── */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: '#09090b' }}>
          <div className="w-full max-w-sm text-center">
            <div className="text-7xl mb-6 select-none">{quiz.emoji}</div>
            {session.firstName && (
              <p className="text-zinc-500 text-sm mb-2">Hey {session.firstName} 👋</p>
            )}
            <h1 className="text-white font-black text-2xl leading-snug mb-3">
              {quiz.title}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
              {quiz.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              {[
                { icon: '⚡', label: `${questions.length} questions` },
                { icon: '🔒', label: '100% anonyme' },
                { icon: '🧠', label: 'Analyse IA' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-lg">{icon}</span>
                  <span className="text-[11px] text-zinc-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { track('quiz_start', { quiz: quiz.slug, content_name: quiz.title }); setShowIntro(false); }}
              className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${quiz.accentColor}cc, ${quiz.accentColor})`, boxShadow: `0 6px 28px ${quiz.accentColor}55` }}
            >
              Commencer le quiz →
            </button>
            <p className="text-zinc-700 text-xs mt-4">Durée estimée : 2–3 min</p>
          </div>
        </div>
      )}

      {/* End-of-quiz analysis screen (Noom-style sunk cost + anticipation) */}
      {showAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#09090b' }}>
          <div className="text-center px-6 w-full max-w-sm">
            <div className="text-6xl mb-6" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>🧠</div>
            <h2 className="text-white font-black text-2xl mb-1">Analyse en cours…</h2>
            {session.firstName && (
              <p className="text-zinc-600 text-sm mb-6">Profil de {session.firstName}</p>
            )}
            <div className="text-left space-y-2 mb-7 max-w-xs mx-auto">
              {[
                { threshold: 0,  label: 'Lecture de tes réponses…' },
                { threshold: 28, label: 'Comparaison avec 50 000 profils…' },
                { threshold: 55, label: 'Identification des patterns…' },
                { threshold: 78, label: 'Génération de ton rapport…' },
                { threshold: 93, label: 'Finalisation…' },
              ].map(({ threshold, label }) => {
                const done = analysisProgress > threshold + 22;
                const active = analysisProgress >= threshold && !done;
                return (
                  <div key={label} className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${done ? 'text-zinc-400' : active ? 'text-white' : 'text-zinc-700'}`}>
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      {done ? '✓' : active ? <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ background: quiz.accentColor }} /> : '·'}
                    </span>
                    {label}
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${analysisProgress}%`,
                  background: `linear-gradient(90deg, ${quiz.accentColor}88, ${quiz.accentColor})`,
                  transition: 'width 0.07s linear',
                }}
              />
            </div>
            <p className="text-xs text-zinc-700 tabular-nums font-mono">{analysisProgress}%</p>
          </div>
        </div>
      )}

      {/* Mid-quiz AI analysis overlay */}
      {showMidHook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(4px)' }}>
          <div className="text-center px-6">
            <div className="text-5xl mb-5" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>🧠</div>
            <p className="text-white font-black text-2xl mb-2">L&apos;IA analyse tes réponses…</p>
            <p className="text-zinc-500 text-sm mb-6">Un profil commence à se dessiner</p>
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

      {/* Slideshow background (legacy slugs with images) */}
      {slides ? (
        <>
          {slides.map((src, i) => (
            <div
              key={src}
              className="fixed inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${src})`,
                opacity: i === bgIndex ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                zIndex: 0,
              }}
            />
          ))}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(9,9,11,0.7) 35%, rgba(9,9,11,0.88) 100%)',
              zIndex: 1,
            }}
          />
        </>
      ) : (
        /* Atmospheric theme background for new quizzes */
        <QuizAtmosphereBg slug={quiz.slug} />
      )}

      {/* Header */}
      <header
        className="sticky top-0 backdrop-blur-md border-b border-white/5"
        style={{
          background: slides ? 'rgba(9,9,11,0.55)' : 'rgba(9,9,11,0.8)',
          zIndex: 20,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/quizzes"
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>

          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-zinc-300">
              {quiz.emoji} {quiz.title}
            </span>
          </div>

          <span className="text-sm text-zinc-500 tabular-nums">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Progress bar */}
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" style={{ position: 'relative', zIndex: 10 }}>
        <div
          className={`w-full max-w-2xl transition-all duration-300 ${
            transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Question */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: quiz.accentColor }}
            >
              Question {currentIndex + 1}{greeting}
            </div>
            <p className="text-xl sm:text-2xl font-semibold leading-relaxed" style={{ color: '#1c1917' }}>
              {question.text}
            </p>
          </div>

          {/* Options */}
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
                  {option.text}
                </button>
              );
            })}
          </div>

          {/* Next button */}
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
            {isLast ? 'Voir mes résultats →' : 'Question suivante →'}
          </button>
        </div>
      </div>
    </main>
  );
}
