'use client';
import { useState } from 'react';

type Conversion = {
  id: string;
  amountCents: number;
  commissionCents: number;
  createdAt: string;
};

type Affiliate = {
  id: string;
  slug: string;
  name: string;
  email: string | null;
  commissionPct: number;
  clicks: number;
  dashboardUrl?: string;
  conversions: Conversion[];
};

function fmt(cents: number) {
  return (cents / 100).toFixed(2) + ' €';
}

function monthLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
}

function groupByMonth(conversions: Conversion[]) {
  const map: Record<string, { revenue: number; commission: number; count: number }> = {};
  for (const c of conversions) {
    const key = monthLabel(c.createdAt);
    if (!map[key]) map[key] = { revenue: 0, commission: 0, count: 0 };
    map[key].revenue += c.amountCents;
    map[key].commission += c.commissionCents;
    map[key].count++;
  }
  return map;
}

export default function AffiliatesClient({ initial }: { initial: Affiliate[] }) {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initial);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function add() {
    if (!name || !slug) return;
    setLoading(true);
    const res = await fetch('/api/admin/affiliates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, email }),
    });
    const data = await res.json();
    if (res.ok) {
      setAffiliates(prev => [{ ...data, clicks: 0, conversions: [] }, ...prev]);
      setName(''); setSlug(''); setEmail('');
      setMsg('✅ Affilié créé !');
    } else {
      setMsg('❌ ' + data.error);
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet affilié et toutes ses conversions ?')) return;
    await fetch('/api/admin/affiliates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setAffiliates(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Ajouter un influenceur</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Nom</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Théo Martin"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Slug (lien)</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 gap-1">
              <span className="text-zinc-600 text-xs">?ref=</span>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="theo"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Email (optionnel)</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="theo@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-violet-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={add}
            disabled={loading || !name || !slug}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
          >
            {loading ? '…' : 'Créer le lien'}
          </button>
          {msg && <span className="text-sm text-zinc-400">{msg}</span>}
        </div>
      </div>

      {/* Affiliates list */}
      {affiliates.length === 0 && (
        <p className="text-zinc-500 text-sm text-center py-8">Aucun affilié pour l&apos;instant.</p>
      )}

      {affiliates.map(a => {
        const total = a.conversions.reduce((s, c) => s + c.amountCents, 0);
        const commission = a.conversions.reduce((s, c) => s + c.commissionCents, 0);
        const months = groupByMonth(a.conversions);
        const link = `https://urcecret.site/?ref=${a.slug}`;
        const dashboardLink = a.dashboardUrl ?? `https://urcecret.site/affilie/${a.slug}`;

        return (
          <div key={a.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg">{a.name}</h3>
                {a.email && <p className="text-zinc-500 text-xs">{a.email}</p>}
                {/* Affiliate link */}
                <div className="flex items-center gap-2 mt-2">
                  <code className="bg-black/40 text-violet-400 text-xs px-2 py-1 rounded font-mono truncate max-w-[220px]">{link}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(link); }}
                    className="text-xs text-zinc-500 hover:text-white transition-colors flex-shrink-0"
                  >
                    copier
                  </button>
                </div>
                {/* Secure dashboard link — send this to the influencer */}
                <div className="flex items-center gap-2 mt-1.5">
                  <code className="bg-black/40 text-emerald-400 text-xs px-2 py-1 rounded font-mono truncate max-w-[220px]">{dashboardLink}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(dashboardLink); }}
                    className="text-xs text-emerald-500 hover:text-emerald-300 transition-colors flex-shrink-0 font-semibold"
                  >
                    📊 lien sécurisé
                  </button>
                </div>
              </div>
              <button
                onClick={() => remove(a.id)}
                className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
              >
                supprimer
              </button>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { label: 'Clics sur le lien', value: a.clicks.toLocaleString('fr-FR') },
                {
                  label: 'Taux de conversion',
                  value: a.clicks > 0
                    ? `${((a.conversions.length / a.clicks) * 100).toFixed(1)}%`
                    : '—',
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-black/30 rounded-xl p-3 text-center">
                  <div className="text-white font-black text-xl">{value}</div>
                  <div className="text-zinc-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Ventes', value: a.conversions.length.toString() },
                { label: 'Chiffre d\'affaires', value: fmt(total) },
                { label: `Commission (${a.commissionPct}%)`, value: fmt(commission) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-black/30 rounded-xl p-3 text-center">
                  <div className="text-white font-black text-xl">{value}</div>
                  <div className="text-zinc-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Monthly breakdown */}
            {Object.keys(months).length > 0 && (
              <div>
                <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Détail par mois</p>
                <div className="space-y-1">
                  {Object.entries(months).map(([month, stats]) => (
                    <div key={month} className="flex items-center justify-between text-sm py-1 border-b border-white/5">
                      <span className="text-zinc-300 capitalize">{month}</span>
                      <div className="flex gap-6 text-right">
                        <span className="text-zinc-500">{stats.count} vente{stats.count > 1 ? 's' : ''}</span>
                        <span className="text-white font-medium">{fmt(stats.revenue)}</span>
                        <span className="text-violet-400 font-bold">{fmt(stats.commission)} → {a.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {a.conversions.length === 0 && (
              <p className="text-zinc-600 text-xs text-center py-2">Aucune vente encore — partage le lien !</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
