import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

const ONE_TIME_PRODUCT_ID  = 'prod_UcjiAfAioyc6WM';  // juste le résultat €1.99
const ANNUAL_PRODUCT_ID    = 'prod_UdST3jqJxR36mM';  // abonnement annuel €29.99
const MONTHLY_PRODUCT_ID   = 'prod_UdSUvUH7Y6iJXq';  // abonnement mensuel €9.99
const ONE_TIME_PRICE_CENTS = 199;   // €1.99
const ANNUAL_PRICE_CENTS   = 2999;  // €29.99/year
const RAPPORT_PRICE_CENTS  = 1999;  // €19.99 — rapport MBTI

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  try {
    const { resultId, quizSlug, score, origin, userEmail, oneTime, annual, rapport, typeCode } = await req.json();
    const affiliateSlug = req.cookies.get('urs_ref')?.value ?? '';
    const baseUrl = origin || req.headers.get('origin') || 'http://localhost:3000';

    const cancelUrl = quizSlug && score !== undefined
      ? `${baseUrl}/quiz/${quizSlug}/results?score=${score}`
      : typeCode
        ? `${baseUrl}/types/${typeCode.toLowerCase()}`
        : `${baseUrl}/quiz/personnalite`;

    const successUrl = typeCode
      ? `${baseUrl}/types/${typeCode.toLowerCase()}?unlocked=true&session_id={CHECKOUT_SESSION_ID}`
      : `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&result=${resultId ?? ''}`;

    // ── MBTI Rapport one-time ──
    if (rapport && typeCode) {
      const rapportSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Rapport Complet ${typeCode} — UrCecret`,
              description: `Analyse approfondie du type ${typeCode} : amour, carrière, forces, compatibilité`,
            },
            unit_amount: RAPPORT_PRICE_CENTS,
          },
          quantity: 1,
        }],
        allow_promotion_codes: true,
        ...(userEmail ? { customer_email: userEmail } : {}),
        metadata: { typeCode, rapport: 'true', affiliateSlug },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return NextResponse.json({ url: rapportSession.url });
    }

    // ── Annual subscription ──
    if (annual) {
      const annualPriceId = process.env.STRIPE_ANNUAL_PRICE_ID;
      const annualLineItem = annualPriceId
        ? { price: annualPriceId, quantity: 1 }
        : {
            price_data: {
              currency: 'eur',
              product: ANNUAL_PRODUCT_ID,
              unit_amount: ANNUAL_PRICE_CENTS,
              recurring: { interval: 'year' as const },
            },
            quantity: 1,
          };
      const annualSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [annualLineItem],
        allow_promotion_codes: true,
        ...(userEmail ? { customer_email: userEmail } : {}),
        metadata: { resultId: resultId ?? '', quizSlug: quizSlug ?? '', annual: 'true', affiliateSlug },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return NextResponse.json({ url: annualSession.url });
    }

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
        metadata: { resultId: resultId ?? '', quizSlug: quizSlug ?? '', oneTime: 'true', affiliateSlug },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return NextResponse.json({ url: session.url });
    }

    // ── Monthly subscription ──
    const lineItem = {
      price_data: {
        currency: 'eur',
        product: MONTHLY_PRODUCT_ID,
        unit_amount: 999,
        recurring: { interval: 'month' as const },
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [lineItem],
      allow_promotion_codes: true,
      ...(userEmail ? { customer_email: userEmail } : {}),
      metadata: { resultId: resultId ?? '', quizSlug: quizSlug ?? '', affiliateSlug },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
