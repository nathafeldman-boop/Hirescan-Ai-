import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const BOT_PATTERNS = /bot|crawler|spider|scraper|headless|prerender|lighthouse|pagespeed/i;

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? '';
  if (BOT_PATTERNS.test(ua)) return NextResponse.json({ ok: true });

  const ip = getClientIp(req);
  if (!rateLimit(`track:${ip}`, 120, 60_000)) {
    return NextResponse.json({ ok: true }); // silent drop, not an error
  }

  const { path } = await req.json().catch(() => ({ path: '/' }));
  if (!path || path.startsWith('/natha-admin') || path.startsWith('/api')) {
    return NextResponse.json({ ok: true });
  }

  await prisma.pageView.create({ data: { path } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
