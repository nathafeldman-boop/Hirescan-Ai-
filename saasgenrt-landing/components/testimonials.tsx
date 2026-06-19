'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    initials: 'SC',
    name: 'Sarah Chen',
    role: 'Co-founder, DataSync',
    quote: "SaaSGenrt surfaced ideas I never would have found on my own. In 3 days I had a validated concept. Now at $2.4K MRR after just 6 weeks.",
    mrr: '$2.4K MRR',
    avatarFrom: '#8B5CF6',
    avatarTo: '#6d28d9',
    stars: 5,
  },
  {
    initials: 'MW',
    name: 'Marcus Webb',
    role: 'Founder, FlowCast',
    quote: "The competitor analysis alone saved me 3 months of research. I shipped my MVP in 4 weeks and hit profitability on month one.",
    mrr: '$4.1K MRR',
    avatarFrom: '#0ea5e9',
    avatarTo: '#0369a1',
    stars: 5,
  },
  {
    initials: 'LR',
    name: 'Léa Rousseau',
    role: 'Founder, Taskify',
    quote: "I found my niche in under 10 minutes. The AI pricing recommendations were spot on. This is the most useful SaaS tool I've ever bought.",
    mrr: '$890 MRR',
    avatarFrom: '#ec4899',
    avatarTo: '#be185d',
    stars: 5,
  },
]

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1l1.545 3.13 3.455.5-2.5 2.437.59 3.433L7 8.75l-3.09 1.75.59-3.433L2 4.63l3.455-.5L7 1z"
            fill="#FCD34D"
          />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden"
      style={{ background: '#090B11', paddingTop: '96px', paddingBottom: '96px' }}
    >
      {/* Divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: '640px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.32), transparent)' }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full mb-4"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', padding: '4px 14px' }}
          >
            <span style={{ fontSize: '11px', color: '#c4b5fd', fontWeight: 500, letterSpacing: '0.04em' }}>TRUSTED BY FOUNDERS</span>
          </div>
          <h2
            className="font-bold text-white"
            style={{ fontSize: '40px', letterSpacing: '-0.025em', lineHeight: 1.1 }}
          >
            Built for builders who{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #c4b5fd 20%, #8B5CF6 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ship
            </span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', marginTop: '10px' }}>
            Real founders. Real revenue. Zero fluff.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                borderRadius: '20px',
                padding: '28px',
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Stars */}
              <div style={{ marginBottom: '16px' }}>
                <Stars />
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: 'rgba(255,255,255,0.72)',
                  flex: 1,
                  marginBottom: '24px',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.avatarFrom}, ${t.avatarTo})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'white',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)' }}>{t.role}</div>
                  </div>
                </div>
                {/* MRR badge */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#39FF88',
                    background: 'rgba(57,255,136,0.1)',
                    border: '1px solid rgba(57,255,136,0.22)',
                    padding: '4px 10px',
                    borderRadius: 99,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.mrr}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
