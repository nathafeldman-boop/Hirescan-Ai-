'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import ElioAvatar from '@/components/ElioAvatar';
import AppTabBar from '@/components/AppTabBar';
import { COACH_CATEGORIES } from '@/lib/coachCategories';
import ElioMessage from '@/components/ElioMessage';
import QuestCelebration, { type QuestCelebrationItem } from '@/components/QuestCelebration';

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

// Taille max du fichier original (avant encodage base64, qui l'agrandit ~x1.37).
// Reste sous la limite serveur (~4,5 Mo décodés) avec de la marge.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

// ── Suggestions Elio — visibles sans écrire, cliquables, jamais un cul-de-sac.
// "analyze" et "quiz" ouvrent les vraies features structurées (réservées aux
// abonnés). "link" mène vers un vrai écran dédié (Journal, Compatibilité,
// Profil avancé). "chat" envoie un vrai premier message à Elio qui exploite
// déjà tout ce qu'il sait (profil MBTI). ─────────────────────────────────
const ELIO_SUGGESTIONS: { emoji: string; label: string; kind: 'analyze' | 'quiz' | 'chat' | 'link'; prompt?: string; href?: string }[] = [
  { emoji: '🧠', label: 'Analyser une conversation', kind: 'analyze' },
  { emoji: '📖', label: 'Journal émotionnel', kind: 'link', href: '/journal' },
  { emoji: '✨', label: 'Analyse avancée', kind: 'link', href: '/profil-avance' },
  { emoji: '👥', label: 'Créer un test entre amis', kind: 'quiz' },
  { emoji: '❤️', label: 'Compatibilité', kind: 'link', href: '/compat' },
];

// Actions rapides proposées par Elio juste après un paywall décliné (voir
// fromPaywall) — chacune envoie un vrai premier message, jamais un cul-de-sac.
const PAYWALL_DECLINE_ACTIONS: { emoji: string; label: string; prompt: string }[] = [
  { emoji: '💬', label: 'Parler de ce que je ressens aujourd\'hui', prompt: 'Je veux te parler de ce que je ressens aujourd\'hui.' },
  { emoji: '🔍', label: 'Comprendre pourquoi je réagis comme ça', prompt: 'Aide-moi à comprendre pourquoi je réagis comme ça dans certaines situations.' },
  { emoji: '🎯', label: 'Me fixer un objectif', prompt: 'Aide-moi à me fixer un objectif personnel.' },
  { emoji: '🧭', label: 'Découvrir une fonctionnalité d\'UrCecret', prompt: 'Montre-moi ce que je peux faire avec UrCecret.' },
];

export default function ChatClient() {
  const { data: session, status } = useSession();
  const tier = (session?.user as { tier?: string } | undefined)?.tier ?? 'free';

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [newlyCompletedQuests, setNewlyCompletedQuests] = useState<QuestCelebrationItem[]>([]);
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

  // Arrivée depuis le paywall MBTI après avoir choisi "Continuer gratuitement"
  // (voir PersonnaliteClient.tsx) — Elio accueille avec un message proactif
  // au lieu du renvoyer vers le Hub, pour que le paywall reste un embranchement,
  // jamais une impasse. Lu depuis l'URL directement (pas useSearchParams) pour
  // éviter d'avoir à envelopper tout le composant dans un Suspense.
  const [fromPaywall, setFromPaywall] = useState(false);
  useEffect(() => {
    try { if (new URLSearchParams(window.location.search).get('from') === 'paywall') setFromPaywall(true); } catch {}
  }, []);

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
      if (res.status === 503) { setNotice('Elio arrive très bientôt — il n\'est pas encore activé.'); setMessages(prev); return; }
      if (!res.ok) { setNotice('Ton coach est momentanément indisponible. Réessaie dans un instant.'); setMessages(prev); return; }
      const data = await res.json() as { reply?: string; needsTest?: boolean; remaining?: number; limit?: number; newlyCompletedQuests?: QuestCelebrationItem[] };
      if (data.needsTest) { setHasProfile(false); setMessages(prev); return; }
      setMessages([...prev, { role: 'user', content, ...(image ? { image } : {}) }, { role: 'assistant', content: data.reply ?? '' }]);
      if (typeof data.remaining === 'number') setRemaining(data.remaining);
      if (typeof data.limit === 'number') setLimit(data.limit);
      if ((data.remaining ?? 1) <= 0) setQuotaHit(true);
      if (Array.isArray(data.newlyCompletedQuests) && data.newlyCompletedQuests.length > 0) {
        setNewlyCompletedQuests(data.newlyCompletedQuests);
      }
    } catch {
      setNotice('Erreur réseau. Réessaie.'); setMessages(prev);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, quotaHit, pendingImage]);

  // Demande à Elio de générer un mini-test partageable sur un thème donné —
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
    const text = 'Je viens de faire analyser une conversation par Elio sur UrCecret 👀 tu devrais essayer sur la tienne';
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

  // Clic sur une suggestion Elio — jamais un cul-de-sac : ouvre la vraie
  // feature structurée (analyse / test), ou envoie un vrai premier message
  // exploitable par le coach (journal / compatibilité / approfondir).
  const handleSuggestion = useCallback((s: typeof ELIO_SUGGESTIONS[number]) => {
    if (s.kind === 'analyze') { setAnalysisOpen(true); return; }
    if (s.kind === 'quiz') { setQuizBuilderOpen(true); return; }
    if (s.prompt) void send(s.prompt);
  }, [send]);

  // Efface tout l'historique de conversation affiché (pas le quota, pas le profil) —
  // pour repartir d'une page blanche avec Elio.
  const clearHistory = useCallback(async () => {
    if (messages.length === 0) return;
    if (!window.confirm('Effacer tout ton historique avec Elio ? Cette action est irréversible.')) return;
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
        <div className="mb-6"><ElioAvatar size={80} glow /></div>
        <p className="ur-label text-[11px] mb-3" style={{ color: 'var(--gold)' }}>Je suis Elio</p>
        <h1 className="font-display text-2xl font-black text-stone-900 mb-2">Un espace pour mieux te comprendre</h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
          Je suis là pour t&apos;aider à mieux comprendre qui tu es, tes émotions et ta façon de fonctionner. Je te connais déjà grâce à ton test — connecte-toi pour qu&apos;on parle.
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
  // invite à le passer. Pour un compte GRATUIT, on laisse essayer Elio quand
  // même (découverte) — il rappellera lui-même de faire le test.
  if (hasProfile === false && !isFree) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--paper)' }}>
        <div className="mb-6"><ElioAvatar size={80} glow /></div>
        <h1 className="font-display text-2xl font-black text-stone-900 mb-2">D&apos;abord, ton test</h1>
        <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: '#78716c' }}>
          Elio s&apos;appuie sur ton profil de personnalité pour te répondre. Fais le test (3 min) et il saura exactement qui tu es.
        </p>
        <Link href="/quiz/personnalite" className="ur-btn-gold px-7 py-3.5 text-sm">
          Passer le test →
        </Link>
        <Link href="/" className="mt-5 text-xs" style={{ color: '#a8a29e' }}>← Retour à l&apos;accueil</Link>
        <AppTabBar />
      </main>
    );
  }

  const noTestYet = isFree && hasProfile === false;

  const empty = messages.length === 0;

  return (
    <main className="chat-shell flex flex-col relative" style={{ background: 'var(--paper)' }}>
      {/* 100dvh (avec repli 100vh) : la colonne flex tient EXACTEMENT dans le
          viewport visible, barre d'adresse mobile comprise — condition pour
          que la zone de messages (flex-1) scrolle seule et que l'input + la
          barre de navigation restent toujours visibles en bas, sans jamais
          se chevaucher (voir AppTabBar mode="static"). */}
      <style>{`
        .chat-shell { height: 100vh; height: 100dvh; }
        /* Fond animé léger — 3 halos très doux qui dérivent lentement.
           transform+opacity uniquement (GPU), jamais de mise en page recalculée. */
        @keyframes elioDrift1 { 0%,100% { transform: translate(-8%, -6%) scale(1); } 50% { transform: translate(6%, 4%) scale(1.12); } }
        @keyframes elioDrift2 { 0%,100% { transform: translate(10%, 6%) scale(1); } 50% { transform: translate(-6%, -8%) scale(1.08); } }
        @keyframes elioDrift3 { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        .chat-bg-blob { position: absolute; border-radius: 50%; filter: blur(60px); will-change: transform; }
        @media (prefers-reduced-motion: no-preference) {
          .chat-bg-blob-1 { animation: elioDrift1 26s ease-in-out infinite; }
          .chat-bg-blob-2 { animation: elioDrift2 32s ease-in-out infinite; }
          .chat-bg-blob-3 { animation: elioDrift3 14s ease-in-out infinite; }
        }
      `}</style>
      {/* Fond animé — violet doux / bleu nuit / doré, très discret, purement
          décoratif (aria-hidden, pointer-events-none) derrière tout le contenu. */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
        <div className="chat-bg-blob chat-bg-blob-1" style={{ top: '-10%', left: '-10%', width: '60%', height: '40%', background: 'var(--fam-nf)', opacity: 0.10 }} />
        <div className="chat-bg-blob chat-bg-blob-2" style={{ bottom: '-15%', right: '-10%', width: '55%', height: '45%', background: 'var(--fam-nt)', opacity: 0.10 }} />
        <div className="chat-bg-blob chat-bg-blob-3" style={{ top: '30%', right: '10%', width: '35%', height: '30%', background: 'var(--gold)', opacity: 0.08 }} />
      </div>
      {/* Header */}
      <header className="relative flex-shrink-0 flex items-center justify-between px-4 py-3" style={{ zIndex: 1, background: 'rgba(242,236,222,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
        <Link href="/" className="text-xs flex items-center gap-1.5" style={{ color: '#78716c' }}>
          <span>←</span> Accueil
        </Link>
        <div className="flex items-center gap-2">
          <ElioAvatar size={26} speaking={loading} />
          <span className="font-display text-sm font-bold text-stone-900">Elio{mbtiType ? ` · ${mbtiType}` : ''}</span>
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
        <Link href={noTestYet ? '/quiz/personnalite' : '/pricing'} className="relative block px-4 py-2 text-center text-[11px] font-semibold"
          style={{ zIndex: 1, background: 'var(--gold-soft)', borderBottom: '1px solid var(--gold-line)', color: 'var(--gold)' }}>
          {noTestYet
            ? '✦ Version découverte (3 messages/mois) · Fais le test pour des réponses selon TOI →'
            : '✦ Version découverte (3 messages/mois) · Elio selon TON type dès 1,99 €/mois →'}
        </Link>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="relative flex-1 min-h-0 overflow-y-auto" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          {empty ? (
            <div className="flex flex-col pt-6">
              {/* En-tête aligné à gauche — l'avatar accompagne le texte au
                  lieu de trôner seul au centre, comme dans les interfaces
                  conversationnelles modernes (le compagnon est "à côté de
                  toi", pas au-dessus). */}
              {fromPaywall ? (
                // Accueil proactif après un paywall décliné — voir
                // PersonnaliteClient.tsx (?from=paywall). Un vrai message
                // d'Elio, pas juste une phrase d'ambiance : le paywall devient
                // un embranchement, jamais une impasse.
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex-shrink-0"><ElioAvatar size={44} glow speaking /></div>
                  <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm px-4 py-3.5 ur-panel">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                      Je vois que tu n&apos;as pas encore débloqué ton profil de personnalité.<br /><br />
                      Ce n&apos;est pas grave 😊<br /><br />
                      On peut déjà commencer à apprendre à te connaître ensemble. Je peux t&apos;aider à comprendre tes émotions, répondre à tes questions et t&apos;accompagner au quotidien.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4 mb-6 text-left">
                  <div className="flex-shrink-0"><ElioAvatar size={64} glow /></div>
                  <div className="flex-1 min-w-0 pt-1.5">
                    <p className="ur-label text-[10px] mb-1.5" style={{ color: 'var(--gold)' }}>Ton compagnon de développement personnel</p>
                    <h2 className="font-display text-xl font-black text-stone-900 mb-2">
                      {isFree ? 'Salut, moi c\'est Elio 👋' : 'Salut, moi c\'est Elio — je connais déjà ton profil.'}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: '#78716c' }}>
                      {noTestYet
                        ? <>Tu peux m&apos;essayer avant même de faire le test : je te donne de vrais conseils, mais généraux. Fais le <Link href="/quiz/personnalite" style={{ color: 'var(--gold)', fontWeight: 700 }}>test (3 min)</Link> pour que je te parle vraiment de <span style={{ color: 'var(--gold)' }}>toi</span>.</>
                        : isFree
                          ? <>Version découverte : je te donne de vrais conseils, mais généraux. Pour des réponses selon <span style={{ color: 'var(--gold)' }}>ton type exact</span> et ton test, débloque ton profil.</>
                          : <>Choisis un thème, ou écris-moi directement. Je te réponds selon <span style={{ color: 'var(--gold)' }}>ton</span> résultat, pas en généralités.</>}
                    </p>
                    {noTestYet && (
                      <Link href="/quiz/personnalite" className="ur-btn-gold px-6 py-3 text-sm mt-4 inline-flex">
                        Faire le test (3 min) →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Actions rapides d'Elio juste après un paywall décliné — voir
                  PAYWALL_DECLINE_ACTIONS. Remplace la grille de suggestions
                  habituelle pour cette toute première arrivée uniquement. */}
              {fromPaywall && (
                <div className="w-full grid grid-cols-2 gap-2.5 mb-2">
                  {PAYWALL_DECLINE_ACTIONS.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => void send(a.prompt)}
                      className="elio-hover-lift flex flex-col items-center text-center gap-1.5 px-3 py-4 rounded-2xl transition-all active:scale-[0.97]"
                      style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
                    >
                      <span className="text-2xl">{a.emoji}</span>
                      <span className="text-xs font-semibold leading-snug" style={{ color: 'var(--ink)' }}>{a.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestions Elio — visibles sans écrire, chaque carte est
                  cliquable et mène à un vrai résultat (jamais un cul-de-sac). */}
              {!fromPaywall && <div className="w-full grid grid-cols-2 gap-2.5 mb-2">
                {ELIO_SUGGESTIONS.map((s) => {
                  const gated = isFree && (s.kind === 'analyze' || s.kind === 'quiz');
                  const content = (
                    <>
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="text-xs font-semibold leading-snug" style={{ color: gated ? '#a8a29e' : 'var(--ink)' }}>
                        {s.label}
                      </span>
                      {gated && <span className="text-[10px]" style={{ color: 'var(--gold)' }}>🔒 Abonnés</span>}
                    </>
                  );
                  if (gated) {
                    return (
                      <Link
                        key={s.label}
                        href="/pricing"
                        className="elio-hover-lift flex flex-col items-center text-center gap-1.5 px-3 py-4 rounded-2xl transition-all active:scale-[0.97]"
                        style={{ background: 'var(--paper-panel)', border: '1px dashed var(--line)' }}
                      >
                        {content}
                      </Link>
                    );
                  }
                  if (s.kind === 'link' && s.href) {
                    return (
                      <Link
                        key={s.label}
                        href={s.href}
                        className="elio-hover-lift flex flex-col items-center text-center gap-1.5 px-3 py-4 rounded-2xl transition-all active:scale-[0.97]"
                        style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
                      >
                        {content}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={s.label}
                      onClick={() => handleSuggestion(s)}
                      className="elio-hover-lift flex flex-col items-center text-center gap-1.5 px-3 py-4 rounded-2xl transition-all active:scale-[0.97]"
                      style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
                    >
                      {content}
                    </button>
                  );
                })}
              </div>}

              <div className="w-full flex flex-col gap-2 mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-left" style={{ color: '#a8a29e' }}>Ou parle-moi de…</p>
                {COACH_CATEGORIES.map((c) => (
                  <div key={c.key}>
                    <button
                      onClick={() => setOpenCat(openCat === c.key ? null : c.key)}
                      className="elio-hover-lift ur-panel w-full flex items-center justify-between px-4 py-3 text-sm transition-all"
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
                            className="elio-hover-lift text-left text-sm px-4 py-2.5 rounded-xl transition-all hover:scale-[1.01]"
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
                  {/* Avatar de Elio uniquement sur le dernier message d'une suite (comme WhatsApp) */}
                  {m.role === 'assistant' && (
                    <div className="flex-shrink-0 mb-0.5" style={{ width: 28 }}>
                      {(i === messages.length - 1 || messages[i + 1]?.role === 'user') && <ElioAvatar size={28} />}
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl overflow-hidden text-sm leading-relaxed ${m.role === 'user' ? 'whitespace-pre-line' : 'elio-bubble'} ${m.role === 'user' ? '' : 'ur-panel'} ${m.image ? '' : 'px-4 py-3'}`}
                    style={m.role === 'user'
                      ? { background: 'var(--gold-soft)', border: '1px solid var(--gold-line)', color: 'var(--ink)' }
                      : { color: 'var(--ink)' }}>
                    {m.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt="Photo envoyée à Elio" className="w-full block" style={{ maxHeight: 260, objectFit: 'cover' }} />
                    )}
                    {m.content && (
                      <div className={m.image ? 'px-4 py-3' : ''}>
                        {m.role === 'assistant' ? <ElioMessage text={m.content} /> : m.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start items-end gap-2">
                  <div className="flex-shrink-0 mb-0.5"><ElioAvatar size={28} speaking /></div>
                  <div className="ur-panel rounded-2xl px-4 py-3 flex gap-2 items-center">
                    <span className="text-[11px] mr-0.5" style={{ color: '#a8a29e' }}>Elio réfléchit</span>
                    <span className="elio-typing-dot" style={{ background: 'var(--gold)' }} />
                    <span className="elio-typing-dot" style={{ background: 'var(--gold)', animationDelay: '0.15s' }} />
                    <span className="elio-typing-dot" style={{ background: 'var(--gold)', animationDelay: '0.3s' }} />
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
                  ? 'Dès 1,99 €/mois : ton profil complet + Elio, 5 messages/jour. Ton quota gratuit revient le mois prochain.'
                  : 'Ton quota se réinitialise demain (minuit, heure de Paris).'}
              </p>
              {isFree && <Link href="/pricing" className="ur-btn-gold inline-flex px-6 py-3 text-sm">Débloquer Elio — dès 1,99 €/mois →</Link>}

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

              {/* Ne pas payer ici ne doit jamais être une impasse — même
                  logique que le paywall du test MBTI (voir ResultTeaser) :
                  un chemin gratuit vers la suite du funnel, le Parcours. */}
              {isFree && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--gold-line)' }}>
                  <Link href="/parcours" className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>
                    👉 Continuer vers ton Parcours →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input bar — élément normal du flux (pas sticky/fixed) : la colonne
          flex fait exactement 100dvh, donc il reste toujours visible juste
          au-dessus d'AppTabBar, sans jamais la chevaucher. */}
      <div className="relative flex-shrink-0" style={{ zIndex: 1, background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
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

        {/* Menu "+" — tout ce que Elio sait faire, pas seulement discuter.
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

              <Link
                href="/journal"
                onClick={() => setActionsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-left"
                style={{ color: 'var(--ink)' }}
              >
                <span className="text-lg">📖</span>
                <span className="flex-1">Journal émotionnel</span>
              </Link>

              {([
                { emoji: '👥', label: 'Compatibilité avec un ami', href: '/compat' },
                { emoji: '✨', label: 'Analyse de personnalité avancée', href: '/profil-avance' },
              ] as const).map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  onClick={() => setActionsMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-left"
                  style={{ color: 'var(--ink)' }}
                >
                  <span className="text-lg">{a.emoji}</span>
                  <span className="flex-1">{a.label}</span>
                </Link>
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
            aria-label="Ce que Elio sait faire"
            className="elio-hover-lift flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold disabled:opacity-40 transition-transform"
            style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)', transform: actionsMenuOpen ? 'rotate(45deg)' : 'none' }}
          >+</button>
          <button
            type="button"
            onClick={() => { setActionsMenuOpen(false); fileInputRef.current?.click(); }}
            disabled={quotaHit}
            aria-label="Envoyer une photo à Elio"
            className="elio-hover-lift flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg disabled:opacity-40"
            style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          >📷</button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(input); } }}
            rows={1}
            placeholder={quotaHit ? 'Quota du jour atteint' : pendingImage ? 'Ajoute un message (facultatif)…' : 'Écris à Elio…'}
            disabled={quotaHit}
            className="elio-input flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none disabled:opacity-50"
            style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)', maxHeight: 140 }}
          />
          <button type="submit" disabled={loading || quotaHit || (!input.trim() && !pendingImage)} aria-label="Envoyer"
            className="ur-btn-gold elio-hover-lift flex-shrink-0 w-11 h-11 !p-0 text-lg disabled:opacity-40">↑</button>
        </form>
        <p className="text-center text-[10px] pb-2" style={{ color: '#a8a29e' }}>
          Elio s&apos;appuie sur ton test. Ce n&apos;est pas un avis médical.
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
                <div className="mb-4"><ElioAvatar size={56} glow /></div>
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
                <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Elio crée un test pour toi</p>
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
                  {quizCreating ? 'Elio réfléchit…' : 'Créer mon test →'}
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
                  <div className="mb-3"><ElioAvatar size={52} glow /></div>
                  <p className="ur-label text-[10px] mb-1" style={{ color: 'var(--gold)' }}>Analyse de Elio</p>
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
                    <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>💡 Conseil de Elio</p>
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
                <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Elio analyse pour toi</p>
                <h3 className="font-display text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>Colle une conversation</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: '#78716c' }}>
                  Texte collé, capture d&apos;écran, ou les deux — Elio regarde la personnalité, le style d&apos;attachement, les green/red flags et te donne un vrai conseil.
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
                  {analysisLoading ? 'Elio analyse…' : 'Analyser →'}
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

      <QuestCelebration quests={newlyCompletedQuests} onClose={() => setNewlyCompletedQuests([])} />

      <div className="relative" style={{ zIndex: 1 }}><AppTabBar mode="static" /></div>
    </main>
  );
}
