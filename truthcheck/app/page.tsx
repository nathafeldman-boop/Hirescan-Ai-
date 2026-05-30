'use client';

import { useRouter } from 'next/navigation';
import IntroAnimation from '@/components/IntroAnimation';

export default function HomePage() {
  const router = useRouter();

  function handleIntroComplete() {
    router.push('/onboarding');
  }

  return <IntroAnimation onComplete={handleIntroComplete} />;
}
