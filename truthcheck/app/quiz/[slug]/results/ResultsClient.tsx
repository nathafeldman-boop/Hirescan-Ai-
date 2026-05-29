'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Quiz } from '@/lib/quizzes';
import { getResultTier } from '@/lib/quizzes';

interface Props {
  quiz: Quiz;
}

const CIRCUMFERENCE = 2 * Math.PI * 72;

export default function ResultsClient({ quiz }: Props) {
  const searchParams = useSearchParams();
  const rawScore = parseInt(searchParams.get('score') ?? '0', 10);
  const score = Math.max(0, Math.min(100, rawScore));

  const tier = getResultTier(quiz, score);

  const [displayScore, setDisplayScore] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const [shareId, setShareId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const hasSaved = useRef(false);

  // Save result to DB once on mount
  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizSlug: quiz.slug, score }),
    })
      .then((r) => r.json())
      .then((data: { id?: string }) => {
        if (data.id) setShareId(data.id);
      })
      .catch(() => {});
  }, [quiz.slug, score]);

  // Animate circle + counter
  useEffect(() => {
    const timer = setTimeout(() => setStrokeOffset(CIRCUMFERENCE * (1 - score / 100)), 200);

    const duration = 1500;
    let start: number | null = null;
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.floor(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    });

    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [score]);

  function handleShare() {
    const url = shareId
      ? `${window.location.origin}/share/${shareId}`
      : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: tier.glowColor }}
        />
      </div>

      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Accueil
          </Link>
          <span className="text-sm font-medium text-zinc-300">{quiz.emoji} Résultats</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <p className="text-center text-zinc-500 text-sm mb-8">{quiz.title}</p>

          {/* Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <defs>
                  <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={`${tier.glowColor}88`} />
                    <stop offset="100%" stopColor={tier.glowColor} />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  cx="90" cy="90" r="72" fill="none"
                  stroke="url(#circleGrad)" strokeWidth="10"
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

          {/* Tier badge */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
              style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
            >
              <span>{tier.emoji}</span>
              {tier.title}
            </span>
          </div>

          {/* Message */}
          <div className="glass rounded-2xl p-6 mb-6 text-center">
            <p className="text-zinc-300 leading-relaxed">{tier.message}</p>
          </div>

          {/* Share link */}
          {shareId && (
            <div className="glass rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
              <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-xs text-zinc-500 truncate flex-1">
                /share/{shareId}
              </span>
              <span className="text-[10px] text-emerald-500 shrink-0">Sauvegardé ✓</span>
            </div>
          )}

          {/* Score bar */}
          <div className="glass rounded-xl p-4 mb-8">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>0%</span>
              <span className="text-zinc-400 font-medium">Ton score : {score}%</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${score}%`, background: `linear-gradient(90deg, ${tier.glowColor}66, ${tier.glowColor})`, transitionDelay: '300ms' }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-600 mt-2">
              {quiz.resultTiers.map((t, i) => <span key={i} title={t.title}>{t.emoji}</span>)}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Link
              href={`/quiz/${quiz.slug}`}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-medium">Refaire</span>
            </Link>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-zinc-400 hover:text-white"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium text-emerald-400">Copié !</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-xs font-medium">Partager</span>
                </>
              )}
            </button>

            <Link
              href="/"
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium">Accueil</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
