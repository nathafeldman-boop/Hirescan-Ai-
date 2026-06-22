import { MetadataRoute } from 'next';

const BASE = 'https://urcecret.site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep private/admin/transactional surfaces out of the index.
        disallow: ['/api/', '/natha-admin', '/uc-board-n4th4', '/admin', '/success', '/login'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
