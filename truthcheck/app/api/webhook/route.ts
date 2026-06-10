import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'not configured' }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] signature invalide:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'signature invalide' }, { status: 400 });
  }

  console.log('[webhook] event reçu:', event.type);

  // ── Paiement réussi (premier achat ou one-time) ──
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const resultId = session.metadata?.resultId;
    const email = session.customer_details?.email;
    console.log('[webhook] checkout completed — email:', email, 'resultId:', resultId);

    if (resultId) {
      await prisma.quizResult.update({
        where: { id: resultId },
        data: { paid: true },
      }).catch(() => {});
    }

    if (email) {
      await prisma.user.updateMany({
        where: { email },
        data: { tier: 'premium' },
      }).catch(() => {});
    }

    const affiliateSlug = session.metadata?.affiliateSlug;
    if (affiliateSlug) {
      const affiliate = await prisma.affiliate.findUnique({ where: { slug: affiliateSlug } }).catch(() => null);
      if (affiliate) {
        const amountCents = session.amount_total ?? 0;
        await prisma.affiliateConversion.create({
          data: {
            affiliateId: affiliate.id,
            amountCents,
            commissionCents: Math.round(amountCents * affiliate.commissionPct / 100),
            stripeSessionId: session.id,
          },
        }).catch(() => {});
      }
    }
  }

  // ── Renouvellement mensuel/annuel réussi → confirme le premium ──
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    // Seulement pour les renouvellements (pas le premier paiement géré par checkout.session.completed)
    if (invoice.billing_reason === 'subscription_cycle') {
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId).catch(() => null);
        if (customer && !customer.deleted && customer.email) {
          await prisma.user.updateMany({
            where: { email: customer.email },
            data: { tier: 'premium' },
          }).catch(() => {});
          console.log('[webhook] renouvellement confirmé pour:', customer.email);
        }
      }
    }
  }

  // ── Paiement de renouvellement échoué → downgrade après échec définitif ──
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    // next_payment_attempt = null signifie que Stripe a abandonné (toutes les relances épuisées)
    if (invoice.next_payment_attempt === null) {
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId).catch(() => null);
        if (customer && !customer.deleted && customer.email) {
          await prisma.user.updateMany({
            where: { email: customer.email },
            data: { tier: 'free' },
          }).catch(() => {});
          console.log('[webhook] paiement abandonné — downgrade:', customer.email);
        }
      }
    }
  }

  // ── Résiliation / expiration abonnement → downgrade ──
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const customer = await stripe.customers.retrieve(customerId).catch(() => null);
    if (customer && !customer.deleted && customer.email) {
      await prisma.user.updateMany({
        where: { email: customer.email },
        data: { tier: 'free' },
      }).catch(() => {});
      console.log('[webhook] abonnement résilié — downgrade:', customer.email);
    }
  }

  // ── Abonnement suspendu (Stripe Pause) → downgrade ──
  if (event.type === 'customer.subscription.paused') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const customer = await stripe.customers.retrieve(customerId).catch(() => null);
    if (customer && !customer.deleted && customer.email) {
      await prisma.user.updateMany({
        where: { email: customer.email },
        data: { tier: 'free' },
      }).catch(() => {});
      console.log('[webhook] abonnement suspendu — downgrade:', customer.email);
    }
  }

  // ── Reprise après suspension → upgrade ──
  if (event.type === 'customer.subscription.resumed') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const customer = await stripe.customers.retrieve(customerId).catch(() => null);
    if (customer && !customer.deleted && customer.email) {
      await prisma.user.updateMany({
        where: { email: customer.email },
        data: { tier: 'premium' },
      }).catch(() => {});
      console.log('[webhook] abonnement repris — upgrade:', customer.email);
    }
  }

  return NextResponse.json({ received: true });
}
