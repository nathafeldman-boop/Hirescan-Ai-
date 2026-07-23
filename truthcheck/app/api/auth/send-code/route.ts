import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { emailLoginCode, sendEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

// Code de connexion à 6 chiffres, valable 10 minutes, à usage unique.
// Remplace le lien magique NextAuth pour la connexion par email : un code
// tapé directement sur le site évite le saut vers l'appli email qui casse
// souvent la session sur mobile / navigateurs in-app (TikTok, Instagram…).
const CODE_TTL_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  // Anti-spam : on ne veut pas qu'un tiers bombarde une boîte mail avec nos emails.
  if (!rateLimit(`send-code:ip:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives, réessaie dans quelques minutes.' }, { status: 429 });
  }

  let body: { email?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Requête invalide' }, { status: 400 }); }
  const email = (body.email ?? '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
  }
  if (!rateLimit(`send-code:email:${email}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Trop de demandes pour cet email, réessaie dans quelques minutes.' }, { status: 429 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: 'Envoi d\'email non configuré' }, { status: 503 });

  const code = crypto.randomInt(100000, 1000000).toString();
  // Même schéma de hash que NextAuth (sha256(token + secret)) — cohérent avec le
  // reste du code (voir app/success/page.tsx), même si on ne passe pas par le
  // callback NextAuth pour la vérification (voir /api/auth/verify-code).
  const hashedToken = crypto.createHash('sha256').update(`${code}${process.env.NEXTAUTH_SECRET ?? ''}`).digest('hex');
  const expires = new Date(Date.now() + CODE_TTL_MS);

  try {
    // Un seul code valide à la fois par email — en redemander un invalide le précédent.
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({ data: { identifier: email, token: hashedToken, expires } });
    const { subject, html } = emailLoginCode(code);
    await sendEmail(email, subject, html);
  } catch (e) {
    console.error('send-code error:', e);
    return NextResponse.json({ error: 'Erreur d\'envoi, réessaie.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
