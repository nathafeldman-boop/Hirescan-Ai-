'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { quizzes } from '@/lib/quizzes';
import QuizIcon from '@/components/QuizIcon';

export default function QuizListSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';

  function handleQuizClick(slug: string, e: React.MouseEvent) {
    if (!isPremium) {
      e.preventDefault();
      router.push('/pricing');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {quizzes.map((quiz) => (
        <a
          key={quiz.slug}
          href={isPremium ? `/quiz/${quiz.slug}` : '/pricing'}
          onClick={(e) => handleQuizClick(quiz.slug, e)}
          className="group relative rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 20% 50%, ${quiz.accentColor}18 0%, transparent 70%)` }}
          />

          <div className="relative p-5 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${quiz.accentColor}20`, border: `1px solid ${quiz.accentColor}30` }}
            >
              <QuizIcon slug={quiz.slug} size={32} color={quiz.accentColor} className="mx-auto" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base leading-snug mb-1">{quiz.title}</p>
              <p className="text-zinc-500 text-xs leading-relaxed">{quiz.subtitle}</p>
            </div>

            {isPremium ? (
              <svg
                className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: quiz.accentColor }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 flex-shrink-0 text-zinc-600"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>

          <div
            className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${quiz.accentColor}60, transparent)` }}
          />
        </a>
      ))}

      {!isPremium && (
        <div className="mt-2 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4 text-center">
          <p className="text-zinc-400 text-sm mb-3">
            🔓 <span className="text-white font-semibold">Premium</span> — Accès à tous les 15 quiz
          </p>
          <a
            href="/pricing"
            className="inline-block px-6 py-2.5 rounded-xl font-black text-white text-sm transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}
          >
            ✦ Débloquer tout
          </a>
        </div>
      )}
    </div>
  );
}
