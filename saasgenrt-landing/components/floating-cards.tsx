'use client'

import { motion } from 'framer-motion'

const CARD_BG = 'rgba(17,24,39,0.85)'
const CARD_SHADOW = '0 24px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.07)'

function FloatCard({
  delay,
  children,
  style,
}: {
  delay: number
  children: React.ReactNode
  style: React.CSSProperties
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5 + delay * 0.7, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: CARD_BG,
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16,
        boxShadow: CARD_SHADOW,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

function MiniChart() {
  const pts: [number, number][] = [
    [0, 46], [22, 40], [44, 34], [66, 38], [88, 24], [110, 18], [132, 9],
  ]
  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `M0,50 ${pts.map(([x, y]) => `L${x},${y}`).join(' ')} L132,50 Z`
  return (
    <svg width="132" height="50" viewBox="0 0 132 50" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39FF88" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#39FF88" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mrrFill)" />
      <polyline points={polyline} fill="none" stroke="#39FF88" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="132" cy="9" r="3" fill="#39FF88" />
      <circle cx="132" cy="9" r="6" fill="#39FF88" fillOpacity="0.2" />
    </svg>
  )
}

function MiniBarChart() {
  const bars = [22, 30, 36, 48, 60]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 60 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: h,
            borderRadius: 5,
            background: i >= 3 ? '#39FF88' : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
    </div>
  )
}

const competitors = [
  { name: 'InvoiceAI', score: 72, color: '#f87171' },
  { name: 'BillFlow', score: 58, color: '#fbbf24' },
  { name: 'PaperLess', score: 44, color: '#60a5fa' },
]

export function FloatingCards() {
  return (
    <div style={{ position: 'relative', width: 500, height: 480 }}>
      {/* Back radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 72% 65% at 52% 50%, rgba(139,92,246,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* SVG connecting lines */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
        viewBox="0 0 500 480"
      >
        <defs>
          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lg2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#39FF88" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="lg3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="lg4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#39FF88" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* Card1(115,60) → Card2(400,108) */}
        <line x1="115" y1="60" x2="400" y2="108" stroke="url(#lg1)" strokeWidth="1" strokeDasharray="4 5" />
        {/* Card2(400,108) → Card4(388,392) */}
        <line x1="400" y1="108" x2="388" y2="392" stroke="url(#lg2)" strokeWidth="1" strokeDasharray="4 5" />
        {/* Card1(115,60) → Card3(100,278) */}
        <line x1="115" y1="60" x2="100" y2="278" stroke="url(#lg3)" strokeWidth="1" strokeDasharray="4 5" />
        {/* Card3(100,278) → Card4(388,392) */}
        <line x1="100" y1="278" x2="388" y2="392" stroke="url(#lg4)" strokeWidth="1" strokeDasharray="4 5" />
        {/* Junction dots */}
        {([[115,60],[400,108],[100,278],[388,392]] as [number,number][]).map(([cx,cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="2.5" fill="#8B5CF6" fillOpacity="0.85" />
            <circle cx={cx} cy={cy} r="5.5" fill="#8B5CF6" fillOpacity="0.14" />
          </g>
        ))}
      </svg>

      {/* Card 1: MRR Revenue */}
      <FloatCard delay={0} style={{ top: 10, left: 20, width: 192, padding: '14px 16px', transform: 'rotate(-8deg)', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#39FF88' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.42)', fontWeight: 500 }}>Monthly Revenue</span>
        </div>
        <MiniChart />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#39FF88', letterSpacing: '-0.03em' }}>$12.4K</span>
          <span style={{ fontSize: 10, color: '#39FF88', background: 'rgba(57,255,136,0.12)', border: '1px solid rgba(57,255,136,0.2)', padding: '2px 8px', borderRadius: 99 }}>↑ +24%</span>
        </div>
      </FloatCard>

      {/* Card 2: Top Idea */}
      <FloatCard delay={0.7} style={{ top: 52, right: 0, width: 172, padding: '14px 16px', transform: 'rotate(6deg)', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Top Idea</span>
          <span style={{ fontSize: 9, background: 'rgba(139,92,246,0.22)', color: '#c4b5fd', padding: '2px 7px', borderRadius: 99, border: '1px solid rgba(139,92,246,0.3)' }}>🔥 Score #1</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 8, lineHeight: 1.3 }}>AI Invoice Scanner</div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, marginBottom: 8 }}>
          <div style={{ height: '100%', width: '94%', background: 'linear-gradient(90deg, #8B5CF6, #c4b5fd)', borderRadius: 99 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>9.4 / 10</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#39FF88' }}>$8.2K/mo</span>
        </div>
      </FloatCard>

      {/* Card 3: Competitor Analysis */}
      <FloatCard delay={1.4} style={{ top: 232, left: 10, width: 184, padding: '14px 16px', transform: 'rotate(-5deg)', zIndex: 2 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: 10 }}>Competitor Analysis</div>
        {competitors.map((c) => (
          <div key={c.name} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{c.name}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{c.score}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${c.score}%`, background: c.color, borderRadius: 99, opacity: 0.75 }} />
            </div>
          </div>
        ))}
      </FloatCard>

      {/* Card 4: TikTok Growth */}
      <FloatCard delay={0.35} style={{ bottom: 18, right: 8, width: 178, padding: '14px 16px', transform: 'rotate(4deg)', zIndex: 2 }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>TikTok Growth</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#39FF88' }}>+47% this week</div>
        </div>
        <MiniBarChart />
      </FloatCard>

      {/* Floating particles */}
      {([
        { top: 158, left: 210, size: 3, opacity: 0.45 },
        { top: 320, left: 350, size: 2, opacity: 0.3 },
        { top: 85, left: 275, size: 2.5, opacity: 0.35 },
        { top: 440, left: 172, size: 2, opacity: 0.25 },
        { top: 195, left: 430, size: 2, opacity: 0.28 },
      ] as { top: number; left: number; size: number; opacity: number }[]).map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#8B5CF6' : '#39FF88',
            opacity: p.opacity,
            zIndex: 1,
          }}
          animate={{ opacity: [p.opacity, p.opacity * 0.25, p.opacity] }}
          transition={{ duration: 2.5 + i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
