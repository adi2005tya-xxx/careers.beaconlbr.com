export default function FinalCta() {
  return (
    <section className="bg-gradient-to-b from-[var(--beacon-blue)] to-[var(--beacon-navy)] px-6 py-20 text-center text-white">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to Make This Winter Count?</h2>
        <p className="mt-4 text-base text-white/85 sm:text-lg">
          Learn by doing. Build practical skills. Be part of Beacon&apos;s journey.
        </p>
        <a
          href="#apply"
          className="mt-8 inline-block rounded-xl bg-[var(--beacon-teal)] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[var(--beacon-cyan)]"
        >
          Register Now
        </a>
      </div>
    </section>
  )
}
