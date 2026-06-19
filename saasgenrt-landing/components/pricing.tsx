'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    id: 'week',
    name: 'Weekly',
    price: '7,90€',
    period: '/ semaine',
    tagline: 'Pour commencer maintenant',
    featured: false,
    cta: 'Commencer →',
    save: '',
    accent: '#0ea5e9',
    accentBg: 'rgba(14,165,233,0.08)',
    accentBorder: 'rgba(14,165,233,0.22)',
    badge: '',
    features: [
      'Analyse complète de votre idée',
      '10 idées SaaS validées',
      'Score de concurrence',
      'Potentiel MRR par idée',
      'Stratégie marketing sur mesure',
    ],
    bg: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.09)',
    ctaBg: 'rgba(14,165,233,0.12)',
    ctaBorder: 'rgba(14,165,233,0.28)',
    ctaColor: '#7dd3fc',
    checkBg: 'rgba(14,165,233,0.12)',
    checkColor: '#38bdf8',
  },
  {
    id: 'month',
    name: 'Mensuel',
    price: '23€',
    period: '/ mois',
    tagline: 'Pour les builders sérieux',
    featured: true,
    cta: 'Choisir Mensuel →',
    save: 'Économisez 19 % vs hebdo',
    accent: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.09)',
    accentBorder: 'rgba(139,92,246,0.42)',
    badge: '✦ Le plus populaire',
    features: [
      'Tout le plan Hebdo',
      'Régénération illimitée',
      'Analyse TAM / SAM / SOM',
      'Fiche concurrents complète',
      'Roadmap de lancement 30 jours',
      'Accès dashboard workspace',
    ],
    bg: 'rgba(139,92,246,0.09)',
    border: 'rgba(139,92,246,0.42)',
    ctaBg: 'linear-gradient(135deg, #8B5CF6, #6d28d9)',
    ctaBorder: 'transparent',
    ctaColor: 'white',
    checkBg: 'rgba(139,92,246,0.22)',
    checkColor: '#a78bfa',
  },
  {
    id: 'year',
    name: 'Annuel',
    price: '75€',
    period: '/ an',
    tagline: 'Meilleure valeur long terme',
    featured: false,
    cta: 'Choisir Annuel →',
    save: 'Économisez 73 % vs mensuel',
    accent: '#39FF88',
    accentBg: 'rgba(57,255,136,0.06)',
    accentBorder: 'rgba(57,255,136,0.22)',
    badge: '★ Meilleure offre',
    features: [
      'Tout le plan Mensuel',
      'Support prioritaire',
      'Accès aux nouvelles fonctionnalités',
      'Export PDF illimité',
      'Blueprint intégration tech',
      'Recommandations pricing personnalisées',
    ],
    bg: 'rgba(57,255,136,0.04)',
    border: 'rgba(57,255,136,0.18)',
    ctaBg: 'rgba(57,255,136,0.12)',
    ctaBorder: 'rgba(57,255,136,0.30)',
    ctaColor: '#39FF88',
    checkBg: 'rgba(57,255,136,0.12)',
    checkColor: '#39FF88',
  },
]

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden"
      style={{ background: '#090B11', paddingTop: '96px', paddingBottom: '96px' }}
    >
      {/* Divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: '640px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.32), transparent)' }}
      />
      {/* Center radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full mb-4"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', padding: '4px 14px' }}
          >
            <span style={{ fontSize: '11px', color: '#c4b5fd', fontWeight: 500, letterSpacing: '0.04em' }}>TARIFS</span>
          </div>
          <h2
            className="font-bold text-white mb-3"
            style={{ fontSize: '40px', letterSpacing: '-0.025em' }}
          >
            Tarification simple et honnête
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.48)' }}>
            Sans engagement. Annulez à tout moment.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-5 justify-center items-start max-w-[960px] mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex-1 w-full"
              style={{
                borderRadius: plan.featured ? 22 : 18,
                padding: plan.featured ? 4 : '28px',
                background: plan.featured ? plan.bg : plan.bg,
                border: `1.5px solid ${plan.border}`,
                boxShadow: plan.featured
                  ? '0 0 0 4px rgba(139,92,246,0.07), 0 12px 40px rgba(139,92,246,0.22)'
                  : '0 4px 20px rgba(0,0,0,0.25)',
                transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
                zIndex: plan.featured ? 2 : 1,
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!plan.featured) (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                if (!plan.featured) (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute -top-[13px] left-1/2 -translate-x-1/2 text-white font-semibold"
                  style={{
                    fontSize: '11px',
                    padding: '3px 14px',
                    borderRadius: 99,
                    background: plan.featured
                      ? 'linear-gradient(135deg, #8B5CF6, #6d28d9)'
                      : 'rgba(57,255,136,0.15)',
                    color: plan.featured ? 'white' : '#39FF88',
                    border: plan.featured ? 'none' : '1px solid rgba(57,255,136,0.35)',
                    whiteSpace: 'nowrap',
                    boxShadow: plan.featured ? '0 4px 14px rgba(139,92,246,0.4)' : '0 4px 14px rgba(57,255,136,0.15)',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Inner glass for featured */}
              {plan.featured ? (
                <div style={{
                  borderRadius: 18, padding: '28px', position: 'relative', overflow: 'hidden',
                  background: 'rgba(10,13,20,0.65)',
                  border: '1px solid rgba(139,92,246,0.18)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}>
                  {/* Top accent line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)' }} />

                  <PlanContent plan={plan} />
                </div>
              ) : (
                <PlanContent plan={plan} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-8 mt-12 flex-wrap"
        >
          {['🔒 Paiement sécurisé', '↩️ Annulation libre', '⚡ Accès instantané', '💳 Sans frais cachés'].map((t) => (
            <span key={t} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PlanContent({ plan }: { plan: typeof plans[number] }) {
  return (
    <>
      {/* Plan name */}
      <div style={{ marginBottom: 6, marginTop: plan.badge ? 8 : 0 }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: plan.accent, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{plan.name}</span>
      </div>
      <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.38)', marginBottom: 18, lineHeight: 1.4 }}>{plan.tagline}</div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: '44px', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>{plan.price}</span>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', paddingBottom: 4 }}>{plan.period}</span>
      </div>
      {plan.save && (
        <div style={{ fontSize: '11.5px', color: '#39FF88', fontWeight: 600, marginBottom: 18 }}>{plan.save}</div>
      )}
      {!plan.save && <div style={{ marginBottom: 18 }} />}

      {/* CTA */}
      <a
        href="/builder"
        className="flex items-center justify-center w-full font-semibold transition-all"
        style={{
          fontSize: '13.5px',
          padding: '11px 20px',
          borderRadius: '14px',
          background: plan.ctaBg,
          border: `1px solid ${plan.ctaBorder}`,
          color: plan.ctaColor,
          marginBottom: 22,
          boxShadow: plan.featured ? '0 8px 28px rgba(139,92,246,0.38), inset 0 1px 0 rgba(255,255,255,0.12)' : 'none',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
      >
        {plan.cta}
      </a>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 18 }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {plan.features.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: plan.checkBg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, marginTop: 1,
            }}>
              <Check style={{ width: 9, height: 9, color: plan.checkColor }} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </>
  )
}
