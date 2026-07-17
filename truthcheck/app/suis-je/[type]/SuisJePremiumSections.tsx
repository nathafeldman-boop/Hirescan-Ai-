'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { MbtiTypePremium } from '@/lib/mbti-premium';

interface Props {
  code: string;
}

// Contenu payant (inLove, atWork, famousExamples, compatibleWith,
// lib/mbti-premium.ts) : jamais rendu côté serveur, jamais importé
// statiquement dans ce composant client. Récupéré uniquement après
// vérification serveur du paiement, via /api/profile/[code] (même route que
// TypeClient.tsx).
export default function SuisJePremiumSections({ code }: Props) {
  const { data: session, status } = useSession();
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';
  const sessionLoading = status === 'loading';

  const [premium, setPremium] = useState<MbtiTypePremium | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPremium) { setPremium(null); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/profile/${code}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (!cancelled) { setPremium(data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isPremium, code]);

  if (sessionLoading || (isPremium && loading)) {
    return (
      <div className="mb-10 flex justify-center py-10">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (isPremium && premium) {
    return (
      <>
        <section className="mb-10">
          <div className="rounded-2xl px-6 py-6" style={{ background: 'rgba(224,163,128,0.05)', border: '1px solid rgba(224,163,128,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💕</span>
              <h2 className="font-display text-lg font-black text-white">Le {code} en amour</h2>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{premium.inLove}</p>
          </div>
        </section>

        <section className="mb-10">
          <div className="rounded-2xl px-6 py-6" style={{ background: 'rgba(176,125,43,0.05)', border: '1px solid rgba(176,125,43,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💼</span>
              <h2 className="font-display text-lg font-black text-white">Le {code} au travail</h2>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{premium.atWork}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-lg font-black text-white mb-4">Célébrités {code} — tu es en bonne compagnie</h2>
          <div className="flex flex-wrap gap-2">
            {premium.famousExamples.map(celeb => (
              <span key={celeb} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#e4e4e7' }}>
                {celeb}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-lg font-black text-white mb-4">Types compatibles avec {code}</h2>
          <div className="flex flex-wrap gap-2">
            {premium.compatibleWith.map(c => (
              <Link key={c} href={`/suis-je/${c.toLowerCase()}`} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#e4e4e7' }}>
                {c}
              </Link>
            ))}
          </div>
        </section>
      </>
    );
  }

  // Non premium : teaser verrouillé, aucun contenu payant affiché.
  return (
    <section className="mb-10 rounded-2xl px-6 py-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-sm font-bold text-white mb-1">Amour, carrière, célébrités & compatibilité {code}</p>
      <p className="text-xs text-stone-500 mb-5 max-w-sm mx-auto">Cette partie du profil {code} est verrouillée.</p>
      <Link
        href={`/types/${code.toLowerCase()}`}
        className="inline-block px-6 py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-105"
        style={{ background: 'linear-gradient(to right, #a94e18, #d17d52)' }}
      >
        Débloquer mon profil {code}, 1,99 €
      </Link>
    </section>
  );
}
