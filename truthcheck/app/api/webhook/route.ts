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
      try {
        await prisma.quizResult.update({ where: { id: resultId }, data: { paid: true } });
        console.log('[webhook] résultat marqué payé:', resultId);
      } catch (e) {
        console.error('[webhook] ERREUR mark paid resultId:', resultId, e);
        return NextResponse.json({ error: 'db_error' }, { status: 500 });
      }
    }

    if (email) {
      try {
        await prisma.user.updateMany({ where: { email }, data: { tier: 'premium' } });
        console.log('[webhook] user upgradé premium:', email);
      } catch (e) {
        console.error('[webhook] ERREUR upgrade tier email:', email, e);
        return NextResponse.json({ error: 'db_error' }, { status: 500 });
      }
    }

    const affiliateSlug = session.metadata?.affiliateSlug;
    if (affiliateSlug) {
      try {
        const affiliate = await prisma.affiliate.findUnique({ where: { slug: affiliateSlug } });
        if (affiliate) {
          const amountCents = session.amount_total ?? 0;
          const commissionPct = affiliate.commissionPct ?? 50;
          await prisma.affiliateConversion.create({
            data: {
              affiliateId: affiliate.id,
              amountCents,
              commissionCents: Math.round(amountCents * commissionPct / 100),
              stripeSessionId: session.id,
            },
          });
          console.log('[webhook] conversion affilié enregistrée:', affiliateSlug, amountCents);
        }
      } catch (e) {
        // Ne pas bloquer le webhook pour une erreur affilié (unique constraint = déjà enregistré)
        console.error('[webhook] erreur conversion affilié (ignorée):', affiliateSlug, e);
      }
    }
  }

  // ── Renouvellement mensuel/annuel réussi → confirme le premium ──
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    if (invoice.billing_reason === 'subscription_cycle') {
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (!customer.deleted && customer.email) {
            await prisma.user.updateMany({ where: { email: customer.email }, data: { tier: 'premium' } });
            console.log('[webhook] renouvellement confirmé pour:', customer.email);
          }
        } catch (e) {
          console.error('[webhook] ERREUR renouvellement invoice.paid:', customerId, e);
          return NextResponse.json({ error: 'db_error' }, { status: 500 });
        }
      }
    }
  }

  // ── Paiement de renouvellement échoué → downgrade après échec définitif ──
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    if (invoice.next_payment_attempt === null) {
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (!customer.deleted && customer.email) {
            await prisma.user.updateMany({ where: { email: customer.email }, data: { tier: 'free' } });
            console.log('[webhook] paiement abandonné — downgrade:', customer.email);
          }
        } catch (e) {
          console.error('[webhook] ERREUR payment_failed downgrade:', customerId, e);
        }
      }
    }
  }

  // ── Résiliation / expiration abonnement → downgrade ──
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        await prisma.user.updateMany({ where: { email: customer.email }, data: { tier: 'free' } });
        console.log('[webhook] abonnement résilié — downgrade:', customer.email);
      }
    } catch (e) {
      console.error('[webhook] ERREUR subscription.deleted:', customerId, e);
    }
  }

  if (event.type === 'customer.subscription.paused') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        await prisma.user.updateMany({ where: { email: customer.email }, data: { tier: 'free' } });
        console.log('[webhook] abonnement suspendu — downgrade:', customer.email);
      }
    } catch (e) {
      console.error('[webhook] ERREUR subscription.paused:', customerId, e);
    }
  }

  if (event.type === 'customer.subscription.resumed') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        await prisma.user.updateMany({ where: { email: customer.email }, data: { tier: 'premium' } });
        console.log('[webhook] abonnement repris — upgrade:', customer.email);
      }
    } catch (e) {
      console.error('[webhook] ERREUR subscription.resumed:', customerId, e);
    }
  }

  return NextResponse.json({ received: true });
}
