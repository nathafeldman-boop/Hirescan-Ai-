'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { mbtiQuestions, computeMbtiType, computeMbtiProfile, MbtiQuestion } from '@/lib/mbti';
import { mbtiTypesFree as mbtiTypes } from '@/lib/mbti-free';
import { mbtiQuestionsEn } from '@/lib/i18n/mbtiQuestionsEn';
import { useLang } from '@/contexts/LanguageContext';
import { ui } from '@/lib/i18n/ui';
import { track } from '@/lib/analytics';
import Seal from '@/components/Seal';

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
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'var(--gold)' }}
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
  const [milestoneMsg, setMilestoneMsg] = useState<{ title: string; sub: string } | null>(null);
  const trackedMilestones = useRef<Set<number>>(new Set());
  const currentRef = useRef(0);

  const MILESTONE_MSGS: Record<number, { title: string; sub: string }> = {
    25: { title: 'Tu es dans le top 25 %.', sub: 'La plupart des gens s\'arrêtent avant toi. Continue, ton type se dessine.' },
    50: { title: 'Ton profil prend forme.', sub: 'Le résultat révèle ta face cachée, ton schéma en amour et tes angles morts.' },
    75: { title: 'Ton type est presque là.', sub: 'Tu découvres dans quelques secondes pourquoi tu te comportes comme ça.' },
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
    <div className="min-h-[100dvh] max-w-xl mx-auto px-4 py-8 flex flex-col">
      {/* Milestone motivation banner */}
      {milestoneMsg && (
        <div
          className="fixed inset-x-4 top-4 z-50 rounded-2xl p-4 text-center shadow-2xl"
          style={{ background: 'var(--gold)', animation: 'fadeInDown 0.3s ease' }}
          onClick={() => setMilestoneMsg(null)}
        >
          <p className="font-display italic font-bold text-base leading-tight" style={{ color: 'var(--ink)' }}>{milestoneMsg.title}</p>
          <p className="text-xs mt-1 leading-snug" style={{ color: 'rgba(21,18,31,0.65)' }}>{milestoneMsg.sub}</p>
        </div>
      )}
      <ProgressBar current={current + 1} total={questions.length} label={t.questionOf(current + 1, questions.length)} />

      {/* Question + réponses centrées verticalement → remplit l'écran, plus de vide */}
      <div className="flex-1 flex flex-col justify-center">
      <div className="mb-10 text-center">
        <p className="ur-label text-[11px] mb-4" style={{ color: 'var(--gold)' }}>
          {t.dimLabel[q.dimension]}
        </p>
        <h2 className="font-display text-xl sm:text-2xl leading-snug" style={{ color: 'var(--ink)', fontWeight: 600 }}>{q.text}</h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {([
          { key: 'A' as const, label: "Totalement d'accord" },
          { key: 'B' as const, label: "Plutôt d'accord" },
          { key: 'C' as const, label: 'Neutre' },
          { key: 'D' as const, label: "Plutôt pas d'accord" },
          { key: 'E' as const, label: "Pas du tout d'accord" },
        ] as { key: QuizAnswer; label: string }[]).map(({ key, label }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => handleChoice(key)}
              disabled={animating}
              className={`w-full text-left px-5 py-3.5 rounded-2xl border transition-all duration-150 text-sm font-semibold flex items-center gap-3 ${
                isSelected ? 'scale-[0.98]' : 'hover:opacity-80'
              }`}
              style={isSelected
                ? { borderColor: 'var(--gold)', backgroundColor: 'var(--gold-soft)', color: 'var(--ink)' }
                : { borderColor: 'var(--line)', backgroundColor: 'var(--paper-panel)', color: 'var(--ink)' }}
            >
              <span className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                style={isSelected ? { borderColor: 'var(--gold)', backgroundColor: 'var(--gold)' } : { borderColor: 'var(--line)' }}>
                {isSelected && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--ink)' }} />}
              </span>
              {label}
            </button>
          );
        })}
      </div>
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--paper)' }}>
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6"><Seal size={64} color="var(--gold)" spin /></div>
        <h2 className="font-display text-xl leading-snug mb-2" style={{ color: 'var(--ink)', fontWeight: 600 }}>{t.analysisStages[stage]}</h2>
        <p className="text-stone-500 text-sm mb-8">{t.doNotClose}</p>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: 'var(--gold)' }}
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
         style={{ background: 'var(--ink)' }}>

      <style>{`
        @keyframes iab-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
      `}</style>

      {/* Sceau verrouillé — carte de type floutée, la promesse du dossier scellé */}
      <div className="relative mb-7" style={{ animation: 'iab-float 2.6s ease-in-out infinite' }}>
        <div className="ur-panel-ink relative px-7 py-5">

          <p className="ur-label text-[10px] mb-4" style={{ color: 'var(--gold)' }}>
            Ton type MBTI
          </p>

          {/* 4 lettres verrouillées */}
          <div className="flex gap-2 justify-center mb-4">
            {[0,1,2,3].map(i => (
              <div key={i}
                   className="w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-black"
                   style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--ink-text-faint)' }}>
                ?
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm">🔒</span>
            <p className="text-xs font-medium" style={{ color: 'var(--ink-text-muted)' }}>Connexion requise pour révéler</p>
          </div>
        </div>
      </div>

      {/* Headline */}
      <h2 className="font-display text-[1.6rem] font-black text-white mb-2 leading-tight">
        Ton profil est prêt&nbsp;!
      </h2>
      <p className="text-sm mb-6 leading-relaxed max-w-[17rem]" style={{ color: 'var(--ink-text-muted)' }}>
        Pour voir ton type et créer ton compte, ouvre dans ton navigateur —{' '}
        <strong style={{ color: 'var(--ink-text)' }}>ça prend 5 secondes</strong>
      </p>

      {/* Steps */}
      <div className="w-full max-w-[17rem] mb-6 space-y-2.5 text-left">
        <div className="ur-panel-ink flex items-start gap-3 p-3.5">
          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}>1</span>
          <p className="text-sm leading-snug pt-0.5" style={{ color: 'var(--ink-text-muted)' }}>
            Appuie sur les <strong style={{ color: 'var(--ink-text)' }}>⋯</strong> en haut à droite
          </p>
        </div>
        <div className="ur-panel-ink flex items-start gap-3 p-3.5">
          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}>2</span>
          <p className="text-sm leading-snug pt-0.5" style={{ color: 'var(--ink-text-muted)' }}>
            Appuie sur <strong style={{ color: 'var(--ink-text)' }}>&quot;Ouvrir dans le navigateur&quot;</strong>
          </p>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="w-full max-w-[17rem] space-y-3">
        <button
          onClick={openInChrome}
          className={copied ? 'w-full py-[1.05rem] rounded-full font-black text-base transition-all active:scale-[0.97]' : 'ur-btn-gold w-full py-[1.05rem] text-base'}
          style={copied ? { background: '#4ADE80', color: 'var(--ink)' } : undefined}>
          {copied ? '✅ Lien copié — colle dans Safari / Chrome !' : '🔓 Voir mon type MBTI'}
        </button>
        {copied && (
          <p className="text-xs text-center leading-snug px-2" style={{ color: 'var(--ink-text-muted)' }}>
            Le lien est dans ton presse-papiers — colle-le dans ton navigateur
          </p>
        )}
        {!copied && (
          <button
            onClick={copyLink}
            className="ur-btn-outline w-full py-3 text-sm font-semibold">
            📋 Copier le lien
          </button>
        )}
      </div>

      <p className="text-[11px] mt-5 max-w-[15rem] leading-relaxed" style={{ color: 'var(--ink-text-faint)' }}>
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
      <span className="ur-label inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]"
            style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }}>
        {isFr ? 'Offre de lancement, prix réduit actif' : 'Launch offer, reduced price active'}
      </span>
    </div>
  );
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 60).toString().padStart(2, '0');
  const label = h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}:${s}`;

  return (
    <div className="flex items-center justify-center gap-1.5 mb-3">
      <span className="ur-label inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]"
            style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }}>
        {isFr ? `Offre de lancement, expire dans ${label}` : `Launch offer, expires in ${label}`}
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


// Glyphes maison — trait 1.5px, grille 24. Remplacent les emojis d'interface.
function Glyph({ name, color = '#131110', size = 20 }: {
  name: 'heart' | 'compass' | 'moon' | 'key' | 'lock' | 'shield' | 'mirror' | 'spark' | 'eye' | 'leaf' | 'star';
  color?: string; size?: number;
}) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: 1.5,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'heart':   return <svg {...p}><path d="M12 20.2 4.9 13a4.6 4.6 0 1 1 6.5-6.5l.6.6.6-.6A4.6 4.6 0 1 1 19.1 13Z" /></svg>;
    case 'compass': return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5Z" /></svg>;
    case 'moon':    return <svg {...p}><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" /></svg>;
    case 'key':     return <svg {...p}><circle cx="8" cy="15.5" r="3.5" /><path d="m10.5 13 8-8M15 7.5 17.5 10M18 4.5 20 6.5" /></svg>;
    case 'lock':    return <svg {...p}><rect x="5.5" y="10.5" width="13" height="9" rx="2" /><path d="M8.5 10.5v-3a3.5 3.5 0 0 1 7 0v3" /></svg>;
    case 'shield':  return <svg {...p}><path d="M12 3.5 5 6.2v5.1c0 4.4 3 7.6 7 9.2 4-1.6 7-4.8 7-9.2V6.2Z" /></svg>;
    case 'mirror':  return <svg {...p}><ellipse cx="12" cy="10" rx="6.5" ry="7.5" /><path d="M12 17.5V21M8.5 21h7M9.2 6.8c.7-.9 1.8-1.6 3-1.8" /></svg>;
    case 'spark':   return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.2 6.2l2.6 2.6M15.2 15.2l2.6 2.6M17.8 6.2l-2.6 2.6M8.8 15.2l-2.6 2.6" /></svg>;
    case 'eye':     return <svg {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case 'leaf':    return <svg {...p}><path d="M5 19C5 10 10 5 19.5 4.5 20 14 15 19 6 19" /><path d="M5 19c3-3.5 6.5-7 10-9.5" /></svg>;
    case 'star':    return <svg {...p}><path d="m12 3.5 2.4 5 5.6.7-4.1 3.8 1.1 5.5L12 15.8l-5 2.7 1.1-5.5L4 9.2l5.6-.7Z" /></svg>;
  }
}

// Type-specific micro-testimonials — reference the type's exact pain point hook
const TYPE_REVIEWS: Record<string, { name: string; age: number; quote: string }> = {
  INTJ: { name: 'Thomas', age: 29, quote: "Je pensais me connaître. La partie amour m'a complètement contredit. Effrayant de précision." },
  INTP: { name: 'Julien', age: 25, quote: '"Pourquoi tu procrastines malgré ton intelligence" — j\'ai lu ça 3 fois. C\'est exactement moi.' },
  ENTJ: { name: 'Alexandre', age: 31, quote: 'La section "face cachée" sur l\'image d\'autorité... je l\'ai envoyé à toute mon équipe.' },
  ENTP: { name: 'Maxime', age: 27, quote: "L'ennui chronique enfin expliqué. Les compatibilités sont d'une précision ridicule." },
  INFJ: { name: 'Sophie', age: 24, quote: 'Je me suis reconnue mot pour mot dans la partie "angles morts". J\'en ai eu les larmes aux yeux.' },
  INFP: { name: 'Emma', age: 22, quote: '"Tu te sens incompris même par ceux qui t\'aiment" — comment ils savent ça?' },
  ENFJ: { name: 'Camille', age: 26, quote: "Le chapitre sur le sacrifice de soi m'a obligée à mettre pause et à réfléchir." },
  ENFP: { name: 'Léa', age: 23, quote: 'Ma mère a lu le chapitre carrière et dit "enfin quelqu\'un qui t\'explique mieux que moi".' },
  ISTJ: { name: 'Pierre', age: 34, quote: "La section amour était inconfortable. Pas parce que c'était faux — exactement parce que c'était trop juste." },
  ISFJ: { name: 'Marie', age: 28, quote: '"Tu dis oui quand tu veux dire non" — j\'ai ri et pleuré en même temps. Exactement moi.' },
  ESTJ: { name: 'Nicolas', age: 32, quote: "La partie sur comment je suis perçu vs ce que je veux — ça explique tous mes conflits au travail." },
  ESFJ: { name: 'Laura', age: 25, quote: "La partie \"Face cachée\" dit que je prends en charge les émotions de tout le monde sauf les miennes. J'ai dû m'arrêter." },
  ISTP: { name: 'Antoine', age: 27, quote: "Premier test perso qui ne me sonne pas creux. La section attachement est un peu trop vraie." },
  ISFP: { name: 'Chloé', age: 21, quote: "Je montrais jamais ce que je créais. Après le chapitre créativité — j'ai posté." },
  ESTP: { name: 'Kevin', age: 26, quote: "L'ennui en relation sécurisante... c'est exactement mon pattern. Je l'avais jamais nommé." },
  ESFP: { name: 'Sarah', age: 24, quote: "Le chapitre amour parle du besoin de validation. Inconfortable à lire — parce que trop vrai." },
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
      <div className="rounded-2xl p-4 mt-5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
        <p className="text-sm font-bold text-stone-800 mb-1">{isFr ? 'Profil sauvegardé !' : 'Profile saved!'}</p>
        <p className="text-xs text-stone-500 mb-3">
          {isFr ? 'Vérifie ta boîte, ou débloque tout de suite.' : 'Check your inbox, or unlock right now.'}
        </p>
        <button
          onClick={() => onCaptured?.(email.trim())}
          className="w-full py-3 rounded-full font-black text-sm active:scale-[0.98] transition-all"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}
        >
          {isFr ? `Débloquer mon profil complet, 1,99 €` : `Unlock my complete profile, €1.99`}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 mt-5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
      <p className="text-sm font-bold text-stone-800 mb-1">
        {isFr ? `Pas encore décidé ? Garde ton profil` : `Not ready yet? Save your profile`}
      </p>
      <p className="text-xs text-stone-500 mb-3">
        {isFr ? 'On te garde une place, gratuit, sans spam. Tu pourras le débloquer quand tu veux.' : 'We\'ll hold your spot, no spam. Unlock whenever you want.'}
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          placeholder={isFr ? 'ton@email.com' : 'your@email.com'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-full text-sm outline-none"
          style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="px-4 py-2.5 rounded-full font-bold text-sm flex-shrink-0 disabled:opacity-60"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}
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
      a: `2 résultats : ton profil complet (Amour, Carrière, Face cachée, Compatibilité) + 1 quiz UrCecret au choix (infidélité, amour véritable, manipulation…) dont le résultat est aussi débloqué. Paiement unique, accès immédiat, à vie. Zéro abonnement.`,
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
      a: `2 results: your complete profile (Love, Career, Shadow side, Compatibility) + 1 UrCecret quiz of your choice (infidelity, true love, manipulation…) with its result unlocked too. One-time payment, instant, lifetime access. Zero subscription.`,
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
      <p className="ur-label text-[10px] mb-3 text-center" style={{ color: 'var(--ink)', opacity: 0.5 }}>
        {isFr ? 'Questions fréquentes' : 'FAQ'}
      </p>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--line)', background: 'var(--paper-panel)' }}>
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
        style={{ background: 'var(--paper)', animation: 'exitModalUp 0.32s cubic-bezier(0.22,1,0.36,1)' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes exitModalUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--line)' }} />
        <div className="text-center mb-5">
          <div className="flex justify-center mb-3"><Seal size={44} color="var(--gold)" /></div>
          <h3 className="font-display text-xl leading-tight mb-2" style={{ color: 'var(--ink)', fontWeight: 700 }}>
            {isFr
              ? `Ton profil s'efface dans 24h`
              : `Your profile expires in 24h`}
          </h3>
          <p className="text-sm text-stone-500 leading-snug">
            {isFr
              ? `Une fois parti(e), ton profil sera archivé. Débloque-le maintenant, une fois, pour toujours.`
              : `Once you leave, your profile gets archived. Unlock it now, once, forever.`}
          </p>
        </div>
        <button
          onClick={() => { onClose(); onCheckout(); }}
          className="w-full py-4 rounded-full font-black text-sm mb-3 active:scale-[0.98] transition-all"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}
        >
          {isFr ? `Débloquer maintenant, 1,99 €` : `Unlock now, €1.99`}
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
// Le partage du type se fait uniquement après paiement, sur /success
// (MbtiShareCard). Le retirer d'ici évite de révéler le résultat gratuitement
// via le texte de partage avant l'achat.

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
  const [inAppPlusUrl, setInAppPlusUrl] = useState<string | null>(null);
  const [stickyBar, setStickyBar] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const exitShown = useRef(false);
  const [liveCount] = useState(() => {
    const base: Record<string, number> = {
      ISFJ: 7, ISTJ: 6, ESFJ: 8, ESTJ: 5, ENFP: 9, ESFP: 6,
      ISFP: 5, ISTP: 4, INFP: 4, ESTP: 3, ENFJ: 4, ENTJ: 3,
      INTJ: 3, INTP: 3, INFJ: 2, ENTP: 3,
    };
    return (base[typeCode] ?? 3) + Math.floor(Math.random() * 3);
  });

  useEffect(() => {
    track('paywall_view', { quiz: 'personnalite' });
    diagLog('paywall_mounted', { typeCode, hasEmail: !!userEmail });
    // Don't shove the paywall in their face on a timer — especially on TikTok.
    // Let them READ the free profile first (that's what creates the value/desire),
    // then surface the sticky bar once they've scrolled through the content.
    let shown = false;
    const show = () => { if (!shown) { shown = true; setStickyBar(true); } };
    const onScroll = () => {
      const reached = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      // In-app (TikTok): wait until they've consumed ~60% of the free content.
      // Web: a bit earlier at ~45%.
      const threshold = isInApp ? 0.6 : 0.45;
      if (total > 0 && reached / total >= threshold) show();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Long fallback so it still appears for users who don't scroll at all.
    const t = setTimeout(show, isInApp ? 24000 : 12000);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
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

  const doCheckout = useCallback(async (checkoutType: 'onetime' | 'annual' | 'monthly' | 'plus', emailOverride?: string) => {
    const email = emailOverride ?? userEmail;
    // Direct checkout — NO forced account before paying. The account is created
    // automatically from the Stripe email after payment (webhook + /success).
    diagLog(email ? 'checkout_with_email' : 'checkout_no_email', { intent: checkoutType });
    track('checkout_click', {
      quiz: 'personnalite',
      value: checkoutType === 'onetime' ? 1.99 : checkoutType === 'annual' ? 29.99 : checkoutType === 'plus' ? 5 : 9.99,
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
          ...(checkoutType === 'plus' ? { plus: true } : {}),
          ...(affiliateRef ? { affiliateRef } : {}),
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else {
        alert(data.error ?? 'Erreur de paiement'); setLoading(false);
      }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setLoading(false);
    }
  }, [typeCode, userEmail]);

  // Re-enable the pay buttons when returning to the page (e.g. back button from
  // Stripe restores the page from bfcache with loading still true → button stuck).
  useEffect(() => {
    const reset = () => setLoading(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  // In-app (TikTok) : pré-charge les URLs Stripe dès l'affichage du résultat.
  // C'est le mécanisme de l'ère qui a généré 100 % des ventes réelles : le
  // <a target="_blank"> ouvre Stripe hors du webview et le paiement aboutit
  // (encaissements Maeva/eric/Nolan). Ne pas retirer sans données contraires.
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
    fetch('/api/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base, plus: true }),
    }).then(r => r.json()).then(d => { if (d.url) setInAppPlusUrl(d.url); }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInApp, typeCode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: 'var(--paper)', animation: 'paywallReveal 0.45s ease' }}>
      <style>{`@keyframes paywallReveal{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {exitModal && (
        <ExitIntentModal
          typeCode={typeCode}
          isFr={isFr}
          onCheckout={() => doCheckout('onetime')}
          onClose={() => setExitModal(false)}
        />
      )}
      <div className="w-full max-w-sm">

        {/* ─── L'oracle voilé — RIEN du résultat n'est révélé avant paiement.
            Ni le code, ni le nom, ni la famille : le sceau tourne, encore
            fermé. Le type complet n'apparaît qu'après paiement (/success). ── */}
        <div className="relative rounded-[28px] mb-4 px-6 pt-8 pb-8 text-center ur-reveal overflow-hidden"
             style={{ background: 'var(--ink)', border: '1px solid var(--gold-line)' }}>
          <div aria-hidden className="absolute pointer-events-none rounded-full"
               style={{ top: -70, left: '50%', width: 260, height: 260, transform: 'translateX(-50%)',
                        background: 'radial-gradient(circle, var(--gold-soft) 0%, transparent 70%)' }} />

          <p className="ur-label text-[10px] mb-6 relative" style={{ color: 'var(--gold)' }}>
            {isFr ? 'Ta lecture est prête' : 'Your reading is ready'}
          </p>

          <div className="ur-fade-1 relative flex justify-center mb-5">
            <Seal size={76} spin />
          </div>

          <div className="ur-fade-1 relative">
            <p className="font-display italic leading-snug" style={{ fontSize: 19, fontWeight: 500, color: '#FAF6EC' }}>
              {isFr ? 'Ton type reste voilé tant que le sceau n\'est pas ouvert.' : 'Your type stays veiled until the seal is opened.'}
            </p>
          </div>

          <div className="ur-fade-2 mt-7 relative">
            <div className="ur-rule-ink mb-4" />
            <p className="ur-label text-[10px] mb-2" style={{ color: 'rgba(250,246,236,0.45)' }}>
              {isFr ? 'Ton profil complet révèle' : 'Your full profile reveals'}
            </p>
            <p className="font-display leading-snug" style={{ fontSize: 17, fontWeight: 500, color: '#FAF6EC' }}>
              {isFr
                ? 'Ton type exact, pourquoi tu fonctionnes comme ça, en amour, au travail, sous pression.'
                : 'Your exact type, why you function this way, in love, at work, under pressure.'}
            </p>
          </div>
        </div>

        {/* ─── Quick-entry CTA — immediately below hook, above the fold on mobile ── */}
        {!isInApp && (
          <div className="rounded-2xl px-4 py-3.5 mb-4"
               style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0"><Glyph name="key" color="var(--gold)" size={22} /></span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-stone-900 leading-snug" style={{ letterSpacing: '-0.01em' }}>
                    {isFr ? 'Mon profil MBTI + 1 quiz au choix' : 'My MBTI profile + 1 quiz'}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {isFr ? 'Deux résultats · un seul paiement · à vie' : 'Two results · one payment · lifetime'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => doCheckout('onetime')}
                disabled={loading}
                className="flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-60"
                style={{ background: 'var(--ink)', color: '#FAF6EC', whiteSpace: 'nowrap', boxShadow: '0 6px 18px rgba(19,17,16,0.22)' }}
              >
                {loading ? '…' : '1,99 €'}
              </button>
            </div>
            <p className="text-center text-[11px] mt-2.5 text-stone-400">
              {isFr ? 'Remboursé 7 jours, sans question.' : '7-day refund, no questions asked.'}
            </p>
          </div>
        )}

        {/* ─── Les portes fermées — titres seulement + teaser générique.
            Rien du vrai contenu du profil n'est montré avant le paiement. ── */}
        <div className="rounded-2xl overflow-hidden mb-3" style={{ border: '1px solid var(--line)', background: 'var(--paper-panel)' }}>
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#f0ebe0' }}>
            <p className="text-[10px] uppercase" style={{ color: '#131110', letterSpacing: '0.2em', fontWeight: 700 }}>
              {isFr ? `Profil complet · 8 chapitres` : `Full profile · 8 chapters`}
            </p>
            <span className="flex items-center gap-1.5 text-[10px] text-stone-400 font-semibold">
              <Glyph name="lock" color="#a08655" size={13} />
              {isFr ? 'verrouillé' : 'locked'}
            </span>
          </div>
          {(isFr ? [
            { glyph: 'mirror' as const,  title: 'Qui tu es vraiment', preview: 'Le portrait complet, celui que même tes proches n\'ont jamais mis en mots' },
            { glyph: 'heart' as const,   title: 'Amour & attachement', preview: 'Pourquoi tu t\'investis toujours plus que l\'autre, et le schéma douloureux qui se répète' },
            { glyph: 'compass' as const, title: 'Carrière & superpouvoir', preview: 'La compétence rare que tu as sans le savoir, et comment la transformer en avantage réel' },
            { glyph: 'spark' as const,   title: 'Tes forces', preview: 'Ce sur quoi tu peux compter chez toi, même quand tout tremble' },
            { glyph: 'eye' as const,     title: 'Tes angles morts', preview: 'Ce que tu fais inconsciemment qui te sabote, et que personne n\'ose te dire en face' },
            { glyph: 'moon' as const,    title: 'Ta face cachée & ta croissance', preview: 'Le côté de toi qui ne sort que sous pression, et comment en faire un allié' },
            { glyph: 'key' as const,     title: 'Compatibilités exactes', preview: 'Les types qui te comprennent vraiment, et les profils qui te drainent à coup sûr' },
            { glyph: 'star' as const,    title: 'Célébrités du même profil', preview: 'Les figures publiques qui partagent ton fonctionnement exact' },
          ] : [
            { glyph: 'mirror' as const,  title: 'Who you really are', preview: 'The full portrait — the one even the people close to you never put into words' },
            { glyph: 'heart' as const,   title: 'Love & attachment', preview: 'Why you always invest more than the other — and the painful pattern that keeps repeating' },
            { glyph: 'compass' as const, title: 'Career & superpower', preview: 'The rare skill you have without knowing it — and how to turn it into a real advantage' },
            { glyph: 'spark' as const,   title: 'Your strengths', preview: 'What you can count on in yourself, even when everything shakes' },
            { glyph: 'eye' as const,     title: 'Your blind spots', preview: 'What you do unconsciously that sabotages you — that nobody dares to say to your face' },
            { glyph: 'moon' as const,    title: 'Shadow side & growth', preview: 'The side of you that only shows under pressure — and how to make it an ally' },
            { glyph: 'key' as const,     title: 'Exact compatibilities', preview: 'The types that truly get you — and the profiles that always drain you' },
            { glyph: 'star' as const,    title: 'Famous people, same profile', preview: 'The public figures who share your exact wiring, and what it says about your ceiling' },
          ]).map((s, i, arr) => (
            <div key={s.title} className={`flex items-start gap-3.5 px-5 py-3.5${i < arr.length - 1 ? ' border-b' : ''}`}
                 style={{ borderColor: 'var(--line)' }}>
              <span className="flex-shrink-0 mt-0.5"><Glyph name={s.glyph} color="var(--gold)" size={19} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-stone-900" style={{ letterSpacing: '-0.01em' }}>{s.title}</p>
                <p className="text-[12px] text-stone-500 mt-0.5" style={{ lineHeight: 1.5 }}>
                  <span className="ur-cut select-none pointer-events-none">{s.preview}</span>
                </p>
              </div>
              <span className="flex-shrink-0 mt-1"><Glyph name="lock" color="var(--gold)" size={14} /></span>
            </div>
          ))}
        </div>

        {/* ─── Un profil qu'on rouvre toute sa vie — la valeur dans le temps ── */}
        <div className="rounded-2xl px-5 py-4 mb-3" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
          <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>
            {isFr ? 'Tu le rouvriras toute ta vie' : 'You will reopen it for life'}
          </p>
          <div className="space-y-2.5">
            {(isFr ? [
              'Avant un entretien, pour savoir comment te vendre sans te trahir',
              'Au début d\'une relation, pour comprendre comment tu t\'attaches',
              'Dans un conflit, pour voir ton angle mort avant qu\'il te coûte',
              'À chaque grande décision, pour trancher selon ton vrai fonctionnement',
            ] : [
              'Before an interview — to sell yourself without betraying yourself',
              'At the start of a relationship — to understand how you attach',
              'In a conflict — to see your blind spot before it costs you',
              'At every big decision — to choose according to your real wiring',
            ]).map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)', opacity: 0.7 }} />
                <p className="text-[12.5px] text-stone-600" style={{ lineHeight: 1.55 }}>{m}</p>
              </div>
            ))}
          </div>
          <div className="ur-rule my-3.5" />
          <p className="text-[12px] text-stone-500 text-center" style={{ lineHeight: 1.55 }}>
            {isFr
              ? <>Un bilan de personnalité chez un praticien coûte 150 € ou plus.<br /><span className="font-semibold text-stone-800">Ton profil complet : 1,99 €, gardé à vie.</span></>
              : <>A personality assessment with a practitioner costs €150+.<br /><span className="font-semibold text-stone-800">Your full profile: €1.99, kept for life.</span></>}
          </p>
        </div>

        <p className="text-center text-[11px] text-stone-500 mb-1">
          {TYPE_COUNTS[typeCode] ?? 847} {isFr ? `personnes ont débloqué leur profil ce mois` : `people unlocked their profile this month`}
        </p>
        <p className="text-center text-[11px] text-stone-400 mb-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 align-middle animate-pulse" />
          {liveCount} {isFr ? 'personnes consultent ce profil en ce moment' : 'people viewing this profile right now'}
        </p>

        <CountdownTimer isFr={isFr} />

        {/* ── Offres — visibles pour TOUT LE MONDE, y compris in-app TikTok.
            C'est le funnel qui a généré 100 % des ventes réelles : les liens
            Stripe sont préchargés et ouverts via <a target="_blank"> depuis
            le webview (le paiement aboutit, prouvé par les encaissements). ── */}
        {(

        <div className="space-y-3 mt-4">

          {/* HERO: One-time €1.99 — encre profonde, prix en or, sceau discret */}
          <div className="relative rounded-[28px] px-5 pt-6 pb-5 overflow-hidden" style={{ background: 'var(--ink)', border: '1px solid var(--gold-line)' }}>
            <div aria-hidden className="absolute pointer-events-none" style={{ top: -30, right: -30, opacity: 0.12 }}>
              <Seal size={140} />
            </div>
            <p className="ur-label text-[10px] mb-4 relative" style={{ color: 'rgba(250,246,236,0.45)' }}>
              {isFr ? 'Deux résultats, un paiement' : 'Two results, one payment'}
            </p>

            <div className="mb-5 relative">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display" style={{ fontSize: 44, fontWeight: 700, color: 'var(--gold)', letterSpacing: '-0.01em' }}>1,99 €</span>
                <span className="text-sm line-through" style={{ color: 'rgba(250,246,236,0.30)' }}>29,99 €</span>
              </div>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(250,246,236,0.55)' }}>
                {isFr ? 'Une seule fois, à vie, le prix d\'un café' : 'Once, lifetime, the price of a coffee'}
              </p>
            </div>

            <ul className="space-y-2.5 mb-5 relative">
              {(isFr ? [
                `Ton profil complet : amour, carrière, face cachée`,
                'Un quiz UrCecret au choix, résultat débloqué aussi',
                'Accès immédiat, conservé à vie, zéro abonnement',
              ] : [
                `Your complete profile: love, career, shadow side`,
                'One UrCecret quiz of your choice, result unlocked too',
                'Instant access, kept forever, zero subscription',
              ]).map(b => (
                <li key={b} className="flex items-start gap-2.5 text-[13px]" style={{ color: 'rgba(250,246,236,0.85)', lineHeight: 1.5 }}>
                  <span className="flex-shrink-0 mt-0.5 font-bold" style={{ color: 'var(--gold)' }}>✓</span>{b}
                </li>
              ))}
            </ul>

            {isInApp && inAppPayUrl ? (
              <a
                href={inAppPayUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => diagLog(userEmail ? 'checkout_with_email' : 'checkout_no_email', { intent: 'onetime', via: 'anchor' })}
                className="relative block w-full py-4 rounded-full font-bold text-[15px] text-center active:scale-[0.98] transition-transform"
                style={{ background: 'var(--gold)', color: 'var(--ink)', textDecoration: 'none' }}
              >
                {isFr ? `Débloquer mon profil complet, 1,99 €` : `Unlock my complete profile, €1.99`}
              </a>
            ) : (
              <button
                onClick={() => doCheckout('onetime')}
                disabled={loading}
                className="relative w-full py-4 rounded-full font-bold text-[15px] transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              >
                {loading ? '…' : isFr ? `Débloquer mon profil complet, 1,99 €` : `Unlock my complete profile, €1.99`}
              </button>
            )}
            <p className="text-center text-[11px] mt-2.5 relative" style={{ color: 'rgba(250,246,236,0.45)' }}>
              {isFr ? 'Apple Pay, Google Pay, CB. Accès immédiat.' : 'Apple Pay, Google Pay, Card. Instant access.'}
            </p>
          </div>

          {/* Plus — 5€/mois : profil débloqué + Coach IA personnel. Le milieu de
              gamme, mis en avant : la vraie valeur récurrente (coach ancré sur le test). */}
          <div className="relative rounded-[24px] px-5 pt-5 pb-4 overflow-hidden"
               style={{ background: 'var(--paper-panel)', border: '1.5px solid var(--gold)' }}>
            <span className="absolute top-0 right-4 -translate-y-1/2 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest"
                  style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
              {isFr ? 'LE PLUS CHOISI' : 'MOST POPULAR'}
            </span>
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 pr-3">
                <p className="text-[14px] font-black text-stone-900" style={{ letterSpacing: '-0.01em' }}>
                  {isFr ? 'Plus — ton profil + ton Coach IA' : 'Plus — your profile + your AI Coach'}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5" style={{ lineHeight: 1.5 }}>
                  {isFr ? 'Ton profil complet débloqué, puis un coach qui te connaît déjà' : 'Your full profile unlocked, then a coach who already knows you'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-display text-2xl text-stone-900" style={{ fontWeight: 800 }}>5 €</span>
                <span className="text-[11px] text-stone-400"> {isFr ? '/mois' : '/mo'}</span>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {(isFr ? [
                'Ton profil MBTI complet débloqué',
                'Ton Coach IA personnel, 30 messages/jour',
                'Il connaît ton type et te répond d\'après ton test',
                'Résiliable en 1 clic, sans engagement',
              ] : [
                'Your complete MBTI profile unlocked',
                'Your personal AI Coach, 30 messages/day',
                'It knows your type and answers based on your test',
                'Cancel in 1 click, no commitment',
              ]).map(b => (
                <li key={b} className="flex items-start gap-2.5 text-[12.5px] text-stone-700" style={{ lineHeight: 1.5 }}>
                  <span className="flex-shrink-0 mt-0.5 font-bold" style={{ color: 'var(--gold)' }}>✓</span>{b}
                </li>
              ))}
            </ul>
            {isInApp && inAppPlusUrl ? (
              <a
                href={inAppPlusUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => diagLog(userEmail ? 'checkout_with_email' : 'checkout_no_email', { intent: 'plus', via: 'anchor' })}
                className="block w-full py-3.5 rounded-full font-bold text-[14px] text-center transition-all active:scale-[0.98]"
                style={{ background: 'var(--gold)', color: 'var(--ink)', textDecoration: 'none' }}
              >
                {isFr ? 'Débloquer + mon Coach IA, 5 €/mois' : 'Unlock + my AI Coach, €5/mo'}
              </a>
            ) : (
              <button
                onClick={() => doCheckout('plus')}
                disabled={loading}
                className="w-full py-3.5 rounded-full font-bold text-[14px] transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              >
                {loading ? '…' : isFr ? 'Débloquer + mon Coach IA, 5 €/mois' : 'Unlock + my AI Coach, €5/mo'}
              </button>
            )}
          </div>

          {/* Secondary: Monthly subscription — panneau papier, plat */}
          <div className="rounded-2xl px-5 py-4" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[13px] font-bold text-stone-900" style={{ letterSpacing: '-0.01em' }}>
                  {isFr ? 'Accès illimité, sans engagement' : 'Unlimited access, no commitment'}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5" style={{ lineHeight: 1.5 }}>
                  {isFr ? 'Les 16 profils, tous les quiz, le mode duo' : 'All 16 profiles, every quiz, duo mode'}
                </p>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <span className="text-[11px] text-stone-300 line-through block">29,99 €</span>
                <span className="font-display text-lg text-stone-900" style={{ fontWeight: 700 }}>9,99 €</span>
                <span className="text-[11px] text-stone-400"> {isFr ? '/mois' : '/mo'}</span>
              </div>
            </div>
            {isInApp && inAppMonthlyUrl ? (
              <a
                href={inAppMonthlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => diagLog(userEmail ? 'checkout_with_email' : 'checkout_no_email', { intent: 'monthly', via: 'anchor' })}
                className="block w-full py-3 rounded-full font-semibold text-[13px] text-center transition-all active:scale-[0.98]"
                style={{ border: '1px solid var(--ink)', color: 'var(--ink)', background: 'transparent', textDecoration: 'none' }}
              >
                {isFr ? "Choisir l'abonnement" : 'Choose subscription'}
              </a>
            ) : (
              <button
                onClick={() => doCheckout('monthly')}
                disabled={loading}
                className="w-full py-3 rounded-full font-semibold text-[13px] transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ border: '1px solid var(--ink)', color: 'var(--ink)', background: 'transparent' }}
              >
                {loading ? '…' : isFr ? "Choisir l'abonnement" : 'Choose subscription'}
              </button>
            )}
          </div>
        </div>
        )}

        <div className="flex flex-col items-center gap-1.5 mt-4">
          <p className="text-center text-[11px] text-stone-400">
            {isFr ? 'Paiement sécurisé Stripe · CB, Apple Pay, Google Pay' : 'Secure Stripe payment · Card, Apple Pay, Google Pay'}
          </p>
          <p className="text-center text-[11px] font-semibold" style={{ color: '#1f7a4d' }}>
            {isFr ? '✓ Satisfait ou remboursé sous 7 jours' : '✓ 7-day money-back guarantee'}
          </p>
        </div>

        {/* Micro-reviews — type-specific top review + 2 generic */}
        <div className="mt-5 space-y-2">
          {TYPE_REVIEWS[typeCode] && isFr && (
            <div className="rounded-2xl px-4 py-3 flex gap-2.5 items-start" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
              <span style={{ color: 'var(--gold)' }} className="text-xs flex-shrink-0 mt-0.5">★★★★★</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-700 leading-snug italic">&ldquo;{TYPE_REVIEWS[typeCode].quote}&rdquo;</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{TYPE_REVIEWS[typeCode].name}, {TYPE_REVIEWS[typeCode].age} ans</p>
              </div>
            </div>
          )}
          {(isFr ? [
            { name: 'Lucas, 28 ans', text: '"Je me suis enfin compris. La partie amour est effrayante de précision."' },
            { name: 'Camille, 22 ans', text: '"J\'ai montré le chapitre amour à ma copine. Elle était choquée."' },
          ] : [
            { name: 'Marie, 24', text: '"I cried. Every line was exactly me."' },
            { name: 'Lucas, 28', text: '"I finally understood myself. The love section is frighteningly accurate."' },
            { name: 'Camille, 22', text: '"I showed the love chapter to my partner. She was shocked."' },
          ]).map(r => (
            <div key={r.name} className="rounded-2xl px-4 py-3 flex gap-2.5 items-start" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
              <span style={{ color: 'var(--gold)' }} className="text-xs flex-shrink-0 mt-0.5">★★★★★</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-700 leading-snug italic">{r.text}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{r.name}</p>
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

      </div>

      {/* Sticky bar — appears after 15s for users still on page (shows lowest price to convert hesitants) */}
      {stickyBar && !loading && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-3 py-3" style={{ background: 'var(--paper-panel)', borderTop: '1px solid var(--gold-line)', boxShadow: '0 -4px 24px rgba(0,0,0,0.10)' }}>
          <div className="max-w-sm mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-stone-900 leading-snug">
                {isFr ? `Ton profil complet, 1,99 €` : `Your full profile, €1.99`}
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                {isFr ? 'Paiement unique, accès à vie, 7j remboursé' : 'One-time, lifetime access, 7-day refund'}
              </p>
            </div>
            <button
              onClick={() => { setStickyBar(false); doCheckout('onetime'); }}
              className="flex-shrink-0 px-4 py-2.5 rounded-full font-black text-xs whitespace-nowrap transition-all active:scale-[0.97]"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
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

// ─── Sign-in gate ───────────────────────────────────────────────────────────────
// Affiché AVANT le test : on demande la connexion dès que la personne veut faire
// le test MBTI. La connexion revient sur /quiz/personnalite → le test démarre.
function SignInGate({ isFr }: { isFr: boolean }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10" style={{ background: 'var(--paper)' }}>
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-6"><Seal size={64} color="var(--gold)" spin /></div>
        <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>
          {isFr ? 'Test MBTI · 24 questions · gratuit' : 'MBTI test · 24 questions · free'}
        </p>
        <h1 className="font-display text-2xl leading-snug mb-2" style={{ color: 'var(--ink)', fontWeight: 700 }}>
          {isFr ? 'Connecte-toi pour découvrir ton type' : 'Sign in to discover your type'}
        </h1>
        <p className="text-sm text-stone-500 mb-7 leading-relaxed">
          {isFr
            ? 'On garde ton résultat et ton profil pour ton Coach IA. 10 secondes, sans mot de passe.'
            : 'We save your result and profile for your AI coach. 10 seconds, no password.'}
        </p>

        <button
          onClick={() => { setLoading(true); signIn('google', { callbackUrl: '/quiz/personnalite' }); }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-sm mb-3 transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ background: 'var(--ink)', color: '#FAF6EC' }}
        >
          {loading ? '…' : (<><span className="bg-white rounded-full p-0.5"><GoogleIcon /></span>{isFr ? 'Continuer avec Google' : 'Continue with Google'}</>)}
        </button>

        <a
          href="/login?callbackUrl=/quiz/personnalite"
          className="block w-full py-3.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98]"
          style={{ border: '1px solid var(--line)', color: 'var(--ink)', background: 'var(--paper-panel)' }}
        >
          {isFr ? 'Par email ou avec un code' : 'By email or with a code'}
        </a>

        <p className="text-[11px] text-stone-400 mt-5 leading-relaxed">
          {isFr ? 'En continuant, tu acceptes nos conditions d\'utilisation.' : 'By continuing, you accept our terms.'}
        </p>
      </div>
    </div>
  );
}

// ─── Root component ─────────────────────────────────────────────────────────────

export default function PersonnaliteClient() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const isPremium = ['premium', 'plus'].includes((session?.user as { tier?: string } | undefined)?.tier ?? '');
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

  // Masque le décor marketing/SEO autour du quiz (hero, "24 questions", texte SEO)
  // tant que le quiz est monté → écran net, sans les blocs qui dépassaient.
  // Le contenu reste dans le DOM (juste caché) donc Google l'indexe toujours.
  useEffect(() => {
    document.body.classList.add('quiz-active');
    return () => { document.body.classList.remove('quiz-active'); };
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
        // Rattache aussi les scores calculés au test (stockés avant la connexion)
        // pour que le coach IA soit personnalisé dès la première visite.
        let pendingScores: unknown = undefined;
        try { const raw = localStorage.getItem('_mbti_scores'); if (raw) pendingScores = JSON.parse(raw); } catch {}
        fetch('/api/user/save-mbti', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mbtiType: pending, ...(pendingScores ? { scores: pendingScores } : {}) }),
        }).catch(() => {});
        setMbtiType(pending);
        if (isPremium) { router.push(`/types/${pending.toLowerCase()}`); }
        else { setPhase('result'); }
        return;
      }
      // No ?pending in the URL → the test is FREE and must always be shown first.
      // We deliberately do NOT auto-jump to the paywall from a stale localStorage
      // type (that broke the "free test" promise and showed an old/fake result).
      if (phase === 'gate') setPhase('quiz');
    } else {
      // Not authenticated → the test is FREE and must ALWAYS be shown first.
      // A logged-out visitor NEVER lands on the paywall from a bare ?pending URL.
      // The result only appears in-session right after finishing the quiz, or
      // after signing in (handled by the authenticated branch above).
      if (pending) { try { window.history.replaceState(null, '', '/quiz/personnalite'); } catch {} }
      if (phase === 'gate') setPhase('quiz');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email, sessionStatus]);

  const handleComplete = (ans: Answers) => {
    track('quiz_complete', { quiz: 'personnalite', content_name: 'Test MBTI' });
    setAnswers(ans);
    setPhase('analysis');
  };

  const handleAnalysisDone = useCallback(async () => {
    const profile = computeMbtiProfile(answers);
    const type = profile.type;
    diagLog('analysis_done', { type, hasSession: !!session?.user, isPremium });
    setMbtiType(type);
    // Persist the type in localStorage ONLY so the /login round-trip can reattach
    // it to the post-auth callbackUrl. We do NOT put ?pending in the URL — that let
    // logged-out visitors reload straight onto the paywall, skipping the free test.
    try {
      localStorage.setItem('_mbti_pending', type);
      // Scores conservés pour être rattachés au compte après connexion (coach IA).
      localStorage.setItem('_mbti_scores', JSON.stringify(profile.scores));
    } catch {}
    if (session?.user) {
      fetch('/api/user/save-mbti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mbtiType: type, scores: profile.scores }),
      }).catch(() => {});
      if (isPremium) {
        router.push(`/types/${type.toLowerCase()}`);
        return;
      }
    }
    // Everyone (logged in free OR anonymous) sees the paywall directly
    setPhase('result');
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  }, [answers, session, isPremium, router]);

  return (
    // Scroll normal (fenêtre) → la barre collante + le retour en haut de la page
    // de résultat fonctionnent. Le contenu marketing/SEO autour est masqué via la
    // classe body `quiz-active` (posée par l'effet ci-dessous) mais reste dans le DOM.
    <main className="min-h-[100dvh] text-stone-900" style={{ background: 'var(--paper)' }}>
      {/* Connexion obligatoire avant le test. Tant que la session charge → spinner ;
          si non connecté → écran de connexion ; sinon → le test. */}
      {sessionStatus === 'loading' ? (
        <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: 'var(--paper)' }}>
          <div className="text-4xl animate-spin" style={{ animationDuration: '1.5s' }}>🔮</div>
        </div>
      ) : sessionStatus === 'unauthenticated' ? (
        <SignInGate isFr={lang !== 'en'} />
      ) : (
      <>
      {phase === 'quiz' && (
        <QuizScreen onComplete={handleComplete} questions={questions} t={t} />
      )}
      {phase === 'analysis' && (
        <AnalysisScreen onDone={handleAnalysisDone} t={t} />
      )}
      {phase === 'gate' && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl animate-spin" style={{ animationDuration: '1.5s' }}>🔮</div>
            <p className="text-stone-400 text-sm font-medium">Chargement de tes résultats…</p>
          </div>
        </div>
      )}
      {phase === 'result' && (
        <ResultTeaser typeCode={mbtiType} lang={lang} userEmail={session?.user?.email} isInApp={isInApp} />
      )}
      </>
      )}
    </main>
  );
}
