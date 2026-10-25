'use client'

import { useEffect, useState } from 'react'

// Purely decorative, ambient texture for the hero - a dashed flight route
// with a plane gliding along it on loop. Kept low-opacity and slow so it
// reads as a nod to "travel-tech," not a flashy animation competing with
// the headline.
//
// SMIL (<animateMotion>) doesn't respond to the prefers-reduced-motion CSS
// media query the way CSS transitions do (see .reveal in globals.css), so
// this checks it directly and simply doesn't render the motion element at
// all when set - the route and a stationary plane at its start still show,
// since those are part of the visual design, not just motion.
export default function FlightPath() {
  // Lazy initializer reads the real value on first client render instead
  // of setState-ing it from inside an effect (which forces an extra
  // render and trips the react-hooks/set-state-in-effect rule). The
  // effect below only subscribes to later changes, which setState in a
  // callback is exactly what effects are for.
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduceMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path
        id="flight-route"
        d="M -50 480 C 220 560, 420 180, 650 260 S 1050 120, 1260 40"
        fill="none"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeDasharray="2 14"
        strokeLinecap="round"
      />
      {/* Waypoint dots along the route */}
      <circle cx="220" cy="520" r="4" fill="var(--beacon-cyan)" opacity="0.6" />
      <circle cx="650" cy="260" r="4" fill="var(--beacon-cyan)" opacity="0.6" />
      <circle cx="1020" cy="100" r="4" fill="var(--beacon-cyan)" opacity="0.6" />

      {reduceMotion ? (
        // Static fallback, positioned + rotated to roughly match the
        // route's start point and initial tangent - no animateMotion, so
        // no static transform composition to worry about here.
        <g transform="translate(-50, 480) rotate(17) scale(0.9)">
          <path d="M0 0 L-9 -3 L-9 -7 L-2 -2 L-13 -2 L-17 -6 L-20 -6 L-17 0 L-20 6 L-17 6 L-13 2 L-2 2 L-9 7 L-9 3 Z" fill="white" />
        </g>
      ) : (
        // animateMotion supplies its own position/rotation along the path
        // each frame - no static transform on this <g>, or the two would
        // compose and the plane would render off-route.
        <g>
          <path d="M0 0 L-9 -3 L-9 -7 L-2 -2 L-13 -2 L-17 -6 L-20 -6 L-17 0 L-20 6 L-17 6 L-13 2 L-2 2 L-9 7 L-9 3 Z" fill="white" transform="scale(0.9)" />
          <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" calcMode="linear">
            <mpath href="#flight-route" />
          </animateMotion>
        </g>
      )}
    </svg>
  )
}
