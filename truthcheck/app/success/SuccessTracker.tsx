'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics';

interface Props {
  paid: boolean;
  amountEur: number;
}

export default function SuccessTracker({ paid, amountEur }: Props) {
  const { update } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const typeCode = params.get('typeCode')?.toUpperCase();

  useEffect(() => {
    // Ne jamais envoyer "purchase" si le paiement Stripe n'a pas été vérifié
    // côté serveur (page.tsx / verifyAndUnlock) — sinon n'importe qui visitant
    // /success sans session Stripe valide gonfle le signal "purchase" envoyé
    // à TikTok/GA4, ce qui fausse l'optimisation des campagnes publicitaires.
    if (paid) {
      track('payment_success', { value: amountEur, currency: 'EUR', content_name: 'UrCecret Premium' });
    }
    // Clear the double-payment guard — purchase confirmed, future purchases allowed.
    try { localStorage.removeItem('_urs_co'); } catch {}

    // Refresh session so the new premium tier is reflected, then send user
    // directly to their unlocked profile page.
    update().then(() => {
      const dest = typeCode
        ? `/types/${typeCode.toLowerCase()}`
        : '/dashboard';
      setTimeout(() => router.replace(dest), 3500);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
