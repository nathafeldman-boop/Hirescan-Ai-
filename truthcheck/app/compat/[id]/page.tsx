import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import CompatResultClient from './CompatResultClient';

export const dynamic = 'force-dynamic';

interface Props { params: { id: string } }

async function getResult(id: string) {
  const check = await prisma.compatibilityCheck.findUnique({
    where: { id },
    select: {
      id: true, personName: true, relationType: true,
      commonPoints: true, differences: true, strengths: true, watchPoints: true, summary: true,
    },
  }).catch(() => null);
  return check;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getResult(params.id);
  if (!r) return { title: 'Résultat introuvable — UrCecret' };
  return {
    title: `Compatibilité avec ${r.personName} — UrCecret`,
    description: r.summary,
    robots: { index: false, follow: false },
    openGraph: { title: `Compatibilité avec ${r.personName}`, description: r.summary, type: 'website' },
  };
}

export default async function CompatResultPage({ params }: Props) {
  const r = await getResult(params.id);
  if (!r) return notFound();

  return (
    <CompatResultClient
      personName={r.personName}
      relationType={r.relationType as 'ami' | 'couple' | 'famille'}
      commonPoints={r.commonPoints as unknown as string[]}
      differences={r.differences as unknown as string[]}
      strengths={r.strengths as unknown as string[]}
      watchPoints={r.watchPoints as unknown as string[]}
      summary={r.summary}
    />
  );
}
