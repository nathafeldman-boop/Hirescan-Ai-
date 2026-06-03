'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mbtiQuestions, computeMbtiType, MbtiQuestion, QuizAnswer } from '@/lib/mbti';

const TOTAL = mbtiQuestions.length; // 24

type Answers = Record<number, QuizAnswer>;

const OPTION_CONFIG = [
  { key: 'A' as QuizAnswer, gradient: 'linear-gradient(135deg,#7c3aed,#6366f1)', glowColor: 'rgba(124,58,237,0.35)', borderColor: 'rgba(124,58,237,0.7)' },
  { key: 'B' as QuizAnswer, gradient: 'linear-gradient(135deg,#4f46e5,#818cf8)', glowColor: 'rgba(99,102,241,0.30)', borderColor: 'rgba(99,102,241,0.6)' },
  { key: 'C' as QuizAnswer, gradient: 'linear-gradient(135deg,#db2777,#ec4899)', glowColor: 'rgba(219,39,119,0.30)', borderColor: 'rgba(219,39,119,0.6)' },
  { key: 'D' as QuizAnswer, gradient: 'linear-gradient(135deg,#be185d,#f43f5e)', glowColor: 'rgba(190,24,93,0.35)', borderColor: 'rgba(190,24,93,0.7)' },
];

function AnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-50px) scale(1.12)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,35px) scale(0.88)} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(50px,25px) scale(1.06)} 66%{transform:translate(-20px,-40px) scale(0.94)} }
        @keyframes grid-fade { 0%,100%{opacity:0.03} 50%{opacity:0.06} }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Orb 1 — violet */}
        <div style={{
          position: 'absolute', top: '8%', left: '15%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orb1 9s ease-in-out infinite',
        }} />
        {/* Orb 2 — pink */}
        <div style={{
          position: 'absolute', top: '45%', right: '5%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orb2 11s ease-in-out infinite',
        }} />
        {/* Orb 3 — blue */}
        <div style={{
          position: 'absolute', bottom: '15%', left: '35%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orb3 13s ease-in-out infinite',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'grid-fade 8s ease-in-out infinite',
        }} />
      </div>
    </>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-zinc-500 mb-2">
        <span>Question {current}/{total}</span>
        <span className="font-medium" style={{ color: '#a78bfa' }}>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(to right,#7c3aed,#ec4899)' }}
        />
      </div>
    </div>
  );
}

function QuizScreen({ onComplete }: { onComplete: (answers: Answers) => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<QuizAnswer | null>(null);
  const [animating, setAnimating] = useState(false);

  const q: MbtiQuestion = mbtiQuestions[current];

  const dimLabel: Record<string, string> = {
    EI: 'Énergie',
    SN: 'Perception',
    TF: 'Décision',
    JP: 'Organisation',
  };

  const options: { key: QuizAnswer; text: string }[] = [
    { key: 'A', text: q.optionA.text },
    { key: 'B', text: q.optionB.text },
    { key: 'C', text: q.optionC.text },
    { key: 'D', text: q.optionD.text },
  ];

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
    }, 420);
  };

  return (
    <div className="relative z-10 max-w-xl mx-auto px-4 py-10">
      <ProgressBar current={current + 1} total={TOTAL} />

      <div className="mb-8 text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
          {dimLabel[q.dimension]}
        </span>
        <h2 className="text-xl font-bold text-white leading-snug px-2">{q.text}</h2>
      </div>

      <div className="space-y-3">
        {options.map((opt, i) => {
          const cfg = OPTION_CONFIG[i];
          const isSelected = selected === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => handleChoice(opt.key)}
              disabled={animating}
              className="w-full text-left rounded-2xl transition-all duration-200 relative overflow-hidden group"
              style={{
                padding: '1px',
                background: isSelected ? cfg.gradient : 'rgba(255,255,255,0.06)',
                transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                boxShadow: isSelected ? `0 0 20px ${cfg.glowColor}, 0 0 40px ${cfg.glowColor}` : 'none',
              }}
            >
              {/* Inner card */}
              <div
                className="flex items-start gap-4 px-5 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: isSelected ? 'rgba(9,9,11,0.6)' : 'rgba(9,9,11,0.92)',
                }}
              >
                {/* Letter badge */}
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black mt-0.5"
                  style={{
                    background: isSelected ? cfg.gradient : 'rgba(255,255,255,0.07)',
                    color: isSelected ? '#fff' : '#71717a',
                    border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.10)',
                    boxShadow: isSelected ? `0 2px 8px ${cfg.glowColor}` : 'none',
                  }}
                >
                  {opt.key}
                </span>
                <span className={`text-sm leading-relaxed font-medium transition-colors duration-200 ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-zinc-100'}`}>
                  {opt.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-700 mt-6">
        Choisis la réponse qui te correspond le mieux — pas la plus "correcte"
      </p>
    </div>
  );
}

function AnalysisScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const stages = [
    'Analyse de tes réponses…',
    'Calcul de tes 4 dimensions…',
    'Identification de ton type…',
    'Génération de ton profil…',
  ];

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
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6 animate-pulse">🧠</div>
        <h2 className="text-xl font-bold text-white mb-2">{stages[stage]}</h2>
        <p className="text-zinc-500 text-sm mb-10">Ne ferme pas cette page</p>
        <div className="relative w-full h-2 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right,#7c3aed,#ec4899)' }}
          />
        </div>
        <p className="text-xs text-zinc-600 mt-3 tabular-nums">{progress}%</p>
        <div className="mt-8 grid grid-cols-4 gap-3">
          {['E/I', 'S/N', 'T/F', 'J/P'].map((dim, i) => (
            <div key={dim} className="text-center">
              <div className={`w-full h-1 rounded-full mb-1.5 transition-all duration-700 ${progress >= (i + 1) * 25 ? 'opacity-100' : 'opacity-20'}`}
                style={{ background: 'linear-gradient(to right,#7c3aed,#ec4899)', transitionDelay: `${i * 200}ms` }} />
              <span className="text-xs text-zinc-600 font-mono">{dim}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PersonnaliteClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<'quiz' | 'analysis'>('quiz');
  const [answers, setAnswers] = useState<Answers>({});

  const handleComplete = (ans: Answers) => {
    setAnswers(ans);
    setPhase('analysis');
  };

  const handleAnalysisDone = () => {
    const type = computeMbtiType(answers);
    router.push(`/types/${type.toLowerCase()}`);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white relative">
      <AnimatedBackground />
      {phase === 'quiz' && <QuizScreen onComplete={handleComplete} />}
      {phase === 'analysis' && <AnalysisScreen onDone={handleAnalysisDone} />}
    </main>
  );
}
