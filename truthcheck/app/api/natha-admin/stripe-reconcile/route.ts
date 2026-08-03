import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── Réconciliation manuelle post-incident webhook (voir /api/webhook) ──────
// Le webhook Stripe n'a reçu AUCUN événement depuis le 28/07 (redirection
// urcecret.site → www.urcecret.site : Stripe ne suit pas les redirections
// pour la livraison des webhooks). /success compense déjà pour les NOUVEAUX
// achats (vérification directe de la session au retour du client, voir
// verifyAndUnlock dans app/success/page.tsx), mais RIEN ne compense pour :
//   - customer.subscription.deleted (résiliation → devrait repasser 'free')
//   - invoice.payment_failed (échec de paiement final → devrait repasser 'free')
//   - customer.subscription.updated (changement de palier via le portail Stripe)
// Cette route les recrée manuellement : lecture seule, ne modifie RIEN.
// Elle liste chaque compte payant (starter/plus/premium — jamais 'unlocked',
// qui est un achat unique sans abonnement) dont Stripe ne montre plus
// d'abonnement actif, pour vérification humaine avant toute correction.
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

const SUBSCRIPTION_TIERS = ['starter', 'plus', 'premium'];

export async function GET() {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });

  const paidUsers = await prisma.user.findMany({
    where: { tier: { in: SUBSCRIPTION_TIERS }, email: { not: null } },
    select: { id: true, email: true, name: true, tier: true },
  }) as { id: string; email: string; name: string | null; tier: string }[];

  const mismatches: { id: string; email: string; name: string | null; dbTier: string; stripeStatus: string }[] = [];
  const checked: string[] = [];
  const errors: { email: string; error: string }[] = [];

  for (const user of paidUsers) {
    try {
      const customers = await stripe.customers.list({ email: user.email, limit: 3 });
      if (customers.data.length === 0) {
        mismatches.push({ id: user.id, email: user.email, name: user.name, dbTier: user.tier, stripeStatus: 'aucun client Stripe trouvé' });
        continue;
      }

      let hasActiveSub = false;
      for (const customer of customers.data) {
        const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 10 });
        if (subs.data.some((s) => s.status === 'active' || s.status === 'trialing')) {
          hasActiveSub = true;
          break;
        }
      }

      checked.push(user.email);
      if (!hasActiveSub) {
        mismatches.push({ id: user.id, email: user.email, name: user.name, dbTier: user.tier, stripeStatus: 'aucun abonnement actif chez Stripe' });
      }
    } catch (e) {
      errors.push({ email: user.email, error: e instanceof Error ? e.message : 'erreur inconnue' });
    }
  }

  return NextResponse.json({
    totalPaidUsers: paidUsers.length,
    checkedCount: checked.length,
    mismatchCount: mismatches.length,
    mismatches,
    errors,
    note: 'Lecture seule — aucune modification effectuée. Vérifier chaque compte listé avant de corriger son tier manuellement.',
  });
}
