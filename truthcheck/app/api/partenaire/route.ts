import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const OWNER_EMAIL = 'nathabuisseness@gmail.com';

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
}

async function sendNotification(data: {
  name: string;
  email: string;
  platform: string;
  followers: string;
  content: string;
  slug: string;
}) {
  const html = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#09090b;color:#fff">
      <h2 style="color:#a78bfa;margin:0 0 16px">🔥 Nouveau partenaire affilié !</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#71717a;font-size:13px">Nom</td><td style="color:#fff;font-weight:700">${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;font-size:13px">Email</td><td style="color:#a78bfa">${data.email}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;font-size:13px">Plateforme</td><td style="color:#fff">${data.platform}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;font-size:13px">Followers</td><td style="color:#fff">${data.followers}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;font-size:13px">Type contenu</td><td style="color:#fff">${data.content}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;font-size:13px">Lien affilié</td><td style="color:#34d399;font-weight:700">urcecret.site/?ref=${data.slug}</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#18181b;border-radius:8px;border:1px solid #27272a">
        <p style="margin:0;color:#a1a1aa;font-size:13px">Dashboard : <a href="https://urcecret.site/affilie/${data.slug}" style="color:#a78bfa">urcecret.site/affilie/${data.slug}</a></p>
      </div>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'UrCecret <noreply@urcecret.site>',
      to: OWNER_EMAIL,
      subject: `🔥 Nouveau partenaire : ${data.name} (${data.platform}, ${data.followers})`,
      html,
    }),
  });
}

async function sendWelcome(data: { name: string; email: string; slug: string }) {
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#09090b;color:#fff">
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:900">
        Bienvenue dans le programme affilié <span style="color:#a78bfa">UrCecret</span> 🎉
      </h1>
      <p style="color:#71717a;font-size:15px;margin-bottom:32px">Voici tout ce dont tu as besoin pour commencer à gagner.</p>

      <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Ton lien affilié</p>
        <p style="margin:0;font-size:20px;font-weight:900;color:#a78bfa">urcecret.site/?ref=${data.slug}</p>
      </div>

      <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Ton dashboard (stats en temps réel)</p>
        <a href="https://urcecret.site/affilie/${data.slug}" style="color:#a78bfa;font-size:15px">urcecret.site/affilie/${data.slug}</a>
      </div>

      <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:32px">
        <p style="margin:0 0 12px;color:#fff;font-weight:700;font-size:15px">💡 Tips pour maximiser</p>
        <ul style="margin:0;padding-left:20px;color:#a1a1aa;font-size:14px;line-height:2">
          <li>Mentionne "test MBTI gratuit" → fort taux de clic</li>
          <li>Montre ton propre résultat dans la vidéo</li>
          <li>Format TikTok/Reel : 15-30 sec avec résultat en thumbnail</li>
          <li>Commission : <strong style="color:#34d399">80%</strong> sur chaque vente (1,99€ → 1,59€ pour toi)</li>
          <li>Après 2 mois consécutifs, la commission passe à <strong style="color:#a78bfa">30%</strong></li>
        </ul>
      </div>

      <p style="color:#52525b;font-size:13px;margin:0">Des questions ? Réponds directement à cet email.</p>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Nathanaël — UrCecret <noreply@urcecret.site>',
      to: data.email,
      subject: '🎉 Ton lien affilié UrCecret est prêt !',
      html,
    }),
  });
}

export async function POST(req: NextRequest) {
  const { name, email, platform, followers, content } = await req.json();

  if (!name || !email || !platform) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let attempt = 0;

  while (attempt < 10) {
    const existing = await prisma.affiliate.findUnique({ where: { slug } });
    if (!existing) break;
    attempt++;
    slug = `${baseSlug}${attempt}`;
  }

  const affiliate = await prisma.affiliate.create({
    data: { name, slug, email, commissionPct: 80 },
  });

  await Promise.allSettled([
    sendNotification({ name, email, platform, followers, content, slug }),
    sendWelcome({ name, email, slug }),
  ]);

  return NextResponse.json({ slug, affiliateLink: `https://urcecret.site/?ref=${slug}`, dashboardUrl: `https://urcecret.site/affilie/${slug}` });
}
