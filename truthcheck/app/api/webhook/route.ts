import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { emailPremiumWelcome, emailAdminSale, sendEmail, ADMIN_NOTIF_EMAIL } from '@/lib/emails';
import { getSuivi } from '@/lib/suivi';
import { PLUS_PRICE_ID, STARTER_PRICE_ID, TIER_RANK } from '@/lib/plans';
import { checkAndRecordQuestCompletions } from '@/lib/quests';
import { recordSaleConversion } from '@/lib/recordSale';

// Upsert de tier qui ne rétrograde jamais un palier existant (ex: un abonné
// Plus qui rachète le 1,99€ one-shot par erreur reste 'plus').
async function upsertTierNoDowngrade(email: string, targetTier: string, extra: { name?: string | null } = {}) {
  const existing = await prisma.user.findUnique({ where: { email }, select: { tier: true } }).catch(() => null);
  const shouldSet = !existing || (TIER_RANK[targetTier] ?? 0) >= (TIER_RANK[existing.tier] ?? 0);
  await prisma.user.upsert({
    where: { email },
    create: { email, tier: targetTier, ...extra },
    update: shouldSet ? { tier: targetTier } : {},
  }).catch(() => {});
}

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

      // ── One-time MBTI purchase (1,99€ SANS abonnement) → 'unlocked' ──
      // Juste le résultat, à vie, PAS d'Elio (sinon on retombe dans l'ancienne
      // faille : payer 1,99€ une fois donnait tout un abonnement premium).
      // Le rapport complet (19,99€, meta.rapport) reste un vrai palier premium.
      if (email && meta.oneTime === 'true' && meta.typeCode && meta.rapport !== 'true') {
        await upsertTierNoDowngrade(email, 'unlocked');
      }

      // ── Subscription or rapport → upgrade user tier ──
      // plan:'starter' (1,99€/mois) → 'starter' ; plan:'plus' (5€) → 'plus' ; sinon 'premium'.
      if (email && (meta.annual === 'true' || session.mode === 'subscription' || meta.rapport === 'true')) {
        const tier = meta.plan === 'starter' ? 'starter' : meta.plan === 'plus' ? 'plus' : 'premium';
        await upsertTierNoDowngrade(email, tier);
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
            // Un upgrade de palier peut d'un coup rendre "vraies" des quêtes
            // Premium déjà accomplies en amont (ex: profil MBTI déjà fait) —
            // voir requiresPremium dans lib/quests.ts.
            await checkAndRecordQuestCompletions(user.id);
          }
        } catch (e) {
          console.error('Premium welcome email error:', e);
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

      // ── Commission affilié + notif admin + attribution (Conversion) ──
      // Partagé avec /success (voir lib/recordSale.ts) : le webhook Stripe
      // n'est pas le seul chemin fiable pour ces effets, donc les deux
      // appellent la même fonction, idempotente par stripeSessionId.
      await recordSaleConversion(session, email);
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
        const amount = invoice.amount_paid ?? 0;
        try {
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

        // ── LTV : le 1er paiement d'un abonnement est déjà tracé dans
        // Conversion via checkout.session.completed — sans cette ligne, tous
        // les renouvellements suivants (le vrai calcul de "combien ce compte
        // m'a rapporté au total") disparaissaient silencieusement. `invoice.id`
        // (jamais un `cs_...` de session checkout) sert de clé unique ici,
        // aucun risque de collision avec les lignes de premier paiement.
        if (customerEmail) {
          await prisma.conversion.upsert({
            where: { stripeSessionId: invoice.id },
            create: {
              stripeSessionId: invoice.id,
              email: customerEmail,
              amountCents: amount,
              productType: isPlus ? 'plus_renewal' : isStarter ? 'starter_renewal' : 'renewal',
            },
            update: {},
          }).catch(() => {});
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
