'use client';

import { useRouter } from 'next/navigation';
import IntroAnimation from '@/components/IntroAnimation';

export default function HomeClient() {
  const router = useRouter();
  return <IntroAnimation onComplete={() => router.push('/onboarding')} />;
}
