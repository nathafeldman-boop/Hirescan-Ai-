import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.supabase_user_id
    if (!userId || !session.customer || !session.subscription) return NextResponse.json({ ok: true })

    await supabase.from('profiles').update({
      stripe_customer_id: session.customer as string,
    }).eq('id', userId)

    const sub = await stripe.subscriptions.retrieve(session.subscription as string)
    const priceId = sub.items.data[0]?.price.id

    const planMap: Record<string, string> = {
      [process.env.STRIPE_PRICE_WEEK!]: 'week',
      [process.env.STRIPE_PRICE_MONTH!]: 'month',
      [process.env.STRIPE_PRICE_YEAR!]: 'year',
    }

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: session.customer as string,
      stripe_price_id: priceId,
      plan: planMap[priceId ?? ''] ?? null,
      status: sub.status,
      current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
    }, { onConflict: 'user_id' })
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata?.supabase_user_id
    if (!userId) return NextResponse.json({ ok: true })

    await supabase.from('subscriptions').update({
      stripe_price_id: sub.items.data[0]?.price.id,
      status: sub.status,
      current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
    }).eq('user_id', userId)
  }

  return NextResponse.json({ ok: true })
}
