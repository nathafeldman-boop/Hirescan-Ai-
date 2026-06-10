import type { Metadata } from 'next';
import Link from 'next/link';
import { mbtiTypes, ALL_MBTI_TYPES } from '@/lib/mbti';
import UserMenu from '@/components/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata: Metadata = {
  title: 'Les 16 Types de Personnalité — Guide Complet en Français',
  description: 'Découvre les 16 types de personnalité : INFJ, ENFP, INTJ, ISTP et les 12 autres. Guide complet en français : description, amour, carrière, compatibilité. Quel est ton type ?',
  keywords: ['16 types de personnalité', 'types mbti en français', 'INFJ ENFP INTJ', 'personnalité types', 'liste types psychologiques'],
  alternates: { canonical: 'https://urcecret.site/types' },
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
        url: `https://urcecret.site/types/${code.toLowerCase()}`,
      };
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <main className="min-h-screen bg-white text-gray-900">
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
              <span className="text-gray-900">Cecret</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/quiz/personnalite" className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
                Passer le test →
              </Link>
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-gray-900 mb-3">Les 16 Types de Personnalité</h1>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
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
                  <h2 className="text-lg font-black text-gray-900">{group.label}</h2>
                  <p className="text-xs text-gray-500">{group.desc}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {group.codes.map(code => {
                    const t = mbtiTypes[code];
                    return (
                      <Link key={code} href={`/types/${code.toLowerCase()}`}
                        className="group bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-2xl p-4 transition-all text-center">
                        <div className="text-3xl mb-2">{t.emoji}</div>
                        <div className="font-black text-gray-900 text-base mb-0.5">{code}</div>
                        <div className="text-xs font-medium mb-2" style={{ color: t.accentColor }}>{t.name}</div>
                        <div className="text-xs text-gray-400">{t.rarity} pop.</div>
                        <div className="mt-3 text-xs text-gray-500 leading-tight line-clamp-2">{t.tagline}</div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* SEO text */}
          <div className="mt-16 space-y-4 text-sm text-gray-500 leading-relaxed">
            <h2 className="text-base font-bold text-gray-900">Comprendre les 16 types de personnalité</h2>
            <p>
              Le modèle des 16 types de personnalité est basé sur la théorie des types psychologiques de Carl Jung,
              développée par Isabel Briggs Myers et Katharine Cook Briggs en indicateur de personnalité. Il analyse
              4 dimensions cognitives fondamentales qui, combinées, donnent 16 profils distincts.
            </p>
            <p>
              Les 4 dimensions : <strong className="text-gray-700">E/I</strong> (Extraversion vs Introversion — source d&apos;énergie),
              <strong className="text-gray-700"> S/N</strong> (Sensation vs Intuition — traitement de l&apos;information),
              <strong className="text-gray-700"> T/F</strong> (Pensée vs Sentiment — prise de décision),
              <strong className="text-gray-700"> J/P</strong> (Jugement vs Perception — style de vie).
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
