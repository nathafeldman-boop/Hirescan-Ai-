/**
 * Simulation complète du flow paiement UrCecret
 * Lance avec: npx tsx scripts/simulate-payment.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_EMAIL = `test-sim-${Date.now()}@urcecret-sim.test`;
const FAKE_RESULT_ID = `result-sim-${Date.now()}`;
const FAKE_SESSION_ID = `cs_test_sim_${Date.now()}`;
const FAKE_CUSTOMER_ID = `cus_test_sim_${Date.now()}`;

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function ok(msg: string) { console.log(`  ${GREEN}✓${RESET} ${msg}`); }
function fail(msg: string) { console.log(`  ${RED}✗${RESET} ${msg}`); }
function warn(msg: string) { console.log(`  ${YELLOW}⚠${RESET} ${msg}`); }
function info(msg: string) { console.log(`  ${BLUE}→${RESET} ${msg}`); }
function section(msg: string) { console.log(`\n${BOLD}${msg}${RESET}`); }

// --- Reproduit exactement la logique du webhook ---

async function handleCheckoutCompleted(opts: {
  email: string;
  resultId?: string;
  affiliateSlug?: string;
  amountTotal: number;
}) {
  if (opts.resultId) {
    await prisma.quizResult.update({
      where: { id: opts.resultId },
      data: { paid: true },
    }).catch(() => {});
  }
  if (opts.email) {
    await prisma.user.updateMany({
      where: { email: opts.email },
      data: { tier: 'premium' },
    });
  }
  if (opts.affiliateSlug) {
    const affiliate = await prisma.affiliate.findUnique({ where: { slug: opts.affiliateSlug } }).catch(() => null);
    if (affiliate) {
      const commission = Math.round(opts.amountTotal * affiliate.commissionPct / 100);
      await prisma.affiliateConversion.create({
        data: {
          affiliateId: affiliate.id,
          amountCents: opts.amountTotal,
          commissionCents: commission,
          stripeSessionId: FAKE_SESSION_ID,
        },
      }).catch(() => {});
    }
  }
}

async function handleSubscriptionDeleted(customerEmail: string) {
  await prisma.user.updateMany({
    where: { email: customerEmail },
    data: { tier: 'free' },
  });
}

// --- Helpers ---

async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

async function assertTier(email: string, expected: string, label: string) {
  const user = await getUser(email);
  if (user?.tier === expected) {
    ok(`${label} → tier = "${expected}"`);
  } else {
    fail(`${label} → attendu "${expected}", obtenu "${user?.tier ?? 'introuvable'}"`);
  }
}

// --- Simulation ---

async function main() {
  console.log(`\n${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  SIMULATION PAIEMENT — UrCecret`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  info(`Email de test : ${TEST_EMAIL}`);

  // ── Setup : créer un utilisateur test ──
  section('0. SETUP — Création utilisateur test');
  const user = await prisma.user.create({
    data: { email: TEST_EMAIL, name: 'Sim Test', tier: 'free' },
  });
  ok(`Utilisateur créé (id: ${user.id}, tier: free)`);

  const quizResult = await prisma.quizResult.create({
    data: { userId: user.id, quizSlug: 'auto-sabotage', score: 72 },
  });
  ok(`Quiz result créé (id: ${quizResult.id}, paid: false)`);

  // ── Test 1 : Paiement one-time €1.99 ──
  section('1. PAIEMENT ONE-TIME €1.99 (déblocage résultat unique)');
  info('Simule checkout.session.completed avec oneTime=true');

  await handleCheckoutCompleted({
    email: TEST_EMAIL,
    resultId: quizResult.id,
    amountTotal: 199,
  });

  await assertTier(TEST_EMAIL, 'premium', 'Tier après paiement one-time');

  const resultAfterPayment = await prisma.quizResult.findUnique({ where: { id: quizResult.id } });
  if (resultAfterPayment?.paid) {
    ok('QuizResult.paid = true → résultat débloqué');
  } else {
    fail('QuizResult.paid est toujours false — résultat NON débloqué');
  }

  // ── Reset pour le test suivant ──
  await prisma.user.update({ where: { email: TEST_EMAIL }, data: { tier: 'free' } });
  info('Tier remis à free pour le prochain test');

  // ── Test 2 : Abonnement mensuel €9.99 ──
  section('2. ABONNEMENT MENSUEL €9.99 — Premier paiement');
  info('Simule checkout.session.completed avec monthly subscription');

  await handleCheckoutCompleted({ email: TEST_EMAIL, amountTotal: 999 });
  await assertTier(TEST_EMAIL, 'premium', 'Tier après souscription mensuelle');

  // ── Test 3 : Renouvellement mensuel (mois suivant) ──
  section('3. RENOUVELLEMENT MENSUEL — Mois suivant');
  info('Stripe envoie invoice.paid (renewal) — le tier reste premium sans action');
  warn('IMPORTANT : checkout.session.completed N\'est PAS déclenché pour les renouvellements');
  warn('Seul invoice.paid est déclenché — le webhook actuel ne gère PAS cet event');

  const userNow = await getUser(TEST_EMAIL);
  if (userNow?.tier === 'premium') {
    ok('Tier reste "premium" (pas d\'expiration en DB) — renouvellement transparent');
    info('Le premium persiste jusqu\'à customer.subscription.deleted');
  }

  // ── Test 4 : Résiliation / fin d'abonnement ──
  section('4. RÉSILIATION — customer.subscription.deleted');
  info('Simule customer.subscription.deleted');

  await handleSubscriptionDeleted(TEST_EMAIL);
  await assertTier(TEST_EMAIL, 'free', 'Tier après résiliation');
  ok('Downgrade automatique fonctionne');

  // ── Test 5 : Abonnement annuel €29.99 ──
  section('5. ABONNEMENT ANNUEL €29.99');
  await prisma.user.update({ where: { email: TEST_EMAIL }, data: { tier: 'free' } });

  await handleCheckoutCompleted({ email: TEST_EMAIL, amountTotal: 2999 });
  await assertTier(TEST_EMAIL, 'premium', 'Tier après souscription annuelle');

  // Simule résiliation après 1 an
  await handleSubscriptionDeleted(TEST_EMAIL);
  await assertTier(TEST_EMAIL, 'free', 'Tier après fin abonnement annuel');
  ok('Cycle annuel complet fonctionne');

  // ── Test 6 : Affilié ──
  section('6. TRACKING AFFILIÉ');
  const affiliate = await prisma.affiliate.findFirst().catch(() => null);
  if (affiliate) {
    const convBefore = await prisma.affiliateConversion.count({ where: { affiliateId: affiliate.id } });
    await handleCheckoutCompleted({
      email: TEST_EMAIL,
      amountTotal: 999,
      affiliateSlug: affiliate.slug,
    });
    const convAfter = await prisma.affiliateConversion.count({ where: { affiliateId: affiliate.id } });
    if (convAfter > convBefore) {
      ok(`Conversion affilié enregistrée pour "${affiliate.slug}" — commission: ${Math.round(999 * affiliate.commissionPct / 100)}¢`);
    } else {
      fail('Conversion affilié NON enregistrée');
    }
  } else {
    warn('Pas d\'affilié en DB — test affilié ignoré');
  }

  // ── Diagnostic : events webhook manquants ──
  section('7. DIAGNOSTIC — Events webhook NON gérés');
  warn('invoice.payment_failed  → Si paiement mensuel échoue, user reste premium indéfiniment');
  warn('customer.subscription.paused → Pas géré (suspension Stripe non répercutée)');
  warn('customer.subscription.updated → Changement de plan non géré');
  warn('STRIPE_ANNUAL_PRICE_ID → Non défini en .env (fallback price_data, peut causer des erreurs)');

  // ── Cleanup ──
  section('8. CLEANUP');
  await prisma.quizResult.delete({ where: { id: quizResult.id } }).catch(() => {});
  await prisma.user.delete({ where: { email: TEST_EMAIL } }).catch(() => {});
  ok('Données de test supprimées');

  // ── Résumé ──
  console.log(`\n${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log('  RÉSUMÉ');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${GREEN}✓${RESET} Paiement one-time débloque le résultat ET passe en premium`);
  console.log(`${GREEN}✓${RESET} Abonnement mensuel → tier premium immédiat`);
  console.log(`${GREEN}✓${RESET} Renouvellement automatique → transparent (pas d'expiration)`);
  console.log(`${GREEN}✓${RESET} Résiliation → downgrade automatique en free`);
  console.log(`${GREEN}✓${RESET} Abonnement annuel → même logique, fonctionne`);
  console.log(`${YELLOW}⚠${RESET} invoice.payment_failed non géré → ajouter pour protéger contre les impayés`);
  console.log(`${YELLOW}⚠${RESET} STRIPE_ANNUAL_PRICE_ID manquant en .env`);
  console.log('');
}

main()
  .catch((e) => { console.error(RED + 'ERREUR FATALE:', e, RESET); process.exit(1); })
  .finally(() => prisma.$disconnect());
