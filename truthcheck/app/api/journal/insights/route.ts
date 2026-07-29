import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateJournalInsights, generateJournalPeriodSummary } from '@/lib/journalInsights';
import { journalAccessFor } from '@/lib/journalAccess';

export const dynamic = 'force-dynamic';

const MIN_ENTRIES = 3;
const MAX_ENTRIES = 30;

// Tendances + résumé de période Elio sur le journal — générés à la demande
// (bouton), pas à chaque chargement de page. La SAISIE du journal reste
// gratuite ; CETTE analyse (tendances multi-jours, résumé de période) est
// réservée aux abonnés ou à la période d'essai découverte — voir
// lib/journalAccess.ts. ?period=week|month ajoute un résumé narratif en plus
// des tendances (même accès, un seul appel).
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { tier: true, createdAt: true } });
  if (!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const access = journalAccessFor(user.tier, user.createdAt);
  if (!access.trendInsights) {
    return NextResponse.json({ error: 'payment_required', trialDaysLeft: access.trialDaysLeft }, { status: 402 });
  }

  const period = req.nextUrl.searchParams.get('period'); // 'week' | 'month' | null
  const take = period === 'month' ? MAX_ENTRIES : period === 'week' ? 7 : MAX_ENTRIES;

  const entries = await prisma.journalEntry.findMany({
    where: { userId: uid },
    select: { day: true, mood: true, energy: true, stress: true, note: true },
    orderBy: { day: 'desc' },
    take,
  });

  if (entries.length < MIN_ENTRIES) {
    return NextResponse.json({ ok: false, reason: 'not_enough_data', count: entries.length, needed: MIN_ENTRIES });
  }

  const ordered = [...entries].reverse();

  if (period) {
    const periodLabel = period === 'month' ? 'le dernier mois' : 'la dernière semaine';
    const summary = await generateJournalPeriodSummary(ordered, periodLabel);
    if (!summary) return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
    return NextResponse.json({ ok: true, summary });
  }

  const insights = await generateJournalInsights(ordered);
  if (!insights) {
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, insights });
}
