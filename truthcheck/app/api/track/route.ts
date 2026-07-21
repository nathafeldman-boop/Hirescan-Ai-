import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const BOT_PATTERNS = /bot|crawler|spider|scraper|headless|prerender|lighthouse|pagespeed|google-inspection|googleother|google-extended|google-adstxt|adsbot|mediapartners|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegram/i;

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? '';
  if (BOT_PATTERNS.test(ua)) return NextResponse.json({ ok: true });

  const ip = getClientIp(req);
  if (!rateLimit(`track:${ip}`, 120, 60_000)) {
    return NextResponse.json({ ok: true }); // silent drop, not an error
  }

  const { path, visitorId, referrer } = await req.json().catch(() => ({ path: '/', visitorId: undefined, referrer: undefined }));
  if (!path || path.startsWith('/natha-admin') || path.startsWith('/api')) {
    return NextResponse.json({ ok: true });
  }

  const cleanVisitorId = typeof visitorId === 'string' && /^[a-f0-9-]{10,64}$/i.test(visitorId) ? visitorId : undefined;

  // ── Attribution ──────────────────────────────────────────────────────────
  // Priorité : affilié (cookie urs_ref) > UTM (cookie urs_utm, posé par le
  // middleware sur ?utm_source=…) > hôte du referrer externe > direct.
  let refHost: string | undefined;
  if (typeof referrer === 'string' && referrer) {
    try {
      const h = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
      if (h && !h.includes('urcecret')) refHost = h.slice(0, 80); // interne = pas un referrer
    } catch { /* referrer malformé — ignoré */ }
  }
  let source = 'direct';
  const aff = req.cookies.get('urs_ref')?.value;
  if (aff) {
    source = `aff:${aff.slice(0, 32)}`;
  } else {
    try {
      const utm = JSON.parse(req.cookies.get('urs_utm')?.value ?? '') as { s?: string };
      if (utm.s) source = String(utm.s).toLowerCase().slice(0, 32);
    } catch { /* pas de cookie UTM */ }
    if (source === 'direct' && refHost) {
      // Regroupe les gros hôtes sous un nom lisible (google.fr, google.com → google)
      source = refHost.includes('google') ? 'google'
        : refHost.includes('bing') ? 'bing'
        : refHost.includes('tiktok') ? 'tiktok'
        : refHost.includes('instagram') ? 'instagram'
        : refHost.includes('snapchat') ? 'snapchat'
        : refHost;
    }
  }

  await prisma.pageView.create({ data: { path, visitorId: cleanVisitorId, source, referrer: refHost } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
