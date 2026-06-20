'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function isRealBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  // Explicit TikTok signals → NOT a real browser
  if (
    ua.includes('musical_ly') ||
    ua.includes('tiktok') ||
    ua.includes('bytedance') ||
    ua.includes('musical.ly') ||
    ua.includes('tt_webview') ||
    ua.includes('com.zhiliaoapp')
  ) return false;
  // Desktop browsers are real browsers — show quiz directly
  if (!/mobile|android|iphone|ipad/.test(ua)) return true;
  // On mobile: real browsers don't include "wv" WebView flag AND have full UA
  const isWebView = ua.includes(' wv)') || ua.includes(';wv)');
  return !isWebView;
}

export default function GoPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (isRealBrowser()) {
      router.replace('/quiz/personnalite');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div
      style={{
        background: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
      }}
    >
      {/* Arrow pointing to top-right ••• menu */}
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
              background: 'linear-gradient(135deg,#6f3318,#8a3e16)',
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
            <span>•</span>
            <span>50K+ utilisateurs</span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: 24,
          }}
        >
          Pour voir ton profil,<br />suis ces 2 étapes :
        </h1>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
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

        {/* Fallback for real browser users who land here anyway */}
        <button
          onClick={() => router.push('/quiz/personnalite')}
          style={{
            width: '100%',
            padding: '12px',
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
