import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const p       = req.nextUrl.searchParams;
  const type    = p.get('type')  ?? '';
  const hook    = p.get('hook')  ?? 'Mon profil psychologique révélé.';
  const arch    = p.get('arch')  ?? '';
  const score   = p.get('score') ?? '';
  const quiz    = p.get('quiz')  ?? 'personnalite';

  const isMbti  = quiz === 'personnalite' && type.length === 4;
  const headline = isMbti ? type : `${score}%`;
  const sub      = isMbti ? arch : (arch || 'Mon résultat UrCecret');

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080, height: 1920,
          background: 'linear-gradient(160deg,#0a0a0f 0%,#120808 40%,#1a0c05 70%,#0a0a0f 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'system-ui,sans-serif', padding: '100px 80px', position: 'relative',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: 320, left: 240,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(194,97,31,0.22) 0%,transparent 70%)',
          display: 'flex',
        }} />

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#d17d52' }} />
            <span style={{ fontSize: 32, fontWeight: 900, color: '#d17d52', letterSpacing: '0.14em' }}>URCECRET</span>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#d17d52' }} />
          </div>
          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>
            PSYCHOLOGIE · PERSONNALITÉ
          </span>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, textAlign: 'center' }}>
          <span style={{
            fontSize: isMbti ? 230 : 190, fontWeight: 900, color: '#ffffff',
            letterSpacing: isMbti ? '0.08em' : '0.02em', lineHeight: 0.9,
            textShadow: '0 0 100px rgba(194,97,31,0.65)',
          }}>
            {headline}
          </span>
          {sub ? (
            <span style={{ fontSize: 46, fontWeight: 700, color: '#d17d52', letterSpacing: '0.14em' }}>
              {sub.toUpperCase()}
            </span>
          ) : null}

          <div style={{ display: 'flex', width: 140, height: 2, background: 'rgba(194,97,31,0.5)' }} />

          <span style={{ fontSize: 50, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3, maxWidth: 860, fontStyle: 'italic' }}>
            &quot;{hook}&quot;
          </span>
        </div>

        {/* Contest */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            background: 'rgba(251,191,36,0.12)', border: '2px solid rgba(251,191,36,0.5)',
            borderRadius: 28, padding: '28px 64px',
          }}>
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em' }}>🏆 CONCOURS</span>
            <span style={{ fontSize: 64, fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>1 000 €</span>
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.55)' }}>au portrait le plus viral</span>
          </div>
          <span style={{ fontSize: 30, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>urcecret.site</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
