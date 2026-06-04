import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { duoQuizzes } from '@/lib/duoQuizzes';
import DuoQuizClient from './DuoQuizClient';

const BASE = 'https://urcecret.site';

const ALL_DUO_SLUGS = [
  'duo-communication',
  'duo-compatibilite',
  'duo-investissement',
  'duo-resilience',
  'duo-amour',
];

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_DUO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const quiz = duoQuizzes.find((q) => q.slug === params.slug);
  if (!quiz) return {};
  const title = `${quiz.emoji} ${quiz.title} — Mode Duo`;
  const description = `${quiz.description} 100% anonyme, résultats instantanés.`;
  return {
    title: `${title} | UrCecret`,
    description,
    openGraph: {
      title: `${title} | UrCecret`,
      description,
      url: `${BASE}/duo/${quiz.slug}`,
      siteName: 'UrCecret',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: '/api/og', width: 1200, height: 630, alt: title }],
    },
    alternates: { canonical: `${BASE}/duo/${quiz.slug}` },
  };
}

export default function DuoQuizPage({ params }: PageProps) {
  const quiz = duoQuizzes.find((q) => q.slug === params.slug);
  if (!quiz) notFound();
  return <DuoQuizClient quiz={quiz} />;
}
