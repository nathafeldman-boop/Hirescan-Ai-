import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PAIN_PAGES, PAIN_SLUGS } from '@/lib/painPages';

const BASE = 'https://urcecret.site';

interface PageProps {
  params: { pain: string };
}

export function generateStaticParams() {
  return PAIN_SLUGS.map((pain) => ({ pain }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = PAIN_PAGES[params.pain];
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDesc,
    keywords: page.keywords,
    alternates: { canonical: `${BASE}/comprendre/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDesc,
      url: `${BASE}/comprendre/${page.slug}`,
      siteName: 'UrCecret',
      locale: 'fr_FR',
      type: 'article',
    },
  };
}

export default function ComprendrePage({ params }: PageProps) {
  const page = PAIN_PAGES[params.pain];
  if (!page) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
          { '@type': 'ListItem', position: 2, name: page.h1, item: `${BASE}/comprendre/${page.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': 'Article',
        headline: page.h1,
        description: page.metaDesc,
        url: `${BASE}/comprendre/${page.slug}`,
        inLanguage: 'fr',
        publisher: { '@type': 'Organization', name: 'UrCecret', url: BASE },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen text-white" style={{ background: 'var(--ink)' }}>
        <header className="border-b border-white/5 sticky top-0 z-20" style={{ background: 'rgba(21,18,31,0.9)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-black">
              <span style={{ color: 'var(--gold)' }}>Ur</span>
              <span className="text-white">Cecret</span>
            </Link>
            <Link href="/quiz/personnalite" className="text-xs text-stone-500 hover:text-white transition-colors">
              Faire le test →
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{page.emoji}</div>
            <h1 className="font-display text-3xl font-black text-white leading-tight mb-4">{page.h1}</h1>
            <p className="text-stone-400 text-base leading-relaxed">{page.intro}</p>
          </div>

          <section className="mb-10">
            <h2 className="font-display text-xl font-black text-white mb-5">{page.sectionTitle}</h2>
            <div className="space-y-3">
              {page.section.map((item, i) => (
                <div key={i} className="ur-panel-ink px-5 py-4 text-sm text-stone-300 leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-4">{page.actionTitle}</h2>
            <p className="text-stone-400 text-sm leading-relaxed">{page.action}</p>
          </section>

          <div
            className="rounded-2xl p-6 mb-10 text-center border"
            style={{ background: `${page.accentColor}18`, borderColor: `${page.accentColor}40` }}
          >
            <p className="text-white font-black text-lg mb-2">{page.emoji} Envie d&apos;aller plus loin ?</p>
            <p className="text-stone-400 text-sm mb-5">
              Le test de personnalité UrCecret + un coach IA (Elio) qui garde ton objectif en tête, chaque jour.
            </p>
            <Link
              href="/quiz/personnalite"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${page.accentColor}cc, ${page.accentColor})` }}
            >
              {page.ctaText}
            </Link>
            {page.relatedQuiz && (
              <p className="mt-4 text-xs text-stone-500">
                Ou fais d&apos;abord :{' '}
                <Link href={`/quiz/${page.relatedQuiz.slug}`} className="underline hover:text-white transition-colors">
                  {page.relatedQuiz.label}
                </Link>
              </p>
            )}
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {page.faqs.map(({ q, a }, i) => (
                <div key={i} className="ur-panel-ink overflow-hidden">
                  <h3 className="px-5 py-4 text-white font-bold text-sm leading-snug">{q}</h3>
                  <p className="px-5 pb-4 text-stone-400 text-sm leading-relaxed border-t border-white/5 pt-3">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center py-8 border-t border-white/5">
            <p className="text-stone-500 text-sm mb-4">Explorer une autre difficulté</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.values(PAIN_PAGES).filter((p) => p.slug !== page.slug).map((p) => (
                <Link
                  key={p.slug}
                  href={`/comprendre/${p.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-400 hover:text-white transition-colors border border-white/8 bg-white/[0.03]"
                >
                  {p.emoji} {p.h1.replace('Comment ', '')}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
