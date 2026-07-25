# Product

## Register

brand

Note: the overall site (urcecret.site) is a brand/marketing/funnel surface. The
specific surface being worked on in this task — `/admin`, the internal owner-only
analytics dashboard — is a **product** surface (register override for this task:
`product`). It has no relation to the public brand visuals; it's a tool for one
person (the founder) to read business data quickly.

## Users

- **Public site**: French-speaking TikTok/organic visitors (mostly mobile,
  often inside TikTok's in-app browser), 18-35, curious/entertainment-seeking,
  low intent-to-pay at first click. They come from a "vérité sur toi" hook
  (MBTI type + 15 anonymous relationship/psychology quizzes), most have never
  heard of MBTI-as-a-paid-product before.
- **Admin dashboard** (this task): a single user — the founder, Nathanaël,
  running UrCecret solo. He checks it daily/multiple times a day from his phone
  (often via a direct URL, sometimes right after posting a TikTok) to answer
  "did today's video convert?", "how much MRR/revenue so far?", "where's the
  traffic coming from?". No other admins, no permissions system needed.

## Product Purpose

UrCecret (urcecret.site) is a French MBTI personality-test SaaS: a free 16-type
test funnels into a paywalled full profile (one-time or subscription unlock),
15 free anonymous "vérité" quizzes (infidélité, narcissisme, burnout...) as a
secondary funnel, and Nova, an AI coach (Mistral-powered) grounded in the
user's own test result, sold as the retention/subscription hook.

The admin dashboard's purpose: let the founder see, at a glance and without
digging, whether the business is healthy right now — signups, revenue,
conversion, traffic sources/channels — and catch problems (a broken funnel, a
stalled campaign) fast. Success = "I open it and know within 5 seconds if
today is good or bad, and why."

## Brand Personality

- **Public site**: mystique, warm, a little dramatic ("L'Oracle" identity —
  ink black + gold seal, serif display type, tarot/oracle motifs), earned
  intimacy ("Nova already knows you"), never clinical or medical-sounding.
- **Admin dashboard** (this task): the opposite register on purpose — no
  mystique needed here, no ink-and-gold theatrics. This is a cockpit, not a
  showroom. Calm, information-dense, fast to scan, confident. Think
  App Store Connect / Play Console analytics, not a marketing page.

## Anti-references

- **Public site**: generic "AI SaaS dark purple gradient" template look;
  cold Vercel/Linear dev-tool aesthetic; anything that reads clinical/medical
  (this is personality/self-knowledge framing, never diagnosis).
- **Admin dashboard** (this task): the site's own gold/ink/serif "oracle"
  styling transplanted onto a data dashboard (mystique has no place in a
  numbers cockpit); generic AI-slop admin templates (purple gradients,
  identical icon+number card grids with no hierarchy, glassmorphism); dense
  spreadsheet-in-a-browser dashboards with no visual hierarchy at all.

## Design Principles

1. **Show, don't dig** — the most important number (today's activity vs. the
   trend) must be legible in the first 2 seconds, not buried under equally-
   weighted cards.
2. **One glance, one verdict** — every section should let the founder answer
   a single business question without cross-referencing other sections.
3. **Register match** — the admin dashboard borrows nothing from the public
   site's oracle/mystique visual language; it earns its own, calmer identity.
4. **No decoration tax** — a solo founder checking this from a phone between
   tasks has no patience for chrome that doesn't carry information.

## Accessibility & Inclusion

WCAG AA minimum. Body text contrast ≥ 4.5:1. Respect `prefers-reduced-motion`.
Single user, no locale/i18n requirement for this internal surface (French UI
labels are fine, unlike the public site which is bilingual FR/EN).
