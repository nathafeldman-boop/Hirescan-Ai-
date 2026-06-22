'use client'

import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const lead = {
  initial: 'S',
  name: 'Sarah Chen',
  role: 'Fondatrice · DataSync',
  quote: "J'ai tourné en rond pendant un an. SaaSGenrt m'a sorti une idée que je n'aurais jamais cherchée, chiffrée et validée. Trois jours plus tard je codais. Aujourd'hui : 2 400 € de MRR en six semaines.",
  mrr: '2 400 €',
  mrrLabel: 'MRR · 6 semaines',
}

const supporting = [
  {
    initial: 'M',
    name: 'Marcus Webb',
    role: 'Fondateur · FlowCast',
    quote: "L'analyse concurrentielle seule m'a fait gagner trois mois. MVP shippé en quatre semaines, rentable dès le premier.",
  },
  {
    initial: 'L',
    name: 'Léa Rousseau',
    role: 'Fondatrice · Taskify',
    quote: "Ma niche trouvée en dix minutes, le pricing pile au bon endroit. Le truc le plus utile que j'ai acheté cette année.",
  },
]

function Stars({ color = 'var(--signal)' }: { color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 2 }} aria-label="5 sur 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 1l1.545 3.13 3.455.5-2.5 2.437.59 3.433L7 8.75l-3.09 1.75.59-3.433L2 4.63l3.455-.5L7 1z" fill={color} />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ initial, onDark = false }: { initial: string; onDark?: boolean }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 15, fontWeight: 700,
      background: onDark ? 'oklch(0.575 0.20 32 / 0.22)' : 'var(--signal-wash)',
      color: onDark ? 'white' : 'var(--signal-ink)',
      border: onDark ? '1px solid oklch(0.575 0.20 32 / 0.4)' : '1px solid oklch(0.575 0.20 32 / 0.18)',
    }}>
      {initial}
    </div>
  )
}

export function Testimonials() {
  const reduce = useReducedMotion()
  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, delay, ease: EASE },
  })

  return (
    <section id="proof" className="relative" style={{ background: 'var(--bg-2)', paddingTop: 'clamp(80px, 10vw, 128px)', paddingBottom: 'clamp(80px, 10vw, 128px)' }}>
      <div className="max-w-[1180px] mx-auto px-6">

        <motion.div {...reveal(0)} className="mb-14 max-w-[640px]">
          <h2 className="font-display text-balance" style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.02, color: 'var(--ink)' }}>
            Des fondateurs qui<br />ont arrêté de deviner.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
            De vraies personnes. De vrais revenus. Zéro bullshit.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-5 items-stretch">

          {/* Lead — dark panel, art-directed for contrast */}
          <motion.figure {...reveal(0.05)} className="lg:col-span-3" style={{
            margin: 0, borderRadius: 22, padding: 'clamp(28px, 3.5vw, 40px)',
            background: 'var(--ink-panel)', color: 'var(--on-ink)',
            display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)',
          }}>
            <Stars color="var(--signal-bright)" />
            <blockquote className="font-display" style={{ fontSize: 'clamp(20px, 2.2vw, 27px)', fontWeight: 500, lineHeight: 1.32, letterSpacing: '-0.02em', margin: '22px 0 0', flex: 1, textWrap: 'pretty' }}>
              “{lead.quote}”
            </blockquote>
            <figcaption style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 32, paddingTop: 26, borderTop: '1px solid var(--on-ink-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <Avatar initial={lead.initial} onDark />
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{lead.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--on-ink-muted)' }}>{lead.role}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--signal-bright)', letterSpacing: '-0.02em', lineHeight: 1 }}>{lead.mrr}</div>
                <div style={{ fontSize: 11, color: 'var(--on-ink-muted)', marginTop: 3 }}>{lead.mrrLabel}</div>
              </div>
            </figcaption>
          </motion.figure>

          {/* Supporting — lighter, stacked */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {supporting.map((t, i) => (
              <motion.figure key={t.name} {...reveal(0.12 + i * 0.08)} style={{
                margin: 0, borderRadius: 18, padding: 24, background: 'var(--surface)',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', flex: 1,
                display: 'flex', flexDirection: 'column',
              }}>
                <Stars />
                <blockquote className="text-pretty" style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '14px 0 18px', flex: 1 }}>
                  “{t.quote}”
                </blockquote>
                <figcaption style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <Avatar initial={t.initial} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
