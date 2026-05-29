import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getQuizBySlug } from '@/lib/quizzes';
import SharedDisplay from './SharedDisplay';

interface PageProps {
  params: { id: string };
}

export default async function SharePage({ params }: PageProps) {
  const result = await prisma.quizResult.findUnique({
    where: { id: params.id },
  });

  if (!result) notFound();

  const quiz = getQuizBySlug(result.quizSlug);
  if (!quiz) notFound();

  const date = result.createdAt.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return <SharedDisplay quiz={quiz} score={result.score} date={date} shareId={params.id} />;
}
