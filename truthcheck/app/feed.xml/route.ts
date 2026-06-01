import { NextResponse } from 'next/server';

const BASE = 'https://ursecret.vercel.app';

const quizzes = [
  { slug: 'infidelite',       title: 'Mon/Ma partenaire me trompe ?',         desc: 'Détecte les signes d\'infidélité — 30 questions anonymes pour analyser les comportements suspects dans ta relation.' },
  { slug: 'adopte',           title: 'Suis-je adopté(e) ?',                   desc: 'Indices physiques, comportementaux et familiaux — 30 questions pour explorer ton histoire familiale.' },
  { slug: 'amoureux',         title: 'Suis-je amoureux/amoureuse ?',          desc: 'Les signes qui ne trompent pas — 30 questions pour savoir si ce que tu ressens est de l\'amour véritable.' },
  { slug: 'vrais-amis',       title: 'Sont-ils mes vrais amis ?',             desc: 'Analyse ta relation amicale — 30 questions pour savoir si tes amis te veulent vraiment du bien.' },
  { slug: 'orientation',      title: 'Quelle est mon orientation ?',          desc: 'Explore ton identité — 30 questions anonymes sur ton orientation sexuelle et affective.' },
  { slug: 'narcissique',      title: 'Suis-je narcissique ?',                 desc: 'Traits de personnalité et empathie — 30 questions pour évaluer si tu présentes des traits narcissiques.' },
  { slug: 'mon-ex',           title: 'Mon ex veut-il/elle revenir ?',         desc: 'Décrypte les signaux de ton ex — 30 questions pour savoir s\'il/elle veut renouer.' },
  { slug: 'manipule',         title: 'Suis-je manipulé(e) ?',                 desc: 'Détecte la manipulation — 30 questions pour identifier si quelqu\'un te manipule émotionnellement.' },
  { slug: 'rompre',           title: 'Dois-je rompre ?',                      desc: 'Analyse la santé de ta relation — 30 questions pour t\'aider à décider si ta relation mérite d\'être poursuivie.' },
  { slug: 'jaloux',           title: 'Suis-je trop jaloux/jalouse ?',         desc: 'Évalue ton niveau de jalousie — 30 questions pour savoir si ta jalousie est saine ou problématique.' },
  { slug: 'relation-toxique', title: 'Ma relation est-elle toxique ?',         desc: 'Évalue la santé de ta relation — 30 questions pour identifier des schémas toxiques.' },
  { slug: 'crush',            title: 'Mon crush ressent-il/elle quelque chose ?', desc: 'Décrypte les signaux de ton crush — 30 questions pour savoir s\'il/elle t\'aime secrètement.' },
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
    <title>UrSecret — Tes vraies réponses</title>
    <link>${BASE}</link>
    <description>Des questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille. 100% anonyme, résultats instantanés.</description>
    <language>fr</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
    <image>
      <url>${BASE}/favicon.svg</url>
      <title>UrSecret</title>
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
