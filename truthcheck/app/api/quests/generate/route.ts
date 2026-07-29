import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generatePersonalizedQuests } from '@/lib/questGenerator';

export const dynamic = 'force-dynamic';

// Appelée quand un compte a terminé tout le catalogue statique disponible
// pour son palier (voir canGenerate dans app/quetes/page.tsx) — Elio propose
// alors 3 quêtes personnalisées. Jamais depuis rien : sans objectif déclaré,
// sans type MBTI et sans note de Journal, on ne génère pas (voir
// lib/questGenerator.ts::shouldGenerate) plutôt que produire des quêtes
// génériques qui ne rempliraient pas la promesse "ça vient VRAIMENT de toi".
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { name: true, onboardingGoal: true, mbtiType: true },
  });
  if (!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const recentEntries = await prisma.journalEntry.findMany({
    where: { userId: uid, note: { not: null } },
    select: { note: true },
    orderBy: { day: 'desc' },
    take: 8,
  });
  const recentJournalNotes = recentEntries.map((e) => e.note).filter((n): n is string => !!n && n.trim().length > 0);

  const drafts = await generatePersonalizedQuests({
    firstName: user.name?.split(' ')[0] ?? null,
    onboardingGoal: user.onboardingGoal,
    mbtiType: user.mbtiType,
    recentJournalNotes,
  });

  if (!drafts) {
    return NextResponse.json({ error: 'generation_unavailable' }, { status: 503 });
  }

  const created = await prisma.$transaction(
    drafts.map((d) => prisma.generatedQuest.create({ data: { userId: uid, title: d.title, description: d.description, emoji: d.emoji } })),
  );

  return NextResponse.json({
    ok: true,
    quests: created.map((g) => ({ id: g.id, title: g.title, description: g.description, emoji: g.emoji ?? '✨', completed: false })),
  });
}
