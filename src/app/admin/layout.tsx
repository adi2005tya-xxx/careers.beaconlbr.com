'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  if (isLoginPage) return <>{children}</>

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6">
        <Link href="/admin/applications" className="text-sm font-bold text-[var(--beacon-navy)]">
          Beacon Careers Admin
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-red-600"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
