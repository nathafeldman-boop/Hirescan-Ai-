import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getQuizBySlug } from '@/lib/quizzes';
import ResultsClient from './ResultsClient';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const quiz = getQuizBySlug(params.slug);
  if (!quiz) return {};
  return {
    title: `Résultats — ${quiz.title} | UrCecret`,
    description: `Tes résultats personnalisés au quiz "${quiz.title}". ${quiz.subtitle}`,
    robots: { index: false, follow: false },
  };
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
