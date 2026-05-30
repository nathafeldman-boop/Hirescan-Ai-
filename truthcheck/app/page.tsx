'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from '@/components/IntroAnimation';
import LandingPage from '@/components/LandingPage';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem('ursecret_intro_seen');
    setShowIntro(!seen);
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem('ursecret_intro_seen', '1');
    setShowIntro(false);
  }

  if (showIntro === null) return null;
  if (showIntro) return <IntroAnimation onComplete={handleIntroComplete} />;
  return <LandingPage />;
}
