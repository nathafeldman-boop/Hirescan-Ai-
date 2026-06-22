import { prisma } from '@/lib/db';
import TikTokSubmitForm from './TikTokSubmitForm';

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatEuros(cents: number) {
  return `${(cents / 100).toFixed(2)} €`;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default async function CagnottePage() {
  const month = currentMonth();

  const [poolResult, revenueRows, viewsRows, likesRows] = await Promise.all([
    prisma.affiliateConversion.aggregate({
      _sum: { commissionCents: true },
      where: {
        createdAt: {
          gte: new Date(`${month}-01`),
          lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
        },
      },
    }),
    prisma.affiliateConversion.groupBy({
      by: ['affiliateId'],
      _sum: { commissionCents: true, amountCents: true },
      where: {
        createdAt: {
          gte: new Date(`${month}-01`),
          lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
        },
      },
      orderBy: { _sum: { commissionCents: 'desc' } },
      take: 10,
    }),
    prisma.contestEntry.findMany({
      where: { month },
      orderBy: { viewsCount: 'desc' },
      take: 10,
    }),
    prisma.contestEntry.findMany({
      where: { month },
      orderBy: [{ likesCount: 'desc' }, { sharesCount: 'desc' }],
      take: 10,
    }),
  ]);

  const affiliateIds = revenueRows.map(r => r.affiliateId);
  const affiliates = affiliateIds.length > 0
    ? await prisma.affiliate.findMany({ where: { id: { in: affiliateIds } } })
    : [];
  const affiliateMap = Object.fromEntries(affiliates.map(a => [a.id, a]));

  const poolCents = poolResult._sum.commissionCents ?? 0;
  const [monthLabel] = month.split('-').reverse();
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const monthName = monthNames[parseInt(month.split('-')[1], 10) - 1];

  const bg = '#080814';
  const cardBg = '#0f0f23';
  const border = '#1e1e3a';
  const purple = '#7c3aed';
  const gold = '#f59e0b';
  const silver = '#94a3b8';
  const bronze = '#cd7f32';

  return (
    <main style={{ minHeight: '100vh', background: bg, padding: '0 16px 80px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>Cagnotte {monthName}</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>
            Le meilleur affilié TikTok remporte tout.
          </p>
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${purple}22, ${purple}08)`,
          border: `1px solid ${purple}44`,
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: 'system-ui, sans-serif', marginBottom: '8px' }}>
            Cagnotte du mois
          </p>
          <p style={{ fontSize: '52px', fontWeight: 900, color: '#ffffff', fontFamily: 'system-ui, sans-serif', lineHeight: '1', margin: '0 0 8px' }}>
            {formatEuros(poolCents)}
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>
            Mise en jeu — {month}
          </p>
        </div>

        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: 'system-ui, sans-serif', marginBottom: '16px' }}>
            Répartition des prix
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { medal: '🥇', label: '1er (revenus générés)', pct: 100, color: gold },
              { medal: '🥈', label: '1er (vues TikTok)', pct: 80, color: silver },
              { medal: '🥉', label: '1er (likes + partages)', pct: 60, color: bronze },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{item.medal}</span>
                  <span style={{ fontSize: '14px', color: '#d1d5db', fontFamily: 'system-ui, sans-serif' }}>{item.label}</span>
                </div>
                <span style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: item.color,
                  fontFamily: 'system-ui, sans-serif',
                }}>{item.pct}% — {formatEuros(Math.round(poolCents * item.pct / 100))}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: 'system-ui, sans-serif', marginBottom: '16px' }}>
            Top 10 — Revenus ce mois
          </h2>
          {revenueRows.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#4b5563', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '20px 0' }}>
              Aucune vente ce mois. Sois le premier !
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {revenueRows.map((row, i) => {
                const aff = affiliateMap[row.affiliateId];
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={row.affiliateId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: i === 0 ? `${gold}11` : '#0d0d1f',
                    borderRadius: '10px',
                    border: i === 0 ? `1px solid ${gold}33` : `1px solid ${border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', minWidth: '24px' }}>{medals[i] ?? `#${i + 1}`}</span>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                          {aff?.name ?? 'Affilié'}
                        </p>
                        <p style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'monospace', margin: 0 }}>
                          ?ref={aff?.slug ?? row.affiliateId}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: i === 0 ? gold : '#ffffff', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                        {formatEuros(row._sum.commissionCents ?? 0)}
                      </p>
                      <p style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                        commission
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {viewsRows.length > 0 && (
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: 'system-ui, sans-serif', marginBottom: '16px' }}>
              Top 10 — Vues TikTok
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {viewsRows.map((entry, i) => {
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={entry.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: i === 0 ? `${silver}11` : '#0d0d1f',
                    borderRadius: '10px',
                    border: i === 0 ? `1px solid ${silver}33` : `1px solid ${border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', minWidth: '24px' }}>{medals[i] ?? `#${i + 1}`}</span>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: 'monospace', margin: 0 }}>
                        {entry.affiliateSlug}
                      </p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: i === 0 ? silver : '#ffffff', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                      👁 {formatCount(entry.viewsCount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {likesRows.length > 0 && (
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: 'system-ui, sans-serif', marginBottom: '16px' }}>
              Top 10 — Likes &amp; Partages
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {likesRows.map((entry, i) => {
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={entry.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: i === 0 ? `${bronze}22` : '#0d0d1f',
                    borderRadius: '10px',
                    border: i === 0 ? `1px solid ${bronze}55` : `1px solid ${border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', minWidth: '24px' }}>{medals[i] ?? `#${i + 1}`}</span>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: 'monospace', margin: 0 }}>
                        {entry.affiliateSlug}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: i === 0 ? bronze : '#ffffff', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                        ❤️ {formatCount(entry.likesCount)} · 🔁 {formatCount(entry.sharesCount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{
          background: `linear-gradient(135deg, ${purple}18, #0f0f23)`,
          border: `1px solid ${purple}33`,
          borderRadius: '16px',
          padding: '28px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', fontFamily: 'system-ui, sans-serif', marginBottom: '6px' }}>
            Soumettre mon TikTok
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'system-ui, sans-serif', marginBottom: '24px' }}>
            Entre ton slug et les stats de ta vidéo pour apparaître dans le classement.
          </p>
          <TikTokSubmitForm />
        </div>

      </div>
    </main>
  );
}
