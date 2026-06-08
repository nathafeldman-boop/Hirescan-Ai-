'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mbtiQuestions, computeMbtiType, MbtiQuestion } from '@/lib/mbti';
import { mbtiQuestionsEn } from '@/lib/i18n/mbtiQuestionsEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';

const TOTAL = mbtiQuestions.length; // 24
const PAGE_SIZE = 4;
const TOTAL_PAGES = Math.ceil(TOTAL / PAGE_SIZE); // 6

type QuizAnswer = 'A' | 'B' | 'C' | 'D';
type Answers = Record<number, QuizAnswer>;
type QuizT = typeof ui.fr.quiz | typeof ui.en.quiz;

const CIRCLE_CONFIG = [
  { key: 'A' as QuizAnswer, bg: '#fecaca', fill: '#f87171', ring: '#ef4444' },
  { key: 'B' as QuizAnswer, bg: '#fed7aa', fill: '#fb923c', ring: '#f97316' },
  { key: 'C' as QuizAnswer, bg: '#bbf7d0', fill: '#86efac', ring: '#4ade80' },
  { key: 'D' as QuizAnswer, bg: '#dcfce7', fill: '#22c55e', ring: '#16a34a' },
];

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 mx-auto">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  );
}

function QuizPage({
  page,
  pageQuestions,
  answers,
  onAnswer,
  onNext,
  lang,
}: {
  page: number;
  pageQuestions: MbtiQuestion[];
  answers: Answers;
  onAnswer: (qId: number, ans: QuizAnswer) => void;
  onNext: () => void;
  lang: string;
}) {
  const [showWarning, setShowWarning] = useState(false);
  const answeredOnPage = pageQuestions.filter(q => answers[q.id] !== undefined).length;
  const allAnswered = answeredOnPage === pageQuestions.length;

  // count total answered across all questions for the progress bar
  const totalAnswered = Object.keys(answers).length;
  const pct = Math.round((totalAnswered / TOTAL) * 100);

  const handleNext = () => {
    if (!allAnswered) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    onNext();
  };

  useEffect(() => {
    if (allAnswered) setShowWarning(false);
  }, [allAnswered]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0ea' }}>
      {/* Sticky progress header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">{pct}%</span>
            <span>
              {lang === 'en'
                ? `Step ${page + 1} of ${TOTAL_PAGES}`
                : `Étape ${page + 1} sur ${TOTAL_PAGES}`}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: '#22c55e' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-36">
        <p className="text-center text-sm text-gray-500 mb-6">
          {lang === 'en'
            ? 'Choose how much each statement applies to you'
            : 'Choisissez dans quelle mesure chaque énoncé vous correspond'}
        </p>

        <div className="space-y-4">
          {pageQuestions.map((q) => {
            const selected = answers[q.id];
            const options = [
              q.optionA,
              q.optionB,
              ...(q.optionC ? [q.optionC] : []),
              ...(q.optionD ? [q.optionD] : []),
            ];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <p className="text-gray-800 font-semibold text-[15px] leading-snug mb-4">
                  {q.text}
                </p>

                <div className="flex justify-between text-xs text-gray-400 mb-3 px-1">
                  <span>{lang === 'en' ? 'Not at all' : 'Pas du tout'}</span>
                  <span>{lang === 'en' ? 'Completely' : 'Tout à fait'}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {CIRCLE_CONFIG.slice(0, options.length).map(({ key, bg, fill, ring }, idx) => {
                    const isSelected = selected === key;
                    return (
                      <button
                        key={key}
                        onClick={() => onAnswer(q.id, key)}
                        title={options[idx].text}
                        className="flex-1 flex flex-col items-center"
                        aria-label={options[idx].text}
                      >
                        <div
                          className="rounded-full transition-all duration-200"
                          style={{
                            width: 44,
                            height: 44,
                            backgroundColor: isSelected ? fill : bg,
                            border: `2px solid ${isSelected ? ring : 'transparent'}`,
                            boxShadow: isSelected ? `0 0 0 3px ${fill}55` : undefined,
                            transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {showWarning && (
            <p className="text-center text-sm text-red-500 mb-3">
              {lang === 'en'
                ? 'You must answer all questions to continue'
                : 'Vous devez répondre à toutes les questions pour continuer'}
            </p>
          )}
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: allAnswered ? '#22c55e' : '#86efac',
              cursor: allAnswered ? 'pointer' : 'default',
            }}
          >
            {page < TOTAL_PAGES - 1
              ? (lang === 'en' ? 'Next' : 'Suivant')
              : (lang === 'en' ? 'See my result' : 'Voir mon résultat')}
          </button>
        </div>
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f5f0ea' }}>
      <div className="text-center max-w-sm">
        <div className="mb-6 text-green-500">
          <BrainIcon />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t.analysisStages[stage]}</h2>
        <p className="text-gray-500 text-sm mb-8">{t.doNotClose}</p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: '#22c55e' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">{progress}%</p>
      </div>
    </div>
  );
}

export default function PersonnaliteClient() {
  const router = useRouter();
  const { lang } = useLang();
  const [phase, setPhase] = useState<'quiz' | 'analysis'>('quiz');
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const questions = lang === 'en' ? mbtiQuestionsEn : mbtiQuestions;
  const t = ui[lang].quiz;

  const handleAnswer = (qId: number, ans: QuizAnswer) => {
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const handleNext = () => {
    if (page < TOTAL_PAGES - 1) {
      setPage(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPhase('analysis');
    }
  };

  const handleAnalysisDone = () => {
    const type = computeMbtiType(answers);
    router.push(`/types/${type.toLowerCase()}`);
  };

  const pageQuestions = questions.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <>
      {phase === 'quiz' && (
        <QuizPage
          page={page}
          pageQuestions={pageQuestions}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          lang={lang}
        />
      )}
      {phase === 'analysis' && (
        <AnalysisScreen onDone={handleAnalysisDone} t={t} />
      )}
    </>
  );
}
