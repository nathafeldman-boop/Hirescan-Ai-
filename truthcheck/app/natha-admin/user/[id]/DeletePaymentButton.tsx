'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Bouton discret pour annuler un paiement mal enregistré (mauvais montant,
// mauvais type, doublon créé par erreur via "Enregistrer un paiement
// manqué") — voir app/api/natha-admin/record-conversion/[id]/route.ts.
export default function DeletePaymentButton({ id, summary }: { id: string; summary: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer ce paiement ?\n${summary}\n\nCette action est définitive.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/natha-admin/record-conversion/${id}`, { method: 'DELETE' });
      if (res.ok) router.refresh();
      else alert('Échec de la suppression.');
    } catch {
      alert('Erreur réseau.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      title="Supprimer ce paiement"
      style={{
        border: 'none', background: 'none', cursor: 'pointer', padding: '2px 4px',
        color: '#d70015', fontSize: 13, lineHeight: 1, opacity: busy ? 0.4 : 0.6,
        flexShrink: 0,
      }}
    >
      ✕
    </button>
  );
}
