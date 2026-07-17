'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Quiz } from '@/lib/quizzes';
import { getResultTier } from '@/lib/quizzes';
import { track } from '@/lib/analytics';

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
  const isPremium = ['premium', 'plus'].includes((session?.user as { tier?: string } | undefined)?.tier ?? '');
  const sessionLoading = status === 'loading';

  const tier = getResultTier(quiz, score);

  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const [animatedScore, setAnimatedScore] = useState(0);
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

  function trackEvent(event: 'paywall_view' | 'checkout_click' | 'payment_success') {
    track(event, { quiz: quiz.slug, content_name: quiz.title });
  }

  const PAYWALL_CONFIG: Record<string, { headline: string; subline: string; social: string }> = {
    infidelite: {
      headline: score >= 70
        ? `L'analyse repère ${score >= 80 ? '4' : '3'} comportements dans tes réponses qui figurent parmi les signaux les plus fiables.`
        : score >= 40
        ? "Deux des réponses que tu as données ont déclenché un signal — l'analyse explique pourquoi."
        : "L'analyse identifie précisément ce qui alimente tes doutes — et si c'est fondé.",
      subline: score >= 60
        ? "Ces comportements ne s'expliquent pas tous par le stress ou la fatigue. L'analyse nomme lequel est le plus révélateur dans ton cas."
        : "Connaître la source exacte d'un doute, c'est déjà reprendre le contrôle.",
      social: "4 127 personnes ont lu leur analyse cette semaine",
    },
    adopte: {
      headline: score >= 60
        ? "Parmi les indices que tu décris, au moins deux sortent de la variabilité familiale normale."
        : "L'analyse distingue ce qui est banal de ce qui mérite vraiment une réponse.",
      subline: score >= 60
        ? "L'analyse nomme chaque indice et explique ce qu'il suggère — sans interprétation approximative."
        : "Mettre un mot précis sur une intuition floue, c'est la première étape vers la paix de l'esprit.",
      social: "1 389 personnes ont éclairci leur histoire cette semaine",
    },
    amoureux: {
      headline: score >= 70
        ? "Ce que tu ressens pour cette personne n'est pas de l'amitié — l'analyse identifie précisément ce que c'est."
        : score >= 40
        ? "Tes sentiments sont à mi-chemin entre l'attachement et l'amour — l'analyse fait la distinction."
        : "L'analyse te dit exactement pourquoi ce que tu ressens te semble flou.",
      subline: score >= 60
        ? "Il y a une question que tu n'oses pas te poser — tes réponses y ont déjà répondu."
        : "Nommer ce qu'on ressent, c'est 50 % du chemin vers savoir quoi faire.",
      social: "2 841 personnes ont mis un mot sur leurs sentiments cette semaine",
    },
    'vrais-amis': {
      headline: score >= 60
        ? "Au moins trois des comportements que tu décris ne font pas partie d'une amitié saine."
        : score >= 30
        ? "L'analyse identifie le point de friction principal dans cette amitié."
        : "L'analyse confirme ce que tu ressens — et nomme ce qui rend cette amitié solide.",
      subline: score >= 60
        ? "L'analyse te dit quel comportement est le plus problématique — et lequel tu minimises probablement."
        : "Savoir exactement sur qui compter, ça change la façon dont on investit dans ses relations.",
      social: "2 063 personnes ont réévalué une amitié cette semaine",
    },
    orientation: {
      headline: score >= 60
        ? "Tes réponses indiquent une attirance non-hétérosexuelle significative — l'analyse la décrit avec précision."
        : score >= 35
        ? "L'analyse identifie la nuance exacte de ton orientation — ni tout blanc ni tout noir."
        : "L'analyse te dit pourquoi tu te poses ces questions — et ce que tes réponses révèlent vraiment.",
      subline: score >= 50
        ? "Mettre un mot précis sur qui on est, c'est souvent ce qui libère."
        : "Ton orientation t'appartient — l'analyse est là pour t'aider à la comprendre, pas à l'étiqueter.",
      social: "1 156 personnes se sont mieux comprises cette semaine",
    },
    personnalite: {
      headline: `Ton profil contient une information que la majorité des tests MBTI ne révèlent jamais : la version de toi qui émerge sous stress, en amour ou dans le conflit.`,
      subline: `Chaque type a une "face cachée" — un mode secondaire qui détermine tes vraies réactions. L'analyse nomme la tienne avec précision.`,
      social: `7 241 personnes ont découvert leur profil exact cette semaine`,
    },
  };
  const pw = PAYWALL_CONFIG[quiz.slug] ?? {
    headline: score >= 60
      ? "L'analyse a identifié le pattern principal dans tes réponses — il est plus précis que tu ne le crois."
      : "Tes réponses dessinent un profil précis — l'analyse le nomme.",
    subline: "Ce que tu as répondu pointe vers quelque chose de spécifique. L'analyse le formule clairement.",
    social: "Des milliers de personnes ont découvert leur profil cette semaine",
  };

  // ── Teaser hooks: one real insight cut before the key conclusion ──
  const TEASER_HOOKS: Record<string, (s: number) => { intro: string; cut: string; locked: string[] }> = {
    infidelite: (s) => ({
      intro: s >= 70
        ? `Parmi les comportements que tu décris, l'un d'eux est présent dans 8 cas sur 10 d'infidélité confirmée. Ce n'est pas le plus évident — c'est celui que la plupart des gens remarquent en dernier.`
        : s >= 40
        ? `Deux des réponses que tu as données s'écartent de ce qu'on observe dans les couples sans problème. L'une concerne la communication, l'autre…`
        : `Tes réponses ne montrent pas les signaux classiques — mais l'analyse identifie précisément la source de ton instinct.`,
      cut: s >= 40
        ? `Le comportement le plus révélateur dans ton cas est lié à…`
        : `Ce qui génère tes doutes sans raison apparente, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 Le signal #1 dans tes réponses`,
        `🔒 Pourquoi ce comportement spécifique est significatif`,
        `🔒 Ce que tu peux faire concrètement maintenant`,
      ],
    }),
    adopte: (s) => ({
      intro: s >= 60
        ? `Deux des indices que tu décris sortent de la variabilité génétique normale entre membres d'une même famille. L'un concerne des traits physiques, l'autre un schéma comportemental que tu as mentionné.`
        : s >= 30
        ? `L'analyse distingue les différences familiales normales de celles qui méritent une vraie réponse. Dans ton cas, un élément se démarque clairement des autres.`
        : `Tes réponses penchent vers une histoire familiale cohérente — mais l'analyse explique précisément pourquoi tu te poses ces questions.`,
      cut: `Ce qui donne le plus de poids à tes interrogations, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 L'indice le plus significatif dans ton cas`,
        `🔒 Ce qui distingue une vraie interrogation d'une curiosité normale`,
        `🔒 Les prochaines étapes si tu veux une réponse définitive`,
      ],
    }),
    amoureux: (s) => ({
      intro: s >= 70
        ? `Tes réponses contiennent un schéma que les psychologues associent à l'attachement romantique réel — pas à l'admiration, pas à l'habitude. La différence tient à trois types de réponses que tu as données.`
        : s >= 40
        ? `Ce que tu ressens oscille entre l'attachement profond et quelque chose de plus. L'analyse identifie exactement à quel stade tu en es — et ce que ça signifie pour la suite.`
        : `L'analyse explique pourquoi ce que tu ressens te semble difficile à nommer — et te donne le mot juste.`,
      cut: s >= 40
        ? `La réponse qui a le plus pesé dans ton score est celle où tu as dit que…`
        : `Ce que tes réponses révèlent sur la nature de tes sentiments, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 Si c'est vraiment de l'amour ou autre chose`,
        `🔒 Le signal émotionnel le plus fort dans tes réponses`,
        `🔒 Quoi faire — et quand`,
      ],
    }),
    'vrais-amis': (s) => ({
      intro: s >= 60
        ? `L'analyse repère trois comportements dans ce que tu décris qui ne font pas partie d'une amitié saine. Le plus problématique n'est pas forcément celui que tu penses.`
        : s >= 30
        ? `Toute amitié a ses zones d'ombre — mais l'analyse identifie si ce que tu décris est de la normale ou un pattern qui mérite attention.`
        : `Les réponses que tu as données dessinent une amitié globalement solide. L'analyse identifie son vrai point fort — et son unique point faible.`,
      cut: s >= 40
        ? `Le comportement qui a le plus impacté ton score, c'est le fait que cette personne…`
        : `Ce qui rend cette amitié résiliente selon tes réponses, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 Le comportement le plus révélateur de cette personne`,
        `🔒 Si tu minimises ou surestimes le problème`,
        `🔒 Ce qu'une amitié saine devrait ressembler dans ton cas`,
      ],
    }),
    orientation: (s) => ({
      intro: s >= 60
        ? `Tes réponses indiquent une attirance non-hétérosexuelle cohérente — pas une curiosité passagère. L'analyse la décrit avec précision, sans étiquette forcée.`
        : s >= 30
        ? `L'analyse situe ton orientation sur le spectre de façon précise. Ce n'est pas binaire — et tes réponses le confirment.`
        : `L'analyse explique pourquoi tu te poses ces questions — et ce que tes réponses révèlent réellement sur ton orientation.`,
      cut: `Ce que tes réponses suggèrent de plus précis sur ton orientation, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 La description précise de ce que tes réponses révèlent`,
        `🔒 Ce qui confirme ou nuance cette première impression`,
        `🔒 Des ressources adaptées à ta situation`,
      ],
    }),
    personnalite: () => ({
      intro: `Ton profil révèle une tension entre deux fonctions cognitives que la plupart des gens ne distinguent jamais. Ce n'est pas juste 4 lettres — c'est un système entier qui explique pourquoi tu réagis comme tu le fais dans les situations qui comptent vraiment.`,
      cut: `La fonction que tu utilises réellement en premier (pas celle que tu crois) est…`,
      locked: [
        `🔒 Tes 4 lettres confirmées + ton niveau de certitude`,
        `🔒 Ta fonction cognitive dominante réelle`,
        `🔒 Ton profil "sous pression" — le toi qui émerge dans le stress ou en amour`,
        `🔒 Tes 3 compatibilités les plus inattendues`,
      ],
    }),
  };
  const teaser = TEASER_HOOKS[quiz.slug]?.(score) ?? {
    intro: score >= 60
      ? `L'analyse a identifié un pattern cohérent dans tes réponses. Ce pattern pointe vers quelque chose de précis — pas une généralité.`
      : `Tes réponses dessinent un profil spécifique. L'analyse le formule avec des mots que tu n'aurais peut-être pas utilisés toi-même.`,
    cut: `Ce que tes réponses révèlent de plus précis, c'est…`,
    locked: [
      `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
      `🔒 Le point principal de ton profil`,
      `🔒 Ce que la plupart des gens ne voient pas dans leurs propres réponses`,
      `🔒 Les recommandations personnalisées`,
    ],
  };


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

  // Count-up the real score for the reveal moment — the dopamine they earned
  useEffect(() => {
    if (sessionLoading) return;
    let raf = 0;
    let start: number | null = null;
    const dur = 1400;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedScore(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score, sessionLoading]);

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
    void doCheckout(session?.user?.email ?? undefined);
  }

  function handleOneTimeClick() {
    trackEvent('checkout_click');
    void doOneTimeCheckout(session?.user?.email ?? undefined);
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">

      {/* ContractScreen removed — results visible immediately after test */}

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
                onClick={() => {
                  setShowExitModal(false);
                  void (async () => {
                    setIsCheckingOut(true);
                    trackEvent('checkout_click');
                    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizSlug: quiz.slug, score, origin: window.location.origin, userEmail: session?.user?.email ?? undefined, annual: true }) });
                    const data = await res.json() as { url?: string; error?: string };
                    if (data.url) window.location.href = data.url; else { alert(data.error ?? 'Erreur de paiement'); setIsCheckingOut(false); }
                  })();
                }}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-xl font-black text-white text-base transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)', boxShadow: '0 4px 20px rgba(194,97,31,0.4)' }}
              >
                Tout débloquer — 29,99€/an ✦
              </button>
              <button
                onClick={() => { setShowExitModal(false); handleOneTimeClick(); }}
                disabled={isCheckingOut}
                className="w-full py-2.5 rounded-xl font-medium text-xs border transition-all disabled:opacity-60"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#a1a1aa' }}
              >
                ou juste ce résultat pour 1,99€
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
                    style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)' }}
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
          {session?.user ? (
            <Link
              href="/dashboard"
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
          ) : (
            <Link
              href="/quizzes"
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Accueil
            </Link>
          )}
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <p className="text-center text-zinc-500 text-sm mb-6">{quiz.title}</p>

          {sessionLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
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
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 mb-4">
                <p className="text-zinc-200 font-semibold text-sm mb-4">{tier.message}</p>
                <div className="space-y-3">
                  {analysis.map((line, i) => (
                    <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>

              {/* Dashboard CTA — premium users */}
              <Link
                href="/dashboard"
                className="flex items-center justify-between w-full px-5 py-4 rounded-2xl mb-6 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, rgba(194,97,31,0.18), rgba(209,125,82,0.14))', border: '1px solid rgba(194,97,31,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="text-white font-black text-sm leading-tight">Mon profil UrCecret</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Historique · type MBTI · compatibilités</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Portrait viral CTA — concours 1 000 € */}
              <Link
                href={`/portrait?quiz=${quiz.slug}&score=${score}${quiz.slug === 'personnalite' ? '' : ''}`}
                className="flex items-center justify-between w-full px-5 py-4 rounded-2xl mb-3 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(194,97,31,0.12))', border: '1px solid rgba(251,191,36,0.35)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-white font-black text-sm leading-tight">Génère ton portrait viral</p>
                    <p style={{ color: '#fbbf24' }} className="text-xs font-semibold mt-0.5">Concours 1 000 € · le plus de vues gagne</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          ) : (
            /* ── FREE: paywall ── */
            <>
              {/* ── Real score revealed — the reward they earned (dopamine + shareable) ── */}
              <div className="flex justify-center mb-5">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <defs>
                    <linearGradient id="circleGradFree" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={`${tier.glowColor}88`} />
                      <stop offset="100%" stopColor={tier.glowColor} />
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="90" cy="90" r="72" fill="none"
                    stroke="url(#circleGradFree)" strokeWidth="10"
                    strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
                    strokeLinecap="round" transform="rotate(-90 90 90)"
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <text x="90" y="98" textAnchor="middle" fill={tier.glowColor} fontSize="42" fontWeight="900">{animatedScore}%</text>
                </svg>
              </div>

              {/* Tier badge — fully revealed */}
              <div className="flex justify-center mb-5">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border"
                  style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
                >
                  <span>{tier.emoji}</span>
                  {tier.title}
                </span>
              </div>

              {/* Verdict + free analysis preview — proves the value is real BEFORE any ask */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 mb-4">
                <p className="text-zinc-100 font-semibold text-sm mb-4 leading-relaxed">{tier.message}</p>
                <div className="space-y-3">
                  {analysis.slice(0, 3).map((line, i) => (
                    <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                  ))}
                </div>

                {/* The analysis continues — blurred to prove there's real depth behind the unlock.
                    Note : on n'affiche QUE un texte générique ici, jamais analysis.slice(3,6) —
                    un flou CSS n'est pas une protection, ce texte resterait lisible dans le DOM
                    (inspecteur / view-source) même flouté. Le vrai contenu n'est révélé qu'en
                    isPremium (branche ci-dessus, session serveur vérifiée). */}
                <div className="relative mt-3" aria-hidden>
                  <div className="space-y-3" style={{ filter: 'blur(5px)', opacity: 0.4, userSelect: 'none', pointerEvents: 'none' }}>
                    {['Suite de l\'analyse réservée aux membres.', 'Suite de l\'analyse réservée aux membres.', 'Suite de l\'analyse réservée aux membres.'].map((line, i) => (
                      <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(9,9,11,0.97))' }} />
                </div>
              </div>

              {/* What the complete report unlocks */}
              <div className="mb-5 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">Dans ton rapport complet</p>
                <div className="space-y-2">
                  {teaser.locked.filter((item) => !/score exact/i.test(item)).map((item) => (
                    <p key={item} className="text-[13px] text-zinc-300 leading-snug flex items-start gap-2">
                      <span className="flex-shrink-0 mt-px opacity-60">🔓</span>
                      <span>{item.replace(/^🔒\s*/, '')}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Main paywall card */}
              <div
                ref={paywallRef}
                className="rounded-2xl p-6 mb-6 border border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(194,97,31,0.14), rgba(209,125,82,0.10))' }}
              >
                <div className="text-center mb-5">
                  <h2 className="text-xl font-black text-white mb-2 leading-snug">{pw.headline}</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">{pw.subline}</p>
                </div>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-2 mb-5 py-2.5 rounded-xl border border-white/8 bg-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-zinc-400">{pw.social}</span>
                </div>

                {/* Annual — PRIMARY HERO */}
                <div
                  className="relative rounded-2xl p-5 mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(194,97,31,0.22), rgba(176,125,43,0.14))', border: '2px solid rgba(224,163,128,0.65)' }}
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-black px-4 py-1.5 rounded-full tracking-wide whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)', color: '#fff', boxShadow: '0 4px 18px rgba(194,97,31,0.6)' }}>
                      ⭐ LE MEILLEUR CHOIX · LE PLUS POPULAIRE
                    </span>
                  </div>

                  <div className="flex items-start justify-between mt-3 mb-3">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-base leading-tight">Accès illimité — 1 an</span>
                      <span className="text-[11px] mt-1 font-semibold" style={{ color: '#e0a380' }}>
                        0,08€/jour · moins qu&apos;un chewing-gum
                      </span>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-3">
                      <span className="text-zinc-500 text-xs line-through mb-0.5">119,88€</span>
                      <span className="font-black text-white text-3xl leading-none">29,99€</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded mt-1" style={{ background: 'rgba(125,148,102,0.25)', color: '#aebf9c' }}>
                        −75%
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {[
                      'Analyse complète de ce résultat — maintenant',
                      'Les 15 quiz secrets débloqués (couple, amitié…)',
                      'Profil MBTI + compatibilités duo illimitées',
                      'Suivi personnalisé sur 15 jours',
                      'Tous les futurs quiz inclus, à vie',
                      '🏆 Portrait viral IA + concours 1 000 €',
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-200 leading-snug">
                        <span className="flex-shrink-0 mt-px" style={{ color: '#aebf9c' }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      void (async () => {
                        setIsCheckingOut(true);
                        trackEvent('checkout_click');
                        const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizSlug: quiz.slug, score, origin: window.location.origin, userEmail: session?.user?.email ?? undefined, annual: true }) });
                        const data = await res.json() as { url?: string; error?: string };
                        if (data.url) window.location.href = data.url; else { alert(data.error ?? 'Erreur de paiement'); setIsCheckingOut(false); }
                      })();
                    }}
                    disabled={isCheckingOut}
                    className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)', boxShadow: '0 8px 36px rgba(194,97,31,0.65)' }}
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
                      <>Tout débloquer — 29,99€/an ✦</>
                    )}
                  </button>
                </div>

                {/* Secondary: monthly */}
                <button
                  onClick={handlePayClick}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm border border-white/10 bg-white/[0.04] hover:bg-white/7 transition-all active:scale-[0.98] mb-4 disabled:opacity-60 px-5"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex flex-col items-start gap-0.5">
                      <span className="text-zinc-200 font-semibold">🔄 Mensuel · sans engagement</span>
                      <span className="text-zinc-500 text-xs font-normal">Même accès · annule quand tu veux</span>
                    </span>
                    <span className="font-black text-zinc-200 ml-3 flex-shrink-0">9,99€<span className="font-normal text-zinc-500 text-xs">/mois</span></span>
                  </span>
                </button>

                {/* Downsell: 1,99€ one-time report only */}
                <div className="text-center mb-5">
                  <button
                    onClick={handleOneTimeClick}
                    disabled={isCheckingOut}
                    className="text-zinc-500 hover:text-zinc-300 text-xs underline underline-offset-2 transition-colors disabled:opacity-60"
                  >
                    ou juste ce résultat pour 1,99€ →
                  </button>
                </div>

                <p className="text-center text-[11px] text-zinc-600">
                  🔒 Paiement sécurisé Stripe · CB, Apple Pay, Google Pay · Annulable à tout moment
                </p>
              </div>

            </>
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
                  style={{ background: 'rgba(194,97,31,0.15)', border: '1px solid rgba(194,97,31,0.3)', color: '#d17d52' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span id="copy-btn">Partager</span>
                </button>
              </div>
            </div>
          </div>

          {/* MBTI cross-sell */}
          <div
            className="mt-4 rounded-2xl overflow-hidden border"
            style={{ background: 'linear-gradient(135deg, rgba(176,125,43,0.10), rgba(194,97,31,0.08))', borderColor: 'rgba(176,125,43,0.25)' }}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Nouveau</span>
              </div>
              <p className="text-white font-black text-sm leading-snug mb-1">Découvre ton type MBTI</p>
              <p className="text-zinc-500 text-xs mb-3 leading-relaxed">
                70 questions — trouve ton vrai profil parmi les 16 types de personnalité.
              </p>
              <Link
                href="/quiz/personnalite"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #b07d2b, #c2611f)', boxShadow: '0 4px 16px rgba(176,125,43,0.35)' }}
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
