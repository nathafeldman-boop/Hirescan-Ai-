import type { Metadata } from 'next';
import HomeClient from './HomeClient';

const BASE = 'https://ursecret.vercel.app';

export const metadata: Metadata = {
  title: 'UrSecret — Découvre la vérité que tu ressens',
  description:
    'UrSecret : des questionnaires anonymes pour savoir si ton/ta partenaire te trompe, si tu es adopté(e), si vous êtes vraiment amis. Résultats instantanés, 100% gratuit.',
  openGraph: {
    title: 'UrSecret — Découvre la vérité que tu ressens',
    description: 'Des questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille. 100% gratuit, résultats instantanés.',
    url: BASE,
    siteName: 'UrSecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrSecret — Tes vraies réponses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrSecret — Découvre la vérité que tu ressens',
    description: 'Des questionnaires anonymes. 100% gratuit.',
    images: ['/api/og'],
  },
  alternates: { canonical: BASE },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'UrSecret',
      description: 'Questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille',
      inLanguage: 'fr',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/quizzes` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'UrSecret',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/favicon.svg`, width: 512, height: 512 },
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: 'French' },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <noscript>
        <main style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff', background: '#09090b', minHeight: '100vh' }}>
          <h1>UrSecret — Tes vraies réponses</h1>
          <p>Des questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille.</p>
          <ul>
            <li><a href="/quiz/infidelite" style={{ color: '#a78bfa' }}>💔 Mon/Ma partenaire me trompe ?</a></li>
            <li><a href="/quiz/adopte" style={{ color: '#a78bfa' }}>🔍 Suis-je adopté(e) ?</a></li>
            <li><a href="/quiz/amoureux" style={{ color: '#a78bfa' }}>💫 Suis-je vraiment amoureux ?</a></li>
            <li><a href="/quiz/vrais-amis" style={{ color: '#a78bfa' }}>🫂 Sont-ils mes vrais amis ?</a></li>
            <li><a href="/quiz/orientation" style={{ color: '#a78bfa' }}>🌈 Quelle est mon orientation ?</a></li>
          </ul>
          <p>100% anonyme · Zéro compte requis · Résultats instantanés</p>
        </main>
      </noscript>
      <HomeClient />
    </>
  );
}
