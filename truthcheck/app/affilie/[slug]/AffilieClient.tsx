'use client';

import { useState } from 'react';
import Link from 'next/link';

type Conversion = { id: string; amountCents: number; commissionCents: number; createdAt: string };
type Affiliate  = { id: string; slug: string; name: string; email: string | null; commissionPct: number; conversions: Conversion[] };
type Tab = 'apercu' | 'ventes' | 'visites' | 'lien';

function fmt(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function shortMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
}

function longDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function groupByMonth(conversions: Conversion[]) {
  const map: Record<string, { revenue: number; commission: number; count: number; label: string; short: string }> = {};
  for (const c of conversions) {
    const d = new Date(c.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map[key]) map[key] = {
      revenue: 0, commission: 0, count: 0,
      label: d.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
      short: shortMonth(c.createdAt),
    };
    map[key].revenue    += c.amountCents;
    map[key].commission += c.commissionCents;
    map[key].count++;
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
}

// ─── Bar chart (SVG, no lib) ──────────────────────────────────────────────────
function BarChart({ months }: { months: ReturnType<typeof groupByMonth> }) {
  const [hov, setHov] = useState<number | null>(null);
  const H = 130, BW = 16, INNER = 4, GROUP = BW * 2 + INNER, GAP = 18;
  const maxVal = Math.max(...months.flatMap(m => [m.revenue, m.commission]), 1);

  if (months.length === 0) return (
    <p className="text-center py-10 text-zinc-600 text-sm">Le graphique apparaîtra dès ta première vente</p>
  );

  const totalW = months.length * (GROUP + GAP) + 20;

  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(totalW, 280)} height={H + 30} style={{ display: 'block' }}>
        {months.map((m, i) => {
          const x  = 10 + i * (GROUP + GAP);
          const cx = x + GROUP / 2;
          const h1 = Math.max((m.revenue    / maxVal) * H, 2);
          const h2 = Math.max((m.commission / maxVal) * H, 2);
          const maxH = Math.max(h1, h2);
          const tipY = Math.max(4, H - maxH - 46);
          const isHov = hov === i;

          return (
            <g key={i}
               onMouseEnter={() => setHov(i)}
               onMouseLeave={() => setHov(null)}
               style={{ cursor: 'pointer' }}>
              {/* CA bar */}
              <rect x={x}          y={H - h1} width={BW} height={h1} rx={3} fill="#d17d52" opacity={isHov ? 1 : 0.7} style={{ transition: 'opacity .15s' }}/>
              {/* Commission bar */}
              <rect x={x + BW + INNER} y={H - h2} width={BW} height={h2} rx={3} fill="#34d399" opacity={isHov ? 1 : 0.7} style={{ transition: 'opacity .15s' }}/>
              {/* Month label */}
              <text x={cx} y={H + 16} textAnchor="middle" fontSize={9} fill={isHov ? '#e4e4e7' : '#52525b'} fontFamily="sans-serif">{m.short}</text>
              {/* Tooltip */}
              {isHov && (
                <>
                  <rect x={x - 10} y={tipY} width={GROUP + 20} height={40} rx={7} fill="#1c1c1f" stroke="#3f3f46" strokeWidth={1}/>
                  <text x={cx} y={tipY + 14} textAnchor="middle" fontSize={10} fill="#c4b5fd" fontFamily="sans-serif" fontWeight="600">{fmt(m.revenue)}</text>
                  <text x={cx} y={tipY + 30} textAnchor="middle" fontSize={10} fill="#6ee7b7" fontFamily="sans-serif" fontWeight="600">+{fmt(m.commission)}</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Funnel bar ───────────────────────────────────────────────────────────────
function FunnelBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-zinc-400 text-xs">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color, opacity: 0.85, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)' }}/>
      </div>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text, label, style }: { text: string; label: string; style?: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-all"
      style={copied
        ? { color: '#34d399', borderColor: '#34d39940', background: '#34d39910' }
        : style ?? { color: '#d17d52', borderColor: '#d17d5240', background: '#d17d5210' }
      }
    >
      {copied ? '✓ Copié !' : label}
    </button>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-base mb-1.5">{icon}</div>
      <div className="text-xl font-black leading-tight" style={{ color }}>{value}</div>
      <div className="text-zinc-500 text-xs mt-1">{label}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AffilieClient({ affiliate, clicks }: { affiliate: Affiliate; clicks: number }) {
  const [tab, setTab] = useState<Tab>('apercu');
  const link           = `https://urcecret.site/?ref=${affiliate.slug}`;
  const totalRevenue   = affiliate.conversions.reduce((s, c) => s + c.amountCents,    0);
  const totalComm      = affiliate.conversions.reduce((s, c) => s + c.commissionCents, 0);
  const convRate       = clicks > 0 ? (affiliate.conversions.length / clicks) * 100 : 0;
  const earningPerClick = clicks > 0 ? totalComm / clicks : 0;
  const months         = groupByMonth(affiliate.conversions);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'apercu',  label: 'Aperçu',  icon: '📊' },
    { id: 'ventes',  label: 'Ventes',  icon: '💰' },
    { id: 'visites', label: 'Visites', icon: '👁' },
    { id: 'lien',    label: 'Mon lien', icon: '🔗' },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Sticky header */}
      <header className="border-b border-white/5 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="text-lg font-black">
            <span style={{ background: 'linear-gradient(to right,#d17d52,#e0a380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Cecret</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"/>
            <span className="text-xs text-zinc-500">Dashboard affilié</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-6">
          <p className="text-zinc-500 text-sm mb-0.5">Bonjour 👋</p>
          <h1 className="text-2xl font-black">{affiliate.name}</h1>
        </div>

        {/* Hero KPIs — always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Clics"       value={clicks.toLocaleString('fr-FR')}                        icon="👁"  color="#60a5fa"/>
          <StatCard label="Ventes"      value={affiliate.conversions.length.toString()}                icon="🛒"  color="#d17d52"/>
          <StatCard label="Commission"  value={fmt(totalComm)}                                         icon="💸"  color="#34d399"/>
          <StatCard label="Conversion"  value={clicks > 0 ? `${convRate.toFixed(1)}%` : '—'}          icon="📈"  color="#e0a380"/>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1"
              style={tab === t.id
                ? { background: 'linear-gradient(135deg,#a94e18,#d17d52)', color: '#fff', boxShadow: '0 4px 14px rgba(169,78,24,.35)' }
                : { color: '#71717a' }
              }
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── TAB: APERÇU ─────────────────────────────────────────────────────── */}
        {tab === 'apercu' && (
          <div className="space-y-5">
            {/* Bar chart */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold">Revenus par mois</h2>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm inline-block bg-violet-400"/>&nbsp;CA</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm inline-block bg-emerald-400"/>&nbsp;Commission</span>
                </div>
              </div>
              <BarChart months={months}/>
            </div>

            {/* Recent sales */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
                <h2 className="text-sm font-bold">Dernières ventes</h2>
                {affiliate.conversions.length > 5 && (
                  <button onClick={() => setTab('ventes')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Tout voir →</button>
                )}
              </div>
              {affiliate.conversions.length > 0 ? (
                affiliate.conversions.slice(0, 5).map((c, i) => (
                  <div key={c.id ?? i} className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'rgba(52,211,153,.12)', color: '#34d399' }}>✓</div>
                      <div>
                        <p className="text-white text-sm font-medium">{fmt(c.amountCents)}</p>
                        <p className="text-zinc-600 text-xs">{longDate(c.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: '#34d399' }}>+{fmt(c.commissionCents)}</p>
                      <p className="text-zinc-600 text-xs">{affiliate.commissionPct}%</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-3xl mb-2">🚀</p>
                  <p className="text-zinc-400 text-sm font-medium">Aucune vente encore</p>
                  <p className="text-zinc-600 text-xs mt-1">Partage ton lien — chaque clic compte !</p>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'CA total',      value: fmt(totalRevenue),  color: '#e0a380' },
                { label: 'Ta commission', value: fmt(totalComm),     color: '#34d399' },
                { label: '€ / clic',      value: earningPerClick > 0 ? fmt(earningPerClick) : '—', color: '#60a5fa' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="font-black text-lg" style={{ color }}>{value}</p>
                  <p className="text-zinc-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: VENTES ─────────────────────────────────────────────────────── */}
        {tab === 'ventes' && (
          <div className="space-y-4">
            {/* Totals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Ventes',        value: affiliate.conversions.length.toString(), color: '#d17d52' },
                { label: 'CA généré',     value: fmt(totalRevenue),                       color: '#e0a380' },
                { label: 'Ta commission', value: fmt(totalComm),                          color: '#34d399' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="font-black text-lg" style={{ color }}>{value}</p>
                  <p className="text-zinc-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Monthly breakdown */}
            {months.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-5 py-4 border-b border-white/5">
                  <h2 className="text-sm font-bold">Par mois</h2>
                </div>
                {months.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <span className="text-zinc-300 capitalize text-sm font-medium">{m.label}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-zinc-500 text-xs">{m.count} vente{m.count > 1 ? 's' : ''}</span>
                      <span className="text-zinc-300">{fmt(m.revenue)}</span>
                      <span className="font-bold" style={{ color: '#34d399' }}>{fmt(m.commission)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All transactions */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="text-sm font-bold">Toutes les transactions</h2>
              </div>
              {affiliate.conversions.length > 0 ? (
                affiliate.conversions.map((c, i) => (
                  <div key={c.id ?? i} className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'rgba(52,211,153,.12)', color: '#34d399' }}>✓</div>
                      <div>
                        <p className="text-white text-sm">{fmt(c.amountCents)}</p>
                        <p className="text-zinc-600 text-xs">{longDate(c.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm" style={{ color: '#34d399' }}>+{fmt(c.commissionCents)}</p>
                      <p className="text-zinc-600 text-xs">{affiliate.commissionPct}% comm.</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-zinc-600 text-sm">Aucune transaction pour l&apos;instant</div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: VISITES ────────────────────────────────────────────────────── */}
        {tab === 'visites' && (
          <div className="space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Clics totaux"     value={clicks.toLocaleString('fr-FR')}                      icon="👁"  color="#60a5fa"/>
              <StatCard label="Ventes"           value={affiliate.conversions.length.toString()}               icon="✓"   color="#34d399"/>
              <StatCard label="Taux conversion"  value={clicks > 0 ? `${convRate.toFixed(2)}%` : '—'}        icon="📈"  color="#e0a380"/>
              <StatCard label="Valeur / clic"    value={earningPerClick > 0 ? fmt(earningPerClick) : '—'}     icon="💡"  color="#d17d52"/>
            </div>

            {/* Conversion funnel */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-sm font-bold">Entonnoir de conversion</h2>
              <FunnelBar label="Clics sur ton lien"        value={clicks.toLocaleString('fr-FR')}                                              pct={100}  color="#60a5fa"/>
              <FunnelBar label="Test commencé (estimé)"    value={Math.round(clicks * 0.72).toLocaleString('fr-FR')}                           pct={72}   color="#d17d52"/>
              <FunnelBar label="Test complété (estimé)"    value={Math.round(clicks * 0.58).toLocaleString('fr-FR')}                           pct={58}   color="#e0a380"/>
              <FunnelBar label="Achats réels"              value={`${affiliate.conversions.length} (${convRate.toFixed(1)}%)`}                  pct={clicks > 0 ? convRate : 0} color="#34d399"/>
              <p className="text-zinc-700 text-xs">* Étapes intermédiaires estimées sur les moyennes UrCecret</p>
            </div>

            {/* Tips */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-sm font-bold mb-4">💡 Booster tes clics</h2>
              <div className="space-y-3">
                {[
                  { icon: '📱', tip: 'Bio TikTok + Instagram',  sub: 'Lien permanent visible à tous tes followers' },
                  { icon: '🎬', tip: 'Mention en vidéo',        sub: '"Lien en bio pour tester ton type de perso" → +40% de clics' },
                  { icon: '💬', tip: 'Story swipe-up',          sub: 'Conversion 3x plus haute que les posts classiques' },
                  { icon: '📌', tip: 'Épingler le post',        sub: '1er contenu qu\'un nouveau visiteur voit sur ton profil' },
                ].map(({ icon, tip, sub }) => (
                  <div key={tip} className="flex items-start gap-3">
                    <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
                    <div>
                      <p className="text-zinc-200 text-sm font-medium">{tip}</p>
                      <p className="text-zinc-600 text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: MON LIEN ───────────────────────────────────────────────────── */}
        {tab === 'lien' && (
          <div className="space-y-4">
            {/* Link box */}
            <div className="rounded-2xl p-6" style={{ border: '1px solid rgba(209,125,82,.3)', background: 'rgba(209,125,82,.05)' }}>
              <p className="text-xs text-violet-400 font-bold uppercase tracking-widest mb-3">Ton lien affilié</p>
              <div className="bg-black/40 rounded-xl px-4 py-3 mb-4">
                <code className="text-violet-300 text-sm font-mono break-all">{link}</code>
              </div>
              <div className="flex flex-wrap gap-2">
                <CopyBtn text={link} label="📋 Copier le lien"/>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Teste ton type de personnalité MBTI — lien : ${link}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-all"
                  style={{ color: '#34d399', borderColor: '#34d39940', background: '#34d39910' }}
                >
                  📲 WhatsApp
                </a>
              </div>
            </div>

            {/* Conditions */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="text-sm font-bold">Tes conditions</h2>
              </div>
              {[
                { label: 'Commission par vente',  value: `${affiliate.commissionPct}%`,                               color: '#34d399' },
                { label: 'Durée du cookie',       value: '30 jours',                                                  color: '#60a5fa' },
                { label: 'Prix du test',          value: '1,99 €',                                                    color: '#d17d52' },
                { label: 'Tu gagnes par vente',   value: fmt(Math.round(199 * affiliate.commissionPct / 100)),         color: '#e0a380' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <span className="text-zinc-400 text-sm">{label}</span>
                  <span className="font-bold text-sm" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Ready-to-copy captions */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-sm font-bold mb-4">📝 Textes prêts à copier</h2>
              <div className="space-y-3">
                {[
                  { label: 'Caption TikTok', text: `Ce test m'a décrit mieux que mes potes 😳 mon type MBTI était trop précis. Teste le tien → lien en bio\n${link}` },
                  { label: 'Bio courte',     text: `Test de personnalité gratuit ↓\n${link}` },
                  { label: 'Story / SMS',    text: `Tu dois tester ce truc, il m'a cernée en 2 minutes — ${link}` },
                ].map(({ label, text }) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-2">{label}</p>
                    <p className="text-zinc-300 text-xs leading-relaxed mb-3 whitespace-pre-line">{text}</p>
                    <CopyBtn text={text} label="Copier"/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-zinc-700 text-xs mt-8 pb-4">
          Questions ?&nbsp;
          <a href="mailto:contact@urcecret.site" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            contact@urcecret.site
          </a>
        </p>

      </div>
    </main>
  );
}
