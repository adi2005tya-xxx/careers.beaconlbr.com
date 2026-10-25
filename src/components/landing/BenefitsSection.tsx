import { Briefcase, Eye, Award, TrendingUp } from 'lucide-react'
import Reveal from './Reveal'

const BENEFITS = [
  {
    icon: Briefcase,
    title: 'Hands-on Experience',
    description: 'Work on real projects and contribute to the development and growth of a startup.',
  },
  {
    icon: Eye,
    title: 'Real-World Exposure',
    description: 'Understand how a startup operates, solves problems, develops products and acquires customers.',
  },
  {
    icon: Award,
    title: 'Internship Certificate',
    description: 'Receive an internship certificate upon successful completion of the program and its agreed requirements.',
  },
  {
    icon: TrendingUp,
    title: 'Performance-Based Incentives',
    description:
      'Potential incentives based on your contribution and value delivered to Beacon. Conditions will be shared beforehand.',
  },
]

export default function BenefitsSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-[var(--beacon-navy)] sm:text-4xl">
            What Will You Gain?
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[var(--beacon-teal)]/30 hover:shadow-[0_24px_48px_-20px_rgba(0,35,73,0.18)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--beacon-teal)] to-[var(--beacon-cyan)] text-white shadow-[0_8px_20px_-6px_rgba(0,151,166,0.5)] transition-transform duration-300 group-hover:scale-105">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-[var(--beacon-navy)]">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
