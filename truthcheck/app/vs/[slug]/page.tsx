import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COMPARISON_PAGES, COMPARISON_SLUGS } from '@/lib/comparisonPages';

const BASE = 'https://urcecret.site';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return COMPARISON_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = COMPARISON_PAGES[params.slug];
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDesc,
    keywords: page.keywords,
    alternates: { canonical: `${BASE}/vs/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDesc,
      url: `${BASE}/vs/${page.slug}`,
      siteName: 'UrCecret',
      locale: 'fr_FR',
      type: 'article',
    },
  };
}

export default function ComparisonPage({ params }: PageProps) {
  const page = COMPARISON_PAGES[params.slug];
  if (!page) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
          { '@type': 'ListItem', position: 2, name: page.h1, item: `${BASE}/vs/${page.slug}` },
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
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-black text-white leading-tight mb-4">{page.h1}</h1>
            <p className="text-stone-400 text-base leading-relaxed">{page.intro}</p>
          </div>

          <div className="ur-panel-ink px-5 py-4 mb-8 text-sm text-stone-400 leading-relaxed" style={{ borderColor: 'var(--gold-line)' }}>
            <span className="font-bold text-white">Pour être honnête : </span>{page.fairnessNote}
          </div>

          <section className="mb-10 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 pr-3 text-stone-500 font-semibold"> </th>
                  <th className="text-left py-3 px-3 font-black" style={{ color: 'var(--gold)' }}>UrCecret</th>
                  <th className="text-left py-3 pl-3 text-stone-400 font-black">{page.otherName}</th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 align-top">
                    <td className="py-4 pr-3 text-stone-500 font-semibold whitespace-nowrap">{row.label}</td>
                    <td className="py-4 px-3 text-stone-200 leading-relaxed">{row.urcecret}</td>
                    <td className="py-4 pl-3 text-stone-500 leading-relaxed">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-4">En résumé</h2>
            <p className="text-stone-400 text-sm leading-relaxed">{page.verdict}</p>
          </section>

          <div className="rounded-2xl p-6 mb-10 text-center" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
            <p className="text-white font-black text-lg mb-2">Teste-le toi-même</p>
            <p className="text-stone-400 text-sm mb-5">Test gratuit, résultat immédiat, sans inscription.</p>
            <Link href="/quiz/personnalite" className="ur-btn-gold inline-flex px-8 py-3.5 text-sm">
              Faire le test →
            </Link>
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
        </div>
      </main>
    </>
  );
}
