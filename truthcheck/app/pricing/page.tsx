'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Seal from '@/components/Seal';

const FREE_PERKS = [
  'Ton type MBTI de base (les 4 lettres)',
  'Nova en version découverte — 5 messages par mois',
  'Quiz relationnels — résultats partiels',
];

const STARTER_PERKS = [
  'Ton profil MBTI complet : amour, carrière, face cachée',
  'Nova, ton coach IA perso — 5 messages par jour',
  'Résiliable en 1 clic, sans engagement',
];

const PLUS_PERKS = [
  'Ton profil MBTI complet + les 16 types en détail',
  '30 messages par jour avec l’assistant IA',
  'Les 15 quiz secrets débloqués',
];

const PREMIUM_PERKS = [
  'Ton profil MBTI complet + les 16 types en détail',
  '50 messages par jour avec l’assistant IA',
  'Les 15 quiz secrets débloqués (couple, amitié, manipulation…)',
  'Suivi personnalisé sur 15 jours',
  'Tous les futurs quiz inclus, à vie',
];

function CheckoutButton({ label, annual, plus, starter, userEmail, variant }: {
  label: string;
  annual?: boolean;
  plus?: boolean;
  starter?: boolean;
  userEmail?: string | null;
  variant: 'gold' | 'outline';
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
          plus: plus ?? false,
          starter: starter ?? false,
          userEmail: userEmail ?? undefined,
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert(data.error ?? 'Erreur lors du paiement'); setLoading(false); }
    } catch {
      alert('Erreur réseau'); setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${variant === 'gold' ? 'ur-btn-gold' : 'ur-btn-outline'} w-full py-3.5 text-sm disabled:opacity-60`}
    >
      {loading ? 'Chargement…' : label}
    </button>
  );
}

// Bloc prix uniforme — même taille partout, jamais coupé à la ligne.
function Price({ amount, unit }: { amount: string; unit: string }) {
  return (
    <div className="text-right flex-shrink-0 whitespace-nowrap">
      <div className="font-display text-2xl font-black text-white leading-none">{amount}</div>
      <div className="text-[11px] text-stone-500 mt-1">{unit}</div>
    </div>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const tier = (session?.user as { tier?: string } | undefined)?.tier ?? 'free';
  const isPremium = tier === 'premium' || tier === 'plus';

  return (
    <main className="min-h-screen text-white" style={{ background: 'var(--ink)' }}>
      <header className="sticky top-0 z-20" style={{ background: 'rgba(21,18,31,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line-ink)' }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-black font-display">
            <span style={{ color: 'var(--gold)' }}>Ur</span><span className="text-white">Cecret</span>
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
          <div className="flex justify-center mb-4"><Seal size={48} /></div>
          <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Abonnements</p>
          <h1 className="font-display text-3xl font-black text-white">Connais-toi vraiment</h1>
        </div>

        {/* Plan gratuit */}
        <div className="ur-panel-ink p-5 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <p className="font-bold text-white">Gratuit</p>
              <p className="text-stone-500 text-sm">Pour découvrir</p>
            </div>
            <Price amount="0 €" unit="pour toujours" />
          </div>
          <ul className="space-y-2.5 mb-4">
            {FREE_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-stone-400">
                <span className="flex-shrink-0 mt-px" style={{ color: 'var(--gold)' }}>✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="w-full py-3 rounded-full text-center text-sm font-semibold text-stone-500" style={{ background: 'var(--ink)', border: '1px solid var(--line-ink)' }}>
            {isPremium ? 'Ancien plan' : 'Ton plan actuel'}
          </div>
        </div>

        {/* Plan Starter — 1,99€/mois : l'entrée MRR (profil + Nova) */}
        <div className="ur-panel-ink p-5 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <p className="font-bold text-white">Starter · mensuel</p>
              <p className="text-stone-500 text-sm">Ton profil + ton coach, prix d’un café</p>
            </div>
            <Price amount="1,99 €" unit="par mois" />
          </div>
          <ul className="space-y-2.5 mb-5">
            {STARTER_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-stone-300">
                <span className="flex-shrink-0 mt-px" style={{ color: 'var(--gold)' }}>✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <CheckoutButton label="Commencer — 1,99 €/mois" starter userEmail={userEmail} variant="outline" />
        </div>

        {/* Plan Plus — 5€/mois */}
        <div className="ur-panel-ink p-5 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <p className="font-bold text-white">Plus · mensuel</p>
              <p className="text-stone-500 text-sm">L’essentiel + le chatbot</p>
            </div>
            <Price amount="5 €" unit="par mois" />
          </div>
          <ul className="space-y-2.5 mb-5">
            {PLUS_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-stone-300">
                <span className="flex-shrink-0 mt-px" style={{ color: 'var(--gold)' }}>✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <CheckoutButton label="Choisir Plus — 5 €/mois" plus userEmail={userEmail} variant="outline" />
        </div>

        {/* Plan Annuel — vedette */}
        <div className="relative rounded-2xl p-5 mb-4" style={{ background: 'var(--ink-soft)', border: '1px solid var(--gold)' }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="ur-label text-[10px] px-3 py-1 rounded-full whitespace-nowrap" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
              La plus populaire
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mb-1 mt-1">
            <div className="min-w-0">
              <p className="font-black text-white">Accès illimité · 1 an</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>soit 0,08 €/jour</p>
            </div>
            <Price amount="29,99 €" unit="par an" />
          </div>

          <div className="mb-4">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold-line)' }}>
              −75% · 2,50 €/mois
            </span>
          </div>

          <ul className="space-y-2.5 mb-6">
            {PREMIUM_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-stone-300">
                <span className="flex-shrink-0 mt-px" style={{ color: 'var(--gold)' }}>✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <CheckoutButton label="Tout débloquer — 29,99 €/an" annual userEmail={userEmail} variant="gold" />
        </div>

        {/* Option mensuelle */}
        <div className="ur-panel-ink p-5 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <p className="font-bold text-white">Mensuel · sans engagement</p>
              <p className="text-stone-500 text-sm">Même accès · annule quand tu veux</p>
            </div>
            <Price amount="9,99 €" unit="par mois" />
          </div>
          <CheckoutButton label="Choisir le mensuel — 9,99 €" userEmail={userEmail} variant="outline" />
        </div>

        <p className="text-center text-stone-500 text-xs mb-6">
          Paiement sécurisé par Stripe · Annulable à tout moment · Aucune surprise
        </p>

        <div className="text-center">
          <Link href="/dashboard" className="text-stone-500 hover:text-white text-sm transition-colors">
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
