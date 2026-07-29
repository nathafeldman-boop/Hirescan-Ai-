import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import { mbtiTypes } from '@/lib/mbti-server';
import type { MbtiScores } from '@/lib/mbti';
import RapportClient from './RapportClient';

export const metadata: Metadata = {
  title: 'Ton rapport de personnalité | UrCecret',
  description: 'Ton rapport de personnalité complet, prêt à télécharger.',
  alternates: { canonical: 'https://urcecret.site/profil-avance/rapport' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

// Rapport téléchargeable — recompose en un seul document ce qui est déjà
// généré ailleurs (le test MBTI + l'analyse avancée d'Elio) plutôt que de
// dupliquer la génération. Si l'un des deux manque, on renvoie vers
// /profil-avance qui sait déjà présenter le bon écran (faire le test /
// générer l'analyse / débloquer Elio).
export default async function RapportPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/profil-avance/rapport');

  const [user, analysis] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, tier: true, mbtiType: true, mbtiScores: true },
    }),
    prisma.advancedAnalysis.findUnique({ where: { userId: session.user.id } }),
  ]);
  if (!user) redirect('/login?callbackUrl=/profil-avance/rapport');
  if (!hasPaidAccess(user.tier) || !user.mbtiType || !analysis) redirect('/profil-avance');

  const t = mbtiTypes[user.mbtiType];
  if (!t) redirect('/profil-avance');

  return (
    <RapportClient
      firstName={user.name?.split(' ')[0] ?? null}
      type={{
        code: t.code, name: t.name, tagline: t.tagline, rarity: t.rarity,
        fullDesc: t.fullDesc, inLove: t.inLove, atWork: t.atWork,
        famousExamples: t.famousExamples, compatibleWith: t.compatibleWith,
      }}
      scores={(user.mbtiScores as unknown as MbtiScores | null) ?? null}
      analysis={{
        strengths: analysis.strengths as string[],
        weaknesses: analysis.weaknesses as string[],
        communicationStyle: analysis.communicationStyle,
        conflictStyle: analysis.conflictStyle,
        idealEnvironment: analysis.idealEnvironment,
        advice: analysis.advice as string[],
      }}
      generatedAt={analysis.updatedAt.toISOString()}
    />
  );
}
