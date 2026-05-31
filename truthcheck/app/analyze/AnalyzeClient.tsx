'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface RizzResponse {
  style: string;
  text: string;
  score: number;
  emoji: string;
}

interface AnalysisResult {
  context: string;
  tone: string;
  responses: RizzResponse[];
  rizzPointsEarned: number;
}

const STYLE_COLORS: Record<string, string> = {
  'Witty': '#f59e0b',
  'Séducteur': '#ec4899',
  'Neutre': '#6b7280',
  'Audacieux': '#ef4444',
  'Empathique': '#10b981',
};

export default function AnalyzeClient({ userId, tier }: { userId: string; tier: string }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  void userId;

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur analyse');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  function copyResponse(text: string, idx: number) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-[#09090b]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-violet-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">📸 Screenshot Analyzer</h1>
            <p className="text-zinc-500 text-sm">Upload une conv et obtiens 5 réponses parfaites</p>
          </div>
          {tier === 'free' && (
            <span className="ml-auto text-xs text-zinc-500 border border-white/10 px-2 py-1 rounded-full">
              5 / mois
            </span>
          )}
        </header>

        {!result ? (
          <>
            {/* Drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer mb-4 ${
                dragging
                  ? 'border-violet-500 bg-violet-500/10'
                  : preview
                  ? 'border-white/20 bg-white/5'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => !preview && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Screenshot" className="max-h-64 mx-auto rounded-xl object-contain" />
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-3">📱</div>
                  <p className="text-white font-semibold mb-1">Glisse ton screenshot ici</p>
                  <p className="text-zinc-500 text-sm">ou clique pour choisir un fichier</p>
                  <p className="text-zinc-600 text-xs mt-2">PNG, JPG, WEBP — max 10MB</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={analyze}
              disabled={!file || loading}
              className="w-full py-4 rounded-xl font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={
                file && !loading
                  ? { background: 'linear-gradient(135deg, #8b5cf6cc, #8b5cf6)', boxShadow: '0 4px 24px #8b5cf640' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#71717a' }
              }
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyse en cours…
                </span>
              ) : 'Analyser et obtenir des réponses →'}
            </button>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="glass rounded-2xl p-5 mb-5 border border-white/8">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Contexte détecté</p>
                  <p className="text-white text-sm leading-relaxed">{result.context}</p>
                </div>
                <div className="ml-4 text-center flex-shrink-0">
                  <div className="text-2xl font-black text-violet-400">+{result.rizzPointsEarned}</div>
                  <div className="text-xs text-zinc-500">pts Rizz</div>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                Ton : {result.tone}
              </span>
            </div>

            <div className="space-y-3 mb-5">
              {result.responses.map((r, i) => (
                <div key={i} className="glass rounded-xl p-4 border border-white/8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{r.emoji}</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ color: STYLE_COLORS[r.style] ?? '#8b5cf6', backgroundColor: (STYLE_COLORS[r.style] ?? '#8b5cf6') + '20' }}
                      >
                        {r.style}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Rizz {r.score}/10</span>
                      <button
                        onClick={() => copyResponse(r.text, i)}
                        className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                      >
                        {copiedIdx === i ? '✓ Copié' : 'Copier'}
                      </button>
                    </div>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/8"
            >
              ← Analyser un autre screenshot
            </button>
          </>
        )}
      </div>
    </main>
  );
}
