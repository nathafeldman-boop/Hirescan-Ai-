import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailDay1, emailDay3, emailDay7, sendEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

const SEQUENCES: { type: string; days: number; template: (name: string | null) => { subject: string; html: string } }[] = [
  { type: 'day1', days: 1, template: emailDay1 },
  { type: 'day3', days: 3, template: emailDay3 },
  { type: 'day7', days: 7, template: emailDay7 },
];

export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isVercelCron && !hasValidSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  let sent = 0;
  let errors = 0;

  for (const seq of SEQUENCES) {
    const windowStart = new Date(now.getTime() - (seq.days * 86400 + 3600) * 1000);
    const windowEnd = new Date(now.getTime() - (seq.days * 86400 - 3600) * 1000);

    const users = await prisma.user.findMany({
      where: {
        email: { not: null },
        tier: 'free',
        createdAt: { gte: windowStart, lte: windowEnd },
        emailLogs: { none: { type: seq.type } },
      },
      select: { id: true, email: true, name: true },
    });

    for (const user of users) {
      if (!user.email) continue;
      try {
        const { subject, html } = seq.template(user.name);
        await sendEmail(user.email, subject, html);
        await prisma.emailLog.create({ data: { userId: user.id, type: seq.type } });
        sent++;
      } catch (e) {
        console.error(`Email ${seq.type} failed for ${user.email}:`, e);
        errors++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, errors, timestamp: now.toISOString() });
}
