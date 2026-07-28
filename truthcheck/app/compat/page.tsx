import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import CompatClient from './CompatClient';

export const metadata: Metadata = {
  title: 'Compatibilité amoureuse | UrCecret',
  description: 'Découvre ta compatibilité avec ton/ta partenaire grâce à l\'analyse de personnalité par IA.',
  alternates: { canonical: 'https://urcecret.site/compat' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

// Le score de compatibilité (gratuit, déterministe) est ouvert à tout le
// monde — seule l'analyse approfondie de Nova, plus loin dans le parcours,
// reste payante. Voir /api/compat.
export default async function CompatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  return <CompatClient />;
}
