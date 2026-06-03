'use client';

import { useRouter } from 'next/navigation';
import IntroAnimation from '@/components/IntroAnimation';

export default function HomeClient() {
  const router = useRouter();
  // Le test de personnalité est la porte d'entrée (hook d'acquisition façon Truity).
  return <IntroAnimation onComplete={() => router.push('/quiz/personnalite')} />;
}
