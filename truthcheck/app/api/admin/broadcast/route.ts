import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailCoachAnnounce } from '@/lib/emails';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'urcecret-admin-natha-2024';

// Envoi groupé à tous les inscrits (table User).
// Sécurité : secret admin obligatoire + `dry`/`test` avant tout envoi réel.
// Déduplication : chaque envoi est loggué (EmailLog type 'coach_announce') →
// relancer la campagne ne renvoie QU'AUX nouveaux inscrits qui ne l'ont pas
// encore reçue, jamais un doublon à ceux qui l'ont déjà eue.
//
//   Prévisualiser le nombre de NOUVEAUX destinataires (pas encore reçu) :
//     GET /api/admin/broadcast?secret=…&dry=1
//   Test sur une seule adresse (recommandé avant le vrai envoi, n'affecte pas le log) :
//     GET /api/admin/broadcast?secret=…&test=moi@exemple.com
//   Envoi réel aux nouveaux inscrits seulement (action irréversible) :
//     GET /api/admin/broadcast?secret=…&confirm=SEND
//
// Resend : endpoint batch (100 max/appel), petit délai entre lots.
const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 600;
const EMAIL_LOG_TYPE = 'coach_announce';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function build(name: string | null, to: string) {
  const { subject, html } = emailCoachAnnounce(name);
  return { from: 'UrCecret <noreply@urcecret.site>', to, subject, html };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  if (searchParams.get('secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY manquante' }, { status: 500 });

  // Destinataires : inscrits avec un email réel (on exclut les testeurs synthétiques
  // @urcecret.app) qui n'ont PAS déjà reçu cette campagne (EmailLog).
  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      NOT: { email: { endsWith: '@urcecret.app' } },
      emailLogs: { none: { type: EMAIL_LOG_TYPE } },
    },
    select: { id: true, email: true, name: true },
  });
  const recipients = users.filter((u): u is { id: string; email: string; name: string | null } => !!u.email);

  // ── Mode dry : compter sans envoyer ──
  if (searchParams.get('dry')) {
    return NextResponse.json({ ok: true, mode: 'dry', recipients: recipients.length });
  }

  // ── Mode test : envoi à une seule adresse ──
  const test = searchParams.get('test');
  if (test) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(build('toi', test)),
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
    const payload = chunk.map((u) => build(u.name, u.email));
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
