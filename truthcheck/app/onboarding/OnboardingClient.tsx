'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUIZ_CHOICES = [
  { slug: 'infidelite',  label: 'Mon/Ma partenaire me trompe ?', emoji: '💔' },
  { slug: 'adopte',      label: 'Suis-je adopté(e) ?',           emoji: '🔍' },
  { slug: 'amoureux',   label: 'Suis-je vraiment amoureux ?',     emoji: '💫' },
  { slug: 'vrais-amis', label: 'Sont-ils mes vrais amis ?',        emoji: '🫂' },
  { slug: 'orientation', label: 'Quelle est mon orientation ?',   emoji: '🌈' },
];

interface Answers {
  firstName: string;
  age: string;
  gender: string;
  situation: string;
  quizSlug: string;
}

const STEPS = ['firstName', 'age', 'gender', 'situation', 'quizSlug'] as const;
type Step = typeof STEPS[number];

/** Inner markup for ob-pill buttons */
function ObPillInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="ob-pill-outer">
      <div className="ob-pill-inner">
        <span className="ob-pill-text">{children}</span>
      </div>
    </div>
  );
}

/** SVG filters: edge-glow (#unopaq) + Dexter button (#linen, #bump) */
function SvgFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="unopaq" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15"
          />
        </filter>
        <filter id="linen" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75 0.35" numOctaves={4} stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="bump" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={4} seed={3} result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="soft-light" />
        </filter>
      </defs>
    </svg>
  );
}

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({
    firstName: '',
    age: '',
    gender: '',
    situation: '',
    quizSlug: '',
  });
  const [transitioning, setTransitioning] = useState(false);

  const currentStep = STEPS[step];

  function advance(value: string) {
    if (transitioning) return;
    const key = currentStep;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < STEPS.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setTransitioning(false);
      }, 300);
    } else {
      sessionStorage.setItem('ursecret_session', JSON.stringify({
        firstName: newAnswers.firstName,
        age: newAnswers.age,
        gender: newAnswers.gender,
        situation: newAnswers.situation,
      }));
      fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnswers),
      }).catch(() => {});
      router.push(`/quiz/${newAnswers.quizSlug}`);
    }
  }

  function handleTextNext(value: string) {
    if (!value.trim()) return;
    advance(value.trim());
  }

  const progress = (step / STEPS.length) * 100;

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">
      <SvgFilters />

      {/* Neon ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="neon-grid absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Scanline */}
        <div
          className="neon-scan absolute left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(236,72,153,0.2), transparent)' }}
        />
        {/* Orb 1 — violet top-left */}
        <div
          className="neon-orb-1 absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 68%)', filter: 'blur(36px)' }}
        />
        {/* Orb 2 — pink bottom-right */}
        <div
          className="neon-orb-2 absolute -bottom-24 -right-24 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.22) 0%, transparent 68%)', filter: 'blur(44px)' }}
        />
        {/* Orb 3 — cyan mid-right */}
        <div
          className="neon-orb-3 absolute top-[35%] right-[-8%] w-[280px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)', filter: 'blur(52px)' }}
        />
        {/* Orb 4 — indigo bottom-left */}
        <div
          className="neon-orb-4 absolute bottom-[20%] left-[5%] w-[320px] h-[320px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(48px)' }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(9,9,11,0.7) 100%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6">
        <span className="text-xl font-black">
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>
          <span className="text-white">Secret</span>
        </span>
        <span className="text-xs text-zinc-600">{step + 1} / {STEPS.length}</span>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mt-4">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: `translateY(${transitioning ? 12 : 0}px)`,
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <div className="w-full max-w-md">
          {currentStep === 'firstName' && (
            <TextStep
              question="Comment tu t'appelles ?"
              placeholder="Ton prénom..."
              value={answers.firstName}
              onNext={handleTextNext}
            />
          )}
          {currentStep === 'age' && (
            <ChoiceStep
              question={`Quel âge as-tu, ${answers.firstName || 'toi'} ?`}
              options={['- de 18 ans', '18–24 ans', '25–34 ans', '35–44 ans', '45 ans et +']}
              onSelect={advance}
            />
          )}
          {currentStep === 'gender' && (
            <ChoiceStep
              question="Tu t'identifies comme ?"
              options={['Un homme', 'Une femme', 'Non-binaire', 'Je préfère ne pas dire']}
              onSelect={advance}
            />
          )}
          {currentStep === 'situation' && (
            <ChoiceStep
              question="Quelle est ta situation actuelle ?"
              options={['En couple', 'Célibataire', 'Compliqué', 'Je ne sais pas']}
              onSelect={advance}
            />
          )}
          {currentStep === 'quizSlug' && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3 text-center">
                Dernière question
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8 leading-snug">
                Pourquoi veux-tu utiliser{' '}
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  UrSecret
                </span>{' '}
                ?
              </h2>
              <div className="flex flex-col gap-3">
                {QUIZ_CHOICES.map((choice) => (
                  <button
                    key={choice.slug}
                    onClick={() => advance(choice.slug)}
                    className="ob-pill"
                  >
                    <ObPillInner>
                      <span className="text-2xl flex-shrink-0">{choice.emoji}</span>
                      <span>{choice.label}</span>
                      <svg className="w-4 h-4 ml-auto flex-shrink-0 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </ObPillInner>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TextStep({
  question,
  placeholder,
  value,
  onNext,
}: {
  question: string;
  placeholder: string;
  value: string;
  onNext: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8 leading-snug">
        {question}
      </h2>
      <input
        autoFocus
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onNext(local); }}
        placeholder={placeholder}
        maxLength={40}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all mb-6"
      />
      <div className="dxt-wrap">
        <button
          onClick={() => onNext(local)}
          disabled={!local.trim()}
          className="dxt-btn"
        >
          <div className="dxt-fabric" />
          <span className="dxt-txt dxt-txt1">Continuer</span>
          <span className="dxt-txt dxt-txt2">→ Allons-y</span>
          <div className="dxt-dot" />
          <div className="dxt-shadow left" />
          <div className="dxt-shadow right" />
          <div className="dxt-light" />
        </button>
      </div>
    </div>
  );
}

function ChoiceStep({
  question,
  options,
  onSelect,
}: {
  question: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8 leading-snug">
        {question}
      </h2>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="ob-pill"
          >
            <ObPillInner>
              <span>{opt}</span>
            </ObPillInner>
          </button>
        ))}
      </div>
    </div>
  );
}
