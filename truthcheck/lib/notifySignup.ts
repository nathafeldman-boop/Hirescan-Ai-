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
import { emailWelcome, sendEmail, ADMIN_NOTIF_EMAIL } from './emails';

export async function notifyFirstSignIn(user: { id: string; email?: string | null; name?: string | null }): Promise<void> {
  if (!user.email) return;

  try {
    await prisma.emailLog.create({ data: { userId: user.id, type: 'welcome' } });
  } catch {
    // Contrainte unique userId+type déjà là → déjà notifié pour ce compte.
    return;
  }

  try {
    const { subject, html } = emailWelcome(user.name ?? null);
    await sendEmail(user.email, subject, html);
  } catch (e) {
    console.error('Welcome email failed:', e);
  }

  try {
    const count = await prisma.user.count();
    await sendEmail(
      ADMIN_NOTIF_EMAIL,
      `🆕 Nouveau compte UrCecret : ${user.name || user.email}`,
      `<div style="font-family:sans-serif;padding:24px;background:#09090b;color:#fff">
        <h2 style="color:#a78bfa;margin:0 0 12px">🆕 Nouveau compte</h2>
        <p style="color:#fff;margin:0 0 8px">${user.name ? `${user.name} (${user.email})` : user.email}</p>
        <p style="color:#71717a;margin:0">Le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')} · ${count} utilisateurs au total${count % 30 === 0 ? ' 🎉' : ''}</p>
      </div>`
    );
  } catch (e) {
    console.error('Admin new-signup notif failed:', e);
  }
}
