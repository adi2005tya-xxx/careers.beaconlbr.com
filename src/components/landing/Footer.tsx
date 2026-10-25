import { Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--beacon-navy)] px-6 py-10 text-white/70">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-bold text-white">Beacon &mdash; Life Beyond Routine</p>
          <p className="mt-1 text-xs text-white/50">
            &copy; 2026 Beacon. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">Need Help?</p>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <a
              href="tel:+919766820696"
              className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-[var(--beacon-cyan)]"
            >
              <Phone size={15} />
              +91 97668 20696
            </a>
            <a
              href="mailto:beaconlbr@gmail.com"
              className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-[var(--beacon-cyan)]"
            >
              <Mail size={15} />
              beaconlbr@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
