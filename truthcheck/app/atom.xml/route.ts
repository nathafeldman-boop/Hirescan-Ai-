const BASE = 'https://ursecret.vercel.app';

const quizzes = [
  { slug: 'infidelite',  title: 'Mon/Ma partenaire me trompe ?',       desc: "Détecte les signes d'infidélité — 30 questions anonymes pour analyser les comportements suspects dans ta relation." },
  { slug: 'adopte',      title: 'Suis-je adopté(e) ?',                  desc: "Indices physiques, comportementaux et familiaux — 30 questions pour explorer ton histoire familiale." },
  { slug: 'amoureux',    title: 'Suis-je vraiment amoureux/amoureuse ?', desc: "Les signes qui ne trompent pas — 30 questions pour savoir si ce que tu ressens est de l'amour véritable." },
  { slug: 'vrais-amis',  title: 'Sont-ils mes vrais amis ?',             desc: "Analyse ta relation amicale — 30 questions pour savoir si tes amis te veulent vraiment du bien." },
  { slug: 'orientation', title: 'Quelle est mon orientation ?',          desc: "Explore ton identité — 30 questions anonymes sur ton orientation sexuelle et affective." },
];

export function GET() {
  const now = new Date().toISOString();
  const year = new Date().getFullYear();

  const entries = quizzes.map((q) => `
  <entry>
    <title><![CDATA[${q.title}]]></title>
    <link href="${BASE}/quiz/${q.slug}" rel="alternate" type="text/html"/>
    <id>${BASE}/quiz/${q.slug}</id>
    <updated>${now}</updated>
    <summary type="html"><![CDATA[${q.desc}]]></summary>
    <author><name>UrSecret</name><uri>${BASE}</uri></author>
    <category term="quiz" label="Quiz"/>
    <category term="psychologie" label="Psychologie"/>
    <category term="relations" label="Relations"/>
  </entry>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="fr">
  <title>UrSecret — Tes vraies réponses</title>
  <subtitle>Des questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille</subtitle>
  <link href="${BASE}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${BASE}" rel="alternate" type="text/html"/>
  <link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
  <link href="https://pubsubhubbub.superfeedr.com/" rel="hub"/>
  <id>${BASE}/</id>
  <updated>${now}</updated>
  <author><name>UrSecret</name><uri>${BASE}</uri></author>
  <icon>${BASE}/favicon.svg</icon>
  <logo>${BASE}/favicon.svg</logo>
  <rights>© ${year} UrSecret</rights>
  <generator uri="${BASE}" version="1.0">UrSecret</generator>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
