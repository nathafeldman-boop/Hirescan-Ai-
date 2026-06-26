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
      `<${BASE}/feed.xml>; rel="alternate"; type="application/rss+xml"; title="UrCecret RSS"`,
      `<${BASE}/atom.xml>; rel="alternate"; type="application/atom+xml"; title="UrCecret Atom"`,
      `<${BASE}/opensearch.xml>; rel="search"; type="application/opensearchdescription+xml"; title="UrCecret"`,
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

  // Affiliate tracking — ?ref= OR ?utm_campaign= → cookie 30 jours
  const ref = request.nextUrl.searchParams.get('ref')
    ?? request.nextUrl.searchParams.get('utm_campaign')
    ?? '';
  if (ref && /^[a-z0-9_-]{2,32}$/i.test(ref)) {
    response.cookies.set('urs_ref', ref.toLowerCase(), {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    });
  } else {
    // ── Self-healing attribution across the TikTok in-app → real browser handoff ──
    // The httpOnly cookie set in the TikTok WebView does NOT transfer to Safari/Chrome
    // when the user taps "open in browser" — only the URL survives. So if we already
    // have a ref cookie but this URL lost its ?ref= param, re-inject it into the URL.
    // This keeps the ref attached to whatever page the user opens in their real browser,
    // which then re-sets the cookie there + captures it in localStorage on the quiz page.
    const existingRef = request.cookies.get('urs_ref')?.value;
    const isFunnelPage = ['/', '/commencer'].includes(request.nextUrl.pathname)
      || request.nextUrl.pathname.startsWith('/quiz/');
    if (existingRef && /^[a-z0-9_-]{2,32}$/i.test(existingRef) && isFunnelPage) {
      const url = request.nextUrl.clone();
      url.searchParams.set('ref', existingRef);
      return NextResponse.redirect(url, 307);
    }
  }

  // UTM attribution — capture toutes les sources publicitaires dans un cookie JSON
  const utmSource   = request.nextUrl.searchParams.get('utm_source')   ?? '';
  const utmMedium   = request.nextUrl.searchParams.get('utm_medium')   ?? '';
  const utmCampaign = request.nextUrl.searchParams.get('utm_campaign') ?? '';
  const utmContent  = request.nextUrl.searchParams.get('utm_content')  ?? '';
  if (utmSource || utmMedium || utmCampaign) {
    const payload: Record<string, string> = {};
    if (utmSource)   payload.s  = utmSource;
    if (utmMedium)   payload.m  = utmMedium;
    if (utmCampaign) payload.c  = utmCampaign;
    if (utmContent)  payload.co = utmContent;
    payload.lp = request.nextUrl.pathname;
    response.cookies.set('urs_utm', JSON.stringify(payload), {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_next/webpack|favicon|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?)).*)'],
};
