'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const QUIZZES = [
  { slug: 'infidelite',  emoji: '💔', label: 'Infidélité',       desc: 'Il/elle te trompe vraiment ?',         color: '#f43f5e' },
  { slug: 'adopte',      emoji: '👶', label: 'Adopté(e) ?',      desc: 'Tu es vraiment de cette famille ?',    color: '#8b5cf6' },
  { slug: 'amoureux',    emoji: '💘', label: 'Amoureux/se',       desc: 'C\'est de l\'amour ou pas ?',          color: '#ec4899' },
  { slug: 'vrais-amis',  emoji: '🤝', label: 'Vrais amis',        desc: 'Ils sont vraiment là pour toi ?',      color: '#06b6d4' },
  { slug: 'orientation', emoji: '🌈', label: 'Orientation',       desc: 'Tu te connais vraiment ?',             color: '#10b981' },
];

const STATS = [
  { value: '50K+',  label: 'Révélations' },
  { value: '4.9★',  label: 'Satisfaction' },
  { value: '100%',  label: 'Anonyme' },
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

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', animation: 'orb1 8s ease-in-out infinite alternate' }} />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', animation: 'orb2 10s ease-in-out infinite alternate' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.10) 0%, transparent 70%)', animation: 'orb1 12s ease-in-out infinite alternate-reverse' }} />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>
            <span className="text-white">Secret</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-zinc-400 hover:text-white text-sm transition-colors px-3 py-1.5">
              Connexion
            </Link>
            <Link href="/onboarding"
              className="text-sm font-bold px-4 py-2 rounded-full transition-all"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
              Commencer →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-36 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/8 text-violet-300 text-xs font-semibold mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            100% Anonyme · IA intégrée · Gratuit
          </div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight leading-none mb-6">
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Discover
            </span>
            <br />
            <span className="text-white">your truth.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Des questionnaires brutalement honnêtes sur l&apos;amour, les amis, la famille et toi-même.
            L&apos;IA analyse tes vraies réponses — sans filtre.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #8b5cf6cc, #ec4899cc)', boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}>
              Découvre tes vérités →
            </Link>
            <Link href="/quiz/infidelite"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all">
              Essayer un quiz
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-14">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
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
            {QUIZZES.map((q, i) => (
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
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${q.color}18 0%, transparent 60%)` }} />

                <div className="relative z-10">
                  <div className="text-4xl mb-4">{q.emoji}</div>
                  <h3 className="text-white font-black text-lg mb-1">{q.label}</h3>
                  <p className="text-zinc-500 text-sm">{q.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                    style={{ color: hovered === q.slug ? q.color : '#52525b' }}>
                    Commencer
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}

            {/* Screenshot analyzer card */}
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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.12) 0%, transparent 60%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-4xl">📸</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.15)' }}>IA</span>
                </div>
                <h3 className="text-white font-black text-lg mb-1">Rizz Analyzer</h3>
                <p className="text-zinc-500 text-sm">Uploade une conv et obtiens 5 réponses parfaites</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                  style={{ color: hovered === 'analyze' ? '#8b5cf6' : '#52525b' }}>
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

      {/* Features strip */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Zéro données',     desc: 'Aucun compte requis. Tes réponses ne sont jamais stockées ni partagées.',    color: '#8b5cf6' },
              { icon: '🧠', title: 'IA sans filtre',   desc: 'Claude analyse tes réponses avec une précision clinique. Pas de complaisance.', color: '#ec4899' },
              { icon: '⚡', title: 'Résultat en 3 min', desc: '30 questions ciblées, un score précis, un message qui te parle vraiment.',      color: '#f59e0b' },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 border border-white/8">
                <div className="text-3xl mb-4">{f.icon}</div>
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
              { text: '"Le quiz infidélité m\'a ouvert les yeux sur des choses que je refusais de voir. Brutal mais nécessaire."', name: 'Léa, 24 ans', score: 'Score : 72/100 🚩' },
              { text: '"J\'avais des doutes depuis des années sur mon adoption. Ce quiz a mis des mots sur tout ce que je ressentais."', name: 'Thomas, 19 ans', score: 'Score : 68/100 😶' },
              { text: '"Le Rizz Analyzer m\'a donné des réponses que je n\'aurais jamais trouvées seule. J\'ai enfin répondu à ce message."', name: 'Camille, 22 ans', score: '+84 pts Rizz ⚡' },
            ].map((t, i) => (
              <div key={i} className="glass rounded-2xl p-5 border border-white/8">
                <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic">{t.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs font-medium">{t.name}</span>
                  <span className="text-xs font-bold" style={{ color: '#8b5cf6' }}>{t.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-10 border border-white/8 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-3xl font-black text-white mb-3">Prêt(e) pour la vérité ?</h2>
              <p className="text-zinc-400 mb-8 text-base">2 minutes. 30 questions. Une réponse définitive.</p>
              <Link href="/onboarding"
                className="inline-block px-10 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 8px 40px rgba(139,92,246,0.5)' }}>
                Commencer maintenant — c&apos;est gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-black">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Ur</span>
            <span className="text-zinc-500">Secret</span>
          </span>
          <p className="text-zinc-600 text-xs">© 2025 · 100% anonyme · Aucune donnée stockée</p>
        </div>
      </footer>

      <style>{`
        @keyframes orb1 {
          from { transform: translate(0, 0) scale(1); opacity: 0.6; }
          to   { transform: translate(40px, 30px) scale(1.1); opacity: 1; }
        }
        @keyframes orb2 {
          from { transform: translate(0, 0) scale(1); opacity: 0.5; }
          to   { transform: translate(-30px, 40px) scale(1.08); opacity: 0.9; }
        }
      `}</style>
    </main>
  );
}
