'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ALL_MBTI_TYPES, mbtiTypes } from '@/lib/mbti';
import { getMbtiCompatibility } from '@/lib/mbtiCompatibility';

const GROUPS = [
  { label: 'Analystes', codes: ['INTJ','INTP','ENTJ','ENTP'], color: '#a94e18' },
  { label: 'Diplomates', codes: ['INFJ','INFP','ENFJ','ENFP'], color: '#059669' },
  { label: 'Sentinelles', codes: ['ISTJ','ISFJ','ESTJ','ESFJ'], color: '#0284c7' },
  { label: 'Explorateurs', codes: ['ISTP','ISFP','ESTP','ESFP'], color: '#d97706' },
];

function TypePicker({ value, onChange, label }: { value: string; onChange: (t: string) => void; label: string }) {
  return (
    <div className="flex-1">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{label}</p>
      <div className="space-y-2">
        {GROUPS.map(g => (
          <div key={g.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: g.color }}>{g.label}</p>
            <div className="grid grid-cols-4 gap-1.5">
              {g.codes.map(code => {
                const t = mbtiTypes[code];
                const selected = value === code;
                return (
                  <button key={code} onClick={() => onChange(code)}
                    className="rounded-xl py-2 text-xs font-black border-2 transition-all"
                    style={selected
                      ? { borderColor: g.color, backgroundColor: g.color, color: '#fff' }
                      : { borderColor: '#e5e7eb', backgroundColor: '#fff', color: '#374151' }
                    }>
                    {t?.emoji ?? ''}<br />{code}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PremiumGate({ onUpgrade, loading }: { onUpgrade: (annual: boolean) => void; loading: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-6 text-center">
      <div className="text-4xl mb-4">👑</div>
      <h2 className="text-lg font-black text-gray-900 mb-2">Fonctionnalité Pro</h2>
      <p className="text-sm text-gray-600 mb-2 leading-relaxed">
        Le mode compatibilité MBTI est réservé aux membres Pro.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Compare ton type avec n&apos;importe qui — partenaire, ami, collègue — et découvre votre alchimie sur 4 dimensions.
      </p>

      <div className="space-y-2 max-w-xs mx-auto">
        <button
          onClick={() => onUpgrade(true)}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl font-black text-white text-sm relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 6px 20px rgba(169,78,24,0.3)' }}>
          <span className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[9px] font-black px-1.5 py-0.5 rounded-bl-lg">
            −75%
          </span>
          {loading ? 'Chargement…' : 'Annuel — 29,99 €/an'}
        </button>
        <button
          onClick={() => onUpgrade(false)}
          disabled={loading}
          className="w-full py-2.5 rounded-2xl font-semibold text-gray-700 text-sm border border-gray-200 hover:bg-white transition-all disabled:opacity-60">
          Mensuel — 9,99 €/mois
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-4">Inclus : 16 profils MBTI + compatibilité + quiz illimité</p>
    </div>
  );
}

export default function DuoMbtiClient() {
  const { data: session, status } = useSession();
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';

  const [typeA, setTypeA] = useState('');
  const [typeB, setTypeB] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'select' | 'result'>('select');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = params.get('a')?.toUpperCase();
    if (a && ALL_MBTI_TYPES.includes(a)) setTypeA(a);
  }, []);

  const compat = typeA && typeB ? getMbtiCompatibility(typeA, typeB) : null;

  const handleShare = () => {
    if (!typeA) return;
    const url = `${window.location.origin}/duo?a=${typeA}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const doCheckout = useCallback(async (annual: boolean) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          quizSlug: 'duo',
          userEmail: session?.user?.email ?? undefined,
          ...(annual ? { annual: true } : {}),
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) { window.location.href = data.url; }
      else { alert(data.error ?? 'Erreur de paiement'); setCheckoutLoading(false); }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setCheckoutLoading(false);
    }
  }, [session?.user?.email]);

  if (status === 'loading') {
    return <div className="py-20 text-center text-gray-300 text-sm animate-pulse">Chargement…</div>;
  }

  if (!isPremium) {
    return <PremiumGate onUpgrade={doCheckout} loading={checkoutLoading} />;
  }

  if (mode === 'result' && compat && typeA && typeB) {
    const tA = mbtiTypes[typeA];
    const tB = mbtiTypes[typeB];

    return (
      <div>
        {/* Back */}
        <button onClick={() => setMode('select')} className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 transition-colors">
          ← Modifier les types
        </button>

        {/* Score hero */}
        <div className="rounded-2xl border-2 p-6 text-center mb-6"
          style={{ borderColor: compat.color, background: compat.color + '08' }}>
          <div className="text-5xl mb-3">{compat.emoji}</div>
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-2xl">{tA?.emoji}</span>
            <div>
              <p className="text-3xl font-black" style={{ color: compat.color }}>{compat.score}%</p>
              <p className="text-sm font-bold text-gray-700">{compat.label}</p>
            </div>
            <span className="text-2xl">{tB?.emoji}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-black text-gray-900">{typeA}</span>
            <span className="text-gray-400">+</span>
            <span className="font-black text-gray-900">{typeB}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden max-w-xs mx-auto mb-5">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${compat.score}%`, background: `linear-gradient(to right, ${compat.color}99, ${compat.color})` }} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">{compat.summary}</p>
        </div>

        {/* Dimension breakdown */}
        <div className="space-y-3 mb-8">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Analyse dimension par dimension</h2>
          {compat.dimensions.map(d => (
            <div key={d.dim} className={`rounded-xl p-4 border ${d.aligned ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.aligned ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                  {d.aligned ? '✓ Alignés' : '≠ Différents'}
                </span>
                <span className="text-xs text-gray-500">{d.labelA} · {d.labelB}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{d.analysis}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 text-center">
          <p className="text-sm font-bold text-gray-900 mb-1">Découvrir ton profil complet</p>
          <p className="text-xs text-gray-500 mb-4">Forces, faiblesses, amour, carrière — le rapport complet de ton type.</p>
          <Link href={`/types/${typeA.toLowerCase()}`}
            className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}>
            Voir mon profil {typeA} →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Partner came via URL */}
      {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('a') && typeA && (
        <div className="rounded-xl bg-violet-50 border border-violet-200 p-3 mb-5 text-xs text-violet-700 flex items-center gap-2">
          <span className="text-base">{mbtiTypes[typeA]?.emoji}</span>
          <span>Ton partenaire a partagé son type : <strong>{typeA} — {mbtiTypes[typeA]?.name}</strong>. Sélectionne le tien.</span>
        </div>
      )}

      {/* Two pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <TypePicker value={typeA} onChange={setTypeA} label="Ton type MBTI" />
        <TypePicker value={typeB} onChange={setTypeB} label="Son type MBTI" />
      </div>

      {/* Share button (if A selected but not B) */}
      {typeA && !typeB && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-4 text-center">
          <p className="text-sm text-gray-600 mb-3">Ton partenaire ne connaît pas son type ? Envoie-lui le lien pour qu&apos;il le découvre.</p>
          <div className="flex gap-2 justify-center">
            <button onClick={handleShare}
              className="px-4 py-2.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}>
              {copied ? '✓ Lien copié !' : '🔗 Copier mon lien à partager'}
            </button>
            <Link href="/quiz/personnalite"
              className="px-4 py-2.5 rounded-xl font-semibold text-gray-700 text-sm border border-gray-200 hover:bg-gray-100 transition-all">
              Je ne sais pas mon type
            </Link>
          </div>
        </div>
      )}

      {/* Analyse button */}
      {typeA && typeB && (
        <button onClick={() => setMode('result')}
          className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 8px 30px rgba(169,78,24,0.35)' }}>
          Analyser notre compatibilité {mbtiTypes[typeA]?.emoji} + {mbtiTypes[typeB]?.emoji} →
        </button>
      )}

      {(!typeA || !typeB) && (
        <p className="text-center text-gray-400 text-sm mt-4">
          {!typeA && !typeB ? 'Sélectionne vos deux types MBTI pour voir votre compatibilité' :
           !typeA ? 'Sélectionne ton type MBTI' : 'Sélectionne le type de ton partenaire'}
        </p>
      )}
    </div>
  );
}
