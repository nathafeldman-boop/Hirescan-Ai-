'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { mbtiTypesFree as mbtiTypes } from '@/lib/mbti-free';
import Seal from './Seal';
import TypeEmblem from './TypeEmblem';
import ReviewsMarquee from './ReviewsMarquee';

const GROUPS = [
  {
    key: 'analystes',
    title: 'Analystes',
    desc: 'Rationnels, stratèges, orientés systèmes',
    codes: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    color: 'var(--fam-nt)',
    tag: 'NT',
  },
  {
    key: 'diplomates',
    title: 'Diplomates',
    desc: 'Empathiques, idéalistes, axés relations',
    codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    color: 'var(--fam-nf)',
    tag: 'NF',
  },
  {
    key: 'sentinelles',
    title: 'Sentinelles',
    desc: 'Organisés, fiables, attachés aux structures',
    codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    color: 'var(--fam-sj)',
    tag: 'SJ',
  },
  {
    key: 'explorateurs',
    title: 'Explorateurs',
    desc: 'Adaptables, pragmatiques, orientés action',
    codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    color: 'var(--fam-sp)',
    tag: 'SP',
  },
];

const MBTI_LETTERS = [
  { letter: 'E/I', label: 'Extraversion · Introversion', color: 'var(--fam-nt)', desc: 'Indique si ta fonction cognitive dominante est dirigée vers l\'extérieur (action, personnes) ou vers l\'intérieur (réflexion, solitude). Ce n\'est pas la timidité, c\'est la direction de ton énergie.' },
  { letter: 'N/S', label: 'Intuition · Sensation', color: 'var(--fam-nf)', desc: 'Tes deux fonctions de perception. Jung distingue la Sensation (concret, présent, détails) de l\'iNtuition (abstrait, futur, patterns). L\'une est dominante, l\'autre auxiliaire dans ton stack.' },
  { letter: 'T/F', label: 'Pensée · Sentiment', color: 'var(--fam-sp)', desc: 'Tes deux fonctions de jugement : la Pensée (logique, systèmes, objectivité) et le Sentiment (valeurs, harmonie, impact humain). Ces fonctions déterminent comment tu décides, pas ce que tu ressens.' },
  { letter: 'J/P', label: 'Jugement · Perception', color: 'var(--fam-sj)', desc: 'Révèle quelle fonction est en surface. Une fonction de Jugement (T ou F) donne une structure visible ; une fonction de Perception (N ou S) rend plus adaptable. Ton intérieur est souvent l\'inverse.' },
];

const CLAY = 'var(--gold)';

function InAppBanner({ onClose }: { onClose: () => void }) {
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  };
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: 'var(--ink)', border: '1px solid var(--line-ink)' }}>
      <p className="flex-1 text-white text-xs leading-snug" style={{ fontFamily: 'var(--font-sans)' }}>
        Pour voir tes résultats, <strong>ouvre dans ton navigateur</strong> (⋯ puis Ouvrir dans le navigateur)
      </p>
      <button onClick={copyLink} className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(224,163,128,0.22)', color: '#e0a380' }}>
        Copier
      </button>
      <button onClick={onClose} className="flex-shrink-0 text-stone-400 text-sm leading-none">✕</button>
    </div>
  );
}

function isInAppBrowser(ua: string): boolean {
  const isAndroidWebView = /Android/.test(ua) && /\bwv\b/.test(ua);
  const isIOSWebView = /iP(hone|ad|od)/.test(ua) && /AppleWebKit/.test(ua) && !/Safari/.test(ua);
  const isSocialApp = /FBAN|FBAV|Instagram|TikTok|BytedanceWebview|MicroMessenger|Snapchat|musical_ly|trill|ZhiLiao/.test(ua);
  return isAndroidWebView || isIOSWebView || isSocialApp;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [fromTiktok, setFromTiktok] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setStickyVisible(window.scrollY > 320);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    if (isInAppBrowser(ua)) setInApp(true);
    const p = new URLSearchParams(window.location.search);
    const isTiktokUA = /TikTok|BytedanceWebview|musical_ly|trill/i.test(ua);
    setFromTiktok(p.get('utm_source') === 'tiktok' || p.get('utm_medium') === 'paid' || isTiktokUA);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden relative" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* InAppBanner intentionnellement retiré de la landing — le banner est géré sur la page de résultats uniquement pour ne pas bloquer le traffic ads TikTok/Instagram */}
      {false && inApp && !bannerDismissed && <InAppBanner onClose={() => setBannerDismissed(true)} />}

      {/* Paper grain — handcrafted texture */}
      <div className="grain-overlay" />

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(242,236,222,0.94)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-display italic transition-colors duration-300" style={{ color: scrolled ? 'var(--ink)' : '#FAF6EC', fontWeight: 700 }}>
            UrCecret
          </span>
          <div className="flex items-center gap-3">
            {/* Le chatbot est désormais la boule flottante en bas à droite
                (composant ChatFab, global) — la nav reste focalisée sur le test. */}
            <UserMenu />
            <Link
              href="/quiz/personnalite"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 hover:opacity-90 active:scale-[0.97] whitespace-nowrap"
              style={scrolled
                ? { background: 'var(--ink)', color: '#FAF6EC' }
                : { background: 'var(--gold)', color: 'var(--ink)' }}
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO — le sceau se révèle, la promesse d'une lecture mystique ═══ */}
      <section className="relative overflow-hidden text-center" style={{ background: 'var(--ink)' }}>
        <style>{`
          @keyframes heroUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
          @keyframes heroDraw { from { stroke-dashoffset:300 } to { stroke-dashoffset:0 } }
          @keyframes sealFadeIn { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }
          .hero-up { opacity:0; animation: heroUp .5s ease forwards }
          .hero-seal { opacity:0; animation: sealFadeIn .7s ease forwards }
          @media (prefers-reduced-motion: reduce) {
            .hero-up, .hero-seal { opacity:1; animation:none }
          }
        `}</style>

        <div className="relative max-w-xl mx-auto px-6 pt-24 pb-16">

          <div className="hero-seal flex justify-center mb-6">
            <Seal size={72} spin />
          </div>

          <p className="hero-up ur-label text-[11px] mb-5" style={{ color: 'var(--gold)', animationDelay: '.05s' }}>
            {fromTiktok ? 'Vu sur TikTok' : 'Test de personnalité'}
          </p>

          <h1 className="hero-up font-display mb-6" style={{ color: '#FAF6EC', fontSize: 'clamp(2.1rem, 8.6vw, 3.5rem)', lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.01em', wordBreak: 'break-word', animationDelay: '.1s' }}>
            {fromTiktok ? (
              <>Tu réagis différemment{' '}
                <em className="relative inline-block" style={{ color: 'var(--gold)' }}>
                  des autres
                  <svg className="absolute left-0 -bottom-1.5 w-full" height="10" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none" aria-hidden>
                    <path d="M3 7C48 3 130 2.5 197 5.5" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"
                          style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'heroDraw 1s ease .6s forwards' }} />
                  </svg>
                </em>
                . Voilà pourquoi.</>
            ) : (
              <>Quel est{' '}
                <em className="relative inline-block" style={{ color: 'var(--gold)' }}>
                  vraiment
                  <svg className="absolute left-0 -bottom-1.5 w-full" height="10" viewBox="0 0 150 10" fill="none" preserveAspectRatio="none" aria-hidden>
                    <path d="M3 7C36 3 100 2.5 147 5.5" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"
                          style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'heroDraw 1s ease .6s forwards' }} />
                  </svg>
                </em>
                {' '}ton type de personnalité&nbsp;?</>
            )}
          </h1>

          <p className="hero-up text-[15px] max-w-sm mx-auto mb-9" style={{ color: 'rgba(250,246,236,0.55)', lineHeight: 1.65, animationDelay: '.16s' }}>
            {fromTiktok
              ? 'Ton type MBTI explique comment ton cerveau traite le monde. 16 profils distincts basés sur Jung. Résultat en moins de 3 minutes.'
              : 'Basé sur les 8 fonctions cognitives de Carl Jung. 16 profils distincts. Ton analyse complète en moins de 3 minutes.'}
          </p>

          <div className="hero-up" style={{ animationDelay: '.22s' }}>
            <Link
              href="/quiz/personnalite"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base active:scale-[0.98] transition-transform whitespace-nowrap"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              Découvrir mon type →
            </Link>
          </div>
          <p className="hero-up text-xs mt-4" style={{ color: 'rgba(250,246,236,0.38)', animationDelay: '.28s' }}>
            Gratuit, résultat immédiat, sans inscription.
          </p>

          {/* Faits vérifiables, pas de stats inventées */}
          <div className="hero-up flex items-center justify-center gap-8 mt-10 pt-7" style={{ borderTop: '1px solid var(--line-ink)', animationDelay: '.34s' }}>
            {[
              { value: '16', label: 'Profils distincts' },
              { value: '12', label: 'Questions' },
              { value: '3 min', label: 'Résultat' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-xl" style={{ color: '#FAF6EC', fontWeight: 700 }}>{s.value}</div>
                <div className="text-[11px] mt-1" style={{ color: 'rgba(250,246,236,0.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi c'est différent — rangées éditoriales, pas des cartes ── */}
      <section className="relative z-10 pb-12 px-6">
        <div className="max-w-lg mx-auto">
          <p className="ur-label text-[10px] mb-6" style={{ color: CLAY }}>
            Pourquoi ce test est différent
          </p>
          {[
            { t: 'Les 4 lettres, tout le monde te les donne.', d: 'Le pourquoi, comment tu aimes, décides, te sabotes, c\'est ça que ton profil explique.' },
            { t: 'Fondé sur les 8 fonctions cognitives de Jung.', d: 'Pas un quiz de magazine : le modèle qui décrit comment ton cerveau traite le monde.' },
            { t: 'Écrit pour être relu toute ta vie.', d: 'Avant un entretien, au début d\'une relation, dans un conflit, à chaque grande décision.' },
          ].map((r, i, arr) => (
            <div key={r.t} className={`py-5${i < arr.length - 1 ? ' border-b' : ''}`}
                 style={{ borderColor: 'var(--line)' }}>
              <p className="text-[15px] font-bold text-stone-900 leading-snug" style={{ letterSpacing: '-0.01em' }}>{r.t}</p>
              <p className="text-[13px] text-stone-500 mt-1" style={{ lineHeight: 1.6 }}>{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2 : MBTI pour traffic TikTok, quiz thématiques pour trafic organique ── */}
      <section className="relative z-10 pb-10 px-5">
        <div className="max-w-lg mx-auto">
          {fromTiktok ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: CLAY }}>
                Les 4 familles MBTI
              </p>
              <h2 className="font-display text-2xl font-black text-stone-900 text-center mb-1">
                Quel type es-tu vraiment ?
              </h2>
              <p className="text-stone-400 text-center text-xs mb-5">
                16 profils · Fonctions cognitives de Jung · Résultat en 5 min
              </p>
              <div className="space-y-2">
                {[
                  { href: '/quiz/personnalite', tag: 'NT', q: 'Analytique (INTJ · INTP · ENTJ · ENTP)', sub: 'Stratèges, rationnels, orientés systèmes' },
                  { href: '/quiz/personnalite', tag: 'NF', q: 'Diplomate (INFJ · INFP · ENFJ · ENFP)',  sub: 'Empathiques, idéalistes, axés relations' },
                  { href: '/quiz/personnalite', tag: 'SJ', q: 'Sentinelle (ISTJ · ISFJ · ESTJ · ESFJ)', sub: 'Organisés, fiables, attachés aux structures' },
                  { href: '/quiz/personnalite', tag: 'SP', q: 'Explorateur (ISTP · ISFP · ESTP · ESFP)', sub: 'Adaptables, pragmatiques, orientés action' },
                ].map((q) => (
                  <Link
                    key={q.q}
                    href={q.href}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
                  >
                    <span className="ur-label flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[10px]"
                          style={{ background: 'var(--ink)', color: '#FAF6EC' }}>{q.tag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm leading-snug">{q.q}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{q.sub}</p>
                    </div>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--gold-soft)' }}>
                      <svg className="w-3.5 h-3.5" style={{ color: CLAY }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/quiz/personnalite" className="block text-center mt-4 text-xs font-semibold transition-colors" style={{ color: CLAY }}>
                Faire le test complet →
              </Link>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: CLAY }}>
                Questions secrètes
              </p>
              <h2 className="font-display text-2xl font-black text-stone-900 text-center mb-1">
                Des révélations que tu n&apos;attendais pas
              </h2>
              <p className="text-stone-400 text-center text-xs mb-5">
                Anonyme · Résultat immédiat · Sans inscription
              </p>
              <div className="space-y-2">
                {[
                  { href: '/quiz/personnalite', q: 'Quel est vraiment mon type MBTI ?',   sub: 'Effrayant de précision, 16 profils, résultat en 3 min' },
                  { href: '/quiz/infidelite',   q: 'Mon/ma partenaire me trompe ?',       sub: '8 comportements analysés, 2 minutes' },
                  { href: '/quiz/amoureux',     q: 'Suis-je vraiment amoureux(se) ?',     sub: 'Amour, attachement ou habitude, analyse différenciée' },
                  { href: '/quiz/manipule',     q: 'Suis-je manipulé(e) ?',               sub: 'Gaslighting, contrôle émotionnel, emprise' },
                  { href: '/quiz/vrais-amis',   q: 'Sont-ils de vrais amis ?',            sub: 'Dynamiques de réciprocité dans tes amitiés proches' },
                ].map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm leading-snug">{q.q}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{q.sub}</p>
                    </div>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--gold-soft)' }}>
                      <svg className="w-3.5 h-3.5" style={{ color: CLAY }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/quizzes" className="block text-center mt-4 text-xs font-semibold transition-colors" style={{ color: CLAY }}>
                Voir tous les quiz →
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Avis qui défilent */}
      <ReviewsMarquee />

      {/* CTA — après la preuve sociale */}
      <section className="relative z-10 pt-2 pb-12 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-display text-2xl font-black text-stone-900 mb-2">Ils ont osé se regarder en face.</h2>
          <p className="text-stone-500 text-sm mb-6 max-w-xs mx-auto">À ton tour. 3 minutes, et tu sais enfin pourquoi tu fonctionnes comme ça.</p>
          <Link href="/quiz/personnalite" className="ur-btn-gold inline-flex px-8 py-4 text-base">
            Découvrir qui je suis vraiment →
          </Link>
          <p className="text-xs text-stone-400 mt-3">Gratuit · sans inscription · résultat immédiat</p>
        </div>
      </section>


      {/* Vitrine — ta carte de résultat (montre ce qu'on obtient) */}
      <section className="relative z-10 py-12 px-6" style={{ background: 'var(--ink)' }}>
        <div className="max-w-lg mx-auto text-center">
          <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>Ton résultat</p>
          <h2 className="font-display text-2xl font-black mb-2" style={{ color: '#FAF6EC' }}>
            Ta carte, prête à partager
          </h2>
          <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: 'rgba(250,246,236,0.55)' }}>
            Chaque résultat devient ta carte perso — à enregistrer et poster.
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 justify-start sm:justify-center">
            {['infj', 'enfp', 'intj'].map((c) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c}
                src={`/api/card?type=${c}`}
                alt={`Exemple de carte ${c.toUpperCase()}`}
                loading="lazy"
                decoding="async"
                className="flex-shrink-0 rounded-2xl"
                style={{ width: 190, border: '1px solid var(--line-ink)' }}
              />
            ))}
          </div>
          <Link href="/quiz/personnalite" className="inline-block mt-6 text-sm font-bold" style={{ color: 'var(--gold)' }}>
            Obtenir ma carte →
          </Link>
        </div>
      </section>

      {/* 4 family sections */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          {GROUPS.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-3 mb-4">
                <span className="ur-label w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]"
                      style={{ background: group.color, color: '#FAF6EC' }}>
                  {group.tag}
                </span>
                <div>
                  <p className="font-display font-black text-stone-900 text-base">{group.title}</p>
                  <p className="text-stone-400 text-xs">{group.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {group.codes.map((code) => {
                  const t = mbtiTypes[code];
                  return (
                    <Link
                      key={code}
                      href={`/types/${code.toLowerCase()}`}
                      className="flex flex-col items-center text-center p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                      style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
                    >
                      <TypeEmblem emoji={t.emoji} accentColor={t.accentColor} size={64} />
                      <div className="mt-3 text-sm font-black tracking-widest" style={{ color: t.accentColor }}>
                        {code}
                      </div>
                      <p className="font-bold text-stone-900 text-xs mt-0.5 leading-snug">
                        {t.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — après avoir vu les 16 profils */}
      <section className="relative z-10 pb-12 px-6">
        <div className="max-w-lg mx-auto rounded-2xl p-7 text-center" style={{ background: 'var(--ink)' }}>
          <div className="flex justify-center mb-4"><Seal size={44} /></div>
          <h2 className="font-display text-2xl font-black mb-2" style={{ color: '#FAF6EC' }}>
            Il y en a un qui est le tien.
          </h2>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'rgba(250,246,236,0.55)' }}>
            Tu viens de voir les 16 profils. Lequel es-tu vraiment ? Tu le sais dans 3 minutes.
          </p>
          <Link href="/quiz/personnalite" className="ur-btn-gold inline-flex px-8 py-4 text-base">
            Révéler mon type →
          </Link>
        </div>
      </section>

      {/* Les 4 dimensions — compact & visuel */}
      <section className="relative z-10 py-14 px-6">
        <div className="max-w-lg mx-auto">
          <p className="ur-label text-[10px] text-center mb-3" style={{ color: CLAY }}>Théorie de Carl Jung</p>
          <h2 className="font-display text-2xl font-black text-stone-900 text-center mb-8">
            4 dimensions, 16 profils
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MBTI_LETTERS.map((item) => (
              <div
                key={item.letter}
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
              >
                <div
                  className="ur-label flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xs"
                  style={{ background: item.color, color: '#FAF6EC' }}
                >
                  {item.letter}
                </div>
                <p className="font-semibold text-stone-900 text-xs leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA de clôture */}
      <section className="relative z-10 pb-14 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-display text-3xl font-black text-stone-900 mb-3 leading-tight">
            Arrête de te demander qui tu es.
          </h2>
          <p className="text-stone-500 text-sm mb-7 max-w-xs mx-auto">
            Ton type, ta carte, et un coach qui te connaît déjà — le tout gratuit pour commencer.
          </p>
          <Link href="/quiz/personnalite" className="ur-btn-gold inline-flex px-9 py-4 text-base">
            Faire le test maintenant →
          </Link>
          <p className="text-xs text-stone-400 mt-3">3 minutes · résultat immédiat · sans inscription</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 pb-24 sm:pb-8" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-base font-black" style={{ color: 'var(--ink)' }}>
            UrCecret
          </span>
          <div className="flex items-center gap-6 text-stone-400 text-xs">
            <Link href="/types" className="hover:text-stone-700 transition-colors">16 types</Link>
            <Link href="/quiz/personnalite" className="hover:text-stone-700 transition-colors">Test MBTI</Link>
            <Link href="/mentions-legales" className="hover:text-stone-700 transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-stone-700 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-stone-400 text-xs">© {new Date().getFullYear()} UrCecret</p>
        </div>
      </footer>

      {/* Sticky mobile CTA — visible after 320px scroll, hidden on desktop */}
      {stickyVisible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
          style={{ padding: '12px 16px 28px', background: 'linear-gradient(to top, var(--paper) 65%, transparent)' }}
        >
          <Link
            href="/quiz/personnalite"
            className="block w-full text-center py-4 rounded-full font-bold text-base transition-all active:scale-[0.98]"
            style={{ background: 'var(--gold)', color: '#FAF6EC' }}
          >
            Découvrir mon type →
          </Link>
        </div>
      )}
    </main>
  );
}
