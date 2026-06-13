'use client';

import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';
import QuizIcon from '@/components/QuizIcon';

export default function QuizListSection() {
  return (
    <div className="flex flex-col gap-4">
      {quizzes.map((quiz) => (
        <Link
          key={quiz.slug}
          href={`/quiz/${quiz.slug}`}
          className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
          style={{ background: 'white', border: '1px solid #e7e5e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
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
              <p className="text-stone-900 font-bold text-base leading-snug mb-1">{quiz.title}</p>
              <p className="text-stone-400 text-xs leading-relaxed">{quiz.subtitle}</p>
            </div>

            <svg
              className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: quiz.accentColor }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${quiz.accentColor}60, transparent)` }}
          />
        </Link>
      ))}
    </div>
  );
}
