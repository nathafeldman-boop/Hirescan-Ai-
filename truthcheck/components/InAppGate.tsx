'use client';

import { useEffect, useState, useCallback } from 'react';
import Seal from './Seal';

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
        background: 'var(--ink)', color: '#FAF6EC',
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

      {/* Flèche vers le menu ••• */}
      <div style={{ position: 'fixed', top: 8, right: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, animation: 'gateArrow 1.1s ease-in-out infinite' }}>
        <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
          <path d="M6 30L30 6M30 6H14M30 6V22" stroke="var(--gold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="ur-label" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)', fontSize: 11, padding: '6px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
          le menu ••• est ici
        </span>
      </div>

      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center', animation: 'gateIn .5s ease both', position: 'relative' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <Seal size={68} spin />
        </div>

        {/* Marque */}
        <p style={{ fontFamily: 'var(--font-display), serif', fontStyle: 'italic', fontWeight: 700, fontSize: 24, margin: '0 0 18px' }}>
          UrCecret
        </p>

        <p style={{ fontFamily: 'var(--font-display), serif', fontSize: 21, fontWeight: 500, lineHeight: 1.3, margin: '0 0 8px', color: '#FAF6EC' }}>
          Ton profil complet t&apos;attend<br />
          <em style={{ color: 'var(--gold)' }}>de l&apos;autre côté.</em>
        </p>
        <p style={{ fontSize: 13.5, color: 'rgba(250,246,236,0.55)', lineHeight: 1.55, margin: '0 0 24px' }}>
          Ton type, ta façon d&apos;aimer, ta face cachée.<br />
          Ouvre cette page dans ton navigateur pour y accéder.
        </p>

        {/* 2 étapes — panneaux plats, pas de glassmorphism */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--ink-soft)', border: '1px solid var(--line-ink)', borderRadius: 20, padding: '15px 18px' }}>
            <span className="ur-label" style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gold-line)', color: 'var(--gold)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.35, color: 'rgba(250,246,236,0.9)' }}>
              Appuie sur <strong style={{ color: '#FAF6EC' }}>•••</strong> tout en haut à droite ↗
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', borderRadius: 20, padding: '15px 18px' }}>
            <span className="ur-label" style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gold-line)', color: 'var(--gold)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, color: 'var(--gold)' }}>
              {isIOS ? '« Ouvrir dans Safari »' : '« Ouvrir dans le navigateur »'}
            </span>
          </div>
        </div>

        {/* Ouverture auto — CTA or */}
        <button
          onClick={openInBrowser}
          style={{ width: '100%', padding: '16px', borderRadius: 100, border: 'none', background: 'var(--gold)', color: 'var(--ink)', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}
        >
          Essayer l&apos;ouverture automatique →
        </button>

        {/* Copie du lien — fantôme */}
        <button
          onClick={copyLink}
          style={{ width: '100%', padding: '13px', borderRadius: 100, background: 'transparent', border: '1px solid rgba(250,246,236,0.25)', color: 'rgba(250,246,236,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          {copied ? 'Lien copié, colle-le dans ton navigateur' : 'Ou copie le lien'}
        </button>
      </div>
    </div>
  );
}
