export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import AccessCodeWidget from './AccessCodeWidget';
import AffiliateCreateWidget from './AffiliateCreateWidget';
import TodayStatsLive from './TodayStatsLive';
import { describeOrigin, pageLabel } from '@/lib/userActivity';

export const metadata: Metadata = {
  title: 'Mon tableau de bord',
  robots: { index: false, follow: false },
};

function euros(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function pct(a: number, b: number) {
  if (b === 0) return '—';
  return ((a / b) * 100).toFixed(1) + '%';
}

const TZ = 'Europe/Paris';

// Returns the UTC Date corresponding to midnight Paris time for a given date string "YYYY-MM-DD"
function parisMidnight(dateStr: string): Date {
  const utcMid = new Date(dateStr + 'T00:00:00Z');
  // How many hours into the Paris day does UTC midnight fall? That's the Paris offset.
  const parisHour = +new Intl.DateTimeFormat('en', { timeZone: TZ, hour: 'numeric', hour12: false }).format(utcMid);
  return new Date(utcMid.getTime() - parisHour * 3_600_000);
}

// Groupe des lignes horodatées en compteurs quotidiens (jour Paris), sur les
// `days` derniers jours en terminant sur `todayYMD` inclus. `todayYMD` sert
// juste d'ancre de calendrier (pas d'heure précise) — pas de souci de DST.
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

// Mini-courbe inline dans une case KPI — signature App Store Connect /
// Play Console. Construite uniquement à partir de vraies données déjà
// requêtées (bucketByDay), jamais estimée. Encore utilisée ici pour
// "Utilisateurs actifs par jour" (les 4 cases "Aujourd'hui" ont leur propre
// copie dans TodayStatsLive.tsx, rafraîchie en direct).
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 100, h = 28;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => {
    const x = values.length > 1 ? (i / (values.length - 1)) * w : w / 2;
    const y = h - (v / max) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = 'M' + pts.join(' L');
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block', marginTop: 10 }}>
      <path d={area} fill={color} opacity={0.14} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Regroupe des lignes {userId, day} en nombre d'UTILISATEURS DISTINCTS par
// jour (pas un simple compte de lignes) — sert au graphe "actifs par jour".
// `day` est déjà une chaîne "YYYY-MM-DD" fuseau Paris (ChatUsage/JournalEntry
// la stockent nativement ; ConversationAnalysis doit être convertie avant).
function distinctUsersByDay(rows: { userId: string; day: string }[], days: number, todayYMD: string): number[] {
  const byDay: Record<string, Set<string>> = {};
  for (const r of rows) {
    if (!byDay[r.day]) byDay[r.day] = new Set();
    byDay[r.day].add(r.userId);
  }
  const base = new Date(todayYMD + 'T00:00:00Z');
  const out: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(base.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    out.push(byDay[key]?.size ?? 0);
  }
  return out;
}

// Utilisateurs distincts actifs depuis `sinceYMD` inclus (comparaison lexico
// valide car "YYYY-MM-DD" trie comme des dates).
function distinctUsersSince(rows: { userId: string; day: string }[], sinceYMD: string): number {
  const set = new Set<string>();
  for (const r of rows) if (r.day >= sinceYMD) set.add(r.userId);
  return set.size;
}

// "Personnes venues"/"Sur la page d'accueil" doivent compter des VISITEURS
// distincts, pas des PageView brutes — un seul visiteur qui traverse 7 pages
// (accueil → login → OTP → bienvenue → journal…) ne doit compter que pour 1,
// pas pour 7 (bug repéré le 06/08 : le compteur gonflait le vrai trafic de
// plusieurs fois, faussant toute lecture du dashboard). Identité = compte
// connecté si présent, sinon visitorId anonyme (lib/visitorId.ts). Même
// logique que /api/natha-admin/today/route.ts.
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

export default async function NathaAdminPage({ searchParams }: { searchParams?: { q?: string } }) {
  const now = new Date();
  const todayParis  = now.toLocaleDateString('en-CA', { timeZone: TZ }); // "2026-06-12"
  const monthParis  = todayParis.slice(0, 7) + '-01';                    // "2026-06-01"

  const startOfToday = parisMidnight(todayParis);
  const startOfMonth = parisMidnight(monthParis);
  const sevenDaysAgo = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
  const fourteenAgo  = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const sevenAgoYMD    = sevenDaysAgo.toLocaleDateString('en-CA', { timeZone: TZ });
  const fourteenAgoYMD = fourteenAgo.toLocaleDateString('en-CA', { timeZone: TZ });

  const [
    totalUsers, premiumUsers, newToday, newThisWeek, newLastWeek,
    totalResults, paidResults, paidToday, paidThisWeek, paidLastWeek,
    visitsTodayRows, visitsWeekRows, visitsLastWeekRows, visitsTotalRows,
    landingTodayRows, landingTotalRows,
    topPages, recentUsers, affiliates, quizResults, allConversions,
  ] = await Promise.all([
    prisma.user.count(),
    // Exclude synthetic access-code testers (@urcecret.app) from real client counts.
    // "Premium" ici = tout palier payant récurrent (starter/plus/premium) — avant ce
    // fix, ne comptait que tier==='premium' et ratait tous les abonnés Starter/Plus
    // introduits depuis (voir lib/plans.ts).
    prisma.user.count({ where: { tier: { in: ['starter', 'plus', 'premium'] }, NOT: { email: { endsWith: '@urcecret.app' } } } }),
    // "Nouveau compte" = vraie activation (EmailLog de bienvenue, voir
    // lib/notifySignup.ts), pas User.createdAt — voir le même commentaire
    // dans app/api/natha-admin/today/route.ts.
    prisma.emailLog.count({ where: { type: 'welcome', sentAt: { gte: startOfToday } } }),
    prisma.emailLog.count({ where: { type: 'welcome', sentAt: { gte: sevenDaysAgo } } }),
    prisma.emailLog.count({ where: { type: 'welcome', sentAt: { gte: fourteenAgo, lt: sevenDaysAgo } } }),
    prisma.quizResult.count(),
    prisma.quizResult.count({ where: { paid: true } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: sevenDaysAgo } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: fourteenAgo, lt: sevenDaysAgo } } }),
    // findMany + distinctVisitorsCount plutôt que count() brut : un même
    // visiteur qui traverse plusieurs pages ne doit compter qu'une fois
    // (voir le commentaire sur distinctVisitorsCount ci-dessus).
    prisma.pageView.findMany({ where: { createdAt: { gte: startOfToday } }, select: { visitorId: true, userId: true } }),
    prisma.pageView.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { visitorId: true, userId: true } }),
    prisma.pageView.findMany({ where: { createdAt: { gte: fourteenAgo, lt: sevenDaysAgo } }, select: { visitorId: true, userId: true } }),
    prisma.pageView.findMany({ select: { visitorId: true, userId: true } }),
    prisma.pageView.findMany({ where: { path: '/', createdAt: { gte: startOfToday } }, select: { visitorId: true, userId: true } }),
    prisma.pageView.findMany({ where: { path: '/' }, select: { visitorId: true, userId: true } }),
    prisma.pageView.groupBy({ by: ['path'], _count: { path: true }, orderBy: { _count: { path: 'desc' } }, take: 8 }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 30, select: { id: true, email: true, name: true, tier: true, createdAt: true, onboardingGoal: true } }),
    prisma.affiliate.findMany({ include: { conversions: true }, orderBy: { createdAt: 'desc' } }).then(async (aff) => {
      const clicks = await Promise.all(aff.map(a => prisma.pageView.count({ where: { path: `/__aff/${a.slug}` } })));
      return aff.map((a, i) => ({ ...a, clicks: clicks[i] }));
    }),
    prisma.quizResult.findMany({ select: { quizSlug: true, paid: true } }),
    // Conversion (pas AffiliateConversion) : le vrai livre de comptes, une ligne
    // par paiement Stripe réussi, affilié ou non. AffiliateConversion n'existe
    // QUE pour les ventes venues d'un lien d'affilié (voir /api/webhook) — l'utiliser
    // ici affichait 0 € dès que les ventes du mois venaient du trafic direct/TikTok.
    prisma.conversion.findMany({ select: { amountCents: true, createdAt: true } }),
  ]);
  const visitsToday = distinctVisitorsCount(visitsTodayRows);
  const visitsWeek = distinctVisitorsCount(visitsWeekRows);
  const visitsLastWeek = distinctVisitorsCount(visitsLastWeekRows);
  const visitsTotal = distinctVisitorsCount(visitsTotalRows);
  const landingToday = distinctVisitorsCount(landingTodayRows);
  const landingTotal = distinctVisitorsCount(landingTotalRows);

  // ── Recherche par email/nom — un compte peut payer des jours ou des mois
  // après son inscription (voir la question posée depuis Stripe : "il a payé
  // aujourd'hui mais n'a pas créé de compte aujourd'hui, d'où vient-il ?"),
  // donc il n'apparaît pas forcément dans "recentUsers" (30 derniers inscrits).
  // Cette recherche retrouve n'importe quel compte et affiche directement son
  // Origine (même calcul que la fiche /natha-admin/user/[id], voir
  // lib/userActivity.ts::describeOrigin) sans clic supplémentaire.
  const searchQuery = searchParams?.q?.trim() ?? '';
  const searchResults = searchQuery.length >= 2
    ? await (async () => {
        const matches = await prisma.user.findMany({
          where: {
            OR: [
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { name: { contains: searchQuery, mode: 'insensitive' } },
            ],
          },
          select: { id: true, email: true, name: true, tier: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });
        return Promise.all(matches.map(async (u) => {
          const sourced = await prisma.pageView.findFirst({
            where: { userId: u.id, NOT: { source: null } },
            orderBy: { createdAt: 'asc' },
            select: { source: true },
          });
          return { ...u, origin: describeOrigin(sourced?.source ?? null) };
        }));
      })()
    : [];

  // ── Mini-courbes 7 jours pour les cases "Aujourd'hui" (style App Store
  // Connect) — un point par jour, construit à partir des vraies lignes
  // horodatées des 7 derniers jours (bucketByDay), rien d'estimé.
  const [visits7dRows, landing7dRows, signups7dRows, paid7dRows] = await Promise.all([
    prisma.pageView.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true, visitorId: true, userId: true } }),
    prisma.pageView.findMany({ where: { path: '/', createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true, visitorId: true, userId: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
    prisma.quizResult.findMany({ where: { paid: true, createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
  ]);
  const visitsSpark  = distinctVisitorsByDay(visits7dRows, 7, todayParis);
  const landingSpark = distinctVisitorsByDay(landing7dRows, 7, todayParis);
  const signupsSpark = bucketByDay(signups7dRows, 7, todayParis);
  const paidSpark     = bucketByDay(paid7dRows, 7, todayParis);

  // "En ligne maintenant" — qui, pas juste combien — juste la valeur au
  // moment du rendu serveur, pour que la case ne parte pas de 0/vide avant
  // le premier poll de TodayStatsLive (voir /api/natha-admin/today::getOnlineNow,
  // même calcul).
  const onlineNowRows = await prisma.pageView.findMany({
    where: { createdAt: { gte: new Date(now.getTime() - 5 * 60 * 1000) } },
    select: { visitorId: true, userId: true, path: true },
    orderBy: { createdAt: 'desc' },
  });
  const onlineSeen = new Set<string>();
  const onlineLatest: { key: string; userId: string | null; path: string }[] = [];
  for (const r of onlineNowRows) {
    const key = r.userId ?? r.visitorId;
    if (!key || onlineSeen.has(key)) continue;
    onlineSeen.add(key);
    onlineLatest.push({ key, userId: r.userId, path: r.path });
  }
  const onlineUserIds = onlineLatest.map((v) => v.userId).filter((id): id is string => !!id);
  const onlineUsers = onlineUserIds.length
    ? await prisma.user.findMany({ where: { id: { in: onlineUserIds } }, select: { id: true, name: true, email: true } })
    : [];
  const onlineUserById = new Map(onlineUsers.map((u) => [u.id, u]));
  const onlineVisitors = onlineLatest.map((v) => {
    const user = v.userId ? onlineUserById.get(v.userId) : null;
    return {
      userId: v.userId,
      label: user ? (user.name || user.email || 'Compte') : 'Visiteur anonyme',
      page: pageLabel(v.path),
    };
  });
  const onlineNow = onlineVisitors.length;

  // Quiz drop-off funnel (MBTI personnalite)
  // Note : pas de step "Q10" ici — le tracker de milestones (PersonnaliteClient.tsx)
  // n'écrit jamais /__quiz/q10 (seulement q25/q50/q75, basés sur % de progression,
  // pas sur le numéro de question). Un ancien "Q10 atteinte" était affiché ici alors
  // qu'il était toujours à 0 — funnel cassé (étape fantôme). Retiré plutôt que
  // recréé, pour ne pas ajouter un nouvel événement non demandé.
  const [fStart, fQ25, fQ50, fQ75, fComplete, fPaywall, fCheckout] = await Promise.all([
    prisma.pageView.count({ where: { path: '/__evt/quiz_start/personnalite' } }),
    prisma.pageView.count({ where: { path: '/__quiz/q25' } }),
    prisma.pageView.count({ where: { path: '/__quiz/q50' } }),
    prisma.pageView.count({ where: { path: '/__quiz/q75' } }),
    prisma.pageView.count({ where: { path: '/__evt/quiz_complete/personnalite' } }),
    prisma.pageView.count({ where: { path: '/__evt/paywall_view/personnalite' } }),
    prisma.pageView.count({ where: { path: '/__evt/checkout_click/personnalite' } }),
  ]);

  // Diagnostic funnel steps (last 24h)
  const diagSteps = [
    'page_load', 'inapp_detected',
    'session_restore_fired',
    'pending_found_authed', 'pending_found_not_authed',
    'type_from_localstorage', 'type_from_localstorage_not_authed',
    'analysis_done',
    'paywall_mounted',
    'inapp_signup_click',
    'checkout_no_email', 'checkout_with_email',
    'auto_checkout_check',
  ];
  const diagCounts = await Promise.all(
    diagSteps.map(step => prisma.pageView.count({ where: { path: `/__diag/${step}`, createdAt: { gte: sevenDaysAgo } } }))
  );
  const diagData = diagSteps.map((step, i) => ({ step, count: diagCounts[i] }));

  const recentCodes = await prisma.accessCode.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, code: true, note: true, used: true, usedByEmail: true },
  });

  // ── Rétention & engagement (Elio + Journal) ────────────────────────────────
  // "Actif" = a utilisé Elio (ChatUsage>0), écrit dans son Journal, OU fait
  // analyser une conversation ce jour-là — le seul signal d'activité qui
  // existe aujourd'hui (pas de colonne "dernière connexion" sur User).
  const [chatUsageRows, journalDayRows, convAnalysisRows, novaUserRows, journalUserRows] = await Promise.all([
    prisma.chatUsage.findMany({ where: { day: { gte: fourteenAgoYMD }, count: { gt: 0 } }, select: { userId: true, day: true } }),
    prisma.journalEntry.findMany({ where: { day: { gte: fourteenAgoYMD } }, select: { userId: true, day: true } }),
    prisma.conversationAnalysis.findMany({ where: { createdAt: { gte: fourteenAgo } }, select: { userId: true, createdAt: true } }),
    prisma.chatMessage.findMany({ distinct: ['userId'], select: { userId: true } }),
    prisma.journalEntry.findMany({ distinct: ['userId'], select: { userId: true } }),
  ]);
  const activityRows14d = [
    ...chatUsageRows,
    ...journalDayRows,
    ...convAnalysisRows.map(r => ({ userId: r.userId, day: r.createdAt.toLocaleDateString('en-CA', { timeZone: TZ }) })),
  ];
  const activeSpark14d = distinctUsersByDay(activityRows14d, 14, todayParis);
  const activeToday     = distinctUsersSince(activityRows14d, todayParis);
  const activeThisWeek  = distinctUsersSince(activityRows14d, sevenAgoYMD);

  const novaUserIds    = new Set(novaUserRows.map(r => r.userId));
  const journalUserIds = new Set(journalUserRows.map(r => r.userId));
  const novaTotal    = novaUserIds.size;
  const journalTotal = journalUserIds.size;
  const bothIds = [...novaUserIds].filter(id => journalUserIds.has(id));

  // Détail des gens qui reviennent pour LES DEUX (ta demande : "qui a testé
  // Elio ET le calendrier") — dernière activité de chaque côté, triés par le
  // plus récent des deux, plafonné à 30 lignes (curiosité manuelle, pas une
  // liste paginée).
  const [lastNovaByUser, lastJournalByUser, bothUsers] = bothIds.length
    ? await Promise.all([
        prisma.chatMessage.groupBy({ by: ['userId'], where: { userId: { in: bothIds } }, _max: { createdAt: true } }),
        prisma.journalEntry.groupBy({ by: ['userId'], where: { userId: { in: bothIds } }, _max: { day: true } }),
        prisma.user.findMany({ where: { id: { in: bothIds } }, select: { id: true, email: true, name: true, tier: true } }),
      ])
    : [[], [], []];
  const lastNovaMap = new Map(lastNovaByUser.map(r => [r.userId, r._max.createdAt]));
  const lastJournalMap = new Map(lastJournalByUser.map(r => [r.userId, r._max.day]));
  const returningUsers = bothUsers
    .map(u => {
      const lastNova = lastNovaMap.get(u.id) ?? null;
      const lastJournalDay = lastJournalMap.get(u.id) ?? null;
      const lastNovaYMD = lastNova ? lastNova.toLocaleDateString('en-CA', { timeZone: TZ }) : null;
      const mostRecent = [lastNovaYMD, lastJournalDay].filter(Boolean).sort().pop() ?? '';
      return { ...u, lastNovaYMD, lastJournalDay, mostRecent };
    })
    .sort((a, b) => (a.mostRecent < b.mostRecent ? 1 : -1))
    .slice(0, 30);

  const revenueToday = allConversions.filter(c => new Date(c.createdAt) >= startOfToday).reduce((s, c) => s + c.amountCents, 0);
  const revenueWeek  = allConversions.filter(c => new Date(c.createdAt) >= sevenDaysAgo).reduce((s, c) => s + c.amountCents, 0);
  const revenueMonth = allConversions.filter(c => new Date(c.createdAt) >= startOfMonth).reduce((s, c) => s + c.amountCents, 0);
  const revenueTotal = allConversions.reduce((s, c) => s + c.amountCents, 0);

  // ── MRR réel ──────────────────────────────────────────────────────────────
  // Tous les paliers récurrents : starter (1,99€/mo), plus (5€/mo), premium
  // mensuel (9,99€/mo) ou annuel (29,99€/an). On EXCLUT :
  //  • les codes de test (jamais de Conversion)
  //  • les achats uniques (productType = 'onetime' / 'rapport' / 'fusion')
  // Et on ne compte que les abonnés encore actifs (tier non résilié). Avant ce
  // fix, le filtre ne reconnaissait que 'monthly'/'annual' et le palier 'premium'
  // — Starter et Plus (ajoutés depuis) tombaient tous les deux à 0.
  const PLAN_RATE_CENTS: Record<string, number> = {
    starter: 199,
    plus: 500,
    monthly: 999,
    annual: Math.round(2999 / 12),
  };
  const subConversions = await prisma.conversion.findMany({
    where: { productType: { in: ['starter', 'plus', 'monthly', 'annual'] } },
    select: { email: true, productType: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  const planByEmail = new Map<string, string>();
  for (const c of subConversions) {
    if (c.email && !planByEmail.has(c.email)) planByEmail.set(c.email, c.productType ?? 'monthly');
  }
  const subEmails = Array.from(planByEmail.keys());
  const activeSubs = subEmails.length
    ? await prisma.user.findMany({ where: { email: { in: subEmails }, tier: { in: ['starter', 'plus', 'premium'] } }, select: { email: true } })
    : [];
  const planCounts: Record<string, number> = { starter: 0, plus: 0, monthly: 0, annual: 0 };
  for (const u of activeSubs) {
    const plan = planByEmail.get(u.email ?? '') ?? 'monthly';
    planCounts[plan] = (planCounts[plan] ?? 0) + 1;
  }
  const subscriberCount = activeSubs.length;
  const MRR = Object.entries(planCounts).reduce((sum, [plan, n]) => sum + n * (PLAN_RATE_CENTS[plan] ?? 0), 0);
  const planLabel: Record<string, string> = { starter: 'starter', plus: 'plus', monthly: 'mensuel', annual: 'annuel' };
  const planBreakdown = Object.entries(planCounts)
    .filter(([, n]) => n > 0)
    .map(([plan, n]) => `${n} ${planLabel[plan]}`)
    .join(' + ');

  const byQuiz: Record<string, { total: number; paid: number }> = {};
  for (const r of quizResults) {
    if (!byQuiz[r.quizSlug]) byQuiz[r.quizSlug] = { total: 0, paid: 0 };
    byQuiz[r.quizSlug].total++;
    if (r.paid) byQuiz[r.quizSlug].paid++;
  }
  void byQuiz; // conservé pour usage futur (détail par quiz) — pas affiché sur cette page

  function arrow(current: number, previous: number) {
    if (previous === 0) return current > 0 ? '↑' : '';
    return current >= previous ? '↑' : '↓';
  }
  function trendColor(current: number, previous: number) {
    if (previous === 0) return current > 0 ? C.good : C.muted;
    return current >= previous ? C.good : C.critical;
  }

  // ── Design system — identique à /admin : cockpit App Store Connect / Play
  // Console (surface claire, un seul accent bleu, sémantique restreinte), pas
  // l'identité "oracle" ink/gold/serif du site public. Voir PRODUCT.md. ──────
  const C = {
    bg: '#f5f5f7',
    surface: '#ffffff',
    surfaceGood: 'rgba(26,158,70,0.06)',
    border: '#d2d2d7',
    borderSoft: '#e8e8ed',
    text: '#1d1d1f',
    muted: '#6e6e73',
    faint: '#98989d',
    primary: '#0071e3',
    good: '#1a9e46',
    goodBorder: 'rgba(26,158,70,0.25)',
    warn: '#c26a00',
    critical: '#d70015',
    violet: '#af52de',
  };

  const block = (bg: string, border: string): React.CSSProperties => ({
    background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 20px',
  });

  const label: React.CSSProperties = { color: C.muted, fontSize: 13, fontWeight: 500, margin: 0 };
  const bigNum: React.CSSProperties = { color: C.text, fontSize: 27, fontWeight: 700, margin: '8px 0 0', lineHeight: 1.1, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' };
  const sub: React.CSSProperties = { color: C.muted, fontSize: 12.5, margin: '4px 0 0' };
  const sectionHeading: React.CSSProperties = { color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 12, marginTop: 0 };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-sans), -apple-system, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.01em', color: C.text }}>
            UrCecret<span style={{ color: C.muted, fontWeight: 400, fontSize: 15, marginLeft: 10 }}>— tableau de bord</span>
          </h1>
          <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>
            {now.toLocaleDateString('fr-FR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' })} à {now.toLocaleTimeString('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Recherche par email/nom — retrouve n'importe quel compte, même
            créé il y a des mois, et affiche directement son Origine sans
            avoir à parcourir "Nouveaux inscrits" (limité aux 30 derniers). */}
        <form action="/natha-admin" method="GET" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Chercher un compte par email ou nom…"
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.border}`,
                background: C.surface, color: C.text, fontSize: 14, outline: 'none',
              }}
            />
            <button type="submit" style={{
              padding: '10px 18px', borderRadius: 10, border: 'none', background: C.text,
              color: C.surface, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              Chercher
            </button>
          </div>

          {searchQuery.length >= 2 && (
            <div style={{ marginTop: 14 }}>
              {searchResults.length === 0 ? (
                <p style={{ color: C.muted, fontSize: 13.5, margin: 0 }}>Aucun compte ne correspond à &laquo;&nbsp;{searchQuery}&nbsp;&raquo;.</p>
              ) : (
                <div style={{ ...block(C.surface, C.border), padding: 0 }}>
                  {searchResults.map((u, i) => (
                    <Link
                      key={u.id}
                      href={`/natha-admin/user/${u.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                        padding: '14px 18px', textDecoration: 'none', color: 'inherit',
                        borderBottom: i < searchResults.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.text }}>{u.name || u.email}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12.5, color: C.muted }}>{u.email} · {u.tier} · inscrit le {u.createdAt.toLocaleDateString('fr-FR', { timeZone: TZ })}</p>
                      </div>
                      <p style={{
                        margin: 0, fontSize: 12, fontWeight: 600, flexShrink: 0, textAlign: 'right',
                        color: u.origin.kind === 'affiliate' ? C.good : u.origin.kind === 'external' ? C.primary : C.faint,
                      }}>
                        {u.origin.label}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>

        {/* ── SECTION 1 : Ce qui s'est passé aujourd'hui — live, voir TodayStatsLive ── */}
        <p style={sectionHeading}>Aujourd&apos;hui</p>
        <TodayStatsLive
          initial={{
            visitsToday, landingToday, newToday, paidToday, onlineNow, onlineVisitors,
            visitsSpark, landingSpark, signupsSpark, paidSpark,
            updatedAt: now.toISOString(),
          }}
        />

        {/* ── SECTION 2 : Cette semaine vs semaine dernière ── */}
        <p style={sectionHeading}>Cette semaine vs semaine dernière</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>

          {[
            { label: 'Visiteurs', current: visitsWeek, previous: visitsLastWeek, unit: '' },
            { label: 'Nouveaux inscrits', current: newThisWeek, previous: newLastWeek, unit: '' },
            { label: 'Quiz payés', current: paidThisWeek, previous: paidLastWeek, unit: '' },
          ].map(({ label: l, current, previous, unit }) => (
            <div key={l} style={block(C.surface, C.border)}>
              <p style={label}>{l}</p>
              <p style={{ ...bigNum, color: trendColor(current, previous) }}>
                {arrow(current, previous)} {current}{unit}
              </p>
              <p style={sub}>était {previous}{unit} la sem. d&apos;avant</p>
            </div>
          ))}

          <div style={block(C.surface, C.border)}>
            <p style={label}>Argent entré</p>
            <p style={{ ...bigNum, color: revenueWeek > 0 ? C.good : C.text }}>{euros(revenueWeek)}</p>
            <p style={sub}>cette semaine (affiliés)</p>
          </div>

        </div>

        {/* ── SECTION 3 : Argent ── */}
        <p style={sectionHeading}>Argent</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>

          <div style={{ ...block(C.surfaceGood, C.goodBorder), gridColumn: '1 / -1' }}>
            <p style={label}>Revenus mensuels estimés (MRR)</p>
            <p style={{ ...bigNum, fontSize: 34, color: C.good }}>{euros(MRR)}</p>
            <p style={sub}>
              {subscriberCount} abonné{subscriberCount > 1 ? 's' : ''} récurrent{subscriberCount > 1 ? 's' : ''}
              {subscriberCount > 0 ? ` · ${planBreakdown}` : ' (hors codes test & achats one-shot)'}
            </p>
          </div>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Aujourd&apos;hui</p>
            <p style={bigNum}>{euros(revenueToday)}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Ce mois</p>
            <p style={bigNum}>{euros(revenueMonth)}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Total cumulé</p>
            <p style={bigNum}>{euros(revenueTotal)}</p>
          </div>

        </div>

        {/* ── SECTION 4 : Clients ── */}
        <p style={sectionHeading}>Clients</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Inscrits au total</p>
            <p style={bigNum}>{totalUsers}</p>
            <p style={sub}>ont créé un compte</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Clients premium</p>
            <p style={{ ...bigNum, color: C.primary }}>{premiumUsers}</p>
            <p style={sub}>{pct(premiumUsers, totalUsers)} des inscrits · hors codes test</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Quiz complétés</p>
            <p style={bigNum}>{totalResults}</p>
            <p style={sub}>{paidResults} ont payé</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Visite → inscrit</p>
            <p style={bigNum}>{pct(totalUsers, landingTotal)}</p>
            <p style={sub}>sur {landingTotal} vus la home</p>
          </div>

        </div>

        {/* ── SECTION 4bis : Rétention & engagement (Elio + Journal) ──────────
            "Actif" = a utilisé Elio, écrit dans son Journal, ou fait analyser
            une conversation ce jour-là (seul signal d'activité disponible —
            voir distinctUsersByDay). Répond à "combien reviennent chaque
            jour", "combien utilisent Elio / ont un journal", et "qui revient
            pour les deux". ── */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <p style={sectionHeading}>Rétention & engagement</p>
          <span style={{ display: 'flex', gap: 16 }}>
            <Link href="/natha-admin/quetes" style={{ color: C.primary, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Voir les quêtes →
            </Link>
            <Link href="/natha-admin/insights" style={{ color: C.primary, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 12 }}>
              Voir l&apos;analyse détaillée →
            </Link>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 10 }}>

          <div style={block(C.surfaceGood, C.goodBorder)}>
            <p style={label}>Actifs aujourd&apos;hui</p>
            <p style={{ ...bigNum, color: C.good }}>{activeToday}</p>
            <p style={sub}>Elio, Journal ou analyse</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Actifs cette semaine</p>
            <p style={bigNum}>{activeThisWeek}</p>
            <p style={sub}>utilisateurs distincts, 7j</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Utilisent Elio</p>
            <p style={{ ...bigNum, color: C.primary }}>{novaTotal}</p>
            <p style={sub}>{pct(novaTotal, totalUsers)} des inscrits</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Ont un journal</p>
            <p style={{ ...bigNum, color: C.violet }}>{journalTotal}</p>
            <p style={sub}>{pct(journalTotal, totalUsers)} des inscrits</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Elio + Journal</p>
            <p style={bigNum}>{bothIds.length}</p>
            <p style={sub}>utilisent les deux</p>
          </div>

        </div>

        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          <p style={label}>Utilisateurs actifs par jour</p>
          <Sparkline values={activeSpark14d} color={C.good} />
          <p style={{ color: C.faint, fontSize: 11, margin: '8px 0 0' }}>Courbe = 14 derniers jours</p>
        </div>

        <p style={{ ...sectionHeading, fontSize: 13, color: C.muted, fontWeight: 600, marginTop: 4 }}>
          Reviennent pour Elio ET le Journal ({bothIds.length})
        </p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          {returningUsers.length === 0 && (
            <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
              Personne n&apos;a encore utilisé Elio et le Journal tous les deux.
            </p>
          )}
          {returningUsers.map((u, i) => (
            <Link key={u.id} href={`/natha-admin/user/${u.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < returningUsers.length - 1 ? `1px solid ${C.borderSoft}` : 'none', flexWrap: 'wrap', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name ?? u.email ?? 'Anonyme'}
                </p>
                <p style={{ color: C.muted, fontSize: 11.5, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ ...label, marginBottom: 2, fontSize: 11 }}>Dernier Elio</p>
                <p style={{ color: C.primary, fontSize: 12.5, fontWeight: 600, margin: 0 }}>{u.lastNovaYMD ?? '—'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ ...label, marginBottom: 2, fontSize: 11 }}>Dernier Journal</p>
                <p style={{ color: C.violet, fontSize: 12.5, fontWeight: 600, margin: 0 }}>{u.lastJournalDay ?? '—'}</p>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                background: u.tier !== 'free' ? 'rgba(0,113,227,0.08)' : '#f0f0f2',
                color: u.tier !== 'free' ? C.primary : C.muted,
                border: `1px solid ${u.tier !== 'free' ? 'rgba(0,113,227,0.25)' : C.borderSoft}`,
                flexShrink: 0,
              }}>
                {u.tier !== 'free' ? u.tier : 'Gratuit'}
              </span>
            </Link>
          ))}
        </div>

        {/* ── SECTION 5 : Affiliés ── */}
        <p style={sectionHeading}>Tes affiliés</p>
        <AffiliateCreateWidget />
        {affiliates.length === 0 ? (
          <div style={{ ...block(C.surface, C.border), marginBottom: 28, color: C.muted, fontSize: 14 }}>
            Aucun affilié pour l&apos;instant.
          </div>
        ) : (
          <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {affiliates.map(a => {
              const ca = a.conversions.reduce((s, c) => s + c.amountCents, 0);
              const commission = a.conversions.reduce((s, c) => s + c.commissionCents, 0);
              return (
                <div key={a.id} style={{ ...block(C.surface, C.border), display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ color: C.text, fontWeight: 700, fontSize: 15, margin: 0 }}>{a.name}</p>
                    <p style={{ color: C.muted, fontSize: 12, margin: '3px 0 0', fontFamily: 'monospace' }}>?ref={a.slug}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>Clics</p>
                      <p style={{ color: C.primary, fontWeight: 700, fontSize: 19, margin: 0 }}>{a.clicks}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>Tx conv.</p>
                      <p style={{ color: C.violet, fontWeight: 700, fontSize: 19, margin: 0 }}>
                        {a.clicks > 0 ? `${((a.conversions.length / a.clicks) * 100).toFixed(1)}%` : '—'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>Ventes</p>
                      <p style={{ color: C.text, fontWeight: 700, fontSize: 19, margin: 0 }}>{a.conversions.length}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>CA généré</p>
                      <p style={{ color: C.warn, fontWeight: 700, fontSize: 19, margin: 0 }}>{euros(ca)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>À payer</p>
                      <p style={{ color: C.good, fontWeight: 700, fontSize: 19, margin: 0 }}>{euros(commission)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SECTION 7 : Funnel drop-off MBTI ── */}
        <p style={sectionHeading}>Funnel MBTI — où les gens lâchent</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          {fStart === 0 && <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Pas encore de données (tracking actif depuis ce soir).</p>}
          {fStart > 0 && (() => {
            const steps = [
              { label: 'Démarré le quiz', n: fStart, color: C.primary },
              { label: 'Q25 atteinte', n: fQ25, color: C.violet },
              { label: 'Q50 atteinte', n: fQ50, color: C.warn },
              { label: 'Q75 atteinte', n: fQ75, color: '#ff9500' },
              { label: 'Quiz terminé (100)', n: fComplete, color: C.good },
              { label: 'Paywall vu', n: fPaywall, color: '#5e5ce6' },
              { label: 'Paiement cliqué', n: fCheckout, color: C.good },
            ];
            const maxN = steps[0].n || 1;
            return steps.map((s, i) => {
              const pctVal = s.n === 0 ? 0 : Math.round((s.n / maxN) * 100);
              const dropVsNext = i < steps.length - 1 && s.n > 0 && steps[i + 1].n > 0
                ? Math.round(((s.n - steps[i + 1].n) / s.n) * 100) : null;
              return (
                <div key={s.label} style={{ padding: '10px 0', borderBottom: i < steps.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <span style={{ color: C.faint, fontSize: 12, width: 22, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1, color: C.text, fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                    <span style={{ color: s.color, fontSize: 15, fontWeight: 700, minWidth: 30, textAlign: 'right' }}>{s.n}</span>
                    <span style={{ color: C.muted, fontSize: 12, width: 44, textAlign: 'right' }}>{pctVal}%</span>
                    {dropVsNext !== null && <span style={{ color: C.critical, fontSize: 11, fontWeight: 700, width: 52, textAlign: 'right' }}>−{dropVsNext}%</span>}
                  </div>
                  <div style={{ marginLeft: 32, height: 5, borderRadius: 3, background: C.borderSoft, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pctVal}%`, background: s.color, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* ── SECTION 8 : Pages les plus vues ── */}
        <p style={sectionHeading}>Pages les plus vues</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          {topPages.map((p, i) => (
            <div key={p.path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topPages.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
              <span style={{ color: C.faint, fontSize: 13, width: 20, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, color: C.text, fontSize: 13, fontFamily: 'monospace' }}>{p.path}</span>
              <span style={{ color: C.primary, fontSize: 14, fontWeight: 700 }}>{p._count.path}</span>
            </div>
          ))}
          {topPages.length === 0 && <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Aucune visite encore.</p>}
        </div>

        {/* ── SECTION 8 : Derniers inscrits ── */}
        <p style={sectionHeading}>Derniers inscrits</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          {recentUsers.length === 0 && <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Aucun inscrit pour l&apos;instant.</p>}
          {recentUsers.map((u, i) => (
            <Link key={u.id} href={`/natha-admin/user/${u.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recentUsers.length - 1 ? `1px solid ${C.borderSoft}` : 'none', flexWrap: 'wrap', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name ?? u.email ?? 'Anonyme'}
                </p>
                <p style={{ color: C.muted, fontSize: 11.5, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email} · {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  {u.onboardingGoal ? ` · "${u.onboardingGoal}"` : ''}
                </p>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                background: u.tier === 'premium' ? 'rgba(0,113,227,0.08)' : '#f0f0f2',
                color: u.tier === 'premium' ? C.primary : C.muted,
                border: `1px solid ${u.tier === 'premium' ? 'rgba(0,113,227,0.25)' : C.borderSoft}`,
                flexShrink: 0,
              }}>
                {u.tier === 'premium' ? 'Premium' : 'Gratuit'}
              </span>
              <span style={{ color: C.primary, fontSize: 12, flexShrink: 0 }}>Voir tout →</span>
            </Link>
          ))}
        </div>

        {/* ── SECTION 9 : Diagnostic TikTok funnel (7 derniers jours) ── */}
        <p style={sectionHeading}>Diagnostic funnel TikTok — 7 derniers jours</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 0 }}>
          {diagData.map((d, i) => (
            <div key={d.step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < diagData.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
              <span style={{ flex: 1, color: d.count > 0 ? C.text : C.faint, fontSize: 13, fontFamily: 'monospace' }}>
                {'/__diag/' + d.step}
              </span>
              <span style={{
                color: d.count > 0 ? C.warn : C.faint,
                fontSize: 14, fontWeight: 700, minWidth: 32, textAlign: 'right',
              }}>
                {d.count}
              </span>
            </div>
          ))}
          <p style={{ color: C.faint, fontSize: 11.5, marginTop: 12, marginBottom: 0 }}>
            Ces compteurs apparaissent dès qu&apos;un utilisateur atteint l&apos;étape correspondante. Zéro = l&apos;étape n&apos;a pas été atteinte.
          </p>
        </div>

        {/* ── SECTION 10 : Codes d'accès ── */}
        <p style={{ ...sectionHeading, marginTop: 28 }}>Codes d&apos;accès</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 0 }}>
          <AccessCodeWidget initial={recentCodes} />
        </div>

      </div>
    </div>
  );
}
