'use client'

import { useState } from 'react'
import { PORTFOLIOS, type PortfolioKey } from '@/lib/config/portfolios'
import PortfolioCard from './PortfolioCard'
import ApplicationForm from '../application-form/ApplicationForm'
import Reveal from './Reveal'

export default function ApplyFlow() {
  const [primaryPortfolio, setPrimaryPortfolio] = useState<PortfolioKey | ''>('')

  const choosePortfolio = (key: PortfolioKey) => {
    setPrimaryPortfolio(key)
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section id="opportunities" className="bg-[var(--background)] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--beacon-teal)]">
              Choose Your Track
            </span>
            <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-[var(--beacon-navy)] sm:text-4xl">
              Internship Opportunities
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--text-muted)] sm:text-base">
              Choose the track that fits you best as your primary preference, with an optional
              secondary choice in the application form.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIOS.map((portfolio, i) => (
              <Reveal key={portfolio.key} delay={(i % 3) * 80}>
                <PortfolioCard
                  portfolio={portfolio}
                  isSelected={primaryPortfolio === portfolio.key}
                  onChoose={() => choosePortfolio(portfolio.key)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--beacon-teal)]">
              Join Us
            </span>
            <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-[var(--beacon-navy)] sm:text-4xl">
              Application Form
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center text-sm text-[var(--text-muted)] sm:text-base">
              Takes about five minutes. You can change your portfolio choice below.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10">
              <ApplicationForm primaryPortfolio={primaryPortfolio} onPrimaryPortfolioChange={setPrimaryPortfolio} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
