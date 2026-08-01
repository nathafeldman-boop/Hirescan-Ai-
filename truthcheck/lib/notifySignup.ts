// ── Notification "nouveau compte" — un seul point d'envoi, quel que soit le
// chemin de création du compte (Google OAuth, code email, code d'accès,
// paiement Stripe sans compte préalable) ────────────────────────────────────
// Root cause d'un signalement réel (01/08) : le seul signal admin qui
// existait (l'ancien onUserCreated de lib/auth.ts) n'était câblé QUE sur
// events.createUser de NextAuth, qui ne se déclenche QUE pour la connexion
// Google (l'adaptateur Prisma crée alors la ligne User lui-même). L'email
// OTP (app/api/auth/verify-code), les codes d'accès
// (app/api/auth/redeem-code) et le paiement Stripe direct (app/success) ne
// passent JAMAIS par cet event — ils créent leur compte via un upsert Prisma
// direct — donc ni email de bienvenue, ni notif admin pour ces comptes-là.
//
// Idempotent via EmailLog (contrainte unique userId+type) plutôt que via
// User.createdAt : un compte peut être créé "à blanc" plus tôt (ex. capture
// d'email anonyme pendant un quiz, voir /api/save-email) puis seulement
// "activé" bien plus tard par une vraie connexion — EmailLog.sentAt capture
// le vrai moment d'activation, quel que soit l'ordre. La création de la
// ligne EmailLog sert aussi de verrou atomique : si un compte déclenche deux
// chemins de notification presque simultanément (ex. Google OAuth peut
// déclencher à la fois createUser ET signIn pour un compte tout neuf), la
// contrainte unique fait échouer le second appel proprement, un seul mail
// part.
import { prisma } from './db';

// Emails de bienvenue + notif admin désactivés le 01/08 (demande explicite :
// économiser le quota Resend) — voir git blame pour l'ancienne version qui
// envoyait les deux. On garde quand même la ligne EmailLog : c'est devenu la
// source de vérité des compteurs "nouveaux comptes" du dashboard admin
// (app/natha-admin/page.tsx, app/api/natha-admin/today/route.ts), qui lisent
// EmailLog.sentAt comme le vrai moment d'activation d'un compte — pas
// d'email envoyé, juste le marqueur.
export async function notifyFirstSignIn(user: { id: string; email?: string | null; name?: string | null }): Promise<void> {
  if (!user.email) return;
  await prisma.emailLog.create({ data: { userId: user.id, type: 'welcome' } }).catch(() => {
    // Contrainte unique userId+type déjà là → déjà marqué pour ce compte.
  });
}
