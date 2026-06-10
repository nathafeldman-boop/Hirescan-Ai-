import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = 'urcecret-admin-natha-2024';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const email = req.nextUrl.searchParams.get('email');
  if (secret !== ADMIN_SECRET || !email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await prisma.user.updateMany({
    where: { email: email.toLowerCase().trim() },
    data: { tier: 'premium' },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: `Aucun user trouvé pour ${email}` }, { status: 404 });
  }
  return NextResponse.json({ ok: true, email, tier: 'premium' });
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email requis' }, { status: 400 });
  const result = await prisma.user.updateMany({
    where: { email: email.toLowerCase().trim() },
    data: { tier: 'premium' },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: `Aucun user trouvé pour ${email}` }, { status: 404 });
  }
  return NextResponse.json({ ok: true, updated: result.count, email });
}
