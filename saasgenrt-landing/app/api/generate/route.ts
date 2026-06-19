import { NextRequest, NextResponse } from 'next/server'

const MISTRAL_KEY = '4PtEe397ANJtMuPHfxeYIlwtFQsTRt3a'

const FALLBACK = [
  { name: 'ContractPilot AI', tagline: 'Auto-review B2B contracts in seconds', mrrPotential: '$2.4K–$9K', competitionScore: 3, techComplexity: 'Medium', timeToMvp: '4–6 weeks', why: 'Matches your domain and budget', targetCustomer: 'SMBs with vendor contracts', competitors: ['DocuSign', 'PandaDoc', 'Ironclad'], marketingStrategy: 'LinkedIn thought leadership + cold email to legal ops teams' },
  { name: 'StatusBoard Pro', tagline: 'Real-time API monitoring for dev teams', mrrPotential: '$1.8K–$6K', competitionScore: 4, techComplexity: 'Low', timeToMvp: '2–4 weeks', why: 'Low competition niche for your tech level', targetCustomer: 'Dev teams at 5–50 person SaaS', competitors: ['Datadog', 'Better Uptime', 'Freshping'], marketingStrategy: 'Dev communities (HN, Reddit) + Product Hunt launch' },
  { name: 'ChurnGuard', tagline: 'Predict and prevent SaaS churn', mrrPotential: '$3.2K–$14K', competitionScore: 5, techComplexity: 'Medium', timeToMvp: '5–8 weeks', why: 'High MRR ceiling, clear ROI for buyers', targetCustomer: 'B2B SaaS with 50–500 customers', competitors: ['Gainsight', 'ChurnZero', 'Intercom'], marketingStrategy: 'SaaS founder newsletters + partner with onboarding tools' },
  { name: 'InboxZen', tagline: 'AI triage for overflowing support inboxes', mrrPotential: '$1.5K–$5K', competitionScore: 4, techComplexity: 'Low', timeToMvp: '3–5 weeks', why: 'Simple integration into existing helpdesks', targetCustomer: 'E-commerce brands under 50 employees', competitors: ['Zendesk', 'Freshdesk', 'Help Scout'], marketingStrategy: 'Shopify app store + ecom Facebook groups' },
  { name: 'ProposalFlow', tagline: 'Win more clients with AI proposals', mrrPotential: '$2K–$8K', competitionScore: 3, techComplexity: 'Low', timeToMvp: '3–4 weeks', why: 'High-value pain for agencies and consultants', targetCustomer: 'Freelance agencies under 10 people', competitors: ['Proposify', 'Better Proposals', 'Qwilr'], marketingStrategy: 'LinkedIn ads targeting agency owners + Fiverr/Upwork community' },
  { name: 'MeetingMind', tagline: 'Auto-generate action items from any call', mrrPotential: '$1.2K–$4K', competitionScore: 6, techComplexity: 'Medium', timeToMvp: '4–6 weeks', why: 'Universal pain, easy trial conversion', targetCustomer: 'Remote-first teams of 5–25 people', competitors: ['Otter.ai', 'Fireflies', 'Notion AI'], marketingStrategy: 'Slack/Teams integrations + G2 SEO reviews campaign' },
  { name: 'BudgetSentinel', tagline: 'Alert teams before ad spend overruns', mrrPotential: '$1.8K–$7K', competitionScore: 3, techComplexity: 'Low', timeToMvp: '2–3 weeks', why: 'Direct ROI, quick payback for ad buyers', targetCustomer: 'Media buyers managing multiple accounts', competitors: ['Optmyzr', 'Adalysis', 'WordStream'], marketingStrategy: 'Facebook/Google ads groups + performance marketing influencers' },
  { name: 'ReferralMachine', tagline: 'Launch referral programs in one click', mrrPotential: '$2K–$9K', competitionScore: 4, techComplexity: 'Low', timeToMvp: '3–5 weeks', why: 'Grows with customers, strong LTV', targetCustomer: 'Early-stage SaaS with 100–1K users', competitors: ['ReferralHero', 'Viral Loops', 'Rewardful'], marketingStrategy: 'Indie hackers community + SaaS newsletter sponsorships' },
  { name: 'HireSignal', tagline: 'Find warm candidates before they apply', mrrPotential: '$3K–$12K', competitionScore: 4, techComplexity: 'High', timeToMvp: '6–8 weeks', why: 'HR tech is evergreen, strong B2B pricing', targetCustomer: 'HR managers at 50–200 person companies', competitors: ['LinkedIn Recruiter', 'Greenhouse', 'Lever'], marketingStrategy: 'HR communities + partner with ATS platforms' },
  { name: 'OnboardKit', tagline: 'Personalized user onboarding without code', mrrPotential: '$1.5K–$6K', competitionScore: 5, techComplexity: 'Medium', timeToMvp: '4–6 weeks', why: 'Every SaaS needs this, strong expansion revenue', targetCustomer: 'Product teams at 10–100 person SaaS', competitors: ['Appcues', 'Intercom', 'UserGuiding'], marketingStrategy: 'Product Hunt + SaaS founder Twitter/X content' },
]

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    domain, domainChip, selectedProblem,
    launchBudget, buildApproach, adsBudget,
    acquisitionChannels, marketType, timePerWeek, techLevel,
  } = body

  const prompt = `You are a SaaS business strategist. Generate exactly 10 highly specific, profitable SaaS ideas for this founder.

FOUNDER PROFILE:
- Domain/Interest: ${domain || domainChip || 'general business'}
- Core problem to solve: ${selectedProblem || 'not specified'}
- Launch budget: ${launchBudget || 'not specified'}
- Build approach: ${buildApproach || 'not specified'}
- Monthly ads budget: ${adsBudget || '$0 (organic only)'}
- Acquisition channels: ${acquisitionChannels || 'not specified'}
- Market type: ${marketType || 'B2B'}
- Available time: ${timePerWeek || 'not specified'}
- Tech level: ${techLevel || 'not specified'}

Return ONLY a valid JSON object with an "ideas" array of exactly 10 objects. Each:
{
  "name": "Product Name (2–4 words)",
  "tagline": "One-line value prop (max 8 words)",
  "mrrPotential": "$X–$Y MRR range",
  "competitionScore": number (1–10),
  "techComplexity": "Low" or "Medium" or "High",
  "timeToMvp": "X–Y weeks",
  "why": "Why this fits this founder (1 sentence)",
  "targetCustomer": "Specific customer segment",
  "competitors": ["Competitor1", "Competitor2", "Competitor3"],
  "marketingStrategy": "Marketing approach tailored to their channels and budget (1 sentence)"
}`

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MISTRAL_KEY}` },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 2400,
      }),
    })
    if (!res.ok) throw new Error(`Mistral ${res.status}`)
    const data = await res.json()
    const parsed = JSON.parse(data.choices[0].message.content)
    if (Array.isArray(parsed.ideas) && parsed.ideas.length > 0) {
      return NextResponse.json({ ideas: parsed.ideas })
    }
    throw new Error('No ideas')
  } catch {
    return NextResponse.json({ ideas: FALLBACK })
  }
}
