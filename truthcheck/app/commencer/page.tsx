'use client';

import { useEffect, useState } from 'react';
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

export default function CommencerPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Preserve affiliate ref through the redirect so attribution survives.
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const dest = ref ? `/quiz/personnalite?ref=${encodeURIComponent(ref)}` : '/quiz/personnalite';
    if (!detectInAppBrowser()) {
      router.replace(dest);
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div style={{
      background: '#060608',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Arrow pointing to ··· top-right ── */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        padding: '20px 20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
        zIndex: 10,
      }}>
        {/* bouncing arrow */}
        <div style={{ animation: 'bounce 1s ease-in-out infinite' }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M8 36L36 8M36 8H18M36 8V26" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{
          background: '#0ea5e9',
          color: 'white',
          fontWeight: 800,
          fontSize: 15,
          padding: '9px 16px',
          borderRadius: 22,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(14,165,233,0.5)',
        }}>
          Appuie ici ↗
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 60px',
        textAlign: 'center',
        maxWidth: 420,
        margin: '0 auto',
      }}>

        {/* Logo */}
        <div style={{
          fontSize: 52,
          marginBottom: 24,
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}>
          🔮
        </div>

        {/* Main message */}
        <h1 style={{
          color: '#ffffff',
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '0 0 10px',
          letterSpacing: '-0.5px',
        }}>
          Ouvre dans ton<br />navigateur
        </h1>

        <p style={{
          color: '#71717a',
          fontSize: 16,
          margin: '0 0 40px',
          lineHeight: 1.5,
        }}>
          Pour voir ton profil MBTI complet,<br />tu dois quitter l&apos;appli TikTok.
        </p>

        {/* Steps */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>

          <div style={{
            background: '#18181b',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            textAlign: 'left',
          }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: '50%',
              background: 'rgba(14,165,233,0.15)',
              border: '1.5px solid rgba(14,165,233,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0ea5e9', fontWeight: 800, fontSize: 16,
              flexShrink: 0,
            }}>1</div>
            <div>
              <p style={{ margin: 0, color: '#e4e4e7', fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
                Appuie sur <strong style={{ color: 'white', fontWeight: 900 }}>•••</strong> en haut à droite
              </p>
              <p style={{ margin: '3px 0 0', color: '#52525b', fontSize: 12 }}>le menu avec les 3 points</p>
            </div>
          </div>

          <div style={{
            background: '#18181b',
            border: '2px solid rgba(14,165,233,0.4)',
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            textAlign: 'left',
            boxShadow: '0 0 24px rgba(14,165,233,0.12)',
          }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: '50%',
              background: 'rgba(14,165,233,0.15)',
              border: '1.5px solid rgba(14,165,233,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0ea5e9', fontWeight: 800, fontSize: 16,
              flexShrink: 0,
            }}>2</div>
            <div>
              <p style={{ margin: 0, color: '#e4e4e7', fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
                Appuie sur
              </p>
              <p style={{ margin: '2px 0 0', color: '#0ea5e9', fontSize: 16, fontWeight: 900 }}>
                « Ouvrir dans le navigateur »
              </p>
            </div>
          </div>

        </div>

        {/* Why */}
        <p style={{
          color: '#3f3f46',
          fontSize: 12,
          marginTop: 28,
          lineHeight: 1.6,
        }}>
          Le navigateur est nécessaire pour le paiement sécurisé · Stripe ne fonctionne pas dans l&apos;appli TikTok
        </p>

      </div>
    </div>
  );
}
