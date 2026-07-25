'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'overview' | 'users' | 'revenue' | 'quizzes' | 'affiliates' | 'codes' | 'activite' | 'sources';

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
  recentAttributionConversions?: Array<{
    id: string; email: string | null; amountCents: number; quizSlug: string | null;
    productType: string | null; utmSource: string | null; utmMedium: string | null;
    utmCampaign: string | null; affiliateSlug: string | null; landingPath: string | null;
    createdAt: string;
  }>;
  sourceBreakdown?: Record<string, { count: number; revenueCents: number }>;
  // Attribution des VISITES (visiteurs uniques par source, depuis PageView.source)
  visitSources7d?: Record<string, number>;
  visitSourcesToday?: Record<string, number>;
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

// ── Design system — deliberately NOT the public site's ink/gold/serif "oracle"
// identity. This is a cockpit for one person checking numbers, modeled after
// App Store Connect / Play Console: light surface, one restrained accent blue,
// a small fixed semantic set (good/warn/critical), single sans family, tighter
// type scale. See PRODUCT.md for the register rationale. ──────────────────────
const C = {
  bg: '#f5f5f7',
  surface: '#ffffff',
  surfaceAlt: '#fbfbfd',
  border: '#d2d2d7',
  borderSoft: '#e8e8ed',
  ink: '#1d1d1f',
  muted: '#6e6e73',
  faint: '#98989d',
  primary: '#0071e3',
  primarySoft: 'rgba(0,113,227,0.08)',
  primaryBorder: 'rgba(0,113,227,0.28)',
  good: '#1a9e46',
  goodSoft: 'rgba(26,158,70,0.1)',
  goodBorder: 'rgba(26,158,70,0.25)',
  warn: '#c26a00',
  warnSoft: 'rgba(255,149,0,0.12)',
  warnBorder: 'rgba(255,149,0,0.3)',
  critical: '#d70015',
  criticalSoft: 'rgba(255,59,48,0.1)',
  criticalBorder: 'rgba(255,59,48,0.25)',
};
// Ordre fixe pour les séries de graphiques — jamais recyclé/réassigné par écran.
const SERIES = ['#0071e3', '#5e5ce6', '#ff9500', '#1a9e46', '#af52de'];
const FONT = 'var(--font-sans), -apple-system, system-ui, sans-serif';

// Un seul palier par tier — couleurs distinctes, jamais réutilisées ailleurs.
const TIER_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  free:     { label: 'Gratuit',  color: C.muted,   bg: '#f0f0f2',                    border: C.borderSoft },
  unlocked: { label: 'Unlocked', color: '#af52de', bg: 'rgba(175,82,222,0.1)',       border: 'rgba(175,82,222,0.25)' },
  starter:  { label: 'Starter',  color: '#5ac8fa', bg: 'rgba(90,200,250,0.12)',      border: 'rgba(90,200,250,0.28)' },
  plus:     { label: 'Plus',     color: C.primary, bg: C.primarySoft,                border: C.primaryBorder },
  premium:  { label: 'Premium',  color: C.warn,    bg: C.warnSoft,                   border: C.warnBorder },
};

// ── KPI tile — number first, label second (normal case, no tracked-uppercase
// eyebrow), tabular figures so columns of tiles line up. ─────────────────────
function KpiCard({ label, value, sub, subColor, icon }: {
  label: string; value: string | number; sub?: string; subColor?: string; icon?: string;
}) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.ink, marginBottom: 4, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', wordBreak: 'break-word' }}>{value}</p>
      {sub && <p style={{ fontSize: 12.5, color: subColor ?? C.muted, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const s = TIER_STYLE[tier] ?? TIER_STYLE.free;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '2px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ── SVG Line Chart — same interaction model as before (hover for tooltip),
// restyled for a light surface: faint gridlines, light tooltip card. ────────
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

  if (!n) return <p style={{ textAlign: 'center', padding: '40px 0', color: C.faint, fontSize: 13 }}>Aucune donnée</p>;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: 16 }}>
        {series.map(s => (
          <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.muted }}>
            <span style={{ width: 20, height: 2.5, background: s.color, borderRadius: 2, display: 'inline-block' }} />
            {s.label}
          </span>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${h}`} width="100%" height={h} style={{ display: 'block', minWidth: 280 }}>
          <defs>
            {series.map((s, si) => (
              <linearGradient key={si} id={`lg${si}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.16" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1={PAD.l} y1={yOf(maxVal * p)} x2={W - PAD.r} y2={yOf(maxVal * p)}
              stroke={C.borderSoft} strokeWidth={1} />
          ))}
          {hovIdx !== null && (
            <line x1={xOf(hovIdx)} y1={PAD.t} x2={xOf(hovIdx)} y2={PAD.t + iH}
              stroke={C.border} strokeWidth={1} />
          )}
          {series.map((s, si) => <path key={`a${si}`} d={areaPath(s.values)} fill={`url(#lg${si})`} />)}
          {series.map((s, si) => (
            <path key={`l${si}`} d={curvePath(s.values)}
              fill="none" stroke={s.color} strokeWidth={2.25} strokeLinecap="round" />
          ))}
          {hovIdx !== null && series.map((s, si) => (
            <circle key={`hd${si}`} cx={xOf(hovIdx)} cy={yOf(s.values[hovIdx] ?? 0)} r={4.5}
              fill={s.color} stroke="#fff" strokeWidth={2} />
          ))}
          {xLabels.map((_, i) => (
            <rect key={`hz${i}`} x={xOf(i) - iW / n / 2} y={0} width={iW / n} height={h}
              fill="transparent" style={{ cursor: 'default' }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} />
          ))}
          {xLabels.map((l, i) => (
            <text key={i} x={xOf(i)} y={h - 5} textAnchor="middle" fontSize={9.5} fill={C.faint}>{l}</text>
          ))}
          {hovIdx !== null && (() => {
            const tipW = 132, tipH = 18 + series.length * 18;
            const hx = xOf(hovIdx);
            const safeTipX = Math.min(Math.max(hx - tipW / 2, 4), W - tipW - 4);
            return (
              <g>
                <rect x={safeTipX} y={PAD.t + 4} width={tipW} height={tipH} rx={8}
                  fill="#fff" stroke={C.border} strokeWidth={1} style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.08))' }} />
                <text x={safeTipX + 10} y={PAD.t + 18} fontSize={9.5} fill={C.faint}>{xLabels[hovIdx]}</text>
                {series.map((s, si) => (
                  <text key={si} x={safeTipX + 10} y={PAD.t + 30 + si * 18} fontSize={10.5} fill={s.color} fontWeight="600">
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

// ── Hero metric — the App Store Connect / Play Console signature: one big
// number + one line, with a segmented control to switch which metric is
// "in focus". Everything shown is real data already in `stats`; nothing
// here is estimated or interpolated. ─────────────────────────────────────────
function HeroMetric({ metrics, monthLabels }: {
  metrics: { key: string; label: string; color: string; values: number[]; fmtVal: (v: number) => string }[];
  monthLabels: string[];
}) {
  const [active, setActive] = useState(0);
  const m = metrics[active];
  const total = m.values.reduce((s, v) => s + v, 0);
  const latest = m.values[m.values.length - 1] ?? 0;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
      <div style={{ display: 'flex', gap: 4, padding: '10px 10px 0', overflowX: 'auto' }}>
        {metrics.map((met, i) => (
          <button key={met.key} onClick={() => setActive(i)} style={{
            padding: '8px 14px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: active === i ? C.ink : C.muted,
            borderBottom: active === i ? `2px solid ${met.color}` : '2px solid transparent',
            marginBottom: -1,
          }}>{met.label}</button>
        ))}
      </div>
      <div style={{ padding: '20px 24px 24px' }}>
        <p style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: C.ink, margin: '0 0 2px', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
          {m.fmtVal(total)}
        </p>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px' }}>
          Total sur 12 mois · {m.fmtVal(latest)} ce mois-ci
        </p>
        <LineChart xLabels={monthLabels} series={[{ label: m.label, color: m.color, values: m.values }]} fmtVal={m.fmtVal} h={200} />
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
      <div style={{ width: 112, textAlign: 'right', fontSize: 12.5, color: C.muted, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>{label}</div>
      <div style={{ flex: 1, height: 12, borderRadius: 999, background: C.surfaceAlt, border: `1px solid ${C.borderSoft}`, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
      </div>
      <div style={{ width: 80, fontSize: 12.5, color: C.ink, fontWeight: 600, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{valueLabel}</div>
    </div>
  );
}

// ── Funnel step ───────────────────────────────────────────────────────────────
function FunnelStep({ label, value, pct, color }: { label: string; value: number; pct?: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ color: C.ink, fontSize: 13.5, fontWeight: 500, margin: 0 }}>{label}</p>
        {pct !== undefined && (
          <div style={{ marginTop: 4, height: 4, borderRadius: 999, background: C.surfaceAlt, overflow: 'hidden', maxWidth: 240 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ color: C.ink, fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value.toLocaleString('fr-FR')}</p>
        {pct !== undefined && <p style={{ color, fontSize: 11.5, margin: '2px 0 0', fontWeight: 600 }}>{pct.toFixed(1)}%</p>}
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
  const maxQuizCount   = Math.max(...sortedQuizzes.map(q => q.count), 1);

  const topMbti  = Object.entries(stats.mbtiDistribution ?? {}).sort(([, a], [, b]) => b - a).slice(0, 8);
  const maxMbti  = Math.max(...topMbti.map(([, v]) => v), 1);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',   label: 'Vue d\'ensemble' },
    { id: 'activite',   label: 'Activité' },
    { id: 'sources',    label: 'Sources' },
    { id: 'users',      label: 'Utilisateurs' },
    { id: 'revenue',    label: 'Revenus' },
    { id: 'quizzes',    label: 'Quiz' },
    { id: 'affiliates', label: 'Affiliés' },
    { id: 'codes',      label: 'Codes' },
  ];

  const card = (content: React.ReactNode) => (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
      {content}
    </div>
  );

  const cardP = (content: React.ReactNode) => (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px' }}>
      {content}
    </div>
  );

  const sectionTitle = (text: string, sub?: string) => (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, letterSpacing: '-0.01em' }}>{text}</h1>
      {sub && <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{sub}</p>}
    </div>
  );

  const thStyle = { textAlign: 'left' as const, padding: '11px 20px', fontSize: 11.5, color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt };
  const tdStyle = { padding: '12px 20px', fontSize: 13, borderBottom: `1px solid ${C.borderSoft}` };
  const rowHover = { onMouseEnter: (e: React.MouseEvent<HTMLTableRowElement>) => (e.currentTarget.style.background = C.surfaceAlt), onMouseLeave: (e: React.MouseEvent<HTMLTableRowElement>) => (e.currentTarget.style.background = 'transparent') };

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.ink, fontFamily: FONT }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(245,245,247,0.86)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/" style={{ fontSize: 16, fontWeight: 700, textDecoration: 'none', color: C.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
            UrCecret
            <span style={{ fontSize: 11, color: C.faint, fontWeight: 500 }}>Admin</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {stripeStats && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: C.good, fontWeight: 600, background: C.goodSoft, border: `1px solid ${C.goodBorder}`, padding: '5px 12px', borderRadius: 999 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.good }} />
                MRR {fmt(stripeStats.mrr)}
              </span>
            )}
            <span style={{ fontSize: 11.5, color: C.faint }}>↻ {lastRefresh}</span>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 14px', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap',
              background: 'transparent', cursor: 'pointer', color: tab === t.id ? C.ink : C.muted,
              border: 'none', borderBottom: tab === t.id ? `2px solid ${C.primary}` : '2px solid transparent',
              marginBottom: -1, transition: 'color .15s',
            }}>{t.label}</button>
          ))}
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sectionTitle('Vue d\'ensemble', 'Statistiques en temps réel')}

            {/* Stripe KPIs */}
            {stripeStats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <KpiCard label="MRR (Stripe)" value={fmt(stripeStats.mrr)} sub="revenu mensuel récurrent" subColor={C.good} />
                <KpiCard label="Abonnés actifs" value={(stripeStats.monthlyCount + stripeStats.annualCount).toLocaleString('fr-FR')} sub={`${stripeStats.monthlyCount} mensuel · ${stripeStats.annualCount} annuel`} />
                <KpiCard label="Churn (30j)" value={stripeStats.churnedLast30} sub="abonnements résiliés" subColor={C.critical} />
                <KpiCard label="CA total" value={fmt(stats.totalRevenueCents)} sub={`${fmt(stats.monthRevenueCents)} ce mois`} />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <KpiCard label="MRR" value={stripeLoading ? '...' : '—'} sub="chargement Stripe" />
                <KpiCard label="Abonnés actifs" value="—" />
                <KpiCard label="Churn (30j)" value="—" />
                <KpiCard label="CA total" value={fmt(stats.totalRevenueCents)} sub={`${fmt(stats.monthRevenueCents)} ce mois`} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <KpiCard label="Total inscrits" value={stats.totalUsers.toLocaleString('fr-FR')} sub={`+${stats.newThisMonth} ce mois`} />
              <KpiCard label="Premium (DB)" value={stats.premiumUsers} sub={`${conversionRate}% conversion`} />
              <KpiCard label="Tests MBTI" value={(stats.byQuiz['personnalite']?.count ?? 0).toLocaleString('fr-FR')} sub={`${stats.totalResults.toLocaleString('fr-FR')} quiz total`} />
              <KpiCard label="Vues de page" value={stats.totalPageViews.toLocaleString('fr-FR')} sub="total cumulé" />
            </div>

            {/* Hero chart — signature Overview module: one metric in focus at a time */}
            <HeroMetric
              monthLabels={monthLabels}
              metrics={[
                { key: 'users', label: 'Inscrits', color: SERIES[0], values: usersSeries, fmtVal: v => v.toLocaleString('fr-FR') },
                { key: 'premium', label: 'Premium', color: SERIES[1], values: premiumSeries, fmtVal: v => v.toLocaleString('fr-FR') },
                { key: 'quiz', label: 'Quiz complétés', color: SERIES[2], values: quizSeries, fmtVal: v => v.toLocaleString('fr-FR') },
                { key: 'revenue', label: 'CA affiliés', color: SERIES[3], values: revSeries, fmtVal: v => fmt(v) },
              ]}
            />

            {/* Acquisition funnel */}
            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 16 }}>Entonnoir d&apos;acquisition</p>
                <FunnelStep label="Visiteurs uniques (vues de page)" value={stats.totalPageViews} color={C.faint} />
                <FunnelStep label="Inscrits (comptes créés)" value={stats.totalUsers} pct={stats.totalPageViews > 0 ? (stats.totalUsers / stats.totalPageViews) * 100 : 0} color={SERIES[0]} />
                <FunnelStep label="Payants (premium)" value={stats.premiumUsers} pct={stats.totalUsers > 0 ? (stats.premiumUsers / stats.totalUsers) * 100 : 0} color={SERIES[1]} />
                {stripeStats && (
                  <FunnelStep label="Abonnés actifs Stripe" value={stripeStats.monthlyCount + stripeStats.annualCount} pct={stats.premiumUsers > 0 ? ((stripeStats.monthlyCount + stripeStats.annualCount) / stats.premiumUsers) * 100 : 0} color={C.good} />
                )}
              </>
            )}

            {/* Top MBTI */}
            {topMbti.length > 0 && cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 16 }}>Top types MBTI</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '4px 24px' }}>
                  {topMbti.map(([type, count]) => (
                    <HorizBar key={type} label={type.toUpperCase()} value={count} max={maxMbti}
                      color={SERIES[0]}
                      valueLabel={`${count} (${((count / stats.totalUsers) * 100).toFixed(1)}%)`} />
                  ))}
                </div>
              </>
            )}

            {/* Recent signups */}
            {card(
              <>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, fontWeight: 600, fontSize: 14, background: C.surfaceAlt }}>Derniers inscrits</div>
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
                        <tr key={u.id} style={{ transition: 'background .1s' }} {...rowHover}>
                          <td style={{ ...tdStyle, color: C.ink }}>{maskEmail(u.email)}</td>
                          <td style={tdStyle}><TierBadge tier={u.tier} /></td>
                          <td style={{ ...tdStyle, color: C.muted }}>{fmtDate(u.createdAt)}</td>
                          <td style={{ ...tdStyle, color: C.muted }}>{u._count.quizResults}</td>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sectionTitle('Activité', 'Paiements Stripe & inscriptions récentes · refresh auto 30s')}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {/* Stripe charges */}
              {card(
                <>
                  <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Derniers paiements Stripe</span>
                    <button onClick={fetchStripeStats} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11.5, background: C.goodSoft, border: `1px solid ${C.goodBorder}`, color: C.good, cursor: 'pointer' }}>
                      {stripeLoading ? '...' : '↻ Rafraîchir'}
                    </button>
                  </div>
                  {stripeStats ? (
                    stripeStats.recentCharges.length === 0 ? (
                      <p style={{ padding: '32px 20px', textAlign: 'center', color: C.faint, fontSize: 13 }}>Aucun paiement récent</p>
                    ) : (
                      <div>
                        {stripeStats.recentCharges.map(c => (
                          <div key={c.id} style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.good, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ color: C.good, fontWeight: 700, fontSize: 14, margin: 0 }}>
                                {(c.amount / 100).toFixed(2)} {c.currency.toUpperCase()}
                              </p>
                              <p style={{ color: C.muted, fontSize: 11.5, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {maskEmail(c.receiptEmail)} · {c.description ?? '—'}
                              </p>
                            </div>
                            <p style={{ color: C.faint, fontSize: 11.5, flexShrink: 0 }}>{fmtDateTime(c.created)}</p>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p style={{ padding: '32px 20px', textAlign: 'center', color: C.faint, fontSize: 13 }}>
                      {stripeLoading ? 'Chargement Stripe...' : 'Clé Stripe non configurée'}
                    </p>
                  )}
                </>
              )}

              {/* Recent signups */}
              {card(
                <>
                  <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Dernières inscriptions</span>
                  </div>
                  {(stats.recentSignups ?? stats.recentUsers.slice(0, 20)).length === 0 ? (
                    <p style={{ padding: '32px 20px', textAlign: 'center', color: C.faint, fontSize: 13 }}>Aucune inscription récente</p>
                  ) : (
                    <div>
                      {(stats.recentSignups ?? stats.recentUsers.slice(0, 20)).map(u => (
                        <div key={u.id} style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.tier === 'premium' ? C.warn : C.faint, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: C.ink, fontSize: 13, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {maskEmail(u.email)}
                            </p>
                            <p style={{ margin: '2px 0 0' }}><TierBadge tier={u.tier} /></p>
                          </div>
                          <p style={{ color: C.faint, fontSize: 11.5, flexShrink: 0 }}>{fmtDateTime(u.createdAt)}</p>
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
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt }}>
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
                        <tr key={c.id} {...rowHover}>
                          <td style={tdStyle}>
                            <p style={{ color: C.ink, margin: 0 }}>{c.affiliateName}</p>
                            <p style={{ color: C.faint, fontSize: 11.5, margin: 0 }}>/{c.affiliateSlug}</p>
                          </td>
                          <td style={{ ...tdStyle, color: C.warn, fontWeight: 600 }}>{fmt(c.amountCents)}</td>
                          <td style={{ ...tdStyle, color: C.primary }}>{fmt(c.commissionCents)}</td>
                          <td style={{ ...tdStyle, color: C.faint, fontSize: 11.5 }}>{fmtDateTime(c.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SOURCES ── */}
        {tab === 'sources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sectionTitle('Sources d\'acquisition', 'Attribution complète · chaque paiement tracé avec sa source')}

            {/* D'où viennent les VISITES (visiteurs uniques, PageView.source) */}
            {card(
              <>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>D&apos;où viennent les visites</span>
                  <span style={{ color: C.muted, fontSize: 11.5 }}>visiteurs uniques · aff: = affilié · google = SEO · direct = lien sans tracking</span>
                </div>
                <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                  {([['Aujourd\'hui', stats.visitSourcesToday], ['7 derniers jours', stats.visitSources7d]] as const).map(([label, srcMap]) => {
                    const entries = Object.entries(srcMap ?? {}).sort((a, b) => b[1] - a[1]);
                    const total = entries.reduce((s, [, n]) => s + n, 0);
                    return (
                      <div key={label}>
                        <p style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                          {label} · {total} visiteur{total > 1 ? 's' : ''}
                        </p>
                        {entries.length === 0 ? (
                          <p style={{ color: C.faint, fontSize: 12 }}>Aucune visite trackée (les nouvelles visites apparaîtront ici)</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {entries.map(([src, n]) => {
                              const pct = total > 0 ? Math.round((n / total) * 100) : 0;
                              return (
                                <div key={src}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <span style={{ color: src === 'non tracé' ? C.faint : C.ink, fontSize: 12.5, fontWeight: 500 }}>{src}</span>
                                    <span style={{ color: C.muted, fontSize: 12 }}>{n} · {pct}%</span>
                                  </div>
                                  <div style={{ height: 5, borderRadius: 999, background: C.surfaceAlt, border: `1px solid ${C.borderSoft}`, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: src === 'non tracé' ? C.faint : C.primary, borderRadius: 999 }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* KPI cards — top sources */}
            {stats.sourceBreakdown && Object.keys(stats.sourceBreakdown).length > 0 && (() => {
              const sorted = Object.entries(stats.sourceBreakdown).sort((a, b) => b[1].revenueCents - a[1].revenueCents);
              const totalRev = sorted.reduce((s, [, v]) => s + v.revenueCents, 0);
              const totalCnt = sorted.reduce((s, [, v]) => s + v.count, 0);
              return (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    <KpiCard label="Sources uniques"  value={sorted.length} />
                    <KpiCard label="Conversions trackées" value={totalCnt} />
                    <KpiCard label="CA tracké"         value={fmt(totalRev)} sub="toutes sources" />
                    <KpiCard label="Meilleure source"  value={sorted[0]?.[0] ?? '—'} />
                  </div>

                  {card(
                    <>
                      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, fontWeight: 600, fontSize: 14 }}>
                        Répartition par source
                      </div>
                      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {sorted.map(([src, data]) => {
                          const pct = totalRev > 0 ? Math.round(data.revenueCents / totalRev * 100) : 0;
                          return (
                            <div key={src}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ color: C.ink, fontSize: 13, fontWeight: 500 }}>{src}</span>
                                <div style={{ display: 'flex', gap: 16 }}>
                                  <span style={{ color: C.muted, fontSize: 12 }}>{data.count} vente{data.count > 1 ? 's' : ''}</span>
                                  <span style={{ color: C.warn, fontWeight: 600, fontSize: 13 }}>{fmt(data.revenueCents)}</span>
                                  <span style={{ color: C.faint, fontSize: 12, width: 32, textAlign: 'right' }}>{pct}%</span>
                                </div>
                              </div>
                              <div style={{ height: 6, borderRadius: 999, background: C.surfaceAlt, border: `1px solid ${C.borderSoft}`, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: C.primary, borderRadius: 999, transition: 'width 0.4s ease' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              );
            })()}

            {/* Recent attribution conversions table */}
            {stats.recentAttributionConversions && stats.recentAttributionConversions.length > 0 ? card(
              <>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, fontWeight: 600, fontSize: 14 }}>
                  Dernières conversions trackées ({stats.recentAttributionConversions.length})
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead><tr>
                      {['Date','Email','Montant','Type','Quiz','Source','Medium','Campagne','Affilié','Page entrée'].map(h => (
                        <th key={h} style={{ ...thStyle, fontSize: 10.5 }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {stats.recentAttributionConversions.map(c => (
                        <tr key={c.id} {...rowHover}>
                          <td style={{ ...tdStyle, fontSize: 10.5, whiteSpace: 'nowrap', color: C.muted }}>{fmtDateTime(c.createdAt)}</td>
                          <td style={{ ...tdStyle, fontSize: 11, color: C.muted, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email ? maskEmail(c.email) : '—'}</td>
                          <td style={{ ...tdStyle, color: C.warn, fontWeight: 700, whiteSpace: 'nowrap' }}>{fmt(c.amountCents)}</td>
                          <td style={{ ...tdStyle }}>
                            {c.productType ? (
                              <span style={{
                                padding: '2px 7px', borderRadius: 999, fontSize: 10, fontWeight: 600,
                                background: c.productType === 'annual' ? C.warnSoft : c.productType === 'monthly' ? C.goodSoft : C.surfaceAlt,
                                color: c.productType === 'annual' ? C.warn : c.productType === 'monthly' ? C.good : C.muted,
                                border: `1px solid ${c.productType === 'annual' ? C.warnBorder : c.productType === 'monthly' ? C.goodBorder : C.borderSoft}`,
                              }}>{c.productType}</span>
                            ) : '—'}
                          </td>
                          <td style={{ ...tdStyle, color: C.muted, fontSize: 11 }}>{c.quizSlug ?? '—'}</td>
                          <td style={{ ...tdStyle }}>
                            {c.utmSource ? (
                              <span style={{ padding: '2px 7px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: C.primarySoft, color: C.primary, border: `1px solid ${C.primaryBorder}` }}>
                                {c.utmSource}
                              </span>
                            ) : <span style={{ color: C.faint, fontSize: 11 }}>organique</span>}
                          </td>
                          <td style={{ ...tdStyle, color: C.muted, fontSize: 11 }}>{c.utmMedium ?? '—'}</td>
                          <td style={{ ...tdStyle, color: C.muted, fontSize: 11 }}>{c.utmCampaign ?? '—'}</td>
                          <td style={{ ...tdStyle, color: C.muted, fontSize: 11 }}>{c.affiliateSlug ?? '—'}</td>
                          <td style={{ ...tdStyle, color: C.faint, fontSize: 10, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.landingPath ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
                <p style={{ color: C.muted, fontSize: 14 }}>Aucune conversion trackée pour l&apos;instant</p>
                <p style={{ color: C.faint, fontSize: 12, marginTop: 8 }}>Les prochains paiements seront automatiquement enregistrés avec leur source UTM.</p>
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              {sectionTitle('Utilisateurs', `${stats.totalUsers} inscrits · ${stats.premiumUsers} premium · ${stats.totalUsers - stats.premiumUsers} gratuits`)}
              <div style={{ display: 'flex', gap: 8 }}>
                {(['all', 'premium', 'free'] as const).map(f => (
                  <button key={f} onClick={() => setTierFilter(f)} style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    background: tierFilter === f ? C.primarySoft : C.surface,
                    color: tierFilter === f ? C.primary : C.muted,
                    border: tierFilter === f ? `1px solid ${C.primaryBorder}` : `1px solid ${C.border}`,
                  }}>{f === 'all' ? 'Tous' : f === 'premium' ? 'Premium' : 'Gratuit'}</button>
                ))}
              </div>
            </div>

            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 20 }}>Inscriptions vs Conversions premium</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'Nouveaux inscrits', color: SERIES[0], values: usersSeries },
                    { label: 'Conversions premium', color: SERIES[1], values: premiumSeries },
                  ]}
                  fmtVal={v => v.toLocaleString('fr-FR') + ' users'}
                />
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <KpiCard label="Aujourd'hui" value={stats.newToday} />
              <KpiCard label="Cette semaine" value={stats.newThisWeek} />
              <KpiCard label="Ce mois" value={stats.newThisMonth} />
            </div>

            <input type="text" placeholder="Rechercher par email ou nom…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 16px', borderRadius: 10, fontSize: 13.5, color: C.ink, background: C.surface, border: `1px solid ${C.border}`, outline: 'none', boxSizing: 'border-box' }} />

            {card(
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr>
                    {['#','Email','Nom','Tier','Inscrit le','Quiz'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} {...rowHover}>
                        <td style={{ ...tdStyle, color: C.faint, fontSize: 11.5 }}>{i + 1}</td>
                        <td style={{ ...tdStyle, color: C.ink, fontFamily: 'monospace', fontSize: 12 }}>{u.email ?? '—'}</td>
                        <td style={{ ...tdStyle, color: C.muted }}>{u.name ?? '—'}</td>
                        <td style={tdStyle}><TierBadge tier={u.tier} /></td>
                        <td style={{ ...tdStyle, color: C.muted, fontSize: 12 }}>{fmtDate(u.createdAt)}</td>
                        <td style={{ ...tdStyle, color: C.muted }}>{u._count.quizResults}</td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: C.faint, padding: '32px' }}>Aucun résultat</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sectionTitle('Revenus', undefined)}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
              <KpiCard label="Total cumulé"   value={fmt(stats.totalRevenueCents)} />
              <KpiCard label="Cette année"    value={fmt(stats.yearRevenueCents)} />
              <KpiCard label="Ce mois"        value={fmt(stats.monthRevenueCents)} />
              <KpiCard label="Cette semaine"  value={fmt(stats.weekRevenueCents)} />
              <KpiCard label="Aujourd'hui"    value={fmt(stats.todayRevenueCents)} />
            </div>

            {stripeStats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <KpiCard label="MRR Stripe" value={fmt(stripeStats.mrr)} sub="revenu mensuel récurrent" subColor={C.good} />
                <KpiCard label="Abonnés Stripe" value={stripeStats.monthlyCount + stripeStats.annualCount} sub={`${stripeStats.monthlyCount} mensuel · ${stripeStats.annualCount} annuel`} />
                <KpiCard label="Churn (30j)" value={stripeStats.churnedLast30} sub="résiliations récentes" subColor={C.critical} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <KpiCard label="Unlocks payants (total)" value={stats.paidResults} sub="résultats débloqués" />
              <KpiCard label="Unlocks ce mois"         value={stats.paidThisMonth} sub={`+${stats.paidToday} auj.`} />
              <KpiCard label="Taux de conversion"      value={`${conversionRate}%`} sub="inscrits → premium" />
            </div>

            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 20 }}>CA affiliés & commissions · 12 mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'CA généré', color: SERIES[2], values: revSeries },
                    { label: 'Commissions', color: SERIES[1], values: commSeries },
                  ]}
                  fmtVal={v => fmt(v)}
                  h={180}
                />
              </>
            )}

            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 20 }}>Unlocks payants par mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[{ label: 'Unlocks payants', color: C.good, values: paidSeries }]}
                  fmtVal={v => v.toLocaleString('fr-FR') + ' unlocks'}
                  h={130}
                />
              </>
            )}

            {card(
              <>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, fontWeight: 600, fontSize: 14 }}>Détail mensuel</div>
                {sortedMonths.length === 0
                  ? <p style={{ padding: '32px', textAlign: 'center', color: C.faint, fontSize: 13 }}>Aucune conversion enregistrée</p>
                  : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr>
                      {['Mois','CA généré','Commissions','Conversions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {sortedMonths.map(([month, data]) => (
                        <tr key={month} {...rowHover}>
                          <td style={{ ...tdStyle, color: C.ink, fontWeight: 500 }}>
                            {new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          </td>
                          <td style={{ ...tdStyle, color: C.warn, fontWeight: 600 }}>{fmt(data.revenue)}</td>
                          <td style={{ ...tdStyle, color: C.primary }}>{fmt(data.commission)}</td>
                          <td style={{ ...tdStyle, color: C.muted }}>{data.count}</td>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sectionTitle('Stats Quiz', `${stats.totalResults.toLocaleString('fr-FR')} complétions · ${stats.paidResults} débloqués`)}

            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 20 }}>Complétions & unlocks payants · 12 mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'Quiz complétés', color: SERIES[0], values: quizSeries },
                    { label: 'Résultats payants', color: C.good, values: paidSeries },
                  ]}
                  fmtVal={v => v.toLocaleString('fr-FR')}
                  h={170}
                />
              </>
            )}

            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 16 }}>Classement par complétions</p>
                {sortedQuizzes.map(q => (
                  <HorizBar key={q.slug} label={q.name} value={q.count} max={maxQuizCount}
                    color={SERIES[0]}
                    valueLabel={q.count.toLocaleString('fr-FR')} />
                ))}
              </>
            )}

            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 16 }}>Taux de conversion payant</p>
                {sortedQuizzes.filter(q => q.count > 0).map(q => (
                  <HorizBar key={q.slug} label={q.name} value={parseFloat(q.paidRate)} max={100}
                    color={C.good}
                    valueLabel={`${q.paidRate}%`} />
                ))}
              </>
            )}

            {card(
              <>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, fontWeight: 600, fontSize: 14 }}>Tableau complet</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr>
                      {['Quiz','Complétés','Payants','% payant','Score moy.'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {sortedQuizzes.map(q => (
                        <tr key={q.slug} {...rowHover}>
                          <td style={tdStyle}>
                            <p style={{ color: C.ink, fontWeight: 500, margin: 0 }}>{q.name}</p>
                            <p style={{ color: C.faint, fontSize: 11.5, margin: 0 }}>{q.slug}</p>
                          </td>
                          <td style={{ ...tdStyle, color: C.ink, fontWeight: 600 }}>{q.count.toLocaleString('fr-FR')}</td>
                          <td style={{ ...tdStyle, color: C.good }}>{q.paidCount}</td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 48, height: 5, borderRadius: 999, background: C.surfaceAlt, border: `1px solid ${C.borderSoft}`, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${q.paidRate}%`, background: C.primary, borderRadius: 999 }} />
                              </div>
                              <span style={{ color: C.muted, fontSize: 12 }}>{q.paidRate}%</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: C.muted }}>{q.avgScore}%</td>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              {sectionTitle('Affiliés', `${stats.affiliates.length} affiliés · règle 80% (30j) → 30%`)}
              <Link href="/admin/affiliates" style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', background: C.primarySoft, color: C.primary, border: `1px solid ${C.primaryBorder}`, flexShrink: 0 }}>
                Gérer →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <KpiCard label="Total affiliés"       value={stats.affiliates.length} />
              <KpiCard label="Total conversions"    value={stats.affiliates.reduce((s, a) => s + a.conversions.length, 0)} />
              <KpiCard label="CA total affiliés"    value={fmt(totalAffilCA)} sub="toutes conversions" />
              <KpiCard label="Commissions (80/30)"  value={fmt(totalAffilCommission)} sub="à payer" />
            </div>

            {cardP(
              <>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 20 }}>CA affiliés & commissions · 12 mois</p>
                <LineChart
                  xLabels={monthLabels}
                  series={[
                    { label: 'CA généré', color: SERIES[2], values: revSeries },
                    { label: 'Commissions', color: SERIES[1], values: commSeries },
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
                style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, fontSize: 13, color: C.ink, background: C.surface, border: `1px solid ${C.border}`, outline: 'none' }}
              />
              {(['ca', 'clicks', 'sales', 'commission'] as const).map(s => (
                <button key={s} onClick={() => setAffiliateSort(s)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  background: affiliateSort === s ? C.primarySoft : C.surface,
                  color: affiliateSort === s ? C.primary : C.muted,
                  border: affiliateSort === s ? `1px solid ${C.primaryBorder}` : `1px solid ${C.border}`,
                }}>
                  {s === 'ca' ? 'CA ↓' : s === 'clicks' ? 'Clics ↓' : s === 'sales' ? 'Ventes ↓' : 'Commission ↓'}
                </button>
              ))}
            </div>

            {/* Affiliate leaderboard */}
            {card(
              <>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, fontWeight: 600, fontSize: 14 }}>
                  Classement affiliés
                </div>
                {affiliateRanking.length === 0 ? (
                  <p style={{ padding: '32px', textAlign: 'center', color: C.faint, fontSize: 13 }}>Aucun affilié</p>
                ) : (
                  affiliateRanking.map((a, i) => (
                    <div key={a.id}>
                      <div
                        onClick={() => setExpandedAffiliate(expandedAffiliate === a.id ? null : a.id)}
                        style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}`, cursor: 'pointer', transition: 'background .1s' }}
                        {...rowHover}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ fontSize: 15, width: 28, flexShrink: 0, color: C.muted, fontWeight: 700 }}>
                            {i === 0 ? '1' : i === 1 ? '2' : i === 2 ? '3' : `${i + 1}.`}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: C.ink, fontWeight: 600, fontSize: 14, margin: 0 }}>{a.name}</p>
                            <p style={{ color: C.faint, fontSize: 11.5, margin: '2px 0 0' }}>/{a.slug} · {a.email ?? '—'}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: C.warn, fontWeight: 700, fontSize: 14, margin: 0 }}>{fmt(a.ca)}</p>
                              <p style={{ color: C.faint, fontSize: 10, margin: 0 }}>CA</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: C.primary, fontWeight: 700, fontSize: 14, margin: 0 }}>{fmt(a.commission)}</p>
                              <p style={{ color: C.faint, fontSize: 10, margin: 0 }}>Commission due</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: C.ink, fontWeight: 700, fontSize: 14, margin: 0 }}>{a.clicks.toLocaleString('fr-FR')}</p>
                              <p style={{ color: C.faint, fontSize: 10, margin: 0 }}>Clics</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: C.ink, fontWeight: 700, fontSize: 14, margin: 0 }}>{a.sales}</p>
                              <p style={{ color: C.faint, fontSize: 10, margin: 0 }}>Ventes</p>
                            </div>
                            <span style={{ color: expandedAffiliate === a.id ? C.primary : C.faint, fontSize: 12, alignSelf: 'center' }}>
                              {expandedAffiliate === a.id ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>
                        {/* CA bar */}
                        <div style={{ marginTop: 8, marginLeft: 44, height: 4, borderRadius: 999, background: C.surfaceAlt, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(a.ca / maxAffilCA) * 100}%`, background: C.warn, borderRadius: 999 }} />
                        </div>
                      </div>

                      {/* Expanded: commission breakdown */}
                      {expandedAffiliate === a.id && (
                        <div style={{ background: C.surfaceAlt, borderBottom: `1px solid ${C.borderSoft}`, padding: '16px 20px 20px 64px' }}>
                          <p style={{ fontSize: 12, color: C.primary, fontWeight: 600, marginBottom: 12 }}>
                            Règle commission : 80% premiers 30j · 30% ensuite
                          </p>
                          {a.conversions.length === 0 ? (
                            <p style={{ color: C.faint, fontSize: 13 }}>Aucune conversion</p>
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
                                          <td style={{ ...tdStyle, fontSize: 11, padding: '8px 12px', color: C.muted }}>{fmtDate(c.createdAt)}</td>
                                          <td style={{ ...tdStyle, fontSize: 12, padding: '8px 12px', color: C.warn, fontWeight: 600 }}>{fmt(c.amountCents)}</td>
                                          <td style={{ ...tdStyle, fontSize: 12, padding: '8px 12px', color: isEarlyBird ? C.good : C.muted, fontWeight: 600 }}>{(rate * 100).toFixed(0)}%</td>
                                          <td style={{ ...tdStyle, fontSize: 12, padding: '8px 12px', color: C.primary, fontWeight: 600 }}>{fmt(due)}</td>
                                          <td style={{ ...tdStyle, fontSize: 11, padding: '8px 12px' }}>
                                            <span style={{
                                              background: isEarlyBird ? C.goodSoft : C.surface,
                                              color: isEarlyBird ? C.good : C.muted,
                                              border: `1px solid ${isEarlyBird ? C.goodBorder : C.border}`,
                                              padding: '2px 8px', borderRadius: 999, fontSize: 10,
                                            }}>
                                              {isEarlyBird ? 'Premiers 30j' : 'Après 30j'}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                    <tr style={{ borderTop: `1px solid ${C.border}` }}>
                                      <td colSpan={3} style={{ padding: '10px 12px', fontSize: 12, color: C.muted, fontWeight: 600 }}>Total commission due</td>
                                      <td style={{ padding: '10px 12px', color: C.primary, fontWeight: 700, fontSize: 14 }}>{fmt(a.commission)}</td>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sectionTitle('Codes d\'accès affiliés', 'Codes à usage unique pour tester l\'app gratuitement')}

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Générer un nouveau code</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={newCodeNote}
                  onChange={e => setNewCodeNote(e.target.value)}
                  placeholder="Note (ex: NomAffiliéX)"
                  style={{ flex: 1, minWidth: 180, padding: '10px 14px', borderRadius: 10, background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, outline: 'none' }}
                />
                <button onClick={generateCode} disabled={codesLoading} style={{ padding: '10px 20px', borderRadius: 10, background: C.primary, color: '#fff', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', opacity: codesLoading ? 0.6 : 1 }}>
                  {codesLoading ? '...' : '+ Générer'}
                </button>
              </div>
              {generatedCode && (
                <div style={{ marginTop: 16, padding: '14px 18px', borderRadius: 12, background: C.primarySoft, border: `1px solid ${C.primaryBorder}` }}>
                  <p style={{ fontSize: 11.5, color: C.primary, marginBottom: 6, fontWeight: 600 }}>Code généré — à copier !</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: C.ink, letterSpacing: '0.2em', fontFamily: 'monospace' }}>{generatedCode}</p>
                </div>
              )}
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr>
                    {['Code','Note','Statut','Utilisé par','Date',''].map(h => <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11.5, color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}`, background: C.surfaceAlt, whiteSpace: 'nowrap' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {codes.map(c => (
                      <tr key={c.id} {...rowHover}>
                        <td style={{ padding: '10px 16px', borderBottom: `1px solid ${C.borderSoft}`, fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: C.ink, letterSpacing: '0.1em' }}>{c.code}</td>
                        <td style={{ padding: '10px 16px', borderBottom: `1px solid ${C.borderSoft}`, color: C.muted, fontSize: 12 }}>{c.note ?? '—'}</td>
                        <td style={{ padding: '10px 16px', borderBottom: `1px solid ${C.borderSoft}` }}>
                          {c.used
                            ? <span style={{ background: C.criticalSoft, color: C.critical, border: `1px solid ${C.criticalBorder}`, padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Utilisé</span>
                            : <span style={{ background: C.goodSoft, color: C.good, border: `1px solid ${C.goodBorder}`, padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Disponible</span>}
                        </td>
                        <td style={{ padding: '10px 16px', borderBottom: `1px solid ${C.borderSoft}`, color: C.muted, fontSize: 11 }}>{c.usedByEmail?.replace('@urcecret.app', '') ?? '—'}</td>
                        <td style={{ padding: '10px 16px', borderBottom: `1px solid ${C.borderSoft}`, color: C.faint, fontSize: 11, whiteSpace: 'nowrap' }}>{fmtDate(c.createdAt)}</td>
                        <td style={{ padding: '10px 16px', borderBottom: `1px solid ${C.borderSoft}` }}>
                          {!c.used && (
                            <button onClick={() => deleteCode(c.id)} style={{ padding: '4px 10px', borderRadius: 8, background: C.criticalSoft, border: `1px solid ${C.criticalBorder}`, color: C.critical, fontSize: 11, cursor: 'pointer' }}>
                              Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {codes.length === 0 && !codesLoading && (
                      <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: C.faint }}>Aucun code — génère le premier ci-dessus</td></tr>
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
