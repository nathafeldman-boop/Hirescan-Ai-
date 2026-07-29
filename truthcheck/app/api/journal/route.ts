import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parisDay } from '@/lib/chat';
import { dailyReaction } from '@/lib/journalReflection';
import { JOURNAL_TAG_KEYS } from '@/lib/journalTags';
import { journalAccessFor } from '@/lib/journalAccess';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import { checkAndRecordQuestCompletions } from '@/lib/quests';

export const dynamic = 'force-dynamic';

// Journal émotionnel — la SAISIE du jour est volontairement PAS gated (voir
// schema.prisma) : c'est un levier d'engagement quotidien ouvert à tous les
// comptes, gratuit ou payant. En revanche, regarder en arrière (mois passés,
// stats sur plusieurs semaines) est réservé — voir lib/journalAccess.ts.

// Taille max de la photo (data URI base64, ~1Mo de photo réelle une fois
// décodée) — reste raisonnable pour une colonne Postgres @db.Text.
const MAX_PHOTO_DATA_URI_LENGTH = 1_500_000;

// ── GET : historique (mois demandé, défaut = mois en cours) + entrée du jour ──
// `allEntries` (jour/humeur/énergie/stress/tags, sans note/photo) sert au
// calcul des stats série/moyenne/évolution — gratuites, voir lib/journalStats.ts
// — donc jamais restreinte : couper l'historique casserait la série pour tout
// le monde à chaque changement de mois. Ce qui EST gated, c'est `entries` (le
// détail — note, photo — d'un mois autre que le mois en cours) : au-delà, un
// appel direct à l'API doit buter sur le même mur que le calendrier à l'écran.
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { tier: true, createdAt: true } });
  if (!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const access = journalAccessFor(user.tier, user.createdAt);
  const today = parisDay();
  const currentMonth = today.slice(0, 7);

  const monthParam = req.nextUrl.searchParams.get('month'); // "YYYY-MM"
  const requestedMonth = /^\d{4}-\d{2}$/.test(monthParam ?? '') ? monthParam! : currentMonth;
  if (requestedMonth !== currentMonth && !access.history) {
    return NextResponse.json({ error: 'payment_required', trialDaysLeft: access.trialDaysLeft }, { status: 402 });
  }
  const month = requestedMonth;

  const [monthEntries, allEntries, totalCount] = await Promise.all([
    prisma.journalEntry.findMany({
      where: { userId: uid, day: { startsWith: month } },
      select: { day: true, mood: true, energy: true, stress: true, emotion: true, tags: true, note: true },
      orderBy: { day: 'asc' },
    }),
    prisma.journalEntry.findMany({
      where: { userId: uid },
      select: { day: true, mood: true, energy: true, stress: true, tags: true },
      orderBy: { day: 'asc' },
    }),
    prisma.journalEntry.count({ where: { userId: uid } }),
  ]);

  return NextResponse.json({
    month,
    today,
    entries: monthEntries,
    allEntries,
    hasAny: totalCount > 0,
    totalCount,
  });
}

// ── POST : enregistre (ou met à jour) l'entrée du jour ──
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const body = await req.json().catch(() => null) as {
    mood?: number; energy?: number; stress?: number; emotion?: string;
    tags?: string[]; photo?: string; note?: string;
  } | null;
  const mood = Number(body?.mood);
  const energy = body?.energy !== undefined ? Number(body.energy) : 3;
  const stress = body?.stress !== undefined ? Number(body.stress) : 3;
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!Number.isInteger(energy) || energy < 1 || energy > 5 || !Number.isInteger(stress) || stress < 1 || stress > 5) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const emotion = typeof body?.emotion === 'string' ? body.emotion.trim().slice(0, 30) || undefined : undefined;
  // 800 (pas 500) : couvre le cas de l'onboarding, qui combine 3 courtes
  // réponses ("ce qui a marqué / rendu heureux / dérangé") dans cette note.
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 800) : undefined;

  const tags = Array.isArray(body?.tags)
    ? [...new Set(body.tags.filter((t): t is string => typeof t === 'string' && JOURNAL_TAG_KEYS.includes(t)))].slice(0, 7)
    : undefined;

  let photo: string | undefined;
  if (typeof body?.photo === 'string' && body.photo) {
    if (!/^data:image\/(jpe?g|png|webp);base64,/i.test(body.photo)) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    if (body.photo.length > MAX_PHOTO_DATA_URI_LENGTH) {
      return NextResponse.json({ error: 'photo_too_large' }, { status: 413 });
    }
    photo = body.photo;
  }

  const day = parisDay();
  const yesterday = new Date(day + 'T12:00:00');
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  // Compté AVANT l'upsert : seul moyen de savoir si c'est la toute première
  // entrée du compte (upsert ne dit pas s'il a pris la branche create/update).
  const wasFirstEver = (await prisma.journalEntry.count({ where: { userId: uid } })) === 0;

  const [entry, yesterdayEntry] = await Promise.all([
    prisma.journalEntry.upsert({
      where: { userId_day: { userId: uid, day } },
      create: { userId: uid, day, mood, energy, stress, emotion, tags, photo, note },
      update: { mood, energy, stress, emotion, tags, photo, note },
    }),
    prisma.journalEntry.findUnique({
      where: { userId_day: { userId: uid, day: yesterdayKey } },
      select: { mood: true, energy: true, stress: true },
    }),
  ]);

  await logEvent(uid, EVENTS.JOURNAL_ENTRY_SAVED);
  if (wasFirstEver) await logEvent(uid, EVENTS.JOURNAL_STARTED);
  const newlyCompletedQuests = await checkAndRecordQuestCompletions(uid);

  return NextResponse.json({
    ok: true,
    entry: {
      day: entry.day, mood: entry.mood, energy: entry.energy, stress: entry.stress,
      emotion: entry.emotion, tags: entry.tags, photo: entry.photo, note: entry.note,
    },
    reflection: dailyReaction(entry, yesterdayEntry),
    newlyCompletedQuests,
  });
}
