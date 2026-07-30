import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import { QUEST_CATALOG } from '@/lib/quests';
import { hasPremiumAccess } from '@/lib/plans';
import DecouverteClient from './DecouverteClient';

export const metadata: Metadata = {
  title: 'Que veux-tu découvrir sur toi ? | UrCecret',
  description: 'Test de personnalité, coach IA, journal émotionnel, analyse de relations, quiz — choisis ton expérience et commence à mieux te connaître.',
  alternates: { canonical: 'https://urcecret.site/decouverte' },
  robots: { index: false, follow: false }, // hub applicatif privé (compte requis)
};

// Le hub est la nouvelle étape du funnel entre la landing et les
// fonctionnalités — on demande la connexion ICI plutôt que de laisser chaque
// carte rediriger séparément vers /login (compat/journal le font déjà, mais
// Elio/quiz non) : un seul mur de connexion, avant de choisir l'expérience.
// Depuis le funnel /bienvenue → /journal, c'est aussi le premier écran
// "maison" qu'un nouvel inscrit voit après avoir déjà donné un peu de lui —
// d'où le prénom + la quête "profil incomplet" (voir DecouverteClient).
export default async function DecouvertePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/decouverte');

  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep) redirect(funnelStepPath(pendingStep));

  const [user, completions, generatedQuests] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, mbtiType: true, tier: true, questsLastViewedAt: true },
    }),
    prisma.questCompletion.findMany({ where: { userId: session.user.id }, select: { questKey: true } }),
    prisma.generatedQuest.findMany({ where: { userId: session.user.id }, select: { completedAt: true, createdAt: true } }),
  ]);

  const isPremium = hasPremiumAccess(user?.tier ?? 'free');
  const hasMbti = !!user?.mbtiType;
  const completedKeys = new Set(completions.map((c) => c.questKey));
  // Une quête qui exige le test MBTI n'est pas "accessible" tant qu'il n'est
  // pas fait (voir requiresMbti dans lib/quests.ts) — sinon elle gonflerait le
  // badge "quêtes en attente" pour un compte qui n'a pas encore fait son test,
  // sans qu'il y ait quoi que ce soit de logique à y faire pour l'instant.
  const accessibleQuests = QUEST_CATALOG.filter((q) => (!q.requiresPremium || isPremium) && (!q.requiresMbti || hasMbti));
  const pendingCatalogCount = accessibleQuests.filter((q) => !completedKeys.has(q.key)).length;
  const pendingGenerated = generatedQuests.filter((g) => !g.completedAt);

  // "Nouveau" = une quête générée par Elio est apparue depuis la dernière
  // visite de /quetes (ou jamais visité) — voir User.questsLastViewedAt. On
  // ne track pas les quêtes du catalogue de la même façon : elles existent
  // depuis toujours pour un compte donné (seul leur verrouillage change avec
  // le tier, ce qui est déjà visible via le badge "quêtes en attente").
  const lastViewed = user?.questsLastViewedAt ?? new Date(0);
  const hasNewQuests = pendingGenerated.some((g) => g.createdAt > lastViewed);
  const hasPendingQuests = pendingCatalogCount > 0 || pendingGenerated.length > 0;

  return (
    <DecouverteClient
      firstName={user?.name?.split(' ')[0] ?? null}
      hasProfile={!!user?.mbtiType}
      hasNewQuests={hasNewQuests}
      hasPendingQuests={hasPendingQuests}
    />
  );
}
