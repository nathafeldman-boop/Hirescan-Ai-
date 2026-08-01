import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateTodayDailyQuest } from '@/lib/dailyQuest';

export const dynamic = 'force-dynamic';

// Génère la quête du jour, une fois par jour — voir lib/dailyQuest.ts pour le
// pourquoi (remplace en partie le rôle de rétention des séquences email,
// désactivées le 01/08). Le plan Vercel Hobby de ce projet limite les crons
// à UNE invocation par jour (voir le commentaire dans journal-reminder/route.ts
// pour l'incident déjà rencontré) — 22h UTC ≈ minuit Paris (CEST), même
// compromis DST volontaire que les autres crons de ce fichier.
// getOrCreateTodayDailyQuest est idempotente (upsert sur `day`) : si ce cron
// est appelé deux fois le même jour, ou si la quête a déjà été créée en
// avance par un chargement du hub (voir app/decouverte/page.tsx), rien ne se
// duplique.
export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;
  if (!isVercelCron && !hasValidSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const quest = await getOrCreateTodayDailyQuest();
  return NextResponse.json({ ok: true, day: quest.day, actionType: quest.actionType, title: quest.title });
}
