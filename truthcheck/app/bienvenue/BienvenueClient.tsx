'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ElioAvatar from '@/components/ElioAvatar';
import { AGE_RANGES, GENDERS, ONBOARDING_GOALS, ONBOARDING_INTERESTS } from '@/lib/onboardingFunnel';

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
  const [interest, setInterest] = useState<string | null>(null);
  const [interestConfirmed, setInterestConfirmed] = useState(false);
  const [goal, setGoal] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const advance = () => setStep((s) => s + 1);

  // Confirmation courte avant d'avancer — pas un vrai palier de progression
  // (la barre ne bouge qu'à l'advance() final), juste de quoi rassurer
  // immédiatement le trafic à intention précise (ex. pub Google Ads "test
  // MBTI") sur le fait qu'il va bien y arriver, sans attendre la fin du
  // funnel pour le découvrir.
  function chooseInterest(value: string) {
    setInterest(value);
    setInterestConfirmed(true);
    setTimeout(() => {
      setInterestConfirmed(false);
      advance();
    }, 1400);
  }

  async function finish(selectedGoal: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, ageRange, gender, interest, goal: selectedGoal }),
      });
      if (!res.ok) throw new Error();
      // Direct vers le test MBTI pour TOUT LE MONDE, plus seulement ceux qui
      // ont choisi "Mon test de personnalité" à l'étape précédente — décision
      // du 07/08 après test réel du funnel : atterrir sur le Journal sans être
      // jamais passé par le test ne montrait à personne ce qui fait l'identité
      // du produit. /quiz/personnalite gère déjà toute la suite (paywall →
      // "continuer gratuitement" vers /journal, ou achat → /types/[type]),
      // donc rien à dupliquer ici — juste le nouveau point d'entrée.
      router.push('/quiz/personnalite');
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
              <p className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Ton sexe ?</p>
              <div className="flex flex-col gap-2">
                {GENDERS.map((g) => (
                  <Chip key={g} label={g} selected={gender === g} onClick={() => { setGender(g); advance(); }} />
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {!interestConfirmed ? (
                <>
                  <p className="font-display text-lg font-black mb-1" style={{ color: 'var(--ink)' }}>Qu&apos;est-ce qui t&apos;attire le plus dans UrCecret ?</p>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6b6055' }}>On te dit tout de suite comment y accéder.</p>
                  <div className="flex flex-col gap-2">
                    {ONBOARDING_INTERESTS.map((i) => (
                      <Chip key={i} label={i} selected={interest === i} onClick={() => chooseInterest(i)} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="font-display text-base font-black mb-2" style={{ color: 'var(--ink)' }}>Parfait, on garde ça en tête ✓</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b6055' }}>
                    Encore 2-3 étapes rapides (moins d&apos;une minute) et tu y es — c&apos;est parti 👇
                  </p>
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <p className="font-display text-lg font-black mb-1" style={{ color: 'var(--ink)' }}>Quel est ton objectif principal ?</p>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6b6055' }}>Il n&apos;y a pas de mauvaise réponse.</p>
              <div className="flex flex-col gap-2 mb-3">
                {ONBOARDING_GOALS.map((g) => (
                  <Chip key={g} label={g} selected={goal === g} onClick={() => { setGoal(g); finish(g); }} />
                ))}
              </div>
              {saving && <p className="text-xs text-center" style={{ color: '#a8a29e' }}>Un instant…</p>}
              {error && <p className="text-xs text-center" style={{ color: '#dc2626' }}>{error}</p>}
            </>
          )}

          <p className="text-[10px] text-center mt-4" style={{ color: '#a8a29e' }}>{Math.round(progress * 100)}%</p>
        </div>
      </div>
    </main>
  );
}
