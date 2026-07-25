'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppTabBar from '@/components/AppTabBar';

interface Analysis {
  strengths: string[];
  weaknesses: string[];
  communicationStyle: string;
  conflictStyle: string;
  idealEnvironment: string;
  advice: string[];
  updatedAt: string;
}

export default function ProfilAvanceClient({ isPaid, hasTest }: { isPaid: boolean; hasTest: boolean }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPaid || !hasTest) { setLoading(false); return; }
    fetch('/api/profil-avance')
      .then((r) => r.json())
      .then((d) => setAnalysis(d.analysis))
      .catch(() => setError('Impossible de charger ton analyse.'))
      .finally(() => setLoading(false));
  }, [isPaid, hasTest]);

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/profil-avance', { method: 'POST' });
      const d = await res.json();
      if (!res.ok) {
        if (res.status === 429) setError('Tu as atteint ta limite de messages Nova pour aujourd\'hui.');
        else setError('Nova n\'a pas réussi à générer ton analyse. Réessaie dans un instant.');
        return;
      }
      setAnalysis(d.analysis);
    } catch {
      setError('Une erreur est survenue. Réessaie.');
    } finally {
      setGenerating(false);
    }
  }

  if (!isPaid) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-24" style={{ background: 'var(--paper)' }}>
        <div className="text-4xl mb-4">🧠</div>
        <h1 className="font-display text-2xl font-black mb-2" style={{ color: 'var(--ink)' }}>Analyse de personnalité avancée</h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
          Une analyse plus profonde que le simple MBTI, qui s&apos;affine avec le temps — réservée aux abonnés Nova.
        </p>
        <Link href="/pricing" className="ur-btn-gold px-7 py-3.5 text-sm">
          Débloquer Nova →
        </Link>
        <Link href="/chat" className="mt-5 text-xs" style={{ color: '#a8a29e' }}>← Retour à Nova</Link>
        <AppTabBar />
      </main>
    );
  }

  if (!hasTest) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-24" style={{ background: 'var(--paper)' }}>
        <div className="text-4xl mb-4">🧭</div>
        <h1 className="font-display text-2xl font-black mb-2" style={{ color: 'var(--ink)' }}>D&apos;abord, ton test</h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
          Nova a besoin de ton résultat MBTI pour construire ton analyse avancée.
        </p>
        <Link href="/quiz/personnalite" className="ur-btn-gold px-7 py-3.5 text-sm">
          Faire le test (3 min) →
        </Link>
        <AppTabBar />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid var(--gold-line)', borderTopColor: 'var(--gold)' }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--paper)' }}>
      <header
        className="sticky top-0 z-30 px-4 h-14 flex items-center"
        style={{ background: 'rgba(242,236,222,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}
      >
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
          <span className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>🧠 Profil avancé</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {!analysis ? (
          <div className="rounded-3xl p-6 text-center" style={{ background: 'var(--gold-soft)', border: '1px dashed var(--gold-line)' }}>
            <div className="text-4xl mb-3">🧠</div>
            <p className="font-display text-lg font-black mb-1.5" style={{ color: 'var(--ink)' }}>
              Va plus loin que le MBTI
            </p>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: '#6b6055' }}>
              Nova combine ton test, tes conversations analysées et ton journal émotionnel pour construire un vrai portrait de toi.
            </p>
            <button onClick={generate} disabled={generating} className="ur-btn-gold px-6 py-3 text-sm disabled:opacity-50">
              {generating ? 'Nova réfléchit…' : 'Générer mon analyse →'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs" style={{ color: '#a8a29e' }}>
                Mis à jour le {new Date(analysis.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </p>
              <button onClick={generate} disabled={generating} className="text-xs font-semibold disabled:opacity-50" style={{ color: 'var(--gold)' }}>
                {generating ? 'Nova réfléchit…' : 'Régénérer ↻'}
              </button>
            </div>

            <div className="rounded-2xl px-4 py-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <p className="text-[11px] font-bold mb-2" style={{ color: '#16a34a' }}>💪 Forces principales</p>
              <ul className="flex flex-col gap-1.5">
                {analysis.strengths.map((s, i) => <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>• {s}</li>)}
              </ul>
            </div>

            <div className="rounded-2xl px-4 py-4" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
              <p className="text-[11px] font-bold mb-2" style={{ color: 'var(--gold)' }}>⚠️ Faiblesses / angles morts</p>
              <ul className="flex flex-col gap-1.5">
                {analysis.weaknesses.map((s, i) => <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>• {s}</li>)}
              </ul>
            </div>

            {[
              { label: '🗣️ Manière de communiquer', text: analysis.communicationStyle },
              { label: '⚡ Gestion des conflits', text: analysis.conflictStyle },
              { label: '🏡 Environnement idéal', text: analysis.idealEnvironment },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl px-4 py-4" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
                <p className="text-[11px] font-bold mb-1.5" style={{ color: 'var(--gold)' }}>{s.label}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{s.text}</p>
              </div>
            ))}

            <div className="rounded-2xl px-4 py-4" style={{ background: 'var(--ink)' }}>
              <p className="text-[11px] font-bold mb-2" style={{ color: 'var(--gold)' }}>💡 Conseils personnalisés</p>
              <ul className="flex flex-col gap-2">
                {analysis.advice.map((s, i) => <li key={i} className="text-sm leading-relaxed" style={{ color: '#FAF6EC' }}>• {s}</li>)}
              </ul>
            </div>
          </>
        )}

        {error && <p className="text-xs text-center" style={{ color: '#c2611f' }}>{error}</p>}
      </div>

      <AppTabBar />
    </main>
  );
}
