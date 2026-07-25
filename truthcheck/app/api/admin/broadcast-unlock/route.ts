import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailUnlockReminder } from '@/lib/emails';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'urcecret-admin-natha-2024';

// Envoi groupé à tous les inscrits qui n'ont PAS encore débloqué leur profil
// (tier 'free') — contrairement au cron email-sequence (ancré sur J+1/3/7),
// celle-ci relance TOUT LE MONDE, quelle que soit la date d'inscription.
// Déduplication : chaque envoi est loggué (EmailLog type 'unlock_reminder') →
// relancer la campagne ne renvoie QU'AUX inscrits qui ne l'ont pas encore reçue.
//
//   Prévisualiser le nombre de destinataires :
//     GET /api/admin/broadcast-unlock?secret=…&dry=1
//   Test sur une seule adresse :
//     GET /api/admin/broadcast-unlock?secret=…&test=moi@exemple.com
//   Envoi réel (action irréversible) :
//     GET /api/admin/broadcast-unlock?secret=…&confirm=SEND
const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 600;
const EMAIL_LOG_TYPE = 'unlock_reminder';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function build(name: string | null, mbtiType: string | null, to: string) {
  const { subject, html } = emailUnlockReminder(name, mbtiType);
  return { from: 'UrCecret <noreply@urcecret.site>', reply_to: 'urcecretteam@gmail.com', to, subject, html };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  if (searchParams.get('secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY manquante' }, { status: 500 });

  // Destinataires : inscrits gratuits (profil pas débloqué) avec un email réel
  // (on exclut les testeurs synthétiques @urcecret.app) qui n'ont PAS déjà reçu
  // cette campagne (EmailLog).
  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      tier: 'free',
      NOT: { email: { endsWith: '@urcecret.app' } },
      emailLogs: { none: { type: EMAIL_LOG_TYPE } },
    },
    select: { id: true, email: true, name: true, mbtiType: true },
  });
  const recipients = users.filter((u): u is { id: string; email: string; name: string | null; mbtiType: string | null } => !!u.email);

  // ── Mode dry : compter, avec le détail par étape du filtre pour comprendre
  // un total à 0 (déjà tous relancés ? personne en tier free ? emails
  // synthétiques ?) sans avoir besoin d'un accès direct à la base.
  if (searchParams.get('dry')) {
    const [totalUsers, freeTier, freeWithEmail, freeWithEmailReal, byTier, alreadyLogged] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { tier: 'free' } }),
      prisma.user.count({ where: { tier: 'free', email: { not: null } } }),
      prisma.user.count({ where: { tier: 'free', email: { not: null }, NOT: { email: { endsWith: '@urcecret.app' } } } }),
      prisma.user.groupBy({ by: ['tier'], _count: true }),
      prisma.user.count({
        where: { tier: 'free', email: { not: null }, NOT: { email: { endsWith: '@urcecret.app' } }, emailLogs: { some: { type: EMAIL_LOG_TYPE } } },
      }),
    ]);
    return NextResponse.json({
      ok: true,
      mode: 'dry',
      recipients: recipients.length,
      diagnostic: {
        totalUsers,
        byTier,
        freeTier,
        freeWithEmail,
        freeWithEmailExcludingSynthetic: freeWithEmailReal,
        alreadyReceivedThisCampaign: alreadyLogged,
      },
    });
  }

  // ── Mode test : envoi à une seule adresse ──
  const test = searchParams.get('test');
  if (test) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(build('toi', 'INFJ', test)),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ error: 'Resend error', data }, { status: 500 });
    return NextResponse.json({ ok: true, mode: 'test', email: test, data });
  }

  // ── Envoi réel : garde-fou explicite ──
  if (searchParams.get('confirm') !== 'SEND') {
    return NextResponse.json({
      ok: false,
      hint: 'Ajoute &confirm=SEND pour envoyer réellement. Utilise &dry=1 pour compter, &test=email pour un essai.',
      recipients: recipients.length,
    }, { status: 400 });
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    const payload = chunk.map((u) => build(u.name, u.mbtiType, u.email));
    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        sent += chunk.length;
        // Log immédiatement — si le process est interrompu après ce lot, les
        // suivants ne recevront pas de doublon lors d'une relance de la campagne.
        await prisma.emailLog.createMany({
          data: chunk.map((u) => ({ userId: u.id, type: EMAIL_LOG_TYPE })),
          skipDuplicates: true,
        }).catch(() => {});
      } else {
        failed += chunk.length;
        const txt = await res.text().catch(() => '');
        if (errors.length < 5) errors.push(`batch ${i}: ${txt.slice(0, 200)}`);
      }
    } catch (e) {
      failed += chunk.length;
      if (errors.length < 5) errors.push(`batch ${i}: ${e instanceof Error ? e.message : 'network'}`);
    }
    if (i + BATCH_SIZE < recipients.length) await sleep(BATCH_DELAY_MS);
  }

  return NextResponse.json({ ok: true, mode: 'send', total: recipients.length, sent, failed, errors });
}
