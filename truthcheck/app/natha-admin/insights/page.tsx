export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { EVENTS } from '@/lib/trackEvent';

export const metadata: Metadata = {
  title: 'Suivi précis — UrCecret',
  robots: { index: false, follow: false },
};

const TZ = 'Europe/Paris';

function parisMidnight(dateStr: string): Date {
  const utcMid = new Date(dateStr + 'T00:00:00Z');
  const parisHour = +new Intl.DateTimeFormat('en', { timeZone: TZ, hour: 'numeric', hour12: false }).format(utcMid);
  return new Date(utcMid.getTime() - parisHour * 3_600_000);
}

function ymd(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

function pct(a: number, b: number) {
  if (b === 0) return '—';
  return ((a / b) * 100).toFixed(1) + '%';
}

// Libellés lisibles pour chaque événement du registre lib/trackEvent.ts —
// à étendre ici si un nouvel événement est ajouté là-bas.
const EVENT_LABELS: Record<string, string> = {
  [EVENTS.SIGNED_IN]: 'Connexions',
  [EVENTS.NOVA_MESSAGE_SENT]: 'Messages envoyés à Nova',
  [EVENTS.JOURNAL_ENTRY_SAVED]: 'Entrées de journal enregistrées',
  [EVENTS.JOURNAL_STARTED]: 'Premier journal jamais rempli',
  [EVENTS.CONVERSATION_ANALYZED]: 'Analyses de conversation',
  [EVENTS.TEST_COMPLETED]: 'Tests MBTI complétés',
  [EVENTS.COMPAT_CREATED]: 'Compatibilités créées',
  [EVENTS.PROFIL_AVANCE_GENERATED]: 'Profils avancés générés',
  [EVENTS.QUIZ_CREATED]: 'Tests créés (partage)',
};

export default async function InsightsPage() {
  const now = new Date();
  const todayParis = now.toLocaleDateString('en-CA', { timeZone: TZ });
  const startOfToday = parisMidnight(todayParis);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeTodayPrecise,
    activeWeekPrecise,
    activeMonthPrecise,
    cohortUsers,
    events,
    recentEvents,
  ] = await Promise.all([
    prisma.user.count({ where: { NOT: { email: { endsWith: '@urcecret.app' } } } }),
    prisma.user.count({ where: { lastActiveAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { lastActiveAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { lastActiveAt: { gte: thirtyDaysAgo } } }),
    prisma.user.findMany({
      where: { NOT: { email: { endsWith: '@urcecret.app' } } },
      select: { id: true, createdAt: true },
    }),
    // Table neuve — toujours raisonnable à charger en entier pour l'instant ;
    // à revoir (fenêtre glissante) si le volume d'événements devient conséquent.
    prisma.appEvent.findMany({ where: { userId: { not: null } }, select: { userId: true, event: true, createdAt: true } }),
    prisma.appEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  // ── Rétention D1/D7/D30, calculée sur de vrais événements horodatés ────────
  // "Retenu au jour N" = le compte a généré au moins un AppEvent exactement le
  // jour civil (Paris) N après son inscription — définition classique, pas un
  // "encore actif depuis". Comme AppEvent vient d'être introduit, les cohortes
  // antérieures à son déploiement n'ont mécaniquement aucune donnée aux jours
  // qui précèdent ce déploiement : la précision de ces chiffres augmente
  // naturellement avec le temps, elle ne peut pas être rétroactive.
  const activeDaysByUser = new Map<string, Set<string>>();
  for (const e of events) {
    if (!e.userId) continue;
    if (!activeDaysByUser.has(e.userId)) activeDaysByUser.set(e.userId, new Set());
    activeDaysByUser.get(e.userId)!.add(ymd(e.createdAt));
  }

  function retentionAt(n: number) {
    const cutoff = new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
    let eligible = 0;
    let retained = 0;
    for (const u of cohortUsers) {
      if (u.createdAt > cutoff) continue; // pas encore assez ancien pour ce palier
      eligible++;
      const day0 = ymd(u.createdAt);
      const targetYMD = ymd(new Date(parisMidnight(day0).getTime() + n * 24 * 60 * 60 * 1000));
      if (activeDaysByUser.get(u.id)?.has(targetYMD)) retained++;
    }
    return { eligible, retained, rate: eligible ? Math.round((retained / eligible) * 100) : null };
  }
  const d1 = retentionAt(1);
  const d7 = retentionAt(7);
  const d30 = retentionAt(30);

  // ── Funnel par fonctionnalité — utilisateurs distincts par événement ───────
  const EVENT_LIST = Object.values(EVENTS);
  const byEvent = new Map<string, { totalCount: number; allUsers: Set<string>; todayUsers: Set<string>; weekUsers: Set<string> }>();
  for (const name of EVENT_LIST) byEvent.set(name, { totalCount: 0, allUsers: new Set(), todayUsers: new Set(), weekUsers: new Set() });
  for (const e of events) {
    const bucket = byEvent.get(e.event);
    if (!bucket || !e.userId) continue;
    bucket.totalCount++;
    bucket.allUsers.add(e.userId);
    if (e.createdAt >= startOfToday) bucket.todayUsers.add(e.userId);
    if (e.createdAt >= sevenDaysAgo) bucket.weekUsers.add(e.userId);
  }
  const funnelRows = EVENT_LIST.map((name) => {
    const b = byEvent.get(name)!;
    return {
      name,
      label: EVENT_LABELS[name] ?? name,
      totalCount: b.totalCount,
      uniqueToday: b.todayUsers.size,
      uniqueWeek: b.weekUsers.size,
      uniqueTotal: b.allUsers.size,
    };
  }).sort((a, b) => b.uniqueTotal - a.uniqueTotal);

  // ── Design system — identique à /natha-admin ───────────────────────────────
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

  function retentionColor(rate: number | null) {
    if (rate === null) return C.faint;
    if (rate >= 40) return C.good;
    if (rate >= 20) return C.warn;
    return C.critical;
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-sans), -apple-system, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 80px' }}>

        <div style={{ marginBottom: 32 }}>
          <Link href="/natha-admin" style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>← Retour au tableau de bord</Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '10px 0 0', letterSpacing: '-0.01em', color: C.text }}>
            Suivi précis<span style={{ color: C.muted, fontWeight: 400, fontSize: 15, marginLeft: 10 }}>— rétention, funnels, activité</span>
          </h1>
          <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>
            Basé sur de vrais événements horodatés (table AppEvent) + la dernière activité connue de chaque compte — pas des proxys déduits après coup.
          </p>
        </div>

        {/* ── Actifs précis (User.lastActiveAt) ── */}
        <p style={sectionHeading}>Comptes actifs (précis)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
          <div style={block(C.surfaceGood, C.goodBorder)}>
            <p style={label}>Aujourd&apos;hui</p>
            <p style={{ ...bigNum, color: C.good }}>{activeTodayPrecise}</p>
            <p style={sub}>{pct(activeTodayPrecise, totalUsers)} des inscrits</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>7 derniers jours</p>
            <p style={bigNum}>{activeWeekPrecise}</p>
            <p style={sub}>{pct(activeWeekPrecise, totalUsers)} des inscrits</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>30 derniers jours</p>
            <p style={bigNum}>{activeMonthPrecise}</p>
            <p style={sub}>{pct(activeMonthPrecise, totalUsers)} des inscrits</p>
          </div>
        </div>
        <p style={{ color: C.faint, fontSize: 11, marginTop: -18, marginBottom: 28 }}>
          &quot;Actif&quot; = une navigation authentifiée sur le site (posé à chaque page vue, voir /api/track) — plus précis qu&apos;un simple usage de Nova/Journal.
        </p>

        {/* ── Rétention D1/D7/D30 ── */}
        <p style={sectionHeading}>Rétention</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 8 }}>
          {[{ n: 1, r: d1 }, { n: 7, r: d7 }, { n: 30, r: d30 }].map(({ n, r }) => (
            <div key={n} style={block(C.surface, C.border)}>
              <p style={label}>Rétention J+{n}</p>
              <p style={{ ...bigNum, color: retentionColor(r.rate) }}>{r.rate === null ? '—' : `${r.rate}%`}</p>
              <p style={sub}>{r.retained}/{r.eligible} comptes éligibles</p>
            </div>
          ))}
        </div>
        <p style={{ color: C.faint, fontSize: 11, marginBottom: 28 }}>
          Rétention J+N = le compte est revenu exactement N jours après son inscription. Le tracking précis vient de démarrer : les cohortes anciennes n&apos;ont pas d&apos;historique avant son activation, la mesure devient fiable au fil des jours.
        </p>

        {/* ── Funnel par fonctionnalité ── */}
        <p style={sectionHeading}>Qui utilise quoi</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, padding: '0 0 8px', borderBottom: `1px solid ${C.borderSoft}`, marginBottom: 4 }}>
            <span style={{ flex: 1, color: C.faint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Fonctionnalité</span>
            <span style={{ width: 56, textAlign: 'right', color: C.faint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Auj.</span>
            <span style={{ width: 56, textAlign: 'right', color: C.faint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>7j</span>
            <span style={{ width: 64, textAlign: 'right', color: C.faint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Total</span>
            <span style={{ width: 64, textAlign: 'right', color: C.faint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Events</span>
          </div>
          {funnelRows.map((r, i) => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < funnelRows.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
              <span style={{ flex: 1, color: C.text, fontSize: 13, fontWeight: 600 }}>{r.label}</span>
              <span style={{ width: 56, textAlign: 'right', color: r.uniqueToday > 0 ? C.good : C.faint, fontSize: 13, fontWeight: 700 }}>{r.uniqueToday}</span>
              <span style={{ width: 56, textAlign: 'right', color: C.primary, fontSize: 13, fontWeight: 700 }}>{r.uniqueWeek}</span>
              <span style={{ width: 64, textAlign: 'right', color: C.text, fontSize: 13, fontWeight: 700 }}>{r.uniqueTotal}</span>
              <span style={{ width: 64, textAlign: 'right', color: C.muted, fontSize: 12.5 }}>{r.totalCount}</span>
            </div>
          ))}
          <p style={{ color: C.faint, fontSize: 11, marginTop: 12, marginBottom: 0 }}>
            &quot;Auj./7j/Total&quot; = utilisateurs distincts ayant déclenché l&apos;événement au moins une fois sur la période. &quot;Events&quot; = nombre brut d&apos;occurrences (un même compte peut compter plusieurs fois).
          </p>
        </div>

        {/* ── Activité récente ── */}
        <p style={sectionHeading}>Activité récente</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 0 }}>
          {recentEvents.length === 0 && (
            <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Aucun événement pour l&apos;instant.</p>
          )}
          {recentEvents.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < recentEvents.length - 1 ? `1px solid ${C.borderSoft}` : 'none', flexWrap: 'wrap' }}>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.user?.name ?? e.user?.email ?? 'Compte supprimé'}
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                background: 'rgba(0,113,227,0.08)', color: C.primary, border: '1px solid rgba(0,113,227,0.25)',
                flexShrink: 0,
              }}>
                {EVENT_LABELS[e.event] ?? e.event}
              </span>
              <span style={{ color: C.faint, fontSize: 11.5, flexShrink: 0 }}>
                {e.createdAt.toLocaleString('fr-FR', { timeZone: TZ, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
