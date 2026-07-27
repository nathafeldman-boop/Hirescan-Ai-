import { MetadataRoute } from 'next';

const BASE = 'https://urcecret.site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep private/admin/transactional surfaces out of the index.
        // Le hub (/decouverte) et les pages applicatives sont gated (compte
        // requis, voir GlobalTabBar.tsx) — inutile de laisser les robots les
        // crawler pour tomber sur une redirection /login.
        disallow: [
          '/api/', '/natha-admin', '/uc-board-n4th4', '/admin', '/success', '/login',
          '/decouverte', '/chat', '/journal', '/dashboard', '/profil-avance', '/compat',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
