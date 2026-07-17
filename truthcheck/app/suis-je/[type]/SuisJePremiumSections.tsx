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
  const isPremium = ['premium', 'plus'].includes((session?.user as { tier?: string } | undefined)?.tier ?? '');
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
          <div className="ur-panel-ink px-6 py-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💕</span>
              <h2 className="font-display text-lg font-black text-white">Le {code} en amour</h2>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{premium.inLove}</p>
          </div>
        </section>

        <section className="mb-10">
          <div className="ur-panel-ink px-6 py-6">
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
              <span key={celeb} className="ur-panel-ink px-4 py-2 text-sm font-medium text-zinc-200" style={{ borderRadius: '999px' }}>
                {celeb}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-lg font-black text-white mb-4">Types compatibles avec {code}</h2>
          <div className="flex flex-wrap gap-2">
            {premium.compatibleWith.map(c => (
              <Link key={c} href={`/suis-je/${c.toLowerCase()}`} className="ur-panel-ink px-4 py-2 text-sm font-semibold text-zinc-200 transition-all hover:scale-105">
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
    <section className="ur-panel-ink mb-10 px-6 py-8 text-center">
      <p className="text-sm font-bold text-white mb-1">Amour, carrière, célébrités & compatibilité {code}</p>
      <p className="text-xs text-stone-500 mb-5 max-w-sm mx-auto">Cette partie du profil {code} est verrouillée.</p>
      <Link
        href={`/types/${code.toLowerCase()}`}
        className="ur-btn-gold inline-flex px-6 py-3 text-sm"
      >
        Débloquer mon profil {code}, 1,99 €
      </Link>
    </section>
  );
}
