// Every value interpolated into the confirmation email's HTML body is
// applicant-supplied (their name) - escape before interpolating into any
// `html:` string, same reasoning as the main Beacon app's mail.ts: without
// this, a crafted name could inject live markup into an email sent from
// Beacon's own address.
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
