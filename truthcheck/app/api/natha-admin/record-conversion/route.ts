import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── Rattrapage manuel d'un paiement manqué ─────────────────────────────────
// Cas réel qui a motivé cette route : le webhook Stripe n'était pas appelé
// (voir lib/recordSale.ts), donc plusieurs paiements réels n'avaient jamais
// créé de ligne Conversion — LTV et "Total cumulé" admin figés à 0€ pour des
// ventes bien encaissées. lib/recordSale.ts corrige ça pour les PROCHAINES
// ventes ; cette route sert à corriger celles déjà passées, à la main,
// depuis la fiche compte de l'admin.
// stripeSessionId synthétique ("manual:...") : jamais de collision possible
// avec un vrai id Stripe (toujours préfixé "cs_"), donc si le vrai
// événement finit par arriver plus tard, il crée sa PROPRE ligne plutôt que
// d'écraser celle-ci — un doublon visible et supprimable, jamais une perte
// de données silencieuse.
export async function POST(req: NextRequest) {
  let body: { email?: string; amountEur?: number; productType?: string; affiliateSlug?: string; createdAt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const email = body.email?.toLowerCase().trim();
  const amountEur = body.amountEur;
  if (!email || typeof amountEur !== 'number' || !(amountEur > 0)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const amountCents = Math.round(amountEur * 100);
  const productType = body.productType?.trim() || 'onetime';
  const affiliateSlug = body.affiliateSlug?.trim() || undefined;
  const createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
  const stripeSessionId = `manual:${crypto.randomUUID()}`;

  const conversion = await prisma.conversion.create({
    data: { stripeSessionId, email, amountCents, productType, affiliateSlug, createdAt },
  });

  let affiliateCredited = false;
  if (affiliateSlug) {
    const affiliate = await prisma.affiliate.findUnique({ where: { slug: affiliateSlug } });
    if (affiliate) {
      const commissionCents = Math.round(amountCents * affiliate.commissionPct / 100);
      await prisma.affiliateConversion.create({
        data: { affiliateId: affiliate.id, amountCents, commissionCents, stripeSessionId, createdAt },
      });
      affiliateCredited = true;
    }
  }

  return NextResponse.json({ ok: true, conversion, affiliateCredited });
}
