'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UrSecretAnimatedBg from '@/components/UrSecretAnimatedBg';
import QuizIcon from '@/components/QuizIcon';

const QUIZ_COLORS: Record<string, string> = {
  infidelite: '#f43f5e',
  adopte: '#8b5cf6',
  amoureux: '#ec4899',
  'vrais-amis': '#06b6d4',
  orientation: '#10b981',
};

const QUIZ_CHOICES = [
  { slug: 'infidelite',  label: 'Il/elle me cache quelque chose ?',    emoji: '💔' },
  { slug: 'adopte',      label: 'Ma famille me dit-elle tout ?',        emoji: '🔍' },
  { slug: 'amoureux',    label: 'C\'est vraiment de l\'amour ?',        emoji: '💫' },
  { slug: 'vrais-amis',  label: 'Seraient-ils là si ça allait mal ?',   emoji: '🫂' },
  { slug: 'orientation', label: 'Es-tu attiré(e) par le même sexe ?',   emoji: '🌈' },
];

interface Answers {
  firstName: string;
  age: string;
  gender: string;
  situation: string;
  quizSlug: string;
}

const STEPS = ['quizSlug', 'firstName', 'age', 'gender', 'situation'] as const;
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
      // Note: quizSlug is set at step 0 so it's available at push time
    }
  }

  function handleTextNext(value: string) {
    if (!value.trim()) return;
    advance(value.trim());
  }

  const progress = (step / STEPS.length) * 100;

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#09090b' }}>
      <UrSecretAnimatedBg />

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
          {currentStep === 'quizSlug' && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-3 leading-snug">
                Qu&apos;est-ce qui te préoccupe en ce moment ?
              </h2>
              <p className="text-zinc-500 text-sm text-center mb-8">
                L&apos;IA va analyser ta situation — sans filtre, sans jugement.
              </p>
              <div className="flex flex-col gap-3">
                {QUIZ_CHOICES.map((choice) => (
                  <button
                    key={choice.slug}
                    onClick={() => advance(choice.slug)}
                    className="ob-pill"
                  >
                    <div className="ob-pill-outer">
                      <div className="ob-pill-inner">
                        <span className="ob-pill-text">
                          <QuizIcon slug={choice.slug} size={28} color={QUIZ_COLORS[choice.slug] ?? '#8b5cf6'} />
                          <span>{choice.label}</span>
                          <svg className="w-4 h-4 ml-auto flex-shrink-0 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {currentStep === 'firstName' && (
            <TextStep
              question="C'est courageux de faire face à ça. Comment tu t'appelles ?"
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
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3 text-center">
                Dernière étape
              </p>
              <ChoiceStep
                question="Quelle est ta situation actuelle ?"
                options={['En couple', 'Célibataire', 'Compliqué', 'Je ne sais pas']}
                onSelect={advance}
              />
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
          Continuer
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
            <div className="ob-pill-outer">
              <div className="ob-pill-inner">
                <span className="ob-pill-text">
                  <span>{opt}</span>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
