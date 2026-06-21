export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';

/* ════════════════════════════════════════════════════════════════════════════
   UrCecret — Dashboard exécutif
   100% server-rendered. Aucun JavaScript client → ne peut PAS crasher au navigateur.
   Vrais graphiques SVG calculés depuis la base de données.
   ════════════════════════════════════════════════════════════════════════════ */

const QUIZ_NAMES: Record<string, string> = {
  infidelite: 'Infidélité', adopte: 'Suis-je adopté(e) ?', amoureux: 'Suis-je amoureux ?',
  'vrais-amis': 'Vrais amis', orientation: 'Orientation', narcissique: 'Narcissique',
  'mon-ex': 'Mon ex', manipule: 'Manipulé(e) ?', rompre: 'Dois-je rompre ?',
  jaloux: 'Jaloux/jalouse ?', 'relation-toxique': 'Relation toxique', crush: 'Mon crush',
  burnout: 'Burnout', depression: 'Dépression', 'vrai-amour': 'Vrai amour', personnalite: 'Test MBTI',
};

const C = {
  bg: '#0a0a0f',
  panel: 'rgba(255,255,255,0.025)',
  border: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  dim: '#71717a',
  faint: '#3f3f46',
  accent: '#d17d52',
  accent2: '#e0a380',
  gold: '#fbbf24',
  green: '#34d399',
};

function eur(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
function num(n: number) { return n.toLocaleString('fr-FR'); }
function monthKey(d: Date) { return d.toISOString().slice(0, 7); }
function last12Keys(): string[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return monthKey(d);
  });
}
function keyLabel(key: string) {
  return new Date(key + '-01').toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
}
function fmtDateTime(d: Date) {
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function maskEmail(email: string | null) {
  if (!email) return '—';
  const [u, dm] = email.split('@');
  if (!dm) return email;
  return u.slice(0, 2) + '***@' + dm;
}

/* ── SVG bar chart (server-rendered) ───────────────────────────────────────── */
function BarChart({ labels, values, color, fmt }: {
  labels: string[]; values: number[]; color: string; fmt: (v: number) => string;
}) {
  const W = 760, H = 220, padL = 8, padR = 8, padT = 16, padB = 28;
  const iW = W - padL - padR, iH = H - padT - padB;
  const max = Math.max(...values, 1);
  const n = values.length;
  const slot = iW / n;
  const barW = Math.min(slot * 0.6, 44);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} preserveAspectRatio="xMidYMid meet">
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={padL} y1={padT + iH - iH * p} x2={W - padR} y2={padT + iH - iH * p}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3,6" />
      ))}
      {values.map((v, i) => {
        const h = max > 0 ? (v / max) * iH : 0;
        const x = padL + slot * i + (slot - barW) / 2;
        const y = padT + iH - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={Math.max(h, v > 0 ? 2 : 0)} rx={4} fill={color} opacity={0.9} />
            {v > 0 && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={9} fill={C.dim} fontWeight={600}>
                {fmt(v)}
              </text>
            )}
            <text x={padL + slot * i + slot / 2} y={H - 8} textAnchor="middle" fontSize={10} fill={C.faint}>
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── KPI card ──────────────────────────────────────────────────────────────── */
function Kpi({ label, value, sub, color = C.accent }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderTop: `2px solid ${color}`, borderRadius: 16, padding: '18px 20px' }}>
      <p style={{ fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 900, color: C.text, margin: '8px 0 4px', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: C.dim, margin: '3px 0 0' }}>{sub}</p>}
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </section>
  );
}

export default async function DashboardPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 864e5);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const yearAgo = new Date(now.getTime() - 365 * 864e5);

  // ── Données utilisateurs & quiz ──
  const [totalUsers, premiumUsers, newToday, newWeek, newMonth, usersForChart, allResults, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'premium' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.findMany({ where: { createdAt: { gte: yearAgo } }, select: { createdAt: true } }),
    prisma.quizResult.findMany({ select: { quizSlug: true, score: true, paid: true, createdAt: true } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 12, select: { email: true, tier: true, createdAt: true } }),
  ]);

  // ── Revenus (conversions affiliées = source de vérité historique) ──
  const allConversions = await prisma.affiliateConversion.findMany({
    select: { amountCents: true, createdAt: true },
  });

  // ── Attribution (table Conversion — défensif: peut ne pas exister) ──
  type ConvRow = { id: string; email: string | null; amountCents: number; quizSlug: string | null; productType: string | null; utmSource: string | null; affiliateSlug: string | null; createdAt: Date };
  let attribution: ConvRow[] = [];
  try {
    attribution = await prisma.conversion.findMany({
      orderBy: { createdAt: 'desc' }, take: 100,
      select: { id: true, email: true, amountCents: true, quizSlug: true, productType: true, utmSource: true, affiliateSlug: true, createdAt: true },
    });
  } catch { /* table pas encore migrée */ }

  // ── Agrégations ──
  const keys = last12Keys();
  const labels = keys.map(keyLabel);

  const usersByMonth: Record<string, number> = {};
  usersForChart.forEach(u => { const k = monthKey(u.createdAt); usersByMonth[k] = (usersByMonth[k] || 0) + 1; });
  const usersSeries = keys.map(k => usersByMonth[k] ?? 0);

  const revByMonth: Record<string, number> = {};
  allConversions.forEach(c => { const k = monthKey(c.createdAt); revByMonth[k] = (revByMonth[k] || 0) + c.amountCents; });
  const revSeries = keys.map(k => revByMonth[k] ?? 0);

  const totalRev = allConversions.reduce((s, c) => s + c.amountCents, 0);
  const revToday = allConversions.filter(c => c.createdAt >= startOfToday).reduce((s, c) => s + c.amountCents, 0);
  const revWeek = allConversions.filter(c => c.createdAt >= sevenDaysAgo).reduce((s, c) => s + c.amountCents, 0);
  const revMonth = allConversions.filter(c => c.createdAt >= startOfMonth).reduce((s, c) => s + c.amountCents, 0);
  const revYear = allConversions.filter(c => c.createdAt >= startOfYear).reduce((s, c) => s + c.amountCents, 0);

  const totalResults = allResults.length;
  const paidResults = allResults.filter(r => r.paid).length;

  const byQuiz: Record<string, { count: number; paid: number; score: number }> = {};
  allResults.forEach(r => {
    if (!byQuiz[r.quizSlug]) byQuiz[r.quizSlug] = { count: 0, paid: 0, score: 0 };
    byQuiz[r.quizSlug].count++; if (r.paid) byQuiz[r.quizSlug].paid++; byQuiz[r.quizSlug].score += r.score;
  });
  const quizRows = Object.entries(byQuiz)
    .map(([slug, d]) => ({ slug, name: QUIZ_NAMES[slug] ?? slug, count: d.count, paid: d.paid, avg: Math.round(d.score / d.count), rate: d.count ? (d.paid / d.count * 100) : 0 }))
    .sort((a, b) => b.count - a.count);
  const maxQuiz = Math.max(...quizRows.map(q => q.count), 1);

  const convRate = totalUsers ? (premiumUsers / totalUsers * 100).toFixed(1) : '0';

  // ── Sources ──
  const sourceMap: Record<string, { count: number; rev: number }> = {};
  attribution.forEach(c => {
    const src = c.utmSource ?? (c.affiliateSlug ? `aff:${c.affiliateSlug}` : 'organique');
    if (!sourceMap[src]) sourceMap[src] = { count: 0, rev: 0 };
    sourceMap[src].count++; sourceMap[src].rev += c.amountCents;
  });
  const sources = Object.entries(sourceMap).sort((a, b) => b[1].rev - a[1].rev);
  const maxSrcRev = Math.max(...sources.map(([, v]) => v.rev), 1);

  const th = { textAlign: 'left' as const, padding: '10px 14px', fontSize: 10, color: C.dim, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: `1px solid ${C.border}` };
  const td = { padding: '11px 14px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#d4d4d8' };

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>
            <span style={{ color: C.accent }}>Ur</span><span>Cecret</span>
            <span style={{ fontSize: 11, color: C.faint, fontWeight: 400, marginLeft: 8 }}>Dashboard exécutif</span>
          </div>
          <span style={{ fontSize: 11, color: C.faint }}>{fmtDateTime(now)}</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* KPI ligne revenus */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <Kpi label="Revenu total"   value={eur(totalRev)}  color={C.gold} />
          <Kpi label="Aujourd'hui"     value={eur(revToday)}  color={C.green} />
          <Kpi label="7 jours"         value={eur(revWeek)}   color={C.green} />
          <Kpi label="Ce mois"         value={eur(revMonth)}  color={C.accent} />
          <Kpi label="Cette année"     value={eur(revYear)}   color={C.accent} />
        </div>

        {/* KPI ligne utilisateurs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <Kpi label="Utilisateurs"      value={num(totalUsers)}   sub={`+${newToday} aujourd'hui`} />
          <Kpi label="Premium"           value={num(premiumUsers)} sub={`${convRate}% conversion`} color={C.accent2} />
          <Kpi label="Nouveaux 7j"       value={num(newWeek)}      color={C.green} />
          <Kpi label="Quiz complétés"    value={num(totalResults)} sub={`${paidResults} payants`} />
          <Kpi label="Nouveaux ce mois"  value={num(newMonth)} />
        </div>

        {/* Graphiques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 22 }}>
          <Panel title="Revenu · 12 derniers mois" sub="conversions enregistrées">
            <BarChart labels={labels} values={revSeries} color={C.gold} fmt={v => v >= 100 ? (v / 100).toFixed(0) : ''} />
          </Panel>
          <Panel title="Nouveaux utilisateurs · 12 mois" sub="inscriptions par mois">
            <BarChart labels={labels} values={usersSeries} color={C.accent} fmt={v => v > 0 ? String(v) : ''} />
          </Panel>
        </div>

        {/* Top quiz */}
        <Panel title="Performance par quiz" sub={`${quizRows.length} quiz · classés par complétions`}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Quiz', 'Complétés', 'Payants', '% payant', 'Score moy.'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {quizRows.length === 0 ? (
                <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: C.faint }}>Aucune donnée</td></tr>
              ) : quizRows.map(q => (
                <tr key={q.slug}>
                  <td style={td}>
                    <span style={{ color: C.text, fontWeight: 500 }}>{q.name}</span>
                    <div style={{ marginTop: 5, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', maxWidth: 180 }}>
                      <div style={{ height: '100%', width: `${q.count / maxQuiz * 100}%`, background: C.accent, borderRadius: 999 }} />
                    </div>
                  </td>
                  <td style={{ ...td, fontWeight: 700 }}>{num(q.count)}</td>
                  <td style={{ ...td, color: C.green }}>{q.paid}</td>
                  <td style={{ ...td, color: C.dim }}>{q.rate.toFixed(1)}%</td>
                  <td style={{ ...td, color: C.dim }}>{q.avg}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        {/* Sources d'acquisition */}
        <Panel title="🎯 Sources d'acquisition" sub={attribution.length ? `${attribution.length} conversions tracées` : 'Le tracking démarre — les prochains paiements apparaîtront ici avec leur source'}>
          {sources.length === 0 ? (
            <p style={{ color: C.faint, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              Aucune conversion tracée pour l&apos;instant. Chaque paiement futur sera enregistré avec sa source UTM / affilié.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sources.map(([src, v]) => (
                <div key={src}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#d4d4d8', fontSize: 13, fontWeight: 500 }}>{src}</span>
                    <span style={{ display: 'flex', gap: 16 }}>
                      <span style={{ color: C.dim, fontSize: 12 }}>{v.count} vente{v.count > 1 ? 's' : ''}</span>
                      <span style={{ color: C.gold, fontWeight: 600, fontSize: 13 }}>{eur(v.rev)}</span>
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ height: '100%', width: `${v.rev / maxSrcRev * 100}%`, background: `linear-gradient(90deg,${C.accent},${C.accent2})`, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Dernières conversions tracées */}
        {attribution.length > 0 && (
          <Panel title="Dernières conversions tracées" sub="avec source d'acquisition">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Date', 'Email', 'Montant', 'Type', 'Quiz', 'Source', 'Affilié'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {attribution.slice(0, 30).map(c => (
                    <tr key={c.id}>
                      <td style={{ ...td, fontSize: 11, color: C.faint, whiteSpace: 'nowrap' }}>{fmtDateTime(c.createdAt)}</td>
                      <td style={{ ...td, fontSize: 12, color: C.dim }}>{maskEmail(c.email)}</td>
                      <td style={{ ...td, color: C.gold, fontWeight: 700 }}>{eur(c.amountCents)}</td>
                      <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.productType ?? '—'}</td>
                      <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.quizSlug ?? '—'}</td>
                      <td style={{ ...td }}>
                        {c.utmSource
                          ? <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(194,97,31,0.15)', color: C.accent }}>{c.utmSource}</span>
                          : <span style={{ color: C.faint, fontSize: 12 }}>organique</span>}
                      </td>
                      <td style={{ ...td, fontSize: 12, color: C.dim }}>{c.affiliateSlug ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        {/* Dernières inscriptions */}
        <Panel title="Dernières inscriptions">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Email', 'Tier', 'Date'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan={3} style={{ ...td, textAlign: 'center', color: C.faint }}>Aucune inscription</td></tr>
              ) : recentUsers.map((u, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontSize: 12 }}>{maskEmail(u.email)}</td>
                  <td style={td}>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: u.tier === 'premium' ? 'rgba(194,97,31,0.18)' : 'rgba(255,255,255,0.05)',
                      color: u.tier === 'premium' ? C.accent : C.dim }}>
                      {u.tier === 'premium' ? 'Premium' : 'Gratuit'}
                    </span>
                  </td>
                  <td style={{ ...td, fontSize: 11, color: C.faint }}>{fmtDateTime(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <p style={{ textAlign: 'center', color: C.faint, fontSize: 11, padding: '8px 0 24px' }}>
          UrCecret · Dashboard server-rendered · données en temps réel
        </p>
      </div>
    </main>
  );
}
