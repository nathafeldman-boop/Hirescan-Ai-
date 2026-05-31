import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getQuizBySlug } from '@/lib/quizzes';
import ResultsClient from './ResultsClient';

interface PageProps {
  params: { slug: string };
}

export default function ResultsPage({ params }: PageProps) {
  const quiz = getQuizBySlug(params.slug);
  if (!quiz) notFound();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <ResultsClient quiz={quiz} />
    </Suspense>
  );
}
