'use client';

import { useState } from 'react';

export default function SuccessUpsellButton({ typeCode, email }: { typeCode: string; email: string | null }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          quizSlug: 'personnalite',
          typeCode,
          ...(email ? { userEmail: email } : {}),
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else { alert(data.error ?? 'Erreur'); setLoading(false); }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="block w-full py-3.5 rounded-xl font-black text-white text-sm text-center transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 20px rgba(169,78,24,0.35)' }}
    >
      {loading ? '…' : `Passer à l'accès complet — 9,99 €/mois →`}
    </button>
  );
}
