import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mbtiTypes, ALL_MBTI_TYPES, MbtiType } from '@/lib/mbti';
import TypeClient from './TypeClient';
import UserMenu from '@/components/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function generateStaticParams() {
  return ALL_MBTI_TYPES.map(code => ({ type: code.toLowerCase() }));
}

interface Props { params: { type: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = params.type.toUpperCase();
  const t = mbtiTypes[code];
  if (!t) return { title: 'Type non trouvé' };
  return {
    title: `${code} — ${t.name} : Personnalité, Amour & Carrière`,
    description: `Découvre le type de personnalité ${code} (${t.name}). ${t.shortDesc.slice(0, 150)}... Gratuit, en français.`,
    keywords: [`${code} personnalité`, `type ${code}`, `${t.name.toLowerCase()}`, `personnalité ${code} en français`, 'test de personnalité 16 types'],
    alternates: { canonical: `https://urcecret.site/types/${params.type}` },
    openGraph: {
      title: `${code} — ${t.name} | UrCecret`,
      description: t.shortDesc.slice(0, 200),
      type: 'article',
      images: [{
        url: `https://urcecret.site/api/og?type=${code}`,
        width: 1200,
        height: 630,
        alt: `Type MBTI ${code} — ${t.name}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`https://urcecret.site/api/og?type=${code}`],
    },
  };
}

function FAQ({ type }: { type: MbtiType }) {
  const faqs = [
    { q: `Quelle est la personnalité ${type.code} ?`, a: type.shortDesc },
    { q: `Quel est le type de personnalité ${type.code} en amour ?`, a: type.inLove },
    { q: `Le type ${type.code} en carrière`, a: type.atWork },
    { q: `Quels sont les points forts du type ${type.code} ?`, a: type.strengths.join(', ') + '.' },
    { q: `Qui sont les célébrités ${type.code} ?`, a: `Des personnalités connues de type ${type.code} incluent : ${type.famousExamples.join(', ')}.` },
  ];
  return (
    <div className="mt-12 space-y-3">
      <h2 className="text-lg font-black text-white">Questions fréquentes — {type.code}</h2>
      {faqs.map(({ q, a }) => (
        <details key={q} className="group rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-zinc-300 list-none flex justify-between items-center hover:text-white transition-colors">
            {q}
            <span className="text-zinc-600 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <p className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">{a}</p>
        </details>
      ))}
    </div>
  );
}

export default function TypePage({ params }: Props) {
  const code = params.type.toUpperCase();
  const type = mbtiTypes[code];
  if (!type) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Quelle est la personnalité ${code} ?`, acceptedAnswer: { '@type': 'Answer', text: type.shortDesc } },
      { '@type': 'Question', name: `Type ${code} en amour`, acceptedAnswer: { '@type': 'Answer', text: type.inLove } },
      { '@type': 'Question', name: `Célébrités de type ${code}`, acceptedAnswer: { '@type': 'Answer', text: `Célébrités ${code} : ${type.famousExamples.join(', ')}.` } },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${code} — ${type.name} : Type de personnalité complet`,
    description: type.shortDesc,
    author: { '@type': 'Organization', name: 'UrCecret' },
    publisher: { '@type': 'Organization', name: 'UrCecret', url: 'https://urcecret.site' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main className="min-h-screen bg-[#09090b] text-white">
        {/* Background atmosphere */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-[0.08]" style={{ background: type.accentColor }} />
          <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full blur-3xl opacity-[0.06] bg-pink-600" />
        </div>

        <header className="relative z-10 sticky top-0" style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
              <span className="text-white">Cecret</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/types" className="text-xs text-zinc-500 hover:text-white transition-colors">← Tous les types</Link>
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{type.emoji}</div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: `${type.accentColor}20`, color: type.accentColor, border: `1px solid ${type.accentColor}40` }}>
              {type.rarity} de la population
            </div>
            <h1 className="text-3xl font-black text-white mb-2">
              {code} — {type.name}
            </h1>
            <p className="text-zinc-400 text-base italic">{type.tagline}</p>
          </div>

          {/* Breadcrumb */}
          <nav className="text-xs text-zinc-600 mb-8 flex gap-2 items-center">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/types" className="hover:text-zinc-300 transition-colors">Types</Link>
            <span>/</span>
            <span className="text-zinc-400">{code}</span>
          </nav>

          {/* Main client content (paywall etc.) */}
          <TypeClient type={type} />

          {/* FAQ — server-rendered for SEO */}
          <FAQ type={type} />

          {/* All types nav */}
          <div className="mt-12 pt-8 border-t border-white/6">
            <h2 className="text-sm font-bold text-zinc-500 mb-4">Explore les 16 types</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_MBTI_TYPES.map(c => (
                <Link key={c} href={`/types/${c.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    c === code
                      ? 'text-white border-violet-500 bg-violet-500'
                      : 'text-zinc-500 hover:text-white hover:border-white/30'
                  }`}
                  style={c !== code ? { borderColor: 'rgba(255,255,255,0.1)' } : {}}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
