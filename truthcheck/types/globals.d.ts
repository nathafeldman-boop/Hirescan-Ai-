interface Window {
  ttq?: {
    page: () => void;
    track: (event: string, props?: Record<string, unknown>) => void;
  };
  gtag?: (...args: unknown[]) => void;
  fbq?: (action: string, event: string, params?: Record<string, unknown>) => void;
}
