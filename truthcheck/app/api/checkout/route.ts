import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

const ONE_TIME_PRODUCT_ID = 'prod_UcjiAfAioyc6WM';
const ONE_TIME_PRICE_CENTS = 199; // €1.99

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  try {
    const { resultId, quizSlug, score, origin, userEmail, oneTime } = await req.json();
    const baseUrl = origin || req.headers.get('origin') || 'http://localhost:3000';

    const cancelUrl = quizSlug && score !== undefined
      ? `${baseUrl}/quiz/${quizSlug}/results?score=${score}`
      : `${baseUrl}/quizzes`;

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&result=${resultId ?? ''}`;

    // ── One-time purchase: unlock just this result ──
    if (oneTime) {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'eur',
            product: ONE_TIME_PRODUCT_ID,
            unit_amount: ONE_TIME_PRICE_CENTS,
          },
          quantity: 1,
        }],
        allow_promotion_codes: true,
        ...(userEmail ? { customer_email: userEmail } : {}),
        metadata: { resultId: resultId ?? '', quizSlug: quizSlug ?? '', oneTime: 'true' },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return NextResponse.json({ url: session.url });
    }

    // ── Subscription ──
    const priceId = process.env.STRIPE_PRICE_ID;

    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'UrSecret Premium',
              description: 'Ton score + analyse complète personnalisée',
            },
            unit_amount: 499,
            recurring: { interval: 'month' as const },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [lineItem],
      allow_promotion_codes: true,
      ...(userEmail ? { customer_email: userEmail } : {}),
      metadata: { resultId: resultId ?? '', quizSlug: quizSlug ?? '' },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
