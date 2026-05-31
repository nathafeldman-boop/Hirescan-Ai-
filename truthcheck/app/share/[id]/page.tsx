import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getQuizBySlug } from '@/lib/quizzes';
import SharedDisplay from './SharedDisplay';

const BASE = 'https://ursecret.vercel.app';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await prisma.quizResult.findUnique({ where: { id: params.id } });
  if (!result) return {};
  const quiz = getQuizBySlug(result.quizSlug);
  if (!quiz) return {};

  const title = `J'ai passé le quiz "${quiz.title}" | UrSecret`;
  const description = `${quiz.subtitle} — Découvre ton propre résultat en 30 questions anonymes. 100% gratuit.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE}/share/${params.id}`,
      siteName: 'UrSecret',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: `/api/og?quiz=${quiz.slug}`, width: 1200, height: 630, alt: quiz.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?quiz=${quiz.slug}`],
    },
    alternates: { canonical: `${BASE}/share/${params.id}` },
  };
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
