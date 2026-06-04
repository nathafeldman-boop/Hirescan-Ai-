import type { Metadata } from 'next';
import HomeClient from './HomeClient';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'UrCecret — Tes vraies réponses',
  description: 'Découvre la vérité sur ton couple, tes amis et ta famille. 15 questionnaires anonymes et précis : infidélité, narcissisme, manipulation, burnout, dépression, amour véritable et plus. Résultats instantanés.',
  keywords: [
    'quiz infidélité', 'suis-je adopté', 'suis-je amoureux', 'vrais amis', 'orientation sexuelle',
    'suis-je narcissique', 'mon ex veut revenir', 'suis-je manipulé', 'dois-je rompre',
    'suis-je jaloux', 'relation toxique', 'mon crush', 'burnout', 'dépression', 'vrai amour',
    'quiz anonyme', 'test psychologique', 'questionnaire couple', 'UrCecret',
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: 'UrCecret — Tes vraies réponses',
    description: '15 questionnaires anonymes pour découvrir la vérité sur toi-même, ton couple, tes amis et ta famille.',
    url: BASE,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrCecret — Tes vraies réponses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrCecret — Tes vraies réponses',
    description: '15 quiz anonymes. 100% gratuit.',
    images: ['/api/og'],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
