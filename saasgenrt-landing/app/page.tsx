import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Pricing } from '@/components/pricing'
import { CTA } from '@/components/cta'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
