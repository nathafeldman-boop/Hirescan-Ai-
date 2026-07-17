'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FusionLanding() {
  const router = useRouter();
  const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!name.trim()) { setError('Entre ton prénom'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/fusion/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erreur'); return; }
      sessionStorage.setItem('fusion_pid', data.participantId);
      sessionStorage.setItem('fusion_gid', data.groupId);
      router.push(`/fusion/${data.code}`);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!name.trim()) { setError('Entre ton prénom'); return; }
    if (!code.trim()) { setError('Entre le code de session'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/fusion/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erreur'); return; }
      sessionStorage.setItem('fusion_pid', data.participantId);
      sessionStorage.setItem('fusion_gid', data.groupId);
      router.push(`/fusion/${data.code}`);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4">⚗️</div>
        <h1 className="font-display text-3xl font-black text-stone-900 mb-2">Fusion</h1>
        <p className="text-stone-500 mb-8 leading-relaxed text-sm">
          Le quiz collectif. 2 à 10 personnes répondent ensemble et découvrent le profil de leur groupe.
        </p>

        {mode === 'idle' && (
          <div className="space-y-3">
            <button
              onClick={() => setMode('create')}
              className="ur-btn-gold block w-full py-4 text-center"
            >
              ✨ Créer une session
            </button>
            <button
              onClick={() => setMode('join')}
              className="ur-btn-ink block w-full py-4 text-center"
            >
              🔗 Rejoindre avec un code
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Ton prénom</label>
              <input
                className="w-full px-4 py-3 rounded-xl font-medium outline-none transition focus:border-[var(--gold)]"
                style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                placeholder="Ex: Alex"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                maxLength={30}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="ur-btn-gold block w-full py-4 text-center"
            >
              {loading ? 'Création...' : 'Créer la session →'}
            </button>
            <button onClick={() => { setMode('idle'); setError(''); }} className="text-stone-400 text-sm hover:text-stone-600">← Retour</button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Ton prénom</label>
              <input
                className="w-full px-4 py-3 rounded-xl font-medium outline-none transition focus:border-[var(--gold)]"
                style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                placeholder="Ex: Alex"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={30}
                autoFocus
              />
            </div>
            <div className="text-left">
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Code de session</label>
              <input
                className="w-full px-4 py-3 rounded-xl font-bold text-center tracking-widest text-lg outline-none transition uppercase focus:border-[var(--gold)]"
                style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                placeholder="EX: K7P2XQ"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                maxLength={6}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading}
              className="ur-btn-gold block w-full py-4 text-center"
            >
              {loading ? 'Connexion...' : 'Rejoindre →'}
            </button>
            <button onClick={() => { setMode('idle'); setError(''); }} className="text-stone-400 text-sm hover:text-stone-600">← Retour</button>
          </div>
        )}

        <p className="mt-8 text-xs text-stone-400">
          Fonctionnalité Premium · 1,99 € pour révéler votre profil de groupe
        </p>
      </div>
    </main>
  );
}
