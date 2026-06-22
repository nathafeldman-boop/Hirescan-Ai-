'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check, TrendingUp } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className="font-display" style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{value}</span>
        {hint && <span style={{ fontSize: 10.5, color: 'var(--signal-ink)', fontWeight: 600 }}>{hint}</span>}
      </div>
    </div>
  )
}

export function FloatingCards() {
  const reduce = useReducedMotion()

  return (
    <div style={{ position: 'relative', width: 420, height: 440 }}>
      {/* Ghost card behind — depth without noise */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: 64, right: -8, width: 320, height: 300,
          borderRadius: 18, background: 'var(--bg-2)', border: '1px solid var(--border)',
          transform: 'rotate(5deg)', boxShadow: 'var(--shadow-sm)',
        }}
      />

      {/* Main artifact: une fiche idée validée */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -2.2 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        style={{
          position: 'absolute', top: 18, left: 0, width: 360,
          borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)', padding: '24px 24px 22px', zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--signal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check style={{ width: 11, height: 11, color: 'white' }} strokeWidth={3.5} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Idée validée</span>
          </div>
          <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--signal)', letterSpacing: '-0.01em' }}>9,1<span style={{ color: 'var(--muted)', fontWeight: 600 }}>/10</span></span>
        </div>

        <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 7 }}>
          Relances de paiement pour freelances
        </h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 20 }}>
          Détecte les factures en retard et relance les clients automatiquement, sans que tu aies l'air du méchant.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <Metric label="MRR potentiel" value="4,2 K€" hint="↑" />
          <Metric label="Concurrence" value="Faible" />
          <Metric label="Difficulté" value="2/5" />
        </div>
      </motion.div>

      {/* Small floating verdict chip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        style={{
          position: 'absolute', bottom: 36, right: 4, zIndex: 3,
          background: 'var(--ink-panel)', color: 'var(--on-ink)',
          borderRadius: 14, padding: '13px 17px', boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: 11, maxWidth: 230,
        }}
      >
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--signal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp style={{ width: 15, height: 15, color: 'white' }} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Verdict : fonce.</div>
          <div style={{ fontSize: 11, color: 'var(--on-ink-muted)', marginTop: 1 }}>Marché prêt, peu d'acteurs.</div>
        </div>
      </motion.div>
    </div>
  )
}
