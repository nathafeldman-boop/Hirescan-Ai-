import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mbtiTypes } from '@/lib/mbti-server';
import { getCompatibility, getAllPairs, parsePair } from '@/lib/compatibility';

const BASE = 'https://urcecret.site';

export function generateStaticParams() {
  return getAllPairs().map(({ pair }) => ({ pair }));
}

export async function generateMetadata({ params }: { params: { pair: string } }): Promise<Metadata> {
  const parsed = parsePair(params.pair);
  if (!parsed) return { title: 'Compatibilité MBTI | UrCecret' };
  const { codeA, codeB } = parsed;
  const A = mbtiTypes[codeA];
  const B = mbtiTypes[codeB];
  const compat = getCompatibility(codeA, codeB);
  const canonical = `${BASE}/compatibilite/${params.pair}`;
  const title = `Compatibilité ${codeA} et ${codeB} — ${A.name} & ${B.name} | UrCecret`;
  const description = `${codeA} et ${codeB} : compatibilité ${compat.labelEn.toLowerCase()} (${compat.score}/100). ${compat.inLoveSummary.slice(0, 100)}… Test MBTI gratuit.`;

  return {
    title,
    description,
    keywords: [
      `compatibilité ${codeA} ${codeB}`, `${codeA} ${codeB} compatibilité`,
      `${codeA} et ${codeB}`, `${A.name} ${B.name} compatibilité`,
      'compatibilité MBTI', 'compatibilité personnalité', 'MBTI couple',
      `compatibilité ${A.name}`, `compatibilité ${B.name}`,
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'UrCecret',
      locale: 'fr_FR',
      type: 'article',
      images: [{ url: '/api/og', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/api/og'],
    },
  };
}

export default function CompatibilitePage({ params }: { params: { pair: string } }) {
  const parsed = parsePair(params.pair);
  if (!parsed) notFound();
  const { codeA, codeB } = parsed;
  const A = mbtiTypes[codeA];
  const B = mbtiTypes[codeB];
  if (!A || !B) notFound();

  const compat = getCompatibility(codeA, codeB);

  // Note : on ne lit jamais A.compatibleWith ici (champ payant, lib/mbti-premium.ts)
  // — cette page est server-rendered et publique (SEO/FAQ schema). Le classement
  // ci-dessous est recalculé via le même score algorithmique que getCompatibility()
  // (fonctions cognitives, lettres partagées), pas une copie du contenu payant.
  const otherCompatibilities = Object.keys(mbtiTypes)
    .filter(c => c !== codeA && c !== codeB)
    .map(c => ({ code: c, score: getCompatibility(codeA, c).score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  // Un seul accent (l'or) — le degré de compatibilité se lit dans le score et
  // le label, pas dans un code couleur rouge/orange/vert générique.
  const scoreColor = 'var(--gold)';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${codeA} et ${codeB} sont-ils compatibles ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `La compatibilité ${codeA}/${codeB} est ${compat.label.toLowerCase()} avec un score de ${compat.score}/100. ${compat.inLoveSummary}`,
        },
      },
      {
        '@type': 'Question',
        name: `${codeA} et ${codeB} peuvent-ils former un couple ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: compat.inLoveSummary,
        },
      },
      {
        '@type': 'Question',
        name: `Quels sont les défis entre ${codeA} et ${codeB} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: compat.challenges.join(' '),
        },
      },
      {
        '@type': 'Question',
        name: `${codeA} et ${codeB} sont-ils compatibles au travail ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: compat.atWorkSummary,
        },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Compatibilité MBTI', item: `${BASE}/compatibilite` },
      { '@type': 'ListItem', position: 3, name: `${codeA} & ${codeB}`, item: `${BASE}/compatibilite/${params.pair}` },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Compatibilité MBTI : ${codeA} et ${codeB}`,
    description: `Analyse complète de la compatibilité entre ${A.name} (${codeA}) et ${B.name} (${codeB}) : amour, travail, défis et conseils.`,
    url: `${BASE}/compatibilite/${params.pair}`,
    author: { '@type': 'Organization', name: 'UrCecret', url: BASE },
    publisher: { '@type': 'Organization', name: 'UrCecret', url: BASE },
    inLanguage: 'fr',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main className="min-h-screen text-white" style={{ background: 'var(--ink)' }}>
        {/* Background atmosphere — teinte de chaque type, très discrète */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-[0.06]" style={{ background: A.accentColor }} />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-3xl opacity-[0.05]" style={{ background: B.accentColor }} />
        </div>

        {/* Nav */}
        <header className="relative z-10 sticky top-0" style={{ background: 'rgba(21,18,31,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line-ink)' }}>
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ color: 'var(--gold)' }}>Ur</span>
              <span className="text-white">Cecret</span>
            </Link>
            <nav className="flex items-center gap-4 text-xs text-zinc-400">
              <Link href="/types" className="hover:text-white transition-colors">Types</Link>
              <Link href="/quiz/personnalite" className="font-bold transition-colors" style={{ color: 'var(--gold)' }}>
                Passer le test →
              </Link>
            </nav>
          </div>
        </header>

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="text-xs text-zinc-600 mb-8 flex items-center gap-1.5">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/types" className="hover:text-zinc-400 transition-colors">Types</Link>
            <span>/</span>
            <span className="text-zinc-400">Compatibilité {codeA} & {codeB}</span>
          </nav>

          {/* Hero — score visual */}
          <section className="text-center mb-12">
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Type A */}
              <div className="text-center">
                <div className="text-4xl mb-1">{A.emoji}</div>
                <div className="font-black text-xl" style={{ color: A.accentColor }}>{codeA}</div>
                <div className="text-xs text-zinc-500">{A.name}</div>
              </div>

              {/* Score ring */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center rounded-full" style={{ border: `1px solid ${scoreColor}` }}>
                  <div>
                    <div className="font-display text-2xl font-black" style={{ color: scoreColor }}>{compat.score}</div>
                    <div className="text-[10px] text-zinc-500 -mt-1">/100</div>
                  </div>
                </div>
                <div className="mt-2 text-sm font-bold" style={{ color: scoreColor }}>{compat.label}</div>
              </div>

              {/* Type B */}
              <div className="text-center">
                <div className="text-4xl mb-1">{B.emoji}</div>
                <div className="font-black text-xl" style={{ color: B.accentColor }}>{codeB}</div>
                <div className="text-xs text-zinc-500">{B.name}</div>
              </div>
            </div>

            <h1 className="text-2xl font-black text-white mb-2">
              Compatibilité {codeA} et {codeB}
            </h1>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              {A.name} ({codeA}) & {B.name} ({codeB}) — analyse complète de la compatibilité en amour et au travail.
            </p>
          </section>

          {/* En amour */}
          <section className="ur-panel-ink mb-6 p-6">
            <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
              <span>💞</span> En amour
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">{compat.inLoveSummary}</p>
          </section>

          {/* Au travail */}
          <section className="ur-panel-ink mb-6 p-6">
            <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
              <span>💼</span> Au travail
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">{compat.atWorkSummary}</p>
          </section>

          {/* Forces partagées */}
          {compat.sharedStrengths.length > 0 && (
            <section className="mb-6 rounded-2xl p-6" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
              <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                <span>✨</span> Forces communes
              </h2>
              <div className="flex flex-wrap gap-2">
                {compat.sharedStrengths.map((s) => (
                  <span key={s} className="ur-badge text-zinc-100" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Défis */}
          <section className="ur-panel-ink mb-6 p-6">
            <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
              <span>⚡</span> Points de friction
            </h2>
            <ul className="space-y-2">
              {compat.challenges.map((c, i) => (
                <li key={i} className="text-sm text-zinc-400 flex gap-2">
                  <span className="text-zinc-600 shrink-0">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>

          {/* Tips */}
          <section className="ur-panel-ink mb-10 p-6">
            <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
              <span>💡</span> Conseils pour mieux vous comprendre
            </h2>
            <ul className="space-y-2">
              {compat.tips.map((tip, i) => (
                <li key={i} className="text-sm text-zinc-400 flex gap-2">
                  <span className="shrink-0" style={{ color: 'var(--gold)' }}>→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="mb-10 rounded-2xl p-6 text-center" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
            <p className="text-white font-bold mb-1">Découvre ton type MBTI</p>
            <p className="text-zinc-400 text-xs mb-4">24 questions · résultat instantané · gratuit</p>
            <Link
              href="/quiz/personnalite"
              className="ur-btn-gold inline-flex px-6 py-3 text-sm"
            >
              Passer le test gratuitement →
            </Link>
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-base font-black text-white mb-4">Questions fréquentes</h2>
            <div className="space-y-3">
              {faqSchema.mainEntity.map((item, i) => (
                <details key={i} className="ur-panel-ink rounded-xl group">
                  <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-zinc-200 list-none flex justify-between items-center">
                    {item.name}
                    <span className="text-zinc-600 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-zinc-400 leading-relaxed">{item.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Profiles links */}
          <section className="mb-10">
            <h2 className="text-base font-black text-white mb-4">Profils complets</h2>
            <div className="grid grid-cols-2 gap-3">
              {[{ code: codeA, type: A }, { code: codeB, type: B }].map(({ code, type }) => (
                <Link
                  key={code}
                  href={`/types/${code.toLowerCase()}`}
                  className="ur-panel-ink p-4 flex items-center gap-3 transition-all hover:scale-[1.01]"
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <div>
                    <div className="font-black text-sm" style={{ color: type.accentColor }}>{code}</div>
                    <div className="text-xs text-zinc-500">{type.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Other compatibilities grid */}
          <section className="mb-6">
            <h2 className="text-sm font-bold text-zinc-500 mb-3">Autres compatibilités {codeA}</h2>
            <div className="flex flex-wrap gap-2">
              {otherCompatibilities.map(({ code }) => {
                const pairSlug = [codeA, code].sort().map(s => s.toLowerCase()).join('-');
                return (
                  <Link
                    key={code}
                    href={`/compatibilite/${pairSlug}`}
                    className="ur-badge transition-all hover:scale-[1.02]"
                    style={{ background: 'var(--ink-soft)', border: '1px solid var(--line-ink)', color: 'var(--gold)' }}
                  >
                    {codeA} × {code}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SEO text */}
          <div className="mt-10 space-y-3 text-xs text-zinc-600 leading-relaxed">
            <h2 className="text-sm font-bold text-zinc-400">Compatibilité MBTI : {codeA} et {codeB}</h2>
            <p>
              La compatibilité entre {codeA} ({A.name}) et {codeB} ({B.name}) est analysée selon les fonctions cognitives
              de la théorie de Carl Jung. Le score de {compat.score}/100 reflète la complémentarité de leurs fonctions
              dominantes, auxiliaires et leur capacité à se comprendre mutuellement.
            </p>
            <p>
              Le modèle MBTI identifie 16 types de personnalité sur 4 dimensions : E/I, S/N, T/F, J/P.
              La compatibilité va au-delà des similitudes de surface — ce sont les fonctions cognitives
              partagées ou complémentaires qui déterminent la profondeur d&apos;une relation.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
