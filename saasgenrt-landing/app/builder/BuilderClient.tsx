'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Sparkles, TrendingUp, Target, Rocket, Calendar, Megaphone, Clock, Lightbulb, UserRound, Map, ShieldCheck, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
  'B2B SaaS', 'Outils Dev', 'E-commerce', 'Santé',
  'Marketing', 'Finance', 'RH & Recrutement', 'Formation',
  'LegalTech', 'Immobilier', 'Support Client', 'Analytics',
]

const WHO_OPTIONS = [
  { value: 'myself', icon: '👤', label: 'Moi-même', desc: 'Un problème que tu vis au quotidien.' },
  { value: 'company', icon: '🏢', label: 'Mon entreprise', desc: 'Un problème récurrent dans ton activité.' },
  { value: 'clients', icon: '🤝', label: 'Mes clients', desc: 'Un problème que rencontrent souvent tes clients.' },
  { value: 'family', icon: '👨‍👩‍👧', label: 'Amis & Famille', desc: 'Quelqu\'un de proche vit ça.' },
  { value: 'community', icon: '🌍', label: 'Une communauté', desc: 'Un secteur ou niche que tu connais bien.' },
  { value: 'unsure', icon: '❓', label: "Je ne sais pas encore", desc: "On va t'aider à trouver la meilleure opportunité." },
]

const LAUNCH_BUDGET_OPTIONS = [
  { value: '<€500', icon: '🌱', label: 'Moins de 500 €', desc: 'Bootstrappé & débrouillard' },
  { value: '€500–€2K', icon: '🚀', label: '500 € – 2 000 €', desc: 'Lancement lean' },
  { value: '€2K–€10K', icon: '💼', label: '2 000 € – 10 000 €', desc: 'Démarrage financé' },
  { value: '€10K+', icon: '🏦', label: '10 000 € et plus', desc: 'Bien capitalisé' },
]

const BUILD_APPROACH_OPTIONS = [
  { value: 'code', icon: '⌨️', label: 'Je code moi-même', desc: 'Contrôle total, tu construis de A à Z.' },
  { value: 'vibe', icon: '🤖', label: 'IA (vibe coding)', desc: 'Construire vite avec des assistants IA.' },
  { value: 'nocode', icon: '🧩', label: 'Outils no-code', desc: 'Bubble, Webflow, Airtable & co.' },
]

const ADS_BUDGET_OPTIONS = [
  { value: '€0 (organic)', icon: '🌿', label: '0 € / organique', desc: 'Contenu & communauté seulement' },
  { value: '<€500/mo', icon: '📈', label: 'Moins de 500 €/mois', desc: 'Petits tests payants' },
  { value: '€500–€2K/mo', icon: '🎯', label: '500 – 2 000 €/mois', desc: 'Acquisition en croissance' },
  { value: '€2K+/mo', icon: '🔥', label: '2 000 €+ / mois', desc: 'Croissance agressive' },
]

const ACQUISITION_CHANNELS = [
  { value: 'TikTok', icon: '🎵' },
  { value: 'Instagram', icon: '📸' },
  { value: 'LinkedIn', icon: '💼' },
  { value: 'X / Twitter', icon: '🐦' },
  { value: 'SEO / Contenu', icon: '🔍' },
  { value: 'YouTube', icon: '▶️' },
  { value: 'Email froid', icon: '✉️' },
  { value: 'Communautés', icon: '💬' },
]

const MARKET_TYPE_OPTIONS = [
  { value: 'b2c', icon: '🛍️', label: 'B2C', sub: 'Vente aux particuliers', examples: ['Particuliers & créateurs', 'Prix impulse-friendly', 'Marketing viral et visuel'] },
  { value: 'b2b', icon: '🏢', label: 'B2B', sub: 'Vente aux entreprises', examples: ['Entreprises & équipes', 'Tickets plus élevés', 'Vente basée sur la relation'] },
]

const AGE_OPTIONS = [
  { value: '18–24', icon: '🎓', label: '18 – 24 ans', desc: 'Étudiant / début de carrière' },
  { value: '25–34', icon: '⚡', label: '25 – 34 ans', desc: 'En train de prendre de l\'élan' },
  { value: '35–44', icon: '🎯', label: '35 – 44 ans', desc: 'Expertise au sommet' },
  { value: '45–54', icon: '🧠', label: '45 – 54 ans', desc: 'Expérience profonde' },
  { value: '55+', icon: '🌟', label: '55 ans et plus', desc: 'Sagesse & réseau' },
]

const TIME_PER_DAY_OPTIONS = [
  { value: '<1h/day', icon: '🌙', label: 'Moins d\'1h / jour', desc: 'Petites fenêtres de temps' },
  { value: '1–3h/day', icon: '🌗', label: '1 – 3h / jour', desc: 'Soirs & week-ends' },
  { value: '3–6h/day', icon: '🌤️', label: '3 – 6h / jour', desc: 'Side hustle sérieux' },
  { value: 'Full-time', icon: '☀️', label: 'Temps plein', desc: 'À fond' },
]

const AI_EXAMPLES = [
  'Je passe trop de temps à créer mes factures.',
  'J\'ai du mal à organiser les retours de mes clients.',
  'Je ne sais jamais quoi poster sur les réseaux.',
]

const LOADING_STEPS_PROBLEMS = [
  'Lecture de ton profil & frustrations...',
  'Analyse de 12 000 opportunités de marché...',
  'Classement par taille d\'opportunité...',
  'Sélection de tes 5 meilleurs problèmes...',
]

const LOADING_STEPS_IDEAS = [
  'Analyse du problème sélectionné...',
  'Scan de 50 000+ discussions en ligne...',
  'Correspondance avec ton budget & compétences...',
  'Notation de 200+ opportunités par MRR...',
  'Filtrage des niches à faible concurrence...',
  'Adaptation du marketing à tes canaux...',
  'Génération de tes 10 meilleures idées SaaS...',
]

const IDEA_ACCENT = ['#8B5CF6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e', '#a855f7', '#22d3ee']
const IDEA_GLOW = IDEA_ACCENT.map(c => c + '14')
const IDEA_BORDER = IDEA_ACCENT.map(c => c + '47')

const FALLBACK_PROBLEMS: ProblemSuggestion[] = [
  { title: 'La galère des factures freelance', description: 'Les freelances courent après les paiements en retard et réconcilent les factures à la main.', frequency: 'Quotidien', marketSize: '59M freelances dans le monde' },
  { title: 'Chaos dans le calendrier de contenu', description: 'Les créateurs peinent à planifier et réutiliser leur contenu sur plusieurs plateformes.', frequency: 'Hebdomadaire', marketSize: '400 Mds $ — économie créateur' },
  { title: 'Retours clients éparpillés partout', description: 'Les agences perdent des heures à consolider les retours de tous leurs canaux.', frequency: 'Quotidien', marketSize: '400K+ agences dans le monde' },
  { title: 'Les no-shows font perdre de l\'argent', description: 'Les pros des services perdent du chiffre à cause des annulations de dernière minute.', frequency: 'Hebdomadaire', marketSize: '1,2 Mds $ perdus par an' },
  { title: 'L\'onboarding encore dans des tableurs', description: 'Les petites équipes intègrent les nouveaux avec des checklists manuelles éparpillées.', frequency: 'Mensuel', marketSize: '33M PME aux États-Unis' },
]

const FALLBACK_IDEAS: SaaSIdea[] = [
  { name: 'ContractPilot AI', tagline: 'Révision auto de contrats B2B en quelques secondes', mrrPotential: '2 400 €–9 000 €', competitionScore: 3, techComplexity: 'Moyen', timeToMvp: '4–6 semaines', why: 'Correspond à ton domaine et ton budget', targetCustomer: 'PME avec des contrats fournisseurs', competitors: ['DocuSign', 'PandaDoc', 'Ironclad'], marketingStrategy: 'Thought leadership LinkedIn + cold email équipes juridiques' },
  { name: 'StatusBoard Pro', tagline: 'Monitoring API en temps réel pour devs', mrrPotential: '1 800 €–6 000 €', competitionScore: 4, techComplexity: 'Faible', timeToMvp: '2–4 semaines', why: 'Niche peu concurrentielle pour ton niveau technique', targetCustomer: 'Équipes dev dans des SaaS de 5–50 personnes', competitors: ['Datadog', 'Better Uptime', 'Freshping'], marketingStrategy: 'Communautés dev + lancement Product Hunt' },
  { name: 'ChurnGuard', tagline: 'Prédit et prévient le churn SaaS', mrrPotential: '3 200 €–14 000 €', competitionScore: 5, techComplexity: 'Moyen', timeToMvp: '5–8 semaines', why: 'Plafond MRR élevé, ROI clair pour les acheteurs', targetCustomer: 'SaaS B2B avec 50–500 clients', competitors: ['Gainsight', 'ChurnZero', 'Intercom'], marketingStrategy: 'Newsletters SaaS + partenariats outils onboarding' },
  { name: 'InboxZen', tagline: 'Triage IA pour les boîtes de support', mrrPotential: '1 500 €–5 000 €', competitionScore: 4, techComplexity: 'Faible', timeToMvp: '3–5 semaines', why: 'Intégration simple dans les helpdesks existants', targetCustomer: 'E-commerces de moins de 50 employés', competitors: ['Zendesk', 'Freshdesk', 'Help Scout'], marketingStrategy: 'App store Shopify + communautés e-com' },
  { name: 'ProposalFlow', tagline: 'Gagne plus de clients avec des devis IA', mrrPotential: '2 000 €–8 000 €', competitionScore: 3, techComplexity: 'Faible', timeToMvp: '3–4 semaines', why: 'Douleur forte pour les agences, prix justifié', targetCustomer: 'Agences freelance de moins de 10 personnes', competitors: ['Proposify', 'Better Proposals', 'Qwilr'], marketingStrategy: 'Pubs LinkedIn + communautés freelances' },
  { name: 'MeetingMind', tagline: 'Actions auto depuis n\'importe quel appel', mrrPotential: '1 200 €–4 000 €', competitionScore: 6, techComplexity: 'Moyen', timeToMvp: '4–6 semaines', why: 'Douleur universelle, conversion facile en essai', targetCustomer: 'Équipes remote de 5–25 personnes', competitors: ['Otter.ai', 'Fireflies', 'Notion AI'], marketingStrategy: 'Intégrations Slack/Teams + SEO G2' },
  { name: 'BudgetSentinel', tagline: 'Alerte avant le dépassement de budget pub', mrrPotential: '1 800 €–7 000 €', competitionScore: 3, techComplexity: 'Faible', timeToMvp: '2–3 semaines', why: 'ROI direct, retour rapide sur investissement', targetCustomer: 'Media buyers avec plusieurs comptes', competitors: ['Optmyzr', 'Adalysis', 'WordStream'], marketingStrategy: 'Groupes marketing à la performance + influenceurs' },
  { name: 'ReferralMachine', tagline: 'Programmes de parrainage en un clic', mrrPotential: '2 000 €–9 000 €', competitionScore: 4, techComplexity: 'Faible', timeToMvp: '3–5 semaines', why: 'Grandit avec les clients, LTV élevée', targetCustomer: 'SaaS early-stage avec 100–1K utilisateurs', competitors: ['ReferralHero', 'Viral Loops', 'Rewardful'], marketingStrategy: 'Indie hackers + sponsoring newsletters' },
  { name: 'HireSignal', tagline: 'Trouve les candidats chauds avant les autres', mrrPotential: '3 000 €–12 000 €', competitionScore: 4, techComplexity: 'Élevé', timeToMvp: '6–8 semaines', why: 'La tech RH est pérenne, pricing solide', targetCustomer: 'Responsables RH dans des boîtes de 50–200 personnes', competitors: ['LinkedIn Recruiter', 'Greenhouse', 'Lever'], marketingStrategy: 'Communautés RH + partenariats ATS' },
  { name: 'OnboardKit', tagline: 'Onboarding utilisateur no-code', mrrPotential: '1 500 €–6 000 €', competitionScore: 5, techComplexity: 'Moyen', timeToMvp: '4–6 semaines', why: 'Tous les SaaS en ont besoin, revenu d\'expansion', targetCustomer: 'Équipes produit dans des SaaS de 10–100 personnes', competitors: ['Appcues', 'Intercom', 'UserGuiding'], marketingStrategy: 'Product Hunt + contenu fondateur sur X' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function competitionLabel(score: number) {
  if (score <= 3) return { label: 'Faible', color: '#39FF88' }
  if (score <= 6) return { label: 'Moyen', color: '#fbbf24' }
  return { label: 'Élevé', color: '#f87171' }
}

function complexityStyle(c: string) {
  if (c === 'Faible') return { color: '#39FF88', bg: 'rgba(57,255,136,0.1)', border: 'rgba(57,255,136,0.22)' }
  if (c === 'Moyen') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.22)' }
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
      Retour
    </button>
  )
}

function StepNav({ onBack, onNext, disabled, label = 'Continuer', isAnalyze }: {
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
  const reduce = useReducedMotion()
  const c = tone === 'green'
    ? { bg: 'rgba(57,255,136,0.1)', border: 'rgba(57,255,136,0.28)', dot: '#39FF88', text: '#39FF88' }
    : { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.28)', dot: '#8B5CF6', text: '#c4b5fd' }
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={reduce ? {} : { duration: 0.4, ease: EASE }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '4px 13px', borderRadius: 99, marginBottom: 18,
        background: c.bg, border: `1px solid ${c.border}`,
      }}
    >
      <motion.div
        animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot }}
      />
      <span style={{ fontSize: '11px', color: c.text, fontWeight: 700, letterSpacing: '0.06em' }}>
        {typeof n === 'number' ? `ÉTAPE ${n}` : n}
      </span>
    </motion.div>
  )
}

function StepHeading({ pre, accent, post, subtitle }: { pre: string; accent?: string; post?: string; subtitle: string }) {
  const reduce = useReducedMotion()
  return (
    <>
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={reduce ? {} : { duration: 0.5, delay: 0.08, ease: EASE }}
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
        initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={reduce ? {} : { duration: 0.4, delay: 0.16, ease: EASE }}
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
          ÉTAPE {current} / {total}
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
  const reduce = useReducedMotion()
  return (
    <motion.button
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduce ? 0 : 0.15 + index * 0.05 }}
      whileHover={reduce ? undefined : { scale: 1.025, y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.975 }}
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
            initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduce ? {} : { scale: 0, opacity: 0 }}
            transition={reduce ? {} : { duration: 0.2, type: 'spring', stiffness: 340 }}
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
  const reduce = useReducedMotion()
  const rise = (delay: number) => reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } }

  return (
    <div>
      <ProgressBar current={progressN} />
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={badgeN} />
          <StepHeading pre={pre} accent={accent} post={post} subtitle={subtitle} />
          <motion.div {...rise(0.18)} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 11, marginBottom: 26 }}>
            {options.map((o, i) => (
              <SelectionCard key={o.value} selected={value === o.value} onClick={() => onSelect(o.value)} icon={o.icon} label={o.label} desc={o.desc} index={i} />
            ))}
          </motion.div>
          <StepNav onBack={onBack} onNext={onNext} disabled={!value} />
        </div>
        {illustration && <div style={{ width: 260, flexShrink: 0 }}>{illustration}</div>}
      </div>
    </div>
  )
}

// ─── Illustrations ────────────────────────────────────────────────────────────

function StickyWallIllustration() {
  const reduce = useReducedMotion()
  return (
    <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="280" height="338" viewBox="0 0 280 338" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="338" rx="20" fill="rgba(17,24,39,0.75)" />
        <rect width="280" height="338" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <rect x="16" y="16" width="248" height="198" rx="10" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="180" y1="82" x2="180" y2="116" stroke="rgba(139,92,246,0.32)" strokeWidth="1.2" strokeDasharray="4,3" />
        <line x1="202" y1="66" x2="210" y2="116" stroke="rgba(57,255,136,0.2)" strokeWidth="1.2" strokeDasharray="4,3" />
        <circle cx="180" cy="99" r="2.5" fill="rgba(139,92,246,0.55)" />
        <g transform="rotate(-3,64,62)"><rect x="32" y="38" width="64" height="48" rx="5" fill="rgba(251,191,36,0.14)" stroke="rgba(251,191,36,0.30)" strokeWidth="1" /><circle cx="64" cy="41" r="3" fill="rgba(251,191,36,0.48)" /><text x="64" y="66" textAnchor="middle" fill="rgba(251,191,36,0.78)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Douleur</text><text x="64" y="78" textAnchor="middle" fill="rgba(251,191,36,0.78)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Client</text></g>
        <g transform="rotate(2,148,57)"><rect x="116" y="32" width="64" height="50" rx="5" fill="rgba(139,92,246,0.18)" stroke="rgba(139,92,246,0.38)" strokeWidth="1" /><circle cx="148" cy="35" r="3" fill="rgba(139,92,246,0.62)" /><text x="148" y="60" textAnchor="middle" fill="rgba(167,139,250,0.88)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Opportunité</text><text x="148" y="73" textAnchor="middle" fill="rgba(167,139,250,0.88)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Marché</text></g>
        <g transform="rotate(-2,228,62)"><rect x="198" y="40" width="60" height="44" rx="5" fill="rgba(57,255,136,0.12)" stroke="rgba(57,255,136,0.26)" strokeWidth="1" /><circle cx="228" cy="43" r="3" fill="rgba(57,255,136,0.48)" /><text x="228" y="65" textAnchor="middle" fill="rgba(57,255,136,0.75)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">MRR</text><text x="228" y="77" textAnchor="middle" fill="rgba(57,255,136,0.75)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Potentiel</text></g>
        <g transform="rotate(3,66,143)"><rect x="36" y="120" width="60" height="46" rx="5" fill="rgba(14,165,233,0.14)" stroke="rgba(14,165,233,0.28)" strokeWidth="1" /><circle cx="66" cy="123" r="3" fill="rgba(14,165,233,0.48)" /><text x="66" y="145" textAnchor="middle" fill="rgba(56,189,248,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Solution</text><text x="66" y="157" textAnchor="middle" fill="rgba(56,189,248,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Concept</text></g>
        <g transform="rotate(-2,180,139)"><rect x="148" y="116" width="64" height="48" rx="5" fill="rgba(244,114,182,0.13)" stroke="rgba(244,114,182,0.28)" strokeWidth="1" /><circle cx="180" cy="119" r="3" fill="rgba(244,114,182,0.48)" /><text x="180" y="140" textAnchor="middle" fill="rgba(249,168,212,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Audience</text><text x="180" y="153" textAnchor="middle" fill="rgba(249,168,212,0.80)" fontSize="8.5" fontWeight="600" fontFamily="Inter, sans-serif">Cible</text></g>
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
  const reduce = useReducedMotion()
  return (
    <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="320" rx="20" fill="rgba(17,24,39,0.75)" /><rect width="260" height="320" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="130" cy="45" rx="90" ry="50" fill="rgba(139,92,246,0.07)" />
        <ellipse cx="130" cy="162" rx="62" ry="54" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
        <circle cx="130" cy="78" r="17" fill="rgba(139,92,246,0.16)" stroke="rgba(139,92,246,0.38)" strokeWidth="1" /><circle cx="130" cy="74" r="7" fill="rgba(167,139,250,0.48)" />
        <circle cx="40" cy="162" r="16" fill="rgba(14,165,233,0.14)" stroke="rgba(14,165,233,0.32)" strokeWidth="1" /><circle cx="40" cy="158" r="7" fill="rgba(56,189,248,0.40)" />
        <circle cx="220" cy="162" r="16" fill="rgba(57,255,136,0.10)" stroke="rgba(57,255,136,0.26)" strokeWidth="1" /><circle cx="220" cy="158" r="7" fill="rgba(57,255,136,0.34)" />
        <circle cx="130" cy="246" r="16" fill="rgba(244,114,182,0.12)" stroke="rgba(244,114,182,0.28)" strokeWidth="1" /><circle cx="130" cy="242" r="7" fill="rgba(249,168,212,0.36)" />
        <rect x="150" y="54" width="62" height="24" rx="8" fill="rgba(139,92,246,0.16)" stroke="rgba(139,92,246,0.30)" strokeWidth="1" /><text x="181" y="70" textAnchor="middle" fill="rgba(167,139,250,0.85)" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">Problème ?</text>
        <rect x="14" y="138" width="60" height="22" rx="7" fill="rgba(14,165,233,0.14)" stroke="rgba(14,165,233,0.26)" strokeWidth="1" /><text x="44" y="153" textAnchor="middle" fill="rgba(56,189,248,0.82)" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">Chaque sem. !</text>
        <rect x="186" y="138" width="60" height="22" rx="7" fill="rgba(57,255,136,0.10)" stroke="rgba(57,255,136,0.22)" strokeWidth="1" /><text x="216" y="153" textAnchor="middle" fill="rgba(57,255,136,0.75)" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">Grand marché !</text>
        <rect x="16" y="288" width="228" height="22" rx="7" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" /><circle cx="32" cy="299" r="4" fill="rgba(57,255,136,0.45)" /><text x="42" y="303" fontSize="7.5" fill="rgba(255,255,255,0.35)" fontWeight="500" fontFamily="Inter, sans-serif">4 personas identifiés</text>
      </svg>
    </motion.div>
  )
}

function BifurcationIllustration() {
  const reduce = useReducedMotion()
  return (
    <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="320" rx="20" fill="rgba(17,24,39,0.75)" /><rect width="260" height="320" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="130" cy="270" rx="100" ry="44" fill="rgba(139,92,246,0.06)" />
        <circle cx="130" cy="258" r="9" fill="rgba(139,92,246,0.5)" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5" />
        <path d="M130 250 C 120 200, 80 150, 64 96" stroke="rgba(139,92,246,0.55)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M130 250 C 145 200, 190 160, 200 96" stroke="rgba(56,189,248,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="5,5" />
        <circle cx="64" cy="74" r="22" fill="rgba(139,92,246,0.16)" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" />
        <path d="M64 62 L67 71 L76 71 L69 77 L72 86 L64 80 L56 86 L59 77 L52 71 L61 71 Z" fill="rgba(167,139,250,0.9)" />
        <text x="64" y="116" textAnchor="middle" fill="rgba(167,139,250,0.85)" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">OBJECTIF CLAIR</text>
        <circle cx="200" cy="74" r="22" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" strokeDasharray="4,4" />
        <text x="200" y="80" textAnchor="middle" fill="rgba(56,189,248,0.75)" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">?</text>
        <text x="200" y="116" textAnchor="middle" fill="rgba(56,189,248,0.6)" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">ON EXPLORE</text>
        <circle cx="100" cy="180" r="2.5" fill="rgba(255,255,255,0.2)" /><circle cx="160" cy="190" r="2.5" fill="rgba(255,255,255,0.15)" /><circle cx="130" cy="160" r="2" fill="rgba(139,92,246,0.4)" />
        <rect x="40" y="280" width="180" height="22" rx="7" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" /><text x="130" y="294" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontWeight="600" fontFamily="Inter, sans-serif">Choisis ton chemin</text>
      </svg>
    </motion.div>
  )
}

function DiscoveryIllustration() {
  const reduce = useReducedMotion()
  return (
    <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
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
  const reduce = useReducedMotion()
  return (
    <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="120" rx="90" ry="90" fill="rgba(57,255,136,0.05)" />
        <rect x="55" y="40" width="110" height="150" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M55 50 L65 44 L75 50 L85 44 L95 50 L105 44 L115 50 L125 44 L135 50 L145 44 L155 50 L165 44 L165 40 L55 40 Z" fill="rgba(255,255,255,0.04)" />
        <line x1="70" y1="74" x2="150" y2="74" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" /><line x1="70" y1="90" x2="130" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" /><line x1="70" y1="106" x2="140" y2="106" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="132" x2="120" y2="132" stroke="rgba(57,255,136,0.5)" strokeWidth="2" strokeLinecap="round" /><text x="150" y="137" textAnchor="end" fill="rgba(57,255,136,0.8)" fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif">€25</text>
        <circle cx="110" cy="170" r="14" fill="rgba(57,255,136,0.15)" stroke="rgba(57,255,136,0.5)" strokeWidth="1.5" /><path d="M104 170 L108 174 L116 165" stroke="rgba(57,255,136,0.95)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <motion.g animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          <path d="M180 60 L183 68 L191 68 L184 73 L187 82 L180 77 L173 82 L176 73 L169 68 L177 68 Z" fill="rgba(251,191,36,0.7)" />
        </motion.g>
        <motion.circle cx="40" cy="100" r="3" fill="rgba(139,92,246,0.6)" animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
      </svg>
    </motion.div>
  )
}

// ─── Step 0: Intro ────────────────────────────────────────────────────────────

const JOURNEY = [
  { Icon: Lightbulb, title: 'Trouver un problème qui en vaut la peine', desc: 'Pars d\'une vraie frustration ou d\'un domaine que tu maîtrises.' },
  { Icon: UserRound, title: 'Définir ton profil de fondateur', desc: 'Budget, compétences et temps façonnent chaque recommandation.' },
  { Icon: Target, title: 'Valider l\'opportunité', desc: 'Chaque idée est scorée face à ses vrais concurrents.' },
  { Icon: Map, title: 'Obtenir ta feuille de route de lancement', desc: 'Un plan marketing et un chemin de 30 jours, prêt à exécuter.' },
  { Icon: Rocket, title: 'Lancer ton SaaS', desc: 'Repars avec un blueprint complet et actionnable.', payoff: true },
]

const INTRO_TRUST = [
  { Icon: ShieldCheck, label: 'Sans carte bancaire' },
  { Icon: Sparkles, label: 'Analyse IA' },
  { Icon: Clock, label: 'Environ 2 minutes' },
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
          <span style={{ fontSize: '12px', color: '#c4b5fd', fontWeight: 500, letterSpacing: '0.01em' }}>IA Product Builder</span>
        </motion.div>

        <motion.h1 {...rise(0.08)}
          style={{ fontSize: 'clamp(32px, 4.6vw, 46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.04, color: 'white', marginBottom: 16, textWrap: 'balance' }}>
          {`Construisons ton prochain `}
          <span style={{ background: 'linear-gradient(135deg, #c4b5fd 20%, #8B5CF6 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SaaS.</span>
        </motion.h1>

        <motion.p {...rise(0.16)}
          style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: 392, margin: '0 auto' }}>
          Réponds à 12 questions. On transforme ton expérience, ton budget et ton temps en idées SaaS qui valent vraiment la peine.
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
        <span style={{ paddingLeft: 2 }}>Commencer</span>
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
  const reduce = useReducedMotion()
  const [focused, setFocused] = useState(false)
  const charCount = userData.domain.length
  const canContinue = userData.domain.trim().length >= 30 || !!userData.domainChip

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const ta = e.target
    ta.style.height = 'auto'; ta.style.height = Math.max(148, ta.scrollHeight) + 'px'
    setDomain(e.target.value); if (e.target.value) setDomainChip('')
  }

  const rise = (delay: number) => reduce
    ? {}
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } }

  return (
    <div>
      <ProgressBar current={1} />
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── Left column ── */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={1} />
          <StepHeading
            pre="Quel problème récurrent"
            accent="veux-tu résoudre ?"
            subtitle="Décris quelque chose de frustrant qui se répète dans ton travail ou ta vie — plus c'est précis, mieux c'est."
          />

          {/* Double-bezel textarea */}
          <motion.div
            {...rise(0.22)}
            style={{
              borderRadius: 22, padding: 5, marginBottom: 20,
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${focused ? 'rgba(139,92,246,0.42)' : 'rgba(255,255,255,0.06)'}`,
              boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.08), 0 8px 32px rgba(0,0,0,0.28)' : '0 4px 20px rgba(0,0,0,0.18)',
              transition: 'border-color 0.2s, box-shadow 0.25s',
            }}
          >
            <div style={{
              borderRadius: 17, overflow: 'hidden',
              background: 'rgba(10,13,20,0.68)',
              border: `1px solid ${focused ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)'}`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              transition: 'border-color 0.2s',
            }}>
              <textarea
                value={userData.domain}
                onChange={handleTextChange}
                onFocus={() => { setFocused(true); if (userData.domainChip) { setDomain(''); setDomainChip('') } }}
                onBlur={() => setFocused(false)}
                placeholder="ex. Je perds des heures chaque semaine à réconcilier mes factures manuellement..."
                maxLength={500}
                style={{
                  width: '100%', minHeight: '148px', border: 'none', outline: 'none',
                  background: 'transparent', color: 'white', fontSize: '14.5px', lineHeight: 1.72,
                  resize: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                  padding: '16px 18px 12px',
                }}
              />
              {/* Footer strip */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 18px 10px', borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                <motion.span
                  animate={{ color: charCount >= 30 ? '#39FF88' : 'rgba(255,255,255,0.28)' }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <AnimatePresence mode="wait">
                    {charCount >= 30 && (
                      <motion.span key="check"
                        initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduce ? {} : { scale: 0, opacity: 0 }}
                        transition={reduce ? {} : { type: 'spring', stiffness: 380, damping: 20 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Check style={{ width: 10, height: 10 }} strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {charCount >= 30 ? 'Prêt à continuer' : charCount > 0 ? `encore ${30 - charCount} caractères` : 'Écris au moins 30 caractères'}
                </motion.span>
                <span style={{ fontSize: '11px', color: charCount > 450 ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}>
                  {charCount} / 500
                </span>
              </div>
            </div>
          </motion.div>

          {/* Domain chips — with centered divider */}
          <motion.div {...rise(0.3)} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.26)', fontWeight: 600, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                ou choisis un domaine
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {DOMAIN_CHIPS.map((chip, i) => (
                <motion.button
                  key={chip}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.26, delay: 0.32 + i * 0.028, ease: EASE }}
                  whileHover={reduce ? undefined : { scale: 1.04, y: -1 }}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  onClick={() => { setDomainChip(chip === userData.domainChip ? '' : chip); setDomain('') }}
                  style={{
                    padding: '6px 13px', borderRadius: 99, fontSize: '12px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    background: userData.domainChip === chip ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${userData.domainChip === chip ? 'rgba(139,92,246,0.52)' : 'rgba(255,255,255,0.08)'}`,
                    color: userData.domainChip === chip ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                    boxShadow: userData.domainChip === chip ? '0 0 10px rgba(139,92,246,0.18)' : 'none',
                  }}
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <StepNav onBack={onBack} onNext={onNext} disabled={!canContinue} />
        </div>

        {/* ── Right column ── */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StickyWallIllustration />

          {/* Premium inspiration card — double-bezel */}
          <motion.div
            {...rise(0.36)}
            style={{
              borderRadius: 20, padding: 4,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(139,92,246,0.18)',
            }}
          >
            <div style={{
              borderRadius: 16, padding: '15px 14px',
              background: 'rgba(10,13,20,0.72)',
              border: '1px solid rgba(139,92,246,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles style={{ width: 13, height: 13, color: '#a78bfa' }} strokeWidth={2} />
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>Besoin d'inspiration ?</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {AI_EXAMPLES.map((ex, i) => (
                  <motion.button
                    key={i}
                    whileHover={reduce ? undefined : { x: 3 }}
                    transition={{ duration: 0.16, ease: EASE }}
                    onClick={() => { setDomain(ex); setDomainChip('') }}
                    style={{
                      padding: '9px 11px', borderRadius: 9, textAlign: 'left', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      fontSize: '11.5px', color: 'rgba(255,255,255,0.46)', lineHeight: 1.55,
                      transition: 'background 0.14s, border-color 0.14s, color 0.14s',
                      fontFamily: 'inherit', display: 'flex', alignItems: 'flex-start', gap: 7,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'rgba(139,92,246,0.09)'
                      el.style.borderColor = 'rgba(139,92,246,0.24)'
                      el.style.color = 'rgba(255,255,255,0.74)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'rgba(255,255,255,0.03)'
                      el.style.borderColor = 'rgba(255,255,255,0.06)'
                      el.style.color = 'rgba(255,255,255,0.46)'
                    }}
                  >
                    <ArrowRight style={{ width: 10, height: 10, flexShrink: 0, marginTop: 2, color: 'rgba(139,92,246,0.55)' }} strokeWidth={2.5} />
                    <span>&quot;{ex}&quot;</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}

// ─── Step 2: Who experiences it ───────────────────────────────────────────────

function WhoStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const reduce = useReducedMotion()
  const rise = (delay: number) => reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } }

  return (
    <div>
      <ProgressBar current={2} />
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={2} />
          <StepHeading
            pre="Qui vit"
            accent="ce problème ?"
            subtitle="L'audience façonne tout le produit. Choisis qui ressent cette frustration le plus."
          />
          <motion.div
            {...rise(0.18)}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 11, marginBottom: 14 }}
          >
            {WHO_OPTIONS.map((o, i) => (
              <SelectionCard key={o.value} selected={value === o.value} onClick={() => onSelect(o.value)} icon={o.icon} label={o.label} desc={o.desc} index={i} />
            ))}
          </motion.div>

          {/* Context hint — appears when a card is selected */}
          <div style={{ minHeight: 44, marginBottom: 16 }}>
            <AnimatePresence mode="wait">
              {value && (
                <motion.div
                  key={value}
                  initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                  transition={reduce ? {} : { duration: 0.26, ease: EASE }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '9px 13px', borderRadius: 10,
                    background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)',
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.45 }}>
                    {WHO_OPTIONS.find(o => o.value === value)?.desc}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <StepNav onBack={onBack} onNext={onNext} disabled={!value} />
        </div>
        <div style={{ width: 260, flexShrink: 0 }}>
          <PeopleTableIllustration />
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Do you know your problem? ────────────────────────────────────────

const KNOWS_CHOICES = [
  {
    value: 'yes', emoji: '🎯',
    label: 'Oui, j\'ai mon idée',
    desc: 'J\'ai un problème précis en tête que je veux valider et construire.',
    tag: 'Aller directement',
    accent: '#8B5CF6', accentFill: 'rgba(139,92,246,0.14)', accentBorder: 'rgba(139,92,246,0.36)',
  },
  {
    value: 'no', emoji: '🧭',
    label: 'Aide-moi à en trouver un',
    desc: "Je ne suis pas sûr encore — guide-moi vers la meilleure opportunité selon mon profil.",
    tag: 'Découverte guidée par IA',
    accent: '#0ea5e9', accentFill: 'rgba(14,165,233,0.12)', accentBorder: 'rgba(14,165,233,0.30)',
  },
]

function KnowsProblemStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const reduce = useReducedMotion()

  return (
    <div>
      <ProgressBar current={3} />
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <StepBadge n={3} />
        <StepHeading
          pre="Tu as déjà"
          accent="ton idée ?"
          subtitle="Si tu sais où tu vas, on plonge directement. Sinon, notre IA trouve la meilleure opportunité pour toi."
        />

        {/* Side-by-side hero choice cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 26 }}>
          {KNOWS_CHOICES.map((c, i) => {
            const sel = value === c.value
            return (
              <motion.button
                key={c.value}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.18 + i * 0.09, ease: EASE }}
                whileHover={reduce ? undefined : { scale: 1.025, y: -5 }}
                whileTap={reduce ? undefined : { scale: 0.975 }}
                onClick={() => onSelect(c.value)}
                style={{
                  position: 'relative', textAlign: 'left',
                  padding: '24px 22px 22px', borderRadius: 20,
                  cursor: 'pointer', fontFamily: 'inherit', overflow: 'hidden',
                  background: sel ? c.accentFill : 'rgba(255,255,255,0.035)',
                  border: `1.5px solid ${sel ? c.accent : 'rgba(255,255,255,0.09)'}`,
                  boxShadow: sel
                    ? `0 0 0 1px ${c.accentBorder}, 0 12px 40px ${c.accentFill}`
                    : '0 2px 12px rgba(0,0,0,0.2)',
                  transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Top accent line when selected */}
                {sel && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`,
                    opacity: 0.65,
                  }} />
                )}

                {/* Spring checkmark */}
                <AnimatePresence>
                  {sel && (
                    <motion.div
                      initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduce ? {} : { scale: 0, opacity: 0 }}
                      transition={reduce ? {} : { type: 'spring', stiffness: 360, damping: 22 }}
                      style={{
                        position: 'absolute', top: 14, right: 14,
                        width: 22, height: 22, borderRadius: '50%',
                        background: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Check style={{ width: 11, height: 11, color: 'white' }} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ fontSize: '26px', marginBottom: 14, lineHeight: 1 }}>{c.emoji}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: sel ? '#fff' : 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.62, marginBottom: 18 }}>
                  {c.desc}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 99,
                  background: sel ? `${c.accent}22` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${sel ? c.accentBorder : 'rgba(255,255,255,0.08)'}`,
                  transition: 'background 0.2s, border-color 0.2s',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: sel ? c.accent : 'rgba(255,255,255,0.38)', letterSpacing: '0.02em' }}>
                    {c.tag}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        <StepNav onBack={onBack} onNext={onNext} disabled={!value} />
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
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>{label}</span>
        {hint && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{hint}</span>}
      </div>
      {/* Double-bezel textarea */}
      <div style={{
        borderRadius: 16, padding: 4,
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${focused ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.07)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', display: 'block', borderRadius: 12,
            padding: '11px 14px', boxSizing: 'border-box',
            background: 'rgba(10,13,20,0.65)',
            border: `1px solid ${focused ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.05)'}`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            color: 'white', fontSize: '14px', lineHeight: 1.65,
            resize: 'vertical', fontFamily: 'Inter, sans-serif', outline: 'none',
            transition: 'background 0.18s, border-color 0.2s',
          }}
        />
      </div>
    </div>
  )
}

function DiscoveryStep({ userData, setField, onNext, onBack }: {
  userData: UserData; setField: (k: keyof UserData, v: string) => void; onNext: () => void; onBack: () => void
}) {
  const reduce = useReducedMotion()
  const canContinue = userData.dailyFrustrations.trim().length >= 10 || userData.passions.trim().length >= 5 || userData.profession.trim().length >= 3
  const rise = (delay: number) => reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } }

  return (
    <div>
      <ProgressBar current={4} />
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <StepBadge n={4} tone="green" />
          <StepHeading
            pre="Trouvons ton"
            accent="problème parfait"
            subtitle="Quelques questions rapides et notre IA fait remonter 5 vrais problèmes à résoudre — adaptés à ta vie."
          />
          <motion.div {...rise(0.18)}>
            <DiscoveryField
              label="Qu'est-ce qui te frustre au quotidien ?" hint="toi ou quelqu'un de proche"
              value={userData.dailyFrustrations} onChange={(v) => setField('dailyFrustrations', v)}
              placeholder="Ce qui te fait perdre du temps, t'énerve ou te semble cassé..."
              rows={3}
            />
          </motion.div>
          <motion.div {...rise(0.26)}>
            <DiscoveryField
              label="Quelles sont tes passions ?" hint="optionnel"
              value={userData.passions} onChange={(v) => setField('passions', v)}
              placeholder="Hobbies, sujets que tu adores, communautés dont tu fais partie..."
              rows={2}
            />
          </motion.div>
          <motion.div {...rise(0.34)}>
            <DiscoveryField
              label="Ton métier ou domaine d'études ?" hint="optionnel"
              value={userData.profession} onChange={(v) => setField('profession', v)}
              placeholder="ex. Étudiant en marketing, designer freelance, infirmier..."
              rows={1}
            />
          </motion.div>
          <motion.div {...rise(0.42)} style={{ marginTop: 22 }}>
            <StepNav onBack={onBack} onNext={onNext} disabled={!canContinue} label="Trouver mes problèmes" isAnalyze />
          </motion.div>
        </div>
        <div style={{ width: 260, flexShrink: 0 }}>
          <DiscoveryIllustration />
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Problem list (AI generated) ──────────────────────────────────────

function ProblemListStep({ userData, onSelect, onNext, onBack }: {
  userData: UserData; onSelect: (title: string) => void; onNext: () => void; onBack: () => void
}) {
  const reduce = useReducedMotion()
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

  const freqColor = (f: string) => f === 'Quotidien' ? '#f87171' : f === 'Hebdomadaire' ? '#fbbf24' : '#39FF88'

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '52px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30, position: 'relative' }}>
          {/* Outer pulse ring */}
          {!reduce && (
            <motion.div
              animate={{ scale: [1, 1.22, 1], opacity: [0.18, 0.06, 0.18] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: 88, height: 88, borderRadius: '50%', background: 'rgba(139,92,246,0.22)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            />
          )}
          {/* Inner glow */}
          <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          {/* Spinner ring */}
          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.12)', borderTop: '2px solid #8B5CF6', flexShrink: 0 }}
          />
        </div>
        <h2 style={{ fontSize: '21px', fontWeight: 700, color: 'white', letterSpacing: '-0.03em', marginBottom: 8 }}>
          Recherche de tes meilleurs problèmes
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -5 }}
            transition={reduce ? {} : { duration: 0.28 }}
            style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 0 }}
          >
            {LOADING_STEPS_PROBLEMS[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar current={5} />
      <StepBadge n={5} tone="green" />
      <StepHeading
        pre="Choisis le problème"
        accent="qui en vaut la peine"
        subtitle="5 vraies opportunités scorées pour ton profil. Choisis celle qui te parle le plus."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
        {problems.map((p, i) => {
          const selected = userData.selectedProblem === p.title
          const fc = freqColor(p.frequency)
          return (
            <motion.button
              key={i}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.065, ease: EASE }}
              whileHover={reduce ? undefined : { scale: 1.012, y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.988 }}
              onClick={() => onSelect(p.title)}
              style={{
                textAlign: 'left', padding: '15px 18px', borderRadius: 16,
                cursor: 'pointer', fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
                background: selected ? 'rgba(139,92,246,0.13)' : 'rgba(17,24,39,0.65)',
                border: `1.5px solid ${selected ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: selected
                  ? '0 0 0 1px rgba(139,92,246,0.28), 0 10px 36px rgba(139,92,246,0.16)'
                  : '0 2px 10px rgba(0,0,0,0.18)',
                transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
              }}
            >
              {/* Top accent line when selected */}
              {selected && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
                  opacity: 0.6,
                }} />
              )}

              {/* Spring checkmark */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduce ? {} : { scale: 0, opacity: 0 }}
                    transition={reduce ? {} : { type: 'spring', stiffness: 360, damping: 22 }}
                    style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Check style={{ width: 12, height: 12, color: 'white' }} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ fontSize: '14.5px', fontWeight: 700, color: selected ? '#fff' : 'rgba(255,255,255,0.9)', marginBottom: 4, paddingRight: 34, letterSpacing: '-0.015em' }}>
                {p.title}
              </div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.58, marginBottom: 10 }}>
                {p.description}
              </div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: `${fc}1a`, color: fc, border: `1px solid ${fc}30` }}>
                  {p.frequency}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.48)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {p.marketSize}
                </span>
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
  const reduce = useReducedMotion()
  const selected = value ? value.split(',').filter(Boolean) : []
  const toggle = (v: string) => {
    if (selected.includes(v)) onChange(selected.filter(x => x !== v).join(','))
    else if (selected.length < 3) onChange([...selected, v].join(','))
  }
  return (
    <div>
      <ProgressBar current={9} />
      <StepBadge n={9} />
      <StepHeading
        pre="Comment vas-tu"
        accent="trouver tes clients ?"
        subtitle="Choisis jusqu'à 3 canaux que tu veux utiliser. On construit ton plan marketing autour."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 14 }}>
        {ACQUISITION_CHANNELS.map((c, i) => {
          const on = selected.includes(c.value)
          const disabled = !on && selected.length >= 3
          return (
            <motion.button
              key={c.value}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.1 + i * 0.04 }}
              whileHover={disabled || reduce ? undefined : { scale: 1.03, y: -2 }}
              whileTap={disabled || reduce ? undefined : { scale: 0.97 }}
              onClick={() => toggle(c.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '13px 16px', borderRadius: 14,
                cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', textAlign: 'left',
                background: on ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${on ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                opacity: disabled ? 0.38 : 1,
                boxShadow: on ? '0 0 0 1px rgba(139,92,246,0.24), 0 6px 22px rgba(139,92,246,0.16)' : 'none',
                transition: 'background 0.18s, border-color 0.18s, opacity 0.18s, box-shadow 0.18s',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {on && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)', opacity: 0.55 }} />
              )}
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: on ? '#fff' : 'rgba(255,255,255,0.8)', flex: 1 }}>{c.value}</span>
              <AnimatePresence>
                {on && (
                  <motion.div
                    initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduce ? {} : { scale: 0, opacity: 0 }}
                    transition={reduce ? {} : { type: 'spring', stiffness: 360, damping: 22 }}
                    style={{ width: 18, height: 18, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Check style={{ width: 10, height: 10, color: 'white' }} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
      <div style={{
        fontSize: '11.5px', marginBottom: 22, textAlign: 'center',
        color: selected.length === 3 ? '#fbbf24' : 'rgba(255,255,255,0.32)',
      }}>
        {selected.length} / 3 sélectionné(s){selected.length === 3 ? ' — maximum atteint' : ''}
      </div>
      <StepNav onBack={onBack} onNext={onNext} disabled={selected.length === 0} />
    </div>
  )
}

// ─── Step 10: B2C or B2B ──────────────────────────────────────────────────────

function MarketTypeStep({ value, onSelect, onNext, onBack }: { value: string; onSelect: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const reduce = useReducedMotion()
  const tones: Record<string, string> = { b2c: '#ec4899', b2b: '#0ea5e9' }
  return (
    <div>
      <ProgressBar current={10} />
      <StepBadge n={10} />
      <StepHeading
        pre="À qui vas-tu"
        accent="vendre ?"
        subtitle="Ça façonne ta tarification, ton ton marketing et comment tu trouveras tes premiers clients."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 28 }}>
        {MARKET_TYPE_OPTIONS.map((o, i) => {
          const sel = value === o.value
          const ac = tones[o.value]
          return (
            <motion.button
              key={o.value}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: reduce ? 0 : 0.16 + i * 0.09, ease: EASE }}
              whileHover={reduce ? undefined : { scale: 1.022, y: -4 }}
              whileTap={reduce ? undefined : { scale: 0.978 }}
              onClick={() => onSelect(o.value)}
              style={{
                textAlign: 'left', padding: '24px 20px', borderRadius: 20,
                cursor: 'pointer', fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
                background: sel ? `${ac}1f` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${sel ? ac : 'rgba(255,255,255,0.09)'}`,
                boxShadow: sel ? `0 0 0 1px ${ac}30, 0 12px 36px ${ac}26` : '0 2px 10px rgba(0,0,0,0.18)',
                transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}
            >
              {/* Top accent line when selected */}
              {sel && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ac}, transparent)`, opacity: 0.7 }} />
              )}
              <AnimatePresence>
                {sel && (
                  <motion.div
                    initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduce ? {} : { scale: 0, opacity: 0 }}
                    transition={reduce ? {} : { type: 'spring', stiffness: 360, damping: 22 }}
                    style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Check style={{ width: 12, height: 12, color: 'white' }} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ fontSize: '30px', marginBottom: 12 }}>{o.icon}</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: sel ? '#fff' : 'rgba(255,255,255,0.9)', marginBottom: 3, letterSpacing: '-0.02em' }}>{o.label}</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.42)', marginBottom: 16 }}>{o.sub}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {o.examples.map((ex) => (
                  <div key={ex} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '11.5px', color: sel ? 'rgba(255,255,255,0.58)' : 'rgba(255,255,255,0.45)' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: ac, flexShrink: 0 }} />
                    {ex}
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
  const reduce = useReducedMotion()
  return (
    <div style={{ textAlign: 'center', padding: '52px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30, position: 'relative' }}>
        {!reduce && (
          <motion.div
            animate={{ scale: [1, 1.22, 1], opacity: [0.18, 0.06, 0.18] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: 88, height: 88, borderRadius: '50%', background: 'rgba(139,92,246,0.22)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          />
        )}
        <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.12)', borderTop: '2px solid #8B5CF6', flexShrink: 0 }}
        />
      </div>
      <h2 style={{ fontSize: '21px', fontWeight: 700, color: 'white', letterSpacing: '-0.03em', marginBottom: 8 }}>
        Génération de tes 10 idées SaaS
      </h2>
      <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.36)', marginBottom: 36 }}>
        Notre IA analyse des milliers d'opportunités pour toi
      </p>
      <div style={{ textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
        {LOADING_STEPS_IDEAS.map((msg, i) => {
          const isDone = i < loadingStep, isActive = i === loadingStep
          return (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.25, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: isDone ? '#39FF88' : isActive ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.07)',
                border: `1.5px solid ${isDone ? '#39FF88' : isActive ? '#8B5CF6' : 'rgba(255,255,255,0.10)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone && <Check style={{ width: 11, height: 11, color: '#090B11' }} strokeWidth={3} />}
                {isActive && !reduce && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }}
                  />
                )}
                {isActive && reduce && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} />}
              </div>
              <span style={{ fontSize: '13px', lineHeight: 1.4, fontWeight: isActive ? 500 : 400, color: isDone ? 'rgba(255,255,255,0.62)' : isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.2)' }}>
                {msg}
              </span>
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
  const reduce = useReducedMotion()
  const list = ideas.length ? ideas : FALLBACK_IDEAS
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <StepBadge n="10 IDÉES → CHOISIS 1" tone="green" />
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: 6 }}>Tes opportunités SaaS</h2>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.4)' }}>Choisis l'idée pour laquelle tu veux un blueprint complet.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 11, marginBottom: 24 }}>
        {list.map((idea, i) => {
          const sel = selectedIndex === String(i)
          const ac = IDEA_ACCENT[i % IDEA_ACCENT.length]
          const comp = competitionLabel(idea.competitionScore)
          return (
            <motion.button
              key={i}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.04, ease: EASE }}
              whileHover={reduce ? undefined : { scale: 1.02, y: -3 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              onClick={() => onSelect(String(i))}
              style={{
                textAlign: 'left', padding: '16px 15px 14px', borderRadius: 16,
                cursor: 'pointer', fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
                background: sel ? `${ac}1c` : 'rgba(17,24,39,0.68)',
                border: `1.5px solid ${sel ? ac : 'rgba(255,255,255,0.08)'}`,
                boxShadow: sel ? `0 0 0 1px ${ac}30, 0 10px 32px ${ac}22` : '0 2px 10px rgba(0,0,0,0.2)',
                transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
              }}
            >
              {/* Colored top bar — always present for quick scan */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ac, opacity: sel ? 0.9 : 0.45 }} />

              <AnimatePresence>
                {sel && (
                  <motion.div
                    initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduce ? {} : { scale: 0, opacity: 0 }}
                    transition={reduce ? {} : { type: 'spring', stiffness: 360, damping: 22 }}
                    style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: '50%', background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Check style={{ width: 11, height: 11, color: 'white' }} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'white', marginBottom: 3, paddingRight: sel ? 28 : 0, marginTop: 5, letterSpacing: '-0.015em' }}>
                {idea.name}
              </div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5, marginBottom: 10, minHeight: 30 }}>
                {idea.tagline}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 99, background: 'rgba(57,255,136,0.12)', border: '1px solid rgba(57,255,136,0.22)', marginBottom: 9 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#39FF88' }}>{idea.mrrPotential}</span>
                <span style={{ fontSize: '9.5px', color: 'rgba(57,255,136,0.55)' }}>MRR</span>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 7px', borderRadius: 6, background: `${comp.color}1a`, color: comp.color }}>{comp.label} conc.</span>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 7px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{idea.techComplexity}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 7px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{idea.timeToMvp}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <StepNav onBack={onBack} onNext={onNext} disabled={!selectedIndex} label="Voir mon blueprint" isAnalyze />
    </div>
  )
}

// ─── Step 15: Payment ─────────────────────────────────────────────────────────

const PLANS = [
  { id: 'week', price: '€7.90', period: '/week', name: 'Weekly', tagline: 'Start this week', accent: '#0ea5e9', badge: '', save: '' },
  { id: 'month', price: '€23', period: '/month', name: 'Monthly', tagline: 'For serious builders', accent: '#8B5CF6', badge: 'MOST POPULAR', save: 'Save 19% vs weekly' },
  { id: 'year', price: '€75', period: '/year', name: 'Annual', tagline: 'Best long-term value', accent: '#39FF88', badge: 'BEST VALUE', save: 'Save 73% vs monthly' },
]

const PLAN_FEATURES = ['Full SaaS analysis', 'Tailored marketing strategy', 'Competitor research', 'All 10 SaaS ideas unlocked', '30-day launch roadmap', 'Workspace dashboard access']

function PaymentStep({ ideaName, onPaid, onBack }: { ideaName: string; onPaid: () => void; onBack: () => void }) {
  const [processing, setProcessing] = useState<string | null>(null)
  const reduce = useReducedMotion()
  const rise = (delay: number) => reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } }
  const pick = (id: string) => { setProcessing(id); setTimeout(onPaid, 700) }
  return (
    <div>
      <motion.div {...rise(0)} style={{ textAlign: 'center', marginBottom: 28 }}>
        <StepBadge n="UNLOCK" tone="purple" />
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: 6 }}>
          Unlock your <span style={{ background: 'linear-gradient(135deg,#c4b5fd,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{ideaName || 'SaaS'}</span> blueprint
        </h2>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.4)' }}>Cancel anytime. Instant access to your full plan.</p>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        {PLANS.map((p, i) => {
          const popular = p.id === 'month'
          return (
            <motion.div key={p.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? {} : { duration: 0.4, delay: i * 0.08 }}
              whileHover={reduce ? undefined : { y: -5 }}
              style={{
                position: 'relative', zIndex: popular ? 2 : 1,
                borderRadius: popular ? 22 : 18,
                padding: popular ? 4 : '20px 16px 18px',
                background: popular ? 'rgba(139,92,246,0.08)' : 'rgba(17,24,39,0.7)',
                border: `1.5px solid ${popular ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.09)'}`,
                boxShadow: popular ? '0 0 0 4px rgba(139,92,246,0.07), 0 12px 40px rgba(139,92,246,0.22)' : '0 4px 18px rgba(0,0,0,0.25)',
                transform: popular ? 'scale(1.04)' : 'scale(1)',
              }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '3px 12px', borderRadius: 99, fontSize: '9.5px', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  background: p.accent, color: p.id === 'year' ? '#072' : '#fff', boxShadow: `0 4px 14px ${p.accent}66` }}>{p.badge}</div>
              )}
              {popular ? (
                <div style={{ borderRadius: 18, padding: '20px 16px 18px', position: 'relative', overflow: 'hidden',
                  background: 'rgba(10,13,20,0.65)', border: '1px solid rgba(139,92,246,0.18)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)' }} />
                  <div style={{ fontSize: '12px', fontWeight: 700, color: p.accent, letterSpacing: '0.04em', marginBottom: 8, marginTop: p.badge ? 6 : 0 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{p.price}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{p.period}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: p.save ? '#39FF88' : 'rgba(255,255,255,0.4)', marginBottom: 14, minHeight: 14 }}>{p.save || p.tagline}</div>
                  <motion.button whileTap={reduce ? undefined : { scale: 0.96 }} onClick={() => pick(p.id)} disabled={!!processing}
                    style={{ width: '100%', padding: '11px', borderRadius: 12, fontSize: '13px', fontWeight: 700, cursor: processing ? 'wait' : 'pointer', border: 'none', fontFamily: 'inherit',
                      background: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', color: '#fff', boxShadow: '0 6px 22px rgba(139,92,246,0.4)',
                      opacity: processing && processing !== p.id ? 0.5 : 1 }}>
                    {processing === p.id ? 'Processing…' : 'Choose'}
                  </motion.button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: p.accent, letterSpacing: '0.04em', marginBottom: 8, marginTop: p.badge ? 6 : 0 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{p.price}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{p.period}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: p.save ? '#39FF88' : 'rgba(255,255,255,0.4)', marginBottom: 14, minHeight: 14 }}>{p.save || p.tagline}</div>
                  <motion.button whileTap={reduce ? undefined : { scale: 0.96 }} onClick={() => pick(p.id)} disabled={!!processing}
                    style={{ width: '100%', padding: '11px', borderRadius: 12, fontSize: '13px', fontWeight: 700, cursor: processing ? 'wait' : 'pointer', border: 'none', fontFamily: 'inherit',
                      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)',
                      opacity: processing && processing !== p.id ? 0.5 : 1 }}>
                    {processing === p.id ? 'Processing…' : 'Choose'}
                  </motion.button>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
      <motion.div {...rise(0.3)} style={{ borderRadius: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px' }}>
          {PLAN_FEATURES.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(57,255,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check style={{ width: 9, height: 9, color: '#39FF88' }} strokeWidth={3} />
              </div>{f}
            </div>
          ))}
        </div>
      </motion.div>
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
  { day: 'Jours 1–5', title: 'Valider le problème', desc: 'Interviewe 10 clients potentiels, confirme que la douleur est réelle.' },
  { day: 'Jours 6–12', title: 'Construire ton MVP', desc: 'Lance la version minimale qui résout le problème central.' },
  { day: 'Jours 13–18', title: 'Landing page + liste d\'attente', desc: 'Mets en ligne une page, collecte des emails, installe l\'analytics.' },
  { day: 'Jours 19–25', title: 'Tes 10 premiers utilisateurs', desc: 'Onboarde manuellement, collecte les retours, itère vite.' },
  { day: 'Jours 26–30', title: 'Ouvrir les plans payants', desc: 'Active la tarification, lance tes canaux d\'acquisition.' },
]

function FullResultsStep({ ideas, userData, onDashboard }: { ideas: SaaSIdea[]; userData: UserData; onDashboard: () => void }) {
  const reduce = useReducedMotion()
  const rise = (delay: number) => reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } }
  const list = ideas.length ? ideas : FALLBACK_IDEAS
  const idea = list[Number(userData.selectedIdeaIndex) || 0] || list[0]
  const accent = IDEA_ACCENT[(Number(userData.selectedIdeaIndex) || 0) % IDEA_ACCENT.length]
  const channels = userData.acquisitionChannels ? userData.acquisitionChannels.split(',').filter(Boolean) : ['SEO / Contenu']
  const competitors = idea.competitors && idea.competitors.length ? idea.competitors : ['Acteur établi A', 'Concurrent B', 'Startup C']
  const bars = [22, 38, 55, 71, 88, 100]

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <motion.div initial={reduce ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={reduce ? {} : { duration: 0.4 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 99, marginBottom: 14, background: 'rgba(57,255,136,0.1)', border: '1px solid rgba(57,255,136,0.28)' }}>
          <Sparkles style={{ width: 12, height: 12, color: '#39FF88' }} />
          <span style={{ fontSize: '11px', color: '#39FF88', fontWeight: 600, letterSpacing: '0.06em' }}>BLUEPRINT PRÊT</span>
        </motion.div>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>Ton blueprint SaaS est prêt</h2>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
        {/* LEFT */}
        <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? {} : { duration: 0.4 }}
            style={{ borderRadius: 18, padding: '22px', background: `${accent}14`, border: `1px solid ${accent}47`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: 4 }}>{idea.name}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>{idea.tagline}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(57,255,136,0.12)', border: '1px solid rgba(57,255,136,0.25)', marginBottom: 14 }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#39FF88' }}>{idea.mrrPotential}</span>
              <span style={{ fontSize: '11px', color: 'rgba(57,255,136,0.6)' }}>Potentiel MRR</span>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12.5px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>💡 {idea.why}</div>
          </motion.div>

          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Megaphone style={{ width: 16, height: 16, color: '#8B5CF6' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Stratégie marketing</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 14 }}>
              {idea.marketingStrategy || `Cible les ${userData.marketType === 'b2b' ? 'entreprises' : 'particuliers'} via tes canaux choisis avec un budget de ${userData.adsBudget || 'portée organique'}.`}
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
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Plan de lancement 30 jours</span>
            </div>
            <div style={{ position: 'relative', paddingLeft: 22 }}>
              <div style={{ position: 'absolute', left: 6, top: 4, bottom: 4, width: 2, background: 'linear-gradient(180deg, #8B5CF6, rgba(57,255,136,0.6))' }} />
              {LAUNCH_PLAN.map((m, i) => (
                <motion.div key={i} initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={reduce ? {} : { duration: 0.3, delay: 0.1 + i * 0.08 }}
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
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Concurrents principaux</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {competitors.slice(0, 3).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${IDEA_ACCENT[i]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: IDEA_ACCENT[i] }}>{c.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{c}</div>
                    <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.35)' }}>Concurrent établi</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp style={{ width: 16, height: 16, color: '#39FF88' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Projection revenus</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
              {bars.map((h, i) => (
                <motion.div key={i} initial={reduce ? false : { height: 0 }} animate={{ height: `${h}%` }} transition={reduce ? {} : { duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
                  style={{ flex: 1, borderRadius: '4px 4px 0 0', background: i >= 4 ? 'linear-gradient(180deg,#39FF88,rgba(57,255,136,0.4))' : 'linear-gradient(180deg,#8B5CF6,rgba(139,92,246,0.4))' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'rgba(255,255,255,0.3)' }}>
              <span>M1</span><span>M3</span><span>M6</span>
            </div>
          </div>

          <div style={{ borderRadius: 18, padding: '20px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: 12 }}>Ressources</div>
            {['Guide de lancement Product Hunt', 'Modèles de cold email', 'Checklist tech stack MVP'].map((r) => (
              <a key={r} href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: '12.5px', color: '#a78bfa', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <ArrowRight style={{ width: 12, height: 12 }} />{r}
              </a>
            ))}
          </div>
        </div>
      </div>
      <motion.button whileHover={reduce ? undefined : { scale: 1.01 }} whileTap={reduce ? undefined : { scale: 0.99 }} onClick={onDashboard}
        style={{ width: '100%', padding: '15px', borderRadius: 14, background: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', boxShadow: '0 8px 32px rgba(139,92,246,0.42)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
        Accéder à mon espace <ArrowRight style={{ width: 17, height: 17 }} strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}

// ─── Step 16: Dashboard ───────────────────────────────────────────────────────

type DashTab = 'overview' | 'tiktok' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'metaads'

interface PlatformStat { label: string; value: string; sub: string }
interface ContentFormat { name: string; tip: string }
interface PostSlot { day: string; times: string }
interface PlatformCfg {
  id: string; label: string; icon: string; accent: string; bg: string
  stats: PlatformStat[]; strategy: string[]; schedule: PostSlot[]; formats: ContentFormat[]; unlocks: string[]
}

const PLATFORM_CFGS: PlatformCfg[] = [
  {
    id: 'tiktok', label: 'TikTok', icon: '🎵', accent: '#25F4EE', bg: 'rgba(37,244,238,0.06)',
    stats: [
      { label: 'Hook rate cible', value: '8–12 %', sub: 'vs 3 % moyen' },
      { label: 'Vues / vidéo', value: '1 200+', sub: 'organique' },
      { label: 'Créneau optimal', value: '19h–21h', sub: 'lun/mer/ven' },
      { label: 'Fréquence', value: '1 / jour', sub: 'recommandé' },
    ],
    strategy: [
      'Hook dans les 2 premières secondes',
      'Texte incrusté sur toute la durée',
      'Call-to-action à mi-vidéo et en fin',
      'Audio trending : +40 % de portée',
      '8 hashtags de niche (évite les massifs)',
    ],
    schedule: [
      { day: 'Lundi', times: '19h · 21h' },
      { day: 'Mercredi', times: '18h · 20h' },
      { day: 'Vendredi', times: '19h · 22h' },
      { day: 'Samedi', times: '14h · 20h' },
    ],
    formats: [
      { name: 'Vidéo 15 s', tip: 'Hook fort, tempo rapide' },
      { name: 'Tutoriel 60 s', tip: 'Valeur + CTA abonnement' },
      { name: 'Story-time', tip: 'Narration avec twist final' },
    ],
    unlocks: ['Analyse de ton compte TikTok', 'Score de hook rate personnalisé', 'Calendrier éditorial auto-généré', 'Hashtags de niche sur mesure', "Suggestions d'audio trending"],
  },
  {
    id: 'instagram', label: 'Instagram', icon: '📸', accent: '#E1306C', bg: 'rgba(225,48,108,0.06)',
    stats: [
      { label: 'Engagement Reels', value: '5–7 %', sub: 'vs 1 % posts statiques' },
      { label: 'Portée stories', value: '×3', sub: 'vs posts classiques' },
      { label: 'Créneau optimal', value: '18h–20h', sub: 'mar/jeu/sam' },
      { label: 'Stories / jour', value: '3–5', sub: 'recommandé' },
    ],
    strategy: [
      'Reels 15–30 s pour la portée maximale',
      'Stories quotidiennes pour la visibilité',
      'Carrousels pour sauvegardes & partages',
      'Réponse aux commentaires sous 1 h',
      'Bio + lien en bio optimisés',
    ],
    schedule: [
      { day: 'Mardi', times: '12h · 18h' },
      { day: 'Jeudi', times: '12h · 20h' },
      { day: 'Samedi', times: '10h · 18h' },
      { day: 'Dimanche', times: '10h · 19h' },
    ],
    formats: [
      { name: 'Reels 15–30 s', tip: 'Portée organique maximale' },
      { name: 'Carrousel 5–8 slides', tip: 'Sauvegardes & partages' },
      { name: 'Story interactive', tip: 'Sondage, quiz, question' },
    ],
    unlocks: ['Stats de ton compte Instagram', "Taux d'engagement Reels", 'Planning stories auto-généré', 'Audit de ta bio', 'Hashtags de niche ciblés'],
  },
  {
    id: 'twitter', label: 'X / Twitter', icon: '🐦', accent: '#1DA1F2', bg: 'rgba(29,161,242,0.06)',
    stats: [
      { label: 'Impressions cible', value: '15K+', sub: 'par mois' },
      { label: 'CTR sur liens', value: '2–3 %', sub: 'dans les threads' },
      { label: 'Créneau optimal', value: '8h · 18h', sub: 'lun/mer/ven' },
      { label: 'Posts / jour', value: '2–3', sub: 'recommandé' },
    ],
    strategy: [
      'Thread 5–7 tweets pour la viralité',
      '1 post utile par jour minimum',
      'Réponds aux gros comptes de ta niche',
      'Build in public (#buildinpublic)',
      'Engage 15 min avant de publier',
    ],
    schedule: [
      { day: 'Lundi', times: '8h · 12h · 18h' },
      { day: 'Mercredi', times: '8h · 18h' },
      { day: 'Vendredi', times: '8h · 12h · 18h' },
    ],
    formats: [
      { name: 'Thread 5–7 tweets', tip: 'Insight + hook fort en tweet 1' },
      { name: 'Tweet opinion', tip: '< 280 car., prise de position' },
      { name: 'Chiffre clé', tip: 'Données = partages ×2' },
    ],
    unlocks: ['Stats de ton compte X', "Taux d'impression moyen", 'Templates de threads', 'Suivi des mentions', 'Analyse des followers'],
  },
  {
    id: 'linkedin', label: 'LinkedIn', icon: '💼', accent: '#0077B5', bg: 'rgba(0,119,181,0.06)',
    stats: [
      { label: 'Portée / post', value: '10–20K', sub: 'carrousel PDF' },
      { label: 'Engagement B2B', value: '3–5 %', sub: 'cible' },
      { label: 'Créneau optimal', value: '9h–11h', sub: 'mar–jeu' },
      { label: 'Posts / semaine', value: '3–4', sub: 'recommandé' },
    ],
    strategy: [
      'Carrousels PDF : +3× impressions',
      '1 post témoignage client / semaine',
      'Commente 5 posts avant de publier',
      'Objectif 500 connexions en 90 jours',
      'Profil optimisé : bannière + résumé',
    ],
    schedule: [
      { day: 'Mardi', times: '9h · 12h' },
      { day: 'Mercredi', times: '9h' },
      { day: 'Jeudi', times: '9h · 12h' },
    ],
    formats: [
      { name: 'Carrousel PDF', tip: 'Format n°1 LinkedIn 2024' },
      { name: 'Post texte long', tip: 'Storytelling fondateur' },
      { name: 'Sondage', tip: 'Engagement rapide + signal algo' },
    ],
    unlocks: ['Vue des stats profil', 'Portée de tes posts', 'Templates carrousels', 'Suivi des connexions', "Analyse de l'audience"],
  },
  {
    id: 'youtube', label: 'YouTube', icon: '▶️', accent: '#FF0000', bg: 'rgba(255,0,0,0.05)',
    stats: [
      { label: 'Watch time cible', value: '6+ min', sub: 'durée moyenne' },
      { label: 'CTR vignette', value: '7–10 %', sub: 'objectif' },
      { label: 'Fréquence', value: '1–2 / sem', sub: 'recommandé' },
      { label: 'Durée optimale', value: '10–15 min', sub: 'long-form' },
    ],
    strategy: [
      'Vignette + titre : 80 % du succès',
      'Hook dans les 30 premières secondes',
      'Chapitres (timestamps) pour le SEO',
      'CTA abonnement à 30 % et 70 % de la vidéo',
      'Republier en Shorts pour plus de portée',
    ],
    schedule: [
      { day: 'Mardi', times: '15h' },
      { day: 'Vendredi', times: '15h · 17h' },
    ],
    formats: [
      { name: 'Tutoriel 10–15 min', tip: 'Meilleur pour le watch time' },
      { name: 'Short < 60 s', tip: 'Portée rapide + abonnés' },
      { name: 'Vlog fondateur', tip: 'Authenticité = fidélisation' },
    ],
    unlocks: ['Stats de ta chaîne', 'Analyse du watch time', 'Idées de vidéos générées par IA', 'Optimisation SEO vidéo', 'Planning éditorial mensuel'],
  },
]

const WEEK_TASKS = [
  "Définir ton profil client idéal (ICP)",
  "Créer ta landing page & liste d'attente",
  'Rejoindre 3 communautés pertinentes',
  'Écrire 5 contenus pour tes canaux',
  'Contacter 10 utilisateurs potentiels',
  "Mettre en place l'analytics & tracking",
  'Rédiger ta première campagne pub',
]

function DashboardStep({ ideas, userData, onRestart }: { ideas: SaaSIdea[]; userData: UserData; onRestart: () => void }) {
  const reduce = useReducedMotion()
  const list = ideas.length ? ideas : FALLBACK_IDEAS
  const idea = list[Number(userData.selectedIdeaIndex) || 0] || list[0]
  const [tab, setTab] = useState<DashTab>('overview')
  const [connected, setConnected] = useState<Record<string, boolean>>({})
  const [tasks, setTasks] = useState<boolean[]>(new Array(WEEK_TASKS.length).fill(false))
  const doneCount = tasks.filter(Boolean).length

  const DASH_TABS: { id: DashTab; label: string; icon: string; accent: string }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '🏠', accent: '#8B5CF6' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', accent: '#25F4EE' },
    { id: 'instagram', label: 'Instagram', icon: '📸', accent: '#E1306C' },
    { id: 'twitter', label: 'X / Twitter', icon: '🐦', accent: '#1DA1F2' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', accent: '#0077B5' },
    { id: 'youtube', label: 'YouTube', icon: '▶️', accent: '#FF0000' },
    { id: 'metaads', label: 'Meta Ads', icon: '📣', accent: '#1877F2' },
  ]

  const dashPlans = [
    { id: 'week', name: 'Hebdo', price: '7,90€', period: '/ sem', save: '', accent: '#0ea5e9', ctaBg: 'rgba(14,165,233,0.15)', ctaBorder: 'rgba(14,165,233,0.3)', ctaColor: '#7dd3fc', border: 'rgba(14,165,233,0.25)', bg: 'rgba(14,165,233,0.05)', featured: false },
    { id: 'month', name: 'Mensuel', price: '23€', period: '/ mois', save: 'Économise 19 %', accent: '#8B5CF6', ctaBg: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', ctaBorder: 'transparent', ctaColor: 'white', border: 'rgba(139,92,246,0.5)', bg: 'rgba(139,92,246,0.1)', featured: true },
    { id: 'year', name: 'Annuel', price: '75€', period: '/ an', save: 'Économise 73 %', accent: '#39FF88', ctaBg: 'rgba(57,255,136,0.12)', ctaBorder: 'rgba(57,255,136,0.3)', ctaColor: '#39FF88', border: 'rgba(57,255,136,0.25)', bg: 'rgba(57,255,136,0.04)', featured: false },
  ]

  const activeCfg = PLATFORM_CFGS.find(p => p.id === tab)

  // ── Tab bar ──────────────────────────────────────────────────────────────────
  const TabBar = (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
      {DASH_TABS.map(t => {
        const active = tab === t.id
        const isConnected = t.id !== 'overview' && t.id !== 'metaads' && connected[t.id]
        return (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: active ? 700 : 500, transition: 'all 0.15s', flexShrink: 0,
              background: active ? `${t.accent}22` : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${active ? t.accent + '66' : 'rgba(255,255,255,0.08)'}`,
              color: active ? t.accent : 'rgba(255,255,255,0.5)' }}>
            <span style={{ fontSize: '14px' }}>{t.icon}</span>
            {t.label}
            {isConnected && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#39FF88', flexShrink: 0, boxShadow: '0 0 6px #39FF88' }} />}
          </button>
        )
      })}
    </div>
  )

  // ── Overview tab ──────────────────────────────────────────────────────────────
  const OverviewContent = (
    <motion.div key="overview" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={reduce ? {} : { duration: 0.25 }}>
      {/* Project banner */}
      <div style={{ borderRadius: 18, padding: '22px 24px', marginBottom: 16, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(109,40,217,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div style={{ position: 'absolute', top: -40, right: -20, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.3),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.07em', marginBottom: 6 }}>TON ESPACE DE TRAVAIL</div>
        <div style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>{idea.name}</div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{idea.tagline}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          {[{ label: 'MRR cible', value: idea.mrrPotential, color: '#39FF88' }, { label: 'MVP estimé', value: idea.timeToMvp, color: '#8B5CF6' }, { label: 'Marché', value: userData.marketType === 'b2b' ? 'B2B' : 'B2C', color: '#0ea5e9' }, { label: 'Budget pub', value: userData.adsBudget || '—', color: '#fbbf24' }].map(s => (
            <div key={s.label} style={{ borderRadius: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social accounts summary */}
      <div style={{ borderRadius: 18, padding: '18px 20px', marginBottom: 16, background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: 4 }}>Réseaux sociaux</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Connecte tes comptes pour débloquer ta stratégie sur mesure dans chaque onglet.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
          {PLATFORM_CFGS.map(p => {
            const on = connected[p.id]
            return (
              <button key={p.id} onClick={() => setTab(p.id as DashTab)}
                style={{ borderRadius: 12, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', position: 'relative',
                  background: on ? `${p.accent}18` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${on ? p.accent + '55' : 'rgba(255,255,255,0.07)'}` }}>
                {on && <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#39FF88', boxShadow: '0 0 5px #39FF88' }} />}
                <span style={{ fontSize: '20px' }}>{p.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: on ? p.accent : 'rgba(255,255,255,0.45)' }}>{p.label}</span>
                <span style={{ fontSize: '9.5px', color: on ? '#39FF88' : 'rgba(255,255,255,0.3)' }}>{on ? 'Connecté' : 'Voir →'}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Payment plans */}
      <div style={{ borderRadius: 18, padding: '20px', marginBottom: 16, background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(139,92,246,0.22)' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: 3 }}>Débloque ton blueprint complet ✦</div>
          <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)' }}>Accès instantané · Annulation libre · Sans frais cachés</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {dashPlans.map(p => (
            <div key={p.id} style={{ borderRadius: 14, padding: '16px 12px', background: p.bg, border: `1.5px solid ${p.border}`, position: 'relative', transform: p.featured ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.15s' }}>
              {p.featured && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', color: 'white', fontSize: '9.5px', fontWeight: 700, padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' }}>✦ Populaire</div>}
              <div style={{ fontSize: '10px', fontWeight: 700, color: p.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5, marginTop: p.featured ? 5 : 0 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: p.save ? 2 : 10 }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{p.period}</span>
              </div>
              {p.save && <div style={{ fontSize: '9.5px', color: '#39FF88', fontWeight: 600, marginBottom: 9 }}>{p.save}</div>}
              <button style={{ width: '100%', padding: '9px', borderRadius: 10, fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${p.ctaBorder}`, background: p.ctaBg, color: p.ctaColor, fontFamily: 'inherit', boxShadow: p.featured ? '0 6px 18px rgba(139,92,246,0.35)' : 'none' }}>
                Choisir →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Week tasks */}
      <div style={{ borderRadius: 18, padding: '18px 20px', marginBottom: 16, background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Plan d&apos;action — semaine 1</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: doneCount === WEEK_TASKS.length ? '#39FF88' : 'rgba(255,255,255,0.4)' }}>{doneCount} / {WEEK_TASKS.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {WEEK_TASKS.map((t, i) => {
            const done = tasks[i]
            return (
              <button key={i} onClick={() => setTasks(p => p.map((v, j) => j === i ? !v : v))}
                style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  background: done ? 'rgba(57,255,136,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? 'rgba(57,255,136,0.22)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.15s' }}>
                <div style={{ width: 19, height: 19, borderRadius: 5, flexShrink: 0, background: done ? '#39FF88' : 'transparent', border: `1.5px solid ${done ? '#39FF88' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done && <Check style={{ width: 11, height: 11, color: '#090B11' }} strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '12.5px', color: done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)', textDecoration: done ? 'line-through' : 'none' }}>{t}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Share / download */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button style={{ flex: 1, padding: '12px', borderRadius: 13, fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', color: '#fff', boxShadow: '0 6px 22px rgba(139,92,246,0.35)' }}>Partager mon blueprint</button>
        <button style={{ flex: 1, padding: '12px', borderRadius: 13, fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>Télécharger (PDF)</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={onRestart} style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>Démarrer un nouveau projet</button>
      </div>
    </motion.div>
  )

  // ── Platform tab (TikTok / Instagram / Twitter / LinkedIn / YouTube) ──────────
  const PlatformContent = activeCfg ? (
    <motion.div key={activeCfg.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={reduce ? {} : { duration: 0.25 }}>
      {connected[activeCfg.id] ? (
        /* ── CONNECTED ──────────────────────────────────────────────────────── */
        <div>
          {/* Platform header */}
          <div style={{ borderRadius: 18, padding: '18px 20px', marginBottom: 14, background: activeCfg.bg, border: `1.5px solid ${activeCfg.accent}44` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${activeCfg.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{activeCfg.icon}</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'white' }}>{activeCfg.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#39FF88', display: 'inline-block', boxShadow: '0 0 6px #39FF88' }} />
                  <span style={{ fontSize: '11.5px', color: '#39FF88', fontWeight: 600 }}>Compte connecté</span>
                </div>
              </div>
              <button onClick={() => setConnected(p => ({ ...p, [activeCfg.id]: false }))}
                style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: 8, fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Déconnecter
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
            {activeCfg.stats.map(s => (
              <div key={s.label} style={{ borderRadius: 14, padding: '14px 12px', background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, color: activeCfg.accent, lineHeight: 1.1, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Strategy + Formats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ borderRadius: 16, padding: '16px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: 10 }}>Stratégie de contenu</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {activeCfg.strategy.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: activeCfg.accent, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 16, padding: '16px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: 10 }}>Formats prioritaires</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeCfg.formats.map(f => (
                  <div key={f.name} style={{ padding: '10px 12px', borderRadius: 10, background: `${activeCfg.accent}11`, border: `1px solid ${activeCfg.accent}33` }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: activeCfg.accent, marginBottom: 2 }}>{f.name}</div>
                    <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)' }}>{f.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Posting schedule */}
          <div style={{ borderRadius: 16, padding: '16px 18px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: 12 }}>Calendrier de publication</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activeCfg.schedule.length},1fr)`, gap: 8 }}>
              {activeCfg.schedule.map(slot => (
                <div key={slot.day} style={{ borderRadius: 12, padding: '12px 10px', textAlign: 'center', background: `${activeCfg.accent}0F`, border: `1px solid ${activeCfg.accent}33` }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: activeCfg.accent, marginBottom: 5 }}>{slot.day}</div>
                  {slot.times.split(' · ').map(t => (
                    <div key={t} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '3px 6px', marginBottom: 4 }}>{t}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── NOT CONNECTED ──────────────────────────────────────────────────── */
        <div>
          {/* Platform header locked */}
          <div style={{ borderRadius: 18, padding: '18px 20px', marginBottom: 14, background: 'rgba(17,24,39,0.7)', border: `1.5px solid ${activeCfg.accent}22` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${activeCfg.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{activeCfg.icon}</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'white' }}>{activeCfg.label}</div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Non connecté</div>
              </div>
            </div>
          </div>

          {/* Blurred stats preview */}
          <div style={{ borderRadius: 16, padding: '16px', marginBottom: 14, background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {activeCfg.stats.map(s => (
                  <div key={s.label} style={{ borderRadius: 14, padding: '14px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: activeCfg.accent, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: '32px' }}>🔒</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Statistiques personnalisées</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Connecte ton compte pour voir tes vraies données</div>
            </div>
          </div>

          {/* Unlocks list */}
          <div style={{ borderRadius: 16, padding: '16px 18px', marginBottom: 18, background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: 10 }}>Ce que tu débloqueras</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {activeCfg.unlocks.map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: `${activeCfg.accent}0C`, border: `1px solid ${activeCfg.accent}22` }}>
                  <span style={{ fontSize: '13px' }}>✦</span>
                  <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)' }}>{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connect CTA */}
          <motion.button whileTap={reduce ? undefined : { scale: 0.97 }}
            onClick={() => setConnected(p => ({ ...p, [activeCfg.id]: true }))}
            style={{ width: '100%', padding: '16px', borderRadius: 16, fontSize: '15px', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'inherit', color: 'white',
              background: `linear-gradient(135deg, ${activeCfg.accent}CC, ${activeCfg.accent}88)`,
              boxShadow: `0 8px 28px ${activeCfg.accent}44` }}>
            Connecter {activeCfg.label} →
          </motion.button>
        </div>
      )}
    </motion.div>
  ) : null

  // ── Meta Ads tab ─────────────────────────────────────────────────────────────
  const isB2B = userData.marketType === 'b2b'
  const MetaAdsContent = (
    <motion.div key="metaads" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={reduce ? {} : { duration: 0.25 }}>
      {/* Header */}
      <div style={{ borderRadius: 18, padding: '18px 20px', marginBottom: 14, background: 'rgba(24,119,242,0.1)', border: '1.5px solid rgba(24,119,242,0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(24,119,242,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📣</div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'white' }}>Meta Ads</div>
            <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Facebook & Instagram Ads</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Budget pub mensuel</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1877F2' }}>{userData.adsBudget || '—'}</div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'CPM estimé', value: '3,80 €', sub: 'coût pour 1 000 vues', color: '#1877F2' },
          { label: 'CPC moyen', value: '0,72 €', sub: 'coût par clic', color: '#8B5CF6' },
          { label: 'ROAS cible', value: '3,2×', sub: 'retour sur dépense pub', color: '#39FF88' },
          { label: 'CTR moyen', value: '2,4 %', sub: 'taux de clic', color: '#fbbf24' },
        ].map(k => (
          <div key={k.label} style={{ borderRadius: 14, padding: '14px 12px', background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '19px', fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>{k.label}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Format recommendation */}
      <div style={{ borderRadius: 16, padding: '16px 18px', marginBottom: 14, background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: 10 }}>Formats recommandés — {isB2B ? 'B2B' : 'B2C'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(isB2B ? [
            { name: 'Lead Gen Form', tip: 'Capture directement dans Facebook', roi: 'Haute qualité lead' },
            { name: 'Vidéo témoignage', tip: 'Client qui parle du résultat', roi: '+60 % de conversions' },
            { name: 'Carrousel cas client', tip: 'Avant/Après ou chiffres clés', roi: 'CTR ×1.8' },
            { name: 'Retargeting LinkedIn', tip: 'Audience visiteurs site web', roi: 'ROAS 4×' },
          ] : [
            { name: 'Vidéo UGC 15 s', tip: 'Utilisateur qui montre le produit', roi: '+42 % conversions' },
            { name: 'Stories interactives', tip: 'Sondage → CTA achat', roi: 'Coût/conv. -30 %' },
            { name: 'Réels sponsorisés', tip: 'Format natif, plus engageant', roi: 'CPM -25 %' },
            { name: 'DPA catalogue', tip: 'Pub dynamique sur tes produits', roi: 'ROAS 5×' },
          ]).map(f => (
            <div key={f.name} style={{ padding: '11px 13px', borderRadius: 11, background: 'rgba(24,119,242,0.08)', border: '1px solid rgba(24,119,242,0.25)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa', marginBottom: 3 }}>{f.name}</div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{f.tip}</div>
              <div style={{ fontSize: '10px', color: '#39FF88', fontWeight: 600 }}>{f.roi}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget allocation */}
      <div style={{ borderRadius: 16, padding: '16px 18px', marginBottom: 14, background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: 14 }}>Répartition du budget conseillée</div>
        {[
          { label: 'Notoriété (Awareness)', pct: 30, color: '#8B5CF6' },
          { label: 'Conversion', pct: 50, color: '#1877F2' },
          { label: 'Retargeting', pct: 20, color: '#39FF88' },
        ].map(b => (
          <div key={b.label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{b.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: b.color }}>{b.pct} %</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{ width: `${b.pct}%`, height: '100%', borderRadius: 99, background: b.color, boxShadow: `0 0 8px ${b.color}88` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Mock campaigns */}
      <div style={{ borderRadius: 16, padding: '16px 18px', background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: 12 }}>Campagnes à lancer</div>
        {[
          { name: '🎯 Campagne Notoriété', status: 'Prête à configurer', spend: '—', roas: '—', color: '#8B5CF6' },
          { name: '💰 Campagne Conversion', status: 'Prête à configurer', spend: '—', roas: '—', color: '#1877F2' },
          { name: '🔁 Campagne Retargeting', status: 'Nécessite le Pixel', spend: '—', roas: '—', color: '#39FF88' },
        ].map(c => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 11, marginBottom: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)' }}>{c.status}</div>
            </div>
            <button style={{ padding: '6px 13px', borderRadius: 8, fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1px solid ${c.color}55`, background: `${c.color}18`, color: c.color }}>
              Lancer →
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div>
      {/* Top project name */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.07em', marginBottom: 4 }}>TON DASHBOARD</div>
        <div style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{idea.name}</div>
      </div>

      {/* Tab bar */}
      {TabBar}

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'overview' && OverviewContent}
        {activeCfg && tab !== 'overview' && tab !== 'metaads' && PlatformContent}
        {tab === 'metaads' && MetaAdsContent}
      </AnimatePresence>
    </div>
  )
}

// ─── Auth Gate Modal ─────────────────────────────────────────────────────────

function AuthGateModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const supabase = createClient()
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=/builder` },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: `${location.origin}/auth/callback?next=/builder` },
      })
      if (error) { setError(error.message); setLoading(false); return }
      setDone(true)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      setLoading(false)
      onDone()
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}
        style={{ width: '100%', maxWidth: 420, borderRadius: 20, padding: 32, background: 'rgba(17,24,39,0.98)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
          <X style={{ width: 18, height: 18 }} />
        </button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: 8 }}>Vérifie ta boîte mail</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Clique sur le lien envoyé à <strong style={{ color: 'white' }}>{email}</strong> pour activer ton compte et accéder à ton espace.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 4, fontSize: '11px', fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sauvegarde tes résultats</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: 4, letterSpacing: '-0.02em' }}>
              {mode === 'signup' ? 'Crée ton compte gratuit' : 'Connecte-toi'}
            </h2>
            <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
              {mode === 'signup' ? 'Pour sauvegarder ton blueprint et accéder à ton espace.' : 'Retrouve ton espace de travail.'}
            </p>

            <button onClick={handleGoogle} style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>ou</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mode === 'signup' && (
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ton prénom" style={inputStyle} />
              )}
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="toi@exemple.com" style={inputStyle} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Mot de passe (8 car. min.)" style={inputStyle} />
              {error && <div style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '12.5px' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', color: 'white', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 18px rgba(139,92,246,0.35)' }}>
                {loading ? '…' : mode === 'signup' ? 'Créer mon compte →' : 'Se connecter →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 14, fontSize: '12.5px', color: 'rgba(255,255,255,0.35)' }}>
              {mode === 'signup' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
              <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12.5px', fontFamily: 'inherit' }}>
                {mode === 'signup' ? 'Se connecter' : 'Créer un compte'}
              </button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}

// ─── Main BuilderClient ───────────────────────────────────────────────────────

const WIDTHS: Record<number, number> = {
  0: 520, 1: 900, 2: 900, 3: 900, 4: 900, 5: 620, 6: 560, 7: 560, 8: 560,
  9: 560, 10: 620, 11: 560, 12: 560, 13: 520, 14: 760, 15: 1000, 16: 1120,
}

export function BuilderClient() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [userData, setUserData] = useState<UserData>(EMPTY_DATA)
  const [loadingStep, setLoadingStep] = useState(0)
  const [ideas, setIdeas] = useState<SaaSIdea[]>([])
  const [apiDone, setApiDone] = useState(false)
  const [showAuthGate, setShowAuthGate] = useState(false)
  const supabase = createClient()

  const goTo = useCallback((next: number, forceDir?: number) => {
    setDir(forceDir !== undefined ? forceDir : next > step ? 1 : -1)
    setStep(next)
  }, [step])

  const set = (key: keyof UserData, val: string) => setUserData(prev => ({ ...prev, [key]: val }))

  async function saveWizardSession() {
    try {
      await fetch('/api/wizard/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: userData.selectedIdeaIndex !== undefined ? ideas[Number(userData.selectedIdeaIndex)]?.name : null,
          problems: userData.selectedProblem ? [userData.selectedProblem] : [],
          target: userData.marketType ?? null,
          socials: userData.acquisitionChannels ? [userData.acquisitionChannels] : [],
          budget: userData.launchBudget ?? null,
          name: userData.domain ?? null,
        }),
      })
    } catch {}
  }

  async function handleDashboard() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setShowAuthGate(true)
      return
    }
    await saveWizardSession()
    goTo(16)
  }

  async function handleAuthDone() {
    setShowAuthGate(false)
    await saveWizardSession()
    goTo(16)
  }

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
          <img src="/logo.png" alt="SaaSGenrt" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>SaaSGenrt</span>
        </a>
        {step >= 1 && step <= 12 && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.04em' }}>{step} / 12</div>
        )}
        <div style={{ width: 60 }} />
      </div>

      {/* Auth gate modal */}
      <AnimatePresence>
        {showAuthGate && (
          <AuthGateModal onClose={() => setShowAuthGate(false)} onDone={handleAuthDone} />
        )}
      </AnimatePresence>

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
            {step === 6 && <ChoiceStep progressN={6} badgeN={6} pre="Quel est ton" accent="budget de lancement ?" subtitle="Combien peux-tu investir pour démarrer ton SaaS ?" options={LAUNCH_BUDGET_OPTIONS} value={userData.launchBudget} onSelect={(v) => set('launchBudget', v)} onNext={() => goTo(7)} onBack={() => goTo(5)} />}
            {step === 7 && <ChoiceStep progressN={7} badgeN={7} pre="Comment vas-tu" accent="le construire ?" subtitle="Ça détermine le calendrier, les coûts et les idées recommandées." options={BUILD_APPROACH_OPTIONS} value={userData.buildApproach} onSelect={(v) => set('buildApproach', v)} onNext={() => goTo(8)} onBack={() => goTo(6)} columns={1} />}
            {step === 8 && <ChoiceStep progressN={8} badgeN={8} pre="Budget mensuel" accent="pour la pub ?" subtitle="On adapte ta stratégie d'acquisition à ton budget." options={ADS_BUDGET_OPTIONS} value={userData.adsBudget} onSelect={(v) => set('adsBudget', v)} onNext={() => goTo(9)} onBack={() => goTo(7)} />}
            {step === 9 && <AcquisitionStep value={userData.acquisitionChannels} onChange={(v) => set('acquisitionChannels', v)} onNext={() => goTo(10)} onBack={() => goTo(8)} />}
            {step === 10 && <MarketTypeStep value={userData.marketType} onSelect={(v) => set('marketType', v)} onNext={() => goTo(11)} onBack={() => goTo(9)} />}
            {step === 11 && <ChoiceStep progressN={11} badgeN={11} pre="Quelle est ta" accent="tranche d'âge ?" subtitle="Ça nous aide à comprendre ton profil et ton horizon." options={AGE_OPTIONS} value={userData.age} onSelect={(v) => set('age', v)} onNext={() => goTo(12)} onBack={() => goTo(10)} />}
            {step === 12 && <ChoiceStep progressN={12} badgeN={12} pre="Combien de temps" accent="peux-tu y consacrer ?" subtitle="On dimensionne ta roadmap selon ta vraie disponibilité." options={TIME_PER_DAY_OPTIONS} value={userData.timePerDay} onSelect={(v) => set('timePerDay', v)} onNext={() => goTo(13)} onBack={() => goTo(11)} />}
            {step === 13 && <LoadingIdeasStep loadingStep={loadingStep} />}
            {step === 14 && <IdeaSelectionStep ideas={ideas} selectedIndex={userData.selectedIdeaIndex} onSelect={(i) => set('selectedIdeaIndex', i)} onNext={() => goTo(15)} onBack={() => goTo(12)} />}
            {step === 15 && <FullResultsStep ideas={ideas} userData={userData} onDashboard={handleDashboard} />}
            {step === 16 && <DashboardStep ideas={ideas} userData={userData} onRestart={restart} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}






