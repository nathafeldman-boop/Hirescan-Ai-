import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { code?: string; callbackUrl?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const raw = (body.code ?? '').trim().toUpperCase();
  if (!raw) return NextResponse.json({ error: 'Code requis' }, { status: 400 });

  const accessCode = await prisma.accessCode.findUnique({ where: { code: raw } });
  if (!accessCode) return NextResponse.json({ error: 'Code invalide' }, { status: 404 });
  if (accessCode.used) return NextResponse.json({ error: 'Ce code a déjà été utilisé' }, { status: 409 });

  // Synthetic email tied to this code — creates a real user with premium access
  const syntheticEmail = `acces-${raw.toLowerCase()}@urcecret.app`;

  // Find or create the user
  const user = await prisma.user.upsert({
    where: { email: syntheticEmail },
    create: {
      email: syntheticEmail,
      name: `Testeur ${raw}`,
      emailVerified: new Date(),
      tier: 'premium',
    },
    update: { tier: 'premium', emailVerified: new Date() },
  });

  // Mark the code used
  await prisma.accessCode.update({
    where: { id: accessCode.id },
    data: { used: true, usedAt: new Date(), usedByEmail: syntheticEmail },
  });

  // Create a NextAuth VerificationToken so the magic-link callback can log the user in
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.verificationToken.create({
    data: { identifier: syntheticEmail, token, expires },
  });

  const callbackUrl = encodeURIComponent(body.callbackUrl ?? '/quiz/personnalite');
  const loginUrl = `/api/auth/callback/email?token=${token}&email=${encodeURIComponent(syntheticEmail)}&callbackUrl=${callbackUrl}`;

  return NextResponse.json({ ok: true, loginUrl });
}
