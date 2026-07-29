'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ElioAvatar from '@/components/ElioAvatar';
import { AGE_RANGES, GENDERS, ONBOARDING_REASONS, ONBOARDING_FOCUS_OPTIONS } from '@/lib/onboardingFunnel';

const STEPS = 5;

// Sélecteur en chips — repris du pattern déjà utilisé pour le premier Journal
// (voir OnboardingFlow dans app/journal/JournalClient.tsx), pour que l'accueil
// et le premier pas dans le Journal se sentent comme UNE seule expérience
// continue plutôt que deux écrans dessinés séparément.
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 text-left"
      style={{
        background: selected ? 'var(--gold-soft)' : 'var(--paper)',
        border: `1px solid ${selected ? 'var(--gold-line)' : 'var(--line)'}`,
        color: 'var(--ink)',
      }}
    >
      {label}
    </button>
  );
}

export default function BienvenueClient({ prefillName }: { prefillName: string | null }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(prefillName ?? '');
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [focus, setFocus] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const advance = () => setStep((s) => s + 1);
  const toggleFocus = (v: string) => setFocus((prev) => (prev.includes(v) ? prev.filter((f) => f !== v) : [...prev, v]));

  async function finish() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, ageRange, gender, reason, focus }),
      });
      if (!res.ok) throw new Error();
      router.push('/journal');
    } catch {
      setError('Une erreur est survenue, réessaie.');
      setSaving(false);
    }
  }

  const progress = (step + 1) / STEPS;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-10" style={{ background: 'var(--paper)' }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <ElioAvatar size={56} glow />
          <p className="ur-label text-[10px] mt-3" style={{ color: 'var(--gold)' }}>Avant de commencer</p>
        </div>

        <div className="rounded-3xl p-6" style={{ background: 'var(--gold-soft)', border: '1px dashed var(--gold-line)' }}>
          <div className="flex items-center gap-1.5 mb-5">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: i <= step ? 'var(--gold)' : 'var(--line)' }} />
            ))}
          </div>

          {step === 0 && (
            <>
              <p className="font-display text-lg font-black mb-1" style={{ color: 'var(--ink)' }}>Comment tu t&apos;appelles ?</p>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: '#6b6055' }}>
                Pour qu&apos;Elio et le reste d&apos;UrCecret te parlent vraiment à toi, pas à un compte anonyme.
              </p>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 40))}
                placeholder="Ton prénom"
                className="w-full text-sm rounded-xl px-4 py-3 outline-none mb-4"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) advance(); }}
              />
              <button onClick={advance} disabled={!name.trim()} className="ur-btn-gold w-full py-3 text-sm disabled:opacity-40">
                Continuer →
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <p className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Ton âge ?</p>
              <div className="flex flex-wrap gap-2">
                {AGE_RANGES.map((a) => (
                  <Chip key={a} label={a} selected={ageRange === a} onClick={() => { setAgeRange(a); advance(); }} />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Ton genre ?</p>
              <div className="flex flex-col gap-2">
                {GENDERS.map((g) => (
                  <Chip key={g} label={g} selected={gender === g} onClick={() => { setGender(g); advance(); }} />
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="font-display text-lg font-black mb-1" style={{ color: 'var(--ink)' }}>Pourquoi tu viens sur UrCecret ?</p>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6b6055' }}>Il n&apos;y a pas de mauvaise réponse.</p>
              <div className="flex flex-col gap-2">
                {ONBOARDING_REASONS.map((r) => (
                  <Chip key={r} label={r} selected={reason === r} onClick={() => { setReason(r); advance(); }} />
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="font-display text-lg font-black mb-1" style={{ color: 'var(--ink)' }}>Qu&apos;est-ce que tu veux améliorer ?</p>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6b6055' }}>Choisis-en autant que tu veux.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {ONBOARDING_FOCUS_OPTIONS.map((f) => (
                  <Chip key={f} label={f} selected={focus.includes(f)} onClick={() => toggleFocus(f)} />
                ))}
              </div>
              {error && <p className="text-xs text-center mb-3" style={{ color: '#dc2626' }}>{error}</p>}
              <button onClick={finish} disabled={saving} className="ur-btn-gold w-full py-3 text-sm disabled:opacity-50">
                {saving ? 'Un instant…' : 'C\'est parti →'}
              </button>
            </>
          )}

          <p className="text-[10px] text-center mt-4" style={{ color: '#a8a29e' }}>{Math.round(progress * 100)}%</p>
        </div>
      </div>
    </main>
  );
}
