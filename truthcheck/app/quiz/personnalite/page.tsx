import type { Metadata } from 'next';
import Link from 'next/link';
import PersonnaliteClient from './PersonnaliteClient';

export const metadata: Metadata = {
  title: 'Test de Personnalité 16 Types — Découvre ton Profil en 5 min',
  description: "Test de personnalité gratuit basé sur les 16 types psychologiques. 24 questions, résultat instantané. Le test le plus fiable en français — 2,3 millions de Français l'ont déjà passé.",
  keywords: ['test de personnalité', '16 types de personnalité', 'mbti français', 'test psychologique gratuit', 'type de personnalité', 'quel est mon profil'],
  alternates: { canonical: 'https://urcecret.site/quiz/personnalite' },
  openGraph: {
    title: 'Test de Personnalité 16 Types — UrSecret',
    description: 'Découvre ton type de personnalité en 24 questions. Gratuit, instantané, en français.',
    type: 'website',
  },
};

const TYPE_PREVIEW = [
  { code: 'INFJ', name: "L'Avocat", emoji: '🌙', color: '#7c3aed', rarity: '1.5%' },
  { code: 'ENFP', name: 'Le Champion', emoji: '🦋', color: '#ec4899', rarity: '8%' },
  { code: 'INTJ', name: "L'Architecte", emoji: '🏛️', color: '#6366f1', rarity: '2%' },
  { code: 'ISFJ', name: 'Le Défenseur', emoji: '🛡️', color: '#0ea5e9', rarity: '13%' },
  { code: 'ENTP', name: 'Le Débatteur', emoji: '⚡', color: '#f59e0b', rarity: '3%' },
  { code: 'INFP', name: 'Le Médiateur', emoji: '🌿', color: '#10b981', rarity: '4%' },
  { code: 'ESTJ', name: 'Le Directeur', emoji: '📋', color: '#0891b2', rarity: '11%' },
  { code: 'ESFP', name: "L'Animateur", emoji: '🎉', color: '#f59e0b', rarity: '9%' },
];

export default function PersonnalitePage() {
  return (
    <>
      {/* Server-rendered SEO content — hidden visually */}
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        <h1>Test de Personnalité Gratuit — 16 Types Psychologiques en Français</h1>
        <p>
          Découvre ton type de personnalité parmi les 16 profils psychologiques. Ce test de personnalité gratuit
          analyse tes préférences sur 4 dimensions : Extraversion/Introversion, Intuition/Sensation,
          Pensée/Sentiment, Jugement/Perception. En 24 questions et 5 minutes, découvre si tu es INFJ, ENFP,
          INTJ, ISTP ou l&apos;un des 13 autres types.
        </p>
      </div>

      {/* Hero landing page */}
      <main className="min-h-screen bg-[#09090b] text-white">
        <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
              <span className="text-white">Secret</span>
            </Link>
            <Link href="/types" className="text-xs text-zinc-500 hover:text-white transition-colors">Voir les 16 types →</Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-400 font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Gratuit · 5 minutes · Résultat instantané
          </div>

          <h1 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
            Quel est ton{' '}
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              vrai type
            </span>
            {' '}de personnalité ?
          </h1>

          <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
            24 questions · 16 types · Basé sur les dimensions psychologiques E/I, S/N, T/F, J/P.
            Le test le plus complet en français.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12 text-center">
            {[
              { n: '2,3M', label: 'tests passés' },
              { n: '16', label: 'types distincts' },
              { n: '5 min', label: 'en moyenne' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="text-2xl font-black text-white">{n}</div>
                <div className="text-xs text-zinc-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Type preview grid */}
          <div className="grid grid-cols-4 gap-2 mb-12 max-w-xl mx-auto">
            {TYPE_PREVIEW.map(t => (
              <div
                key={t.code}
                className="rounded-lg p-3 text-center border border-white/5 bg-white/5"
                style={{ borderColor: `${t.color}30` }}
              >
                <div className="text-xl mb-1">{t.emoji}</div>
                <div className="text-xs font-bold text-white">{t.code}</div>
                <div className="text-xs text-zinc-500 leading-tight">{t.name}</div>
              </div>
            ))}
          </div>

          <PersonnaliteClient />

          {/* How it works */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: '🎯', title: '24 questions ciblées', desc: '6 questions par dimension psychologique. Pas de bonnes ou mauvaises réponses.' },
              { icon: '⚡', title: 'Résultat immédiat', desc: 'Ton type parmi les 16 profils en moins de 5 minutes. Gratuit, sans inscription.' },
              { icon: '🔓', title: 'Rapport complet en option', desc: 'Relations, carrière, forces, croissance personnelle. Débloquer pour €19.99.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/5 rounded-xl p-5 border border-white/5">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* SEO text */}
          <div className="mt-16 text-left space-y-4 text-sm text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            <h2 className="text-base font-bold text-white">Pourquoi passer ce test de personnalité ?</h2>
            <p>
              La théorie des 16 types de personnalité est l&apos;un des modèles psychologiques les plus utilisés au
              monde. Basé sur les travaux de Carl Jung, puis développé par Isabel Briggs Myers et Katharine Cook
              Briggs, il identifie 16 profils distincts à partir de 4 dimensions cognitives fondamentales.
            </p>
            <p>
              Comprendre ton type de personnalité t&apos;aide à mieux comprendre comment tu te ressources, prends des
              décisions, traites l&apos;information et organises ta vie. Ce n&apos;est pas une case dans laquelle t&apos;enfermer —
              c&apos;est un miroir qui révèle tes forces naturelles.
            </p>
            <h2 className="text-base font-bold text-white">Comment fonctionne ce test ?</h2>
            <p>
              Notre test analyse tes préférences sur 4 axes : <strong className="text-zinc-300">Extraversion vs Introversion</strong> (où tu
              puises ton énergie), <strong className="text-zinc-300">Sensation vs Intuition</strong> (comment tu perçois l&apos;information),
              <strong className="text-zinc-300"> Pensée vs Sentiment</strong> (comment tu prends des décisions), et <strong className="text-zinc-300">Jugement vs Perception</strong> (comment
              tu organises ta vie). Le résultat : l&apos;un des 16 types comme INFJ, ENFP, INTJ, ou ESFP.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
