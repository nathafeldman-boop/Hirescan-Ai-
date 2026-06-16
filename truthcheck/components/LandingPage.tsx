'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';

/* ── In-app browser: bannière discrète, pas un mur plein écran ── */
const IN_APP_REGEX = /FBAN|FBAV|Instagram|TikTok|BytedanceWebview|MicroMessenger|Snapchat|musical_ly|trill|ZhiLiao/;

function InAppBanner({ onDismiss }: { onDismiss: () => void }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const [copied, setCopied] = useState(false);

  const tryOpen = () => {
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    if (isIOS) {
      window.location.href = `googlechrome://${url.replace(/^https?:\/\//, '')}`;
    } else {
      window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end;`;
    }
    setTimeout(async () => {
      try { await navigator.clipboard.writeText(url); setCopied(true); } catch {}
    }, 1200);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="max-w-lg mx-auto rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#1c1917,#27201a)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-2xl flex-shrink-0">🌐</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold leading-tight">Meilleure expérience hors TikTok</p>
          <p className="text-stone-400 text-xs mt-0.5">Le test fonctionne mieux dans Chrome / Safari</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={tryOpen}
            className="px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
            {copied ? '✅' : 'Ouvrir'}
          </button>
          <button onClick={onDismiss} className="px-2 py-2 text-stone-500 text-lg leading-none">×</button>
        </div>
      </div>
    </div>
  );
}

/* ── Compteur animé ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{val.toLocaleString('fr-FR')}{suffix}</>;
}

/* ── Types preview strip ── */
const TYPES_PREVIEW = [
  { code: 'ENFP', name: 'Le Champion', color: '#10b981', emoji: '🌟' },
  { code: 'INTJ', name: 'Le Stratège', color: '#7c3aed', emoji: '♟️' },
  { code: 'ISFJ', name: 'Le Protecteur', color: '#0ea5e9', emoji: '🛡️' },
  { code: 'ENTP', name: 'Le Visionnaire', color: '#f97316', emoji: '💡' },
  { code: 'INFJ', name: 'Le Prophète', color: '#ec4899', emoji: '🔮' },
  { code: 'ESTP', name: 'L\'Entrepreneur', color: '#f59e0b', emoji: '⚡' },
];

/* ── Témoignages ── */
const TEMOIGNAGES = [
  { text: 'Je me suis reconnue à 100%... c\'était presque flippant tellement c\'était précis 😳', name: 'Léa M.', type: 'INFP' },
  { text: 'J\'ai enfin compris pourquoi je réagis comme ça dans les conflits. Game changer.', name: 'Thomas R.', type: 'ENTJ' },
  { text: 'Mon copain a fait le test aussi, le résultat sur notre compatibilité était 🔥', name: 'Yasmine K.', type: 'ENFJ' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (IN_APP_REGEX.test(navigator.userAgent || '')) setInApp(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(t => (t + 1) % TEMOIGNAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#faf9f7' }}>

      {/* In-app banner (discrète, pas un mur) */}
      {inApp && !bannerDismissed && <InAppBanner onDismiss={() => setBannerDismissed(true)} />}

      {/* Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-[0.18] bg-violet-300" />
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.1] bg-pink-300" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full blur-3xl opacity-[0.08] bg-violet-200" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(250,249,247,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid #e7e5e0' : '1px solid transparent',
        }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            <span style={{ background: 'linear-gradient(to right,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-stone-900">Cecret</span>
          </span>
          <div className="flex items-center gap-3">
            <UserMenu />
            <Link href="/quiz/personnalite"
              className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
              Faire le test
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-28 pb-12 px-6 text-center">
        <div className="max-w-xl mx-auto">

          {/* Badge social proof */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', color: '#7c3aed' }}>
            🔥 <Counter target={94300} /> personnes ont découvert leur type
          </div>

          {/* Headline principale — curiosité maximale */}
          <h1 className="text-[42px] sm:text-[52px] font-black leading-[1.05] mb-4 tracking-tight text-stone-900">
            Tu penses te connaître.
            <br />
            <span style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ce test va tout changer.
            </span>
          </h1>

          <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed mb-4">
            Parmi 16 profils psychologiques — découvre exactement comment tu penses, ressens et réagis. Basé sur la recherche de Myers-Briggs.
          </p>

          {/* Testimonial rotatif */}
          <div className="mb-8 min-h-[72px] flex items-center justify-center">
            {TEMOIGNAGES.map((t, i) => (
              <div key={i}
                className="absolute max-w-sm mx-auto px-4 py-3 rounded-2xl text-sm transition-all duration-500"
                style={{
                  background: 'white',
                  border: '1px solid #e7e5e0',
                  opacity: i === activeTestimonial ? 1 : 0,
                  transform: i === activeTestimonial ? 'translateY(0)' : 'translateY(8px)',
                  pointerEvents: i === activeTestimonial ? 'auto' : 'none',
                }}>
                <p className="text-stone-700 text-sm leading-snug mb-2">&ldquo;{t.text}&rdquo;</p>
                <p className="text-stone-400 text-xs font-semibold">{t.name} · <span style={{ color: '#7c3aed' }}>{t.type}</span></p>
              </div>
            ))}
          </div>

          {/* CTA principal — énorme, impossible à manquer */}
          <Link href="/quiz/personnalite"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 12px 40px rgba(124,58,237,0.45)' }}>
            <span>🔮</span> Découvrir mon type <span>→</span>
          </Link>
          <p className="text-stone-400 text-xs mt-3 font-medium">
            ✓ Gratuit &nbsp;·&nbsp; ✓ 2 minutes &nbsp;·&nbsp; ✓ Sans inscription
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-12 pt-10 border-t border-stone-200">
            {[
              { value: '16', label: 'Profils distincts', emoji: '🌈' },
              { value: '2 min', label: 'Pour le résultat', emoji: '⚡' },
              { value: '0 €', label: 'Pour commencer', emoji: '🎁' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-lg mb-1">{s.emoji}</div>
                <div className="text-2xl font-black text-stone-900">{s.value}</div>
                <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TYPES PREVIEW STRIP ── */}
      <section className="relative z-10 py-6 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center text-stone-400 mb-4">Parmi 16 profils — lequel est le tien ?</p>
          <div className="grid grid-cols-3 gap-2">
            {TYPES_PREVIEW.map((t) => (
              <Link key={t.code} href={`/types/${t.code.toLowerCase()}`}
                className="flex flex-col items-center p-3 rounded-xl transition-all hover:scale-[1.03]"
                style={{ background: 'white', border: '1px solid #e7e5e0' }}>
                <span className="text-xl mb-1">{t.emoji}</span>
                <span className="text-xs font-black tracking-wider" style={{ color: t.color }}>{t.code}</span>
                <span className="text-xs text-stone-500 text-center leading-tight mt-0.5">{t.name}</span>
              </Link>
            ))}
          </div>
          <p className="text-center mt-4 text-xs text-stone-400">
            + 10 autres profils · <Link href="/types" className="font-semibold" style={{ color: '#7c3aed' }}>Voir tous →</Link>
          </p>
        </div>
      </section>

      {/* ── COMPATIBILITÉ CTA ── */}
      <section className="relative z-10 py-4 px-6">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.06),rgba(236,72,153,0.04))', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#7c3aed' }}>💑 Mode duo</p>
              <h2 className="text-sm font-black text-stone-900 mb-1">On est vraiment compatibles ?</h2>
              <p className="text-stone-500 text-xs leading-relaxed">
                Chacun fait le test. Les deux profils sont comparés sur 4 dimensions cognitives.
              </p>
            </div>
            <Link href="/duo"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white whitespace-nowrap transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 16px rgba(124,58,237,0.25)' }}>
              Tester →
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUIZ VÉRITÉ ── */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#7c3aed' }}>
            🔍 Questions que tu n&apos;oses pas poser
          </p>
          <h2 className="text-xl font-black text-stone-900 text-center mb-2">
            Des révélations que tu n&apos;attendais pas
          </h2>
          <p className="text-stone-500 text-center text-sm mb-6">
            Anonyme · Résultat immédiat · Sans inscription
          </p>
          <div className="space-y-2">
            {[
              { href: '/quiz/infidelite', q: 'Mon/ma partenaire me trompe ?', sub: '8 comportements analysés · 2 min', emoji: '💔' },
              { href: '/quiz/amoureux', q: 'Suis-je vraiment amoureux(se) ?', sub: 'Amour, attachement ou habitude', emoji: '❤️' },
              { href: '/quiz/manipule', q: 'Suis-je manipulé(e) ?', sub: 'Gaslighting, contrôle émotionnel — détection', emoji: '🎭' },
              { href: '/quiz/narcissique', q: 'Est-il/elle narcissique ?', sub: 'Les 9 traits analysés cliniquement', emoji: '🪞' },
            ].map((q) => (
              <Link key={q.href} href={q.href}
                className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01] group"
                style={{ background: 'white', border: '1px solid #e7e5e0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span className="text-2xl flex-shrink-0">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm leading-snug">{q.q}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{q.sub}</p>
                </div>
                <svg className="w-4 h-4 text-stone-300 group-hover:text-violet-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <Link href="/quizzes" className="block text-center mt-5 text-sm font-bold transition-colors" style={{ color: '#7c3aed' }}>
            Voir les 15 quiz →
          </Link>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative z-10 py-14 px-6 text-center">
        <div className="max-w-sm mx-auto">
          <p className="text-3xl font-black text-stone-900 mb-2">Prêt(e) à te découvrir ?</p>
          <p className="text-stone-500 text-sm mb-7">94 300+ personnes l&apos;ont déjà fait. En 2 minutes.</p>
          <Link href="/quiz/personnalite"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 12px 40px rgba(124,58,237,0.45)' }}>
            <span>🔮</span> Commencer maintenant <span>→</span>
          </Link>
          <p className="text-stone-400 text-xs mt-3">✓ Gratuit &nbsp;·&nbsp; ✓ Sans inscription &nbsp;·&nbsp; ✓ Résultat immédiat</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-stone-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-base font-black">
            <span style={{ background: 'linear-gradient(to right,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-stone-900">Cecret</span>
          </span>
          <div className="flex items-center gap-6 text-stone-400 text-xs">
            <Link href="/types" className="hover:text-stone-700 transition-colors">16 types</Link>
            <Link href="/duo" className="hover:text-stone-700 transition-colors">Compatibilité</Link>
            <Link href="/mentions-legales" className="hover:text-stone-700 transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-stone-700 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-stone-400 text-xs">© 2025 UrCecret</p>
        </div>
      </footer>
    </main>
  );
}
