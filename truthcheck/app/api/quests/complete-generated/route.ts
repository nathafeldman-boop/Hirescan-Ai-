import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logEvent, EVENTS } from '@/lib/trackEvent';

export const dynamic = 'force-dynamic';

// Quêtes générées par Elio (lib/questGenerator.ts) : pas de signal automatique
// possible ("écrire une qualité que tu oublies" ne se détecte pas), donc
// complétion manuelle — l'utilisateur confirme lui-même l'avoir faite.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  let body: { id?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }); }
  if (!body.id) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const quest = await prisma.generatedQuest.findUnique({ where: { id: body.id }, select: { userId: true, completedAt: true, title: true, emoji: true } });
  if (!quest || quest.userId !== uid) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (quest.completedAt) return NextResponse.json({ ok: true, alreadyDone: true });

  await prisma.generatedQuest.update({ where: { id: body.id }, data: { completedAt: new Date() } });
  await logEvent(uid, EVENTS.QUEST_COMPLETED, { questKey: `ai:${body.id}`, category: 'ai' });

  return NextResponse.json({ ok: true, quest: { title: quest.title, emoji: quest.emoji ?? '✨' } });
}
