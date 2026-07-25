import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateJournalInsights } from '@/lib/journalInsights';

export const dynamic = 'force-dynamic';

const MIN_ENTRIES = 3;
const MAX_ENTRIES = 30;

// Tendances Nova sur le journal — généré à la demande (bouton), pas à chaque
// chargement de page : évite un appel Mistral inutile si l'utilisateur ne
// regarde jamais cette carte. Pas de gating payant, comme le reste du journal.
export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const entries = await prisma.journalEntry.findMany({
    where: { userId: uid },
    select: { day: true, mood: true, energy: true, stress: true, note: true },
    orderBy: { day: 'desc' },
    take: MAX_ENTRIES,
  });

  if (entries.length < MIN_ENTRIES) {
    return NextResponse.json({ ok: false, reason: 'not_enough_data', count: entries.length, needed: MIN_ENTRIES });
  }

  const insights = await generateJournalInsights([...entries].reverse());
  if (!insights) {
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, insights });
}
