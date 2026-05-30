'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Quiz } from '@/lib/quizzes';
import { getResultTier } from '@/lib/quizzes';

interface Props {
  quiz: Quiz;
  score: number;
  date: string;
  shareId: string;
}

const CIRCUMFERENCE = 2 * Math.PI * 72;

export default function SharedDisplay({ quiz, score, date, shareId }: Props) {
  const tier = getResultTier(quiz, score);
  const [displayScore, setDisplayScore] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStrokeOffset(CIRCUMFERENCE * (1 - score / 100)), 200);

    let start: number | null = null;
    const duration = 1500;
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayScore(Math.floor(eased * score));
      if (p < 1) requestAnimationFrame(step);
    });

    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [score]);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${tier.glowColor}18 0%, transparent 60%)`,
        }}
      />

      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/onboarding" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>Secret
            </span>
          </Link>
          <span className="text-xs text-zinc-600">Résultat partagé · {date}</span>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Shared badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 text-xs text-zinc-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/8">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Résultat partagé
            </span>
          </div>

          <p className="text-center text-zinc-500 text-sm mb-8">{quiz.emoji} {quiz.title}</p>

          {/* Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <defs>
                  <linearGradient id="shareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={`${tier.glowColor}88`} />
                    <stop offset="100%" stopColor={tier.glowColor} />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  cx="90" cy="90" r="72" fill="none"
                  stroke="url(#shareGrad)" strokeWidth="10"
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
                  strokeLinecap="round" transform="rotate(-90 90 90)"
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tabular-nums" style={{ color: tier.glowColor }}>
                  {displayScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Tier */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
              style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
            >
              {tier.emoji} {tier.title}
            </span>
          </div>

          {/* Message */}
          <div className="glass rounded-2xl p-6 mb-8 text-center">
            <p className="text-zinc-300 leading-relaxed">{tier.message}</p>
          </div>

          {/* Score bar */}
          <div className="glass rounded-xl p-4 mb-8">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>0%</span>
              <span className="text-zinc-400 font-medium">Score : {score}%</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${score}%`, background: `linear-gradient(90deg, ${tier.glowColor}66, ${tier.glowColor})`, transitionDelay: '300ms' }}
              />
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/quiz/${quiz.slug}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-zinc-400 hover:text-white text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Passer le test
            </Link>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-sm font-medium"
              style={{ color: copied ? '#10b981' : '#a1a1aa' }}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copié !
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Partager
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
