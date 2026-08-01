// ── Enregistrement d'une vente (Conversion + commission affilié) ──
// Root cause d'un vrai bug trouvé le 31/07 : ce code ne vivait QUE dans le
// webhook Stripe (app/api/webhook/route.ts) — or les logs Vercel montrent
// ZÉRO appel à /api/webhook sur les 7 derniers jours (probablement un
// endpoint webhook Stripe absent/mal configuré en mode live). Résultat :
// LTV toujours à 0€, aucun affilié jamais crédité, aucune notif de vente —
// alors que les clients étaient bien débloqués, car ÇA, ça passe par
// /success (vérifié directement via stripe.checkout.sessions.retrieve au
// retour du client, donc fiable même si le webhook serveur-à-serveur ne
// l'est pas).
//
// Cette fonction est donc appelée à DEUX endroits (webhook ET /success),
// chacun pouvant être le premier à s'exécuter selon que le webhook finisse
// par être corrigé ou non — idempotente via la clé unique
// Conversion.stripeSessionId / AffiliateConversion.stripeSessionId, donc
// jamais de double comptage ni de double commission si les deux finissent
// par tourner pour la même session.
import Stripe from 'stripe';
import { prisma } from './db';

export function deriveProductType(meta: Record<string, string | undefined>, mode: string | null): string {
  return meta.annual === 'true' ? 'annual'
    : meta.rapport === 'true' ? 'rapport'
    : meta.fusionGroupId ? 'fusion'
    : meta.oneTime === 'true' ? 'onetime'
    : mode === 'subscription' ? (meta.plan === 'starter' ? 'starter' : meta.plan === 'plus' ? 'plus' : 'monthly')
    : 'onetime';
}

export async function recordSaleConversion(session: Stripe.Checkout.Session, email: string | null): Promise<void> {
  try {
    const meta = session.metadata ?? {};
    const productType = deriveProductType(meta, session.mode);

    // ── Commission affilié ──
    if (meta.affiliateSlug && session.amount_total) {
      const affiliate = await prisma.affiliate.findUnique({ where: { slug: meta.affiliateSlug } }).catch(() => null);
      if (affiliate) {
        const commissionCents = Math.round(session.amount_total * affiliate.commissionPct / 100);
        await prisma.affiliateConversion.upsert({
          where: { stripeSessionId: session.id },
          create: { affiliateId: affiliate.id, amountCents: session.amount_total, commissionCents, stripeSessionId: session.id },
          update: {},
        }).catch(() => {});
      }
    }

    // ── Attribution complète — chaque paiement tracé avec sa source ──
    // (notif email de vente admin retirée le 01/08 — économie de quota Resend ;
    // le suivi reste visible dans /natha-admin via cette ligne Conversion.)
    await prisma.conversion.upsert({
      where: { stripeSessionId: session.id },
      create: {
        stripeSessionId: session.id,
        email: email ?? undefined,
        amountCents: session.amount_total ?? 0,
        quizSlug: meta.quizSlug || undefined,
        productType,
        utmSource: meta.utmSource || undefined,
        utmMedium: meta.utmMedium || undefined,
        utmCampaign: meta.utmCampaign || undefined,
        utmContent: meta.utmContent || undefined,
        affiliateSlug: meta.affiliateSlug || undefined,
        landingPath: meta.landingPath || undefined,
      },
      update: {},
    }).catch(() => {});
  } catch (e) {
    // Ne doit JAMAIS casser le flux qui débloque réellement l'accès payé
    // (webhook ou /success) — voir le commentaire en tête de fichier.
    console.error('recordSaleConversion error:', e);
  }
}
