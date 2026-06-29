'use client';

import { useEffect, useState, useCallback } from 'react';

// Global gate for in-app browsers (TikTok, Instagram, Snapchat, …).
// In a social webview, payment & many features break — so instead of showing
// the funnel (which loses people), we show ONE screen: open in your browser.
// On a real browser this renders nothing and the site works normally.

function detectInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/musical_ly|tiktok|bytedance|trill|instagram|fbav|fban|snapchat|line|kakaotalk|wechat|micromessenger|weibo/i.test(ua)) return true;
  if (/android/i.test(ua) && / wv[);]/i.test(ua)) return true;
  if (/iphone|ipad/i.test(ua)) {
    const hasSafariVersion = /version\/[\d.]+.*safari/i.test(ua);
    if (!hasSafariVersion && !/crios\/|fxios\//i.test(ua)) return true;
  }
  return false;
}

export default function InAppGate() {
  const [inApp, setInApp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (detectInAppBrowser()) {
      setInApp(true);
      setIsIOS(/iphone|ipad/i.test(navigator.userAgent));
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const currentPath = useCallback(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname + window.location.search;
  }, []);

  const openInBrowser = useCallback(() => {
    const ua = navigator.userAgent;
    const path = currentPath();
    if (/android/i.test(ua)) {
      window.location.href = `intent://urcecret.site${path}#Intent;scheme=https;end`;
      return;
    }
    if (/iphone|ipad/i.test(ua)) {
      window.location.href = `x-safari-https://urcecret.site${path}`;
      return;
    }
    window.location.href = `https://urcecret.site${path}`;
  }, [currentPath]);

  const copyLink = useCallback(async () => {
    const url = `https://urcecret.site${currentPath()}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [currentPath]);

  if (!inApp) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2147483000,
        background: '#f7f3ec', color: '#2b2622',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 24px',
        fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes gateArrow { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
        @keyframes gateIn { from { opacity:0; transform: translateY(16px) } to { opacity:1; transform: translateY(0) } }
      `}</style>

      {/* Arrow pointing to the ••• menu (top-right of the webview) */}
      <div style={{ position: 'fixed', top: 8, right: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, animation: 'gateArrow 1.1s ease-in-out infinite' }}>
        <svg width="42" height="42" viewBox="0 0 36 36" fill="none">
          <path d="M6 30L30 6M30 6H14M30 6V22" stroke="#a94e18" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ background: '#a94e18', color: 'white', fontWeight: 800, fontSize: 12, padding: '6px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
          le menu ••• est ici
        </span>
      </div>

      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center', animation: 'gateIn .5s ease both' }}>

        {/* Brand */}
        <p style={{ fontFamily: 'var(--font-display), serif', fontWeight: 900, fontSize: 26, margin: '0 0 28px', letterSpacing: '-0.5px' }}>
          Ur<span style={{ color: '#a94e18' }}>Cecret</span>
        </p>

        <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.35, margin: '0 0 16px' }}>
          Pour accéder aux tests et à toutes les fonctionnalités,
          ouvre cette page dans ton navigateur :
        </p>

        {/* ── CTA hook above the tuto — gives them the WHY ── */}
        <div style={{ background: 'rgba(169,78,24,0.08)', border: '1px solid rgba(169,78,24,0.22)', borderRadius: 14, padding: '14px 16px', marginBottom: 22, textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1c1917', lineHeight: 1.4 }}>
            🔮 Ton profil de personnalité complet t&apos;attend
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#7a6f63', lineHeight: 1.45 }}>
            Ton type, pourquoi tu agis comme ça en amour &amp; au travail, ta face cachée — en 2 étapes ci-dessous 👇
          </p>
        </div>

        {/* 2 steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #ece2d4', borderRadius: 16, padding: '16px 18px' }}>
            <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: 'rgba(169,78,24,0.10)', color: '#a94e18', fontWeight: 900, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <span style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.3 }}>
              Appuie sur <strong>•••</strong> tout en haut à droite ↗
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '2px solid rgba(169,78,24,0.4)', borderRadius: 16, padding: '16px 18px', boxShadow: '0 4px 18px rgba(169,78,24,0.10)' }}>
            <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: 'rgba(169,78,24,0.10)', color: '#a94e18', fontWeight: 900, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            <span style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, color: '#a94e18' }}>
              {isIOS ? '« Ouvrir dans Safari »' : '« Ouvrir dans le navigateur »'}
            </span>
          </div>
        </div>

        {/* Try auto-open */}
        <button
          onClick={openInBrowser}
          style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: '#a94e18', color: 'white', fontSize: 15, fontWeight: 900, cursor: 'pointer', boxShadow: '0 6px 22px rgba(169,78,24,0.4)', marginBottom: 10 }}
        >
          ⚡ Essayer l&apos;ouverture automatique →
        </button>

        {/* Copy link fallback */}
        <button
          onClick={copyLink}
          style={{ width: '100%', padding: '12px', borderRadius: 14, background: 'transparent', border: '1px solid #d9cdbb', color: '#7a6f63', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          {copied ? '✓ Lien copié — colle-le dans ton navigateur' : '📋 Ou copie le lien'}
        </button>
      </div>
    </div>
  );
}
