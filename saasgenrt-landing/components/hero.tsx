'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Check } from 'lucide-react'
import { FloatingCards } from './floating-cards'

const trustItems = [
  'No credit card required',
  'First project free',
  'AI-powered validation',
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#090B11' }}>

      {/* Background: large dominant purple glow (right-center) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          right: '-15%',
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.10) 30%, rgba(139,92,246,0.04) 60%, transparent 80%)',
        }}
      />
      {/* Secondary top-left accent glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-5%',
          left: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none grid-bg"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-32 pb-20">
        <div className="flex items-center gap-8 xl:gap-14">

          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 max-w-[560px]">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full mb-7"
              style={{
                background: 'rgba(139,92,246,0.14)',
                border: '1px solid rgba(139,92,246,0.28)',
                padding: '4px 12px',
              }}
            >
              <span className="w-[6px] h-[6px] rounded-full animate-pulse" style={{ background: '#a78bfa' }} />
              <span className="text-[12px] font-medium tracking-[0.01em]" style={{ color: '#c4b5fd' }}>
                Powered by AI
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-extrabold text-white mb-5"
              style={{
                fontSize: 'clamp(48px, 5.5vw, 72px)',
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
              }}
            >
              Build a{' '}
              <span className="gradient-text">
                SaaS
              </span>{' '}
              people
              <br />
              actually pay for.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: '16px',
                lineHeight: '1.65',
                color: 'rgba(255,255,255,0.52)',
                marginBottom: '32px',
              }}
            >
              Discover profitable SaaS ideas, validate them
              <br className="hidden lg:block" />
              and launch your first product faster than ever.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 flex-wrap mb-8"
            >
              <a
                href="#pricing"
                className="flex items-center gap-2 text-white font-semibold transition-all"
                style={{
                  fontSize: '14px',
                  padding: '12px 26px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6d28d9 100%)',
                  boxShadow: '0 0 0 1px rgba(139,92,246,0.5), 0 8px 32px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.14)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(139,92,246,0.6), 0 12px 40px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.14)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(139,92,246,0.5), 0 8px 32px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.14)'
                }}
              >
                Start Building
                <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2.5} />
              </a>

              <button
                className="flex items-center gap-2.5 font-medium transition-all"
                style={{
                  fontSize: '14px',
                  padding: '11px 20px',
                  borderRadius: '14px',
                  color: 'rgba(255,255,255,0.78)',
                  border: '1px solid rgba(255,255,255,0.11)',
                  background: 'rgba(255,255,255,0.04)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.11)'
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.09)' }}
                >
                  <Play style={{ width: '10px', height: '10px', marginLeft: '1px' }} className="fill-white text-white" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.54 }}
              className="flex items-center gap-5 flex-wrap"
            >
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check style={{ width: '13px', height: '13px', color: '#a78bfa', flexShrink: 0 }} strokeWidth={2.5} />
                  <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.42)' }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Floating Cards */}
          <motion.div
            className="hidden lg:block flex-shrink-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingCards />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
