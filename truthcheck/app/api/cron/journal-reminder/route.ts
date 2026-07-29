import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parisDay, parisHour } from '@/lib/chat';
import { emailDailyReminder, sendEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

// Rappel quotidien Journal — tourne toutes les heures (voir vercel.json) mais
// ne fait quoi que ce soit à l'heure "20h à Paris" (calculée dynamiquement,
// jamais un offset UTC fixe, pour rester correct été comme hiver — voir
// lib/chat.ts::parisHour). Pas de dédup via EmailLog ici : contrairement aux
// séquences day1/day3/day7 (un seul envoi, à vie), ce rappel doit repartir
// CHAQUE jour — la condition "pas encore noté aujourd'hui" suffit à éviter
// le spam, et tourner une seule heure par jour évite le double-envoi.
export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;
  if (!isVercelCron && !hasValidSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (parisHour() !== 20) return NextResponse.json({ skipped: 'not_20h_paris' });

  const today = parisDay();
  const candidates = await prisma.user.findMany({
    where: {
      email: { not: null },
      wantsDailyReminder: true,
      journalEntries: { none: { day: today } },
    },
    select: { id: true, email: true, name: true },
  });

  let sent = 0;
  let errors = 0;
  for (const user of candidates) {
    if (!user.email) continue;
    try {
      const { subject, html } = emailDailyReminder(user.name);
      await sendEmail(user.email, subject, html);
      sent++;
    } catch (e) {
      errors++;
      console.error('journal-reminder send failed:', e);
    }
  }

  return NextResponse.json({ ok: true, candidates: candidates.length, sent, errors });
}
