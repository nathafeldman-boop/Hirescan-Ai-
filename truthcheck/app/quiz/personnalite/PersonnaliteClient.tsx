'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { mbtiQuestions, computeMbtiType, mbtiTypes, MbtiQuestion } from '@/lib/mbti';
import { mbtiQuestionsEn } from '@/lib/i18n/mbtiQuestionsEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';
import { track } from '@/lib/analytics';

const TOTAL = mbtiQuestions.length;

// ─── Diagnostic logger ──────────────────────────────────────────────────────────
// Writes to browser console AND to the PageView DB so steps are visible in admin.
// Path format: /__diag/<step> — queryable in the admin diagnostic section.
function diagLog(step: string, meta: Record<string, unknown> = {}) {
  // eslint-disable-next-line no-console
  console.log(`%c[FUNNEL] ${step}`, 'color:#a78bfa;font-weight:bold', meta);
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: `/__diag/${step}` }),
  }).catch(() => {});
}

type QuizAnswer = 'A' | 'B' | 'C' | 'D' | 'E';
type Answers = Record<number, QuizAnswer>;
type QuizT = typeof ui.fr.quiz | typeof ui.en.quiz;

// ─── Icons ─────────────────────────────────────────────────────────────────────

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

// ─── Progress bar ───────────────────────────────────────────────────────────────

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-stone-400 mb-2">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(to right,#7c3aed,#ec4899)' }}
        />
      </div>
    </div>
  );
}

// ─── Quiz screen ────────────────────────────────────────────────────────────────

function QuizScreen({ onComplete, questions, t }: {
  onComplete: (answers: Answers) => void;
  questions: MbtiQuestion[];
  t: QuizT;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<QuizAnswer | null>(null);
  const [animating, setAnimating] = useState(false);
  const [milestoneMsg, setMilestoneMsg] = useState<{ emoji: string; title: string; sub: string } | null>(null);
  const trackedMilestones = useRef<Set<number>>(new Set());
  const currentRef = useRef(0);

  const MILESTONE_MSGS: Record<number, { emoji: string; title: string; sub: string }> = {
    25: { emoji: '🔥', title: 'Tu es dans le top 25 % !', sub: 'La plupart des gens s\'arrêtent avant toi. Continue — ton type se dessine.' },
    50: { emoji: '⚡', title: 'Mi-chemin atteint !', sub: 'Ton profil commence à prendre forme. Plus que 50 questions pour le révéler.' },
    75: { emoji: '🎯', title: 'Plus que 25 questions !', sub: 'Ton type se précise. Tu es à quelques secondes de découvrir qui tu es vraiment.' },
  };

  useEffect(() => {
    track('quiz_start', { quiz: 'personnalite', content_name: 'Test MBTI' });
  }, []);

  // Keep ref in sync so visibilitychange always reads latest question
  useEffect(() => { currentRef.current = current; }, [current]);

  // Track milestones + show motivation banner
  useEffect(() => {
    const q = current + 1;
    if ([10, 25, 50, 75].includes(q) && !trackedMilestones.current.has(q)) {
      trackedMilestones.current.add(q);
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `/__quiz/q${q}` }),
      }).catch(() => {});
      if (MILESTONE_MSGS[q]) {
        setMilestoneMsg(MILESTONE_MSGS[q]);
        setTimeout(() => setMilestoneMsg(null), 2800);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Track exact question when user leaves mid-quiz
  useEffect(() => {
    const onHide = () => {
      if (!document.hidden) return;
      const q = currentRef.current + 1;
      if (q < questions.length) {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: `/__quiz/drop/q${q}` }),
        }).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q: MbtiQuestion = questions[current];

  const handleChoice = (choice: QuizAnswer) => {
    if (animating) return;
    setSelected(choice);
    setAnimating(true);
    const next = { ...answers, [q.id]: choice };
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setAnimating(false);
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
      {/* Milestone motivation banner */}
      {milestoneMsg && (
        <div
          className="fixed inset-x-4 top-4 z-50 rounded-2xl p-4 text-center shadow-2xl"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', animation: 'fadeInDown 0.3s ease' }}
          onClick={() => setMilestoneMsg(null)}
        >
          <p className="text-2xl mb-1">{milestoneMsg.emoji}</p>
          <p className="text-white font-black text-base leading-tight">{milestoneMsg.title}</p>
          <p className="text-white/80 text-xs mt-1 leading-snug">{milestoneMsg.sub}</p>
        </div>
      )}
      <ProgressBar current={current + 1} total={questions.length} label={t.questionOf(current + 1, questions.length)} />

      <div className="mb-10 text-center">
        <div className="text-4xl mb-3">
          {q.dimension === 'EI' ? '🧭' : q.dimension === 'SN' ? '🌟' : q.dimension === 'TF' ? '🧠' : '📅'}
        </div>
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">
          {t.dimLabel[q.dimension]}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">{q.text}</h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {([
          { key: 'A' as const, label: "Totalement d'accord", color: '#7c3aed' },
          { key: 'B' as const, label: "Plutôt d'accord",     color: '#a78bfa' },
          { key: 'C' as const, label: 'Neutre',              color: '#9ca3af' },
          { key: 'D' as const, label: "Plutôt pas d'accord", color: '#f97316' },
          { key: 'E' as const, label: "Pas du tout d'accord",color: '#ef4444' },
        ] as { key: QuizAnswer; label: string; color: string }[]).map(({ key, label, color }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => handleChoice(key)}
              disabled={animating}
              className={`w-full text-left px-5 py-3.5 rounded-2xl border-2 transition-all duration-150 text-sm font-semibold flex items-center gap-3 ${
                isSelected
                  ? 'scale-[0.98]'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
              }`}
              style={isSelected ? { borderColor: color, backgroundColor: color + '12', color } : {}}
            >
              <span className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                style={isSelected ? { borderColor: color, backgroundColor: color } : { borderColor: '#d6d3d1' }}>
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Analysis screen ────────────────────────────────────────────────────────────

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#faf9f7' }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4 animate-pulse">🔮</div>
        <div className="mb-6 text-violet-500"><BrainIcon /></div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">{t.analysisStages[stage]}</h2>
        <p className="text-stone-500 text-sm mb-8">{t.doNotClose}</p>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right,#7c3aed,#ec4899)' }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-3">{progress}%</p>
      </div>
    </div>
  );
}

// ─── In-app browser overlay ─────────────────────────────────────────────────────
// Shown immediately when TikTok/Instagram in-app browser is detected.
// Blocks the quiz entirely — Stripe does not work in these browsers.

function InAppBrowserOverlay() {
  const [copied, setCopied] = useState(false);

  const openInChrome = () => {
    const url = window.location.href;
    const ua = navigator.userAgent;
    const isIOS = /iP(hone|ad|od)/.test(ua);

    // Copy URL immediately so it's ready as last-resort fallback
    try { navigator.clipboard.writeText(url).catch(() => {}); } catch {}

    if (isIOS) {
      // 1st try: x-safari-https:// → opens Safari directly from TikTok/Instagram in-app browser
      window.location.href = url.replace(/^https:\/\//, 'x-safari-https://').replace(/^http:\/\//, 'x-safari-http://');
      // 2nd try after 600ms: Chrome URL scheme (if Safari scheme didn't fire)
      setTimeout(() => {
        window.location.href = `googlechrome://${url.replace(/^https?:\/\//, '')}`;
        // Last resort: show clipboard confirmation
        setTimeout(() => setCopied(true), 800);
      }, 600);
    } else {
      // Android: intent to ANY default browser (no package lock → opens system chooser)
      window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`;
      // Fallback: window.open (works in some WebViews)
      setTimeout(() => {
        try { window.open(url, '_blank'); } catch {}
        setTimeout(() => setCopied(true), 600);
      }, 900);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
         style={{ background: 'linear-gradient(160deg,#0a0014 0%,#0e0020 60%,#0a0010 100%)' }}>

      <style>{`
        @keyframes iab-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
        @keyframes iab-glow  { 0%,100%{box-shadow:0 0 28px rgba(124,58,237,.45)} 50%{box-shadow:0 0 48px rgba(236,72,153,.65)} }
        @keyframes iab-pulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes iab-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* Blurred MBTI profile card — Zeigarnik hook */}
      <div className="relative mb-7" style={{ animation: 'iab-float 2.6s ease-in-out infinite' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-3xl blur-2xl opacity-60"
             style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', transform: 'scale(1.15)' }}/>

        <div className="relative rounded-3xl px-7 py-5"
             style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', animation: 'iab-glow 2.2s ease-in-out infinite' }}>

          <p className="text-white/40 text-xs uppercase tracking-widest mb-4 font-semibold">
            Ton type MBTI
          </p>

          {/* 4 blurred type letters */}
          <div className="flex gap-2 justify-center mb-4">
            {[0,1,2,3].map(i => (
              <div key={i}
                   className="w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white/20"
                   style={{
                     background: i%2===0 ? 'rgba(124,58,237,0.35)' : 'rgba(236,72,153,0.22)',
                     border: '1px solid rgba(255,255,255,0.15)',
                     filter: 'blur(5px)',
                     animation: `iab-float ${2.2+i*0.18}s ease-in-out infinite`,
                     animationDelay: `${i*0.12}s`
                   }}>
                ?
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm">🔒</span>
            <p className="text-white/50 text-xs font-medium">Connexion requise pour révéler</p>
          </div>
        </div>
      </div>

      {/* Headline */}
      <h2 className="text-[1.6rem] font-black text-white mb-2 leading-tight">
        Ton profil est prêt&nbsp;! 🔮
      </h2>
      <p className="text-white/55 text-sm mb-6 leading-relaxed max-w-[17rem]">
        Pour voir ton type et créer ton compte, ouvre dans ton navigateur —{' '}
        <strong className="text-white/90">ça prend 5 secondes</strong>
      </p>

      {/* Steps */}
      <div className="w-full max-w-[17rem] mb-6 space-y-2.5 text-left">
        <div className="flex items-start gap-3 p-3.5 rounded-2xl"
             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)' }}>
          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>1</span>
          <p className="text-white/75 text-sm leading-snug pt-0.5">
            Appuie sur les <strong className="text-white">⋯</strong> en haut à droite
          </p>
        </div>
        <div className="flex items-start gap-3 p-3.5 rounded-2xl"
             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)' }}>
          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>2</span>
          <p className="text-white/75 text-sm leading-snug pt-0.5">
            Appuie sur <strong className="text-white">&quot;Ouvrir dans le navigateur&quot;</strong>
          </p>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="w-full max-w-[17rem] space-y-3">
        <button
          onClick={openInChrome}
          className="w-full py-[1.05rem] rounded-2xl font-black text-white text-base transition-all active:scale-[0.97]"
          style={{
            background: copied ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'linear-gradient(270deg,#7c3aed,#ec4899,#7c3aed)',
            backgroundSize: '300% 100%',
            animation: copied ? 'none' : 'iab-shimmer 3s linear infinite, iab-glow 2s ease-in-out infinite',
            boxShadow: copied ? '0 10px 36px rgba(34,197,94,0.4)' : '0 10px 36px rgba(124,58,237,0.55)'
          }}>
          {copied ? '✅ Lien copié — colle dans Safari / Chrome !' : '🔓 Voir mon type MBTI'}
        </button>
        {copied && (
          <p className="text-white/60 text-xs text-center leading-snug px-2">
            Le lien est dans ton presse-papiers — colle-le dans ton navigateur
          </p>
        )}
        {!copied && (
          <button
            onClick={copyLink}
            className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.65)' }}>
            📋 Copier le lien
          </button>
        )}
      </div>

      <p className="text-white/25 text-[11px] mt-5 max-w-[15rem] leading-relaxed">
        Tes réponses sont sauvegardées — ton profil t&apos;attendra 🔒
      </p>
    </div>
  );
}

// ─── Countdown timer ─────────────────────────────────────────────────────────────

function CountdownTimer({ isFr }: { isFr: boolean }) {
  const [seconds, setSeconds] = useState(() => {
    try {
      const end = sessionStorage.getItem('_pwt');
      if (end) {
        const rem = Math.round((parseInt(end) - Date.now()) / 1000);
        if (rem > 0 && rem <= 15 * 60) return rem;
      }
    } catch {}
    const endTs = Date.now() + 15 * 60 * 1000;
    try { sessionStorage.setItem('_pwt', endTs.toString()); } catch {}
    return 15 * 60;
  });

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  if (seconds <= 0) return null;
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-1.5 mb-3">
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-red-50 border border-red-200 text-red-600">
        ⏱ {isFr ? `Prix réduit — encore ${m}:${s}` : `Reduced price — ${m}:${s} left`}
      </span>
    </div>
  );
}

// ─── Result teaser (free users — logged in or not) ─────────────────────────────
// Auth gate removed: user goes straight to Stripe which collects their email.
// The success page creates the account automatically from the Stripe email.

function ResultTeaser({ typeCode, lang, userEmail }: {
  typeCode: string; lang: string; userEmail?: string | null;
}) {
  const type = mbtiTypes[typeCode];
  const isFr = lang !== 'en';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    track('paywall_view', { quiz: 'personnalite' });
    diagLog('paywall_mounted', { typeCode, hasEmail: !!userEmail });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doCheckout = useCallback(async (checkoutType: 'onetime' | 'annual' | 'monthly') => {
    diagLog('checkout_start', { intent: checkoutType, hasEmail: !!userEmail });
    track('checkout_click', {
      quiz: 'personnalite',
      value: checkoutType === 'onetime' ? 1.99 : checkoutType === 'annual' ? 29.99 : 9.99,
      currency: 'EUR',
    });
    setLoading(true);
    try {
      let affiliateRef = '';
      try { affiliateRef = localStorage.getItem('_urs_ref') ?? ''; } catch {}
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          quizSlug: 'personnalite',
          typeCode,
          ...(userEmail ? { userEmail } : {}),
          ...(checkoutType === 'annual' ? { annual: true } : {}),
          ...(checkoutType === 'onetime' ? { oneTime: true } : {}),
          ...(affiliateRef ? { affiliateRef } : {}),
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else { alert(data.error ?? 'Erreur de paiement'); setLoading(false); }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setLoading(false);
    }
  }, [typeCode, userEmail]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#faf9f7' }}>
      <div className="w-full max-w-sm">

        {/* Header with character illustration */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-bounce" style={{ animationDuration: '2s' }}>🔮</div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black mb-4 tracking-widest"
            style={{ background: 'rgba(109,40,217,0.08)', border: '1px solid rgba(109,40,217,0.2)', color: '#7c3aed' }}
          >
            {typeCode.slice(0, 2)}<span className="blur-[4px] select-none opacity-40">??</span>
          </div>

          <h1 className="text-2xl font-black text-stone-900 mb-2">
            {isFr ? 'Ton type est prêt ✨' : 'Your type is ready ✨'}
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            {isFr
              ? `Seulement ${type?.rarity} de la population partagent ce profil.`
              : `Only ${type?.rarity} of the population share this profile.`}
          </p>
        </div>

        {/* Locked type card — shows real type data to create FOMO */}
        <div
          className="rounded-2xl p-5 mb-4 relative overflow-hidden"
          style={{ background: 'white', border: '1px solid #e7e5e0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <div className="space-y-3">
            {/* Type identity — emoji + code + name */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ background: 'rgba(109,40,217,0.08)' }}
              >
                {type?.emoji ?? typeCode.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-black text-stone-900 tracking-widest">
                  {typeCode.slice(0, 2)}<span className="blur-sm opacity-30">??</span>
                </div>
                {type?.name && (
                  <div className="text-xs font-semibold text-stone-500 mt-0.5">{type.name}</div>
                )}
              </div>
            </div>
            {/* Tagline visible + shortDesc: first sentence clear, rest blurred */}
            {type && (
              <div className="select-none">
                <p className="text-[10px] italic text-stone-400 mb-1 leading-relaxed">{type.tagline}</p>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  {type.shortDesc.split('.')[0]}.
                  <span className="blur-[3px] opacity-40 pointer-events-none">
                    {' '}{type.shortDesc.split('.').slice(1, 3).join('. ').trim()}.
                  </span>
                </p>
              </div>
            )}
          </div>
          <div
            className="absolute inset-0 flex items-end justify-center pb-4 rounded-2xl"
            style={{ background: 'linear-gradient(to top, rgba(250,249,247,0.98) 0%, rgba(250,249,247,0.65) 40%, transparent 100%)' }}
          >
            <div className="text-center">
              <div className="mb-1 flex justify-center" style={{ color: '#7c3aed' }}><LockIcon /></div>
              <p className="text-xs text-stone-500 font-semibold">
                {isFr ? 'Ton profil complet est verrouillé 🔒' : 'Your full profile is locked 🔒'}
              </p>
            </div>
          </div>
        </div>

        {/* What's inside — personalized per type */}
        <div
          className="rounded-xl px-4 py-3 mb-4"
          style={{ background: 'rgba(109,40,217,0.05)', border: '1px solid rgba(109,40,217,0.15)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#7c3aed' }}>
            {isFr ? '✦ Ce que tu vas ressentir' : '✦ What you\'ll feel'}
          </p>
          <ul className="space-y-2">
            {/* First strength visible, rest blurred */}
            <li className="flex items-start gap-2 text-xs text-stone-700">
              <span className="flex-shrink-0 text-base leading-none mt-0.5">⚡</span>
              <span>
                {isFr ? 'Tes forces : ' : 'Your strengths: '}
                <span className="font-semibold text-stone-800">{type?.strengths?.[0]}</span>
                <span className="blur-[3px] opacity-40 select-none pointer-events-none">
                  {`, ${type?.strengths?.[1]}, ${type?.strengths?.[2]}...`}
                </span>
              </span>
            </li>
            {/* First compatible type visible, others blurred */}
            <li className="flex items-start gap-2 text-xs text-stone-700">
              <span className="flex-shrink-0 text-base leading-none mt-0.5">❤️</span>
              <span>
                {isFr ? 'Compatible avec : ' : 'Compatible with: '}
                <span className="font-semibold text-stone-800">{type?.compatibleWith?.[0]}</span>
                <span className="blur-[3px] opacity-40 select-none pointer-events-none">
                  {`, ${type?.compatibleWith?.[1]}, ${type?.compatibleWith?.[2]}, ${type?.compatibleWith?.[3]}`}
                </span>
              </span>
            </li>
            {/* First celebrity visible, others blurred */}
            <li className="flex items-start gap-2 text-xs text-stone-700">
              <span className="flex-shrink-0 text-base leading-none mt-0.5">🌟</span>
              <span>
                {isFr ? 'Comme eux : ' : 'Famous examples: '}
                <span className="font-semibold text-stone-800">{type?.famousExamples?.[0]}</span>
                <span className="blur-[3px] opacity-40 select-none pointer-events-none">
                  {`, ${type?.famousExamples?.[1]}, ${type?.famousExamples?.[2]}...`}
                </span>
              </span>
            </li>
            {/* Generic last item */}
            <li className="flex items-start gap-2 text-xs text-stone-700">
              <span className="flex-shrink-0 text-base leading-none mt-0.5">🧠</span>
              <span>{isFr ? 'Analyse amour, travail, axes de croissance' : 'Love, career & growth full analysis'}</span>
            </li>
          </ul>
        </div>

        {/* Countdown timer */}
        <CountdownTimer isFr={isFr} />

        {/* Premium features teaser */}
        <div className="mb-5 rounded-2xl overflow-hidden" style={{ border: '1.5px solid rgba(124,58,237,0.25)', background: 'linear-gradient(135deg,rgba(124,58,237,0.05),rgba(236,72,153,0.03))' }}>
          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#7c3aed' }}>
              {isFr ? '✦ Réservé aux membres Premium' : '✦ Premium members only'}
            </p>
            <h3 className="text-sm font-black text-stone-900 leading-snug">
              {isFr
                ? `Ce qui change concrètement avec l'abonnement :`
                : 'What concretely changes with a subscription:'}
            </h3>
          </div>

          {/* Suivi 15 jours */}
          <div className="mx-4 mb-3 rounded-xl p-3.5" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🧠</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-stone-900 mb-0.5">
                  {isFr ? 'Suivi psychologique 15 jours' : '15-day psychological journey'}
                </p>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {isFr
                    ? `Un programme personnalisé pour ton type ${typeCode ?? ''}. 15 jours de conseils, exercices et révélations sur toi-même — en 3 phases : te connaître, tes relations, tes projets.`
                    : `A personalized program for your ${typeCode ?? ''} type. 15 days of insights, exercises and self-discovery.`}
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {(isFr ? ['🧠 Me connaître', '💝 Mes relations', '🎯 Mes projets'] : ['🧠 Know yourself', '💝 Relationships', '🎯 Projects']).map(tag => (
                    <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>{tag}</span>
                  ))}
                </div>
                {/* Locked day preview */}
                <div className="mt-2 rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <span className="text-sm">🔒</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-stone-500">{isFr ? 'Aperçu Jour 1' : 'Day 1 preview'}</p>
                    <p className="text-[10px] text-stone-400 truncate">{isFr ? 'Ton moteur secret — découvre ce qui te motive vraiment...' : 'Your secret engine — discover what truly drives you...'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compatibilité 240 paires */}
          <div className="mx-4 mb-3 rounded-xl p-3.5" style={{ background: 'rgba(236,72,153,0.07)', border: '1px solid rgba(236,72,153,0.2)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💑</span>
              <div>
                <p className="text-xs font-black text-stone-900 mb-0.5">
                  {isFr ? 'Compatibilité MBTI — 240 paires analysées' : 'MBTI Compatibility — 240 pairs analyzed'}
                </p>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {isFr
                    ? `Tes dynamiques avec chacun des 15 autres types. Amour, amitié, travail — ce qui se passe réellement entre ${typeCode ?? 'toi'} et les autres.`
                    : `Your dynamics with each of the 15 other types. Love, friendship, work.`}
                </p>
                <div className="mt-2 flex gap-1.5 overflow-hidden">
                  {['INFJ','ENFP','INTJ','ENTP','ISFJ'].map(t => (
                    <span key={t} className="text-[9px] font-black px-2 py-1 rounded-lg flex-shrink-0" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
                      🔒 {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fusion mode */}
          <div className="mx-4 mb-4 rounded-xl p-3.5" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚗️</span>
              <div>
                <p className="text-xs font-black text-stone-900 mb-0.5">
                  {isFr ? 'Mode Fusion — profil de groupe' : 'Fusion Mode — group profile'}
                </p>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {isFr
                    ? '2 à 10 personnes répondent ensemble. Découvrez votre personnalité collective, vos forces en groupe et vos dynamiques d\'équipe.'
                    : '2-10 people answer together. Discover your group personality and team dynamics.'}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <p className="text-[10px] text-center font-semibold" style={{ color: '#7c3aed', opacity: 0.8 }}>
              {isFr
                ? '+ Accès illimité à tous les quiz · Nouveaux contenus chaque mois'
                : '+ Unlimited quiz access · New content every month'}
            </p>
          </div>
        </div>

        {/* Persuasive value section */}
        <div className="mb-5">

          {/* Headline + intro */}
          <div className="text-center mb-4 px-1">
            <h2 className="text-base font-black text-stone-900 mb-2 leading-snug">
              {isFr ? 'Ton résultat n\'est que le début.' : 'Your result is just the beginning.'}
            </h2>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              {isFr
                ? 'Ton profil révèle bien plus qu\'un simple type. Débloque des analyses exclusives sur tes relations, tes compatibilités, tes points forts cachés — et les comportements que tu reproduis sans t\'en rendre compte.'
                : 'Your profile reveals far more than a simple type. Unlock exclusive insights into your relationships, compatibilities, hidden strengths — and the patterns you repeat without realising.'}
            </p>
          </div>

          {/* Tier cards */}
          <div className="space-y-2.5">

            {/* PASS RÉSULTAT */}
            <div className="rounded-xl p-4" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#7c3aed' }}>
                  {isFr ? 'PASS RÉSULTAT' : 'RESULT PASS'}
                </span>
                <span className="text-sm font-black text-stone-900">1,99 €</span>
              </div>
              <ul className="space-y-1.5 mb-2.5">
                {(isFr ? [
                  'Tu sais enfin qui tu es vraiment',
                  'Tu comprends tes vraies réactions',
                  'Tu mets des mots sur ce que tu ressens',
                ] : [
                  'You finally know who you truly are',
                  'You understand your real reactions',
                  'You put words to what you feel',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-stone-600">
                    <span className="font-bold flex-shrink-0 mt-px" style={{ color: '#10b981' }}>✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-stone-400 italic">
                {isFr ? 'Pour ceux qui veulent se comprendre, pas juste avoir 4 lettres.' : 'For those who want to understand themselves, not just get 4 letters.'}
              </p>
            </div>

            {/* PREMIUM */}
            <div className="rounded-xl p-4" style={{ background: 'white', border: '1.5px solid rgba(124,58,237,0.25)' }}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#7c3aed' }}>
                  PREMIUM
                </span>
                <span className="text-sm font-black text-stone-900">{isFr ? '9,99 €/mois' : '€9.99/mo'}</span>
              </div>
              <ul className="space-y-1.5 mb-2.5">
                {(isFr ? [
                  'Tu comprends pourquoi tu réagis comme ça — en amour, en conflit, sous pression',
                  'Tu sors du doute sur tes relations les plus importantes',
                  'Tu te connais mieux en 10 min qu\'en 10 ans d\'introspection',
                  'Tu découvres tes vrais points forts (et ce qui te bloque)',
                  'Tu deviens meilleur·e dans ta peau chaque mois',
                ] : [
                  'You understand why you react the way you do — in love, conflict, under pressure',
                  'You get clarity on your most important relationships',
                  'You know yourself better in 10 min than in 10 years of introspection',
                  'You discover your real strengths (and what blocks you)',
                  'You feel better about yourself every month',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-stone-600">
                    <span className="font-bold flex-shrink-0 mt-px" style={{ color: '#7c3aed' }}>✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-stone-400 italic">
                {isFr
                  ? 'Pour ceux qui veulent vraiment se libérer mentalement et mieux vivre leurs relations.'
                  : 'For those who want mental freedom and better relationships.'}
              </p>
            </div>

            {/* PASS ANNUEL — highlighted */}
            <div
              className="rounded-xl p-4 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.07),rgba(236,72,153,0.05))', border: '2px solid rgba(124,58,237,0.35)' }}
            >
              <span
                className="absolute top-0 right-0 text-white text-[9px] font-black tracking-wider px-2.5 py-1 rounded-bl-lg"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
              >
                {isFr ? 'LE PLUS POPULAIRE' : 'MOST POPULAR'}
              </span>
              <div className="flex items-center justify-between mb-2.5 pr-16">
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#7c3aed' }}>
                  {isFr ? 'PASS ANNUEL' : 'ANNUAL PASS'}
                </span>
                <span className="text-sm font-black text-stone-900">{isFr ? '29,99 €/an' : '€29.99/yr'}</span>
              </div>
              <ul className="space-y-1.5 mb-2.5">
                {(isFr ? [
                  'Tout ce que le Premium offre — pour un an de transformation',
                  'Tu te libères mentalement sur la durée',
                  'Tu construis une vraie connaissance de toi-même',
                  'Meilleure offre — 2,50€/mois seulement',
                ] : [
                  'Everything Premium — for a full year of transformation',
                  'Long-term mental freedom',
                  'You build real self-knowledge over time',
                  'Best value — only €2.50/month',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-stone-700">
                    <span className="font-bold flex-shrink-0 mt-px" style={{ color: '#7c3aed' }}>✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] italic" style={{ color: '#7c3aed', opacity: 0.8 }}>
                {isFr ? 'Économise 70 % par rapport au mensuel.' : 'Save 70% compared to monthly.'}
              </p>
            </div>

          </div>
        </div>

        {/* Paywall buttons — DO NOT MODIFY onClick handlers */}
        <div className="space-y-2">
          {/* Hero CTA — 1,99€ */}
          <button
            onClick={() => doCheckout('onetime')}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}>
            {loading
              ? (isFr ? 'Chargement…' : 'Loading…')
              : isFr
                ? `🔓 Révéler le profil ${type?.name ?? typeCode} — 1,99 €`
                : `🔓 Reveal the ${type?.name ?? typeCode} profile — €1.99`}
          </button>
          <p className="text-center text-[11px] text-stone-400">
            {isFr ? 'Sans compte requis · Accès immédiat · Paiement unique' : 'No account needed · Instant access · One-time payment'}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-2 pb-1">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[10px] text-stone-400 uppercase tracking-wider whitespace-nowrap">
              {isFr ? 'Accès illimité' : 'Unlimited access'}
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <button
            onClick={() => doCheckout('annual')}
            disabled={loading}
            className="w-full rounded-xl text-left px-4 pt-3 pb-3.5 relative overflow-hidden transition-all hover:shadow-md disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.07),rgba(236,72,153,0.05))', border: '2px solid rgba(124,58,237,0.35)', boxShadow: '0 2px 8px rgba(124,58,237,0.08)' }}>
            <span className="absolute top-0 right-0 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>−75%</span>
            <span className="flex items-center justify-between pr-8 mb-2.5">
              <span className="flex flex-col gap-0.5">
                <span className="font-bold text-stone-900 text-xs">{isFr ? `🗓 ${typeCode} + 15 profils · Quiz illimités · Duo` : `🗓 ${typeCode} + 15 profiles · Unlimited quizzes · Duo`}</span>
                <span className="text-stone-400 text-[11px]">{isFr ? '2,50 €/mois seulement' : 'Only €2.50/month'}</span>
              </span>
              <span className="flex flex-col items-end ml-2 flex-shrink-0">
                <span className="font-black text-stone-900 text-sm">{isFr ? '29,99 €' : '€29.99'}</span>
                <span className="text-stone-400 text-[10px]">{isFr ? '/an' : '/yr'}</span>
              </span>
            </span>
            <div className="text-center py-2 rounded-lg text-xs font-black text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              {loading ? '…' : isFr ? 'Souscrire maintenant →' : 'Subscribe now →'}
            </div>
          </button>
          <button
            onClick={() => doCheckout('monthly')}
            disabled={loading}
            className="w-full rounded-xl text-left px-4 pt-3 pb-3.5 transition-all hover:bg-stone-50 disabled:opacity-60"
            style={{ background: 'white', border: '1.5px solid #d6d3d1' }}>
            <span className="flex items-center justify-between mb-2.5">
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold text-stone-800 text-xs">{isFr ? `🔄 Accès complet ${type?.name ?? typeCode} · Sans engagement` : `🔄 Full ${type?.name ?? typeCode} access · No commitment`}</span>
                <span className="text-stone-400 text-[11px]">{isFr ? 'Annule quand tu veux' : 'Cancel anytime'}</span>
              </span>
              <span className="flex flex-col items-end ml-2 flex-shrink-0">
                <span className="font-black text-stone-900 text-sm">{isFr ? '9,99 €' : '€9.99'}</span>
                <span className="text-stone-400 text-[10px]">{isFr ? '/mois' : '/mo'}</span>
              </span>
            </span>
            <div className="text-center py-2 rounded-lg text-xs font-semibold border border-stone-300 text-stone-700">
              {loading ? '…' : isFr ? 'Choisir ce plan →' : 'Choose this plan →'}
            </div>
          </button>
        </div>

        <p className="text-center text-[11px] text-stone-400 mt-3">
          {isFr ? '🔒 Paiement sécurisé Stripe · CB, Apple Pay, Google Pay' : '🔒 Secure Stripe payment · Card, Apple Pay, Google Pay'}
        </p>
      </div>
    </div>
  );
}

// ─── Root component ─────────────────────────────────────────────────────────────

export default function PersonnaliteClient() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';
  const { lang } = useLang();
  const [phase, setPhase] = useState<'quiz' | 'analysis' | 'gate' | 'result'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('pending')?.toUpperCase();
      if (p && mbtiTypes[p]) return 'gate'; // loading state until session resolves
    }
    return 'quiz';
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [mbtiType, setMbtiType] = useState('');
  const [inAppWarning, setInAppWarning] = useState(false);

  const questions = lang === 'en' ? mbtiQuestionsEn : mbtiQuestions;
  const t = ui[lang].quiz;

  // Log initial phase and URL params on first render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pending = params.get('pending')?.toUpperCase() ?? null;
    const intent = params.get('intent') ?? null;
    diagLog('page_load', { phase, hasPending: !!pending, pendingType: pending, urlIntent: intent });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect in-app browser (TikTok, Instagram, Snapchat…) — block immediately
  useEffect(() => {
    const ua = navigator.userAgent || '';
    // Android WebView adds "wv" token — covers TikTok "Navigateur Web" and all other in-app browsers
    const isAndroidWebView = /Android/.test(ua) && /\bwv\b/.test(ua);
    // iOS WebView has AppleWebKit but no "Safari" in UA
    const isIOSWebView = /iP(hone|ad|od)/.test(ua) && /AppleWebKit/.test(ua) && !/Safari/.test(ua);
    const isSocialApp = /FBAN|FBAV|Instagram|TikTok|BytedanceWebview|MicroMessenger|Snapchat|musical_ly|trill|ZhiLiao/.test(ua);
    if (isAndroidWebView || isIOSWebView || isSocialApp) {
      setInAppWarning(true);
      diagLog('inapp_detected', { ua: ua.slice(0, 120) });
    }
  }, []);

  // Affiliate tracking — persist ref in localStorage as fallback (cookie set by middleware, httpOnly)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') ?? params.get('utm_campaign') ?? '';
      const source = params.get('utm_source') ?? '';
      const refValue = (ref || source).toLowerCase().slice(0, 32);
      if (refValue && /^[a-z0-9_-]{2,32}$/.test(refValue)) {
        localStorage.setItem('_urs_ref', refValue);
        track('affiliate_click', { ref: refValue, source: source || 'direct' });
        diagLog('affiliate_click', { ref: refValue, source });
      }
    } catch {}
  }, []);

  // Restore type from URL (?pending=INFJ) after returning from auth, or from localStorage
  useEffect(() => {
    if (sessionStatus === 'loading') return;
    const params = new URLSearchParams(window.location.search);
    const pending = params.get('pending')?.toUpperCase();

    diagLog('session_restore_fired', {
      status: sessionStatus,
      hasEmail: !!session?.user?.email,
      pending: pending ?? null,
    });

    if (session?.user?.email) {
      if (pending && mbtiTypes[pending]) {
        diagLog('pending_found_authed', { pending });
        window.history.replaceState(null, '', '/quiz/personnalite');
        fetch('/api/user/save-mbti', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mbtiType: pending }),
        }).catch(() => {});
        setMbtiType(pending);
        if (isPremium) { router.push(`/types/${pending.toLowerCase()}`); }
        else { setPhase('result'); }
        return;
      }
      try {
        const saved = localStorage.getItem('_mbti_pending');
        if (saved && mbtiTypes[saved]) {
          diagLog('type_from_localstorage', { saved });
          localStorage.removeItem('_mbti_pending');
          fetch('/api/user/save-mbti', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mbtiType: saved }),
          }).catch(() => {});
          setMbtiType(saved);
          if (isPremium) { router.push(`/types/${saved.toLowerCase()}`); }
          else { setPhase('result'); }
        }
      } catch {}
    } else {
      // Not authenticated — if we were waiting for magic link, show paywall with type from URL/storage
      if (pending && mbtiTypes[pending]) {
        diagLog('pending_found_not_authed', { pending });
        window.history.replaceState(null, '', '/quiz/personnalite');
        setMbtiType(pending);
        setPhase('result');
      } else {
        try {
          const saved = localStorage.getItem('_mbti_pending');
          if (saved && mbtiTypes[saved]) {
            diagLog('type_from_localstorage_not_authed', { saved });
            setMbtiType(saved);
            setPhase('result');
          } else if (phase === 'gate') {
            setPhase('quiz');
          }
        } catch {
          if (phase === 'gate') setPhase('quiz');
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email, sessionStatus]);

  const handleComplete = (ans: Answers) => {
    track('quiz_complete', { quiz: 'personnalite', content_name: 'Test MBTI' });
    setAnswers(ans);
    setPhase('analysis');
  };

  const handleAnalysisDone = useCallback(async () => {
    const type = computeMbtiType(answers);
    diagLog('analysis_done', { type, hasSession: !!session?.user, isPremium });
    setMbtiType(type);
    try { localStorage.setItem('_mbti_pending', type); } catch {}
    // Also encode type in URL — survives TikTok browser localStorage wipe on navigation
    try { window.history.replaceState(null, '', `/quiz/personnalite?pending=${type}`); } catch {}
    if (session?.user) {
      fetch('/api/user/save-mbti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mbtiType: type }),
      }).catch(() => {});
      if (isPremium) {
        router.push(`/types/${type.toLowerCase()}`);
        return;
      }
    }
    // Everyone (logged in free OR anonymous) sees the paywall directly
    setPhase('result');
  }, [answers, session, isPremium, router]);

  return (
    <main className="min-h-screen text-stone-900" style={{ background: '#faf9f7' }}>
      {/* InAppBrowserOverlay: shown only at paywall — quiz itself works in TikTok/Instagram browser */}
      {inAppWarning && phase === 'result' && <InAppBrowserOverlay />}
      {phase === 'quiz' && (
        <QuizScreen onComplete={handleComplete} questions={questions} t={t} />
      )}
      {phase === 'analysis' && (
        <AnalysisScreen onDone={handleAnalysisDone} t={t} />
      )}
      {phase === 'gate' && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf9f7' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl animate-spin" style={{ animationDuration: '1.5s' }}>🔮</div>
            <p className="text-stone-400 text-sm font-medium">Chargement de tes résultats…</p>
          </div>
        </div>
      )}
      {phase === 'result' && (
        <ResultTeaser typeCode={mbtiType} lang={lang} userEmail={session?.user?.email} />
      )}
    </main>
  );
}
