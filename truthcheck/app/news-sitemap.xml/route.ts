const BASE = 'https://ursecret.vercel.app';

const quizzes = [
  { slug: 'infidelite',      title: 'Mon/Ma partenaire me trompe ?' },
  { slug: 'adopte',          title: 'Suis-je adopté(e) ?' },
  { slug: 'amoureux',        title: 'Suis-je vraiment amoureux/amoureuse ?' },
  { slug: 'vrais-amis',      title: 'Sont-ils mes vrais amis ?' },
  { slug: 'orientation',     title: 'Quelle est mon orientation ?' },
  { slug: 'narcissique',     title: 'Suis-je narcissique ?' },
  { slug: 'mon-ex',          title: 'Mon ex veut-il/elle revenir ?' },
  { slug: 'manipule',        title: 'Suis-je manipulé(e) ?' },
  { slug: 'rompre',          title: 'Dois-je rompre ?' },
  { slug: 'jaloux',          title: 'Suis-je trop jaloux/jalouse ?' },
  { slug: 'relation-toxique', title: 'Ma relation est-elle toxique ?' },
  { slug: 'crush',           title: 'Mon crush ressent-il/elle quelque chose ?' },
  { slug: 'burnout',         title: 'Suis-je en burnout ?' },
  { slug: 'depression',      title: 'Ai-je des signes de dépression ?' },
  { slug: 'vrai-amour',      title: 'Est-ce le vrai amour ?' },
];

export function GET() {
  const today = new Date().toISOString().split('T')[0];

  const urls = quizzes.map((q) => `
  <url>
    <loc>${BASE}/quiz/${q.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>UrSecret</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${today}</news:publication_date>
      <news:title>${q.title}</news:title>
      <news:keywords>quiz,questionnaire,psychologie,relations,vérité</news:keywords>
    </news:news>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
