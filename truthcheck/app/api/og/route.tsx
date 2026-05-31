import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #1a0530 45%, #0d0118 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background glow orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-60px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Lock icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
            boxShadow: '0 0 40px rgba(139,92,246,0.5)',
          }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="white">
            <path d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 0 1 1 3.732V17a1 1 0 0 1-2 0v-1.268A2 2 0 0 1 12 12z"/>
          </svg>
        </div>

        {/* Brand name */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '88px',
              fontWeight: '900',
              background: 'linear-gradient(to right, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            Ur
          </span>
          <span style={{ fontSize: '88px', fontWeight: '900', color: 'white', lineHeight: 1 }}>
            Secret
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: '26px',
            color: 'rgba(161,161,170,0.9)',
            margin: '0 0 40px 0',
            letterSpacing: '0.02em',
          }}
        >
          Tes vraies réponses. Rien que la vérité.
        </p>

        {/* CTA pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '100px',
            padding: '14px 36px',
            boxShadow: '0 8px 32px rgba(139,92,246,0.4)',
          }}
        >
          <span style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>
            Commencer — 100% anonyme · gratuit
          </span>
        </div>

        {/* Bottom quiz previews */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            gap: '12px',
          }}
        >
          {['💔 Infidélité', '🔍 Adoption', '💫 Amour', '🫂 Amitié', '🌈 Orientation'].map((q) => (
            <div
              key={q}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                padding: '6px 16px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {q}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
