import React from 'react';
import {
  AbsoluteFill, Audio, interpolate, spring,
  Sequence, useCurrentFrame, useVideoConfig, staticFile,
} from 'remotion';

export const HIRESCAN_V4_FRAMES = 1860; // 62s @ 30fps

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────────
const BG    = '#0B0A11';
const BG2   = '#050408';
const IND   = '#4F46E5';
const CYN   = '#06B6D4';
const GRN   = '#00FF88';
const RED   = '#FF3333';
const WHT   = 'rgba(255,255,255,0.95)';
const DIM   = 'rgba(255,255,255,0.45)';
const GLASS = 'rgba(255,255,255,0.05)';
const GBDR  = 'rgba(255,255,255,0.09)';
const F     = "'Inter','Helvetica Neue',Arial,sans-serif";
const FPS   = 30;

// ─── SPRING FACTORIES ─────────────────────────────────────────────────────────
const sp = (frame: number, d = 14, k = 200, m = 0.9) =>
  spring({ fps: FPS, frame, config: { damping: d, stiffness: k, mass: m } });

const spd = (f: number, delay: number, d = 14, k = 200, m = 0.9) =>
  sp(Math.max(0, f - delay), d, k, m);

// Bounce: overshoots (low damping) giving 0.8 → 1.05 → 1 feel
const bounce = (f: number, delay = 0) =>
  spring({ fps: FPS, frame: Math.max(0, f - delay), config: { damping: 7, stiffness: 420, mass: 0.55 } });

// Slide-spring: enters from Y offset
const slideY = (f: number, fromY: number, delay = 0, d = 14, k = 180) => {
  const s = spd(f, delay, d, k);
  return {
    transform: `translateY(${interpolate(s, [0, 1], [fromY, 0])}px)`,
    opacity: interpolate(s, [0, 1], [0, 1]),
  };
};

// Scene fade-in/out using local frame
const sceneFade = (lf: number, dur: number, fadeIn = 14, fadeOut = 14) => {
  const inOp  = interpolate(lf, [0, fadeIn],          [0, 1], { extrapolateRight: 'clamp' });
  const outOp = interpolate(lf, [dur - fadeOut, dur], [1, 0], { extrapolateLeft:  'clamp' });
  return Math.min(inOp, outOp);
};

// ─── GLOBAL BG (persistent across all scenes) ────────────────────────────────────────────
const PersistentBg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, ${BG} 0%, ${BG2} 100%)` }}>
    {/* Dot grid */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
      <defs>
        <pattern id="dpg" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill={IND} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dpg)" />
    </svg>
    {/* Ambient top-center glow */}
    <div style={{
      position: 'absolute', width: 700, height: 700, borderRadius: '50%',
      background: `radial-gradient(circle, rgba(79,70,229,0.13) 0%, transparent 68%)`,
      top: '-15%', left: '50%', transform: 'translateX(-50%)',
      filter: 'blur(50px)',
    }} />
  </AbsoluteFill>
);

// ─── GLASS CARD ────────────────────────────────────────────────────────────────────
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: string;
}> = ({ children, style, glow }) => (
  <div style={{
    background: GLASS,
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: `1px solid ${GBDR}`,
    borderRadius: 22,
    boxShadow: glow ? `0 0 40px ${glow}22, inset 0 1px 0 rgba(255,255,255,0.06)` : 'inset 0 1px 0 rgba(255,255,255,0.06)',
    ...style,
  }}>
    {children}
  </div>
);

// ─── SCENE 1: THE DROP ────────────────────────────────────────────────────────────────
const SceneDrop: React.FC = () => {
  const lf = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;
  const dur = 160;
  const op = sceneFade(lf, dur);

  const cardS = sp(lf, 12, 160, 1.0);
  const cardY = interpolate(cardS, [0, 1], [120, 0]);
  const cardScale = interpolate(bounce(lf), [0, 1], [0.82, 1]);

  const badges = [
    { color: '#0077B5', icon: '💼', name: 'LinkedIn',       tx: 10, ty: 20, delay: 18, rot: -9,  sc: 1.1 },
    { color: '#1E3A8A', icon: '🔍', name: 'Indeed',         tx: 68, ty: 14, delay: 30, rot: 7,   sc: 0.95 },
    { color: '#7C3AED', icon: '👔', name: 'Welcome',        tx: 63, ty: 58, delay: 44, rot: -6,  sc: 0.9 },
    { color: '#DC2626', icon: '🐉', name: 'Monster',        tx: 5,  ty: 56, delay: 22, rot: 12,  sc: 0.85 },
    { color: '#059669', icon: '🏛️', name: 'France Travail', tx: 35, ty: 74, delay: 37, rot: -4,  sc: 0.88 },
  ];

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{
        position: 'absolute', top: '32%', left: '50%',
        transform: `translate(-50%, -50%) translateY(${cardY}px) scale(${cardScale})`,
        opacity: interpolate(cardS, [0, 1], [0, 1]),
        width: '74%', zIndex: 2,
      }}>
        <GlassCard style={{ padding: '32px 26px', textAlign: 'center', position: 'relative' }} glow={IND}>
          <div style={{
            position: 'absolute', inset: 10, borderRadius: 14,
            border: '2px dashed rgba(79,70,229,0.35)', pointerEvents: 'none',
          }} />
          <div style={{ fontSize: 52, marginBottom: 10 }}>📄</div>
          <div style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: WHT, marginBottom: 6 }}>
            Dépose ton CV ici
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: DIM, lineHeight: 1.5 }}>
            PDF · Word · Image — Analyse IA en 30 secondes
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 18, background: `linear-gradient(135deg,${IND},${CYN})`,
            borderRadius: 100, padding: '10px 24px',
            boxShadow: `0 6px 22px ${IND}55`,
          }}>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: 'white' }}>
              Choisir un fichier →
            </span>
          </div>
        </GlassCard>
      </div>

      {badges.map((b, i) => {
        const f = Math.max(0, lf - b.delay);
        const dropS = spring({ fps: FPS, frame: f, config: { damping: 10, stiffness: 280, mass: 1.15 } });
        const sc = interpolate(bounce(lf, b.delay), [0, 1], [0.5, 1]) * b.sc;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${b.tx}%`,
            top: `calc(${b.ty}% + ${interpolate(dropS, [0, 1], [-240, 0])}px)`,
            transform: `scale(${sc}) rotate(${b.rot}deg)`,
            opacity: interpolate(dropS, [0, 1], [0, 1]),
            zIndex: 3,
          }}>
            <div style={{
              width: 78, height: 78, borderRadius: 18,
              background: b.color,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 14px 36px ${b.color}60, 0 0 0 1px rgba(255,255,255,0.12)`,
            }}>
              <div style={{ fontSize: 28 }}>{b.icon}</div>
              <div style={{ fontSize: 7.5, fontWeight: 800, color: 'white', letterSpacing: '0.05em', marginTop: 3 }}>
                {b.name.toUpperCase()}
              </div>
            </div>
          </div>
        );
      })}

      <div style={{
        position: 'absolute', bottom: '14%', left: 0, right: 0,
        padding: '0 40px', textAlign: 'center',
        ...slideY(lf, 70, 40),
      }}>
        <div style={{ fontFamily: F, fontSize: 48, fontWeight: 900, color: WHT, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          Ton CV survit
        </div>
        <div style={{
          fontFamily: F, fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em',
          background: `linear-gradient(135deg,${IND},${CYN})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          6 secondes.
        </div>
        <div style={{ fontFamily: F, fontSize: 19, color: DIM, marginTop: 10 }}>
          Sur des centaines de candidatures.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2: THE REALITY ─────────────────────────────────────────────────────────────
const SceneReality: React.FC = () => {
  const lf = useCurrentFrame();
  const dur = 160;
  const op = sceneFade(lf, dur);

  const gaugeS = sp(lf, 8, 300, 0.6);
  const gaugeScale = interpolate(gaugeS, [0, 1], [0.4, 1]);
  const gaugeOp   = interpolate(gaugeS, [0, 1], [0, 1]);

  const targetPct = 75;
  const pct = Math.round(interpolate(sp(lf, 10, 120), [0, 1], [0, targetPct]));
  const radius = 128;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (pct / 100);
  const glow = 0.55 + Math.sin(lf * 0.14) * 0.38;
  const scanY = (lf * 5.5) % 110;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 20%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: `${scanY}%`, height: 3,
        background: `linear-gradient(90deg, transparent, rgba(255,30,30,0.55) 25%, rgba(255,80,80,0.95) 50%, rgba(255,30,30,0.55) 75%, transparent)`,
        boxShadow: '0 0 18px rgba(255,0,0,0.55)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: `translate(-50%,-50%) scale(${gaugeScale})`,
        opacity: gaugeOp,
      }}>
        <div style={{ position: 'relative', width: 300, height: 300 }}>
          <div style={{
            position: 'absolute', inset: -20, borderRadius: '50%',
            border: `1px solid rgba(255,50,50,${glow * 0.25})`,
            boxShadow: `0 0 60px rgba(255,30,30,${glow * 0.15})`,
          }} />
          <svg width={300} height={300}>
            <circle cx={150} cy={150} r={radius} fill="none"
              stroke="rgba(255,50,50,0.1)" strokeWidth={16} />
            <circle cx={150} cy={150} r={radius} fill="none"
              stroke={RED} strokeWidth={16}
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 150 150)"
              style={{ filter: `drop-shadow(0 0 18px rgba(255,50,50,${glow}))` }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontFamily: F, fontSize: 80, fontWeight: 900, color: RED, lineHeight: 0.85,
              textShadow: `0 0 50px rgba(255,50,50,${glow * 0.9})`,
            }}>{pct}%</div>
            <div style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: 'rgba(255,100,100,0.75)', letterSpacing: '0.15em', marginTop: 4 }}>
              REJETÉS
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: '16%', left: 0, right: 0,
        padding: '0 40px', textAlign: 'center',
        ...slideY(lf, 70, 50),
      }}>
        <div style={{ fontFamily: F, fontSize: 40, fontWeight: 900, color: WHT, lineHeight: 1.2 }}>
          des candidats éliminés
        </div>
        <div style={{
          fontFamily: F, fontSize: 40, fontWeight: 900, lineHeight: 1.2,
          background: `linear-gradient(135deg,${RED},#FF8800)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>par des robots ATS.</div>
        <div style={{ fontFamily: F, fontSize: 18, color: DIM, marginTop: 12 }}>
          Avant qu'un humain te lise.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3: DASHBOARD REVEAL ────────────────────────────────────────────────────────────────
const SidebarRow: React.FC<{
  icon: string; label: string; active?: boolean; lf: number; delay: number;
}> = ({ icon, label, active, lf, delay }) => {
  const s = spd(lf, delay, 14, 200, 0.8);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 12, marginBottom: 5,
      background: active ? 'linear-gradient(135deg,rgba(79,70,229,0.22),rgba(6,182,212,0.12))' : 'transparent',
      border: active ? `1px solid rgba(79,70,229,0.32)` : '1px solid transparent',
      transform: `translateX(${interpolate(s, [0, 1], [-50, 0])}px)`,
      opacity: interpolate(s, [0, 1], [0, 1]),
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{
        fontFamily: F, fontSize: 12.5,
        fontWeight: active ? 700 : 500,
        color: active ? '#A5B4FC' : 'rgba(255,255,255,0.42)',
      }}>{label}</span>
    </div>
  );
};

const SceneDashboard: React.FC = () => {
  const lf = useCurrentFrame();
  const dur = 460;
  const op = sceneFade(lf, dur);

  const dashS = sp(lf, 12, 155, 1.1);
  const dashY = interpolate(dashS, [0, 1], [180, 0]);
  const dashScale = interpolate(bounce(lf), [0, 1], [0.86, 1]);
  const dashOp = interpolate(dashS, [0, 1], [0, 1]);

  const scanProg = interpolate(lf, [70, 220], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scanMsgs = ['Extraction du texte...', 'Analyse sémantique IA...', 'Calcul du score ATS...'];
  const msgIdx = Math.min(Math.floor(lf / 75), scanMsgs.length - 1);

  const showScore = lf > 230;
  const scoreS = sp(Math.max(0, lf - 230), 9, 175, 0.9);
  const score = Math.round(interpolate(scoreS, [0, 1], [34, 92]));
  const scoreColor = score > 70 ? GRN : score > 50 ? '#FFB800' : RED;
  const cR = 58;
  const cCirc = 2 * Math.PI * cR;
  const cDash = cCirc * (score / 100);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{
        position: 'absolute', inset: '4%',
        transform: `translateY(${dashY}px) scale(${dashScale})`,
        opacity: dashOp,
        display: 'flex', gap: 10,
      }}>
        <GlassCard style={{ width: '21%', flexShrink: 0, padding: '18px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 26, padding: '0 4px' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: `linear-gradient(135deg,${IND},${CYN})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: 'white', fontWeight: 900,
            }}>H</div>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: WHT }}>HireScan</span>
          </div>
          <SidebarRow icon="📊" label="Dashboard"     active lf={lf} delay={12} />
          <SidebarRow icon="📄" label="Mon CV"                lf={lf} delay={22} />
          <SidebarRow icon="🎯" label="Analyses"             lf={lf} delay={32} />
          <SidebarRow icon="🔑" label="Mots-clés"            lf={lf} delay={42} />
          <SidebarRow icon="⭐" label="Améliorations"        lf={lf} delay={52} />
          <SidebarRow icon="⚙️" label="Paramètres"           lf={lf} delay={62} />
        </GlassCard>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <GlassCard style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: WHT }}>Analyse de CV</div>
                <div style={{ fontFamily: F, fontSize: 12, color: DIM }}>Rapport IA · Score ATS instantané</div>
              </div>
              <div style={{
                marginLeft: 'auto', fontFamily: F, fontSize: 11, fontWeight: 700,
                background: 'rgba(79,70,229,0.18)', color: '#A5B4FC',
                border: '1px solid rgba(79,70,229,0.35)',
                borderRadius: 100, padding: '5px 14px',
              }}>⚡ IA Active</div>
            </div>
          </GlassCard>
          <GlassCard style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'linear-gradient(135deg,rgba(79,70,229,0.3),rgba(6,182,212,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, border: '1px solid rgba(79,70,229,0.3)',
              }}>📄</div>
              <div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: WHT }}>Mon_CV_2024.pdf</div>
                <div style={{ fontFamily: F, fontSize: 12, color: DIM }}>247 KB · 2 pages</div>
              </div>
              <div style={{
                marginLeft: 'auto', fontFamily: F, fontSize: 11, fontWeight: 700,
                background: `rgba(0,255,136,0.12)`, color: GRN,
                border: `1px solid rgba(0,255,136,0.3)`,
                borderRadius: 100, padding: '4px 12px',
              }}>✓ Reçu</div>
            </div>
          </GlassCard>
          <GlassCard style={{ flex: 1, padding: '18px 20px' }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: F, fontSize: 12.5, color: '#A5B4FC', fontWeight: 600 }}>{scanMsgs[msgIdx]}</span>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: CYN }}>{Math.round(scanProg * 100)}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 100, height: 7, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 100,
                  width: `${scanProg * 100}%`,
                  background: `linear-gradient(90deg,${IND},${CYN})`,
                  boxShadow: `0 0 14px rgba(79,70,229,0.7)`,
                }} />
              </div>
            </div>
            {showScore && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                transform: `scale(${interpolate(scoreS, [0, 1], [0.8, 1])})`,
                opacity: interpolate(scoreS, [0, 1], [0, 1]),
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <svg width={134} height={134}>
                    <circle cx={67} cy={67} r={cR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={13} />
                    <circle cx={67} cy={67} r={cR} fill="none"
                      stroke={scoreColor} strokeWidth={13}
                      strokeDasharray={`${cDash} ${cCirc}`}
                      strokeLinecap="round" transform="rotate(-90 67 67)"
                      style={{ filter: `drop-shadow(0 0 12px ${scoreColor}80)` }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontFamily: F, fontSize: 36, fontWeight: 900, color: scoreColor, lineHeight: 0.9 }}>{score}</div>
                    <div style={{ fontFamily: F, fontSize: 11, color: DIM, fontWeight: 600 }}>/100</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F, fontSize: 24, fontWeight: 900, color: scoreColor, marginBottom: 6 }}>
                    {score > 70 ? '✓ Excellent !' : score > 50 ? '⚠ Moyen' : '✕ Faible'}
                  </div>
                  <div style={{ fontFamily: F, fontSize: 13, color: DIM, lineHeight: 1.55 }}>
                    {score > 70 ? 'Ton CV passe tous les filtres ATS.' : 'Des mots-clés importants manquent.'}
                  </div>
                  <div style={{ marginTop: 10, fontFamily: F, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ color: RED }}>34%</span>{' → '}
                    <span style={{ color: GRN, fontWeight: 900 }}>{score}%</span>{' après optimisation'}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4: KEYWORDS ─────────────────────────────────────────────────────────────────────
const SceneKeywords: React.FC = () => {
  const lf = useCurrentFrame();
  const dur = 610;
  const op = sceneFade(lf, dur);
  const headS = sp(lf, 14, 175, 0.95);
  const keywords = [
    { kw: 'React',             delay: 30 },
    { kw: 'Node.js',           delay: 68 },
    { kw: 'Growth Marketing',  delay: 108 },
    { kw: 'SQL',               delay: 148 },
    { kw: 'Agile / Scrum',     delay: 185 },
    { kw: 'Data Analysis',     delay: 222 },
    { kw: 'TypeScript',        delay: 260 },
    { kw: 'Leadership',        delay: 298 },
    { kw: 'KPI Tracking',      delay: 335 },
    { kw: 'Figma',             delay: 372 },
  ];
  const showSummary = lf > 420;
  const summaryS = sp(Math.max(0, lf - 420), 14, 180, 0.9);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: 'absolute', inset: '5%', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          marginBottom: 28,
          transform: `translateY(${interpolate(headS, [0, 1], [-70, 0])}px)`,
          opacity: interpolate(headS, [0, 1], [0, 1]),
        }}>
          <div style={{ fontFamily: F, fontSize: 56, fontWeight: 900, color: WHT, lineHeight: 1, letterSpacing: '-0.03em' }}>Mots-clés</div>
          <div style={{
            fontFamily: F, fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg,${IND},${CYN})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>manquants → ajoutés.</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, flex: 1 }}>
          {keywords.map(({ kw, delay }, i) => {
            const isActive = lf > delay;
            const chipS = spring({ fps: FPS, frame: Math.max(0, lf - delay), config: { damping: 7, stiffness: 380, mass: 0.6 } });
            const chipScale = interpolate(chipS, [0, 1], [0.7, 1]);
            const chipOp = interpolate(sp(Math.max(0, lf - delay + 4), 14, 200), [0, 1], [0, 1]);
            const checkS = spring({ fps: FPS, frame: Math.max(0, lf - delay - 18), config: { damping: 9, stiffness: 420, mass: 0.5 } });
            const showCheck = lf > delay + 18;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', borderRadius: 100,
                background: isActive ? `rgba(0,255,136,0.09)` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isActive ? `rgba(0,255,136,0.48)` : GBDR}`,
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                transform: `scale(${chipScale})`, opacity: chipOp,
                boxShadow: isActive ? `0 0 22px rgba(0,255,136,0.18)` : 'none',
              }}>
                {showCheck && (
                  <span style={{
                    fontSize: 13, color: GRN,
                    transform: `scale(${interpolate(checkS, [0, 1], [0.3, 1])})`,
                    display: 'inline-block',
                  }}>✓</span>
                )}
                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: isActive ? GRN : 'rgba(255,255,255,0.5)' }}>{kw}</span>
              </div>
            );
          })}
        </div>
        {showSummary && (
          <div style={{
            marginTop: 18,
            transform: `translateY(${interpolate(summaryS, [0, 1], [50, 0])}px)`,
            opacity: interpolate(summaryS, [0, 1], [0, 1]),
          }}>
            <GlassCard style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 16 }} glow={GRN}>
              <div style={{ fontSize: 26 }}>📈</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: WHT }}>
                  Score amélioré de{' '}<span style={{ color: GRN }}>+58 points</span>
                </div>
                <div style={{ fontFamily: F, fontSize: 12.5, color: DIM, marginTop: 2 }}>34% → 92% · Prêt pour les candidatures</div>
              </div>
              <div style={{ fontFamily: F, fontSize: 28, fontWeight: 900, color: GRN, textShadow: `0 0 20px ${GRN}60` }}>92%</div>
            </GlassCard>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── PHONE MOCKUP ────────────────────────────────────────────────────────────────────────────
const PhoneMockup: React.FC<{ lf: number; delay: number }> = ({ lf, delay }) => {
  const s = sp(Math.max(0, lf - delay), 12, 170, 1.1);
  const ty = interpolate(s, [0, 1], [340, 0]);
  const tx = interpolate(s, [0, 1], [80, 0]);
  const sc = interpolate(bounce(lf, delay), [0, 1], [0.75, 1]);
  const notifS = sp(Math.max(0, lf - delay - 44), 10, 250, 0.75);
  return (
    <div style={{
      position: 'absolute', right: '5%', bottom: '16%',
      transform: `translateY(${ty}px) translateX(${tx}px) scale(${sc})`,
      opacity: interpolate(s, [0, 1], [0, 1]),
    }}>
      <div style={{
        width: 196, borderRadius: 38, background: '#0a0a14',
        border: '2.5px solid rgba(255,255,255,0.13)',
        boxShadow: '0 34px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(79,70,229,0.15)',
        overflow: 'hidden', padding: 8,
      }}>
        <div style={{ background: 'linear-gradient(160deg,#0d0b22,#050310)', borderRadius: 30, padding: '22px 12px 18px', minHeight: 290 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginBottom: 18 }}>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>9:41</span>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>●●● 📶</span>
          </div>
          <div style={{
            transform: `scale(${interpolate(notifS, [0, 1], [0.82, 1])}) translateY(${interpolate(notifS, [0, 1], [-28, 0])}px)`,
            opacity: interpolate(notifS, [0, 1], [0, 1]),
          }}>
            <div style={{
              background: 'rgba(25,22,48,0.96)', backdropFilter: 'blur(20px)',
              borderRadius: 14, padding: '11px 12px',
              border: `1px solid rgba(79,70,229,0.45)`,
              boxShadow: '0 10px 36px rgba(79,70,229,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: `linear-gradient(135deg,${IND},${CYN})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'white', fontWeight: 900,
                }}>H</div>
                <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 800, color: WHT }}>HireScan</span>
                <span style={{ fontFamily: F, fontSize: 9, color: DIM, marginLeft: 'auto' }}>Maintenant</span>
              </div>
              <div style={{ fontFamily: F, fontSize: 11.5, fontWeight: 800, color: WHT, marginBottom: 2 }}>Nouvel entretien décroché ! 🎉</div>
              <div style={{ fontFamily: F, fontSize: 10.5, color: DIM }}>Score ATS 92% · Amazon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SCENE 5: CTA ────────────────────────────────────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const lf = useCurrentFrame();
  const dur = 510;
  const op = sceneFade(lf, dur);
  const pts = Array.from({ length: 22 }, (_, i) => ({
    x: (i * 177.3 + i * i * 3.7) % 95,
    y: 100 - ((lf * (0.28 + i * 0.018) + i * 29) % 112),
    o: 0.14 + Math.abs(Math.sin(lf * 0.04 + i)) * 0.38,
    sz: 2 + (i % 4),
    c: [IND, CYN, '#7C3AED', GRN][i % 4],
  }));
  const miniS = sp(lf, 14, 160, 1.0);
  const miniScale = interpolate(miniS, [0, 1], [0.4, 0.7]);
  const miniOp = interpolate(miniS, [0, 1], [0, 0.38]);
  const txtS = spd(lf, 28, 14, 175, 0.9);
  const ctaS = spd(lf, 60, 9, 195, 0.8);
  const pulse = 0.65 + Math.sin(lf * 0.11) * 0.32;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
        {pts.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.sz, height: p.sz, borderRadius: '50%',
            background: p.c, opacity: p.o, boxShadow: `0 0 6px ${p.c}`,
          }} />
        ))}
      </AbsoluteFill>
      <div style={{
        position: 'absolute', top: '6%', left: '50%',
        transform: `translateX(-50%) scale(${miniScale})`,
        opacity: miniOp, width: '80%', transformOrigin: 'center top',
      }}>
        <GlassCard style={{ padding: '11px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: `linear-gradient(135deg,${IND},${CYN})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: 'white', fontWeight: 900,
            }}>H</div>
            <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: WHT }}>HireScan · Score 92%</span>
            <div style={{ marginLeft: 'auto', width: 64, height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', background: `linear-gradient(90deg,${IND},${GRN})`, borderRadius: 100 }} />
            </div>
          </div>
        </GlassCard>
      </div>
      <PhoneMockup lf={lf} delay={18} />
      <div style={{
        position: 'absolute', bottom: '11%', left: 0, right: 0,
        padding: '0 40px', textAlign: 'center',
        transform: `translateY(${interpolate(txtS, [0, 1], [90, 0])}px)`,
        opacity: interpolate(txtS, [0, 1], [0, 1]),
      }}>
        <div style={{
          fontFamily: F, fontSize: 18, fontWeight: 700,
          color: 'rgba(255,255,255,0.36)', letterSpacing: '0.22em',
          textTransform: 'uppercase', marginBottom: 14,
        }}>✦ Essaie gratuitement</div>
        <div style={{
          fontFamily: F, fontSize: 62, fontWeight: 900, letterSpacing: '0.01em',
          color: '#00FFCC',
          textShadow: `0 0 70px rgba(0,255,200,${pulse * 0.85}), 0 0 140px rgba(0,255,200,${pulse * 0.3})`,
          transform: `scale(${interpolate(ctaS, [0, 1], [0.65, 1])})`,
          opacity: interpolate(ctaS, [0, 1], [0, 1]),
          marginBottom: 26,
        }}>hirescan.online</div>
        <div style={{
          display: 'inline-block',
          background: `rgba(0,255,200,${pulse * 0.11})`,
          border: `2px solid rgba(0,255,200,${pulse * 0.82})`,
          borderRadius: 100, padding: '17px 46px',
          boxShadow: `0 0 46px rgba(0,255,200,${pulse * 0.5})`,
          transform: `scale(${interpolate(ctaS, [0, 1], [0.75, 1])})`,
          opacity: interpolate(ctaS, [0, 1], [0, 1]),
        }}>
          <span style={{ fontFamily: F, fontSize: 19, fontWeight: 900, color: '#00FFCC', letterSpacing: '0.07em' }}>
            COMMENCER MAINTENANT →
          </span>
        </div>
        <div style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.36)', marginTop: 15 }}>
          Gratuit · Sans carte · Résultat en 30 secondes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── VIGNETTE + WATERMARK ───────────────────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(ellipse 72% 80% at 50% 50%, transparent 18%, rgba(0,0,0,0.52) 100%)',
    pointerEvents: 'none',
  }} />
);

const Watermark: React.FC = () => (
  <div style={{
    position: 'absolute', top: 46, left: 0, right: 0,
    display: 'flex', justifyContent: 'center', zIndex: 200, pointerEvents: 'none',
  }}>
    <span style={{
      fontFamily: F, fontSize: 13, fontWeight: 700,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: 'rgba(79,70,229,0.45)',
    }}>HireScan · AI</span>
  </div>
);

// ─── ROOT COMPOSITION ────────────────────────────────────────────────────────────────────────────
export const HireScanAdV4: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <PersistentBg />
    <Audio src={staticFile('beat.mp3')}     volume={0.18} />
    <Audio src={staticFile('voice_v4.mp3')} volume={1.0}  />
    <Sequence from={0}    durationInFrames={160}><SceneDrop /></Sequence>
    <Sequence from={150}  durationInFrames={160}><SceneReality /></Sequence>
    <Sequence from={300}  durationInFrames={460}><SceneDashboard /></Sequence>
    <Sequence from={750}  durationInFrames={610}><SceneKeywords /></Sequence>
    <Sequence from={1350} durationInFrames={510}><SceneCTA /></Sequence>
    <Vignette />
    <Watermark />
  </AbsoluteFill>
);
