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
            <span style="background:linear-gradient(135deg,#d17d52,#a94e18);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Ur</span><span style="color:#fff">Cecret</span>
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
      <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#a94e18,#d17d52);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px">${text}</a>
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

// Sent when a lead abandons the paywall (we know their type). Purchase-focused.
export function emailResultReady(name: string | null, typeCode: string) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode.toUpperCase();
  return {
    subject: `${firstName}, ton profil ${code} est prêt 🔓`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Ton résultat est sauvegardé</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Tu es ${code} — mais tu n'as pas tout vu.</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Ton profil complet t'attend : ta face cachée, ton schéma en amour, tes vraies forces et tes angles morts. La plupart des gens disent "c'est exactement moi" en le lisant.
      </p>
      <div style="background:rgba(209,125,82,0.08);border:1px solid rgba(209,125,82,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;color:#d17d52;font-size:14px;font-style:italic;line-height:1.7">
          "J'ai cru que ce serait bateau. En fait je me suis reconnu(e) dans chaque ligne."
        </p>
      </div>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Débloque ton profil ${code} complet — à partir de <strong style="color:#fff">1,99€</strong>, ou accès illimité à tout pour <strong style="color:#fff">9,99€/mois</strong>.
      </p>
      ${cta(`Voir mon profil ${code} →`, `${BASE}/quiz/personnalite?pending=${code}`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Paiement sécurisé · Accès immédiat · Satisfait ou remboursé 7 jours</p>
    `),
  };
}

export function emailDay1(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: `${firstName}, ton résultat t'attend encore 👀`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+1</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Ton score est encore là…</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Hier tu as commencé. Ton résultat est sauvegardé — mais la plupart des gens qui n'y reviennent pas dans 24h ne reviennent jamais.
      </p>
      <div style="background:rgba(209,125,82,0.08);border:1px solid rgba(209,125,82,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;color:#d17d52;font-size:14px;font-style:italic;line-height:1.7">
          "Je pensais que ce serait un quiz bateau. En fait j'ai pleuré en lisant mon analyse. C'était exactement ça."
        </p>
        <p style="margin:8px 0 0;color:#52525b;font-size:12px">— Marie, 24 ans</p>
      </div>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Ton score exact + 10 points d'analyse détaillée = <strong style="color:#fff">1,99€</strong>. Une seule fois.
      </p>
      ${cta('Voir mon résultat complet →', `${BASE}/quiz/personnalite`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Paiement sécurisé · Accès immédiat · Anonyme</p>
    `),
  };
}

export function emailDay3(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: `${firstName}, 73% des gens avec ton profil ont été surpris 😳`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+3</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Ce que ton résultat dit sur toi</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        73% des personnes qui lisent leur analyse complète disent que ça a changé leur façon de voir une situation dans leur vie.
      </p>
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 12px;color:#c2611f;font-size:13px;font-weight:700">Ce que les gens découvrent :</p>
        <ul style="margin:0;padding-left:18px;color:#e4e4e7;font-size:14px;line-height:2.2">
          <li>🧠 "Je comprends enfin pourquoi je réagis comme ça"</li>
          <li>💔 "J'avais raison de me poser des questions"</li>
          <li>🔥 "Ça m'a aidé à prendre la décision que j'évitais"</li>
          <li>✨ "Je me suis reconnu(e) dans chaque ligne"</li>
        </ul>
      </div>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Ton analyse complète est encore disponible — <strong style="color:#fff">1,99€ une seule fois</strong>, accès à vie.
      </p>
      ${cta('Lire mon analyse complète →', `${BASE}/quizzes`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">+ accès à 15 quiz : infidélité, burnout, relations toxiques, amour…</p>
    `),
  };
}

export function emailDay7(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: `Dernier message, ${firstName} — ton résultat va expirer`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+7 · Dernier email</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Ta chance de savoir la vérité</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        C'est le dernier email que je t'envoie. Dans 24h, ton analyse est archivée et tu devras tout refaire.
      </p>
      <div style="background:rgba(209,125,82,0.08);border:1px solid rgba(209,125,82,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 4px;color:#d17d52;font-size:15px;font-weight:700">Ce que ${firstName} n'a pas encore vu :</p>
        <ul style="margin:8px 0 0;padding-left:18px;color:#e4e4e7;font-size:14px;line-height:2.1">
          <li>Son score exact (pas juste une fourchette)</li>
          <li>10 points d'analyse personnalisée</li>
          <li>Ce que ses réponses révèlent sur sa situation</li>
          <li>Les conseils concrets adaptés à son profil</li>
        </ul>
      </div>
      <p style="margin:0 0 8px;color:#71717a;font-size:15px;line-height:1.7">
        Prix : <strong style="color:#fff">1,99€</strong> une seule fois. Moins qu'un café.
      </p>
      <p style="margin:0 0 24px;color:#52525b;font-size:13px;line-height:1.6">
        Si tu préfères l'abonnement mensuel (9,99€/mois), tu as accès à tous les quiz + résultats à vie.
      </p>
      ${cta('Débloquer avant expiration →', `${BASE}/quizzes`)}
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:16px">
        <p style="margin:0;color:#3f3f46;font-size:11px;text-align:center">Tu ne veux plus recevoir ces emails ? <a href="${BASE}/dashboard" style="color:#52525b">Se désabonner</a></p>
      </div>
    `),
  };
}

export function emailPurchaseConfirm(name: string | null, type: 'onetime' | 'monthly' | 'annual' | 'rapport', typeCode?: string) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const isSubscription = type === 'monthly' || type === 'annual';
  const isRapport = type === 'rapport';

  const headline = isRapport
    ? `Ton rapport ${typeCode ?? 'MBTI'} est débloqué 🔓`
    : isSubscription
      ? 'Accès UrCecret Premium activé 🔓'
      : 'Ton résultat est débloqué 🔓';

  const body = isRapport
    ? `Ton rapport complet <strong style="color:#fff">${typeCode ?? 'MBTI'}</strong> est maintenant disponible — personnalité, amour, carrière, forces et compatibilité.`
    : isSubscription
      ? `Ton accès <strong style="color:#fff">UrCecret Premium</strong> est actif. Tu as maintenant accès à tous les quiz et à chacun de tes résultats en détail, sans limite.`
      : `Ton résultat complet est maintenant disponible — score exact, analyse IA en 10 points et ce que tes réponses révèlent vraiment.`;

  const link = typeCode ? `${BASE}/types/${typeCode.toLowerCase()}` : `${BASE}/quizzes`;
  const ctaText = typeCode ? `Voir mon rapport ${typeCode} →` : 'Accéder à mes résultats →';

  return {
    subject: `✅ ${isRapport ? 'Rapport' : isSubscription ? 'Accès Premium' : 'Résultat'} débloqué — UrCecret`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Confirmation d'achat</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">${firstName}, ${headline}</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">${body}</p>
      ${isSubscription ? `
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0 0 8px;color:#c2611f;font-size:13px;font-weight:700">Ce que tu peux faire maintenant :</p>
        <ul style="margin:0;padding-left:18px;color:#e4e4e7;font-size:14px;line-height:2.1">
          <li>Voir ton score exact sur tous tes quiz</li>
          <li>Accéder à l'analyse complète de chaque résultat</li>
          <li>Faire le test de compatibilité duo avec quelqu'un</li>
        </ul>
      </div>` : ''}
      ${cta(ctaText, link)}
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:8px">
        <p style="margin:0;color:#52525b;font-size:12px">Une question ? Réponds directement à cet email · Paiement sécurisé par Stripe</p>
      </div>
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
