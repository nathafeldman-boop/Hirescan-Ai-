import type { Metadata } from 'next';
import HomeClient from './HomeClient';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'UrCecret — Test MBTI Gratuit & Quiz Vérité Anonymes',
  description: 'Découvre ton type MBTI en 24 questions (INFJ, ENFP, INTJ…) + 15 quiz anonymes sur l\'infidélité, l\'amour et tes amis. Résultats instantanés, sans inscription.',
  keywords: [
    'UrCecret', 'urcecret', 'urcecret.site',
    'test MBTI', 'MBTI gratuit', 'test de personnalité gratuit', '16 types personnalité',
    'test personnalité MBTI', 'type MBTI', 'MBTI français', 'personnalité INFJ',
    'personnalité ENFP', 'personnalité INTJ', 'personnalité INTP', 'quel est mon type MBTI',
    'quiz infidélité', 'quiz vérité', 'quiz anonyme', 'quiz couple', 'quiz amour',
    'test personnalité', 'profil psychologique', 'quiz personnalité', '16 personnalités MBTI',
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: 'UrCecret — Test MBTI Gratuit & Quiz Vérité Anonymes',
    description: 'Découvre ton type MBTI en 24 questions + 15 quiz anonymes sur l\'infidélité, l\'amour et tes amis. Gratuit, instantané, sans inscription.',
    url: BASE,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrCecret — Test MBTI Gratuit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrCecret — Test MBTI Gratuit & Quiz Vérité',
    description: 'Type MBTI + quiz infidélité, amour, amis. Anonyme, instantané, gratuit.',
    images: ['/api/og'],
  },
};

const landingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'UrCecret — Test MBTI Gratuit',
  description: 'Test de personnalité MBTI gratuit — découvre ton profil parmi les 16 types psychologiques.',
  url: BASE,
  isPartOf: { '@type': 'WebSite', name: 'UrCecret', url: BASE },
  about: {
    '@type': 'Thing',
    name: 'Test de personnalité MBTI',
    description: 'Test MBTI gratuit : 16 types de personnalité en français, résultat instantané.',
  },
  mainEntity: {
    '@type': 'Quiz',
    name: 'Test de personnalité MBTI — 16 Types',
    description: 'Test MBTI gratuit en français. 24 questions pour découvrir ton type parmi INFJ, ENFP, INTJ, INTP, ESFP et 11 autres profils psychologiques.',
    url: `${BASE}/quiz/personnalite`,
    educationalLevel: 'beginner',
    inLanguage: 'fr',
    isAccessibleForFree: true,
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE }],
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingSchema) }} />
      <HomeClient />
    </>
  );
}
