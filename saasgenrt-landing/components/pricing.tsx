'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$9',
    period: 'one-time',
    desc: 'Unlock all your SaaS ideas in one click.',
    featured: false,
    cta: 'Get started →',
    features: [
      '10 validated SaaS ideas',
      'MRR potential per idea',
      'Competition score',
      'PDF export',
    ],
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.10)',
    ctaBg: 'rgba(255,255,255,0.08)',
    ctaBorder: 'rgba(255,255,255,0.12)',
    ctaColor: 'rgba(255,255,255,0.85)',
    checkBg: 'rgba(255,255,255,0.08)',
    checkColor: 'rgba(255,255,255,0.5)',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$200',
    period: 'one-time',
    desc: 'Full validation suite for serious builders.',
    featured: true,
    cta: 'Start building →',
    features: [
      'Everything in Starter',
      'Unlimited regeneration',
      'TAM / SAM / SOM analysis',
      'Landing page copy',
      'Pricing recommendations',
      'Competitor breakdown',
      'Integration blueprint',
      'Priority support',
    ],
    bg: 'rgba(124,58,237,0.09)',
    border: 'rgba(124,58,237,0.42)',
    ctaBg: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    ctaBorder: 'transparent',
    ctaColor: 'white',
    checkBg: 'rgba(124,58,237,0.28)',
    checkColor: '#a78bfa',
  },
]

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden"
      style={{ background: '#08080f', paddingTop: '96px', paddingBottom: '96px' }}
    >
      {/* Divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: '640px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.32), transparent)' }}
      />
      {/* Center radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(124,58,237,0.10) 0%, transparent 70%)' }}
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
          <h2
            className="font-bold text-white mb-3"
            style={{ fontSize: '40px', letterSpacing: '-0.025em' }}
          >
            Pricing preview
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.48)' }}>
            One-time payment. No subscription. No surprises.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-5 justify-center items-start max-w-[820px] mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex-1 w-full"
              style={{
                borderRadius: '20px',
                padding: '28px',
                background: plan.bg,
                border: `1px solid ${plan.border}`,
              }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div
                  className="absolute -top-[13px] left-1/2 -translate-x-1/2 text-white font-semibold"
                  style={{
                    fontSize: '11px',
                    padding: '3px 14px',
                    borderRadius: 99,
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                  }}
                >
                  ✦ Most popular
                </div>
              )}

              {/* Plan name + desc */}
              <div className="mb-5">
                <div className="text-white font-semibold mb-1" style={{ fontSize: '15px' }}>{plan.name}</div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{plan.desc}</div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2 mb-6">
                <span
                  className="font-bold text-white"
                  style={{ fontSize: '48px', lineHeight: 1, letterSpacing: '-0.04em' }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', paddingBottom: '6px' }}>
                  {plan.period}
                </span>
              </div>

              {/* CTA */}
              <a
                href="#"
                className="flex items-center justify-center w-full font-semibold text-white mb-6 transition-all"
                style={{
                  fontSize: '13.5px',
                  padding: '11px 20px',
                  borderRadius: '99px',
                  background: plan.ctaBg,
                  border: `1px solid ${plan.ctaBorder}`,
                  color: plan.ctaColor,
                  boxShadow: plan.featured ? '0 8px 28px rgba(124,58,237,0.38), inset 0 1px 0 rgba(255,255,255,0.12)' : 'none',
                }}
              >
                {plan.cta}
              </a>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '18px' }} />

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: plan.checkBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      <Check style={{ width: '9px', height: '9px', color: plan.checkColor }} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.58)', lineHeight: '1.5' }}>{f}</span>
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
