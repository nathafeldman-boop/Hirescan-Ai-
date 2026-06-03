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
  } catch {
    return NextResponse.json({ error: 'signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const resultId = session.metadata?.resultId;
    const customerId = session.customer as string | null;
    const email = session.customer_details?.email;

    // Mark the quiz result as paid
    if (resultId) {
      await prisma.quizResult.update({
        where: { id: resultId },
        data: { paid: true },
      }).catch(() => {});
    }

    // Upgrade user tier to premium
    if (email) {
      await prisma.user.updateMany({
        where: { email },
        data: { tier: 'premium' },
      }).catch(() => {});
    }

    // Record affiliate conversion
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

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    // Find customer email from Stripe and downgrade
    const customer = await stripe.customers.retrieve(customerId).catch(() => null);
    if (customer && !customer.deleted && customer.email) {
      await prisma.user.updateMany({
        where: { email: customer.email },
        data: { tier: 'free' },
      }).catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}
