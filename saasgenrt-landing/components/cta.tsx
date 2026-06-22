'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

export function CTA() {
  const reduce = useReducedMotion()

  return (
    <section id="cta" className="relative" style={{ background: 'var(--bg)', paddingTop: 'clamp(20px, 4vw, 48px)', paddingBottom: 'clamp(80px, 9vw, 112px)' }}>
      <div className="max-w-[1180px] mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative overflow-hidden"
          style={{
            borderRadius: 28,
            padding: 'clamp(48px, 7vw, 88px) clamp(28px, 6vw, 72px)',
            background: 'var(--signal)',
            textAlign: 'center',
          }}
        >
          {/* subtle depth — warm darker wash from one corner, not a glow */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 100% 0%, oklch(0.45 0.16 30 / 0.35), transparent 55%)', pointerEvents: 'none' }} />

          <div className="relative">
            <h2 className="font-display text-balance" style={{ fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.98, color: 'white', marginBottom: 18 }}>
              Ton idée t'attend.<br />Va la chercher.
            </h2>
            <p className="mx-auto text-pretty" style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'oklch(1 0 0 / 0.9)', lineHeight: 1.6, maxWidth: '44ch', marginBottom: 36 }}>
              Rejoins les fondateurs qui ont arrêté de deviner et commencé à construire. La première idée est gratuite.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="/builder"
                className="group flex items-center gap-2 transition-all"
                style={{ fontSize: 15.5, fontWeight: 700, padding: '15px 28px', borderRadius: 13, background: 'white', color: 'var(--signal-ink)', textDecoration: 'none', boxShadow: 'var(--shadow-lg)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
              >
                Trouver mon idée gratuitement
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" style={{ width: 17, height: 17 }} strokeWidth={2.5} />
              </a>
            </div>

            <div className="flex items-center justify-center gap-x-7 gap-y-2 flex-wrap" style={{ marginTop: 26 }}>
              {['Sans carte de crédit', 'Première idée gratuite', 'Annulation libre'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check style={{ width: 14, height: 14, color: 'white' }} strokeWidth={3} />
                  <span style={{ fontSize: 13, color: 'oklch(1 0 0 / 0.9)', fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
