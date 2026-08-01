'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  border: '#d2d2d7', text: '#1d1d1f', muted: '#6e6e73', primary: '#0071e3', good: '#1a9e46', critical: '#d70015',
};

// Les 4 offres réelles (voir lib/plans.ts) — pas la distinction technique
// 1er paiement / renouvellement (utile pour le MRR, pas pour rattraper une
// vente à la main : dans ce cas-là, c'est presque toujours un 1er paiement).
// Chaque offre porte son propre prix, auto-rempli au choix — l'erreur qui a
// motivé ce champ (une carte "Premium — 9,99€/mois" enregistrée à 1,99€)
// venait justement de la saisie manuelle et indépendante des deux champs.
const PRODUCT_TYPES = [
  { value: 'onetime', label: 'Résultat seul — 1,99€', priceEur: 1.99 },
  { value: 'starter', label: 'Starter — 1,99€/mois', priceEur: 1.99 },
  { value: 'plus', label: 'Plus — 5€/mois', priceEur: 5 },
  { value: 'monthly', label: 'Premium — 9,99€/mois', priceEur: 9.99 },
];

// Rattrape à la main un paiement réel jamais tracé (voir
// app/api/natha-admin/record-conversion/route.ts) — cas concret : le webhook
// Stripe n'était pas appelé, donc plusieurs ventes réelles n'avaient jamais
// créé de ligne Conversion. Formulaire volontairement discret (repliable) :
// ce n'est pas l'usage normal, seulement un filet de rattrapage ponctuel.
export default function RecordConversionForm({ email, defaultAffiliateSlug }: { email: string; defaultAffiliateSlug: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState('onetime');
  const [amountEur, setAmountEur] = useState(String(PRODUCT_TYPES[0].priceEur));
  const [affiliateSlug, setAffiliateSlug] = useState(defaultAffiliateSlug ?? '');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleProductTypeChange(value: string) {
    setProductType(value);
    const match = PRODUCT_TYPES.find((p) => p.value === value);
    if (match) setAmountEur(String(match.priceEur));
  }

  async function submit() {
    const amount = parseFloat(amountEur.replace(',', '.'));
    if (!amount || amount <= 0) {
      setResult({ ok: false, message: 'Montant invalide.' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/natha-admin/record-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amountEur: amount,
          productType,
          affiliateSlug: affiliateSlug || undefined,
          createdAt: date ? new Date(date + 'T12:00:00').toISOString() : undefined,
        }),
      });
      if (!res.ok) {
        setResult({ ok: false, message: 'Échec de l\'enregistrement.' });
        return;
      }
      const data = await res.json();
      setResult({ ok: true, message: data.affiliateCredited ? 'Paiement + commission affilié enregistrés.' : 'Paiement enregistré.' });
      router.refresh();
    } catch {
      setResult({ ok: false, message: 'Erreur réseau.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ fontSize: 12.5, color: C.muted, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
      >
        Enregistrer un paiement manqué
      </button>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: 10, padding: 14, borderRadius: 10, border: `1px dashed ${C.border}` }}>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 10px' }}>
        Rattrapage manuel — pour un paiement Stripe réel qui n&apos;a jamais créé de ligne Conversion.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <select
          value={productType} onChange={(e) => handleProductTypeChange(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13.5, background: '#fff' }}
        >
          {PRODUCT_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <input
          type="text" inputMode="decimal" placeholder="Montant en €" value={amountEur}
          onChange={(e) => setAmountEur(e.target.value)}
          title="Auto-rempli selon l'offre choisie — modifiable si besoin"
          style={{ width: 90, padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13.5 }}
        />
        <input
          type="date" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13.5 }}
        />
        <input
          type="text" placeholder="Slug affilié (optionnel)" value={affiliateSlug}
          onChange={(e) => setAffiliateSlug(e.target.value)}
          style={{ flex: 1, minWidth: 140, padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13.5 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={submit} disabled={submitting}
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.text, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button onClick={() => setOpen(false)} style={{ fontSize: 12.5, color: C.muted, background: 'none', border: 'none', cursor: 'pointer' }}>
          Annuler
        </button>
        {result && <span style={{ fontSize: 12.5, color: result.ok ? C.good : C.critical }}>{result.message}</span>}
      </div>
    </div>
  );
}
