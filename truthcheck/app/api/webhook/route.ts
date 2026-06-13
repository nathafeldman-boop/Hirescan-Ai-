import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });

  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      const email = session.customer_details?.email ?? null;

      // ── Fusion group unlock ──
      if (meta.fusionGroupId) {
        await prisma.fusionGroup.update({
          where: { id: meta.fusionGroupId },
          data: { paid: true },
        }).catch(() => {});
      }

      // ── One-time quiz result unlock ──
      if (meta.oneTime === 'true' && meta.resultId) {
        await prisma.quizResult.update({
          where: { id: meta.resultId },
          data: { paid: true },
        }).catch(() => {});
      }

      // ── Subscription or rapport → upgrade user tier ──
      if (email && (meta.annual === 'true' || session.mode === 'subscription' || meta.rapport === 'true')) {
        await prisma.user.upsert({
          where: { email },
          create: { email, tier: 'premium' },
          update: { tier: 'premium' },
        }).catch(() => {});
      }

      // ── Affiliate conversion tracking ──
      if (meta.affiliateSlug && session.amount_total) {
        const affiliate = await prisma.affiliate.findUnique({
          where: { slug: meta.affiliateSlug },
        }).catch(() => null);
        if (affiliate) {
          const commissionCents = Math.round(session.amount_total * affiliate.commissionPct / 100);
          await prisma.affiliateConversion.upsert({
            where: { stripeSessionId: session.id },
            create: {
              affiliateId: affiliate.id,
              amountCents: session.amount_total,
              commissionCents,
              stripeSessionId: session.id,
            },
            update: {},
          }).catch(() => {});
        }
      }
    }

    // ── Subscription renewal → keep tier premium ──
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail = typeof invoice.customer_email === 'string' ? invoice.customer_email : null;
      if (customerEmail) {
        await prisma.user.upsert({
          where: { email: customerEmail },
          create: { email: customerEmail, tier: 'premium' },
          update: { tier: 'premium' },
        }).catch(() => {});
      }
    }

    // ── Subscription cancelled → downgrade ──
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      const customer = await stripe.customers.retrieve(customerId).catch(() => null);
      if (customer && !customer.deleted) {
        const customerEmail = (customer as Stripe.Customer).email;
        if (customerEmail) {
          await prisma.user.updateMany({
            where: { email: customerEmail },
            data: { tier: 'free' },
          }).catch(() => {});
        }
      }
    }

    // ── Subscription updated (plan change) → keep premium ──
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription;
      if (sub.status === 'active' || sub.status === 'trialing') {
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        const customer = await stripe.customers.retrieve(customerId).catch(() => null);
        if (customer && !customer.deleted) {
          const customerEmail = (customer as Stripe.Customer).email;
          if (customerEmail) {
            await prisma.user.updateMany({
              where: { email: customerEmail },
              data: { tier: 'premium' },
            }).catch(() => {});
          }
        }
      }
    }

    // ── Invoice payment failed → downgrade to free ──
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      // Only downgrade after final failed attempt (next_payment_attempt = null)
      if (invoice.next_payment_attempt === null) {
        const customerEmail = typeof invoice.customer_email === 'string' ? invoice.customer_email : null;
        if (customerEmail) {
          await prisma.user.updateMany({
            where: { email: customerEmail },
            data: { tier: 'free' },
          }).catch(() => {});
        }
      }
    }
  } catch {
    // Return 200 even on internal error so Stripe doesn't retry forever
  }

  return NextResponse.json({ received: true });
}
