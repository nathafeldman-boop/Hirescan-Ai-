'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { mbtiQuestions, computeMbtiType, mbtiTypes, MbtiQuestion } from '@/lib/mbti';
import { mbtiQuestionsEn } from '@/lib/i18n/mbtiQuestionsEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';
import { track } from '@/lib/analytics';
import SocialProofToast from '@/components/SocialProofToast';

// ─── In-app browser detection ───────────────────────────────────────────────────
function detectInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/musical_ly|tiktok|bytedance|instagram|fbav|fban|snapchat|line|kakaotalk|wechat|micromessenger/i.test(ua)) return true;
  if (/android/i.test(ua) && / wv[);]/i.test(ua)) return true;
  if (/iphone|ipad/i.test(ua)) {
    const hasSafariVersion = /version\/[\d.]+.*safari/i.test(ua);
    const isChrome = /crios\//i.test(ua);
    const isFirefox = /fxios\//i.test(ua);
    if (!hasSafariVersion && !isChrome && !isFirefox) return true;
  }
  return false;
}

// ─── Short quiz: 8 questions per dimension = 32 total ───────────────────────────
// Balanced subset: keep the first `perDim` questions of each MBTI dimension.
// computeMbtiType only scores answered questions, so a shorter quiz is safe and
// still determines the type reliably — while dramatically boosting completion.
function getBalancedQuestions(all: MbtiQuestion[], perDim: number): MbtiQuestion[] {
  const seen: Record<string, number> = {};
  const result: MbtiQuestion[] = [];
  for (const q of all) {
    seen[q.dimension] = (seen[q.dimension] ?? 0) + 1;
    if (seen[q.dimension] <= perDim) result.push(q);
  }
  return result;
}

// ─── Diagnostic logger ──────────────────────────────────────────────────────────
// Writes to browser console AND to the PageView DB so steps are visible in admin.
// Path format: /__diag/<step> — queryable in the admin diagnostic section.
function diagLog(step: string, meta: Record<string, unknown> = {}) {
  // eslint-disable-next-line no-console
  console.log(`%c[FUNNEL] ${step}`, 'color:#d17d52;font-weight:bold', meta);
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
          style={{ width: `${pct}%`, background: 'linear-gradient(to right,#a94e18,#d17d52)' }}
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
    50: { emoji: '⚡', title: 'Ton profil prend forme...', sub: 'Le résultat révèle ta face cachée, ton schéma en amour et tes angles morts. Continue.' },
    75: { emoji: '🔓', title: 'Ton type est presque déterminé !', sub: 'Profil complet + les quiz secrets (infidélité, amour, manipulation) à débloquer. Tu y es presque.' },
  };

  useEffect(() => {
    track('quiz_start', { quiz: 'personnalite', content_name: 'Test MBTI' });
  }, []);

  // Keep ref in sync so visibilitychange always reads latest question
  useEffect(() => { currentRef.current = current; }, [current]);

  // Track milestones + show motivation banner — percentage-based so it works
  // for any quiz length (20q in-app / 24q browser).
  useEffect(() => {
    const total = questions.length;
    const pct = ((current + 1) / total) * 100;
    for (const mark of [25, 50, 75]) {
      if (pct >= mark && !trackedMilestones.current.has(mark)) {
        trackedMilestones.current.add(mark);
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: `/__quiz/q${mark}` }),
        }).catch(() => {});
        if (MILESTONE_MSGS[mark]) {
          setMilestoneMsg(MILESTONE_MSGS[mark]);
          setTimeout(() => setMilestoneMsg(null), 2800);
        }
        break;
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
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', animation: 'fadeInDown 0.3s ease' }}
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
          { key: 'A' as const, label: "Totalement d'accord", color: '#a94e18' },
          { key: 'B' as const, label: "Plutôt d'accord",     color: '#d17d52' },
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
    const duration = 2200;
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
        <div className="mb-6" style={{ color: '#c2611f' }}><BrainIcon /></div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">{t.analysisStages[stage]}</h2>
        <p className="text-stone-500 text-sm mb-8">{t.doNotClose}</p>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right,#a94e18,#d17d52)' }}
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
        @keyframes iab-glow  { 0%,100%{box-shadow:0 0 28px rgba(169,78,24,.45)} 50%{box-shadow:0 0 48px rgba(209,125,82,.65)} }
        @keyframes iab-pulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes iab-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* Blurred MBTI profile card — Zeigarnik hook */}
      <div className="relative mb-7" style={{ animation: 'iab-float 2.6s ease-in-out infinite' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-3xl blur-2xl opacity-60"
             style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', transform: 'scale(1.15)' }}/>

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
                     background: i%2===0 ? 'rgba(169,78,24,0.35)' : 'rgba(209,125,82,0.22)',
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
                style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}>1</span>
          <p className="text-white/75 text-sm leading-snug pt-0.5">
            Appuie sur les <strong className="text-white">⋯</strong> en haut à droite
          </p>
        </div>
        <div className="flex items-start gap-3 p-3.5 rounded-2xl"
             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)' }}>
          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}>2</span>
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
            background: copied ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'linear-gradient(270deg,#a94e18,#d17d52,#a94e18)',
            backgroundSize: '300% 100%',
            animation: copied ? 'none' : 'iab-shimmer 3s linear infinite, iab-glow 2s ease-in-out infinite',
            boxShadow: copied ? '0 10px 36px rgba(34,197,94,0.4)' : '0 10px 36px rgba(169,78,24,0.55)'
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
  // 48-hour offer window from first visit — persists across sessions (stronger
  // urgency than a 15-min timer that obviously resets on every reload).
  const DURATION = 48 * 60 * 60;
  const [seconds, setSeconds] = useState(() => {
    try {
      const end = localStorage.getItem('_urs_offer_end');
      if (end) {
        const rem = Math.round((parseInt(end) - Date.now()) / 1000);
        if (rem > 0 && rem <= DURATION) return rem;
      }
    } catch {}
    const endTs = Date.now() + DURATION * 1000;
    try { localStorage.setItem('_urs_offer_end', endTs.toString()); } catch {}
    return DURATION;
  });

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  if (seconds <= 0) return (
    <div className="flex items-center justify-center gap-1.5 mb-3">
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black bg-red-50 border border-red-200 text-red-600">
        🔥 {isFr ? 'Offre de lancement — prix réduit actif' : 'Launch offer — reduced price active'}
      </span>
    </div>
  );
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 60).toString().padStart(2, '0');
  const label = h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}:${s}`;

  return (
    <div className="flex items-center justify-center gap-1.5 mb-3">
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black bg-red-50 border border-red-200 text-red-600">
        🔥 {isFr ? `Offre de lancement — expire dans ${label}` : `Launch offer — expires in ${label}`}
      </span>
    </div>
  );
}

// ─── Per-type emotional hook (curiosity gap — #1 conversion lever) ──────────────
const HOOK_LINES: Record<string, string> = {
  INTJ: 'Pourquoi tu sembles froid(e) alors que tu ressens tout en profondeur',
  INTP: 'Pourquoi tu procrastines sur tes propres projets malgré ton intelligence',
  ENTJ: 'Pourquoi on te voit comme autoritaire quand tu veux juste être efficace',
  ENTP: 'Pourquoi tu t\'ennuies si vite — même avec les gens que tu aimes',
  INFJ: 'Pourquoi tu t\'épuises à tout porter pour les autres',
  INFP: 'Pourquoi tu te sens incompris(e) même par ceux qui t\'aiment',
  ENFJ: 'Pourquoi tu mets les autres avant toi jusqu\'à t\'oublier',
  ENFP: 'Pourquoi tu commences tout avec passion sans jamais finir',
  ISTJ: 'Pourquoi tu portes tout le monde sans que personne le remarque',
  ISFJ: 'Pourquoi tu dis oui quand tu veux dire non — encore et encore',
  ESTJ: 'Pourquoi on te trouve trop dur(e) quand tu veux juste aider',
  ESFJ: 'Pourquoi tu as besoin que tout le monde aille bien pour aller bien',
  ISTP: 'Pourquoi tu fuis dès que quelqu\'un s\'attache vraiment à toi',
  ISFP: 'Pourquoi tu n\'oses pas montrer ce que tu crées vraiment',
  ESTP: 'Pourquoi tu t\'ennuies dès que la relation devient sécurisante',
  ESFP: 'Pourquoi tu as besoin d\'attention pour te sentir vraiment aimé(e)',
};

// Realistic unlock counts per type (proportional to MBTI rarity × user base)
const TYPE_COUNTS: Record<string, number> = {
  ISFJ: 2847, ISTJ: 2631, ESFJ: 2418, ESTJ: 2193,
  ENFP: 1847, ESFP: 1923, ISFP: 1762, ISTP: 1247,
  INFP: 1138, ESTP: 1089, ENFJ: 931, ENTJ: 923,
  INTJ: 768, INTP: 831, INFJ: 634, ENTP: 912,
};

// ─── Paywall email capture (abandon recovery) ───────────────────────────────────
// For users not ready to pay: capture the email so we can send their welcome +
// follow-up. POSTs to /api/save-email which fires a welcome email per new lead.
// onCaptured: called with the email after save — parent can immediately offer checkout.
function PaywallEmailCapture({ typeCode, isFr, onCaptured }: {
  typeCode: string;
  isFr: boolean;
  onCaptured?: (email: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) return;
    setState('loading');
    try {
      await fetch('/api/save-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), typeCode }),
      });
    } catch {}
    setState('done');
  };

  if (state === 'done') {
    return (
      <div className="rounded-2xl p-4 mt-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
        <p className="text-sm font-bold text-stone-800 mb-1">📩 {isFr ? 'Profil sauvegardé !' : 'Profile saved!'}</p>
        <p className="text-xs text-stone-500 mb-3">
          {isFr ? 'Vérifie ta boîte. Ou débloque tout de suite 👇' : 'Check your inbox. Or unlock right now 👇'}
        </p>
        <button
          onClick={() => onCaptured?.(email.trim())}
          className="w-full py-3 rounded-xl font-black text-white text-sm active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 3px 14px rgba(169,78,24,0.32)' }}
        >
          {isFr ? `⚡ Débloquer mon profil ${typeCode} — 1,99 €` : `⚡ Unlock my ${typeCode} profile — €1.99`}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 mt-5" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
      <p className="text-sm font-bold text-stone-800 mb-1">
        📩 {isFr ? `Garde ton profil ${typeCode} — gratuit` : `Save your ${typeCode} profile — free`}
      </p>
      <p className="text-xs text-stone-500 mb-3">
        {isFr ? 'Reçois ton profil par email. Aucun spam, aucun engagement.' : 'Get your profile by email. No spam, no commitment.'}
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          placeholder={isFr ? 'ton@email.com' : 'your@email.com'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: '#faf9f7', border: '1px solid #e7e5e0', color: '#2b2622' }}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="px-4 py-2.5 rounded-lg font-bold text-white text-sm flex-shrink-0 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}
        >
          {state === 'loading' ? '…' : '→'}
        </button>
      </form>
    </div>
  );
}

// ─── FAQ — removes objections before they kill the sale ─────────────────────
function PaywallFAQ({ typeCode, isFr }: { typeCode: string; isFr: boolean }) {
  const [open, setOpen] = useState<number | null>(null);

  const items = isFr ? [
    {
      q: `C'est quoi exactement pour 1,99 €?`,
      a: `Ton profil ${typeCode} complet en 4 chapitres : Amour & Relations, Carrière & Superpouvoir, Face cachée & Angles morts, Compatibilité exacte. Paiement unique — accès immédiat, à vie. Zéro abonnement.`,
    },
    {
      q: `Est-ce un abonnement?`,
      a: `Non. 1,99 € est un paiement unique, pas un abonnement. Tu paies une fois et tu gardes l'accès pour toujours. L'option mensuelle à 9,99 €/mois est un abonnement — résiliable en 1 clic depuis ton espace.`,
    },
    {
      q: `Satisfait ou remboursé?`,
      a: `Oui, 7 jours, aucune question posée. Envoie un email à support@urcecret.site et tu es remboursé(e) sous 24h.`,
    },
    {
      q: `Mes données sont-elles protégées?`,
      a: `Le paiement est traité à 100 % par Stripe — nous ne stockons aucune donnée bancaire. Tes réponses au quiz restent strictement anonymes.`,
    },
  ] : [
    {
      q: `What exactly do I get for €1.99?`,
      a: `Your complete ${typeCode} profile in 4 chapters: Love & Relationships, Career & Superpower, Shadow Side & Blind Spots, Exact Compatibility. One-time payment — instant, lifetime access. Zero subscription.`,
    },
    {
      q: `Is it a subscription?`,
      a: `No. €1.99 is a one-time payment, not a subscription. Pay once, keep access forever. The €9.99/month option is a subscription — cancel in 1 click anytime.`,
    },
    {
      q: `Money-back guarantee?`,
      a: `Yes, 7 days, no questions asked. Email support@urcecret.site and you'll be refunded within 24h.`,
    },
    {
      q: `Is my data protected?`,
      a: `Payment is 100% processed by Stripe — we never store card data. Your quiz answers remain strictly anonymous.`,
    },
  ];

  return (
    <div className="mt-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 text-center">
        {isFr ? 'Questions fréquentes' : 'FAQ'}
      </p>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e7e5e0', background: 'white' }}>
        {items.map((item, i) => (
          <div key={i} className={i < items.length - 1 ? 'border-b border-stone-100' : ''}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3"
            >
              <p className="text-xs font-bold text-stone-800 leading-snug">{item.q}</p>
              <span
                className="flex-shrink-0 text-stone-400 text-sm"
                style={{ display: 'inline-block', transition: 'transform 0.2s', transform: open === i ? 'rotate(180deg)' : 'none' }}
              >
                ▾
              </span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 -mt-1">
                <p className="text-[12px] text-stone-600 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Exit intent modal (mobile back button) ───────────────────────────────────
function ExitIntentModal({ typeCode, isFr, onCheckout, onClose }: {
  typeCode: string;
  isFr: boolean;
  onCheckout: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl px-5 pt-6 pb-10"
        style={{ background: '#faf9f7', animation: 'exitModalUp 0.32s cubic-bezier(0.22,1,0.36,1)' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes exitModalUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div className="w-10 h-1 rounded-full bg-stone-200 mx-auto mb-5" />
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">⏰</div>
          <h3 className="text-xl font-black text-stone-900 leading-tight mb-2">
            {isFr
              ? `Ton profil ${typeCode} s'efface dans 24h`
              : `Your ${typeCode} profile expires in 24h`}
          </h3>
          <p className="text-sm text-stone-500 leading-snug">
            {isFr
              ? `Une fois parti(e), ton profil ${typeCode} sera archivé. Débloque-le maintenant — une fois, pour toujours.`
              : `Once you leave, your ${typeCode} profile gets archived. Unlock it now — once, forever.`}
          </p>
        </div>
        <button
          onClick={() => { onClose(); onCheckout(); }}
          className="w-full py-4 rounded-2xl font-black text-white text-sm mb-3 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 6px 24px rgba(169,78,24,0.4)' }}
        >
          {isFr ? `⚡ Débloquer maintenant — 1,99 €` : `⚡ Unlock now — €1.99`}
        </button>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs text-stone-400 text-center active:opacity-70"
        >
          {isFr ? 'Non merci, je préfère partir' : "No thanks, I'll leave"}
        </button>
      </div>
    </div>
  );
}

// ─── Share my type — viral loop ────────────────────────────────────────────
function ShareMyType({ typeCode, isFr }: { typeCode: string; isFr: boolean }) {
  const [copied, setCopied] = useState(false);
  const type = mbtiTypes[typeCode];
  const url = typeof window !== 'undefined' ? `${window.location.origin}/quiz/personnalite` : 'https://urcecret.site/quiz/personnalite';
  const text = isFr
    ? `Je suis ${typeCode} ${type?.emoji ?? ''} "${type?.name ?? ''}" 🔮 — ce test MBTI est effrayant de précision\n${url}`
    : `I'm ${typeCode} ${type?.emoji ?? ''} "${type?.name ?? ''}" 🔮 — this MBTI test is frighteningly accurate\n${url}`;

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ text: isFr ? `Je suis ${typeCode} ${type?.emoji ?? ''} — ${url}` : `I'm ${typeCode} ${type?.emoji ?? ''} — ${url}`, url }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
  };

  return (
    <button
      onClick={share}
      className="block w-full mt-4 rounded-2xl p-3.5 text-center transition-all active:scale-[0.98]"
      style={{ background: 'rgba(169,78,24,0.05)', border: '1px solid rgba(169,78,24,0.18)', textDecoration: 'none' }}
    >
      <p className="text-sm font-black" style={{ color: '#a94e18' }}>
        {copied ? '✅ Lien copié !' : (isFr ? `📤 Partager mon résultat ${typeCode}` : `📤 Share my ${typeCode} result`)}
      </p>
      <p className="text-[11px] text-stone-400 mt-0.5">
        {isFr ? 'Envoie à un ami — découvrez vos compatibilités' : 'Send to a friend — discover your compatibility'}
      </p>
    </button>
  );
}

// ─── Result teaser (free users — logged in or not) ─────────────────────────────
// Auth gate removed: user goes straight to Stripe which collects their email.
// The success page creates the account automatically from the Stripe email.

function ResultTeaser({ typeCode, lang, userEmail, isInApp }: {
  typeCode: string; lang: string; userEmail?: string | null; isInApp?: boolean;
}) {
  const type = mbtiTypes[typeCode];
  const isFr = lang !== 'en';
  const [loading, setLoading] = useState(false);
  // Pre-fetched Stripe URLs for in-app browsers (TikTok etc.)
  // Using an <a href> instead of window.location.href lets TikTok open Stripe in Safari
  // where the post-payment redirect back to /success works correctly.
  const [inAppPayUrl, setInAppPayUrl] = useState<string | null>(null);
  const [inAppMonthlyUrl, setInAppMonthlyUrl] = useState<string | null>(null);
  const [stickyBar, setStickyBar] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const exitShown = useRef(false);

  useEffect(() => {
    track('paywall_view', { quiz: 'personnalite' });
    diagLog('paywall_mounted', { typeCode, hasEmail: !!userEmail });
    const t = setTimeout(() => setStickyBar(true), 15000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intercept browser back button — show exit intent modal instead of navigating away.
  // Pushes a fake history entry on mount so the first back press triggers our handler.
  useEffect(() => {
    window.history.pushState({ paywall: true }, '');
    const onPop = () => {
      if (!exitShown.current) {
        exitShown.current = true;
        setExitModal(true);
        window.history.pushState({ paywall: true }, '');
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fetch checkout URLs immediately when in-app browser is detected, so the
  // TikTok <a target="_blank"> tap opens Stripe in Safari (where redirects work).
  // We pre-fetch both the monthly (MRR hero) and the one-time downsell.
  useEffect(() => {
    if (!isInApp || !typeCode) return;
    let affiliateRef = '';
    try { affiliateRef = localStorage.getItem('_urs_ref') ?? ''; } catch {}
    const base = {
      origin: window.location.origin,
      quizSlug: 'personnalite',
      typeCode,
      ...(userEmail ? { userEmail } : {}),
      ...(affiliateRef ? { affiliateRef } : {}),
    };
    fetch('/api/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base, oneTime: true }),
    }).then(r => r.json()).then(d => { if (d.url) setInAppPayUrl(d.url); }).catch(() => {});
    fetch('/api/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base }),
    }).then(r => r.json()).then(d => { if (d.url) setInAppMonthlyUrl(d.url); }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInApp, typeCode]);

  const doCheckout = useCallback(async (checkoutType: 'onetime' | 'annual' | 'monthly', emailOverride?: string) => {
    const email = emailOverride ?? userEmail;
    diagLog(email ? 'checkout_with_email' : 'checkout_no_email', { intent: checkoutType });
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
          ...(email ? { userEmail: email } : {}),
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: '#faf9f7' }}>
      <SocialProofToast />
      {exitModal && (
        <ExitIntentModal
          typeCode={typeCode}
          isFr={isFr}
          onCheckout={() => doCheckout('onetime')}
          onClose={() => setExitModal(false)}
        />
      )}
      <div className="w-full max-w-sm">

        {/* ─── Hero: type revealed for free — trust + curiosity gap ─────────── */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-3 mb-3 px-5 py-3 rounded-2xl"
               style={{ background: 'white', border: '1.5px solid rgba(169,78,24,0.25)', boxShadow: '0 4px 16px rgba(169,78,24,0.08)' }}>
            <span className="text-4xl">{type?.emoji ?? '🔮'}</span>
            <div className="text-left">
              <div className="text-3xl font-black tracking-widest leading-none" style={{ color: '#a94e18' }}>
                {typeCode}
              </div>
              <div className="text-sm font-semibold text-stone-500 mt-0.5">{isFr ? (type?.name ?? '') : typeCode}</div>
            </div>
          </div>
          <p className="text-xs text-stone-400 mb-2">
            {isFr ? `${type?.rarity ?? ''} de la population · ton analyse complète ci-dessous` : `${type?.rarity ?? ''} of people · your full analysis below`}
          </p>
          {isFr && type?.tagline && (
            <p className="text-xs text-stone-500 italic mb-2 leading-snug">«&nbsp;{type.tagline}&nbsp;»</p>
          )}
          {type?.famousExamples && type.famousExamples.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
              <span className="text-[10px] text-stone-400">{isFr ? `Célèbres ${typeCode} :` : `Famous ${typeCode}:`}</span>
              {type.famousExamples.slice(0, 3).map((f: string) => (
                <span key={f} className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-stone-600"
                      style={{ background: 'rgba(169,78,24,0.06)', border: '1px solid rgba(169,78,24,0.12)' }}>
                  {f}
                </span>
              ))}
            </div>
          )}
          {isFr && HOOK_LINES[typeCode] ? (
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(169,78,24,0.06)', border: '1px solid rgba(169,78,24,0.18)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#a94e18' }}>Ton profil complet révèle</p>
              <p className="text-sm font-bold text-stone-800 leading-snug">{HOOK_LINES[typeCode]}</p>
            </div>
          ) : !isFr ? (
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(169,78,24,0.06)', border: '1px solid rgba(169,78,24,0.18)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#a94e18' }}>Your full profile reveals</p>
              <p className="text-sm font-bold text-stone-800 leading-snug">Why you feel misunderstood — even by people who know you well</p>
            </div>
          ) : null}
        </div>

        {/* ─── Profile teaser — first lines of actual content, then fade out ── */}
        {isFr && type?.fullDesc && (
          <div className="rounded-2xl px-4 pt-4 pb-2 mb-3 relative overflow-hidden" style={{ background: 'white', border: '1px solid #e7e5e0' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#a94e18' }}>
              {`Aperçu de ton profil ${typeCode}`}
            </p>
            <p className="text-sm text-stone-700 leading-relaxed">
              {type.fullDesc.slice(0, 130)}
              <span className="text-stone-300 select-none pointer-events-none" style={{ filter: 'blur(4px)' }}>
                {type.fullDesc.slice(130, 210)}…
              </span>
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-10"
                 style={{ background: 'linear-gradient(to bottom, transparent, white)' }} />
          </div>
        )}

        {/* ─── 4 locked chapters — show what's inside to create desire ─────── */}
        <div className="rounded-2xl overflow-hidden mb-3" style={{ border: '1px solid #e7e5e0', background: 'white' }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100"
               style={{ background: 'rgba(169,78,24,0.04)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#a94e18' }}>
              {isFr ? `Profil ${typeCode} complet · 4 chapitres` : `Full ${typeCode} profile · 4 chapters`}
            </p>
            <span className="text-[10px] text-stone-400 font-semibold">🔒 verrouillé</span>
          </div>
          {(isFr ? [
            { icon: '💕', title: 'Amour & Relations', preview: 'Pourquoi tu t\'investis toujours plus que l\'autre — et le schéma douloureux qui se répète...' },
            { icon: '💼', title: 'Carrière & Superpouvoir', preview: 'La compétence rare que tu as sans le savoir — et comment la transformer en avantage réel...' },
            { icon: '🌑', title: 'Face cachée & Angles morts', preview: 'Ce que tu fais inconsciemment qui te sabote — et que personne n\'ose te dire en face...' },
            { icon: '🎯', title: 'Compatibilité exacte', preview: 'Les 3 types qui te comprennent vraiment — et les 2 profils qui te drainent à coup sûr...' },
          ] : [
            { icon: '💕', title: 'Love & Relationships', preview: 'Why you always invest more than the other — and the painful pattern that keeps repeating...' },
            { icon: '💼', title: 'Career & Superpower', preview: 'The rare skill you have without knowing it — and how to turn it into a real advantage...' },
            { icon: '🌑', title: 'Shadow Side & Blind Spots', preview: 'What you do unconsciously that sabotages you — that nobody dares to say to your face...' },
            { icon: '🎯', title: 'Exact Compatibility', preview: 'The 3 types that truly get you — and the 2 profiles that always drain you...' },
          ]).map((s, i, arr) => (
            <div key={s.title} className={`flex items-center gap-3 px-4 py-3${i < arr.length - 1 ? ' border-b border-stone-100' : ''}`}>
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-800">{s.title}</p>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5 blur-[4px] select-none pointer-events-none">{s.preview}</p>
              </div>
              <span className="text-stone-300 text-xs">🔒</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-stone-500 mb-3">
          ⭐ {TYPE_COUNTS[typeCode] ?? 847} {isFr ? `personnes ont débloqué leur profil ${typeCode} ce mois` : `people unlocked their ${typeCode} profile this month`}
        </p>

        <CountdownTimer isFr={isFr} />

        {/* ── TikTok : compte gratuit en premier ──────────────────────────────
            Ouvre Safari via <a target="_blank"> → login possible → email capturé.
            Payment reste disponible en dessous comme option secondaire.       */}
        {isInApp && (
          <div className="rounded-2xl p-4 mt-4" style={{ background: 'white', border: '2px solid rgba(169,78,24,0.35)', boxShadow: '0 4px 16px rgba(169,78,24,0.08)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#a94e18' }}>
              ✦ Gratuit — Sauvegarde ton résultat
            </p>
            <p className="text-sm font-bold text-stone-900 mb-1">
              {isFr ? `Crée ton compte pour retrouver ton profil ${typeCode} à tout moment` : `Create an account to access your ${typeCode} profile anytime`}
            </p>
            <p className="text-xs text-stone-500 mb-3">
              {isFr ? 'Gratuit · Pas de carte · 30 secondes' : 'Free · No card required · 30 seconds'}
            </p>
            <a
              href={`/login?callbackUrl=${encodeURIComponent(`/quiz/personnalite?pending=${typeCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => diagLog('inapp_signup_click', { typeCode })}
              className="block w-full py-3.5 rounded-xl font-black text-white text-sm text-center"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 16px rgba(169,78,24,0.25)', textDecoration: 'none' }}
            >
              {isFr ? `Sauvegarder mon profil ${typeCode} →` : `Save my ${typeCode} profile →`}
            </a>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              {isFr ? "S'ouvre dans Safari · Google ou email 🔓" : 'Opens in Safari · Google or email 🔓'}
            </p>
          </div>
        )}

        {/* ── Quick-entry CTA — 1,99€ first visible button (fastest path to pay) ── */}
        {!isInApp && (
          <div className="rounded-2xl px-4 py-3.5 mb-0 mt-4" style={{ background: 'rgba(169,78,24,0.05)', border: '1.5px solid rgba(169,78,24,0.3)' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-stone-900 leading-snug">
                  {isFr ? `⚡ Juste mon profil ${typeCode}` : `⚡ Just my ${typeCode} profile`}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {isFr ? 'Paiement unique · pas d\'abonnement · accès à vie' : 'One-time · no subscription · lifetime access'}
                </p>
              </div>
              <button
                onClick={() => doCheckout('onetime')}
                disabled={loading}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl font-black text-sm transition-all active:scale-[0.97] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', color: 'white', boxShadow: '0 3px 12px rgba(169,78,24,0.3)', whiteSpace: 'nowrap' }}
              >
                {loading ? '…' : isFr ? '1,99 € →' : '€1.99 →'}
              </button>
            </div>
          </div>
        )}

        {/* 3 offers */}
        <div className="space-y-3 mt-4">
          {isInApp && (
            <p className="text-[11px] text-stone-400 text-center font-semibold pb-1">
              {isFr ? '— ou déverrouiller directement —' : '— or unlock directly —'}
            </p>
          )}

          {/* 1 — Mensuel (HERO · MRR) */}
          <div className="rounded-2xl p-4 relative" style={{ background: 'linear-gradient(135deg,rgba(169,78,24,0.08),rgba(209,125,82,0.06))', border: '2px solid rgba(169,78,24,0.35)' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-white text-[10px] font-black px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 2px 10px rgba(169,78,24,0.4)' }}>
                🔥 {isFr ? 'LE PLUS POPULAIRE' : 'MOST POPULAR'}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1 mt-2">
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#a94e18' }}>
                {isFr ? '🔄 Mensuel · sans engagement' : '🔄 Monthly · no commitment'}
              </span>
              <div className="text-right">
                <span className="text-xs text-stone-400 line-through mr-1">29,99 €</span>
                <span className="text-lg font-black text-stone-900">9,99 €<span className="text-xs font-normal text-stone-400">{isFr ? '/mois' : '/mo'}</span></span>
                <p className="text-[10px] text-stone-400">{isFr ? 'soit 0,33 €/jour' : 'just €0.33/day'}</p>
              </div>
            </div>
            <ul className="space-y-1.5 mb-4 mt-2">
              {(isFr ? [
                `Ton profil ${typeCode} complet : amour, carrière, face cachée`,
                'Les 16 types MBTI débloqués (comprends les autres)',
                'Tous les quiz + test de compatibilité duo illimité',
                'Résilie en 1 clic — sans engagement',
              ] : [
                `Your full ${typeCode} profile: love, career, shadow side`,
                'All 16 MBTI types unlocked',
                'All quizzes + unlimited duo compatibility',
                'Cancel in 1 click — no commitment',
              ]).map(b => (
                <li key={b} className="flex items-start gap-2 text-xs text-stone-700">
                  <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: '#a94e18' }}>✓</span>{b}
                </li>
              ))}
            </ul>
            {isInApp && inAppMonthlyUrl ? (
              <a
                href={inAppMonthlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => diagLog(userEmail ? 'checkout_with_email' : 'checkout_no_email', { intent: 'monthly', via: 'anchor' })}
                className="w-full py-3.5 rounded-xl font-black text-white text-sm active:scale-[0.98] text-center block"
                style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 20px rgba(169,78,24,0.35)', textDecoration: 'none' }}
              >
                {isFr ? '🔓 Commencer pour 9,99 €/mois →' : '🔓 Start for €9.99/mo →'}
              </a>
            ) : (
              <button
                onClick={() => doCheckout('monthly')}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 20px rgba(169,78,24,0.35)' }}
              >
                {loading ? '…' : isFr ? '🔓 Commencer pour 9,99 €/mois →' : '🔓 Start for €9.99/mo →'}
              </button>
            )}
            <p className="text-center text-[10px] text-stone-400 mt-2">
              {isFr ? 'Apple Pay · Google Pay · CB · Résiliation en 1 clic' : 'Apple Pay · Google Pay · Card · Cancel in 1 click'}
            </p>
          </div>

          {/* 2 — Annuel (best value) */}
          <div className="rounded-2xl p-4 relative" style={{ background: 'white', border: '1.5px solid #d6d3d1' }}>
            <span className="absolute top-0 right-0 text-white text-[9px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-xl" style={{ background: '#1f7a4d' }}>
              −75% · {isFr ? 'MEILLEURE VALEUR' : 'BEST VALUE'}
            </span>
            <div className="flex items-center justify-between mb-1 pr-28">
              <span className="text-[11px] font-black uppercase tracking-widest text-stone-500">
                {isFr ? '🗓 Annuel' : '🗓 Annual'}
              </span>
              <div className="text-right">
                <span className="text-xs text-stone-400 line-through mr-1">119,88 €</span>
                <span className="text-lg font-black text-stone-900">29,99 €</span>
                <span className="text-stone-400 text-xs">{isFr ? '/an' : '/yr'}</span>
              </div>
            </div>
            <p className="text-[10px] font-bold mb-3" style={{ color: '#1f7a4d' }}>{isFr ? '= 2,50 €/mois · économise 90 €' : '= €2.50/mo · save €90'}</p>
            <ul className="space-y-1.5 mb-4">
              {(isFr ? [
                `${typeCode} + les 16 profils MBTI débloqués`,
                'Tous les quiz + duo illimité',
                'Tous les futurs quiz inclus à vie',
              ] : [
                `${typeCode} + all 16 MBTI profiles unlocked`,
                'All quizzes + unlimited duo',
                'All future quizzes included forever',
              ]).map(b => (
                <li key={b} className="flex items-center gap-2 text-xs text-stone-700">
                  <span style={{ color: '#1f7a4d' }} className="font-bold flex-shrink-0">✓</span>{b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => doCheckout('annual')}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ border: '1.5px solid #1f7a4d', color: '#1f7a4d', background: 'rgba(31,122,77,0.05)' }}
            >
              {loading ? '…' : isFr ? "Choisir l'annuel — 2,50 €/mois →" : 'Choose annual — €2.50/mo →'}
            </button>
          </div>

          {/* 3 — Résultat unique (entrée petit prix) */}
          <div className="rounded-xl px-4 py-3.5" style={{ background: '#fafafa', border: '1px solid #e7e5e0' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest">{isFr ? '⚡ Juste mon résultat' : '⚡ Just my result'}</span>
              <div className="text-right">
                <span className="text-xs text-stone-300 line-through mr-1">9,99 €</span>
                <span className="text-sm font-black text-stone-700">1,99 €</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mb-2.5">{isFr ? `Ton profil ${typeCode} complet — paiement unique, accès immédiat` : `Your full ${typeCode} profile — one-time, instant access`}</p>
            {isInApp && inAppPayUrl ? (
              <a
                href={inAppPayUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => diagLog(userEmail ? 'checkout_with_email' : 'checkout_no_email', { intent: 'onetime', via: 'anchor' })}
                className="w-full py-2.5 rounded-lg font-semibold text-xs text-center block transition-all active:scale-[0.98]"
                style={{ border: '1.5px solid rgba(169,78,24,0.4)', background: 'white', color: '#a94e18', textDecoration: 'none' }}
              >
                {isFr ? `⚡ Commencer pour 1,99 € →` : `⚡ Start for €1.99 →`}
              </a>
            ) : (
              <button
                onClick={() => doCheckout('onetime')}
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold text-xs transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ border: '1.5px solid rgba(169,78,24,0.4)', background: 'white', color: '#a94e18' }}
              >
                {loading ? '…' : isFr ? `⚡ Commencer pour 1,99 € →` : `⚡ Start for €1.99 →`}
              </button>
            )}
          </div>

        </div>

        <div className="flex flex-col items-center gap-1.5 mt-4">
          <p className="text-center text-[11px] text-stone-400">
            {isFr ? '🔒 Paiement sécurisé Stripe · CB, Apple Pay, Google Pay' : '🔒 Secure Stripe · Card, Apple Pay, Google Pay'}
          </p>
          <p className="text-center text-[11px] font-semibold" style={{ color: '#1f7a4d' }}>
            {isFr ? '✓ Satisfait ou remboursé sous 7 jours' : '✓ 7-day money-back guarantee'}
          </p>
        </div>

        {/* Micro-reviews — 3 compact quotes to build trust */}
        <div className="mt-5 space-y-2">
          {(isFr ? [
            { name: 'Marie, 24 ans', text: '"J\'ai pleuré. C\'était exactement moi, chaque ligne."' },
            { name: 'Lucas, 28 ans', text: '"Je me suis enfin compris. La partie amour est effrayante de précision."' },
            { name: 'Camille, 22 ans', text: '"J\'ai montré le chapitre amour à ma copine. Elle était choquée."' },
          ] : [
            { name: 'Marie, 24', text: '"I cried. Every line was exactly me."' },
            { name: 'Lucas, 28', text: '"I finally understood myself. The love section is frighteningly accurate."' },
            { name: 'Camille, 22', text: '"I showed the love chapter to my partner. She was shocked."' },
          ]).map(r => (
            <div key={r.name} className="rounded-xl px-4 py-3 flex gap-2.5 items-start" style={{ background: 'white', border: '1px solid #f0ede8' }}>
              <span className="text-amber-400 text-xs flex-shrink-0 mt-0.5">★★★★★</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-700 leading-snug italic">{r.text}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">— {r.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ — pre-empts the top objections (subscription fear, refund policy) */}
        <PaywallFAQ typeCode={typeCode} isFr={isFr} />

        {/* Abandon recovery — in-place email capture (works in TikTok webview too,
            no Safari hop needed) → sends the targeted "profil prêt" email.
            onCaptured: immediately offers 1,99€ checkout after email save (warm lead). */}
        <PaywallEmailCapture
          typeCode={typeCode}
          isFr={isFr}
          onCaptured={(capturedEmail) => doCheckout('onetime', capturedEmail)}
        />

        {/* ── Share CTA — viral loop ──────────────────────────────────────── */}
        <ShareMyType typeCode={typeCode} isFr={isFr} />

      </div>

      {/* Sticky bar — appears after 15s for users still on page (shows lowest price to convert hesitants) */}
      {stickyBar && !loading && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-3 py-3" style={{ background: 'white', borderTop: '2px solid rgba(169,78,24,0.2)', boxShadow: '0 -4px 24px rgba(0,0,0,0.10)' }}>
          <div className="max-w-sm mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-stone-900 leading-snug">
                ⚡ {isFr ? `Commence à 1,99 € — profil ${typeCode} immédiat` : `Start at €1.99 — ${typeCode} profile instantly`}
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">{isFr ? 'Paiement unique · accès à vie · 7j remboursé' : 'One-time · lifetime access · 7-day refund'}</p>
            </div>
            <button
              onClick={() => { setStickyBar(false); doCheckout('onetime'); }}
              className="flex-shrink-0 px-4 py-2.5 rounded-xl font-black text-white text-xs whitespace-nowrap transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 2px 12px rgba(169,78,24,0.3)' }}
            >
              {isFr ? '1,99 € →' : '€1.99 →'}
            </button>
            <button onClick={() => setStickyBar(false)} className="text-stone-400 text-base p-1 leading-none flex-shrink-0">✕</button>
          </div>
        </div>
      )}
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
  const [isInApp] = useState(() => detectInAppBrowser());
  const baseQuestions = lang === 'en' ? mbtiQuestionsEn : mbtiQuestions;
  // Short, completable quiz for everyone (was 70 questions in browser → huge drop-off).
  // 6 per dimension (24q) in browser, 5 (20q) in TikTok in-app where patience is lowest.
  const questions = getBalancedQuestions(baseQuestions, isInApp ? 5 : 6);
  const t = ui[lang].quiz;

  // Log initial phase and URL params on first render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pending = params.get('pending')?.toUpperCase() ?? null;
    const intent = params.get('intent') ?? null;
    diagLog('page_load', { phase, hasPending: !!pending, pendingType: pending, urlIntent: intent });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <ResultTeaser typeCode={mbtiType} lang={lang} userEmail={session?.user?.email} isInApp={isInApp} />
      )}
    </main>
  );
}
