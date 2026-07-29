import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parisDay } from '@/lib/chat';
import { emailDailyReminder, sendEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

// Rappel quotidien Journal — tourne UNE fois par jour à 18h UTC (voir
// vercel.json). Ça tombe pile 20h à Paris en heure d'été (CEST, la majeure
// partie de l'année) et 19h en heure d'hiver (CET) — un décalage d'1h l'hiver
// est un compromis volontaire : le plan Vercel Hobby de ce projet limite les
// crons à UNE invocation par jour (un essai avec un cron horaire + un filtre
// "seulement à 20h locale" a fait échouer tous les déploiements en silence
// jusqu'à ce qu'on le remarque — jamais recommencer ça). Pas de dédup via
// EmailLog : contrairement aux séquences day1/day3/day7 (un seul envoi, à
// vie), ce rappel doit repartir CHAQUE jour — "pas encore noté aujourd'hui"
// suffit à éviter le spam, et une seule exécution par jour évite le double-envoi.
export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;
  if (!isVercelCron && !hasValidSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
