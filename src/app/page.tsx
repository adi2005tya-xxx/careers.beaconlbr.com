import Hero from '@/components/landing/Hero'
import BenefitsSection from '@/components/landing/BenefitsSection'
import AboutBeacon from '@/components/landing/AboutBeacon'
import IntroVideo from '@/components/landing/IntroVideo'
import ApplyFlow from '@/components/landing/ApplyFlow'
import InternshipInfoSection from '@/components/landing/InternshipInfoSection'
import FinalCta from '@/components/landing/FinalCta'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BenefitsSection />
      <AboutBeacon />
      <IntroVideo />
      <ApplyFlow />
      <InternshipInfoSection />
      <FinalCta />
    </main>
  )
}
