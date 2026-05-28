import React from 'react';
import {
  AbsoluteFill, Audio, interpolate, spring,
  Sequence, useCurrentFrame, staticFile,
} from 'remotion';

export const HIRESCAN_V5_FRAMES = 1350; // 45s @ 30fps

const FPS = 30;
const F   = "'Inter','SF Pro Display','Helvetica Neue',Arial,sans-serif";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const WHITE  = '#FFFFFF';
const OFFWHITE = '#F5F5F7';
const DARK   = '#0A0A0F';
const IND    = '#4F46E5';
const IND2   = '#7C3AED';
const CYN    = '#06B6D4';
const GRN    = '#10B981';
const RED    = '#EF4444';
const YLW    = '#F59E0B';
const GRAD   = `linear-gradient(135deg, ${IND} 0%, ${IND2} 100%)`;
const GRADG  = `linear-gradient(135deg, ${GRN} 0%, ${CYN} 100%)`;

// ─── SPRING HELPERS ──────────────────────────────────────────────────────────
const sp = (f: number, d = 16, k = 220, m = 0.8) =>
  spring({ fps: FPS, frame: f, config: { damping: d, stiffness: k, mass: m } });

const spd = (f: number, delay: number, d = 16, k = 220, m = 0.8) =>
  sp(Math.max(0, f - delay), d, k, m);

const bounce = (f: number, delay = 0) =>
  spring({ fps: FPS, frame: Math.max(0, f - delay), config: { damping: 6, stiffness: 380, mass: 0.5 } });

const slideY = (f: number, fromY: number, delay = 0, d = 16, k = 200) => {
  const s = spd(f, delay, d, k);
  return {
    transform: `translateY(${interpolate(s, [0, 1], [fromY, 0])}px)`,
    opacity: interpolate(s, [0, 1], [0, 1]),
  };
};

const slideX = (f: number, fromX: number, delay = 0, d = 16, k = 200) => {
  const s = spd(f, delay, d, k);
  return {
    transform: `translateX(${interpolate(s, [0, 1], [fromX, 0])}px)`,
    opacity: interpolate(s, [0, 1], [0, 1]),
  };
};

const scaleIn = (f: number, delay = 0) => {
  const s = bounce(f, delay);
  return {
    transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`,
    opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
  };
};

// ─── SCENE 1: HOOK ──────────────────────────────────────────────────────────
const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 150;

  const flashOp = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const l1 = slideY(f, 60, 0);
  const l2 = slideY(f, 60, 12);
  const l3s = bounce(f, 28);
  const l3 = {
    transform: `scale(${interpolate(l3s, [0, 1], [0.6, 1])}) translateY(${interpolate(l3s, [0, 1], [80, 0])}px)`,
    opacity: interpolate(l3s, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' }),
  };
  const exitY = interpolate(f, [dur - 18, dur], [0, -120], { extrapolateLeft: 'clamp' });
  const exitOp = interpolate(f, [dur - 18, dur], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ background: WHITE, opacity: flashOp }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
        <defs>
          <pattern id="grid1" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid1)" />
      </svg>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: interpolate(f, [2, 12], [0, 6], { extrapolateRight: 'clamp' }),
        background: GRAD,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transform: `translateY(${exitY}px)`,
        opacity: exitOp,
        padding: '0 60px',
      }}>
        <div style={{
          ...scaleIn(f, 5),
          background: `${IND}12`,
          border: `2px solid ${IND}30`,
          borderRadius: 100,
          padding: '10px 28px',
          marginBottom: 44,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: IND }} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: IND, letterSpacing: 2 }}>
            RÉALITÉ
          </span>
        </div>
        <div style={{ ...l1, width: '100%', textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 88, color: DARK, lineHeight: 1.05, margin: 0, letterSpacing: -3 }}>
            Tu postules.
          </p>
        </div>
        <div style={{ ...l2, width: '100%', textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 88, color: DARK, lineHeight: 1.05, margin: 0, marginTop: 8, letterSpacing: -3 }}>
            Depuis des mois.
          </p>
        </div>
        <div style={{ marginTop: 40, ...l3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 160, color: RED, margin: 0, lineHeight: 1, letterSpacing: -6 }}>
            Rien.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2: PROBLEM ────────────────────────────────────────────────────────
const SceneProblem: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 210;
  const exitOp = interpolate(f, [dur - 16, dur], [1, 0], { extrapolateLeft: 'clamp' });
  const exitY  = interpolate(f, [dur - 16, dur], [0, -80], { extrapolateLeft: 'clamp' });
  const countProgress = interpolate(f, [10, 55], [0, 1], { extrapolateRight: 'clamp' });
  const count = Math.round(countProgress * 75);
  const l0 = slideY(f, 80, 0);
  const l1 = slideY(f, 60, 18);
  const l2 = slideY(f, 50, 34);

  return (
    <AbsoluteFill style={{ background: OFFWHITE }}>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
        top: -100, right: -100,
        ...scaleIn(f, 5),
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 60px',
        transform: `translateY(${exitY}px)`,
        opacity: exitOp,
      }}>
        <div style={{ ...l0, textAlign: 'center' }}>
          <span style={{ fontFamily: F, fontWeight: 900, fontSize: 240, lineHeight: 1, color: RED, letterSpacing: -10, display: 'block' }}>
            {count}%
          </span>
        </div>
        <div style={{ ...l1, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontWeight: 800, fontSize: 64, color: DARK, margin: 0, letterSpacing: -2, lineHeight: 1.1 }}>
            des CVs sont rejetés
          </p>
        </div>
        <div style={{ ...l2, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontWeight: 800, fontSize: 64, color: DARK, margin: 0, marginTop: 4, letterSpacing: -2, lineHeight: 1.1 }}>
            avant d'être lus.
          </p>
        </div>
        <div style={{ ...slideY(f, 40, 52), marginTop: 40 }}>
          <div style={{ background: `${RED}15`, border: `2px solid ${RED}40`, borderRadius: 12, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🤖</span>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 34, color: RED, letterSpacing: 1 }}>Filtrés par les ATS</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── PHONE MOCKUP ────────────────────────────────────────────────────────────
const PhoneScreen: React.FC<{ children: React.ReactNode; tiltY?: number; tiltX?: number; scale?: number }> = ({
  children, tiltY = 0, tiltX = 0, scale = 1
}) => (
  <div style={{ width: 340, height: 640, perspective: 1200 }}>
    <div style={{
      width: '100%', height: '100%',
      transform: `rotateY(${tiltY}deg) rotateX(${tiltX}deg) scale(${scale})`,
      transformStyle: 'preserve-3d',
      background: DARK, borderRadius: 42, overflow: 'hidden',
      boxShadow: '0 40px 100px rgba(0,0,0,0.35), 0 8px 30px rgba(79,70,229,0.25), inset 0 0 0 1.5px rgba(255,255,255,0.12)',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 100, height: 26, background: '#000', borderRadius: 16, zIndex: 10 }} />
      <div style={{ padding: '52px 0 0', height: '100%', overflow: 'hidden' }}>{children}</div>
    </div>
  </div>
);

const HireScanAppUI: React.FC<{ localFrame: number; score?: number }> = ({ localFrame: f, score = 42 }) => {
  const scoreAnim = interpolate(f, [20, 70], [0, score], { extrapolateRight: 'clamp' });
  const displayScore = Math.round(scoreAnim);
  const scoreColor = displayScore < 50 ? RED : displayScore < 70 ? YLW : GRN;

  return (
    <div style={{ background: DARK, height: '100%', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: WHITE }}>
          HireScan<span style={{ color: IND }}>·AI</span>
        </span>
        <div style={{ background: `${IND}30`, borderRadius: 8, padding: '4px 10px' }}>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: IND }}>Premium</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', border: `6px solid ${scoreColor}40`, background: `${scoreColor}12`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${scoreColor}40` }}>
          <span style={{ fontFamily: F, fontWeight: 900, fontSize: 38, color: scoreColor, lineHeight: 1 }}>{displayScore}</span>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>/100</span>
        </div>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Score ATS</span>
      </div>
      {[{ label: 'Mots-clés manquants', val: '8', color: RED }, { label: 'Format non optimisé', val: '⚠', color: YLW }, { label: 'Expérience trop courte', val: '3', color: YLW }].map((item, i) => {
        const vis = interpolate(f, [40 + i * 14, 55 + i * 14], [0, 1], { extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{ opacity: vis, transform: `translateX(${interpolate(vis, [0, 1], [30, 0])}px)`, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `3px solid ${item.color}` }}>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{item.label}</span>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: item.color }}>{item.val}</span>
          </div>
        );
      })}
      <div style={{ opacity: interpolate(f, [80, 95], [0, 1], { extrapolateRight: 'clamp' }), marginTop: 6, background: GRAD, borderRadius: 14, padding: '14px', textAlign: 'center', boxShadow: `0 8px 24px ${IND}50` }}>
        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: WHITE }}>Corriger maintenant →</span>
      </div>
    </div>
  );
};

// ─── SCENE 3: DASHBOARD ──────────────────────────────────────────────────────
const SceneDashboard: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 420;
  const exitOp = interpolate(f, [dur - 18, dur], [1, 0], { extrapolateLeft: 'clamp' });
  const phoneS = spd(f, 8, 14, 180);
  const phoneY  = interpolate(phoneS, [0, 1], [300, 0]);
  const phoneX  = interpolate(phoneS, [0, 1], [200, 0]);
  const phoneRot = interpolate(phoneS, [0, 1], [20, -8]);
  const badge1 = spd(f, 30, 12, 160);
  const badge2 = spd(f, 50, 12, 160);
  const badge3 = spd(f, 70, 12, 160);
  const t1 = slideX(f, -80, 12);
  const t2 = slideX(f, -80, 26);
  const t3 = slideX(f, -80, 40);

  return (
    <AbsoluteFill style={{ background: WHITE, opacity: exitOp }}>
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${IND}08 0%, transparent 70%)`, top: '10%', right: '-15%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', top: 130, left: 0, right: 0, padding: '0 60px' }}>
        <div style={t1}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GRADG, borderRadius: 100, padding: '8px 22px', marginBottom: 20 }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: WHITE }}>✦ LA SOLUTION</span>
          </div>
        </div>
        <div style={t2}>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 80, color: DARK, lineHeight: 1.0, margin: 0, letterSpacing: -3 }}>Analyse</p>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 80, color: DARK, lineHeight: 1.0, margin: 0, letterSpacing: -3 }}>instantanée.</p>
        </div>
        <div style={{ ...t3, marginTop: 20 }}>
          <p style={{ fontFamily: F, fontWeight: 500, fontSize: 38, color: 'rgba(10,10,15,0.55)', margin: 0, lineHeight: 1.3 }}>Score ATS · Mots-clés · Corrections</p>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 28, bottom: 120, transform: `translateY(${phoneY}px) translateX(${phoneX}px) rotate(${phoneRot}deg)`, filter: 'drop-shadow(0 30px 60px rgba(79,70,229,0.3))' }}>
        <PhoneScreen tiltY={-12} tiltX={4} scale={0.95}>
          <HireScanAppUI localFrame={f - 20} score={42} />
        </PhoneScreen>
      </div>
      {[
        { icon: '📄', label: '10s', sub: 'Analyse', x: 50, y: 520, delay: badge1 },
        { icon: '🎯', label: '2×', sub: 'Entretiens', x: 60, y: 720, delay: badge2 },
        { icon: '🏆', label: '94%', sub: 'Précision', x: 55, y: 920, delay: badge3 },
      ].map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, transform: `scale(${interpolate(b.delay, [0, 1], [0.5, 1])})`, opacity: interpolate(b.delay, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }), background: WHITE, borderRadius: 18, padding: '16px 22px', boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', gap: 14, border: '1.5px solid rgba(79,70,229,0.12)', minWidth: 170 }}>
          <span style={{ fontSize: 32 }}>{b.icon}</span>
          <div>
            <p style={{ fontFamily: F, fontWeight: 900, fontSize: 30, color: DARK, margin: 0 }}>{b.label}</p>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: 18, color: 'rgba(10,10,15,0.45)', margin: 0 }}>{b.sub}</p>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ─── SCENE 4: KEYWORDS ───────────────────────────────────────────────────────
const SceneKeywords: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 390;
  const exitOp = interpolate(f, [dur - 16, dur], [1, 0], { extrapolateLeft: 'clamp' });
  const headline = slideY(f, -60, 0);
  const sub      = slideY(f, 50, 18);
  const keywords = [
    { word: 'React', found: true, delay: 14 }, { word: 'TypeScript', found: true, delay: 22 },
    { word: 'Node.js', found: false, delay: 30 }, { word: 'Agile', found: false, delay: 38 },
    { word: 'AWS', found: false, delay: 46 }, { word: 'Python', found: true, delay: 54 },
    { word: 'Docker', found: false, delay: 62 }, { word: 'CI/CD', found: false, delay: 70 },
    { word: 'SQL', found: true, delay: 78 }, { word: 'Leadership', found: false, delay: 86 },
    { word: 'Scrum', found: false, delay: 94 }, { word: 'MongoDB', found: true, delay: 102 },
  ];
  const beforeScore = 42;
  const afterProgress = interpolate(f, [120, 190], [0, 1], { extrapolateRight: 'clamp' });
  const afterScore = Math.round(42 + afterProgress * 43);
  const afterColor = afterScore > 70 ? GRN : YLW;

  return (
    <AbsoluteFill style={{ background: OFFWHITE, opacity: exitOp }}>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${GRN}10 0%, transparent 70%)`, bottom: -200, left: -200, filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', inset: 0, padding: '100px 60px 60px' }}>
        <div style={headline}>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 72, color: DARK, lineHeight: 1.05, margin: 0, letterSpacing: -2.5 }}>Les mots-clés</p>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 72, color: IND, lineHeight: 1.05, margin: '0 0 12px', letterSpacing: -2.5 }}>qui changent tout.</p>
        </div>
        <div style={sub}>
          <p style={{ fontFamily: F, fontWeight: 500, fontSize: 34, color: 'rgba(10,10,15,0.5)', margin: '0 0 36px' }}>Ce que l'ATS cherche — et trouve — dans ton CV</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 40 }}>
          {keywords.map((kw, i) => {
            const s = bounce(f, kw.delay);
            return (
              <div key={i} style={{ transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`, opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }), background: kw.found ? `${GRN}18` : `${RED}12`, border: `2px solid ${kw.found ? GRN : RED}50`, borderRadius: 12, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{kw.found ? '✓' : '✗'}</span>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: kw.found ? GRN : RED }}>{kw.word}</span>
              </div>
            );
          })}
        </div>
        <div style={{ ...slideY(f, 60, 110), display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ flex: 1, background: WHITE, borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `2px solid ${RED}30` }}>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: 20, color: 'rgba(10,10,15,0.5)', margin: '0 0 6px' }}>Avant</p>
            <p style={{ fontFamily: F, fontWeight: 900, fontSize: 64, color: RED, margin: 0, lineHeight: 1 }}>{beforeScore}</p>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: 20, color: RED, margin: 0 }}>/100</p>
          </div>
          <div style={{ ...scaleIn(f, 125), fontSize: 48 }}>→</div>
          <div style={{ flex: 1, background: WHITE, borderRadius: 20, padding: '20px 24px', boxShadow: `0 4px 20px rgba(0,0,0,0.08), 0 0 0 2px ${afterColor}50`, border: `2px solid ${afterColor}50` }}>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: 20, color: 'rgba(10,10,15,0.5)', margin: '0 0 6px' }}>Après</p>
            <p style={{ fontFamily: F, fontWeight: 900, fontSize: 64, color: afterColor, margin: 0, lineHeight: 1 }}>{afterScore}</p>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: 20, color: afterColor, margin: 0 }}>/100</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5: CTA ────────────────────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 330;
  const pulse = Math.sin((f / FPS) * Math.PI * 2) * 0.5 + 0.5;
  const l1 = slideY(f, 80, 0);
  const l2 = slideY(f, 60, 16);
  const btn = scaleIn(f, 38);
  const urlAnim = slideY(f, 40, 60);
  const badge1 = spd(f, 80, 12, 160);
  const badge2 = spd(f, 95, 12, 160);
  const exitOp = interpolate(f, [dur - 20, dur], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ background: WHITE, opacity: exitOp }}>
      <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${IND}12 0%, transparent 70%)`, top: '20%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(80px)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
        <defs>
          <pattern id="dotsCta" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill={IND} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotsCta)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 70px' }}>
        <div style={{ ...scaleIn(f, 5), fontSize: 100, marginBottom: 24, lineHeight: 1 }}>🚀</div>
        <div style={{ ...l1, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 92, color: DARK, lineHeight: 1.0, margin: 0, letterSpacing: -4 }}>Ton prochain</p>
        </div>
        <div style={{ ...l2, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontWeight: 900, fontSize: 92, background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.0, margin: '0 0 48px', letterSpacing: -4 }}>entretien t'attend.</p>
        </div>
        <div style={{ ...btn, background: GRAD, borderRadius: 28, padding: '30px 80px', boxShadow: `0 16px 60px rgba(79,70,229,${0.45 + pulse * 0.15}), 0 0 0 ${pulse * 4}px rgba(79,70,229,0.15)`, cursor: 'pointer', width: '100%', textAlign: 'center' }}>
          <span style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: WHITE, letterSpacing: -1 }}>Scanner mon CV →</span>
        </div>
        <div style={{ ...urlAnim, marginTop: 28 }}>
          <p style={{ fontFamily: F, fontWeight: 700, fontSize: 40, color: IND, letterSpacing: -0.5, margin: 0, textDecoration: 'underline', textDecorationColor: `${IND}40` }}>hirescan.online</p>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 36 }}>
          {[{ icon: '🆓', text: 'Gratuit', delay: badge1 }, { icon: '⚡', text: 'Instantané', delay: badge2 }].map((b, i) => (
            <div key={i} style={{ transform: `scale(${interpolate(b.delay, [0, 1], [0.5, 1])}) translateY(${interpolate(b.delay, [0, 1], [30, 0])}px)`, opacity: interpolate(b.delay, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }), background: WHITE, border: `1.5px solid ${IND}25`, borderRadius: 16, padding: '14px 30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{b.icon}</span>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: DARK }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ROOT COMPOSITION ────────────────────────────────────────────────────────
export const HireScanAdV5: React.FC = () => {
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: WHITE }} />
      <Sequence from={0}    durationInFrames={160}><SceneHook /></Sequence>
      <Sequence from={140}  durationInFrames={220}><SceneProblem /></Sequence>
      <Sequence from={350}  durationInFrames={430}><SceneDashboard /></Sequence>
      <Sequence from={760}  durationInFrames={400}><SceneKeywords /></Sequence>
      <Sequence from={1140} durationInFrames={210}><SceneCTA /></Sequence>
      <Audio src={staticFile('beat.mp3')}    volume={0.14} />
      <Audio src={staticFile('voice_v5.mp3')} volume={1.0} startFrom={0} />
    </AbsoluteFill>
  );
};
