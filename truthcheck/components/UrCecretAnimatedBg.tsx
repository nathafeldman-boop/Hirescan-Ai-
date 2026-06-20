'use client';

export default function UrCecretAnimatedBg({ accentColor }: { accentColor?: string }) {
  const accent = accentColor ?? '#c2611f';

  return (
    <>
      <style>{`
        @keyframes ur-breathe {
          0%, 100% { opacity: 0.045; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.09;  transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes ur-ring-cw  { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(360deg);  } }
        @keyframes ur-ring-ccw { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes ur-blob-1 {
          0%,100% { transform: translate(0,0)      scale(1);    }
          33%     { transform: translate(35px,-45px) scale(1.1); }
          66%     { transform: translate(-25px,22px) scale(0.93);}
        }
        @keyframes ur-blob-2 {
          0%,100% { transform: translate(0,0)       scale(1);    }
          33%     { transform: translate(-42px,28px) scale(1.07);}
          66%     { transform: translate(28px,-38px) scale(1.12);}
        }
        @keyframes ur-blob-3 {
          0%,100% { transform: translate(0,0)      scale(1);   }
          50%     { transform: translate(18px,48px) scale(0.88);}
        }
        @keyframes ur-spark {
          0%,100% { opacity: 0; transform: scale(0) rotate(0deg);   }
          45%,55% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes ur-line-drift {
          0%   { transform: translateX(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

        {/* Base */}
        <div className="absolute inset-0 bg-[#09090b]" />

        {/* Central logo — breathing */}
        <div
          className="absolute"
          style={{
            top: '50%', left: '50%',
            animation: 'ur-breathe 7s ease-in-out infinite',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          <span style={{
            fontSize: 'clamp(72px, 22vw, 180px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #d17d52, #e0a380)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Ur</span>
          <span style={{
            fontSize: 'clamp(72px, 22vw, 180px)',
            fontWeight: 900,
            color: 'white',
          }}>Cecret</span>
        </div>

        {/* Orbiting rings */}
        <div className="absolute rounded-full" style={{
          top: '50%', left: '50%',
          width: 'min(60vw, 480px)', height: 'min(60vw, 480px)',
          border: '1px solid rgba(209,125,82,0.12)',
          animation: 'ur-ring-cw 22s linear infinite',
        }}>
          {/* Dot on ring */}
          <div style={{
            position: 'absolute', top: '-3px', left: '50%',
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#d17d52', boxShadow: '0 0 10px #d17d52',
            transform: 'translateX(-50%)',
          }} />
        </div>
        <div className="absolute rounded-full" style={{
          top: '50%', left: '50%',
          width: 'min(80vw, 680px)', height: 'min(80vw, 680px)',
          border: '1px solid rgba(224,163,128,0.08)',
          animation: 'ur-ring-ccw 32s linear infinite',
        }}>
          <div style={{
            position: 'absolute', bottom: '-3px', left: '50%',
            width: '5px', height: '5px', borderRadius: '50%',
            background: '#e0a380', boxShadow: '0 0 8px #e0a380',
            transform: 'translateX(-50%)',
          }} />
        </div>

        {/* Floating blobs */}
        <div className="absolute rounded-full" style={{
          top: '18%', left: '8%',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(209,125,82,0.13) 0%, transparent 70%)',
          filter: 'blur(2px)',
          animation: 'ur-blob-1 14s ease-in-out infinite',
        }} />
        <div className="absolute rounded-full" style={{
          bottom: '12%', right: '8%',
          width: '380px', height: '380px',
          background: 'radial-gradient(circle, rgba(224,163,128,0.11) 0%, transparent 70%)',
          filter: 'blur(2px)',
          animation: 'ur-blob-2 17s ease-in-out infinite',
        }} />
        <div className="absolute rounded-full" style={{
          top: '58%', left: '38%',
          width: '260px', height: '260px',
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          filter: 'blur(2px)',
          animation: 'ur-blob-3 11s ease-in-out infinite',
        }} />

        {/* Sparkle dots */}
        {([
          { top: '14%',  left:  '22%', delay: '0s',    size: 4, color: '#d17d52' },
          { top: '78%',  left:  '13%', delay: '1.2s',  size: 3, color: '#e0a380' },
          { top: '32%',  right: '18%', delay: '2.1s',  size: 4, color: '#d17d52' },
          { top: '88%',  right: '28%', delay: '0.6s',  size: 3, color: '#e0a380' },
          { top: '52%',  left:  '72%', delay: '1.8s',  size: 3, color: '#d17d52' },
          { top: '22%',  right: '8%',  delay: '3.3s',  size: 4, color: '#e0a380' },
          { top: '65%',  left:  '5%',  delay: '2.7s',  size: 3, color: '#d17d52' },
          { top: '45%',  right: '5%',  delay: '0.9s',  size: 4, color: accent    },
        ] as Array<{ top?: string; left?: string; right?: string; bottom?: string; delay: string; size: number; color: string }>).map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom,
              width: dot.size, height: dot.size,
              background: dot.color,
              boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
              animation: `ur-spark ${3.5 + i * 0.5}s ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}

        {/* Drifting horizontal lines (very subtle) */}
        {[
          { top: '30%', delay: '0s',   dur: '18s', color: 'rgba(209,125,82,0.06)' },
          { top: '65%', delay: '6s',   dur: '22s', color: 'rgba(224,163,128,0.05)' },
          { top: '50%', delay: '12s',  dur: '20s', color: `${accent}0a`            },
        ].map((l, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: l.top, left: 0,
            width: '200px', height: '1px',
            background: `linear-gradient(90deg, transparent, ${l.color}, transparent)`,
            animation: `ur-line-drift ${l.dur} linear infinite`,
            animationDelay: l.delay,
          }} />
        ))}

        {/* Bottom vignette to keep content readable */}
        <div className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(to top, #09090b 0%, transparent 100%)' }} />
      </div>
    </>
  );
}
