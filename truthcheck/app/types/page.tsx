import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_MBTI_TYPES } from '@/lib/mbti';
import { mbtiTypes } from '@/lib/mbti-server';
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

      <main className="min-h-screen" style={{ background: '#f7f3ec', color: '#2b2622' }}>

        <header className="sticky top-0 z-20" style={{ background: 'rgba(247,243,236,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e8e0d4' }}>
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-black text-stone-900">
              Ur<span style={{ color: '#c2611f' }}>Cecret</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/quiz/personnalite" className="text-xs font-bold transition-colors" style={{ color: '#c2611f' }}>
                Passer le test →
              </Link>
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl font-black text-stone-900 mb-3">Les 16 Types de Personnalité</h1>
            <p className="text-stone-500 max-w-xl mx-auto text-sm leading-relaxed">
              Chaque personne est unique, mais nous partageons des patterns cognitifs. Découvre les 16 types
              et trouve le tien — ou passe le test gratuitement en 5 minutes.
            </p>
            <Link href="/quiz/personnalite"
              className="mt-6 inline-block px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 6px 24px rgba(169,78,24,0.3)' }}>
              Découvrir mon type gratuitement →
            </Link>
          </div>

          {/* Groups */}
          <div className="space-y-10">
            {GROUPS.map(group => (
              <section key={group.label}>
                <div className="mb-4">
                  <h2 className="font-display text-lg font-black text-stone-900">{group.label}</h2>
                  <p className="text-xs text-stone-400">{group.desc}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {group.codes.map(code => {
                    const t = mbtiTypes[code];
                    return (
                      <Link key={code} href={`/types/${code.toLowerCase()}`}
                        className="group rounded-2xl p-4 transition-all text-center hover:scale-[1.02]"
                        style={{ background: '#ffffff', border: '1px solid #e8e0d4', boxShadow: '0 1px 4px rgba(43,38,34,0.06)' }}>
                        <div className="text-3xl mb-2">{t.emoji}</div>
                        <div className="font-display font-black text-stone-900 text-base mb-0.5">{code}</div>
                        <div className="text-xs font-medium mb-2" style={{ color: t.accentColor }}>{t.name}</div>
                        <div className="text-xs text-stone-400">{t.rarity} pop.</div>
                        <div className="mt-3 text-xs text-stone-400 leading-tight line-clamp-2">{t.tagline}</div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* SEO text */}
          <div className="mt-16 space-y-4 text-sm text-stone-500 leading-relaxed">
            <h2 className="font-display text-base font-bold text-stone-900">Comprendre les 16 types de personnalité</h2>
            <p>
              Le modèle des 16 types de personnalité est basé sur la théorie des types psychologiques de Carl Jung,
              développée par Isabel Briggs Myers et Katharine Cook Briggs en indicateur de personnalité. Il analyse
              4 dimensions cognitives fondamentales qui, combinées, donnent 16 profils distincts.
            </p>
            <p>
              Les 4 dimensions : <strong className="text-stone-700">E/I</strong> (Extraversion vs Introversion — source d&apos;énergie),
              <strong className="text-stone-700"> S/N</strong> (Sensation vs Intuition — traitement de l&apos;information),
              <strong className="text-stone-700"> T/F</strong> (Pensée vs Sentiment — prise de décision),
              <strong className="text-stone-700"> J/P</strong> (Jugement vs Perception — style de vie).
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
