import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parisDay } from '@/lib/chat';

export const dynamic = 'force-dynamic';

// Journal émotionnel — volontairement PAS gated derrière un abonnement (voir
// schema.prisma) : c'est un levier d'engagement quotidien ouvert à tous les
// comptes, gratuit ou payant.

// ── GET : historique (mois demandé, défaut = mois en cours) + entrée du jour ──
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const monthParam = req.nextUrl.searchParams.get('month'); // "YYYY-MM"
  const today = parisDay();
  const month = /^\d{4}-\d{2}$/.test(monthParam ?? '') ? monthParam! : today.slice(0, 7);

  const [monthEntries, totalCount] = await Promise.all([
    prisma.journalEntry.findMany({
      where: { userId: uid, day: { startsWith: month } },
      select: { day: true, mood: true, note: true },
      orderBy: { day: 'asc' },
    }),
    prisma.journalEntry.count({ where: { userId: uid } }),
  ]);

  return NextResponse.json({
    month,
    today,
    entries: monthEntries,
    hasAny: totalCount > 0,
    totalCount,
  });
}

// ── POST : enregistre (ou met à jour) l'entrée du jour ──
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const body = await req.json().catch(() => null) as { mood?: number; note?: string } | null;
  const mood = Number(body?.mood);
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 500) : undefined;

  const day = parisDay();
  const entry = await prisma.journalEntry.upsert({
    where: { userId_day: { userId: uid, day } },
    create: { userId: uid, day, mood, note },
    update: { mood, note },
  });

  return NextResponse.json({ ok: true, entry: { day: entry.day, mood: entry.mood, note: entry.note } });
}
