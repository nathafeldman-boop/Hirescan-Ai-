'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics';

export default function SuccessTracker() {
  const { update } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const typeCode = params.get('typeCode')?.toUpperCase();

  useEffect(() => {
    track('payment_success', { value: 1.99, currency: 'EUR', content_name: 'UrCecret Premium' });
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
