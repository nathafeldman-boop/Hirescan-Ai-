const BASE = 'https://urcecret.site';

function wrap(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <tr><td align="center" style="padding-bottom:28px">
          <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:-1px">
            <span style="background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Ur</span><span style="color:#fff">Cecret</span>
          </h1>
        </td></tr>
        <tr><td style="background:#18181b;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px 32px">
          ${content}
        </td></tr>
        <tr><td align="center" style="padding-top:20px">
          <p style="margin:0;color:#3f3f46;font-size:12px">© UrCecret · <a href="${BASE}" style="color:#52525b;text-decoration:none">urcecret.site</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function cta(text: string, url: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:24px 0">
      <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px">${text}</a>
    </td></tr>
  </table>`;
}

export function emailWelcome(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: '✨ Bienvenue sur UrCecret !',
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Bienvenue 👋</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Hey ${firstName}, ton test MBTI t'attend !</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Découvre ton type de personnalité parmi les 16 profils MBTI — en 24 questions, résultat instantané.
      </p>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Et si tu veux aller plus loin : 15 quiz anonymes sur l'infidélité, les relations toxiques, l'amour véritable — des réponses honnêtes que personne ne te dira en face.
      </p>
      ${cta('Faire mon test MBTI →', `${BASE}/quiz/personnalite`)}
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;margin-top:8px">
        <p style="margin:0;color:#52525b;font-size:13px">Des questions ? Réponds directement à cet email.</p>
      </div>
    `),
  };
}

export function emailDay1(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: '🔍 Tu as découvert ton type MBTI ?',
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+1</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">${firstName}, une question rapide</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Tu as eu le temps de faire ton test MBTI hier ? Si non, c'est parti — ça prend 3 minutes.
      </p>
      <p style="margin:0 0 8px;color:#fff;font-size:15px;font-weight:700">Pourquoi ça vaut le coup :</p>
      <ul style="margin:0 0 24px;padding-left:20px;color:#71717a;font-size:14px;line-height:2.2">
        <li>Comprendre pourquoi tu réagis comme tu réagis</li>
        <li>Savoir avec qui tu es vraiment compatible</li>
        <li>Décoder les comportements des gens autour de toi</li>
      </ul>
      ${cta('Faire mon test MBTI gratuit →', `${BASE}/quiz/personnalite`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:13px;text-align:center">Aussi disponible : quiz sur l'infidélité, les relations toxiques, le burnout…</p>
    `),
  };
}

export function emailDay3(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: '🤫 Ce que 3 000 personnes ont découvert cette semaine',
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+3</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Les résultats qui choquent le plus</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Cette semaine, des milliers de personnes ont utilisé UrCecret pour obtenir des réponses honnêtes.
      </p>
      <div style="background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 12px;color:#a78bfa;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Les quiz les plus populaires</p>
        <ul style="margin:0;padding-left:20px;color:#e4e4e7;font-size:14px;line-height:2.2">
          <li>🧠 Test MBTI — "Je savais pas que j'étais INFJ"</li>
          <li>💔 Infidélité — résultat qui fait réfléchir</li>
          <li>🔥 Relation toxique — "Je me suis reconnu(e)"</li>
          <li>💡 Burnout — "J'aurais dû le faire plus tôt"</li>
        </ul>
      </div>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Débloquer ton résultat complet = 1,99€. Une seule fois, accès à vie.
      </p>
      ${cta('Voir tous les quiz →', `${BASE}/quizzes`)}
    `),
  };
}

export function emailDay7(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: '💜 Une dernière chose, ' + firstName,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+7</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Tu sais ce qui te bloque ?</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        La plupart des gens évitent les réponses honnêtes sur eux-mêmes — parce que la vérité peut faire peur.
      </p>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Nos quiz ne te diront pas ce que tu veux entendre. Ils te diront ce que tu <strong style="color:#fff">as besoin</strong> d'entendre.
      </p>
      <div style="background:rgba(244,114,182,0.08);border:1px solid rgba(244,114,182,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0;color:#f472b6;font-size:15px;font-style:italic;line-height:1.7">
          "J'ai fait le quiz relation toxique et j'ai finalement compris pourquoi je n'arrivais pas à partir."
        </p>
        <p style="margin:8px 0 0;color:#71717a;font-size:12px">— Utilisatrice anonyme</p>
      </div>
      ${cta('Obtenir mes réponses →', `${BASE}/quizzes`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Résultat complet à 1,99€ · Anonyme · Accès immédiat</p>
    `),
  };
}

export async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'UrCecret <noreply@urcecret.site>',
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
}
