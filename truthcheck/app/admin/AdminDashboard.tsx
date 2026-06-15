'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'overview' | 'users' | 'revenue' | 'quizzes' | 'affiliates';

interface Stats {
  totalUsers: number; premiumUsers: number;
  newToday: number; newThisWeek: number; newThisMonth: number;
  recentUsers: Array<{ id: string; email: string | null; name: string | null; tier: string; createdAt: string; _count: { quizResults: number } }>;
  usersByMonth: Record<string, number>;
  premiumByMonth: Record<string, number>;
  totalResults: number; paidResults: number; paidToday: number; paidThisMonth: number;
  byQuiz: Record<string, { count: number; paidCount: number; totalScore: number }>;
  quizByMonth: Record<string, number>;
  paidByMonth: Record<string, number>;
  mbtiDistribution: Record<string, number>;
  totalRevenueCents: number; todayRevenueCents: number; weekRevenueCents: number;
  monthRevenueCents: number; yearRevenueCents: number;
  revenueByMonth: Record<string, { revenue: number; commission: number; count: number }>;
  affiliates: Array<{
    id: string; slug: string; name: string; email: string | null;
    commissionPct: number; createdAt: string;
    conversions: Array<{ amountCents: number; commissionCents: number; createdAt: string }>;
  }>;
  affiliateClicks: Record<string, number>;
  totalPageViews: number;
}

const QUIZ_NAMES: Record<string, string> = {
  infidelite: 'Infidélité', adopte: 'Suis-je adopté(e) ?', amoureux: 'Suis-je amoureux ?',
  'vrais-amis': 'Vrais amis', orientation: 'Orientation', narcissique: 'Narcissique',
  'mon-ex': 'Mon ex', manipule: 'Manipulé(e) ?', rompre: 'Dois-je rompre ?',
  jaloux: 'Jaloux/jalouse ?', 'relation-toxique': 'Relation toxique', crush: 'Mon crush',
  burnout: 'Burnout', depression: 'Dépression', 'vrai-amour': 'Vrai amour', personnalite: 'Test MBTI',
};

function fmt(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString('fr-FR'); }

function getLast12Keys(): string[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return d.toISOString().slice(0, 7);
  });
}
function keyToLabel(key: string) {
  return new Date(key + '-01').toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = '#a78bfa' }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderTop: `2px solid ${color}`,
      borderRadius: 16, padding: '18px 20px',
    }}>
      <p style={{ fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color }}>{sub}</p>}
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  return tier === 'premium'
    ? <span style={{ background: 'rgba(139,92,246,0.18)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Premium</span>
    : <span style={{ background: 'rgba(255,255,255,0.05)', color: '#52525b', border: '1px solid rgba(255,255,255,0.07)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Gratuit</span>;
}

// ── SVG Line Chart ────────────────────────────────────────────────────────────
function LineChart({
  xLabels, series, fmtVal, h = 170,
}: {
  xLabels: string[];
  series: { label: string; color: string; values: number[] }[];
  fmtVal: (v: number) => string;
  h?: number;
}) {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const W = 560, PAD = { t: 16, r: 16, b: 28, l: 8 };
  const iW = W - PAD.l - PAD.r, iH = h - PAD.t - PAD.b;
  const n = xLabels.length;
  const maxVal = Math.max(...series.flatMap(s => s.values), 1);

  const xOf = (i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * iW : iW / 2);
  const yOf = (v: number) => PAD.t + iH - (v / maxVal) * iH;

  const curvePath = (values: number[]) =>
    values.map((v, i) => {
      const x = xOf(i), y = yOf(v);
      if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
      const px = xOf(i - 1), py = yOf(values[i - 1]), cx = (px + x) / 2;
      return `C${cx.toFixed(1)},${py.toFixed(1)} ${cx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

  const areaPath = (values: number[]) =>
    `${curvePath(values)} L${xOf(n - 1).toFixed(1)},${(PAD.t + iH).toFixed(1)} L${xOf(0).toFixed(1)},${(PAD.t + iH).toFixed(1)} Z`;

  if (!n) return <p style={{ textAlign: 'center', padding: '40px 0', color: '#3f3f46', fontSize: 13 }}>Aucune donnée</p>;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: 16 }}>
        {series.map(s => (
          <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#71717a' }}>
            <span style={{ width: 24, height: 2, background: s.color, borderRadius: 2, display: 'inline-block' }} />
            {s.label}
          </span>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${h}`} width="100%" height={h} style={{ display: 'block', minWidth: 280 }}>
          <defs>
            {series.map((s, si) => (
              <linearGradient key={si} id={`lg${si}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* grid */}
          {[0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1={PAD.l} y1={yOf(maxVal * p)} x2={W - PAD.r} y2={yOf(maxVal * p)}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4,6" />
          ))}

          {/* hover line */}
          {hovIdx !== null && (
            <line x1={xOf(hovIdx)} y1={PAD.t} x2={xOf(hovIdx)} y2={PAD.t + iH}
              stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          )}

          {/* areas */}
          {series.map((s, si) => <path key={`a${si}`} d={areaPath(s.values)} fill={`url(#lg${si})`} />)}

          {/* lines */}
          {series.map((s, si) => (
            <path key={`l${si}`} d={curvePath(s.values)}
              fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" />
          ))}

          {/* hover dots */}
          {hovIdx !== null && series.map((s, si) => (
            <circle key={`hd${si}`} cx={xOf(hovIdx)} cy={yOf(s.values[hovIdx] ?? 0)} r={5}
              fill={s.color} stroke="#0a0a0f" strokeWidth={2} />
          ))}

          {/* hover zones */}
          {xLabels.map((_, i) => (
            <rect key={`hz${i}`} x={xOf(i) - iW / n / 2} y={0} width={iW / n} height={h}
              fill="transparent" style={{ cursor: 'default' }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} />
          ))}

          {/* x labels */}
          {xLabels.map((l, i) => (
            <text key={i} x={xOf(i)} y={h - 5} textAnchor="middle" fontSize={9} fill="#3f3f46">{l}</text>
          ))}

          {/* tooltip */}
          {hovIdx !== null && (() => {
            const tipW = 120, tipH = 18 + series.length * 18;
            const hx = xOf(hovIdx);
            const safeTipX = Math.min(Math.max(hx - tipW / 2, 4), W - tipW - 4);
            return (
              <g>
                <rect x={safeTipX} y={PAD.t + 4} width={tipW} height={tipH} rx={7}
                  fill="#141417" stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
                <text x={safeTipX + 10} y={PAD.t + 18} fontSize={9} fill="#52525b">{xLabels[hovIdx]}</text>
                {series.map((s, si) => (
                  <text key={si} x={safeTipX + 10} y={PAD.t + 30 + si * 18} fontSize={10} fill={s.color} fontWeight="600">
                    {s.label}: {fmtVal(s.values[hovIdx] ?? 0)}
                  </text>
                ))}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HorizBar({ label, value, max, color, valueLabel }: {
  label: string; value: number; max: number; color: string; valueLabel: string;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 1.5 : 0) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' }}>
      <div style={{ width: 112, textAlign: 'right', fontSize: 12, color: '#71717a', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>{label}</div>
      <div style={{ flex: 1, height: 14, borderRadius: 999, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
      </div>
      <div style={{ width: 72, fontSize: 12, color: '#d4d4d8', fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>{valueLabel}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminDashboard({ stats }: { stats: Stats }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toLocaleTimeString('fr-FR'));

  useEffect(() => {
    const id = setInterval(() => { router.refresh(); setLastRefresh(new Date().toLocaleTimeString('fr-FR')); }, 60_000);
    return () => clearInterval(id);
  }, [router]);

  const last12 = useMemo(() => getLast12Keys(), []);
  const monthLabels = useMemo(() => last12.map(keyToLabel), [last12]);

  const usersSeries    = useMemo(() => last12.map(k => stats.usersByMonth[k] ?? 0), [last12, stats.usersByMonth]);
  const premiumSeries  = useMemo(() => last12.map(k => stats.premiumByMonth[k] ?? 0), [last12, stats.premiumByMonth]);
  const quizSeries     = useMemo(() => last12.map(k => stats.quizByMonth[k] ?? 0), [last12, stats.quizByMonth]);
  const paidSeries     = useMemo(() => last12.map(k => stats.paidByMonth[k] ?? 0), [last12, stats.paidByMonth]);
  const revSeries      = useMemo(() => last12.map(k => (stats.revenueByMonth[k]?.revenue ?? 0)), [last12, stats.revenueByMonth]);
  const commSeries     = useMemo(() => last12.map(k => (stats.revenueByMonth[k]?.commission ?? 0)), [last12, stats.revenueByMonth]);

  const conversionRate = stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : '0';

  const filteredUsers = useMemo(() => stats.recentUsers.filter(u => {
    const matchesTier = tierFilter === 'all' || u.tier === (tierFilter === 'premium' ? 'premium' : 'free');
    const matchesSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  }), [stats.recentUsers, search, tierFilter]);

  const sortedQuizzes = Object.entries(stats.byQuiz)
    .map(([slug, d]) => ({
      slug, name: QUIZ_NAMES[slug] ?? slug,
      count: d.count, paidCount: d.paidCount,
      avgScore: d.count > 0 ? Math.round(d.totalScore / d.count) : 0,
      paidRate: d.count > 0 ? ((d.paidCount / d.count) * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => b.count - a.count);

  const sortedMonths = Object.entries(stats.revenueByMonth).sort(([a], [b]) => b.localeCompare(a)).slice(0, 12);

  const totalAffilRevenue    = stats.affiliates.reduce((s, a) => s + a.conversions.reduce((ss, c) => ss + c.amountCents, 0), 0);
  const totalAffilCommission = stats.affiliates.reduce((s, a) => s + a.conversions.reduce((ss, c) => ss + c.commissionCents, 0), 0);

  const affiliateRanking = useMemo(() =>
    stats.affiliates.map(a => ({
      name: a.name, slug: a.slug,
      ca: a.conversions.reduce((s, c) => s + c.amountCents, 0),
      sales: a.conversions.length,
      clicks: stats.affiliateClicks[a.slug] ?? 0,
      commission: a.conversions.reduce((s, c) => s + c.commissionCents, 0),
    })).sort((a, b) => b.ca - a.ca),
    [stats.affiliates, stats.affiliateClicks]);

  const maxAffilCA = Math.max(...affiliateRanking.map(a => a.ca), 1);
  const maxAffilClicks = Math.max(...affiliateRanking.map(a => a.clicks), 1);
  const maxQuizCount = Math.max(...sortedQuizzes.map(q => q.count), 1);

  // MBTI top types
  const topMbti = Object.entries(stats.mbtiDistribution ?? {}).sort(([, a], [, b]) => b - a).slice(0, 8);
  const maxMbti = Math.max(...topMbti.map(([, v]) => v), 1);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',   label: '📊 Vue d\'ensemble' },
    { id: 'users',      label: '👥 Utilisateurs' },
    { id: 'revenue',    label: '💰 Revenus' },
    { id: 'quizzes',    label: '🧩 Quiz' },
    { id: 'affiliates', label: '🔗 Affiliés' },
  ];

  const card = (content: React.ReactNode) => (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
      {content}
    </div>
  );

  const cardP = (content: React.ReactNode) => (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '20px 24px' }}>
      {content}
    </div>
  );

  const sectionTitle = (text: string, sub?: string) => (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>{text}</h1>
      {sub && <p style={{ fontSize: 13, color: '#52525b', marginTop: 4 }}>{sub}</p>}
    </div>
  );

  const thStyle = { textAlign: 'left' as const, padding: '12px 20px', fontSize: 11, color: '#52525b', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)' };
  const tdStyle = { padding: '12px 20px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.04)' };

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 900, textDecoration: 'none' }}>
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span style={{ color: '#fff' }}>Cecret</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 11, color: '#3f3f46' }}>↻ {lastRefresh}</span>
            <Link href="/admin/affiliates" style={{ fontSize: 12, color: '#a78bfa', textDecoration: 'none' }}>Gérer affiliés →</Link>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.id ? '#a78bfa' : '#52525b',
              borderBottom: tab === t.id ? '2px solid #a78bfa' : '2px solid transparent',
              transition: 'all .15s',
            }}>{t.label}</button>
          ))}
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {sectionTitle('Vue d\'ensemble', 'Statistiques en temps réel')}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <KpiCard label="Utilisateurs" value={stats.totalUsers.toLocaleString('fr-FR')} sub={`+${stats.newThisMonth} ce mois`} color="#a78bfa" />
              <KpiCard label="Premium" value={stats.premiumUsers} sub={`${conversionRate}% conversion`} color="#f472b6" />
              <KpiCard label="Tests MBTI" value={(stats.byQuiz['personnalite']?.count ?? 0).toLocaleString('fr-FR')} sub={`${stats.totalResults.toLocaleString('fr-FR')} quiz total`} color="#34d399" />
              <KpiCard label="CA affiliés total" value={fmt(stats.totalRevenueCents)} sub={`${fmt(stats.monthRevenueCents)} ce mois`} color="#fbbf24" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <KpiCard label="Vues de page total" value={stats.totalPageViews.toLocaleString('fr-FR')} sub="total cumulé" color="#0ea5e9" />
              <KpiCard label="Nouveaux aujourd'hui" value={stats.newToday} color="#a78bfa" />
              <KpiCard label="Unlocks payants" value={stats.paidResults} sub={`+${stats.paidToday} auj.`} color="#34d399" />
              <KpiCard label="Revenus cette semaine" value={fmt(stats.weekRevenueCents)} color="#fbbf24" />
            </div>

            {/* Combined growth line chart */}
            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 20 }}>Croissance · 12 derniers mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'Inscrits', color: '#a78bfa', values: usersSeries },
                    { label: 'Premium', color: '#f472b6', values: premiumSeries },
                    { label: 'Quiz complétés', color: '#34d399', values: quizSeries },
                  ]}
                  fmtVal={v => v.toLocaleString('fr-FR')}
                />
              </>
            )}

            {/* Top MBTI */}
            {topMbti.length > 0 && cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>Top types MBTI</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '4px 24px' }}>
                  {topMbti.map(([type, count]) => (
                    <HorizBar key={type} label={type} value={count} max={maxMbti}
                      color="linear-gradient(90deg,#7c3aed,#a78bfa)"
                      valueLabel={`${count} users (${((count / stats.totalUsers) * 100).toFixed(1)}%)`} />
                  ))}
                </div>
              </>
            )}

            {/* Recent signups */}
            {card(
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, fontSize: 14 }}>Derniers inscrits</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Tier</th>
                      <th style={thStyle}>Inscrit le</th>
                      <th style={thStyle}>Quiz</th>
                    </tr></thead>
                    <tbody>
                      {stats.recentUsers.slice(0, 10).map(u => (
                        <tr key={u.id} style={{ transition: 'background .1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ ...tdStyle, color: '#d4d4d8' }}>{u.email ?? '—'}</td>
                          <td style={tdStyle}><TierBadge tier={u.tier} /></td>
                          <td style={{ ...tdStyle, color: '#52525b' }}>{fmtDate(u.createdAt)}</td>
                          <td style={{ ...tdStyle, color: '#71717a' }}>{u._count.quizResults}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              {sectionTitle('Utilisateurs', `${stats.totalUsers} inscrits · ${stats.premiumUsers} premium · ${stats.totalUsers - stats.premiumUsers} gratuits`)}
              <div style={{ display: 'flex', gap: 8 }}>
                {(['all', 'premium', 'free'] as const).map(f => (
                  <button key={f} onClick={() => setTierFilter(f)} style={{
                    padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: tierFilter === f ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.04)',
                    color: tierFilter === f ? '#a78bfa' : '#52525b',
                    border: tierFilter === f ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  }}>{f === 'all' ? 'Tous' : f === 'premium' ? 'Premium' : 'Gratuit'}</button>
                ))}
              </div>
            </div>

            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 20 }}>Inscriptions vs Conversions premium</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'Nouveaux inscrits', color: '#a78bfa', values: usersSeries },
                    { label: 'Conversions premium', color: '#f472b6', values: premiumSeries },
                  ]}
                  fmtVal={v => v.toLocaleString('fr-FR') + ' users'}
                />
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <KpiCard label="Aujourd'hui" value={stats.newToday} color="#a78bfa" />
              <KpiCard label="Cette semaine" value={stats.newThisWeek} color="#a78bfa" />
              <KpiCard label="Ce mois" value={stats.newThisMonth} color="#a78bfa" />
            </div>

            <input type="text" placeholder="Rechercher par email ou nom…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', outline: 'none', boxSizing: 'border-box' }} />

            {card(
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr>
                    {['#','Email','Nom','Tier','Inscrit le','Quiz'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ ...tdStyle, color: '#3f3f46', fontSize: 11 }}>{i + 1}</td>
                        <td style={{ ...tdStyle, color: '#d4d4d8', fontFamily: 'monospace', fontSize: 12 }}>{u.email ?? '—'}</td>
                        <td style={{ ...tdStyle, color: '#71717a' }}>{u.name ?? '—'}</td>
                        <td style={tdStyle}><TierBadge tier={u.tier} /></td>
                        <td style={{ ...tdStyle, color: '#52525b', fontSize: 12 }}>{fmtDate(u.createdAt)}</td>
                        <td style={{ ...tdStyle, color: '#71717a' }}>{u._count.quizResults}</td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#3f3f46', padding: '32px' }}>Aucun résultat</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {sectionTitle('Revenus', undefined)}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
              <KpiCard label="Total cumulé"   value={fmt(stats.totalRevenueCents)}  color="#fbbf24" />
              <KpiCard label="Cette année"    value={fmt(stats.yearRevenueCents)}   color="#fbbf24" />
              <KpiCard label="Ce mois"        value={fmt(stats.monthRevenueCents)}  color="#fbbf24" />
              <KpiCard label="Cette semaine"  value={fmt(stats.weekRevenueCents)}   color="#fbbf24" />
              <KpiCard label="Aujourd'hui"    value={fmt(stats.todayRevenueCents)}  color="#fbbf24" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <KpiCard label="Unlocks payants (total)" value={stats.paidResults}     sub="résultats débloqués"    color="#34d399" />
              <KpiCard label="Unlocks ce mois"         value={stats.paidThisMonth}   sub={`+${stats.paidToday} auj.`} color="#34d399" />
              <KpiCard label="Stripe" value="→" sub="Voir le dashboard Stripe" color="#a78bfa" />
            </div>

            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 20 }}>CA affiliés & commissions · 12 mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'CA généré', color: '#fbbf24', values: revSeries },
                    { label: 'Commissions', color: '#f472b6', values: commSeries },
                  ]}
                  fmtVal={v => fmt(v)}
                  h={180}
                />
              </>
            )}

            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 20 }}>Unlocks payants par mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[{ label: 'Unlocks payants', color: '#34d399', values: paidSeries }]}
                  fmtVal={v => v.toLocaleString('fr-FR') + ' unlocks'}
                  h={130}
                />
              </>
            )}

            {card(
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, fontSize: 14 }}>Détail mensuel</div>
                {sortedMonths.length === 0
                  ? <p style={{ padding: '32px', textAlign: 'center', color: '#3f3f46', fontSize: 13 }}>Aucune conversion enregistrée</p>
                  : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr>
                      {['Mois','CA généré','Commissions','Conversions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {sortedMonths.map(([month, data]) => (
                        <tr key={month}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ ...tdStyle, color: '#d4d4d8', fontWeight: 500 }}>
                            {new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          </td>
                          <td style={{ ...tdStyle, color: '#fbbf24', fontWeight: 600 }}>{fmt(data.revenue)}</td>
                          <td style={{ ...tdStyle, color: '#f472b6' }}>{fmt(data.commission)}</td>
                          <td style={{ ...tdStyle, color: '#71717a' }}>{data.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </>
            )}
          </div>
        )}

        {/* ── QUIZZES ── */}
        {tab === 'quizzes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {sectionTitle('Stats Quiz', `${stats.totalResults.toLocaleString('fr-FR')} complétions · ${stats.paidResults} débloqués`)}

            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 20 }}>Complétions & unlocks payants · 12 mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'Quiz complétés', color: '#a78bfa', values: quizSeries },
                    { label: 'Résultats payants', color: '#34d399', values: paidSeries },
                  ]}
                  fmtVal={v => v.toLocaleString('fr-FR')}
                  h={170}
                />
              </>
            )}

            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>Classement par complétions</p>
                {sortedQuizzes.map(q => (
                  <HorizBar key={q.slug} label={q.name} value={q.count} max={maxQuizCount}
                    color="linear-gradient(90deg,#7c3aed,#ec4899)"
                    valueLabel={q.count.toLocaleString('fr-FR')} />
                ))}
              </>
            )}

            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>Taux de conversion payant</p>
                {sortedQuizzes.filter(q => q.count > 0).map(q => (
                  <HorizBar key={q.slug} label={q.name} value={parseFloat(q.paidRate)} max={100}
                    color="linear-gradient(90deg,#059669,#34d399)"
                    valueLabel={`${q.paidRate}%`} />
                ))}
              </>
            )}

            {card(
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, fontSize: 14 }}>Tableau complet</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr>
                      {['Quiz','Complétés','Payants','% payant','Score moy.'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {sortedQuizzes.map(q => (
                        <tr key={q.slug}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={tdStyle}>
                            <p style={{ color: '#fff', fontWeight: 500, margin: 0 }}>{q.name}</p>
                            <p style={{ color: '#3f3f46', fontSize: 11, margin: 0 }}>{q.slug}</p>
                          </td>
                          <td style={{ ...tdStyle, color: '#d4d4d8', fontWeight: 600 }}>{q.count.toLocaleString('fr-FR')}</td>
                          <td style={{ ...tdStyle, color: '#34d399' }}>{q.paidCount}</td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 48, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${q.paidRate}%`, background: '#7c3aed', borderRadius: 999 }} />
                              </div>
                              <span style={{ color: '#71717a', fontSize: 12 }}>{q.paidRate}%</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: '#71717a' }}>{q.avgScore}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── AFFILIATES ── */}
        {tab === 'affiliates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              {sectionTitle('Affiliés', `${stats.affiliates.length} affiliés actifs`)}
              <Link href="/admin/affiliates" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: 'none', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)', flexShrink: 0 }}>
                Gérer →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <KpiCard label="Total affiliés"     value={stats.affiliates.length} color="#a78bfa" />
              <KpiCard label="Total conversions"  value={stats.affiliates.reduce((s, a) => s + a.conversions.length, 0)} color="#a78bfa" />
              <KpiCard label="CA total affiliés"  value={fmt(totalAffilRevenue)}    color="#fbbf24" />
              <KpiCard label="Commissions dues"   value={fmt(totalAffilCommission)} color="#f472b6" />
            </div>

            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 20 }}>Revenus affiliés · 12 mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'CA généré', color: '#fbbf24', values: revSeries },
                    { label: 'Commissions', color: '#f472b6', values: commSeries },
                  ]}
                  fmtVal={v => fmt(v)}
                  h={150}
                />
              </>
            )}

            {affiliateRanking.length > 0 && cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>🏆 Classement CA généré</p>
                {affiliateRanking.map((a, i) => (
                  <HorizBar key={a.name}
                    label={`${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} ${a.name}`}
                    value={a.ca} max={maxAffilCA}
                    color="linear-gradient(90deg,#7c3aed,#fbbf24)"
                    valueLabel={fmt(a.ca)} />
                ))}
              </>
            )}

            {affiliateRanking.length > 0 && cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>👆 Classement clics</p>
                {[...affiliateRanking].sort((a, b) => b.clicks - a.clicks).map(a => (
                  <HorizBar key={a.name} label={a.name}
                    value={a.clicks} max={maxAffilClicks}
                    color="linear-gradient(90deg,#0ea5e9,#a78bfa)"
                    valueLabel={a.clicks.toLocaleString('fr-FR') + ' clics'} />
                ))}
              </>
            )}

            {card(
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, fontSize: 14 }}>Détail par affilié</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr>
                      {['Nom','Lien','Email','%','Clics','Ventes','CTR','CA'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {stats.affiliates.map(a => {
                        const ca = a.conversions.reduce((s, c) => s + c.amountCents, 0);
                        const clicks = stats.affiliateClicks[a.slug] ?? 0;
                        const ctr = clicks > 0 ? ((a.conversions.length / clicks) * 100).toFixed(1) + '%' : '—';
                        return (
                          <tr key={a.id}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <td style={{ ...tdStyle, color: '#fff', fontWeight: 500 }}>{a.name}</td>
                            <td style={tdStyle}><code style={{ color: '#a78bfa', fontSize: 11 }}>/?ref={a.slug}</code></td>
                            <td style={{ ...tdStyle, color: '#52525b', fontSize: 12 }}>{a.email ?? '—'}</td>
                            <td style={{ ...tdStyle, color: '#d4d4d8' }}>{a.commissionPct}%</td>
                            <td style={{ ...tdStyle, color: '#d4d4d8' }}>{clicks.toLocaleString('fr-FR')}</td>
                            <td style={{ ...tdStyle, color: '#d4d4d8' }}>{a.conversions.length}</td>
                            <td style={{ ...tdStyle, color: '#34d399', fontWeight: 600 }}>{ctr}</td>
                            <td style={{ ...tdStyle, color: '#fbbf24', fontWeight: 600 }}>{fmt(ca)}</td>
                          </tr>
                        );
                      })}
                      {stats.affiliates.length === 0 && (
                        <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: '#3f3f46', padding: '32px' }}>Aucun affilié</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
