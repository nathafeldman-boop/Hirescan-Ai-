import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateAffiliateToken } from '@/lib/affiliateToken';

const OWNER_EMAIL = 'nathabuisseness@gmail.com';
const BASE = 'https://urcecret.site';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== OWNER_EMAIL) return false;
  return true;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const affiliates = await prisma.affiliate.findMany({
    include: { conversions: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    affiliates.map(a => ({
      ...a,
      dashboardUrl: `${BASE}/affilie/${a.slug}?token=${generateAffiliateToken(a.slug)}`,
    }))
  );
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { name, slug, email } = await req.json();
  if (!name || !slug) {
    return NextResponse.json({ error: 'name et slug requis' }, { status: 400 });
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!cleanSlug) {
    return NextResponse.json({ error: 'slug invalide' }, { status: 400 });
  }

  const affiliate = await prisma.affiliate.create({
    data: { name, slug: cleanSlug, email: email || null, commissionPct: 50 },
  });

  return NextResponse.json({
    ...affiliate,
    dashboardUrl: `${BASE}/affilie/${affiliate.slug}?token=${generateAffiliateToken(affiliate.slug)}`,
  });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { id } = await req.json();
  await prisma.affiliateConversion.deleteMany({ where: { affiliateId: id } });
  await prisma.affiliate.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
