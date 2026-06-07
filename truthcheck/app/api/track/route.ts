import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BOT_PATTERNS = /bot|crawler|spider|scraper|headless|prerender|lighthouse|pagespeed/i;

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? '';
  if (BOT_PATTERNS.test(ua)) return NextResponse.json({ ok: true });

  const { path } = await req.json().catch(() => ({ path: '/' }));
  if (!path || path.startsWith('/natha-admin') || path.startsWith('/api')) {
    return NextResponse.json({ ok: true });
  }

  await prisma.pageView.create({ data: { path } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
