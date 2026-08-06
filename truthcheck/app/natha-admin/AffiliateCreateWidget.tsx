'use client';

import { useState } from 'react';

// Même pattern que AccessCodeWidget.tsx — POST direct sur /api/admin/affiliates
// (déjà protégé par session admin côté serveur, voir ce fichier), pour créer un
// affilié en 2 champs depuis le téléphone plutôt que de devoir passer par un
// script. commissionPct est fixé à 50% côté API, rien à saisir ici.
const BASE = 'https://urcecret.site';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AffiliateCreateWidget() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ slug: string; dashboardUrl: string } | null>(null);

  async function create() {
    if (!name.trim() || !slug.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim(), email: email.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erreur inconnue'); return; }
      setCreated({ slug: data.slug, dashboardUrl: data.dashboardUrl });
      setName(''); setSlug(''); setEmail(''); setSlugTouched(false);
    } catch {
      setError('Requête échouée — vérifie que tu es connecté en admin.');
    } finally {
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    flex: 1, padding: '8px 12px', background: '#18181b', border: '1px solid #27272a',
    borderRadius: '8px', color: '#f4f4f5', fontSize: '13px', fontFamily: 'system-ui, sans-serif', outline: 'none',
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {created && (
        <div style={{
          background: '#14532d22', border: '1px solid #16a34a44', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '14px',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#71717a' }}>Lien à partager :</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#4ade80', wordBreak: 'break-all' }}>
              {BASE}/?ref={created.slug}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(`${BASE}/?ref=${created.slug}`)}
              style={{ padding: '5px 10px', background: '#16a34a44', border: '1px solid #16a34a', borderRadius: '6px', color: '#4ade80', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
            >
              Copier
            </button>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#71717a' }}>Son tableau de bord perso (clics, ventes, commission) :</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '11.5px', color: '#a1a1aa', wordBreak: 'break-all' }}>
              {created.dashboardUrl}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(created.dashboardUrl)}
              style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #27272a', borderRadius: '6px', color: '#a1a1aa', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
            >
              Copier
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: '#f87171', fontSize: 12.5, marginBottom: 10 }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <input
          style={{ ...inp, minWidth: 140 }}
          placeholder="Nom / pseudo (ex: youneedreset)"
          value={name}
          onChange={e => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
        <input
          style={{ ...inp, minWidth: 120, fontFamily: 'monospace' }}
          placeholder="slug (?ref=...)"
          value={slug}
          onChange={e => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
        />
        <input
          style={{ ...inp, minWidth: 160 }}
          placeholder="Email (optionnel)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && create()}
        />
        <button
          onClick={create}
          disabled={loading || !name.trim() || !slug.trim()}
          style={{
            padding: '8px 16px', background: loading ? '#27272a' : 'linear-gradient(135deg,#a94e18,#d17d52)',
            border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px',
            cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
            opacity: (!name.trim() || !slug.trim()) ? 0.5 : 1,
          }}
        >
          {loading ? '...' : '+ Créer l’affilié'}
        </button>
      </div>
      <p style={{ color: '#52525b', fontSize: 11.5, margin: 0 }}>Commission fixée à 50% côté serveur — rien à saisir.</p>
    </div>
  );
}
