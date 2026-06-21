export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import Link from 'next/link';

/* ════════════════════════════════════════════════════════════════════════════
   UrCecret — Dashboard exécutif v2
   100% server-rendered. Navigation par ?tab= (URL). Aucun JS client.
   ════════════════════════════════════════════════════════════════════════════ */

const QUIZ_NAMES: Record<string, string> = {
  infidelite: 'Infidélité', adopte: 'Suis-je adopté(e) ?', amoureux: 'Suis-je amoureux ?',
  'vrais-amis': 'Vrais amis', orientation: 'Orientation', narcissique: 'Narcissique',
  'mon-ex': 'Mon ex', manipule: 'Manipulé(e) ?', rompre: 'Dois-je rompre ?',
  jaloux: 'Jaloux/jalouse ?', 'relation-toxique': 'Relation toxique', crush: 'Mon crush',
  burnout: 'Burnout', depression: 'Dépression', 'vrai-amour': 'Vrai amour', personnalite: 'Test MBTI',
};

const C = {
  bg: '#0a0a0f', panel: 'rgba(255,255,255,0.025)', border: 'rgba(255,255,255,0.07)',
  text: '#fafafa', dim: '#71717a', faint: '#3f3f46',
  accent: '#d17d52', accent2: '#e0a380', gold: '#fbbf24', green: '#34d399', red: '#f87171',
};

const TABS = [
  { id: 'overview', label: '📊 Vue d\'ensemble' },
  { id: 'users',    label: '👥 Utilisateurs' },
  { id: 'revenue',  label: '💰 Revenus' },
  { id: 'quiz',     label: '🧩 Quiz' },
  { id: 'sources',  label: '🎯 Sources' },
];

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function eur(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
function n(v: number) { return v.toLocaleString('fr-FR'); }
function mk(d: Date)  { return d.toISOString().slice(0, 7); }
function last12(): string[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return mk(d);
  });
}
function ml(key: string) {
  return new Date(key + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }).replace('.', '');
}
function dt(d: Date) {
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* ── SVG Bar Chart ─────────────────────────────────────────────────────────── */
function BarChart({ labels, values, color, fmtTip }: {
  labels: string[]; values: number[]; color: string; fmtTip?: (v: number) => string;
}) {
  const W = 800, H = 200, pL = 6, pR = 6, pT = 24, pB = 28;
  const iW = W - pL - pR, iH = H - pT - pB;
  const max = Math.max(...values, 1);
  const n2 = labels.length;
  const slot = iW / n2;
  const bW = Math.min(slot * 0.55, 40);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={pL} y1={pT + iH * (1 - p)} x2={W - pR} y2={pT + iH * (1 - p)}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3,7" />
      ))}
      {values.map((v, i) => {
        const h = max > 0 ? (v / max) * iH : 0;
        const x = pL + slot * i + (slot - bW) / 2;
        const y = pT + iH - h;
        const tip = fmtTip ? fmtTip(v) : String(v);
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={Math.max(h, v > 0 ? 3 : 0)} rx={5}
              fill={color} opacity={0.88} />
            {v > 0 && h > 12 && (
              <text x={x + bW / 2} y={y - 5} textAnchor="middle" fontSize={9} fill={C.dim} fontWeight={600}>
                {tip}
              </text>
            )}
            <text x={pL + slot * i + slot / 2} y={H - 8} textAnchor="middle" fontSize={9} fill={C.faint}>
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Components ────────────────────────────────────────────────────────────── */
function Kpi({ label, value, sub, color = C.accent }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderTop: `2px solid ${color}`, borderRadius: 16, padding: '18px 20px' }}>
      <p style={{ fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 900, color: C.text, margin: '8px 0 4px', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function Card({ title, sub, children, noPad }: { title: string; sub?: string; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{title}</p>
        {sub && <p style={{ fontSize: 12, color: C.dim, margin: '3px 0 0' }}>{sub}</p>}
      </div>
      <div style={noPad ? {} : { padding: '20px 22px' }}>{children}</div>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 10, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '11px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#d4d4d8' };

/* ════════════════════════════════════════════════════════════════════════════ */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const tab = params.tab ?? 'overview';

  const now = new Date();
  const todayStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ago7        = new Date(now.getTime() - 7 * 864e5);
  const monthStart  = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart   = new Date(now.getFullYear(), 0, 1);
  const yearAgo     = new Date(now.getTime() - 365 * 864e5);
  const keys        = last12();
  const labels      = keys.map(ml);

  /* ── Données communes (toujours chargées) ── */
  const [totalUsers, premiumUsers, newToday, newWeek, newMonth] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'premium' } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: ago7 } } }),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
  ]);

  const allConversions = await prisma.affiliateConversion.findMany({
    select: { amountCents: true, createdAt: true },
  });
  const totalRev  = allConversions.reduce((s, c) => s + c.amountCents, 0);
  const revToday  = allConversions.filter(c => c.createdAt >= todayStart).reduce((s, c) => s + c.amountCents, 0);
  const revWeek   = allConversions.filter(c => c.createdAt >= ago7).reduce((s, c) => s + c.amountCents, 0);
  const revMonth  = allConversions.filter(c => c.createdAt >= monthStart).reduce((s, c) => s + c.amountCents, 0);
  const revYear   = allConversions.filter(c => c.createdAt >= yearStart).reduce((s, c) => s + c.amountCents, 0);

  const totalResults = await prisma.quizResult.count();
  const paidResults  = await prisma.quizResult.count({ where: { paid: true } });

  const convRate = totalUsers ? (premiumUsers / totalUsers * 100).toFixed(1) : '0';

  /* ── Données par onglet ── */
  // OVERVIEW
  let usersForChart: { createdAt: Date }[] = [];
  if (tab === 'overview') {
    usersForChart = await prisma.user.findMany({ where: { createdAt: { gte: yearAgo } }, select: { createdAt: true } });
  }
  const usersByMonth: Record<string, number> = {};
  usersForChart.forEach(u => { const k = mk(u.createdAt); usersByMonth[k] = (usersByMonth[k] || 0) + 1; });
  const usersSeries = keys.map(k => usersByMonth[k] ?? 0);

  const revByMonth: Record<string, number> = {};
  if (tab === 'overview' || tab === 'revenue') {
    allConversions.forEach(c => { const k = mk(c.createdAt); revByMonth[k] = (revByMonth[k] || 0) + c.amountCents; });
  }
  const revSeries = keys.map(k => revByMonth[k] ?? 0);

  // USERS
  let allUsers: { id: string; email: string | null; name: string | null; tier: string; createdAt: Date; _count: { quizResults: number } }[] = [];
  if (tab === 'users') {
    allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: { id: true, email: true, name: true, tier: true, createdAt: true, _count: { select: { quizResults: true } } },
    });
  }
  const premiumUsersList  = allUsers.filter(u => u.tier === 'premium');
  const freeUsersList     = allUsers.filter(u => u.tier !== 'premium');

  // QUIZ
  let allResults: { quizSlug: string; score: number; paid: boolean; createdAt: Date }[] = [];
  if (tab === 'quiz') {
    allResults = await prisma.quizResult.findMany({ select: { quizSlug: true, score: true, paid: true, createdAt: true } });
  }
  const byQuiz: Record<string, { count: number; paid: number; score: number }> = {};
  allResults.forEach(r => {
    if (!byQuiz[r.quizSlug]) byQuiz[r.quizSlug] = { count: 0, paid: 0, score: 0 };
    byQuiz[r.quizSlug].count++; if (r.paid) byQuiz[r.quizSlug].paid++; byQuiz[r.quizSlug].score += r.score;
  });
  const quizRows = Object.entries(byQuiz)
    .map(([slug, d]) => ({ slug, name: QUIZ_NAMES[slug] ?? slug, count: d.count, paid: d.paid, avg: d.count ? Math.round(d.score / d.count) : 0, rate: d.count ? (d.paid / d.count * 100) : 0 }))
    .sort((a, b) => b.count - a.count);
  const maxQuiz = Math.max(...quizRows.map(q => q.count), 1);

  // SOURCES
  type ConvRow = { id: string; email: string | null; amountCents: number; quizSlug: string | null; productType: string | null; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; affiliateSlug: string | null; landingPath: string | null; createdAt: Date };
  let attribution: ConvRow[] = [];
  if (tab === 'sources') {
    try {
      attribution = await prisma.conversion.findMany({
        orderBy: { createdAt: 'desc' }, take: 200,
        select: { id: true, email: true, amountCents: true, quizSlug: true, productType: true, utmSource: true, utmMedium: true, utmCampaign: true, affiliateSlug: true, landingPath: true, createdAt: true },
      });
    } catch { /* table pas encore en prod */ }
  }
  const srcMap: Record<string, { count: number; rev: number }> = {};
  attribution.forEach(c => {
    const src = c.utmSource ?? (c.affiliateSlug ? `aff:${c.affiliateSlug}` : 'organique');
    if (!srcMap[src]) srcMap[src] = { count: 0, rev: 0 };
    srcMap[src].count++; srcMap[src].rev += c.amountCents;
  });
  const sources = Object.entries(srcMap).sort((a, b) => b[1].rev - a[1].rev);
  const maxSrc = Math.max(...sources.map(([, v]) => v.rev), 1);

  /* ── Layout ──────────────────────────────────────────────────────────────── */
  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: 'rgba(10,10,15,0.94)', backdropFilter: 'blur(14px)', zIndex: 20 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 17, fontWeight: 900 }}>
              <span style={{ color: C.accent }}>Ur</span><span>Cecret</span>
            </span>
            <span style={{ fontSize: 11, color: C.faint, fontWeight: 400, marginLeft: 8 }}>Dashboard</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12 }}>
            <span style={{ color: C.green }}>{n(premiumUsers)} premium</span>
            <span style={{ color: C.gold, fontWeight: 700 }}>{eur(totalRev)}</span>
            <span style={{ color: C.faint }}>{dt(now)}</span>
          </div>
        </div>

        {/* Tabs */}
        <nav style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 2, overflowX: 'auto' }}>
          {TABS.map(t => (
            <Link key={t.id} href={`?tab=${t.id}`} style={{
              display: 'inline-block', padding: '10px 18px', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
              color: tab === t.id ? C.accent : C.dim,
              borderBottom: tab === t.id ? `2px solid ${C.accent}` : '2px solid transparent',
            }}>{t.label}</Link>
          ))}
        </nav>
      </header>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* ════ OVERVIEW ════ */}
        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <Kpi label="Revenu total"       value={eur(totalRev)}   color={C.gold} />
              <Kpi label="Ce mois"            value={eur(revMonth)}   color={C.green} />
              <Kpi label="Cette année"        value={eur(revYear)}    color={C.accent} />
              <Kpi label="Utilisateurs"       value={n(totalUsers)}   sub={`+${newToday} aujourd'hui`} />
              <Kpi label="Premium"            value={n(premiumUsers)} sub={`${convRate}% conversion`} color={C.accent2} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
              <Card title="Revenu · 12 mois" sub="conversions affiliées enregistrées">
                <BarChart labels={labels} values={revSeries} color={C.gold}
                  fmtTip={v => v >= 100 ? eur(v) : ''} />
              </Card>
              <Card title="Nouveaux utilisateurs · 12 mois">
                <BarChart labels={labels} values={usersSeries} color={C.accent}
                  fmtTip={v => v > 0 ? n(v) : ''} />
              </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Kpi label="Aujourd'hui"    value={eur(revToday)}     color={C.green} />
              <Kpi label="7 derniers j."  value={eur(revWeek)}      color={C.green} />
              <Kpi label="Quiz complétés" value={n(totalResults)}   sub={`${paidResults} payants`} />
              <Kpi label="Nouveaux 7j"    value={n(newWeek)}        sub={`${n(newMonth)} ce mois`} />
            </div>
          </>
        )}

        {/* ════ USERS ════ */}
        {tab === 'users' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              <Kpi label="Total"       value={n(totalUsers)} />
              <Kpi label="Premium"     value={n(premiumUsers)} color={C.accent2} />
              <Kpi label="Gratuits"    value={n(totalUsers - premiumUsers)} color={C.dim} />
              <Kpi label="Conversion"  value={`${convRate}%`} color={C.green} />
              <Kpi label="Nouveaux 7j" value={n(newWeek)} color={C.gold} />
            </div>

            {/* Premium users — emails visibles */}
            <Card title={`👑 Clients premium — ${premiumUsersList.length} comptes`} sub="Emails complets · tu peux les contacter directement" noPad>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>
                    <th style={th}>#</th>
                    <th style={th}>Email</th>
                    <th style={th}>Nom</th>
                    <th style={th}>Quiz complétés</th>
                    <th style={th}>Inscrit le</th>
                  </tr></thead>
                  <tbody>
                    {premiumUsersList.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: C.faint }}>Aucun client premium</td></tr>
                    ) : premiumUsersList.map((u, i) => (
                      <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ ...td, color: C.faint, fontSize: 11 }}>{i + 1}</td>
                        <td style={{ ...td }}>
                          <span style={{ color: C.accent, fontWeight: 600, fontFamily: 'monospace' }}>{u.email ?? '—'}</span>
                        </td>
                        <td style={{ ...td, color: C.dim }}>{u.name ?? '—'}</td>
                        <td style={{ ...td, color: C.dim, textAlign: 'center' }}>{u._count.quizResults}</td>
                        <td style={{ ...td, fontSize: 12, color: C.faint, whiteSpace: 'nowrap' }}>{dt(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Free users */}
            <Card title={`Utilisateurs gratuits — ${freeUsersList.length} comptes`} sub="Inscrits, pas encore passés premium" noPad>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>
                    <th style={th}>#</th>
                    <th style={th}>Email</th>
                    <th style={th}>Nom</th>
                    <th style={th}>Quiz</th>
                    <th style={th}>Inscrit le</th>
                  </tr></thead>
                  <tbody>
                    {freeUsersList.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: C.faint }}>Aucun</td></tr>
                    ) : freeUsersList.map((u, i) => (
                      <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ ...td, color: C.faint, fontSize: 11 }}>{i + 1}</td>
                        <td style={{ ...td, color: C.text, fontFamily: 'monospace', fontSize: 12 }}>{u.email ?? '—'}</td>
                        <td style={{ ...td, color: C.dim }}>{u.name ?? '—'}</td>
                        <td style={{ ...td, color: C.dim, textAlign: 'center' }}>{u._count.quizResults}</td>
                        <td style={{ ...td, fontSize: 12, color: C.faint, whiteSpace: 'nowrap' }}>{dt(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* ════ REVENUE ════ */}
        {tab === 'revenue' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              <Kpi label="Total"        value={eur(totalRev)}   color={C.gold} />
              <Kpi label="Aujourd'hui"  value={eur(revToday)}   color={C.green} />
              <Kpi label="7 jours"      value={eur(revWeek)}    color={C.green} />
              <Kpi label="Ce mois"      value={eur(revMonth)}   color={C.accent} />
              <Kpi label="Cette année"  value={eur(revYear)}    color={C.accent} />
            </div>

            <Card title="Revenu mensuel · 12 mois">
              <BarChart labels={labels} values={revSeries} color={C.gold} fmtTip={v => eur(v)} />
            </Card>

            <Card title="Détail mensuel" noPad>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={th}>Mois</th>
                  <th style={th}>Revenu</th>
                  <th style={th}>Nb conversions</th>
                  <th style={th}>Panier moyen</th>
                </tr></thead>
                <tbody>
                  {keys.slice().reverse().map(k => {
                    const monthConv = allConversions.filter(c => mk(c.createdAt) === k);
                    const rev = monthConv.reduce((s, c) => s + c.amountCents, 0);
                    const cnt = monthConv.length;
                    const avg = cnt ? Math.round(rev / cnt) : 0;
                    if (cnt === 0) return null;
                    return (
                      <tr key={k}>
                        <td style={{ ...td, fontWeight: 600 }}>{ml(k)}</td>
                        <td style={{ ...td, color: C.gold, fontWeight: 700 }}>{eur(rev)}</td>
                        <td style={{ ...td, color: C.dim }}>{cnt}</td>
                        <td style={{ ...td, color: C.dim }}>{eur(avg)}</td>
                      </tr>
                    );
                  }).filter(Boolean)}
                  {allConversions.length === 0 && (
                    <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: C.faint }}>Aucune conversion enregistrée</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {/* ════ QUIZ ════ */}
        {tab === 'quiz' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Kpi label="Quiz complétés" value={n(totalResults)} />
              <Kpi label="Résultats payants" value={n(paidResults)} color={C.green} />
              <Kpi label="Taux de paiement" value={totalResults ? (paidResults / totalResults * 100).toFixed(1) + '%' : '0%'} color={C.accent} />
              <Kpi label="Quiz différents"  value={quizRows.length} color={C.dim} />
            </div>

            <Card title="Performance par quiz" sub="classés par volume" noPad>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  {['Quiz', 'Complétés', 'Payants', '% payant', 'Score moy.', 'Barre'].map(h => <th key={h} style={th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {quizRows.length === 0 ? (
                    <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: C.faint }}>Aucun résultat</td></tr>
                  ) : quizRows.map(q => (
                    <tr key={q.slug}>
                      <td style={td}>
                        <p style={{ margin: 0, fontWeight: 600, color: C.text }}>{q.name}</p>
                        <p style={{ margin: 0, fontSize: 10, color: C.faint }}>{q.slug}</p>
                      </td>
                      <td style={{ ...td, fontWeight: 700 }}>{n(q.count)}</td>
                      <td style={{ ...td, color: C.green }}>{q.paid}</td>
                      <td style={{ ...td, color: q.rate > 5 ? C.accent : C.dim }}>{q.rate.toFixed(1)}%</td>
                      <td style={{ ...td, color: C.dim }}>{q.avg}%</td>
                      <td style={{ ...td, minWidth: 120 }}>
                        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                          <div style={{ height: '100%', width: `${q.count / maxQuiz * 100}%`, background: C.accent, borderRadius: 999 }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {/* ════ SOURCES ════ */}
        {tab === 'sources' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Kpi label="Conversions tracées" value={n(attribution.length)} />
              <Kpi label="Sources uniques"     value={n(sources.length)} color={C.accent2} />
              <Kpi label="CA tracké"           value={eur(attribution.reduce((s, c) => s + c.amountCents, 0))} color={C.gold} />
              <Kpi label="Meilleure source"    value={sources[0]?.[0] ?? '—'} color={C.green} />
            </div>

            {sources.length > 0 && (
              <Card title="Répartition par source">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sources.map(([src, v]) => (
                    <div key={src}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ color: C.text, fontWeight: 500, fontSize: 13 }}>{src}</span>
                        <span style={{ display: 'flex', gap: 20 }}>
                          <span style={{ color: C.dim, fontSize: 12 }}>{v.count} vente{v.count > 1 ? 's' : ''}</span>
                          <span style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>{eur(v.rev)}</span>
                        </span>
                      </div>
                      <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ height: '100%', width: `${v.rev / maxSrc * 100}%`, background: `linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card title="Toutes les conversions tracées" sub="avec source UTM, affilié, quiz" noPad>
              {attribution.length === 0 ? (
                <div style={{ padding: '40px 22px', textAlign: 'center' }}>
                  <p style={{ color: C.dim, fontSize: 14 }}>Aucune conversion tracée pour l&apos;instant.</p>
                  <p style={{ color: C.faint, fontSize: 12, marginTop: 8 }}>
                    Le tracking est actif — les prochains paiements apparaîtront ici avec leur source UTM.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      {['Date', 'Email', 'Montant', 'Type', 'Quiz', 'Source', 'Medium', 'Campagne', 'Affilié', 'Page entrée'].map(h => <th key={h} style={th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {attribution.map(c => (
                        <tr key={c.id}>
                          <td style={{ ...td, fontSize: 11, color: C.faint, whiteSpace: 'nowrap' }}>{dt(c.createdAt)}</td>
                          <td style={{ ...td, fontFamily: 'monospace', fontSize: 12, color: C.accent }}>{c.email ?? '—'}</td>
                          <td style={{ ...td, color: C.gold, fontWeight: 700, whiteSpace: 'nowrap' }}>{eur(c.amountCents)}</td>
                          <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.productType ?? '—'}</td>
                          <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.quizSlug ?? '—'}</td>
                          <td style={{ ...td }}>
                            {c.utmSource
                              ? <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(194,97,31,0.18)', color: C.accent }}>{c.utmSource}</span>
                              : <span style={{ color: C.faint, fontSize: 12 }}>organique</span>}
                          </td>
                          <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.utmMedium ?? '—'}</td>
                          <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.utmCampaign ?? '—'}</td>
                          <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.affiliateSlug ?? '—'}</td>
                          <td style={{ ...td, fontSize: 11, color: C.faint }}>{c.landingPath ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}

        <p style={{ textAlign: 'center', color: C.faint, fontSize: 11, paddingBottom: 24 }}>
          UrCecret · {dt(now)} · données en temps réel
        </p>
      </div>
    </main>
  );
}
