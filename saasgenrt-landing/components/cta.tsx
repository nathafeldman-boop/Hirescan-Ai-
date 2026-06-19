'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden"
      style={{ background: '#090B11', paddingTop: '80px', paddingBottom: '96px' }}
    >
      {/* Section divider line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: '640px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.32), transparent)' }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden text-center"
          style={{
            borderRadius: '28px',
            padding: '72px 48px',
            background: 'linear-gradient(145deg, rgba(139,92,246,0.13) 0%, rgba(109,40,217,0.06) 60%, rgba(255,255,255,0.025) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          {/* Top-right corner glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              right: 0,
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)',
              transform: 'translate(35%, -35%)',
            }}
          />
          {/* Bottom-left corner glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: 0,
              left: 0,
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)',
              transform: 'translate(-35%, 35%)',
            }}
          />

          {/* Headline */}
          <h2
            className="font-bold text-white relative z-10"
            style={{ fontSize: 'clamp(32px, 4vw, 44px)', letterSpacing: '-0.028em', lineHeight: '1.12', marginBottom: '16px' }}
          >
            Ready to build your
            <br />
            <span className="gradient-text">next SaaS?</span>
          </h2>

          {/* Sub */}
          <p
            className="relative z-10 mx-auto"
            style={{
              fontSize: '15.5px',
              color: 'rgba(255,255,255,0.48)',
              lineHeight: '1.65',
              maxWidth: '440px',
              marginBottom: '36px',
            }}
          >
            Join thousands of indie builders who already found
            their profitable SaaS idea with SaaSGenrt.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap relative z-10">
            <a
              href="/builder"
              className="flex items-center gap-2 text-white font-semibold transition-all"
              style={{
                fontSize: '14px',
                padding: '12px 28px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #8B5CF6, #6d28d9)',
                boxShadow: '0 8px 32px rgba(139,92,246,0.42), inset 0 1px 0 rgba(255,255,255,0.13)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(139,92,246,0.52), inset 0 1px 0 rgba(255,255,255,0.13)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(139,92,246,0.42), inset 0 1px 0 rgba(255,255,255,0.13)'
              }}
            >
              Start Building Free
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center font-medium transition-all"
              style={{
                fontSize: '14px',
                padding: '11px 24px',
                borderRadius: '14px',
                color: 'rgba(255,255,255,0.7)',
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
              See how it works
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-7 flex-wrap relative z-10" style={{ marginTop: '28px' }}>
            {['No credit card required', 'First idea is free', 'Cancel anytime'].map((t) => (
              <span key={t} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>✓ {t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
