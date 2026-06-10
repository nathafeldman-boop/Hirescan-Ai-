'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { mbtiQuestions, computeMbtiType, MbtiQuestion } from '@/lib/mbti';
import { mbtiQuestionsEn } from '@/lib/i18n/mbtiQuestionsEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';

const TOTAL = mbtiQuestions.length;

type QuizAnswer = 'A' | 'B' | 'C' | 'D';
type Answers = Record<number, QuizAnswer>;
type QuizT = typeof ui.fr.quiz | typeof ui.en.quiz;

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

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(to right,#7c3aed,#ec4899)' }}
        />
      </div>
    </div>
  );
}

// ─── Quiz screen — one question at a time ─────────────────────────────────────

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
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
          {t.dimLabel[q.dimension]}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">{q.text}</h2>
      </div>

      <div className="flex flex-col gap-3">
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
              className={`w-full text-center px-6 py-4 rounded-2xl border-2 transition-all duration-200 text-base font-semibold ${
                isSelected
                  ? 'border-violet-500 bg-violet-50 text-violet-700 scale-[0.98]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50/50'
              }`}
            >
              {option.text}
            </button>
          );
        })}
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-sm">
        <div className="mb-6 text-violet-500"><BrainIcon /></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t.analysisStages[stage]}</h2>
        <p className="text-gray-400 text-sm mb-8">{t.doNotClose}</p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right,#7c3aed,#ec4899)' }}
          />
        </div>
        <p className="text-xs text-gray-300 mt-3">{progress}%</p>
      </div>
    </div>
  );
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthGate({ typeCode, lang }: { typeCode: string; lang: string }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const callbackUrl = `/types/${typeCode.toLowerCase()}`;
  const isFr = lang !== 'en';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
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
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 relative overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-2xl">
            <div className="text-center">
              <div className="text-gray-400 mb-1 flex justify-center"><LockIcon /></div>
              <p className="text-xs text-gray-400 font-medium">
                {isFr ? 'Résultat verrouillé' : 'Result locked'}
              </p>
            </div>
          </div>
        </div>

        {/* Auth card */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
          {sent ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">
                {isFr ? 'Vérifie tes emails' : 'Check your inbox'}
              </h3>
              <p className="text-gray-500 text-sm">
                {isFr ? 'Lien envoyé à' : 'Link sent to'}{' '}
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
              <button
                onClick={() => signIn('google', { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors mb-4"
              >
                <GoogleIcon />
                {isFr ? 'Continuer avec Google' : 'Continue with Google'}
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-zinc-600 text-xs">{isFr ? 'ou par email' : 'or by email'}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
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
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-violet-400 transition-all"
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
  const [answers, setAnswers] = useState<Answers>({});
  const [mbtiType, setMbtiType] = useState('');

  const questions = lang === 'en' ? mbtiQuestionsEn : mbtiQuestions;
  const t = ui[lang].quiz;

  const handleComplete = (ans: Answers) => {
    setAnswers(ans);
    setPhase('analysis');
  };

  const handleAnalysisDone = () => {
    const type = computeMbtiType(answers);
    setMbtiType(type);
    if (session?.user) {
      router.push(`/types/${type.toLowerCase()}`);
    } else {
      setPhase('gate');
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {phase === 'quiz' && (
        <QuizScreen onComplete={handleComplete} questions={questions} t={t} />
      )}
      {phase === 'analysis' && (
        <AnalysisScreen onDone={handleAnalysisDone} t={t} />
      )}
      {phase === 'gate' && (
        <AuthGate typeCode={mbtiType} lang={lang} />
      )}
    </main>
  );
}
