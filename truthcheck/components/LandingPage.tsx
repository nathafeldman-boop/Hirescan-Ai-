'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { mbtiTypesFree as mbtiTypes } from '@/lib/mbti-free';
import Seal from './Seal';
import TypeEmblem from './TypeEmblem';
import ReviewsMarquee from './ReviewsMarquee';
import CosmicBackdrop from './CosmicBackdrop';
import CardCarousel from './CardCarousel';
import PhoneMockup from './PhoneMockup';
import MbtiDemoScreen from './landing-demos/MbtiDemoScreen';
import NovaDemoScreen from './landing-demos/NovaDemoScreen';
import JournalDemoScreen from './landing-demos/JournalDemoScreen';

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

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // Le bandeau CTA sticky mobile a été retiré : la barre globale Home/Moi
  // (voir GlobalTabBar) occupe maintenant tout le bas de l'écran en
  // permanence, empiler les deux aurait recréé le fouillis qu'on vient de
  // nettoyer (voir HIDE_ON dans GlobalTabBar.tsx).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden relative" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
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
          <span className="text-lg font-display italic transition-colors duration-300" style={{ color: 'var(--ink)', fontWeight: 700 }}>
            UrCecret
          </span>
          <div className="flex items-center gap-3">
            {/* L'accès à Nova passe par la barre globale en bas d'écran
                (composant GlobalTabBar). Le bouton "Commencer" envoie
                maintenant vers le hub de découverte, pas direct sur le test —
                voir /decouverte (nouvelle étape du funnel). */}
            <UserMenu />
            <Link
              href="/decouverte"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 hover:opacity-90 active:scale-[0.97] whitespace-nowrap"
              style={{ background: 'var(--ink)', color: '#FAF6EC' }}
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO — le sceau se révèle, la promesse d'une lecture mystique.
          Fond papier beige (demande explicite) : textes en encre. Une photo
          d'ouverture (chemin dans la lumière dorée — écho visuel du voyage de
          découverte de soi) s'efface en fondu vers le papier avant le titre,
          pour ne jamais abîmer la lisibilité du texte en dessous. ═══ */}
      <section className="relative overflow-hidden text-center" style={{ background: 'var(--paper)' }}>
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

        <div className="absolute inset-x-0 top-0" style={{ height: 460 }} aria-hidden>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('/landing-hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(21,18,31,0.12) 0%, var(--paper) 90%)' }} />
        </div>

        <div className="relative max-w-xl mx-auto px-6 pt-24 pb-16">

          <div className="hero-seal flex justify-center mb-6">
            <Seal size={72} spin />
          </div>

          <p className="hero-up ur-label text-[11px] mb-5" style={{ color: 'var(--gold)', animationDelay: '.05s' }}>
            Découverte de soi · IA
          </p>

          <h1 className="hero-up font-display mb-6" style={{ color: 'var(--ink)', fontSize: 'clamp(2.1rem, 8.6vw, 3.5rem)', lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.01em', wordBreak: 'break-word', animationDelay: '.1s' }}>
            Apprends à{' '}
            <em className="relative inline-block" style={{ color: 'var(--gold)' }}>
              mieux te connaître
              <svg className="absolute left-0 -bottom-1.5 w-full" height="10" viewBox="0 0 220 10" fill="none" preserveAspectRatio="none" aria-hidden>
                <path d="M3 7C52 3 145 2.5 217 5.5" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"
                      style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'heroDraw 1s ease .6s forwards' }} />
              </svg>
            </em>
            .
          </h1>

          <p className="hero-up text-[15px] max-w-sm mx-auto mb-9 text-stone-500" style={{ lineHeight: 1.65, animationDelay: '.16s' }}>
            Découvre ta personnalité, comprends tes émotions et apprends à mieux te comprendre grâce à l&apos;intelligence artificielle.
          </p>

          <div className="hero-up" style={{ animationDelay: '.22s' }}>
            <Link
              href="/decouverte"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base active:scale-[0.98] transition-transform whitespace-nowrap"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              Commencer gratuitement →
            </Link>
          </div>
          <p className="hero-up text-xs mt-4 text-stone-400" style={{ animationDelay: '.28s' }}>
            Gratuit, résultat immédiat, sans inscription.
          </p>

          {/* Faits vérifiables, pas de stats inventées */}
          <div className="hero-up flex items-center justify-center gap-8 mt-10 pt-7" style={{ borderTop: '1px solid var(--line)', animationDelay: '.34s' }}>
            {[
              { value: '16', label: 'Profils distincts' },
              { value: '24/7', label: 'Coach IA' },
              { value: '3 min', label: 'Premier résultat' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-xl" style={{ color: 'var(--ink)', fontWeight: 700 }}>{s.value}</div>
                <div className="text-[11px] mt-1 text-stone-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3 façons de te comprendre — additif au switch du hero (on ne le
          retire pas). Chaque feature a maintenant sa PROPRE section, avec son
          propre décor animé et son mockup téléphone qui rejoue un "gameplay"
          scripté (aucune vraie donnée, aucun compte requis) — pas 3 fois la
          même carte. Toutes les démos sont dans components/landing-demos/. ═══ */}
      <p className="ur-label text-[10px] text-center pt-6" style={{ color: CLAY }}>Une application, pas juste un test</p>
      <h2 className="font-display text-2xl font-black text-stone-900 text-center mt-2 px-6">
        UrCecret, c&apos;est 3 façons de te comprendre
      </h2>

      {/* ── 🧠 Test MBTI — glow doré qui respire ── */}
      <section className="relative z-10 py-14 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="landing-decor-anim absolute left-1/2 top-1/3 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl" style={{ background: 'var(--gold)', opacity: 0.12, animation: 'pulseGlow 5s ease-in-out infinite' }} />
        </div>
        <div className="relative max-w-lg mx-auto text-center">
          <p className="ur-label text-[10px] mb-3" style={{ color: CLAY }}>🧠 Test de personnalité</p>
          <h3 className="font-display text-2xl font-black text-stone-900 mb-3">Découvre qui tu es, vraiment</h3>
          <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: '#78716c', lineHeight: 1.6 }}>
            Basé sur les 8 fonctions cognitives de Carl Jung. Réponds honnêtement, Nova s&apos;occupe du reste.
          </p>
          <div className="landing-decor-anim mb-8" style={{ animation: 'demoFloat 6s ease-in-out infinite' }}>
            <PhoneMockup><MbtiDemoScreen /></PhoneMockup>
          </div>
          <Link href="/decouverte" className="ur-btn-gold inline-flex px-7 py-3.5 text-sm">
            Faire mon test →
          </Link>
        </div>
      </section>

      {/* ── 🤖 Nova — fond encre, décor cosmique ── */}
      <section className="relative z-10 py-14 px-6 overflow-hidden" style={{ background: 'var(--ink)' }}>
        <CosmicBackdrop />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="landing-decor-anim absolute right-8 top-10 w-56 h-56 rounded-full blur-3xl" style={{ background: 'var(--gold)', opacity: 0.1, animation: 'floatBlob 8s ease-in-out infinite' }} />
        </div>
        <div className="relative max-w-lg mx-auto text-center">
          <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>🤖 Ton IA personnelle</p>
          <h3 className="font-display text-2xl font-black mb-3" style={{ color: '#FAF6EC' }}>Une IA qui apprend à te connaître</h3>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'rgba(250,246,236,0.55)', lineHeight: 1.6 }}>
            Analyse une conversation, comprend tes émotions, crée des tests personnalisés, répond à tes questions.
          </p>
          <div className="landing-decor-anim mb-8" style={{ animation: 'demoFloat 6s ease-in-out infinite .3s' }}>
            <PhoneMockup dark><NovaDemoScreen /></PhoneMockup>
          </div>
          <Link href="/decouverte" className="ur-btn-gold inline-flex px-7 py-3.5 text-sm">
            Découvrir Nova →
          </Link>
        </div>
      </section>

      {/* ── 📖 Journal émotionnel — chaleureux, particules flottantes ── */}
      <section className="relative z-10 py-14 px-6 overflow-hidden" style={{ background: 'var(--paper-panel)' }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[
            { l: '12%', t: '15%', e: '😄', d: '0s' }, { l: '80%', t: '20%', e: '🙂', d: '1.4s' },
            { l: '25%', t: '70%', e: '😊', d: '.7s' }, { l: '70%', t: '65%', e: '✦', d: '2.1s' },
          ].map((p, i) => (
            <span key={i} className="landing-decor-anim absolute text-xl opacity-20" style={{ left: p.l, top: p.t, animation: `floatUp 7s ease-in-out ${p.d} infinite` }}>{p.e}</span>
          ))}
        </div>
        <div className="relative max-w-lg mx-auto text-center">
          <p className="ur-label text-[10px] mb-3" style={{ color: CLAY }}>📖 Journal émotionnel</p>
          <h3 className="font-display text-2xl font-black text-stone-900 mb-3">Note ton humeur, découvre ton évolution</h3>
          <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: '#78716c', lineHeight: 1.6 }}>
            Un calendrier qui se remplit chaque jour, et Nova qui repère tes tendances au fil du temps.
          </p>
          <div className="landing-decor-anim mb-8" style={{ animation: 'demoFloat 6s ease-in-out infinite .6s' }}>
            <PhoneMockup><JournalDemoScreen /></PhoneMockup>
          </div>
          <Link href="/decouverte" className="ur-btn-gold inline-flex px-7 py-3.5 text-sm">
            Commencer mon journal →
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes pulseGlow { 0%, 100% { opacity:.1; transform:translate(-50%,0) scale(1) } 50% { opacity:.2; transform:translate(-50%,0) scale(1.15) } }
        @keyframes floatBlob { 0%, 100% { transform:translateY(0) } 50% { transform:translateY(20px) } }
        @keyframes floatUp { 0%, 100% { transform:translateY(0); opacity:.15 } 50% { transform:translateY(-14px); opacity:.3 } }
        @keyframes demoFloat { 0%, 100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        @media (prefers-reduced-motion: reduce) {
          .landing-decor-anim { animation: none !important; }
        }
      `}</style>

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

      {/* ── Section 2 : les 4 familles MBTI (les quiz thématiques ont été retirés
          de la home — le site est 100 % centré sur LE test). ── */}
      <section className="relative z-10 pb-10 px-5">
        <div className="max-w-lg mx-auto">
          {(
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
                  { href: '/decouverte', tag: 'NT', q: 'Analytique (INTJ · INTP · ENTJ · ENTP)', sub: 'Stratèges, rationnels, orientés systèmes' },
                  { href: '/decouverte', tag: 'NF', q: 'Diplomate (INFJ · INFP · ENFJ · ENFP)',  sub: 'Empathiques, idéalistes, axés relations' },
                  { href: '/decouverte', tag: 'SJ', q: 'Sentinelle (ISTJ · ISFJ · ESTJ · ESFJ)', sub: 'Organisés, fiables, attachés aux structures' },
                  { href: '/decouverte', tag: 'SP', q: 'Explorateur (ISTP · ISFP · ESTP · ESFP)', sub: 'Adaptables, pragmatiques, orientés action' },
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
              <Link href="/decouverte" className="block text-center mt-4 text-xs font-semibold transition-colors" style={{ color: CLAY }}>
                Faire le test complet →
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
          <Link href="/decouverte" className="ur-btn-gold inline-flex px-8 py-4 text-base">
            Découvrir qui je suis vraiment →
          </Link>
          <p className="text-xs text-stone-400 mt-3">Gratuit · sans inscription · résultat immédiat</p>
        </div>
      </section>


      {/* Vitrine — ta carte de résultat (montre ce qu'on obtient) */}
      <section className="relative z-10 py-12 px-6 overflow-hidden" style={{ background: 'var(--ink)' }}>
        <CosmicBackdrop />
        <div className="relative z-10 max-w-lg mx-auto text-center">
          <p className="ur-label text-[10px] mb-3" style={{ color: 'var(--gold)' }}>Ton résultat</p>
          <h2 className="font-display text-2xl font-black mb-2" style={{ color: '#FAF6EC' }}>
            Ta carte, prête à partager
          </h2>
          <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: 'rgba(250,246,236,0.55)' }}>
            Chaque résultat devient ta carte perso — à enregistrer et poster.
          </p>
          <CardCarousel />
          <p className="text-[11px] mt-4" style={{ color: 'rgba(250,246,236,0.4)' }}>
            Glisse pour découvrir d&apos;autres cartes
          </p>
          <Link href="/decouverte" className="inline-block mt-3 text-sm font-bold" style={{ color: 'var(--gold)' }}>
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
        <div className="relative overflow-hidden max-w-lg mx-auto rounded-2xl p-7 text-center" style={{ background: 'var(--ink)' }}>
          <CosmicBackdrop />
          <div className="relative z-10">
            <div className="flex justify-center mb-4"><Seal size={44} /></div>
            <h2 className="font-display text-2xl font-black mb-2" style={{ color: '#FAF6EC' }}>
              Il y en a un qui est le tien.
            </h2>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'rgba(250,246,236,0.55)' }}>
              Tu viens de voir les 16 profils. Lequel es-tu vraiment ? Tu le sais dans 3 minutes.
            </p>
            <Link href="/decouverte" className="ur-btn-gold inline-flex px-8 py-4 text-base">
              Révéler mon type →
            </Link>
          </div>
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

      {/* Les 15 quiz anonymes — funnel secondaire, remis en avant depuis
          l'accueil (avant, on ne pouvait plus les trouver qu'en tapant
          l'URL /quizzes directement). ── */}
      <section className="relative z-10 py-14 px-6" style={{ background: 'var(--paper-panel)' }}>
        <div className="max-w-lg mx-auto text-center">
          <p className="ur-label text-[10px] mb-3" style={{ color: CLAY }}>100% anonyme · zéro compte requis</p>
          <h2 className="font-display text-2xl font-black text-stone-900 mb-3">
            15 autres vérités à découvrir
          </h2>
          <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: '#78716c' }}>
            Infidélité, narcissisme, burnout, ton crush, ta relation… des quiz anonymes, résultat instantané.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-7">
            {[
              { slug: 'infidelite', label: '💔 Infidélité ?' },
              { slug: 'narcissique', label: '🪞 Narcissique ?' },
              { slug: 'relation-toxique', label: '⚠️ Toxique ?' },
              { slug: 'burnout', label: '💤 Burnout ?' },
              { slug: 'crush', label: '💌 Mon crush ?' },
            ].map((q) => (
              <Link
                key={q.slug}
                href={`/quiz/${q.slug}`}
                className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all hover:scale-[1.03]"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                {q.label}
              </Link>
            ))}
          </div>
          <Link href="/decouverte" className="ur-btn-gold inline-flex px-7 py-3.5 text-sm">
            Voir les 15 quiz →
          </Link>
        </div>
      </section>

      {/* CTA de clôture — bande cosmique */}
      <section className="relative z-10 pb-14 px-6">
        <div className="relative overflow-hidden max-w-lg mx-auto rounded-3xl px-6 py-12 text-center" style={{ background: 'var(--ink)' }}>
          <CosmicBackdrop />
          <div className="relative z-10">
            <div className="flex justify-center mb-5"><Seal size={52} spin /></div>
            <h2 className="font-display text-3xl font-black mb-3 leading-tight" style={{ color: '#FAF6EC' }}>
              Arrête de te demander qui tu es.
            </h2>
            <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: 'rgba(250,246,236,0.55)' }}>
              Ton type, ta carte, et un coach qui te connaît déjà — gratuit pour commencer.
            </p>
            <Link href="/decouverte" className="ur-btn-gold inline-flex px-9 py-4 text-base">
              Faire le test maintenant →
            </Link>
            <p className="text-xs mt-3" style={{ color: 'rgba(250,246,236,0.38)' }}>3 minutes · résultat immédiat · sans inscription</p>
          </div>
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
            <Link href="/quizzes" className="hover:text-stone-700 transition-colors">Tous les quiz</Link>
            <Link href="/mentions-legales" className="hover:text-stone-700 transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-stone-700 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-stone-400 text-xs">© {new Date().getFullYear()} UrCecret</p>
        </div>
      </footer>
    </main>
  );
}
