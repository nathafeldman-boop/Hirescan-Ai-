'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const RIZZ_LEVELS = [
  { min: 0,   max: 200,  label: 'Rookie',      emoji: '🌱', color: '#6b7280' },
  { min: 200, max: 500,  label: 'Apprenti',    emoji: '✨', color: '#3b82f6' },
  { min: 500, max: 1000, label: 'Charmeur',    emoji: '🔥', color: '#8b5cf6' },
  { min: 1000,max: 2000, label: 'Séducteur',   emoji: '💜', color: '#ec4899' },
  { min: 2000,max: 9999, label: 'Rizz Master', emoji: '👑', color: '#f59e0b' },
];

function getRizzLevel(score: number) {
  return RIZZ_LEVELS.find((l) => score >= l.min && score < l.max) ?? RIZZ_LEVELS[0];
}

interface Props {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    rizzScore: number;
    rizzLevel: number;
    tier: string;
  };
  recentQuizzes: { id: string; quizSlug: string; score: number; createdAt: Date }[];
  recentAnalyses: { id: string; context: string; rizzScoreAfter: number; createdAt: string }[];
}

export default function DashboardClient({ user, recentQuizzes, recentAnalyses }: Props) {
  const level = getRizzLevel(user.rizzScore);
  const nextLevel = RIZZ_LEVELS[RIZZ_LEVELS.indexOf(level) + 1];
  const progress = nextLevel
    ? ((user.rizzScore - level.min) / (nextLevel.min - level.min)) * 100
    : 100;

  const ACTIONS = [
    {
      href: '/quiz/personnalite',
      emoji: '🧠',
      label: 'Test de personnalité',
      desc: 'Découvre ton type MBTI en 5 min',
      color: '#8b5cf6',
      badge: 'Gratuit',
    },
    {
      href: '/types',
      emoji: '🔍',
      label: 'Les 16 types',
      desc: 'Explore tous les profils',
      color: '#ec4899',
      badge: null,
    },
    {
      href: '/onboarding',
      emoji: '❓',
      label: 'Questionnaires',
      desc: 'Explore tes vérités cachées',
      color: '#06b6d4',
      badge: null,
    },
    {
      href: '#',
      emoji: '📸',
      label: 'Analyse photo',
      desc: 'Bientôt disponible',
      color: '#10b981',
      badge: 'Bientôt',
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090b]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>
            <span className="text-white">Cecret</span>
          </h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="w-8 h-8 rounded-full border border-white/20" />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Rizz Score Card */}
        <div className="glass rounded-2xl p-6 mb-6 border border-white/8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-zinc-500 text-sm">Bonjour {user.name?.split(' ')[0] ?? 'toi'} 👋</p>
              <h2 className="text-white font-black text-xl mt-0.5">Ton Rizz Score</h2>
            </div>
            <div className="text-right">
              <div
                className="text-4xl font-black tabular-nums"
                style={{ color: level.color }}
              >
                {user.rizzScore.toLocaleString('fr-FR')}
              </div>
              <div className="text-sm font-semibold" style={{ color: level.color }}>
                {level.emoji} {level.label}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {nextLevel && (
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                <span>{level.label}</span>
                <span>{nextLevel.label} — {nextLevel.min - user.rizzScore} pts</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, backgroundColor: level.color }}
                />
              </div>
            </div>
          )}

          {/* Tier badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={
                user.tier === 'premium'
                  ? { color: '#f59e0b', borderColor: '#f59e0b40', backgroundColor: '#f59e0b10' }
                  : user.tier === 'pro'
                  ? { color: '#8b5cf6', borderColor: '#8b5cf640', backgroundColor: '#8b5cf610' }
                  : { color: '#6b7280', borderColor: '#6b728040', backgroundColor: '#6b728010' }
              }
            >
              {user.tier === 'premium' ? '👑 Premium' : user.tier === 'pro' ? '💜 Pro' : '🆓 Free'}
            </span>
            {user.tier === 'free' && (
              <Link
                href="/pricing"
                className="text-xs font-semibold px-3 py-1 rounded-full transition-all"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff' }}
              >
                Passer Premium →
              </Link>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.badge === 'Bientôt' ? '#' : action.href}
              className={`glass rounded-2xl p-4 border border-white/8 transition-all hover:border-white/20 ${action.badge === 'Bientôt' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{action.emoji}</span>
                {action.badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={
                      action.badge === 'Bientôt'
                        ? { color: '#6b7280', backgroundColor: '#6b728020' }
                        : { color: action.color, backgroundColor: action.color + '20' }
                    }
                  >
                    {action.badge}
                  </span>
                )}
              </div>
              <p className="text-white font-bold text-sm leading-tight">{action.label}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        {(recentQuizzes.length > 0 || recentAnalyses.length > 0) && (
          <div className="glass rounded-2xl p-5 border border-white/8">
            <h3 className="text-white font-bold text-sm mb-4">Activité récente</h3>
            <div className="space-y-2">
              {recentAnalyses.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📸</span>
                    <div>
                      <p className="text-zinc-300 text-sm truncate max-w-[180px]">{a.context}</p>
                      <p className="text-zinc-600 text-xs">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#8b5cf6' }}>
                    +{a.rizzScoreAfter} pts
                  </span>
                </div>
              ))}
              {recentQuizzes.map((q) => (
                <div key={q.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">❓</span>
                    <div>
                      <p className="text-zinc-300 text-sm capitalize">{q.quizSlug.replace('-', ' ')}</p>
                      <p className="text-zinc-600 text-xs">{new Date(q.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-pink-400">{q.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
