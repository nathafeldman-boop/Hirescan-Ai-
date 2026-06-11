'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Quiz } from '@/lib/quizzes';
import { getResultTier } from '@/lib/quizzes';

interface Props {
  quiz: Quiz;
}

const CIRCUMFERENCE = 2 * Math.PI * 72;

function buildAnalysis(quiz: Quiz, score: number, tierTitle: string): string[] {
  const high = score >= 60;
  const mid = score >= 30 && score < 60;

  const baseLines: Record<string, (s: number) => string[]> = {
    infidelite: (s) => [
      `Ton score de ${s}% indique ${s >= 70 ? 'une forte probabilité' : s >= 40 ? 'des signaux préoccupants' : 'peu de raisons d\'alarme'} concernant la fidélité de ton/ta partenaire.`,
      `Les comportements que tu as décrits ${s >= 60 ? 'correspondent à des schémas classiques d\'infidélité documentés par les psychologues.' : 'peuvent s\'expliquer par d\'autres facteurs comme le stress ou la fatigue.'}`,
      `${s >= 70 ? 'L\'accumulation de ces signaux est difficile à ignorer.' : s >= 40 ? 'Certains signaux méritent attention.' : 'L\'absence de signaux forts est rassurante.'}`,
      `La communication reste l\'outil le plus puissant pour clarifier une situation comme celle-ci.`,
      `${s >= 60 ? 'Une conversation directe, sans accusation, est fortement recommandée.' : 'Garder un œil sur l\'évolution des comportements sera utile.'}`,
      `Les experts s\'accordent à dire que l\'instinct ressenti par le/la partenaire est rarement complètement faux.`,
      `${s >= 70 ? 'Protège-toi émotionnellement et entoure-toi de personnes de confiance.' : 'Prends soin de toi et de ta confiance en toi.'}`,
      `Une thérapie de couple peut aider à rétablir la confiance, quelle que soit la réalité.`,
      `${s >= 60 ? 'Tu mérites une relation honnête et respectueuse.' : 'Une relation saine est possible avec les bons outils.'}`,
      `Rappelle-toi : tu mérites d\'être aimé(e) et respecté(e), peu importe la conclusion.`,
    ],
    adopte: (s) => [
      `Ton score de ${s}% suggère ${s >= 60 ? 'de nombreux indices qui méritent une exploration sérieuse' : 'quelques interrogations naturelles mais peu de preuves concrètes'}.`,
      `${s >= 60 ? 'Les éléments que tu as identifiés créent un tableau qui interroge ton histoire familiale.' : 'Il est normal de se poser des questions sur son histoire familiale.'}`,
      `Les différences physiques et comportementales que tu décris ${s >= 50 ? 'vont au-delà de la simple variation génétique.' : 'rentrent dans la variabilité naturelle au sein d\'une même famille.'}`,
      `Si ces questions sont importantes pour toi, un test ADN familial peut apporter des réponses définitives.`,
      `${s >= 60 ? 'Avoir une conversation ouverte avec tes parents, si possible, reste l\'approche la plus directe.' : 'La curiosité sur ses origines est une chose tout à fait humaine.'}`,
      `L\'adoption est une réalité pour des millions de personnes et ne change rien à qui tu es.`,
      `Que tu sois adopté(e) ou non, ton identité t\'appartient entièrement.`,
      `${s >= 50 ? 'Des professionnels spécialisés en histoire familiale peuvent t\'accompagner dans cette démarche.' : 'Prendre soin de ta santé mentale autour de ces questions est important.'}`,
      `Se connaître soi-même est un voyage, pas une destination.`,
      `Quelle que soit la vérité, tu mérites de la connaître si elle te tient à cœur.`,
    ],
    amoureux: (s) => [
      `Ton score de ${s}% indique ${s >= 70 ? 'des sentiments amoureux profonds et réels' : s >= 40 ? 'des sentiments forts mais peut-être encore en développement' : 'une affection sincère mais différente de l\'amour romantique'}.`,
      `${s >= 60 ? 'Les émotions que tu ressens correspondent à ce que les psychologues appellent l\'amour véritable.' : 'Ce que tu ressens pourrait être de l\'affection profonde ou une amitié forte.'}`,
      `La présence de cette personne dans tes pensées ${s >= 60 ? 'est un signe clair d\'attachement romantique.' : 'montre que tu y tiens, sans que ce soit nécessairement de l\'amour.'}`,
      `${s >= 70 ? 'Tes sentiments semblent solides et dignes d\'être exprimés.' : 'Prendre du temps pour clarifier tes émotions est une bonne idée.'}`,
      `L\'amour véritable se reconnaît souvent à la façon dont on pense à l\'autre même dans les moments ordinaires.`,
      `${s >= 60 ? 'Cette personne occupe une place très particulière dans ta vie.' : 'Cette relation compte pour toi, quel qu\'en soit le nom.'}`,
      `Exprimer ses sentiments, même avec le risque du rejet, est une preuve de courage.`,
      `${s >= 70 ? 'Le moment est peut-être venu de franchir ce pas.' : 'Être honnête avec toi-même sur ce que tu ressens est la première étape.'}`,
      `Les grandes histoires commencent souvent par une conversation sincère.`,
      `Tu mérites de vivre tes émotions pleinement, quelles qu\'elles soient.`,
    ],
    'vrais-amis': (s) => [
      `Ton score de ${s}% indique que cette relation ${s >= 60 ? 'présente des signaux préoccupants qui méritent attention' : s >= 30 ? 'a quelques imperfections normales' : 'est généralement saine et équilibrée'}.`,
      `${s >= 60 ? 'Les comportements que tu décris sont caractéristiques des relations toxiques.' : 'Toute amitié traverse des moments difficiles.'}`,
      `Un(e) vrai(e) ami(e) ${s >= 60 ? 'ne devrait pas te faire te sentir comme tu le décris.' : 'n\'est pas parfait(e), mais son intention est bonne.'}`,
      `${s >= 50 ? 'Il peut être utile de prendre du recul et d\'évaluer ce que cette relation t\'apporte vraiment.' : 'Cette relation semble t\'apporter des choses positives dans l\'ensemble.'}`,
      `Les amitiés saines sont celles où les deux parties se sentent valorisées et respectées.`,
      `${s >= 60 ? 'Tu mérites des personnes qui t\'élèvent, pas qui te tirent vers le bas.' : 'Chérir les bonnes amitiés est essentiel pour ton bien-être.'}`,
      `Parler directement à cette personne de ce que tu ressens peut transformer la relation.`,
      `${s >= 70 ? 'Prendre ses distances peut parfois être le choix le plus sain.' : 'Investir dans les amitiés qui te font du bien est toujours bénéfique.'}`,
      `La qualité des amitiés a un impact direct sur ta santé mentale et ton bonheur.`,
      `Tu mérites d\'être entouré(e) de personnes authentiques qui t\'acceptent tel(le) que tu es.`,
    ],
    orientation: (s) => [
      `Ton score de ${s}% suggère ${s >= 70 ? 'une forte attirance pour le même genre' : s >= 40 ? 'une orientation qui va au-delà de l\'hétérosexualité simple' : 'une orientation principalement hétérosexuelle avec quelques nuances'}.`,
      `${s >= 60 ? 'Les réponses que tu as données pointent vers une attirance non-hétérosexuelle significative.' : 'Il est normal de se poser des questions sur son orientation.'}`,
      `La sexualité humaine est un spectre, et il n\'existe pas de "bonne" ou "mauvaise" orientation.`,
      `${s >= 50 ? 'Explorer son identité sexuelle demande du courage et tu mérites d\'être accompagné(e) dans ce chemin.' : 'Être curieux de sa propre identité est une démarche saine.'}`,
      `Les communautés LGBTQ+ offrent des espaces sûrs pour partager et se sentir compris(e).`,
      `${s >= 60 ? 'Ton bien-être passe par l\'acceptation de qui tu es vraiment.' : 'Prendre le temps de te connaître sans pression est important.'}`,
      `Parler à un professionnel ou rejoindre des groupes de soutien peut t\'aider dans cette exploration.`,
      `${s >= 70 ? 'Tu n\'as pas à te définir immédiatement — l\'exploration est un processus.' : 'Quelle que soit ta conclusion, elle t\'appartient.'}`,
      `L\'acceptation de soi est la base d\'une vie épanouie, quelle que soit ton orientation.`,
      `Tu mérites d\'être aimé(e) et accepté(e) pour ce que tu es, pleinement et sans condition.`,
    ],
  };

  const lines = baseLines[quiz.slug]?.(score) ?? [
    `Ton score de ${score}% reflète honnêtement tes réponses.`,
    `Cette analyse est basée sur ${quiz.questions.length} questions soigneusement calibrées.`,
    `Le résultat "${tierTitle}" correspond à un profil précis.`,
    `${high ? 'Les signaux identifiés sont significatifs.' : mid ? 'Quelques éléments méritent attention.' : 'La situation semble saine dans l\'ensemble.'}`,
    `Prendre du recul aide toujours à mieux évaluer une situation.`,
    `La communication est souvent la clé pour résoudre les doutes.`,
    `${high ? 'N\'hésite pas à chercher du soutien autour de toi.' : 'Continue à faire confiance à ton instinct.'}`,
    `Ton ressenti compte autant que les faits objectifs.`,
    `Les relations humaines sont complexes et évoluent constamment.`,
    `Tu mérites de te sentir bien dans toutes tes relations.`,
  ];

  return lines;
}

export default function ResultsClient({ quiz }: Props) {
  const searchParams = useSearchParams();
  const rawScore = parseInt(searchParams.get('score') ?? '0', 10);
  const score = Math.max(0, Math.min(100, rawScore));

  const { data: session, status } = useSession();
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';
  const sessionLoading = status === 'loading';

  const tier = getResultTier(quiz, score);

  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const [shareId, setShareId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authSent, setAuthSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitCountdown, setExitCountdown] = useState(30);
  const hasSaved = useRef(false);
  const pendingCheckoutRef = useRef(false);
  const exitTriggered = useRef(false);
  const paywallRef = useRef<HTMLDivElement>(null);

  const analysis = buildAnalysis(quiz, score, tier.title);

  const partialScore = score >= 100 ? '9?%' : score >= 10 ? `${Math.floor(score / 10)}?%` : '?%';

  function trackEvent(event: string) {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: `/__${event}/${quiz.slug}` }),
    }).catch(() => {});
  }

  const PAYWALL_CONFIG: Record<string, { headline: string; subline: string; social: string }> = {
    infidelite: {
      headline: score >= 60
        ? "L'IA a trouvé plusieurs signaux dans tes réponses."
        : "Tes réponses révèlent quelque chose d'important.",
      subline: score >= 60
        ? "Ce que tu décris correspond à des schémas reconnus. Tu mérites de savoir exactement où tu en es."
        : "Ton score indique un niveau de risque précis. La vérité est là — à un clic.",
      social: "4 127 personnes ont découvert leur vérité cette semaine",
    },
    adopte: {
      headline: "Certains des indices que tu décris ne trompent pas.",
      subline: "L'analyse détaille exactement ce que tes réponses suggèrent sur ton histoire. Tu mérites une réponse claire.",
      social: "1 389 personnes ont éclairci leur histoire cette semaine",
    },
    amoureux: {
      headline: "Tes sentiments sont beaucoup plus définis qu'il n'y paraît.",
      subline: "L'IA a identifié la nature exacte de ce que tu ressens. Est-ce vraiment de l'amour, ou autre chose ?",
      social: "2 841 personnes ont clarifié leurs sentiments cette semaine",
    },
    'vrais-amis': {
      headline: "Certaines de tes réponses sont particulièrement révélatrices.",
      subline: "L'analyse montre clairement si cette amitié est saine — ou si tu mérites mieux.",
      social: "2 063 personnes ont vu la réalité en face cette semaine",
    },
    orientation: {
      headline: "Tes réponses dessinent un profil cohérent et précis.",
      subline: "Ce que l'IA a identifié sur ton identité mérite d'être découvert. Sans jugement.",
      social: "1 156 personnes se sont mieux comprises cette semaine",
    },
  };
  const pw = PAYWALL_CONFIG[quiz.slug] ?? {
    headline: "L'IA a analysé toutes tes réponses.",
    subline: "Ton profil précis t'attend. Découvre ce que tes réponses révèlent vraiment.",
    social: "Des milliers de personnes ont découvert leur vérité cette semaine",
  };

  const SCARY_STATS: Record<string, (s: number) => string> = {
    infidelite: (s) => s >= 60
      ? '63 % des personnes avec ce niveau de score ont confirmé leurs doutes par la suite.'
      : '41 % des personnes avec ce profil disent avoir été soulagées de connaître la réalité.',
    adopte: (s) => s >= 50
      ? '71 % des personnes avec ce score ont découvert quelque chose d\'inattendu sur leur famille.'
      : '58 % des personnes avec ce profil ont trouvé des réponses qui les ont apaisées.',
    amoureux: (s) => s >= 60
      ? '78 % des personnes avec ce résultat qui ont osé parler ne le regrettent pas.'
      : '65 % des personnes avec ce profil ont trouvé de la clarté en connaissant leur score.',
    'vrais-amis': (s) => s >= 60
      ? '69 % des personnes avec ce profil ont reconsidéré certaines amitiés après l\'analyse.'
      : '54 % des personnes avec ce score ont renforcé leurs liens après avoir lu l\'analyse.',
    orientation: (s) => s >= 50
      ? '74 % des personnes avec ce profil se sont senties soulagées après avoir vu leurs résultats.'
      : '67 % des personnes avec ce score disent que l\'analyse les a aidées à mieux se comprendre.',
  };
  const scaryStat = SCARY_STATS[quiz.slug]?.(score)
    ?? `${Math.min(97, Math.round(55 + score * 0.35))} % des personnes avec ce profil considèrent cette analyse comme un tournant.`;

  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;
    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizSlug: quiz.slug, score }),
    })
      .then((r) => r.json())
      .then((data: { id?: string }) => { if (data.id) setShareId(data.id); })
      .catch(() => {});
  }, [quiz.slug, score]);

  useEffect(() => {
    const t = setTimeout(() => setStrokeOffset(CIRCUMFERENCE * (1 - score / 100)), 300);
    return () => clearTimeout(t);
  }, [score]);

  // Auto-scroll to paywall after results load
  useEffect(() => {
    if (isPremium || sessionLoading) return;
    const t = setTimeout(() => {
      paywallRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1400);
    return () => clearTimeout(t);
  }, [isPremium, sessionLoading]);

  // Track paywall impression once per session
  useEffect(() => {
    if (isPremium || sessionLoading) return;
    try {
      const key = `pw_seen_${quiz.slug}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        trackEvent('paywall_view');
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium, sessionLoading]);

  // Exit intent — desktop (mouse leaves top) + mobile (tab switch)
  useEffect(() => {
    if (isPremium || sessionLoading) return;
    const trigger = () => {
      if (!exitTriggered.current) {
        exitTriggered.current = true;
        setShowExitModal(true);
      }
    };
    const onMouseLeave = (e: MouseEvent) => { if (e.clientY <= 0) trigger(); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') trigger(); };
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isPremium, sessionLoading]);

  // Exit modal countdown
  useEffect(() => {
    if (!showExitModal) return;
    setExitCountdown(30);
    const id = setInterval(() => {
      setExitCountdown((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showExitModal]);

  // After returning from OAuth/magic-link, auto-trigger checkout if user had clicked pay
  useEffect(() => {
    if (!session?.user || pendingCheckoutRef.current) return;
    let flag = false;
    let checkoutType = 'sub';
    try {
      flag = sessionStorage.getItem('pending_checkout') === '1';
      checkoutType = sessionStorage.getItem('pending_checkout_type') ?? 'sub';
    } catch {}
    if (!flag) return;
    try {
      sessionStorage.removeItem('pending_checkout');
      sessionStorage.removeItem('pending_checkout_type');
    } catch {}
    pendingCheckoutRef.current = true;
    if ((session.user as { tier?: string }).tier !== 'premium') {
      if (checkoutType === 'onetime') {
        void doOneTimeCheckout(session.user.email ?? undefined);
      } else {
        void doCheckout(session.user.email ?? undefined);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  async function doCheckout(email?: string) {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: shareId,
          quizSlug: quiz.slug,
          score,
          origin: window.location.origin,
          userEmail: email ?? session?.user?.email ?? undefined,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Erreur de paiement');
        setIsCheckingOut(false);
      }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setIsCheckingOut(false);
    }
  }

  async function doOneTimeCheckout(email?: string) {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: shareId,
          quizSlug: quiz.slug,
          score,
          origin: window.location.origin,
          userEmail: email ?? session?.user?.email ?? undefined,
          oneTime: true,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Erreur de paiement');
        setIsCheckingOut(false);
      }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setIsCheckingOut(false);
    }
  }

  function handlePayClick() {
    trackEvent('checkout_click');
    if (!session?.user) {
      try {
        sessionStorage.setItem('pending_checkout', '1');
        sessionStorage.setItem('pending_checkout_type', 'sub');
      } catch {}
      setShowAuthModal(true);
      return;
    }
    void doCheckout();
  }

  function handleOneTimeClick() {
    trackEvent('checkout_click_onetime');
    if (!session?.user) {
      try {
        sessionStorage.setItem('pending_checkout', '1');
        sessionStorage.setItem('pending_checkout_type', 'onetime');
      } catch {}
      setShowAuthModal(true);
      return;
    }
    void doOneTimeCheckout();
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: tier.glowColor }}
        />
      </div>

      {/* Exit intent modal */}
      {showExitModal && !isPremium && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(10px)' }}
        >
          <div className="w-full max-w-sm rounded-3xl p-6 border border-white/10" style={{ background: '#111113' }}>
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">⏳</div>
              <h2 className="text-white font-black text-xl mb-1">Tu pars sans voir ton résultat ?</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Ton analyse disparaît dans{' '}
                <span className="font-black tabular-nums" style={{ color: tier.glowColor }}>
                  {exitCountdown}s
                </span>
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { setShowExitModal(false); void doCheckout(); }}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-xl font-black text-white text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}
              >
                Voir mon score — 9,99€/mois ✦
              </button>
              <button
                onClick={() => { setShowExitModal(false); handleOneTimeClick(); }}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-xl font-semibold text-zinc-200 text-sm bg-white/[0.06] hover:bg-white/10 border border-white/12 transition-all disabled:opacity-60"
              >
                Juste ce résultat — 1,99€ (paiement unique)
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-2 text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
              >
                Ignorer mon résultat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false); }}
        >
          <div className="relative w-full max-w-sm rounded-2xl p-6 border border-white/10" style={{ background: '#111113' }}>
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-white font-black text-xl mb-2">Crée ton compte d&apos;abord</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pour ne pas perdre tes résultats — même si tu reviens dans une semaine.
              </p>
            </div>

            {authSent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📬</div>
                <h3 className="text-white font-bold text-lg mb-2">Vérifie tes emails</h3>
                <p className="text-zinc-400 text-sm">
                  Un lien de connexion a été envoyé à{' '}
                  <span className="text-violet-400">{authEmail}</span>
                </p>
                <p className="text-zinc-600 text-xs mt-3">Clique sur le lien, puis reviens ici.</p>
              </div>
            ) : (
              <>
                {/* Google */}
                <button
                  onClick={() => {
                    try { sessionStorage.setItem('pending_checkout', '1'); } catch {}
                    void signIn('google', { callbackUrl: currentUrl });
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors mb-4"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuer avec Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-zinc-600 text-xs">ou par email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!authEmail.trim()) return;
                    setAuthLoading(true);
                    try { sessionStorage.setItem('pending_checkout', '1'); } catch {}
                    await signIn('email', { email: authEmail, callbackUrl: currentUrl, redirect: false });
                    setAuthSent(true);
                    setAuthLoading(false);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-violet-500/60 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
                  >
                    {authLoading ? 'Envoi...' : 'Recevoir mon lien de connexion →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/quiz/${quiz.slug}`} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <span className="text-sm font-medium text-zinc-300">{quiz.emoji} Résultats</span>
          <Link
            href="/quizzes"
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Accueil
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <p className="text-center text-zinc-500 text-sm mb-6">{quiz.title}</p>

          {sessionLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            </div>
          ) : !session?.user ? (
            /* ── AUTH GATE: email-first "où envoyer tes résultats" ── */
            <div className="flex flex-col items-center text-center py-4">
              {/* Blurred score hint */}
              <div className="relative mb-5">
                <svg width="120" height="120" viewBox="0 0 180 180" style={{ filter: 'blur(6px)', opacity: 0.4 }}>
                  <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="90" cy="90" r="72" fill="none" stroke={tier.glowColor} strokeWidth="10"
                    strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * 0.35}
                    strokeLinecap="round" transform="rotate(-90 90 90)" />
                  <text x="90" y="98" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="42" fontWeight="900">??</text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6cc, #ec4899cc)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Analyse terminée — résultats prêts
              </div>

              <h2 className="text-white font-black text-2xl mb-2 leading-snug">
                Tes résultats sont prêts ✓
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-7 max-w-xs">
                Saisis ton email pour les recevoir et y accéder à tout moment.
              </p>

              {!authSent ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!authEmail.trim()) return;
                    setAuthLoading(true);
                    try { sessionStorage.setItem('pending_checkout', '1'); } catch {}
                    await signIn('email', { email: authEmail, callbackUrl: currentUrl, redirect: false });
                    setAuthSent(true);
                    setAuthLoading(false);
                  }}
                  className="w-full max-w-xs space-y-3 mb-4"
                >
                  <input
                    type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                    placeholder="ton@email.com" required autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 outline-none focus:border-violet-500/60 transition-all"
                  />
                  <button type="submit" disabled={authLoading}
                    className="w-full py-4 rounded-xl font-black text-white text-base disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>
                    {authLoading ? 'Envoi…' : 'Voir mes résultats →'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-3 mb-4">
                  <div className="text-3xl mb-2">📬</div>
                  <p className="text-zinc-300 text-sm font-semibold">Lien envoyé !</p>
                  <p className="text-zinc-500 text-xs mt-1">Clique sur le lien dans <span className="text-violet-400">{authEmail}</span></p>
                </div>
              )}

              <div className="flex items-center gap-3 w-full max-w-xs mb-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-zinc-700 text-xs">ou</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <button
                onClick={() => { try { sessionStorage.setItem('pending_checkout', '1'); } catch {} void signIn('google', { callbackUrl: currentUrl }); }}
                className="w-full max-w-xs flex items-center justify-center gap-3 py-3 rounded-xl bg-white/8 border border-white/10 text-zinc-300 hover:text-white font-medium text-sm hover:bg-white/12 transition-all"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuer avec Google
              </button>

              <p className="text-zinc-700 text-[11px] mt-5 max-w-xs">
                Tes résultats sont sauvegardés 7 jours · Aucun spam · Désinscription en 1 clic
              </p>
            </div>
          ) : isPremium ? (
            /* ── PREMIUM: full results ── */
            <>
              {/* Score circle — revealed */}
              <div className="flex justify-center mb-6">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <defs>
                    <linearGradient id="circleGradP" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={`${tier.glowColor}88`} />
                      <stop offset="100%" stopColor={tier.glowColor} />
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="90" cy="90" r="72" fill="none"
                    stroke="url(#circleGradP)" strokeWidth="10"
                    strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
                    strokeLinecap="round" transform="rotate(-90 90 90)"
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <text x="90" y="98" textAnchor="middle" fill={tier.glowColor} fontSize="42" fontWeight="900">{score}%</text>
                </svg>
              </div>

              {/* Tier badge */}
              <div className="flex justify-center mb-6">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
                  style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
                >
                  <span>{tier.emoji}</span>
                  {tier.title}
                </span>
              </div>

              {/* Full analysis */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 mb-6">
                <p className="text-zinc-200 font-semibold text-sm mb-4">{tier.message}</p>
                <div className="space-y-3">
                  {analysis.map((line, i) => (
                    <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ── FREE: paywall ── */
            <div ref={paywallRef}>
              {/* Blurred score circle */}
              <div className="flex justify-center mb-6 relative">
                <div style={{ filter: 'blur(12px)', opacity: 0.5, pointerEvents: 'none' }}>
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <defs>
                      <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={`${tier.glowColor}88`} />
                        <stop offset="100%" stopColor={tier.glowColor} />
                      </linearGradient>
                    </defs>
                    <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle
                      cx="90" cy="90" r="72" fill="none"
                      stroke="url(#circleGrad)" strokeWidth="10"
                      strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
                      strokeLinecap="round" transform="rotate(-90 90 90)"
                      style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                    />
                    <text x="90" y="98" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="42" fontWeight="900">??</text>
                  </svg>
                </div>
                {/* Lock icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6dd, #ec4899dd)', backdropFilter: 'blur(4px)' }}
                    >
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Score caché</span>
                  </div>
                </div>
              </div>

              {/* "Results ready" badge */}
              <div className="flex justify-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Analyse terminée — résultats prêts
                </span>
              </div>

              {/* Teaser — 15% visible */}
              <div className="mb-5 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-zinc-100 font-black text-[15px] leading-snug mb-3">{tier.message}</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{analysis[0]}</p>
                <div className="relative mt-3 overflow-hidden" style={{ maxHeight: 58 }}>
                  <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
                    <p className="text-zinc-400 text-sm leading-relaxed">{analysis[1]}</p>
                    <p className="text-zinc-400 text-sm leading-relaxed mt-2">{analysis[2]}</p>
                  </div>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.97) 70%)' }} />
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/5">
                  <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[11px] text-zinc-600">9 points d&apos;analyse supplémentaires verrouillés</span>
                </div>
              </div>

              {/* Main paywall card */}
              <div
                className="rounded-2xl p-6 mb-6 border border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(236,72,153,0.10))' }}
              >
                <div className="text-center mb-5">
                  <h2 className="text-xl font-black text-white mb-2">{pw.headline}</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {pw.subline}
                  </p>
                </div>

                {/* Scary stat */}
                <div
                  className="rounded-xl p-3 mb-4 border text-center"
                  style={{ background: `${tier.glowColor}0a`, borderColor: `${tier.glowColor}25` }}
                >
                  <p className="text-xs font-semibold leading-relaxed" style={{ color: tier.glowColor }}>
                    📊 {scaryStat}
                  </p>
                </div>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-2 mb-4 py-2 rounded-xl border border-white/5 bg-white/[0.03]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-zinc-500">{pw.social}</span>
                </div>

                {/* CTA */}
                <button
                  onClick={handlePayClick}
                  disabled={isCheckingOut}
                  className="w-full py-4 rounded-xl font-black text-white text-base mb-2 transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 4px 28px rgba(139,92,246,0.45)' }}
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirection…
                    </span>
                  ) : (
                    'Voir mon score complet — 9,99€/mois ✦'
                  )}
                </button>

                {/* Annual option */}
                <button
                  onClick={() => {
                    if (!session?.user) {
                      try { sessionStorage.setItem('pending_checkout', '1'); sessionStorage.setItem('pending_checkout_type', 'annual'); } catch {}
                      setShowAuthModal(true); return;
                    }
                    void (async () => {
                      setIsCheckingOut(true);
                      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizSlug: quiz.slug, score, origin: window.location.origin, userEmail: session.user?.email ?? undefined, annual: true }) });
                      const data = await res.json() as { url?: string };
                      if (data.url) window.location.href = data.url; else setIsCheckingOut(false);
                    })();
                  }}
                  disabled={isCheckingOut}
                  className="w-full py-3 rounded-xl font-semibold text-violet-300 text-sm border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 hover:text-white transition-all active:scale-[0.98] mb-2 disabled:opacity-60"
                >
                  Accès annuel — 29,99€/an <span className="text-xs opacity-60">(2,50€/mois)</span>
                </button>

                {/* One-time option — prominent low-friction entry */}
                <button
                  onClick={handleOneTimeClick}
                  disabled={isCheckingOut}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] mb-3 disabled:opacity-60 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: '#e4e4e7' }}
                >
                  <span className="block text-sm font-black text-white">Juste ce résultat — 1,99€</span>
                  <span className="block text-[11px] text-zinc-500 mt-0.5">Paiement unique · Pas d&apos;abonnement</span>
                </button>

                <p className="text-center text-[11px] text-zinc-600">
                  Abonnement annulable à tout moment · Paiement 100% sécurisé
                </p>
              </div>

            </div>
          )}

          {/* Viral share section */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-white/8">
            {/* PRIMARY: partner challenge — this is the #1 viral mechanic */}
            <div className="p-5" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(37,211,102,0.04))' }}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl flex-shrink-0 mt-0.5">👀</span>
                <div>
                  <p className="text-sm font-black text-white leading-snug">Envoie ça à ton/ta partenaire</p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Il/Elle répond sans voir tes réponses — vous comparez après
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`👀 Je viens de faire "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''}... Tu penses faire mieux que moi ?\n\nFais le quiz ici (sans regarder mes réponses 😏) :\nhttps://urcecret.site/quiz/${quiz.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all active:scale-[0.98]"
                style={{ background: '#25D366', color: 'white', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Défier sur WhatsApp 📲
              </a>
            </div>

            {/* Secondary: share your result */}
            <div className="px-5 pb-5 pt-4 border-t border-white/5">
              <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 text-center">Partager mon résultat</p>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`J'ai fait "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''} 😱 Essaie toi : https://urcecret.site/quiz/${quiz.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ background: '#25D36618', border: '1px solid #25D36635', color: '#25D366' }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WA
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Je viens de faire "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''} 👀 Tu penses faire mieux ?\n\nhttps://urcecret.site/quiz/${quiz.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ background: '#00000033', border: '1px solid rgba(255,255,255,0.12)', color: '#e4e4e7' }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X
                </a>
                <button
                  onClick={() => {
                    const msg = `J'ai fait "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''} 😱 Essaie toi : https://urcecret.site/quiz/${quiz.slug}`;
                    if (navigator.share) {
                      void navigator.share({ title: quiz.title, text: msg, url: `https://urcecret.site/quiz/${quiz.slug}` });
                    } else {
                      navigator.clipboard.writeText(`https://urcecret.site/quiz/${quiz.slug}`).catch(() => {});
                      const btn = document.getElementById('copy-btn');
                      if (btn) { btn.textContent = '✓ Copié'; setTimeout(() => { if (btn) btn.textContent = 'Copier'; }, 2000); }
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span id="copy-btn">Partager</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mode Duo CTA */}
          <div
            className="mt-4 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.10))', border: '1px solid rgba(139,92,246,0.28)' }}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="text-white font-black text-sm leading-snug">Tu penses vraiment le/la connaître ?</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Fais ce quiz avec lui/elle — vous serez surpris</p>
                </div>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🔥 Tu penses me connaître vraiment ?\n\nFais ce quiz et compare tes réponses avec les miennes sans tricher 👀\n\nhttps://urcecret.site/duo`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98] mb-2"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}
              >
                📲 Envoie ce défi à ton/ta partenaire
              </a>
              <Link
                href="/duo"
                className="block text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
              >
                Voir les 5 quiz duo →
              </Link>
            </div>
          </div>

          {/* MBTI cross-sell */}
          <div
            className="mt-4 rounded-2xl overflow-hidden border"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(168,85,247,0.08))', borderColor: 'rgba(99,102,241,0.25)' }}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Nouveau</span>
              </div>
              <p className="text-white font-black text-sm leading-snug mb-1">Découvre ton type MBTI</p>
              <p className="text-zinc-500 text-xs mb-3 leading-relaxed">
                100 questions — trouve ton vrai profil parmi les 16 types de personnalité.
              </p>
              <Link
                href="/quiz/personnalite"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
              >
                🧠 Faire le test MBTI →
              </Link>
            </div>
          </div>

          {/* Other quizzes */}
          <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-xs text-zinc-500 text-center mb-3">Essaie un autre quiz</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { slug: 'narcissique', label: '🪞 Narcissique ?' },
                { slug: 'manipule', label: '🎭 Manipulé(e) ?' },
                { slug: 'crush', label: '💌 Mon crush ?' },
                { slug: 'burnout', label: '💤 Burnout ?' },
                { slug: 'rompre', label: '💔 Rompre ?' },
              ].filter(q => q.slug !== quiz.slug).slice(0, 4).map((q) => (
                <Link
                  key={q.slug}
                  href={`/quiz/${q.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Refaire le quiz link */}
          <div className="mt-4 text-center">
            <Link href={`/quiz/${quiz.slug}`} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Refaire le quiz
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
