import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, groupId } = await req.json();
    if (!sessionId || !groupId) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });

    const stripe = new Stripe(key, { apiVersion: '2024-06-20' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 402 });
    }

    await prisma.fusionGroup.update({ where: { id: groupId }, data: { paid: true } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
