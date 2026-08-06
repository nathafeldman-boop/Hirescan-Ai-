import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pageLabel } from '@/lib/userActivity';

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

// "Personnes venues"/"Sur la page d'accueil" doivent compter des VISITEURS
// distincts, pas des PageView brutes — un seul visiteur qui traverse 7 pages
// (accueil → login → OTP → bienvenue → journal…) ne doit compter que pour 1,
// pas pour 7 (bug repéré le 06/08 : le compteur gonflait le vrai trafic de
// plusieurs fois, faussant toute lecture du dashboard). Identité = compte
// connecté si présent, sinon visitorId anonyme (lib/visitorId.ts).
function distinctVisitorsCount(rows: { visitorId: string | null; userId: string | null }[]): number {
  const set = new Set<string>();
  for (const r of rows) {
    const key = r.userId ?? r.visitorId;
    if (key) set.add(key);
  }
  return set.size;
}

function distinctVisitorsByDay(rows: { createdAt: Date; visitorId: string | null; userId: string | null }[], days: number, todayYMD: string): number[] {
  const byDay: Record<string, Set<string>> = {};
  for (const r of rows) {
    const key = r.userId ?? r.visitorId;
    if (!key) continue;
    const day = r.createdAt.toLocaleDateString('en-CA', { timeZone: TZ });
    if (!byDay[day]) byDay[day] = new Set();
    byDay[day].add(key);
  }
  const base = new Date(todayYMD + 'T00:00:00Z');
  const out: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(base.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    out.push(byDay[key]?.size ?? 0);
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

export interface OnlineVisitor {
  userId: string | null;
  label: string;
  page: string;
}

// "Qui" est en ligne, pas juste "combien" — un compte connecté est identifié
// par nom/email et pointe vers sa fiche ; un visiteur anonyme reste "Visiteur
// anonyme" (visitorId n'est qu'un identifiant technique, jamais une identité).
// Une ligne par visiteur distinct = sa page la PLUS RÉCENTE dans la fenêtre
// (rows déjà triées par createdAt desc, donc le premier match par clé gagne).
async function getOnlineNow(now: Date): Promise<{ count: number; visitors: OnlineVisitor[] }> {
  const rows = await prisma.pageView.findMany({
    where: { createdAt: { gte: new Date(now.getTime() - ONLINE_WINDOW_MS) } },
    select: { visitorId: true, userId: true, path: true },
    orderBy: { createdAt: 'desc' },
  });

  const seen = new Set<string>();
  const latestByVisitor: { key: string; userId: string | null; path: string }[] = [];
  for (const r of rows) {
    const key = r.userId ?? r.visitorId;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    latestByVisitor.push({ key, userId: r.userId, path: r.path });
  }

  const userIds = latestByVisitor.map((v) => v.userId).filter((id): id is string => !!id);
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
    : [];
  const userById = new Map(users.map((u) => [u.id, u]));

  const visitors: OnlineVisitor[] = latestByVisitor.map((v) => {
    const user = v.userId ? userById.get(v.userId) : null;
    return {
      userId: v.userId,
      label: user ? (user.name || user.email || 'Compte') : 'Visiteur anonyme',
      page: pageLabel(v.path),
    };
  });

  return { count: visitors.length, visitors };
}

export async function GET() {
  const now = new Date();
  const todayParis = now.toLocaleDateString('en-CA', { timeZone: TZ });
  const startOfToday = parisMidnight(todayParis);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [visitsTodayRows, landingTodayRows, newToday, paidToday, online, visits7dRows, landing7dRows, signups7dRows, paid7dRows] = await Promise.all([
    prisma.pageView.findMany({ where: { createdAt: { gte: startOfToday } }, select: { visitorId: true, userId: true } }),
    prisma.pageView.findMany({ where: { path: '/', createdAt: { gte: startOfToday } }, select: { visitorId: true, userId: true } }),
    // "Nouveau compte" = vraie activation (EmailLog de bienvenue, voir
    // lib/notifySignup.ts), pas User.createdAt : un compte peut être créé "à
    // blanc" un autre jour (ex. capture d'email anonyme pendant un quiz via
    // /api/save-email) puis seulement activé aujourd'hui par une vraie
    // connexion — createdAt raterait ce cas, EmailLog.sentAt non.
    prisma.emailLog.count({ where: { type: 'welcome', sentAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    getOnlineNow(now),
    prisma.pageView.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true, visitorId: true, userId: true } }),
    prisma.pageView.findMany({ where: { path: '/', createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true, visitorId: true, userId: true } }),
    prisma.emailLog.findMany({ where: { type: 'welcome', sentAt: { gte: sevenDaysAgo } }, select: { sentAt: true } }),
    prisma.quizResult.findMany({ where: { paid: true, createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
  ]);
  const visitsToday = distinctVisitorsCount(visitsTodayRows);
  const landingToday = distinctVisitorsCount(landingTodayRows);

  return NextResponse.json({
    visitsToday,
    landingToday,
    newToday,
    paidToday,
    onlineNow: online.count,
    onlineVisitors: online.visitors,
    visitsSpark: distinctVisitorsByDay(visits7dRows, 7, todayParis),
    landingSpark: distinctVisitorsByDay(landing7dRows, 7, todayParis),
    signupsSpark: bucketByDay(signups7dRows.map((r) => ({ createdAt: r.sentAt })), 7, todayParis),
    paidSpark: bucketByDay(paid7dRows, 7, todayParis),
    updatedAt: now.toISOString(),
  });
}
