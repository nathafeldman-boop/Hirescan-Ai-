'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section id="cta" className="py-24 relative overflow-hidden" style={{ background: '#08080f' }}>
      {/* Faint divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }}
      />

      {/* Central purple glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(124,58,237,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden relative text-center py-16 px-8"
          style={{
            background: 'linear-gradient(145deg, rgba(124,58,237,0.14) 0%, rgba(109,40,217,0.07) 50%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          {/* Corner glows */}
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[200px] h-[200px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
              transform: 'translate(-30%, 30%)',
            }}
          />

          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 relative z-10"
            style={{
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.35)',
            }}
          >
            <Sparkles className="w-6 h-6 text-brand-400" />
          </div>

          {/* Headline */}
          <h2
            className="text-[40px] font-bold tracking-[-0.025em] text-white mb-4 relative z-10"
            style={{ lineHeight: '1.15' }}
          >
            Ready to build your
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              next SaaS?
            </span>
          </h2>

          {/* Subheading */}
          <p
            className="text-[16px] mb-9 max-w-[480px] mx-auto relative z-10 leading-[1.65]"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Join thousands of builders who already discovered their
            profitable SaaS idea with SaaSGenrt.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap relative z-10">
            <a
              href="#pricing"
              className="flex items-center gap-2 text-white text-[14px] font-semibold px-7 py-3.5 rounded-full transition-all"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                boxShadow: '0 8px 28px rgba(124,58,237,0.40), inset 0 1px 0 rgba(255,255,255,0.12)',
              }}
            >
              Start Building Free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-[14px] font-medium px-6 py-3.5 rounded-full transition-all"
              style={{
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              See how it works
            </a>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap relative z-10">
            {['No credit card required', 'First idea is free', 'Cancel anytime'].map((t) => (
              <span key={t} className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
