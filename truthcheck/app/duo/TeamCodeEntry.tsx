'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeTeamCode, encodeDuoAnswers } from '@/lib/duoQuizzes';

export default function TeamCodeEntry() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    const decoded = decodeTeamCode(trimmed);
    if (!decoded) {
      setError('Code invalide. Vérifie les 6 caractères et réessaie.');
      return;
    }
    const encoded = encodeDuoAnswers(decoded.answers);
    router.push(`/duo/${decoded.slug}/compare?a=${encoded}`);
  }

  return (
    <div
      className="rounded-2xl border p-5 mb-8"
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.04))', borderColor: 'rgba(139,92,246,0.3)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Tu as reçu un code ?</p>
      <p className="text-gray-400 text-xs mb-4">Entre le code de 6 lettres partagé par ton coéquipier(e)</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase().slice(0, 6)); setError(''); }}
          placeholder="EX: COABCD"
          maxLength={6}
          className="flex-1 px-4 py-3 rounded-xl font-mono text-base font-black text-gray-900 bg-white border border-gray-200 focus:outline-none focus:border-violet-400 tracking-widest placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal"
          style={{ letterSpacing: '0.2em' }}
          autoCapitalize="characters"
          autoCorrect="off"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl font-black text-white text-sm transition-all active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 4px 16px rgba(139,92,246,0.35)' }}
        >
          Rejoindre →
        </button>
      </form>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
