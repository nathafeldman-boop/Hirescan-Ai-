const BASE = 'https://urcecret.site';

const quizzes = [
  { slug: 'infidelite',       title: 'Mon/Ma partenaire me trompe ?',            desc: "Détecte les signes d'infidélité — 30 questions anonymes pour analyser les comportements suspects dans ta relation." },
  { slug: 'adopte',           title: 'Suis-je adopté(e) ?',                       desc: "Indices physiques, comportementaux et familiaux — 30 questions pour explorer ton histoire familiale." },
  { slug: 'amoureux',         title: 'Suis-je vraiment amoureux/amoureuse ?',     desc: "Les signes qui ne trompent pas — 30 questions pour savoir si ce que tu ressens est de l'amour véritable." },
  { slug: 'vrais-amis',       title: 'Sont-ils mes vrais amis ?',                  desc: "Analyse ta relation amicale — 30 questions pour savoir si tes amis te veulent vraiment du bien." },
  { slug: 'orientation',      title: 'Quelle est mon orientation ?',               desc: "Explore ton identité — 30 questions anonymes sur ton orientation sexuelle et affective." },
  { slug: 'narcissique',      title: 'Suis-je narcissique ?',                      desc: "Traits de personnalité et empathie — 30 questions pour évaluer si tu présentes des traits narcissiques." },
  { slug: 'mon-ex',           title: 'Mon ex veut-il/elle revenir ?',              desc: "Analyse les signaux de ton ex — 30 questions pour décoder ses comportements et ses intentions." },
  { slug: 'manipule',         title: 'Suis-je manipulé(e) ?',                      desc: "Détecte la manipulation — 30 questions pour identifier si quelqu'un te manipule émotionnellement." },
  { slug: 'rompre',           title: 'Dois-je rompre ?',                           desc: "Analyse la santé de ta relation — 30 questions pour t'aider à décider si ta relation mérite d'être poursuivie." },
  { slug: 'jaloux',           title: 'Suis-je trop jaloux/jalouse ?',              desc: "Évalue ton niveau de jalousie — 30 questions pour savoir si ta jalousie est saine ou problématique." },
  { slug: 'relation-toxique', title: 'Ma relation est-elle toxique ?',              desc: "Évalue la santé de ta relation — 30 questions pour identifier des schémas toxiques." },
  { slug: 'crush',            title: 'Mon crush ressent-il/elle quelque chose ?',  desc: "Décrypte les signaux de ton crush — 30 questions pour savoir s'il/elle t'aime secrètement." },
  { slug: 'burnout',          title: 'Suis-je en burnout ?',                       desc: "Évalue ton épuisement professionnel — 30 questions pour identifier si tu es en burnout." },
  { slug: 'depression',       title: 'Ai-je des signes de dépression ?',           desc: "Évalue ton état mental — 30 questions pour identifier des signes qui méritent attention médicale." },
  { slug: 'vrai-amour',       title: 'Est-ce le vrai amour ?',                     desc: "Analyse tes sentiments — 30 questions pour savoir si tu vis un amour véritable et durable." },
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
    <author><name>UrCecret</name><uri>${BASE}</uri></author>
    <category term="quiz" label="Quiz"/>
    <category term="psychologie" label="Psychologie"/>
    <category term="relations" label="Relations"/>
  </entry>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="fr">
  <title>UrCecret — Test MBTI Gratuit &amp; Quiz Vérité Anonymes</title>
  <subtitle>Test de personnalité MBTI gratuit + 15 quiz anonymes sur l'infidélité, l'amour et tes amis</subtitle>
  <link href="${BASE}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${BASE}" rel="alternate" type="text/html"/>
  <link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
  <link href="https://pubsubhubbub.superfeedr.com/" rel="hub"/>
  <id>${BASE}/</id>
  <updated>${now}</updated>
  <author><name>UrCecret</name><uri>${BASE}</uri></author>
  <icon>${BASE}/favicon.svg</icon>
  <logo>${BASE}/favicon.svg</logo>
  <rights>© ${year} UrCecret</rights>
  <generator uri="${BASE}" version="1.0">UrCecret</generator>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
