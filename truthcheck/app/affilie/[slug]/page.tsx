import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import AffilieClient from './AffilieClient';

export const metadata: Metadata = {
  title: 'Mon espace affilié — UrSecret',
  robots: { index: false },
};

interface Props { params: { slug: string } }

function slugToName(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function AffiliePage({ params }: Props) {
  let affiliate = await prisma.affiliate.findUnique({
    where: { slug: params.slug },
    include: { conversions: { orderBy: { createdAt: 'desc' } } },
  });

  if (!affiliate) {
    affiliate = await prisma.affiliate.create({
      data: {
        slug: params.slug,
        name: slugToName(params.slug),
        commissionPct: 50,
      },
      include: { conversions: { orderBy: { createdAt: 'desc' } } },
    });
  }

  return <AffilieClient affiliate={JSON.parse(JSON.stringify(affiliate))} />;
}
