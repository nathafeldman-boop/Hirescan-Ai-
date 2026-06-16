import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'urcecret-admin-natha-2024';

function checkAuth(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  return secret === ADMIN_SECRET;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(randomBytes(8))
    .map(b => chars[b % chars.length])
    .join('');
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const codes = await prisma.accessCode.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json({ codes });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const note: string | undefined = body.note ?? undefined;

  let code: string;
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 10) return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 });
  } while (await prisma.accessCode.findUnique({ where: { code } }));

  const created = await prisma.accessCode.create({ data: { code, note } });
  return NextResponse.json({ ok: true, code: created });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  await prisma.accessCode.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
