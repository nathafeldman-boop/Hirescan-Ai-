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
  const [isInApp, setIsInApp] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const inApp = detectInAppBrowser();
    setIsInApp(inApp);
    if (!inApp) router.replace('/quiz/personnalite');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (email) {
      await fetch('/api/save-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {});
    }
    router.push('/quiz/personnalite');
  }

  if (isInApp === null || isInApp === false) return null;

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
          <path d="M6 30L30 6M30 6H14M30 6V22" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
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
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg,#4c1d95,#6d28d9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              marginBottom: 10,
            }}
          >
            🔮
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d1d5db', fontSize: 13 }}>
            <span style={{ color: '#fbbf24', letterSpacing: 2 }}>★★★★★</span>
            <span style={{ fontWeight: 700, color: 'white' }}>4.9</span>
            <span style={{ color: '#6b7280' }}>·</span>
            <span>50K+ utilisateurs</span>
          </div>
        </div>

        {/* Browser instructions */}
        <h1
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            margin: '0 0 20px',
          }}
        >
          Pour voir ton profil,<br />ouvre dans ton navigateur :
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <div
            style={{
              background: '#262626',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#3f3f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              1
            </div>
            <span style={{ color: '#e5e7eb', fontSize: 14, lineHeight: 1.4 }}>
              Appuie sur <strong style={{ color: 'white' }}>•••</strong> en haut à droite
            </span>
          </div>

          <div
            style={{
              background: '#262626',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#3f3f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              2
            </div>
            <span style={{ color: '#e5e7eb', fontSize: 14, lineHeight: 1.4 }}>
              Puis <strong style={{ color: '#0ea5e9' }}>« Ouvrir dans le navigateur »</strong>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#2d2d2d' }} />
          <span style={{ color: '#6b7280', fontSize: 12 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: '#2d2d2d' }} />
        </div>

        {/* Email capture */}
        <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', margin: '0 0 14px', lineHeight: 1.5 }}>
          Entre ton email pour recevoir<br />ton profil MBTI directement 💌
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              background: '#262626',
              border: '1px solid #3f3f46',
              color: 'white',
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
              color: 'white',
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Chargement...' : 'Commencer le test →'}
          </button>
        </form>

        <button
          onClick={() => router.push('/quiz/personnalite')}
          style={{
            width: '100%',
            marginTop: 10,
            padding: '10px',
            borderRadius: 12,
            background: 'transparent',
            border: '1px solid #2d2d2d',
            color: '#6b7280',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Faire le test sans compte
        </button>
      </div>
    </div>
  );
}
