'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IntroAnimation from '@/components/IntroAnimation';

export default function HomePage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Skip intro if user already saw it this session
    const seen = sessionStorage.getItem('ursecret_intro_seen');
    if (seen) {
      router.replace('/onboarding');
    }
  }, [router]);

  function handleIntroComplete() {
    sessionStorage.setItem('ursecret_intro_seen', '1');
    setShowIntro(false);
    router.push('/onboarding');
  }

  if (!showIntro) return null;

  return <IntroAnimation onComplete={handleIntroComplete} />;
}
