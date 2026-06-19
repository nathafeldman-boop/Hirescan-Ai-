import { NextRequest, NextResponse } from 'next/server'

const MISTRAL_KEY = '4PtEe397ANJtMuPHfxeYIlwtFQsTRt3a'

const FALLBACK = [
  {
    name: 'ContractPilot AI',
    tagline: 'Auto-review B2B contracts in seconds',
    mrrPotential: '$2.4K–$9K',
    competitionScore: 3,
    techComplexity: 'Medium',
    timeToMvp: '4–6 weeks',
    why: 'Matches your domain and can be shipped within your available time',
    targetCustomer: 'SMBs handling recurring vendor contracts',
  },
  {
    name: 'StatusBoard Pro',
    tagline: 'Real-time API monitoring for dev teams',
    mrrPotential: '$1.8K–$6K',
    competitionScore: 4,
    techComplexity: 'Low',
    timeToMvp: '2–4 weeks',
    why: 'Low competition niche that fits your technical level and budget',
    targetCustomer: 'Dev teams at 5–50 person SaaS companies',
  },
  {
    name: 'ChurnGuard',
    tagline: 'Predict and prevent SaaS churn automatically',
    mrrPotential: '$3.2K–$14K',
    competitionScore: 5,
    techComplexity: 'Medium',
    timeToMvp: '5–8 weeks',
    why: 'High MRR ceiling with clear ROI for your target customer',
    targetCustomer: 'B2B SaaS companies with 50–500 customers',
  },
]

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { domain, domainChip, timePerWeek, techLevel, budget, customerType, pricingModel } = body

  const prompt = `You are a SaaS business strategist. Generate exactly 3 highly specific, profitable SaaS ideas for this founder.

FOUNDER PROFILE:
- Domain/Interest: ${domain || domainChip || 'B2B SaaS'}
- Available time: ${timePerWeek}
- Technical level: ${techLevel}
- Launch budget: ${budget}
- Target customer: ${customerType}
- Pricing model preference: ${pricingModel}

Return ONLY a valid JSON object with an "ideas" array of exactly 3 objects. Each object must have:
{
  "name": "Product Name (2–4 words, specific)",
  "tagline": "One-line value prop (max 8 words)",
  "mrrPotential": "$X–$Y MRR (realistic monthly range)",
  "competitionScore": number (1–10, 1=very low competition, 10=saturated),
  "techComplexity": "Low" or "Medium" or "High",
  "timeToMvp": "X–Y weeks",
  "why": "One sentence why this specifically fits this founder's profile",
  "targetCustomer": "Specific customer segment (not generic)"
}

Make ideas realistic, specific, and directly achievable for this profile. Prefer B2B tools.`

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 1200,
      }),
    })

    if (!res.ok) throw new Error(`Mistral ${res.status}`)

    const data = await res.json()
    const parsed = JSON.parse(data.choices[0].message.content)
    if (Array.isArray(parsed.ideas) && parsed.ideas.length > 0) {
      return NextResponse.json({ ideas: parsed.ideas })
    }
    throw new Error('No ideas in response')
  } catch {
    return NextResponse.json({ ideas: FALLBACK })
  }
}
