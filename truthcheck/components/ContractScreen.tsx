'use client';

import { useEffect, useState } from 'react';

interface Props {
  quizTitle: string;
  quizSlug: string;
  accentColor: string;
  onAccept: () => void;
}

const PHRASES = [
  "Ce que tu t'apprêtes à découvrir, la plupart des gens ne veulent pas le savoir. Toi, tu as été jusqu'au bout.",
  "Tes réponses n'ont pas été générées. Elles t'appartiennent — et ce qui suit aussi.",
  "Ce résultat ne cherche pas à t'impressionner. Il cherche à te reconnaître.",
  "Il y a des choses sur toi que tu ressens depuis longtemps sans pouvoir les formuler. C'est l'heure.",
  "Ce que tu lis dans les prochaines secondes, certaines personnes attendent des années pour y arriver.",
];

const HEADINGS: Record<string, string> = {
  'auto-sabotage': "Es-tu prêt·e à voir ce qui te freine vraiment ?",
  personnalite: "Es-tu prêt·e à te découvrir vraiment ?",
  amoureux:     "Es-tu prêt·e à nommer ce que tu ressens ?",
  'vrais-amis': "Es-tu prêt·e à voir qui est vraiment là pour toi ?",
  'intelligence-emotionnelle': "Es-tu prêt·e à te comprendre tel·le que tu es ?",
  'role-familial': "Es-tu prêt·e à connaître la vérité sur ton histoire ?",
};

export default function ContractScreen({ quizTitle, quizSlug, accentColor, onAccept }: Props) {
  const [count, setCount]       = useState(0);
  const [btnReady, setBtnReady] = useState(false);
  const [fading, setFading]     = useState(false);

  const heading = HEADINGS[quizSlug] ?? 'Es-tu prêt·e à te voir tel·le que tu es ?';

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PHRASES.forEach((_, i) => {
      timers.push(setTimeout(() => setCount(c => Math.max(c, i + 1)), 600 + i * 700));
    });
    timers.push(setTimeout(() => setBtnReady(true), 600 + PHRASES.length * 700 + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  function handleAccept() {
    setFading(true);
    setTimeout(onAccept, 500);
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-y-auto py-10 px-5"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(88,28,135,0.18) 0%, #000 65%)',
        opacity:    fading ? 0 : 1,
        transition: fading ? 'opacity 0.5s ease' : undefined,
      }}
    >
      <div className="w-full max-w-sm">

        {/* ── Glowing seal ── */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(194,97,31,0.18)', animationDuration: '2.8s' }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{ background: 'rgba(194,97,31,0.08)' }}
            />
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white font-black select-none"
              style={{
                background:  'linear-gradient(135deg, #a94e18, #d17d52)',
                boxShadow:   '0 0 50px rgba(194,97,31,0.75), 0 0 100px rgba(194,97,31,0.25)',
              }}
            >
              ✦
            </div>
          </div>
        </div>

        {/* ── Heading ── */}
        <h1
          className="text-white font-black text-center leading-tight mb-2"
          style={{ fontSize: 'clamp(1.2rem, 5vw, 1.55rem)' }}
        >
          {heading}
        </h1>
        <p className="text-center text-zinc-600 text-[10px] tracking-[0.28em] uppercase font-semibold mb-10">
          ─── Contrat de vérité ───
        </p>

        {/* ── Clauses (staggered) ── */}
        <div className="space-y-5 mb-10">
          {PHRASES.map((phrase, i) => (
            <div
              key={i}
              style={{
                opacity:    count > i ? 1 : 0,
                transform:  count > i ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.65s ease, transform 0.65s ease',
              }}
            >
              <p className="text-sm text-zinc-300 leading-relaxed">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-2 mb-0.5 align-middle flex-shrink-0"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
                />
                {phrase}
              </p>
            </div>
          ))}
        </div>

        {/* ── Signature + CTA ── */}
        <div
          style={{
            opacity:    btnReady ? 1 : 0,
            transform:  btnReady ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div className="border-t border-white/8 pt-5 mb-5">
            <p className="text-center text-zinc-500 text-[11px] leading-relaxed italic">
              « En continuant, j&apos;accepte de me voir tel·le que je suis vraiment —<br />
              sans filtre, sans jugement. »
            </p>
          </div>

          <button
            onClick={handleAccept}
            className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-[0.98]"
            style={{
              background:  'linear-gradient(135deg, #c2611f, #d17d52)',
              boxShadow:   '0 8px 48px rgba(194,97,31,0.65), 0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            Oui, je veux savoir →
          </button>

          <p className="text-center text-zinc-700 text-[10px] mt-5 tracking-wide">
            {quizTitle}
          </p>
        </div>

      </div>
    </div>
  );
}
