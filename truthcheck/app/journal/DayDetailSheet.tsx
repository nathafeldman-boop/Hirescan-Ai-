'use client';

import { useEffect, useRef, useState } from 'react';
import { MOODS, ENERGY_LEVELS, STRESS_LEVELS, EMOTIONS } from '@/lib/journalScales';
import { dailyReaction, type ReflectionEntry } from '@/lib/journalReflection';
import { JOURNAL_TAGS } from '@/lib/journalTags';
import type { JournalEntryFull } from '@/lib/journalTypes';

const MAX_PHOTO_DIMENSION = 900;
const PHOTO_JPEG_QUALITY = 0.72;

// Redimensionne côté client avant l'envoi — évite de dépasser la limite
// serveur (voir MAX_PHOTO_DATA_URI_LENGTH) et garde l'upload rapide sur mobile.
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read_failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode_failed'));
      img.onload = () => {
        const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas_unavailable')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', PHOTO_JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function formatDayLong(day: string): string {
  return new Date(day + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

interface SavedPayload {
  mood: number; energy: number; stress: number;
  emotion?: string; tags?: string[]; photo?: string; note?: string;
}

export default function DayDetailSheet({
  day, isToday, isFuture, previousDayEntry, onClose, onSaved,
}: {
  day: string;
  isToday: boolean;
  isFuture: boolean;
  previousDayEntry: ReflectionEntry | null;
  onClose: () => void;
  onSaved: (entry: JournalEntryFull & { reflection: string }) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState<JournalEntryFull | null>(null);
  const [visible, setVisible] = useState(false);

  // Formulaire (mode édition — jour du jour, pas encore rempli)
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{ entry: JournalEntryFull; reflection: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVisible(true);
    if (isFuture) { setLoading(false); return; }
    fetch(`/api/journal/${day}`)
      .then((r) => r.json())
      .then((d) => setEntry(d.ok ? d.entry : null))
      .catch(() => setEntry(null))
      .finally(() => setLoading(false));
  }, [day, isFuture]);

  function requestClose() {
    setVisible(false);
    setTimeout(onClose, 220);
  }

  async function pickPhoto(file: File | null) {
    if (!file) return;
    setPhotoError(null);
    if (!file.type.startsWith('image/')) { setPhotoError('Choisis une image.'); return; }
    try {
      const dataUri = await compressImageFile(file);
      setPhoto(dataUri);
    } catch {
      setPhotoError("Impossible de charger cette photo. Réessaie.");
    }
  }

  function toggleTag(key: string) {
    setTags((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : prev.length < 7 ? [...prev, key] : prev));
  }

  async function save() {
    if (!mood || !energy || !stress) return;
    setSaving(true);
    setSaveError(null);
    const payload: SavedPayload = {
      mood, energy, stress,
      emotion: emotion ?? undefined,
      tags: tags.length ? tags : undefined,
      photo: photo ?? undefined,
      note: note.trim() || undefined,
    };
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? 'failed');
      setReveal({ entry: d.entry, reflection: d.reflection });
      onSaved({ ...d.entry, reflection: d.reflection });
    } catch {
      setSaveError("L'enregistrement a échoué. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  const viewEntry = reveal?.entry ?? entry;
  const showForm = isToday && !viewEntry && !loading;
  const reactionText = viewEntry ? dailyReaction(viewEntry, previousDayEntry) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: visible ? 'rgba(21,18,31,0.55)' : 'rgba(21,18,31,0)', backdropFilter: visible ? 'blur(4px)' : 'none', transition: 'all .25s ease' }}
      onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-t-[28px] overflow-y-auto"
        style={{
          background: 'var(--paper)', maxHeight: '90vh',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform .28s cubic-bezier(.32,.72,0,1)',
          boxShadow: '0 -12px 40px rgba(21,18,31,0.25)',
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-4 pb-3" style={{ background: 'var(--paper)' }}>
          <div className="w-8 h-1 rounded-full absolute left-1/2 -translate-x-1/2 top-2" style={{ background: 'var(--line)' }} />
          <p className="font-display text-base font-black capitalize mt-2" style={{ color: 'var(--ink)' }}>{formatDayLong(day)}</p>
          <button onClick={requestClose} className="w-8 h-8 rounded-full flex items-center justify-center text-sm mt-2" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
            ✕
          </button>
        </div>

        <div className="px-5 pb-8">
          {isFuture && (
            <p className="text-sm text-center py-10" style={{ color: '#a8a29e' }}>Ce jour n&apos;est pas encore arrivé.</p>
          )}

          {!isFuture && loading && (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 rounded-full animate-spin" style={{ border: '3px solid var(--gold-line)', borderTopColor: 'var(--gold)' }} />
            </div>
          )}

          {!isFuture && !loading && !showForm && !viewEntry && (
            <p className="text-sm text-center py-10" style={{ color: '#a8a29e' }}>Pas de souvenir enregistré ce jour-là.</p>
          )}

          {!isFuture && !loading && viewEntry && (
            <div className="pt-2">
              <div className="flex justify-center mb-5">
                <span className="text-7xl leading-none" style={{ animation: 'dsPopIn .45s cubic-bezier(.34,1.56,.64,1)' }}>
                  {MOODS.find((m) => m.value === viewEntry.mood)?.emoji}
                </span>
              </div>
              <div className="flex items-center justify-center gap-6 mb-5">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl leading-none">{ENERGY_LEVELS.find((l) => l.value === viewEntry.energy)?.emoji}</span>
                  <span className="text-[9px] font-semibold" style={{ color: '#a8a29e' }}>Énergie</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl leading-none">{STRESS_LEVELS.find((l) => l.value === viewEntry.stress)?.emoji}</span>
                  <span className="text-[9px] font-semibold" style={{ color: '#a8a29e' }}>Stress</span>
                </div>
                {viewEntry.emotion && (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-2xl leading-none">{viewEntry.emotion.split(' ')[0]}</span>
                    <span className="text-[9px] font-semibold" style={{ color: '#a8a29e' }}>Émotion</span>
                  </div>
                )}
              </div>

              {!!viewEntry.tags?.length && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {viewEntry.tags.map((tk) => {
                    const t = JOURNAL_TAGS.find((jt) => jt.key === tk);
                    if (!t) return null;
                    return (
                      <span key={tk} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--ink)' }}>
                        {t.emoji} {t.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {viewEntry.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={viewEntry.photo} alt="Photo de la journée" className="w-full rounded-2xl mb-4" style={{ maxHeight: 280, objectFit: 'cover', border: '1px solid var(--line)' }} />
              )}

              {viewEntry.note && (
                <p className="text-sm leading-relaxed whitespace-pre-line text-center mb-4" style={{ color: '#6b6055' }}>&ldquo;{viewEntry.note}&rdquo;</p>
              )}

              {reactionText && (
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--ink), #2a1f0a)',
                    animation: reveal ? 'dsRevealIn .5s cubic-bezier(.34,1.56,.64,1) .1s backwards' : undefined,
                  }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--gold)' }}>✦ Nova</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#FAF6EC' }}>{reactionText}</p>
                </div>
              )}
            </div>
          )}

          {showForm && (
            <div className="pt-2 space-y-5">
              <div>
                <p className="text-xs font-semibold mb-2 text-center" style={{ color: 'var(--ink)' }}>Comment te sens-tu ?</p>
                <div className="grid grid-cols-5 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      disabled={saving}
                      className="flex flex-col items-center gap-1 py-3 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                      style={{
                        background: mood === m.value ? 'var(--gold-soft)' : 'var(--paper-panel)',
                        border: `1px solid ${mood === m.value ? 'var(--gold-line)' : 'var(--line)'}`,
                        transform: mood === m.value ? 'scale(1.08)' : 'none',
                      }}
                    >
                      <span className="text-3xl leading-none">{m.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Énergie</p>
                <div className="grid grid-cols-5 gap-2">
                  {ENERGY_LEVELS.map((l) => (
                    <button key={l.value} onClick={() => setEnergy(l.value)} disabled={saving}
                      className="flex flex-col items-center py-2 rounded-xl transition-all active:scale-95"
                      style={{ background: energy === l.value ? 'var(--gold-soft)' : 'var(--paper-panel)', border: `1px solid ${energy === l.value ? 'var(--gold-line)' : 'var(--line)'}` }}>
                      <span className="text-xl leading-none">{l.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Stress</p>
                <div className="grid grid-cols-5 gap-2">
                  {STRESS_LEVELS.map((l) => (
                    <button key={l.value} onClick={() => setStress(l.value)} disabled={saving}
                      className="flex flex-col items-center py-2 rounded-xl transition-all active:scale-95"
                      style={{ background: stress === l.value ? 'var(--gold-soft)' : 'var(--paper-panel)', border: `1px solid ${stress === l.value ? 'var(--gold-line)' : 'var(--line)'}` }}>
                      <span className="text-xl leading-none">{l.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Émotion <span style={{ color: '#a8a29e', fontWeight: 400 }}>(optionnel)</span></p>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map((e) => (
                    <button key={e} onClick={() => setEmotion(e === emotion ? null : e)} disabled={saving}
                      className="px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
                      style={{ background: emotion === e ? 'var(--gold-soft)' : 'var(--paper-panel)', border: `1px solid ${emotion === e ? 'var(--gold-line)' : 'var(--line)'}`, color: 'var(--ink)' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Tags <span style={{ color: '#a8a29e', fontWeight: 400 }}>(optionnel)</span></p>
                <div className="flex flex-wrap gap-2">
                  {JOURNAL_TAGS.map((t) => (
                    <button key={t.key} onClick={() => toggleTag(t.key)} disabled={saving}
                      className="px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
                      style={{ background: tags.includes(t.key) ? 'var(--gold-soft)' : 'var(--paper-panel)', border: `1px solid ${tags.includes(t.key) ? 'var(--gold-line)' : 'var(--line)'}`, color: 'var(--ink)' }}>
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink)' }}>Photo de ta journée <span style={{ color: '#a8a29e', fontWeight: 400 }}>(optionnel)</span></p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { void pickPhoto(e.target.files?.[0] ?? null); e.target.value = ''; }} />
                {photo ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="Photo choisie" className="rounded-xl" style={{ height: 96, width: 96, objectFit: 'cover', border: '1px solid var(--line)' }} />
                    <button type="button" onClick={() => setPhoto(null)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--ink)', color: '#FAF6EC' }}>✕</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={saving}
                    className="w-full py-3 rounded-xl text-xs font-semibold" style={{ border: '1px dashed var(--line)', color: '#78716c' }}>
                    📷 Ajouter une photo
                  </button>
                )}
                {photoError && <p className="text-[11px] mt-2" style={{ color: '#c2611f' }}>{photoError}</p>}
              </div>

              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 800))}
                  disabled={saving}
                  placeholder="Raconte ta journée (optionnel)…"
                  rows={3}
                  className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none"
                  style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                />
              </div>

              {saveError && <p className="text-xs text-center" style={{ color: '#c2611f' }}>{saveError}</p>}

              <button onClick={save} disabled={saving || !mood || !energy || !stress} className="ur-btn-gold w-full py-3.5 text-sm disabled:opacity-40">
                {saving ? 'Enregistrement…' : 'Enregistrer mon jour →'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dsPopIn { from { opacity:0; transform:scale(.4) rotate(-8deg) } to { opacity:1; transform:scale(1) rotate(0) } }
        @keyframes dsRevealIn { from { opacity:0; transform:translateY(10px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
