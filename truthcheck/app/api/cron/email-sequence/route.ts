import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailDay1, emailDay3, emailDay7, emailSuiviDay, emailRetentionM1, emailRetentionM3, emailRetentionM5, emailWinBackFollowup, sendEmail } from '@/lib/emails';
import { getSuivi } from '@/lib/suivi';

export const dynamic = 'force-dynamic';

const SEQUENCES: { type: string; days: number; template: (name: string | null, typeCode?: string | null) => { subject: string; html: string } }[] = [
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
    // Full 24h window ending exactly N days ago. The cron runs daily, so each
    // free user lands in the dayN window on exactly one run → everyone receives
    // the whole sequence (the old ±1h band made most users miss their emails).
    // The emailLog dedup is the safety net against any double-send.
    const windowStart = new Date(now.getTime() - (seq.days + 1) * 86400 * 1000);
    const windowEnd = new Date(now.getTime() - seq.days * 86400 * 1000);

    const users = await prisma.user.findMany({
      where: {
        email: { not: null },
        tier: 'free',
        createdAt: { gte: windowStart, lte: windowEnd },
        emailLogs: { none: { type: seq.type } },
      },
      select: { id: true, email: true, name: true, mbtiType: true },
    });

    for (const user of users) {
      if (!user.email) continue;
      try {
        const { subject, html } = seq.template(user.name, user.mbtiType);
        await sendEmail(user.email, subject, html);
        await prisma.emailLog.create({ data: { userId: user.id, type: seq.type } });
        sent++;
      } catch (e) {
        console.error(`Email ${seq.type} failed for ${user.email}:`, e);
        errors++;
      }
    }
  }

  // ── Premium suivi sequences — days 2-15 ──
  // Day 1 is sent at purchase time (premium_welcome). Days 2-15 come here.
  for (let day = 2; day <= 15; day++) {
    // Find premium_welcome logs sent (day-1) days ago → these users are on day `day` today
    const welcomeStart = new Date(now.getTime() - day * 86400 * 1000);
    const welcomeEnd   = new Date(now.getTime() - (day - 1) * 86400 * 1000);

    const welcomeLogs = await prisma.emailLog.findMany({
      where: {
        type: 'premium_welcome',
        sentAt: { gte: welcomeStart, lte: welcomeEnd },
        user: {
          tier: 'premium',
          mbtiType: { not: null },
          emailLogs: { none: { type: `suivi_d${day}` } },
        },
      },
      select: {
        userId: true,
        user: { select: { email: true, name: true, mbtiType: true } },
      },
    });

    for (const log of welcomeLogs) {
      const { email: userEmail, name, mbtiType } = log.user;
      if (!userEmail || !mbtiType) continue;
      const suivi = getSuivi(mbtiType.toUpperCase());
      if (!suivi) continue;
      const jourData = suivi.jours[day - 1]; // day 1 was sent in welcome, index 0
      if (!jourData) continue;
      try {
        const { subject, html } = emailSuiviDay(name, mbtiType.toUpperCase(), day, jourData);
        await sendEmail(userEmail, subject, html);
        await prisma.emailLog.create({ data: { userId: log.userId, type: `suivi_d${day}` } });
        sent++;
      } catch (e) {
        console.error(`Suivi d${day} failed for ${userEmail}:`, e);
        errors++;
      }
    }
  }

  // ── Rétention M1 / M3 / M5 — ancrée sur premium_welcome (loggué pour TOUT
  // abonnement payant : starter/plus/premium, voir webhook checkout.session.completed).
  // On ne cible que les comptes encore payants (tier != free) : un utilisateur
  // qui a déjà résilié/churné ne reçoit pas de relance de rétention pour rien.
  const RETENTION_STEPS: { type: string; days: number; template: (name: string | null, typeCode: string | null) => { subject: string; html: string } }[] = [
    { type: 'retention_m1', days: 30,  template: emailRetentionM1 },
    { type: 'retention_m3', days: 90,  template: emailRetentionM3 },
    { type: 'retention_m5', days: 150, template: emailRetentionM5 },
  ];

  for (const step of RETENTION_STEPS) {
    const anchorStart = new Date(now.getTime() - (step.days + 1) * 86400 * 1000);
    const anchorEnd   = new Date(now.getTime() - step.days * 86400 * 1000);

    const welcomeLogs = await prisma.emailLog.findMany({
      where: {
        type: 'premium_welcome',
        sentAt: { gte: anchorStart, lte: anchorEnd },
        user: {
          tier: { not: 'free' },
          emailLogs: { none: { type: step.type } },
        },
      },
      select: {
        userId: true,
        user: { select: { email: true, name: true, mbtiType: true } },
      },
    });

    for (const log of welcomeLogs) {
      const { email: userEmail, name, mbtiType } = log.user;
      if (!userEmail) continue;
      try {
        const { subject, html } = step.template(name, mbtiType);
        await sendEmail(userEmail, subject, html);
        await prisma.emailLog.create({ data: { userId: log.userId, type: step.type } });
        sent++;
      } catch (e) {
        console.error(`Retention ${step.type} failed for ${userEmail}:`, e);
        errors++;
      }
    }
  }

  // ── Relance auto post-winback — J+4, uniquement si jamais revenu sur l'app ──
  // Ancrée sur le log 'winback_subscribe' posé par /api/admin/broadcast-winback
  // (donc ne cible que ceux qui ont VRAIMENT reçu cette campagne, pas tous les
  // comptes gratuits). "Jamais revenu" = lastActiveAt pas plus récent que
  // l'envoi du premier email — l'ouverture de l'email lui-même n'est pas
  // trackée, mais revenir sur l'app est un signal plus fiable de toute façon.
  // Un seul envoi par compte pour toujours (EmailLog @@unique([userId, type])).
  const WINBACK_FOLLOWUP_DAYS = 4;
  const WINBACK_FOLLOWUP_TYPE = 'winback_followup';
  {
    const anchorStart = new Date(now.getTime() - (WINBACK_FOLLOWUP_DAYS + 1) * 86400 * 1000);
    const anchorEnd   = new Date(now.getTime() - WINBACK_FOLLOWUP_DAYS * 86400 * 1000);

    const winbackLogs = await prisma.emailLog.findMany({
      where: {
        type: 'winback_subscribe',
        sentAt: { gte: anchorStart, lte: anchorEnd },
        user: {
          tier: 'free',
          emailLogs: { none: { type: WINBACK_FOLLOWUP_TYPE } },
        },
      },
      select: {
        userId: true,
        sentAt: true,
        user: { select: { email: true, name: true, mbtiType: true, lastActiveAt: true } },
      },
    });

    for (const log of winbackLogs) {
      const { email: userEmail, name, mbtiType, lastActiveAt } = log.user;
      if (!userEmail) continue;
      if (lastActiveAt && lastActiveAt > log.sentAt) continue; // déjà revenu depuis — inutile d'insister
      try {
        const { subject, html } = emailWinBackFollowup(name, mbtiType);
        await sendEmail(userEmail, subject, html);
        await prisma.emailLog.create({ data: { userId: log.userId, type: WINBACK_FOLLOWUP_TYPE } });
        sent++;
      } catch (e) {
        console.error(`Winback followup failed for ${userEmail}:`, e);
        errors++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, errors, timestamp: now.toISOString() });
}
