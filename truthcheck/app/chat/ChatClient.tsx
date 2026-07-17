'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import Seal from '@/components/Seal';

interface Msg { role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'Explique-moi les fonctions cognitives de Jung simplement.',
  'Pourquoi j\'ai autant de mal à prendre des décisions ?',
  'Quel type de métier correspond à ma personnalité ?',
  'Comment mieux communiquer avec quelqu\'un de très différent de moi ?',
];

export default function ChatClient() {
  const { data: session, status } = useSession();
  const tier = (session?.user as { tier?: string } | undefined)?.tier ?? 'free';

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [quotaHit, setQuotaHit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || loading || quotaHit) return;
    setNotice(null);
    const next: Msg[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (res.status === 401) {
        setNotice('Connecte-toi pour discuter avec l\'assistant.');
        setMessages(messages);
        setLoading(false);
        return;
      }
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setQuotaHit(true);
        setRemaining(0);
        if (typeof d.limit === 'number') setLimit(d.limit);
        setLoading(false);
        return;
      }
      if (res.status === 503) {
        setNotice('L\'assistant arrive très bientôt — il n\'est pas encore activé.');
        setMessages(messages);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setNotice('L\'assistant est momentanément indisponible. Réessaie dans un instant.');
        setMessages(messages);
        setLoading(false);
        return;
      }
      const data = await res.json() as { reply: string; remaining: number; limit: number };
      setMessages([...next, { role: 'assistant', content: data.reply }]);
      setRemaining(data.remaining);
      setLimit(data.limit);
      if (data.remaining <= 0) setQuotaHit(true);
    } catch {
      setNotice('Erreur réseau. Réessaie.');
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, quotaHit]);

  // ── Chargement session ──
  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </main>
    );
  }

  // ── Gate connexion (compte obligatoire) ──
  if (!session?.user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--ink)' }}>
        <div className="mb-6"><Seal size={64} spin /></div>
        <h1 className="font-display text-2xl font-black text-white mb-2">Assistant UrCecret</h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'var(--ink-text-muted)' }}>
          Discute avec l&apos;IA pour mieux comprendre ta personnalité. Connecte-toi pour commencer — 5 messages offerts par jour.
        </p>
        <button onClick={() => signIn(undefined, { callbackUrl: '/chat' })} className="ur-btn-gold px-7 py-3.5 text-sm">
          Se connecter →
        </button>
        <Link href="/" className="mt-5 text-xs" style={{ color: 'var(--ink-text-faint)' }}>← Retour à l&apos;accueil</Link>
      </main>
    );
  }

  const empty = messages.length === 0;

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--ink)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(21,18,31,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line-ink)' }}>
        <Link href="/" className="text-xs flex items-center gap-1.5" style={{ color: 'var(--ink-text-muted)' }}>
          <span>←</span> Accueil
        </Link>
        <div className="flex items-center gap-2">
          <Seal size={20} />
          <span className="font-display text-sm font-bold text-white">Assistant UrCecret</span>
        </div>
        <span className="text-[11px] tabular-nums" style={{ color: 'var(--ink-text-faint)' }}>
          {remaining !== null && limit !== null ? `${remaining}/${limit}` : ''}
        </span>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {empty ? (
            <div className="flex flex-col items-center text-center pt-10">
              <div className="mb-5"><Seal size={56} spin /></div>
              <h2 className="font-display text-xl font-black text-white mb-2">Qu&apos;est-ce qui t&apos;intrigue chez toi ?</h2>
              <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: 'var(--ink-text-muted)' }}>
                Pose ta question, ou commence par une de celles-ci :
              </p>
              <div className="w-full grid gap-2.5">
                {STARTERS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="ur-panel-ink text-left px-4 py-3 text-sm transition-all hover:scale-[1.01]"
                    style={{ color: 'var(--ink-text)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? '' : 'ur-panel-ink'}`}
                    style={m.role === 'user'
                      ? { background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--ink-text)' }
                      : { color: 'var(--ink-text)' }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="ur-panel-ink rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {notice && (
            <p className="mt-6 text-center text-xs" style={{ color: 'var(--ink-text-muted)' }}>{notice}</p>
          )}

          {quotaHit && (
            <div className="mt-6 rounded-2xl p-5 text-center" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
              <p className="text-sm font-bold text-white mb-1">Tu as utilisé tes {limit ?? ''} messages du jour</p>
              <p className="text-xs mb-4" style={{ color: 'var(--ink-text-muted)' }}>
                {tier === 'free'
                  ? 'Passe à un abonnement pour discuter davantage chaque jour — et débloquer ton profil MBTI complet.'
                  : 'Ton quota se réinitialise demain (minuit, heure de Paris).'}
              </p>
              {tier === 'free' && (
                <Link href="/pricing" className="ur-btn-gold inline-flex px-6 py-3 text-sm">Voir les abonnements →</Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0" style={{ background: 'var(--ink)', borderTop: '1px solid var(--line-ink)' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); void send(input); }}
          className="max-w-2xl mx-auto px-4 py-3 flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(input); } }}
            rows={1}
            placeholder={quotaHit ? 'Quota du jour atteint' : 'Pose ta question…'}
            disabled={quotaHit}
            className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none disabled:opacity-50"
            style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)', color: 'var(--ink-text)', maxHeight: 140 }}
          />
          <button
            type="submit"
            disabled={loading || quotaHit || !input.trim()}
            aria-label="Envoyer"
            className="ur-btn-gold flex-shrink-0 w-11 h-11 !p-0 text-lg disabled:opacity-40"
          >
            ↑
          </button>
        </form>
        <p className="text-center text-[10px] pb-2" style={{ color: 'var(--ink-text-faint)' }}>
          L&apos;assistant peut se tromper. Ce n&apos;est pas un avis médical.
        </p>
      </div>
    </main>
  );
}
