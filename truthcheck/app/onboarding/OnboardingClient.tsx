'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUIZ_CHOICES = [
  { slug: 'infidelite', label: 'Mon/Ma partenaire me trompe ?', emoji: '💔' },
  { slug: 'adopte',     label: 'Suis-je adopté(e) ?',           emoji: '🔍' },
  { slug: 'amoureux',  label: 'Suis-je vraiment amoureux ?',     emoji: '💫' },
  { slug: 'vrais-amis',label: 'Sont-ils mes vrais amis ?',        emoji: '🫂' },
  { slug: 'orientation',label: 'Quelle est mon orientation ?',   emoji: '🌈' },
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
      // Save session and go to quiz
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

  const progress = ((step) / STEPS.length) * 100;

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>
            <span className="text-white">Secret</span>
          </span>
        </div>
        <span className="text-xs text-zinc-600">{step + 1} / {STEPS.length}</span>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mt-4">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            }}
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
              accent="#8b5cf6"
              onSelect={advance}
            />
          )}
          {currentStep === 'gender' && (
            <ChoiceStep
              question="Tu t'identifies comme ?"
              options={['Un homme', 'Une femme', 'Non-binaire', 'Je préfère ne pas dire']}
              accent="#ec4899"
              onSelect={advance}
            />
          )}
          {currentStep === 'situation' && (
            <ChoiceStep
              question="Quelle est ta situation actuelle ?"
              options={['En couple', 'Célibataire', 'Compliqué', 'Je ne sais pas']}
              accent="#f43f5e"
              onSelect={advance}
            />
          )}
          {currentStep === 'quizSlug' && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3 text-center">
                Dernière question
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8 leading-snug">
                Pourquoi veux-tu utiliser <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">UrSecret</span> ?
              </h2>
              <div className="space-y-3">
                {QUIZ_CHOICES.map((choice) => (
                  <button
                    key={choice.slug}
                    onClick={() => advance(choice.slug)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/8 hover:border-violet-500/40 transition-all duration-200 text-left group"
                  >
                    <span className="text-2xl">{choice.emoji}</span>
                    <span className="text-white font-medium group-hover:text-violet-200 transition-colors">
                      {choice.label}
                    </span>
                    <svg className="w-4 h-4 text-zinc-700 group-hover:text-violet-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg placeholder-zinc-600 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all mb-4"
      />
      <button
        onClick={() => onNext(local)}
        disabled={!local.trim()}
        className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: local.trim() ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : undefined, backgroundColor: local.trim() ? undefined : 'rgba(255,255,255,0.05)' }}
      >
        Continuer →
      </button>
    </div>
  );
}

function ChoiceStep({
  question,
  options,
  accent,
  onSelect,
}: {
  question: string;
  options: string[];
  accent: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-8 leading-snug">
        {question}
      </h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="w-full px-5 py-4 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/8 transition-all duration-200 text-left font-medium text-zinc-300 hover:text-white"
            style={{
              '--hover-border': `${accent}50`,
            } as React.CSSProperties}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
