'use client'

import { motion } from 'framer-motion'

/* ─── SVG Illustrations ─── */

function IllustrationProblem() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Person silhouette */}
      <circle cx="28" cy="22" r="10" fill="rgba(167,139,250,0.35)" />
      <path d="M12 58C12 46 19 40 28 40C37 40 44 46 44 58" stroke="rgba(167,139,250,0.4)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Magnifying glass */}
      <circle cx="53" cy="50" r="10" stroke="rgba(167,139,250,0.6)" strokeWidth="2.5" fill="rgba(124,58,237,0.1)" />
      <line x1="60" y1="57" x2="67" y2="64" stroke="rgba(167,139,250,0.6)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Search lines inside glass */}
      <line x1="48" y1="48" x2="58" y2="48" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="52" x2="55" y2="52" stroke="rgba(167,139,250,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Floating dots */}
      <circle cx="8" cy="38" r="2.5" fill="rgba(167,139,250,0.4)" />
      <circle cx="56" cy="18" r="2" fill="rgba(167,139,250,0.3)" />
      <circle cx="64" cy="30" r="1.5" fill="rgba(167,139,250,0.25)" />
    </svg>
  )
}

function IllustrationAI() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Robot head */}
      <rect x="22" y="14" width="28" height="26" rx="8" fill="rgba(96,165,250,0.25)" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="31" cy="25" r="4.5" fill="rgba(147,197,253,0.7)" />
      <circle cx="41" cy="25" r="4.5" fill="rgba(147,197,253,0.7)" />
      <circle cx="31" cy="25" r="2" fill="rgba(96,165,250,1)" />
      <circle cx="41" cy="25" r="2" fill="rgba(96,165,250,1)" />
      {/* Smile */}
      <path d="M30 34 Q36 39 42 34" stroke="rgba(147,197,253,0.6)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Antenna */}
      <line x1="36" y1="14" x2="36" y2="7" stroke="rgba(96,165,250,0.5)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="5.5" r="2.5" fill="rgba(96,165,250,0.7)" />
      {/* Body */}
      <rect x="26" y="43" width="20" height="16" rx="5" fill="rgba(96,165,250,0.15)" stroke="rgba(96,165,250,0.25)" strokeWidth="1" />
      {/* Body buttons */}
      <circle cx="33" cy="50" r="2" fill="rgba(147,197,253,0.4)" />
      <circle cx="39" cy="50" r="2" fill="rgba(147,197,253,0.3)" />
      {/* Sparkles */}
      <path d="M10 32L11.5 28L13 32L17 33.5L13 35L11.5 39L10 35L6 33.5L10 32Z" fill="rgba(96,165,250,0.5)" />
      <path d="M56 20L57 17.5L58 20L60.5 21L58 22L57 24.5L56 22L53.5 21L56 20Z" fill="rgba(96,165,250,0.4)" />
      <circle cx="62" cy="52" r="2" fill="rgba(96,165,250,0.35)" />
    </svg>
  )
}

function IllustrationLaunch() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rocket */}
      <path d="M36 8C36 8 50 20 50 40L36 52L22 40C22 20 36 8 36 8Z" fill="rgba(52,211,153,0.25)" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" />
      {/* Rocket window */}
      <circle cx="36" cy="30" r="6" fill="rgba(110,231,183,0.35)" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" />
      {/* Flames */}
      <path d="M29 50Q33 62 36 56Q39 62 43 50" fill="rgba(251,146,60,0.5)" />
      {/* Left fin */}
      <path d="M22 40L16 46L22 46L22 40Z" fill="rgba(52,211,153,0.3)" />
      {/* Right fin */}
      <path d="M50 40L56 46L50 46L50 40Z" fill="rgba(52,211,153,0.3)" />
      {/* Stars */}
      <circle cx="14" cy="20" r="2" fill="rgba(52,211,153,0.5)" />
      <circle cx="60" cy="16" r="1.5" fill="rgba(52,211,153,0.4)" />
      <circle cx="8" cy="48" r="2" fill="rgba(52,211,153,0.4)" />
      <circle cx="64" cy="38" r="1.5" fill="rgba(52,211,153,0.35)" />
      {/* Small doc */}
      <rect x="4" y="52" width="14" height="16" rx="2" fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
      <line x1="7" y1="58" x2="15" y2="58" stroke="rgba(110,231,183,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="62" x2="15" y2="62" stroke="rgba(110,231,183,0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="66" x2="12" y2="66" stroke="rgba(110,231,183,0.25)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const steps = [
  {
    num: '01',
    title: 'Find a real problem',
    desc: 'Describe your domain and our AI scans thousands of forums, reviews, and jobs-to-be-done interviews to pinpoint real pain points people will pay to solve.',
    illustration: <IllustrationProblem />,
    gradFrom: 'rgba(124,58,237,0.18)',
    gradTo: 'rgba(109,40,217,0.06)',
    border: 'rgba(124,58,237,0.2)',
    numColor: 'rgba(124,58,237,0.12)',
  },
  {
    num: '02',
    title: 'AI Finds opportunities',
    desc: 'Watch as our AI surfaces the highest-potential ideas, scores each one by market size, competition level, and technical feasibility.',
    illustration: <IllustrationAI />,
    gradFrom: 'rgba(59,130,246,0.18)',
    gradTo: 'rgba(37,99,235,0.06)',
    border: 'rgba(59,130,246,0.2)',
    numColor: 'rgba(59,130,246,0.12)',
  },
  {
    num: '03',
    title: 'Launch your SaaS',
    desc: "Get a full blueprint: landing page copy, pricing strategy, MVP feature list, and a 90-day go-to-market roadmap. You're ready to ship.",
    illustration: <IllustrationLaunch />,
    gradFrom: 'rgba(52,211,153,0.15)',
    gradTo: 'rgba(5,150,105,0.05)',
    border: 'rgba(52,211,153,0.18)',
    numColor: 'rgba(52,211,153,0.10)',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden" style={{ background: '#08080f' }}>
      {/* Faint divider glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.35), transparent)' }}
      />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-brand-400 text-[12px] font-semibold tracking-widest uppercase mb-3">
            Comment ça marche
          </p>
          <h2 className="text-[38px] font-bold tracking-[-0.025em] text-white">
            How{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%)',
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

        {/* 3-column cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${step.gradFrom} 0%, ${step.gradTo} 100%)`,
                border: `1px solid ${step.border}`,
              }}
            >
              {/* Big step number watermark */}
              <div
                className="absolute top-4 right-5 text-[72px] font-black leading-none select-none pointer-events-none"
                style={{ color: step.numColor }}
              >
                {step.num}
              </div>

              {/* Illustration */}
              <div className="mb-4 relative z-10">{step.illustration}</div>

              {/* Step chip */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] mb-3"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-white/40 text-[10.5px] font-medium">Step {step.num}</span>
              </div>

              {/* Text */}
              <h3 className="text-white font-semibold text-[16.5px] tracking-[-0.015em] mb-2 relative z-10">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.65] relative z-10" style={{ color: 'rgba(255,255,255,0.48)' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
