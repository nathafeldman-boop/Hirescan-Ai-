'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Seal from '@/components/Seal';

interface Step {
  key: 'mbti' | 'chat' | 'parcours';
  href: string;
  emoji: string;
  kicker: string;
  title: string;
  desc: string;
  cta: string;
}

export default function TourClient({
  firstName, hasMbti, hasChat, hasParcours, parcoursHref,
}: {
  firstName: string | null;
  hasMbti: boolean;
  hasChat: boolean;
  hasParcours: boolean;
  parcoursHref: string;
}) {
  const router = useRouter();
  const [finishing, setFinishing] = useState(false);

  const STEPS: Step[] = [
    { key: 'mbti', href: '/quiz/personnalite', emoji: '🧠', kicker: 'Test de personnalité', title: 'Découvre qui tu es, vraiment', desc: '24 questions, 3 minutes, un résultat immédiat.', cta: 'Faire mon test →' },
    { key: 'chat', href: '/chat', emoji: '🤖', kicker: 'Ton IA personnelle', title: 'Pose une question à Elio', desc: "Il apprend à te connaître au fil de vos échanges.", cta: 'Parler à Elio →' },
    { key: 'parcours', href: parcoursHref, emoji: '🌱', kicker: 'Parcours de progression', title: 'Commence ton premier niveau', desc: 'Un chemin construit pour ton objectif.', cta: 'Commencer →' },
  ];
  const done: Record<Step['key'], boolean> = { mbti: hasMbti, chat: hasChat, parcours: hasParcours };
  const remaining = STEPS.filter((s) => !done[s.key]);
  const allDone = remaining.length === 0;

  async function finishTour() {
    setFinishing(true);
    try {
      await fetch('/api/tour/complete', { method: 'POST' });
    } catch {
      // Ne bloque jamais l'accès au hub même si l'appel échoue — voir la route,
      // qui est idempotente et sans conséquence si jamais appelée.
    }
    router.push('/decouverte');
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <section className="relative z-10 max-w-2xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <Seal size={52} spin color="#FAF6EC" />
          </div>
          <p className="ur-label text-[11px] mb-4" style={{ color: 'var(--gold)' }}>
            {firstName ? `Bienvenue, ${firstName}` : 'Bienvenue'}
          </p>
          {!allDone ? (
            <>
              <h1 className="font-display mb-4" style={{ color: '#FAF6EC', fontSize: 'clamp(1.7rem, 6vw, 2.4rem)', lineHeight: 1.15, fontWeight: 700 }}>
                Avant ton espace, essaie tout
              </h1>
              <p className="text-[15px] max-w-sm mx-auto" style={{ lineHeight: 1.6, color: 'rgba(250,246,236,0.72)' }}>
                Trois façons de mieux te comprendre — choisis par laquelle continuer.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display mb-4" style={{ color: '#FAF6EC', fontSize: 'clamp(1.7rem, 6vw, 2.4rem)', lineHeight: 1.15, fontWeight: 700 }}>
                Tu as tout essayé 🎉
              </h1>
              <p className="text-[15px] max-w-sm mx-auto" style={{ lineHeight: 1.6, color: 'rgba(250,246,236,0.72)' }}>
                Voici ce qui t&apos;attend cette semaine si tu continues.
              </p>
            </>
          )}
        </div>

        {!allDone ? (
          <div className="flex flex-col gap-3.5">
            {remaining.map((s) => (
              <Link
                key={s.key}
                href={s.href}
                className="group relative block rounded-[28px] px-6 py-5"
                style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                    style={{ width: 56, height: 56, fontSize: 26, background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}
                  >
                    {s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="ur-label text-[10px] mb-1" style={{ color: 'var(--gold)' }}>{s.kicker}</p>
                    <h2 className="font-display font-bold text-stone-900" style={{ fontSize: 16.5 }}>{s.title}</h2>
                    <p className="text-[13px] text-stone-500 mt-0.5 mb-2" style={{ lineHeight: 1.5 }}>{s.desc}</p>
                    <span className="text-[12.5px] font-semibold inline-block group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--gold)' }}>
                      {s.cta}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <p className="text-center text-[12px] mt-2" style={{ color: 'rgba(250,246,236,0.4)' }}>
              {3 - remaining.length}/3 déjà essayées
            </p>
          </div>
        ) : (
          <div className="rounded-[28px] px-7 py-8" style={{ background: 'var(--paper-panel)', border: '1.5px solid var(--gold-line)' }}>
            <p className="ur-label text-[10px] mb-4" style={{ color: 'var(--gold)' }}>Cette semaine, avec un abonnement</p>
            <div className="flex flex-col gap-3.5 mb-7">
              {[
                { emoji: '🔥', text: 'Une quête du jour, nouvelle chaque matin' },
                { emoji: '🌱', text: 'Ton Parcours qui continue à débloquer des niveaux' },
                { emoji: '🤖', text: 'Elio sans limite de messages, toujours disponible' },
                { emoji: '📖', text: 'Ton Journal qui affine tes tendances au fil des jours' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <span className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: 'var(--gold-soft)', fontSize: 16 }}>{item.emoji}</span>
                  <p className="text-[14px] font-medium text-stone-800" style={{ lineHeight: 1.4 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/pricing" className="ur-btn-gold w-full flex items-center justify-center py-3.5 text-sm mb-3">
              Voir les offres →
            </Link>
            <button
              onClick={finishTour}
              disabled={finishing}
              className="w-full text-center text-[13px] py-2"
              style={{ color: 'rgba(250,246,236,0.45)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {finishing ? 'Un instant…' : 'Continuer gratuitement →'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
