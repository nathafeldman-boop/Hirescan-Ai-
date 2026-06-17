'use client';

import { useEffect, useState } from 'react';

function detectInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;

  // Explicit social / in-app browser strings
  if (/musical_ly|tiktok|bytedance|instagram|fbav|fban|FBAN|FBAV|snapchat|line|kakaotalk|wechat|micromessenger|weibo/i.test(ua)) return true;

  // Android WebView — the " wv)" flag Chrome adds when embedded
  if (/android/i.test(ua) && / wv[);]/i.test(ua)) return true;

  // iOS WKWebView: AppleWebKit but no "Version/X.X Safari" string
  // Real Safari always has: "Version/17.x ... Safari/xxx"
  // CriOS = Chrome iOS (real browser), GSA = Google Search App (fine)
  if (/iphone|ipad/i.test(ua)) {
    const hasSafariVersion = /version\/[\d.]+.*safari/i.test(ua);
    const isChromeiOS = /crios\//i.test(ua);
    const isFirefoxiOS = /fxios\//i.test(ua);
    if (!hasSafariVersion && !isChromeiOS && !isFirefoxiOS) return true;
  }

  return false;
}

export default function InAppBrowserGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('_iab_ok');
      if (!dismissed && detectInAppBrowser()) {
        setShow(true);
      }
    } catch {
      // sessionStorage blocked — don't show overlay
    }
  }, []);

  function dismiss() {
    try { sessionStorage.setItem('_iab_ok', '1'); } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Arrow + badge pointing to top-right ••• menu */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M6 30L30 6M30 6H14M30 6V22" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div
          style={{
            background: '#0ea5e9',
            color: 'white',
            fontWeight: 700,
            fontSize: 14,
            padding: '8px 14px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
          }}
        >
          Appuie sur ••• ici
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: 24,
          padding: '32px 24px',
          width: '100%',
          maxWidth: 380,
          marginTop: 80,
        }}
      >
        {/* Logo + rating */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg,#4c1d95,#6d28d9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              marginBottom: 12,
            }}
          >
            🔮
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d1d5db', fontSize: 14 }}>
            <span style={{ color: '#fbbf24', letterSpacing: 2 }}>★★★★★</span>
            <span style={{ fontWeight: 700, color: 'white' }}>4.9</span>
            <span style={{ color: '#6b7280' }}>•</span>
            <span>50K+ utilisateurs</span>
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: 24,
            margin: '0 0 24px',
          }}
        >
          Pour voir ton profil,<br />suis ces 2 étapes :
        </h2>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div
            style={{
              background: '#262626',
              borderRadius: 14,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#3f3f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              1
            </div>
            <span style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 1.4 }}>
              Appuie sur <strong style={{ color: 'white' }}>•••</strong> en haut à droite
            </span>
          </div>

          <div
            style={{
              background: '#262626',
              borderRadius: 14,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#3f3f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              2
            </div>
            <span style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 1.4 }}>
              Puis appuie sur{' '}
              <strong style={{ color: '#0ea5e9' }}>« Ouvrir dans le navigateur »</strong>
            </span>
          </div>
        </div>

        {/* Fallback button */}
        <button
          onClick={dismiss}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: 12,
            background: 'transparent',
            border: '1px solid #3f3f46',
            color: '#71717a',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Déjà dans mon navigateur → Continuer
        </button>
      </div>
    </div>
  );
}
