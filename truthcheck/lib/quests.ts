// ── Système de quêtes ────────────────────────────────────────────────────────
// Le catalogue vit en CODE (contenu éditorial, change souvent) — seule la
// donnée "userId a rempli questKey à telle date" vit en base (voir
// QuestCompletion dans schema.prisma). Chaque quête a une condition
// déterministe, évaluée à partir de signaux déjà trackés ailleurs dans l'app
// (jamais un nouvel événement à ajouter en plus de ce qui existe déjà).
//
// Détection : `checkAndRecordQuestCompletions(userId)` est appelée à chaque
// action qui peut faire progresser une quête (Journal, Elio, test MBTI,
// onboarding, upgrade Stripe) ET à chaque chargement de /quetes (filet de
// sécurité qui rattrape tout ce qui n'a pas de point d'appel dédié — Compat,
// analyse avancée, analyse de conversation).
import { prisma } from './db';
import { computeStreak } from './journalStats';
import { hasPremiumAccess, hasProfileAccess } from './plans';

export type QuestCategory = 'discovery' | 'habit' | 'premium';

export interface QuestStats {
  tier: string;
  onboardingCompletedAt: Date | null;
  mbtiType: string | null;
  journalCount: number;
  journalStreak: number;
  journalEmotionTaggedCount: number;
  userMessageCount: number;
  assistantMessageCount: number;
  compatCount: number;
  convAnalysesCount: number;
  advancedAnalysisExists: boolean;
  accountAgeDays: number;
}

export interface QuestDef {
  key: string;
  category: QuestCategory;
  title: string;
  description: string;
  emoji: string;
  rewardLabel: string;
  rewardCredits?: number; // chatBonusCredits accordés à la complétion (voir lib/plans.ts / referral)
  requiresPremium?: boolean; // affichée verrouillée + CTA /pricing tant que non payant
  requiresMbti?: boolean; // affichée verrouillée + CTA /quiz/personnalite tant que le type MBTI n'est pas connu —
                          // une analyse de compatibilité n'a pas de sens tant qu'Elio ne sait pas qui tu es toi-même.
  href?: string; // destination pour agir sur la quête — absent = quête d'ancienneté, non actionnable (ex: premium_30_days)
  check: (s: QuestStats) => boolean;
}

export const QUEST_CATALOG: QuestDef[] = [
  // ── A) Découverte (gratuit) ──
  {
    key: 'onboarding_done',
    category: 'discovery',
    title: 'Compléter son profil personnel',
    description: 'Répondre au questionnaire d\'accueil pour qu\'Elio commence à te connaître.',
    emoji: '📝',
    rewardLabel: '+1 message Elio',
    rewardCredits: 1,
    href: '/decouverte',
    check: (s) => !!s.onboardingCompletedAt,
  },
  {
    key: 'first_journal',
    category: 'discovery',
    title: 'Faire son premier journal émotionnel',
    description: 'Noter comment tu te sens, un jour à la fois.',
    emoji: '📖',
    rewardLabel: '+2 messages Elio',
    rewardCredits: 2,
    href: '/journal',
    check: (s) => s.journalCount >= 1,
  },
  {
    key: 'first_elio_message',
    category: 'discovery',
    title: 'Envoyer son premier message à Elio',
    description: 'Dis-lui ce que tu as en tête — il est là pour ça.',
    emoji: '💬',
    rewardLabel: '+1 message Elio',
    rewardCredits: 1,
    href: '/chat',
    check: (s) => s.userMessageCount >= 1,
  },
  {
    key: 'first_mbti',
    category: 'discovery',
    title: 'Découvrir son profil de personnalité',
    description: 'Faire le test et voir apparaître ton type.',
    emoji: '🧠',
    rewardLabel: 'Badge débloqué',
    href: '/quiz/personnalite',
    check: (s) => !!s.mbtiType,
  },
  {
    key: 'first_advice',
    category: 'discovery',
    title: 'Découvrir son premier conseil personnalisé',
    description: 'Recevoir une première réponse d\'Elio.',
    emoji: '✨',
    rewardLabel: 'Badge débloqué',
    href: '/chat',
    check: (s) => s.assistantMessageCount >= 1,
  },
  {
    key: 'first_analysis_result',
    category: 'discovery',
    title: 'Découvrir son premier résultat d\'analyse',
    description: 'Compatibilité, conversation ou profil avancé — une première vraie analyse.',
    emoji: '🔍',
    rewardLabel: 'Badge débloqué',
    requiresMbti: true,
    href: '/compat',
    check: (s) => s.compatCount >= 1 || s.convAnalysesCount >= 1 || s.advancedAnalysisExists,
  },

  // ── B) Habitudes (freemium) ──
  {
    key: 'journal_streak_3',
    category: 'habit',
    title: 'Journal 3 jours d\'affilée',
    description: 'Trois jours de suite, sans interruption.',
    emoji: '🔥',
    rewardLabel: '+3 messages Elio',
    rewardCredits: 3,
    href: '/journal',
    check: (s) => s.journalStreak >= 3,
  },
  {
    key: 'journal_streak_7',
    category: 'habit',
    title: 'Journal 7 jours d\'affilée',
    description: 'Une semaine complète — c\'est une vraie habitude qui se construit.',
    emoji: '🔥',
    rewardLabel: '+5 messages Elio',
    rewardCredits: 5,
    href: '/journal',
    check: (s) => s.journalStreak >= 7,
  },
  {
    key: 'journal_streak_15',
    category: 'habit',
    title: 'Journal 15 jours d\'affilée',
    description: 'Quinze jours. Peu de gens vont aussi loin.',
    emoji: '🔥',
    rewardLabel: '+8 messages Elio',
    rewardCredits: 8,
    href: '/journal',
    check: (s) => s.journalStreak >= 15,
  },
  {
    key: 'identify_emotions',
    category: 'habit',
    title: 'Identifier ses émotions principales',
    description: 'Nommer ce que tu ressens, cinq jours différents.',
    emoji: '🎭',
    rewardLabel: 'Badge débloqué',
    href: '/journal',
    check: (s) => s.journalEmotionTaggedCount >= 5,
  },
  {
    key: 'personal_review',
    category: 'habit',
    title: 'Faire un bilan personnel',
    description: 'Dix jours de journal — assez de matière pour un vrai bilan.',
    emoji: '📊',
    rewardLabel: 'Badge débloqué',
    href: '/journal',
    check: (s) => s.journalCount >= 10,
  },

  // ── C) Premium (donnent envie de passer Premium, restent actives ensuite) ──
  {
    key: 'full_analysis',
    category: 'premium',
    title: 'Analyse complète de personnalité',
    description: 'Débloquer ton profil entier : amour, carrière, face cachée.',
    emoji: '🔓',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    href: '/profil-avance',
    check: (s) => hasProfileAccess(s.tier),
  },
  {
    key: 'relational_style',
    category: 'premium',
    title: 'Comprendre son style relationnel',
    description: 'Analyse approfondie d\'une relation avec Elio.',
    emoji: '❤️',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    requiresMbti: true,
    href: '/compat',
    check: (s) => s.compatCount >= 1 && hasPremiumAccess(s.tier),
  },
  {
    key: 'discover_strengths',
    category: 'premium',
    title: 'Découvrir ses forces',
    description: 'L\'analyse avancée qui va plus loin que le test seul.',
    emoji: '💪',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    href: '/profil-avance',
    check: (s) => s.advancedAnalysisExists,
  },
  {
    key: 'identify_blocks',
    category: 'premium',
    title: 'Identifier ses blocages émotionnels',
    description: 'Analyser une vraie conversation avec Elio.',
    emoji: '🧩',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    href: '/chat',
    check: (s) => s.convAnalysesCount >= 1,
  },
  {
    key: 'deep_elio_analysis',
    category: 'premium',
    title: 'Faire une analyse approfondie avec Elio',
    description: 'Une vraie conversation suivie, pas juste un échange rapide.',
    emoji: '🌊',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    href: '/chat',
    check: (s) => hasPremiumAccess(s.tier) && s.userMessageCount >= 20,
  },

  // ── Parcours long terme — un abonnement Premium n'est jamais "fini". Ces
  // trois quêtes ne se débloquent qu'avec le temps, exprès : elles donnent
  // une raison de revenir même après avoir tout complété par ailleurs. Basées
  // sur l'ancienneté du compte (pas la date exacte de 1er paiement, non
  // trackée) — une approximation raisonnable pour un abonné de longue date.
  {
    key: 'premium_30_days',
    category: 'premium',
    title: '30 jours avec Elio',
    description: 'Un mois d\'accompagnement — le début d\'une vraie habitude.',
    emoji: '🌱',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    check: (s) => hasPremiumAccess(s.tier) && s.accountAgeDays >= 30,
  },
  {
    key: 'premium_60_days',
    category: 'premium',
    title: '60 jours avec Elio',
    description: 'Deux mois — assez pour voir de vrais changements.',
    emoji: '🌿',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    check: (s) => hasPremiumAccess(s.tier) && s.accountAgeDays >= 60,
  },
  {
    key: 'premium_90_days',
    category: 'premium',
    title: '90 jours avec Elio',
    description: 'Trois mois. UrCecret a évolué avec toi, pas juste à côté de toi.',
    emoji: '🌳',
    rewardLabel: 'Badge débloqué',
    requiresPremium: true,
    check: (s) => hasPremiumAccess(s.tier) && s.accountAgeDays >= 90,
  },
];

export async function getQuestStats(userId: string): Promise<QuestStats> {
  const [user, journalEntries, userMsgCount, assistantMsgCount, compatCount, convAnalysesCount, advancedAnalysis] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { tier: true, onboardingCompletedAt: true, mbtiType: true, createdAt: true } }),
    prisma.journalEntry.findMany({ where: { userId }, select: { day: true, emotion: true, mood: true, energy: true, stress: true } }),
    prisma.chatMessage.count({ where: { userId, role: 'user' } }),
    prisma.chatMessage.count({ where: { userId, role: 'assistant' } }),
    prisma.compatibilityCheck.count({ where: { userId } }),
    prisma.conversationAnalysis.count({ where: { userId } }),
    prisma.advancedAnalysis.findUnique({ where: { userId }, select: { userId: true } }),
  ]);

  const { parisDay } = await import('./chat');
  const today = parisDay();

  return {
    tier: user?.tier ?? 'free',
    onboardingCompletedAt: user?.onboardingCompletedAt ?? null,
    mbtiType: user?.mbtiType ?? null,
    journalCount: journalEntries.length,
    journalStreak: computeStreak(journalEntries, today),
    journalEmotionTaggedCount: journalEntries.filter((e) => !!e.emotion).length,
    userMessageCount: userMsgCount,
    assistantMessageCount: assistantMsgCount,
    compatCount,
    convAnalysesCount,
    advancedAnalysisExists: !!advancedAnalysis,
    accountAgeDays: user?.createdAt ? Math.floor((Date.now() - user.createdAt.getTime()) / 86_400_000) : 0,
  };
}

export interface QuestSummary {
  key: string;
  category: QuestCategory;
  title: string;
  description: string;
  emoji: string;
  rewardLabel: string;
}

function toSummary(q: QuestDef): QuestSummary {
  return { key: q.key, category: q.category, title: q.title, description: q.description, emoji: q.emoji, rewardLabel: q.rewardLabel };
}

// Évalue le catalogue contre des stats déjà chargées — jamais d'accès DB ici,
// pur et testable.
export function evaluateNewlyCompleted(stats: QuestStats, alreadyCompletedKeys: Set<string>): QuestDef[] {
  return QUEST_CATALOG.filter((q) => !alreadyCompletedKeys.has(q.key) && q.check(stats));
}

// Point d'entrée principal — à appeler après toute action qui peut faire
// progresser une quête. Idempotent (jamais de doublon grâce à la contrainte
// unique [userId, questKey]) et jamais bloquant : une erreur ici ne doit
// jamais faire échouer l'action réelle qui vient de se produire.
export async function checkAndRecordQuestCompletions(userId: string): Promise<QuestSummary[]> {
  try {
    const [stats, completions] = await Promise.all([
      getQuestStats(userId),
      prisma.questCompletion.findMany({ where: { userId }, select: { questKey: true } }),
    ]);
    const alreadyDone = new Set(completions.map((c) => c.questKey));
    const newlyCompleted = evaluateNewlyCompleted(stats, alreadyDone);
    if (newlyCompleted.length === 0) return [];

    const totalRewardCredits = newlyCompleted.reduce((s, q) => s + (q.rewardCredits ?? 0), 0);

    await prisma.$transaction([
      ...newlyCompleted.map((q) => prisma.questCompletion.create({ data: { userId, questKey: q.key } })),
      ...(totalRewardCredits > 0
        ? [prisma.user.update({ where: { id: userId }, data: { chatBonusCredits: { increment: totalRewardCredits } } })]
        : []),
    ]);

    const { logEvent, EVENTS } = await import('./trackEvent');
    for (const q of newlyCompleted) {
      await logEvent(userId, EVENTS.QUEST_COMPLETED, { questKey: q.key, category: q.category });
    }

    return newlyCompleted.map(toSummary);
  } catch (e) {
    console.error('checkAndRecordQuestCompletions failed:', e);
    return [];
  }
}
