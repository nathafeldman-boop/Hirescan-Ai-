const BASE = 'https://urcecret.site';

const quizzes = [
  { slug: 'auto-sabotage',    title: 'Est-ce que je me sabote sans m\'en rendre compte ? — Quiz auto-sabotage', keywords: 'auto-sabotage,procrastination,perfectionnisme,peur de réussir,développement personnel' },
  { slug: 'role-familial',    title: 'Quel rôle j\'ai appris à jouer dans ma famille ? — Test rôles familiaux', keywords: 'rôle familial,enfant intérieur,famille,systèmes familiaux,parentification' },
  { slug: 'amoureux',         title: 'Suis-je vraiment amoureux/amoureuse ? — Quiz amour',    keywords: 'amoureux,amour,sentiments,coup de foudre,séduction,romantique' },
  { slug: 'vrais-amis',       title: 'Sont-ils mes vrais amis ? — Test amitié toxique',       keywords: 'amis,amitié,toxique,faux amis,confiance,relation amicale' },
  { slug: 'intelligence-emotionnelle', title: 'Quel est mon niveau d\'intelligence émotionnelle ? — Quiz Goleman', keywords: 'intelligence émotionnelle,Goleman,empathie,gestion émotions,développement personnel' },
  { slug: 'narcissique',      title: 'Suis-je narcissique ? — Test personnalité narcissique', keywords: 'narcissique,narcissisme,personnalité,pervers narcissique,empathie' },
  { slug: 'tourner-la-page',  title: 'Ai-je vraiment tourné la page ? — Quiz deuil amoureux', keywords: 'tourner la page,rupture,deuil amoureux,rumination,reconstruction' },
  { slug: 'manipule',         title: 'Suis-je manipulé(e) ? — Test manipulation émotionnelle',keywords: 'manipulation,manipulé,gaslighting,emprise,victime,contrôle' },
  { slug: 'rompre',           title: 'Dois-je rompre ? — Quiz rupture relation',              keywords: 'rompre,rupture,séparation,fin relation,quitter,couple' },
  { slug: 'jaloux',           title: 'Suis-je trop jaloux/jalouse ? — Test jalousie',         keywords: 'jalousie,jaloux,insécurité,confiance,possessif,couple' },
  { slug: 'relation-toxique', title: 'Ma relation est-elle toxique ? — Quiz toxicité',        keywords: 'relation toxique,toxic,emprise,violence psychologique,couple malsain' },
  { slug: 'schema-amoureux',  title: 'Pourquoi je tombe toujours pour le même type de personne ? — Quiz schéma amoureux', keywords: 'schéma amoureux,répétition,attachement,pattern relationnel' },
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
        <news:name>UrCecret</news:name>
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
