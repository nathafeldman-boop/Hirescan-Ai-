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

// Dark side theme — only activated for premium users
const DARK = {
  bg: '#0a0705',
  card: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.06)',
  headerBg: 'rgba(10,7,5,0.88)',
  text: '#f5f0e8',
  muted: '#8a7d6e',
  accent: '#e8a94d', // ember gold
  accentBg: 'rgba(232,169,77,0.1)',
  accentBorder: 'rgba(232,169,77,0.2)',
};

// Light side — free users get the warm/cream world
const LIGHT = {
  bg: '#f7f3ec',
  card: '#ffffff',
  cardBorder: '#e8e0d4',
  headerBg: 'rgba(247,243,236,0.9)',
  text: '#2b2622',
  muted: '#8c7b6b',
  accent: '#c2611f', // clay
  accentBg: 'rgba(194,97,31,0.08)',
  accentBorder: 'rgba(194,97,31,0.2)',
};

export default function DashboardClient({ user }: Props) {
  const isPremium = user.tier === 'premium' || user.tier === 'pro';
  const theme = isPremium ? DARK : LIGHT;
  const type = user.mbtiType ? mbtiTypes[user.mbtiType] : null;
  const firstName = user.name?.split(' ')[0] ?? 'toi';

  return (
    <main className="min-h-screen" style={{ background: theme.bg }}>

      {/* Premium atmosphere — ember glow particles */}
      {isPremium && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-[0.06]" style={{ background: '#e8a94d' }} />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full blur-3xl opacity-[0.04]" style={{ background: '#c2611f' }} />
        </div>
      )}

      {/* Top nav */}
      <header className="relative z-10 sticky top-0" style={{ background: theme.headerBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${theme.cardBorder}` }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-black" style={{ color: theme.text }}>
            Ur<span style={{ color: theme.accent }}>Cecret</span>
          </Link>
          <div className="flex items-center gap-3">
            {user.image
              ? <img src={user.image} alt="" className="w-8 h-8 rounded-full" style={{ border: `1px solid ${theme.cardBorder}` }} /> // eslint-disable-line @next/next/no-img-element
              : <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: theme.accent, color: isPremium ? '#0a0705' : '#fff' }}>{firstName[0]?.toUpperCase()}</div>
            }
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs transition-colors" style={{ color: theme.muted }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            {isPremium ? (
              <>
                <h1 className="font-display text-xl font-black" style={{ color: theme.text }}>
                  Bienvenue dans les profondeurs, <span style={{ color: theme.accent }}>{firstName}</span>
                </h1>
                <p className="text-sm mt-0.5" style={{ color: theme.muted }}>Ton côté obscur t&apos;attend</p>
              </>
            ) : (
              <>
                <h1 className="font-display text-xl font-black" style={{ color: theme.text }}>Bonjour {firstName}</h1>
                <p className="text-sm mt-0.5" style={{ color: theme.muted }}>{user.email}</p>
              </>
            )}
          </div>
          {isPremium
            ? <span className="text-xs font-black px-3 py-1.5 rounded-full" style={{ color: DARK.accent, background: DARK.accentBg, border: `1px solid ${DARK.accentBorder}` }}>🌑 Sombre</span>
            : <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ color: theme.muted, background: isPremium ? 'transparent' : '#ece2d4', border: `1px solid ${theme.cardBorder}` }}>Gratuit</span>
          }
        </div>

        {/* MBTI type card */}
        {type ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: theme.card, border: `1px solid ${theme.cardBorder}` }}
          >
            <div className="h-1 w-full" style={{ background: isPremium ? `linear-gradient(to right,${DARK.accent},#c2611f)` : `linear-gradient(to right,${type.accentColor},#d17d52)` }} />
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: theme.muted }}>Ton type de personnalité</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl leading-none">{type.emoji}</div>
                <div>
                  <p className="font-display text-2xl font-black leading-tight" style={{ color: theme.text }}>{user.mbtiType}</p>
                  <p className="text-sm font-bold" style={{ color: theme.muted }}>{type.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: type.accentColor }}>{type.rarity} de la population</p>
                </div>
              </div>
              <p className="text-sm italic mb-5 leading-relaxed" style={{ color: theme.muted }}>&ldquo;{type.tagline}&rdquo;</p>
              <Link
                href={`/types/${user.mbtiType!.toLowerCase()}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.01]"
                style={{
                  background: isPremium ? `linear-gradient(135deg,#2a1f0a,#3d2c0d)` : `linear-gradient(135deg,${type.accentColor},#d17d52)`,
                  color: isPremium ? DARK.accent : '#fff',
                  border: isPremium ? `1px solid ${DARK.accentBorder}` : 'none',
                  boxShadow: isPremium ? `0 4px 20px rgba(232,169,77,0.15)` : `0 4px 20px ${type.accentColor}30`,
                }}
              >
                {isPremium ? 'Explorer les profondeurs →' : 'Voir mon profil complet →'}
              </Link>
              {user.mbtiTestCount > 0 && (
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs" style={{ color: theme.muted }}>Test passé {user.mbtiTestCount} fois</p>
                  <Link href="/quiz/personnalite" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.muted }}>
                    Repasser le test →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: theme.accentBg, border: `2px dashed ${theme.accentBorder}` }}
          >
            <div className="text-4xl mb-3">🧠</div>
            <p className="font-display text-base font-black mb-1" style={{ color: theme.text }}>Découvre ton type MBTI</p>
            <p className="text-sm mb-5" style={{ color: theme.muted }}>100 questions · environ 12 minutes</p>
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
            style={{ background: theme.card, border: `1px solid ${theme.cardBorder}` }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">💑</span>
              {!isPremium && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: theme.accentBg, color: theme.accent }}>Pro</span>
              )}
            </div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>Compatibilité</p>
            <p className="text-xs mt-0.5 leading-snug" style={{ color: theme.muted }}>Compare avec quelqu&apos;un</p>
          </Link>

          <Link
            href="/types"
            className="rounded-2xl p-4 transition-all hover:scale-[1.02]"
            style={{ background: theme.card, border: `1px solid ${theme.cardBorder}` }}
          >
            <div className="mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>Les 16 types</p>
            <p className="text-xs mt-0.5 leading-snug" style={{ color: theme.muted }}>Explorer tous les profils</p>
          </Link>
        </div>

        {/* Upgrade banner — free only */}
        {!isPremium && (
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg,rgba(169,78,24,0.08),rgba(209,125,82,0.05))`, border: `1px solid rgba(194,97,31,0.2)` }}
          >
            <div className="text-2xl flex-shrink-0">🌑</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black" style={{ color: theme.text }}>Découvre ton côté sombre</p>
              <p className="text-xs mt-0.5" style={{ color: theme.muted }}>Profil complet · Compatibilité · 15 tests</p>
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

        {/* Premium dark mode extra card — quizzes */}
        {isPremium && (
          <Link
            href="/quizzes"
            className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg,rgba(232,169,77,0.06),rgba(194,97,31,0.04))', border: `1px solid ${DARK.accentBorder}` }}
          >
            <div className="text-2xl flex-shrink-0">🃏</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black" style={{ color: DARK.text }}>15 tests secrets débloqués</p>
              <p className="text-xs mt-0.5" style={{ color: DARK.muted }}>Manipulation · Couple · Amitié · et plus</p>
            </div>
            <span style={{ color: DARK.accent }} className="text-sm">→</span>
          </Link>
        )}

      </div>
    </main>
  );
}
