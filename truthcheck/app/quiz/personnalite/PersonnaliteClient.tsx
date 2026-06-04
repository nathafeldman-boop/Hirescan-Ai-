'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mbtiQuestions, computeMbtiType, MbtiQuestion } from '@/lib/mbti';
import { mbtiQuestionsEn } from '@/lib/i18n/mbtiQuestionsEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';

const TOTAL = mbtiQuestions.length; // 24

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-zinc-500 mb-2">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(to right,#a78bfa,#f472b6)' }}
        />
      </div>
    </div>
  );
}

type QuizAnswer = 'A' | 'B' | 'C' | 'D';
type Answers = Record<number, QuizAnswer>;

type QuizT = typeof ui.fr.quiz | typeof ui.en.quiz;

function QuizScreen({ onComplete, questions, t }: {
  onComplete: (answers: Answers) => void;
  questions: MbtiQuestion[];
  t: QuizT;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<QuizAnswer | null>(null);
  const [animating, setAnimating] = useState(false);

  const q: MbtiQuestion = questions[current];

  const handleChoice = (choice: QuizAnswer) => {
    if (animating) return;
    setSelected(choice);
    setAnimating(true);
    const next = { ...answers, [q.id]: choice };
    setTimeout(() => {
      if (current + 1 >= TOTAL) {
        onComplete(next);
      } else {
        setAnswers(next);
        setCurrent(c => c + 1);
        setSelected(null);
        setAnimating(false);
      }
    }, 400);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <ProgressBar current={current + 1} total={TOTAL} label={t.questionOf(current + 1, TOTAL)} />

      <div className="mb-10 text-center">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          {t.dimLabel[q.dimension]}
        </p>
        <h2 className="text-xl font-bold text-white leading-snug">{q.text}</h2>
      </div>

      <div className="space-y-3">
        {([
          { key: 'A' as const, option: q.optionA },
          { key: 'B' as const, option: q.optionB },
          ...(q.optionC ? [{ key: 'C' as const, option: q.optionC }] : []),
          ...(q.optionD ? [{ key: 'D' as const, option: q.optionD }] : []),
        ]).map(({ key, option }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => handleChoice(key)}
              disabled={animating}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm font-medium ${
                isSelected
                  ? 'border-violet-500 bg-violet-500/20 text-white scale-[0.98]'
                  : 'border-white/10 bg-white/5 text-zinc-300 hover:border-violet-500/50 hover:bg-white/10'
              }`}
            >
              <span className="text-zinc-500 mr-3 font-mono text-xs">{key}</span>
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AnalysisScreen({ onDone, t }: { onDone: () => void; t: QuizT }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const duration = 3500;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
      setStage(Math.min(3, Math.floor((p / 100) * 4)));
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(onDone, 300);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [onDone]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-6">🧠</div>
        <h2 className="text-xl font-bold text-white mb-2">{t.analysisStages[stage]}</h2>
        <p className="text-zinc-500 text-sm mb-8">{t.doNotClose}</p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right,#a78bfa,#f472b6)' }}
          />
        </div>
        <p className="text-xs text-zinc-600 mt-3">{progress}%</p>
      </div>
    </div>
  );
}

export default function PersonnaliteClient() {
  const router = useRouter();
  const { lang } = useLang();
  const [phase, setPhase] = useState<'quiz' | 'analysis' | 'done'>('quiz');
  const [answers, setAnswers] = useState<Answers>({});

  const questions = lang === 'en' ? mbtiQuestionsEn : mbtiQuestions;
  const t = ui[lang].quiz;

  const handleComplete = (ans: Answers) => {
    setAnswers(ans);
    setPhase('analysis');
  };

  const handleAnalysisDone = () => {
    const type = computeMbtiType(answers);
    router.push(`/types/${type.toLowerCase()}`);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {phase === 'quiz' && <QuizScreen onComplete={handleComplete} questions={questions} t={t} />}
      {(phase === 'analysis' || phase === 'done') && <AnalysisScreen onDone={handleAnalysisDone} t={t} />}
    </main>
  );
}
