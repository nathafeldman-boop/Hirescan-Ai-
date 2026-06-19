'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Crown } from 'lucide-react'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$9',
    period: 'one-time',
    description: 'Unlock all your SaaS ideas instantly.',
    icon: Zap,
    iconColor: '#a78bfa',
    iconBg: 'rgba(167,139,250,0.15)',
    border: 'rgba(255,255,255,0.10)',
    bg: 'rgba(255,255,255,0.04)',
    featured: false,
    cta: 'Get Started',
    ctaBg: 'rgba(255,255,255,0.08)',
    ctaColor: 'white',
    features: [
      '10 validated SaaS ideas',
      'MRR potential estimate',
      'Competition analysis',
      'Technical feasibility score',
      '90-day roadmap',
      'PDF export',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$200',
    period: 'one-time',
    description: 'Full validation suite for serious builders.',
    icon: Crown,
    iconColor: '#fbbf24',
    iconBg: 'rgba(251,191,36,0.15)',
    border: 'rgba(124,58,237,0.45)',
    bg: 'rgba(124,58,237,0.08)',
    featured: true,
    cta: 'Start Building',
    ctaBg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    ctaColor: 'white',
    features: [
      'Everything in Starter',
      'Unlimited idea regeneration',
      'Full market analysis + TAM/SAM/SOM',
      'Landing page copy generator',
      'Pricing strategy recommendations',
      'Competitor breakdown',
      'Integration blueprint',
      'Priority support',
    ],
  },
]

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 relative overflow-hidden"
      style={{ background: '#08080f' }}
    >
      {/* Faint divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }}
      />

      {/* Background glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-brand-400 text-[12px] font-semibold tracking-widest uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-[38px] font-bold tracking-[-0.025em] text-white mb-4">
            Pricing preview
          </h2>
          <p className="text-[15px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            One-time payment. No subscription. No surprises.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-5 max-w-[780px] mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl p-7 flex-1 w-full"
              style={{
                background: plan.bg,
                border: `1px solid ${plan.border}`,
              }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-3 py-1 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  ✦ Most popular
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: plan.iconBg }}
                >
                  <plan.icon className="w-4.5 h-4.5" style={{ color: plan.iconColor }} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-white font-semibold text-[15px]">{plan.name}</div>
                  <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{plan.description}</div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1.5">
                  <span className="text-[44px] font-bold text-white tracking-[-0.03em] leading-none">
                    {plan.price}
                  </span>
                  <span className="text-[13px] mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                href="#"
                className="flex items-center justify-center w-full py-3 rounded-full text-[13.5px] font-semibold text-white mb-6 transition-all"
                style={{
                  background: plan.ctaBg,
                  border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: plan.featured ? '0 8px 24px rgba(124,58,237,0.35)' : 'none',
                }}
              >
                {plan.cta} →
              </a>

              {/* Features */}
              <div className="space-y-2.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: plan.featured ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <Check
                        className="w-2.5 h-2.5"
                        strokeWidth={3}
                        style={{ color: plan.featured ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}
                      />
                    </div>
                    <span className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
