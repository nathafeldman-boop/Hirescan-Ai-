import type { Metadata } from 'next';
import HomeClient from './HomeClient';

const BASE = 'https://ursecret.vercel.app';

export const metadata: Metadata = {
  title: 'UrSecret — Quiz & Tests Psychologiques Gratuits · France',
  description: 'Découvre la vérité sur ton couple, tes amis et ta famille. 18 tests psychologiques anonymes et gratuits : style d\'attachement, langages de l\'amour, gaslighting, burnout, dépression, narcissisme. Résultats instantanés.',
  keywords: [
    'quiz psychologique gratuit france', 'test style attachement', 'test langages amour', 'test gaslighting',
    'quiz infidélité', 'suis-je narcissique', 'suis-je manipulé', 'test burnout', 'test dépression',
    'quiz anonyme france', 'test psychologique français', 'questionnaire couple', 'UrSecret',
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: 'UrSecret — Quiz & Tests Psychologiques Gratuits',
    description: '18 tests psychologiques anonymes : style d\'attachement, langages de l\'amour, gaslighting, burnout et plus. 100% gratuit.',
    url: BASE,
    siteName: 'UrSecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrSecret — Tests Psychologiques Gratuits' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrSecret — Tests Psychologiques Gratuits',
    description: '18 tests psy anonymes. 100% gratuit. France.',
    images: ['/api/og'],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
