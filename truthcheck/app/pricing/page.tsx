'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function CheckoutButton({ label, annual, userEmail }: { label: string; annual?: boolean; userEmail?: string | null }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annual: annual ?? false,
          userEmail: userEmail ?? undefined,
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Erreur lors du paiement');
        setLoading(false);
      }
    } catch {
      alert('Erreur réseau');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}
    >
      {loading ? 'Chargement…' : label}
    </button>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const PLANS = [
    {
      name: 'Mensuel',
      price: '€9,99',
      period: '/ mois',
      annual: false,
      badge: null,
      perks: [
        'Accès illimité aux tests',
        'Rapport complet de personnalité',
        'Analyses screenshot illimitées',
        'Mode Duo illimité',
        'Résultats détaillés IA',
      ],
    },
    {
      name: 'Annuel',
      price: '€29,99',
      period: '/ an',
      annual: true,
      badge: '−75%',
      perks: [
        'Tout le plan mensuel',
        'Économisez €89,89 par an',
        'Accès anticipé aux nouvelles fonctions',
        'Support prioritaire',
        'Sans engagement',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Secret</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-400 font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Passe à Pro — Accès illimité
        </div>

        <h1 className="text-3xl font-black mb-3">
          Débloquer tout{' '}
          <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            UrSecret
          </span>
        </h1>
        <p className="text-zinc-400 text-sm mb-12 max-w-sm mx-auto">
          Tests illimités, rapports complets, analyses IA. Sans engagement, annulable à tout moment.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-6 border text-left"
              style={
                plan.annual
                  ? { border: '1px solid rgba(139,92,246,0.5)', background: 'rgba(139,92,246,0.08)' }
                  : { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }
              }
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff' }}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-4">
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-violet-400">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                label={`Choisir ${plan.name}`}
                annual={plan.annual}
                userEmail={userEmail}
              />
            </div>
          ))}
        </div>

        <p className="text-zinc-600 text-xs">
          Paiement sécurisé par Stripe · Annulable à tout moment · Aucune surprise
        </p>

        <div className="mt-8">
          <Link href="/dashboard" className="text-zinc-500 hover:text-white text-sm transition-colors">
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
