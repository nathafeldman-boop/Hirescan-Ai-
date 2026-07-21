'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // document.referrer = d'où vient le visiteur (google, tiktok…) — reste
      // celui de l'arrivée sur le site pendant toute la navigation SPA.
      body: JSON.stringify({ path: pathname, referrer: document.referrer || undefined }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
