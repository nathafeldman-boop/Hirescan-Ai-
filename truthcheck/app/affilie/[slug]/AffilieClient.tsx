'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  conversions: Conversion[];
};


function fmt(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
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

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
      style={
        copied
          ? { color: '#34d399', borderColor: '#34d39940', background: '#34d39910' }
          : { color: '#a78bfa', borderColor: '#a78bfa40', background: '#a78bfa10' }
      }
    >
      {copied ? '✓ Copié !' : label}
    </button>
  );
}

export default function AffilieClient({ affiliate, clicks }: { affiliate: Affiliate; clicks: number }) {
  const affiliateLink = `https://urcecret.site/?ref=${affiliate.slug}`;
  const totalRevenue = affiliate.conversions.reduce((s, c) => s + c.amountCents, 0);
  const totalCommission = affiliate.conversions.reduce((s, c) => s + c.commissionCents, 0);
  const months = groupByMonth(affiliate.conversions);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Cecret</span>
          </Link>
          <span className="text-xs text-zinc-500 font-medium">Programme Affilié</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Welcome */}
        <div className="text-center pb-2">
          <div className="text-4xl mb-3">👋</div>
          <h1 className="text-2xl font-black text-white mb-1">Bonjour {affiliate.name.split(' ')[0]} !</h1>
          <p className="text-zinc-500 text-sm">Voici ton tableau de bord affilié UrCecret</p>
        </div>

        {/* Affiliate link */}
        <div className="rounded-2xl p-5 border" style={{ border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.05)' }}>
          <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-3">Ton lien affilié</p>
          <div className="flex items-center gap-3 flex-wrap">
            <code className="flex-1 bg-black/40 text-violet-300 text-sm px-3 py-2 rounded-lg font-mono break-all">
              {affiliateLink}
            </code>
            <CopyButton text={affiliateLink} label="Copier le lien" />
          </div>
          <p className="text-zinc-600 text-xs mt-3">
            Partage ce lien dans tes vidéos, stories ou bio. Chaque vente dans les 30 jours = {affiliate.commissionPct}% pour toi.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: 'Clics sur ton lien', value: clicks.toLocaleString('fr-FR'), color: '#60a5fa' },
            {
              label: 'Taux de conversion',
              value: clicks > 0
                ? `${((affiliate.conversions.length / clicks) * 100).toFixed(1)}%`
                : '—',
              color: '#f472b6',
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
              <div className="text-xl font-black mb-1" style={{ color }}>{value}</div>
              <div className="text-zinc-500 text-xs">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ventes', value: affiliate.conversions.length.toString(), color: '#a78bfa' },
            { label: 'CA généré', value: fmt(totalRevenue), color: '#f472b6' },
            { label: 'Ta commission', value: fmt(totalCommission), color: '#34d399' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
              <div className="text-xl font-black mb-1" style={{ color }}>{value}</div>
              <div className="text-zinc-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Monthly breakdown */}
        {Object.keys(months).length > 0 ? (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Détail par mois</h2>
            <div className="space-y-2">
              {Object.entries(months).map(([month, stats]) => (
                <div key={month} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 text-sm">
                  <span className="text-zinc-300 capitalize font-medium">{month}</span>
                  <div className="flex items-center gap-5 text-right">
                    <span className="text-zinc-500 text-xs">{stats.count} vente{stats.count > 1 ? 's' : ''}</span>
                    <span className="text-zinc-300">{fmt(stats.revenue)}</span>
                    <span className="font-bold" style={{ color: '#34d399' }}>{fmt(stats.commission)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🚀</div>
            <p className="text-zinc-400 text-sm font-medium mb-1">Aucune vente pour l&apos;instant</p>
            <p className="text-zinc-600 text-xs">Partage ton lien — chaque clic compte !</p>
          </div>
        )}

        {/* How to share */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Comment maximiser tes gains</h2>
          <div className="space-y-3">
            {[
              { icon: '📱', tip: 'Mets le lien dans ta bio Instagram/TikTok', sub: 'Le meilleur placement — visible tout le temps' },
              { icon: '🎬', tip: 'Mentionner dans tes vidéos', sub: '"Lien en bio pour tester ton type de perso gratuit"' },
              { icon: '💬', tip: 'Stories avec swipe-up', sub: 'Envoie directement vers le test, très haute conversion' },
              { icon: '🔗', tip: 'Le cookie dure 30 jours', sub: 'Quelqu\'un qui clique aujourd\'hui peut acheter dans un mois' },
            ].map(({ icon, tip, sub }) => (
              <div key={tip} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{icon}</span>
                <div>
                  <p className="text-zinc-300 text-sm font-medium">{tip}</p>
                  <p className="text-zinc-600 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-700 text-xs pb-4">
          Pour toute question sur tes paiements : contact@urcecret.site
        </p>

      </div>
    </main>
  );
}
