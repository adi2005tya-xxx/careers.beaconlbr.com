'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Invalid email or password')
        setIsLoading(false)
        return
      }
      window.location.href = '/admin/applications'
    } catch {
      setError('Network error — please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="text-lg font-bold text-[var(--beacon-navy)]">Beacon Careers Admin</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Sign in to review internship applications.</p>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-semibold text-[var(--beacon-navy)]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--beacon-teal)]"
          />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-[var(--beacon-navy)]">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--beacon-teal)]"
          />
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--beacon-teal)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--beacon-cyan)] disabled:opacity-60"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
