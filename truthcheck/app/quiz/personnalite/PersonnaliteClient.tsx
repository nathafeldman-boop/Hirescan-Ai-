'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 mx-auto">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Quiz page (Truity-style) ─────────────────────────────────────────────────

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
  const totalAnswered = Object.keys(answers).length;
  const pct = Math.round((totalAnswered / TOTAL) * 100);

  const handleNext = () => {
    if (!allAnswered) { setShowWarning(true); return; }
    setShowWarning(false);
    onNext();
  };

  useEffect(() => {
    if (allAnswered) setShowWarning(false);
  }, [allAnswered]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0ea' }}>
      {/* Sticky progress */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">{pct}%</span>
            <span>{lang === 'en' ? `Step ${page + 1} of ${TOTAL_PAGES}` : `Étape ${page + 1} sur ${TOTAL_PAGES}`}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: '#22c55e' }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-36">
        <p className="text-center text-sm text-gray-500 mb-6">
          {lang === 'en' ? 'Choose how much each statement applies to you' : 'Choisissez dans quelle mesure chaque énoncé vous correspond'}
        </p>

        <div className="space-y-4">
          {pageQuestions.map((q) => {
            const selected = answers[q.id];
            const options = [q.optionA, q.optionB, ...(q.optionC ? [q.optionC] : []), ...(q.optionD ? [q.optionD] : [])];
            return (
              <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-800 font-semibold text-[15px] leading-snug mb-4">{q.text}</p>
                <div className="flex justify-between text-xs text-gray-400 mb-3 px-1">
                  <span>{lang === 'en' ? 'Not at all' : 'Pas du tout'}</span>
                  <span>{lang === 'en' ? 'Completely' : 'Tout à fait'}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {CIRCLE_CONFIG.slice(0, options.length).map(({ key, bg, fill, ring }, idx) => {
                    const isSelected = selected === key;
                    return (
                      <button key={key} onClick={() => onAnswer(q.id, key)} title={options[idx].text}
                        className="flex-1 flex flex-col items-center" aria-label={options[idx].text}>
                        <div className="rounded-full transition-all duration-200" style={{
                          width: 44, height: 44,
                          backgroundColor: isSelected ? fill : bg,
                          border: `2px solid ${isSelected ? ring : 'transparent'}`,
                          boxShadow: isSelected ? `0 0 0 3px ${fill}55` : undefined,
                          transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                        }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {showWarning && (
            <p className="text-center text-sm text-red-500 mb-3">
              {lang === 'en' ? 'You must answer all questions to continue' : 'Vous devez répondre à toutes les questions pour continuer'}
            </p>
          )}
          <button onClick={handleNext}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.98]"
            style={{ backgroundColor: allAnswered ? '#22c55e' : '#86efac', cursor: allAnswered ? 'pointer' : 'default' }}>
            {page < TOTAL_PAGES - 1
              ? (lang === 'en' ? 'Next' : 'Suivant')
              : (lang === 'en' ? 'See my result' : 'Voir mon résultat')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Analysis screen ──────────────────────────────────────────────────────────

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
      if (p >= 100) { clearInterval(tick); setTimeout(onDone, 300); }
    }, 50);
    return () => clearInterval(tick);
  }, [onDone]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f5f0ea' }}>
      <div className="text-center max-w-sm">
        <div className="mb-6 text-green-500"><BrainIcon /></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t.analysisStages[stage]}</h2>
        <p className="text-gray-500 text-sm mb-8">{t.doNotClose}</p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: '#22c55e' }} />
        </div>
        <p className="text-xs text-gray-400 mt-3">{progress}%</p>
      </div>
    </div>
  );
}

// ─── Auth gate — shown after analysis if user is not logged in ────────────────

function AuthGate({ typeCode, lang }: { typeCode: string; lang: string }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const callbackUrl = `/types/${typeCode.toLowerCase()}`;

  const isFr = lang !== 'en';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#f5f0ea' }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            {isFr ? 'Ton analyse est prête !' : 'Your analysis is ready!'}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            {isFr
              ? 'Crée ton compte gratuitement pour révéler ton type de personnalité.'
              : 'Create your free account to reveal your personality type.'}
          </p>
        </div>

        {/* Blurred result teaser */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-200 rounded-full w-3/4 animate-pulse" />
              <div className="h-2.5 bg-gray-100 rounded-full w-1/2 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-2.5 bg-gray-100 rounded-full w-5/6 animate-pulse" />
            <div className="h-2.5 bg-gray-100 rounded-full w-4/6 animate-pulse" />
          </div>
          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-2xl">
            <div className="text-center">
              <div className="text-gray-400 mb-1 flex justify-center"><LockIcon /></div>
              <p className="text-xs text-gray-500 font-medium">
                {isFr ? 'Résultat verrouillé' : 'Result locked'}
              </p>
            </div>
          </div>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {sent ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">
                {isFr ? 'Vérifie tes emails' : 'Check your inbox'}
              </h3>
              <p className="text-gray-500 text-sm">
                {isFr ? 'Un lien de connexion a été envoyé à' : 'A sign-in link was sent to'}{' '}
                <span className="text-violet-600 font-medium">{email}</span>
              </p>
              <p className="text-gray-400 text-xs mt-3">
                {isFr ? 'Clique sur le lien pour révéler ton type.' : 'Click the link to reveal your type.'}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-gray-900 font-bold text-[15px] text-center mb-5">
                {isFr ? 'Connexion / Inscription — 30 secondes' : 'Sign in / Sign up — 30 seconds'}
              </h2>

              {/* Google */}
              <button
                onClick={() => signIn('google', { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-colors mb-4 shadow-sm"
              >
                <GoogleIcon />
                {isFr ? 'Continuer avec Google' : 'Continue with Google'}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-gray-400 text-xs">{isFr ? 'ou par email' : 'or by email'}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Magic link */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setLoading(true);
                  await signIn('email', { email, callbackUrl, redirect: false });
                  setSent(true);
                  setLoading(false);
                }}
                className="space-y-3"
              >
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFr ? 'ton@email.com' : 'your@email.com'} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                />
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
                >
                  {loading
                    ? (isFr ? 'Envoi…' : 'Sending…')
                    : (isFr ? 'Recevoir mon lien de connexion' : 'Get my sign-in link')}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                {isFr ? 'Gratuit · Aucune carte bancaire requise' : 'Free · No credit card required'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function PersonnaliteClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lang } = useLang();
  const [phase, setPhase] = useState<'quiz' | 'analysis' | 'gate'>('quiz');
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [mbtiType, setMbtiType] = useState('');

  const questions = lang === 'en' ? mbtiQuestionsEn : mbtiQuestions;
  const t = ui[lang].quiz;

  const handleAnswer = (qId: number, ans: QuizAnswer) => {
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const handleNextPage = () => {
    if (page < TOTAL_PAGES - 1) {
      setPage(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPhase('analysis');
    }
  };

  const handleAnalysisDone = () => {
    const type = computeMbtiType(answers);
    setMbtiType(type);
    if (session?.user) {
      // Already signed in — go straight to the type page (payment wall there)
      router.push(`/types/${type.toLowerCase()}`);
    } else {
      // Not signed in — show auth gate
      setPhase('gate');
    }
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
          onNext={handleNextPage}
          lang={lang}
        />
      )}
      {phase === 'analysis' && (
        <AnalysisScreen onDone={handleAnalysisDone} t={t} />
      )}
      {phase === 'gate' && (
        <AuthGate typeCode={mbtiType} lang={lang} />
      )}
    </>
  );
}
