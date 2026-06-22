'use client';

import { useState } from 'react';

type CodeRow = { id: string; code: string; note: string | null; used: boolean; usedByEmail: string | null };

export default function AccessCodeWidget({ initial }: { initial: CodeRow[] }) {
  const [codes, setCodes] = useState<CodeRow[]>(initial);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState('');

  const SECRET = 'urcecret-admin-natha-2024';

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/access-codes?secret=${SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (data.ok) {
        const created: CodeRow = { id: data.code.id, code: data.code.code, note: data.code.note, used: false, usedByEmail: null };
        setCodes(prev => [created, ...prev]);
        setLatest(data.code.code);
        setNote('');
      }
    } finally {
      setLoading(false);
    }
  }

  async function del(id: string) {
    await fetch(`/api/admin/access-codes?secret=${SECRET}&id=${id}`, { method: 'DELETE' });
    setCodes(prev => prev.filter(c => c.id !== id));
  }

  const inp: React.CSSProperties = {
    flex: 1, padding: '8px 12px', background: '#18181b', border: '1px solid #27272a',
    borderRadius: '8px', color: '#f4f4f5', fontSize: '13px', fontFamily: 'system-ui, sans-serif', outline: 'none',
  };

  return (
    <div>
      {latest && (
        <div style={{
          background: '#14532d22', border: '1px solid #16a34a44', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#4ade80', letterSpacing: '0.15em' }}>
            {latest}
          </span>
          <button
            onClick={() => { navigator.clipboard.writeText(latest); }}
            style={{ padding: '5px 10px', background: '#16a34a44', border: '1px solid #16a34a', borderRadius: '6px', color: '#4ade80', fontSize: '12px', cursor: 'pointer' }}
          >
            Copier
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          style={inp}
          placeholder="Note (ex: affilié Théo, test TikTok…)"
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
        <button
          onClick={generate}
          disabled={loading}
          style={{
            padding: '8px 16px', background: loading ? '#27272a' : 'linear-gradient(135deg,#a94e18,#d17d52)',
            border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px',
            cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {loading ? '...' : '+ Générer'}
        </button>
      </div>

      {codes.length === 0 ? (
        <p style={{ color: '#52525b', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>Aucun code pour l'instant.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {codes.slice(0, 20).map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
              background: c.used ? '#0d0d0f' : '#18181b', borderRadius: '8px',
              border: `1px solid ${c.used ? '#27272a' : '#2d1f10'}`,
              opacity: c.used ? 0.5 : 1,
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: c.used ? '#52525b' : '#fb923c', letterSpacing: '0.1em', minWidth: '90px' }}>
                {c.code}
              </span>
              {c.note && <span style={{ fontSize: '12px', color: '#71717a', flex: 1 }}>{c.note}</span>}
              {!c.note && <span style={{ flex: 1 }} />}
              {c.used ? (
                <span style={{ fontSize: '11px', color: '#52525b' }}>✓ {c.usedByEmail ?? 'utilisé'}</span>
              ) : (
                <button
                  onClick={() => navigator.clipboard.writeText(c.code)}
                  style={{ padding: '3px 8px', background: 'transparent', border: '1px solid #27272a', borderRadius: '5px', color: '#71717a', fontSize: '11px', cursor: 'pointer' }}
                >
                  Copier
                </button>
              )}
              {!c.used && (
                <button
                  onClick={() => del(c.id)}
                  style={{ padding: '3px 6px', background: 'transparent', border: 'none', color: '#52525b', fontSize: '13px', cursor: 'pointer' }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
