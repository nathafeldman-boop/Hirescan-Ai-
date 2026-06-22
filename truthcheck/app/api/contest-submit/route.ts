import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateSlug, tiktokUrl, viewsCount, likesCount, sharesCount } = body;

    if (!affiliateSlug || !/^[a-z0-9_-]{2,32}$/.test(affiliateSlug)) {
      return NextResponse.json({ error: 'Slug invalide' }, { status: 400 });
    }

    const affiliate = await prisma.affiliate.findUnique({ where: { slug: affiliateSlug } });
    if (!affiliate) {
      return NextResponse.json({ error: 'Affilié introuvable' }, { status: 404 });
    }

    const month = currentMonth();

    await prisma.contestEntry.upsert({
      where: { month_affiliateSlug: { month, affiliateSlug } },
      create: {
        month,
        affiliateSlug,
        affiliateName: affiliate.name,
        tiktokUrl: tiktokUrl ?? null,
        viewsCount: Math.max(0, parseInt(viewsCount) || 0),
        likesCount: Math.max(0, parseInt(likesCount) || 0),
        sharesCount: Math.max(0, parseInt(sharesCount) || 0),
      },
      update: {
        tiktokUrl: tiktokUrl ?? undefined,
        viewsCount: Math.max(0, parseInt(viewsCount) || 0),
        likesCount: Math.max(0, parseInt(likesCount) || 0),
        sharesCount: Math.max(0, parseInt(sharesCount) || 0),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
