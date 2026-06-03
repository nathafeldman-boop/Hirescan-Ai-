import type { Metadata } from 'next';
import Link from 'next/link';
import { mbtiTypes, ALL_MBTI_TYPES } from '@/lib/mbti';

export const metadata: Metadata = {
  title: 'Les 16 Types de Personnalité — Guide Complet en Français',
  description: 'Découvre les 16 types de personnalité : INFJ, ENFP, INTJ, ISTP et les 12 autres. Guide complet en français : description, amour, carrière, compatibilité. Quel est ton type ?',
  keywords: ['16 types de personnalité', 'types mbti en français', 'INFJ ENFP INTJ', 'personnalité types', 'liste types psychologiques'],
  alternates: { canonical: 'https://ursecret.site/types' },
};

const GROUPS = [
  { label: 'Analystes', codes: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], desc: 'Penseurs rationnels et visionnaires' },
  { label: 'Diplomates', codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], desc: 'Idéalistes et empathiques' },
  { label: 'Sentinelles', codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], desc: 'Stables, fiables et organisés' },
  { label: 'Explorateurs', codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], desc: 'Spontanés et orientés action' },
];

export default function TypesPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Les 16 Types de Personnalité',
    numberOfItems: 16,
    itemListElement: ALL_MBTI_TYPES.map((code, i) => {
      const t = mbtiTypes[code];
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: `${code} — ${t.name}`,
        url: `https://ursecret.site/types/${code.toLowerCase()}`,
      };
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <main className="min-h-screen bg-[#09090b] text-white">
        <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
              <span className="text-white">Secret</span>
            </Link>
            <Link href="/quiz/personnalite" className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Passer le test →
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-white mb-3">Les 16 Types de Personnalité</h1>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
              Chaque personne est unique, mais nous partageons des patterns cognitifs. Découvre les 16 types
              et trouve le tien — ou passe le test gratuitement en 5 minutes.
            </p>
            <Link href="/quiz/personnalite"
              className="mt-6 inline-block px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)' }}>
              Découvrir mon type gratuitement →
            </Link>
          </div>

          {/* Groups */}
          <div className="space-y-10">
            {GROUPS.map(group => (
              <section key={group.label}>
                <div className="mb-4">
                  <h2 className="text-lg font-black text-white">{group.label}</h2>
                  <p className="text-xs text-zinc-500">{group.desc}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {group.codes.map(code => {
                    const t = mbtiTypes[code];
                    return (
                      <Link key={code} href={`/types/${code.toLowerCase()}`}
                        className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-2xl p-4 transition-all text-center">
                        <div className="text-3xl mb-2">{t.emoji}</div>
                        <div className="font-black text-white text-base mb-0.5">{code}</div>
                        <div className="text-xs font-medium mb-2" style={{ color: t.accentColor }}>{t.name}</div>
                        <div className="text-xs text-zinc-600">{t.rarity} pop.</div>
                        <div className="mt-3 text-xs text-zinc-500 leading-tight line-clamp-2">{t.tagline}</div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* SEO text */}
          <div className="mt-16 space-y-4 text-sm text-zinc-500 leading-relaxed">
            <h2 className="text-base font-bold text-white">Comprendre les 16 types de personnalité</h2>
            <p>
              Le modèle des 16 types de personnalité est basé sur la théorie des types psychologiques de Carl Jung,
              développée par Isabel Briggs Myers et Katharine Cook Briggs en indicateur de personnalité. Il analyse
              4 dimensions cognitives fondamentales qui, combinées, donnent 16 profils distincts.
            </p>
            <p>
              Les 4 dimensions : <strong className="text-zinc-300">E/I</strong> (Extraversion vs Introversion — source d&apos;énergie),
              <strong className="text-zinc-300"> S/N</strong> (Sensation vs Intuition — traitement de l&apos;information),
              <strong className="text-zinc-300"> T/F</strong> (Pensée vs Sentiment — prise de décision),
              <strong className="text-zinc-300"> J/P</strong> (Jugement vs Perception — style de vie).
            </p>
            <p>
              Chaque type a ses forces, ses angles morts, ses affinités relationnelles et ses environnements de
              travail idéaux. Ce n&apos;est pas une case dans laquelle t&apos;enfermer — c&apos;est un miroir.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
