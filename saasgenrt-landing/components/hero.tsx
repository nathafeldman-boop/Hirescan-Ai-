'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Check } from 'lucide-react'
import { DashboardMockup } from './dashboard-mockup'

const trustItems = [
  'No credit card',
  'First idea free',
  '10+ proven solutions',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#08080f]">
      {/* Radial purple glow — matches right side of hero */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          right: '-5%',
          width: '680px',
          height: '680px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.28) 0%, rgba(109,40,217,0.12) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(1px)',
        }}
      />
      {/* Secondary softer glow left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-100" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-28 pb-16">
        <div className="flex items-center gap-10 xl:gap-16">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex-1 max-w-[520px]">

            {/* Badge */}
            <motion.div
              {...fadeUp(0.15)}
              className="inline-flex items-center gap-2 rounded-full mb-6 px-3 py-[5px]"
              style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              <span className="w-[5px] h-[5px] rounded-full bg-brand-400 animate-pulse" />
              <span className="text-brand-300 text-[12px] font-medium tracking-[-0.01em]">
                Powered by AI · 100% validated ideas
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              {...fadeUp(0.25)}
              className="text-[50px] xl:text-[56px] font-bold leading-[1.08] tracking-[-0.03em] text-white mb-5"
            >
              Build a{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #7c3aed 60%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SaaS
              </span>{' '}
              people
              <br />
              actually pay for.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.35)}
              className="text-[16.5px] leading-[1.65] mb-8"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Discover profitable SaaS ideas, validate them
              <br className="hidden lg:block" />
              and launch your first better than ever.
            </motion.p>

            {/* CTA buttons */}
            <motion.div {...fadeUp(0.42)} className="flex items-center gap-3 mb-8 flex-wrap">
              <a
                href="#pricing"
                className="flex items-center gap-2 text-white text-[14px] font-semibold px-[22px] py-[11px] rounded-full transition-all"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  boxShadow: '0 8px 24px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
              >
                Start Building
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                className="flex items-center gap-2.5 text-[14px] font-medium px-5 py-[10px] rounded-full transition-all"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                <div
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <Play className="w-[10px] h-[10px] fill-white text-white" style={{ marginLeft: '1px' }} />
                </div>
                Watch Demo
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div {...fadeUp(0.5)} className="flex items-center gap-5 flex-wrap">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.25)' }}
                  >
                    <Check className="w-2.5 h-2.5 text-brand-400" strokeWidth={3} />
                  </div>
                  <span className="text-[12.5px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN — Dashboard Mockup ─── */}
          <div className="hidden lg:flex flex-shrink-0 justify-center items-center" style={{ minWidth: 0 }}>
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
