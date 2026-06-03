import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });

  const stripe = new Stripe(key, { apiVersion: '2024-06-20' });

  // Find existing Stripe customer or create one
  const list = await stripe.customers.list({ email: session.user.email, limit: 1 });
  const customerId = list.data.length > 0
    ? list.data[0].id
    : (await stripe.customers.create({ email: session.user.email })).id;

  const returnUrl = process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/quiz/personnalite`
    : 'https://urcecret.site/quiz/personnalite';

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return NextResponse.json({ url: portalSession.url });
}
