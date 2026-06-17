'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/musical_ly|tiktok|bytedance|instagram|fbav|fban|snapchat|line|kakaotalk|wechat|micromessenger/i.test(ua)) return true;
  if (/android/i.test(ua) && / wv[);]/i.test(ua)) return true;
  if (/iphone|ipad/i.test(ua)) {
    const hasSafariVersion = /version\/[\d.]+.*safari/i.test(ua);
    if (!hasSafariVersion && !/crios\/|fxios\//i.test(ua)) return true;
  }
  return false;
}

export default function TikTokRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (isInAppBrowser()) router.replace('/quiz/personnalite');
  }, [router]);
  return null;
}
