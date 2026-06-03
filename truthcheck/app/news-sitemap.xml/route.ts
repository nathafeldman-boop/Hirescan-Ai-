const BASE = 'https://urcecret.site';

const quizzes = [
  { slug: 'infidelite',       title: 'Mon/Ma partenaire me trompe ? — Quiz infidélité',      keywords: 'infidélité,trompe,partenaire,quiz,signaux,trahison,couple' },
  { slug: 'adopte',           title: 'Suis-je adopté(e) ? — Test origines familiales',        keywords: 'adoption,adopté,origines,famille,ADN,parents,naissance' },
  { slug: 'amoureux',         title: 'Suis-je vraiment amoureux/amoureuse ? — Quiz amour',    keywords: 'amoureux,amour,sentiments,coup de foudre,séduction,romantique' },
  { slug: 'vrais-amis',       title: 'Sont-ils mes vrais amis ? — Test amitié toxique',       keywords: 'amis,amitié,toxique,faux amis,confiance,relation amicale' },
  { slug: 'orientation',      title: 'Quelle est mon orientation sexuelle ? — Quiz identité', keywords: 'orientation sexuelle,bisexuel,gay,homosexualité,identité,LGBTQ' },
  { slug: 'narcissique',      title: 'Suis-je narcissique ? — Test personnalité narcissique', keywords: 'narcissique,narcissisme,personnalité,pervers narcissique,empathie' },
  { slug: 'mon-ex',           title: 'Mon ex veut-il/elle revenir ? — Quiz ex',               keywords: 'ex,retour,rupture,recollage,ex revient,reconquête' },
  { slug: 'manipule',         title: 'Suis-je manipulé(e) ? — Test manipulation émotionnelle',keywords: 'manipulation,manipulé,gaslighting,emprise,victime,contrôle' },
  { slug: 'rompre',           title: 'Dois-je rompre ? — Quiz rupture relation',              keywords: 'rompre,rupture,séparation,fin relation,quitter,couple' },
  { slug: 'jaloux',           title: 'Suis-je trop jaloux/jalouse ? — Test jalousie',         keywords: 'jalousie,jaloux,insécurité,confiance,possessif,couple' },
  { slug: 'relation-toxique', title: 'Ma relation est-elle toxique ? — Quiz toxicité',        keywords: 'relation toxique,toxic,emprise,violence psychologique,couple malsain' },
  { slug: 'crush',            title: 'Mon crush ressent-il/elle quelque chose ? — Quiz crush',keywords: 'crush,amour secret,séduction,signes,intérêt,flirter' },
  { slug: 'burnout',          title: 'Suis-je en burnout ? — Test épuisement professionnel',  keywords: 'burnout,épuisement,surmenage,travail,stress,fatigue chronique' },
  { slug: 'depression',       title: 'Ai-je des signes de dépression ? — Test santé mentale', keywords: 'dépression,symptômes,tristesse,santé mentale,moral,anxiété' },
  { slug: 'vrai-amour',       title: 'Est-ce le vrai amour ? — Quiz amour véritable',         keywords: 'vrai amour,amour véritable,âme sœur,relation saine,bonheur,couple' },
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
      <news:keywords>${q.keywords}</news:keywords>
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
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
