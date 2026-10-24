// Every value here drives the "Internship Information" section on the
// landing page. None of these are invented - if the program owner hasn't
// finalised a detail yet, it reads as an honest "To be announced" rather
// than a fabricated date or promise. Set the real values in the deployment
// environment once they're approved.
const TBD = 'To be announced'

function fromEnv(name: string): string {
  const value = process.env[name]
  return value && value.trim() ? value.trim() : TBD
}

export const PROGRAM_INFO = {
  duration: fromEnv('PROGRAM_DURATION'),
  applicationDeadline: fromEnv('APPLICATION_DEADLINE'),
  startDate: fromEnv('PROGRAM_START_DATE'),
  endDate: fromEnv('PROGRAM_END_DATE'),
  eligibility: fromEnv('ELIGIBILITY_TEXT'),
  workingArrangement: fromEnv('WORKING_ARRANGEMENT'),
  stipendStatus: fromEnv('STIPEND_STATUS_TEXT'),
  certificateEligibility: fromEnv('CERTIFICATE_ELIGIBILITY_TEXT'),
  incentivePolicy: fromEnv('INCENTIVE_POLICY_TEXT'),
}

// The confirmation email and the "Contact Us" mentions on the page both
// need a real address - unlike the info-section fields above, a blank
// contact email is worse than an honest placeholder, since it would make
// the confirmation email promise a way to reach Beacon that doesn't work.
// Read once per request path that needs it rather than at module load, so
// a misconfigured deploy fails the specific action (sending an email)
// instead of crashing the whole page for visitors who never needed it.
export function getOfficialContactEmail(): string {
  const value = process.env.OFFICIAL_CONTACT_EMAIL
  if (!value || !value.trim()) {
    throw new Error('OFFICIAL_CONTACT_EMAIL is not set - cannot send confirmation emails until the program owner provides it.')
  }
  return value.trim()
}
