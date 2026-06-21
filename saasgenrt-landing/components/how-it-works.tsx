'use client'

import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Step illustrations (unchanged SVGs) ─── */
function IllustrationProblem() {
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="24" cy="20" r="9" fill="oklch(0.62 0.14 205 / 0.25)" />
      <path d="M10 52C10 41 17 36 24 36C31 36 38 41 38 52" stroke="oklch(0.62 0.14 205 / 0.5)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="48" cy="44" r="9" stroke="oklch(0.62 0.14 205 / 0.7)" strokeWidth="2.5" fill="oklch(0.62 0.14 205 / 0.1)" />
      <line x1="54.5" y1="50.5" x2="60" y2="56" stroke="oklch(0.62 0.14 205 / 0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="43" y1="42" x2="52" y2="42" stroke="oklch(0.62 0.14 205 / 0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="43" y1="46" x2="50" y2="46" stroke="oklch(0.62 0.14 205 / 0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IllustrationAI() {
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <rect x="18" y="12" width="28" height="24" rx="8" fill="oklch(0.62 0.14 205 / 0.18)" stroke="oklch(0.62 0.14 205 / 0.5)" strokeWidth="1.5" />
      <circle cx="26" cy="22" r="4" fill="oklch(0.62 0.14 205 / 0.6)" />
      <circle cx="38" cy="22" r="4" fill="oklch(0.62 0.14 205 / 0.6)" />
      <circle cx="26" cy="22" r="1.8" fill="var(--primary)" />
      <circle cx="38" cy="22" r="1.8" fill="var(--primary)" />
      <path d="M26 30 Q32 35 38 30" stroke="oklch(0.62 0.14 205 / 0.6)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="32" y1="12" x2="32" y2="6" stroke="oklch(0.62 0.14 205 / 0.5)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="4.5" r="2.5" fill="oklch(0.62 0.14 205 / 0.7)" />
    </svg>
  )
}

function IllustrationLaunch() {
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <path d="M32 6C32 6 44 17 44 36L32 47L20 36C20 17 32 6 32 6Z" fill="oklch(0.82 0.15 85 / 0.2)" stroke="oklch(0.82 0.15 85 / 0.5)" strokeWidth="1.5" />
      <circle cx="32" cy="27" r="5.5" fill="oklch(0.82 0.15 85 / 0.25)" stroke="oklch(0.82 0.15 85 / 0.55)" strokeWidth="1.5" />
      <path d="M26 45Q30 56 32 51Q34 56 38 45" fill="oklch(0.65 0.18 50 / 0.5)" />
    </svg>
  )
}

const steps = [
  {
    title: 'Trouve un vrai problème',
    desc: 'Décris ton domaine. Notre IA analyse forums, avis et interviews pour identifier les douleurs réelles — celles que les gens paient pour résoudre.',
    illustration: <IllustrationProblem />,
  },
  {
    title: "L'IA trouve les opportunités",
    desc: 'Chaque idée est scorée par taille de marché, niveau de concurrence et faisabilité technique. Tu vois seulement ce qui vaut ton temps.',
    illustration: <IllustrationAI />,
  },
  {
    title: 'Lance ton SaaS',
    desc: 'Blueprint complet : copy landing, stratégie de prix, features MVP et roadmap 90 jours. Prêt à shipper.',
    illustration: <IllustrationLaunch />,
  },
]

/* ─── App preview panel ─── */
function AppPreviewPanel() {
  const rows = [
    { name: 'AI Invoice Scanner', mrr: '$8.2K', tag: 'Top', tagColor: 'var(--primary)', tagBg: 'oklch(0.62 0.14 205 / 0.12)', dot: 'var(--primary)' },
    { name: 'SaaS Monitoring Pro', mrr: '$5.1K', tag: 'Bon', tagColor: 'var(--accent)', tagBg: 'oklch(0.82 0.15 85 / 0.12)', dot: 'var(--accent)' },
    { name: 'Churn Predictor AI', mrr: '$4.7K', tag: 'Bon', tagColor: 'var(--accent)', tagBg: 'oklch(0.82 0.15 85 / 0.12)', dot: 'oklch(0.55 0 0)' },
    { name: 'B2B Analytics Tool', mrr: '$3.9K', tag: 'Bon', tagColor: 'var(--accent)', tagBg: 'oklch(0.82 0.15 85 / 0.12)', dot: 'oklch(0.55 0 0)' },
  ]

  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      boxShadow: '0 24px 48px oklch(0 0 0 / 0.45)',
    }}>
      {/* Browser chrome */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'oklch(0.10 0 0)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 17, background: 'oklch(0.15 0 0)', border: '1px solid var(--border)', borderRadius: 4, marginLeft: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', opacity: 0.7 }} />
          <span style={{ fontSize: 9, color: 'oklch(0.97 0 0 / 0.25)', fontFamily: 'monospace' }}>app.saasgenrt.com</span>
        </div>
      </div>

      <div style={{ padding: '18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>Mes idées SaaS</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>10 idées • Secteur B2B</div>
          </div>
          <div style={{ fontSize: 10, padding: '4px 10px', borderRadius: 99, background: 'oklch(0.62 0.14 205 / 0.15)', border: '1px solid oklch(0.62 0.14 205 / 0.3)', color: 'var(--primary)', fontWeight: 500 }}>Filtrer</div>
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 56px', gap: 6, padding: '0 8px', marginBottom: 5 }}>
          {['Idée', 'MRR est.', 'Score'].map((h) => (
            <span key={h} style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.03em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rows.map((row, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 72px 56px',
              gap: 6,
              alignItems: 'center',
              padding: '8px',
              borderRadius: 8,
              background: i === 0 ? 'oklch(0.62 0.14 205 / 0.08)' : 'oklch(1 0 0 / 0.025)',
              border: `1px solid ${i === 0 ? 'oklch(0.62 0.14 205 / 0.2)' : 'oklch(1 0 0 / 0.04)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: row.dot }} />
                <span style={{ fontSize: 11.5, fontWeight: 500, color: 'oklch(0.97 0 0 / 0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)' }}>{row.mrr}</span>
              <span style={{ fontSize: 9.5, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: row.tagBg, color: row.tagColor }}>{row.tag}</span>
            </div>
          ))}
          {/* Locked */}
          {[0, 1].map((_, i) => (
            <div key={`l${i}`} style={{
              display: 'grid', gridTemplateColumns: '1fr 72px 56px', gap: 6,
              padding: '8px', borderRadius: 8,
              background: 'oklch(1 0 0 / 0.01)', border: '1px solid oklch(1 0 0 / 0.03)',
            }}>
              <span style={{ fontSize: 11, color: 'oklch(0.97 0 0 / 0.1)', filter: 'blur(5px)', userSelect: 'none' }}>████████████</span>
              <span style={{ fontSize: 11, color: 'oklch(0.97 0 0 / 0.1)', filter: 'blur(5px)' }}>████</span>
              <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'oklch(0.97 0 0 / 0.04)', color: 'oklch(0.97 0 0 / 0.2)' }}>🔒</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 9, background: 'oklch(0.62 0.14 205 / 0.1)', border: '1px solid oklch(0.62 0.14 205 / 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'oklch(0.97 0 0 / 0.75)', fontWeight: 500 }}>7 idées verrouillées</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>Débloquer pour €9</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99, background: 'var(--primary)', color: 'white', cursor: 'pointer' }}>€9 →</div>
        </div>
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden"
      style={{ background: 'var(--bg)', paddingTop: '96px', paddingBottom: '96px' }}
    >
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '480px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

      <div className="max-w-[1200px] mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-16"
        >
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-0.028em', lineHeight: 1.1, textWrap: 'balance' }}
          >
            Comment{' '}
            <span style={{ color: 'var(--primary)' }}>SaaSGenrt</span>{' '}
            fonctionne
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
                style={{ display: 'flex', gap: 20, paddingBottom: i < steps.length - 1 ? 32 : 0, position: 'relative' }}
              >
                {/* Left column: number + connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, color: 'var(--primary)',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 8 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingTop: 6, paddingBottom: i < steps.length - 1 ? 0 : 0 }}>
                  <div style={{ marginBottom: 10 }}>{step.illustration}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.015em' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', lineHeight: '1.65', color: 'var(--muted)', maxWidth: '40ch' }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
          >
            <AppPreviewPanel />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
