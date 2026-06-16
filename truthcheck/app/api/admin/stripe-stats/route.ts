import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'urcecret-admin-2026';

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  if (token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ mrr: 0, monthlyCount: 0, annualCount: 0, churnedLast30: 0, recentCharges: [] });
  }

  try {
    const stripe = new Stripe(key, { apiVersion: '2024-06-20' });

    const [subsRes, cancelledRes, chargesRes] = await Promise.all([
      stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.items.data.price'] }),
      stripe.subscriptions.list({
        status: 'canceled',
        limit: 100,
        created: { gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60 },
      }),
      stripe.charges.list({ limit: 15 }),
    ]);

    let mrr = 0;
    let monthlyCount = 0;
    let annualCount = 0;

    for (const sub of subsRes.data) {
      for (const item of sub.items.data) {
        const price = item.price;
        const amount = price.unit_amount ?? 0;
        if (price.recurring?.interval === 'month') {
          mrr += amount;
          monthlyCount++;
        } else if (price.recurring?.interval === 'year') {
          mrr += Math.round(amount / 12);
          annualCount++;
        }
      }
    }

    const churnedLast30 = cancelledRes.data.length;

    const recentCharges = chargesRes.data
      .filter(c => c.status === 'succeeded')
      .map(c => ({
        id: c.id,
        amount: c.amount,
        currency: c.currency,
        created: c.created,
        description: c.description,
        receiptEmail: c.receipt_email,
      }));

    return NextResponse.json({ mrr, monthlyCount, annualCount, churnedLast30, recentCharges });
  } catch {
    return NextResponse.json({ mrr: 0, monthlyCount: 0, annualCount: 0, churnedLast30: 0, recentCharges: [] });
  }
}
