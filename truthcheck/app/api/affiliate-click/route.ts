import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug?: string };
    if (!slug || !/^[a-z0-9_-]{2,32}$/i.test(slug)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await prisma.pageView.create({ data: { path: `/__aff/${slug}` } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
