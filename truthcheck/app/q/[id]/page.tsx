import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import type { QuizQuestion } from '@/lib/customQuiz';
import QuizPlayClient from './QuizPlayClient';

export const dynamic = 'force-dynamic';

interface Props { params: { id: string } }

async function getQuiz(id: string) {
  const quiz = await prisma.customQuiz.findUnique({
    where: { id },
    select: { id: true, title: true, intro: true, questions: true, disclaimer: true },
  }).catch(() => null);
  return quiz;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const quiz = await getQuiz(params.id);
  if (!quiz) return { title: 'Test introuvable — UrCecret' };
  return {
    title: `${quiz.title} — un test créé sur UrCecret`,
    description: quiz.intro,
    robots: { index: false, follow: false }, // contenu généré à la demande, pas destiné au SEO
    openGraph: { title: quiz.title, description: quiz.intro, type: 'website' },
  };
}

export default async function QuizPage({ params }: Props) {
  const quiz = await getQuiz(params.id);
  if (!quiz) return notFound();

  const questions = (quiz.questions as unknown as QuizQuestion[]).map((q) => ({
    text: q.text,
    options: q.options.map((o) => o.label),
  }));

  return (
    <QuizPlayClient
      id={quiz.id}
      title={quiz.title}
      intro={quiz.intro}
      disclaimer={quiz.disclaimer}
      questions={questions}
    />
  );
}
