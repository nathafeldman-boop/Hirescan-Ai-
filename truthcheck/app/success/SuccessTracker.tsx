'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { track } from '@/lib/analytics';

export default function SuccessTracker() {
  const { update } = useSession();

  useEffect(() => {
    track('payment_success', { value: 1.99, currency: 'EUR', content_name: 'UrCecret Premium' });
    // Force session refresh so any already-logged-in user gets their premium tier
    // reflected immediately without having to sign out/in.
    update();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
