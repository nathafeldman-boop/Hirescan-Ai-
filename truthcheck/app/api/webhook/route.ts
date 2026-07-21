import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { emailPremiumWelcome, emailAdminSale, sendEmail, ADMIN_NOTIF_EMAIL } from '@/lib/emails';
import { getSuivi } from '@/lib/suivi';
import { PLUS_PRICE_ID, STARTER_PRICE_ID } from '@/lib/plans';

export const dynamic = 'force-dynamic';

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
      // Normalisé en minuscules : NextAuth (EmailProvider) stocke les emails en
      // lowercase, mais Stripe renvoie l'email tel que saisi au checkout (casse
      // libre). Sans normalisation, upsert({where:{email}}) peut créer un
      // second compte "premium" fantôme au lieu de mettre à niveau le vrai
      // compte du client — paiement effectué mais accès jamais débloqué.
      const email = session.customer_details?.email?.toLowerCase().trim() ?? null;

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

      // ── One-time MBTI purchase → upgrade user tier ──
      if (email && meta.oneTime === 'true' && meta.typeCode) {
        await prisma.user.upsert({
          where: { email },
          create: { email, tier: 'premium' },
          update: { tier: 'premium' },
        }).catch(() => {});
      }

      // ── Subscription or rapport → upgrade user tier ──
      // plan:'starter' (1,99€) → 'starter' ; plan:'plus' (5€) → 'plus' ; sinon 'premium'.
      if (email && (meta.annual === 'true' || session.mode === 'subscription' || meta.rapport === 'true')) {
        const tier = meta.plan === 'starter' ? 'starter' : meta.plan === 'plus' ? 'plus' : 'premium';
        await prisma.user.upsert({
          where: { email },
          create: { email, tier },
          update: { tier },
        }).catch(() => {});
      }

      // ── Premium welcome email + suivi day 1 ──
      const isPremiumPurchase =
        email && (meta.annual === 'true' || session.mode === 'subscription' || meta.rapport === 'true' || (meta.oneTime === 'true' && !!meta.typeCode));
      if (isPremiumPurchase && email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, mbtiType: true },
          });
          if (user) {
            const alreadySent = await prisma.emailLog.findUnique({
              where: { userId_type: { userId: user.id, type: 'premium_welcome' } },
            });
            if (!alreadySent) {
              const typeCode = (meta.typeCode || user.mbtiType)?.toUpperCase() ?? null;
              const suivi = typeCode ? getSuivi(typeCode) : null;
              const jour1 = suivi?.jours[0] ?? null;
              const { subject, html } = emailPremiumWelcome(user.name, typeCode, jour1);
              await sendEmail(email, subject, html);
              await prisma.emailLog.create({ data: { userId: user.id, type: 'premium_welcome' } });
            }
          }
        } catch (e) {
          console.error('Premium welcome email error:', e);
        }
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

      // ── Parrainage : le filleul paie plus de 2 € → +3 messages/jour au parrain ──
      // Une seule fois par filleul (referralRewarded), plafonné à +15/jour.
      if (email && (session.amount_total ?? 0) >= 200) {
        try {
          const buyer = await prisma.user.findUnique({
            where: { email },
            select: { id: true, referredById: true, referralRewarded: true },
          });
          if (buyer?.referredById && !buyer.referralRewarded) {
            const inviter = await prisma.user.findUnique({
              where: { id: buyer.referredById },
              select: { chatBonusDaily: true },
            });
            if (inviter) {
              await prisma.$transaction([
                prisma.user.update({
                  where: { id: buyer.referredById },
                  data: { chatBonusDaily: Math.min((inviter.chatBonusDaily ?? 0) + 3, 15) },
                }),
                prisma.user.update({ where: { id: buyer.id }, data: { referralRewarded: true } }),
              ]);
            }
          }
        } catch (e) {
          console.error('Referral reward error:', e);
        }
      }

      // Type d'offre — sert à l'attribution ET à la notification vente.
      // 'plus' (5€) est distingué du mensuel 9,99€ via metadata.plan.
      const productType =
          meta.annual === 'true'          ? 'annual'
        : meta.rapport === 'true'         ? 'rapport'
        : meta.fusionGroupId              ? 'fusion'
        : meta.oneTime === 'true'         ? 'onetime'
        : session.mode === 'subscription' ? (meta.plan === 'starter' ? 'starter' : meta.plan === 'plus' ? 'plus' : 'monthly')
        : 'onetime';

      // ── Notification vente → email admin, personnalisé selon l'offre ──
      try {
        const { subject, html } = emailAdminSale({
          productType,
          amountCents: session.amount_total ?? 0,
          buyerEmail: email,
          quizSlug: meta.quizSlug || null,
          utmSource: meta.utmSource || null,
          affiliateSlug: meta.affiliateSlug || null,
          landingPath: meta.landingPath || null,
        });
        await sendEmail(ADMIN_NOTIF_EMAIL, subject, html);
      } catch (e) {
        console.error('Admin sale notif error:', e);
      }

      // ── Attribution complète — chaque paiement tracé avec sa source ──
      await prisma.conversion.upsert({
        where: { stripeSessionId: session.id },
        create: {
          stripeSessionId: session.id,
          email:           email ?? undefined,
          amountCents:     session.amount_total ?? 0,
          quizSlug:        meta.quizSlug     || undefined,
          productType,
          utmSource:       meta.utmSource    || undefined,
          utmMedium:       meta.utmMedium    || undefined,
          utmCampaign:     meta.utmCampaign  || undefined,
          utmContent:      meta.utmContent   || undefined,
          affiliateSlug:   meta.affiliateSlug || undefined,
          landingPath:     meta.landingPath  || undefined,
        },
        update: {},
      }).catch(() => {});
    }

    // ── Subscription renewal → maintient le bon palier ──
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail = typeof invoice.customer_email === 'string' ? invoice.customer_email.toLowerCase().trim() : null;
      // On lit le prix facturé pour attribuer le bon palier au renouvellement :
      // 5€ (price id) → plus · 1,99€ (montant) → starter · sinon premium.
      const isPlus = invoice.lines?.data?.some((l) => l.price?.id === PLUS_PRICE_ID) ?? false;
      const isStarter = !isPlus && (invoice.lines?.data?.some((l) => l.price?.id === STARTER_PRICE_ID || l.price?.unit_amount === 199) ?? false);
      if (customerEmail) {
        const tier = isPlus ? 'plus' : isStarter ? 'starter' : 'premium';
        await prisma.user.upsert({
          where: { email: customerEmail },
          create: { email: customerEmail, tier },
          update: { tier },
        }).catch(() => {});
      }

      // Notification renouvellement UNIQUEMENT (billing_reason 'subscription_cycle').
      // Le 1er paiement d'un abonnement est déjà notifié via checkout.session.completed.
      if (invoice.billing_reason === 'subscription_cycle') {
        try {
          const amount = invoice.amount_paid ?? 0;
          const { subject, html } = emailAdminSale({
            productType: isPlus ? 'plus' : isStarter ? 'starter' : amount >= 2500 ? 'annual' : 'monthly',
            amountCents: amount,
            buyerEmail: customerEmail,
            renewal: true,
          });
          await sendEmail(ADMIN_NOTIF_EMAIL, subject, html);
        } catch (e) {
          console.error('Admin renewal notif error:', e);
        }
      }
    }

    // ── Subscription cancelled → downgrade ──
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      const customer = await stripe.customers.retrieve(customerId).catch(() => null);
      if (customer && !customer.deleted) {
        const customerEmail = (customer as Stripe.Customer).email?.toLowerCase().trim();
        if (customerEmail) {
          await prisma.user.updateMany({
            where: { email: customerEmail },
            data: { tier: 'free' },
          }).catch(() => {});
        }
      }
    }

    // ── Subscription updated (plan change) → maintient le bon palier ──
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription;
      if (sub.status === 'active' || sub.status === 'trialing') {
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        const customer = await stripe.customers.retrieve(customerId).catch(() => null);
        if (customer && !customer.deleted) {
          const customerEmail = (customer as Stripe.Customer).email?.toLowerCase().trim();
          if (customerEmail) {
            const isPlus = sub.items?.data?.some((i) => i.price?.id === PLUS_PRICE_ID) ?? false;
            const isStarter = !isPlus && (sub.items?.data?.some((i) => i.price?.id === STARTER_PRICE_ID || i.price?.unit_amount === 199) ?? false);
            const tier = isPlus ? 'plus' : isStarter ? 'starter' : 'premium';
            await prisma.user.updateMany({
              where: { email: customerEmail },
              data: { tier },
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
        const customerEmail = typeof invoice.customer_email === 'string' ? invoice.customer_email.toLowerCase().trim() : null;
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
