'use client'

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { Upload, FileCheck2, X, Loader2 } from 'lucide-react'
import { MAX_RESUME_SIZE_BYTES, ALLOWED_RESUME_CONTENT_TYPES } from '@/lib/validation/application'

export interface ResumeUploadResult {
  resumeBlobPath: string
  resumeOriginalName: string
  resumeSizeBytes: number
}

export default function ResumeUploadField({
  value,
  onChange,
  error,
}: {
  value: ResumeUploadResult | null
  onChange: (result: ResumeUploadResult | null) => void
  error?: string
}) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    setLocalError(null)
    if (!file) return

    if (!ALLOWED_RESUME_CONTENT_TYPES.includes(file.type) || !file.name.toLowerCase().endsWith('.pdf')) {
      setLocalError('Please upload a PDF file.')
      return
    }
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setLocalError('Resume must be 5 MB or smaller.')
      return
    }

    setStatus('uploading')
    setProgress(0)
    try {
      const blob = await upload(`resumes/${crypto.randomUUID()}-${file.name}`, file, {
        access: 'private',
        handleUploadUrl: '/api/upload/resume-token',
        contentType: file.type,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      })
      onChange({
        resumeBlobPath: blob.pathname,
        resumeOriginalName: file.name,
        resumeSizeBytes: file.size,
      })
      setStatus('idle')
    } catch (err) {
      console.error('Resume upload failed', err)
      setLocalError('Upload failed. Please try again.')
      setStatus('error')
      onChange(null)
    }
  }

  const removeFile = () => {
    onChange(null)
    setStatus('idle')
    setLocalError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  // localError wins when both are set - it's the more specific, more
  // useful message (e.g. "Upload failed" explains WHY nothing is attached,
  // whereas the parent's generic "please upload your resume" is just
  // re-stating the empty state and would otherwise silently mask it).
  const displayError = localError || error

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--beacon-navy)]">
        Upload Your Resume <span className="font-normal text-[var(--text-muted)]">(optional)</span>
      </label>
      <p className="mb-2 text-xs text-[var(--text-muted)]">
        Upload your latest resume in PDF format (max 5 MB) if you have one ready.
      </p>

      {!value && status !== 'uploading' && (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition hover:border-[var(--beacon-teal)] ${
            displayError ? 'border-red-300 bg-red-50' : 'border-[var(--border)]'
          }`}
        >
          <Upload size={22} className="text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text)]">Click to select your resume (PDF)</span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={e => handleFile(e.target.files?.[0])}
          />
        </label>
      )}

      {status === 'uploading' && (
        <div className="rounded-xl border border-[var(--border)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
            <Loader2 size={16} className="animate-spin text-[var(--beacon-teal)]" />
            Uploading&hellip; {Math.round(progress)}%
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--beacon-teal)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {value && status === 'idle' && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileCheck2 size={18} className="shrink-0 text-[var(--beacon-teal)]" />
            <span className="truncate text-sm font-medium text-[var(--text)]">{value.resumeOriginalName}</span>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="shrink-0 text-[var(--text-muted)] transition hover:text-red-600"
            aria-label="Remove resume"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {displayError && <p className="mt-1.5 text-xs font-medium text-red-600">{displayError}</p>}
    </div>
  )
}
