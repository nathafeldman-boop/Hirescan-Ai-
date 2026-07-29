import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import { resolvePostAuthDestination } from '@/lib/onboardingFunnel';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`verify-code:ip:${ip}`, 20, 10 * 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives, réessaie dans quelques minutes.' }, { status: 429 });
  }

  let body: { email?: string; code?: string; callbackUrl?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Requête invalide' }, { status: 400 }); }
  const email = (body.email ?? '').trim().toLowerCase();
  const code = (body.code ?? '').trim();
  if (!email || !code) return NextResponse.json({ error: 'Email et code requis' }, { status: 400 });

  // Anti brute-force : un code à 6 chiffres a peu de combinaisons, mais il expire
  // en 10 min et une seule tentative valide le consomme — quelques essais suffisent
  // en usage normal (faute de frappe), au-delà on bloque et on invite à en redemander un.
  if (!rateLimit(`verify-code:email:${email}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives pour cet email, redemande un code.' }, { status: 429 });
  }

  const hashedToken = crypto.createHash('sha256').update(`${code}${process.env.NEXTAUTH_SECRET ?? ''}`).digest('hex');
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: hashedToken } },
  }).catch(() => null);

  if (!record || record.expires < new Date()) {
    if (record) {
      await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token: hashedToken } } }).catch(() => {});
    }
    return NextResponse.json({ error: record ? 'Ce code a expiré, redemande-en un.' : 'Code invalide.' }, { status: 400 });
  }

  // Code valide, à usage unique — on le consomme tout de suite (impossible de le réutiliser).
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token: hashedToken } } }).catch(() => {});

  // Trouve ou crée le compte (comme le ferait NextAuth lors d'un premier sign-in par email).
  const existing = await prisma.user.findUnique({ where: { email }, select: { onboardingCompletedAt: true } });
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, emailVerified: new Date() },
    update: { emailVerified: new Date() },
  });
  const needsOnboarding = !existing || !existing.onboardingCompletedAt;

  // Crée directement une session NextAuth (strategy "database") + pose le cookie —
  // même mécanisme que /api/auth/redeem-code : on gère nous-mêmes la vérification
  // du code, donc on ne peut pas passer par le callback magic-link de NextAuth
  // (qui exige de hasher le token à SA façon interne avant de matcher).
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

  await prisma.session.create({ data: { sessionToken, userId: user.id, expires: sessionExpires } });
  await logEvent(user.id, EVENTS.SIGNED_IN, { method: 'email_code' });

  const useSecure = (process.env.NEXTAUTH_URL ?? '').startsWith('https://') || process.env.NODE_ENV === 'production';
  const cookieName = useSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

  const callbackUrl = resolvePostAuthDestination(needsOnboarding, body.callbackUrl ?? '/quiz/personnalite');
  const res = NextResponse.json({ ok: true, loginUrl: callbackUrl });
  res.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: useSecure,
    expires: sessionExpires,
  });
  return res;
}
