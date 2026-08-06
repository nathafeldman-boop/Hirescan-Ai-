'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const TT_PIXEL_ID   = process.env.NEXT_PUBLIC_TT_PIXEL_ID;
const GA_ID         = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
// ID public de la balise Google Ads (pas un secret : il apparaît de toute
// façon en clair dans le HTML une fois la balise posée) — pas besoin de
// passer par une variable d'env comme les autres pixels ci-dessus.
const GOOGLE_ADS_ID = 'AW-18185924200';

/* Fire TikTok page() + GA4 page_view + Meta PageView on soft navigations */
function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.ttq?.page();
    window.gtag?.('event', 'page_view', {
      page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
    });
    window.fbq?.('track', 'PageView');
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <>
      {/* ── Meta (Facebook) Pixel ── */}
      {META_PIXEL_ID && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');
              `,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <noscript><img height="1" width="1" style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          /></noscript>
        </>
      )}

      {/* ── TikTok Pixel ── */}
      {TT_PIXEL_ID && (
        <>
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;
e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
ttq.load("${TT_PIXEL_ID}");ttq.page();}(window,document,"ttq");
              `,
            }}
          />
          <RouteChangeTracker />
        </>
      )}

      {/* ── Google Analytics 4 ── */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_ID}',{page_path:window.location.pathname});
              `,
            }}
          />
          {!TT_PIXEL_ID && <RouteChangeTracker />}
        </>
      )}

      {/* ── Google Ads (balise de suivi des conversions) ── */}
      {/* gtag.js n'est chargé qu'une fois : si GA4 est déjà configuré
          ci-dessus, on réutilise son script et on ajoute juste un second
          gtag('config', ...) pour cet ID Ads. */}
      {!GA_ID && (
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
      )}
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GOOGLE_ADS_ID}');
          `,
        }}
      />

      {/* RouteChangeTracker for Meta when no TikTok/GA */}
      {META_PIXEL_ID && !TT_PIXEL_ID && !GA_ID && <RouteChangeTracker />}
    </>
  );
}
