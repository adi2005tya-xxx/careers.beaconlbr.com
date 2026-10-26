'use client'

import { useRef, useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { applicationSchema, MAX_SKILLS_LENGTH } from '@/lib/validation/application'
import { PORTFOLIOS, type PortfolioKey } from '@/lib/config/portfolios'
import ResumeUploadField, { type ResumeUploadResult } from './ResumeUploadField'

const YEAR_OPTIONS: { value: string; label: string }[] = [
  { value: 'FIRST_YEAR', label: 'First Year' },
  { value: 'SECOND_YEAR', label: 'Second Year' },
  { value: 'THIRD_YEAR', label: 'Third Year' },
  { value: 'FOURTH_YEAR', label: 'Fourth Year' },
  { value: 'FINAL_YEAR', label: 'Final Year' },
  { value: 'POST_GRADUATE', label: 'Post Graduate' },
  { value: 'OTHER', label: 'Other' },
]

interface FormState {
  fullName: string
  email: string
  mobile: string
  collegeName: string
  yearOfStudy: string
  degreeBranch: string
  secondaryPortfolio: PortfolioKey | ''
  availableStartDate: string
  availableEndDate: string
  skills: string
  privacyAcknowledged: boolean
  honeypot: string
}

const INITIAL_STATE: FormState = {
  fullName: '',
  email: '',
  mobile: '',
  collegeName: '',
  yearOfStudy: '',
  degreeBranch: '',
  secondaryPortfolio: '',
  availableStartDate: '',
  availableEndDate: '',
  skills: '',
  privacyAcknowledged: false,
  honeypot: '',
}

export default function ApplicationForm({
  primaryPortfolio,
  onPrimaryPortfolioChange,
}: {
  primaryPortfolio: PortfolioKey | ''
  onPrimaryPortfolioChange: (key: PortfolioKey) => void
}) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [resume, setResume] = useState<ResumeUploadResult | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState<string | null>(null)
  const submittingRef = useRef(false)

  const field = <K extends keyof FormState>(key: K) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
      setFieldErrors(prev => ({ ...prev, [key]: '' }))
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingRef.current) return

    const candidate = {
      fullName: form.fullName,
      email: form.email,
      mobile: form.mobile,
      collegeName: form.collegeName,
      yearOfStudy: form.yearOfStudy,
      degreeBranch: form.degreeBranch,
      primaryPortfolio: primaryPortfolio || undefined,
      secondaryPortfolio: form.secondaryPortfolio || null,
      availableStartDate: form.availableStartDate,
      availableEndDate: form.availableEndDate,
      skills: form.skills,
      resumeBlobPath: resume?.resumeBlobPath,
      resumeOriginalName: resume?.resumeOriginalName,
      resumeSizeBytes: resume?.resumeSizeBytes,
      privacyAcknowledged: form.privacyAcknowledged,
      honeypot: form.honeypot,
    }

    const parsed = applicationSchema.safeParse(candidate)
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.')
        if (!errors[key]) errors[key] = issue.message
      }
      setFieldErrors(errors)
      setFormError('Please fix the highlighted fields.')
      return
    }

    submittingRef.current = true
    setStatus('submitting')
    setFormError(null)
    setFieldErrors({})

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (res.status === 201) {
        setStatus('success')
        return
      }

      const data = await res.json().catch(() => ({}))
      if (res.status === 429) {
        setFormError('Too many applications submitted from this connection recently. Please try again later.')
      } else if (res.status === 400 && data.fieldErrors) {
        setFieldErrors(data.fieldErrors)
        setFormError('Please fix the highlighted fields.')
      } else {
        setFormError('Something went wrong submitting your application. Please try again.')
      }
      setStatus('error')
    } catch {
      setFormError('Network error — please check your connection and try again.')
      setStatus('error')
    } finally {
      submittingRef.current = false
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
        <CheckCircle2 size={44} className="mx-auto text-[var(--beacon-teal)]" />
        <h3 className="mt-4 text-xl font-bold text-[var(--beacon-navy)]">Application Received</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Thanks for applying to the Beacon Winter Internship Program. Check your email for confirmation
          — our team will review your application and get in touch about next steps.
        </p>
      </div>
    )
  }

  const inputClass = (key: string) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--beacon-teal)] focus:ring-4 focus:ring-[var(--beacon-teal)]/10 ${
      fieldErrors[key] ? 'border-red-400' : 'border-[var(--border)]'
    }`

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_32px_64px_-32px_rgba(15,23,42,0.2)] sm:p-9">
      <h3 className="text-xl font-bold text-[var(--beacon-navy)]">Apply Now</h3>

      {/* Honeypot - hidden from real users, never styled visible */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        value={form.honeypot}
        onChange={field('honeypot').onChange}
        aria-hidden="true"
      />

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Full Name" error={fieldErrors.fullName}>
          <input type="text" required className={inputClass('fullName')} {...field('fullName')} />
        </FormField>
        <FormField label="Email Address" error={fieldErrors.email}>
          <input type="email" required className={inputClass('email')} {...field('email')} />
        </FormField>
        <FormField label="Mobile Number" error={fieldErrors.mobile}>
          <input type="tel" required className={inputClass('mobile')} {...field('mobile')} />
        </FormField>
        <FormField label="College Name" error={fieldErrors.collegeName}>
          <input type="text" required className={inputClass('collegeName')} {...field('collegeName')} />
        </FormField>
        <FormField label="Current Year of Study" error={fieldErrors.yearOfStudy}>
          <select required className={inputClass('yearOfStudy')} {...field('yearOfStudy')}>
            <option value="">Select year</option>
            {YEAR_OPTIONS.map(y => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Degree / Branch" error={fieldErrors.degreeBranch}>
          <input type="text" required className={inputClass('degreeBranch')} {...field('degreeBranch')} />
        </FormField>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Primary Portfolio" error={fieldErrors.primaryPortfolio}>
          <select
            required
            className={inputClass('primaryPortfolio')}
            value={primaryPortfolio}
            onChange={e => onPrimaryPortfolioChange(e.target.value as PortfolioKey)}
          >
            <option value="">Select a portfolio</option>
            {PORTFOLIOS.map(p => (
              <option key={p.key} value={p.key}>{p.title}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Secondary Portfolio (optional)" error={fieldErrors.secondaryPortfolio}>
          <select className={inputClass('secondaryPortfolio')} {...field('secondaryPortfolio')}>
            <option value="">None</option>
            {PORTFOLIOS.filter(p => p.key !== primaryPortfolio).map(p => (
              <option key={p.key} value={p.key}>{p.title}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Available From" error={fieldErrors.availableStartDate}>
          <input type="date" required className={inputClass('availableStartDate')} {...field('availableStartDate')} />
        </FormField>
        <FormField label="Available Until" error={fieldErrors.availableEndDate}>
          <input
            type="date"
            required
            min={form.availableStartDate || undefined}
            className={inputClass('availableEndDate')}
            {...field('availableEndDate')}
          />
        </FormField>
      </div>

      <div className="mt-5">
        <FormField label="Relevant Skills" error={fieldErrors.skills}>
          <textarea
            required
            rows={4}
            maxLength={MAX_SKILLS_LENGTH}
            className={inputClass('skills')}
            {...field('skills')}
          />
          <p className="mt-1 text-right text-xs text-[var(--text-muted)]">
            {form.skills.length} / {MAX_SKILLS_LENGTH}
          </p>
        </FormField>
        <p className="-mt-5 text-xs text-[var(--text-muted)]">
          Mention the skills, tools or experience relevant to your preferred portfolio.
        </p>
      </div>

      <div className="mt-5">
        <ResumeUploadField value={resume} onChange={setResume} error={fieldErrors.resumeBlobPath} />
      </div>

      <label className="mt-6 flex items-start gap-2.5 text-xs text-[var(--text-muted)]">
        <input
          type="checkbox"
          required
          checked={form.privacyAcknowledged}
          onChange={e => setForm(prev => ({ ...prev, privacyAcknowledged: e.target.checked }))}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border)]"
        />
        <span>
          I acknowledge that my information will be used to review this application, contact me about
          the selection process, and coordinate internship-related communication.
        </span>
      </label>
      {fieldErrors.privacyAcknowledged && (
        <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.privacyAcknowledged}</p>
      )}

      {formError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{formError}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--beacon-teal)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(0,151,166,0.55)] transition hover:-translate-y-0.5 hover:bg-[var(--beacon-cyan)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
      >
        {status === 'submitting' && <Loader2 size={16} className="animate-spin" />}
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--beacon-navy)]">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}
