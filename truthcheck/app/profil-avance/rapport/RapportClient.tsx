'use client';

import Link from 'next/link';
import type { MbtiScores } from '@/lib/mbti';

interface TypeInfo {
  code: string; name: string; tagline: string; rarity: string;
  fullDesc: string; inLove: string; atWork: string;
  famousExamples: string[]; compatibleWith: string[];
}

interface Analysis {
  strengths: string[]; weaknesses: string[];
  communicationStyle: string; conflictStyle: string; idealEnvironment: string;
  advice: string[];
}

const AXIS_LABEL: Record<string, string> = {
  E: 'Extraverti', I: 'Introverti',
  S: 'Observateur', N: 'Intuitif',
  T: 'Logique', F: 'Sensible',
  J: 'Organisé', P: 'Spontané',
};

export default function RapportClient({
  firstName, type, scores, analysis, generatedAt,
}: {
  firstName: string | null;
  type: TypeInfo;
  scores: MbtiScores | null;
  analysis: Analysis;
  generatedAt: string;
}) {
  const dims = scores ? (['EI', 'SN', 'TF', 'JP'] as const).map((a) => scores[a]) : [];

  return (
    <main className="min-h-screen pb-28" style={{ background: '#f4f0e4' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .ur-report, .ur-report * { visibility: visible; }
          .ur-report { position: absolute; inset: 0; margin: 0 !important; box-shadow: none !important; }
          .no-print { display: none !important; }
          @page { margin: 14mm; }
        }
      `}</style>

      <header className="no-print sticky top-0 z-30 px-4 h-14 flex items-center justify-between" style={{ background: 'rgba(242,236,222,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
        <Link href="/profil-avance" className="text-xs font-semibold" style={{ color: '#a8a29e' }}>← Retour</Link>
        <button onClick={() => window.print()} className="ur-btn-gold px-4 py-2 text-xs">Télécharger en PDF ↓</button>
      </header>

      <div className="ur-report max-w-2xl mx-auto p-8 sm:p-12 my-8 rounded-3xl" style={{ background: '#FAF6EC', border: '1px solid var(--line)', boxShadow: '0 20px 60px rgba(21,18,31,0.08)' }}>

        {/* Cover */}
        <div className="text-center mb-10 pb-8" style={{ borderBottom: '2px solid var(--gold-line)' }}>
          <p className="ur-label text-[11px] mb-3" style={{ color: 'var(--gold)' }}>UrCecret · Rapport de personnalité</p>
          <h1 className="font-display text-3xl font-black mb-2" style={{ color: 'var(--ink)' }}>
            {firstName ? `${firstName} — ` : ''}{type.code}
          </h1>
          <p className="text-base font-semibold mb-1" style={{ color: 'var(--gold)' }}>{type.name}</p>
          <p className="text-sm italic" style={{ color: '#78716c' }}>{type.tagline}</p>
          <p className="text-[11px] mt-4" style={{ color: '#a8a29e' }}>
            {type.rarity} de la population · Généré le {new Date(generatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Dimensions */}
        {dims.length > 0 && (
          <section className="mb-9">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b6055' }}>Tes dimensions</p>
            <div className="grid grid-cols-2 gap-3">
              {dims.map((d) => (
                <div key={d.letter} className="rounded-xl px-3.5 py-3" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
                  <p className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>{AXIS_LABEL[d.letter]} {d.pct}%</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Portrait */}
        <section className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b6055' }}>Ton portrait</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{type.fullDesc}</p>
        </section>

        <section className="mb-8 grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b6055' }}>En amour</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{type.inLove}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b6055' }}>Au travail</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{type.atWork}</p>
          </div>
        </section>

        {/* Analyse Nova */}
        <div className="mb-8 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
          <p className="ur-label text-[11px] mb-5 text-center" style={{ color: 'var(--gold)' }}>Analyse approfondie par Nova</p>

          <div className="rounded-2xl px-4 py-4 mb-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <p className="text-[11px] font-bold mb-2" style={{ color: '#16a34a' }}>💪 Forces principales</p>
            <ul className="flex flex-col gap-1.5">
              {analysis.strengths.map((s, i) => <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>• {s}</li>)}
            </ul>
          </div>

          <div className="rounded-2xl px-4 py-4 mb-4" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
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
            <div key={s.label} className="rounded-2xl px-4 py-4 mb-4" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
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
        </div>

        {(type.famousExamples.length > 0 || type.compatibleWith.length > 0) && (
          <section className="pt-6 grid sm:grid-cols-2 gap-5" style={{ borderTop: '1px solid var(--line)' }}>
            {type.famousExamples.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b6055' }}>Personnalités du même type</p>
                <p className="text-sm" style={{ color: 'var(--ink)' }}>{type.famousExamples.join(', ')}</p>
              </div>
            )}
            {type.compatibleWith.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b6055' }}>Bonnes affinités</p>
                <p className="text-sm" style={{ color: 'var(--ink)' }}>{type.compatibleWith.join(', ')}</p>
              </div>
            )}
          </section>
        )}

        <p className="text-center text-[11px] mt-10 pt-6" style={{ color: '#a8a29e', borderTop: '1px solid var(--line)' }}>
          urcecret.site · Rapport personnel, généré par Nova
        </p>
      </div>
    </main>
  );
}
