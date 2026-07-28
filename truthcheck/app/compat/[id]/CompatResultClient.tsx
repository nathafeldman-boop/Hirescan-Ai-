'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RELATION_TYPES, type RelationType } from '@/lib/friendCompatQuestions';

interface Props {
  personName: string;
  relationType: RelationType;
  score: number;
  headline: string | null;
  commonPoints: string[] | null;
  differences: string[] | null;
  strengths: string[] | null;
  watchPoints: string[] | null;
  summary: string | null;
}

export default function CompatResultClient({ personName, relationType, score, headline, commonPoints, differences, strengths, watchPoints, summary }: Props) {
  const [copied, setCopied] = useState(false);
  const relation = RELATION_TYPES.find((r) => r.value === relationType);
  const hasDeep = !!summary && !!commonPoints && !!differences && !!strengths;

  async function share() {
    const url = window.location.href;
    const text = `Ma compatibilité avec ${personName} : ${score}% (vu par Elio sur UrCecret) 👀`;
    try {
      if (navigator.share) { await navigator.share({ title: 'UrCecret', text, url }); return; }
    } catch { /* partage annulé */ }
    try { await navigator.clipboard.writeText(`${text}\n${url}`); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
  }

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: 'var(--paper)' }}>
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{relation?.emoji ?? '👥'}</div>
          <p className="ur-label text-[10px] mb-1" style={{ color: 'var(--gold)' }}>{relation?.label}</p>
          <h1 className="font-display text-xl font-black" style={{ color: 'var(--ink)' }}>
            Toi &amp; {personName}
          </h1>
        </div>

        {/* Score — toujours gratuit, toujours la première chose vue */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative flex items-center justify-center mb-3" style={{ width: 140, height: 140 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="var(--line)" strokeWidth="10" />
              <circle
                cx="70" cy="70" r="60" fill="none" stroke="var(--gold)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60 * score / 100} ${2 * Math.PI * 60}`}
                transform="rotate(-90 70 70)"
              />
            </svg>
            <span className="absolute font-display text-3xl font-black" style={{ color: 'var(--ink)' }}>{score}%</span>
          </div>
          {headline && (
            <p className="text-sm text-center leading-relaxed max-w-xs" style={{ color: 'var(--ink)' }}>{headline}</p>
          )}
        </div>

        {hasDeep ? (
          <>
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--ink)' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#FAF6EC' }}>{summary}</p>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <p className="text-[11px] font-bold mb-1.5" style={{ color: '#16a34a' }}>✨ Points communs</p>
                <ul className="flex flex-col gap-1">
                  {commonPoints!.map((p, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>• {p}</li>)}
                </ul>
              </div>

              <div className="rounded-xl px-4 py-3" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
                <p className="text-[11px] font-bold mb-1.5" style={{ color: 'var(--gold)' }}>🔀 Différences</p>
                <ul className="flex flex-col gap-1">
                  {differences!.map((p, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>• {p}</li>)}
                </ul>
              </div>

              <div className="rounded-xl px-4 py-3" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
                <p className="text-[11px] font-bold mb-1.5" style={{ color: 'var(--gold)' }}>💪 Forces de la relation</p>
                <ul className="flex flex-col gap-1">
                  {strengths!.map((p, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>• {p}</li>)}
                </ul>
              </div>

              {watchPoints && watchPoints.length > 0 && (
                <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <p className="text-[11px] font-bold mb-1.5" style={{ color: '#dc2626' }}>⚠️ Points d&apos;attention</p>
                  <ul className="flex flex-col gap-1">
                    {watchPoints.map((p, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>• {p}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--ink)' }}>
            <p className="text-sm font-bold mb-2" style={{ color: '#FAF6EC' }}>Tu as vu votre score. Voici ce qui se passe vraiment entre vous deux.</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(250,246,236,0.6)' }}>
              Elio peut détailler vos points communs, vos différences, les vraies forces de cette relation et les points d&apos;attention à garder en tête.
            </p>
            <Link href="/pricing" className="ur-btn-gold w-full py-3 text-sm inline-flex items-center justify-center">
              Voir l&apos;analyse complète →
            </Link>
          </div>
        )}

        <p className="text-[10px] text-center mb-5 leading-relaxed" style={{ color: '#a8a29e' }}>
          Généré à partir de ta perception de {personName} — à visée ludique et de réflexion, pas un diagnostic.
        </p>

        <button onClick={share} className="ur-btn-gold w-full py-3 text-sm mb-3">
          {copied ? '✅ Copié — envoie-le !' : '📤 Partager'}
        </button>
        <Link href="/compat" className="block text-center text-xs" style={{ color: '#a8a29e' }}>
          Analyser une autre relation →
        </Link>
      </div>
    </main>
  );
}
