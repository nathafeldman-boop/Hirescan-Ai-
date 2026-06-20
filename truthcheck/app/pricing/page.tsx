'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const FREE_PERKS = [
  'Test MBTI — type de base uniquement',
  'Quiz relationnels (résultats partiels)',
  'Résultats sans détail cognitif',
];

const PREMIUM_PERKS = [
  'Ton profil MBTI complet + les 16 types en détail',
  'Les 15 quiz secrets débloqués (couple, amitié, manipulation…)',
  'Test de compatibilité duo en illimité',
  'Suivi personnalisé sur 15 jours',
  'Tous les futurs quiz inclus, à vie',
];

function CheckoutButton({ label, annual, userEmail, highlighted }: {
  label: string;
  annual?: boolean;
  userEmail?: string | null;
  highlighted?: boolean;
}) {
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

  if (highlighted) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-95 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: '#c2611f', color: '#fff', boxShadow: '0 4px 18px rgba(194,97,31,0.35)' }}
      >
        {loading ? 'Chargement…' : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 rounded-xl font-medium text-sm transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-60 border border-gray-200 text-gray-600"
    >
      {loading ? 'Chargement…' : label}
    </button>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black font-display">
            <span className="text-gray-900">Ur</span><span style={{ color: '#c2611f' }}>Cecret</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Titre */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">Tarifs</p>
          <h1 className="font-display text-3xl font-black text-gray-900">Connais-toi vraiment</h1>
        </div>

        {/* Plan gratuit — plan actuel */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-900 font-bold">Gratuit</p>
              <p className="text-gray-500 text-sm">Accès limité</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gray-900">0 €</span>
              <p className="text-gray-400 text-xs">pour toujours</p>
            </div>
          </div>
          <ul className="space-y-2 mb-4">
            {FREE_PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-gray-400">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <div className="w-full py-3 rounded-xl text-center text-sm font-semibold text-gray-500 bg-gray-100 border border-gray-200">
            {isPremium ? 'Ancien plan' : 'Plan actuel'}
          </div>
        </div>

        {/* Plan Annuel — vedette, meilleure valeur */}
        <div className="relative rounded-2xl p-5 mb-3 bg-white" style={{ border: '2px solid #c2611f' }}>

          {/* Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-xs font-black px-3 py-1 rounded-full text-white tracking-wide whitespace-nowrap" style={{ background: '#c2611f' }}>
              ⭐ LA PLUS POPULAIRE
            </span>
          </div>

          <div className="flex items-end justify-between mb-1 mt-1">
            <div>
              <p className="text-gray-900 font-black text-lg">Accès illimité · 1 an</p>
              <p className="text-sm font-semibold" style={{ color: '#c2611f' }}>
                soit 0,08 € / jour
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-gray-400 text-sm line-through">119,88 €</span>
              <span className="text-4xl font-black text-gray-900 leading-none">29,99 €</span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full mt-1 bg-green-100 text-green-700 border border-green-200">
                −75% · 2,50 €/mois
              </span>
            </div>
          </div>

          <ul className="space-y-2.5 mb-6 mt-4">
            {PREMIUM_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="font-bold flex-shrink-0 mt-px" style={{ color: '#7d9466' }}>✓</span>
                {p}
              </li>
            ))}
          </ul>

          <CheckoutButton
            label="Tout débloquer — 29,99 €/an"
            annual={true}
            userEmail={userEmail}
            highlighted
          />
        </div>

        {/* Option mensuelle — secondaire */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-900 font-bold">Mensuel · sans engagement</p>
              <p className="text-gray-500 text-sm">Même accès · annule quand tu veux</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gray-900">9,99 €</span>
              <p className="text-gray-400 text-xs">/mois</p>
            </div>
          </div>
          <CheckoutButton
            label="Choisir le mensuel — 9,99 €"
            annual={false}
            userEmail={userEmail}
          />
        </div>

        <p className="text-center text-gray-400 text-xs mb-6">
          Paiement sécurisé par Stripe · Annulable à tout moment · Aucune surprise
        </p>

        <div className="text-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
