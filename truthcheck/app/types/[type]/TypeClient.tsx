'use client';

import { useState, useCallback } from 'react';
import { MbtiType } from '@/lib/mbti';

interface Props {
  type: MbtiType;
}

const RAPPORT_PRICE = '19,99 €';

export default function TypeClient({ type }: Props) {
  const [loading, setLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleUnlock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          quizSlug: 'personnalite',
          rapport: true,
          typeCode: type.code,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }, [type.code]);

  return (
    <>
      {/* Paid sections teaser */}
      <div className="mt-10 space-y-6">

        {/* Free: traits */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-base font-bold text-white mb-4">Tes traits de personnalité</h2>
          <div className="flex flex-wrap gap-2">
            {type.traits.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: `${type.accentColor}50`, color: type.accentColor, background: `${type.accentColor}15` }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Free: short description */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-base font-bold text-white mb-3">Qui es-tu vraiment ?</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{type.shortDesc}</p>
        </div>

        {/* Paywall */}
        <div className="relative rounded-2xl overflow-hidden border border-violet-500/30">
          {/* Blurred paid content preview */}
          <div className="px-6 py-5 blur-sm select-none pointer-events-none" aria-hidden>
            <h2 className="text-base font-bold text-white mb-2">Ton rapport complet {type.name}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              En amour, au travail, tes forces, tes angles morts, ta croissance personnelle — et des exemples de
              célébrités qui partagent ton type. Un rapport de 2000+ mots sur qui tu es vraiment...
            </p>
          </div>

          {/* Unlock overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-[#09090b]/60 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-3xl mb-3">🔓</div>
            <h3 className="text-lg font-black text-white mb-1">Rapport Complet {type.code}</h3>
            <p className="text-sm text-zinc-400 mb-5 max-w-xs">
              Amour · Carrière · Forces · Angles morts · Croissance · Compatibilité
            </p>
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${type.accentColor}, #a78bfa)` }}
            >
              {loading ? 'Chargement…' : `Débloquer — ${RAPPORT_PRICE}`}
            </button>
            <p className="text-xs text-zinc-600 mt-3">🛡️ Satisfait ou remboursé 7 jours</p>
          </div>
        </div>

        {/* Strengths/Weaknesses — blurred */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <div className="px-6 py-5 blur-sm select-none pointer-events-none" aria-hidden>
            <h2 className="text-base font-bold text-white mb-3">Tes forces</h2>
            <ul className="space-y-2">
              {type.strengths.map(s => (
                <li key={s} className="flex gap-2 text-sm text-zinc-400">
                  <span className="text-green-400 mt-0.5">✓</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent flex items-end justify-center pb-6">
            <button
              onClick={handleUnlock}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white border border-white/20 hover:bg-white/10 transition-all"
            >
              Voir mes forces et faiblesses →
            </button>
          </div>
        </div>
      </div>

      {/* Compatible types */}
      <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-base font-bold text-white mb-4">Compatibilité relationnelle</h2>
        <p className="text-xs text-zinc-500 mb-4">Types les plus compatibles avec {type.code} :</p>
        <div className="flex flex-wrap gap-3">
          {type.compatibleWith.map(c => (
            <a key={c} href={`/types/${c.toLowerCase()}`}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-zinc-300 hover:text-white hover:border-white/20 transition-all">
              {c}
            </a>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500">
            Analyse complète de ta compatibilité relationnelle disponible dans le rapport.
          </p>
          <button onClick={handleUnlock} className="mt-3 text-xs font-medium hover:underline"
            style={{ color: type.accentColor }}>
            Voir le rapport complet →
          </button>
        </div>
      </div>

      {/* Take the test CTA */}
      <div className="mt-8 p-5 rounded-2xl border border-white/10 text-center bg-white/3">
        <p className="text-sm text-zinc-400 mb-3">Tu n&apos;as pas encore passé le test ?</p>
        <a href="/quiz/personnalite"
          className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)' }}>
          Passer le test gratuitement →
        </a>
      </div>
    </>
  );
}
