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
  const firstName = user.name?.split(' ')[0] ?? 'toi';

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-gray-900">Cecret</span>
          </Link>
          <div className="flex items-center gap-2">
            {user.image
              ? <img src={user.image} alt="" className="w-8 h-8 rounded-full border border-gray-200" /> // eslint-disable-line @next/next/no-img-element
              : <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-bold">{firstName[0]?.toUpperCase()}</div>
            }
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs text-gray-400 hover:text-gray-700 transition-colors ml-1">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Greeting + tier */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">Bonjour {firstName} 👋</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          {isPremium
            ? <span className="text-xs font-black px-3 py-1.5 rounded-full" style={{ color: '#7c3aed', backgroundColor: '#7c3aed12', border: '1px solid #7c3aed30' }}>👑 Pro</span>
            : <span className="text-xs font-semibold px-3 py-1.5 rounded-full text-gray-500 bg-gray-100">Gratuit</span>
          }
        </div>

        {/* MBTI type — main card */}
        {type ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Color band */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right,${type.accentColor},#ec4899)` }} />
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Ton type de personnalité</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl leading-none">{type.emoji}</div>
                <div>
                  <p className="text-2xl font-black text-gray-900 leading-tight">{user.mbtiType}</p>
                  <p className="text-sm font-bold text-gray-500">{type.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: type.accentColor }}>{type.rarity} de la population</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic mb-5 leading-relaxed">&ldquo;{type.tagline}&rdquo;</p>
              <Link
                href={`/types/${user.mbtiType!.toLowerCase()}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: `linear-gradient(135deg,${type.accentColor},#ec4899)` }}>
                Voir mon profil complet →
              </Link>
              {user.mbtiTestCount > 0 && (
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">Test passé {user.mbtiTestCount} fois</p>
                  <Link href="/quiz/personnalite" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    Repasser le test →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
            <div className="text-4xl mb-3">🧠</div>
            <p className="text-base font-black text-gray-900 mb-1">Découvre ton type MBTI</p>
            <p className="text-sm text-gray-400 mb-5">100 questions · environ 12 minutes</p>
            <Link href="/quiz/personnalite"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 20px rgba(124,58,237,0.25)' }}>
              Passer le test →
            </Link>
          </div>
        )}

        {/* Feature row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Duo */}
          <Link
            href={isPremium ? '/duo' : '/pricing'}
            className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm hover:border-gray-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">💑</span>
              {!isPremium && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600">Pro</span>
              )}
            </div>
            <p className="text-sm font-bold text-gray-900">Compatibilité</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">Compare avec quelqu&apos;un</p>
          </Link>

          {/* 16 types */}
          <Link href="/types"
            className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm hover:border-gray-300 transition-all">
            <div className="mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-sm font-bold text-gray-900">Les 16 types</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">Explorer tous les profils</p>
          </Link>
        </div>

        {/* Upgrade banner — free only */}
        {!isPremium && (
          <div className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg,#7c3aed12,#ec489912)', border: '1px solid #7c3aed20' }}>
            <div className="text-2xl flex-shrink-0">💎</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900">Passer Pro</p>
              <p className="text-xs text-gray-500 mt-0.5">Type révélé · Compatibilité duo · Profils complets</p>
            </div>
            <Link href="/pricing"
              className="px-4 py-2 rounded-xl font-bold text-white text-xs flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              Voir →
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
