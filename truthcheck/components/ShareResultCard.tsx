'use client';

import { useState } from 'react';

// Carte de résultat téléchargeable : affiche l'image générée (/api/card) et
// propose de l'enregistrer / la partager via le partage natif du téléphone
// (feuille « Enregistrer dans Photos », TikTok, Insta…), avec repli en
// téléchargement direct sur desktop.
export default function ShareResultCard({ code }: { code: string }) {
  const [busy, setBusy] = useState(false);
  const src = `/api/card?type=${code}`;

  const handleShare = async () => {
    setBusy(true);
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const file = new File([blob], `urcecret-${code.toLowerCase()}.png`, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d?: { files: File[] }) => boolean };

      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          title: `Mon type de personnalité : ${code}`,
          text: `Je suis ${code} — découvre ton type sur urcecret.site`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `urcecret-${code.toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch {
      window.open(src, '_blank');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ur-panel-ink p-4">
      <p className="ur-label text-[10px] mb-3 text-center" style={{ color: 'var(--gold)' }}>Ta carte à partager</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Carte de personnalité ${code}`}
        className="w-full rounded-xl mb-4"
        style={{ border: '1px solid var(--line-ink)' }}
      />
      <button onClick={handleShare} disabled={busy} className="ur-btn-gold w-full py-3.5 text-sm disabled:opacity-60">
        {busy ? '…' : '📸 Enregistrer / Partager ma carte'}
      </button>
    </div>
  );
}
