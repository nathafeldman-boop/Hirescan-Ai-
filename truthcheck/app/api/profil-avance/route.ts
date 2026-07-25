import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import { dailyLimitFor, parisDay } from '@/lib/chat';
import { generateAdvancedAnalysis, summarizeJournalForAnalysis } from '@/lib/advancedAnalysis';
import type { MbtiScores } from '@/lib/mbti';

export const dynamic = 'force-dynamic';

// Analyse de personnalité avancée — un seul enregistrement par utilisateur
// (upsert), régénéré à la demande. Réservée aux abonnés payants, comme les
// autres features Nova structurées (analyse de conversation, tests, compat).

export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const existing = await prisma.advancedAnalysis.findUnique({ where: { userId: uid } });
  if (!existing) return NextResponse.json({ ok: true, analysis: null });

  return NextResponse.json({
    ok: true,
    analysis: {
      strengths: existing.strengths,
      weaknesses: existing.weaknesses,
      communicationStyle: existing.communicationStyle,
      conflictStyle: existing.conflictStyle,
      idealEnvironment: existing.idealEnvironment,
      advice: existing.advice,
      updatedAt: existing.updatedAt.toISOString(),
    },
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  if (!hasPaidAccess(user.tier)) {
    return NextResponse.json({ error: 'payment_required' }, { status: 402 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { mbtiType: true, mbtiScores: true },
  });
  if (!dbUser?.mbtiType) {
    return NextResponse.json({ error: 'no_test' }, { status: 422 });
  }

  const day = parisDay();
  const limit = dailyLimitFor(user.tier);
  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  }).catch(() => null);
  if ((usage?.count ?? 0) >= limit) {
    return NextResponse.json({ error: 'quota_exceeded', limit }, { status: 429 });
  }

  const [recentAnalyses, journalEntries] = await Promise.all([
    prisma.conversationAnalysis.findMany({
      where: { userId: user.id },
      select: { personality: true, advice: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.journalEntry.findMany({
      where: { userId: user.id },
      select: { day: true, mood: true, energy: true, stress: true },
      orderBy: { day: 'desc' },
      take: 30,
    }),
  ]);

  const result = await generateAdvancedAnalysis({
    mbtiType: dbUser.mbtiType,
    mbtiScores: (dbUser.mbtiScores as unknown as MbtiScores | null) ?? null,
    recentConversationInsights: recentAnalyses.map((a) => `${a.personality} ${a.advice}`.slice(0, 220)),
    journalSummary: summarizeJournalForAnalysis(journalEntries),
  });
  if (!result) {
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  const saved = await prisma.advancedAnalysis.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      communicationStyle: result.communicationStyle,
      conflictStyle: result.conflictStyle,
      idealEnvironment: result.idealEnvironment,
      advice: result.advice,
    },
    update: {
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      communicationStyle: result.communicationStyle,
      conflictStyle: result.conflictStyle,
      idealEnvironment: result.idealEnvironment,
      advice: result.advice,
    },
  });

  const updated = await prisma.chatUsage.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  }).catch(() => null);
  const remaining = Math.max(0, limit - (updated?.count ?? (usage?.count ?? 0) + 1));

  return NextResponse.json({
    ok: true,
    analysis: {
      strengths: saved.strengths,
      weaknesses: saved.weaknesses,
      communicationStyle: saved.communicationStyle,
      conflictStyle: saved.conflictStyle,
      idealEnvironment: saved.idealEnvironment,
      advice: saved.advice,
      updatedAt: saved.updatedAt.toISOString(),
    },
    remaining,
    limit,
  });
}
