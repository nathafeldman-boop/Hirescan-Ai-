import type { Metadata } from 'next';
import DecouverteClient from './DecouverteClient';

export const metadata: Metadata = {
  title: 'Que veux-tu découvrir sur toi ? | UrCecret',
  description: 'Test de personnalité, coach IA, journal émotionnel, analyse de relations, quiz — choisis ton expérience et commence à mieux te connaître.',
  alternates: { canonical: 'https://urcecret.site/decouverte' },
};

export default function DecouvertePage() {
  return <DecouverteClient />;
}
