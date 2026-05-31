import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  try {
    const { resultId, origin } = await req.json();
    const baseUrl = origin || req.headers.get('origin') || 'http://localhost:3000';

    const priceId = process.env.STRIPE_PRICE_ID;

    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'UrSecret Premium',
              description: 'Accès illimité à toutes tes analyses et résultats',
            },
            unit_amount: 499,
            recurring: { interval: 'month' as const },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [lineItem],
      allow_promotion_codes: true,
      metadata: { resultId: resultId ?? '' },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&result=${resultId ?? ''}`,
      cancel_url: `${baseUrl}/quiz/${resultId ?? ''}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
