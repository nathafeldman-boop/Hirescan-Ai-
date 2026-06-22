import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

// Synthetic email domain for access-code testers. Used to exclude them from MRR / client counts.
const TEST_EMAIL_DOMAIN = '@urcecret.app';

export async function POST(req: NextRequest) {
  let body: { code?: string; callbackUrl?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const raw = (body.code ?? '').trim().toUpperCase();
  if (!raw) return NextResponse.json({ error: 'Code requis' }, { status: 400 });

  const accessCode = await prisma.accessCode.findUnique({ where: { code: raw } });
  if (!accessCode) return NextResponse.json({ error: 'Code invalide' }, { status: 404 });
  if (accessCode.used) return NextResponse.json({ error: 'Ce code a déjà été utilisé' }, { status: 409 });

  // Synthetic email tied to this code — creates a real user with premium access
  const syntheticEmail = `acces-${raw.toLowerCase()}${TEST_EMAIL_DOMAIN}`;

  // Find or create the user with premium access
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

  // Create a NextAuth database session directly and set the cookie.
  // (We can't reuse the email magic-link callback because NextAuth hashes
  //  verification tokens before lookup — a raw token would never match.)
  const sessionToken = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.session.create({
    data: { sessionToken, userId: user.id, expires },
  });

  // Match NextAuth's cookie naming: secure prefix on https deployments.
  const useSecure = (process.env.NEXTAUTH_URL ?? '').startsWith('https://')
    || process.env.NODE_ENV === 'production';
  const cookieName = useSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

  const callbackUrl = body.callbackUrl ?? '/quiz/personnalite';

  const res = NextResponse.json({ ok: true, loginUrl: callbackUrl });
  res.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: useSecure,
    expires,
  });
  return res;
}
