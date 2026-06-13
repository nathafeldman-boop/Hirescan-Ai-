import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSuivi } from '@/lib/suivi';
import SuiviClient from './SuiviClient';

interface Props { params: { type: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = params.type.toUpperCase();
  return {
    title: `Suivi psychologique 15 jours — ${code} | UrCecret Premium`,
    description: `Programme personnalisé de 15 jours pour le type ${code}. Découverte de soi, relations et projets de vie.`,
    robots: { index: false, follow: false },
  };
}

export default async function SuiviPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const tier = (session?.user as { tier?: string } | undefined)?.tier;
  if (tier !== 'premium') redirect('/quiz/personnalite?ref=suivi');

  const typeCode = params.type.toUpperCase();
  const suivi = getSuivi(typeCode);
  if (!suivi) notFound();

  return <SuiviClient suivi={suivi} />;
}
