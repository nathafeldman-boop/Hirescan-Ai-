'use client'

import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const testimonials = [
  {
    initial: 'S',
    name: 'Sarah Chen',
    role: 'Co-fondatrice, DataSync',
    quote: "SaaSGenrt m'a fait trouver des idées que je n'aurais jamais cherchées. En 3 jours j'avais un concept validé. Aujourd'hui $2.4K MRR après 6 semaines.",
    color: 'var(--primary)',
  },
  {
    initial: 'M',
    name: 'Marcus Webb',
    role: 'Fondateur, FlowCast',
    quote: "L'analyse concurrentielle seule m'a économisé 3 mois de recherche. J'ai shippé mon MVP en 4 semaines et atteint la profitabilité dès le premier mois.",
    color: 'oklch(0.65 0.14 260)',
  },
  {
    initial: 'L',
    name: 'Léa Rousseau',
    role: 'Fondatrice, Taskify',
    quote: "J'ai trouvé ma niche en moins de 10 minutes. Les recommandations de pricing étaient exactement les bonnes. L'outil SaaS le plus utile que j'ai jamais acheté.",
    color: 'var(--accent)',
  },
]

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M7 1l1.545 3.13 3.455.5-2.5 2.437.59 3.433L7 8.75l-3.09 1.75.59-3.433L2 4.63l3.455-.5L7 1z" fill="oklch(0.82 0.15 85)" />
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
      style={{ background: 'var(--bg)', paddingTop: '96px', paddingBottom: '96px' }}
    >
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '480px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-14"
        >
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-0.028em', lineHeight: 1.1, textWrap: 'balance' }}
          >
            Fait pour les builders qui{' '}
            <span style={{ color: 'var(--primary)' }}>shippent</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginTop: '12px' }}>
            De vrais fondateurs. De vrais revenus. Zéro bullshit.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
              style={{
                borderRadius: '16px',
                padding: '28px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stars />

              <p style={{
                fontSize: '14px',
                lineHeight: '1.7',
                color: 'oklch(0.97 0 0 / 0.72)',
                flex: 1,
                margin: '18px 0 24px',
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'oklch(0.18 0 0)',
                  border: `1.5px solid ${t.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: t.color,
                }}>
                  {t.initial}
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
