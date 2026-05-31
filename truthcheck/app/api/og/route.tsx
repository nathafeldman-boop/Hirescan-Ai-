import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const quizMeta: Record<string, { emoji: string; title: string; accent: string }> = {
  infidelite:  { emoji: '💔', title: 'Mon/Ma partenaire me trompe ?',        accent: '#ef4444' },
  adopte:      { emoji: '🔍', title: 'Suis-je adopté(e) ?',                  accent: '#6366f1' },
  amoureux:    { emoji: '💫', title: 'Suis-je vraiment amoureux/amoureuse ?', accent: '#ec4899' },
  'vrais-amis':{ emoji: '🫂', title: 'Sont-ils mes vrais amis ?',             accent: '#10b981' },
  orientation: { emoji: '🌈', title: 'Quelle est mon orientation ?',          accent: '#8b5cf6' },
};

export async function GET(req: NextRequest) {
  const quiz = req.nextUrl.searchParams.get('quiz');
  const meta = quiz ? quizMeta[quiz] : null;

  if (meta) {
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
          {/* Background glow */}
          <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '450px', height: '450px', borderRadius: '50%', background: `radial-gradient(circle, ${meta.accent}55 0%, transparent 70%)`, filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '32px', gap: '0px' }}>
            <span style={{ fontSize: '36px', fontWeight: '900', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Ur</span>
            <span style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>Secret</span>
          </div>

          {/* Emoji */}
          <div style={{ fontSize: '96px', marginBottom: '24px', lineHeight: 1 }}>{meta.emoji}</div>

          {/* Title */}
          <div style={{
            fontSize: '52px',
            fontWeight: '900',
            color: 'white',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.15,
            marginBottom: '24px',
            padding: '0 40px',
          }}>
            {meta.title}
          </div>

          {/* CTA pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${meta.accent}, #8b5cf6)`,
            borderRadius: '100px',
            padding: '12px 32px',
            marginTop: '8px',
            boxShadow: `0 8px 32px ${meta.accent}66`,
          }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
              30 questions · 100% anonyme · Gratuit
            </span>
          </div>

          {/* Subtitle */}
          <div style={{ position: 'absolute', bottom: '32px', fontSize: '18px', color: 'rgba(161,161,170,0.7)', letterSpacing: '0.05em' }}>
            ursecret.vercel.app
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default OG image
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
        <div style={{ position: 'absolute', top: '-100px', left: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-60px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="white">
            <path d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 0 1 1 3.732V17a1 1 0 0 1-2 0v-1.268A2 2 0 0 1 12 12z"/>
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '16px' }}>
          <span style={{ fontSize: '88px', fontWeight: '900', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', color: 'transparent', lineHeight: 1 }}>Ur</span>
          <span style={{ fontSize: '88px', fontWeight: '900', color: 'white', lineHeight: 1 }}>Secret</span>
        </div>

        <p style={{ fontSize: '26px', color: 'rgba(161,161,170,0.9)', margin: '0 0 40px 0', letterSpacing: '0.02em' }}>
          Tes vraies réponses. Rien que la vérité.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '100px', padding: '14px 36px', boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}>
          <span style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>Commencer — 100% anonyme · gratuit</span>
        </div>

        <div style={{ position: 'absolute', bottom: '32px', display: 'flex', gap: '12px' }}>
          {['💔 Infidélité', '🔍 Adoption', '💫 Amour', '🫂 Amitié', '🌈 Orientation'].map((q) => (
            <div key={q} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '6px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              {q}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
