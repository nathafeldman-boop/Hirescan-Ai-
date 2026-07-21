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

    // Parrainage : tente de rattacher le compte au parrain (cookie urs_invite).
    // No-op côté serveur si pas de cookie / pas connecté / déjà rattaché.
    // On ne marque "fait" qu'une fois traité connecté (401 = pas encore de session,
    // on retentera à la prochaine navigation — ex. juste après l'inscription).
    try {
      if (sessionStorage.getItem('_urs_ref_claimed') !== '1') {
        fetch('/api/referral/claim', { method: 'POST' })
          .then((r) => { if (r.status !== 401) sessionStorage.setItem('_urs_ref_claimed', '1'); })
          .catch(() => {});
      }
    } catch { /* sessionStorage indisponible — tant pis, le serveur reste idempotent */ }
  }, [pathname]);

  return null;
}
