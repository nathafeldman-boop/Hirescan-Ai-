import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { duoQuizzes } from '@/lib/duoQuizzes';
import DuoCompareClient from './DuoCompareClient';

const BASE = 'https://ursecret.vercel.app';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const quiz = duoQuizzes.find((q) => q.slug === params.slug);
  if (!quiz) return {};
  const title = `${quiz.emoji} ${quiz.title} — Résultats Duo`;
  return {
    title: `${title} | UrSecret`,
    description: `Réponds au quiz et compare tes réponses. Découvrez ce que vous vous cachez vraiment.`,
    openGraph: {
      title: `${title} | UrSecret`,
      description: 'Réponds au quiz et compare tes réponses avec ton/ta partenaire.',
      url: `${BASE}/duo/${params.slug}/compare`,
      siteName: 'UrSecret',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: '/api/og', width: 1200, height: 630, alt: title }],
    },
    robots: { index: false },
  };
}

export default function DuoComparePage({ params }: PageProps) {
  const quiz = duoQuizzes.find((q) => q.slug === params.slug);
  if (!quiz) notFound();
  return <DuoCompareClient quiz={quiz} />;
}
