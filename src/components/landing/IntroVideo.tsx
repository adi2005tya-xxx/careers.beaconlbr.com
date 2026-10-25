import Reveal from './Reveal'

export default function IntroVideo() {
  return (
    <section className="bg-[var(--background)] px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--beacon-teal)]">
            See Beacon In Action
          </span>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-[var(--beacon-navy)] sm:text-4xl">
            Beacon for Planners
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-[0_32px_64px_-28px_rgba(15,23,42,0.25)]">
            <video
              className="aspect-video w-full"
              src="https://kefer0u7qcasbqvn.public.blob.vercel-storage.com/videos/beacon-for-planners-v4.mp4"
              controls
              preload="metadata"
              playsInline
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
