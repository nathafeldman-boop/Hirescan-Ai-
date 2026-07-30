import { NextResponse } from 'next/server';

const BASE = 'https://urcecret.site';

const quizzes = [
  { slug: 'auto-sabotage',    title: 'Est-ce que je me sabote sans m\'en rendre compte ?', desc: 'Procrastination, perfectionnisme, peur de réussir — 30 questions pour repérer tes schémas d\'auto-sabotage.' },
  { slug: 'role-familial',    title: 'Quel rôle j\'ai appris à jouer dans ma famille ?', desc: 'Héros, médiateur, enfant invisible — 30 questions pour identifier le rôle que tu as adopté enfant.' },
  { slug: 'amoureux',         title: 'Suis-je amoureux/amoureuse ?',          desc: 'Les signes qui ne trompent pas — 30 questions pour savoir si ce que tu ressens est de l\'amour véritable.' },
  { slug: 'vrais-amis',       title: 'Sont-ils mes vrais amis ?',             desc: 'Analyse ta relation amicale — 30 questions pour savoir si tes amis te veulent vraiment du bien.' },
  { slug: 'intelligence-emotionnelle', title: 'Quel est mon niveau d\'intelligence émotionnelle ?', desc: 'Basé sur le modèle de Daniel Goleman — 30 questions pour évaluer ta conscience de toi, ton empathie et tes compétences sociales.' },
  { slug: 'narcissique',      title: 'Suis-je narcissique ?',                 desc: 'Traits de personnalité et empathie — 30 questions pour évaluer si tu présentes des traits narcissiques.' },
  { slug: 'tourner-la-page',  title: 'Ai-je vraiment tourné la page ?',       desc: 'Rumination, nostalgie, reconstruction — 30 questions pour comprendre où tu en es dans ton deuil amoureux.' },
  { slug: 'manipule',         title: 'Suis-je manipulé(e) ?',                 desc: 'Détecte la manipulation — 30 questions pour identifier si quelqu\'un te manipule émotionnellement.' },
  { slug: 'rompre',           title: 'Dois-je rompre ?',                      desc: 'Analyse la santé de ta relation — 30 questions pour t\'aider à décider si ta relation mérite d\'être poursuivie.' },
  { slug: 'jaloux',           title: 'Suis-je trop jaloux/jalouse ?',         desc: 'Évalue ton niveau de jalousie — 30 questions pour savoir si ta jalousie est saine ou problématique.' },
  { slug: 'relation-toxique', title: 'Ma relation est-elle toxique ?',         desc: 'Évalue la santé de ta relation — 30 questions pour identifier des schémas toxiques.' },
  { slug: 'schema-amoureux',  title: 'Pourquoi je tombe toujours pour le même type de personne ?', desc: 'Répétition, attachement — 30 questions pour identifier le schéma qui guide tes choix amoureux.' },
  { slug: 'burnout',          title: 'Suis-je en burnout ?',                  desc: 'Évalue ton épuisement professionnel — 30 questions pour identifier si tu es en burnout.' },
  { slug: 'depression',       title: 'Ai-je des signes de dépression ?',      desc: 'Évalue ton état mental — 30 questions pour identifier des signes qui méritent attention.' },
  { slug: 'vrai-amour',       title: 'Est-ce le vrai amour ?',                desc: 'Analyse tes sentiments — 30 questions pour savoir si tu vis un amour véritable et durable.' },
];

export async function GET() {
  const now = new Date().toUTCString();

  const items = quizzes.map((q) => `
    <item>
      <title><![CDATA[${q.title}]]></title>
      <link>${BASE}/quiz/${q.slug}</link>
      <guid isPermaLink="true">${BASE}/quiz/${q.slug}</guid>
      <description><![CDATA[${q.desc}]]></description>
      <pubDate>${now}</pubDate>
      <category>Quiz psychologique</category>
      <category>Relations</category>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>UrCecret — Test MBTI Gratuit &amp; Quiz Vérité Anonymes</title>
    <link>${BASE}</link>
    <description>Test de personnalité MBTI gratuit (16 types) + 15 quiz anonymes sur l'infidélité, l'amour et tes amis. Résultats instantanés, sans inscription.</description>
    <language>fr</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
    <image>
      <url>${BASE}/logo-oracle.png</url>
      <title>UrCecret</title>
      <link>${BASE}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
