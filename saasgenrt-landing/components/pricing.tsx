'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

const plans = [
  {
    id: 'week',
    name: 'Hebdo',
    price: '7,90 €',
    period: '/ semaine',
    tagline: 'Pour tester maintenant',
    featured: false,
    cta: 'Commencer',
    save: '',
    badge: '',
    features: [
      'Analyse complète de ton idée',
      '10 idées SaaS validées',
      'Score de concurrence',
      'Potentiel MRR par idée',
      'Stratégie marketing de base',
    ],
  },
  {
    id: 'month',
    name: 'Mensuel',
    price: '23 €',
    period: '/ mois',
    tagline: 'Pour les fondateurs sérieux',
    featured: true,
    cta: 'Choisir Mensuel',
    save: 'Économise 19 % vs hebdo',
    badge: 'Le plus choisi',
    features: [
      'Tout le plan Hebdo',
      'Régénération illimitée',
      'Analyse TAM / SAM / SOM',
      'Fiche concurrents complète',
      'Roadmap de lancement 30 jours',
      'Accès au dashboard workspace',
    ],
  },
  {
    id: 'year',
    name: 'Annuel',
    price: '75 €',
    period: '/ an',
    tagline: 'Meilleure valeur long terme',
    featured: false,
    cta: 'Choisir Annuel',
    save: 'Économise 73 % vs mensuel',
    badge: '',
    features: [
      'Tout le plan Mensuel',
      'Support prioritaire',
      'Accès anticipé aux nouveautés',
      'Export PDF illimité',
      'Blueprint intégration tech',
      'Pricing recommandé sur-mesure',
    ],
  },
]

export function Pricing() {
  const reduce = useReducedMotion()

  return (
    <section id="pricing" className="relative" style={{ background: 'var(--bg)', paddingTop: 'clamp(80px, 10vw, 128px)', paddingBottom: 'clamp(80px, 10vw, 128px)' }}>
      <div className="max-w-[1180px] mx-auto px-6">

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mb-14 text-center max-w-[560px] mx-auto"
        >
          <h2 className="font-display text-balance" style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.02, color: 'var(--ink)' }}>
            Un prix honnête.<br />Sans piège.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
            Pas d'engagement. Annule quand tu veux, en deux clics.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-5 justify-center items-stretch max-w-[960px] mx-auto">
          {plans.map((plan, i) => {
            const dark = plan.featured
            return (
              <motion.div
                key={plan.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="relative flex-1"
                style={{
                  borderRadius: 20,
                  padding: dark ? '34px 28px 30px' : '30px 28px',
                  background: dark ? 'var(--ink-panel)' : 'var(--surface)',
                  color: dark ? 'var(--on-ink)' : 'var(--ink)',
                  border: dark ? 'none' : '1px solid var(--border)',
                  boxShadow: dark ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  transform: dark ? 'scale(1.025)' : 'none',
                  zIndex: dark ? 2 : 1,
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 11.5, fontWeight: 700, padding: '4px 14px', borderRadius: 99,
                    background: 'var(--signal)', color: 'white', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginTop: plan.badge ? 6 : 0 }}>
                  <div className="font-display" style={{ fontSize: 15, fontWeight: 700, color: dark ? 'var(--on-ink)' : 'var(--ink)', marginBottom: 3 }}>{plan.name}</div>
                  <div style={{ fontSize: 13, color: dark ? 'var(--on-ink-muted)' : 'var(--muted)', marginBottom: 20 }}>{plan.tagline}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: plan.save ? 7 : 24 }}>
                  <span className="font-display" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: dark ? 'var(--on-ink)' : 'var(--ink)' }}>{plan.price}</span>
                  <span style={{ fontSize: 13.5, color: dark ? 'var(--on-ink-muted)' : 'var(--muted)', paddingBottom: 4 }}>{plan.period}</span>
                </div>
                {plan.save && (
                  <div style={{ fontSize: 12, color: dark ? 'var(--signal-bright)' : 'var(--signal-ink)', fontWeight: 700, marginBottom: 22 }}>{plan.save}</div>
                )}

                <a
                  href="/builder"
                  className="flex items-center justify-center w-full transition-all"
                  style={{
                    fontSize: 14, fontWeight: 600, padding: '13px 20px', borderRadius: 12,
                    background: dark ? 'var(--signal)' : 'var(--ink)',
                    color: 'white', marginBottom: 24, textDecoration: 'none',
                    boxShadow: dark ? 'var(--shadow-md)' : 'none',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.filter = 'brightness(1.06)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.filter = 'brightness(1)' }}
                >
                  {plan.cta}
                </a>

                <div style={{ height: 1, background: dark ? 'var(--on-ink-border)' : 'var(--border)', marginBottom: 20 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: dark ? 'oklch(0.575 0.20 32 / 0.22)' : 'var(--signal-wash)',
                      }}>
                        <Check style={{ width: 11, height: 11, color: dark ? 'var(--signal-bright)' : 'var(--signal-ink)' }} strokeWidth={3} />
                      </span>
                      <span style={{ fontSize: 13.5, lineHeight: 1.45, color: dark ? 'var(--on-ink)' : 'var(--ink-soft)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-x-8 gap-y-2 mt-14 flex-wrap"
        >
          {['Paiement sécurisé', 'Annulation libre', 'Accès instantané', 'Sans frais cachés'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <Check style={{ width: 14, height: 14, color: 'var(--signal)' }} strokeWidth={3} />
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
