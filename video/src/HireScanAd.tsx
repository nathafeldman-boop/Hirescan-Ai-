import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FPS = 30;

// ── Scenes ───────────────────────────────────────────────────────────────────
// Total: ~42 s = 1260 frames
const SC = {
  hook:   { start: 0,    dur: 60  }, // 0–2 s   : email rejection
  stat:   { start: 60,   dur: 90  }, // 2–5 s   : 75% stat
  bot:    { start: 150,  dur: 150 }, // 5–10 s  : ATS villain
  reveal: { start: 300,  dur: 90  }, // 10–13 s : HireScan solution
  demo1:  { start: 390,  dur: 120 }, // 13–17 s : upload + scan
  demo2:  { start: 510,  dur: 180 }, // 17–23 s : 34→91% score
  proof:  { start: 690,  dur: 240 }, // 23–31 s : social proof + urgency
  cta:    { start: 930,  dur: 180 }, // 31–37 s : CTA
};

export const HIRESCAN_AD_FRAMES = 1110;

// ── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:     '#0A0A1A',
  indigo: '#818CF8',
  violet: '#7C3AED',
  cyan:   '#06B6D4',
  yellow: '#FBBF24',
  red:    '#EF4444',
  green:  '#10B981',
  white:  '#F8FAFC',
  dark:   '#1E1B4B',
  gray:   '#64748B',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const sp = (frame: number, start: number, cfg = { damping: 70, stiffness: 180 }) =>
  spring({ frame: frame - start, fps: FPS, config: cfg });

const fade = (f: number, from: number, to: number) =>
  interpolate(f, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const fadeOut = (f: number, from: number, to: number) =>
  interpolate(f, [from, to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Glitch: random horizontal shift
const glitch = (f: number, intensity = 8) => {
  const seed = Math.sin(f * 127.1) * 43758.5;
  return (seed - Math.floor(seed)) * intensity * 2 - intensity;
};

// ── Shared: animated gradient bg ─────────────────────────────────────────────
const AnimBg: React.FC<{ frame: number; colors?: [string, string] }> = ({
  frame,
  colors = [C.dark, C.bg],
}) => {
  const shift = interpolate(frame % 120, [0, 60, 120], [0, 20, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse ${60 + shift}% ${50 + shift / 2}% at 50% 40%, ${colors[0]}, ${colors[1]})`,
      }}
    />
  );
};

// ── Shared: scan line effect ──────────────────────────────────────────────────
const ScanLine: React.FC<{ frame: number; color?: string }> = ({ frame, color = C.cyan }) => {
  const y = interpolate(frame % 60, [0, 60], [0, 100]);
  return (
    <div
      style={{
        position: 'absolute',
        top: `${y}%`,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${color}80, ${color}, ${color}80, transparent)`,
        boxShadow: `0 0 12px ${color}`,
        pointerEvents: 'none',
      }}
    />
  );
};

// ── Shared: impact text helper ────────────────────────────────────────────────
const ImpactText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  shadow?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 80, color = C.white, shadow = C.indigo, style }) => (
  <div
    style={{
      fontFamily: "'Arial Black', 'Impact', sans-serif",
      fontSize: size,
      fontWeight: 900,
      color,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: -1,
      textShadow: `0 0 30px ${shadow}, 0 4px 8px rgba(0,0,0,0.8)`,
      lineHeight: 1.1,
      ...style,
    }}
  >
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 – HOOK: email rejection (0–2 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneHook: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.hook.start;
  const opacity = lf < 55 ? 1 : fadeOut(lf, 55, 60);

  // Glitch on the email card
  const gx = lf > 20 && lf < 50 ? glitch(lf, 6) : 0;

  const emailIn = sp(lf, 0, { damping: 60, stiffness: 200 });
  const xIn = sp(lf, 15, { damping: 50, stiffness: 300 });
  const pourquoiIn = sp(lf, 30, { damping: 40, stiffness: 250 });

  return (
    <AbsoluteFill style={{ opacity }}>
      <AnimBg frame={lf} colors={['#1a0a2e', C.bg]} />

      {/* Email card */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div
          style={{
            transform: `translateX(${gx}px) scale(${interpolate(emailIn, [0, 1], [0.6, 1])})`,
            opacity: emailIn,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding: '32px 40px',
            width: '75%',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ color: C.gray, fontSize: 22, marginBottom: 8 }}>De: recruteur@corp.fr</div>
          <div
            style={{
              color: C.white,
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 16,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: 12,
            }}
          >
            Votre candidature
          </div>
          <div style={{ color: '#aaa', fontSize: 26, lineHeight: 1.5 }}>
            Nous avons bien reçu votre candidature. Après examen, nous n'avons pas retenu votre
            profil...
          </div>
        </div>

        {/* Big red X */}
        <div
          style={{
            fontSize: 140,
            opacity: xIn,
            transform: `scale(${interpolate(xIn, [0, 1], [2, 1])}) rotate(${interpolate(xIn, [0, 1], [-20, 0])}deg)`,
            color: C.red,
            filter: `drop-shadow(0 0 30px ${C.red})`,
            lineHeight: 1,
          }}
        >
          ✗
        </div>

        {/* POURQUOI? */}
        <div
          style={{
            transform: `scale(${interpolate(pourquoiIn, [0, 1], [0.5, 1])})`,
            opacity: pourquoiIn,
          }}
        >
          <ImpactText size={100} color={C.yellow} shadow={C.yellow}>
            POURQUOI ?
          </ImpactText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 – STAT: 75% of CVs eliminated by bots (2–5 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneStat: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.stat.start;
  const opacity = lf < 80 ? 1 : fadeOut(lf, 80, 90);

  const countIn = sp(lf, 0, { damping: 80, stiffness: 150 });
  const textIn = sp(lf, 20, { damping: 80, stiffness: 200 });
  const subIn = sp(lf, 35, { damping: 80, stiffness: 200 });

  // Animate counter 0 → 75
  const count = Math.round(interpolate(clamp01(lf / 40), [0, 1], [0, 75]));

  return (
    <AbsoluteFill style={{ opacity }}>
      <AnimBg frame={lf} colors={['#1a1200', '#0A0A1A']} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Big number */}
        <div
          style={{
            transform: `scale(${interpolate(countIn, [0, 1], [0.3, 1])})`,
            opacity: countIn,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontSize: 260,
              fontWeight: 900,
              color: C.yellow,
              lineHeight: 1,
              textShadow: `0 0 60px ${C.yellow}99, 0 0 120px ${C.yellow}44`,
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontSize: 120,
              fontWeight: 900,
              color: C.yellow,
              marginTop: 30,
              textShadow: `0 0 40px ${C.yellow}99`,
            }}
          >
            %
          </span>
        </div>

        <div
          style={{
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [30, 0])}px)`,
          }}
        >
          <ImpactText size={52} color={C.white} shadow={C.red}>
            des CVs éliminés
          </ImpactText>
          <ImpactText size={52} color={C.red} shadow={C.red}>
            avant qu'un humain
          </ImpactText>
          <ImpactText size={52} color={C.red} shadow={C.red}>
            ne te lise
          </ImpactText>
        </div>

        <div
          style={{
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [20, 0])}px)`,
            marginTop: 30,
            background: 'rgba(239,68,68,0.15)',
            border: `1px solid ${C.red}66`,
            borderRadius: 12,
            padding: '12px 30px',
          }}
        >
          <span style={{ color: C.gray, fontSize: 28 }}>Source: Jobscan 2024</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3 – ATS BOT: villain robot (5–10 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneBot: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.bot.start;
  const opacity = lf < 135 ? 1 : fadeOut(lf, 135, 150);

  const botIn = sp(lf, 0, { damping: 50, stiffness: 150 });
  const eyePulse = interpolate(Math.sin(lf * 0.2), [-1, 1], [0.6, 1]);
  const scanY = interpolate(lf % 60, [0, 60], [-40, 40]);

  const labelIn = sp(lf, 20, { damping: 80, stiffness: 200 });
  const xesIn = sp(lf, 40, { damping: 80, stiffness: 200 });

  // bot shakes when it finds problems
  const shake = lf > 60 ? glitch(lf, 3) : 0;

  return (
    <AbsoluteFill style={{ opacity }}>
      <AnimBg frame={lf} colors={['#1a0000', '#0A0A1A']} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30,
        }}
      >
        {/* Robot face */}
        <div
          style={{
            transform: `scale(${interpolate(botIn, [0, 1], [0, 1])}) translateX(${shake}px)`,
            opacity: botIn,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              background: 'linear-gradient(135deg, #1a1a2e, #0f0f23)',
              border: `3px solid ${C.red}`,
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              boxShadow: `0 0 40px ${C.red}66, inset 0 0 30px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Eyes */}
            <div style={{ display: 'flex', gap: 30, marginBottom: 20 }}>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: C.red,
                    opacity: eyePulse,
                    boxShadow: `0 0 20px ${C.red}`,
                  }}
                />
              ))}
            </div>
            {/* Mouth (scan bar) */}
            <div
              style={{
                width: 100,
                height: 12,
                background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
                borderRadius: 6,
                transform: `translateX(${scanY / 5}px)`,
              }}
            />
            {/* ATS label on bot */}
            <div
              style={{
                position: 'absolute',
                bottom: -18,
                background: C.red,
                color: C.white,
                fontSize: 18,
                fontWeight: 900,
                padding: '4px 14px',
                borderRadius: 6,
                letterSpacing: 3,
              }}
            >
              ATS BOT
            </div>
          </div>
        </div>

        {/* Label */}
        <div
          style={{
            opacity: labelIn,
            transform: `translateY(${interpolate(labelIn, [0, 1], [20, 0])}px)`,
            textAlign: 'center',
          }}
        >
          <ImpactText size={54} color={C.white}>
            Ce robot décide
          </ImpactText>
          <ImpactText size={54} color={C.red} shadow={C.red}>
            si ton CV existe
          </ImpactText>
        </div>

        {/* Red X bullets appearing */}
        <div
          style={{
            opacity: xesIn,
            transform: `translateY(${interpolate(xesIn, [0, 1], [30, 0])}px)`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '80%',
          }}
        >
          {['Mauvais format', 'Mots-clés absents', 'Mise en page complexe'].map((txt, i) => {
            const itemIn = clamp01((lf - 50 - i * 15) / 20);
            return (
              <div
                key={txt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: itemIn,
                  transform: `translateX(${interpolate(itemIn, [0, 1], [-40, 0])}px)`,
                  background: 'rgba(239,68,68,0.12)',
                  border: `1px solid ${C.red}44`,
                  borderRadius: 12,
                  padding: '14px 20px',
                }}
              >
                <span style={{ color: C.red, fontSize: 36, lineHeight: 1 }}>✗</span>
                <span style={{ color: C.white, fontSize: 30, fontWeight: 600 }}>{txt}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4 – REVEAL: HireScan solution (10–13 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneReveal: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.reveal.start;
  const opacity = lf < 80 ? 1 : fadeOut(lf, 80, 90);

  // Flash white at start
  const flash = interpolate(lf, [0, 8, 20], [1, 0, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoIn = sp(lf, 5, { damping: 60, stiffness: 180 });
  const tagIn = sp(lf, 25, { damping: 80, stiffness: 200 });
  const glowPulse = interpolate(Math.sin(lf * 0.15), [-1, 1], [0.6, 1]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Flash overlay */}
      <AbsoluteFill
        style={{ background: 'white', opacity: flash, zIndex: 100 }}
      />

      <AnimBg frame={lf} colors={['#1e1b4b', '#0A0A1A']} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            transform: `scale(${interpolate(logoIn, [0, 1], [0.3, 1])}) rotate(${interpolate(logoIn, [0, 1], [-15, 0])}deg)`,
            opacity: logoIn,
            background: `linear-gradient(135deg, ${C.violet}, ${C.indigo})`,
            borderRadius: 30,
            width: 180,
            height: 180,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 90,
            boxShadow: `0 0 60px ${C.indigo}${Math.round(glowPulse * 255).toString(16).padStart(2, '0')}`,
          }}
        >
          🔍
        </div>

        <div
          style={{
            opacity: logoIn,
            transform: `scale(${interpolate(logoIn, [0, 1], [0.7, 1])})`,
          }}
        >
          <ImpactText
            size={90}
            color="transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${C.indigo}, ${C.cyan})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 90,
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontWeight: 900,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: -1,
            } as React.CSSProperties}
          >
            HIRESCAN AI
          </ImpactText>
        </div>

        <div
          style={{
            opacity: tagIn,
            transform: `translateY(${interpolate(tagIn, [0, 1], [20, 0])}px)`,
            textAlign: 'center',
          }}
        >
          <ImpactText size={44} color={C.white}>
            La solution pour
          </ImpactText>
          <ImpactText size={44} color={C.cyan} shadow={C.cyan}>
            passer les bots ATS
          </ImpactText>
        </div>

        {/* Checkmarks */}
        {['Analyse ton CV', 'Optimise les mots-clés', 'Booste ton score'].map((txt, i) => {
          const itemIn = clamp01((lf - 35 - i * 10) / 15);
          return (
            <div
              key={txt}
              style={{
                opacity: itemIn,
                transform: `translateX(${interpolate(itemIn, [0, 1], [40, 0])}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span style={{ color: C.green, fontSize: 36 }}>✓</span>
              <span style={{ color: C.white, fontSize: 30, fontWeight: 600 }}>{txt}</span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 5 – DEMO 1: CV upload + laser scan (13–17 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneDemo1: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.demo1.start;
  const opacity = lf < 105 ? 1 : fadeOut(lf, 105, 120);

  const cardIn = sp(lf, 0, { damping: 70, stiffness: 200 });
  const scanY = interpolate(lf % 50, [0, 50], [0, 100]);
  const pulseOpacity = interpolate(Math.sin(lf * 0.3), [-1, 1], [0.3, 0.7]);

  const uploadIn = sp(lf, 10, { damping: 80, stiffness: 200 });
  const arrowBounce = interpolate(Math.sin(lf * 0.2), [-1, 1], [-5, 5]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AnimBg frame={lf} colors={['#0d1a2e', '#0A0A1A']} />
      <ScanLine frame={lf} color={C.indigo} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            opacity: uploadIn,
            transform: `translateY(${interpolate(uploadIn, [0, 1], [-20, 0])}px)`,
          }}
        >
          <ImpactText size={54} color={C.white}>
            Étape 1
          </ImpactText>
          <ImpactText size={48} color={C.cyan} shadow={C.cyan}>
            Upload ton CV
          </ImpactText>
        </div>

        {/* Fake CV document */}
        <div
          style={{
            transform: `scale(${interpolate(cardIn, [0, 1], [0.7, 1])})`,
            opacity: cardIn,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16,
            width: '72%',
            padding: '28px 28px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 40px ${C.indigo}66`,
          }}
        >
          {/* CV content mockup */}
          <div style={{ background: '#e2e8f0', height: 24, borderRadius: 4, marginBottom: 16 }} />
          <div style={{ background: '#94a3b8', height: 16, borderRadius: 4, width: '60%', marginBottom: 24 }} />
          {[100, 85, 90, 70, 80].map((w, i) => (
            <div
              key={i}
              style={{
                background: i % 2 === 0 ? '#cbd5e1' : '#e2e8f0',
                height: 10,
                borderRadius: 4,
                width: `${w}%`,
                marginBottom: 10,
              }}
            />
          ))}

          {/* Laser scan line */}
          <div
            style={{
              position: 'absolute',
              top: `${scanY}%`,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${C.cyan}, ${C.cyan}, transparent)`,
              boxShadow: `0 0 16px ${C.cyan}`,
              opacity: 0.9,
            }}
          />

          {/* Glow overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent 0%, ${C.cyan}11 ${scanY}%, transparent ${scanY + 20}%)`,
            }}
          />
        </div>

        {/* Upload arrow */}
        <div
          style={{
            opacity: uploadIn,
            transform: `translateY(${arrowBounce}px)`,
            fontSize: 60,
            color: C.indigo,
            filter: `drop-shadow(0 0 16px ${C.indigo})`,
          }}
        >
          ↑
        </div>

        <div style={{ opacity: pulseOpacity }}>
          <span style={{ color: C.gray, fontSize: 26 }}>Analyse en cours...</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 6 – DEMO 2: 34% → 91% transformation (17–23 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneDemo2: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.demo2.start;
  const opacity = lf < 165 ? 1 : fadeOut(lf, 165, 180);

  // Score counter animation: 34 → 91 over 100 frames
  const countProgress = clamp01((lf - 10) / 100);
  const eased = countProgress < 0.5
    ? 2 * countProgress * countProgress
    : 1 - Math.pow(-2 * countProgress + 2, 2) / 2;
  const score = Math.round(interpolate(eased, [0, 1], [34, 91]));
  const isHigh = score > 75;

  const beforeIn = sp(lf, 0, { damping: 80, stiffness: 200 });
  const afterIn = sp(lf, 30, { damping: 80, stiffness: 200 });

  const scoreColor = isHigh ? C.green : score > 55 ? C.yellow : C.red;
  const arrowPulse = interpolate(Math.sin(lf * 0.25), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AnimBg frame={lf} colors={['#051a0d', '#0A0A1A']} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <ImpactText size={52} color={C.white}>
          Résultat en direct
        </ImpactText>

        {/* Big score display */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.5)',
            border: `2px solid ${scoreColor}`,
            borderRadius: 30,
            padding: '30px 60px',
            boxShadow: `0 0 60px ${scoreColor}44`,
            transform: `scale(${arrowPulse})`,
          }}
        >
          <div style={{ color: C.gray, fontSize: 24, marginBottom: 4 }}>Score ATS</div>
          <div
            style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontSize: 200,
              fontWeight: 900,
              color: scoreColor,
              lineHeight: 1,
              textShadow: `0 0 60px ${scoreColor}`,
            }}
          >
            {score}
          </div>
          <div style={{ color: scoreColor, fontSize: 40, fontWeight: 700 }}>/ 100</div>
        </div>

        {/* Before / After mini-cards */}
        <div style={{ display: 'flex', gap: 20, width: '85%', marginTop: 10 }}>
          <div
            style={{
              flex: 1,
              opacity: beforeIn,
              transform: `translateX(${interpolate(beforeIn, [0, 1], [-30, 0])}px)`,
              background: 'rgba(239,68,68,0.12)',
              border: `1px solid ${C.red}55`,
              borderRadius: 16,
              padding: '16px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: C.gray, fontSize: 20, marginBottom: 6 }}>Avant</div>
            <div style={{ color: C.red, fontSize: 60, fontWeight: 900 }}>34%</div>
            <div style={{ color: C.red, fontSize: 22 }}>❌ Rejeté par l'ATS</div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 50,
              color: C.white,
              fontWeight: 900,
            }}
          >
            →
          </div>

          <div
            style={{
              flex: 1,
              opacity: afterIn,
              transform: `translateX(${interpolate(afterIn, [0, 1], [30, 0])}px)`,
              background: 'rgba(16,185,129,0.12)',
              border: `1px solid ${C.green}55`,
              borderRadius: 16,
              padding: '16px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: C.gray, fontSize: 20, marginBottom: 6 }}>Après</div>
            <div style={{ color: C.green, fontSize: 60, fontWeight: 900 }}>91%</div>
            <div style={{ color: C.green, fontSize: 22 }}>✅ Vu par un humain</div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '80%',
            height: 16,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${score}%`,
              background: `linear-gradient(90deg, ${C.red}, ${C.yellow}, ${C.green})`,
              borderRadius: 8,
              boxShadow: `0 0 16px ${scoreColor}`,
              transition: 'width 0.1s',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 7 – SOCIAL PROOF + URGENCY (23–31 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneProof: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.proof.start;
  const opacity = lf < 220 ? 1 : fadeOut(lf, 220, 240);

  const titleIn = sp(lf, 0, { damping: 80, stiffness: 200 });

  // Notification pings appearing sequentially
  const notifs = [
    { name: 'Sophie M.', msg: "J'ai eu un entretien en 3 jours !", emoji: '🎉', delay: 15 },
    { name: 'Karim B.', msg: 'Score passé de 40 à 87%', emoji: '🚀', delay: 50 },
    { name: 'Julie R.', msg: "Merci HireScan, j'ai décroché le poste !", emoji: '✨', delay: 85 },
  ];

  // Counter going up
  const usersCount = Math.round(
    interpolate(clamp01((lf - 120) / 80), [0, 1], [1247, 1389]),
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <AnimBg frame={lf} colors={['#0a1a10', '#0A0A1A']} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div
          style={{
            opacity: titleIn,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.8, 1])})`,
          }}
        >
          <ImpactText size={52} color={C.white}>
            Ils ont changé de job
          </ImpactText>
          <ImpactText size={52} color={C.green} shadow={C.green}>
            grâce à HireScan
          </ImpactText>
        </div>

        {/* Notification cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '85%' }}>
          {notifs.map(({ name, msg, emoji, delay }, i) => {
            const progress = clamp01((lf - delay) / 20);
            return (
              <div
                key={i}
                style={{
                  opacity: progress,
                  transform: `translateX(${interpolate(progress, [0, 1], [60, 0])}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'rgba(16,185,129,0.1)',
                  border: `1px solid ${C.green}44`,
                  borderRadius: 16,
                  padding: '16px 20px',
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  {emoji}
                </div>
                <div>
                  <div style={{ color: C.green, fontSize: 22, fontWeight: 700 }}>{name}</div>
                  <div style={{ color: C.white, fontSize: 20 }}>{msg}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live counter */}
        {lf > 120 && (
          <div
            style={{
              opacity: clamp01((lf - 120) / 20),
              background: 'rgba(124,58,237,0.2)',
              border: `2px solid ${C.violet}`,
              borderRadius: 20,
              padding: '16px 36px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: C.gray, fontSize: 22, marginBottom: 4 }}>Utilisateurs actifs</div>
            <div
              style={{
                fontFamily: "'Arial Black', 'Impact', sans-serif",
                fontSize: 72,
                fontWeight: 900,
                color: C.indigo,
                textShadow: `0 0 30px ${C.indigo}`,
              }}
            >
              {usersCount.toLocaleString('fr-FR')}
            </div>
            <div
              style={{
                display: 'inline-block',
                background: C.red,
                color: C.white,
                fontSize: 18,
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: 20,
                marginTop: 4,
              }}
            >
              🔴 EN DIRECT
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 8 – CTA: hirescan.online (31–37 s)
// ═══════════════════════════════════════════════════════════════════════════════
const SceneCTA: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SC.cta.start;
  const opacity = 1;

  const logoIn = sp(lf, 0, { damping: 60, stiffness: 180 });
  const textIn = sp(lf, 15, { damping: 80, stiffness: 200 });
  const btnIn = sp(lf, 30, { damping: 60, stiffness: 250 });
  const urgencyIn = sp(lf, 50, { damping: 80, stiffness: 200 });

  const btnPulse = 1 + Math.sin(lf * 0.2) * 0.04;
  const glowIntensity = interpolate(Math.sin(lf * 0.15), [-1, 1], [0.4, 1]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AnimBg frame={lf} colors={['#1e1b4b', '#0A0A1A']} />

      {/* Particle-like dots */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + lf * 0.02;
        const r = 380 + Math.sin(lf * 0.05 + i) * 30;
        const x = 50 + Math.cos(angle) * r * 0.05;
        const y = 50 + Math.sin(angle) * r * 0.08;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: C.indigo,
              opacity: 0.4 + Math.sin(lf * 0.1 + i) * 0.3,
              boxShadow: `0 0 10px ${C.indigo}`,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${interpolate(logoIn, [0, 1], [0.3, 1])})`,
            opacity: logoIn,
            fontSize: 80,
            filter: `drop-shadow(0 0 30px ${C.indigo})`,
          }}
        >
          🔍
        </div>

        <div
          style={{
            opacity: textIn,
            transform: `scale(${interpolate(textIn, [0, 1], [0.8, 1])})`,
            textAlign: 'center',
          }}
        >
          <ImpactText
            size={80}
            style={{
              backgroundImage: `linear-gradient(135deg, ${C.indigo}, ${C.cyan})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 80,
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontWeight: 900,
              textAlign: 'center',
              textTransform: 'uppercase',
            } as React.CSSProperties}
          >
            HIRESCAN AI
          </ImpactText>
          <ImpactText size={36} color={C.white}>
            Passe les bots ATS.
          </ImpactText>
          <ImpactText size={36} color={C.white}>
            Décroche le job.
          </ImpactText>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: btnIn,
            transform: `scale(${interpolate(btnIn, [0, 1], [0.5, 1]) * btnPulse})`,
            background: `linear-gradient(135deg, ${C.violet}, ${C.indigo})`,
            borderRadius: 60,
            padding: '24px 50px',
            boxShadow: `0 0 ${40 * glowIntensity}px ${C.indigo}${Math.round(glowIntensity * 200).toString(16).padStart(2, '0')}, 0 0 80px ${C.violet}33`,
          }}
        >
          <span
            style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontSize: 48,
              fontWeight: 900,
              color: C.white,
              letterSpacing: 1,
            }}
          >
            hirescan.online
          </span>
        </div>

        {/* Free badge */}
        <div
          style={{
            opacity: btnIn,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: C.green,
              color: C.white,
              fontSize: 22,
              fontWeight: 700,
              padding: '8px 20px',
              borderRadius: 20,
            }}
          >
            ✅ GRATUIT
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: C.white,
              fontSize: 22,
              padding: '8px 20px',
              borderRadius: 20,
            }}
          >
            Sans CB
          </div>
        </div>

        {/* Urgency */}
        <div
          style={{
            opacity: urgencyIn,
            transform: `translateY(${interpolate(urgencyIn, [0, 1], [20, 0])}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: C.yellow,
              fontSize: 30,
              fontWeight: 700,
              textShadow: `0 0 20px ${C.yellow}`,
            }}
          >
            ⚡ Lance l'analyse maintenant
          </div>
          <div style={{ color: C.gray, fontSize: 24, marginTop: 8 }}>
            Lien en bio 👆
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════════════════════
export const HireScanAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const isHook = frame < SC.stat.start;
  const isStat = frame >= SC.stat.start && frame < SC.bot.start;
  const isBot = frame >= SC.bot.start && frame < SC.reveal.start;
  const isReveal = frame >= SC.reveal.start && frame < SC.demo1.start;
  const isDemo1 = frame >= SC.demo1.start && frame < SC.demo2.start;
  const isDemo2 = frame >= SC.demo2.start && frame < SC.proof.start;
  const isProof = frame >= SC.proof.start && frame < SC.cta.start;
  const isCTA = frame >= SC.cta.start;

  // Scene-transition flash
  const boundaries = [SC.stat.start, SC.bot.start, SC.reveal.start, SC.demo1.start, SC.demo2.start, SC.proof.start, SC.cta.start];
  const flashOpacity = boundaries.reduce((acc, b) => {
    const d = frame - b;
    if (d >= 0 && d < 6) return Math.max(acc, interpolate(d, [0, 6], [0.6, 0]));
    return acc;
  }, 0);

  return (
    <AbsoluteFill style={{ background: '#0A0A1A', overflow: 'hidden' }}>
      {isHook && <SceneHook frame={frame} />}
      {isStat && <SceneStat frame={frame} />}
      {isBot && <SceneBot frame={frame} />}
      {isReveal && <SceneReveal frame={frame} />}
      {isDemo1 && <SceneDemo1 frame={frame} />}
      {isDemo2 && <SceneDemo2 frame={frame} />}
      {isProof && <SceneProof frame={frame} />}
      {isCTA && <SceneCTA frame={frame} />}

      {/* Scene transition flash */}
      <AbsoluteFill style={{ background: 'white', opacity: flashOpacity, pointerEvents: 'none' }} />

      {/* Persistent corner watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 30,
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 12,
          padding: '6px 16px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 22,
          fontFamily: 'monospace',
        }}
      >
        hirescan.online
      </div>
    </AbsoluteFill>
  );
};
