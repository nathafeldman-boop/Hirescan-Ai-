'use client';

type Theme = 'romance' | 'psychological' | 'melancholy' | 'burnout' | 'identity' | 'default';

const SLUG_THEME: Record<string, Theme> = {
  'schema-amoureux': 'romance',
  'vrai-amour': 'romance',
  amoureux: 'romance',
  narcissique: 'psychological',
  manipule: 'psychological',
  'relation-toxique': 'psychological',
  'auto-sabotage': 'psychological',
  'tourner-la-page': 'melancholy',
  'role-familial': 'melancholy',
  rompre: 'melancholy',
  depression: 'melancholy',
  burnout: 'burnout',
  jaloux: 'burnout',
  'intelligence-emotionnelle': 'identity',
};

const THEMES: Record<Theme, { a: string; b: string; c: string; d: string }> = {
  romance: { a: '#c2185b', b: '#e91e63', c: '#ad1457', d: '#f48fb1' },
  psychological: { a: '#4527a0', b: '#6a1b9a', c: '#1a237e', d: '#7c4dff' },
  melancholy: { a: '#1565c0', b: '#37474f', c: '#263238', d: '#546e7a' },
  burnout: { a: '#bf360c', b: '#e65100', c: '#3e2723', d: '#ff6d00' },
  identity: { a: '#6a1b9a', b: '#1565c0', c: '#00695c', d: '#e91e63' },
  default: { a: '#4a148c', b: '#880e4f', c: '#1a237e', d: '#6a1b9a' },
};

export default function QuizAtmosphereBg({ slug }: { slug: string }) {
  const theme = SLUG_THEME[slug] ?? 'default';
  const { a, b, c, d } = THEMES[theme];

  return (
    <>
      <style>{`
        @keyframes atm-blob-a {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(60px,-80px) scale(1.15); }
          66%     { transform: translate(-40px,50px) scale(0.9); }
        }
        @keyframes atm-blob-b {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(-70px,60px) scale(1.1); }
          66%     { transform: translate(50px,-60px) scale(1.2); }
        }
        @keyframes atm-blob-c {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(30px,80px) scale(0.85); }
        }
        @keyframes atm-blob-d {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(-50px,-40px) scale(1.12); }
          80%     { transform: translate(40px,30px) scale(0.92); }
        }
        @keyframes atm-grain {
          0%,100% { opacity: 0.03; }
          50%     { opacity: 0.06; }
        }
        @keyframes atm-vignette-pulse {
          0%,100% { opacity: 0.7; }
          50%     { opacity: 0.85; }
        }
        @keyframes atm-light-sweep {
          0%   { transform: translateX(-100%) rotate(-15deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(200%) rotate(-15deg); opacity: 0; }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Deep base */}
        <div className="absolute inset-0" style={{ background: '#050508' }} />

        {/* Blob A — top-left */}
        <div className="absolute rounded-full" style={{
          top: '10%', left: '5%',
          width: '55vw', height: '55vw', maxWidth: 600, maxHeight: 600,
          background: `radial-gradient(circle, ${a}30 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'atm-blob-a 18s ease-in-out infinite',
        }} />

        {/* Blob B — bottom-right */}
        <div className="absolute rounded-full" style={{
          bottom: '8%', right: '3%',
          width: '60vw', height: '60vw', maxWidth: 650, maxHeight: 650,
          background: `radial-gradient(circle, ${b}28 0%, transparent 70%)`,
          filter: 'blur(70px)',
          animation: 'atm-blob-b 23s ease-in-out infinite',
        }} />

        {/* Blob C — center */}
        <div className="absolute rounded-full" style={{
          top: '40%', left: '30%',
          width: '45vw', height: '45vw', maxWidth: 500, maxHeight: 500,
          background: `radial-gradient(circle, ${c}20 0%, transparent 70%)`,
          filter: 'blur(50px)',
          animation: 'atm-blob-c 14s ease-in-out infinite',
        }} />

        {/* Blob D — top-right accent */}
        <div className="absolute rounded-full" style={{
          top: '5%', right: '10%',
          width: '35vw', height: '35vw', maxWidth: 380, maxHeight: 380,
          background: `radial-gradient(circle, ${d}18 0%, transparent 70%)`,
          filter: 'blur(40px)',
          animation: 'atm-blob-d 20s ease-in-out infinite 3s',
        }} />

        {/* Drifting light ray — very subtle */}
        <div style={{
          position: 'absolute',
          top: '20%', left: 0,
          width: '40%', height: '2px',
          background: `linear-gradient(90deg, transparent, ${a}18, transparent)`,
          animation: 'atm-light-sweep 28s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '65%', left: 0,
          width: '30%', height: '1px',
          background: `linear-gradient(90deg, transparent, ${d}12, transparent)`,
          animation: 'atm-light-sweep 35s linear infinite 12s',
        }} />

        {/* Vignette — strong edges keep content readable */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(5,5,8,0.6) 100%),
            linear-gradient(to bottom, rgba(5,5,8,0.4) 0%, transparent 20%, transparent 75%, rgba(5,5,8,0.9) 100%)
          `,
          animation: 'atm-vignette-pulse 12s ease-in-out infinite',
        }} />
      </div>
    </>
  );
}
