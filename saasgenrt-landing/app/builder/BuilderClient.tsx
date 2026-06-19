'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Sparkles, TrendingUp, Target, Rocket, Calendar, Megaphone, Clock, Lightbulb, UserRound, Map, ShieldCheck } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  domain: string
  domainChip: string
  problemOwner: string
  knowsProblem: string
  dailyFrustrations: string
  passions: string
  profession: string
  selectedProblem: string
  launchBudget: string
  buildApproach: string
  adsBudget: string
  acquisitionChannels: string
  marketType: string
  age: string
  timePerDay: string
  selectedIdeaIndex: string
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
  competitors?: string[]
  marketingStrategy?: string
}

interface ProblemSuggestion {
  title: string
  description: string
  frequency: string
  marketSize: string
}

const EMPTY_DATA: UserData = {
  domain: '', domainChip: '', problemOwner: '', knowsProblem: '',
  dailyFrustrations: '', passions: '', profession: '', selectedProblem: '',
  launchBudget: '', buildApproach: '', adsBudget: '', acquisitionChannels: '',
  marketType: '', age: '', timePerDay: '', selectedIdeaIndex: '',
}

// ─── Static data ──────────────────────────────────────────────────────────────

const DOMAIN_CHIPS = [
  'B2B SaaS', 'Developer Tools', 'E-commerce', 'Healthcare',
  'Marketing', 'Finance', 'HR & Hiring', 'Education',
  'Legal Tech', 'Real Estate', 'Customer Support', 'Analytics',
]

const WHO_OPTIONS = [
  { value: 'myself', icon: '👤', label: 'Me', desc: 'A problem you personally experience.' },
  { value: 'company', icon: '🏢', label: 'My company', desc: 'A recurring issue inside your business.' },
  { value: 'clients', icon: '🤝', label: 'My clients', desc: 'A problem your clients regularly face.' },
  { value: 'family', icon: '👨‍👩‍👧', label: 'Friends & Family', desc: 'Someone close to you experiences this.' },
  { value: 'community', icon: '🌍', label: 'A community', desc: 'A niche or audience you know well.' },
  { value: 'unsure', icon: '❓', label: "I'm not sure", desc: "We'll help identify the best opportunity." },
]

const LAUNCH_BUDGET_OPTIONS = [
  { value: '<€500', icon: '🌱', label: 'Under €500', desc: 'Bootstrapped & scrappy' },
  { value: '€500–€2K', icon: '🚀', label: '€500 – €2K', desc: 'Lean launch' },
  { value: '€2K–€10K', icon: '💼', label: '€2K – €10K', desc: 'Funded start' },
  { value: '€10K+', icon: '🏦', label: '€10K+', desc: 'Well-capitalized' },
]

const BUILD_APPROACH_OPTIONS = [
  { value: 'code', icon: '⌨️', label: 'I code myself', desc: 'Full control, build it by hand.' },
  { value: 'vibe', icon: '🤖', label: 'Vibe coding (AI)', desc: 'Build fast with AI assistants.' },
  { value: 'nocode', icon: '🧩', label: 'No-code tools', desc: 'Bubble, Webflow, Airtable & co.' },
]

const ADS_BUDGET_OPTIONS = [
  { value: '€0 (organic)', icon: '🌿', label: '€0 / organic', desc: 'Content & community only' },
  { value: '<€500/mo', icon: '📈', label: 'Under €500/mo', desc: 'Small paid tests' },
  { value: '€500–€2K/mo', icon: '🎯', label: '€500 – €2K/mo', desc: 'Scaling acquisition' },
  { value: '€2K+/mo', icon: '🔥', label: '€2K+ / mo', desc: 'Aggressive growth' },
]

const ACQUISITION_CHANNELS = [
  { value: 'TikTok', icon: '🎵' },
  { value: 'Instagram', icon: '📸' },
  { value: 'LinkedIn', icon: '💼' },
  { value: 'X / Twitter', icon: '🐦' },
  { value: 'SEO / Content', icon: '🔍' },
  { value: 'YouTube', icon: '▶️' },
  { value: 'Cold email', icon: '✉️' },
  { value: 'Communities', icon: '💬' },
]

const MARKET_TYPE_OPTIONS = [
  { value: 'b2c', icon: '🛍️', label: 'B2C', sub: 'Selling to consumers', examples: ['Individuals & creators', 'Impulse-friendly pricing', 'Viral, visual marketing'] },
  { value: 'b2b', icon: '🏢', label: 'B2B', sub: 'Selling to businesses', examples: ['Companies & teams', 'Higher price points', 'Relationship-driven sales'] },
]

const AGE_OPTIONS = [
  { value: '18–24', icon: '🎓', label: '18 – 24', desc: 'Student / early career' },
  { value: '25–34', icon: '⚡', label: '25 – 34', desc: 'Building momentum' },
  { value: '35–44', icon: '🎯', label: '35 – 44', desc: 'Peak expertise' },
  { value: '45–54', icon: '🧠', label: '45 – 54', desc: 'Deep experience' },
  { value: '55+', icon: '🌟', label: '55+', desc: 'Wisdom & network' },
]

const TIME_PER_DAY_OPTIONS = [
  { value: '<1h/day', icon: '🌙', label: 'Under 1h / day', desc: 'Tiny pockets of time' },
  { value: '1–3h/day', icon: '🌗', label: '1 – 3h / day', desc: 'Evenings & weekends' },
  { value: '3–6h/day', icon: '🌤️', label: '3 – 6h / day', desc: 'Serious side hustle' },
  { value: 'Full-time', icon: '☀️', label: 'Full-time', desc: 'All in' },
]

const AI_EXAMPLES = [
  'I spend too much time creating invoices.',
  'I struggle to organize client feedback.',
  'I never know what content to post.',
]

const LOADING_STEPS_PROBLEMS = [
  'Reading your profile & frustrations...',
  'Cross-referencing 12K market gaps...',
  'Scoring problems by opportunity size...',
  'Shortlisting your 5 best problems...',
]

const LOADING_STEPS_IDEAS = [
  'Analyzing your selected problem...',
  'Scanning 50,000+ forum discussions...',
  'Matching ideas to your budget & skills...',
  'Scoring 200+ opportunities by MRR...',
  'Filtering low-competition niches...',
  'Tailoring marketing to your channels...',
  'Generating your 10 best SaaS ideas...',
]

const IDEA_ACCENT = ['#8B5CF6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e', '#a855f7', '#22d3ee']
const IDEA_GLOW = IDEA_ACCENT.map(c => c + '14')
const IDEA_BORDER = IDEA_ACCENT.map(c => c + '47')

const FALLBACK_PROBLEMS: ProblemSuggestion[] = [
  { title: 'Freelance invoice tracking nightmare', description: 'Freelancers chase late payments and reconcile invoices by hand.', frequency: 'Daily', marketSize: '59M freelancers worldwide' },
  { title: 'Content calendar chaos for creators', description: 'Creators struggle to plan and repurpose content across platforms.', frequency: 'Weekly', marketSize: '$400B creator economy' },
  { title: 'Client feedback scattered across tools', description: 'Agencies waste hours consolidating feedback from many channels.', frequency: 'Daily', marketSize: '400K+ agencies globally' },
  { title: 'No-show appointments hurt revenue', description: 'Service businesses lose money from no-shows and late cancels.', frequency: 'Weekly', marketSize: '$1.2B lost annually' },
  { title: 'Onboarding still lives in spreadsheets', description: 'Small teams onboard new hires with manual scattered checklists.', frequency: 'Monthly', marketSize: '33M SMBs in the US' },
]

const FALLBACK_IDEAS: SaaSIdea[] = [
  { name: 'ContractPilot AI', tagline: 'Auto-review B2B contracts in seconds', mrrPotential: '$2.4K–$9K', competitionScore: 3, techComplexity: 'Medium', timeToMvp: '4–6 weeks', why: 'Matches your domain and budget', targetCustomer: 'SMBs with vendor contracts', competitors: ['DocuSign', 'PandaDoc', 'Ironclad'], marketingStrategy: 'LinkedIn thought leadership + cold email to legal ops' },
  { name: 'StatusBoard Pro', tagline: 'Real-time API monitoring for dev teams', mrrPotential: '$1.8K–$6K', competitionScore: 4, techComplexity: 'Low', timeToMvp: '2–4 weeks', why: 'Low competition niche for your tech level', targetCustomer: 'Dev teams at 5–50 person SaaS', competitors: ['Datadog', 'Better Uptime', 'Freshping'], marketingStrategy: 'Dev communities + Product Hunt launch' },
  { name: 'ChurnGuard', tagline: 'Predict and prevent SaaS churn', mrrPotential: '$3.2K–$14K', competitionScore: 5, techComplexity: 'Medium', timeToMvp: '5–8 weeks', why: 'High MRR ceiling, clear ROI for buyers', targetCustomer: 'B2B SaaS with 50–500 customers', competitors: ['Gainsight', 'ChurnZero', 'Intercom'], marketingStrategy: 'SaaS newsletters + onboarding tool partnerships' },
  { name: 'InboxZen', tagline: 'AI triage for support inboxes', mrrPotential: '$1.5K–$5K', competitionScore: 4, techComplexity: 'Low', timeToMvp: '3–5 weeks', why: 'Simple integration into existing helpdesks', targetCustomer: 'E-commerce brands under 50 employees', competitors: ['Zendesk', 'Freshdesk', 'Help Scout'], marketingStrategy: 'Shopify app store + ecom communities' },
  { name: 'ProposalFlow', tagline: 'Win more clients with AI proposals', mrrPotential: '$2K–$8K', competitionScore: 3, techComplexity: 'Low', timeToMvp: '3–4 weeks', why: 'High-value pain for agencies', targetCustomer: 'Freelance agencies under 10 people', competitors: ['Proposify', 'Better Proposals', 'Qwilr'], marketingStrategy: 'LinkedIn ads + freelancer communities' },
  { name: 'MeetingMind', tagline: 'Auto action items from any call', mrrPotential: '$1.2K–$4K', competitionScore: 6, techComplexity: 'Medium', timeToMvp: '4–6 weeks', why: 'Universal pain, easy trial conversion', targetCustomer: 'Remote-first teams of 5–25', competitors: ['Otter.ai', 'Fireflies', 'Notion AI'], marketingStrategy: 'Slack/Teams integrations + G2 SEO' },
  { name: 'BudgetSentinel', tagline: 'Alert before ad spend overruns', mrrPotential: '$1.8K–$7K', competitionScore: 3, techComplexity: 'Low', timeToMvp: '2–3 weeks', why: 'Direct ROI, quick payback', targetCustomer: 'Media buyers with multiple accounts', competitors: ['Optmyzr', 'Adalysis', 'WordStream'], marketingStrategy: 'Performance marketing groups + influencers' },
  { name: 'ReferralMachine', tagline: 'Referral programs in one click', mrrPotential: '$2K–$9K', competitionScore: 4, techComplexity: 'Low', timeToMvp: '3–5 weeks', why: 'Grows with customers, strong LTV', targetCustomer: 'Early-stage SaaS with 100–1K users', competitors: ['ReferralHero', 'Viral Loops', 'Rewardful'], marketingStrategy: 'Indie hackers + newsletter sponsorships' },
  { name: 'HireSignal', tagline: 'Find warm candidates early', mrrPotential: '$3K–$12K', competitionScore: 4, techComplexity: 'High', timeToMvp: '6–8 weeks', why: 'HR tech is evergreen, strong pricing', targetCustomer: 'HR managers at 50–200 person cos', competitors: ['LinkedIn Recruiter', 'Greenhouse', 'Lever'], marketingStrategy: 'HR communities + ATS partnerships' },
  { name: 'OnboardKit', tagline: 'No-code user onboarding flows', mrrPotential: '$1.5K–$6K', competitionScore: 5, techComplexity: 'Medium', timeToMvp: '4–6 weeks', why: 'Every SaaS needs this, expansion revenue', targetCustomer: 'Product teams at 10–100 person SaaS', competitors: ['Appcues', 'Intercom', 'UserGuiding'], marketingStrategy: 'Product Hunt + founder content on X' },
]

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

const EASE = [0.22, 1, 0.36, 1] as const

// ─── Shared sub-components ────────────────────────────────────────────────────

function ContinueButton({ disabled, onClick, label, isAnalyze }: {
  disabled: boolean; onClick: () => void; label: string; isAnalyze?: boolean
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: '13px', borderRadius: 14, fontWeight: 600, fontSize: '14px',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        background: disabled ? 'rgba(255,255,255,0.06)' : isAnalyze
          ? 'linear-gradient(135deg, #8B5CF6, #6d28d9)' : '#8B5CF6',
        color: disabled ? 'rgba(255,255,255,0.28)' : 'white',
        boxShadow: disabled ? 'none' : isAnalyze
          ? '0 8px 32px rgba(139,92,246,0.38), inset 0 1px 0 rgba(255,255,255,0.12)'
          : '0 4px 20px rgba(139,92,246,0.32)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'background 0.2s, box-shadow 0.2s',
      }}
    >
      {label}
      {!disabled && <ArrowRight style={{ width: 15, height: 15 }} strokeWidth={2.5} />}
    </motion.button>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 20px', borderRadius: 14, fontSize: '14px', fontWeight: 500,
        color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.04)', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s', fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.color = 'rgba(255,255,255,0.72)'; el.style.borderColor = 'rgba(255,255,255,0.18)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.color = 'rgba(255,255,255,0.45)'; el.style.borderColor = 'rgba(255,255,255,0.10)'
      }}
    >
      <ArrowLeft style={{ width: 14, height: 14 }} />
      Back
    </button>
  )
}

function StepNav({ onBack, onNext, disabled, label = 'Continue', isAnalyze }: {
  onBack?: () => void; onNext: () => void; disabled: boolean; label?: string; isAnalyze?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {onBack && <BackButton onClick={onBack} />}
      <div style={{ flex: 1 }}>
        <ContinueButton disabled={disabled} onClick={onNext} label={label} isAnalyze={isAnalyze} />
      </div>
    </div>
  )
}

function StepBadge({ n, tone = 'purple' }: { n: number | string; tone?: 'purple' | 'green' }) {
  const c = tone === 'green'
    ? { bg: 'rgba(57,255,136,0.1)', border: 'rgba(57,255,136,0.28)', dot: '#39FF88', text: '#39FF88' }
    : { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.28)', dot: '#8B5CF6', text: '#c4b5fd' }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '4px 13px', borderRadius: 99, marginBottom: 18,
        background: c.bg, border: `1px solid ${c.border}`,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot }}
      />
      <span style={{ fontSize: '11px', color: c.text, fontWeight: 700, letterSpacing: '0.06em' }}>
        {typeof n === 'number' ? `STEP ${n}` : n}
      </span>
    </motion.div>
  )
}

function StepHeading({ pre, accent, post, subtitle }: { pre: string; accent?: string; post?: string; subtitle: string }) {
  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        style={{ fontSize: 'clamp(23px, 3.1vw, 33px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 11 }}
      >
        {pre}
        {accent && (
          <>
            {' '}
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd 20%, #8B5CF6 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {accent}
            </span>
          </>
        )}
        {post}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: EASE }}
        style={{ fontSize: '14px', lineHeight: 1.68, color: 'rgba(255,255,255,0.45)', marginBottom: 26 }}
      >
        {subtitle}
      </motion.p>
    </>
  )
}

function ProgressBar({ current, total = 12 }: { current: number; total?: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em' }}>
          STEP {current} OF {total}
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <motion.div
          initial={false} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #7c3aed, #8B5CF6, #a78bfa)', boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}
        />
      </div>
    </div>
  )
}

// A premium selection card with floating glow, hover lift, spring checkmark.
function SelectionCard({ selected, onClick, icon, label, desc, accent = '#8B5CF6', index = 0, big }: {
  selected: boolean; onClick: () => void; icon?: string; label: string; desc?: string
  accent?: string; index?: number; big?: boolean
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 + index * 0.05 }}
      whileHover={{ scale: 1.025, y: -3 }} whileTap={{ scale: 0.975 }}
      onClick={onClick}
      style={{
        padding: big ? '22px 20px' : '16px 14px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
        background: selected ? `${accent}1f` : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${selected ? accent : 'rgba(255,255,255,0.09)'}`,
        boxShadow: selected ? `0 0 0 1px ${accent}30, 0 8px 30px ${accent}26` : '0 2px 10px rgba(0,0,0,0.18)',
        position: 'relative', fontFamily: 'inherit', transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
        overflow: 'hidden', width: '100%',
      }}
    >
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 340 }}
            style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Check style={{ width: 11, height: 11, color: 'white' }} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
      {icon && <div style={{ fontSize: big ? '30px' : '22px', marginBottom: big ? 12 : 9, lineHeight: 1 }}>{icon}</div>}
      <div style={{ fontSize: big ? '17px' : '13.5px', fontWeight: 700, marginBottom: desc ? 5 : 0, color: selected ? '#fff' : 'rgba(255,255,255,0.88)' }}>
        {label}
      </div>
      {desc && <div style={{ fontSize: big ? '13px' : '11.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</div>}
    </motion.button>
  )
}

// Generic single-question step (icon grid). Used for budget / approach / ads / age / time.
function ChoiceStep({ progressN, badgeN, pre, accent, post, subtitle, options, value, onSelect, onNext, onBack, columns = 2, illustration }: {
  progressN: number; badgeN: number; pre: string; accent?: string; post?: string; subtitle: string
  options: { value: string; icon: string; label: string; desc: string }[]
  value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void
  columns?: number; illustration?: React.ReactNode
}) {
  return (
    <div>
      <ProgressBar current={progressN} />
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={badgeN} />
          <StepHeading pre={pre} accent={accent} post={post} subtitle={subtitle} />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 12, marginBottom: 26 }}>
            {options.map((o, i) => (
              <SelectionCard key={o.value} selected={value === o.value} onClick={() => onSelect(o.value)} icon={o.icon} label={o.label} desc={o.desc} index={i} />
            ))}
          </div>
          <StepNav onBack={onBack} onNext={onNext} disabled={!value} />
        </div>
        {illustration && <div style={{ width: 260, flexShrink: 0 }}>{illustration}</div>}
      </div>
    </div>
  )
}

// ─── Illustrations ────────────────────────────────────────────────────────────

function StickyWallIllustration() {
  return (
    <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="280" height="338" viewBox="0 0 280 338" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="338" rx="20" fill="rgba(17,24,39,0.75)" />
        <rect width="280" height="338" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <rect x="16" y="16" width="248" height="198" rx="10" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="180" y1="82" x2="180" y2="116" stroke="rgba(139,92,246,0.32)" strokeWidth="1.2" strokeDasharray="4,3" />
        <line x1="202" y1="66" x2="210" y2="116" stroke="rgba(57,255,136,0.2)" strokeWidth="1.2" strokeDasharray="4,3" />
        <circle cx="180" cy="99" r="2.5" fill="rgba(139,92,246,0.55)" />
        <g transform="rotate(-3,64,62)"><rect x="32" y="38" width="64" height="48" rx="5" fill="rgba(251,191,36,0.14)" stroke="rgba(251,191,36,0.30)" strokeWidth="1" /><circle cx="64" cy="41" r="3" fill="rgba(251,191,36,0.48)" /><text x="64" y="66" textAnchor="middle" fill="rgba(251,191,36,0.78)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Customer</text><text x="64" y="78" textAnchor="middle" fill="rgba(251,191,36,0.78)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Pain Point</text></g>
        <g transform="rotate(2,148,57)"><rect x="116" y="32" width="64" height="50" rx="5" fill="rgba(139,92,246,0.18)" stroke="rgba(139,92,246,0.38)" strokeWidth="1" /><circle cx="148" cy="35" r="3" fill="rgba(139,92,246,0.62)" /><text x="148" y="60" textAnchor="middle" fill="rgba(167,139,250,0.88)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Market</text><text x="148" y="73" textAnchor="middle" fill="rgba(167,139,250,0.88)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Opportunity</text></g>
        <g transform="rotate(-2,228,62)"><rect x="198" y="40" width="60" height="44" rx="5" fill="rgba(57,255,136,0.12)" stroke="rgba(57,255,136,0.26)" strokeWidth="1" /><circle cx="228" cy="43" r="3" fill="rgba(57,255,136,0.48)" /><text x="228" y="65" textAnchor="middle" fill="rgba(57,255,136,0.75)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">MRR</text><text x="228" y="77" textAnchor="middle" fill="rgba(57,255,136,0.75)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Potential</text></g>
        <g transform="rotate(3,66,143)"><rect x="36" y="120" width="60" height="46" rx="5" fill="rgba(14,165,233,0.14)" stroke="rgba(14,165,233,0.28)" strokeWidth="1" /><circle cx="66" cy="123" r="3" fill="rgba(14,165,233,0.48)" /><text x="66" y="145" textAnchor="middle" fill="rgba(56,189,248,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Solution</text><text x="66" y="157" textAnchor="middle" fill="rgba(56,189,248,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Concept</text></g>
        <g transform="rotate(-2,180,139)"><rect x="148" y="116" width="64" height="48" rx="5" fill="rgba(244,114,182,0.13)" stroke="rgba(244,114,182,0.28)" strokeWidth="1" /><circle cx="180" cy="119" r="3" fill="rgba(244,114,182,0.48)" /><text x="180" y="140" textAnchor="middle" fill="rgba(249,168,212,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Target</text><text x="180" y="153" textAnchor="middle" fill="rgba(249,168,212,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Audience</text></g>
        <line x1="16" y1="230" x2="264" y2="230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <rect x="18" y="246" width="78" height="74" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" /><rect x="18" y="246" width="9" height="74" rx="3" fill="rgba(139,92,246,0.22)" /><line x1="35" y1="264" x2="88" y2="264" stroke="rgba(255,255,255,0.08)" strokeWidth="1" /><line x1="35" y1="275" x2="88" y2="275" stroke="rgba(255,255,255,0.07)" strokeWidth="1" /><line x1="35" y1="286" x2="88" y2="286" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <rect x="114" y="258" width="36" height="44" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" /><rect x="118" y="262" width="28" height="12" rx="3" fill="rgba(109,40,217,0.20)" /><path d="M150 272 Q164 272 164 282 Q164 292 150 292" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="176" y="248" width="86" height="72" rx="9" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" /><rect x="182" y="254" width="74" height="54" rx="5" fill="rgba(9,11,17,0.65)" />
        <rect x="192" y="294" width="9" height="10" rx="2" fill="rgba(139,92,246,0.45)" /><rect x="204" y="287" width="9" height="17" rx="2" fill="rgba(139,92,246,0.55)" /><rect x="216" y="279" width="9" height="25" rx="2" fill="rgba(139,92,246,0.70)" /><rect x="228" y="272" width="9" height="32" rx="2" fill="rgba(57,255,136,0.65)" /><rect x="240" y="266" width="9" height="38" rx="2" fill="rgba(57,255,136,0.85)" /><text x="219" y="267" textAnchor="middle" fill="rgba(57,255,136,0.55)" fontSize="6.5" fontWeight="700" fontFamily="Inter, sans-serif">MRR ↑</text>
      </svg>
    </motion.div>
  )
}

function AIHelperCard({ onUseExample }: { onUseExample: (text: string) => void }) {
  return (
    <div style={{ borderRadius: 16, padding: '18px 16px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💡</div>
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Need inspiration?</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {AI_EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => onUseExample(ex)}
            style={{ padding: '9px 12px', borderRadius: 10, textAlign: 'left', cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '12px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.5, transition: 'all 0.15s', fontFamily: 'inherit' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(139,92,246,0.08)'; el.style.borderColor = 'rgba(139,92,246,0.28)'; el.style.color = 'rgba(255,255,255,0.78)' }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.03)'; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.color = 'rgba(255,255,255,0.52)' }}>
            &quot;{ex}&quot;
          </button>
        ))}
      </div>
    </div>
  )
}

function PeopleTableIllustration() {
  return (
    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="320" rx="20" fill="rgba(17,24,39,0.75)" /><rect width="260" height="320" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="130" cy="45" rx="90" ry="50" fill="rgba(139,92,246,0.07)" />
        <ellipse cx="130" cy="162" rx="62" ry="54" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
        <circle cx="130" cy="78" r="17" fill="rgba(139,92,246,0.16)" stroke="rgba(139,92,246,0.38)" strokeWidth="1" /><circle cx="130" cy="74" r="7" fill="rgba(167,139,250,0.48)" />
        <circle cx="40" cy="162" r="16" fill="rgba(14,165,233,0.14)" stroke="rgba(14,165,233,0.32)" strokeWidth="1" /><circle cx="40" cy="158" r="7" fill="rgba(56,189,248,0.40)" />
        <circle cx="220" cy="162" r="16" fill="rgba(57,255,136,0.10)" stroke="rgba(57,255,136,0.26)" strokeWidth="1" /><circle cx="220" cy="158" r="7" fill="rgba(57,255,136,0.34)" />
        <circle cx="130" cy="246" r="16" fill="rgba(244,114,182,0.12)" stroke="rgba(244,114,182,0.28)" strokeWidth="1" /><circle cx="130" cy="242" r="7" fill="rgba(249,168,212,0.36)" />
        <rect x="150" y="54" width="62" height="24" rx="8" fill="rgba(139,92,246,0.16)" stroke="rgba(139,92,246,0.30)" strokeWidth="1" /><text x="181" y="70" textAnchor="middle" fill="rgba(167,139,250,0.85)" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">Pain point?</text>
        <rect x="14" y="138" width="60" height="22" rx="7" fill="rgba(14,165,233,0.14)" stroke="rgba(14,165,233,0.26)" strokeWidth="1" /><text x="44" y="153" textAnchor="middle" fill="rgba(56,189,248,0.82)" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">Every week!</text>
        <rect x="186" y="138" width="60" height="22" rx="7" fill="rgba(57,255,136,0.10)" stroke="rgba(57,255,136,0.22)" strokeWidth="1" /><text x="216" y="153" textAnchor="middle" fill="rgba(57,255,136,0.75)" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">Big market!</text>
        <rect x="16" y="288" width="228" height="22" rx="7" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" /><circle cx="32" cy="299" r="4" fill="rgba(57,255,136,0.45)" /><text x="42" y="303" fontSize="7.5" fill="rgba(255,255,255,0.35)" fontWeight="500" fontFamily="Inter, sans-serif">4 personas identified</text>
      </svg>
    </motion.div>
  )
}

function BifurcationIllustration() {
  return (
    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="320" rx="20" fill="rgba(17,24,39,0.75)" /><rect width="260" height="320" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="130" cy="270" rx="100" ry="44" fill="rgba(139,92,246,0.06)" />
        <circle cx="130" cy="258" r="9" fill="rgba(139,92,246,0.5)" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5" />
        <path d="M130 250 C 120 200, 80 150, 64 96" stroke="rgba(139,92,246,0.55)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M130 250 C 145 200, 190 160, 200 96" stroke="rgba(56,189,248,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="5,5" />
        <circle cx="64" cy="74" r="22" fill="rgba(139,92,246,0.16)" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" />
        <path d="M64 62 L67 71 L76 71 L69 77 L72 86 L64 80 L56 86 L59 77 L52 71 L61 71 Z" fill="rgba(167,139,250,0.9)" />
        <text x="64" y="116" textAnchor="middle" fill="rgba(167,139,250,0.85)" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">CLEAR GOAL</text>
        <circle cx="200" cy="74" r="22" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" strokeDasharray="4,4" />
        <text x="200" y="80" textAnchor="middle" fill="rgba(56,189,248,0.75)" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">?</text>
        <text x="200" y="116" textAnchor="middle" fill="rgba(56,189,248,0.6)" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">WE EXPLORE</text>
        <circle cx="100" cy="180" r="2.5" fill="rgba(255,255,255,0.2)" /><circle cx="160" cy="190" r="2.5" fill="rgba(255,255,255,0.15)" /><circle cx="130" cy="160" r="2" fill="rgba(139,92,246,0.4)" />
        <rect x="40" y="280" width="180" height="22" rx="7" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" /><text x="130" y="294" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontWeight="600" fontFamily="Inter, sans-serif">Choose your path</text>
      </svg>
    </motion.div>
  )
}

function DiscoveryIllustration() {
  return (
    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="320" rx="20" fill="rgba(17,24,39,0.75)" /><rect width="260" height="320" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="130" cy="120" rx="95" ry="80" fill="rgba(139,92,246,0.05)" />
        <line x1="70" y1="80" x2="130" y2="118" stroke="rgba(255,255,255,0.1)" strokeWidth="1" /><line x1="190" y1="70" x2="130" y2="118" stroke="rgba(255,255,255,0.1)" strokeWidth="1" /><line x1="60" y1="160" x2="130" y2="118" stroke="rgba(139,92,246,0.3)" strokeWidth="1" /><line x1="200" y1="170" x2="130" y2="118" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="70" cy="80" r="5" fill="rgba(251,191,36,0.5)" /><circle cx="190" cy="70" r="5" fill="rgba(56,189,248,0.5)" /><circle cx="60" cy="160" r="5" fill="rgba(57,255,136,0.5)" /><circle cx="200" cy="170" r="5" fill="rgba(244,114,182,0.5)" />
        <circle cx="118" cy="108" r="34" fill="none" stroke="rgba(139,92,246,0.55)" strokeWidth="3" />
        <line x1="142" y1="132" x2="166" y2="156" stroke="rgba(139,92,246,0.55)" strokeWidth="4" strokeLinecap="round" />
        <text x="118" y="118" textAnchor="middle" fontSize="26">💡</text>
        <rect x="24" y="226" width="212" height="74" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="40" y1="246" x2="180" y2="246" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" /><line x1="40" y1="262" x2="210" y2="262" stroke="rgba(255,255,255,0.07)" strokeWidth="2" strokeLinecap="round" /><line x1="40" y1="278" x2="150" y2="278" stroke="rgba(139,92,246,0.4)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

function PaymentIllustration() {
  return (
    <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="120" rx="90" ry="90" fill="rgba(57,255,136,0.05)" />
        <rect x="55" y="40" width="110" height="150" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M55 50 L65 44 L75 50 L85 44 L95 50 L105 44 L115 50 L125 44 L135 50 L145 44 L155 50 L165 44 L165 40 L55 40 Z" fill="rgba(255,255,255,0.04)" />
        <line x1="70" y1="74" x2="150" y2="74" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" /><line x1="70" y1="90" x2="130" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" /><line x1="70" y1="106" x2="140" y2="106" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="132" x2="120" y2="132" stroke="rgba(57,255,136,0.5)" strokeWidth="2" strokeLinecap="round" /><text x="150" y="137" textAnchor="end" fill="rgba(57,255,136,0.8)" fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif">€25</text>
        <circle cx="110" cy="170" r="14" fill="rgba(57,255,136,0.15)" stroke="rgba(57,255,136,0.5)" strokeWidth="1.5" /><path d="M104 170 L108 174 L116 165" stroke="rgba(57,255,136,0.95)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          <path d="M180 60 L183 68 L191 68 L184 73 L187 82 L180 77 L173 82 L176 73 L169 68 L177 68 Z" fill="rgba(251,191,36,0.7)" />
        </motion.g>
        <motion.circle cx="40" cy="100" r="3" fill="rgba(139,92,246,0.6)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
      </svg>
    </motion.div>
  )
}

// ─── Step 0: Intro ────────────────────────────────────────────────────────────

const JOURNEY = [
  { Icon: Lightbulb, title: 'Find a problem worth solving', desc: 'Start from a real frustration, or pick a domain you know.' },
  { Icon: UserRound, title: 'Map your founder profile', desc: 'Budget, skills and time shape every recommendation.' },
  { Icon: Target, title: 'Validate the opportunity', desc: 'Each idea is scored against its real competitors.' },
  { Icon: Map, title: 'Get your launch roadmap', desc: 'A marketing plan and a 30-day path, ready to run.' },
  { Icon: Rocket, title: 'Launch your SaaS', desc: 'Leave with a complete, actionable blueprint.', payoff: true },
]

const INTRO_TRUST = [
  { Icon: ShieldCheck, label: 'No credit card to start' },
  { Icon: Sparkles, label: 'AI-powered analysis' },
  { Icon: Clock, label: 'About 2 minutes' },
]

function IntroStep({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion()
  const rise = (delay: number) => reduce
    ? { initial: false as const, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay, ease: EASE } }

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <motion.div {...rise(0)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 13px', borderRadius: 99, marginBottom: 20, background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.28)' }}>
          <motion.span aria-hidden
            animate={reduce ? undefined : { opacity: [1, 0.35, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px rgba(167,139,250,0.8)' }} />
          <span style={{ fontSize: '12px', color: '#c4b5fd', fontWeight: 500, letterSpacing: '0.01em' }}>AI Product Builder</span>
        </motion.div>

        <motion.h1 {...rise(0.08)}
          style={{ fontSize: 'clamp(32px, 4.6vw, 46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.04, color: 'white', marginBottom: 16, textWrap: 'balance' }}>
          {`Let's build your next `}
          <span style={{ background: 'linear-gradient(135deg, #c4b5fd 20%, #8B5CF6 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SaaS.</span>
        </motion.h1>

        <motion.p {...rise(0.16)}
          style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: 392, margin: '0 auto' }}>
          Answer 12 quick questions. We turn your experience, budget and time into SaaS ideas actually worth building.
        </motion.p>
      </div>

      {/* Journey — outer shell + inner core (double-bezel) */}
      <motion.div {...rise(0.24)}
        style={{ borderRadius: 24, padding: 6, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 26 }}>
        <div style={{ position: 'relative', borderRadius: 18, padding: '22px 22px 20px', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
          {/* connecting line */}
          <motion.div aria-hidden
            initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            style={{ position: 'absolute', left: 40, top: 40, bottom: 42, width: 2, transformOrigin: 'top', borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6 0%, #7c5fe0 55%, #39FF88 100%)', opacity: 0.55 }} />

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {JOURNEY.map(({ Icon, title, desc, payoff }, i) => {
              const tint = payoff ? '#39FF88' : '#a78bfa'
              const tileBg = payoff ? 'rgba(57,255,136,0.12)' : 'rgba(139,92,246,0.14)'
              const tileBorder = payoff ? 'rgba(57,255,136,0.3)' : 'rgba(139,92,246,0.3)'
              return (
                <motion.div key={i}
                  initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.42 + i * 0.09, ease: EASE }}
                  style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 11, background: tileBg, border: `1px solid ${tileBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: payoff ? '0 0 16px rgba(57,255,136,0.18)' : '0 0 14px rgba(139,92,246,0.14)' }}>
                    <Icon style={{ width: 17, height: 17, color: tint }} strokeWidth={1.75} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: payoff ? '#eafff2' : 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.45 }}>{desc}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* CTA — button-in-button */}
      <motion.button {...rise(0.34)}
        onClick={onStart} initial={reduce ? false : 'rest'} whileHover={reduce ? undefined : 'hover'} whileTap={reduce ? undefined : { scale: 0.985 }}
        variants={{ rest: { scale: 1, boxShadow: '0 0 0 1px rgba(139,92,246,0.5), 0 8px 32px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.14)' }, hover: { scale: 1.02, boxShadow: '0 0 0 1px rgba(139,92,246,0.6), 0 12px 40px rgba(139,92,246,0.48), inset 0 1px 0 rgba(255,255,255,0.14)' } }}
        animate="rest"
        style={{ width: '100%', padding: '13px 14px 13px 24px', borderRadius: 16, background: 'linear-gradient(135deg, #8B5CF6 0%, #6d28d9 100%)', color: 'white', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 18, fontFamily: 'inherit' }}>
        <span style={{ paddingLeft: 2 }}>Start building</span>
        <motion.span variants={{ rest: { x: 0 }, hover: { x: 3 } }} transition={{ duration: 0.3, ease: EASE }}
          style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowRight style={{ width: 15, height: 15 }} strokeWidth={2.5} />
        </motion.span>
      </motion.button>

      {/* Trust row */}
      <motion.div {...rise(0.42)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
        {INTRO_TRUST.map(({ Icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon style={{ width: 13, height: 13, color: '#a78bfa', flexShrink: 0 }} strokeWidth={2} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)' }}>{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Step 1: Problem statement ────────────────────────────────────────────────

function ProblemStep({ userData, setDomain, setDomainChip, onNext, onBack }: {
  userData: UserData; setDomain: (v: string) => void; setDomainChip: (v: string) => void; onNext: () => void; onBack: () => void
}) {
  const [focused, setFocused] = useState(false)
  const charCount = userData.domain.length
  const canContinue = userData.domain.trim().length >= 30 || !!userData.domainChip

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const ta = e.target
    ta.style.height = 'auto'; ta.style.height = Math.max(180, ta.scrollHeight) + 'px'
    setDomain(e.target.value); if (e.target.value) setDomainChip('')
  }

  return (
    <div>
      <ProgressBar current={1} />
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={1} />
          <StepHeading pre="What recurring problem" accent="do you want to solve?" subtitle="Every successful SaaS starts by solving a real problem. Describe something frustrating that happens repeatedly in your work, studies or everyday life." />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }}
            style={{ borderRadius: 18, marginBottom: 18, background: 'rgba(17,24,39,0.7)', border: `1px solid ${focused ? 'rgba(139,92,246,0.48)' : 'rgba(255,255,255,0.09)'}`, boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.09), 0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.2)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
            <div style={{ padding: '16px 18px 10px' }}>
              <textarea value={userData.domain} onChange={handleTextChange}
                onFocus={() => { setFocused(true); if (userData.domainChip) { setDomain(''); setDomainChip('') } }}
                onBlur={() => setFocused(false)} placeholder="I waste hours every week doing..." maxLength={500}
                style={{ width: '100%', minHeight: '180px', border: 'none', outline: 'none', background: 'transparent', color: 'white', fontSize: '15px', lineHeight: 1.7, resize: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', padding: 0 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <motion.span animate={{ color: charCount >= 30 ? '#39FF88' : 'rgba(255,255,255,0.25)' }} transition={{ duration: 0.3 }} style={{ fontSize: '11.5px' }}>
                {charCount >= 30 ? '✓ Ready to continue' : charCount > 0 ? `${30 - charCount} more characters needed` : 'Write at least 30 characters'}
              </motion.span>
              <span style={{ fontSize: '11.5px', color: charCount > 450 ? '#fbbf24' : 'rgba(255,255,255,0.22)' }}>{charCount} / 500</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.07em', marginBottom: 10 }}>OR PICK A DOMAIN</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {DOMAIN_CHIPS.map((chip) => (
                <motion.button key={chip} whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
                  onClick={() => { setDomainChip(chip === userData.domainChip ? '' : chip); setDomain('') }}
                  style={{ padding: '7px 14px', borderRadius: 99, fontSize: '12.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: userData.domainChip === chip ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.05)', border: `1px solid ${userData.domainChip === chip ? 'rgba(139,92,246,0.55)' : 'rgba(255,255,255,0.09)'}`, color: userData.domainChip === chip ? '#c4b5fd' : 'rgba(255,255,255,0.55)', transition: 'background 0.15s, border-color 0.15s, color 0.15s' }}>
                  {chip}
                </motion.button>
              ))}
            </div>
          </motion.div>
          <StepNav onBack={onBack} onNext={onNext} disabled={!canContinue} />
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StickyWallIllustration />
          <AIHelperCard onUseExample={(t) => { setDomain(t); setDomainChip('') }} />
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Who experiences it ───────────────────────────────────────────────

function WhoStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <ProgressBar current={2} />
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={2} />
          <StepHeading pre="Who experiences" accent="this problem?" subtitle="This helps us find opportunities with real market demand." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
            {WHO_OPTIONS.map((o, i) => (
              <SelectionCard key={o.value} selected={value === o.value} onClick={() => onSelect(o.value)} icon={o.icon} label={o.label} desc={o.desc} index={i} />
            ))}
          </div>
          <StepNav onBack={onBack} onNext={onNext} disabled={!value} />
        </div>
        <div style={{ width: 260, flexShrink: 0 }}><PeopleTableIllustration /></div>
      </div>
    </div>
  )
}

// ─── Step 3: Do you know your problem? ────────────────────────────────────────

function KnowsProblemStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const tones: Record<string, string> = { yes: '#8B5CF6', no: '#0ea5e9' }
  return (
    <div>
      <ProgressBar current={3} />
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={3} />
          <StepHeading pre="Do you already" accent="know your problem?" subtitle="If you have a clear idea, we'll dive straight in. If not, we'll guide you to a great opportunity." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 28 }}>
            {[
              { value: 'yes', icon: '🎯', label: 'Yes, I know it', desc: 'I have a clear problem in mind that I want to solve.' },
              { value: 'no', icon: '🧭', label: 'Help me find one', desc: "I'm not sure yet — guide me to a great opportunity." },
            ].map((o, i) => (
              <SelectionCard key={o.value} selected={value === o.value} onClick={() => onSelect(o.value)} icon={o.icon} label={o.label} desc={o.desc} accent={tones[o.value]} index={i} big />
            ))}
          </div>
          <StepNav onBack={onBack} onNext={onNext} disabled={!value} />
        </div>
        <div style={{ width: 260, flexShrink: 0 }}><BifurcationIllustration /></div>
      </div>
    </div>
  )
}

// ─── Step 4: Discovery (3 fields) ─────────────────────────────────────────────

function DiscoveryField({ label, hint, value, onChange, placeholder, rows = 2 }: {
  label: string; hint: string; value: string; onChange: (v: string) => void; placeholder: string; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>{label}</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{hint}</span>
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: '100%', borderRadius: 12, padding: '12px 14px', background: 'rgba(17,24,39,0.7)', border: `1px solid ${focused ? 'rgba(139,92,246,0.48)' : 'rgba(255,255,255,0.09)'}`, color: 'white', fontSize: '14px', lineHeight: 1.6, resize: 'vertical', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.09)' : 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} />
    </div>
  )
}

function DiscoveryStep({ userData, setField, onNext, onBack }: {
  userData: UserData; setField: (k: keyof UserData, v: string) => void; onNext: () => void; onBack: () => void
}) {
  const canContinue = userData.dailyFrustrations.trim().length >= 10 || userData.passions.trim().length >= 5 || userData.profession.trim().length >= 3
  return (
    <div>
      <ProgressBar current={4} />
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={4} tone="green" />
          <StepHeading pre="Let's find your" accent="perfect problem" subtitle="A few quick questions and our AI will surface 5 real problems worth solving — tailored to you." />
          <DiscoveryField label="What frustrates you daily?" hint="you or someone close" value={userData.dailyFrustrations} onChange={(v) => setField('dailyFrustrations', v)} placeholder="Things that waste your time, annoy you, or feel broken..." rows={3} />
          <DiscoveryField label="What are your passions?" hint="optional" value={userData.passions} onChange={(v) => setField('passions', v)} placeholder="Hobbies, topics you love, communities you're part of..." rows={2} />
          <DiscoveryField label="Your profession or field of study?" hint="optional" value={userData.profession} onChange={(v) => setField('profession', v)} placeholder="e.g. Marketing student, freelance designer, nurse..." rows={1} />
          <div style={{ marginTop: 22 }}>
            <StepNav onBack={onBack} onNext={onNext} disabled={!canContinue} label="Find my problems" isAnalyze />
          </div>
        </div>
        <div style={{ width: 260, flexShrink: 0 }}><DiscoveryIllustration /></div>
      </div>
    </div>
  )
}

// ─── Step 5: Problem list (AI generated) ──────────────────────────────────────

function ProblemListStep({ userData, onSelect, onNext, onBack }: {
  userData: UserData; onSelect: (title: string) => void; onNext: () => void; onBack: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [problems, setProblems] = useState<ProblemSuggestion[]>([])
  const [msgIndex, setMsgIndex] = useState(0)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    const timers = LOADING_STEPS_PROBLEMS.map((_, i) => setTimeout(() => setMsgIndex(i), i * 750))
    fetch('/api/problems', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData) })
      .then(r => r.json())
      .then(d => { setProblems(Array.isArray(d.problems) && d.problems.length ? d.problems : FALLBACK_PROBLEMS) })
      .catch(() => setProblems(FALLBACK_PROBLEMS))
      .finally(() => setTimeout(() => setLoading(false), Math.max(0, 2600 - performance.now() % 1)))
    return () => timers.forEach(clearTimeout)
  }, [userData])

  const freqColor = (f: string) => f === 'Daily' ? '#f87171' : f === 'Weekly' ? '#fbbf24' : '#39FF88'

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, position: 'relative' }}>
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', background: 'rgba(139,92,246,0.2)' }} />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.15)', borderTop: '2px solid #8B5CF6' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>Finding your best problems</h2>
        <AnimatePresence mode="wait">
          <motion.p key={msgIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
            style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.45)' }}>{LOADING_STEPS_PROBLEMS[msgIndex]}</motion.p>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar current={5} />
      <StepBadge n={5} tone="green" />
      <StepHeading pre="Pick the problem" accent="worth solving" subtitle="We found 5 real opportunities based on your profile. Choose the one that resonates most." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
        {problems.map((p, i) => {
          const selected = userData.selectedProblem === p.title
          return (
            <motion.button key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.07 }}
              whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} onClick={() => onSelect(p.title)}
              style={{ textAlign: 'left', padding: '16px 18px', borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
                background: selected ? 'rgba(139,92,246,0.13)' : 'rgba(17,24,39,0.7)', border: `1.5px solid ${selected ? '#8B5CF6' : 'rgba(255,255,255,0.09)'}`,
                boxShadow: selected ? '0 0 0 1px rgba(139,92,246,0.3), 0 8px 30px rgba(139,92,246,0.16)' : '0 2px 10px rgba(0,0,0,0.2)', transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s' }}>
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 340 }}
                    style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 12, height: 12, color: 'white' }} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ fontSize: '15px', fontWeight: 700, color: selected ? '#fff' : 'rgba(255,255,255,0.9)', marginBottom: 5, paddingRight: 30 }}>{p.title}</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, marginBottom: 11 }}>{p.description}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: `${freqColor(p.frequency)}1a`, color: freqColor(p.frequency), border: `1px solid ${freqColor(p.frequency)}33` }}>⏱ {p.frequency}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>📊 {p.marketSize}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <StepNav onBack={onBack} onNext={onNext} disabled={!userData.selectedProblem} />
    </div>
  )
}

// ─── Step 9: Acquisition channels (multi-select) ──────────────────────────────

function AcquisitionStep({ value, onChange, onNext, onBack }: {
  value: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void
}) {
  const selected = value ? value.split(',').filter(Boolean) : []
  const toggle = (v: string) => {
    if (selected.includes(v)) onChange(selected.filter(x => x !== v).join(','))
    else if (selected.length < 3) onChange([...selected, v].join(','))
  }
  return (
    <div>
      <ProgressBar current={9} />
      <StepBadge n={9} />
      <StepHeading pre="How will you" accent="reach customers?" subtitle="Pick up to 3 channels you're most excited to use. We'll tailor your marketing plan around them." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 14 }}>
        {ACQUISITION_CHANNELS.map((c, i) => {
          const on = selected.includes(c.value)
          const disabled = !on && selected.length >= 3
          return (
            <motion.button key={c.value} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
              whileHover={disabled ? undefined : { scale: 1.03, y: -2 }} whileTap={disabled ? undefined : { scale: 0.97 }} onClick={() => toggle(c.value)}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', textAlign: 'left',
                background: on ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${on ? '#8B5CF6' : 'rgba(255,255,255,0.09)'}`,
                opacity: disabled ? 0.4 : 1, boxShadow: on ? '0 6px 24px rgba(139,92,246,0.18)' : 'none', transition: 'background 0.18s, border-color 0.18s, opacity 0.18s' }}>
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: on ? '#fff' : 'rgba(255,255,255,0.82)', flex: 1 }}>{c.value}</span>
              {on && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 340 }}
                  style={{ width: 18, height: 18, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check style={{ width: 10, height: 10, color: 'white' }} strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
      <div style={{ fontSize: '11.5px', color: selected.length === 3 ? '#fbbf24' : 'rgba(255,255,255,0.35)', marginBottom: 22, textAlign: 'center' }}>
        {selected.length} / 3 selected{selected.length === 3 ? ' — max reached' : ''}
      </div>
      <StepNav onBack={onBack} onNext={onNext} disabled={selected.length === 0} />
    </div>
  )
}

// ─── Step 10: B2C or B2B ──────────────────────────────────────────────────────

function MarketTypeStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const tones: Record<string, string> = { b2c: '#ec4899', b2b: '#0ea5e9' }
  return (
    <div>
      <ProgressBar current={10} />
      <StepBadge n={10} />
      <StepHeading pre="Who will you" accent="sell to?" subtitle="This shapes your pricing, your marketing tone, and how you'll find your first customers." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 28 }}>
        {MARKET_TYPE_OPTIONS.map((o, i) => {
          const selected = value === o.value
          const accent = tones[o.value]
          return (
            <motion.button key={o.value} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(o.value)}
              style={{ textAlign: 'left', padding: '22px 20px', borderRadius: 18, cursor: 'pointer', fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
                background: selected ? `${accent}1f` : 'rgba(255,255,255,0.04)', border: `1.5px solid ${selected ? accent : 'rgba(255,255,255,0.09)'}`,
                boxShadow: selected ? `0 0 0 1px ${accent}30, 0 10px 34px ${accent}26` : '0 2px 10px rgba(0,0,0,0.18)', transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s' }}>
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 340 }}
                    style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 12, height: 12, color: 'white' }} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ fontSize: '30px', marginBottom: 10 }}>{o.icon}</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: selected ? '#fff' : 'rgba(255,255,255,0.9)', marginBottom: 3 }}>{o.label}</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>{o.sub}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {o.examples.map((ex) => (
                  <div key={ex} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '11.5px', color: 'rgba(255,255,255,0.55)' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent, flexShrink: 0 }} />{ex}
                  </div>
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>
      <StepNav onBack={onBack} onNext={onNext} disabled={!value} />
    </div>
  )
}

// ─── Step 13: Loading ideas ───────────────────────────────────────────────────

function LoadingIdeasStep({ loadingStep }: { loadingStep: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, position: 'relative' }}>
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', background: 'rgba(139,92,246,0.2)' }} />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.15)', borderTop: '2px solid #8B5CF6' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>Generating your 10 SaaS ideas</h2>
      <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.38)', marginBottom: 36 }}>Our AI is scanning thousands of opportunities for you</p>
      <div style={{ textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
        {LOADING_STEPS_IDEAS.map((msg, i) => {
          const isDone = i < loadingStep, isActive = i === loadingStep
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: isDone || isActive ? 1 : 0.28, x: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 13 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: isDone ? '#39FF88' : isActive ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.07)', border: `1.5px solid ${isDone ? '#39FF88' : isActive ? '#8B5CF6' : 'rgba(255,255,255,0.10)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDone && <Check style={{ width: 11, height: 11, color: '#090B11' }} strokeWidth={3} />}
                {isActive && <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} />}
              </div>
              <span style={{ fontSize: '13px', lineHeight: 1.4, color: isDone ? 'rgba(255,255,255,0.65)' : isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)', fontWeight: isActive ? 500 : 400 }}>{msg}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 14: Select your idea (10-card grid) ─────────────────────────────────

function IdeaSelectionStep({ ideas, selectedIndex, onSelect, onNext, onBack }: {
  ideas: SaaSIdea[]; selectedIndex: string; onSelect: (i: string) => void; onNext: () => void; onBack: () => void
}) {
  const list = ideas.length ? ideas : FALLBACK_IDEAS
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <StepBadge n="20 IDEAS → PICK 1" tone="green" />
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: 6 }}>Your SaaS opportunities</h2>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.4)' }}>Select the idea you want a full blueprint for.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        {list.map((idea, i) => {
          const selected = selectedIndex === String(i)
          const accent = IDEA_ACCENT[i % IDEA_ACCENT.length]
          const comp = competitionLabel(idea.competitionScore)
          return (
            <motion.button key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.045 }}
              whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(String(i))}
              style={{ textAlign: 'left', padding: '16px 16px 14px', borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
                background: selected ? `${accent}1c` : 'rgba(17,24,39,0.7)', border: `1.5px solid ${selected ? accent : 'rgba(255,255,255,0.09)'}`,
                boxShadow: selected ? `0 0 0 1px ${accent}30, 0 10px 32px ${accent}26` : '0 2px 10px rgba(0,0,0,0.2)', transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 340 }}
                    style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 11, height: 11, color: 'white' }} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: 3, paddingRight: 26, marginTop: 4 }}>{idea.name}</div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.45, marginBottom: 11, minHeight: 32 }}>{idea.tagline}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(57,255,136,0.12)', border: '1px solid rgba(57,255,136,0.25)', marginBottom: 10 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#39FF88' }}>{idea.mrrPotential}</span>
                <span style={{ fontSize: '9.5px', color: 'rgba(57,255,136,0.6)' }}>MRR</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: `${comp.color}1a`, color: comp.color }}>{comp.label} comp.</span>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)' }}>{idea.techComplexity}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)' }}>{idea.timeToMvp}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <StepNav onBack={onBack} onNext={onNext} disabled={!selectedIndex} label="Unlock this blueprint" isAnalyze />
    </div>
  )
}

// ─── Step 15: Payment ─────────────────────────────────────────────────────────

const PLANS = [
  { id: 'week', price: '€7.90', period: '/week', name: 'Weekly', tagline: 'Start this week', accent: '#0ea5e9', badge: '', save: '' },
  { id: 'month', price: '€25', period: '/month', name: 'Monthly', tagline: 'For serious builders', accent: '#8B5CF6', badge: 'MOST POPULAR', save: 'Save 21% vs weekly' },
  { id: 'year', price: '€75', period: '/year', name: 'Annual', tagline: 'Best long-term value', accent: '#39FF88', badge: 'BEST VALUE', save: 'Save 75% vs monthly' },
]

const PLAN_FEATURES = ['Full SaaS analysis', 'Tailored marketing strategy', 'Competitor research', 'All 10 SaaS ideas unlocked', '30-day launch roadmap', 'Workspace dashboard access']

function PaymentStep({ ideaName, onPaid, onBack }: { ideaName: string; onPaid: () => void; onBack: () => void }) {
  const [processing, setProcessing] = useState<string | null>(null)
  const pick = (id: string) => { setProcessing(id); setTimeout(onPaid, 700) }
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <StepBadge n="UNLOCK" tone="purple" />
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: 6 }}>
          Unlock your <span style={{ background: 'linear-gradient(135deg,#c4b5fd,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{ideaName || 'SaaS'}</span> blueprint
        </h2>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.4)' }}>Cancel anytime. Instant access to your full plan.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        {PLANS.map((p, i) => {
          const popular = p.id === 'month'
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              style={{ position: 'relative', borderRadius: 18, padding: '20px 16px 18px', background: popular ? 'rgba(139,92,246,0.1)' : 'rgba(17,24,39,0.7)',
                border: `1.5px solid ${popular ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.09)'}`, boxShadow: popular ? '0 12px 40px rgba(139,92,246,0.22)' : '0 4px 18px rgba(0,0,0,0.25)',
                transform: popular ? 'scale(1.04)' : 'scale(1)', zIndex: popular ? 2 : 1 }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '3px 12px', borderRadius: 99, fontSize: '9.5px', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  background: p.accent, color: p.id === 'year' ? '#072' : '#fff', boxShadow: `0 4px 14px ${p.accent}66` }}>{p.badge}</div>
              )}
              <div style={{ fontSize: '12px', fontWeight: 700, color: p.accent, letterSpacing: '0.04em', marginBottom: 8, marginTop: p.badge ? 6 : 0 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{p.price}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{p.period}</span>
              </div>
              <div style={{ fontSize: '11px', color: p.save ? '#39FF88' : 'rgba(255,255,255,0.4)', marginBottom: 14, minHeight: 14 }}>{p.save || p.tagline}</div>
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => pick(p.id)} disabled={!!processing}
                style={{ width: '100%', padding: '11px', borderRadius: 12, fontSize: '13px', fontWeight: 700, cursor: processing ? 'wait' : 'pointer', border: 'none', fontFamily: 'inherit',
                  background: popular ? 'linear-gradient(135deg,#8B5CF6,#6d28d9)' : 'rgba(255,255,255,0.06)', color: popular ? '#fff' : 'rgba(255,255,255,0.85)',
                  boxShadow: popular ? '0 6px 22px rgba(139,92,246,0.4)' : 'none' }}>
                {processing === p.id ? 'Processing…' : 'Choose'}
              </motion.button>
            </motion.div>
          )
        })}
      </div>
      <div style={{ borderRadius: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px' }}>
          {PLAN_FEATURES.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(57,255,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check style={{ width: 9, height: 9, color: '#39FF88' }} strokeWidth={3} />
              </div>{f}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <button onClick={onBack} style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
          <ArrowLeft style={{ width: 13, height: 13 }} /> Back to ideas
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        {['🔒 Secure checkout', '↩️ Cancel anytime', '⚡ Instant access'].map(t => (
          <span key={t} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Step 16: Full results ────────────────────────────────────────────────────

const LAUNCH_PLAN = [
  { day: 'Days 1–5', title: 'Validate the problem', desc: 'Interview 10 potential customers, confirm the pain is real.' },
  { day: 'Days 6–12', title: 'Build your MVP', desc: 'Ship the smallest version that solves the core problem.' },
  { day: 'Days 13–18', title: 'Landing page + waitlist', desc: 'Launch a page, collect emails, set up analytics.' },
  { day: 'Days 19–25', title: 'First 10 users', desc: 'Onboard manually, gather feedback, iterate fast.' },
  { day: 'Days 26–30', title: 'Open paid plans', desc: 'Turn on pricing, drive your acquisition channels.' },
]

function FullResultsStep({ ideas, userData, onDashboard }: { ideas: SaaSIdea[]; userData: UserData; onDashboard: () => void }) {
  const list = ideas.length ? ideas : FALLBACK_IDEAS
  const idea = list[Number(userData.selectedIdeaIndex) || 0] || list[0]
  const accent = IDEA_ACCENT[(Number(userData.selectedIdeaIndex) || 0) % IDEA_ACCENT.length]
  const channels = userData.acquisitionChannels ? userData.acquisitionChannels.split(',').filter(Boolean) : ['SEO / Content']
  const competitors = idea.competitors && idea.competitors.length ? idea.competitors : ['Established player A', 'Incumbent B', 'Startup C']
  const bars = [22, 38, 55, 71, 88, 100]

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 99, marginBottom: 14, background: 'rgba(57,255,136,0.1)', border: '1px solid rgba(57,255,136,0.28)' }}>
          <Sparkles style={{ width: 12, height: 12, color: '#39FF88' }} />
          <span style={{ fontSize: '11px', color: '#39FF88', fontWeight: 600, letterSpacing: '0.06em' }}>BLUEPRINT READY</span>
        </motion.div>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>Your SaaS blueprint is ready</h2>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
        {/* LEFT */}
        <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ borderRadius: 18, padding: '22px', background: `${accent}14`, border: `1px solid ${accent}47`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: 4 }}>{idea.name}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>{idea.tagline}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(57,255,136,0.12)', border: '1px solid rgba(57,255,136,0.25)', marginBottom: 14 }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#39FF88' }}>{idea.mrrPotential}</span>
              <span style={{ fontSize: '11px', color: 'rgba(57,255,136,0.6)' }}>MRR potential</span>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12.5px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>💡 {idea.why}</div>
          </motion.div>

          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Megaphone style={{ width: 16, height: 16, color: '#8B5CF6' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Marketing strategy</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 14 }}>
              {idea.marketingStrategy || `Target ${userData.marketType === 'b2b' ? 'businesses' : 'consumers'} through your chosen channels with a budget of ${userData.adsBudget || 'organic reach'}.`}
            </p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
              {channels.map(c => (
                <span key={c} style={{ fontSize: '11px', fontWeight: 600, padding: '5px 11px', borderRadius: 99, background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.28)' }}>{c}</span>
              ))}
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '5px 11px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)' }}>{userData.marketType === 'b2b' ? 'B2B' : 'B2C'}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '5px 11px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)' }}>Ads: {userData.adsBudget || '€0'}</span>
            </div>
          </div>

          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Calendar style={{ width: 16, height: 16, color: '#39FF88' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>30-day launch plan</span>
            </div>
            <div style={{ position: 'relative', paddingLeft: 22 }}>
              <div style={{ position: 'absolute', left: 6, top: 4, bottom: 4, width: 2, background: 'linear-gradient(180deg, #8B5CF6, rgba(57,255,136,0.6))' }} />
              {LAUNCH_PLAN.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                  style={{ position: 'relative', marginBottom: i < LAUNCH_PLAN.length - 1 ? 16 : 0 }}>
                  <div style={{ position: 'absolute', left: -22, top: 2, width: 12, height: 12, borderRadius: '50%', background: '#8B5CF6', border: '2px solid #090B11', boxShadow: '0 0 0 2px rgba(139,92,246,0.3)' }} />
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.04em', marginBottom: 2 }}>{m.day}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: 2 }}>{m.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{m.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Target style={{ width: 16, height: 16, color: '#f87171' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Top competitors</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {competitors.slice(0, 3).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${IDEA_ACCENT[i]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: IDEA_ACCENT[i] }}>{c.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{c}</div>
                    <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.35)' }}>Established competitor</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp style={{ width: 16, height: 16, color: '#39FF88' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Revenue projection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
              {bars.map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
                  style={{ flex: 1, borderRadius: '4px 4px 0 0', background: i >= 4 ? 'linear-gradient(180deg,#39FF88,rgba(57,255,136,0.4))' : 'linear-gradient(180deg,#8B5CF6,rgba(139,92,246,0.4))' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'rgba(255,255,255,0.3)' }}>
              <span>M1</span><span>M3</span><span>M6</span>
            </div>
          </div>

          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: 12 }}>Resources</div>
            {['Product Hunt launch guide', 'Cold email templates', 'MVP tech stack checklist'].map((r) => (
              <a key={r} href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: '12.5px', color: '#a78bfa', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <ArrowRight style={{ width: 12, height: 12 }} />{r}
              </a>
            ))}
          </div>
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={onDashboard}
        style={{ width: '100%', padding: '15px', borderRadius: 14, background: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', boxShadow: '0 8px 32px rgba(139,92,246,0.42)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
        Open my dashboard <ArrowRight style={{ width: 17, height: 17 }} strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}

// ─── Step 17: Dashboard ───────────────────────────────────────────────────────

const SOCIALS = [
  { id: 'tiktok', name: 'TikTok', color: '#000', accent: '#25F4EE', icon: '🎵' },
  { id: 'instagram', name: 'Instagram', color: '#E1306C', accent: '#E1306C', icon: '📸' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', accent: '#1877F2', icon: '👍' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', accent: '#FF0000', icon: '▶️' },
]

const WEEK_TASKS = [
  'Define your ideal customer profile (ICP)',
  'Set up your landing page & waitlist',
  'Join 3 relevant communities',
  'Write 5 pieces of content for your channels',
  'Reach out to 10 potential users',
  'Set up analytics & tracking',
  'Draft your first ad campaign',
]

function DashboardStep({ ideas, userData, onRestart }: { ideas: SaaSIdea[]; userData: UserData; onRestart: () => void }) {
  const list = ideas.length ? ideas : FALLBACK_IDEAS
  const idea = list[Number(userData.selectedIdeaIndex) || 0] || list[0]
  const [connected, setConnected] = useState<Record<string, boolean>>({})
  const [tasks, setTasks] = useState<boolean[]>(new Array(WEEK_TASKS.length).fill(false))
  const [campaign, setCampaign] = useState('')
  const channels = userData.acquisitionChannels ? userData.acquisitionChannels.split(',').filter(Boolean) : []
  const adFormat = userData.marketType === 'b2b' ? 'LinkedIn carousel + cold email sequences' : 'Short-form video ads (TikTok / Reels)'
  const doneCount = tasks.filter(Boolean).length

  const stats = [
    { label: 'MRR goal', value: idea.mrrPotential, icon: '💰', color: '#39FF88' },
    { label: 'Est. launch', value: idea.timeToMvp, icon: '🚀', color: '#8B5CF6' },
    { label: 'Market', value: userData.marketType === 'b2b' ? 'B2B' : 'B2C', icon: '🎯', color: '#0ea5e9' },
    { label: 'Ads budget', value: userData.adsBudget || '€0', icon: '📊', color: '#fbbf24' },
  ]

  return (
    <div>
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ borderRadius: 20, padding: '26px 24px', marginBottom: 18, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(109,40,217,0.12))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div style={{ position: 'absolute', top: -40, right: -20, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)' }} />
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.07em', marginBottom: 8 }}>YOUR WORKSPACE</div>
        <div style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>{idea.name}</div>
        <div style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.55)' }}>{idea.tagline}</div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }}
            style={{ borderRadius: 14, padding: '14px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: s.color, marginBottom: 2, lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
        {/* Connect accounts */}
        <div style={{ flex: '1 1 320px', borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: 4 }}>Connect your accounts</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Link your channels to publish & track from one place.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SOCIALS.map((s) => {
              const on = connected[s.id]
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${on ? s.accent + '55' : 'rgba(255,255,255,0.07)'}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>{s.icon}</div>
                  <span style={{ flex: 1, fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{s.name}</span>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setConnected(p => ({ ...p, [s.id]: !p[s.id] }))}
                    style={{ padding: '7px 14px', borderRadius: 9, fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                      background: on ? 'rgba(57,255,136,0.15)' : s.accent, color: on ? '#39FF88' : '#fff', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {on ? <><Check style={{ width: 12, height: 12 }} strokeWidth={3} /> Connected</> : 'Connect'}
                  </motion.button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Configure ads */}
        <div style={{ flex: '1 1 280px', borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: 16 }}>Configure your ads</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>Monthly budget</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fbbf24' }}>{userData.adsBudget || '€0 (organic)'}</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>Suggested format</div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{adFormat}</div>
            </div>
            {channels.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {channels.map(c => <span key={c} style={{ fontSize: '10.5px', fontWeight: 600, padding: '4px 9px', borderRadius: 99, background: 'rgba(139,92,246,0.12)', color: '#c4b5fd' }}>{c}</span>)}
              </div>
            )}
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Campaign name</div>
              <input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g. Launch — Week 1"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(9,11,17,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <button style={{ padding: '10px', borderRadius: 10, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'rgba(139,92,246,0.16)', color: '#c4b5fd', fontFamily: 'inherit' }}>Launch campaign (demo)</button>
          </div>
        </div>
      </div>

      {/* Action plan */}
      <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>First week action plan</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: doneCount === WEEK_TASKS.length ? '#39FF88' : 'rgba(255,255,255,0.4)' }}>{doneCount} / {WEEK_TASKS.length} done</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WEEK_TASKS.map((t, i) => {
            const done = tasks[i]
            return (
              <button key={i} onClick={() => setTasks(p => p.map((v, j) => j === i ? !v : v))}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 11, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  background: done ? 'rgba(57,255,136,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? 'rgba(57,255,136,0.25)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.15s' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: done ? '#39FF88' : 'transparent', border: `1.5px solid ${done ? '#39FF88' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done && <Check style={{ width: 12, height: 12, color: '#090B11' }} strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '13px', color: done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.8)', textDecoration: done ? 'line-through' : 'none' }}>{t}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ flex: 1, padding: '13px', borderRadius: 14, fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', color: '#fff', boxShadow: '0 6px 22px rgba(139,92,246,0.35)' }}>Share my blueprint</button>
        <button style={{ flex: 1, padding: '13px', borderRadius: 14, fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>Download (PDF)</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
        <button onClick={onRestart} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}>Start a new project</button>
      </div>
    </div>
  )
}

// ─── Main BuilderClient ───────────────────────────────────────────────────────

const WIDTHS: Record<number, number> = {
  0: 520, 1: 900, 2: 900, 3: 900, 4: 900, 5: 620, 6: 560, 7: 560, 8: 560,
  9: 560, 10: 620, 11: 560, 12: 560, 13: 520, 14: 760, 15: 880, 16: 1000, 17: 1120,
}

export function BuilderClient() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [userData, setUserData] = useState<UserData>(EMPTY_DATA)
  const [loadingStep, setLoadingStep] = useState(0)
  const [ideas, setIdeas] = useState<SaaSIdea[]>([])
  const [apiDone, setApiDone] = useState(false)

  const goTo = useCallback((next: number, forceDir?: number) => {
    setDir(forceDir !== undefined ? forceDir : next > step ? 1 : -1)
    setStep(next)
  }, [step])

  const set = (key: keyof UserData, val: string) => setUserData(prev => ({ ...prev, [key]: val }))

  // Trigger idea generation at step 13
  useEffect(() => {
    if (step !== 13) return
    setLoadingStep(0); setApiDone(false)
    const timers = LOADING_STEPS_IDEAS.map((_, i) => setTimeout(() => setLoadingStep(i + 1), (i + 1) * 700))
    fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData) })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.ideas) && d.ideas.length) setIdeas(d.ideas); setApiDone(true) })
      .catch(() => setApiDone(true))
    return () => timers.forEach(clearTimeout)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step === 13 && apiDone && loadingStep >= LOADING_STEPS_IDEAS.length) {
      const t = setTimeout(() => { setDir(1); setStep(14) }, 500)
      return () => clearTimeout(t)
    }
  }, [step, apiDone, loadingStep])

  const restart = () => {
    setUserData(EMPTY_DATA); setIdeas([]); setApiDone(false); setLoadingStep(0); goTo(0, -1)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#090B11', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Ambient background — inherited from the landing page (grid + dual purple glow) */}
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.5, maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 30%, transparent 80%)' }} />
      <div style={{ position: 'fixed', top: '-22%', left: '50%', transform: 'translateX(-50%)', width: '760px', height: '540px', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(139,92,246,0.06) 38%, transparent 72%)' }} />
      <div style={{ position: 'fixed', top: '8%', left: '12%', width: '420px', height: '420px', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      {/* Top nav */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(9,11,17,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #8B5CF6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L12 4.25V9.75L7 12.5L2 9.75V4.25L7 1.5Z" fill="white" fillOpacity="0.92" /><circle cx="7" cy="7" r="2.2" fill="white" fillOpacity="0.45" /></svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>SaaSGenrt</span>
        </a>
        {step >= 1 && step <= 12 && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.04em' }}>{step} / 12</div>
        )}
        <div style={{ width: 60 }} />
      </div>

      {/* Main */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: '60px' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: EASE }}
            style={{ width: '100%', maxWidth: WIDTHS[step] || 560, padding: '40px 20px 60px', margin: '0 auto' }}>

            {step === 0 && <IntroStep onStart={() => goTo(1)} />}
            {step === 1 && <ProblemStep userData={userData} setDomain={(v) => set('domain', v)} setDomainChip={(v) => set('domainChip', v)} onNext={() => goTo(2)} onBack={() => goTo(0)} />}
            {step === 2 && <WhoStep value={userData.problemOwner} onSelect={(v) => set('problemOwner', v)} onNext={() => goTo(3)} onBack={() => goTo(1)} />}
            {step === 3 && <KnowsProblemStep value={userData.knowsProblem} onSelect={(v) => set('knowsProblem', v)} onNext={() => goTo(userData.knowsProblem === 'yes' ? 5 : 4)} onBack={() => goTo(2)} />}
            {step === 4 && <DiscoveryStep userData={userData} setField={set} onNext={() => goTo(5)} onBack={() => goTo(3)} />}
            {step === 5 && <ProblemListStep userData={userData} onSelect={(t) => set('selectedProblem', t)} onNext={() => goTo(6)} onBack={() => goTo(userData.knowsProblem === 'yes' ? 3 : 4)} />}
            {step === 6 && <ChoiceStep progressN={6} badgeN={6} pre="What's your" accent="launch budget?" subtitle="How much can you invest to get your SaaS off the ground?" options={LAUNCH_BUDGET_OPTIONS} value={userData.launchBudget} onSelect={(v) => set('launchBudget', v)} onNext={() => goTo(7)} onBack={() => goTo(5)} />}
            {step === 7 && <ChoiceStep progressN={7} badgeN={7} pre="How will you" accent="build it?" subtitle="This determines your timeline, costs, and the ideas we recommend." options={BUILD_APPROACH_OPTIONS} value={userData.buildApproach} onSelect={(v) => set('buildApproach', v)} onNext={() => goTo(8)} onBack={() => goTo(6)} columns={1} />}
            {step === 8 && <ChoiceStep progressN={8} badgeN={8} pre="Monthly budget" accent="for ads?" subtitle="We'll adapt your acquisition strategy to match your spend." options={ADS_BUDGET_OPTIONS} value={userData.adsBudget} onSelect={(v) => set('adsBudget', v)} onNext={() => goTo(9)} onBack={() => goTo(7)} />}
            {step === 9 && <AcquisitionStep value={userData.acquisitionChannels} onChange={(v) => set('acquisitionChannels', v)} onNext={() => goTo(10)} onBack={() => goTo(8)} />}
            {step === 10 && <MarketTypeStep value={userData.marketType} onSelect={(v) => set('marketType', v)} onNext={() => goTo(11)} onBack={() => goTo(9)} />}
            {step === 11 && <ChoiceStep progressN={11} badgeN={11} pre="What's your" accent="age range?" subtitle="This helps us understand your audience and time horizon." options={AGE_OPTIONS} value={userData.age} onSelect={(v) => set('age', v)} onNext={() => goTo(12)} onBack={() => goTo(10)} />}
            {step === 12 && <ChoiceStep progressN={12} badgeN={12} pre="Time you can" accent="commit per day?" subtitle="We'll size your roadmap to fit your real availability." options={TIME_PER_DAY_OPTIONS} value={userData.timePerDay} onSelect={(v) => set('timePerDay', v)} onNext={() => goTo(13)} onBack={() => goTo(11)} />}
            {step === 13 && <LoadingIdeasStep loadingStep={loadingStep} />}
            {step === 14 && <IdeaSelectionStep ideas={ideas} selectedIndex={userData.selectedIdeaIndex} onSelect={(i) => set('selectedIdeaIndex', i)} onNext={() => goTo(15)} onBack={() => goTo(12)} />}
            {step === 15 && <PaymentStep ideaName={(ideas.length ? ideas : FALLBACK_IDEAS)[Number(userData.selectedIdeaIndex) || 0]?.name || ''} onPaid={() => goTo(16)} onBack={() => goTo(14)} />}
            {step === 16 && <FullResultsStep ideas={ideas} userData={userData} onDashboard={() => goTo(17)} />}
            {step === 17 && <DashboardStep ideas={ideas} userData={userData} onRestart={restart} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}






