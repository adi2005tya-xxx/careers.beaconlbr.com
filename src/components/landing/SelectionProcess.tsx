import { Laptop } from 'lucide-react'
import Reveal from './Reveal'

const STEPS: [string, string, string][] = [
  ['01', 'Application', 'Submit your application with your details, preferred portfolio, and resume.'],
  ['02', 'Application Review', 'Our team reviews your profile, interests, and suitability for the selected portfolio.'],
  ['03', 'Interview / Discussion', 'Connect with our team to discuss your interests, skills, and expectations.'],
  ['04', 'Selection', 'Selected candidates receive further communication regarding onboarding and next steps.'],
]

export default function SelectionProcess() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--beacon-teal)]">
            Selection Process
          </span>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-[var(--beacon-navy)] sm:text-4xl">
            Your Journey to Beacon
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-sm text-[var(--text-muted)] sm:text-base">
            A simple, transparent selection process.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-9">
            <div className="space-y-7">
              {STEPS.map(([num, title, description]) => (
                <div key={num} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--beacon-teal)]/10 text-sm font-extrabold text-[var(--beacon-teal)]">
                    {num}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[var(--beacon-navy)]">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--beacon-teal)]/20 bg-[var(--beacon-teal)]/5 p-5">
            <Laptop size={18} className="mt-0.5 shrink-0 text-[var(--beacon-teal)]" />
            <div>
              <p className="text-sm font-bold text-[var(--beacon-navy)]">Work Mode: Online + Offline</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                The internship will follow a flexible online and offline working model, depending on
                the nature of assigned tasks, project requirements, and targets. Interns should be
                prepared to collaborate in both modes as required.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
