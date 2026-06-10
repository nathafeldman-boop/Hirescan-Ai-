'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface Props {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    tier: string;
    memberSince: string;
  };
}

const ACTIONS = [
  {
    href: '/quiz/personnalite',
    emoji: '🧠',
    label: 'Test MBTI',
    desc: 'Découvre ton type de personnalité',
    color: '#8b5cf6',
    badge: null,
    pro: false,
  },
  {
    href: '/types',
    emoji: '🔍',
    label: 'Les 16 types',
    desc: 'Explore tous les profils MBTI',
    color: '#ec4899',
    badge: null,
    pro: false,
  },
  {
    href: '/duo',
    emoji: '💑',
    label: 'Compatibilité',
    desc: 'Compare vos personnalités',
    color: '#7c3aed',
    badge: 'Pro',
    pro: true,
  },
  {
    href: '/pricing',
    emoji: '💎',
    label: 'Passer Pro',
    desc: 'Débloquer toutes les fonctionnalités',
    color: '#f59e0b',
    badge: null,
    pro: false,
    hideIfPremium: true,
  },
];

export default function DashboardClient({ user }: Props) {
  const isPremium = user.tier === 'premium' || user.tier === 'pro';
  const visibleActions = ACTIONS.filter(a => !(a.hideIfPremium && isPremium));

  const memberYear = new Date(user.memberSince).getFullYear();

  return (
    <main className="min-h-screen bg-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-gray-900">Cecret</span>
          </Link>
          <div className="flex items-center gap-3">
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-gray-400 hover:text-gray-900 text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Welcome card */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Membre depuis {memberYear}</p>
              <h2 className="text-gray-900 font-black text-xl">
                Bonjour {user.name?.split(' ')[0] ?? 'toi'} 👋
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
            </div>

            {/* Tier badge */}
            <div className="text-right">
              {isPremium ? (
                <div className="inline-flex flex-col items-end gap-1">
                  <span
                    className="text-xs font-black px-3 py-1.5 rounded-full border"
                    style={{ color: '#7c3aed', borderColor: '#7c3aed40', backgroundColor: '#7c3aed10' }}
                  >
                    👑 Pro
                  </span>
                  <p className="text-[10px] text-gray-400">Accès illimité</p>
                </div>
              ) : (
                <div className="inline-flex flex-col items-end gap-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ color: '#6b7280', borderColor: '#6b728040', backgroundColor: '#6b728010' }}
                  >
                    🆓 Gratuit
                  </span>
                  <Link
                    href="/pricing"
                    className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff' }}
                  >
                    Passer Pro →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Pro features teaser for free users */}
          {!isPremium && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Avec Pro tu débloque :</p>
              <div className="flex flex-wrap gap-1.5">
                {['Ton type MBTI', 'Compatibilité duo', '16 analyses complètes', 'Mode duo'].map(f => (
                  <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Accès rapide</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {visibleActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-2xl p-4 border border-gray-200 transition-all hover:border-gray-300 hover:shadow-sm group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{action.emoji}</span>
                {action.badge && (
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ color: action.color, backgroundColor: action.color + '15' }}
                  >
                    {action.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-900 font-bold text-sm leading-tight">{action.label}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-snug">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Premium: duo CTA */}
        {isPremium && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 flex items-center gap-4">
            <div className="text-3xl">💑</div>
            <div className="flex-1">
              <p className="text-sm font-black text-gray-900">Mode Duo activé</p>
              <p className="text-xs text-gray-500 mt-0.5">Compare ta personnalité avec quelqu&apos;un</p>
            </div>
            <Link href="/duo"
              className="px-4 py-2 rounded-xl font-bold text-white text-xs flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              Tester →
            </Link>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {[
            { href: '/quiz/personnalite', label: 'Test MBTI' },
            { href: '/types', label: '16 types' },
            { href: '/duo', label: 'Compatibilité' },
            { href: '/pricing', label: 'Tarifs' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
