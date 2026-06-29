import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = 'urcecret-admin-natha-2024';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  if (searchParams.get('secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = searchParams.get('email');
  const name = searchParams.get('name') ?? 'là';
  const typeCode = searchParams.get('type') ?? '';
  const resendKey = process.env.RESEND_API_KEY;

  if (!email) return NextResponse.json({ error: 'email requis' }, { status: 400 });
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY manquante' }, { status: 500 });

  // ── Mode "recovery" : relance d'un paiement échoué (carte refusée) ──
  // On ne ment pas (pas de "merci pour ton achat") — on propose l'option qui marche.
  if (searchParams.get('mode') === 'recovery') {
    const rec = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'UrCecret <noreply@urcecret.site>',
        to: email,
        subject: 'Ton profil MBTI t\'attend — accès simplifié 👀',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 20px;background:#ffffff;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="font-size:44px;margin-bottom:8px;">🔮</div>
              <h1 style="font-size:21px;font-weight:900;color:#1c1917;margin:0;">Ton paiement n'est pas passé</h1>
            </div>
            <p style="color:#44403c;font-size:15px;line-height:1.6;margin:0 0 18px;">
              Salut ${name},<br><br>
              J'ai vu que ton paiement d'hier soir a été refusé par ta banque — c'est très courant avec les abonnements récurrents, rien d'inquiétant.
            </p>
            <p style="color:#44403c;font-size:15px;line-height:1.6;margin:0 0 22px;">
              Pas besoin de t'embêter avec l'abonnement : tu peux débloquer ton profil complet en <strong>paiement unique de 1,99 €</strong> (pas d'abonnement, accès à vie). Ça passe avec Apple&nbsp;Pay / Google&nbsp;Pay en 10 secondes.
            </p>
            <div style="text-align:center;margin:26px 0;">
              <a href="https://urcecret.site/quiz/personnalite"
                style="display:inline-block;padding:16px 34px;background:linear-gradient(135deg,#a94e18,#d17d52);color:#ffffff;font-weight:800;font-size:15px;text-decoration:none;border-radius:14px;box-shadow:0 4px 18px rgba(169,78,24,0.35);">
                Débloquer mon profil — 1,99 € →
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #ece2d4;margin:22px 0;">
            <p style="color:#a8a29e;font-size:11px;text-align:center;margin:0;">UrCecret · Test MBTI · Réponds à cet email si besoin.</p>
          </div>
        `,
      }),
    });
    const recData = await rec.json().catch(() => ({}));
    if (!rec.ok) return NextResponse.json({ error: 'Resend error', data: recData }, { status: 500 });
    return NextResponse.json({ ok: true, mode: 'recovery', email, data: recData });
  }

  const profileUrl = typeCode
    ? `https://urcecret.site/types/${typeCode.toLowerCase()}`
    : 'https://urcecret.site/quiz/personnalite';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'UrCecret <noreply@urcecret.site>',
      to: email,
      subject: 'Ton profil MBTI est débloqué ✨',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 20px;background:#ffffff;">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:48px;margin-bottom:8px;">🔮</div>
            <h1 style="font-size:22px;font-weight:900;color:#111827;margin:0;">Ton accès premium est actif !</h1>
          </div>

          <p style="color:#374151;font-size:15px;line-height:1.6;margin-bottom:20px;">
            Bonjour ${name},<br><br>
            Merci pour ton achat sur <strong>UrCecret</strong>. Ton profil${typeCode ? ` <strong>${typeCode}</strong>` : ''} est maintenant entièrement débloqué.
          </p>

          <div style="text-align:center;margin:28px 0;">
            <a href="${profileUrl}"
              style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;border-radius:14px;box-shadow:0 4px 20px rgba(124,58,237,0.3);">
              Voir mon profil ${typeCode || 'MBTI'} →
            </a>
          </div>

          <p style="color:#6b7280;font-size:13px;line-height:1.6;margin-top:24px;">
            Pour accéder à ton profil depuis n'importe quel appareil, connecte-toi avec cette adresse email sur <a href="https://urcecret.site" style="color:#7c3aed;">urcecret.site</a>.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="color:#9ca3af;font-size:11px;text-align:center;margin:0;">
            UrCecret · Test MBTI gratuit<br>
            Si tu n'es pas à l'origine de cet achat, ignore cet email.
          </p>
        </div>
      `,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json({ error: 'Resend error', data }, { status: 500 });
  return NextResponse.json({ ok: true, email, data });
}
