import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { mbtiTypesFree as mbtiTypes } from '@/lib/mbti-free';

export const runtime = 'edge';

// Carte de résultat MBTI, format portrait 1080×1350 (4:5) — pensée pour être
// enregistrée comme photo et partagée (TikTok / Insta). N'utilise QUE des
// champs gratuits (code, nom, tagline, rareté, traits) — aucun contenu payant.
const INK = '#15121F';
const INK_SOFT = '#1F1B2E';
const GOLD = '#C9A227';
const PAPER = '#FAF6EC';

export async function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get('type') ?? '').toUpperCase();
  const t = mbtiTypes[code];

  if (!t) {
    return new Response('type inconnu', { status: 404 });
  }

  const accent = t.accentColor;
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 360) / 8;
    const rad = (a * Math.PI) / 180;
    const rO = 46, rI = i % 2 === 0 ? 38 : 41;
    return {
      x1: 50 + rO * Math.sin(rad), y1: 50 - rO * Math.cos(rad),
      x2: 50 + rI * Math.sin(rad), y2: 50 - rI * Math.cos(rad),
    };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px', height: '1350px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', background: INK, position: 'relative', overflow: 'hidden',
          fontFamily: 'Georgia, serif', padding: '72px 64px',
        }}
      >
        {/* Lueur teintée du type, très discrète */}
        <div style={{ position: 'absolute', top: '-120px', left: '50%', marginLeft: '-300px', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)` }} />

        {/* Marque */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: '34px', fontWeight: 900, color: GOLD }}>Ur</span>
          <span style={{ fontSize: '34px', fontWeight: 900, color: PAPER }}>Cecret</span>
        </div>

        {/* Sceau */}
        <div style={{ display: 'flex', marginTop: '72px' }}>
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke={GOLD} strokeWidth="1.2">
            <circle cx="50" cy="50" r="47" />
            <circle cx="50" cy="50" r="34" opacity="0.55" />
            {ticks.map((k, i) => (<line key={i} x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2} />))}
            <circle cx="50" cy="50" r="2.5" fill={GOLD} stroke="none" />
          </svg>
        </div>

        {/* Label */}
        <div style={{ display: 'flex', marginTop: '56px' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.22em', color: GOLD, fontFamily: 'system-ui, sans-serif' }}>
            MON TYPE DE PERSONNALITÉ
          </span>
        </div>

        {/* Code */}
        <div style={{ display: 'flex', marginTop: '18px' }}>
          <span style={{ fontSize: '200px', fontWeight: 900, color: PAPER, lineHeight: 1, letterSpacing: '0.02em' }}>{t.code}</span>
        </div>

        {/* Nom */}
        <div style={{ display: 'flex', marginTop: '4px' }}>
          <span style={{ fontSize: '52px', fontWeight: 700, color: accent }}>{t.name}</span>
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', marginTop: '28px', maxWidth: '840px' }}>
          <span style={{ fontSize: '30px', color: 'rgba(250,246,236,0.65)', textAlign: 'center', lineHeight: 1.45, fontStyle: 'italic' }}>
            {t.tagline}
          </span>
        </div>

        {/* Rareté */}
        <div style={{ display: 'flex', marginTop: '34px', padding: '10px 26px', borderRadius: '999px', border: `1px solid ${GOLD}59`, background: `${GOLD}1A` }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: GOLD, fontFamily: 'system-ui, sans-serif' }}>
            {t.rarity} de la population
          </span>
        </div>

        {/* Traits */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', marginTop: '40px', maxWidth: '900px' }}>
          {t.traits.slice(0, 4).map((tr) => (
            <div key={tr} style={{ display: 'flex', padding: '12px 24px', borderRadius: '999px', background: INK_SOFT, border: '1px solid rgba(250,246,236,0.14)' }}>
              <span style={{ fontSize: '26px', color: PAPER, fontFamily: 'system-ui, sans-serif' }}>{tr}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', position: 'absolute', bottom: '56px', alignItems: 'center' }}>
          <span style={{ fontSize: '26px', fontWeight: 700, color: GOLD, fontFamily: 'system-ui, sans-serif', letterSpacing: '0.04em' }}>urcecret.site</span>
          <span style={{ fontSize: '26px', color: 'rgba(250,246,236,0.35)', margin: '0 14px' }}>·</span>
          <span style={{ fontSize: '26px', color: 'rgba(250,246,236,0.5)', fontFamily: 'system-ui, sans-serif' }}>Découvre ton type</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 },
  );
}
