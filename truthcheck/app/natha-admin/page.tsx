export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Mon tableau de bord',
  robots: { index: false, follow: false },
};

function euros(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function pct(a: number, b: number) {
  if (b === 0) return '—';
  return ((a / b) * 100).toFixed(1) + '%';
}

const TZ = 'Europe/Paris';

// Returns the UTC Date corresponding to midnight Paris time for a given date string "YYYY-MM-DD"
function parisMidnight(dateStr: string): Date {
  const utcMid = new Date(dateStr + 'T00:00:00Z');
  // How many hours into the Paris day does UTC midnight fall? That's the Paris offset.
  const parisHour = +new Intl.DateTimeFormat('en', { timeZone: TZ, hour: 'numeric', hour12: false }).format(utcMid);
  return new Date(utcMid.getTime() - parisHour * 3_600_000);
}

export default async function NathaAdminPage() {
  const now = new Date();
  const todayParis  = now.toLocaleDateString('en-CA', { timeZone: TZ }); // "2026-06-12"
  const monthParis  = todayParis.slice(0, 7) + '-01';                    // "2026-06-01"

  const startOfToday = parisMidnight(todayParis);
  const startOfMonth = parisMidnight(monthParis);
  const sevenDaysAgo = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
  const fourteenAgo  = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const startOfYear  = new Date(now.getFullYear(), 0, 1);

  const [
    totalUsers, premiumUsers, newToday, newThisWeek, newLastWeek,
    totalResults, paidResults, paidToday, paidThisWeek, paidLastWeek,
    visitsToday, visitsWeek, visitsLastWeek, visitsTotal,
    landingToday, landingTotal,
    topPages, recentUsers, affiliates, quizResults, allConversions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'premium' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: fourteenAgo, lt: sevenDaysAgo } } }),
    prisma.quizResult.count(),
    prisma.quizResult.count({ where: { paid: true } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: sevenDaysAgo } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: fourteenAgo, lt: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: fourteenAgo, lt: sevenDaysAgo } } }),
    prisma.pageView.count(),
    prisma.pageView.count({ where: { path: '/', createdAt: { gte: startOfToday } } }),
    prisma.pageView.count({ where: { path: '/' } }),
    prisma.pageView.groupBy({ by: ['path'], _count: { path: true }, orderBy: { _count: { path: 'desc' } }, take: 8 }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 30, select: { email: true, name: true, tier: true, createdAt: true } }),
    prisma.affiliate.findMany({ include: { conversions: true }, orderBy: { createdAt: 'desc' } }).then(async (aff) => {
      const clicks = await Promise.all(aff.map(a => prisma.pageView.count({ where: { path: `/__aff/${a.slug}` } })));
      return aff.map((a, i) => ({ ...a, clicks: clicks[i] }));
    }),
    prisma.quizResult.findMany({ select: { quizSlug: true, paid: true } }),
    prisma.affiliateConversion.findMany({ select: { amountCents: true, createdAt: true } }),
  ]);

  // Quiz drop-off funnel (MBTI personnalite)
  const [fStart, fQ10, fQ25, fQ50, fQ75, fComplete, fPaywall, fCheckout] = await Promise.all([
    prisma.pageView.count({ where: { path: '/__evt/quiz_start/personnalite' } }),
    prisma.pageView.count({ where: { path: '/__quiz/q10' } }),
    prisma.pageView.count({ where: { path: '/__quiz/q25' } }),
    prisma.pageView.count({ where: { path: '/__quiz/q50' } }),
    prisma.pageView.count({ where: { path: '/__quiz/q75' } }),
    prisma.pageView.count({ where: { path: '/__evt/quiz_complete/personnalite' } }),
    prisma.pageView.count({ where: { path: '/__evt/paywall_view/personnalite' } }),
    prisma.pageView.count({ where: { path: '/__evt/checkout_click/personnalite' } }),
  ]);

  // Diagnostic funnel steps (last 24h)
  const diagSteps = [
    'page_load', 'inapp_detected',
    'session_restore_fired',
    'pending_found_authed', 'pending_found_not_authed',
    'type_from_localstorage', 'type_from_localstorage_not_authed',
    'analysis_done',
    'paywall_mounted',
    'inapp_signup_click',
    'checkout_no_email', 'checkout_with_email',
    'auto_checkout_check',
  ];
  const diagCounts = await Promise.all(
    diagSteps.map(step => prisma.pageView.count({ where: { path: `/__diag/${step}`, createdAt: { gte: sevenDaysAgo } } }))
  );
  const diagData = diagSteps.map((step, i) => ({ step, count: diagCounts[i] }));

  const revenueToday = allConversions.filter(c => new Date(c.createdAt) >= startOfToday).reduce((s, c) => s + c.amountCents, 0);
  const revenueWeek  = allConversions.filter(c => new Date(c.createdAt) >= sevenDaysAgo).reduce((s, c) => s + c.amountCents, 0);
  const revenueMonth = allConversions.filter(c => new Date(c.createdAt) >= startOfMonth).reduce((s, c) => s + c.amountCents, 0);
  const revenueTotal = allConversions.reduce((s, c) => s + c.amountCents, 0);
  const MRR = premiumUsers * 999;

  const byQuiz: Record<string, { total: number; paid: number }> = {};
  for (const r of quizResults) {
    if (!byQuiz[r.quizSlug]) byQuiz[r.quizSlug] = { total: 0, paid: 0 };
    byQuiz[r.quizSlug].total++;
    if (r.paid) byQuiz[r.quizSlug].paid++;
  }
  const quizSorted = Object.entries(byQuiz).sort((a, b) => b[1].total - a[1].total);

  function arrow(current: number, previous: number) {
    if (previous === 0) return current > 0 ? '↑' : '';
    return current >= previous ? '↑' : '↓';
  }
  function trendColor(current: number, previous: number) {
    if (previous === 0) return current > 0 ? '#4ade80' : '#71717a';
    return current >= previous ? '#4ade80' : '#f87171';
  }

  const C = {
    bg: '#09090b',
    surface: '#111113',
    border: '#1f1f23',
    text: '#f4f4f5',
    muted: '#71717a',
    green: '#4ade80',
    blue: '#38bdf8',
    purple: '#d17d52',
    pink: '#e0a380',
    orange: '#fb923c',
    yellow: '#fbbf24',
    red: '#f87171',
  };

  const block = (bg: string, border: string): React.CSSProperties => ({
    background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 20px',
  });

  const label: React.CSSProperties = { color: C.muted, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 };
  const bigNum: React.CSSProperties = { color: C.text, fontSize: 28, fontWeight: 900, margin: '6px 0 0', lineHeight: 1 };
  const sub: React.CSSProperties = { color: C.muted, fontSize: 12, margin: '4px 0 0' };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: -1 }}>
            <span style={{ background: 'linear-gradient(90deg,#d17d52,#e0a380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span style={{ color: '#fff' }}>Cecret</span>
            <span style={{ color: C.muted, fontWeight: 400, fontSize: 16, marginLeft: 12 }}>— tableau de bord</span>
          </h1>
          <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>
            {now.toLocaleDateString('fr-FR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' })} à {now.toLocaleTimeString('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* ── SECTION 1 : Ce qui s'est passé aujourd'hui ── */}
        <p style={{ color: C.purple, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Aujourd'hui</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 32 }}>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Personnes venues</p>
            <p style={bigNum}>{visitsToday}</p>
            <p style={sub}>ont ouvert le site</p>
          </div>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Sur la page d'accueil</p>
            <p style={bigNum}>{landingToday}</p>
            <p style={sub}>ont vu la landing</p>
          </div>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Nouveaux inscrits</p>
            <p style={bigNum}>{newToday}</p>
            <p style={sub}>ont créé un compte</p>
          </div>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Achats payants</p>
            <p style={bigNum}>{paidToday}</p>
            <p style={{ ...sub, color: paidToday > 0 ? C.green : C.muted }}>{paidToday > 0 ? `${euros(paidToday * 199)} encaissés` : 'aucun encore'}</p>
          </div>

        </div>

        {/* ── SECTION 2 : Cette semaine vs semaine dernière ── */}
        <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Cette semaine vs semaine dernière</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 32 }}>

          {[
            { label: 'Visiteurs', current: visitsWeek, previous: visitsLastWeek, unit: '' },
            { label: 'Nouveaux inscrits', current: newThisWeek, previous: newLastWeek, unit: '' },
            { label: 'Quiz payés', current: paidThisWeek, previous: paidLastWeek, unit: '' },
          ].map(({ label: l, current, previous, unit }) => (
            <div key={l} style={block(C.surface, C.border)}>
              <p style={label}>{l}</p>
              <p style={{ ...bigNum, color: trendColor(current, previous) }}>
                {arrow(current, previous)} {current}{unit}
              </p>
              <p style={sub}>était {previous}{unit} la sem. d'avant</p>
            </div>
          ))}

          <div style={block(C.surface, C.border)}>
            <p style={label}>Argent entré</p>
            <p style={{ ...bigNum, color: revenueWeek > 0 ? C.green : C.text }}>{euros(revenueWeek)}</p>
            <p style={sub}>cette semaine (affiliés)</p>
          </div>

        </div>

        {/* ── SECTION 3 : Argent ── */}
        <p style={{ color: C.green, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Argent</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 32 }}>

          <div style={{ ...block('rgba(74,222,128,0.06)', 'rgba(74,222,128,0.2)'), gridColumn: '1 / -1' }}>
            <p style={label}>Revenus mensuels estimés (MRR)</p>
            <p style={{ ...bigNum, fontSize: 36, color: C.green }}>{euros(MRR)}</p>
            <p style={sub}>{premiumUsers} abonné{premiumUsers > 1 ? 's' : ''} × 9,99 €/mois</p>
          </div>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Aujourd'hui</p>
            <p style={bigNum}>{euros(revenueToday)}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Ce mois</p>
            <p style={bigNum}>{euros(revenueMonth)}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Total cumulé</p>
            <p style={bigNum}>{euros(revenueTotal)}</p>
          </div>

        </div>

        {/* ── SECTION 4 : Clients ── */}
        <p style={{ color: C.pink, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Clients</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 32 }}>

          <div style={block(C.surface, C.border)}>
            <p style={label}>Inscrits au total</p>
            <p style={bigNum}>{totalUsers}</p>
            <p style={sub}>ont créé un compte</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Abonnés premium</p>
            <p style={{ ...bigNum, color: C.pink }}>{premiumUsers}</p>
            <p style={sub}>{pct(premiumUsers, totalUsers)} des inscrits</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Quiz complétés</p>
            <p style={bigNum}>{totalResults}</p>
            <p style={sub}>{paidResults} ont payé</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Visite → inscrit</p>
            <p style={bigNum}>{pct(totalUsers, landingTotal)}</p>
            <p style={sub}>sur {landingTotal} vus la home</p>
          </div>

        </div>

        {/* ── SECTION 5 : Affiliés ── */}
        <p style={{ color: C.yellow, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Tes affiliés</p>
        {affiliates.length === 0 ? (
          <div style={{ ...block(C.surface, C.border), marginBottom: 32, color: C.muted, fontSize: 14 }}>
            Aucun affilié pour l'instant.
          </div>
        ) : (
          <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {affiliates.map(a => {
              const ca = a.conversions.reduce((s, c) => s + c.amountCents, 0);
              const commission = a.conversions.reduce((s, c) => s + c.commissionCents, 0);
              return (
                <div key={a.id} style={{ ...block(C.surface, C.border), display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ color: C.text, fontWeight: 700, fontSize: 15, margin: 0 }}>{a.name}</p>
                    <p style={{ color: C.muted, fontSize: 12, margin: '3px 0 0', fontFamily: 'monospace' }}>?ref={a.slug}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>Clics</p>
                      <p style={{ color: C.blue, fontWeight: 900, fontSize: 20, margin: 0 }}>{a.clicks}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>Tx conv.</p>
                      <p style={{ color: C.purple, fontWeight: 900, fontSize: 20, margin: 0 }}>
                        {a.clicks > 0 ? `${((a.conversions.length / a.clicks) * 100).toFixed(1)}%` : '—'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>Ventes</p>
                      <p style={{ color: C.text, fontWeight: 900, fontSize: 20, margin: 0 }}>{a.conversions.length}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>CA généré</p>
                      <p style={{ color: C.yellow, fontWeight: 900, fontSize: 20, margin: 0 }}>{euros(ca)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...label, marginBottom: 2 }}>À payer</p>
                      <p style={{ color: C.pink, fontWeight: 900, fontSize: 20, margin: 0 }}>{euros(commission)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SECTION 7 : Funnel drop-off MBTI ── */}
        <p style={{ color: C.pink, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Funnel MBTI — où les gens lâchent</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 32 }}>
          {fStart === 0 && <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Pas encore de données (tracking actif depuis ce soir).</p>}
          {fStart > 0 && (() => {
            const steps = [
              { label: 'Démarré le quiz', n: fStart, color: C.blue },
              { label: 'Q10 atteinte', n: fQ10, color: C.purple },
              { label: 'Q25 atteinte', n: fQ25, color: C.purple },
              { label: 'Q50 atteinte', n: fQ50, color: C.yellow },
              { label: 'Q75 atteinte', n: fQ75, color: C.orange },
              { label: 'Quiz terminé (100)', n: fComplete, color: C.green },
              { label: 'Paywall vu', n: fPaywall, color: C.pink },
              { label: 'Paiement cliqué', n: fCheckout, color: C.green },
            ];
            const maxN = steps[0].n || 1;
            return steps.map((s, i) => {
              const pctVal = s.n === 0 ? 0 : Math.round((s.n / maxN) * 100);
              const dropVsNext = i < steps.length - 1 && s.n > 0 && steps[i + 1].n > 0
                ? Math.round(((s.n - steps[i + 1].n) / s.n) * 100) : null;
              return (
                <div key={s.label} style={{ padding: '10px 0', borderBottom: i < steps.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <span style={{ color: C.muted, fontSize: 12, width: 22, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1, color: C.text, fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                    <span style={{ color: s.color, fontSize: 15, fontWeight: 900, minWidth: 30, textAlign: 'right' }}>{s.n}</span>
                    <span style={{ color: C.muted, fontSize: 12, width: 44, textAlign: 'right' }}>{pctVal}%</span>
                    {dropVsNext !== null && <span style={{ color: C.red, fontSize: 11, fontWeight: 700, width: 52, textAlign: 'right' }}>−{dropVsNext}%</span>}
                  </div>
                  <div style={{ marginLeft: 32, height: 5, borderRadius: 3, background: C.border, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pctVal}%`, background: s.color, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* ── SECTION 8 : Pages les plus vues ── */}
        <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Pages les plus vues</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 32 }}>
          {topPages.map((p, i) => (
            <div key={p.path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topPages.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ color: C.muted, fontSize: 13, width: 20, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, color: C.text, fontSize: 13, fontFamily: 'monospace' }}>{p.path}</span>
              <span style={{ color: C.blue, fontSize: 14, fontWeight: 700 }}>{p._count.path}</span>
            </div>
          ))}
          {topPages.length === 0 && <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Aucune visite encore.</p>}
        </div>

        {/* ── SECTION 8 : Derniers inscrits ── */}
        <p style={{ color: C.purple, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Derniers inscrits</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 32 }}>
          {recentUsers.length === 0 && <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Aucun inscrit pour l'instant.</p>}
          {recentUsers.map((u, i) => (
            <div key={u.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recentUsers.length - 1 ? `1px solid ${C.border}` : 'none', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name ?? u.email ?? 'Anonyme'}
                </p>
                <p style={{ color: C.muted, fontSize: 11, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email} · {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: u.tier === 'premium' ? 'rgba(209,125,82,0.15)' : 'rgba(255,255,255,0.05)',
                color: u.tier === 'premium' ? C.purple : C.muted,
                border: `1px solid ${u.tier === 'premium' ? 'rgba(209,125,82,0.3)' : C.border}`,
                flexShrink: 0,
              }}>
                {u.tier === 'premium' ? 'Premium' : 'Gratuit'}
              </span>
            </div>
          ))}
        </div>

        {/* ── SECTION 9 : Diagnostic TikTok funnel (7 derniers jours) ── */}
        <p style={{ color: C.orange, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Diagnostic funnel TikTok — 7 derniers jours</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 0 }}>
          {diagData.map((d, i) => (
            <div key={d.step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < diagData.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ flex: 1, color: d.count > 0 ? C.text : C.muted, fontSize: 13, fontFamily: 'monospace' }}>
                {'/__diag/' + d.step}
              </span>
              <span style={{
                color: d.count > 0 ? C.orange : C.muted,
                fontSize: 14, fontWeight: 700, minWidth: 32, textAlign: 'right',
              }}>
                {d.count}
              </span>
            </div>
          ))}
          <p style={{ color: C.muted, fontSize: 11, marginTop: 12, marginBottom: 0 }}>
            Ces compteurs apparaissent dès qu'un utilisateur atteint l'étape correspondante. Zéro = l'étape n'a pas été atteinte.
          </p>
        </div>

      </div>
    </div>
  );
}
