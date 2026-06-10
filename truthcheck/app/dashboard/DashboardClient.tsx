'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { mbtiTypes } from '@/lib/mbti';

interface Props {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    tier: string;
    mbtiType: string | null;
    mbtiTestCount: number;
    memberSince: string;
  };
}

export default function DashboardClient({ user }: Props) {
  const isPremium = user.tier === 'premium' || user.tier === 'pro';
  const type = user.mbtiType ? mbtiTypes[user.mbtiType] : null;
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

        {/* User info + stats */}
        <div className="bg-white rounded-2xl p-6 mb-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Membre depuis {memberYear}</p>
              <h2 className="text-gray-900 font-black text-xl">
                Bonjour {user.name?.split(' ')[0] ?? 'toi'} 👋
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <div className="text-right">
              {isPremium ? (
                <span className="text-xs font-black px-3 py-1.5 rounded-full border"
                  style={{ color: '#7c3aed', borderColor: '#7c3aed40', backgroundColor: '#7c3aed10' }}>
                  👑 Pro
                </span>
              ) : (
                <Link href="/pricing"
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff' }}>
                  Passer Pro →
                </Link>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">{user.mbtiTestCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">test{user.mbtiTestCount > 1 ? 's' : ''} passé{user.mbtiTestCount > 1 ? 's' : ''}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: isPremium ? '#7c3aed' : '#9ca3af' }}>
                {isPremium ? '∞' : '0'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">analyses débloquées</p>
            </div>
          </div>
        </div>

        {/* MBTI type card */}
        {type ? (
          <div className="rounded-2xl border-2 p-5 mb-5"
            style={{ borderColor: type.accentColor + '40', background: type.accentColor + '06' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Ton type MBTI</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{type.emoji}</div>
              <div className="flex-1">
                <p className="text-xl font-black text-gray-900">{user.mbtiType} — {type.name}</p>
                <p className="text-xs text-gray-500 italic mt-0.5">{type.tagline}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: type.accentColor }}>
                  {type.rarity} de la population
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Link href={`/types/${user.mbtiType!.toLowerCase()}`}
                className="flex-1 text-center py-2.5 rounded-xl font-bold text-white text-sm"
                style={{ background: `linear-gradient(135deg,${type.accentColor},#ec4899)` }}>
                Voir mon profil →
              </Link>
              <Link href="/quiz/personnalite"
                className="px-4 py-2.5 rounded-xl font-semibold text-gray-600 text-sm border border-gray-200 hover:bg-gray-50 transition-all">
                Repasser
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 mb-5 text-center">
            <div className="text-3xl mb-3">🧠</div>
            <p className="text-gray-900 font-black text-base mb-1">Découvre ton type MBTI</p>
            <p className="text-gray-500 text-sm mb-4">100 questions · ~12 minutes · gratuit</p>
            <Link href="/quiz/personnalite"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }}>
              Passer le test →
            </Link>
          </div>
        )}

        {/* Compatibilité duo */}
        {isPremium ? (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 mb-5 flex items-center gap-4">
            <div className="text-3xl">💑</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900">Compatibilité MBTI</p>
              <p className="text-xs text-gray-500 mt-0.5">Compare ta personnalité avec quelqu&apos;un</p>
            </div>
            <Link href="/duo"
              className="px-4 py-2.5 rounded-xl font-bold text-white text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              Tester →
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 mb-5 flex items-center gap-4">
            <div className="text-3xl">💑</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-black text-gray-900">Compatibilité MBTI</p>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">Pro</span>
              </div>
              <p className="text-xs text-gray-400">Compare ta personnalité avec quelqu&apos;un</p>
            </div>
            <Link href="/pricing"
              className="px-4 py-2.5 rounded-xl font-semibold text-violet-700 text-sm flex-shrink-0 border border-violet-200 hover:bg-violet-50 transition-all">
              Débloquer
            </Link>
          </div>
        )}

        {/* 16 types explorer */}
        <Link href="/types"
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all">
          <div className="text-3xl">🔍</div>
          <div>
            <p className="text-sm font-black text-gray-900">Explorer les 16 types</p>
            <p className="text-xs text-gray-500 mt-0.5">Profils complets, amour, carrière, compatibilités</p>
          </div>
          <span className="ml-auto text-gray-300 text-lg">→</span>
        </Link>

      </div>
    </main>
  );
}
