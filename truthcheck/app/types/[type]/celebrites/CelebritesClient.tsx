'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { hasProfileAccess } from '@/lib/plans';

interface Props {
  code: string;
  accentColor: string;
}

// Contenu payant (famousExamples, lib/mbti-premium.ts) : jamais rendu côté
// serveur, jamais importé statiquement dans ce composant client. Récupéré
// uniquement après vérification serveur du paiement, via /api/profile/[code]
// (même route que TypeClient.tsx).
export default function CelebritesClient({ code, accentColor }: Props) {
  const { data: session, status } = useSession();
  const isPremium = hasProfileAccess((session?.user as { tier?: string } | undefined)?.tier);
  const sessionLoading = status === 'loading';

  const [famousExamples, setFamousExamples] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPremium) { setFamousExamples(null); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/profile/${code}`)
      .then(res => res.ok ? res.json() : null)
      .then((data: { famousExamples?: string[] } | null) => {
        if (!cancelled) { setFamousExamples(data?.famousExamples ?? null); setLoading(false); }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isPremium, code]);

  if (sessionLoading || (isPremium && loading)) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (isPremium && famousExamples) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {famousExamples.map((celeb, i) => (
          <div
            key={celeb}
            className="rounded-xl p-4 flex flex-col items-center text-center transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mb-3"
              style={{
                background: i % 2 === 0 ? `${accentColor}25` : 'rgba(255,255,255,0.06)',
                border: `1px solid ${i % 2 === 0 ? `${accentColor}50` : 'rgba(255,255,255,0.1)'}`,
                color: i % 2 === 0 ? accentColor : '#a1a1aa',
              }}
              aria-hidden="true"
            >
              {celeb.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-zinc-200 leading-snug">{celeb}</span>
            <span className="mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${accentColor}15`, color: accentColor }}>
              {code}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Non premium : aperçu verrouillé, aucun nom réel affiché.
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl p-4 flex flex-col items-center text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mb-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#52525b' }} aria-hidden="true">
              ?
            </div>
            <span className="text-sm font-semibold text-zinc-600 leading-snug ur-cut select-none pointer-events-none">Nom verrouillé</span>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-zinc-500 mb-3">La liste des célébrités {code} fait partie du profil complet.</p>
        <Link
          href={`/types/${code.toLowerCase()}`}
          className="inline-block px-5 py-2.5 rounded-full font-black text-xs transition-all hover:scale-[1.02]"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}
        >
          Débloquer mon profil {code}, 1,99 €
        </Link>
      </div>
    </div>
  );
}
