import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Params { params: { day: string } }

// Détail complet d'une journée (avec la photo, exclue du GET /api/journal
// mensuel pour garder son payload léger) — chargé à la demande quand
// l'utilisateur ouvre la fiche d'un jour dans le calendrier.
export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.day)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const entry = await prisma.journalEntry.findUnique({
    where: { userId_day: { userId: uid, day: params.day } },
    select: { day: true, mood: true, energy: true, stress: true, emotion: true, tags: true, photo: true, note: true },
  });

  if (!entry) return NextResponse.json({ ok: false, entry: null });
  return NextResponse.json({ ok: true, entry });
}
