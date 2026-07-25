'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { getVisitorId } from '@/lib/visitorId';

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // document.referrer = d'où vient le visiteur (google, tiktok…) — reste
      // celui de l'arrivée sur le site pendant toute la navigation SPA.
      // visitorId manquait ici : sans lui, /api/admin comptait chaque page vue
      // comme un visiteur "unique" à part entière (voir buildSources côté
      // dashboard), gonflant artificiellement le nombre de visiteurs par source.
      body: JSON.stringify({ path: pathname, referrer: document.referrer || undefined, visitorId: getVisitorId() }),
    }).catch(() => {});

    // Parrainage : tente de rattacher le compte au parrain (cookie urs_invite).
    // No-op côté serveur si pas de cookie / pas connecté / déjà rattaché.
    // On ne marque "fait" qu'une fois traité connecté (reason:'unauthenticated'
    // = pas encore de session, on retentera à la prochaine navigation — ex.
    // juste après l'inscription). La route répond 200 dans tous les cas —
    // pas de vraie erreur HTTP pour un état aussi routinier qu'"anonyme".
    try {
      if (sessionStorage.getItem('_urs_ref_claimed') !== '1') {
        fetch('/api/referral/claim', { method: 'POST' })
          .then((r) => r.json())
          .then((d) => { if (d?.reason !== 'unauthenticated') sessionStorage.setItem('_urs_ref_claimed', '1'); })
          .catch(() => {});
      }
    } catch { /* sessionStorage indisponible — tant pis, le serveur reste idempotent */ }
  }, [pathname]);

  return null;
}
