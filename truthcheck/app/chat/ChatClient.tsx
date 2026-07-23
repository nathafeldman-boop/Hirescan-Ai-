'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import NovaAvatar from '@/components/NovaAvatar';
import { COACH_CATEGORIES } from '@/lib/coachCategories';

interface Msg { role: 'user' | 'assistant'; content: string; image?: string }

// Taille max du fichier original (avant encodage base64, qui l'agrandit ~x1.37).
// Reste sous la limite serveur (~4,5 Mo décodés) avec de la marge.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export default function ChatClient() {
  const { data: session, status } = useSession();
  const tier = (session?.user as { tier?: string } | undefined)?.tier ?? 'free';

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [quotaHit, setQuotaHit] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [mbtiType, setMbtiType] = useState<string | null>(null);
  const [isFree, setIsFree] = useState(false); // coach en version découverte bridée (compte gratuit)
  const [inviteCode, setInviteCode] = useState<string | null>(null); // lien de parrainage
  const [inviteCopied, setInviteCopied] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null); // data URI en attente d'envoi
  const [imageError, setImageError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Choix d'une photo (galerie ou appareil photo mobile) → aperçu avant envoi.
  const pickImage = useCallback((file: File | null) => {
    setImageError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImageError('Ce fichier n\'est pas une image.'); return; }
    if (file.size > MAX_IMAGE_BYTES) { setImageError('Photo trop lourde (max 4 Mo) — réessaie avec une image plus légère.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') setPendingImage(reader.result); };
    reader.onerror = () => setImageError('Impossible de lire cette photo, réessaie.');
    reader.readAsDataURL(file);
  }, []);

  // Ouverture "déjà lancée" depuis un résultat : le coach démarre par une
  // lecture personnalisée. Le message d'amorce est envoyé mais NON affiché —
  // on ne montre que la réponse du coach (effet "il me connaît déjà").
  const seedCoach = useCallback(async (prompt: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setQuotaHit(true); setRemaining(0);
        if (typeof d.limit === 'number') setLimit(d.limit);
        return;
      }
      if (!res.ok) return;
      const data = await res.json() as { reply?: string; needsTest?: boolean; remaining?: number; limit?: number };
      if (data.needsTest) { setHasProfile(false); return; }
      setMessages([{ role: 'assistant', content: data.reply ?? '' }]);
      if (typeof data.remaining === 'number') setRemaining(data.remaining);
      if (typeof data.limit === 'number') setLimit(data.limit);
      if ((data.remaining ?? 1) <= 0) setQuotaHit(true);
    } catch { /* on ignore : l'utilisateur peut écrire lui-même */ }
    finally { setLoading(false); }
  }, []);

  // ── Chargement de l'historique (mémoire) ──
  useEffect(() => {
    if (status !== 'authenticated') { if (status !== 'loading') setBooting(false); return; }
    let cancelled = false;
    fetch('/api/chat')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) { setBooting(false); return; }
        setHasProfile(!!d.hasProfile);
        setIsFree(!!d.free); // compte gratuit → coach bridé (pas de type révélé)
        setMbtiType(d.mbtiType ?? null);
        const msgs = Array.isArray(d.messages) ? d.messages : [];
        setMessages(msgs);
        setRemaining(d.remaining ?? null);
        setLimit(d.limit ?? null);
        setInviteCode(typeof d.inviteCode === 'string' ? d.inviteCode : null);
        if (typeof d.remaining === 'number' && d.remaining <= 0) setQuotaHit(true);
        setBooting(false);

        // Amorce depuis un résultat (?start=…) : uniquement si le fil est vide.
        let wantSeed = false;
        try { wantSeed = !!new URLSearchParams(window.location.search).get('start'); } catch {}
        if (wantSeed) { try { window.history.replaceState(null, '', '/chat'); } catch {} }
        if (wantSeed && !d.free && msgs.length === 0 && d.hasProfile && d.remaining > 0 && !seededRef.current) {
          seededRef.current = true;
          void seedCoach('Présente-moi mon profil comme si tu me connaissais déjà : mes 2 plus grandes forces, mon principal angle mort, et le premier truc sur lequel je devrais travailler. Parle-moi de MOI d’après mon test, pas en généralités.');
        }
      })
      .catch(() => { if (!cancelled) setBooting(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    const image = pendingImage;
    if ((!content && !image) || loading || quotaHit) return;
    setNotice(null);
    setOpenCat(null);
    const prev = messages;
    setMessages([...prev, { role: 'user', content, ...(image ? { image } : {}) }]);
    setInput('');
    setPendingImage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, ...(image ? { imageBase64: image } : {}) }),
      });
      if (res.status === 401) { setNotice('Connecte-toi pour parler à ton coach.'); setMessages(prev); return; }
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setQuotaHit(true); setRemaining(0);
        if (typeof d.limit === 'number') setLimit(d.limit);
        return;
      }
      if (res.status === 413) { setNotice('Cette photo est trop lourde, réessaie avec une image plus légère.'); setMessages(prev); return; }
      if (res.status === 503) { setNotice('Ton coach arrive très bientôt — il n\'est pas encore activé.'); setMessages(prev); return; }
      if (!res.ok) { setNotice('Ton coach est momentanément indisponible. Réessaie dans un instant.'); setMessages(prev); return; }
      const data = await res.json() as { reply?: string; needsTest?: boolean; remaining?: number; limit?: number };
      if (data.needsTest) { setHasProfile(false); setMessages(prev); return; }
      setMessages([...prev, { role: 'user', content, ...(image ? { image } : {}) }, { role: 'assistant', content: data.reply ?? '' }]);
      if (typeof data.remaining === 'number') setRemaining(data.remaining);
      if (typeof data.limit === 'number') setLimit(data.limit);
      if ((data.remaining ?? 1) <= 0) setQuotaHit(true);
    } catch {
      setNotice('Erreur réseau. Réessaie.'); setMessages(prev);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, quotaHit, pendingImage]);

  // ── États de chargement / gate ──
  if (status === 'loading' || booting) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-600 animate-spin" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--paper)' }}>
        <div className="mb-6"><NovaAvatar size={80} glow /></div>
        <h1 className="font-display text-2xl font-black text-stone-900 mb-2">Nova, ton coach personnel</h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
          Elle te connaît déjà grâce à ton test. Connecte-toi pour lui parler.
        </p>
        <button onClick={() => signIn(undefined, { callbackUrl: '/chat' })} className="ur-btn-gold px-7 py-3.5 text-sm">
          Se connecter →
        </button>
        <Link href="/" className="mt-5 text-xs" style={{ color: '#a8a29e' }}>← Retour à l&apos;accueil</Link>
      </main>
    );
  }

  // Pas de test fait → le coach ne peut pas personnaliser. Pour un abonné PAYANT
  // (cas rare : abonnement pris sans jamais faire le test), on bloque et on
  // invite à le passer. Pour un compte GRATUIT, on laisse essayer Nova quand
  // même (découverte) — elle rappellera elle-même de faire le test.
  if (hasProfile === false && !isFree) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--paper)' }}>
        <div className="mb-6"><NovaAvatar size={80} glow /></div>
        <h1 className="font-display text-2xl font-black text-stone-900 mb-2">D&apos;abord, ton test</h1>
        <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: '#78716c' }}>
          Nova s&apos;appuie sur ton profil de personnalité pour te répondre. Fais le test (3 min) et elle saura exactement qui tu es.
        </p>
        <Link href="/quiz/personnalite" className="ur-btn-gold px-7 py-3.5 text-sm">
          Passer le test →
        </Link>
        <Link href="/" className="mt-5 text-xs" style={{ color: '#a8a29e' }}>← Retour à l&apos;accueil</Link>
      </main>
    );
  }

  const noTestYet = isFree && hasProfile === false;

  const empty = messages.length === 0;

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(242,236,222,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
        <Link href="/" className="text-xs flex items-center gap-1.5" style={{ color: '#78716c' }}>
          <span>←</span> Accueil
        </Link>
        <div className="flex items-center gap-2">
          <NovaAvatar size={26} />
          <span className="font-display text-sm font-bold text-stone-900">Nova{mbtiType ? ` · ${mbtiType}` : ''}</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }} aria-label="en ligne" />
        </div>
        <span className="text-[11px] tabular-nums" style={{ color: '#a8a29e' }}>
          {remaining !== null && limit !== null ? `${remaining}/${limit}` : ''}
        </span>
      </header>

      {/* Bandeau — version découverte (compte gratuit). Avant le test : pousse
          vers le quiz. Après le test (mais sans payer) : pousse vers l'offre. */}
      {isFree && (
        <Link href={noTestYet ? '/quiz/personnalite' : '/pricing'} className="block px-4 py-2 text-center text-[11px] font-semibold"
          style={{ background: 'var(--gold-soft)', borderBottom: '1px solid var(--gold-line)', color: 'var(--gold)' }}>
          {noTestYet
            ? '✦ Version découverte (5 messages/mois) · Fais le test pour des réponses selon TOI →'
            : '✦ Version découverte (5 messages/mois) · Nova selon TON type dès 1,99 €/mois →'}
        </Link>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {empty ? (
            <div className="flex flex-col items-center text-center pt-6">
              <div className="mb-5"><NovaAvatar size={92} glow /></div>
              <h2 className="font-display text-xl font-black text-stone-900 mb-2">
                {isFree ? 'Salut, moi c\'est Nova 👋' : 'Salut, moi c\'est Nova — je connais déjà ton profil.'}
              </h2>
              <p className="text-sm mb-7 max-w-sm leading-relaxed" style={{ color: '#78716c' }}>
                {noTestYet
                  ? <>Tu peux m&apos;essayer avant même de faire le test : je te donne de vrais conseils, mais généraux. Fais le <Link href="/quiz/personnalite" style={{ color: 'var(--gold)', fontWeight: 700 }}>test (3 min)</Link> pour que je te parle vraiment de <span style={{ color: 'var(--gold)' }}>toi</span>.</>
                  : isFree
                    ? <>Version découverte : je te donne de vrais conseils, mais généraux. Pour des réponses selon <span style={{ color: 'var(--gold)' }}>ton type exact</span> et ton test, débloque ton profil.</>
                    : <>Choisis un thème, ou écris-moi directement. Je te réponds selon <span style={{ color: 'var(--gold)' }}>ton</span> résultat, pas en généralités.</>}
              </p>
              {noTestYet && (
                <Link href="/quiz/personnalite" className="ur-btn-gold px-6 py-3 text-sm mb-6 inline-flex">
                  Faire le test (3 min) →
                </Link>
              )}
              <div className="w-full flex flex-col gap-2">
                {COACH_CATEGORIES.map((c) => (
                  <div key={c.key}>
                    <button
                      onClick={() => setOpenCat(openCat === c.key ? null : c.key)}
                      className="ur-panel w-full flex items-center justify-between px-4 py-3 text-sm transition-all"
                      style={{ color: 'var(--ink)' }}
                    >
                      <span className="flex items-center gap-2.5"><span className="text-base">{c.emoji}</span>{c.label}</span>
                      <span className="text-stone-600" style={{ transform: openCat === c.key ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
                    </button>
                    {openCat === c.key && (
                      <div className="mt-2 mb-1 flex flex-col gap-2 pl-1">
                        {c.prompts.map((p) => (
                          <button
                            key={p}
                            onClick={() => send(p)}
                            className="text-left text-sm px-4 py-2.5 rounded-xl transition-all hover:scale-[1.01]"
                            style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--ink)' }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                  {/* Avatar de Nova uniquement sur le dernier message d'une suite (comme WhatsApp) */}
                  {m.role === 'assistant' && (
                    <div className="flex-shrink-0 mb-0.5" style={{ width: 28 }}>
                      {(i === messages.length - 1 || messages[i + 1]?.role === 'user') && <NovaAvatar size={28} />}
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl overflow-hidden text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? '' : 'ur-panel'} ${m.image ? '' : 'px-4 py-3'}`}
                    style={m.role === 'user'
                      ? { background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--ink)' }
                      : { color: 'var(--ink)' }}>
                    {m.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt="Photo envoyée à Nova" className="w-full block" style={{ maxHeight: 260, objectFit: 'cover' }} />
                    )}
                    {m.content && <div className={m.image ? 'px-4 py-3' : ''}>{m.content}</div>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start items-end gap-2">
                  <div className="flex-shrink-0 mb-0.5"><NovaAvatar size={28} /></div>
                  <div className="ur-panel rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                    <span className="text-[11px] mr-1" style={{ color: '#a8a29e' }}>Nova écrit</span>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {notice && <p className="mt-6 text-center text-xs" style={{ color: '#78716c' }}>{notice}</p>}

          {quotaHit && (
            <div className="mt-6 rounded-2xl p-5 text-center" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
              <p className="text-sm font-bold text-stone-900 mb-1">
                {isFree ? `Tu as utilisé tes ${limit ?? ''} messages découverte du mois` : `Tu as utilisé tes ${limit ?? ''} messages du jour`}
              </p>
              <p className="text-xs mb-4" style={{ color: '#78716c' }}>
                {isFree
                  ? 'Dès 1,99 €/mois : ton profil complet + Nova tous les jours (5 messages/jour).'
                  : 'Ton quota se réinitialise demain (minuit, heure de Paris).'}
              </p>
              {isFree && <Link href="/pricing" className="ur-btn-gold inline-flex px-6 py-3 text-sm">Débloquer Nova — dès 1,99 €/mois →</Link>}

              {/* Parrainage : +3 messages / invité inscrit, +3 par jour si l'invité paie */}
              {inviteCode && (
                <div className="mt-4 pt-4 text-left" style={{ borderTop: '1px solid var(--gold-line)' }}>
                  <p className="text-xs font-bold text-stone-900 mb-1">🎁 Ou gagne des messages gratuits</p>
                  <p className="text-[11px] mb-3 leading-relaxed" style={{ color: '#78716c' }}>
                    Invite un ami : <strong style={{ color: 'var(--gold)' }}>+3 messages</strong> quand il crée son compte,
                    et <strong style={{ color: 'var(--gold)' }}>+3 messages par jour à vie</strong> s&apos;il débloque son profil.
                  </p>
                  <button
                    onClick={async () => {
                      const url = `${window.location.origin}/quiz/personnalite?invite=${inviteCode}`;
                      const text = 'Fais ce test de personnalité, le résultat est bluffant 🔮';
                      try {
                        if (navigator.share) { await navigator.share({ title: 'UrCecret', text, url }); return; }
                      } catch { /* partage annulé */ }
                      try { await navigator.clipboard.writeText(url); setInviteCopied(true); setTimeout(() => setInviteCopied(false), 2500); } catch {}
                    }}
                    className="w-full py-3 rounded-full font-bold text-xs transition-all active:scale-[0.98]"
                    style={{ background: 'var(--gold)', color: 'var(--ink)' }}
                  >
                    {inviteCopied ? '✅ Lien copié — envoie-le !' : '📤 Inviter un ami'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0" style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
        {/* Aperçu de la photo en attente d'envoi */}
        {pendingImage && (
          <div className="max-w-2xl mx-auto px-4 pt-3">
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingImage} alt="Photo à envoyer" className="rounded-xl" style={{ height: 72, width: 72, objectFit: 'cover', border: '1px solid var(--line)' }} />
              <button
                type="button"
                onClick={() => setPendingImage(null)}
                aria-label="Retirer la photo"
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: 'var(--ink)', color: '#FAF6EC' }}
              >✕</button>
            </div>
          </div>
        )}
        {imageError && <p className="max-w-2xl mx-auto px-4 pt-2 text-[11px]" style={{ color: '#dc2626' }}>{imageError}</p>}

        <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="max-w-2xl mx-auto px-4 py-3 flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { pickImage(e.target.files?.[0] ?? null); e.target.value = ''; }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={quotaHit}
            aria-label="Envoyer une photo à Nova"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg disabled:opacity-40"
            style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          >📷</button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(input); } }}
            rows={1}
            placeholder={quotaHit ? 'Quota du jour atteint' : pendingImage ? 'Ajoute un message (facultatif)…' : 'Écris à Nova…'}
            disabled={quotaHit}
            className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none disabled:opacity-50"
            style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)', maxHeight: 140 }}
          />
          <button type="submit" disabled={loading || quotaHit || (!input.trim() && !pendingImage)} aria-label="Envoyer"
            className="ur-btn-gold flex-shrink-0 w-11 h-11 !p-0 text-lg disabled:opacity-40">↑</button>
        </form>
        <p className="text-center text-[10px] pb-2" style={{ color: '#a8a29e' }}>
          Nova s&apos;appuie sur ton test. Ce n&apos;est pas un avis médical.
        </p>
      </div>
    </main>
  );
}
