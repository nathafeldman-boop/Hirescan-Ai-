'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'overview' | 'users' | 'revenue' | 'quizzes' | 'affiliates' | 'codes' | 'activite';

interface RecentConv {
  id: string;
  affiliateSlug: string;
  affiliateName: string;
  amountCents: number;
  commissionCents: number;
  createdAt: string;
  stripeSessionId?: string | null;
}

interface RecentSignup {
  id: string;
  email: string | null;
  name: string | null;
  tier: string;
  createdAt: string;
}

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
  recentConversions?: RecentConv[];
  recentSignups?: RecentSignup[];
}

interface StripeStats {
  mrr: number;
  monthlyCount: number;
  annualCount: number;
  churnedLast30: number;
  recentCharges: Array<{
    id: string;
    amount: number;
    currency: string;
    created: number;
    description: string | null;
    receiptEmail: string | null;
  }>;
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
function fmtDateTime(iso: string | number) {
  const d = typeof iso === 'number' ? new Date(iso * 1000) : new Date(iso);
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function maskEmail(email: string | null) {
  if (!email) return '—';
  const [u, d] = email.split('@');
  if (!d) return email;
  return u.slice(0, 2) + '***@' + d;
}

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

// 80% commission for first 30 days of an affiliate's activity, 30% after
function calcCommission(conversions: Array<{ amountCents: number; commissionCents: number; createdAt: string }>): number {
  if (!conversions.length) return 0;
  const sorted = [...conversions].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const firstDate = new Date(sorted[0].createdAt);
  const cutoff = new Date(firstDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  return sorted.reduce((sum, c) => {
    const rate = new Date(c.createdAt) <= cutoff ? 0.80 : 0.30;
    return sum + Math.round(c.amountCents * rate);
  }, 0);
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
          {[0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1={PAD.l} y1={yOf(maxVal * p)} x2={W - PAD.r} y2={yOf(maxVal * p)}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4,6" />
          ))}
          {hovIdx !== null && (
            <line x1={xOf(hovIdx)} y1={PAD.t} x2={xOf(hovIdx)} y2={PAD.t + iH}
              stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          )}
          {series.map((s, si) => <path key={`a${si}`} d={areaPath(s.values)} fill={`url(#lg${si})`} />)}
          {series.map((s, si) => (
            <path key={`l${si}`} d={curvePath(s.values)}
              fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" />
          ))}
          {hovIdx !== null && series.map((s, si) => (
            <circle key={`hd${si}`} cx={xOf(hovIdx)} cy={yOf(s.values[hovIdx] ?? 0)} r={5}
              fill={s.color} stroke="#0a0a0f" strokeWidth={2} />
          ))}
          {xLabels.map((_, i) => (
            <rect key={`hz${i}`} x={xOf(i) - iW / n / 2} y={0} width={iW / n} height={h}
              fill="transparent" style={{ cursor: 'default' }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} />
          ))}
          {xLabels.map((l, i) => (
            <text key={i} x={xOf(i)} y={h - 5} textAnchor="middle" fontSize={9} fill="#3f3f46">{l}</text>
          ))}
          {hovIdx !== null && (() => {
            const tipW = 130, tipH = 18 + series.length * 18;
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
      <div style={{ width: 80, fontSize: 12, color: '#d4d4d8', fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>{valueLabel}</div>
    </div>
  );
}

// ── Funnel step ───────────────────────────────────────────────────────────────
function FunnelStep({ label, value, pct, color }: { label: string; value: number; pct?: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ color: '#d4d4d8', fontSize: 13, fontWeight: 500, margin: 0 }}>{label}</p>
        {pct !== undefined && (
          <div style={{ marginTop: 4, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', maxWidth: 240 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0, lineHeight: 1 }}>{value.toLocaleString('fr-FR')}</p>
        {pct !== undefined && <p style={{ color, fontSize: 11, margin: '2px 0 0' }}>{pct.toFixed(1)}%</p>}
      </div>
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
  const [stripeStats, setStripeStats] = useState<StripeStats | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [affiliateSearch, setAffiliateSearch] = useState('');
  const [affiliateSort, setAffiliateSort] = useState<'ca' | 'clicks' | 'commission' | 'sales'>('ca');
  const [expandedAffiliate, setExpandedAffiliate] = useState<string | null>(null);

  // Access codes tab state
  type AccessCodeRow = { id: string; code: string; note: string | null; used: boolean; usedAt: string | null; usedByEmail: string | null; createdAt: string };
  const [codes, setCodes] = useState<AccessCodeRow[]>([]);
  const [codesLoaded, setCodesLoaded] = useState(false);
  const [newCodeNote, setNewCodeNote] = useState('');
  const [codesLoading, setCodesLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  async function loadCodes() {
    setCodesLoading(true);
    try {
      const res = await fetch(`/api/admin/access-codes?secret=urcecret-admin-natha-2024`);
      const data = await res.json();
      setCodes(data.codes ?? []);
      setCodesLoaded(true);
    } finally { setCodesLoading(false); }
  }

  async function generateCode() {
    setCodesLoading(true);
    setGeneratedCode('');
    try {
      const res = await fetch(`/api/admin/access-codes?secret=urcecret-admin-natha-2024`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newCodeNote.trim() || undefined }),
      });
      const data = await res.json();
      if (data.code) {
        setGeneratedCode(data.code.code);
        setNewCodeNote('');
        await loadCodes();
      }
    } finally { setCodesLoading(false); }
  }

  async function deleteCode(id: string) {
    await fetch(`/api/admin/access-codes?secret=urcecret-admin-natha-2024&id=${id}`, { method: 'DELETE' });
    setCodes(prev => prev.filter(c => c.id !== id));
  }

  async function fetchStripeStats() {
    setStripeLoading(true);
    try {
      const res = await fetch('/api/admin/stripe-stats', {
        headers: { 'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? 'urcecret-admin-2026' },
      });
      if (res.ok) setStripeStats(await res.json());
    } catch { /* no-op */ } finally { setStripeLoading(false); }
  }

  useEffect(() => {
    fetchStripeStats();
  }, []);

  useEffect(() => {
    if (tab === 'codes' && !codesLoaded) loadCodes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
      fetchStripeStats();
      setLastRefresh(new Date().toLocaleTimeString('fr-FR'));
    }, 30_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const last12 = useMemo(() => getLast12Keys(), []);
  const monthLabels = useMemo(() => last12.map(keyToLabel), [last12]);

  const usersSeries    = useMemo(() => last12.map(k => (stats.usersByMonth ?? {})[k] ?? 0), [last12, stats.usersByMonth]);
  const premiumSeries  = useMemo(() => last12.map(k => (stats.premiumByMonth ?? {})[k] ?? 0), [last12, stats.premiumByMonth]);
  const quizSeries     = useMemo(() => last12.map(k => (stats.quizByMonth ?? {})[k] ?? 0), [last12, stats.quizByMonth]);
  const paidSeries     = useMemo(() => last12.map(k => (stats.paidByMonth ?? {})[k] ?? 0), [last12, stats.paidByMonth]);
  const revSeries      = useMemo(() => last12.map(k => ((stats.revenueByMonth ?? {})[k]?.revenue ?? 0)), [last12, stats.revenueByMonth]);
  const commSeries     = useMemo(() => last12.map(k => ((stats.revenueByMonth ?? {})[k]?.commission ?? 0)), [last12, stats.revenueByMonth]);

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

  const affiliateRanking = useMemo(() => {
    return stats.affiliates
      .map(a => {
        const ca = a.conversions.reduce((s, c) => s + c.amountCents, 0);
        const commissionDue = calcCommission(a.conversions);
        return {
          id: a.id,
          name: a.name,
          slug: a.slug,
          email: a.email,
          ca,
          sales: a.conversions.length,
          clicks: (stats.affiliateClicks ?? {})[a.slug] ?? 0,
          commission: commissionDue,
          conversions: a.conversions,
        };
      })
      .filter(a => !affiliateSearch || a.name.toLowerCase().includes(affiliateSearch.toLowerCase()) || a.slug.includes(affiliateSearch.toLowerCase()))
      .sort((a, b) => {
        if (affiliateSort === 'ca') return b.ca - a.ca;
        if (affiliateSort === 'clicks') return b.clicks - a.clicks;
        if (affiliateSort === 'commission') return b.commission - a.commission;
        return b.sales - a.sales;
      });
  }, [stats.affiliates, stats.affiliateClicks, affiliateSearch, affiliateSort]);

  const totalAffilCA         = affiliateRanking.reduce((s, a) => s + a.ca, 0);
  const totalAffilCommission = affiliateRanking.reduce((s, a) => s + a.commission, 0);
  const maxAffilCA     = Math.max(...affiliateRanking.map(a => a.ca), 1);
  const maxAffilClicks = Math.max(...affiliateRanking.map(a => a.clicks), 1);
  const maxQuizCount   = Math.max(...sortedQuizzes.map(q => q.count), 1);

  const topMbti  = Object.entries(stats.mbtiDistribution ?? {}).sort(([, a], [, b]) => b - a).slice(0, 8);
  const maxMbti  = Math.max(...topMbti.map(([, v]) => v), 1);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',   label: '📊 Vue d\'ensemble' },
    { id: 'activite',   label: '⚡ Activité' },
    { id: 'users',      label: '👥 Utilisateurs' },
    { id: 'revenue',    label: '💰 Revenus' },
    { id: 'quizzes',    label: '🧩 Quiz' },
    { id: 'affiliates', label: '🔗 Affiliés' },
    { id: 'codes',      label: '🎟️ Codes' },
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
            <span style={{ fontSize: 11, color: '#3f3f46', fontWeight: 400, marginLeft: 8 }}>Admin</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {stripeStats && (
              <span style={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>
                MRR {fmt(stripeStats.mrr)}
              </span>
            )}
            <span style={{ fontSize: 11, color: '#3f3f46' }}>↻ {lastRefresh}</span>
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

            {/* Stripe KPIs */}
            {stripeStats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                <KpiCard label="MRR (Stripe)" value={fmt(stripeStats.mrr)} sub="revenu mensuel récurrent" color="#34d399" />
                <KpiCard label="Abonnés actifs" value={(stripeStats.monthlyCount + stripeStats.annualCount).toLocaleString('fr-FR')} sub={`${stripeStats.monthlyCount} mensuel · ${stripeStats.annualCount} annuel`} color="#34d399" />
                <KpiCard label="Churn (30j)" value={stripeStats.churnedLast30} sub="abonnements résiliés" color="#f87171" />
                <KpiCard label="CA affiliés total" value={fmt(stats.totalRevenueCents)} sub={`${fmt(stats.monthRevenueCents)} ce mois`} color="#fbbf24" />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                <KpiCard label="MRR" value={stripeLoading ? '...' : '—'} sub="chargement Stripe" color="#34d399" />
                <KpiCard label="Abonnés actifs" value="—" color="#34d399" />
                <KpiCard label="Churn (30j)" value="—" color="#f87171" />
                <KpiCard label="CA affiliés total" value={fmt(stats.totalRevenueCents)} sub={`${fmt(stats.monthRevenueCents)} ce mois`} color="#fbbf24" />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <KpiCard label="Total inscrits" value={stats.totalUsers.toLocaleString('fr-FR')} sub={`+${stats.newThisMonth} ce mois`} color="#a78bfa" />
              <KpiCard label="Premium (DB)" value={stats.premiumUsers} sub={`${conversionRate}% conversion`} color="#f472b6" />
              <KpiCard label="Tests MBTI" value={(stats.byQuiz['personnalite']?.count ?? 0).toLocaleString('fr-FR')} sub={`${stats.totalResults.toLocaleString('fr-FR')} quiz total`} color="#0ea5e9" />
              <KpiCard label="Vues de page" value={stats.totalPageViews.toLocaleString('fr-FR')} sub="total cumulé" color="#0ea5e9" />
            </div>

            {/* Acquisition funnel */}
            {cardP(
              <>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>Entonnoir d&apos;acquisition</p>
                <FunnelStep label="Visiteurs uniques (vues de page)" value={stats.totalPageViews} color="#71717a" />
                <FunnelStep label="Inscrits (comptes créés)" value={stats.totalUsers} pct={stats.totalPageViews > 0 ? (stats.totalUsers / stats.totalPageViews) * 100 : 0} color="#a78bfa" />
                <FunnelStep label="Payants (premium)" value={stats.premiumUsers} pct={stats.totalUsers > 0 ? (stats.premiumUsers / stats.totalUsers) * 100 : 0} color="#f472b6" />
                {stripeStats && (
                  <FunnelStep label="Abonnés actifs Stripe" value={stripeStats.monthlyCount + stripeStats.annualCount} pct={stats.premiumUsers > 0 ? ((stripeStats.monthlyCount + stripeStats.annualCount) / stats.premiumUsers) * 100 : 0} color="#34d399" />
                )}
              </>
            )}

            {/* Growth chart */}
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
                    <HorizBar key={type} label={type.toUpperCase()} value={count} max={maxMbti}
                      color="linear-gradient(90deg,#7c3aed,#a78bfa)"
                      valueLabel={`${count} (${((count / stats.totalUsers) * 100).toFixed(1)}%)`} />
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
                          <td style={{ ...tdStyle, color: '#d4d4d8' }}>{maskEmail(u.email)}</td>
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

        {/* ── ACTIVITÉ ── */}
        {tab === 'activite' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {sectionTitle('Activité', 'Paiements Stripe & inscriptions récentes · refresh auto 30s')}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Stripe charges */}
              {card(
                <>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Derniers paiements Stripe</span>
                    <button onClick={fetchStripeStats} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', cursor: 'pointer' }}>
                      {stripeLoading ? '...' : '↻ Rafraîchir'}
                    </button>
                  </div>
                  {stripeStats ? (
                    stripeStats.recentCharges.length === 0 ? (
                      <p style={{ padding: '32px 20px', textAlign: 'center', color: '#3f3f46', fontSize: 13 }}>Aucun paiement récent</p>
                    ) : (
                      <div>
                        {stripeStats.recentCharges.map(c => (
                          <div key={c.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ color: '#34d399', fontWeight: 700, fontSize: 14, margin: 0 }}>
                                {(c.amount / 100).toFixed(2)} {c.currency.toUpperCase()}
                              </p>
                              <p style={{ color: '#52525b', fontSize: 11, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {maskEmail(c.receiptEmail)} · {c.description ?? '—'}
                              </p>
                            </div>
                            <p style={{ color: '#3f3f46', fontSize: 11, flexShrink: 0 }}>{fmtDateTime(c.created)}</p>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p style={{ padding: '32px 20px', textAlign: 'center', color: '#3f3f46', fontSize: 13 }}>
                      {stripeLoading ? 'Chargement Stripe...' : 'Clé Stripe non configurée'}
                    </p>
                  )}
                </>
              )}

              {/* Recent signups */}
              {card(
                <>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Dernières inscriptions</span>
                  </div>
                  {(stats.recentSignups ?? stats.recentUsers.slice(0, 20)).length === 0 ? (
                    <p style={{ padding: '32px 20px', textAlign: 'center', color: '#3f3f46', fontSize: 13 }}>Aucune inscription récente</p>
                  ) : (
                    <div>
                      {(stats.recentSignups ?? stats.recentUsers.slice(0, 20)).map(u => (
                        <div key={u.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.tier === 'premium' ? '#f472b6' : '#3f3f46', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: '#d4d4d8', fontSize: 13, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {maskEmail(u.email)}
                            </p>
                            <p style={{ margin: '2px 0 0' }}><TierBadge tier={u.tier} /></p>
                          </div>
                          <p style={{ color: '#3f3f46', fontSize: 11, flexShrink: 0 }}>{fmtDateTime(u.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Recent affiliate conversions */}
            {stats.recentConversions && stats.recentConversions.length > 0 && card(
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Dernières conversions affiliées</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr>
                      <th style={thStyle}>Affilié</th>
                      <th style={thStyle}>Montant</th>
                      <th style={thStyle}>Commission</th>
                      <th style={thStyle}>Date</th>
                    </tr></thead>
                    <tbody>
                      {stats.recentConversions.map(c => (
                        <tr key={c.id}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={tdStyle}>
                            <p style={{ color: '#d4d4d8', margin: 0 }}>{c.affiliateName}</p>
                            <p style={{ color: '#3f3f46', fontSize: 11, margin: 0 }}>/{c.affiliateSlug}</p>
                          </td>
                          <td style={{ ...tdStyle, color: '#fbbf24', fontWeight: 600 }}>{fmt(c.amountCents)}</td>
                          <td style={{ ...tdStyle, color: '#f472b6' }}>{fmt(c.commissionCents)}</td>
                          <td style={{ ...tdStyle, color: '#3f3f46', fontSize: 11 }}>{fmtDateTime(c.createdAt)}</td>
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

            {stripeStats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                <KpiCard label="MRR Stripe" value={fmt(stripeStats.mrr)} sub="revenu mensuel récurrent" color="#34d399" />
                <KpiCard label="Abonnés Stripe" value={stripeStats.monthlyCount + stripeStats.annualCount} sub={`${stripeStats.monthlyCount} mensuel · ${stripeStats.annualCount} annuel`} color="#34d399" />
                <KpiCard label="Churn (30j)" value={stripeStats.churnedLast30} sub="résiliations récentes" color="#f87171" />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <KpiCard label="Unlocks payants (total)" value={stats.paidResults}     sub="résultats débloqués"    color="#34d399" />
              <KpiCard label="Unlocks ce mois"         value={stats.paidThisMonth}   sub={`+${stats.paidToday} auj.`} color="#34d399" />
              <KpiCard label="Taux de conversion"      value={`${conversionRate}%`} sub="inscrits → premium"  color="#a78bfa" />
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
              {sectionTitle('Affiliés', `${stats.affiliates.length} affiliés · règle 80% (30j) → 30%`)}
              <Link href="/admin/affiliates" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: 'none', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)', flexShrink: 0 }}>
                Gérer →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <KpiCard label="Total affiliés"       value={stats.affiliates.length}                                                   color="#a78bfa" />
              <KpiCard label="Total conversions"    value={stats.affiliates.reduce((s, a) => s + a.conversions.length, 0)}            color="#a78bfa" />
              <KpiCard label="CA total affiliés"    value={fmt(totalAffilCA)}    sub="toutes conversions"  color="#fbbf24" />
              <KpiCard label="Commissions (80/30)"  value={fmt(totalAffilCommission)} sub="à payer"        color="#f472b6" />
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
                  h={150}
                />
              </>
            )}

            {/* Sort + Search */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Rechercher un affilié…"
                value={affiliateSearch}
                onChange={e => setAffiliateSearch(e.target.value)}
                style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', outline: 'none' }}
              />
              {(['ca', 'clicks', 'sales', 'commission'] as const).map(s => (
                <button key={s} onClick={() => setAffiliateSort(s)} style={{
                  padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: affiliateSort === s ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.04)',
                  color: affiliateSort === s ? '#a78bfa' : '#52525b',
                  border: affiliateSort === s ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.07)',
                }}>
                  {s === 'ca' ? 'CA ↓' : s === 'clicks' ? 'Clics ↓' : s === 'sales' ? 'Ventes ↓' : 'Commission ↓'}
                </button>
              ))}
            </div>

            {/* Affiliate leaderboard */}
            {card(
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, fontSize: 14 }}>
                  Classement affiliés
                </div>
                {affiliateRanking.length === 0 ? (
                  <p style={{ padding: '32px', textAlign: 'center', color: '#3f3f46', fontSize: 13 }}>Aucun affilié</p>
                ) : (
                  affiliateRanking.map((a, i) => (
                    <div key={a.id}>
                      <div
                        onClick={() => setExpandedAffiliate(expandedAffiliate === a.id ? null : a.id)}
                        style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background .1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ fontSize: 16, width: 28, flexShrink: 0 }}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>{a.name}</p>
                            <p style={{ color: '#3f3f46', fontSize: 11, margin: '2px 0 0' }}>/{a.slug} · {a.email ?? '—'}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: 14, margin: 0 }}>{fmt(a.ca)}</p>
                              <p style={{ color: '#3f3f46', fontSize: 10, margin: 0 }}>CA</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: '#f472b6', fontWeight: 700, fontSize: 14, margin: 0 }}>{fmt(a.commission)}</p>
                              <p style={{ color: '#3f3f46', fontSize: 10, margin: 0 }}>Commission due</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: '#a78bfa', fontWeight: 700, fontSize: 14, margin: 0 }}>{a.clicks.toLocaleString('fr-FR')}</p>
                              <p style={{ color: '#3f3f46', fontSize: 10, margin: 0 }}>Clics</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: '#d4d4d8', fontWeight: 700, fontSize: 14, margin: 0 }}>{a.sales}</p>
                              <p style={{ color: '#3f3f46', fontSize: 10, margin: 0 }}>Ventes</p>
                            </div>
                            <span style={{ color: expandedAffiliate === a.id ? '#a78bfa' : '#3f3f46', fontSize: 12, alignSelf: 'center' }}>
                              {expandedAffiliate === a.id ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>
                        {/* CA bar */}
                        <div style={{ marginTop: 8, marginLeft: 44, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(a.ca / maxAffilCA) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#fbbf24)', borderRadius: 999 }} />
                        </div>
                      </div>

                      {/* Expanded: commission breakdown */}
                      {expandedAffiliate === a.id && (
                        <div style={{ background: 'rgba(139,92,246,0.05)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '16px 20px 20px 64px' }}>
                          <p style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Règle commission : 80% premiers 30j · 30% ensuite
                          </p>
                          {a.conversions.length === 0 ? (
                            <p style={{ color: '#3f3f46', fontSize: 13 }}>Aucune conversion</p>
                          ) : (() => {
                            const sorted = [...a.conversions].sort((x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime());
                            const firstDate = new Date(sorted[0].createdAt);
                            const cutoff = new Date(firstDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                            return (
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                  <thead><tr>
                                    {['Date','Montant','Taux','Commission due','Période'].map(h => (
                                      <th key={h} style={{ ...thStyle, fontSize: 10, padding: '8px 12px' }}>{h}</th>
                                    ))}
                                  </tr></thead>
                                  <tbody>
                                    {sorted.map((c, ci) => {
                                      const isEarlyBird = new Date(c.createdAt) <= cutoff;
                                      const rate = isEarlyBird ? 0.80 : 0.30;
                                      const due = Math.round(c.amountCents * rate);
                                      return (
                                        <tr key={ci}>
                                          <td style={{ ...tdStyle, fontSize: 11, padding: '8px 12px', color: '#71717a' }}>{fmtDate(c.createdAt)}</td>
                                          <td style={{ ...tdStyle, fontSize: 12, padding: '8px 12px', color: '#fbbf24', fontWeight: 600 }}>{fmt(c.amountCents)}</td>
                                          <td style={{ ...tdStyle, fontSize: 12, padding: '8px 12px', color: isEarlyBird ? '#34d399' : '#71717a', fontWeight: 600 }}>{(rate * 100).toFixed(0)}%</td>
                                          <td style={{ ...tdStyle, fontSize: 12, padding: '8px 12px', color: '#f472b6', fontWeight: 600 }}>{fmt(due)}</td>
                                          <td style={{ ...tdStyle, fontSize: 11, padding: '8px 12px' }}>
                                            <span style={{
                                              background: isEarlyBird ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                                              color: isEarlyBird ? '#34d399' : '#52525b',
                                              border: `1px solid ${isEarlyBird ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.07)'}`,
                                              padding: '2px 8px', borderRadius: 999, fontSize: 10,
                                            }}>
                                              {isEarlyBird ? 'Premiers 30j' : 'Après 30j'}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                    <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                      <td colSpan={3} style={{ padding: '10px 12px', fontSize: 12, color: '#71717a', fontWeight: 600 }}>Total commission due</td>
                                      <td style={{ padding: '10px 12px', color: '#f472b6', fontWeight: 800, fontSize: 14 }}>{fmt(a.commission)}</td>
                                      <td />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}

        {/* ── ACCESS CODES ── */}
        {tab === 'codes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>Codes d&apos;accès affiliés</h1>
              <p style={{ fontSize: 13, color: '#52525b', marginTop: 4 }}>Codes à usage unique pour tester l&apos;app gratuitement</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '20px 24px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 16 }}>Générer un nouveau code</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={newCodeNote}
                  onChange={e => setNewCodeNote(e.target.value)}
                  placeholder="Note (ex: NomAffiliéX)"
                  style={{ flex: 1, minWidth: 180, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                />
                <button onClick={generateCode} disabled={codesLoading} style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', opacity: codesLoading ? 0.6 : 1 }}>
                  {codesLoading ? '...' : '+ Générer'}
                </button>
              </div>
              {generatedCode && (
                <div style={{ marginTop: 16, padding: '14px 18px', borderRadius: 12, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <p style={{ fontSize: 11, color: '#a78bfa', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Code généré — à copier !</p>
                  <p style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '0.2em', fontFamily: 'monospace' }}>{generatedCode}</p>
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr>
                    {['Code','Note','Statut','Utilisé par','Date',''].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {codes.map(c => (
                      <tr key={c.id}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#e4e4e7', letterSpacing: '0.1em' }}>{c.code}</td>
                        <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#71717a', fontSize: 12 }}>{c.note ?? '—'}</td>
                        <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {c.used
                            ? <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Utilisé</span>
                            : <span style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Disponible</span>}
                        </td>
                        <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#52525b', fontSize: 11 }}>{c.usedByEmail?.replace('@urcecret.app', '') ?? '—'}</td>
                        <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#3f3f46', fontSize: 11, whiteSpace: 'nowrap' }}>{fmtDate(c.createdAt)}</td>
                        <td style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {!c.used && (
                            <button onClick={() => deleteCode(c.id)} style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 11, cursor: 'pointer' }}>
                              Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {codes.length === 0 && !codesLoading && (
                      <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#3f3f46' }}>Aucun code — génère le premier ci-dessus</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
