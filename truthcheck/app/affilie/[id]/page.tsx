import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import AffilieClient from './AffilieClient';

export const metadata: Metadata = {
  title: 'Mon espace affilié — UrSecret',
  robots: { index: false },
};

interface Props { params: { id: string } }

export default async function AffiliePage({ params }: Props) {
  const affiliate = await prisma.affiliate.findUnique({
    where: { id: params.id },
    include: { conversions: { orderBy: { createdAt: 'desc' } } },
  });

  if (!affiliate) notFound();

  return <AffilieClient affiliate={JSON.parse(JSON.stringify(affiliate))} />;
}
