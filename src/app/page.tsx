import Hero from '@/components/landing/Hero'
import BenefitsSection from '@/components/landing/BenefitsSection'
import AboutBeacon from '@/components/landing/AboutBeacon'
import ApplyFlow from '@/components/landing/ApplyFlow'
import InternshipInfoSection from '@/components/landing/InternshipInfoSection'
import FinalCta from '@/components/landing/FinalCta'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BenefitsSection />
      <AboutBeacon />
      <ApplyFlow />
      <InternshipInfoSection />
      <FinalCta />
    </main>
  )
}
