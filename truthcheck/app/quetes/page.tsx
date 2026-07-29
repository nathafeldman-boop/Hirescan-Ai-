import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolveFunnelStep, funnelStepPath } from '@/lib/funnelGate';
import { QUEST_CATALOG, getQuestStats, checkAndRecordQuestCompletions } from '@/lib/quests';
import { hasPremiumAccess } from '@/lib/plans';
import QuetesClient from './QuetesClient';

export const metadata: Metadata = {
  title: 'Mes quêtes | UrCecret',
  robots: { index: false, follow: false }, // étape applicative privée (compte requis)
};

// Hub central des quêtes — remplace l'ancien /quete (simple écran "complète
// ton profil") par un vrai système à 3 catégories, voir lib/quests.ts. /quete
// redirige ici (voir app/quete/page.tsx) pour ne casser aucun lien existant.
export default async function QuetesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/quetes');

  const pendingStep = await resolveFunnelStep(session.user.id);
  if (pendingStep) redirect(funnelStepPath(pendingStep));

  // Rattrape toute quête déjà accomplie mais jamais détectée en temps réel
  // (Compat, analyse avancée, analyse de conversation...) — voir le
  // commentaire en tête de lib/quests.ts.
  await checkAndRecordQuestCompletions(session.user.id);

  const [user, stats, completions, generatedQuests] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, tier: true } }),
    getQuestStats(session.user.id),
    prisma.questCompletion.findMany({ where: { userId: session.user.id }, orderBy: { completedAt: 'desc' } }),
    prisma.generatedQuest.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
  ]);

  const completedKeys = new Set(completions.map((c) => c.questKey));
  const completedAtByKey = new Map(completions.map((c) => [c.questKey, c.completedAt.toISOString()]));

  const quests = QUEST_CATALOG.map((q) => ({
    key: q.key,
    category: q.category,
    title: q.title,
    description: q.description,
    emoji: q.emoji,
    rewardLabel: q.rewardLabel,
    requiresPremium: !!q.requiresPremium,
    href: q.href ?? null,
    completed: completedKeys.has(q.key),
    completedAt: completedAtByKey.get(q.key) ?? null,
  }));

  const isPremium = hasPremiumAccess(user?.tier ?? 'free');
  // Toutes les quêtes restent VISIBLES pour tout le monde — y compris Premium
  // pour un compte gratuit (verrouillées, avec CTA), jamais masquées : c'est
  // justement ce qui doit donner envie de passer Premium (voir QuetesClient).
  const visibleQuests = quests;
  const accessibleQuests = quests.filter((q) => !q.requiresPremium || isPremium);
  const allCatalogDone = accessibleQuests.length > 0 && accessibleQuests.every((q) => q.completed);

  // Marque le hub comme "vu" — fait disparaître le badge "nouveau" affiché sur
  // /decouverte pour les quêtes générées apparues depuis la dernière visite.
  // Jamais bloquant : une erreur ici ne doit pas casser l'affichage du hub.
  await prisma.user.update({ where: { id: session.user.id }, data: { questsLastViewedAt: new Date() } }).catch(() => {});

  return (
    <QuetesClient
      firstName={user?.name?.split(' ')[0] ?? null}
      isPremium={isPremium}
      quests={visibleQuests}
      totalCompleted={completions.length}
      generatedQuests={generatedQuests.map((g) => ({
        id: g.id, title: g.title, description: g.description, emoji: g.emoji ?? '✨',
        completed: !!g.completedAt,
      }))}
      canGenerate={allCatalogDone}
    />
  );
}
