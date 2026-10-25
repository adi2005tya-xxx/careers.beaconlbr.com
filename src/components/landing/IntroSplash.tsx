'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// A brief, one-time entry moment - not a loading screen (content behind it
// is already rendering normally), just a short brand beat before it's
// revealed. Kept well under 2s total: a "premium" feel comes from
// smoothness, not from making a visitor wait to see the page they came for.
// Whether to actually run the splash, decided once up front (in the
// lazy initializer below) rather than via setState inside an effect -
// admin routes, reduced-motion visitors, and a visitor already mid-session
// all skip straight to 'done' with no flash of the overlay first.
function initialPhase(): 'in' | 'done' {
  if (typeof window === 'undefined') return 'done'
  // Admin-facing routes share this root layout but aren't the "visitor
  // arriving" moment this is for - an admin reviewing applications
  // doesn't need a brand splash on every login.
  if (window.location.pathname.startsWith('/admin')) return 'done'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'done'
  // Only once per browser session - a visitor moving between tabs or
  // reloading mid-visit doesn't need to see this again, only a genuinely
  // fresh arrival does.
  if (sessionStorage.getItem('beacon-intro-seen')) return 'done'
  sessionStorage.setItem('beacon-intro-seen', '1')
  return 'in'
}

export default function IntroSplash() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>(initialPhase)

  useEffect(() => {
    if (phase !== 'in') return
    const t1 = setTimeout(() => setPhase('hold'), 500)
    const t2 = setTimeout(() => setPhase('out'), 1100)
    const t3 = setTimeout(() => setPhase('done'), 1550)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--beacon-navy)] transition-opacity duration-500 ${
        phase === 'out' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--beacon-teal)]/20 blur-[120px]" />
      </div>

      <div
        className={`relative flex flex-col items-center transition-all duration-700 ease-out ${
          phase === 'in' ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <Image src="/icon.png" alt="Beacon" width={200} height={200} className="h-20 w-20 object-contain sm:h-24 sm:w-24" priority />
        <p
          className={`mt-4 text-xs font-bold uppercase tracking-[0.3em] text-[var(--beacon-cyan)] transition-opacity duration-500 delay-200 ${
            phase === 'in' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Life Beyond Routine
        </p>
      </div>
    </div>
  )
}
