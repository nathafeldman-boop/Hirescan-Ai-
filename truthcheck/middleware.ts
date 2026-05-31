import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE = 'https://ursecret.vercel.app';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Help every crawler discover sitemap, RSS feed, WebSub hub, and OpenSearch
  response.headers.set(
    'Link',
    [
      `<${BASE}/sitemap.xml>; rel="sitemap"`,
      `<${BASE}/feed.xml>; rel="alternate"; type="application/rss+xml"; title="UrSecret"`,
      `<${BASE}/opensearch.xml>; rel="search"; type="application/opensearchdescription+xml"; title="UrSecret"`,
      `<https://pubsubhubbub.appspot.com/>; rel="hub"`,
    ].join(', ')
  );

  // X-Robots-Tag to ensure all bots understand crawling is allowed
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_next/webpack|favicon|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?)).*)'],
};
