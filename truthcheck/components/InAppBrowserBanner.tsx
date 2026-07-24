'use client';

import { useEffect, useState } from 'react';
import { detectInAppBrowser } from '@/lib/inAppBrowser';

// Bandeau affiché dès l'arrivée depuis un navigateur intégré (TikTok,
// Instagram...) — plutôt que de rafistoler chaque fonctionnalité qui casse
// dans ces webviews une par une (Google OAuth bloqué, parfois d'autres
// surprises), on demande directement d'ouvrir le lien dans le vrai
// navigateur : tout marche du premier coup, ailleurs on ne fait que limiter
// la casse. Fermable, ne réapparaît pas dans la session une fois fermé.
const DISMISS_KEY = '_urs_inapp_banner_dismissed';

export default function InAppBrowserBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!detectInAppBrowser()) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {}
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="sticky top-0 z-[60] flex items-center gap-3 px-4 py-2.5 text-center"
      style={{ background: '#131110', color: '#FAF6EC' }}
    >
      <p className="flex-1 text-[12px] leading-snug">
        📱 Pour que tout marche bien (connexion, paiement), ouvre ce lien dans ton navigateur : <strong>⋯</strong> en haut à droite → <strong>&quot;Ouvrir dans le navigateur&quot;</strong>
      </p>
      <button
        onClick={() => {
          setVisible(false);
          try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch {}
        }}
        aria-label="Fermer"
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        ✕
      </button>
    </div>
  );
}
