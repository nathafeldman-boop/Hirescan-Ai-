'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import QuizIcon from './QuizIcon';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import UrCecretAnimatedBg from './UrCecretAnimatedBg';

const QUIZZES = [
  { slug: 'infidelite',  label: 'Il/elle te cache quelque chose ?',    desc: 'Les signaux que tu ignores peut-être',          color: '#f43f5e' },
  { slug: 'adopte',      label: 'Ta famille te dit tout sur toi ?',    desc: 'Les indices que personne n\'ose mentionner',     color: '#8b5cf6' },
  { slug: 'amoureux',    label: "C'est vraiment de l'amour ?",         desc: 'Amour vrai ou simple illusion',                 color: '#ec4899' },
  { slug: 'vrais-amis',  label: 'Seraient-ils là si ça allait mal ?', desc: 'Ce que les vrais amis font vraiment',           color: '#06b6d4' },
  { slug: 'orientation', label: 'Es-tu attiré(e) par le même sexe ?', desc: 'Explore ton attirance sans filtre',             color: '#10b981' },
];

const STATS = [
  { value: '50K+', label: 'Révélations' },
  { value: '4.9',  label: 'Satisfaction' },
  { value: '100%', label: 'Anonyme' },
];

function ChatIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LinkIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function HeartPulseIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <polyline points="7.5 12 10 9 13 15 15.5 12" strokeWidth="1.4" />
    </svg>
  );
}

function SearchPlusIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" strokeOpacity="0.5" />
      <line x1="11" y1="8" x2="11" y2="14" strokeOpacity="0.5" />
    </svg>
  );
}

const DUO_PREVIEWS = [
  { Icon: ChatIcon,       color: '#a78bfa', title: 'Communication', q: 'Parlez-vous vraiment le même langage ?' },
  { Icon: LinkIcon,       color: '#ec4899', title: 'Compatibilité',  q: 'Êtes-vous vraiment compatibles ?' },
  { Icon: HeartPulseIcon, color: '#f43f5e', title: 'Amour',          q: 'Qui de vous deux aime le plus fort ?' },
];

export default function LandingPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] overflow-x-hidden">

      {/* Rich animated background */}
      <UrCecretAnimatedBg />

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>
            <span className="text-white">Cecret</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block"><LanguageSwitcher /></span>
            <UserMenu />
            <Link
              href="/onboarding"
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                boxShadow: '0 2px 12px rgba(124,58,237,0.35)',
              }}
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-36 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/[0.08] text-violet-300 text-xs font-semibold mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            100% Anonyme · IA intégrée · Gratuit
          </div>

          <h1 className="text-6xl sm:text-7xl font-black tracking-tight leading-none mb-6">
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Discover
            </span>
            <br />
            <span className="text-white">your truth.</span>
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Des questionnaires brutalement honnêtes sur l&apos;amour, les amis, la famille et toi-même.
            L&apos;IA analyse tes vraies réponses — sans filtre.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/onboarding"
              className="px-7 py-3 rounded-xl font-bold text-[15px] text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                boxShadow: '0 4px 24px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.12) inset',
              }}
            >
              Commencer gratuitement →
            </Link>
            <Link
              href="/quiz"
              className="px-7 py-3 rounded-xl font-semibold text-[15px] text-zinc-300 hover:text-white transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Voir tous les quiz
            </Link>
            <Link href="/quiz/qi"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 transition-all hover:scale-105 active:scale-95">
              Test de QI →
            </Link>
          </div>

          <div className="flex items-center justify-center gap-10 mt-14">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz cards */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">5 vérités qui changent tout</h2>
            <p className="text-zinc-500">Choisis le sujet qui te brûle les lèvres</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUIZZES.map((q) => (
              <Link
                key={q.slug}
                href={`/quiz/${q.slug}`}
                onMouseEnter={() => setHovered(q.slug)}
                onMouseLeave={() => setHovered(null)}
                className="group relative rounded-2xl p-6 border transition-all duration-300 overflow-hidden cursor-pointer"
                style={{
                  background: hovered === q.slug ? `${q.color}0d` : 'rgba(255,255,255,0.03)',
                  borderColor: hovered === q.slug ? `${q.color}40` : 'rgba(255,255,255,0.08)',
                  transform: hovered === q.slug ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hovered === q.slug ? `0 20px 40px ${q.color}20` : 'none',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${q.color}18 0%, transparent 60%)` }}
                />
                <div className="relative z-10">
                  <div className="mb-4">
                    <QuizIcon slug={q.slug} size={40} color={q.color} />
                  </div>
                  <h3 className="text-white font-black text-lg mb-1">{q.label}</h3>
                  <p className="text-zinc-500 text-sm">{q.desc}</p>
                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                    style={{ color: hovered === q.slug ? q.color : '#52525b' }}
                  >
                    Commencer
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}

            {/* Rizz Analyzer */}
            <Link
              href="/analyze"
              onMouseEnter={() => setHovered('analyze')}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl p-6 border transition-all duration-300 overflow-hidden sm:col-span-2 lg:col-span-1"
              style={{
                background: hovered === 'analyze' ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.03)',
                borderColor: hovered === 'analyze' ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)',
                transform: hovered === 'analyze' ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === 'analyze' ? '0 20px 40px rgba(139,92,246,0.15)' : 'none',
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.12) 0%, transparent 60%)' }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{
                    width: 40, height: 40, borderRadius: '28%',
                    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.15)' }}>IA</span>
                </div>
                <h3 className="text-white font-black text-lg mb-1">Rizz Analyzer</h3>
                <p className="text-zinc-500 text-sm">Uploade une conv et obtiens 5 réponses parfaites</p>
                <div
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                  style={{ color: hovered === 'analyze' ? '#8b5cf6' : '#52525b' }}
                >
                  Analyser
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Mode Duo */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))', border: '1px solid rgba(139,92,246,0.22)' }}
          >
            <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                  <span className="text-pink-400 text-xs font-semibold uppercase tracking-widest">Nouveau · Mode Duo</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                  Tu penses vraiment<br />
                  <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    le/la connaître ?
                  </span>
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Chacun répond seul, sans voir les réponses de l&apos;autre.
                  L&apos;IA compare. Vous serez surpris par les divergences.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/duo"
                    className="px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 text-center"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}
                  >
                    Jouer en duo →
                  </Link>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent('Tu penses me connaître vraiment ?\n\nFais ce quiz et compare tes réponses avec les miennes — sans tricher\n\nhttps://urcecret.site/duo')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all active:scale-95"
                    style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.28)', color: '#25D366' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Défier sur WhatsApp
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                {DUO_PREVIEWS.map((item) => (
                  <Link
                    key={item.title}
                    href="/duo"
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all group"
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: `${item.color}15`, border: `1px solid ${item.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <item.Icon color={item.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold">{item.title}</p>
                      <p className="text-zinc-500 text-xs truncate">{item.q}</p>
                    </div>
                    <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                title: 'Zéro données',
                desc: 'Aucun compte requis. Tes réponses ne sont jamais stockées ni partagées.',
                color: '#8b5cf6',
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C7 2 4 5.5 4 9c0 2.4 1.2 4.5 3 5.7V17h10v-2.3C18.8 13.5 20 11.4 20 9c0-3.5-3-7-8-7z"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="9" y1="20" x2="15" y2="20"/></svg>,
                title: 'IA sans filtre',
                desc: 'Claude analyse tes réponses avec une précision clinique. Pas de complaisance.',
                color: '#ec4899',
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
                title: 'Résultat en 3 min',
                desc: '30 questions ciblées, un score précis, un message qui te parle vraiment.',
                color: '#f59e0b',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border border-white/[0.08]"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div
                  className="mb-4"
                  style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: `${f.color}12`, border: `1px solid ${f.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white">Ce qu&apos;ils ont découvert</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { text: '"Le quiz infidélité m\'a ouvert les yeux sur des choses que je refusais de voir. Brutal mais nécessaire."', name: 'Léa, 24 ans', score: 'Score 72/100', color: '#f43f5e' },
              { text: '"J\'avais des doutes depuis des années sur mon adoption. Ce quiz a mis des mots sur tout ce que je ressentais."', name: 'Thomas, 19 ans', score: 'Score 68/100', color: '#8b5cf6' },
              { text: '"Le Rizz Analyzer m\'a donné des réponses que je n\'aurais jamais trouvées seule. J\'ai enfin répondu à ce message."', name: 'Camille, 22 ans', score: '+84 pts Rizz', color: '#f59e0b' },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 border border-white/[0.08]"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic">{t.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs font-medium">{t.name}</span>
                  <span className="text-xs font-bold" style={{ color: t.color }}>{t.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="rounded-3xl p-10 border border-white/[0.08] relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.025)' }}
          >
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(124,58,237,0.2)',
                }}>
                  <SearchPlusIcon color="#a78bfa" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Prêt(e) pour la vérité ?</h2>
              <p className="text-zinc-400 mb-8 text-base">2 minutes. 30 questions. Une réponse définitive.</p>
              <Link
                href="/onboarding"
                className="inline-block px-8 py-3 rounded-xl font-bold text-[15px] text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                  boxShadow: '0 4px 28px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.12) inset',
                }}
              >
                Commencer →
              </Link>
              <p className="text-zinc-600 text-xs mt-4">Gratuit · Anonyme · Sans inscription requise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-black">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>
            <span className="text-zinc-500">Cecret</span>
          </span>
          <div className="flex items-center gap-6 text-zinc-600 text-xs">
            <Link href="/quiz" className="hover:text-zinc-400 transition-colors">Tous les quiz</Link>
            <Link href="/duo" className="hover:text-zinc-400 transition-colors">Mode duo</Link>
            <Link href="/partenaire" className="hover:text-zinc-400 transition-colors">Affiliation</Link>
            <Link href="/mentions-legales" className="hover:text-zinc-400 transition-colors">Légal</Link>
          </div>
          <p className="text-zinc-600 text-xs">© 2025 · 100% anonyme</p>
        </div>
      </footer>
    </main>
  );
}
