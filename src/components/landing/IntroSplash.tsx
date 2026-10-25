'use client'

import { useEffect, useState } from 'react'

// A brief entry moment - not a loading screen (content behind it is
// already rendering normally), just a short brand beat before it's
// revealed. Plays on every load/refresh, by design.
//
// A dashed flight route draws itself in with a plane gliding along it,
// waypoint dots popping in as it passes, then the wordmark settles in -
// same travel motif as the hero's FlightPath, built as an actual drawn
// animation rather than a static logo fade.
function initialPhase(): 'in' | 'done' {
  if (typeof window === 'undefined') return 'done'
  // Admin-facing routes share this root layout but aren't the "visitor
  // arriving" moment this is for - an admin reviewing applications
  // doesn't need a brand splash on every login.
  if (window.location.pathname.startsWith('/admin')) return 'done'
  return 'in'
}

export default function IntroSplash() {
  const [phase, setPhase] = useState<'in' | 'text' | 'hold' | 'out' | 'done'>(initialPhase)

  useEffect(() => {
    if (phase !== 'in') return
    const t1 = setTimeout(() => setPhase('text'), 950)
    const t2 = setTimeout(() => setPhase('hold'), 1500)
    const t3 = setTimeout(() => setPhase('out'), 2000)
    const t4 = setTimeout(() => setPhase('done'), 2450)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  const textVisible = phase === 'text' || phase === 'hold' || phase === 'out'

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--beacon-navy)] transition-opacity duration-500 ${
        phase === 'out' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--beacon-teal)]/20 blur-[130px]" />
      </div>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          id="splash-route"
          d="M 100 650 C 350 720, 520 420, 700 480 S 1000 280, 1100 160"
          fill="none"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          strokeDasharray="2 14"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: '1',
            strokeDashoffset: phase === 'in' ? 1 : 0,
            transition: 'stroke-dashoffset 900ms cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        />
        {[{ cx: 350, cy: 705, delay: 250 }, { cx: 700, cy: 480, delay: 500 }, { cx: 1000, cy: 280, delay: 750 }].map((wp, i) => (
          <circle
            key={i}
            cx={wp.cx}
            cy={wp.cy}
            r="5"
            fill="var(--beacon-cyan)"
            style={{
              opacity: phase === 'in' ? 0 : 1,
              transform: phase === 'in' ? 'scale(0)' : 'scale(1)',
              transformOrigin: `${wp.cx}px ${wp.cy}px`,
              transition: `opacity 300ms ease-out ${wp.delay}ms, transform 300ms ease-out ${wp.delay}ms`,
            }}
          />
        ))}
        <g
          style={{
            offsetPath: "path('M 100 650 C 350 720, 520 420, 700 480 S 1000 280, 1100 160')",
            offsetDistance: phase === 'in' ? '0%' : '100%',
            offsetRotate: 'auto',
            transition: 'offset-distance 900ms cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        >
          <path
            d="M0 0 L-9 -3 L-9 -7 L-2 -2 L-13 -2 L-17 -6 L-20 -6 L-17 0 L-20 6 L-17 6 L-13 2 L-2 2 L-9 7 L-9 3 Z"
            fill="white"
          />
        </g>
      </svg>

      <div
        className={`relative transition-all duration-500 ease-out ${
          textVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">BEACON</p>
        <p className="mt-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-[var(--beacon-cyan)]">
          Life Beyond Routine
        </p>
      </div>
    </div>
  )
}
