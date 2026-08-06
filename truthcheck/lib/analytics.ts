/* Central analytics dispatcher — fires to TikTok Pixel, GA4, and internal DB */

import { getVisitorId } from './visitorId';

declare global {
  interface Window {
    ttq?: {
      track: (event: string, props?: Record<string, unknown>) => void;
      page: () => void;
      identify: (props: Record<string, unknown>) => void;
    };
    gtag?: (...args: unknown[]) => void;
    fbq?: (action: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export type AnalyticsEvent =
  | 'page_view'
  | 'quiz_start'
  | 'quiz_complete'
  | 'paywall_view'
  | 'checkout_click'
  | 'payment_success'
  | 'affiliate_click';

interface TrackProps {
  quiz?: string;           // quiz slug
  value?: number;          // monetary value in EUR
  currency?: string;
  content_name?: string;
  transactionId?: string;  // dedup key for ad-platform purchase conversions (e.g. Stripe session id)
  [key: string]: unknown;
}

// TikTok standard event mapping
const TT_EVENT: Record<AnalyticsEvent, string> = {
  page_view:       'ViewContent',
  quiz_start:      'Search',
  quiz_complete:   'SubmitForm',
  paywall_view:    'AddToCart',
  checkout_click:  'InitiateCheckout',
  payment_success: 'CompletePayment',
  affiliate_click: 'ViewContent',
};

// GA4 event name mapping
const GA_EVENT: Record<AnalyticsEvent, string> = {
  page_view:       'page_view',
  quiz_start:      'quiz_start',
  quiz_complete:   'quiz_complete',
  paywall_view:    'paywall_view',
  checkout_click:  'begin_checkout',
  payment_success: 'purchase',
  affiliate_click: 'affiliate_click',
};

// Label de conversion "Achat" fourni par Google Ads (compte nathafeldman@gmail.com,
// campagne "UrCecret test ads") — distinct de l'event GA4 'purchase' ci-dessus :
// sans ce 'send_to' précis, Google Ads ne compte jamais la vente comme
// conversion et la stratégie d'enchères ne peut pas optimiser dessus.
const GOOGLE_ADS_PURCHASE_LABEL = 'AW-18185924200/47sICO3QkN0cEOjc3N9D';

export function track(event: AnalyticsEvent, props: TrackProps = {}) {
  if (typeof window === 'undefined') return;
  try {
    // — TikTok Pixel
    window.ttq?.track(TT_EVENT[event], props);

    // — Google Analytics 4
    window.gtag?.('event', GA_EVENT[event], props);

    // — Google Ads conversion (achat réel uniquement — jamais une simple
    // inscription gratuite, sous peine de fausser l'algo d'enchères)
    if (event === 'payment_success') {
      window.gtag?.('event', 'conversion', {
        send_to: GOOGLE_ADS_PURCHASE_LABEL,
        value: props.value,
        currency: props.currency ?? 'EUR',
        transaction_id: props.transactionId ?? '',
      });
    }

    // — Internal DB (PageView table)
    const path = `/__evt/${event}${props.quiz ? `/${props.quiz}` : ''}`;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, visitorId: getVisitorId() }),
    }).catch(() => {});
  } catch {
    // never throw — tracking must not break the app
  }
}
