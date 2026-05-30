'use client';

import { useEffect, useRef, useState } from 'react';
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

  const tier = getResultTier(quiz, score);

  const [displayScore, setDisplayScore] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const [shareId, setShareId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const hasSaved = useRef(false);

  const analysis = buildAnalysis(quiz, score, tier.title);

  // Save result to DB once on mount
  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizSlug: quiz.slug, score }),
    })
      .then((r) => r.json())
      .then((data: { id?: string }) => {
        if (data.id) setShareId(data.id);
      })
      .catch(() => {});
  }, [quiz.slug, score]);

  // Animate circle + counter, then show paywall
  useEffect(() => {
    const timer = setTimeout(() => setStrokeOffset(CIRCUMFERENCE * (1 - score / 100)), 200);

    const duration = 1500;
    let start: number | null = null;
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.floor(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    });

    // Show paywall after animation ends
    const paywallTimer = setTimeout(() => setShowPaywall(true), 2200);

    return () => { clearTimeout(timer); cancelAnimationFrame(raf); clearTimeout(paywallTimer); };
  }, [score]);

  async function handleStripeCheckout() {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId: shareId, origin: window.location.origin }),
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

  function handleShare() {
    const url = shareId
      ? `${window.location.origin}/share/${shareId}`
      : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: tier.glowColor }}
        />
      </div>

      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/onboarding" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <span className="text-sm font-medium text-zinc-300">{quiz.emoji} Résultats</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <p className="text-center text-zinc-500 text-sm mb-8">{quiz.title}</p>

          {/* Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative">
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
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tabular-nums" style={{ color: tier.glowColor }}>
                  {displayScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Tier badge */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
              style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
            >
              <span>{tier.emoji}</span>
              {tier.title}
            </span>
          </div>

          {/* Score bar */}
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>0%</span>
              <span className="text-zinc-400 font-medium">Ton score : {score}%</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${score}%`, background: `linear-gradient(90deg, ${tier.glowColor}66, ${tier.glowColor})`, transitionDelay: '300ms' }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-600 mt-2">
              {quiz.resultTiers.map((t, i) => <span key={i} title={t.title}>{t.emoji}</span>)}
            </div>
          </div>

          {/* Analysis + Message — blurred with paywall */}
          <div className="relative mb-8">
            <div
              className="glass rounded-2xl p-6 space-y-3 transition-all duration-700"
              style={{ filter: showPaywall ? 'blur(8px)' : 'none', userSelect: showPaywall ? 'none' : 'auto', pointerEvents: showPaywall ? 'none' : 'auto' }}
            >
              <p className="text-zinc-200 font-semibold leading-relaxed">{tier.message}</p>
              <div className="border-t border-white/8 pt-3 space-y-2">
                {analysis.map((line, i) => (
                  <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            </div>

            {/* Paywall overlay */}
            {showPaywall && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl px-6 py-8"
                style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.7) 0%, rgba(9,9,11,0.97) 40%)' }}
              >
                <div className="text-center max-w-xs">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>

                  <h3 className="text-xl font-black text-white mb-2">
                    Débloque ton analyse complète
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Tes résultats détaillés + une analyse de 10 points personnalisée t&apos;attendent.
                    Moins cher qu&apos;un café par mois.
                  </p>

                  <button
                    onClick={handleStripeCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 rounded-2xl font-black text-white text-lg mb-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
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
                      '4,99€ / mois → Voir mes résultats'
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-zinc-600">ou</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <a
                    href={`https://www.paypal.com/paypalme/ursecret/4.99`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#003087] hover:bg-[#001f5c] text-white transition-all duration-200 mb-4"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.144 19.532l1.049-6.667H6.189L7.238 6.2h6.924c2.16 0 3.646.52 4.461 1.559.375.483.607 1.003.697 1.56.091.557.046 1.229-.136 2.015l-.016.062c-.504 2.198-2.006 3.297-4.506 3.297h-1.394l-.74 4.839H7.144zm3.506-7.53h1.25c.964 0 1.618-.197 1.963-.59.205-.234.35-.617.437-1.148l.014-.086c.086-.536.055-.91-.094-1.121-.178-.25-.61-.375-1.295-.375H11.7l-.55 3.32z"/>
                    </svg>
                    Payer via PayPal
                  </a>

                  <p className="text-[10px] text-zinc-600">
                    Annulable à tout moment · 100% sécurisé · Sans engagement
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Share link */}
          {shareId && !showPaywall && (
            <div className="glass rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
              <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-xs text-zinc-500 truncate flex-1">
                /share/{shareId}
              </span>
              <span className="text-[10px] text-emerald-500 shrink-0">Sauvegardé ✓</span>
            </div>
          )}

          {/* Actions */}
          {!showPaywall && (
            <div className="grid grid-cols-3 gap-3">
              <Link
                href={`/quiz/${quiz.slug}`}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs font-medium">Refaire</span>
              </Link>

              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-zinc-400 hover:text-white"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-medium text-emerald-400">Copié !</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xs font-medium">Partager</span>
                  </>
                )}
              </button>

              <Link
                href="/onboarding"
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs font-medium">Accueil</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
