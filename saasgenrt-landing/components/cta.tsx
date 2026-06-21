'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

export function CTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden"
      style={{ background: 'var(--bg)', paddingTop: '80px', paddingBottom: '96px' }}
    >
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '480px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{
            borderRadius: '20px',
            padding: 'clamp(48px, 6vw, 72px) clamp(28px, 5vw, 64px)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <h2
            className="font-bold text-white"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              marginBottom: '16px',
              textWrap: 'balance',
            }}
          >
            Prêt à construire ton<br />
            <span style={{ color: 'var(--primary)' }}>prochain SaaS ?</span>
          </h2>

          <p
            className="mx-auto"
            style={{
              fontSize: '15.5px',
              color: 'var(--muted)',
              lineHeight: '1.65',
              maxWidth: '44ch',
              marginBottom: '36px',
            }}
          >
            Rejoins des centaines de makers qui ont trouvé leur idée SaaS rentable avec SaaSGenrt.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="/builder"
              className="flex items-center gap-2 font-semibold transition-all"
              style={{
                fontSize: '14px',
                padding: '12px 28px',
                borderRadius: '12px',
                background: 'var(--primary)',
                color: 'white',
                boxShadow: '0 6px 24px oklch(0.62 0.14 205 / 0.35)',
                textDecoration: 'none',
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
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center font-medium transition-all"
              style={{
                fontSize: '14px',
                padding: '11px 24px',
                borderRadius: '12px',
                color: 'oklch(0.97 0 0 / 0.7)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.35 0 0)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--ink)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.color = 'oklch(0.97 0 0 / 0.7)'
              }}
            >
              Voir comment ça marche
            </a>
          </div>

          <div className="flex items-center justify-center gap-7 flex-wrap" style={{ marginTop: '24px' }}>
            {['Sans carte de crédit', 'Première idée gratuite', 'Annulation libre'].map((t) => (
              <span key={t} style={{ fontSize: '12px', color: 'var(--muted)' }}>✓ {t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
