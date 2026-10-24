'use client'

import { useState } from 'react'
import { PORTFOLIOS, type PortfolioKey } from '@/lib/config/portfolios'
import PortfolioCard from './PortfolioCard'
import ApplicationForm from '../application-form/ApplicationForm'

export default function ApplyFlow() {
  const [primaryPortfolio, setPrimaryPortfolio] = useState<PortfolioKey | ''>('')

  const choosePortfolio = (key: PortfolioKey) => {
    setPrimaryPortfolio(key)
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section id="opportunities" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-[var(--beacon-navy)] sm:text-3xl">
            Internship Opportunities
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--text-muted)]">
            Choose the track that fits you best as your primary preference, with an optional
            secondary choice in the application form.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIOS.map(portfolio => (
              <PortfolioCard
                key={portfolio.key}
                portfolio={portfolio}
                isSelected={primaryPortfolio === portfolio.key}
                onChoose={() => choosePortfolio(portfolio.key)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-extrabold text-[var(--beacon-navy)] sm:text-3xl">
            Application Form
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-[var(--text-muted)]">
            Takes about five minutes. You can change your portfolio choice below.
          </p>
          <div className="mt-10">
            <ApplicationForm primaryPortfolio={primaryPortfolio} onPrimaryPortfolioChange={setPrimaryPortfolio} />
          </div>
        </div>
      </section>
    </>
  )
}
