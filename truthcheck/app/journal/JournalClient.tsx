'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppTabBar from '@/components/AppTabBar';

type Entry = { day: string; mood: number; energy: number; stress: number; emotion: string | null; note: string | null };
type JournalAccess = { trendInsights: boolean; inTrial: boolean; trialDaysLeft: number };

const MOODS = [
  { value: 1, emoji: '😞', label: 'Difficile' },
  { value: 2, emoji: '😕', label: 'Pas top' },
  { value: 3, emoji: '😐', label: 'Neutre' },
  { value: 4, emoji: '🙂', label: 'Bien' },
  { value: 5, emoji: '😄', label: 'Super' },
] as const;

const ENERGY_LEVELS = [
  { value: 1, emoji: '🥱', label: 'Épuisé' },
  { value: 2, emoji: '😴', label: 'Faible' },
  { value: 3, emoji: '🙂', label: 'Correcte' },
  { value: 4, emoji: '💪', label: 'Bonne' },
  { value: 5, emoji: '⚡', label: 'Au top' },
] as const;

const STRESS_LEVELS = [
  { value: 1, emoji: '😌', label: 'Zen' },
  { value: 2, emoji: '🙂', label: 'Calme' },
  { value: 3, emoji: '😐', label: 'Neutre' },
  { value: 4, emoji: '😬', label: 'Tendu' },
  { value: 5, emoji: '🤯', label: 'Sous tension' },
] as const;

const EMOTIONS = ['😊 Joie', '😌 Sérénité', '🙏 Gratitude', '🥰 Amour', '😲 Surprise', '😠 Colère', '😢 Tristesse', '😰 Anxiété'] as const;

function moodEmoji(mood: number): string {
  return MOODS.find((m) => m.value === mood)?.emoji ?? '·';
}

// Mois affiché : "YYYY-MM" → libellé "juillet 2026"
function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Grille du mois : cases vides en tête pour aligner sur lundi=0 … dimanche=6
function buildGrid(month: string): (number | null)[] {
  const [y, m] = month.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const firstDow = (new Date(y, m - 1, 1).getDay() + 6) % 7; // 0=lundi
  const cells: (number | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

// Sélecteur compact à 5 niveaux — réutilisé pour humeur / énergie / stress.
function LevelPicker({
  levels, selected, onSelect, disabled,
}: {
  levels: readonly { value: number; emoji: string; label: string }[];
  selected: number | null;
  onSelect: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {levels.map((l) => (
        <button
          key={l.value}
          onClick={() => onSelect(l.value)}
          disabled={disabled}
          className="flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
          style={{
            background: selected === l.value ? 'var(--gold-soft)' : 'var(--paper)',
            border: `1px solid ${selected === l.value ? 'var(--gold-line)' : 'var(--line)'}`,
          }}
        >
          <span className="text-xl leading-none">{l.emoji}</span>
          <span className="text-[8px] font-semibold text-center leading-tight" style={{ color: '#6b6055' }}>{l.label}</span>
        </button>
      ))}
    </div>
  );
}

function EmotionPicker({ selected, onSelect, disabled }: { selected: string | null; onSelect: (v: string) => void; disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EMOTIONS.map((e) => (
        <button
          key={e}
          onClick={() => onSelect(e)}
          disabled={disabled}
          className="px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
          style={{
            background: selected === e ? 'var(--gold-soft)' : 'var(--paper)',
            border: `1px solid ${selected === e ? 'var(--gold-line)' : 'var(--line)'}`,
            color: 'var(--ink)',
          }}
        >
          {e}
        </button>
      ))}
    </div>
  );
}

interface SavedPayload { mood: number; energy: number; stress: number; emotion?: string; note?: string }

// ── Onboarding : première visite du Journal ─────────────────────────────────
// Un pas à la fois, façon quiz éclair — jamais l'impression d'un long
// formulaire. Les 3 dernières questions (marquant/heureux/dérangé) sont
// combinées dans la note de l'entrée du jour : pas de nouveau modèle de
// données, juste une saisie plus riche pour ce premier jour.
function OnboardingFlow({ onSubmit, saving }: { onSubmit: (p: SavedPayload) => void; saving: boolean }) {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [highlight, setHighlight] = useState('');
  const [happy, setHappy] = useState('');
  const [bother, setBother] = useState('');

  const advance = () => setStep((s) => s + 1);

  function finish() {
    const noteLines: string[] = [];
    if (highlight.trim()) noteLines.push(`Ce qui a marqué sa journée : ${highlight.trim()}`);
    if (happy.trim()) noteLines.push(`Ce qui l'a rendu(e) heureux(se) : ${happy.trim()}`);
    if (bother.trim()) noteLines.push(`Ce qui l'a dérangé(e) : ${bother.trim()}`);
    onSubmit({
      mood: mood!,
      energy: energy!,
      stress: stress!,
      emotion: emotion ?? undefined,
      note: noteLines.length ? noteLines.join('\n') : undefined,
    });
  }

  const STEPS = 7;
  const progress = (step + 1) / STEPS;

  return (
    <div className="rounded-3xl p-6" style={{ background: 'var(--gold-soft)', border: '1px dashed var(--gold-line)' }}>
      <div className="flex items-center gap-1.5 mb-5">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: i <= step ? 'var(--gold)' : 'var(--line)' }} />
        ))}
      </div>

      {step === 0 && (
        <>
          <p className="font-display text-lg font-black mb-1" style={{ color: 'var(--ink)' }}>Bienvenue dans ton Journal 📖</p>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: '#6b6055' }}>
            6 questions rapides pour que Nova commence à te connaître — moins d&apos;une minute.
          </p>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Comment te sens-tu aujourd&apos;hui ?</p>
          <LevelPicker levels={MOODS} selected={mood} onSelect={(v) => { setMood(v); advance(); }} disabled={saving} />
        </>
      )}

      {step === 1 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Quel est ton niveau d&apos;énergie ?</p>
          <LevelPicker levels={ENERGY_LEVELS} selected={energy} onSelect={(v) => { setEnergy(v); advance(); }} disabled={saving} />
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Ton niveau de stress ?</p>
          <LevelPicker levels={STRESS_LEVELS} selected={stress} onSelect={(v) => { setStress(v); advance(); }} disabled={saving} />
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Une émotion qui domine aujourd&apos;hui ?</p>
          <EmotionPicker selected={emotion} onSelect={(v) => { setEmotion(v); advance(); }} disabled={saving} />
          <button onClick={advance} disabled={saving} className="w-full mt-4 py-2.5 text-xs font-semibold" style={{ color: '#a8a29e' }}>
            Passer →
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Qu&apos;est-ce qui a marqué ta journée ?</p>
          <textarea
            value={highlight}
            onChange={(e) => setHighlight(e.target.value.slice(0, 200))}
            rows={2}
            placeholder="Un événement, une rencontre, une pensée…"
            className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none mb-3"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          />
          <button onClick={advance} disabled={saving} className="ur-btn-gold w-full py-3 text-sm">Continuer →</button>
        </>
      )}

      {step === 5 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Qu&apos;est-ce qui t&apos;a rendu heureux ?</p>
          <textarea
            value={happy}
            onChange={(e) => setHappy(e.target.value.slice(0, 200))}
            rows={2}
            placeholder="Optionnel…"
            className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none mb-3"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          />
          <button onClick={advance} disabled={saving} className="ur-btn-gold w-full py-3 text-sm">Continuer →</button>
        </>
      )}

      {step === 6 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Qu&apos;est-ce qui t&apos;a dérangé ?</p>
          <textarea
            value={bother}
            onChange={(e) => setBother(e.target.value.slice(0, 200))}
            rows={2}
            placeholder="Optionnel…"
            className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none mb-3"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          />
          <button onClick={finish} disabled={saving} className="ur-btn-gold w-full py-3 text-sm disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Terminer mon premier jour →'}
          </button>
        </>
      )}

      <p className="text-[10px] text-center mt-4" style={{ color: '#a8a29e' }}>
        {Math.round(progress * 100)}% — presque fini
      </p>
    </div>
  );
}

export default function JournalClient({ firstName, access }: { firstName: string | null; access: JournalAccess }) {
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hasAny, setHasAny] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [selectedStress, setSelectedStress] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reflection, setReflection] = useState<string | null>(null);

  const [insights, setInsights] = useState<string[] | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [insightsNeeded, setInsightsNeeded] = useState<{ count: number; needed: number } | null>(null);

  const [periodSummary, setPeriodSummary] = useState<string | null>(null);
  const [periodLoading, setPeriodLoading] = useState<'week' | 'month' | null>(null);

  const load = (m?: string) => {
    setLoading(true);
    setError(null);
    fetch(`/api/journal${m ? `?month=${m}` : ''}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setMonth(d.month);
        setToday(d.today);
        setEntries(d.entries);
        setHasAny(d.hasAny);
      })
      .catch(() => setError('Impossible de charger ton journal. Réessaie dans un instant.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const todayEntry = useMemo(() => entries.find((e) => e.day === today) ?? null, [entries, today]);
  const grid = useMemo(() => (month ? buildGrid(month) : []), [month]);
  const entryByDay = useMemo(() => {
    const map = new Map<number, Entry>();
    entries.forEach((e) => { const d = Number(e.day.slice(-2)); map.set(d, e); });
    return map;
  }, [entries]);

  const canGoNext = month !== null && today !== null && month < today.slice(0, 7);
  const history = useMemo(
    () => [...entries].filter((e) => e.day !== today).sort((a, b) => (a.day < b.day ? 1 : -1)),
    [entries, today],
  );

  async function persistEntry(payload: SavedPayload) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setEntries((prev) => {
        const rest = prev.filter((e) => e.day !== d.entry.day);
        return [...rest, d.entry];
      });
      setHasAny(true);
      setReflection(d.reflection ?? null);
    } catch {
      setError("L'enregistrement a échoué. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  async function saveEntry() {
    if (!selectedMood || !selectedEnergy || !selectedStress) return;
    await persistEntry({
      mood: selectedMood, energy: selectedEnergy, stress: selectedStress,
      emotion: selectedEmotion ?? undefined, note: note.trim() || undefined,
    });
  }

  async function loadInsights() {
    setInsightsLoading(true);
    setInsightsError(null);
    setInsightsNeeded(null);
    try {
      const res = await fetch('/api/journal/insights');
      const d = await res.json();
      if (res.status === 402) { setInsightsError('__gated__'); return; }
      if (!res.ok) throw new Error();
      if (d.ok) setInsights(d.insights);
      else setInsightsNeeded({ count: d.count ?? 0, needed: d.needed ?? 3 });
    } catch {
      setInsightsError('Nova n\'a pas réussi à analyser ton journal. Réessaie dans un instant.');
    } finally {
      setInsightsLoading(false);
    }
  }

  async function loadPeriodSummary(period: 'week' | 'month') {
    setPeriodLoading(period);
    setInsightsError(null);
    try {
      const res = await fetch(`/api/journal/insights?period=${period}`);
      const d = await res.json();
      if (res.status === 402) { setInsightsError('__gated__'); return; }
      if (!res.ok || !d.ok) throw new Error();
      setPeriodSummary(d.summary);
    } catch {
      setInsightsError('Nova n\'a pas réussi à résumer cette période. Réessaie dans un instant.');
    } finally {
      setPeriodLoading(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid var(--gold-line)', borderTopColor: 'var(--gold)' }} />
      </main>
    );
  }

  const showOnboarding = !hasAny && !todayEntry;

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--paper)' }}>
      <header
        className="sticky top-0 z-30 px-4 h-14 flex items-center"
        style={{ background: 'rgba(242,236,222,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}
      >
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
          <span className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>
            📖 Journal
          </span>
          <span className="text-xs" style={{ color: 'var(--gold)' }}>{firstName ? `Salut ${firstName}` : ''}</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {showOnboarding ? (
          <OnboardingFlow onSubmit={persistEntry} saving={saving} />
        ) : (
          /* Entrée du jour */
          <div className="rounded-3xl p-5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b6055' }}>
              {todayEntry ? "Aujourd'hui" : "Comment te sens-tu aujourd'hui ?"}
            </p>

            {todayEntry ? (
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-3xl leading-none">{moodEmoji(todayEntry.mood)}</span>
                    <span className="text-[9px] font-semibold" style={{ color: '#a8a29e' }}>Humeur</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-3xl leading-none">{ENERGY_LEVELS.find((l) => l.value === todayEntry.energy)?.emoji}</span>
                    <span className="text-[9px] font-semibold" style={{ color: '#a8a29e' }}>Énergie</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-3xl leading-none">{STRESS_LEVELS.find((l) => l.value === todayEntry.stress)?.emoji}</span>
                    <span className="text-[9px] font-semibold" style={{ color: '#a8a29e' }}>Stress</span>
                  </div>
                  {todayEntry.emotion && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xl leading-none">{todayEntry.emotion.split(' ')[0]}</span>
                      <span className="text-[9px] font-semibold" style={{ color: '#a8a29e' }}>Émotion</span>
                    </div>
                  )}
                </div>
                {todayEntry.note && (
                  <p className="text-sm mb-2 leading-relaxed whitespace-pre-line" style={{ color: '#6b6055' }}>&ldquo;{todayEntry.note}&rdquo;</p>
                )}
                {reflection && (
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--gold)' }}>✦ {reflection}</p>
                )}
                <p className="text-xs" style={{ color: 'var(--gold)' }}>Déjà noté aujourd&apos;hui ✓</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Humeur</p>
                  <LevelPicker levels={MOODS} selected={selectedMood} onSelect={setSelectedMood} disabled={saving} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Énergie</p>
                  <LevelPicker levels={ENERGY_LEVELS} selected={selectedEnergy} onSelect={setSelectedEnergy} disabled={saving} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Stress</p>
                  <LevelPicker levels={STRESS_LEVELS} selected={selectedStress} onSelect={setSelectedStress} disabled={saving} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Émotion <span style={{ color: '#a8a29e', fontWeight: 400 }}>(optionnel)</span></p>
                  <EmotionPicker selected={selectedEmotion} onSelect={(v) => setSelectedEmotion(v === selectedEmotion ? null : v)} disabled={saving} />
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  disabled={saving}
                  placeholder="Ajoute une note (optionnel)…"
                  rows={2}
                  className="w-full text-sm rounded-xl px-3 py-2 resize-none outline-none"
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                />
                <button
                  onClick={saveEntry}
                  disabled={saving || !selectedMood || !selectedEnergy || !selectedStress}
                  className="ur-btn-gold w-full py-3 text-sm disabled:opacity-40"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer mon jour →'}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-center" style={{ color: '#c2611f' }}>{error}</p>
        )}

        {/* Analyse Nova — tendances + résumé de période, réservés aux abonnés
            ou à la période d'essai découverte (voir lib/journalAccess.ts). */}
        <div className="rounded-3xl p-5" style={{ background: 'var(--ink)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <p className="text-sm font-black" style={{ color: '#FAF6EC' }}>Analyse de Nova</p>
            </div>
            {access.inTrial && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,169,77,0.15)', color: '#e8a94d' }}>
                Essai · {access.trialDaysLeft}j restants
              </span>
            )}
          </div>

          {!access.trendInsights ? (
            <>
              <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(250,246,236,0.55)' }}>
                Débloque les tendances et les résumés de période de Nova avec un abonnement.
              </p>
              <Link href="/pricing" className="ur-btn-gold w-full py-2.5 text-sm inline-flex items-center justify-center">
                Débloquer Nova →
              </Link>
            </>
          ) : (
            <>
              {insights && (
                <div className="space-y-2 mb-3">
                  {insights.map((ins, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: 'rgba(250,246,236,0.85)' }}>✦ {ins}</p>
                  ))}
                </div>
              )}
              {periodSummary && (
                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(250,246,236,0.85)' }}>{periodSummary}</p>
              )}
              {!insights && !periodSummary && insightsNeeded && (
                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(250,246,236,0.55)' }}>
                  Encore {Math.max(0, insightsNeeded.needed - insightsNeeded.count)} jour(s) à noter avant que Nova puisse analyser ton journal.
                </p>
              )}
              {!insights && !periodSummary && !insightsNeeded && (
                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(250,246,236,0.55)' }}>
                  Nova peut repérer des tendances et résumer une période de ton journal.
                </p>
              )}

              {insightsError && insightsError !== '__gated__' && (
                <p className="text-xs mb-3" style={{ color: '#e8a94d' }}>{insightsError}</p>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={loadInsights}
                  disabled={insightsLoading || !!periodLoading}
                  className="py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
                  style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}
                >
                  {insightsLoading ? '…' : 'Tendances'}
                </button>
                <button
                  onClick={() => loadPeriodSummary('week')}
                  disabled={insightsLoading || !!periodLoading}
                  className="py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
                  style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}
                >
                  {periodLoading === 'week' ? '…' : 'Ma semaine'}
                </button>
                <button
                  onClick={() => loadPeriodSummary('month')}
                  disabled={insightsLoading || !!periodLoading}
                  className="py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
                  style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}
                >
                  {periodLoading === 'month' ? '…' : 'Mon mois'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Calendrier émotionnel */}
        {month && (
          <div className="rounded-3xl p-5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => load(shiftMonth(month, -1))} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
                ‹
              </button>
              <p className="text-sm font-bold capitalize" style={{ color: 'var(--ink)' }}>{monthLabel(month)}</p>
              <button
                onClick={() => canGoNext && load(shiftMonth(month, 1))}
                disabled={!canGoNext}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <span key={i} className="text-center text-[10px] font-bold" style={{ color: '#a8a29e' }}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {grid.map((d, i) => {
                if (d === null) return <div key={i} />;
                const e = entryByDay.get(d);
                const isToday = today === `${month}-${String(d).padStart(2, '0')}`;
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center text-[10px]"
                    style={{
                      background: e ? 'var(--gold-soft)' : 'var(--paper)',
                      border: isToday ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                      color: '#6b6055',
                    }}
                  >
                    {e ? <span className="text-sm leading-none">{moodEmoji(e.mood)}</span> : <span>{d}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Historique */}
        {history.length > 0 && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3 px-1" style={{ color: '#6b6055' }}>Historique</p>
            <div className="space-y-2">
              {history.map((e) => (
                <div key={e.day} className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
                  <span className="text-2xl leading-none">{moodEmoji(e.mood)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>
                        {new Date(e.day + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      <span className="text-xs" title="Énergie">{ENERGY_LEVELS.find((l) => l.value === e.energy)?.emoji}</span>
                      <span className="text-xs" title="Stress">{STRESS_LEVELS.find((l) => l.value === e.stress)?.emoji}</span>
                      {e.emotion && <span className="text-xs" title="Émotion">{e.emotion.split(' ')[0]}</span>}
                    </div>
                    {e.note && <p className="text-sm mt-1 leading-relaxed whitespace-pre-line" style={{ color: '#6b6055' }}>&ldquo;{e.note}&rdquo;</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <AppTabBar />
    </main>
  );
}
