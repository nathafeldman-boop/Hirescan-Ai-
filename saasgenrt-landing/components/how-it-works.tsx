'use client'

import { motion } from 'framer-motion'

/* ─── inline SVG step illustrations ─── */

function IllustrationProblem() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="24" cy="20" r="9" fill="rgba(167,139,250,0.35)" />
      <path d="M10 52C10 41 17 36 24 36C31 36 38 41 38 52" stroke="rgba(167,139,250,0.45)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="48" cy="44" r="9" stroke="rgba(167,139,250,0.65)" strokeWidth="2.5" fill="rgba(139,92,246,0.12)" />
      <line x1="54.5" y1="50.5" x2="60" y2="56" stroke="rgba(167,139,250,0.65)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="43" y1="42" x2="52" y2="42" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="43" y1="46" x2="50" y2="46" stroke="rgba(167,139,250,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="34" r="2.5" fill="rgba(167,139,250,0.4)" />
      <circle cx="52" cy="16" r="1.8" fill="rgba(167,139,250,0.3)" />
    </svg>
  )
}

function IllustrationAI() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="18" y="12" width="28" height="24" rx="8" fill="rgba(96,165,250,0.2)" stroke="rgba(96,165,250,0.45)" strokeWidth="1.5" />
      <circle cx="26" cy="22" r="4" fill="rgba(147,197,253,0.75)" />
      <circle cx="38" cy="22" r="4" fill="rgba(147,197,253,0.75)" />
      <circle cx="26" cy="22" r="1.8" fill="rgba(96,165,250,1)" />
      <circle cx="38" cy="22" r="1.8" fill="rgba(96,165,250,1)" />
      <path d="M26 30 Q32 35 38 30" stroke="rgba(147,197,253,0.6)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="32" y1="12" x2="32" y2="6" stroke="rgba(96,165,250,0.5)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="4.5" r="2.5" fill="rgba(96,165,250,0.7)" />
      <rect x="22" y="38" width="20" height="14" rx="4" fill="rgba(96,165,250,0.14)" stroke="rgba(96,165,250,0.25)" strokeWidth="1" />
      <circle cx="28" cy="44" r="1.8" fill="rgba(147,197,253,0.4)" />
      <circle cx="36" cy="44" r="1.8" fill="rgba(147,197,253,0.3)" />
      <path d="M8 28L9.5 24L11 28L15 29.5L11 31L9.5 35L8 31L4 29.5L8 28Z" fill="rgba(96,165,250,0.5)" />
      <path d="M50 18L51 15.5L52 18L54.5 19L52 20L51 22.5L50 20L47.5 19L50 18Z" fill="rgba(96,165,250,0.4)" />
    </svg>
  )
}

function IllustrationLaunch() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 6C32 6 44 17 44 36L32 47L20 36C20 17 32 6 32 6Z" fill="rgba(52,211,153,0.22)" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" />
      <circle cx="32" cy="27" r="5.5" fill="rgba(110,231,183,0.3)" stroke="rgba(52,211,153,0.55)" strokeWidth="1.5" />
      <path d="M26 45Q30 56 32 51Q34 56 38 45" fill="rgba(251,146,60,0.45)" />
      <path d="M20 36L14 42L20 42Z" fill="rgba(52,211,153,0.28)" />
      <path d="M44 36L50 42L44 42Z" fill="rgba(52,211,153,0.28)" />
      <circle cx="11" cy="18" r="2" fill="rgba(52,211,153,0.5)" />
      <circle cx="55" cy="14" r="1.5" fill="rgba(52,211,153,0.4)" />
      <circle cx="6" cy="44" r="2" fill="rgba(52,211,153,0.4)" />
      <circle cx="58" cy="36" r="1.5" fill="rgba(52,211,153,0.35)" />
      <rect x="4" y="48" width="13" height="14" rx="2" fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.28)" strokeWidth="1" />
      <line x1="7" y1="54" x2="14" y2="54" stroke="rgba(110,231,183,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="58" x2="14" y2="58" stroke="rgba(110,231,183,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const steps = [
  {
    num: '01',
    title: 'Find a real problem',
    desc: 'Describe your domain and our AI scans thousands of forums, reviews, and interviews to identify real pain points people will pay to solve.',
    illustration: <IllustrationProblem />,
    gradFrom: 'rgba(139,92,246,0.14)',
    gradTo: 'rgba(109,40,217,0.05)',
    border: 'rgba(139,92,246,0.18)',
  },
  {
    num: '02',
    title: 'AI Finds opportunities',
    desc: 'Our AI scores each idea by market size, competition level, and technical feasibility — surfacing only the highest-potential ones.',
    illustration: <IllustrationAI />,
    gradFrom: 'rgba(59,130,246,0.14)',
    gradTo: 'rgba(37,99,235,0.05)',
    border: 'rgba(59,130,246,0.18)',
  },
  {
    num: '03',
    title: 'Launch your SaaS',
    desc: 'Receive a full blueprint: landing page copy, pricing strategy, MVP features, and a 90-day roadmap. Ready to ship.',
    illustration: <IllustrationLaunch />,
    gradFrom: 'rgba(52,211,153,0.12)',
    gradTo: 'rgba(5,150,105,0.04)',
    border: 'rgba(52,211,153,0.16)',
  },
]

/* ─── inline app preview panel (right column) ─── */
function AppPreviewPanel() {
  const rows = [
    { name: 'AI Invoice Scanner', mrr: '$8.2K', badge: '🔥 Top', badgeColor: '#c4b5fd', badgeBg: 'rgba(139,92,246,0.3)', dot: '#a78bfa' },
    { name: 'SaaS Monitoring Pro', mrr: '$5.1K', badge: '✓ Bon', badgeColor: '#34d399', badgeBg: 'rgba(52,211,153,0.18)', dot: '#34d399' },
    { name: 'Churn Predictor AI', mrr: '$4.7K', badge: '✓ Bon', badgeColor: '#34d399', badgeBg: 'rgba(52,211,153,0.18)', dot: '#60a5fa' },
    { name: 'B2B Analytics Tool', mrr: '$3.9K', badge: '✓ Bon', badgeColor: '#34d399', badgeBg: 'rgba(52,211,153,0.18)', dot: '#60a5fa' },
  ]

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #131228 0%, #0f0e20 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
      }}
    >
      {/* top bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 5, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(139,92,246,0.7)' }} />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>app.saasgenrt.com/dashboard</span>
        </div>
      </div>

      {/* content */}
      <div style={{ padding: '20px 20px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 3 }}>Mes idées SaaS</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>10 idées générées • Secteur: B2B SaaS</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ fontSize: 10.5, padding: '4px 12px', borderRadius: 99, background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd', fontWeight: 500 }}>Filtrer</div>
            <div style={{ fontSize: 10.5, padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>Trier</div>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { l: 'MRR Potentiel', v: '$24K', c: '#34d399', bg: 'rgba(52,211,153,0.1)', br: 'rgba(52,211,153,0.2)' },
            { l: 'Idées Top', v: '3', c: '#a78bfa', bg: 'rgba(167,139,250,0.1)', br: 'rgba(167,139,250,0.2)' },
            { l: 'Score Moyen', v: '8.9', c: '#60a5fa', bg: 'rgba(96,165,250,0.1)', br: 'rgba(96,165,250,0.2)' },
          ].map((s) => (
            <div key={s.l} style={{ background: s.bg, border: `1px solid ${s.br}`, borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{s.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* table head */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px', gap: 6, padding: '0 10px', marginBottom: 6 }}>
          {['IDÉE', 'MRR', 'TAG'].map((h) => (
            <span key={h} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 60px',
                gap: 6,
                alignItems: 'center',
                padding: '9px 10px',
                borderRadius: 9,
                background: i === 0 ? 'rgba(139,92,246,0.14)' : 'rgba(255,255,255,0.03)',
                border: i === 0 ? '1px solid rgba(139,92,246,0.24)' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: row.dot }} />
                <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#34d399' }}>{row.mrr}</span>
              <span style={{ fontSize: 9.5, fontWeight: 600, padding: '3px 7px', borderRadius: 5, background: row.badgeBg, color: row.badgeColor, whiteSpace: 'nowrap' }}>{row.badge}</span>
            </div>
          ))}
          {/* locked rows */}
          {[0, 1].map((_, i) => (
            <div
              key={`locked-${i}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 60px',
                gap: 6,
                alignItems: 'center',
                padding: '9px 10px',
                borderRadius: 9,
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.03)',
                filter: 'blur(0px)',
              }}
            >
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.12)', filter: 'blur(5px)', userSelect: 'none' }}>████████████████</span>
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.12)', filter: 'blur(5px)' }}>████</span>
              <span style={{ fontSize: 9.5, padding: '3px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.18)' }}>🔒</span>
            </div>
          ))}
        </div>

        {/* unlock banner */}
        <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.12))', border: '1px solid rgba(139,92,246,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>7 idées verrouillées</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)' }}>Débloquer pour €9</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 99, background: 'rgba(139,92,246,0.85)', color: 'white', cursor: 'pointer' }}>€9 →</div>
        </div>
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden"
      style={{ background: '#090B11', paddingTop: '96px', paddingBottom: '96px' }}
    >
      {/* Top line divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '640px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6">

        {/* ─── Section header (full-width centered) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            className="font-bold text-white"
            style={{ fontSize: '40px', letterSpacing: '-0.025em', lineHeight: 1.1 }}
          >
            How{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #c4b5fd 20%, #8b5cf6 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SaaSGenrt
            </span>{' '}
            works
          </h2>
        </motion.div>

        {/* ─── 2-col layout ─── */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-14 items-start">

          {/* LEFT: 3 stacked step cards */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative overflow-hidden"
                style={{
                  borderRadius: '16px',
                  padding: '22px 24px',
                  background: `linear-gradient(135deg, ${step.gradFrom} 0%, ${step.gradTo} 100%)`,
                  border: `1px solid ${step.border}`,
                }}
              >
                {/* Number watermark */}
                <div
                  className="absolute top-3 right-4 font-black leading-none select-none pointer-events-none"
                  style={{ fontSize: '56px', color: step.gradFrom.replace('0.14)', '0.10)').replace('0.12)', '0.08)') }}
                >
                  {step.num}
                </div>

                <div className="flex items-start gap-5 relative z-10">
                  {/* Illustration */}
                  <div className="flex-shrink-0 mt-1">{step.illustration}</div>

                  {/* Text */}
                  <div>
                    <div
                      className="inline-flex items-center rounded-full mb-2"
                      style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.38)', fontWeight: 500, padding: '2px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      Step {step.num}
                    </div>
                    <h3
                      className="text-white font-semibold mb-1.5"
                      style={{ fontSize: '16px', letterSpacing: '-0.015em' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{ fontSize: '13px', lineHeight: '1.65', color: 'rgba(255,255,255,0.48)' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: app preview panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <AppPreviewPanel />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
