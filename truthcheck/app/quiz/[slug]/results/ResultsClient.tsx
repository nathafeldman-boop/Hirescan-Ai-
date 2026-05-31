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

  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const [shareId, setShareId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const hasSaved = useRef(false);

  const analysis = buildAnalysis(quiz, score, tier.title);

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

  // Animate the circle ring (blurred, for FOMO)
  useEffect(() => {
    const t = setTimeout(() => setStrokeOffset(CIRCUMFERENCE * (1 - score / 100)), 300);
    return () => clearTimeout(t);
  }, [score]);

  async function handleStripeCheckout() {
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

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: tier.glowColor }}
        />
      </div>

      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/quiz/${quiz.slug}`} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <span className="text-sm font-medium text-zinc-300">{quiz.emoji} Résultats</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <p className="text-center text-zinc-500 text-sm mb-6">{quiz.title}</p>

          {/* Blurred score circle — creates FOMO, score not readable */}
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
                <text x="90" y="98" textAnchor="middle" fill={tier.glowColor} fontSize="42" fontWeight="900">??%</text>
              </svg>
            </div>
            {/* Lock icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #8b5cf6dd, #ec4899dd)', backdropFilter: 'blur(4px)' }}
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* "Results ready" badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Tes résultats sont prêts
            </span>
          </div>

          {/* Main paywall card */}
          <div
            className="rounded-2xl p-6 mb-6 border border-white/10"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))' }}
          >
            <div className="text-center mb-5">
              <h2 className="text-2xl font-black text-white mb-2">Débloque ton analyse</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Ton score exact + une analyse personnalisée de 10 points t&apos;attendent.
                Moins cher qu&apos;un café par mois.
              </p>
            </div>

            {/* What you get */}
            <div className="space-y-2 mb-5">
              {[
                'Ton score précis sur 100',
                'Ton niveau parmi 5 catégories',
                'Analyse de 10 points personnalisée',
                'Accès à tous les autres quizzes',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-300">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>

            {/* Stripe CTA */}
            <button
              onClick={handleStripeCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 rounded-xl font-black text-white text-base mb-3 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 4px 24px rgba(139,92,246,0.4)' }}
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
                '4,99€ / mois — Voir mes résultats ✦'
              )}
            </button>

            <p className="text-center text-[11px] text-zinc-600">
              Annulable à tout moment · Paiement 100% sécurisé
            </p>
          </div>

          {/* Blurred preview of what's waiting */}
          <div className="relative rounded-2xl overflow-hidden border border-white/5" style={{ pointerEvents: 'none' }}>
            <div style={{ filter: 'blur(7px)', userSelect: 'none' }}>
              {/* Tier badge preview */}
              <div className="flex justify-center pt-4 pb-2 bg-black/40">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
                  style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
                >
                  <span>{tier.emoji}</span>
                  {tier.title}
                </span>
              </div>

              {/* Score bar preview */}
              <div className="px-4 pb-3 bg-black/40">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${tier.glowColor}66, ${tier.glowColor})` }} />
                </div>
              </div>

              {/* Analysis lines preview */}
              <div className="p-4 bg-black/40 space-y-2">
                <p className="text-zinc-200 font-semibold text-sm">{tier.message}</p>
                {analysis.slice(0, 3).map((line, i) => (
                  <p key={i} className="text-zinc-400 text-xs leading-relaxed">{line}</p>
                ))}
              </div>
            </div>

            {/* Gradient fade over the blurred preview */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.3) 0%, rgba(9,9,11,0.85) 100%)' }}
            />
          </div>

          {/* Refaire le quiz link */}
          <div className="mt-6 text-center">
            <Link href={`/quiz/${quiz.slug}`} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Refaire le quiz
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
