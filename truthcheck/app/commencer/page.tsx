'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

function detectInAppBrowser(): boolean {
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

const TARGET_PATH = '/quiz/personnalite';

export default function CommencerPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Build destination URL, preserving affiliate ref.
  const buildUrl = useCallback((scheme: 'https' | 'safari') => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const qs = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    const host = 'urcecret.site';
    if (scheme === 'safari') return `x-safari-https://${host}${TARGET_PATH}${qs}`;
    return `https://${host}${TARGET_PATH}${qs}`;
  }, []);

  // One-tap: force-open the system browser (Chrome on Android, Safari on iOS).
  const openInBrowser = useCallback(() => {
    const ua = navigator.userAgent;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const qs = ref ? `?ref=${encodeURIComponent(ref)}` : '';

    if (/android/i.test(ua)) {
      // Android intent:// — opens the user's default browser directly.
      const intentUrl = `intent://urcecret.site${TARGET_PATH}${qs}#Intent;scheme=https;end`;
      window.location.href = intentUrl;
      // Reveal the manual fallback in case the intent is blocked.
      setTimeout(() => setShowManual(true), 1200);
      return;
    }

    if (/iphone|ipad/i.test(ua)) {
      // iOS: x-safari-https:// opens Safari from a webview on many versions.
      window.location.href = buildUrl('safari');
      setTimeout(() => setShowManual(true), 1200);
      return;
    }

    // Unknown — just navigate normally.
    window.location.href = buildUrl('https');
  }, [buildUrl]);

  useEffect(() => {
    // Preserve affiliate ref through the redirect so attribution survives.
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const dest = ref ? `${TARGET_PATH}?ref=${encodeURIComponent(ref)}` : TARGET_PATH;
    if (!detectInAppBrowser()) {
      router.replace(dest);
      return;
    }
    setIsIOS(/iphone|ipad/i.test(navigator.userAgent));
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div style={{
      background: '#060608',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '32px 24px',
      position: 'relative',
    }}>

      <style>{`
        @keyframes pulse-glow { 0%,100%{opacity:.85;transform:scale(1)} 50%{opacity:1;transform:scale(1.015)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      `}</style>

      {/* Logo */}
      <div style={{ fontSize: 46, marginBottom: 18 }}>🔮</div>

      <h1 style={{
        color: '#ffffff',
        fontSize: 26,
        fontWeight: 900,
        lineHeight: 1.2,
        textAlign: 'center',
        margin: '0 0 8px',
        letterSpacing: '-0.5px',
      }}>
        Ton profil MBTI<br />t&apos;attend
      </h1>

      <p style={{
        color: '#71717a',
        fontSize: 15,
        textAlign: 'center',
        margin: '0 0 32px',
        lineHeight: 1.5,
        maxWidth: 320,
      }}>
        Une dernière étape : ouvre le test dans ton navigateur (1 tap).
      </p>

      {/* ── ONE-TAP HERO BUTTON ── */}
      <button
        onClick={openInBrowser}
        style={{
          width: '100%',
          maxWidth: 360,
          padding: '20px 24px',
          borderRadius: 18,
          border: 'none',
          background: 'linear-gradient(135deg,#a94e18,#d17d52)',
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 900,
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(169,78,24,0.5)',
          animation: 'pulse-glow 1.8s ease-in-out infinite',
        }}
      >
        Ouvrir le test maintenant →
      </button>

      <p style={{ color: '#52525b', fontSize: 12, marginTop: 14, textAlign: 'center' }}>
        Gratuit · Résultat en 3 min · 16 profils
      </p>

      {/* ── Manual fallback (only if the one-tap is blocked) ── */}
      {showManual && (
        <div style={{
          marginTop: 36,
          width: '100%',
          maxWidth: 360,
          background: '#111114',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '18px 20px',
        }}>
          <p style={{ color: '#a1a1aa', fontSize: 13, fontWeight: 700, margin: '0 0 12px', textAlign: 'center' }}>
            Ça ne s&apos;est pas ouvert ? Fais-le à la main :
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 14 }}>1.</span>
            <span style={{ color: '#d4d4d8', fontSize: 14 }}>
              Appuie sur <strong style={{ color: 'white' }}>•••</strong> en haut à droite
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 14 }}>2.</span>
            <span style={{ color: '#d4d4d8', fontSize: 14 }}>
              <strong style={{ color: '#0ea5e9' }}>{isIOS ? '« Ouvrir dans Safari »' : '« Ouvrir dans le navigateur »'}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Arrow hint to ••• — subtle, only as a nudge */}
      {!showManual && (
        <div style={{ position: 'fixed', top: 14, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, opacity: 0.5 }}>
          <div style={{ animation: 'bounce 1.2s ease-in-out infinite' }}>
            <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
              <path d="M6 30L30 6M30 6H14M30 6V22" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
