import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'urcecret-admin-natha-2024';

// Quick production config check so payment/email breakage is diagnosable in 2s.
// Visit: /api/admin/config-check?secret=urcecret-admin-natha-2024
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? '';
  const stripeMode = stripeKey.startsWith('sk_live_')
    ? 'LIVE ✅'
    : stripeKey.startsWith('sk_test_')
      ? 'TEST ⚠️ (les vraies cartes ne marchent PAS)'
      : 'MANQUANTE ❌';

  const checks = {
    stripeSecretKey: stripeMode,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'configuré ✅' : 'MANQUANT ❌ (webhooks échouent → pas de premium auto)',
    stripeAnnualPriceId: process.env.STRIPE_ANNUAL_PRICE_ID ? 'configuré ✅' : 'absent (fallback price_data utilisé — OK)',
    resendApiKey: process.env.RESEND_API_KEY ? 'configuré ✅' : 'MANQUANT ❌ (aucun email ne part)',
    nextauthUrl: process.env.NEXTAUTH_URL || 'MANQUANT ❌',
    databaseUrl: process.env.DATABASE_URL ? 'configuré ✅' : 'MANQUANT ❌',
  };

  const canSell = stripeKey.startsWith('sk_live_');
  const verdict = canSell
    ? '✅ Les paiements en LIVE sont possibles.'
    : '🚨 BLOQUANT : Stripe n\'est pas en mode LIVE — aucune vente réelle ne peut aboutir. Mets ta clé sk_live_ dans les variables Vercel puis redéploie.';

  return NextResponse.json({ verdict, checks }, { status: 200 });
}
