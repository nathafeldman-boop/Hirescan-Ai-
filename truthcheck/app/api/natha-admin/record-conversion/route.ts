import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { TIER_RANK } from '@/lib/plans';

// Même mapping que app/success/page.tsx (verifyAndUnlock) — un paiement réel
// qui n'a jamais tourné par ce chemin ne doit pas non plus laisser le compte
// en 'free' une fois rattrapé à la main.
function tierForProductType(productType: string): string {
  if (productType === 'starter') return 'starter';
  if (productType === 'plus') return 'plus';
  if (productType === 'onetime') return 'unlocked';
  return 'premium'; // 'monthly' et toute autre offre payante
}

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

  // Root cause du badge "Gratuit" resté affiché après un rattrapage manuel :
  // cette route ne touchait jamais User.tier (seul verifyAndUnlock côté
  // /success le fait pour un paiement qui passe par le vrai flux Stripe).
  // Upgrade-only comme /success : jamais de downgrade d'un tier déjà plus
  // élevé (ex. un compte déjà Premium ne redescend pas en Starter).
  const tier = tierForProductType(productType);
  const existing = await prisma.user.findUnique({ where: { email }, select: { tier: true } });
  if (existing && (TIER_RANK[tier] ?? 0) > (TIER_RANK[existing.tier] ?? 0)) {
    await prisma.user.update({ where: { email }, data: { tier } });
  }

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
