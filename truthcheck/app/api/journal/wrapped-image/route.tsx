import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Image "bilan" du Journal, façon Wrapped — même logique que /api/og : tout
// vient de query params calculés côté client (pas d'accès DB depuis l'edge),
// pour rester partageable sans authentification. Réservé aux abonnés côté UI
// (voir JournalClient.tsx) — cette route ne fait que dessiner ce qu'on lui donne.
export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') === 'month' ? 'mois' : 'semaine';
  const streak = parseInt(req.nextUrl.searchParams.get('streak') ?? '0', 10) || 0;
  const mood = req.nextUrl.searchParams.get('mood') ?? '—';
  const evolution = req.nextUrl.searchParams.get('evolution');
  const tagEmoji = req.nextUrl.searchParams.get('tagEmoji') ?? '';
  const tagLabel = req.nextUrl.searchParams.get('tagLabel') ?? '';
  const firstName = req.nextUrl.searchParams.get('name') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1920px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #15121F 0%, #1F1B2E 55%, #15121F 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: '-160px', left: '-120px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-140px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
          <span style={{ fontSize: '34px', fontWeight: 900, color: '#C9A227' }}>Ur</span>
          <span style={{ fontSize: '34px', fontWeight: 900, color: 'white' }}>Cecret</span>
        </div>
        <div style={{ display: 'flex', fontSize: '26px', color: 'rgba(250,246,236,0.55)', marginBottom: '64px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Bilan de {period}{firstName ? ` · ${firstName}` : ''}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', width: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '32px', padding: '36px 44px' }}>
            <span style={{ fontSize: '64px' }}>🔥</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '64px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{streak}</span>
              <span style={{ fontSize: '24px', color: 'rgba(250,246,236,0.6)' }}>jours de série</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '32px', padding: '36px 44px' }}>
            <span style={{ fontSize: '64px' }}>❤️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '64px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{mood}/10</span>
              <span style={{ fontSize: '24px', color: 'rgba(250,246,236,0.6)' }}>bonheur moyen</span>
            </div>
          </div>

          {evolution && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '32px', padding: '36px 44px' }}>
              <span style={{ fontSize: '64px' }}>📈</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '64px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{evolution}%</span>
                <span style={{ fontSize: '24px', color: 'rgba(250,246,236,0.6)' }}>évolution</span>
              </div>
            </div>
          )}

          {tagLabel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '32px', padding: '36px 44px' }}>
              <span style={{ fontSize: '64px' }}>{tagEmoji}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, color: 'white', lineHeight: 1.2 }}>{tagLabel}</span>
                <span style={{ fontSize: '24px', color: 'rgba(250,246,236,0.6)' }}>ton thème dominant</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: '64px', fontSize: '22px', color: 'rgba(250,246,236,0.4)' }}>
          urcecret.site/journal
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
