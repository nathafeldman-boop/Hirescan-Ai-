'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppTabBar from '@/components/AppTabBar';
import DayDetailSheet from './DayDetailSheet';
import { EmotionRadar, MoodHeatmap } from './JournalCharts';
import { MOODS, ENERGY_LEVELS, STRESS_LEVELS, EMOTIONS, moodEmoji } from '@/lib/journalScales';
import {
  computeStreak, averageMoodOutOf10, moodEvolutionPct, bestAndWorstWeek, tagFrequency, tagCorrelationInsight,
  detectMoodAlert, type StatsEntry,
} from '@/lib/journalStats';
import { dailyReaction, firstEntryReply } from '@/lib/journalReflection';
import ElioAvatar from '@/components/ElioAvatar';
import QuestCelebration, { type QuestCelebrationItem } from '@/components/QuestCelebration';
import type { JournalEntryLite } from '@/lib/journalTypes';

type Entry = JournalEntryLite;
type JournalAccess = { trendInsights: boolean; history: boolean; inTrial: boolean; trialDaysLeft: number };

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

// Anime un nombre de 0 (ou de sa valeur précédente) vers `value` — l'effet
// "chiffres qui évoluent" demandé pour les cartes du dashboard.
function useCountUp(value: number | null, duration = 900): number {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  useEffect(() => {
    if (value === null) return;
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display;
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
// Expérience complète (7 étapes) — humeur, énergie, stress, émotion dominante,
// puis 3 questions courtes (marquant/heureux/dérangé, combinées dans la note
// de l'entrée). Une vraie utilisatrice a signalé qu'une version réduite
// donnait une impression de valeur amoindrie — ne plus jamais raccourcir ce
// parcours pour "gagner du temps".
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
      mood: mood!, energy: energy!, stress: stress!,
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
            6 questions rapides pour qu&apos;Elio commence à te connaître — moins d&apos;une minute.
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
          <textarea value={highlight} onChange={(e) => setHighlight(e.target.value.slice(0, 200))} rows={2}
            placeholder="Un événement, une rencontre, une pensée…"
            className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none mb-3"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          <button onClick={advance} disabled={saving} className="ur-btn-gold w-full py-3 text-sm">Continuer →</button>
        </>
      )}
      {step === 5 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Qu&apos;est-ce qui t&apos;a rendu heureux ?</p>
          <textarea value={happy} onChange={(e) => setHappy(e.target.value.slice(0, 200))} rows={2}
            placeholder="Optionnel…"
            className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none mb-3"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          <button onClick={advance} disabled={saving} className="ur-btn-gold w-full py-3 text-sm">Continuer →</button>
        </>
      )}
      {step === 6 && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Qu&apos;est-ce qui t&apos;a dérangé ?</p>
          <textarea value={bother} onChange={(e) => setBother(e.target.value.slice(0, 200))} rows={2}
            placeholder="Optionnel…"
            className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none mb-3"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          <button onClick={finish} disabled={saving} className="ur-btn-gold w-full py-3 text-sm disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Terminer mon premier jour →'}
          </button>
        </>
      )}

      <p className="text-[10px] text-center mt-4" style={{ color: '#a8a29e' }}>{Math.round(progress * 100)}% — presque fini</p>
    </div>
  );
}

// ── Réponse d'Elio à la toute première entrée — LE moment qui doit faire
// penser "cette appli me comprend", avant même de parler d'abonnement. Voir
// lib/journalReflection.ts::firstEntryReply (déterministe, jamais un appel
// IA ici — la réponse doit être instantanée).
function ElioFirstReplyStep({ message, onContinue }: { message: string; onContinue: () => void }) {
  return (
    <div className="rounded-3xl p-6" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', animation: 'jCardIn .4s cubic-bezier(.22,1,.36,1)' }}>
      <div className="flex items-start gap-3 mb-5">
        <div className="flex-shrink-0"><ElioAvatar size={36} speaking /></div>
        <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{message}</p>
        </div>
      </div>
      <button onClick={onContinue} className="ur-btn-gold w-full py-3 text-sm">Continuer →</button>
    </div>
  );
}

// ── Rappel quotidien — proposé UNE fois, juste après la toute première entrée ──
// Volontairement un seul choix binaire (pas de créneau à choisir) : la
// friction tue l'habitude à ce stade. Le rappel part par email à 20h, heure
// de Paris (voir app/api/cron/journal-reminder/route.ts) — activable/
// désactivable ensuite depuis le Journal (voir le bouton 🔔 dans l'en-tête).
function ReminderPrompt({ onDone }: { onDone: () => void }) {
  const [saving, setSaving] = useState(false);

  async function activate() {
    setSaving(true);
    try { await fetch('/api/notifications/reminder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: true }) }); }
    catch {}
    finally { onDone(); }
  }

  return (
    <div className="rounded-3xl p-6 text-center" style={{ background: 'var(--gold-soft)', border: '1px dashed var(--gold-line)', animation: 'jCardIn .4s cubic-bezier(.22,1,.36,1)' }}>
      <span className="text-3xl leading-none">🔔</span>
      <p className="font-display text-lg font-black mt-3 mb-1" style={{ color: 'var(--ink)' }}>Ton premier jour est noté</p>
      <p className="text-sm mb-5 leading-relaxed" style={{ color: '#6b6055' }}>
        Un petit rappel chaque soir à 20h : <em>« Ton moment pour faire le point sur toi. »</em>
      </p>
      <button onClick={activate} disabled={saving} className="ur-btn-gold w-full py-3 text-sm mb-2 disabled:opacity-50">
        {saving ? 'Activation…' : 'Activer le rappel (20h) →'}
      </button>
      <button onClick={onDone} disabled={saving} className="w-full py-2.5 text-xs font-semibold" style={{ color: '#a8a29e' }}>
        Plus tard
      </button>
    </div>
  );
}

// Carte de stat animée — entrée en fondu/translation décalée par index, gros
// chiffre qui "compte" jusqu'à sa valeur. Le moment "dashboard" pensé pour
// être filmé (voir demande produit "TikTok first").
function StatCard({ icon, label, value, suffix, delay, accent }: { icon: string; label: string; value: number | null; suffix?: string; delay: number; accent?: boolean }) {
  const display = useCountUp(value);
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: accent ? 'linear-gradient(135deg, var(--ink), #2a1f0a)' : 'var(--paper-panel)',
        border: accent ? 'none' : '1px solid var(--line)',
        animation: `jCardIn .5s cubic-bezier(.22,1,.36,1) ${delay}ms backwards`,
      }}
    >
      {accent && <div className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30" style={{ background: 'var(--gold)' }} />}
      <div className="relative z-10">
        <span className="text-xl leading-none">{icon}</span>
        <p className="font-display text-2xl font-black mt-2 tabular-nums" style={{ color: accent ? '#FAF6EC' : 'var(--ink)' }}>
          {value === null ? '—' : `${Number.isInteger(value) ? Math.round(display) : display.toFixed(1)}${suffix ?? ''}`}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: accent ? 'rgba(250,246,236,0.6)' : '#a8a29e' }}>{label}</p>
      </div>
    </div>
  );
}

export default function JournalClient({ firstName, access, wantsDailyReminder }: { firstName: string | null; access: JournalAccess; wantsDailyReminder: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showReminderPrompt, setShowReminderPrompt] = useState(false);
  const [firstReplyMessage, setFirstReplyMessage] = useState<string | null>(null);
  const [newlyCompletedQuests, setNewlyCompletedQuests] = useState<QuestCelebrationItem[]>([]);
  const [reminderOn, setReminderOn] = useState(wantsDailyReminder);
  const [reminderToggling, setReminderToggling] = useState(false);
  const [month, setMonth] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [allEntries, setAllEntries] = useState<StatsEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasAny, setHasAny] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);

  const [insights, setInsights] = useState<string[] | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [insightsNeeded, setInsightsNeeded] = useState<{ count: number; needed: number } | null>(null);
  const [periodSummary, setPeriodSummary] = useState<string | null>(null);
  const [periodLoading, setPeriodLoading] = useState<'week' | 'month' | null>(null);
  const [wrappedOpen, setWrappedOpen] = useState<'week' | 'month' | null>(null);

  const load = (m?: string) => {
    setLoading(true);
    setError(null);
    fetch(`/api/journal${m ? `?month=${m}` : ''}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {
        setMonth(d.month);
        setToday(d.today);
        setEntries(d.entries);
        setAllEntries(d.allEntries);
        setHasAny(d.hasAny);
        setTotalCount(d.totalCount);
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
  const allByDay = useMemo(() => new Map(allEntries.map((e) => [e.day, e])), [allEntries]);
  const canGoNext = month !== null && today !== null && month < today.slice(0, 7);
  const timeline = useMemo(
    () => [...entries].sort((a, b) => (a.day < b.day ? 1 : -1)).slice(0, 10),
    [entries],
  );

  function prevDayEntry(day: string) {
    const d = new Date(day + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return allByDay.get(d.toISOString().slice(0, 10)) ?? null;
  }

  const streak = useMemo(() => (today ? computeStreak(allEntries, today) : null), [allEntries, today]);
  const avgMood = useMemo(() => averageMoodOutOf10(allEntries), [allEntries]);
  const evolution = useMemo(() => moodEvolutionPct(allEntries), [allEntries]);
  const correlation = useMemo(() => tagCorrelationInsight(allEntries), [allEntries]);
  const { best: bestWeek, worst: worstWeek } = useMemo(() => bestAndWorstWeek(allEntries), [allEntries]);
  const radarPoints = useMemo(() => tagFrequency(allEntries), [allEntries]);
  const moodAlert = useMemo(() => detectMoodAlert(allEntries), [allEntries]);
  const topTag = useMemo(() => {
    const top = [...radarPoints].sort((a, b) => b.value - a.value)[0];
    return top && top.value > 0 ? top : null;
  }, [radarPoints]);
  const wrappedImageUrl = useMemo(() => {
    if (!wrappedOpen) return '';
    const params = new URLSearchParams({ period: wrappedOpen, streak: String(streak ?? 0), mood: String(avgMood ?? '—') });
    if (firstName) params.set('name', firstName);
    if (evolution !== null) params.set('evolution', String(evolution));
    if (topTag) { params.set('tagEmoji', topTag.emoji); params.set('tagLabel', topTag.label); }
    return `/api/journal/wrapped-image?${params.toString()}`;
  }, [wrappedOpen, streak, avgMood, evolution, topTag, firstName]);

  async function persistEntry(payload: SavedPayload) {
    const isFirstEver = !hasAny;
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
      await load(month ?? undefined);
      // Première entrée jamais créée par ce compte : Elio répond d'abord
      // (voir ElioFirstReplyStep) — LE moment de connexion émotionnelle —
      // puis on propose le rappel quotidien, puis seulement on renvoie vers
      // le Hub (voir le funnel décrit dans DecouverteClient.tsx). Jamais
      // EMPILER ça avec la célébration de quête (ex. "premier journal") —
      // un seul moment fort à la fois.
      if (isFirstEver) {
        setFirstReplyMessage(firstEntryReply(payload.mood, firstName));
      } else if (Array.isArray(d?.newlyCompletedQuests) && d.newlyCompletedQuests.length > 0) {
        setNewlyCompletedQuests(d.newlyCompletedQuests);
      }
    } catch {
      setError("L'enregistrement a échoué. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleReminder() {
    const next = !reminderOn;
    setReminderOn(next);
    setReminderToggling(true);
    try {
      await fetch('/api/notifications/reminder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: next }) });
    } catch {
      setReminderOn(!next); // rollback si l'appel échoue
    } finally {
      setReminderToggling(false);
    }
  }

  function handleSheetSaved() {
    // Le sheet a déjà persisté côté serveur — on recharge pour resynchroniser
    // calendrier/stats/timeline avec la nouvelle entrée (photo comprise).
    load(month ?? undefined);
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
      setInsightsError('Elio n\'a pas réussi à analyser ton journal. Réessaie dans un instant.');
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
      setInsightsError('Elio n\'a pas réussi à résumer cette période. Réessaie dans un instant.');
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
      <style>{`
        @keyframes jCardIn { from { opacity:0; transform:translateY(10px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes jCellIn { from { opacity:0; transform:scale(.5) } to { opacity:1; transform:scale(1) } }
      `}</style>

      <header className="sticky top-0 z-30 px-4 h-14 flex items-center" style={{ background: 'rgba(242,236,222,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
          <span className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>📖 Journal</span>
          <div className="flex items-center gap-3">
            {!showOnboarding && !showReminderPrompt && !firstReplyMessage && (
              <button
                onClick={toggleReminder}
                disabled={reminderToggling}
                title={reminderOn ? 'Rappel quotidien activé (20h)' : 'Activer un rappel quotidien'}
                aria-label={reminderOn ? 'Désactiver le rappel quotidien' : 'Activer le rappel quotidien'}
                className="w-7 h-7 flex items-center justify-center text-sm rounded-full transition-all disabled:opacity-50"
                style={{ background: reminderOn ? 'var(--gold-soft)' : 'transparent', border: reminderOn ? '1px solid var(--gold-line)' : '1px solid transparent' }}
              >
                {reminderOn ? '🔔' : '🔕'}
              </button>
            )}
            <span className="text-xs" style={{ color: 'var(--gold)' }}>{firstName ? `Salut ${firstName}` : ''}</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {firstReplyMessage ? (
          <ElioFirstReplyStep message={firstReplyMessage} onContinue={() => { setFirstReplyMessage(null); setShowReminderPrompt(true); }} />
        ) : showReminderPrompt ? (
          <ReminderPrompt onDone={() => { setShowReminderPrompt(false); router.push('/decouverte'); }} />
        ) : showOnboarding ? (
          <OnboardingFlow onSubmit={persistEntry} saving={saving} />
        ) : (
          <>
            {/* Dashboard — 4 cartes animées, le moment "waouh" en 2 secondes */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon="🔥" label={streak === 1 ? 'Jour de série' : 'Jours de série'} value={streak} delay={0} accent />
              <StatCard icon="❤️" label="Bonheur moyen" value={avgMood} suffix="/10" delay={70} />
              <StatCard icon="📈" label="Évolution" value={evolution} suffix="%" delay={140} />
              <div
                className="rounded-2xl p-4"
                style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', animation: 'jCardIn .5s cubic-bezier(.22,1,.36,1) 210ms backwards' }}
              >
                <span className="text-xl leading-none">🧠</span>
                <p className="text-[11px] font-black mt-2 leading-snug" style={{ color: 'var(--ink)' }}>
                  {correlation ?? 'Continue à noter tes journées pour débloquer un insight.'}
                </p>
              </div>
            </div>

            {/* Alerte proactive — détection déterministe, contenu réservé aux abonnés */}
            {moodAlert && (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
                <span className="text-xl leading-none flex-shrink-0">{access.history ? moodAlert.emoji : '🔒'}</span>
                <div className="flex-1 min-w-0">
                  {access.history ? (
                    <>
                      <p className="text-sm font-bold leading-snug" style={{ color: 'var(--ink)' }}>{moodAlert.text}</p>
                      <Link href="/chat" className="text-xs font-bold mt-0.5 inline-block" style={{ color: 'var(--gold)' }}>En parler à Elio →</Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold leading-snug" style={{ color: 'var(--ink)' }}>Elio a repéré quelque chose dans tes dernières entrées.</p>
                      <Link href="/pricing" className="text-xs font-bold mt-0.5 inline-block" style={{ color: 'var(--gold)' }}>Débloquer pour voir →</Link>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Aujourd'hui — un tap ouvre la fiche du jour */}
            <button
              onClick={() => setOpenDay(today)}
              className="w-full rounded-3xl p-5 text-left transition-all active:scale-[0.98]"
              style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
            >
              {todayEntry ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl leading-none">{moodEmoji(todayEntry.mood)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: 'var(--gold)' }}>Aujourd&apos;hui · noté ✓</p>
                    <p className="text-sm mt-0.5 leading-snug" style={{ color: '#6b6055' }}>{dailyReaction(todayEntry, prevDayEntry(todayEntry.day))}</p>
                  </div>
                  <span style={{ color: '#a8a29e' }}>→</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-4xl leading-none">📝</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>Comment s&apos;est passée ta journée ?</p>
                    <p className="text-xs mt-0.5" style={{ color: '#a8a29e' }}>Humeur, énergie, stress, photo…</p>
                  </div>
                  <span style={{ color: 'var(--gold)' }}>→</span>
                </div>
              )}
            </button>
          </>
        )}

        {error && <p className="text-xs text-center" style={{ color: '#c2611f' }}>{error}</p>}

        {!showOnboarding && month && (
          <>
            {/* Calendrier émotionnel premium */}
            <div
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, var(--paper-panel), var(--paper))', border: '1px solid var(--line)', boxShadow: '0 8px 28px rgba(21,18,31,0.06)' }}
            >
              <div className="flex items-center justify-between mb-4">
                {access.history ? (
                  <button onClick={() => load(shiftMonth(month, -1))} className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90" style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}>‹</button>
                ) : (
                  <Link href="/pricing" className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90" style={{ background: 'var(--paper)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }} title="Débloquer l'historique du calendrier">🔒</Link>
                )}
                <p className="text-sm font-bold capitalize" style={{ color: 'var(--ink)' }}>{monthLabel(month)}</p>
                <button onClick={() => canGoNext && load(shiftMonth(month, 1))} disabled={!canGoNext} className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30" style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}>›</button>
              </div>
              {!access.history && (
                <p className="text-[10px] text-center mb-2" style={{ color: '#a8a29e' }}>
                  Mois précédents réservés aux abonnés — <Link href="/pricing" className="font-bold" style={{ color: 'var(--gold)' }}>débloquer →</Link>
                </p>
              )}

              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <span key={i} className="text-center text-[10px] font-bold" style={{ color: '#a8a29e' }}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {grid.map((d, i) => {
                  if (d === null) return <div key={i} />;
                  const dayKey = `${month}-${String(d).padStart(2, '0')}`;
                  const e = entryByDay.get(d);
                  const isToday = today === dayKey;
                  return (
                    <button
                      key={i}
                      onClick={() => setOpenDay(dayKey)}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] transition-transform active:scale-90"
                      style={{
                        background: e ? 'linear-gradient(160deg, var(--gold-soft), rgba(201,162,39,0.18))' : 'var(--paper)',
                        border: isToday ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                        color: '#6b6055',
                        boxShadow: e ? '0 2px 8px rgba(201,162,39,0.15)' : 'none',
                        animation: `jCellIn .3s cubic-bezier(.22,1,.36,1) ${i * 12}ms backwards`,
                      }}
                    >
                      {e ? <span className="text-base leading-none">{moodEmoji(e.mood)}</span> : <span>{d}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-3 px-1" style={{ color: '#6b6055' }}>Timeline</p>
                <div className="relative pl-4 space-y-4">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: 'var(--line)' }} />
                  {timeline.map((e) => (
                    <button
                      key={e.day}
                      onClick={() => setOpenDay(e.day)}
                      className="relative w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
                      style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
                    >
                      <div className="absolute -left-4 top-5 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--gold)' }} />
                      <div className="flex items-start gap-3">
                        <span className="text-2xl leading-none">{moodEmoji(e.mood)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold capitalize" style={{ color: 'var(--ink)' }}>
                            {e.day === today ? "Aujourd'hui" : new Date(e.day + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </p>
                          {e.note && <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: '#6b6055' }}>&ldquo;{e.note.split('\n')[0]}&rdquo;</p>}
                          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--gold)' }}>✦ {dailyReaction(e, prevDayEntry(e.day))}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats détaillées — série/moyenne gratuites, recul multi-semaines réservé */}
            <div className="rounded-3xl p-5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: '#6b6055' }}>Tes statistiques</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Jours remplis', value: totalCount },
                  { label: 'Série actuelle', value: streak ?? 0 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl px-3.5 py-3" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
                    <p className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>{s.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#a8a29e' }}>{s.label}</p>
                  </div>
                ))}
                {access.history ? (
                  <>
                    <div className="rounded-xl px-3.5 py-3" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
                      <p className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>{bestWeek ? `${bestWeek.avgMood}/5` : '—'}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#a8a29e' }}>Meilleure semaine</p>
                    </div>
                    <div className="rounded-xl px-3.5 py-3" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
                      <p className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>{worstWeek ? `${worstWeek.avgMood}/5` : '—'}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#a8a29e' }}>Semaine difficile</p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 rounded-xl px-3.5 py-3 flex items-center justify-between gap-3" style={{ background: 'var(--paper)', border: '1px dashed var(--gold-line)' }}>
                    <p className="text-[11px] leading-snug" style={{ color: '#6b6055' }}>🔒 Meilleure/pire semaine, radar émotionnel & heatmap réservés aux abonnés.</p>
                    <Link href="/pricing" className="ur-btn-gold text-[11px] px-3 py-2 whitespace-nowrap flex-shrink-0">Débloquer</Link>
                  </div>
                )}
              </div>

              {access.history && (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b6055' }}>Radar émotionnel</p>
                  <div className="flex justify-center mb-5">
                    <EmotionRadar points={radarPoints} />
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b6055' }}>Heatmap (12 dernières semaines)</p>
                  {today && <MoodHeatmap entries={allEntries} today={today} />}
                </>
              )}
            </div>

            {/* Bilan Wrapped — résumé visuel partageable, même palier que l'historique */}
            <div className="rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, var(--ink), #2a1f0a)' }}>
              <p className="text-sm font-black mb-1" style={{ color: '#FAF6EC' }}>🎁 Ton bilan</p>
              {access.history ? (
                <>
                  <p className="text-xs mb-3" style={{ color: 'rgba(250,246,236,0.55)' }}>Un résumé visuel de ta période, prêt à partager.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setWrappedOpen('week')} className="py-2.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}>Ma semaine</button>
                    <button onClick={() => setWrappedOpen('month')} className="py-2.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}>Mon mois</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs mb-3" style={{ color: 'rgba(250,246,236,0.55)' }}>Débloque un résumé visuel de ta semaine ou de ton mois, à partager où tu veux.</p>
                  <Link href="/pricing" className="ur-btn-gold w-full py-2.5 text-sm inline-flex items-center justify-center">Débloquer →</Link>
                </>
              )}
            </div>

            {/* Analyse Elio — tendances + résumé de période, gated (voir lib/journalAccess.ts) */}
            <div className="rounded-3xl p-5" style={{ background: 'var(--ink)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <p className="text-sm font-black" style={{ color: '#FAF6EC' }}>Analyse d&apos;Elio</p>
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
                    Débloque les tendances et les résumés de période d&apos;Elio avec un abonnement.
                  </p>
                  <Link href="/pricing" className="ur-btn-gold w-full py-2.5 text-sm inline-flex items-center justify-center">
                    Débloquer Elio →
                  </Link>
                </>
              ) : (
                <>
                  {insights && (
                    <div className="space-y-2 mb-3">
                      {insights.map((ins, i) => <p key={i} className="text-sm leading-relaxed" style={{ color: 'rgba(250,246,236,0.85)' }}>✦ {ins}</p>)}
                    </div>
                  )}
                  {periodSummary && <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(250,246,236,0.85)' }}>{periodSummary}</p>}
                  {!insights && !periodSummary && insightsNeeded && (
                    <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(250,246,236,0.55)' }}>
                      Encore {Math.max(0, insightsNeeded.needed - insightsNeeded.count)} jour(s) à noter avant qu&apos;Elio puisse analyser ton journal.
                    </p>
                  )}
                  {!insights && !periodSummary && !insightsNeeded && (
                    <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(250,246,236,0.55)' }}>
                      Elio peut repérer des tendances et résumer une période de ton journal.
                    </p>
                  )}
                  {insightsError && insightsError !== '__gated__' && <p className="text-xs mb-3" style={{ color: '#e8a94d' }}>{insightsError}</p>}

                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={loadInsights} disabled={insightsLoading || !!periodLoading} className="py-2.5 rounded-xl text-xs font-bold disabled:opacity-50" style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}>
                      {insightsLoading ? '…' : 'Tendances'}
                    </button>
                    <button onClick={() => loadPeriodSummary('week')} disabled={insightsLoading || !!periodLoading} className="py-2.5 rounded-xl text-xs font-bold disabled:opacity-50" style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}>
                      {periodLoading === 'week' ? '…' : 'Ma semaine'}
                    </button>
                    <button onClick={() => loadPeriodSummary('month')} disabled={insightsLoading || !!periodLoading} className="py-2.5 rounded-xl text-xs font-bold disabled:opacity-50" style={{ background: 'rgba(232,169,77,0.12)', border: '1px solid rgba(232,169,77,0.25)', color: '#e8a94d' }}>
                      {periodLoading === 'month' ? '…' : 'Mon mois'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

      </div>

      {openDay && today && (
        <DayDetailSheet
          day={openDay}
          isToday={openDay === today}
          isFuture={openDay > today}
          previousDayEntry={prevDayEntry(openDay)}
          onClose={() => setOpenDay(null)}
          onSaved={handleSheetSaved}
        />
      )}

      {wrappedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(21,18,31,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setWrappedOpen(null)}>
          <div
            className="relative w-full max-w-xs rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #15121F 0%, #1F1B2E 55%, #15121F 100%)', border: '1px solid rgba(201,162,39,0.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setWrappedOpen(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>✕</button>
            <div className="p-8 pt-14 flex flex-col items-center text-center">
              <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'rgba(250,246,236,0.5)' }}>Bilan de {wrappedOpen === 'month' ? 'ton mois' : 'ta semaine'}</p>
              <p className="font-display text-lg font-black mb-6" style={{ color: '#FAF6EC' }}>{firstName ? `Salut ${firstName} ✦` : '✦'}</p>
              <div className="w-full flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <span className="text-2xl">🔥</span>
                  <div className="text-left"><p className="text-xl font-black" style={{ color: '#FAF6EC' }}>{streak ?? 0}</p><p className="text-[10px]" style={{ color: 'rgba(250,246,236,0.5)' }}>jours de série</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <span className="text-2xl">❤️</span>
                  <div className="text-left"><p className="text-xl font-black" style={{ color: '#FAF6EC' }}>{avgMood ?? '—'}/10</p><p className="text-[10px]" style={{ color: 'rgba(250,246,236,0.5)' }}>bonheur moyen</p></div>
                </div>
                {evolution !== null && (
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.2)' }}>
                    <span className="text-2xl">📈</span>
                    <div className="text-left"><p className="text-xl font-black" style={{ color: '#FAF6EC' }}>{evolution}%</p><p className="text-[10px]" style={{ color: 'rgba(250,246,236,0.5)' }}>évolution</p></div>
                  </div>
                )}
                {topTag && (
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.2)' }}>
                    <span className="text-2xl">{topTag.emoji}</span>
                    <div className="text-left"><p className="text-sm font-black" style={{ color: '#FAF6EC' }}>{topTag.label}</p><p className="text-[10px]" style={{ color: 'rgba(250,246,236,0.5)' }}>ton thème dominant</p></div>
                  </div>
                )}
              </div>
              <a href={wrappedImageUrl} download target="_blank" rel="noopener noreferrer" className="ur-btn-gold w-full py-3 text-sm inline-flex items-center justify-center">
                Télécharger l&apos;image →
              </a>
            </div>
          </div>
        </div>
      )}

      <QuestCelebration quests={newlyCompletedQuests} onClose={() => setNewlyCompletedQuests([])} />

      <AppTabBar />
    </main>
  );
}
