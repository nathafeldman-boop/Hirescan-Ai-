import type { Metadata } from 'next';
import LandingPage from '@/components/LandingPage';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Test MBTI Gratuit — 16 Types de Personnalité | UrCecret',
  description: 'Découvre ton type MBTI en 24 questions · 15 quiz anonymes sur l\'infidélité, l\'amour et tes amis. Gratuit, instantané, sans inscription.',
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

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'C\'est quoi le test MBTI ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le MBTI (Myers-Briggs Type Indicator) est un test de personnalité qui classe les individus en 16 types selon 4 dimensions : Extraversion/Introversion, Sensation/Intuition, Pensée/Sentiment, Jugement/Perception. Il a été développé par Isabel Briggs Myers et Katharine Cook Briggs.' },
    },
    {
      '@type': 'Question',
      name: 'Combien de types de personnalité MBTI y a-t-il ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Il y a 16 types de personnalité MBTI : INTJ, INTP, ENTJ, ENTP, INFJ, INFP, ENFJ, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ISFP, ESTP, ESFP. Chacun correspond à une combinaison unique de traits psychologiques.' },
    },
    {
      '@type': 'Question',
      name: 'Quel est le type MBTI le plus rare ?',
      acceptedAnswer: { '@type': 'Answer', text: 'L\'INFJ est le type MBTI le plus rare, représentant environ 1 à 2% de la population mondiale. C\'est le type "L\'Avocat" — visionnaire, empathique et déterminé.' },
    },
    {
      '@type': 'Question',
      name: 'Le test MBTI est-il gratuit sur UrCecret ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, le test MBTI sur UrCecret est 100% gratuit, sans inscription et sans carte bancaire. Tu obtiens ton type de personnalité parmi les 16 profils instantanément après avoir répondu aux questions.' },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps dure le test MBTI ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le test MBTI d\'UrCecret dure environ 3 minutes. Il comprend 24 questions sur tes préférences et comportements naturels pour déterminer ton type de personnalité parmi les 16 profils.' },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }} />
      <LandingPage />
    </>
  );
}
