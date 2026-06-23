import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Character + accent color per MBTI type
const MBTI_META: Record<string, { char: string; color: string; shadow: string }> = {
  INTJ: { char: '🧙', color: '#6366f1', shadow: 'rgba(99,102,241,0.5)' },
  INTP: { char: '🔬', color: '#06b6d4', shadow: 'rgba(6,182,212,0.5)' },
  ENTJ: { char: '👑', color: '#f59e0b', shadow: 'rgba(245,158,11,0.5)' },
  ENTP: { char: '⚡', color: '#eab308', shadow: 'rgba(234,179,8,0.5)' },
  INFJ: { char: '🌙', color: '#8b5cf6', shadow: 'rgba(139,92,246,0.5)' },
  INFP: { char: '🌸', color: '#ec4899', shadow: 'rgba(236,72,153,0.5)' },
  ENFJ: { char: '✨', color: '#f97316', shadow: 'rgba(249,115,22,0.5)' },
  ENFP: { char: '🎭', color: '#10b981', shadow: 'rgba(16,185,129,0.5)' },
  ISTJ: { char: '🛡️', color: '#64748b', shadow: 'rgba(100,116,139,0.5)' },
  ISFJ: { char: '🤍', color: '#a78bfa', shadow: 'rgba(167,139,250,0.5)' },
  ESTJ: { char: '⚖️', color: '#3b82f6', shadow: 'rgba(59,130,246,0.5)' },
  ESFJ: { char: '💛', color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)' },
  ISTP: { char: '🔧', color: '#6b7280', shadow: 'rgba(107,114,128,0.5)' },
  ISFP: { char: '🎨', color: '#f472b6', shadow: 'rgba(244,114,182,0.5)' },
  ESTP: { char: '🔥', color: '#ef4444', shadow: 'rgba(239,68,68,0.5)' },
  ESFP: { char: '🎉', color: '#f97316', shadow: 'rgba(249,115,22,0.5)' },
};

// Score → character for non-MBTI quizzes
function scoreChar(score: number) {
  if (score >= 80) return { char: '😈', color: '#ef4444', shadow: 'rgba(239,68,68,0.5)' };
  if (score >= 60) return { char: '🕵️', color: '#f59e0b', shadow: 'rgba(245,158,11,0.5)' };
  if (score >= 40) return { char: '🤔', color: '#6366f1', shadow: 'rgba(99,102,241,0.5)' };
  return { char: '😇', color: '#10b981', shadow: 'rgba(16,185,129,0.5)' };
}

export async function GET(req: NextRequest) {
  const p       = req.nextUrl.searchParams;
  const type    = (p.get('type') ?? '').toUpperCase();
  const hook    = p.get('hook')  ?? 'Mon profil psychologique révélé.';
  const arch    = p.get('arch')  ?? '';
  const score   = parseInt(p.get('score') ?? '75', 10);
  const quiz    = p.get('quiz')  ?? 'personnalite';

  const photo   = p.get('photo') ?? '';
  const isMbti  = quiz === 'personnalite' && type.length === 4 && MBTI_META[type];
  const meta    = isMbti ? MBTI_META[type] : scoreChar(score);
  const headline = isMbti ? type : `${score}%`;
  const sub      = isMbti ? arch : (arch || 'Mon résultat UrCecret');

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080, height: 1920,
          background: '#080810',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'system-ui, sans-serif', padding: '90px 80px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '28%', left: '50%',
          width: 800, height: 800,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${meta.shadow} 0%, transparent 65%)`,
          display: 'flex',
        }} />

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#d17d52' }} />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#d17d52', letterSpacing: '0.16em' }}>URCECRET</span>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#d17d52' }} />
          </div>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.22em' }}>
            PSYCHOLOGIE · PERSONNALITÉ
          </span>
        </div>

        {/* CHARACTER + TYPE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, zIndex: 1 }}>

          {/* Avatar circle */}
          <div style={{
            width: 280, height: 280, borderRadius: '50%',
            background: photo ? 'transparent' : `radial-gradient(circle at 40% 35%, ${meta.color}33, ${meta.color}11)`,
            border: `3px solid ${meta.color}88`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: `0 0 80px ${meta.shadow}, inset 0 0 40px ${meta.color}22`,
          }}>
            {photo
              ? <img src={photo} width={280} height={280} style={{ objectFit: 'cover' }} />
              : <span style={{ fontSize: 140, lineHeight: 1 }}>{meta.char}</span>
            }
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: isMbti ? 160 : 150,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: isMbti ? '0.12em' : '0.02em',
              lineHeight: 0.85,
              textShadow: `0 0 80px ${meta.shadow}`,
            }}>
              {headline}
            </span>
            {sub ? (
              <span style={{ fontSize: 38, fontWeight: 700, color: meta.color, letterSpacing: '0.16em' }}>
                {sub.toUpperCase()}
              </span>
            ) : null}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', width: 120, height: 2, background: `${meta.color}88` }} />

          {/* Quote */}
          <span style={{
            fontSize: 46, fontWeight: 700,
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.35,
            maxWidth: 880,
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            &ldquo;{hook}&rdquo;
          </span>
        </div>

        {/* Contest badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, zIndex: 1 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            background: 'rgba(251,191,36,0.10)',
            border: '2px solid rgba(251,191,36,0.45)',
            borderRadius: 28, padding: '24px 60px',
          }}>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em' }}>🏆 CONCOURS</span>
            <span style={{ fontSize: 60, fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>1 000 €</span>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)' }}>au portrait le plus viral</span>
          </div>
          <span style={{ fontSize: 26, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}>urcecret.site</span>
        </div>

      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
