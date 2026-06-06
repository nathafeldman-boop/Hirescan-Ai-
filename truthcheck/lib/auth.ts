import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider, { SendVerificationRequestParams } from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';

async function sendVerificationRequest({ identifier: email, url }: SendVerificationRequestParams) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connexion UrCecret</title></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:32px">
          <h1 style="margin:0;font-size:32px;font-weight:900;letter-spacing:-1px">
            <span style="background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Ur</span><span style="color:#ffffff">Cecret</span>
          </h1>
        </td></tr>
        <!-- Card -->
        <tr><td style="background:#18181b;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 36px">
          <p style="margin:0 0 8px;color:#a1a1aa;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600">Connexion sécurisée</p>
          <h2 style="margin:0 0 16px;color:#ffffff;font-size:24px;font-weight:800;line-height:1.3">Ton lien de connexion est prêt ✨</h2>
          <p style="margin:0 0 32px;color:#71717a;font-size:15px;line-height:1.6">Clique sur le bouton ci-dessous pour te connecter à ton compte UrCecret. Ce lien expire dans <strong style="color:#a78bfa">10 minutes</strong>.</p>
          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:32px">
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:12px;letter-spacing:0.3px">
                Se connecter maintenant →
              </a>
            </td></tr>
          </table>
          <!-- Divider -->
          <div style="border-top:1px solid rgba(255,255,255,0.08);margin-bottom:24px"></div>
          <p style="margin:0 0 8px;color:#52525b;font-size:13px">Si le bouton ne fonctionne pas, copie ce lien :</p>
          <p style="margin:0;word-break:break-all"><a href="${url}" style="color:#a78bfa;font-size:12px;text-decoration:none">${url}</a></p>
        </td></tr>
        <!-- Footer -->
        <tr><td align="center" style="padding-top:24px">
          <p style="margin:0;color:#3f3f46;font-size:12px">Si tu n'as pas demandé ce lien, ignore cet email. · <a href="https://urcecret.site" style="color:#52525b;text-decoration:none">urcecret.site</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'UrCecret <noreply@urcecret.site>',
      to: email,
      subject: '🔐 Ton lien de connexion UrCecret',
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Resend error: ${error}`);
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    EmailProvider({
      from: 'noreply@ursecret.app',
      sendVerificationRequest,
    }),
  ],
  session: { strategy: 'database' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.rizzScore = (user as { rizzScore?: number }).rizzScore ?? 0;
        session.user.tier = (user as { tier?: string }).tier ?? 'free';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      // Si OAuth renvoie vers un domaine inattendu → quiz
      return `${baseUrl}/quiz/personnalite`;
    },
  },
};
