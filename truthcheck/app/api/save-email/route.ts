import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { emailWelcome, sendEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`saveemail:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : null;
  const mbtiType = typeof body.typeCode === 'string' ? body.typeCode.trim().toUpperCase().slice(0, 4) : null;

  if (!email || !email.includes('@') || !email.includes('.')) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: { email, tier: 'free', ...(name ? { name } : {}), ...(mbtiType ? { mbtiType } : {}) },
    update: { ...(mbtiType ? { mbtiType } : {}) },
  }).catch(() => null);

  // Send the welcome email once per signup — dedupe via EmailLog unique [userId,type].
  // Fired for every captured email so each new lead gets at least one email.
  if (user && process.env.RESEND_API_KEY) {
    const already = await prisma.emailLog
      .findUnique({ where: { userId_type: { userId: user.id, type: 'welcome' } } })
      .catch(() => null);
    if (!already) {
      const { subject, html } = emailWelcome(user.name ?? name);
      try {
        await sendEmail(email, subject, html);
        await prisma.emailLog.create({ data: { userId: user.id, type: 'welcome' } }).catch(() => {});
      } catch {
        // Don't fail the capture if the email provider hiccups.
      }
    }
  }

  return NextResponse.json({ ok: true });
}
