'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect everyone — including TikTok in-app browser — directly to the quiz.
    // Stripe Checkout works in TikTok WebView; the post-payment redirect is handled
    // via the pre-loaded <a href> approach in the paywall (no window.open needed).
    router.replace('/quiz/personnalite');
  }, [router]);

  return null;
}
