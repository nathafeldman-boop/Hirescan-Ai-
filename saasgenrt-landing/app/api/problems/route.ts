import { NextRequest, NextResponse } from 'next/server'

const MISTRAL_KEY = '4PtEe397ANJtMuPHfxeYIlwtFQsTRt3a'

const FALLBACK = [
  { title: 'Freelance invoice tracking nightmare', description: 'Freelancers spend hours chasing late payments and reconciling invoices manually.', frequency: 'Daily', marketSize: '59M freelancers worldwide' },
  { title: 'Content calendar chaos for creators', description: 'Content creators struggle to plan, schedule and repurpose content across platforms.', frequency: 'Weekly', marketSize: '$400B creator economy' },
  { title: 'Client feedback scattered across tools', description: 'Agencies waste time consolidating feedback from email, Slack, Loom and docs.', frequency: 'Daily', marketSize: '400K+ agencies globally' },
  { title: 'No-show appointments for service businesses', description: 'Salons, coaches and consultants lose revenue from no-shows and late cancellations.', frequency: 'Weekly', marketSize: '$1.2B lost annually' },
  { title: 'HR onboarding still done in spreadsheets', description: 'Small businesses onboard new hires with manual checklists and scattered docs.', frequency: 'Monthly', marketSize: '33M SMBs in US alone' },
]

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { domain, domainChip, dailyFrustrations, passions, profession, problemOwner } = body

  const prompt = `You are a SaaS market researcher. Based on this person's profile, generate exactly 5 specific recurring problems that could be solved with a SaaS product.

PERSON PROFILE:
- Domain/Interest: ${domain || domainChip || 'general business'}
- Who has the problem: ${problemOwner || 'themselves'}
- Daily frustrations: ${dailyFrustrations || 'not specified'}
- Passions: ${passions || 'not specified'}
- Profession/Domain: ${profession || 'not specified'}

Return ONLY a valid JSON object with a "problems" array of exactly 5 objects. Each object:
{
  "title": "Problem title (5-8 words, specific and relatable)",
  "description": "One-sentence description of the pain (max 15 words)",
  "frequency": "Daily" or "Weekly" or "Monthly",
  "marketSize": "Specific market size or audience size stat"
}

Focus on problems that: (1) happen repeatedly, (2) cost time or money, (3) have no perfect solution yet.`

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MISTRAL_KEY}` },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.85,
        max_tokens: 900,
      }),
    })
    if (!res.ok) throw new Error(`Mistral ${res.status}`)
    const data = await res.json()
    const parsed = JSON.parse(data.choices[0].message.content)
    if (Array.isArray(parsed.problems) && parsed.problems.length > 0) {
      return NextResponse.json({ problems: parsed.problems })
    }
    throw new Error('No problems')
  } catch {
    return NextResponse.json({ problems: FALLBACK })
  }
}
