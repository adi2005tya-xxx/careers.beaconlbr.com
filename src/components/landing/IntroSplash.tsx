'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// A brief entry moment - not a loading screen (content behind it is
// already rendering normally), just a short brand beat before it's
// revealed. Plays on every load/refresh, by design.
//
// A literal beacon pulse: expanding rings of light radiate outward from
// the mark, like a signal going out - distinct from the hero's flight-path
// motif (that one's "traveling," this one's the name itself: a beacon
// pulses light to guide people in).
function initialPhase(): 'in' | 'done' {
  if (typeof window === 'undefined') return 'done'
  // Admin-facing routes share this root layout but aren't the "visitor
  // arriving" moment this is for - an admin reviewing applications
  // doesn't need a brand splash on every login.
  if (window.location.pathname.startsWith('/admin')) return 'done'
  return 'in'
}

export default function IntroSplash() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>(initialPhase)

  useEffect(() => {
    if (phase !== 'in') return
    const t1 = setTimeout(() => setPhase('hold'), 1700)
    const t2 = setTimeout(() => setPhase('out'), 2050)
    const t3 = setTimeout(() => setPhase('done'), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--beacon-navy)] transition-opacity duration-500 ${
        phase === 'out' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--beacon-teal)]/15 blur-[130px]" />
      </div>

      <div className="relative flex items-center justify-center">
        {/* Pulse rings - staggered, looping while the splash is up */}
        {[0, 0.6, 1.2].map(delay => (
          <span
            key={delay}
            className="absolute h-20 w-20 rounded-full border-2 border-[var(--beacon-cyan)] sm:h-24 sm:w-24"
            style={{
              animation: 'beacon-pulse 1.8s ease-out infinite',
              animationDelay: `${delay}s`,
            }}
          />
        ))}

        <div
          className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_0_50px_10px_rgba(0,166,184,0.4)] transition-all duration-500 ease-out sm:h-24 sm:w-24 ${
            phase === 'in' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <Image src="/icon.png" alt="Beacon" width={160} height={160} className="h-14 w-14 object-contain sm:h-16 sm:w-16" priority />
        </div>
      </div>

      <div
        className={`absolute bottom-[30%] text-center transition-all delay-300 duration-500 ease-out ${
          phase === 'in' ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">BEACON</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-[var(--beacon-cyan)]">
          Life Beyond Routine
        </p>
      </div>

      <style>{`
        @keyframes beacon-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
