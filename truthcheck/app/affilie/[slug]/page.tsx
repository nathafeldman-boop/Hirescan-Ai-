import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import AffilieClient from './AffilieClient';
import { verifyAffiliateToken } from '@/lib/affiliateToken';

export const metadata: Metadata = {
  title: 'Mon espace affilié — UrCecret',
  robots: { index: false, follow: false },
};

interface Props {
  params: { slug: string };
  searchParams: { token?: string };
}

export default async function AffiliePage({ params, searchParams }: Props) {
  const token = searchParams.token ?? '';

  if (!verifyAffiliateToken(params.slug, token)) {
    return notFound();
  }

  const affiliate = await prisma.affiliate.findUnique({
    where: { slug: params.slug },
    include: { conversions: { orderBy: { createdAt: 'desc' } } },
  });

  if (!affiliate) return notFound();

  const clicks = await prisma.pageView.count({
    where: { path: `/__aff/${params.slug}` },
  });

  return <AffilieClient affiliate={JSON.parse(JSON.stringify(affiliate))} clicks={clicks} />;
}
