import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { mbtiTypes } from '@/lib/mbti';

export const runtime = 'edge';

const quizMeta: Record<string, { emoji: string; title: string; accent: string }> = {
  infidelite:        { emoji: '💔', title: 'Mon/Ma partenaire me cache quelque chose ?', accent: '#ef4444' },
  adopte:            { emoji: '🧬', title: 'Suis-je adopté(e) ?',                         accent: '#6366f1' },
  amoureux:          { emoji: '💫', title: 'Suis-je vraiment amoureux/amoureuse ?',        accent: '#ec4899' },
  'vrais-amis':      { emoji: '🫂', title: 'Sont-ils mes vrais amis ?',                    accent: '#10b981' },
  orientation:       { emoji: '🌈', title: 'Quelle est mon orientation ?',                 accent: '#8b5cf6' },
  narcissique:       { emoji: '🪞', title: 'Suis-je narcissique ?',                        accent: '#f59e0b' },
  'mon-ex':          { emoji: '💭', title: 'Mon ex pense encore à moi ?',                  accent: '#ec4899' },
  manipule:          { emoji: '🎭', title: 'Suis-je manipulé(e) ?',                        accent: '#8b5cf6' },
  rompre:            { emoji: '💔', title: 'Dois-je rompre ?',                             accent: '#ef4444' },
  jaloux:            { emoji: '👁️', title: 'Suis-je trop jaloux/jalouse ?',               accent: '#f97316' },
  'relation-toxique':{ emoji: '☠️', title: 'Ma relation est-elle toxique ?',               accent: '#ef4444' },
  crush:             { emoji: '💘', title: 'Mon crush ressent quelque chose ?',             accent: '#ec4899' },
  burnout:           { emoji: '🔥', title: 'Suis-je en burnout ?',                         accent: '#f97316' },
  depression:        { emoji: '🌧️', title: 'Ai-je des signes de dépression ?',            accent: '#6366f1' },
  'vrai-amour':      { emoji: '❤️‍🔥', title: 'C\'est de l\'amour ou de l\'attachement ?', accent: '#e11d48' },
  'style-attachement':{ emoji: '🫀', title: 'Quel est ton style d\'attachement ?',         accent: '#6366f1' },
  'langages-amour':  { emoji: '💌', title: 'Quel est ton langage de l\'amour ?',           accent: '#ec4899' },
  gaslight:          { emoji: '🫧', title: 'Est-ce qu\'on te fait douter de toi ?',        accent: '#7c3aed' },
  // Duo quizzes
  'duo-communication': { emoji: '💬', title: 'Duo · Communication',    accent: '#6366f1' },
  'duo-compatibilite': { emoji: '🔮', title: 'Duo · Compatibilité',    accent: '#8b5cf6' },
  'duo-investissement':{ emoji: '⚖️', title: 'Duo · Investissement',   accent: '#ec4899' },
  'duo-resilience':    { emoji: '🛡️', title: 'Duo · Résilience',       accent: '#f97316' },
  'duo-amour':         { emoji: '❤️', title: 'Duo · Amour & Désir',     accent: '#e11d48' },
};

export async function GET(req: NextRequest) {
  const quiz  = req.nextUrl.searchParams.get('quiz');
  const score = req.nextUrl.searchParams.get('score');   // "78"
  const tier  = req.nextUrl.searchParams.get('tier');    // "Forte probabilité"
  const mode  = req.nextUrl.searchParams.get('mode');    // "duo" | null
  const typeParam = req.nextUrl.searchParams.get('type'); // MBTI type code e.g. "INFJ"
  const meta  = quiz ? quizMeta[quiz] : null;

  // ── MBTI TYPE CARD ────────────────────────────────────────────────────────
  if (typeParam) {
    const t = mbtiTypes[typeParam.toUpperCase()];
    if (t) {
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
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Background accent glow */}
            <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '480px', height: '480px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentColor}22 0%, transparent 70%)` }} />
            <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentColor}15 0%, transparent 70%)` }} />

            {/* Brand */}
            <div style={{ position: 'absolute', top: '32px', left: '48px', display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '22px', fontWeight: '900', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Ur</span>
              <span style={{ fontSize: '22px', fontWeight: '900', color: '#09090b' }}>Cecret</span>
            </div>
            <div style={{ position: 'absolute', top: '36px', right: '48px', background: `${t.accentColor}15`, border: `1px solid ${t.accentColor}40`, borderRadius: '100px', padding: '6px 16px', display: 'flex' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: t.accentColor }}>{t.rarity} de la population</span>
            </div>

            {/* Type badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: `${t.accentColor}18`, border: `2px solid ${t.accentColor}40`, fontSize: '44px' }}>
                {t.emoji}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '72px', fontWeight: '900', color: t.accentColor, lineHeight: 1 }}>{t.code}</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>{t.name}</span>
              </div>
            </div>

            {/* Tagline */}
            <div style={{ fontSize: '26px', fontWeight: '600', color: '#6b7280', textAlign: 'center', maxWidth: '780px', lineHeight: 1.4, marginBottom: '32px', padding: '0 40px' }}>
              {t.tagline}
            </div>

            {/* Short desc snippet */}
            <div style={{ background: 'white', border: `1px solid ${t.accentColor}25`, borderRadius: '16px', padding: '20px 32px', maxWidth: '780px', textAlign: 'center' }}>
              <span style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
                {t.shortDesc.slice(0, 180)}…
              </span>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '15px', color: '#9ca3af' }}>urcecret.site/types/{t.code.toLowerCase()}</span>
              <span style={{ fontSize: '14px', color: '#d1d5db' }}>·</span>
              <span style={{ fontSize: '14px', color: '#d1d5db' }}>16 types MBTI en français</span>
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }
  }

  // ── RESULT CARD (with score) ──────────────────────────────────────────────
  if (meta && score) {
    const scoreNum = parseInt(score, 10);
    const tierLabel = tier ?? '';
    const isDuo = mode === 'duo';

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
            background: `linear-gradient(135deg, #09090b 0%, #12021f 50%, #09090b 100%)`,
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Background glows */}
          <div style={{ position: 'absolute', top: '-100px', left: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${meta.accent}40 0%, transparent 70%)`, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-80px', right: '-60px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }} />

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '24px', gap: '0px' }}>
            <span style={{ fontSize: '28px', fontWeight: '900', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Ur</span>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'white' }}>Cecret</span>
            {isDuo && <span style={{ fontSize: '14px', fontWeight: '700', color: '#a78bfa', marginLeft: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>· Mode Duo</span>}
          </div>

          {/* Quiz title */}
          <div style={{ fontSize: '22px', color: 'rgba(161,161,170,0.8)', marginBottom: '32px', maxWidth: '700px', textAlign: 'center' }}>
            {meta.emoji} {meta.title}
          </div>

          {/* Big score ring */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <circle
                cx="100" cy="100" r="80"
                fill="none"
                stroke={meta.accent}
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 80 * scoreNum / 100} ${2 * Math.PI * 80 * (1 - scoreNum / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ filter: `drop-shadow(0 0 12px ${meta.accent}88)` }}
              />
              <text x="100" y="108" textAnchor="middle" fill={meta.accent} fontSize="58" fontWeight="900">{scoreNum}%</text>
            </svg>
          </div>

          {/* Tier badge */}
          {tierLabel && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              borderRadius: '100px',
              border: `2px solid ${meta.accent}55`,
              background: `${meta.accent}18`,
              marginBottom: '24px',
            }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: meta.accent }}>{tierLabel}</span>
            </div>
          )}

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '16px', color: 'rgba(161,161,170,0.5)' }}>urcecret.site</span>
            <span style={{ fontSize: '14px', color: 'rgba(161,161,170,0.35)' }}>·</span>
            <span style={{ fontSize: '14px', color: 'rgba(161,161,170,0.4)' }}>Tu ferais mieux ? →</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── QUIZ LANDING CARD (no score) ──────────────────────────────────────────
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
          <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '450px', height: '450px', borderRadius: '50%', background: `radial-gradient(circle, ${meta.accent}55 0%, transparent 70%)`, filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '32px' }}>
            <span style={{ fontSize: '36px', fontWeight: '900', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Ur</span>
            <span style={{ fontSize: '36px', fontWeight: '900', color: 'white' }}>Cecret</span>
          </div>

          <div style={{ fontSize: '96px', marginBottom: '24px', lineHeight: 1 }}>{meta.emoji}</div>

          <div style={{ fontSize: '52px', fontWeight: '900', color: 'white', textAlign: 'center', maxWidth: '900px', lineHeight: 1.15, marginBottom: '24px', padding: '0 40px' }}>
            {meta.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: `linear-gradient(135deg, ${meta.accent}, #8b5cf6)`, borderRadius: '100px', padding: '12px 32px', marginTop: '8px', boxShadow: `0 8px 32px ${meta.accent}66` }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
              100% anonyme · Résultats instantanés
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: '32px', fontSize: '18px', color: 'rgba(161,161,170,0.7)', letterSpacing: '0.05em' }}>
            urcecret.site
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── DEFAULT OG ────────────────────────────────────────────────────────────
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
          <span style={{ fontSize: '88px', fontWeight: '900', color: 'white', lineHeight: 1 }}>Cecret</span>
        </div>

        <p style={{ fontSize: '26px', color: 'rgba(161,161,170,0.9)', margin: '0 0 40px 0', letterSpacing: '0.02em' }}>
          Tes vraies réponses. Rien que la vérité.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '100px', padding: '14px 36px', boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}>
          <span style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>18 quizzes · 100% anonyme · gratuit</span>
        </div>

        <div style={{ position: 'absolute', bottom: '32px', display: 'flex', gap: '12px' }}>
          {['🫀 Attachement', '💔 Infidélité', '💌 Langages amour', '🫧 Gaslighting', '👫 Mode Duo'].map((q) => (
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
