'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import NovaAvatar from '@/components/NovaAvatar';
import { COACH_CATEGORIES } from '@/lib/coachCategories';

interface Msg { role: 'user' | 'assistant'; content: string; image?: string }

interface ConversationAnalysisResult {
  personality: string;
  attachmentStyle: string;
  manipulationFlags: string;
  greenFlags: string[];
  redFlags: string[];
  compatibility: string;
  emotionalLanguage: string;
  advice: string;
}

// Rend les URL d'un message cliquables — utile pour le lien de test partageable
// que Nova renvoie en texte brut (ex: "https://urcecret.site/q/xyz").
const URL_RE = /(https?:\/\/[^\s]+)/g;
function Linkified({ text }: { text: string }) {
  // split() avec un groupe capturant alterne texte/URL — les parties d'URL
  // tombent toujours aux index impairs, donc pas besoin de re-tester (et
  // surtout pas avec la regex globale, dont le lastIndex est piégeux ici).
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all" style={{ color: 'var(--gold)' }} onClick={(e) => e.stopPropagation()}>
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

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
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false); // menu "+" au-dessus de la barre de saisie

  // ── Créateur de test partageable (réservé aux abonnés) ──
  const [quizBuilderOpen, setQuizBuilderOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');
  const [quizCreating, setQuizCreating] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{ id: string; title: string; intro: string } | null>(null);
  const [quizLinkCopied, setQuizLinkCopied] = useState(false);

  // ── Analyse de conversation (feature phare, réservée aux abonnés) ──
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  const [analysisImageError, setAnalysisImageError] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ConversationAnalysisResult | null>(null);
  const [analysisShared, setAnalysisShared] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analysisFileInputRef = useRef<HTMLInputElement>(null);

  // Lecture d'un fichier image → data URI, factorisé pour être réutilisé par
  // le chat normal ET la capture d'écran de l'analyse de conversation.
  const readImageFile = useCallback((
    file: File | null,
    onError: (msg: string | null) => void,
    onLoaded: (dataUri: string) => void,
  ) => {
    onError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) { onError('Ce fichier n\'est pas une image.'); return; }
    if (file.size > MAX_IMAGE_BYTES) { onError('Photo trop lourde (max 4 Mo) — réessaie avec une image plus légère.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') onLoaded(reader.result); };
    reader.onerror = () => onError('Impossible de lire cette photo, réessaie.');
    reader.readAsDataURL(file);
  }, []);

  // Choix d'une photo (galerie ou appareil photo mobile) → aperçu avant envoi.
  const pickImage = useCallback((file: File | null) => {
    readImageFile(file, setImageError, setPendingImage);
  }, [readImageFile]);

  const pickAnalysisImage = useCallback((file: File | null) => {
    readImageFile(file, setAnalysisImageError, setAnalysisImage);
  }, [readImageFile]);

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
    setActionsMenuOpen(false);
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

  // Demande à Nova de générer un mini-test partageable sur un thème donné —
  // consomme 1 message du même quota que le chat (voir /api/quiz-builder/create).
  const createQuiz = useCallback(async () => {
    const topic = quizTopic.trim();
    if (!topic || quizCreating) return;
    setQuizError(null);
    setQuizCreating(true);
    try {
      const res = await fetch('/api/quiz-builder/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 402) { setQuizError('Cette fonctionnalité est réservée aux abonnés.'); return; }
      if (res.status === 429) { setQuizError('Tu as utilisé tous tes messages du jour — réessaie demain.'); return; }
      if (!res.ok) { setQuizError('La génération a échoué, réessaie avec un autre thème.'); return; }
      setQuizResult({ id: data.id, title: data.title, intro: data.intro });
      if (typeof data.remaining === 'number') setRemaining(data.remaining);
      if (typeof data.limit === 'number') setLimit(data.limit);
    } catch {
      setQuizError('Erreur réseau, réessaie.');
    } finally {
      setQuizCreating(false);
    }
  }, [quizTopic, quizCreating]);

  // Analyse une conversation collée et/ou une capture d'écran — consomme 1
  // message du même quota que le chat (voir /api/conversation-analysis/create).
  const runAnalysis = useCallback(async () => {
    const text = analysisText.trim();
    if ((!text && !analysisImage) || analysisLoading) return;
    setAnalysisError(null);
    setAnalysisLoading(true);
    try {
      const res = await fetch('/api/conversation-analysis/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, ...(analysisImage ? { imageBase64: analysisImage } : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 402) { setAnalysisError('Cette fonctionnalité est réservée aux abonnés.'); return; }
      if (res.status === 429) { setAnalysisError('Tu as utilisé tous tes messages du jour — réessaie demain.'); return; }
      if (res.status === 413) { setAnalysisError('Cette capture est trop lourde, réessaie avec une image plus légère.'); return; }
      if (!res.ok) { setAnalysisError('L\'analyse a échoué, réessaie (peut-être avec un peu plus de contexte).'); return; }
      setAnalysisResult(data.result);
      if (typeof data.remaining === 'number') setRemaining(data.remaining);
      if (typeof data.limit === 'number') setLimit(data.limit);
    } catch {
      setAnalysisError('Erreur réseau, réessaie.');
    } finally {
      setAnalysisLoading(false);
    }
  }, [analysisText, analysisImage, analysisLoading]);

  const shareAnalysis = useCallback(async () => {
    const text = 'Je viens de faire analyser une conversation par Nova sur UrCecret 👀 tu devrais essayer sur la tienne';
    const url = `${window.location.origin}/chat`;
    try {
      if (navigator.share) { await navigator.share({ title: 'UrCecret', text, url }); return; }
    } catch { /* partage annulé */ }
    try { await navigator.clipboard.writeText(`${text}\n${url}`); setAnalysisShared(true); setTimeout(() => setAnalysisShared(false), 2500); } catch {}
  }, []);

  const closeAnalysis = useCallback(() => {
    setAnalysisOpen(false);
    setAnalysisResult(null);
    setAnalysisText('');
    setAnalysisImage(null);
    setAnalysisError(null);
  }, []);

  // Efface tout l'historique de conversation affiché (pas le quota, pas le profil) —
  // pour repartir d'une page blanche avec Nova.
  const clearHistory = useCallback(async () => {
    if (messages.length === 0) return;
    if (!window.confirm('Effacer tout ton historique avec Nova ? Cette action est irréversible.')) return;
    try { await fetch('/api/chat', { method: 'DELETE' }); } catch {}
    setMessages([]);
    setNotice(null);
  }, [messages.length]);

  const shareQuizLink = useCallback(async (id: string, title: string) => {
    const url = `${window.location.origin}/q/${id}`;
    const text = `${title} — fais ce test 👀`;
    try {
      if (navigator.share) { await navigator.share({ title, text, url }); return; }
    } catch { /* partage annulé */ }
    try { await navigator.clipboard.writeText(url); setQuizLinkCopied(true); setTimeout(() => setQuizLinkCopied(false), 2500); } catch {}
  }, []);

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
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] tabular-nums" style={{ color: '#a8a29e' }}>
            {remaining !== null && limit !== null ? `${remaining}/${limit}` : ''}
          </span>
          <button
            type="button"
            onClick={clearHistory}
            disabled={messages.length === 0}
            aria-label="Effacer l'historique"
            title="Effacer l'historique"
            className="w-6 h-6 flex items-center justify-center text-sm disabled:opacity-30"
            style={{ color: '#a8a29e' }}
          >🗑️</button>
        </div>
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

              {/* Créateur de test partageable — réservé aux abonnés, argument
                  de conversion supplémentaire pour les comptes gratuits. */}
              {!isFree ? (
                <button
                  onClick={() => setQuizBuilderOpen(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                  style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--gold)' }}
                >
                  🧪 Créer un test à partager avec tes amis
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold transition-all"
                  style={{ background: 'var(--paper-panel)', border: '1px dashed var(--line)', color: '#a8a29e' }}
                >
                  🧪 Créer tes propres tests à partager — débloque avec un abonnement
                </Link>
              )}
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
                    {m.content && (
                      <div className={m.image ? 'px-4 py-3' : ''}>
                        {m.role === 'assistant' ? <Linkified text={m.content} /> : m.content}
                      </div>
                    )}
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

        {/* Menu "+" — tout ce que Nova sait faire, pas seulement discuter.
            Toujours accessible (pas juste sur l'écran vide) pour que les gens
            qui découvrent le chat tombent dessus aussi. Architecture pensée
            pour grandir : chaque action est un item de ACTIONS, actif ou non
            (badge "Bientôt") — ajouter une future feature = un item de plus,
            pas une refonte du menu. */}
        {actionsMenuOpen && (
          <div className="max-w-2xl mx-auto px-4 pb-2">
            <div className="rounded-2xl p-1.5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
              <button
                type="button"
                onClick={() => { setActionsMenuOpen(false); if (!isFree) setQuizBuilderOpen(true); }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-left transition-all"
                style={{ color: isFree ? '#a8a29e' : 'var(--ink)' }}
              >
                <span className="text-lg">🧠</span>
                <span className="flex-1">Créer un test{isFree ? ' — débloque avec un abonnement' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => { setActionsMenuOpen(false); if (!isFree) setAnalysisOpen(true); }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-left transition-all"
                style={{ color: isFree ? '#a8a29e' : 'var(--ink)' }}
              >
                <span className="text-lg">💬</span>
                <span className="flex-1">Analyser une conversation{isFree ? ' — débloque avec un abonnement' : ''}</span>
              </button>

              {([
                { emoji: '📖', label: 'Journal émotionnel' },
                { emoji: '👥', label: 'Compatibilité avec un ami' },
                { emoji: '✨', label: 'Analyse de personnalité avancée' },
              ] as const).map((a) => (
                <div key={a.label} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold" style={{ color: '#c4bfb3' }}>
                  <span className="text-lg" style={{ opacity: 0.5 }}>{a.emoji}</span>
                  <span className="flex-1">{a.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: '#a8a29e' }}>
                    Bientôt
                  </span>
                </div>
              ))}

              <div className="my-1 border-t" style={{ borderColor: 'var(--line)' }} />
              <Link
                href="/quizzes"
                onClick={() => setActionsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-left"
                style={{ color: 'var(--ink)' }}
              >
                <span className="text-lg">🧭</span> Découvrir les 15 autres quiz
              </Link>
            </div>
          </div>
        )}

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
            onClick={() => setActionsMenuOpen((v) => !v)}
            disabled={quotaHit}
            aria-label="Ce que Nova sait faire"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold disabled:opacity-40 transition-transform"
            style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)', transform: actionsMenuOpen ? 'rotate(45deg)' : 'none' }}
          >+</button>
          <button
            type="button"
            onClick={() => { setActionsMenuOpen(false); fileInputRef.current?.click(); }}
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

      {/* Créateur de test partageable — overlay */}
      {quizBuilderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setQuizBuilderOpen(false); }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
            {quizResult ? (
              <div className="text-center">
                <div className="mb-4"><NovaAvatar size={56} glow /></div>
                <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Ton test est prêt !</p>
                <h3 className="font-display text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>{quizResult.title}</h3>
                <p className="text-xs mb-5 leading-relaxed" style={{ color: '#78716c' }}>{quizResult.intro}</p>
                <button
                  onClick={() => shareQuizLink(quizResult.id, quizResult.title)}
                  className="ur-btn-gold w-full py-3 text-sm mb-2"
                >
                  {quizLinkCopied ? '✅ Lien copié — envoie-le !' : '📤 Partager mon test'}
                </button>
                <button
                  onClick={() => { setQuizBuilderOpen(false); setQuizResult(null); setQuizTopic(''); }}
                  className="w-full py-2.5 text-xs"
                  style={{ color: '#a8a29e' }}
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div>
                <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Nova crée un test pour toi</p>
                <h3 className="font-display text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>Sur quel thème ?</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: '#78716c' }}>
                  Ex : « mes vrais amis », « suis-je fait pour l&apos;entrepreneuriat », « mon rapport au stress »…
                </p>
                <textarea
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  rows={2}
                  placeholder="Décris le thème de ton test…"
                  disabled={quizCreating}
                  className="w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none mb-3 disabled:opacity-50"
                  style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                />
                {quizError && <p className="text-xs mb-3 text-center" style={{ color: '#dc2626' }}>{quizError}</p>}
                <button
                  onClick={createQuiz}
                  disabled={quizCreating || !quizTopic.trim()}
                  className="ur-btn-gold w-full py-3 text-sm mb-2 disabled:opacity-50"
                >
                  {quizCreating ? 'Nova réfléchit…' : 'Créer mon test →'}
                </button>
                <button
                  onClick={() => setQuizBuilderOpen(false)}
                  disabled={quizCreating}
                  className="w-full py-2.5 text-xs disabled:opacity-50"
                  style={{ color: '#a8a29e' }}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analyse de conversation — overlay. Feature phare : texte collé et/ou
          capture d'écran, résultat pensé pour être montré (TikTok). */}
      {analysisOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeAnalysis(); }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6 overflow-y-auto" style={{ background: 'var(--paper)', border: '1px solid var(--line)', maxHeight: '88vh' }}>
            {analysisResult ? (
              <div>
                <div className="text-center mb-5">
                  <div className="mb-3"><NovaAvatar size={52} glow /></div>
                  <p className="ur-label text-[10px] mb-1" style={{ color: 'var(--gold)' }}>Analyse de Nova</p>
                  <h3 className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>Ce que révèle cette conversation</h3>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  {[
                    { label: '🧠 Personnalité', text: analysisResult.personality },
                    { label: '🔗 Style d\'attachement', text: analysisResult.attachmentStyle },
                    { label: '⚠️ Manipulation ?', text: analysisResult.manipulationFlags },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
                      <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>{s.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>{s.text}</p>
                    </div>
                  ))}

                  {analysisResult.greenFlags.length > 0 && (
                    <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                      <p className="text-[11px] font-bold mb-1.5" style={{ color: '#16a34a' }}>✅ Green flags</p>
                      <ul className="flex flex-col gap-1">
                        {analysisResult.greenFlags.map((f, i) => (
                          <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.redFlags.length > 0 && (
                    <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)' }}>
                      <p className="text-[11px] font-bold mb-1.5" style={{ color: '#dc2626' }}>🚩 Red flags</p>
                      <ul className="flex flex-col gap-1">
                        {analysisResult.redFlags.map((f, i) => (
                          <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {[
                    { label: '💞 Compatibilité', text: analysisResult.compatibility },
                    { label: '🗣️ Langage émotionnel', text: analysisResult.emotionalLanguage },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
                      <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>{s.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>{s.text}</p>
                    </div>
                  ))}

                  <div className="rounded-xl px-4 py-3" style={{ background: 'var(--ink)' }}>
                    <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>💡 Conseil de Nova</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#FAF6EC' }}>{analysisResult.advice}</p>
                  </div>
                </div>

                <p className="text-[10px] text-center mb-4 leading-relaxed" style={{ color: '#a8a29e' }}>
                  Généré automatiquement, à visée ludique — pas un diagnostic. En cas de doute réel sur une relation, parle à un professionnel.
                </p>

                <button onClick={shareAnalysis} className="ur-btn-gold w-full py-3 text-sm mb-2">
                  {analysisShared ? '✅ Copié — envoie-le !' : '📤 Partager'}
                </button>
                <button onClick={closeAnalysis} className="w-full py-2.5 text-xs" style={{ color: '#a8a29e' }}>
                  Fermer
                </button>
              </div>
            ) : (
              <div>
                <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Nova analyse pour toi</p>
                <h3 className="font-display text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>Colle une conversation</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: '#78716c' }}>
                  Texte collé, capture d&apos;écran, ou les deux — Nova regarde la personnalité, le style d&apos;attachement, les green/red flags et te donne un vrai conseil.
                </p>
                <textarea
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  rows={5}
                  placeholder="Colle ici les messages à analyser…"
                  disabled={analysisLoading}
                  className="w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none mb-3 disabled:opacity-50"
                  style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                />

                <input
                  ref={analysisFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { pickAnalysisImage(e.target.files?.[0] ?? null); e.target.value = ''; }}
                />
                {analysisImage ? (
                  <div className="relative inline-block mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={analysisImage} alt="Capture à analyser" className="rounded-xl" style={{ height: 72, width: 72, objectFit: 'cover', border: '1px solid var(--line)' }} />
                    <button
                      type="button"
                      onClick={() => setAnalysisImage(null)}
                      aria-label="Retirer la capture"
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ background: 'var(--ink)', color: '#FAF6EC' }}
                    >✕</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => analysisFileInputRef.current?.click()}
                    disabled={analysisLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold mb-3 disabled:opacity-50"
                    style={{ border: '1px dashed var(--line)', color: '#78716c' }}
                  >
                    📷 Ajouter une capture d&apos;écran
                  </button>
                )}
                {analysisImageError && <p className="text-[11px] mb-3 text-center" style={{ color: '#dc2626' }}>{analysisImageError}</p>}
                {analysisError && <p className="text-xs mb-3 text-center" style={{ color: '#dc2626' }}>{analysisError}</p>}

                <button
                  onClick={runAnalysis}
                  disabled={analysisLoading || (!analysisText.trim() && !analysisImage)}
                  className="ur-btn-gold w-full py-3 text-sm mb-2 disabled:opacity-50"
                >
                  {analysisLoading ? 'Nova analyse…' : 'Analyser →'}
                </button>
                <button
                  onClick={closeAnalysis}
                  disabled={analysisLoading}
                  className="w-full py-2.5 text-xs disabled:opacity-50"
                  style={{ color: '#a8a29e' }}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
