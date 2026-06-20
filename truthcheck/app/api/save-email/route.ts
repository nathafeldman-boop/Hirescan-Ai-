import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`saveemail:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email || !email.includes('@') || !email.includes('.')) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.user.upsert({
    where: { email },
    create: { email, tier: 'free' },
    update: {},
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
