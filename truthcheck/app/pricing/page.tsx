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
  'Tu comprends enfin pourquoi tu réagis comme ça — en amour, en conflit, sous pression',
  'Tu découvres tes vrais points forts (et ce qui te bloque sans que tu le saches)',
  'Tu sors du doute sur tes relations les plus importantes',
  'Tu te connais mieux en 10 minutes que certains en 10 ans',
  'Accès à tous les futurs quiz dès leur sortie',
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
        style={{ background: '#111827', color: '#fff' }}
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
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-gray-900">Cecret</span>
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
          <h1 className="text-2xl font-black text-gray-900">Connais-toi vraiment</h1>
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

        {/* Plan Premium — recommandé */}
        <div className="relative rounded-xl border-2 border-gray-900 p-5 mb-2 bg-white">

          {/* Badge recommandé */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-900 text-white">
              Recommandé
            </span>
          </div>

          <div className="flex items-center justify-between mb-4 mt-1">
            <div>
              <p className="text-gray-900 font-black text-lg">Accès complet</p>
              <p className="text-gray-500 text-sm">Clarté mentale · relations · confiance en soi</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-gray-900">9,99 €</span>
              <p className="text-gray-500 text-sm">/mois</p>
            </div>
          </div>

          <ul className="space-y-2.5 mb-6">
            {PREMIUM_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="text-gray-900 font-bold flex-shrink-0 mt-px">✓</span>
                {p}
              </li>
            ))}
          </ul>

          <CheckoutButton
            label="Obtenir l'accès complet"
            annual={false}
            userEmail={userEmail}
            highlighted
          />
        </div>

        {/* Option annuelle */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-bold">Annuel</p>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                  −75%
                </span>
              </div>
              <p className="text-gray-500 text-sm">Soit 2,50 € / mois</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gray-900">29,99 €</span>
              <p className="text-gray-400 text-xs">/an</p>
            </div>
          </div>
          <CheckoutButton
            label="Choisir l'annuel — 29,99 €"
            annual={true}
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
