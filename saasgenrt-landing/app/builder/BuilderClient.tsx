'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Lock, Zap } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  domain: string
  domainChip: string
  timePerWeek: string
  techLevel: string
  budget: string
  customerType: string
  pricingModel: string
}

interface SaaSIdea {
  name: string
  tagline: string
  mrrPotential: string
  competitionScore: number
  techComplexity: string
  timeToMvp: string
  why: string
  targetCustomer: string
}

// ─── Static data ──────────────────────────────────────────────────────────────

const DOMAIN_CHIPS = [
  'B2B SaaS', 'Developer Tools', 'E-commerce', 'Healthcare',
  'Marketing', 'Finance', 'HR & Hiring', 'Education',
  'Legal Tech', 'Real Estate', 'Customer Support', 'Analytics',
]

const TIME_OPTIONS = [
  { value: 'Under 5h/week', label: 'Under 5h / week', desc: 'Side project' },
  { value: '5–20h/week', label: '5–20h / week', desc: 'Part-time' },
  { value: '20–40h/week', label: '20–40h / week', desc: 'Near full-time' },
  { value: 'Full-time', label: 'Full-time', desc: '40h+' },
]

const TECH_OPTIONS = [
  { value: 'Non-technical', label: 'Non-technical', desc: 'No coding background' },
  { value: 'Can code basics', label: 'Some coding', desc: 'Build basic apps' },
  { value: 'Full-stack developer', label: 'Full-stack dev', desc: 'Ship anything' },
]

const BUDGET_OPTIONS = [
  { value: 'Under $100', label: '< $100', desc: 'Bootstrapped' },
  { value: '$100–$1K', label: '$100 – $1K', desc: 'Lean launch' },
  { value: '$1K–$10K', label: '$1K – $10K', desc: 'Funded' },
  { value: '$10K+', label: '$10K+', desc: 'Well-funded' },
]

const CUSTOMER_OPTIONS = [
  { value: 'Solo founders', label: 'Solo founders', desc: '1-person businesses' },
  { value: 'SMBs (2–50 employees)', label: 'SMBs', desc: '2–50 employees' },
  { value: 'Mid-market (50–500)', label: 'Mid-market', desc: '50–500 employees' },
  { value: 'Consumers (B2C)', label: 'B2C consumers', desc: 'End users' },
]

const PRICING_OPTIONS = [
  { value: 'Subscription', label: 'Subscription', desc: 'Monthly / annual' },
  { value: 'One-time purchase', label: 'One-time', desc: 'Buy once forever' },
  { value: 'Usage-based', label: 'Usage-based', desc: 'Pay per use' },
  { value: 'Freemium', label: 'Freemium', desc: 'Free + paid tiers' },
]

const LOADING_STEPS = [
  'Scanning 50,000+ forum discussions...',
  'Analyzing your profile against 12K SaaS patterns...',
  'Scoring opportunities by MRR potential...',
  'Filtering low-competition niches for you...',
  'Generating your personalized blueprint...',
]

const OVERVIEW_STEPS = [
  { icon: '🔍', title: 'Find your problem', desc: 'Describe a frustration, market gap, or domain you want to explore.' },
  { icon: '👤', title: 'Understand your profile', desc: "We'll tailor ideas to fit your skills, time, and budget." },
  { icon: '🎯', title: 'Validate opportunities', desc: 'Our AI compares each idea against existing businesses.' },
  { icon: '🗺️', title: 'Generate your roadmap', desc: 'Marketing strategy, validation steps, and launch plan.' },
  { icon: '🚀', title: 'Launch faster', desc: 'Receive a complete, actionable SaaS blueprint.' },
]

const IDEA_ACCENT = ['#8B5CF6', '#0ea5e9', '#10b981']
const IDEA_GLOW = ['rgba(139,92,246,0.10)', 'rgba(14,165,233,0.08)', 'rgba(16,185,129,0.08)']
const IDEA_BORDER = ['rgba(139,92,246,0.28)', 'rgba(14,165,233,0.22)', 'rgba(16,185,129,0.22)']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function competitionLabel(score: number) {
  if (score <= 3) return { label: 'Low', color: '#39FF88' }
  if (score <= 6) return { label: 'Medium', color: '#fbbf24' }
  return { label: 'High', color: '#f87171' }
}

function complexityStyle(c: string) {
  if (c === 'Low') return { color: '#39FF88', bg: 'rgba(57,255,136,0.1)', border: 'rgba(57,255,136,0.22)' }
  if (c === 'Medium') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.22)' }
  return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.22)' }
}

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0 }),
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function RadioCard({ selected, onSelect, label, desc }: {
  selected: boolean
  onSelect: () => void
  label: string
  desc: string
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 12,
        background: selected ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected ? 'rgba(139,92,246,0.42)' : 'rgba(255,255,255,0.09)'}`,
        cursor: 'pointer', transition: 'all 0.15s',
        transform: selected ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${selected ? '#8B5CF6' : 'rgba(255,255,255,0.2)'}`,
          background: selected ? '#8B5CF6' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: selected ? '#e2d9fb' : 'rgba(255,255,255,0.8)' }}>
            {label}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.33)', marginTop: 1 }}>{desc}</div>
        </div>
      </div>
    </button>
  )
}

function OptionGroup({ label, value, options, onSelect }: {
  label: string
  value: string
  options: { value: string; label: string; desc: string }[]
  onSelect: (v: string) => void
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 9, letterSpacing: '0.02em' }}>
        {label}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {options.map(o => (
          <RadioCard key={o.value} selected={value === o.value} onSelect={() => onSelect(o.value)} label={o.label} desc={o.desc} />
        ))}
      </div>
    </div>
  )
}

function ContinueButton({ disabled, onClick, label, isAnalyze }: {
  disabled: boolean; onClick: () => void; label: string; isAnalyze?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: '13px', borderRadius: 14, fontWeight: 600, fontSize: '14px',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? 'rgba(255,255,255,0.06)' : isAnalyze
          ? 'linear-gradient(135deg, #8B5CF6, #6d28d9)' : '#8B5CF6',
        color: disabled ? 'rgba(255,255,255,0.28)' : 'white',
        boxShadow: disabled ? 'none' : isAnalyze
          ? '0 8px 32px rgba(139,92,246,0.38), inset 0 1px 0 rgba(255,255,255,0.12)'
          : '0 4px 20px rgba(139,92,246,0.32)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'all 0.2s',
      }}
    >
      {label}
      {!disabled && <ArrowRight style={{ width: 15, height: 15 }} strokeWidth={2.5} />}
    </button>
  )
}

function StepHeader({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 8 }}>
        STEP {step} OF {total}
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.2 }}>
        {title}
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 99, marginBottom: 18,
          background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)',
        }}>
          <Zap style={{ width: 12, height: 12, color: '#c4b5fd' }} />
          <span style={{ fontSize: '11px', color: '#c4b5fd', fontWeight: 600, letterSpacing: '0.06em' }}>
            PRODUCT BUILDER
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 800,
          letterSpacing: '-0.035em', lineHeight: 1.1, color: 'white', marginBottom: 14,
        }}>
          {`Let's build your next `}
          <span style={{
            background: 'linear-gradient(135deg, #c4b5fd 20%, #8B5CF6 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            SaaS.
          </span>
        </h1>

        <p style={{
          fontSize: '15px', lineHeight: 1.65, color: 'rgba(255,255,255,0.45)',
          maxWidth: 460, margin: '0 auto',
        }}>
          Answer a few questions. We'll analyze your experience, budget, available time
          and acquisition strategy to generate personalized SaaS opportunities.
        </p>
      </div>

      {/* Steps list */}
      <div style={{
        background: '#111827', borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.07)', padding: '4px 0', marginBottom: 24,
      }}>
        {OVERVIEW_STEPS.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px',
            borderBottom: i < OVERVIEW_STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: 2 }}>
                {s.title}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
            <div style={{
              flexShrink: 0, width: 20, height: 20, borderRadius: 99,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', color: 'rgba(255,255,255,0.22)', fontWeight: 700,
            }}>
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          width: '100%', padding: '14px', borderRadius: 14,
          background: 'linear-gradient(135deg, #8B5CF6, #6d28d9)',
          boxShadow: '0 8px 32px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.13)',
          color: 'white', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.13)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.13)'
        }}
      >
        Start the Builder
        <ArrowRight style={{ width: 16, height: 16 }} strokeWidth={2.5} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        {['🔒 Secure', '⚡ Free $9 example', '✓ No credit card'].map(t => (
          <span key={t} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function Step1({
  userData, setDomain, setDomainChip, onNext,
}: {
  userData: UserData; setDomain: (v: string) => void; setDomainChip: (v: string) => void; onNext: () => void
}) {
  return (
    <div>
      <StepHeader step={1} total={3} title="What domain fascinates you?" subtitle="Tell us about the problem space you want to explore." />

      <textarea
        value={userData.domain}
        onChange={(e) => { setDomain(e.target.value); if (e.target.value) setDomainChip('') }}
        placeholder="e.g. I'm frustrated by how hard it is to onboard clients in agencies..."
        rows={3}
        style={{
          width: '100%', padding: '14px 16px', borderRadius: 12, marginBottom: 20,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
          color: 'white', fontSize: '14px', lineHeight: 1.6, resize: 'none',
          outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
      />

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>
          OR PICK A DOMAIN
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DOMAIN_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => { setDomainChip(chip === userData.domainChip ? '' : chip); setDomain('') }}
              style={{
                padding: '7px 14px', borderRadius: 99, fontSize: '12.5px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s',
                background: userData.domainChip === chip ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${userData.domainChip === chip ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.09)'}`,
                color: userData.domainChip === chip ? '#c4b5fd' : 'rgba(255,255,255,0.55)',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <ContinueButton disabled={!(userData.domain.trim() || userData.domainChip)} onClick={onNext} label="Continue" />
    </div>
  )
}

function Step2({
  userData, setTime, setTech, setBudget, onNext,
}: {
  userData: UserData; setTime: (v: string) => void; setTech: (v: string) => void; setBudget: (v: string) => void; onNext: () => void
}) {
  return (
    <div>
      <StepHeader step={2} total={3} title="Tell us about yourself" subtitle="We'll tailor opportunities to your exact situation." />
      <OptionGroup label="Available time per week?" value={userData.timePerWeek} options={TIME_OPTIONS} onSelect={setTime} />
      <OptionGroup label="Your technical level?" value={userData.techLevel} options={TECH_OPTIONS} onSelect={setTech} />
      <OptionGroup label="Launch budget?" value={userData.budget} options={BUDGET_OPTIONS} onSelect={setBudget} />
      <ContinueButton disabled={!(userData.timePerWeek && userData.techLevel && userData.budget)} onClick={onNext} label="Continue" />
    </div>
  )
}

function Step3({
  userData, setCustomer, setPricing, onNext,
}: {
  userData: UserData; setCustomer: (v: string) => void; setPricing: (v: string) => void; onNext: () => void
}) {
  return (
    <div>
      <StepHeader step={3} total={3} title="Your target market" subtitle="Who will you be selling to?" />
      <OptionGroup label="I want to sell to..." value={userData.customerType} options={CUSTOMER_OPTIONS} onSelect={setCustomer} />
      <OptionGroup label="Preferred pricing model" value={userData.pricingModel} options={PRICING_OPTIONS} onSelect={setPricing} />
      <ContinueButton disabled={!(userData.customerType && userData.pricingModel)} onClick={onNext} label="Analyze with AI" isAnalyze />
    </div>
  )
}

function LoadingStep({ loadingStep }: { loadingStep: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, position: 'relative' }}>
        {/* Outer pulse */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute', width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(139,92,246,0.2)',
          }}
        />
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 56, height: 56, borderRadius: '50%', position: 'relative',
            border: '2px solid rgba(139,92,246,0.15)',
            borderTop: '2px solid #8B5CF6',
          }}
        />
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
        Analyzing your profile
      </h2>
      <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.38)', marginBottom: 36 }}>
        Our AI is scanning thousands of opportunities for you
      </p>

      <div style={{ textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
        {LOADING_STEPS.map((msg, i) => {
          const isDone = i < loadingStep
          const isActive = i === loadingStep
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.28, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 13 }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: isDone ? '#39FF88' : isActive ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.07)',
                border: `1.5px solid ${isDone ? '#39FF88' : isActive ? '#8B5CF6' : 'rgba(255,255,255,0.10)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone && <Check style={{ width: 11, height: 11, color: '#090B11' }} strokeWidth={3} />}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }}
                  />
                )}
              </div>
              <span style={{
                fontSize: '13px', lineHeight: 1.4,
                color: isDone ? 'rgba(255,255,255,0.65)' : isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)',
                fontWeight: isActive ? 500 : 400,
              }}>
                {msg}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ResultsStep({ ideas, userData, onRestart }: {
  ideas: SaaSIdea[]; userData: UserData; onRestart: () => void
}) {
  const domain = userData.domainChip || userData.domain || 'your domain'
  const displayIdeas = ideas.length >= 3 ? ideas : [
    { name: 'ContractPilot AI', tagline: 'Auto-review B2B contracts in seconds', mrrPotential: '$2.4K–$9K', competitionScore: 3, techComplexity: 'Medium', timeToMvp: '4–6 weeks', why: 'Matches your domain and available time', targetCustomer: 'SMBs with vendor contracts' },
    { name: 'StatusBoard Pro', tagline: 'Real-time API monitoring for dev teams', mrrPotential: '$1.8K–$6K', competitionScore: 4, techComplexity: 'Low', timeToMvp: '2–4 weeks', why: 'Low competition niche for your tech level', targetCustomer: 'Dev teams at 5–50 person SaaS' },
    { name: 'ChurnGuard', tagline: 'Predict and prevent SaaS churn', mrrPotential: '$3.2K–$14K', competitionScore: 5, techComplexity: 'Medium', timeToMvp: '5–8 weeks', why: 'High MRR ceiling, clear ROI for buyers', targetCustomer: 'B2B SaaS with 50–500 customers' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 99, marginBottom: 14,
            background: 'rgba(57,255,136,0.1)', border: '1px solid rgba(57,255,136,0.28)',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#39FF88' }} />
          <span style={{ fontSize: '11px', color: '#39FF88', fontWeight: 600, letterSpacing: '0.06em' }}>
            ANALYSIS COMPLETE
          </span>
        </motion.div>
        <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: 6 }}>
          3 ideas tailored for you
        </h2>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.38)' }}>
          Based on {domain} + your profile
        </p>
      </div>

      {/* Idea cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        {displayIdeas.slice(0, 3).map((idea, i) => {
          const comp = competitionLabel(idea.competitionScore)
          const cx = complexityStyle(idea.techComplexity)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                borderRadius: 18, padding: '20px', position: 'relative', overflow: 'hidden',
                background: IDEA_GLOW[i], border: `1px solid ${IDEA_BORDER[i]}`,
              }}
            >
              {/* Top accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: IDEA_ACCENT[i], borderRadius: '18px 18px 0 0',
              }} />

              {/* Name + MRR row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: 2 }}>{idea.name}</div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.45)' }}>{idea.tagline}</div>
                </div>
                <div style={{
                  padding: '5px 11px', borderRadius: 99, flexShrink: 0, marginLeft: 12,
                  background: 'rgba(57,255,136,0.12)', border: '1px solid rgba(57,255,136,0.25)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#39FF88', whiteSpace: 'nowrap' }}>{idea.mrrPotential}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(57,255,136,0.55)' }}>MRR potential</div>
                </div>
              </div>

              {/* Stats chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.3)', marginBottom: 1 }}>Competition</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: comp.color }}>{comp.label} ({idea.competitionScore}/10)</div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 8, background: cx.bg, border: `1px solid ${cx.border}` }}>
                  <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.3)', marginBottom: 1 }}>Tech level</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: cx.color }}>{idea.techComplexity}</div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.3)', marginBottom: 1 }}>Time to MVP</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{idea.timeToMvp}</div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.3)', marginBottom: 1 }}>Target</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{idea.targetCustomer}</div>
                </div>
              </div>

              {/* Why for you */}
              <div style={{
                padding: '9px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.42)', fontStyle: 'italic' }}>
                  💡 {idea.why}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Locked card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{
          borderRadius: 18, padding: '18px 20px', marginBottom: 18,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', opacity: 0.35 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ height: 18, width: 140, borderRadius: 5, background: 'rgba(255,255,255,0.18)' }} />
            <div style={{ height: 18, width: 70, borderRadius: 5, background: 'rgba(57,255,136,0.22)' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[80, 60, 90, 100].map((w, i) => (
              <div key={i} style={{ height: 32, width: w, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
        </div>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'rgba(9,11,17,0.6)', borderRadius: 18,
        }}>
          <Lock style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.35)' }} />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>7 more ideas locked</span>
        </div>
      </motion.div>

      {/* Unlock CTA */}
      <motion.a
        href="/#pricing"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '14px', borderRadius: 14, marginBottom: 10,
          background: 'linear-gradient(135deg, #8B5CF6, #6d28d9)',
          boxShadow: '0 8px 32px rgba(139,92,246,0.42), inset 0 1px 0 rgba(255,255,255,0.12)',
          color: 'white', fontWeight: 600, fontSize: '15px', textDecoration: 'none',
        }}
      >
        Unlock full analysis — $9
        <ArrowRight style={{ width: 16, height: 16 }} strokeWidth={2.5} />
      </motion.a>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1, padding: '11px', borderRadius: 14, fontSize: '13px',
            color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.04)', cursor: 'pointer', fontWeight: 500,
          }}
        >
          Start over
        </button>
        <a
          href="/"
          style={{
            flex: 1, padding: '11px', borderRadius: 14, fontSize: '13px',
            color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.04)', cursor: 'pointer', fontWeight: 500,
            textDecoration: 'none', textAlign: 'center',
          }}
        >
          ← Back to home
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
        {['✓ No subscription', '✓ Full blueprint included', '✓ Instant access'].map(t => (
          <span key={t} style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.22)' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Main BuilderClient ───────────────────────────────────────────────────────

export function BuilderClient() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [userData, setUserData] = useState<UserData>({
    domain: '', domainChip: '', timePerWeek: '',
    techLevel: '', budget: '', customerType: '', pricingModel: '',
  })
  const [loadingStep, setLoadingStep] = useState(0)
  const [ideas, setIdeas] = useState<SaaSIdea[]>([])
  const [apiDone, setApiDone] = useState(false)

  const goTo = useCallback((next: number, forceDir?: number) => {
    setDir(forceDir !== undefined ? forceDir : next > step ? 1 : -1)
    setStep(next)
  }, [step])

  const set = (key: keyof UserData, val: string) =>
    setUserData(prev => ({ ...prev, [key]: val }))

  // Trigger loading + API on step 4
  useEffect(() => {
    if (step !== 4) return
    setLoadingStep(0)
    setApiDone(false)

    const timers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setLoadingStep(i + 1), (i + 1) * 900)
    )

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data.ideas)) setIdeas(data.ideas); setApiDone(true) })
      .catch(() => setApiDone(true))

    return () => timers.forEach(clearTimeout)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance to results when both animation + API complete
  useEffect(() => {
    if (step === 4 && apiDone && loadingStep >= LOADING_STEPS.length) {
      const t = setTimeout(() => { setDir(1); setStep(5) }, 500)
      return () => clearTimeout(t)
    }
  }, [step, apiDone, loadingStep])

  const canContinue = () => {
    if (step === 1) return !!(userData.domain.trim() || userData.domainChip)
    if (step === 2) return !!(userData.timePerWeek && userData.techLevel && userData.budget)
    if (step === 3) return !!(userData.customerType && userData.pricingModel)
    return true
  }

  return (
    <div style={{ minHeight: '100vh', background: '#090B11', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 70%)',
      }} />

      {/* Top nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(9,11,17,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'linear-gradient(135deg, #8B5CF6, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L12 4.25V9.75L7 12.5L2 9.75V4.25L7 1.5Z" fill="white" fillOpacity="0.92" />
              <circle cx="7" cy="7" r="2.2" fill="white" fillOpacity="0.45" />
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>SaaSGenrt</span>
        </a>

        {/* Progress dots for steps 1-3 */}
        {step >= 1 && step <= 3 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                height: 6, borderRadius: 99, transition: 'all 0.3s ease',
                width: s === step ? 24 : 8,
                background: s <= step ? '#8B5CF6' : 'rgba(255,255,255,0.12)',
              }} />
            ))}
          </div>
        )}

        {/* Back button */}
        {step >= 1 && step < 4 ? (
          <button
            onClick={() => goTo(step - 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: '12.5px',
              color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back
          </button>
        ) : <div style={{ width: 48 }} />}
      </div>

      {/* Main */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', paddingTop: '60px',
      }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%',
              maxWidth: step === 5 ? 680 : 520,
              padding: '40px 20px 60px',
              margin: '0 auto',
            }}
          >
            {step === 0 && <IntroStep onStart={() => goTo(1)} />}
            {step === 1 && (
              <Step1
                userData={userData}
                setDomain={(v) => set('domain', v)}
                setDomainChip={(v) => set('domainChip', v)}
                onNext={() => canContinue() && goTo(2)}
              />
            )}
            {step === 2 && (
              <Step2
                userData={userData}
                setTime={(v) => set('timePerWeek', v)}
                setTech={(v) => set('techLevel', v)}
                setBudget={(v) => set('budget', v)}
                onNext={() => canContinue() && goTo(3)}
              />
            )}
            {step === 3 && (
              <Step3
                userData={userData}
                setCustomer={(v) => set('customerType', v)}
                setPricing={(v) => set('pricingModel', v)}
                onNext={() => canContinue() && goTo(4)}
              />
            )}
            {step === 4 && <LoadingStep loadingStep={loadingStep} />}
            {step === 5 && (
              <ResultsStep
                ideas={ideas}
                userData={userData}
                onRestart={() => {
                  setUserData({ domain: '', domainChip: '', timePerWeek: '', techLevel: '', budget: '', customerType: '', pricingModel: '' })
                  setIdeas([])
                  goTo(0, -1)
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
