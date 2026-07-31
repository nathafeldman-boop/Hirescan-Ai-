import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const TZ = 'Europe/Paris';

// Copié de app/natha-admin/page.tsx (mêmes fonctions, même logique) — voir
// commentaire ci-dessous sur pourquoi cette route reste volontairement séparée
// plutôt que de partager du code avec la page.
function parisMidnight(dateStr: string): Date {
  const utcMid = new Date(dateStr + 'T00:00:00Z');
  const parisHour = +new Intl.DateTimeFormat('en', { timeZone: TZ, hour: 'numeric', hour12: false }).format(utcMid);
  return new Date(utcMid.getTime() - parisHour * 3_600_000);
}

function bucketByDay(rows: { createdAt: Date }[], days: number, todayYMD: string): number[] {
  const buckets: Record<string, number> = {};
  for (const r of rows) {
    const key = r.createdAt.toLocaleDateString('en-CA', { timeZone: TZ });
    buckets[key] = (buckets[key] ?? 0) + 1;
  }
  const base = new Date(todayYMD + 'T00:00:00Z');
  const out: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(base.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    out.push(buckets[key] ?? 0);
  }
  return out;
}

// Alimente le rafraîchissement live des 4 cases "Aujourd'hui" du dashboard
// (/natha-admin) — voir TodayStatsLive.tsx, interrogée toutes les ~20s.
// Ne reprend QUE les compteurs "aujourd'hui" + 7 jours (indexés sur
// createdAt/path/paid), jamais les grosses requêtes all-time (groupBy pages,
// tous les affiliés, tous les Conversion/QuizResult jamais créés) qui vivent
// sur la page complète : celles-ci ne changent pas seconde par seconde et
// n'ont aucune raison d'être ré-exécutées à chaque poll.
// "En ligne maintenant" = visiteurs distincts (visitorId anonyme, ou userId
// à défaut) ayant chargé une page dans les 5 dernières minutes. PageView ne
// pousse pas de battement de cœur continu (juste à chaque navigation), donc
// une fenêtre trop courte ferait clignoter le chiffre à 0 entre deux clics —
// 5 min est le compromis standard pour ce genre d'indicateur "live".
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

async function countOnlineNow(now: Date): Promise<number> {
  const rows = await prisma.pageView.findMany({
    where: { createdAt: { gte: new Date(now.getTime() - ONLINE_WINDOW_MS) } },
    select: { visitorId: true, userId: true },
  });
  const distinct = new Set(rows.map((r) => r.visitorId ?? r.userId).filter((v): v is string => !!v));
  return distinct.size;
}

export async function GET() {
  const now = new Date();
  const todayParis = now.toLocaleDateString('en-CA', { timeZone: TZ });
  const startOfToday = parisMidnight(todayParis);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [visitsToday, landingToday, newToday, paidToday, onlineNow, visits7dRows, landing7dRows, signups7dRows, paid7dRows] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.pageView.count({ where: { path: '/', createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    countOnlineNow(now),
    prisma.pageView.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.pageView.findMany({ where: { path: '/', createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.quizResult.findMany({ where: { paid: true, createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
  ]);

  return NextResponse.json({
    visitsToday,
    landingToday,
    newToday,
    paidToday,
    onlineNow,
    visitsSpark: bucketByDay(visits7dRows, 7, todayParis),
    landingSpark: bucketByDay(landing7dRows, 7, todayParis),
    signupsSpark: bucketByDay(signups7dRows, 7, todayParis),
    paidSpark: bucketByDay(paid7dRows, 7, todayParis),
    updatedAt: now.toISOString(),
  });
}
