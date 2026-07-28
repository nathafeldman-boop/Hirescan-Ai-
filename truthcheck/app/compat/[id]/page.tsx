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
      id: true, personName: true, relationType: true, score: true, headline: true,
      commonPoints: true, differences: true, strengths: true, watchPoints: true, summary: true,
    },
  }).catch(() => null);
  return check;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getResult(params.id);
  if (!r) return { title: 'Résultat introuvable — UrCecret' };
  const description = r.summary ?? r.headline ?? `${r.score}% de compatibilité`;
  return {
    title: `Compatibilité avec ${r.personName} — UrCecret`,
    description,
    robots: { index: false, follow: false },
    openGraph: { title: `Compatibilité avec ${r.personName}`, description, type: 'website' },
  };
}

export default async function CompatResultPage({ params }: Props) {
  const r = await getResult(params.id);
  if (!r) return notFound();

  return (
    <CompatResultClient
      personName={r.personName}
      relationType={r.relationType as 'ami' | 'couple' | 'famille'}
      score={r.score}
      headline={r.headline}
      commonPoints={r.commonPoints as unknown as string[] | null}
      differences={r.differences as unknown as string[] | null}
      strengths={r.strengths as unknown as string[] | null}
      watchPoints={r.watchPoints as unknown as string[] | null}
      summary={r.summary}
    />
  );
}
