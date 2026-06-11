import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(`aff:${ip}`, 5, 300_000)) {
      return NextResponse.json({ ok: true }); // silent drop
    }

    const { slug } = await req.json() as { slug?: string };
    if (!slug || !/^[a-z0-9_-]{2,32}$/i.test(slug)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await prisma.pageView.create({ data: { path: `/__aff/${slug}` } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
