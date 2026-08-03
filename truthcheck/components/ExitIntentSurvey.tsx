'use client';

import { useEffect, useRef, useState } from 'react';

// ── Sondage "avant de partir" ────────────────────────────────────────────────
// Un navigateur ne laisse JAMAIS un site afficher une popup interactive à la
// vraie fermeture d'onglet (protection anti-piège, y compris dans les
// webviews TikTok) — donc pas de solution "au moment de quitter l'app" telle
// quelle. Le signal le plus fiable qui marche vraiment sur mobile est le
// bouton retour : on pose une entrée d'historique tampon au montage ; le
// premier retour la consomme (déclenche popstate, reste sur la page) — on en
// profite pour montrer le sondage. Un 2e retour quitte pour de vrai, plus
// aucun tampon à consommer. Jamais un piège sans issue : "Quitter sans
// répondre" laisse toujours partir immédiatement.
const REASONS = [
  { key: 'too_complicated', label: 'Trop compliqué' },
  { key: 'not_interested', label: 'Pas intéressé(e)' },
  { key: 'later', label: 'Je reviendrai plus tard' },
  { key: 'technical', label: 'Problème technique' },
  { key: 'other', label: 'Autre raison' },
];

export default function ExitIntentSurvey({ step }: { step: string }) {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [sent, setSent] = useState(false);
  const armedRef = useRef(true);
  // Capturé AVANT le pushState tampon, pour retrouver d'où la personne
  // venait au moment de vraiment partir (voir leave() — ni history.back() ni
  // router.back() ne fonctionnent de façon fiable ici : Next.js App Router
  // patche l'API History pour son propre routing RSC, et un retour
  // programmatique après notre propre pushState entre en conflit avec ce
  // patch — la page reste figée sur place, trouvé en QA).
  const cameFromRef = useRef<string | null>(null);

  useEffect(() => {
    cameFromRef.current = document.referrer || null;
    window.history.pushState({ exitGuard: true }, '');
    function handlePopState() {
      if (!armedRef.current) return;
      armedRef.current = false;
      setVisible(true);
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function leave() {
    setVisible(false);
    // Navigation "dure" (pas l'API History) : contourne complètement le
    // routeur de Next, jamais de risque de rester figé sur place.
    const sameOrigin = cameFromRef.current && cameFromRef.current.startsWith(window.location.origin);
    const target = sameOrigin ? cameFromRef.current! : '/decouverte';
    window.location.href = target;
  }

  async function submit() {
    try {
      await fetch('/api/exit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step,
          rating,
          reason,
          reasonText: reason === 'other' ? otherText.trim().slice(0, 300) || undefined : undefined,
        }),
      });
    } catch {}
    setSent(true);
    setTimeout(leave, 550);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-4"
      style={{ background: 'rgba(21,18,31,0.55)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
        {sent ? (
          <p className="text-center text-sm font-bold py-6" style={{ color: 'var(--ink)' }}>Merci, à bientôt 👋</p>
        ) : (
          <>
            <p className="font-display text-lg font-black mb-1" style={{ color: 'var(--ink)' }}>Avant de partir…</p>
            <p className="text-sm mb-4" style={{ color: '#6b6055' }}>Une note sur UrCecret ?</p>
            <div className="flex justify-center gap-1.5 mb-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  className="text-3xl leading-none transition-transform active:scale-90"
                >
                  {rating !== null && n <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Pourquoi tu t&apos;arrêtes ?</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {REASONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setReason(r.key)}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: reason === r.key ? 'var(--gold-soft)' : 'var(--paper-panel)',
                    border: `1px solid ${reason === r.key ? 'var(--gold-line)' : 'var(--line)'}`,
                    color: 'var(--ink)',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {reason === 'other' && (
              <textarea
                value={otherText}
                onChange={(e) => setOtherText(e.target.value.slice(0, 300))}
                rows={2}
                placeholder="Dis-nous en quelques mots…"
                className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none mb-4"
                style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              />
            )}
            <button
              type="button"
              onClick={submit}
              disabled={rating === null && reason === null}
              className="ur-btn-gold w-full py-3 text-sm mb-2 disabled:opacity-40"
            >
              Envoyer et quitter
            </button>
            <button type="button" onClick={leave} className="w-full py-2.5 text-xs font-semibold" style={{ color: '#a8a29e' }}>
              Quitter sans répondre
            </button>
          </>
        )}
      </div>
    </div>
  );
}
