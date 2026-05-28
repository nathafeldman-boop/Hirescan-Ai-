import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
} from 'remotion';

// ─── Timeline ────────────────────────────────────────────────────────────────
const FPS = 30;

const S = {
  intro:   { start: 0,   dur: 90  }, // 3 s – Logo
  tagline: { start: 90,  dur: 90  }, // 3 s – Tagline
  problem: { start: 180, dur: 90  }, // 3 s – Problème
  feat1:   { start: 270, dur: 120 }, // 4 s – Analyse
  feat2:   { start: 390, dur: 120 }, // 4 s – Génère
  feat3:   { start: 510, dur: 120 }, // 4 s – Décroche
  cta:     { start: 630, dur: 120 }, // 4 s – CTA
};

export const HIRESCAN_TOTAL_FRAMES = 750;

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:      '#07071A',
  indigo:  '#818CF8',
  bright:  '#6366F1',
  purple:  '#C084FC',
  cyan:    '#22D3EE',
  red:     '#F87171',
  orange:  '#FB923C',
  white:   '#F8FAFC',
  muted:   '#94A3B8',
  dim:     '#1E293B',
};

// ─── Animation helpers ───────────────────────────────────────────────────────
const sp = (
  frame: number,
  start: number,
  cfg: { damping: number; stiffness: number } = { damping: 80, stiffness: 200 },
) => spring({ frame: frame - start, fps: FPS, config: cfg });

const fade = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const slideUp = (frame: number, start: number) => ({
  opacity: fade(frame, start, start + 10),
  transform: `translateY(${interpolate(sp(frame, start), [0, 1], [44, 0])}px)`,
});

const slideIn = (
  frame: number,
  start: number,
  dir: 'left' | 'right' = 'left',
) => {
  const d = dir === 'left' ? -1 : 1;
  return {
    opacity: fade(frame, start, start + 10),
    transform: `translateX(${interpolate(sp(frame, start), [0, 1], [60 * d, 0])}px)`,
  };
};

const scaleIn = (frame: number, start: number, bounce = false) => {
  const cfg = bounce
    ? { damping: 12, stiffness: 140 }
    : { damping: 80, stiffness: 200 };
  return {
    opacity: fade(frame, start, start + 10),
    transform: `scale(${interpolate(sp(frame, start, cfg), [0, 1], [0.55, 1])})`,
  };
};

// ─── Cross-slide fade wrapper ─────────────────────────────────────────────────
const SlideFade: React.FC<{
  frame: number;
  start: number;
  dur: number;
  children: React.ReactNode;
}> = ({ frame, start, dur, children }) => {
  const opacity = interpolate(
    frame,
    [start, start + 12, start + dur - 12, start + dur],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// ─── Shared background ────────────────────────────────────────────────────────
const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const ox = interpolate(frame, [0, HIRESCAN_TOTAL_FRAMES], [20, 40]);
  const oy = interpolate(frame, [0, HIRESCAN_TOTAL_FRAMES], [20, 35]);
  const ox2 = interpolate(frame, [0, HIRESCAN_TOTAL_FRAMES], [80, 60]);
  const oy2 = interpolate(frame, [0, HIRESCAN_TOTAL_FRAMES], [80, 65]);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Animated gradient orbs */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at ${ox}% ${oy}%, rgba(99,102,241,0.22) 0%, transparent 55%),
            radial-gradient(ellipse at ${ox2}% ${oy2}%, rgba(168,85,247,0.16) 0%, transparent 55%)
          `,
        }}
      />
      {/* Subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
const Logo: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="hsGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    {/* Background card */}
    <rect width="80" height="80" rx="20" fill="url(#hsGrad)" />
    {/* Document body */}
    <rect x="18" y="12" width="34" height="44" rx="4" fill="none" stroke="white" strokeWidth="3" />
    {/* Text lines */}
    <line x1="25" y1="23" x2="45" y2="23" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="25" y1="31" x2="45" y2="31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="25" y1="39" x2="37" y2="39" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    {/* Scan badge */}
    <circle cx="56" cy="58" r="14" fill="#07071A" />
    <circle cx="56" cy="58" r="14" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
    <path
      d="M50 58 L55 63 L63 53"
      stroke="#22D3EE"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Slide 1: Brand intro ─────────────────────────────────────────────────────
const IntroSlide: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - S.intro.start;
  const glowOpacity = interpolate(Math.sin(lf * 0.09), [-1, 1], [0.25, 0.55]);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
      }}
    >
      {/* Logo */}
      <div
        style={{
          ...scaleIn(frame, S.intro.start + 5, true),
          filter: `drop-shadow(0 0 48px rgba(99,102,241,${glowOpacity}))`,
        }}
      >
        <Logo size={110} />
      </div>

      {/* Brand name */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
        <span
          style={{
            ...slideUp(frame, S.intro.start + 22),
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            fontSize: 100,
            fontWeight: 800,
            color: C.white,
            letterSpacing: -3,
          }}
        >
          Hire
        </span>
        <span
          style={{
            ...slideUp(frame, S.intro.start + 32),
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            fontSize: 100,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: -3,
          }}
        >
          Scan
        </span>
        <span
          style={{
            ...slideUp(frame, S.intro.start + 40),
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            fontSize: 100,
            fontWeight: 800,
            color: C.cyan,
            letterSpacing: -3,
          }}
        >
          .
        </span>
      </div>

      {/* Sub-label */}
      <div
        style={{
          ...slideUp(frame, S.intro.start + 52),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 22,
          fontWeight: 500,
          color: C.muted,
          letterSpacing: 7,
          textTransform: 'uppercase',
        }}
      >
        AI · CV · Career
      </div>

      {/* URL pill */}
      <div
        style={{
          ...slideUp(frame, S.intro.start + 62),
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 100,
          padding: '10px 28px',
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          color: C.indigo,
          letterSpacing: 1,
        }}
      >
        hirescan.online
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide 2: Tagline ─────────────────────────────────────────────────────────
const TaglineSlide: React.FC<{ frame: number }> = ({ frame }) => {
  const { start } = S.tagline;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '0 120px',
      }}
    >
      <div
        style={{
          ...slideIn(frame, start + 5, 'left'),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          color: C.indigo,
          letterSpacing: 6,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        La solution qui change tout
      </div>

      <div
        style={{
          ...slideUp(frame, start + 18),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
          textAlign: 'center',
          lineHeight: 1.05,
          letterSpacing: -2,
        }}
      >
        Ton CV.
      </div>

      <div
        style={{
          ...slideUp(frame, start + 30),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 80,
          fontWeight: 800,
          background: `linear-gradient(120deg, ${C.indigo}, ${C.purple}, ${C.cyan})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          lineHeight: 1.05,
          letterSpacing: -2,
        }}
      >
        Analysé. Optimisé.
      </div>

      <div
        style={{
          ...slideUp(frame, start + 44),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 80,
          fontWeight: 800,
          color: C.white,
          textAlign: 'center',
          lineHeight: 1.05,
          letterSpacing: -2,
        }}
      >
        Récompensé.
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide 3: Problème ────────────────────────────────────────────────────────
const ProblemSlide: React.FC<{ frame: number }> = ({ frame }) => {
  const { start } = S.problem;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: '0 140px',
      }}
    >
      <div
        style={{
          ...slideIn(frame, start + 5),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          color: '#F87171',
          letterSpacing: 6,
          textTransform: 'uppercase',
        }}
      >
        La réalité
      </div>

      {/* Stat */}
      <div
        style={{
          ...scaleIn(frame, start + 18, true),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 160,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #EF4444, #F97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: -6,
          lineHeight: 1,
        }}
      >
        75%
      </div>

      <div
        style={{
          ...slideUp(frame, start + 38),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 34,
          fontWeight: 600,
          color: C.white,
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        des CVs sont rejetés{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #EF4444, #F97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          avant d'être lus
        </span>
      </div>

      <div
        style={{
          ...slideUp(frame, start + 52),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 22,
          color: C.muted,
          textAlign: 'center',
        }}
      >
        par un recruteur humain
      </div>
    </AbsoluteFill>
  );
};

// ─── Feature slide template ────────────────────────────────────────────────────
const FeatureSlide: React.FC<{
  frame: number;
  start: number;
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
}> = ({ frame, start, num, icon, title, desc, accent }) => (
  <AbsoluteFill
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28,
      padding: '0 180px',
    }}
  >
    {/* Badge */}
    <div
      style={{
        ...slideIn(frame, start + 5),
        background: `${accent}1A`,
        border: `1px solid ${accent}40`,
        borderRadius: 100,
        padding: '8px 26px',
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        fontSize: 14,
        fontWeight: 700,
        color: accent,
        letterSpacing: 4,
        textTransform: 'uppercase',
      }}
    >
      Fonctionnalité {num}
    </div>

    {/* Icon card */}
    <div
      style={{
        ...scaleIn(frame, start + 12, true),
        width: 130,
        height: 130,
        borderRadius: 36,
        background: `${accent}18`,
        border: `1px solid ${accent}35`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 36px ${accent}45)`,
      }}
    >
      {icon}
    </div>

    {/* Title */}
    <div
      style={{
        ...slideUp(frame, start + 22),
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        fontSize: 68,
        fontWeight: 800,
        color: C.white,
        textAlign: 'center',
        letterSpacing: -1.5,
        lineHeight: 1.1,
      }}
    >
      {title}
    </div>

    {/* Description */}
    <div
      style={{
        ...slideUp(frame, start + 34),
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        fontSize: 28,
        fontWeight: 400,
        color: C.muted,
        textAlign: 'center',
        lineHeight: 1.55,
        maxWidth: 940,
      }}
    >
      {desc}
    </div>
  </AbsoluteFill>
);

// ─── Slide 7: CTA ─────────────────────────────────────────────────────────────
const CTASlide: React.FC<{ frame: number }> = ({ frame }) => {
  const { start } = S.cta;
  const lf = frame - start;

  const btnPulse = interpolate(
    Math.sin(lf * 0.07),
    [-1, 1],
    [0.96, 1.04],
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: '0 120px',
      }}
    >
      {/* Logo */}
      <div style={{ ...scaleIn(frame, start + 5) }}>
        <Logo size={90} />
      </div>

      <div
        style={{
          ...slideUp(frame, start + 20),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 68,
          fontWeight: 800,
          color: C.white,
          textAlign: 'center',
          letterSpacing: -2,
          lineHeight: 1.1,
        }}
      >
        Prêt à décrocher ton
      </div>

      <div
        style={{
          ...slideUp(frame, start + 30),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 68,
          fontWeight: 800,
          background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          letterSpacing: -2,
          lineHeight: 1.1,
        }}
      >
        job de rêve ?
      </div>

      {/* CTA button */}
      <div
        style={{
          ...scaleIn(frame, start + 42),
          transform: `${scaleIn(frame, start + 42).transform} scale(${btnPulse})`,
          marginTop: 8,
          background: `linear-gradient(135deg, ${C.bright}, ${C.purple})`,
          borderRadius: 100,
          padding: '22px 58px',
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: 'white',
          boxShadow: `0 0 60px rgba(99,102,241,0.55), 0 20px 40px rgba(0,0,0,0.4)`,
          cursor: 'pointer',
        }}
      >
        Commence gratuitement →
      </div>

      {/* URL */}
      <div
        style={{
          ...slideUp(frame, start + 55),
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          fontSize: 22,
          fontWeight: 600,
          color: C.cyan,
          letterSpacing: 2,
        }}
      >
        hirescan.online
      </div>
    </AbsoluteFill>
  );
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const AnalyzeIcon = () => (
  <svg width="66" height="66" viewBox="0 0 66 66" fill="none">
    <circle cx="28" cy="28" r="17" stroke={C.indigo} strokeWidth="3.5" />
    <path d="M40 40 L54 54" stroke={C.indigo} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M22 28 L27 33 L35 22" stroke={C.indigo} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GenerateIcon = () => (
  <svg width="66" height="66" viewBox="0 0 66 66" fill="none">
    <rect x="10" y="8" width="38" height="48" rx="6" stroke={C.purple} strokeWidth="3.5" />
    <line x1="18" y1="22" x2="40" y2="22" stroke={C.purple} strokeWidth="3" strokeLinecap="round" />
    <line x1="18" y1="31" x2="40" y2="31" stroke={C.purple} strokeWidth="3" strokeLinecap="round" />
    <line x1="18" y1="40" x2="30" y2="40" stroke={C.purple} strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="50" r="12" fill={C.bg} />
    <circle cx="50" cy="50" r="12" fill="none" stroke={C.purple} strokeWidth="2.5" />
    <path d="M46 50 L49 53 L55 46" stroke={C.purple} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MatchIcon = () => (
  <svg width="66" height="66" viewBox="0 0 66 66" fill="none">
    <path d="M8 58 L8 34 L22 20 L33 30 L44 16 L58 28 L58 58 Z"
      stroke={C.cyan} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="33" cy="16" r="0" fill={C.cyan} />
    <path d="M26 34 L31 39 L40 28" stroke={C.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Main composition ─────────────────────────────────────────────────────────
export const HireScanVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Background frame={frame} />

      <SlideFade frame={frame} start={S.intro.start} dur={S.intro.dur}>
        <IntroSlide frame={frame} />
      </SlideFade>

      <SlideFade frame={frame} start={S.tagline.start} dur={S.tagline.dur}>
        <TaglineSlide frame={frame} />
      </SlideFade>

      <SlideFade frame={frame} start={S.problem.start} dur={S.problem.dur}>
        <ProblemSlide frame={frame} />
      </SlideFade>

      <SlideFade frame={frame} start={S.feat1.start} dur={S.feat1.dur}>
        <FeatureSlide
          frame={frame}
          start={S.feat1.start}
          num="01"
          icon={<AnalyzeIcon />}
          title="Analyse ton CV"
          desc="Notre IA lit et analyse ton CV en quelques secondes — et identifie exactement ce qui bloque ta candidature."
          accent={C.indigo}
        />
      </SlideFade>

      <SlideFade frame={frame} start={S.feat2.start} dur={S.feat2.dur}>
        <FeatureSlide
          frame={frame}
          start={S.feat2.start}
          num="02"
          icon={<GenerateIcon />}
          title="Génère ton CV"
          desc="Crée un CV professionnel, adapté à chaque offre d'emploi, en quelques clics — sans effort."
          accent={C.purple}
        />
      </SlideFade>

      <SlideFade frame={frame} start={S.feat3.start} dur={S.feat3.dur}>
        <FeatureSlide
          frame={frame}
          start={S.feat3.start}
          num="03"
          icon={<MatchIcon />}
          title="Décroche ton job"
          desc="Multiplie tes chances d'être rappelé et trouve les offres qui correspondent parfaitement à ton profil."
          accent={C.cyan}
        />
      </SlideFade>

      <SlideFade frame={frame} start={S.cta.start} dur={S.cta.dur}>
        <CTASlide frame={frame} />
      </SlideFade>
    </AbsoluteFill>
  );
};
