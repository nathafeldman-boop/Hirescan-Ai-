import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logEvent, EVENTS } from '@/lib/trackEvent';

export const dynamic = 'force-dynamic';

// Rappel quotidien Journal (voir app/api/cron/journal-reminder/route.ts pour
// l'envoi) — un simple booléen, activable/désactivable à tout moment.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  let body: { enabled?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }); }

  const enabled = body.enabled === true;
  await prisma.user.update({ where: { id: uid }, data: { wantsDailyReminder: enabled } });
  if (enabled) await logEvent(uid, EVENTS.DAILY_REMINDER_OPTED_IN);

  return NextResponse.json({ ok: true, enabled });
}
