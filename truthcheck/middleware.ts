import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE = 'https://urcecret.site';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Help every crawler discover sitemap, RSS feed, WebSub hub, and OpenSearch
  response.headers.set(
    'Link',
    [
      `<${BASE}/sitemap.xml>; rel="sitemap"`,
      `<${BASE}/news-sitemap.xml>; rel="sitemap"`,
      `<${BASE}/feed.xml>; rel="alternate"; type="application/rss+xml"; title="UrSecret RSS"`,
      `<${BASE}/atom.xml>; rel="alternate"; type="application/atom+xml"; title="UrSecret Atom"`,
      `<${BASE}/opensearch.xml>; rel="search"; type="application/opensearchdescription+xml"; title="UrSecret"`,
      `<https://pubsubhubbub.appspot.com/>; rel="hub"`,
      `<https://pubsubhubbub.superfeedr.com/>; rel="hub"`,
    ].join(', ')
  );

  // X-Robots-Tag to ensure all bots understand crawling is allowed
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large');

  // Security headers — improve Google trust score / Core Web Vitals quality signals
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_next/webpack|favicon|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?)).*)'],
};
