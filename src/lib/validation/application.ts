import { z } from 'zod'
import { PORTFOLIO_KEYS } from '../config/portfolios'

const YEAR_OF_STUDY_VALUES = [
  'FIRST_YEAR', 'SECOND_YEAR', 'THIRD_YEAR', 'FOURTH_YEAR', 'FINAL_YEAR', 'POST_GRADUATE', 'OTHER',
] as const

export const MAX_SKILLS_LENGTH = 2000
export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024
export const ALLOWED_RESUME_CONTENT_TYPES = ['application/pdf']

// Server-side source of truth. Reused by the create endpoint in full, and
// a subset is reused by the admin status-update PATCH.
export const applicationSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(200),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address').max(254),
  mobile: z.string().trim().min(7, 'Enter a valid mobile number').max(20),
  collegeName: z.string().trim().min(1, 'College name is required').max(300),
  yearOfStudy: z.enum(YEAR_OF_STUDY_VALUES),
  degreeBranch: z.string().trim().min(1, 'Degree / branch is required').max(200),

  primaryPortfolio: z.enum(PORTFOLIO_KEYS),
  secondaryPortfolio: z.enum(PORTFOLIO_KEYS).nullable().optional(),

  availableStartDate: z.coerce.date(),
  availableEndDate: z.coerce.date(),

  skills: z.string().trim().min(1, 'Please describe your relevant skills').max(MAX_SKILLS_LENGTH),

  resumeBlobPath: z.string().trim().min(1, 'Resume upload is required'),
  resumeOriginalName: z.string().trim().min(1).max(260),
  resumeSizeBytes: z.number().int().positive().max(MAX_RESUME_SIZE_BYTES),

  privacyAcknowledged: z.literal(true, { error: 'You must acknowledge the privacy notice to apply' }),

  // Honeypot - deliberately NOT constrained to empty here. The point of a
  // honeypot is that a bot gets no signal it was filtered; rejecting it at
  // the schema level would return a 400 naming "honeypot" by name, telling
  // any bot that reads the error exactly which field to leave blank next
  // time. The create route checks this value itself, after a normal 201.
  honeypot: z.string().max(500).optional().default(''),
})
  .refine(data => data.availableEndDate >= data.availableStartDate, {
    message: 'End date cannot be before the start date',
    path: ['availableEndDate'],
  })
  .refine(data => !data.secondaryPortfolio || data.secondaryPortfolio !== data.primaryPortfolio, {
    message: 'Secondary portfolio must be different from the primary choice',
    path: ['secondaryPortfolio'],
  })

export type ApplicationInput = z.infer<typeof applicationSchema>

const APPLICATION_STATUS_VALUES = [
  'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED',
] as const

export const statusUpdateSchema = z.object({
  status: z.enum(APPLICATION_STATUS_VALUES),
})
