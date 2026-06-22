'use client';

import { useState, type FormEvent, type CSSProperties } from 'react';

export default function TikTokSubmitForm() {
  const [form, setForm] = useState({
    affiliateSlug: '',
    tiktokUrl: '',
    viewsCount: '',
    likesCount: '',
    sharesCount: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contest-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateSlug: form.affiliateSlug.trim(),
          tiktokUrl: form.tiktokUrl.trim(),
          viewsCount: parseInt(form.viewsCount || '0', 10),
          likesCount: parseInt(form.likesCount || '0', 10),
          sharesCount: parseInt(form.sharesCount || '0', 10),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? 'Erreur serveur');
        setStatus('error');
        return;
      }
      setStatus('ok');
      setForm({ affiliateSlug: '', tiktokUrl: '', viewsCount: '', likesCount: '', sharesCount: '' });
    } catch {
      setErrorMsg('Erreur réseau');
      setStatus('error');
    }
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: '#1a1a2e',
    border: '1px solid #2d2d4e',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'system-ui, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#9ca3af',
    fontFamily: 'system-ui, sans-serif',
    marginBottom: '6px',
  };

  if (status === 'ok') {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', fontFamily: 'system-ui, sans-serif', marginBottom: '8px' }}>
          TikTok soumis !
        </p>
        <p style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'system-ui, sans-serif' }}>
          Ton entrée a été enregistrée dans le classement vues.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#9ca3af',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Soumettre un autre
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={labelStyle}>Ton slug affilié</label>
        <input
          style={inputStyle}
          placeholder="ex: infj-3a2f"
          value={form.affiliateSlug}
          onChange={e => setForm(f => ({ ...f, affiliateSlug: e.target.value }))}
          required
        />
      </div>
      <div>
        <label style={labelStyle}>Lien TikTok</label>
        <input
          style={inputStyle}
          placeholder="https://tiktok.com/@toi/video/..."
          value={form.tiktokUrl}
          onChange={e => setForm(f => ({ ...f, tiktokUrl: e.target.value }))}
          required
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Vues</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            placeholder="0"
            value={form.viewsCount}
            onChange={e => setForm(f => ({ ...f, viewsCount: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Likes</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            placeholder="0"
            value={form.likesCount}
            onChange={e => setForm(f => ({ ...f, likesCount: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Partages</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            placeholder="0"
            value={form.sharesCount}
            onChange={e => setForm(f => ({ ...f, sharesCount: e.target.value }))}
          />
        </div>
      </div>

      {status === 'error' && (
        <p style={{ fontSize: '13px', color: '#ef4444', fontFamily: 'system-ui, sans-serif' }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '14px',
          background: status === 'loading' ? '#374151' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '15px',
          borderRadius: '12px',
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          fontFamily: 'system-ui, sans-serif',
          transition: 'opacity 0.15s',
        }}
      >
        {status === 'loading' ? 'Envoi...' : 'Soumettre mon TikTok →'}
      </button>
    </form>
  );
}
