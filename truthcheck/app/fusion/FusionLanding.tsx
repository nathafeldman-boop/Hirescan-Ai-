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
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f3ec' }}>
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
              className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 8px 32px rgba(169,78,24,0.25)' }}
            >
              ✨ Créer une session
            </button>
            <button
              onClick={() => setMode('join')}
              className="block w-full py-4 rounded-2xl font-bold text-stone-700 text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'white', border: '2px solid #e7e5e0' }}
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
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 font-medium outline-none focus:border-violet-400 transition"
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
              className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}
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
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 font-medium outline-none focus:border-violet-400 transition"
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
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 font-bold text-center tracking-widest text-lg outline-none focus:border-violet-400 transition uppercase"
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
              className="block w-full py-4 rounded-2xl font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}
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
