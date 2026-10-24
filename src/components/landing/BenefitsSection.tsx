import { Briefcase, Eye, Award, TrendingUp } from 'lucide-react'

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
      'Incentives may be offered depending on your contribution, assigned responsibilities, performance and value delivered to Beacon. Incentives are not guaranteed for every intern — applicable criteria will be shared before you take on incentive-eligible work.',
  },
]

export default function BenefitsSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-extrabold text-[var(--beacon-navy)] sm:text-3xl">
          What Will You Gain?
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--beacon-teal)]/10 text-[var(--beacon-teal)]">
                <Icon size={22} />
              </div>
              <h3 className="text-base font-bold text-[var(--beacon-navy)]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
