import nodemailer from 'nodemailer'
import { escapeHtml } from './escape-html'
import { getOfficialContactEmail } from './config/program'

// A brand-new, dedicated Gmail account for this program - never Beacon's
// main sending address (GMAIL_USER here is a wholly separate env var/value
// from the main app's).
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendApplicationConfirmation({
  applicantName,
  applicantEmail,
}: {
  applicantName: string
  applicantEmail: string
}): Promise<void> {
  const contactEmail = getOfficialContactEmail()
  const safeName = escapeHtml(applicantName)
  const safeContact = escapeHtml(contactEmail)

  await transporter.sendMail({
    from: `"Beacon Team" <${process.env.GMAIL_USER}>`,
    to: applicantEmail,
    subject: 'Application Received — Beacon Winter Internship Program',
    text:
      `Hi ${applicantName},\n\n` +
      `Thank you for applying to the Beacon Winter Internship Program.\n\n` +
      `We have successfully received your application. Our team will review your details and get in touch with you regarding the next steps.\n\n` +
      `If you have any queries, please contact us at ${contactEmail}.\n\n` +
      `Thank you for your interest in Beacon — Life Beyond Routine.\n\n` +
      `Best regards,\nBeacon Team\nLife Beyond Routine`,
    html: `
      <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        <p>Hi ${safeName},</p>
        <p>Thank you for applying to the Beacon Winter Internship Program.</p>
        <p>We have successfully received your application. Our team will review your details and get in touch with you regarding the next steps.</p>
        <p>If you have any queries, please contact us at <a href="mailto:${safeContact}">${safeContact}</a>.</p>
        <p>Thank you for your interest in Beacon &mdash; Life Beyond Routine.</p>
        <p>Best regards,<br />Beacon Team<br />Life Beyond Routine</p>
      </div>
    `,
  })
}
