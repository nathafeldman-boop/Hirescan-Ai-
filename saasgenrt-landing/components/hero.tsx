'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Check } from 'lucide-react'
import { FloatingCards } from './floating-cards'

const EASE = [0.22, 1, 0.36, 1] as const

const trustItems = [
  'Sans carte de crédit',
  'Première idée gratuite',
  'Résultats en 10 minutes',
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Grid only — no glow */}
      <div className="absolute inset-0 pointer-events-none grid-bg" style={{ opacity: 0.6 }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-32 pb-20">
        <div className="flex items-center gap-8 xl:gap-14">

          {/* LEFT */}
          <div className="flex-1 min-w-0 max-w-[580px]">

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
              className="font-extrabold text-white mb-5"
              style={{
                fontSize: 'clamp(44px, 5.5vw, 72px)',
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                textWrap: 'balance',
              }}
            >
              Build a{' '}
              <span style={{ color: 'var(--primary)' }}>SaaS</span>{' '}
              people<br />actually pay for.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
              style={{
                fontSize: '16px',
                lineHeight: '1.65',
                color: 'var(--muted)',
                marginBottom: '32px',
                maxWidth: '46ch',
              }}
            >
              Découvre des idées SaaS rentables, valide-les en quelques questions,
              et reçois un blueprint complet pour lancer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
              className="flex items-center gap-3 flex-wrap mb-8"
            >
              <a
                href="/builder"
                className="flex items-center gap-2 font-semibold transition-all"
                style={{
                  fontSize: '14px',
                  padding: '12px 26px',
                  borderRadius: '12px',
                  background: 'var(--primary)',
                  color: 'white',
                  boxShadow: '0 4px 20px oklch(0.62 0.14 205 / 0.35)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                Commencer gratuitement
                <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2.5} />
              </a>

              <button
                className="flex items-center gap-2.5 font-medium transition-all"
                style={{
                  fontSize: '14px',
                  padding: '11px 20px',
                  borderRadius: '12px',
                  color: 'oklch(0.97 0 0 / 0.75)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.35 0 0)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--ink)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.color = 'oklch(0.97 0 0 / 0.75)'
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: '28px', height: '28px', background: 'oklch(1 0 0 / 0.07)', border: '1px solid var(--border)' }}
                >
                  <Play style={{ width: '10px', height: '10px', marginLeft: '1px' }} className="fill-white text-white" />
                </div>
                Voir la démo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.48 }}
              className="flex items-center gap-5 flex-wrap"
            >
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check style={{ width: '13px', height: '13px', color: 'var(--primary)', flexShrink: 0 }} strokeWidth={2.5} />
                  <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div
            className="hidden lg:block flex-shrink-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          >
            <FloatingCards />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
