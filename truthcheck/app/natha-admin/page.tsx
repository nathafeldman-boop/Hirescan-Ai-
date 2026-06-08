export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

function fmt(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export default async function NathaAdminPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [totalUsers, premiumUsers, newToday, newThisWeek, newThisMonth] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'premium' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  const [totalResults, paidResults, paidToday, paidThisMonth] = await Promise.all([
    prisma.quizResult.count(),
    prisma.quizResult.count({ where: { paid: true } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfMonth } } }),
  ]);

  const [visitsToday, visitsWeek, visitsMonth, visitsTotal, topPages,
    landingToday, landingWeek, landingMonth, landingTotal] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.pageView.count(),
    prisma.pageView.groupBy({ by: ['path'], _count: { path: true }, orderBy: { _count: { path: 'desc' } }, take: 10 }),
    prisma.pageView.count({ where: { path: '/', createdAt: { gte: startOfToday } } }),
    prisma.pageView.count({ where: { path: '/', createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { path: '/', createdAt: { gte: startOfMonth } } }),
    prisma.pageView.count({ where: { path: '/' } }),
  ]);

  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const prevWeekStart = fourteenDaysAgo;
  const prevWeekEnd = sevenDaysAgo;

  const [allConversions, recentUsers, affiliates, quizResults, activeUsers, quizScores,
    usersLastWeek, visitsLastWeek, paidLastWeek] = await Promise.all([
    prisma.affiliateConversion.findMany({ select: { amountCents: true, commissionCents: true, createdAt: true } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, email: true, name: true, tier: true, createdAt: true } }),
    prisma.affiliate.findMany({ include: { conversions: true }, orderBy: { createdAt: 'desc' } }),
    prisma.quizResult.findMany({ select: { quizSlug: true, paid: true, score: true } }),
    // Users who completed a quiz in last 30 days
    prisma.quizResult.findMany({ where: { createdAt: { gte: startOfMonth } }, select: { userId: true }, distinct: ['userId'] }),
    // All scores for average
    prisma.quizResult.findMany({ select: { score: true } }),
    // Previous week comparisons
    prisma.user.count({ where: { createdAt: { gte: prevWeekStart, lt: prevWeekEnd } } }),
    prisma.pageView.count({ where: { createdAt: { gte: prevWeekStart, lt: prevWeekEnd } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: prevWeekStart, lt: prevWeekEnd } } }),
  ]);

  const totalRevenueCents = allConversions.reduce((s, c) => s + c.amountCents, 0);
  const todayRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= startOfToday).reduce((s, c) => s + c.amountCents, 0);
  const weekRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= sevenDaysAgo).reduce((s, c) => s + c.amountCents, 0);
  const monthRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= startOfMonth).reduce((s, c) => s + c.amountCents, 0);
  const yearRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= startOfYear).reduce((s, c) => s + c.amountCents, 0);

  // Business KPIs
  const MRR_CENTS = premiumUsers * 999;
  const ARR_CENTS = MRR_CENTS * 12;
  const arpu = totalUsers > 0 ? totalRevenueCents / totalUsers : 0;
  const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : '0';
  const visitToSignup = visitsTotal > 0 ? ((totalUsers / visitsTotal) * 100).toFixed(2) : '0';
  const avgScore = quizScores.length > 0 ? Math.round(quizScores.reduce((s, r) => s + r.score, 0) / quizScores.length) : 0;
  const activeUserCount = new Set(activeUsers.map(u => u.userId).filter(Boolean)).size;

  // Week-over-week trends
  function trend(current: number, previous: number) {
    if (previous === 0) return current > 0 ? '+∞%' : '—';
    const pct = ((current - previous) / previous * 100).toFixed(0);
    return (current >= previous ? '+' : '') + pct + '%';
  }
  const trendUsers = trend(newThisWeek, usersLastWeek);
  const trendVisits = trend(visitsWeek, visitsLastWeek);
  const trendPaid = trend(paidResults - paidLastWeek, paidLastWeek);

  const byQuiz: Record<string, { total: number; paid: number }> = {};
  for (const r of quizResults) {
    if (!byQuiz[r.quizSlug]) byQuiz[r.quizSlug] = { total: 0, paid: 0 };
    byQuiz[r.quizSlug].total++;
    if (r.paid) byQuiz[r.quizSlug].paid++;
  }
  const quizSorted = Object.entries(byQuiz).sort((a, b) => b[1].total - a[1].total);

  const S = {
    page: { maxWidth: 900, margin: '0 auto', padding: '32px 16px' } as React.CSSProperties,
    h1: { fontSize: 28, fontWeight: 900, marginBottom: 4, color: '#fff' } as React.CSSProperties,
    sub: { color: '#52525b', fontSize: 13, marginTop: 0, marginBottom: 32 } as React.CSSProperties,
    section: { fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: 1 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 32 } as React.CSSProperties,
    card: { background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: '14px 18px' } as React.CSSProperties,
    cardLabel: { margin: 0, color: '#71717a', fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: 1 },
    cardValue: { margin: '6px 0 0', color: '#fff', fontSize: 20, fontWeight: 900 },
    cardSub: { margin: '3px 0 0', color: '#a78bfa', fontSize: 11 },
    table: { background: '#18181b', border: '1px solid #27272a', borderRadius: 12, marginBottom: 32, overflow: 'hidden' } as React.CSSProperties,
    th: { textAlign: 'left' as const, padding: '8px 14px', color: '#71717a', fontWeight: 600, fontSize: 12, borderBottom: '1px solid #27272a' },
    td: { padding: '10px 14px', fontSize: 13, borderBottom: '1px solid #27272a' },
  };

  const Card = ({ label, value, sub, color = '#a78bfa' }: { label: string; value: string | number; sub?: string; color?: string }) => (
    <div style={S.card}>
      <p style={S.cardLabel}>{label}</p>
      <p style={S.cardValue}>{value}</p>
      {sub && <p style={{ ...S.cardSub, color }}>{sub}</p>}
    </div>
  );

  return (
    <div style={S.page}>
      <h1 style={S.h1}>Dashboard Admin</h1>
      <p style={S.sub}>
        {now.toLocaleDateString('fr-FR')} — {now.toLocaleTimeString('fr-FR')}
      </p>

      <p style={{ ...S.section, color: '#fb923c' }}>KPIs Business</p>
      <div style={S.grid}>
        <Card label="MRR estimé" value={fmt(MRR_CENTS)} sub={`${premiumUsers} abonnés × 9,99€`} color="#fb923c" />
        <Card label="ARR estimé" value={fmt(ARR_CENTS)} color="#fb923c" />
        <Card label="ARPU" value={fmt(arpu)} sub="revenu / utilisateur" color="#fb923c" />
        <Card label="Taux premium" value={`${conversionRate}%`} sub="inscrits → payants" color="#fb923c" />
        <Card label="Visite → inscrit" value={`${visitToSignup}%`} color="#fb923c" />
        <Card label="Score moyen" value={`${avgScore}/100`} sub="tous quiz" color="#fb923c" />
        <Card label="Actifs ce mois" value={activeUserCount} sub="ont fait un quiz" color="#fb923c" />
      </div>

      <p style={{ ...S.section, color: '#a3e635' }}>Tendances (semaine vs semaine préc.)</p>
      <div style={S.grid}>
        <Card label="Nouveaux inscrits" value={newThisWeek} sub={trendUsers} color={trendUsers.startsWith('+') ? '#a3e635' : '#f87171'} />
        <Card label="Visites" value={visitsWeek} sub={trendVisits} color={trendVisits.startsWith('+') ? '#a3e635' : '#f87171'} />
        <Card label="Ventes" value={paidResults} sub={trendPaid} color={trendPaid.startsWith('+') ? '#a3e635' : '#f87171'} />
      </div>

      <p style={{ ...S.section, color: '#38bdf8' }}>Visites</p>
      <div style={S.grid}>
        <Card label="Total" value={visitsTotal} color="#38bdf8" />
        <Card label="Ce mois" value={visitsMonth} color="#38bdf8" />
        <Card label="Cette semaine" value={visitsWeek} color="#38bdf8" />
        <Card label="Aujourd'hui" value={visitsToday} color="#38bdf8" />
      </div>

      <p style={{ ...S.section, color: '#67e8f9' }}>Visiteurs landing page (coup d&apos;œil sur /)</p>
      <div style={S.grid}>
        <Card label="Total" value={landingTotal} color="#67e8f9" />
        <Card label="Ce mois" value={landingMonth} color="#67e8f9" />
        <Card label="Cette semaine" value={landingWeek} color="#67e8f9" />
        <Card label="Aujourd'hui" value={landingToday} color="#67e8f9" />
        <Card label="% qui s'inscrivent" value={landingTotal > 0 ? `${((totalUsers / landingTotal) * 100).toFixed(2)}%` : '—'} sub="landing → inscrit" color="#67e8f9" />
      </div>

      <p style={{ ...S.section, color: '#38bdf8' }}>Pages les plus visitées</p>
      <div style={S.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.th}>Page</th>
              <th style={S.th}>Visites</th>
            </tr>
          </thead>
          <tbody>
            {topPages.map(p => (
              <tr key={p.path}>
                <td style={{ ...S.td, color: '#e4e4e7', fontFamily: 'monospace', fontSize: 12 }}>{p.path}</td>
                <td style={{ ...S.td, color: '#38bdf8', fontWeight: 700 }}>{p._count.path}</td>
              </tr>
            ))}
            {topPages.length === 0 && (
              <tr><td colSpan={2} style={{ ...S.td, textAlign: 'center', color: '#52525b' }}>Aucune visite enregistrée</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={S.section}>Utilisateurs</p>
      <div style={S.grid}>
        <Card label="Total inscrits" value={totalUsers} />
        <Card label="Premium" value={premiumUsers} sub={`${totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : 0}% conversion`} color="#f472b6" />
        <Card label="Aujourd'hui" value={newToday} />
        <Card label="Cette semaine" value={newThisWeek} />
        <Card label="Ce mois" value={newThisMonth} />
      </div>

      <p style={{ ...S.section, color: '#fbbf24' }}>Revenus affiliés</p>
      <div style={S.grid}>
        <Card label="Total cumulé" value={fmt(totalRevenueCents)} color="#fbbf24" />
        <Card label="Cette année" value={fmt(yearRevenueCents)} color="#fbbf24" />
        <Card label="Ce mois" value={fmt(monthRevenueCents)} color="#fbbf24" />
        <Card label="Cette semaine" value={fmt(weekRevenueCents)} color="#fbbf24" />
        <Card label="Aujourd'hui" value={fmt(todayRevenueCents)} color="#fbbf24" />
      </div>

      <p style={{ ...S.section, color: '#34d399' }}>Quiz</p>
      <div style={S.grid}>
        <Card label="Complétés" value={totalResults} color="#34d399" />
        <Card label="Payants total" value={paidResults} color="#34d399" />
        <Card label="Payants aujourd'hui" value={paidToday} color="#34d399" />
        <Card label="Payants ce mois" value={paidThisMonth} color="#34d399" />
      </div>

      <p style={S.section}>Stats par quiz</p>
      <div style={S.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.th}>Quiz</th>
              <th style={S.th}>Complétés</th>
              <th style={S.th}>Payants</th>
              <th style={S.th}>% payant</th>
            </tr>
          </thead>
          <tbody>
            {quizSorted.map(([slug, data]) => (
              <tr key={slug}>
                <td style={{ ...S.td, color: '#e4e4e7' }}>{slug}</td>
                <td style={{ ...S.td, color: '#fff', fontWeight: 700 }}>{data.total}</td>
                <td style={{ ...S.td, color: '#34d399' }}>{data.paid}</td>
                <td style={{ ...S.td, color: '#a1a1aa' }}>
                  {data.total > 0 ? ((data.paid / data.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            ))}
            {quizSorted.length === 0 && (
              <tr><td colSpan={4} style={{ ...S.td, textAlign: 'center', color: '#52525b' }}>Aucun résultat</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ ...S.section, color: '#f472b6' }}>Affiliés</p>
      <div style={S.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.th}>Nom</th>
              <th style={S.th}>Slug</th>
              <th style={S.th}>Ventes</th>
              <th style={S.th}>CA généré</th>
              <th style={S.th}>Commission</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.length === 0 && (
              <tr><td colSpan={5} style={{ ...S.td, textAlign: 'center', color: '#52525b' }}>Aucun affilié</td></tr>
            )}
            {affiliates.map(a => {
              const ca = a.conversions.reduce((s, c) => s + c.amountCents, 0);
              const commission = a.conversions.reduce((s, c) => s + c.commissionCents, 0);
              return (
                <tr key={a.id}>
                  <td style={{ ...S.td, color: '#fff', fontWeight: 600 }}>{a.name}</td>
                  <td style={{ ...S.td, color: '#a78bfa', fontFamily: 'monospace' }}>?ref={a.slug}</td>
                  <td style={{ ...S.td, color: '#e4e4e7' }}>{a.conversions.length}</td>
                  <td style={{ ...S.td, color: '#fbbf24', fontWeight: 700 }}>{fmt(ca)}</td>
                  <td style={{ ...S.td, color: '#f472b6' }}>{fmt(commission)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ ...S.section, color: '#60a5fa' }}>50 derniers inscrits</p>
      <div style={S.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.th}>#</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Nom</th>
              <th style={S.th}>Tier</th>
              <th style={S.th}>Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u, i) => (
              <tr key={u.id}>
                <td style={{ ...S.td, color: '#52525b' }}>{i + 1}</td>
                <td style={{ ...S.td, color: '#e4e4e7', fontFamily: 'monospace', fontSize: 12 }}>{u.email ?? '—'}</td>
                <td style={{ ...S.td, color: '#a1a1aa' }}>{u.name ?? '—'}</td>
                <td style={S.td}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: u.tier === 'premium' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                    color: u.tier === 'premium' ? '#a78bfa' : '#71717a',
                    border: `1px solid ${u.tier === 'premium' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}>
                    {u.tier}
                  </span>
                </td>
                <td style={{ ...S.td, color: '#52525b', fontSize: 12 }}>
                  {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
