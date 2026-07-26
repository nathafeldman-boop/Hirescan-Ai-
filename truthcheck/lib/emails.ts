const BASE = 'https://urcecret.site';

// Per-type emotional hook — mirrors the curiosity gap used on the paywall.
const HOOK_LINES: Record<string, string> = {
  INTJ: 'Pourquoi tu sembles froid(e) alors que tu ressens tout en profondeur',
  INTP: 'Pourquoi tu procrastines sur tes propres projets malgré ton intelligence',
  ENTJ: 'Pourquoi on te voit comme autoritaire quand tu veux juste être efficace',
  ENTP: 'Pourquoi tu t\'ennuies si vite — même avec les gens que tu aimes',
  INFJ: 'Pourquoi tu t\'épuises à tout porter pour les autres',
  INFP: 'Pourquoi tu te sens incompris(e) même par ceux qui t\'aiment',
  ENFJ: 'Pourquoi tu mets les autres avant toi jusqu\'à t\'oublier',
  ENFP: 'Pourquoi tu commences tout avec passion sans jamais finir',
  ISTJ: 'Pourquoi tu portes tout le monde sans que personne le remarque',
  ISFJ: 'Pourquoi tu dis oui quand tu veux dire non — encore et encore',
  ESTJ: 'Pourquoi on te trouve trop dur(e) quand tu veux juste aider',
  ESFJ: 'Pourquoi tu as besoin que tout le monde aille bien pour aller bien',
  ISTP: 'Pourquoi tu fuis dès que quelqu\'un s\'attache vraiment à toi',
  ISFP: 'Pourquoi tu n\'oses pas montrer ce que tu crées vraiment',
  ESTP: 'Pourquoi tu t\'ennuies dès que la relation devient sécurisante',
  ESFP: 'Pourquoi tu as besoin d\'attention pour te sentir vraiment aimé(e)',
};

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

// Code de connexion (OTP) — remplace le lien magique pour /login : un code à 6
// chiffres à saisir directement sur le site. Plus fiable sur mobile/in-app
// browser (pas de saut vers une autre appli/onglet qui casse la session).
export function emailLoginCode(code: string) {
  return {
    subject: `${code} — ton code de connexion UrCecret`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Connexion sécurisée</p>
      <h2 style="margin:0 0 20px;color:#fff;font-size:20px;font-weight:800">Voici ton code de connexion</h2>
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.25);border-radius:16px;padding:28px;text-align:center;margin-bottom:24px">
        <p style="margin:0;font-family:monospace;font-size:40px;font-weight:900;letter-spacing:0.25em;color:#fff">${code}</p>
      </div>
      <p style="margin:0 0 8px;color:#71717a;font-size:14px;line-height:1.7">
        Saisis ce code sur la page de connexion UrCecret. Il expire dans <strong style="color:#d17d52">10 minutes</strong> et ne fonctionne qu'une seule fois.
      </p>
      <p style="margin:16px 0 0;color:#52525b;font-size:12px">Si tu n'es pas à l'origine de cette demande, ignore simplement cet email.</p>
    `),
  };
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

// Broadcast — annonce à tous les inscrits : Nova, le Coach IA personnel + l'offre
// Starter 1,99€/mois (entrée la plus accessible). Ré-engagement honnête (pas de
// fausse urgence), centré sur la nouvelle valeur.
export function emailCoachAnnounce(name: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  return {
    subject: `${firstName}, ton Coach IA personnel est arrivé 🔮`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#c2611f;font-size:12px;text-transform:uppercase;letter-spacing:1px">✦ Nouveau sur UrCecret</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Nova, un coach qui te connaît déjà grâce à ton test.</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Hey ${firstName}, on vient de lancer quelque chose qu'on voulait te montrer : <strong style="color:#fff">Nova</strong>, ton Coach IA personnel. Elle n'est pas générique — elle connaît ton type MBTI et te répond d'après <em>ton</em> profil, pas des banalités.
      </p>
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;color:#c2611f;font-size:13px;font-weight:700">Ce que tu peux enfin lui demander :</p>
        <ul style="margin:0;padding-left:18px;color:#e4e4e7;font-size:14px;line-height:2">
          <li>❤️ Pourquoi tu reproduis le même schéma en amour</li>
          <li>💼 Comment te vendre en entretien sans te trahir</li>
          <li>💪 Reprendre confiance selon ton vrai fonctionnement</li>
          <li>🧠 Trancher une décision qui te bloque</li>
        </ul>
      </div>
      <p style="margin:0 0 8px;color:#71717a;font-size:15px;line-height:1.7">
        Tout ça dès <strong style="color:#fff">1,99 €/mois</strong> : ton profil complet débloqué + Nova (5 messages/jour). Résiliable en 1 clic, sans engagement.
      </p>
      ${cta('Découvrir Nova →', `${BASE}/quiz/personnalite`)}
      <p style="margin:4px 0 0;text-align:center;color:#71717a;font-size:13px">Déjà fait ton test ?</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:10px 0 4px">
          <a href="${BASE}/chat" style="display:inline-block;background:transparent;border:1px solid rgba(209,125,82,0.5);color:#d17d52;text-decoration:none;font-weight:700;font-size:14px;padding:12px 30px;border-radius:12px">Parler à Nova maintenant →</a>
        </td></tr>
      </table>
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:16px">
        <p style="margin:0;color:#52525b;font-size:12px">Une question ? Réponds directement à cet email.
          <a href="${BASE}/dashboard" style="color:#52525b">Gérer mes emails</a>.</p>
      </div>
    `),
  };
}

// Sent when a lead abandons the paywall. Purchase-focused. The type is
// intentionally NEVER named here (subject or body) — it stays locked behind
// payment, exactly like on the site. The internal ?pending= link param is
// not user-visible copy, just routing, so it's fine to keep.
export function emailResultReady(name: string | null, typeCode: string) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode.toUpperCase();
  return {
    subject: `${firstName}, ton profil est prêt 🔓`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Ton résultat est sauvegardé</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Ton type est déterminé, mais tu ne l'as pas encore vu.</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Ton profil complet t'attend : ton type exact, ta face cachée, ton schéma en amour, tes vraies forces et tes angles morts. La plupart des gens disent "c'est exactement moi" en le lisant.
      </p>
      <div style="background:rgba(209,125,82,0.08);border:1px solid rgba(209,125,82,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;color:#d17d52;font-size:14px;font-style:italic;line-height:1.7">
          "J'ai cru que ce serait bateau. En fait je me suis reconnu(e) dans chaque ligne."
        </p>
      </div>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Débloque ton profil complet, à partir de <strong style="color:#fff">1,99€</strong>, ou accès illimité à tout pour <strong style="color:#fff">9,99€/mois</strong>.
      </p>
      ${cta('Voir mon profil →', `${BASE}/quiz/personnalite?pending=${code}`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Paiement sécurisé · Accès immédiat · Satisfait ou remboursé 7 jours</p>
    `),
  };
}

export function emailDay1(name: string | null, typeCode?: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  const link = code ? `${BASE}/quiz/personnalite?pending=${code}` : `${BASE}/quiz/personnalite`;
  return {
    subject: `${firstName}, ton résultat t'attend encore 👀`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+1</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Ton profil est encore là…</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Hier tu as passé le test. Ton type est déterminé et ton analyse complète t'attend, mais la plupart des gens qui n'y reviennent pas dans 24h ne reviennent jamais.
      </p>
      <div style="background:rgba(209,125,82,0.08);border:1px solid rgba(209,125,82,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;color:#d17d52;font-size:14px;font-style:italic;line-height:1.7">
          "Je pensais que ce serait un quiz bateau. En fait j'ai pleuré en lisant mon analyse. C'était exactement ça."
        </p>
        <p style="margin:8px 0 0;color:#52525b;font-size:12px">Marie, 24 ans</p>
      </div>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Ton profil complet (amour, carrière, face cachée) : <strong style="color:#fff">1,99€</strong>. Une seule fois.
      </p>
      ${cta('Voir mon profil →', link)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Paiement sécurisé · Accès immédiat · Satisfait ou remboursé 7 jours</p>
    `),
  };
}

export function emailDay3(name: string | null, typeCode?: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  const link = code ? `${BASE}/quiz/personnalite?pending=${code}` : `${BASE}/quizzes`;
  return {
    subject: `${firstName}, 73% des gens avec ton profil ont été surpris 😳`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+3</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Ce que ton résultat dit sur toi</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        73% des personnes qui lisent leur analyse complète disent que ça a changé leur façon de voir une situation dans leur vie.
      </p>
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 12px;color:#c2611f;font-size:13px;font-weight:700">Ce que les gens découvrent dans leur profil :</p>
        <ul style="margin:0;padding-left:18px;color:#e4e4e7;font-size:14px;line-height:2.2">
          <li>Pourquoi tu te retrouves toujours dans le même schéma amoureux</li>
          <li>Ce que tu fais sans le savoir qui te sabote au travail</li>
          <li>Ta face cachée, celle que tu montres jamais</li>
          <li>Les types exactement compatibles avec toi</li>
        </ul>
      </div>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Ton analyse complète est encore disponible, <strong style="color:#fff">1,99€ une seule fois</strong>, accès à vie.
      </p>
      ${cta('Lire mon analyse complète →', link)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Paiement sécurisé · Satisfait ou remboursé 7 jours</p>
    `),
  };
}

export function emailDay7(name: string | null, typeCode?: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  const link = code ? `${BASE}/quiz/personnalite?pending=${code}` : `${BASE}/quizzes`;
  return {
    subject: `Dernier message, ${firstName}, ton résultat va expirer`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">J+7 · Dernier email</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Ta chance de savoir la vérité</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        C'est le dernier email que je t'envoie. Dans 24h, ton analyse est archivée.
      </p>
      <div style="background:rgba(209,125,82,0.08);border:1px solid rgba(209,125,82,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 4px;color:#d17d52;font-size:15px;font-weight:700">Ce que tu n'as pas encore vu :</p>
        <ul style="margin:8px 0 0;padding-left:18px;color:#e4e4e7;font-size:14px;line-height:2.1">
          <li>Ton schéma exact en amour, et pourquoi il se répète</li>
          <li>Ta carrière idéale selon ton type cognitif</li>
          <li>Ta face cachée (celle que même tes proches ne voient pas)</li>
          <li>Les types les plus compatibles avec toi, exactement</li>
        </ul>
      </div>
      <p style="margin:0 0 8px;color:#71717a;font-size:15px;line-height:1.7">
        Prix : <strong style="color:#fff">1,99€</strong> une seule fois. Moins qu'un café.
      </p>
      <p style="margin:0 0 24px;color:#52525b;font-size:13px;line-height:1.6">
        Ou accès illimité à tout UrCecret pour 9,99€/mois (résiliable en 1 clic).
      </p>
      ${cta('Débloquer maintenant →', link)}
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:16px">
        <p style="margin:0;color:#3f3f46;font-size:11px;text-align:center">Tu ne veux plus recevoir ces emails ? <a href="${BASE}/dashboard" style="color:#52525b">Se désabonner</a></p>
      </div>
    `),
  };
}

// Relance ponctuelle (broadcast admin) vers TOUS les inscrits qui n'ont pas
// encore débloqué leur profil — contrairement à emailDay1/3/7 (ancrés sur
// J+1/3/7 après inscription), celle-ci est générique et marche aussi bien
// pour quelqu'un inscrit il y a 1h que pour quelqu'un inscrit il y a 2 mois.
// Voir /api/admin/broadcast-unlock.
export function emailUnlockReminder(name: string | null, typeCode: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  const hook = code ? HOOK_LINES[code] : null;
  const link = code ? `${BASE}/quiz/personnalite?pending=${code}` : `${BASE}/quiz/personnalite`;
  return {
    subject: code ? `${firstName}, ton profil ${code} est toujours là 🔓` : `${firstName}, ton test t'attend encore 🔮`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Encore débloquable</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">
        ${code ? `Ton type ${code} est déterminé, mais tu ne l'as jamais vu.` : `Ton profil de personnalité t'attend.`}
      </h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        ${hook ? `On avait identifié un truc chez toi : <em style="color:#e4e4e7">"${hook}"</em>. Ça reste vrai ?` : `Ton analyse complète — amour, carrière, face cachée — n'est qu'à un clic.`}
      </p>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.7">
        Débloque ton profil complet dès <strong style="color:#fff">1,99€</strong> (une fois), ou avec Nova ton coach IA pour <strong style="color:#fff">1,99€/mois</strong>.
      </p>
      ${cta(code ? 'Voir mon profil →' : 'Faire mon test →', link)}
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:16px">
        <p style="margin:0;color:#52525b;font-size:12px;text-align:center">Paiement sécurisé · Satisfait ou remboursé 7 jours</p>
      </div>
    `),
  };
}

// Relance "reviens + abonne-toi" — vers tous les inscrits SANS abonnement actif
// (tier free ou unlocked, donc pas encore d'accès Nova). Contrairement à
// emailUnlockReminder (axée sur "voir ton profil pour 1,99€ une fois"), celle-ci
// pousse l'usage régulier (Nova, Journal) ET l'abonnement Starter comme porte
// d'entrée. Voir /api/admin/broadcast-winback.
export function emailWinBack(name: string | null, typeCode: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  const hook = code ? HOOK_LINES[code] : null;
  const link = code ? `${BASE}/quiz/personnalite?pending=${code}` : `${BASE}/quiz/personnalite`;
  return {
    subject: `${firstName}, Nova et ton profil t'attendent toujours 🔮`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">Ça fait un moment</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">
        ${hook ? `On avait vu juste chez toi : "${hook}"` : 'Ton profil de personnalité est toujours là.'}
      </h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Depuis ton inscription, on a ajouté <strong style="color:#fff">Nova</strong> (ton coach IA personnel) et un <strong style="color:#fff">Journal émotionnel</strong> qui suit ton évolution jour après jour. Les gens qui reviennent régulièrement disent que ça change vraiment leur façon de se comprendre.
      </p>
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;color:#c2611f;font-size:13px;font-weight:700">Ce que tu peux faire dès maintenant :</p>
        <ul style="margin:0;padding-left:18px;color:#e4e4e7;font-size:14px;line-height:2">
          <li>🔮 Poser une vraie question à Nova, ton coach IA</li>
          <li>📓 Noter ton humeur du jour dans ton Journal émotionnel</li>
          <li>💬 Faire analyser une conversation qui te trotte dans la tête</li>
        </ul>
      </div>
      <p style="margin:0 0 8px;color:#71717a;font-size:15px;line-height:1.7">
        Tout ça débloqué dès <strong style="color:#fff">1,99€/mois</strong> (offre Starter). Résiliable en un clic, sans engagement.
      </p>
      ${cta('Débloquer mon accès →', link)}
      <p style="margin:4px 0 0;text-align:center;color:#71717a;font-size:13px">Déjà abonné ?</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:10px 0 4px">
          <a href="${BASE}/chat" style="display:inline-block;background:transparent;border:1px solid rgba(209,125,82,0.5);color:#d17d52;text-decoration:none;font-weight:700;font-size:14px;padding:12px 30px;border-radius:12px">Parler à Nova maintenant →</a>
        </td></tr>
      </table>
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:16px">
        <p style="margin:0;color:#52525b;font-size:12px;text-align:center">Paiement sécurisé · Satisfait ou remboursé 7 jours</p>
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

// Sent immediately on premium purchase — includes day 1 suivi content.
export function emailPremiumWelcome(
  name: string | null,
  typeCode: string | null,
  jour1: { titre: string; conseil: string; exercice: string } | null,
) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  const suiviLink = code ? `${BASE}/suivi/${code.toLowerCase()}` : `${BASE}/quiz/personnalite`;

  return {
    subject: code
      ? `✦ Premium activé · Ton programme ${code} sur 15 jours commence aujourd'hui`
      : `✦ Accès Premium activé — ton programme personnalisé t'attend`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#c2611f;font-size:12px;text-transform:uppercase;letter-spacing:1px">✦ UrCecret Premium activé</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">
        ${firstName}, ton programme${code ? ` ${code}` : ''} sur 15 jours commence maintenant.
      </h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Chaque jour pendant 15 jours, tu reçois un conseil personnalisé${code ? ` pour ton type ${code}` : ''} — avec un exercice concret à appliquer tout de suite.
      </p>
      ${jour1 ? `
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.25);border-radius:14px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 4px;color:#c2611f;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px">Jour 1 · aujourd'hui</p>
        <h3 style="margin:0 0 12px;color:#fff;font-size:17px;font-weight:800">${jour1.titre}</h3>
        <p style="margin:0 0 16px;color:#a1a1aa;font-size:14px;line-height:1.75">${jour1.conseil}</p>
        <div style="background:rgba(255,255,255,0.04);border-left:3px solid #a94e18;padding:12px 16px;border-radius:0 8px 8px 0">
          <p style="margin:0 0 4px;color:#c2611f;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">⚡ Exercice du jour</p>
          <p style="margin:0;color:#e4e4e7;font-size:13px;line-height:1.65">${jour1.exercice}</p>
        </div>
      </div>` : `
      <div style="background:rgba(169,78,24,0.06);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0 0 6px;color:#c2611f;font-size:13px;font-weight:700">Pour activer ton programme 15 jours :</p>
        <p style="margin:0;color:#a1a1aa;font-size:13px;line-height:1.6">Fais d'abord le test MBTI (3 min) — ton programme sera personnalisé selon ton type.</p>
      </div>`}
      ${cta(code ? `Voir mon programme ${code} complet →` : 'Faire mon test MBTI →', suiviLink)}
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;margin-top:8px">
        <p style="margin:0;color:#52525b;font-size:12px">Tu recevras un conseil par jour pendant 15 jours. Des questions ? Réponds directement à cet email.</p>
      </div>
    `),
  };
}

// Sent daily for premium users — days 2–15 of their suivi program.
export function emailSuiviDay(
  name: string | null,
  typeCode: string,
  day: number,
  jour: { titre: string; conseil: string; exercice: string; phase: string },
) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode.toUpperCase();
  const suiviLink = `${BASE}/suivi/${code.toLowerCase()}`;
  const phaseLabel: Record<string, string> = {
    moi: 'Semaine 1 · Découverte de soi',
    relations: 'Semaine 2 · Tes relations',
    projet: 'Semaine 3 · Ton projet de vie',
  };

  return {
    subject: `Jour ${day} — ${jour.titre} · Programme ${code}`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:11px;text-transform:uppercase;letter-spacing:1px">${phaseLabel[jour.phase] ?? `Jour ${day}`} · Profil ${code}</p>
      <h2 style="margin:0 0 20px;color:#fff;font-size:22px;font-weight:800">Jour ${day} — ${jour.titre}</h2>
      <p style="margin:0 0 24px;color:#a1a1aa;font-size:15px;line-height:1.75">${jour.conseil}</p>
      <div style="background:rgba(169,78,24,0.06);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:18px 20px;margin-bottom:28px">
        <p style="margin:0 0 8px;color:#c2611f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">⚡ Exercice du jour</p>
        <p style="margin:0;color:#e4e4e7;font-size:14px;line-height:1.7">${jour.exercice}</p>
      </div>
      ${cta(`Voir mon programme ${code} →`, suiviLink)}
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;margin-top:8px">
        <p style="margin:0;color:#3f3f46;font-size:11px;text-align:center">Jour ${day}/15 · Programme personnalisé ${code} · <a href="${BASE}/dashboard" style="color:#52525b">Gérer mes emails</a></p>
      </div>
    `),
  };
}

// ── Notification admin : une vente ! ────────────────────────────────────────
// Envoyée à TOI (pas au client) à chaque paiement, personnalisée selon l'offre.
// L'adresse est surchargable via ADMIN_NOTIF_EMAIL dans Vercel.
export const ADMIN_NOTIF_EMAIL = process.env.ADMIN_NOTIF_EMAIL || 'nathabuisseness@gmail.com';

const SALE_FLAVORS: Record<string, { emoji: string; title: string; punch: string; color: string }> = {
  starter: {
    emoji: '🌱', color: '#34d399',
    title: 'Nouvel abonné STARTER — 1,99 €/mois',
    punch: '+1,99 € de MRR ! L\'offre d\'entrée récurrente fait son travail — prochaine étape : l\'upsell vers Plus.',
  },
  onetime: {
    emoji: '☕', color: '#d17d52',
    title: 'Déblocage 1,99 €',
    punch: 'Quelqu\'un vient de payer pour découvrir son profil. Le funnel TikTok → test → paywall fait son travail.',
  },
  plus: {
    emoji: '🔮', color: '#c2a24a',
    title: 'Nouvel abonné PLUS — 5 €/mois',
    punch: 'Le Coach IA a convaincu ! +5 € de MRR. Objectif : qu\'il parle à son coach cette semaine (les utilisateurs actifs ne résilient presque jamais).',
  },
  monthly: {
    emoji: '⭐', color: '#34d399',
    title: 'Nouvel abonné PREMIUM — 9,99 €/mois',
    punch: '+9,99 € de MRR. C\'est ton offre la plus rentable en récurrent — chouchoute-le.',
  },
  annual: {
    emoji: '👑', color: '#fbbf24',
    title: 'ABONNEMENT ANNUEL — 29,99 €',
    punch: '30 € cash, zéro churn pendant 12 mois. La meilleure vente possible. 🎉',
  },
  rapport: {
    emoji: '📜', color: '#a78bfa',
    title: 'Rapport complet — 19,99 €',
    punch: 'Gros panier one-shot — le rapport premium se vend.',
  },
};

export function emailAdminSale(opts: {
  productType: string;
  amountCents: number;
  buyerEmail: string | null;
  quizSlug?: string | null;
  utmSource?: string | null;
  affiliateSlug?: string | null;
  landingPath?: string | null;
  renewal?: boolean;
}) {
  const f = SALE_FLAVORS[opts.productType] ?? {
    emoji: '💰', color: '#d17d52', title: `Paiement — ${(opts.amountCents / 100).toFixed(2).replace('.', ',')} €`,
    punch: 'Nouvelle vente sur UrCecret.',
  };
  const amount = (opts.amountCents / 100).toFixed(2).replace('.', ',');
  const source = opts.affiliateSlug
    ? `Affilié : ${opts.affiliateSlug}`
    : opts.utmSource
      ? `Source : ${opts.utmSource}`
      : 'Source : organique / direct';
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 0;color:#71717a;font-size:13px;width:110px">${label}</td><td style="padding:4px 0;color:#e4e4e7;font-size:13px;font-weight:600">${value}</td></tr>`;

  return {
    subject: opts.renewal
      ? `♻️ Renouvellement ${amount} € — UrCecret`
      : `${f.emoji} ${f.title} — ça vient de payer !`,
    html: wrap(`
      <p style="margin:0 0 6px;color:${f.color};font-size:12px;text-transform:uppercase;letter-spacing:1px">${opts.renewal ? '♻️ Renouvellement' : '💸 Nouvelle vente'}</p>
      <h2 style="margin:0 0 8px;color:#fff;font-size:24px;font-weight:900">${f.emoji} ${amount} €</h2>
      <p style="margin:0 0 20px;color:#a1a1aa;font-size:14px;line-height:1.7">${opts.renewal ? 'Un abonné vient de renouveler — le MRR tient.' : f.punch}</p>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 18px;margin-bottom:20px">
        <table cellpadding="0" cellspacing="0" style="width:100%">
          ${row('Offre', f.title)}
          ${row('Client', opts.buyerEmail ?? 'inconnu')}
          ${opts.quizSlug ? row('Quiz', opts.quizSlug) : ''}
          ${row('Acquisition', source)}
          ${opts.landingPath ? row('Page d\'entrée', opts.landingPath) : ''}
        </table>
      </div>
      <p style="margin:0;color:#52525b;font-size:12px">Détails complets dans le <a href="${BASE}/admin" style="color:#71717a">dashboard admin</a> et sur Stripe.</p>
    `),
  };
}

// ── Rétention aux paliers M1 / M3 / M5 ──────────────────────────────────────
// Conseil growth : une grosse promesse + un paywall à l'entrée convertit, mais
// c'est la RÉTENTION aux points de décision (renouvellement) qui décide si le
// MRR tient. Ces 3 emails visent les moments où un abonné se demande "je garde
// ou j'arrête ?" — pas une relance de vente, un rappel de valeur + une raison
// concrète de rester. Envoyés une fois par abonné (voir cron email-sequence).
export function emailRetentionM1(name: string | null, typeCode: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  const hook = code ? HOOK_LINES[code] : null;
  return {
    subject: `${firstName}, ça fait 1 mois — voilà ce que tu peux faire avec Nova`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">1 mois avec UrCecret</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Tu as un coach qui te connaît. La plupart des gens l'oublient.</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        ${hook ? `On avait identifié un truc chez toi dès le début : <em style="color:#e4e4e7">"${hook}"</em>. Ça reste vrai un mois plus tard ?` : `Ton profil est débloqué depuis un mois — mais un profil qu'on relit une fois ne sert à rien.`}
      </p>
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;color:#d17d52;font-size:14px;font-style:italic;line-height:1.7">
          Pose-lui la vraie question du moment : une décision qui traîne, une relation qui coince, un choix de carrière. C'est fait pour ça — pas juste pour le jour où tu as payé.
        </p>
      </div>
      ${cta('Parler à Nova maintenant →', `${BASE}/chat`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Une question, un souci avec ton abonnement ? Réponds à cet email.</p>
    `),
  };
}

export function emailRetentionM3(name: string | null, typeCode: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  return {
    subject: `${firstName}, 3 mois — ce que ton profil ${code ?? ''} a changé (ou pas)`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">3 mois avec UrCecret</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">3 mois, c'est assez pour tester si ça marche vraiment.</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        Sois honnête avec toi-même : depuis ton test, tu as pris au moins une décision — au travail, en amour, ou avec toi-même — en te disant "ça, c'est mon profil qui parle". Si oui, Nova peut aller plus loin. Si non, c'est le moment de vraiment l'utiliser, pas de l'oublier.
      </p>
      <div style="background:rgba(169,78,24,0.08);border:1px solid rgba(169,78,24,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0 0 8px;color:#c2611f;font-size:13px;font-weight:700">Un truc que peu de gens font :</p>
        <p style="margin:0;color:#a1a1aa;font-size:14px;line-height:1.7">Invite un(e) ami(e) à faire le test avec ton lien perso (dans /chat) — s'il débloque son profil, tu gagnes des messages Nova en plus, à vie.</p>
      </div>
      ${cta('Voir mon lien de parrainage →', `${BASE}/chat`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Envie d'économiser sur ton abonnement ? <a href="${BASE}/pricing" style="color:#71717a">Regarde l'offre annuelle</a>.</p>
    `),
  };
}

export function emailRetentionM5(name: string | null, typeCode: string | null) {
  const firstName = name?.split(' ')[0] ?? 'toi';
  const code = typeCode?.toUpperCase() ?? null;
  return {
    subject: `${firstName}, 5 mois avec Nova — le bilan`,
    html: wrap(`
      <p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:1px">5 mois avec UrCecret</p>
      <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">On ne va pas te vendre autre chose. Juste te demander un truc.</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;line-height:1.7">
        5 mois, c'est long. Si Nova${code ? ` et ton profil ${code}` : ''} t'ont vraiment aidé, réponds à cet email et dis-nous comment — ça compte plus que n'importe quelle pub qu'on pourrait faire.
        Et si ça fait un moment que tu n'as pas ouvert le chat, c'est peut-être le signe qu'il faut y retourner : une bonne question suffit pour que ça reparte.
      </p>
      ${cta('Retourner parler à Nova →', `${BASE}/chat`)}
      <p style="margin:12px 0 0;color:#52525b;font-size:12px;text-align:center">Envie d'économiser sur ton abonnement ? <a href="${BASE}/pricing" style="color:#71717a">Regarde l'offre annuelle</a> · <a href="${BASE}/dashboard" style="color:#52525b">Gérer mon abonnement</a></p>
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
      reply_to: 'urcecretteam@gmail.com',
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
