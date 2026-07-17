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

  const { path, visitorId } = await req.json().catch(() => ({ path: '/', visitorId: undefined }));
  if (!path || path.startsWith('/natha-admin') || path.startsWith('/api')) {
    return NextResponse.json({ ok: true });
  }

  const cleanVisitorId = typeof visitorId === 'string' && /^[a-f0-9-]{10,64}$/i.test(visitorId) ? visitorId : undefined;
  await prisma.pageView.create({ data: { path, visitorId: cleanVisitorId } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
