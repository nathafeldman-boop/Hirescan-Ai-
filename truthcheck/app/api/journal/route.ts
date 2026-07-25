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
      select: { day: true, mood: true, energy: true, stress: true, note: true },
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

  const body = await req.json().catch(() => null) as { mood?: number; energy?: number; stress?: number; note?: string } | null;
  const mood = Number(body?.mood);
  const energy = body?.energy !== undefined ? Number(body.energy) : 3;
  const stress = body?.stress !== undefined ? Number(body.stress) : 3;
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!Number.isInteger(energy) || energy < 1 || energy > 5 || !Number.isInteger(stress) || stress < 1 || stress > 5) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 500) : undefined;

  const day = parisDay();
  const entry = await prisma.journalEntry.upsert({
    where: { userId_day: { userId: uid, day } },
    create: { userId: uid, day, mood, energy, stress, note },
    update: { mood, energy, stress, note },
  });

  return NextResponse.json({
    ok: true,
    entry: { day: entry.day, mood: entry.mood, energy: entry.energy, stress: entry.stress, note: entry.note },
  });
}
