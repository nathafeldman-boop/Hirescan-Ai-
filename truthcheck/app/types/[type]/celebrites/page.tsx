import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_MBTI_TYPES } from '@/lib/mbti';
// ⚠️ On importe QUE les champs gratuits ici — cette page est server-rendered
// et publique (SEO). famousExamples/compatibleWith sont payants
// (lib/mbti-premium.ts) et ne doivent jamais apparaître dans le HTML public ;
// voir CelebritesClient.tsx pour la version débloquée (post-paiement).
import { mbtiTypesFree as mbtiTypes } from '@/lib/mbti-free';
import { getCompatibility } from '@/lib/compatibility';
import CelebritesClient from './CelebritesClient';

// ─── Static generation pour les 16 types ────────────────────────────────────
export function generateStaticParams() {
  return ALL_MBTI_TYPES.map(code => ({ type: code.toLowerCase() }));
}

interface Props { params: { type: string } }

// ─── Métadonnées SEO ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = params.type.toUpperCase();
  const t = mbtiTypes[code];
  if (!t) return { title: 'Type non trouvé' };

  return {
    title: `Célébrités ${code} — Personnalités célèbres de type ${t.name} | UrCecret`,
    description: `Quelles célébrités sont de type ${code} ? Découvrez les personnalités connues qui partagent ce profil (${t.rarity} de la population) — leurs traits communs et ce qui les unit.`,
    keywords: [
      `célébrités ${code}`,
      `personnalités ${code}`,
      `${code} célèbres`,
      `personnalités connues ${code}`,
      `${t.name.toLowerCase()} célébrités`,
      `type ${code} personnalités`,
      `MBTI ${code} célébrités`,
      `qui est ${code}`,
    ],
    alternates: {
      canonical: `https://urcecret.site/types/${params.type}/celebrites`,
    },
    openGraph: {
      title: `Célébrités ${code} — Personnalités de type ${t.name} | UrCecret`,
      description: `Découvrez quelles célébrités partagent le profil ${code} (${t.name}) et ce qui les unit.`,
      type: 'article',
      images: [{
        url: `https://urcecret.site/api/og?type=${code}`,
        width: 1200,
        height: 630,
        alt: `Célébrités de type MBTI ${code} — ${t.name}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`https://urcecret.site/api/og?type=${code}`],
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CelebritesPage({ params }: Props) {
  const code = params.type.toUpperCase();
  const type = mbtiTypes[code];
  if (!type) notFound();

  const slug = params.type.toLowerCase();

  // Classement calculé via le même score algorithmique que getCompatibility()
  // (fonctions cognitives, lettres partagées) — pas le champ payant compatibleWith.
  const bestMatches = ALL_MBTI_TYPES
    .filter(c => c !== code)
    .map(c => ({ code: c, score: getCompatibility(code, c).score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(m => m.code);

  // ── Structured data ───────────────────────────────────────────────────────

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://urcecret.site' },
      { '@type': 'ListItem', position: 2, name: 'Types MBTI', item: 'https://urcecret.site/types' },
      { '@type': 'ListItem', position: 3, name: code, item: `https://urcecret.site/types/${slug}` },
      { '@type': 'ListItem', position: 4, name: `Célébrités ${code}`, item: `https://urcecret.site/types/${slug}/celebrites` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Quelle célébrité est de type ${code} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Plusieurs personnalités connues partagent le profil ${code}. Elles ont en commun les traits caractéristiques du type ${code} : ${type.traits.slice(0, 4).join(', ')}. La liste complète est disponible dans le profil débloqué.`,
        },
      },
      {
        '@type': 'Question',
        name: `Pourquoi ces célébrités sont-elles de type ${code} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Ces personnalités incarnent les traits fondamentaux du type ${code} — ${type.tagline}. ${type.shortDesc}`,
        },
      },
      {
        '@type': 'Question',
        name: `Les ${code} sont-ils rares ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Le type ${code} représente environ ${type.rarity} de la population mondiale. ${parseFloat(type.rarity) <= 3 ? `C'est l'un des types les plus rares parmi les 16 profils MBTI.` : `C'est un type présent dans une minorité de la population.`}`,
        },
      },
      {
        '@type': 'Question',
        name: `Comment savoir si je suis ${code} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Pour savoir si vous êtes de type ${code}, faites le test de personnalité MBTI gratuit sur UrCecret. En quelques minutes, répondez à nos questions et découvrez si vous partagez les traits des célébrités ${code}.`,
        },
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Célébrités ${code} — Les personnalités connues de type ${type.name}`,
    description: `Découvrez les personnalités connues de type MBTI ${code} et ce qui les unit.`,
    author: { '@type': 'Organization', name: 'UrCecret' },
    publisher: { '@type': 'Organization', name: 'UrCecret', url: 'https://urcecret.site' },
    about: {
      '@type': 'Thing',
      name: `Type de personnalité MBTI ${code}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main className="min-h-screen bg-[#09090b] text-white">

        {/* ── Atmosphère de fond ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.07]"
            style={{ background: type.accentColor }}
          />
          <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full blur-3xl opacity-[0.05] bg-pink-600" />
          <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl opacity-[0.04] bg-violet-600" />
        </div>

        {/* ── Navigation sticky ── */}
        <header
          className="relative z-10 sticky top-0"
          style={{
            background: 'rgba(9,9,11,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#d17d52,#e0a380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ur
              </span>
              <span className="text-white">Cecret</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={`/types/${slug}`}
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                ← Profil {code}
              </Link>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

          {/* ── Breadcrumb ── */}
          <nav className="text-xs text-zinc-600 mb-8 flex flex-wrap gap-1.5 items-center" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/types" className="hover:text-zinc-300 transition-colors">Types</Link>
            <span>/</span>
            <Link href={`/types/${slug}`} className="hover:text-zinc-300 transition-colors">{code}</Link>
            <span>/</span>
            <span className="text-zinc-400">Célébrités</span>
          </nav>

          {/* ── Hero ── */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4" role="img" aria-label={`Emoji ${type.name}`}>
              {type.emoji}
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                background: `${type.accentColor}20`,
                color: type.accentColor,
                border: `1px solid ${type.accentColor}40`,
              }}
            >
              <span>{type.rarity} de la population</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-3 leading-tight">
              Célébrités {code} — Les personnalités connues de type {type.name}
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed max-w-lg mx-auto">
              {type.rarity} de la population est {code}. Ces personnalités partagent{' '}
              <span style={{ color: type.accentColor }} className="font-semibold">
                {type.tagline.toLowerCase()}
              </span>.
            </p>
          </div>

          {/* ── Célébrités — dark glass cards ── */}
          <section aria-labelledby="celebrites-heading" className="mb-10">
            <h2
              id="celebrites-heading"
              className="text-lg font-black text-white mb-5 flex items-center gap-2"
            >
              <span
                className="inline-block w-1.5 h-5 rounded-full"
                style={{ background: type.accentColor }}
                aria-hidden="true"
              />
              Personnalités célèbres de type {code}
            </h2>

            <CelebritesClient code={code} accentColor={type.accentColor} />
          </section>

          {/* ── Ce qui les unit — traits communs ── */}
          <section
            aria-labelledby="traits-heading"
            className="mb-10 rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h2
              id="traits-heading"
              className="text-lg font-black text-white mb-2 flex items-center gap-2"
            >
              <span
                className="inline-block w-1.5 h-5 rounded-full"
                style={{ background: type.accentColor }}
                aria-hidden="true"
              />
              Ce qui les unit
            </h2>
            <p className="text-zinc-500 text-sm mb-5">
              Les traits caractéristiques que partagent toutes ces personnalités {code}
            </p>
            <div className="flex flex-wrap gap-2">
              {type.traits.map(trait => (
                <span
                  key={trait}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: `${type.accentColor}15`,
                    color: type.accentColor,
                    border: `1px solid ${type.accentColor}35`,
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </section>

          {/* ── Profil du type ── */}
          <section
            aria-labelledby="profil-heading"
            className="mb-10 rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h2
              id="profil-heading"
              className="text-lg font-black text-white mb-4 flex items-center gap-2"
            >
              <span
                className="inline-block w-1.5 h-5 rounded-full"
                style={{ background: type.accentColor }}
                aria-hidden="true"
              />
              Le profil {code} — {type.name}
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed mb-5">
              {type.shortDesc}
            </p>
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/6">
              <Link
                href={`/types/${slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Profil complet {code} →
              </Link>
              {bestMatches.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-zinc-600">Compatible avec :</span>
                  {bestMatches.map(c => (
                    <Link
                      key={c}
                      href={`/types/${c.toLowerCase()}`}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold text-zinc-400 hover:text-white transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── CTA — Découvrir mon type MBTI ── */}
          <section
            aria-label="Découvrir mon type de personnalité"
            className="mb-10 rounded-2xl p-7 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(169,78,24,0.15) 0%, rgba(209,125,82,0.12) 100%)',
              border: '1px solid rgba(194,97,31,0.3)',
            }}
          >
            <div className="text-3xl mb-3" aria-hidden="true">{type.emoji}</div>
            <h2 className="text-xl font-black text-white mb-2">
              Et toi, es-tu {code} ?
            </h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Partages-tu les traits des célébrités {code} ?
              Fais le test gratuit pour découvrir ton vrai type MBTI — 24 questions, résultat instantané.
            </p>
            <Link
              href="/quiz/personnalite"
              className="inline-block px-8 py-4 rounded-xl font-black text-white text-base transition-all hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg,#a94e18,#d17d52)',
                boxShadow: '0 6px 28px rgba(169,78,24,0.4)',
              }}
            >
              Découvrir mon type MBTI — Gratuit
            </Link>
            <p className="text-zinc-600 text-xs mt-4">
              Gratuit · 5 minutes · Résultat immédiat
            </p>
          </section>

          {/* ── FAQ Schema ── */}
          <section aria-labelledby="faq-heading" className="mb-12">
            <h2
              id="faq-heading"
              className="text-lg font-black text-white mb-4"
            >
              Questions fréquentes sur les célébrités {code}
            </h2>
            <div className="space-y-3">

              <details
                className="group rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-zinc-300 list-none flex justify-between items-center hover:text-white transition-colors">
                  Quelle célébrité est de type {code} ?
                  <span className="text-zinc-600 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">▾</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                  Plusieurs personnalités célèbres partagent le profil {code} — la liste complète est
                  disponible dans le profil débloqué. Ces personnalités incarnent les traits
                  caractéristiques du type {code} :{' '}
                  {type.traits.slice(0, 4).join(', ')}.
                </p>
              </details>

              <details
                className="group rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-zinc-300 list-none flex justify-between items-center hover:text-white transition-colors">
                  Pourquoi ces célébrités sont-elles de type {code} ?
                  <span className="text-zinc-600 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">▾</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                  Ces personnalités incarnent la vision du type {code} — {type.tagline.toLowerCase()}.{' '}
                  {type.shortDesc}
                </p>
              </details>

              <details
                className="group rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-zinc-300 list-none flex justify-between items-center hover:text-white transition-colors">
                  Les {code} sont-ils rares ?
                  <span className="text-zinc-600 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">▾</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                  Le type {code} représente environ{' '}
                  <strong className="text-zinc-300">{type.rarity} de la population mondiale</strong>.{' '}
                  Parmi les 16 types MBTI, c'est un profil{' '}
                  {parseFloat(type.rarity) <= 3
                    ? 'particulièrement rare'
                    : parseFloat(type.rarity) <= 7
                      ? 'relativement peu commun'
                      : 'assez répandu'
                  }.
                </p>
              </details>

              <details
                className="group rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-zinc-300 list-none flex justify-between items-center hover:text-white transition-colors">
                  Comment savoir si je suis de type {code} ?
                  <span className="text-zinc-600 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">▾</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                  <p className="mb-3">
                    Pour savoir si vous êtes de type {code}, faites le{' '}
                    <Link href="/quiz/personnalite" className="underline decoration-dotted hover:text-white transition-colors" style={{ color: type.accentColor }}>
                      test de personnalité MBTI gratuit sur UrCecret
                    </Link>.
                    En quelques minutes, répondez à nos 24 questions et découvrez si vous partagez
                    les traits des célébrités {code}.
                  </p>
                  <p>
                    Les {code} se reconnaissent souvent à leur tendance à être{' '}
                    {type.traits.slice(0, 3).join(', ')}.
                  </p>
                </div>
              </details>

            </div>
          </section>

          {/* ── Navigation vers tous les types ── */}
          <div className="pt-8 border-t border-white/6">
            <h2 className="text-sm font-bold text-zinc-500 mb-4">
              Célébrités des autres types MBTI
            </h2>
            <div className="flex flex-wrap gap-2">
              {ALL_MBTI_TYPES.map(c => (
                <Link
                  key={c}
                  href={`/types/${c.toLowerCase()}/celebrites`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    c === code
                      ? 'text-white border-transparent'
                      : 'text-zinc-500 hover:text-white hover:border-white/30'
                  }`}
                  style={
                    c === code
                      ? { background: type.accentColor, borderColor: 'transparent' }
                      : { borderColor: 'rgba(255,255,255,0.1)' }
                  }
                  aria-current={c === code ? 'page' : undefined}
                >
                  {c}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/types"
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline decoration-dotted"
              >
                Voir les profils complets des 16 types →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
