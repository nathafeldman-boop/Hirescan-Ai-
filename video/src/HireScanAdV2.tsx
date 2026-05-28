import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';

export const CINEMATIC_FRAMES = 1140; // 38s × 30fps
const SD = 57; // scene duration = 1.9s ≈ every 1.8s stimulation

// ─── COLOUR PALETTE ──────────────────────────────────────────────────────────
const C = {
  navy:   '#040810',
  blue:   '#0d1535',
  red:    '#350000',
  deepRed:'#1a0000',
  gold:   '#FFD700',
  cyan:   '#00FFCC',
  electric:'#60D8FF',
  white:  '#FFFFFF',
  redBright: '#FF2222',
  greenBright: '#00FF88',
};

// ─── FONT STYLE ──────────────────────────────────────────────────────────────
const F = "'Inter','Helvetica Neue',Arial,sans-serif";

// ─── NOISE/GRAIN OVERLAY ─────────────────────────────────────────────────────
const Grain: React.FC<{ frame: number; strength?: number }> = ({ frame, strength = 0.06 }) => (
  <>
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="gf">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3"
            seed={frame % 32} result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feBlend in="SourceGraphic" in2="g" mode="soft-light" />
        </filter>
      </defs>
    </svg>
    <AbsoluteFill style={{ filter: 'url(#gf)', opacity: strength, background: '#fff', pointerEvents: 'none' }} />
  </>
);

// ─── VIGNETTE ────────────────────────────────────────────────────────────────
const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(ellipse 65% 75% at 50% 50%, transparent 20%, rgba(0,0,0,${strength}) 100%)`,
    pointerEvents: 'none',
  }} />
);

// ─── WHITE FLASH ─────────────────────────────────────────────────────────────
const Flash: React.FC<{ frame: number; duration?: number }> = ({ frame, duration = 8 }) => {
  const op = interpolate(frame, [0, duration], [1, 0], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: 'white', opacity: op, pointerEvents: 'none' }} />;
};

// ─── CAMERA SHAKE ────────────────────────────────────────────────────────────
function shake(frame: number): number {
  const offsets = [0, 7, -6, 9, -5, 3, -2, 0];
  return frame < 8 ? (offsets[frame] ?? 0) : 0;
}

// ─── TEXT ENTRY ANIM ─────────────────────────────────────────────────────────
function textEntry(frame: number, delay = 0) {
  const f = Math.max(0, frame - delay);
  const sc = spring({ fps: 30, frame: f, config: { damping: 16, stiffness: 220, mass: 0.6 } });
  return {
    opacity: interpolate(sc, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(sc, [0, 1], [50, 0])}px)`,
  };
}

// ─── SCENE 0 & 1: HOOK – REJECTION EMAILS ────────────────────────────────────
const EmailParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const emails = Array.from({ length: 22 }, (_, i) => {
    const speed = 0.25 + (i % 5) * 0.08;
    const x = (i * 141.7 + i * i * 3.1) % 98;
    const rawY = ((frame * speed + i * 19.3) % 115) - 5;
    const opacity = 0.15 + Math.abs(Math.sin(frame * 0.04 + i * 1.1)) * 0.4;
    const rot = frame * (i % 2 === 0 ? 0.4 : -0.3) + i * 22;
    const scale = 0.4 + (i % 4) * 0.2;
    return { x, y: rawY, opacity, rot, scale };
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {emails.map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${e.x}%`, top: `${e.y}%`,
          transform: `rotate(${e.rot}deg) scale(${e.scale})`,
          opacity: e.opacity,
          fontSize: 32, color: '#4477FF',
          textShadow: '0 0 10px rgba(68,119,255,0.6)',
          userSelect: 'none',
        }}>✉</div>
      ))}
    </AbsoluteFill>
  );
};

// ─── SCENE 2: REJECTED SCREEN ────────────────────────────────────────────────
const RejectionScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker = Math.sin(frame * 0.3) > 0.7 ? 0.85 : 1;
  const sc = spring({ fps: 30, frame, config: { damping: 18, stiffness: 180 } });
  return (
    <AbsoluteFill style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '80%', background: 'rgba(10,5,5,0.92)',
        border: '2px solid rgba(255,50,50,0.4)',
        borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 0 60px rgba(255,0,0,0.25), inset 0 0 40px rgba(0,0,0,0.8)',
        transform: `scale(${interpolate(sc, [0,1], [0.7, 1])})`,
        opacity: interpolate(sc, [0,1], [0, 1]) * flicker,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(255,30,30,0.15)',
          border: '2px solid rgba(255,50,50,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, color: '#FF3333',
          marginBottom: 20, boxShadow: '0 0 20px rgba(255,0,0,0.4)',
        }}>✕</div>
        <div style={{
          color: 'rgba(255,255,255,0.5)', fontSize: 14, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: 10,
        }}>LinkedIn · Il y a 2 heures</div>
        <div style={{
          color: '#FF4444', fontSize: 26, fontWeight: 700, lineHeight: 1.3,
        }}>Candidature non retenue</div>
        <div style={{
          color: 'rgba(255,255,255,0.45)', fontSize: 16, marginTop: 12,
        }}>Merci de votre intérêt pour ce poste. Nous avons décidé de poursuivre avec d'autres profils...</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 & 4: STAT – 75% CROWD ───────────────────────────────────────────
const CrowdStat: React.FC<{ frame: number; sceneFrame: number }> = ({ frame, sceneFrame }) => {
  const sc75 = spring({ fps: 30, frame: sceneFrame, config: { damping: 14, stiffness: 160 } });
  const numVal = Math.round(interpolate(sc75, [0, 1], [0, 75]));

  const silhouettes = Array.from({ length: 40 }, (_, i) => {
    const isGray = i < 30;
    const row = Math.floor(i / 8);
    const col = i % 8;
    const delay = (row + col) * 2;
    const appear = spring({ fps: 30, frame: Math.max(0, sceneFrame - delay), config: { damping: 20, stiffness: 200 } });
    return { isGray, x: 5 + col * 12, y: 52 + row * 18, opacity: isGray ? 0.25 : 1, appear };
  });

  return (
    <AbsoluteFill>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -60%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: F, fontSize: 160, fontWeight: 900, color: '#FF2222',
          textShadow: '0 0 80px rgba(255,0,0,0.5), 0 0 160px rgba(255,0,0,0.2)',
          letterSpacing: '-0.05em', lineHeight: 0.85,
          opacity: interpolate(sc75, [0, 1], [0, 1]),
          transform: `scale(${interpolate(sc75, [0, 1], [0.4, 1])})`,
        }}>
          {numVal}%
        </div>
        <div style={{
          fontFamily: F, fontSize: 30, fontWeight: 700,
          color: 'rgba(255,150,150,0.9)', letterSpacing: '0.06em',
          textTransform: 'uppercase', marginTop: 12,
          ...textEntry(sceneFrame, 8),
        }}>des candidats éliminés</div>
      </div>

      <AbsoluteFill style={{ top: '65%', overflow: 'hidden' }}>
        {silhouettes.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            transform: `scale(${interpolate(s.appear, [0,1], [0,1])})`,
            opacity: s.opacity * interpolate(s.appear, [0,1], [0,1]),
            fontSize: 28,
            filter: s.isGray ? 'grayscale(1) brightness(0.3)' : 'none',
            textShadow: s.isGray ? 'none' : '0 0 8px rgba(255,255,255,0.5)',
          }}>
            {s.isGray ? '👤' : '✦'}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 6-9: VILLAIN – ATS ROBOT ──────────────────────────────────────────
const ATSVillain: React.FC<{ frame: number; sceneFrame: number }> = ({ frame, sceneFrame }) => {
  const scanY = (sceneFrame * 3.5) % 100;
  const eyePulse = 0.7 + Math.sin(sceneFrame * 0.15) * 0.3;

  return (
    <AbsoluteFill>
      {/* Grid lines background */}
      <AbsoluteFill style={{ opacity: 0.08 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${i * 5}%`, height: 1,
            background: 'rgba(255,50,50,0.5)',
          }} />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${i * 10}%`, width: 1,
            background: 'rgba(255,50,50,0.5)',
          }} />
        ))}
      </AbsoluteFill>

      {/* Robot eyes */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', gap: 40, alignItems: 'center',
      }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `rgba(255,20,20,${eyePulse * 0.15})`,
            border: `3px solid rgba(255,40,40,${eyePulse * 0.8})`,
            boxShadow: `0 0 30px rgba(255,0,0,${eyePulse * 0.7}), 0 0 60px rgba(255,0,0,${eyePulse * 0.3})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: `rgba(255,60,60,${eyePulse})`,
              boxShadow: `0 0 15px rgba(255,0,0,${eyePulse})`,
            }} />
          </div>
        ))}
      </div>

      {/* Scanner beam sweeping down */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: `${scanY}%`, height: 4,
        background: 'linear-gradient(90deg, transparent, rgba(255,30,30,0.8) 40%, rgba(255,80,80,1) 50%, rgba(255,30,30,0.8) 60%, transparent)',
        boxShadow: '0 0 20px rgba(255,0,0,0.6), 0 0 40px rgba(255,0,0,0.3)',
        pointerEvents: 'none',
      }} />

      {/* Status labels */}
      <div style={{
        position: 'absolute', top: '62%', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
      }}>
        {['SCANNING...', 'KEYWORDS: 0/10', 'ATS SCORE: 12%'].map((label, i) => (
          <div key={i} style={{
            fontFamily: F, fontSize: 18, fontWeight: 700,
            color: i === 0 ? '#FF4444' : 'rgba(255,100,100,0.7)',
            letterSpacing: '0.15em',
            opacity: interpolate(Math.max(0, sceneFrame - i * 6), [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 10-11: HIRESCAN REVEAL ────────────────────────────────────────────
const HireScanReveal: React.FC<{ frame: number; sceneFrame: number }> = ({ frame, sceneFrame }) => {
  const sc = spring({ fps: 30, frame: sceneFrame, config: { damping: 12, stiffness: 140 } });
  const rings = [100, 200, 300, 400];
  const ringPulse = 0.4 + Math.sin(sceneFrame * 0.08) * 0.3;

  return (
    <AbsoluteFill>
      {/* Pulsing rings */}
      {rings.map((r, i) => {
        const delay = i * 6;
        const rsc = spring({ fps: 30, frame: Math.max(0, sceneFrame - delay), config: { damping: 18, stiffness: 120 } });
        return (
          <div key={i} style={{
            position: 'absolute', top: '42%', left: '50%',
            width: r, height: r,
            transform: `translate(-50%, -50%) scale(${interpolate(rsc, [0,1], [0.2, 1])})`,
            borderRadius: '50%',
            border: `2px solid rgba(80,180,255,${ringPulse * (1 - i * 0.2) * interpolate(rsc,[0,1],[0,1])})`,
            boxShadow: `0 0 20px rgba(80,180,255,${0.2 * ringPulse})`,
          }} />
        );
      })}

      {/* Logo text */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        transform: `translate(-50%, -50%) scale(${interpolate(sc, [0,1], [0.5, 1])})`,
        opacity: interpolate(sc, [0,1], [0, 1]),
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: F, fontSize: 72, fontWeight: 900, letterSpacing: '0.08em',
          color: '#FFFFFF',
          textShadow: '0 0 60px rgba(80,180,255,0.9), 0 0 120px rgba(80,180,255,0.4)',
        }}>HIRESCAN</div>
        <div style={{
          fontFamily: F, fontSize: 22, fontWeight: 600, letterSpacing: '0.25em',
          color: 'rgba(150,220,255,0.8)', textTransform: 'uppercase', marginTop: 8,
        }}>La solution.</div>
      </div>

      {/* Tech lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
        {Array.from({ length: 8 }, (_, i) => {
          const y = 200 + i * 80;
          const w = interpolate(sceneFrame, [i * 3, i * 3 + 20], [0, 1080], { extrapolateRight: 'clamp' });
          return <line key={i} x1="0" y1={y} x2={w} y2={y} stroke="rgba(80,180,255,0.6)" strokeWidth="1" />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ─── SCENE 12-13: CV SCAN DEMO ────────────────────────────────────────────────
const CVScanDemo: React.FC<{ frame: number; sceneFrame: number }> = ({ frame, sceneFrame }) => {
  const scanLine = (sceneFrame * 4) % 100;
  const keywords = ['React', 'TypeScript', 'Node.js', 'Leadership', 'Agile', 'SQL'];
  const keywordHighlight = Math.floor(sceneFrame / 8) % keywords.length;

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* CV document */}
      <div style={{
        width: '72%', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(100,210,255,0.25)',
        borderRadius: 12, padding: 32,
        boxShadow: '0 0 40px rgba(0,130,200,0.2)',
        position: 'relative', overflow: 'hidden',
        ...spring({ fps:30, frame:sceneFrame, config:{damping:18,stiffness:160} }) && {},
      }}>
        {/* Scanning beam */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: `${scanLine}%`, height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(96,216,255,0.9) 30%, rgba(150,240,255,1) 50%, rgba(96,216,255,0.9) 70%, transparent)',
          boxShadow: '0 0 15px rgba(96,216,255,0.8)',
          pointerEvents: 'none',
        }} />

        {/* CV lines */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 20, width: '60%', background: 'rgba(255,255,255,0.3)', borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 12, width: '40%', background: 'rgba(255,255,255,0.15)', borderRadius: 4 }} />
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 16 }} />

        {/* Keywords */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {keywords.map((kw, i) => (
            <div key={i} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 14, fontFamily: F, fontWeight: 600,
              background: i === keywordHighlight ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${i === keywordHighlight ? 'rgba(255,215,0,0.6)' : 'rgba(255,255,255,0.12)'}`,
              color: i === keywordHighlight ? '#FFD700' : 'rgba(255,255,255,0.5)',
              boxShadow: i === keywordHighlight ? '0 0 15px rgba(255,215,0,0.3)' : 'none',
              transition: 'all 0.1s',
            }}>{kw}</div>
          ))}
        </div>

        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            height: 10, width: `${55 + i * 8}%`,
            background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginTop: 12,
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 14-15: SCORE TRANSFORM ────────────────────────────────────────────
const ScoreTransform: React.FC<{ sceneFrame: number; isGreen: boolean }> = ({ sceneFrame, isGreen }) => {
  const sc = spring({ fps: 30, frame: sceneFrame, config: { damping: 10, stiffness: 180, mass: 0.8 } });
  const num = isGreen ? 91 : 34;
  const color = isGreen ? '#00FF88' : '#FF2222';
  const label = isGreen ? '→ ENTRETIEN ✓' : '→ REJETÉ';
  const labelColor = isGreen ? '#88FFBB' : '#FF8888';

  // Arc SVG for score circle
  const radius = 140;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (num / 100) * interpolate(sc, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Arc */}
        <svg width={320} height={320} style={{ position: 'absolute' }}>
          <circle cx={160} cy={160} r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
          <circle cx={160} cy={160} r={radius} fill="none"
            stroke={color} strokeWidth={12}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 160 160)"
            style={{ filter: `drop-shadow(0 0 12px ${color})` }}
          />
        </svg>
        {/* Number */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: `scale(${interpolate(sc, [0,1], [0.5, 1])})`,
          opacity: interpolate(sc, [0,1], [0, 1]),
        }}>
          <div style={{
            fontFamily: F, fontSize: 110, fontWeight: 900, color, lineHeight: 0.9,
            letterSpacing: '-0.05em',
            textShadow: `0 0 80px ${color}80`,
          }}>{Math.round(interpolate(sc, [0,1], [0, num]))}%</div>
          <div style={{
            fontFamily: F, fontSize: 28, fontWeight: 800, color: labelColor,
            letterSpacing: '0.1em', marginTop: 16,
          }}>{label}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 16-17: SOCIAL PROOF ───────────────────────────────────────────────
const SocialProof: React.FC<{ sceneFrame: number }> = ({ sceneFrame }) => {
  const testimonials = [
    { name: 'Marie L.', text: 'Entretien en 3 jours !', stars: 5 },
    { name: 'Thomas R.', text: 'Mon score est passé à 94%', stars: 5 },
    { name: 'Sara M.', text: 'Enfin un outil qui marche', stars: 5 },
  ];
  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 50px',
    }}>
      {testimonials.map((t, i) => {
        const sc = spring({ fps: 30, frame: Math.max(0, sceneFrame - i * 10),
          config: { damping: 18, stiffness: 200 } });
        return (
          <div key={i} style={{
            width: '100%', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16, padding: '20px 24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transform: `translateX(${interpolate(sc, [0,1], [-80, 0])}px)`,
            opacity: interpolate(sc, [0,1], [0, 1]),
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: '#FFF' }}>{t.name}</div>
              <div style={{ fontSize: 14, color: '#FFD700', letterSpacing: '0.05em' }}>
                {'★'.repeat(t.stars)}
              </div>
            </div>
            <div style={{ fontFamily: F, fontSize: 18, color: 'rgba(200,220,255,0.85)', marginTop: 8 }}>
              "{t.text}"
            </div>
          </div>
        );
      })}
      <div style={{
        fontFamily: F, fontSize: 22, fontWeight: 700,
        color: 'rgba(180,200,255,0.7)', textAlign: 'center',
        ...textEntry(sceneFrame, 25),
      }}>
        +12 000 utilisateurs · Note 4.9/5
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 18-20: CTA ─────────────────────────────────────────────────────────
const CTAScene: React.FC<{ sceneFrame: number; index: number }> = ({ sceneFrame, index }) => {
  const pulse = 0.8 + Math.sin(sceneFrame * 0.12) * 0.2;
  const sc = spring({ fps: 30, frame: sceneFrame, config: { damping: 14, stiffness: 160 } });

  const texts = [
    { main: "C'est GRATUIT.", sub: "C'est IMMÉDIAT." },
    { main: 'Et ça change tout.', sub: '' },
    { main: 'hirescan.online', sub: '↑ Essaie maintenant ↑' },
  ];
  const t = texts[Math.min(index, texts.length - 1)];
  const isURL = index >= 2;

  // Particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 137.5) % 100,
    y: 100 - ((sceneFrame * (0.4 + i * 0.03) + i * 23) % 110),
    opacity: 0.1 + Math.abs(Math.sin(sceneFrame * 0.06 + i)) * 0.4,
    size: 2 + (i % 4) * 2,
    color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#00FFCC' : '#60D8FF',
  }));

  return (
    <AbsoluteFill>
      {/* Floating particles */}
      <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color, opacity: p.opacity,
            boxShadow: `0 0 6px ${p.color}`,
          }} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 50px',
      }}>
        <div style={{
          transform: `scale(${interpolate(sc, [0,1], [0.6, 1])})`,
          opacity: interpolate(sc, [0,1], [0, 1]),
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: F, fontSize: isURL ? 56 : 64, fontWeight: 900,
            color: isURL ? '#00FFCC' : '#FFD700',
            textShadow: isURL
              ? `0 0 50px rgba(0,255,200,${pulse * 0.7}), 0 0 100px rgba(0,255,200,${pulse * 0.3})`
              : `0 0 50px rgba(255,215,0,${pulse * 0.7}), 0 0 100px rgba(255,215,0,${pulse * 0.3})`,
            letterSpacing: isURL ? '0.04em' : '0.01em',
            lineHeight: 1.1,
          }}>{t.main}</div>

          {t.sub && (
            <div style={{
              fontFamily: F, fontSize: 32, fontWeight: 700,
              color: isURL ? 'rgba(0,255,200,0.7)' : 'rgba(255,215,0,0.7)',
              letterSpacing: '0.06em', marginTop: 16,
              ...textEntry(sceneFrame, 10),
            }}>{t.sub}</div>
          )}
        </div>

        {/* CTA Button */}
        {isURL && (
          <div style={{
            marginTop: 48,
            background: `rgba(0,255,200,${pulse * 0.15})`,
            border: `2px solid rgba(0,255,200,${pulse * 0.7})`,
            borderRadius: 100, padding: '18px 48px',
            boxShadow: `0 0 30px rgba(0,255,200,${pulse * 0.4})`,
            ...textEntry(sceneFrame, 15),
          }}>
            <span style={{
              fontFamily: F, fontSize: 26, fontWeight: 800,
              color: '#00FFCC', letterSpacing: '0.08em',
            }}>COMMENCER GRATUITEMENT</span>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE CONFIG ─────────────────────────────────────────────────────────────
type SceneType = 'hook_a' | 'hook_b' | 'rejection' | 'stat' | 'stat_sub' |
  'villain_a' | 'villain_b' | 'villain_c' | 'villain_d' |
  'reveal' | 'reveal_b' | 'demo_a' | 'demo_b' |
  'score_red' | 'score_green' | 'social_a' | 'social_b' |
  'cta_a' | 'cta_b' | 'cta_c';

interface SceneDef {
  type: SceneType;
  bg: string;
  text?: string;
  subText?: string;
  textColor?: string;
  textSize?: number;
  flash?: boolean;
  shake?: boolean;
}

const SCENES: SceneDef[] = [
  // HOOK
  { type:'hook_a',   bg:'linear-gradient(160deg,#030610 0%,#0a1228 60%,#050b18 100%)',  text:'Tu envoies des CV...', textColor:C.white, textSize:58 },
  { type:'hook_b',   bg:'linear-gradient(160deg,#030610 0%,#0a1228 60%,#050b18 100%)',  text:'...et personne ne répond.', textColor:C.white, textSize:56 },
  { type:'rejection',bg:'linear-gradient(160deg,#150000 0%,#300000 60%,#180000 100%)',  flash:true, shake:true },
  // STAT
  { type:'stat',     bg:'linear-gradient(160deg,#180000 0%,#380000 60%,#1c0000 100%)' },
  { type:'stat_sub', bg:'linear-gradient(160deg,#180000 0%,#380000 60%,#1c0000 100%)',  text:"avant qu'un humain te lise.", textColor:'#FF7777', textSize:50 },
  // VILLAIN
  { type:'villain_a',bg:'linear-gradient(160deg,#0d0000 0%,#250000 60%,#100000 100%)',  text:'Les robots ATS...', textColor:C.redBright, textSize:58 },
  { type:'villain_b',bg:'linear-gradient(160deg,#0d0000 0%,#250000 60%,#100000 100%)',  text:'décident de ton avenir.', textColor:C.redBright, textSize:52 },
  { type:'villain_c',bg:'linear-gradient(160deg,#0d0000 0%,#250000 60%,#100000 100%)',  text:'Sans même te voir.', textColor:'#FF5555', textSize:54, shake:true },
  { type:'villain_d',bg:'linear-gradient(160deg,#0d0000 0%,#250000 60%,#100000 100%)',  text:'Ils cherchent des mots-clés.', textColor:'rgba(255,80,80,0.85)', textSize:46 },
  // REVEAL
  { type:'reveal',   bg:'linear-gradient(160deg,#000d1a 0%,#001e38 60%,#000f22 100%)',  flash:true },
  { type:'reveal_b', bg:'linear-gradient(160deg,#000d1a 0%,#001e38 60%,#000f22 100%)' },
  // DEMO
  { type:'demo_a',   bg:'linear-gradient(160deg,#000810 0%,#001528 60%,#000b18 100%)' },
  { type:'demo_b',   bg:'linear-gradient(160deg,#000810 0%,#001528 60%,#000b18 100%)',  text:'Détecte ce qui te fait rejeter.', textColor:C.electric, textSize:46 },
  // SCORE
  { type:'score_red',  bg:'linear-gradient(160deg,#180000 0%,#350000 60%,#1c0000 100%)', flash:false },
  { type:'score_green',bg:'linear-gradient(160deg,#001200 0%,#003000 60%,#001500 100%)', flash:true },
  // SOCIAL
  { type:'social_a', bg:'linear-gradient(160deg,#040810 0%,#0b1528 60%,#060c18 100%)',  text:'Des milliers l\'ont utilisé', textColor:C.white, textSize:48 },
  { type:'social_b', bg:'linear-gradient(160deg,#040810 0%,#0b1528 60%,#060c18 100%)' },
  // CTA
  { type:'cta_a',    bg:'linear-gradient(160deg,#120c00 0%,#2a1e00 60%,#160e00 100%)' },
  { type:'cta_b',    bg:'linear-gradient(160deg,#000d18 0%,#001c30 60%,#000f1e 100%)' },
  { type:'cta_c',    bg:'linear-gradient(160deg,#000d18 0%,#001c30 60%,#000f1e 100%)' },
];

// ─── SCENE RENDERER ───────────────────────────────────────────────────────────
const SceneRenderer: React.FC<{ def: SceneDef; localFrame: number; globalFrame: number }> = ({ def, localFrame, globalFrame }) => {
  const shakeX = def.shake ? shake(localFrame) : 0;
  const entryAnim = def.text ? textEntry(localFrame) : {};

  return (
    <AbsoluteFill style={{ transform: `translateX(${shakeX}px)` }}>
      {/* Base gradient BG */}
      <AbsoluteFill style={{ background: def.bg }} />

      {/* Scene-specific content */}
      {(def.type === 'hook_a' || def.type === 'hook_b') && (
        <EmailParticles frame={globalFrame} />
      )}
      {def.type === 'rejection' && <RejectionScreen frame={globalFrame} />}
      {(def.type === 'stat' || def.type === 'stat_sub') && (
        <CrowdStat frame={globalFrame} sceneFrame={localFrame} />
      )}
      {(['villain_a','villain_b','villain_c','villain_d'] as SceneType[]).includes(def.type) && (
        <ATSVillain frame={globalFrame} sceneFrame={localFrame} />
      )}
      {(def.type === 'reveal' || def.type === 'reveal_b') && (
        <HireScanReveal frame={globalFrame} sceneFrame={localFrame} />
      )}
      {(def.type === 'demo_a' || def.type === 'demo_b') && (
        <CVScanDemo frame={globalFrame} sceneFrame={localFrame} />
      )}
      {def.type === 'score_red' && <ScoreTransform sceneFrame={localFrame} isGreen={false} />}
      {def.type === 'score_green' && <ScoreTransform sceneFrame={localFrame} isGreen={true} />}
      {(def.type === 'social_a' || def.type === 'social_b') && (
        <SocialProof sceneFrame={localFrame} />
      )}
      {def.type === 'cta_a' && <CTAScene sceneFrame={localFrame} index={0} />}
      {def.type === 'cta_b' && <CTAScene sceneFrame={localFrame} index={1} />}
      {def.type === 'cta_c' && <CTAScene sceneFrame={localFrame} index={2} />}

      <Vignette />
      <Grain frame={globalFrame} />

      {/* Text overlay for simple text scenes */}
      {def.text && (
        <AbsoluteFill style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: 160, paddingLeft: 44, paddingRight: 44,
          ...entryAnim,
        }}>
          <p style={{
            margin: 0, fontFamily: F,
            fontSize: def.textSize ?? 54, fontWeight: 800,
            color: def.textColor ?? C.white,
            textShadow: '0 2px 24px rgba(0,0,0,0.9)',
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.02em',
          }}>{def.text}</p>
          {def.subText && (
            <p style={{
              margin: '14px 0 0 0', fontFamily: F, fontSize: 32, fontWeight: 600,
              color: 'rgba(255,255,255,0.65)', textAlign: 'center',
            }}>{def.subText}</p>
          )}
        </AbsoluteFill>
      )}

      {/* Flash on entry */}
      {def.flash && <Flash frame={localFrame} />}
    </AbsoluteFill>
  );
};

// ─── WATERMARK ───────────────────────────────────────────────────────────────
const Watermark: React.FC = () => (
  <div style={{
    position: 'absolute', top: 52, left: 0, right: 0,
    display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    zIndex: 100,
  }}>
    <span style={{
      fontFamily: F, fontSize: 19, fontWeight: 700, letterSpacing: '0.18em',
      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
    }}>HireScan AI</span>
  </div>
);

// ─── ROOT COMPOSITION ────────────────────────────────────────────────────────
export const HireScanAdV2: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneIndex = Math.min(Math.floor(frame / SD), SCENES.length - 1);
  const localFrame = frame - sceneIndex * SD;
  const currentScene = SCENES[sceneIndex];

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: F }}>
      <Audio src={staticFile('voice.mp3')} volume={1} />

      <SceneRenderer
        def={currentScene}
        localFrame={localFrame}
        globalFrame={frame}
      />

      <Watermark />

      {/* Bottom safe zone */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
