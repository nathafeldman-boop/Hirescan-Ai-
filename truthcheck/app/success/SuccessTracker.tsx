'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export default function SuccessTracker() {
  useEffect(() => {
    track('payment_success', { value: 1.99, currency: 'EUR', content_name: 'UrCecret Premium' });
  }, []);
  return null;
}
