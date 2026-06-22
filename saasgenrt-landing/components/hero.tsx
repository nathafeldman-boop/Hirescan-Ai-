'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { FloatingCards } from './floating-cards'

const EASE = [0.22, 1, 0.36, 1] as const

const trustItems = [
  'Sans carte de crédit',
  'Première idée gratuite',
  'Résultats en 10 min',
]

export function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  })

  return (
    <section className="relative flex items-center overflow-hidden" style={{ background: 'var(--bg)', minHeight: '100svh' }}>
      <div className="absolute inset-0 pointer-events-none dot-field" aria-hidden />

      <div className="relative z-10 max-w-[1180px] mx-auto px-6 w-full pt-32 pb-20 lg:pb-28">
        <div className="flex items-center gap-10 xl:gap-16">

          {/* LEFT */}
          <div className="flex-1 min-w-0" style={{ maxWidth: 600 }}>

            <motion.div {...rise(0.05)} className="inline-flex items-center gap-2 mb-7"
              style={{ padding: '5px 12px 5px 8px', borderRadius: 99, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: '50%', background: 'var(--signal-wash)', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--signal)' }} />
              </span>
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 500 }}>
                Déjà <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>2 400+</strong> fondateurs ont trouvé leur idée
              </span>
            </motion.div>

            <motion.h1
              {...rise(0.12)}
              className="font-display"
              style={{
                fontSize: 'clamp(40px, 5.6vw, 70px)',
                lineHeight: 0.98,
                letterSpacing: '-0.035em',
                fontWeight: 800,
                color: 'var(--ink)',
                textWrap: 'balance',
                marginBottom: 22,
              }}
            >
              Trouve un SaaS<br />
              que les gens{' '}
              <span style={{ color: 'var(--signal)' }}>paient</span> vraiment.
            </motion.h1>

            <motion.p
              {...rise(0.22)}
              className="text-pretty"
              style={{ fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.6, color: 'var(--muted)', marginBottom: 32, maxWidth: '48ch' }}
            >
              Pas une idée de plus dans ton carnet. Une idée <strong style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>validée</strong>,
              un pricing, et un plan de lancement clair — en 10 minutes, pas en 6 mois.
            </motion.p>

            <motion.div {...rise(0.3)} className="flex items-center gap-3 flex-wrap mb-9">
              <a
                href="/builder"
                className="group flex items-center gap-2 transition-all"
                style={{
                  fontSize: 15, fontWeight: 600, padding: '14px 24px', borderRadius: 13,
                  background: 'var(--signal)', color: 'white', boxShadow: 'var(--shadow-md)', textDecoration: 'none',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                Trouver mon idée
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" style={{ width: 17, height: 17 }} strokeWidth={2.5} />
              </a>

              <a
                href="#how-it-works"
                className="flex items-center font-medium transition-colors"
                style={{ fontSize: 15, padding: '14px 18px', borderRadius: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--signal-ink)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-soft)')}
              >
                Comment ça marche →
              </a>
            </motion.div>

            <motion.div {...rise(0.42)} className="flex items-center gap-x-5 gap-y-2 flex-wrap">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check style={{ width: 14, height: 14, color: 'var(--signal)', flexShrink: 0 }} strokeWidth={3} />
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div
            className="hidden lg:block flex-shrink-0"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: EASE }}
          >
            <FloatingCards />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
