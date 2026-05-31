import { NextResponse } from 'next/server';

const BASE = 'https://ursecret.vercel.app';

const quizzes = [
  { slug: 'infidelite', title: 'Mon/Ma partenaire me trompe ?', desc: 'Détecte les signes d\'infidélité — 30 questions anonymes pour analyser les comportements suspects dans ta relation.' },
  { slug: 'adopte',     title: 'Suis-je adopté(e) ?',          desc: 'Indices physiques, comportementaux et familiaux — 30 questions pour explorer ton histoire familiale.' },
  { slug: 'amoureux',   title: 'Suis-je amoureux/amoureuse ?', desc: 'Les signes qui ne trompent pas — 30 questions pour savoir si ce que tu ressens est de l\'amour véritable.' },
  { slug: 'vrais-amis', title: 'Sont-ils mes vrais amis ?',    desc: 'Analyse ta relation amicale — 30 questions pour savoir si tes amis te veulent vraiment du bien.' },
  { slug: 'orientation', title: 'Quelle est mon orientation ?', desc: 'Explore ton identité — 30 questions anonymes sur ton orientation sexuelle et affective.' },
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
