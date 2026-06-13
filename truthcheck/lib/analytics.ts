/* Central analytics dispatcher — fires to TikTok Pixel, GA4, and internal DB */

declare global {
  interface Window {
    ttq?: {
      track: (event: string, props?: Record<string, unknown>) => void;
      page: () => void;
      identify: (props: Record<string, unknown>) => void;
    };
    gtag?: (...args: unknown[]) => void;
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

export function track(event: AnalyticsEvent, props: TrackProps = {}) {
  if (typeof window === 'undefined') return;
  try {
    // — TikTok Pixel
    window.ttq?.track(TT_EVENT[event], props);

    // — Google Analytics 4
    window.gtag?.('event', GA_EVENT[event], props);

    // — Internal DB (PageView table)
    const path = `/__evt/${event}${props.quiz ? `/${props.quiz}` : ''}`;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  } catch {
    // never throw — tracking must not break the app
  }
}
