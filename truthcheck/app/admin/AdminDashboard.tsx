'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Tab = 'overview' | 'users' | 'revenue' | 'quizzes' | 'affiliates';

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
  recentUsers: Array<{ id: string; email: string | null; name: string | null; tier: string; createdAt: string; _count: { quizResults: number } }>;
  usersByMonth: Record<string, number>;
  totalResults: number;
  paidResults: number;
  paidToday: number;
  paidThisMonth: number;
  byQuiz: Record<string, { count: number; paidCount: number; totalScore: number }>;
  totalRevenueCents: number;
  todayRevenueCents: number;
  weekRevenueCents: number;
  monthRevenueCents: number;
  yearRevenueCents: number;
  revenueByMonth: Record<string, { revenue: number; commission: number; count: number }>;
  affiliates: Array<{
    id: string;
    slug: string;
    name: string;
    email: string | null;
    commissionPct: number;
    createdAt: string;
    conversions: Array<{ amountCents: number; commissionCents: number; createdAt: string }>;
  }>;
}

const QUIZ_NAMES: Record<string, string> = {
  infidelite: 'Infidélité',
  adopte: 'Suis-je adopté(e) ?',
  amoureux: 'Suis-je amoureux ?',
  'vrais-amis': 'Vrais amis',
  orientation: 'Orientation',
  narcissique: 'Narcissique',
  'mon-ex': 'Mon ex',
  manipule: 'Manipulé(e) ?',
  rompre: 'Dois-je rompre ?',
  jaloux: 'Jaloux/jalouse ?',
  'relation-toxique': 'Relation toxique',
  crush: 'Mon crush',
  burnout: 'Burnout',
  depression: 'Dépression',
  'vrai-amour': 'Vrai amour',
  personnalite: 'Test MBTI',
};

function fmt(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR');
}

function KpiCard({ label, value, sub, color = '#8b5cf6' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      {sub && <p className="text-xs" style={{ color }}>{sub}</p>}
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  if (tier === 'premium') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold border"
        style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.3)' }}>
        Premium
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-white/8">
      Gratuit
    </span>
  );
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'premium' | 'free'>('all');

  const conversionRate = stats.totalUsers > 0
    ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)
    : '0';

  const filteredUsers = useMemo(() => {
    return stats.recentUsers.filter(u => {
      const matchesTier = tierFilter === 'all' || u.tier === (tierFilter === 'premium' ? 'premium' : 'free');
      const matchesSearch = !search ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [stats.recentUsers, search, tierFilter]);

  const sortedQuizzes = Object.entries(stats.byQuiz)
    .map(([slug, data]) => ({
      slug,
      name: QUIZ_NAMES[slug] ?? slug,
      count: data.count,
      paidCount: data.paidCount,
      avgScore: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
      paidRate: data.count > 0 ? ((data.paidCount / data.count) * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => b.count - a.count);

  const sortedMonths = Object.entries(stats.revenueByMonth)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12);

  const totalAffilRevenue = stats.affiliates.reduce(
    (s, a) => s + a.conversions.reduce((ss, c) => ss + c.amountCents, 0), 0
  );
  const totalAffilCommission = stats.affiliates.reduce(
    (s, a) => s + a.conversions.reduce((ss, c) => ss + c.commissionCents, 0), 0
  );

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: '📊 Vue d\'ensemble' },
    { id: 'users', label: '👥 Utilisateurs' },
    { id: 'revenue', label: '💰 Revenus' },
    { id: 'quizzes', label: '🧩 Quiz' },
    { id: 'affiliates', label: '🔗 Affiliés' },
  ];

  return (
    <main className="min-h-screen text-white" style={{ background: '#09090b' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 backdrop-blur-md" style={{ background: 'rgba(9,9,11,0.9)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Cecret</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">Admin · Dashboard</span>
            <Link href="/admin/affiliates" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Gérer affiliés →
            </Link>
          </div>
        </div>

        {/* Tab nav */}
        <div className="max-w-6xl mx-auto px-4 pb-0 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2"
              style={{
                color: tab === t.id ? '#a78bfa' : '#71717a',
                borderBottomColor: tab === t.id ? '#a78bfa' : 'transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white mb-1">Vue d&apos;ensemble</h1>
              <p className="text-zinc-500 text-sm">Statistiques en temps réel de l&apos;application</p>
            </div>

            {/* KPI row 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <KpiCard label="Total utilisateurs" value={stats.totalUsers.toLocaleString('fr-FR')} sub={`+${stats.newThisMonth} ce mois`} />
              <KpiCard label="Premium" value={stats.premiumUsers} sub={`${conversionRate}% conversion`} color="#f472b6" />
              <KpiCard label="Quiz complétés" value={stats.totalResults.toLocaleString('fr-FR')} sub={`${stats.paidResults} payants`} color="#34d399" />
              <KpiCard label="Revenus affiliés" value={fmt(stats.totalRevenueCents)} sub="total cumulé" color="#fbbf24" />
            </div>

            {/* KPI row 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <KpiCard label="Nouveaux aujourd'hui" value={stats.newToday} color="#a78bfa" />
              <KpiCard label="Nouveaux cette semaine" value={stats.newThisWeek} color="#a78bfa" />
              <KpiCard label="Unlocks payants" value={stats.paidResults} sub={`+${stats.paidToday} aujourd'hui`} color="#34d399" />
              <KpiCard label="Revenus ce mois" value={fmt(stats.monthRevenueCents)} color="#fbbf24" />
            </div>

            {/* Recent users */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <p className="text-sm font-semibold text-white">Derniers inscrits</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Email</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Tier</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Inscrit le</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Quiz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.slice(0, 10).map(u => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-zinc-300">{u.email ?? '—'}</td>
                        <td className="px-5 py-3"><TierBadge tier={u.tier} /></td>
                        <td className="px-5 py-3 text-zinc-500">{fmtDate(u.createdAt)}</td>
                        <td className="px-5 py-3 text-zinc-400">{u._count.quizResults}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h1 className="text-2xl font-black text-white mb-1">Utilisateurs</h1>
                <p className="text-zinc-500 text-sm">{stats.totalUsers} inscrits · {stats.premiumUsers} premium · {stats.totalUsers - stats.premiumUsers} gratuits</p>
              </div>
              <div className="flex gap-2">
                {(['all', 'premium', 'free'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setTierFilter(f)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={tierFilter === f
                      ? { background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }
                      : { background: 'rgba(255,255,255,0.05)', color: '#71717a', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {f === 'all' ? 'Tous' : f === 'premium' ? 'Premium' : 'Gratuit'}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Rechercher par email ou nom…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none border border-white/8 focus:border-violet-500/50 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />

            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">#</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Email</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Nom</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Tier</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Inscrit le</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Quiz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-zinc-600 text-xs">{i + 1}</td>
                        <td className="px-5 py-3 text-zinc-300 font-mono text-xs">{u.email ?? '—'}</td>
                        <td className="px-5 py-3 text-zinc-400">{u.name ?? '—'}</td>
                        <td className="px-5 py-3"><TierBadge tier={u.tier} /></td>
                        <td className="px-5 py-3 text-zinc-500 text-xs">{fmtDate(u.createdAt)}</td>
                        <td className="px-5 py-3 text-zinc-400">{u._count.quizResults}</td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-zinc-600">Aucun résultat</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab === 'revenue' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white mb-1">Revenus</h1>
              <p className="text-zinc-500 text-sm">Uniquement les revenus trackés via les liens affiliés. Pour les paiements directs, voir le <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">dashboard Stripe →</a></p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <KpiCard label="Total cumulé" value={fmt(stats.totalRevenueCents)} color="#fbbf24" />
              <KpiCard label="Cette année" value={fmt(stats.yearRevenueCents)} color="#fbbf24" />
              <KpiCard label="Ce mois" value={fmt(stats.monthRevenueCents)} color="#fbbf24" />
              <KpiCard label="Cette semaine" value={fmt(stats.weekRevenueCents)} color="#fbbf24" />
              <KpiCard label="Aujourd'hui" value={fmt(stats.todayRevenueCents)} color="#fbbf24" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <KpiCard label="Unlocks payants (total)" value={stats.paidResults} sub="× 1,99 € estimé" color="#34d399" />
              <KpiCard label="Unlocks ce mois" value={stats.paidThisMonth} sub={`+${stats.paidToday} aujourd'hui`} color="#34d399" />
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <p className="text-sm font-semibold text-white">Revenus affiliés par mois</p>
              </div>
              {sortedMonths.length === 0 ? (
                <p className="px-5 py-8 text-center text-zinc-600">Aucune conversion affiliate enregistrée</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Mois</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Revenus</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Commissions</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMonths.map(([month, data]) => (
                      <tr key={month} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-zinc-300 font-medium">
                          {new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3 text-yellow-400 font-semibold">{fmt(data.revenue)}</td>
                        <td className="px-5 py-3 text-zinc-400">{fmt(data.commission)}</td>
                        <td className="px-5 py-3 text-zinc-400">{data.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── QUIZZES ── */}
        {tab === 'quizzes' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white mb-1">Stats Quiz</h1>
              <p className="text-zinc-500 text-sm">{stats.totalResults.toLocaleString('fr-FR')} complétions · {stats.paidResults} résultats débloqués</p>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Quiz</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Complétés</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Payants</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">% payant</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Score moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedQuizzes.map(q => (
                      <tr key={q.slug} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3">
                          <div>
                            <p className="text-white font-medium">{q.name}</p>
                            <p className="text-zinc-600 text-xs">{q.slug}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-zinc-300 font-semibold">{q.count.toLocaleString('fr-FR')}</td>
                        <td className="px-5 py-3 text-green-400">{q.paidCount}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-violet-500" style={{ width: `${q.paidRate}%` }} />
                            </div>
                            <span className="text-zinc-400 text-xs">{q.paidRate}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-zinc-400">{q.avgScore}%</td>
                      </tr>
                    ))}
                    {sortedQuizzes.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-zinc-600">Aucun résultat enregistré</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── AFFILIATES ── */}
        {tab === 'affiliates' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black text-white mb-1">Affiliés</h1>
                <p className="text-zinc-500 text-sm">{stats.affiliates.length} affiliés actifs</p>
              </div>
              <Link
                href="/admin/affiliates"
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                Gérer les affiliés →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <KpiCard label="Total affiliés" value={stats.affiliates.length} color="#a78bfa" />
              <KpiCard label="Total conversions" value={stats.affiliates.reduce((s, a) => s + a.conversions.length, 0)} color="#a78bfa" />
              <KpiCard label="CA total affiliés" value={fmt(totalAffilRevenue)} color="#fbbf24" />
              <KpiCard label="Commissions dues" value={fmt(totalAffilCommission)} color="#f472b6" />
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Nom</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Slug / lien</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Email</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Commission</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">Ventes</th>
                      <th className="text-left px-5 py-3 text-zinc-500 text-xs font-medium">CA généré</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.affiliates.map(a => {
                      const ca = a.conversions.reduce((s, c) => s + c.amountCents, 0);
                      return (
                        <tr key={a.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                          <td className="px-5 py-3 text-white font-medium">{a.name}</td>
                          <td className="px-5 py-3">
                            <code className="text-violet-400 text-xs">urcecret.site/?ref={a.slug}</code>
                          </td>
                          <td className="px-5 py-3 text-zinc-400 text-xs">{a.email ?? '—'}</td>
                          <td className="px-5 py-3 text-zinc-300">{a.commissionPct}%</td>
                          <td className="px-5 py-3 text-zinc-300">{a.conversions.length}</td>
                          <td className="px-5 py-3 text-yellow-400 font-semibold">{fmt(ca)}</td>
                        </tr>
                      );
                    })}
                    {stats.affiliates.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-zinc-600">Aucun affilié enregistré</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/admin/affiliates"
                className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors text-sm font-semibold"
              >
                Gérer les affiliés (créer, supprimer, voir détails) →
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
