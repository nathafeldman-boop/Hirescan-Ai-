'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

const plans = [
  {
    id: 'week',
    name: 'Hebdo',
    price: '7,90€',
    period: '/ semaine',
    tagline: 'Pour commencer maintenant',
    featured: false,
    cta: 'Commencer →',
    save: '',
    badge: '',
    features: [
      'Analyse complète de ton idée',
      '10 idées SaaS validées',
      'Score de concurrence',
      'Potentiel MRR par idée',
      'Stratégie marketing personnalisée',
    ],
  },
  {
    id: 'month',
    name: 'Mensuel',
    price: '23€',
    period: '/ mois',
    tagline: 'Pour les builders sérieux',
    featured: true,
    cta: 'Choisir Mensuel →',
    save: 'Économise 19 % vs hebdo',
    badge: 'Le plus populaire',
    features: [
      'Tout le plan Hebdo',
      'Régénération illimitée',
      'Analyse TAM / SAM / SOM',
      'Fiche concurrents complète',
      'Roadmap de lancement 30 jours',
      'Accès dashboard workspace',
    ],
  },
  {
    id: 'year',
    name: 'Annuel',
    price: '75€',
    period: '/ an',
    tagline: 'Meilleure valeur long terme',
    featured: false,
    cta: 'Choisir Annuel →',
    save: 'Économise 73 % vs mensuel',
    badge: '',
    features: [
      'Tout le plan Mensuel',
      'Support prioritaire',
      'Accès aux nouvelles fonctionnalités',
      'Export PDF illimité',
      'Blueprint intégration tech',
      'Recommandations pricing personnalisées',
    ],
  },
]

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden"
      style={{ background: 'var(--bg)', paddingTop: '96px', paddingBottom: '96px' }}
    >
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '480px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-14"
        >
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-0.028em', lineHeight: 1.1 }}
          >
            Tarification simple et honnête
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginTop: '10px' }}>
            Sans engagement. Annule à tout moment.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-[900px] mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
              className="relative flex-1 w-full"
              style={{
                borderRadius: 16,
                padding: '28px',
                background: plan.featured ? 'oklch(0.62 0.14 205 / 0.07)' : 'var(--surface)',
                border: `1.5px solid ${plan.featured ? 'var(--primary)' : 'var(--border)'}`,
                transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
                zIndex: plan.featured ? 2 : 1,
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!plan.featured) (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                if (!plan.featured) (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 14px',
                  borderRadius: 99,
                  background: 'var(--primary)',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px oklch(0.62 0.14 205 / 0.35)',
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: 4, marginTop: plan.badge ? 8 : 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: plan.featured ? 'var(--primary)' : 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {plan.name}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: 18, lineHeight: 1.4 }}>{plan.tagline}</div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: plan.save ? 6 : 22 }}>
                <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.04em', lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: '13px', color: 'var(--muted)', paddingBottom: 4 }}>{plan.period}</span>
              </div>
              {plan.save && (
                <div style={{ fontSize: '11.5px', color: 'var(--accent)', fontWeight: 600, marginBottom: 18 }}>{plan.save}</div>
              )}

              <a
                href="/builder"
                className="flex items-center justify-center w-full font-semibold transition-all"
                style={{
                  fontSize: '13.5px',
                  padding: '11px 20px',
                  borderRadius: '12px',
                  background: plan.featured ? 'var(--primary)' : 'transparent',
                  border: plan.featured ? 'none' : '1.5px solid var(--border)',
                  color: plan.featured ? 'white' : 'var(--ink)',
                  marginBottom: 22,
                  textDecoration: 'none',
                  boxShadow: plan.featured ? '0 6px 20px oklch(0.62 0.14 205 / 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                  if (plan.featured) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'
                  else (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.35 0 0)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  if (plan.featured) (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'
                  else (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                }}
              >
                {plan.cta}
              </a>

              <div style={{ height: 1, background: 'var(--border)', marginBottom: 18 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Check
                      style={{
                        width: 14, height: 14, marginTop: 1, flexShrink: 0,
                        color: plan.featured ? 'var(--primary)' : 'var(--muted)',
                      }}
                      strokeWidth={2.5}
                    />
                    <span style={{ fontSize: '13px', color: 'oklch(0.97 0 0 / 0.6)', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-8 mt-12 flex-wrap"
        >
          {['Paiement sécurisé', 'Annulation libre', 'Accès instantané', 'Sans frais cachés'].map((t) => (
            <span key={t} style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>✓ {t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
