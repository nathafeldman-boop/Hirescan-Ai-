'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Seal from '@/components/Seal';

const CARDS = [
  {
    href: '/parcours',
    emoji: '🗺️',
    title: 'Ton Parcours de progression',
    kicker: 'Nouveau',
    desc: 'Une carte de niveaux, personnalisée selon ton objectif, pour avancer un peu chaque jour.',
    accent: 'var(--gold)',
    accentSoft: 'var(--gold-soft)',
  },
  {
    href: '/quetes',
    emoji: '🏆',
    title: 'Suis ta progression',
    kicker: 'Mes quêtes',
    desc: 'Débloque des messages, des badges et de nouvelles quêtes au fil de ton parcours.',
    accent: 'var(--gold)',
    accentSoft: 'var(--gold-soft)',
  },
  {
    href: '/parcours',
    emoji: '🗺️',
    title: 'Ton Parcours de progression',
    kicker: 'Nouveau',
    desc: 'Une carte de niveaux, personnalisée selon ton objectif, pour avancer un peu chaque jour.',
    accent: 'var(--gold)',
    accentSoft: 'var(--gold-soft)',
  },
  {
    href: '/quiz/personnalite',
    emoji: '🧠',
    title: 'Découvre qui tu es vraiment',
    kicker: 'Quête de découverte',
    desc: 'Comprends ta personnalité, tes forces et ta manière de fonctionner.',
    accent: 'var(--gold)',
    accentSoft: 'var(--gold-soft)',
  },
  {
    href: '/chat',
    emoji: '✨',
    title: 'Parle avec Elio',
    kicker: 'Coach IA',
    desc: 'Ton IA personnelle pour mieux réfléchir et mieux te comprendre.',
    accent: 'var(--fam-nt)',
    accentSoft: 'rgba(53, 80, 107, 0.10)',
  },
  {
    href: '/journal',
    emoji: '📅',
    title: 'Comprends tes émotions',
    kicker: 'Journal émotionnel',
    desc: 'Note ton humeur, observe tes tendances et découvre tes schémas.',
    accent: 'var(--fam-sp)',
    accentSoft: 'rgba(122, 74, 30, 0.10)',
  },
  {
    href: '/compat',
    emoji: '💬',
    title: 'Analyse tes relations',
    kicker: 'Relations',
    desc: 'Comprends mieux tes conversations et ta compatibilité avec les autres.',
    accent: 'var(--fam-nf)',
    accentSoft: 'rgba(107, 63, 82, 0.10)',
  },
] as const;

export default function DecouverteClient({
  firstName, hasProfile, hasNewQuests, hasPendingQuests,
}: {
  firstName: string | null;
  hasProfile: boolean;
  hasNewQuests: boolean;
  hasPendingQuests: boolean;
}) {
  // Respecte prefers-reduced-motion pour l'animation "flotte" posée en style
  // inline (une media query CSS ne peut pas l'écraser, contrairement aux
  // classes — voir le commentaire sur `floatingNew` plus bas).
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="grain-overlay" />

      <style>{`
        @keyframes hubUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .hub-up { opacity:0; animation: hubUp .5s ease forwards; }
        .hub-card {
          transition: transform .28s cubic-bezier(.22,1,.36,1), border-color .28s ease, box-shadow .28s ease, background .28s ease;
        }
        .hub-card:hover, .hub-card:focus-visible {
          transform: translateY(-4px) scale(1.012);
        }
        .hub-card:active { transform: translateY(-1px) scale(0.995); }
        .hub-card-icon { transition: transform .32s cubic-bezier(.34,1.56,.64,1); }
        .hub-card:hover .hub-card-icon { transform: scale(1.12) rotate(-4deg); }
        .hub-card-arrow { transition: transform .28s ease, opacity .28s ease; }
        .hub-card:hover .hub-card-arrow { transform: translateX(4px); }
        .hub-card-glow { opacity: 0; transition: opacity .4s ease; }
        .hub-card:hover .hub-card-glow { opacity: 1; }
        @keyframes questFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes questPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(201,163,74,0.45); } 70% { box-shadow: 0 0 0 10px rgba(201,163,74,0); } }
        .quest-badge--new { animation: questPulse 2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hub-up { opacity: 1; animation: none; }
          .hub-card, .hub-card-icon, .hub-card-arrow { transition: none; }
          .hub-card:hover { transform: none; }
          .quest-badge--new { animation: none; }
        }
      `}</style>

      {/* Photo de fond derrière la nav + l'en-tête — fondu vers le papier avant
          les cartes, texte clair (photo sombre, contrairement à celle de la
          landing) pour rester lisible sur toute la zone. */}
      <div className="absolute inset-x-0 top-0 z-0" style={{ height: 640 }} aria-hidden>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/decouverte-hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(21,18,31,0.45) 0%, rgba(21,18,31,0.55) 45%, var(--paper) 92%)' }} />
      </div>

      {/* Nav minimale — pas de distraction, on est déjà dans le funnel */}
      <nav className="relative z-10 max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-display italic" style={{ color: '#FAF6EC', fontWeight: 700 }}>
          UrCecret
        </Link>
      </nav>

      <section className="relative z-10 max-w-2xl mx-auto px-6 pt-6 pb-20">

        {/* En-tête */}
        <div className="text-center mb-11">
          <div className="hub-up flex justify-center mb-5">
            <Seal size={56} spin color="#FAF6EC" />
          </div>
          <p className="hub-up ur-label text-[11px] mb-4" style={{ color: 'var(--gold)', animationDelay: '.05s' }}>
            {firstName ? `Ton espace, ${firstName}` : 'Ton exploration commence ici'}
          </p>
          <h1 className="hub-up font-display mb-4" style={{ color: '#FAF6EC', fontSize: 'clamp(1.9rem, 7vw, 2.75rem)', lineHeight: 1.12, fontWeight: 700, letterSpacing: '-0.01em', animationDelay: '.1s' }}>
            Que veux-tu découvrir sur toi&nbsp;?
          </h1>
          <p className="hub-up text-[15px] max-w-sm mx-auto" style={{ lineHeight: 1.6, animationDelay: '.16s', color: 'rgba(250,246,236,0.72)' }}>
            Choisis ton expérience et commence ton exploration.
          </p>
        </div>

        {/* Quête "profil incomplet" — le test personnalité n'est plus une
            étape obligatoire avant le hub, donc on la remet en avant ICI,
            sous forme d'invitation plutôt que de mur. Le tap n'envoie plus
            directement au quiz : ça ouvre /quete, un écran qui pose
            l'intention ("apprends à mieux te connaître") avant l'action —
            voir app/quete/. Disparaît d'elle-même dès que le profil MBTI
            existe (voir app/decouverte/page.tsx). */}
        {!hasProfile && (
          <div
            className="hub-up rounded-[24px] px-5 py-4 mb-3.5"
            style={{ animationDelay: '.18s', background: 'var(--gold-soft)', border: '1px dashed var(--gold-line)' }}
          >
            <div className="flex items-start gap-3.5 mb-3.5">
              <span className="text-2xl flex-shrink-0">🛑</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-snug" style={{ color: 'var(--ink)' }}>Ton profil n&apos;est pas encore complet</p>
                <p className="text-[12.5px] mt-1" style={{ color: '#8a7d5c', lineHeight: 1.5 }}>Découvre ton fonctionnement profond en terminant ta quête.</p>
              </div>
            </div>
            <Link href="/quetes" className="hub-card block w-full py-2.5 rounded-full text-center text-sm font-bold" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
              Compléter mon profil
            </Link>
          </div>
        )}

        {/* Les cartes — "Mes quêtes" (toujours 1ère) a un traitement à part :
            fond plein doré (pas juste un accent), et deux cartouches
            "nouveau" / "en attente" qui reflètent l'état réel des quêtes
            (voir app/decouverte/page.tsx pour le calcul) — c'est le point
            d'entrée qu'on veut faire ressortir des 5 autres cartes, identiques
            entre elles. */}
        <div className="flex flex-col gap-3.5">
          {CARDS.map((card, i) => {
            const isQuestCard = card.href === '/quetes';
            const questAttention = isQuestCard && (hasNewQuests || hasPendingQuests);
            const floatingNew = isQuestCard && hasNewQuests && !reduceMotion;
            const entranceDelay = 0.2 + i * 0.08;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="hub-up hub-card group relative block rounded-[28px] px-6 py-6 overflow-hidden"
                style={{
                  // Le survol (`.hub-card:hover`) et l'entrée (`.hub-up`) posent déjà
                  // un `animation` via CSS — une classe `quest-card--new` séparée
                  // écraserait silencieusement l'animation d'entrée (une seule
                  // propriété `animation` gagne, elles ne fusionnent pas). Donc pour
                  // la carte "nouveau", on combine les deux dans UNE valeur inline
                  // (qui prime sur les classes) plutôt que d'ajouter une 2e classe.
                  ...(floatingNew
                    ? { animation: `hubUp .5s ease forwards ${entranceDelay}s, questFloat 2.4s ease-in-out infinite ${entranceDelay + 0.5}s` }
                    : { animationDelay: `${entranceDelay}s` }),
                  background: isQuestCard ? 'linear-gradient(135deg, var(--gold-soft), var(--paper-panel))' : 'var(--paper-panel)',
                  border: isQuestCard ? '1.5px solid var(--gold-line)' : '1px solid var(--line)',
                  boxShadow: isQuestCard ? '0 4px 24px rgba(201,163,74,0.14)' : undefined,
                }}
              >
                {/* Glow radial subtil au survol, teinté par l'accent de la carte */}
                <div
                  className="hub-card-glow pointer-events-none absolute -inset-px rounded-[28px]"
                  style={{ background: `radial-gradient(420px circle at 15% 15%, ${card.accentSoft}, transparent 60%)` }}
                  aria-hidden
                />

                {questAttention && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    {hasNewQuests && (
                      <span
                        className="quest-badge--new text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                        style={{ background: 'var(--gold)', color: 'var(--ink)' }}
                      >
                        Nouveau
                      </span>
                    )}
                    {!hasNewQuests && hasPendingQuests && (
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)' }}
                      >
                        ⚠️ Pas fini
                      </span>
                    )}
                  </div>
                )}

                <div className="relative flex items-center gap-5">
                  <div
                    className="hub-card-icon flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: card.accentSoft }}
                  >
                    {card.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="ur-label text-[10px] mb-1.5" style={{ color: card.accent }}>
                      {card.kicker}
                    </p>
                    <h2 className="font-display font-bold text-stone-900 leading-snug" style={{ fontSize: 17, letterSpacing: '-0.01em' }}>
                      {card.title}
                    </h2>
                    <p className="text-[13px] text-stone-500 mt-1" style={{ lineHeight: 1.5 }}>
                      {card.desc}
                    </p>
                  </div>

                  <div
                    className="hub-card-arrow flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: card.accentSoft }}
                  >
                    <svg className="w-4 h-4" style={{ color: card.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="hub-up text-center text-xs text-stone-400 mt-8" style={{ animationDelay: '.6s' }}>
          Gratuit pour commencer · aucune carte bancaire requise
        </p>
      </section>
    </main>
  );
}
