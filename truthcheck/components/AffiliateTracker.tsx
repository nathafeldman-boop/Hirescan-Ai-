'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
  const params = useSearchParams();

  useEffect(() => {
    const ref = params.get('ref');
    if (!ref || !/^[a-z0-9_-]{2,32}$/i.test(ref)) return;

    const key = `aff_clicked_${ref}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch { return; }

    fetch('/api/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: ref }),
    }).catch(() => {});
  }, [params]);

  return null;
}
