'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Quiz } from '@/lib/quizzes';

interface Props {
  quiz: Quiz;
}

export default function QuizClient({ quiz }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const question = quiz.questions[currentIndex];
  const progress = (currentIndex / quiz.questions.length) * 100;
  const isLast = currentIndex === quiz.questions.length - 1;

  function handleSelect(optionIndex: number) {
    if (transitioning) return;
    setSelected(optionIndex);
  }

  function handleNext() {
    if (selected === null || transitioning) return;
    setTransitioning(true);

    const score = question.options[selected].score;
    const newTotal = totalScore + score;

    setTimeout(() => {
      if (isLast) {
        const maxScore = quiz.questions.length * 3;
        const percentage = Math.round((newTotal / maxScore) * 100);
        router.push(`/quiz/${quiz.slug}/results?score=${percentage}`);
      } else {
        setTotalScore(newTotal);
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setTransitioning(false);
      }
    }, 350);
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/onboarding"
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
            {currentIndex + 1}/{quiz.questions.length}
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
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
              Question {currentIndex + 1}
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
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
