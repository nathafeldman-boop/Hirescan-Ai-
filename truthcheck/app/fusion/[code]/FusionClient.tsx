'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { FusionQuestion, FusionResult } from '@/lib/fusion';
import Seal from '@/components/Seal';

type Phase = 'loading' | 'waiting' | 'quiz' | 'waiting-others' | 'paywall' | 'result';

interface Participant { id: string; name: string; done: boolean }

interface SessionState {
  status: 'waiting' | 'active' | 'complete';
  paid: boolean;
  participants: Participant[];
  questions: FusionQuestion[];
  result: FusionResult | null;
}

export default function FusionClient({ code }: { code: string }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [session, setSession] = useState<SessionState | null>(null);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C'>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const groupId = typeof window !== 'undefined' ? sessionStorage.getItem('fusion_gid') ?? '' : '';
  const participantId = typeof window !== 'undefined' ? sessionStorage.getItem('fusion_pid') ?? '' : '';
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/fusion/session/${code}`);
      if (!res.ok) return;
      const data: SessionState = await res.json();
      setSession(data);
      return data;
    } catch {
      return null;
    }
  }, [code]);

  // Handle URL unlock param (return from Stripe)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stripeSessionId = params.get('session_id');
    const gid = sessionStorage.getItem('fusion_gid');
    if (stripeSessionId && gid) {
      fetch('/api/fusion/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: stripeSessionId, groupId: gid }),
      }).finally(() => {
        window.history.replaceState({}, '', `/fusion/${code}`);
      });
    }
  }, [code]);

  // Initial load + polling
  useEffect(() => {
    fetchSession().then(data => {
      if (!data) return;
      updatePhase(data);
    });

    pollRef.current = setInterval(async () => {
      const data = await fetchSession();
      if (data) updatePhase(data);
    }, 2500);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updatePhase(data: SessionState) {
    const myParticipant = data.participants.find(p => p.id === sessionStorage.getItem('fusion_pid'));
    const alreadyDone = myParticipant?.done ?? false;

    if (data.status === 'complete') {
      if (data.paid) setPhase('result');
      else setPhase('paywall');
    } else if (data.status === 'active') {
      if (alreadyDone) setPhase('waiting-others');
      else setPhase('quiz');
    } else {
      setPhase('waiting');
    }
  }

  async function handleStart() {
    const gid = sessionStorage.getItem('fusion_gid');
    const pid = sessionStorage.getItem('fusion_pid');
    await fetch('/api/fusion/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: gid, participantId: pid }),
    });
    const data = await fetchSession();
    if (data) updatePhase(data);
  }

  function handleAnswer(qId: number, ans: 'A' | 'B' | 'C') {
    const next = { ...answers, [qId]: ans };
    setAnswers(next);
    if (session && currentQ < session.questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      submitAnswers(next);
    }
  }

  async function submitAnswers(finalAnswers: Record<number, 'A' | 'B' | 'C'>) {
    const pid = sessionStorage.getItem('fusion_pid');
    await fetch('/api/fusion/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId: pid, answers: finalAnswers }),
    });
    setPhase('waiting-others');
    const data = await fetchSession();
    if (data) updatePhase(data);
  }

  async function handlePaywall() {
    setCheckoutLoading(true);
    try {
      const gid = sessionStorage.getItem('fusion_gid') ?? '';
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fusionGroupId: gid,
          fusionCode: code,
          oneTime: true,
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setCheckoutLoading(false);
    }
  }

  if (phase === 'loading' || !session) return <Loading />;

  const isHost = session.participants[0]?.id === participantId;
  const myName = session.participants.find(p => p.id === participantId)?.name ?? '';

  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-white" style={{ background: 'var(--ink)' }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.06]" style={{ background: 'var(--gold)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {phase === 'waiting' && (
          <WaitingRoom
            code={code}
            participants={session.participants}
            isHost={isHost}
            onStart={handleStart}
          />
        )}
        {phase === 'quiz' && session.questions.length > 0 && (
          <QuizView
            question={session.questions[currentQ]}
            current={currentQ}
            total={session.questions.length}
            onAnswer={handleAnswer}
          />
        )}
        {phase === 'waiting-others' && (
          <WaitingOthers participants={session.participants} myName={myName} />
        )}
        {phase === 'paywall' && (
          <PaywallView onPay={handlePaywall} loading={checkoutLoading} participants={session.participants} />
        )}
        {phase === 'result' && session.result && (
          <ResultView result={session.result} code={code} participants={session.participants} />
        )}
      </div>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <div className="text-stone-400 text-sm animate-pulse">Connexion à la session...</div>
    </main>
  );
}

function WaitingRoom({ code, participants, isHost, onStart }: {
  code: string; participants: Participant[]; isHost: boolean; onStart: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="text-center">
      <div className="text-4xl mb-3">⚗️</div>
      <h1 className="text-2xl font-black text-white mb-1">Salle d&apos;attente</h1>
      <p className="text-stone-400 text-sm mb-6">Partage le code avec tes amis</p>

      <button
        onClick={copyCode}
        className="mx-auto mb-6 flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-2xl tracking-widest transition-all active:scale-[0.98]"
        style={{ background: 'var(--ink-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }}
      >
        {code}
        <span className="text-sm font-semibold text-stone-500">{copied ? '✓' : '📋'}</span>
      </button>

      <div className="rounded-2xl p-4 mb-6" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <p className="ur-label text-[10px] text-stone-500 mb-3">
          {participants.length} participant{participants.length > 1 ? 's' : ''} connecté{participants.length > 1 ? 's' : ''}
        </p>
        <div className="space-y-2">
          {participants.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2 text-sm font-medium text-stone-300">
              <span className="text-base">{i === 0 ? '👑' : '👤'}</span>
              {p.name}
              {i === 0 && <span className="text-xs text-stone-500 ml-1">· créateur</span>}
            </div>
          ))}
        </div>
      </div>

      {isHost ? (
        <button
          onClick={onStart}
          disabled={participants.length < 2}
          className="ur-btn-gold block w-full py-4 text-center"
        >
          {participants.length < 2 ? 'En attente d\'un autre joueur...' : `🚀 Lancer le quiz (${participants.length} joueurs)`}
        </button>
      ) : (
        <p className="text-stone-500 text-sm animate-pulse">En attente que le créateur lance le quiz...</p>
      )}
    </div>
  );
}

function QuizView({ question, current, total, onAnswer }: {
  question: FusionQuestion; current: number; total: number;
  onAnswer: (id: number, ans: 'A' | 'B' | 'C') => void;
}) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="ur-label text-[10px] text-stone-500">Question {current + 1}/{total}</span>
        <span className="text-xs text-stone-500">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full mb-6" style={{ background: 'var(--line-ink)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--gold)' }} />
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <p className="text-white font-semibold text-base leading-relaxed">{question.text}</p>
      </div>

      <div className="space-y-3">
        {(['A', 'B', 'C'] as const).map(letter => {
          const opt = letter === 'A' ? question.optionA : letter === 'B' ? question.optionB : question.optionC;
          return (
            <button
              key={letter}
              onClick={() => onAnswer(question.id, letter)}
              className="w-full text-left px-4 py-4 rounded-2xl font-medium text-stone-300 transition-all active:scale-[0.99]"
              style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}
            >
              <span className="font-black text-stone-600 mr-3">{letter}</span>
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WaitingOthers({ participants, myName }: { participants: Participant[]; myName: string }) {
  const done = participants.filter(p => p.done).length;
  const total = participants.length;

  return (
    <div className="text-center">
      <div className="text-4xl mb-4">⏳</div>
      <h2 className="text-xl font-black text-white mb-2">Tes réponses sont enregistrées</h2>
      <p className="text-stone-400 text-sm mb-6">
        En attente des autres joueurs...
      </p>
      <div className="rounded-2xl p-4 mb-4" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <p className="ur-label text-[10px] text-stone-500 mb-3">{done}/{total} terminés</p>
        <div className="space-y-2">
          {participants.map(p => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="font-medium text-stone-300">{p.name} {p.name === myName && '(toi)'}</span>
              <span>{p.done ? '✅' : <span className="text-stone-600 animate-pulse">○</span>}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-stone-500 animate-pulse">Calcul en cours dès que tout le monde a répondu...</p>
    </div>
  );
}

function PaywallView({ onPay, loading, participants }: {
  onPay: () => void; loading: boolean; participants: Participant[];
}) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-3">🔬</div>
      <h2 className="text-2xl font-black text-white mb-2">Votre profil Fusion est prêt</h2>
      <p className="text-stone-400 text-sm mb-6">
        {participants.length} joueurs · Résultat calculé
      </p>

      <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <p className="ur-label text-[10px] text-stone-500 mb-3">Ce que vous découvrez</p>
        <ul className="space-y-2 text-sm text-stone-300">
          <li className="flex gap-2"><span>🏷️</span> Le nom et archétype de votre groupe</li>
          <li className="flex gap-2"><span>⚡</span> Vos 5 forces collectives</li>
          <li className="flex gap-2"><span>⚠️</span> Vos risques et angles morts</li>
          <li className="flex gap-2"><span>📊</span> Votre score de compatibilité</li>
          <li className="flex gap-2"><span>🚀</span> Votre potentiel et style de groupe</li>
        </ul>
      </div>

      <div
        className="rounded-2xl p-4 mb-6 text-center"
        style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}
      >
        <p className="text-stone-400 text-xs mb-1">Accès unique pour tout le groupe</p>
        <p className="text-3xl font-black" style={{ color: 'var(--gold)' }}>1,99 €</p>
      </div>

      <button
        onClick={onPay}
        disabled={loading}
        className="ur-btn-gold block w-full py-4 text-center"
      >
        {loading ? 'Redirection...' : '🔓 Révéler le profil du groupe — 1,99 €'}
      </button>
      <p className="text-xs text-stone-500 mt-3">Paiement sécurisé · Un seul paiement pour tout le groupe</p>
    </div>
  );
}

function ResultView({ result, code, participants }: {
  result: FusionResult; code: string; participants: Participant[];
}) {
  const [copied, setCopied] = useState(false);

  function share() {
    const text = `Notre groupe Fusion est "${result.type.name}" ${result.type.emoji} — Compatibilité ${result.compatibility}% ! Découvre le tien sur urcecret.site/fusion`;
    if (navigator.share) {
      navigator.share({ text, url: `${window.location.origin}/fusion` }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  }

  const color = result.type.accentColor;

  return (
    <div className="text-center">
      <div className="flex justify-center mb-3"><Seal size={56} spin /></div>
      <div className="text-5xl mb-3">{result.type.emoji}</div>
      <p className="ur-label text-[10px] mb-1" style={{ color }}>Votre profil Fusion</p>
      <h1 className="text-3xl font-black text-white mb-2">{result.type.name}</h1>
      <p className="text-stone-400 italic text-sm mb-4">"{result.type.tagline}"</p>

      <div className="flex justify-center gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-black" style={{ color }}>{result.compatibility}%</p>
          <p className="text-xs text-stone-500">Compatibilité</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-white">{participants.length}</p>
          <p className="text-xs text-stone-500">Joueurs</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-4 text-left" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <p className="text-stone-300 text-sm leading-relaxed">{result.type.description}</p>
      </div>

      <div className="rounded-2xl p-4 mb-4 text-left" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <p className="ur-label text-[10px] text-stone-500 mb-3">Forces collectives</p>
        <ul className="space-y-1.5">
          {result.type.forces.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm text-stone-300"><span style={{ color }}>✦</span>{f}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl p-4 mb-4 text-left" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}>
        <p className="ur-label text-[10px] text-stone-500 mb-3">Risques à surveiller</p>
        <ul className="space-y-1.5">
          {result.type.risques.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-stone-300"><span>⚠️</span>{r}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl p-4 mb-6 text-left" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
        <p className="ur-label text-[10px] mb-1" style={{ color }}>Votre potentiel</p>
        <p className="text-sm text-stone-300 leading-relaxed">{result.type.potentiel}</p>
      </div>

      <button
        onClick={share}
        className="ur-btn-gold block w-full py-4 text-center mb-3"
      >
        {copied ? '✓ Lien copié !' : '🔗 Partager le résultat'}
      </button>
      <a
        href="/fusion"
        className="block w-full py-3 rounded-full font-semibold text-stone-400 text-center text-sm hover:text-white transition"
        style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)' }}
      >
        Nouveau quiz Fusion →
      </a>
    </div>
  );
}
