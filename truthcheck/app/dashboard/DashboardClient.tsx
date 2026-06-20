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
    <main className="min-h-screen bg-[#09090b]">

      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.08] bg-violet-600" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 rounded-full blur-3xl opacity-[0.06] bg-pink-600" />
      </div>

      {/* Top nav */}
      <header className="relative z-10 sticky top-0" style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black">
            <span style={{ background: 'linear-gradient(to right,#d17d52,#e0a380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Cecret</span>
          </Link>
          <div className="flex items-center gap-3">
            {user.image
              ? <img src={user.image} alt="" className="w-8 h-8 rounded-full border border-white/10" /> // eslint-disable-line @next/next/no-img-element
              : <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', color: '#fff' }}>{firstName[0]?.toUpperCase()}</div>
            }
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Greeting + tier */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Bonjour {firstName} 👋</h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
          {isPremium
            ? <span className="text-xs font-black px-3 py-1.5 rounded-full" style={{ color: '#d17d52', background: 'rgba(209,125,82,0.12)', border: '1px solid rgba(209,125,82,0.25)' }}>👑 Pro</span>
            : <span className="text-xs font-semibold px-3 py-1.5 rounded-full text-zinc-400" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>Gratuit</span>
          }
        </div>

        {/* MBTI type — main card */}
        {type ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Color band */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(to right,${type.accentColor},#d17d52)` }} />
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Ton type de personnalité</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl leading-none">{type.emoji}</div>
                <div>
                  <p className="text-2xl font-black text-white leading-tight">{user.mbtiType}</p>
                  <p className="text-sm font-bold text-zinc-400">{type.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: type.accentColor }}>{type.rarity} de la population</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 italic mb-5 leading-relaxed">&ldquo;{type.tagline}&rdquo;</p>
              <Link
                href={`/types/${user.mbtiType!.toLowerCase()}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.01]"
                style={{ background: `linear-gradient(135deg,${type.accentColor},#d17d52)`, boxShadow: `0 4px 20px ${type.accentColor}30` }}
              >
                Voir mon profil complet →
              </Link>
              {user.mbtiTestCount > 0 && (
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-zinc-600">Test passé {user.mbtiTestCount} fois</p>
                  <Link href="/quiz/personnalite" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                    Repasser le test →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(194,97,31,0.06)', border: '2px dashed rgba(194,97,31,0.25)' }}
          >
            <div className="text-4xl mb-3">🧠</div>
            <p className="text-base font-black text-white mb-1">Découvre ton type MBTI</p>
            <p className="text-sm text-zinc-500 mb-5">100 questions · environ 12 minutes</p>
            <Link
              href="/quiz/personnalite"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 20px rgba(169,78,24,0.3)' }}
            >
              Passer le test →
            </Link>
          </div>
        )}

        {/* Feature row */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={isPremium ? '/duo' : '/pricing'}
            className="rounded-2xl p-4 transition-all hover:scale-[1.02] group"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">💑</span>
              {!isPremium && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(209,125,82,0.15)', color: '#d17d52' }}>Pro</span>
              )}
            </div>
            <p className="text-sm font-bold text-white">Compatibilité</p>
            <p className="text-xs text-zinc-500 mt-0.5 leading-snug">Compare avec quelqu&apos;un</p>
          </Link>

          <Link
            href="/types"
            className="rounded-2xl p-4 transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-sm font-bold text-white">Les 16 types</p>
            <p className="text-xs text-zinc-500 mt-0.5 leading-snug">Explorer tous les profils</p>
          </Link>
        </div>

        {/* Upgrade banner — free only */}
        {!isPremium && (
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg,rgba(169,78,24,0.12),rgba(209,125,82,0.08))', border: '1px solid rgba(194,97,31,0.2)' }}
          >
            <div className="text-2xl flex-shrink-0">💎</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white">Passer Pro</p>
              <p className="text-xs text-zinc-400 mt-0.5">Type révélé · Compatibilité duo · Profils complets</p>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl font-bold text-white text-xs flex-shrink-0 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)' }}
            >
              Voir →
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
