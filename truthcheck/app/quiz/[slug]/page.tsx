import { notFound } from 'next/navigation';
import { getQuizBySlug } from '@/lib/quizzes';
import QuizClient from './QuizClient';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return [
    { slug: 'infidelite' },
    { slug: 'adopte' },
    { slug: 'amoureux' },
    { slug: 'vrais-amis' },
  ];
}

export default function QuizPage({ params }: PageProps) {
  const quiz = getQuizBySlug(params.slug);
  if (!quiz) notFound();
  return <QuizClient quiz={quiz} />;
}
