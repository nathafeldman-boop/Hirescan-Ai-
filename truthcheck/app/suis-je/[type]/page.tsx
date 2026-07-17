import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_MBTI_TYPES } from '@/lib/mbti';
// ⚠️ On importe QUE les champs gratuits ici — cette page est server-rendered
// et publique (SEO). inLove/atWork/strengths/famousExamples/compatibleWith
// sont payants (lib/mbti-premium.ts) et ne doivent jamais apparaître dans le
// HTML public ; voir SuisJePremiumSections.tsx pour la version débloquée
// (post-paiement, chargée côté client après vérification serveur).
import { mbtiTypesFree as mbtiTypes, MbtiTypeFree } from '@/lib/mbti-free';
import SuisJePremiumSections from './SuisJePremiumSections';

// ─── Static generation ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return ALL_MBTI_TYPES.map(code => ({ type: code.toLowerCase() }));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  params: { type: string };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = params.type.toUpperCase();
  const t = mbtiTypes[code];
  if (!t) return { title: 'Type non trouvé' };

  const rarityLabel = `${t.rarity} de la population`;

  return {
    title: `Suis-je ${code} ? 8 signes que tu es ${t.name} | UrCecret`,
    description: `Tu penses souvent que tu es différent(e) des autres ? Découvre les 8 caractéristiques qui définissent les ${code} — ${t.name}, ${rarityLabel}. ${t.shortDesc.slice(0, 100)}...`,
    keywords: [
      `suis-je ${code}`,
      `suis-je ${code} ?`,
      `suis-je ${t.name.toLowerCase()}`,
      `comment savoir si je suis ${code}`,
      `signes que tu es ${code}`,
      `${code} personnalité`,
      `type ${code} MBTI`,
      `${t.name.toLowerCase()} personnalité`,
      'test MBTI gratuit',
      'type de personnalité',
    ],
    alternates: { canonical: `https://urcecret.site/suis-je/${params.type.toLowerCase()}` },
    openGraph: {
      title: `Suis-je ${code} ? 8 signes que tu es ${t.name} | UrCecret`,
      description: `${t.shortDesc.slice(0, 200)}`,
      type: 'article',
      url: `https://urcecret.site/suis-je/${params.type.toLowerCase()}`,
      siteName: 'UrCecret',
      locale: 'fr_FR',
      images: [
        {
          url: `https://urcecret.site/api/og?type=${code}`,
          width: 1200,
          height: 630,
          alt: `Suis-je ${code} — ${t.name} | UrCecret`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Suis-je ${code} ? 8 signes que tu es ${t.name}`,
      description: t.shortDesc.slice(0, 160),
      images: [`https://urcecret.site/api/og?type=${code}`],
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Transforme un trait en signe "Si tu…" ou "Tu…" conversationnel */
function traitToSign(trait: string, index: number): string {
  const openings = [
    `Tu es profondément`,
    `Tu te reconnais dans le fait d'être`,
    `Les autres te décrivent souvent comme`,
    `Tu ressens le besoin d'être`,
    `On te dit souvent que tu es`,
    `Tu fonctionnes naturellement de façon`,
    `Tu te considères toi-même comme`,
    `Tu as tendance à être`,
  ];
  const opening = openings[index % openings.length];
  return `${opening} ${trait.toLowerCase()}.`;
}

// ─── FAQ données par type ─────────────────────────────────────────────────────

// ⚠️ N'utilise QUE des champs gratuits — cette FAQ est server-rendered et
// publique (SEO/JSON-LD). Le détail amour/carrière/célébrités/compatibilité
// est payant (lib/mbti-premium.ts) : on y renvoie sans jamais le citer.
function buildFaqs(t: MbtiTypeFree): { q: string; a: string }[] {
  return [
    {
      q: `Suis-je vraiment ${t.code} ?`,
      a: `Pour savoir si tu es ${t.code} (${t.name}), identifie-toi aux traits suivants : ${t.traits.join(', ')}. ${t.shortDesc} Si ces descriptions résonnent profondément avec qui tu es, tu es très probablement ${t.code}.`,
    },
    {
      q: `Le ${t.code} en amour, au travail et en compatibilité`,
      a: `Le profil complet ${t.code} (amour, carrière, face cachée, célébrités du même profil, compatibilité) est disponible après déblocage, pour 1,99 €.`,
    },
  ];
}

// ─── Composants serveur ───────────────────────────────────────────────────────

function SignsSection({ type }: { type: MbtiTypeFree }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-black text-white mb-5">
        8 signes que tu es {type.name} ({type.code})
      </h2>
      <div className="space-y-3">
        {type.traits.map((trait, i) => (
          <div
            key={trait}
            className="ur-panel-ink flex items-start gap-4 px-5 py-4"
          >
            <span
              className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
              style={{
                background: `${type.accentColor}20`,
                color: type.accentColor,
                border: `1px solid ${type.accentColor}40`,
              }}
            >
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">{trait}</p>
              <p className="text-sm text-stone-400 leading-relaxed">{traitToSign(trait, i)}</p>
            </div>
          </div>
        ))}
        {/* Signes supplémentaires : réservés au profil débloqué (forces
            détaillées, lib/mbti-premium.ts) — jamais rendus ici en clair,
            juste un teaser verrouillé façon TypeClient.tsx. */}
        {type.traits.length < 8 &&
          Array.from({ length: 8 - type.traits.length }).map((_, i) => {
            const idx = type.traits.length + i;
            return (
              <div
                key={`locked-${idx}`}
                className="ur-panel-ink flex items-start gap-4 px-5 py-4"
              >
                <span
                  className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: `${type.accentColor}20`, color: type.accentColor, border: `1px solid ${type.accentColor}40` }}
                >
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-500 ur-cut select-none pointer-events-none">Signe verrouillé</p>
                  <p className="text-sm text-stone-600">Dans le profil {type.code} complet.</p>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

function DefinitionSection({ type }: { type: MbtiTypeFree }) {
  return (
    <section className="ur-panel-ink mb-10 px-6 py-6">
      <h2 className="font-display text-lg font-black text-white mb-3">
        Ce qui te définit en tant que {type.code}
      </h2>
      <p className="text-sm text-stone-300 leading-relaxed">{type.shortDesc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {type.traits.map(trait => (
          <span
            key={trait}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${type.accentColor}15`,
              color: type.accentColor,
              border: `1px solid ${type.accentColor}30`,
            }}
          >
            {trait}
          </span>
        ))}
      </div>
    </section>
  );
}

// Note : les sections "en amour", "au travail" et "célébrités" sont payantes
// (lib/mbti-premium.ts) — voir SuisJePremiumSections.tsx, chargé côté client
// uniquement après vérification serveur du paiement.

function CtaCard({ type }: { type: MbtiTypeFree }) {
  return (
    <section className="mb-10">
      <div
        className="rounded-2xl px-6 py-8 text-center"
        style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}
      >
        <div className="text-4xl mb-3">{type.emoji}</div>
        <h2 className="font-display text-xl font-black text-white mb-2">
          Découvre ton type exact
        </h2>
        <p className="text-sm text-stone-400 mb-6 max-w-xs mx-auto">
          Tu penses être {type.code} ? Confirme-le avec notre test MBTI complet — 24 questions, résultat instantané, gratuit.
        </p>
        <Link
          href="/quiz/personnalite"
          className="ur-btn-gold inline-flex px-8 py-3.5 text-sm"
        >
          Passer le test MBTI gratuit →
        </Link>
        <p className="mt-3 text-xs text-stone-600">24 questions · Gratuit · Sans inscription</p>
      </div>
    </section>
  );
}

function FaqSection({ type }: { type: MbtiTypeFree }) {
  const faqs = buildFaqs(type);
  return (
    <section className="mb-10">
      <h2 className="font-display text-lg font-black text-white mb-4">
        Questions fréquentes — Suis-je {type.code} ?
      </h2>
      <div className="space-y-3">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="ur-panel-ink group"
          >
            <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-stone-300 list-none flex justify-between items-center hover:text-white transition-colors">
              <span>{q}</span>
              <span className="text-stone-600 ml-4 flex-shrink-0 group-open:rotate-180 transition-transform duration-200">
                ▾
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm text-stone-400 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function RelatedTypesSection({ type }: { type: MbtiTypeFree }) {
  return (
    <section className="mb-10 pt-8 border-t border-white/[0.06]">
      <h2 className="text-sm font-bold text-stone-500 mb-4">Explore aussi</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_MBTI_TYPES.map(c => (
          <Link
            key={c}
            href={`/suis-je/${c.toLowerCase()}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              c === type.code
                ? 'text-white'
                : 'text-stone-500 hover:text-white hover:border-white/30'
            }`}
            style={
              c === type.code
                ? {
                    background: type.accentColor,
                    borderColor: type.accentColor,
                  }
                : { borderColor: 'var(--line-ink)' }
            }
          >
            Suis-je {c} ?
          </Link>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        <Link
          href={`/types/${type.code.toLowerCase()}`}
          className="text-xs text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2"
        >
          Profil complet {type.code} →
        </Link>
        <Link
          href="/types"
          className="text-xs text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2"
        >
          Tous les 16 types →
        </Link>
        <Link
          href="/quiz/personnalite"
          className="text-xs text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2"
        >
          Passer le test MBTI →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="py-8 text-center"
      style={{ borderTop: '1px solid var(--line-ink)' }}
    >
      <Link href="/" className="text-lg font-black">
        <span style={{ color: 'var(--gold)' }}>Ur</span>
        <span className="text-white">Cecret</span>
      </Link>
      <p className="mt-2 text-xs text-stone-600">
        Test de personnalité MBTI gratuit · 16 types · En français
      </p>
      <div className="mt-4 flex justify-center gap-4 text-xs text-stone-700">
        <Link href="/types" className="hover:text-stone-400 transition-colors">
          Types MBTI
        </Link>
        <Link href="/quiz/personnalite" className="hover:text-stone-400 transition-colors">
          Test MBTI
        </Link>
        <Link href="/cgu" className="hover:text-stone-400 transition-colors">
          CGU
        </Link>
        <Link href="/politique-confidentialite" className="hover:text-stone-400 transition-colors">
          Confidentialité
        </Link>
      </div>
    </footer>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SuisJePage({ params }: Props) {
  const code = params.type.toUpperCase();
  const type = mbtiTypes[code];
  if (!type) notFound();

  const slug = params.type.toLowerCase();

  // ── Schéma FAQ ──────────────────────────────────────────────────────────────
  const faqs = buildFaqs(type);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // ── Schéma BreadcrumbList ───────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://urcecret.site',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Suis-je ?',
        item: 'https://urcecret.site/suis-je',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Suis-je ${code} ?`,
        item: `https://urcecret.site/suis-je/${slug}`,
      },
    ],
  };

  // ── Schéma Article ──────────────────────────────────────────────────────────
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Suis-je ${code} ? 8 signes que tu es ${type.name}`,
    description: type.shortDesc,
    author: { '@type': 'Organization', name: 'UrCecret', url: 'https://urcecret.site' },
    publisher: {
      '@type': 'Organization',
      name: 'UrCecret',
      url: 'https://urcecret.site',
      logo: { '@type': 'ImageObject', url: 'https://urcecret.site/logo-oracle.png' },
    },
    url: `https://urcecret.site/suis-je/${slug}`,
    mainEntityOfPage: `https://urcecret.site/suis-je/${slug}`,
    about: {
      '@type': 'Thing',
      name: `Type de personnalité MBTI ${code} — ${type.name}`,
    },
  };

  return (
    <>
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="min-h-screen text-white" style={{ background: 'var(--ink)' }}>
        {/* Ambiance background — teinte du type, très discrète */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-[0.06]"
            style={{ background: type.accentColor }}
          />
        </div>

        {/* Nav sticky */}
        <header
          className="relative z-20 sticky top-0"
          style={{
            background: 'rgba(21,18,31,0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--line-ink)',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-black">
              <span style={{ color: 'var(--gold)' }}>Ur</span>
              <span className="text-white">Cecret</span>
            </Link>
            <Link
              href="/quiz/personnalite"
              className="ur-btn-gold px-4 py-2 text-xs"
            >
              Test MBTI gratuit
            </Link>
          </div>
        </header>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="text-xs text-stone-600 mb-8 flex gap-2 items-center flex-wrap">
            <Link href="/" className="hover:text-stone-300 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-stone-500">Suis-je ?</span>
            <span>/</span>
            <span className="text-stone-400">{code}</span>
          </nav>

          {/* Hero header */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">{type.emoji}</div>
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                background: `${type.accentColor}20`,
                color: type.accentColor,
                border: `1px solid ${type.accentColor}40`,
              }}
            >
              {type.rarity} de la population
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
              Suis-je{' '}
              <span style={{ color: type.accentColor }}>
                {code}
              </span>{' '}
              ?
            </h1>
            <p className="text-lg font-semibold text-stone-300 mb-2">
              {type.name}
            </p>
            <p className="text-sm text-stone-500 italic">{type.tagline}</p>
          </div>

          {/* Intro rapide */}
          <div
            className="mb-8 rounded-2xl px-6 py-5"
            style={{
              background: `${type.accentColor}10`,
              border: `1px solid ${type.accentColor}25`,
            }}
          >
            <p className="text-sm text-stone-300 leading-relaxed">
              {type.shortDesc}
            </p>
          </div>

          {/* 8 signes */}
          <SignsSection type={type} />

          {/* Ce qui te définit */}
          <DefinitionSection type={type} />

          {/* CTA milieu de page */}
          <CtaCard type={type} />

          {/* Amour, travail, célébrités, compatibilité — payant, débloqué
              côté client après vérification serveur du paiement */}
          <SuisJePremiumSections code={type.code} />

          {/* Lien vers profil complet */}
          <div className="ur-panel-ink mb-10 px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Profil {code} complet</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Forces, faiblesses, croissance, analyse approfondie
              </p>
            </div>
            <Link
              href={`/types/${slug}`}
              className="ur-btn-outline flex-shrink-0 px-4 py-2 text-xs"
            >
              Voir →
            </Link>
          </div>

          {/* FAQ */}
          <FaqSection type={type} />

          {/* Liens internes vers les autres types */}
          <RelatedTypesSection type={type} />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </>
  );
}
