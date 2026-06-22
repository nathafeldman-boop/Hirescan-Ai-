'use client'

import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const steps = [
  {
    n: '01',
    title: 'Dis-nous où tu cherches',
    desc: "Ton secteur, tes compétences, le temps que tu as. Trois minutes de questions, pas un formulaire de 40 champs.",
  },
  {
    n: '02',
    title: 'On creuse les vrais problèmes',
    desc: "On analyse forums, avis et discussions pour sortir les douleurs que les gens paient déjà pour résoudre — chiffrées et scorées.",
  },
  {
    n: '03',
    title: 'Tu repars avec un plan',
    desc: "Idée validée, pricing, features du MVP et roadmap de lancement. Tu sais exactement quoi faire lundi matin.",
  },
]

function AppPreviewPanel() {
  const rows = [
    { name: 'Relances de paiement', mrr: '4,2 K€', tag: 'Top', top: true },
    { name: 'Suivi de SEO local', mrr: '3,1 K€', tag: 'Solide', top: false },
    { name: 'Onboarding clients B2B', mrr: '2,8 K€', tag: 'Solide', top: false },
    { name: 'Analyse de churn', mrr: '2,4 K€', tag: 'Solide', top: false },
  ]

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
      {/* Browser chrome */}
      <div style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 19, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, marginLeft: 6, display: 'flex', alignItems: 'center', paddingLeft: 9, gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--signal)' }} />
          <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>app.saasgenrt.com/idees</span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>Mes idées validées</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>10 idées · secteur freelance / B2B</div>
          </div>
          <div style={{ fontSize: 10.5, padding: '5px 11px', borderRadius: 99, background: 'var(--signal-wash)', color: 'var(--signal-ink)', fontWeight: 600 }}>Trié par MRR</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 60px', gap: 8, padding: '0 10px', marginBottom: 6 }}>
          {['Idée', 'MRR est.', 'Verdict'].map((h) => (
            <span key={h} style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>{h}</span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {rows.map((row) => (
            <div key={row.name} style={{
              display: 'grid', gridTemplateColumns: '1fr 64px 60px', gap: 8, alignItems: 'center',
              padding: '10px', borderRadius: 10,
              background: row.top ? 'var(--signal-wash)' : 'var(--bg-2)',
              border: `1px solid ${row.top ? 'oklch(0.575 0.20 32 / 0.25)' : 'var(--border)'}`,
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
              <span className="font-display" style={{ fontSize: 12.5, fontWeight: 700, color: row.top ? 'var(--signal-ink)' : 'var(--ink-soft)' }}>{row.mrr}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: row.top ? 'var(--signal)' : 'var(--border)', color: row.top ? 'white' : 'var(--ink-soft)', textAlign: 'center' }}>{row.tag}</span>
            </div>
          ))}
          {[0, 1].map((i) => (
            <div key={`l${i}`} style={{ display: 'grid', gridTemplateColumns: '1fr 64px 60px', gap: 8, alignItems: 'center', padding: '10px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', filter: 'blur(4.5px)', userSelect: 'none' }}>████████████</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', filter: 'blur(4.5px)', userSelect: 'none' }}>███</span>
              <span style={{ fontSize: 11, textAlign: 'center', color: 'var(--muted)' }}>🔒</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 11, background: 'var(--ink-panel)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--on-ink)', fontWeight: 600 }}>6 idées encore verrouillées</div>
            <div style={{ fontSize: 10.5, color: 'var(--on-ink-muted)', marginTop: 1 }}>Débloque tout ton rapport</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 99, background: 'var(--signal)', color: 'white' }}>Débloquer →</div>
        </div>
      </div>
    </div>
  )
}

export function HowItWorks() {
  const reduce = useReducedMotion()

  return (
    <section id="how-it-works" className="relative" style={{ background: 'var(--bg)', paddingTop: 'clamp(80px, 10vw, 128px)', paddingBottom: 'clamp(80px, 10vw, 128px)' }}>
      <div className="max-w-[1180px] mx-auto px-6">

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mb-16 max-w-[640px]"
        >
          <h2 className="font-display text-balance" style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.02, color: 'var(--ink)' }}>
            De l'idée floue<br />au plan clair.
          </h2>
          <p className="text-pretty" style={{ fontSize: 17, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6, maxWidth: '46ch' }}>
            Trois étapes. Aucune promesse en l'air — chaque sortie est concrète et chiffrée.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          <div>
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                style={{ display: 'flex', gap: 22, paddingBottom: i < steps.length - 1 ? 36 : 0, position: 'relative' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <span className="font-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--signal)', letterSpacing: '-0.02em', lineHeight: 1 }}>{step.n}</span>
                  {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 10, borderRadius: 2 }} />}
                </div>
                <div style={{ paddingTop: 1 }}>
                  <h3 className="font-display" style={{ fontSize: 21, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.02em' }}>{step.title}</h3>
                  <p className="text-pretty" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--muted)', maxWidth: '42ch' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
          >
            <AppPreviewPanel />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
