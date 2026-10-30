import nodemailer from 'nodemailer'
import { escapeHtml } from './escape-html'
import { getOfficialContactEmail } from './config/program'

// A brand-new, dedicated Gmail account for this program - never Beacon's
// main sending address (GMAIL_USER here is a wholly separate env var/value
// from the main app's).
//
// Pooled rather than one-connection-per-send: a non-pooled transporter
// opens a fresh SMTP connection and logs in again for every single
// sendMail() call. That's invisible for the normal one-email-per-request
// serverless path, but a batch script sending many emails back to back
// (see scripts/send-phase2-shortlist.ts) hit Gmail's "too many login
// attempts" throttle after a handful of sends, since each one was its own
// login. Pooling authenticates once and reuses the connection; rateLimit
// caps how fast it sends through that connection so a burst still can't
// trip Gmail's abuse protection.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  pool: true,
  maxConnections: 1,
  rateDelta: 2000,
  rateLimit: 1,
})

// Phase 2 shortlist - one-time batch, Product & Technology track only (see
// scripts/send-phase2-shortlist.ts). Each candidate sees only their own
// assigned pair of the 3 technical tasks, rotated 1-2 / 2-3 / 3-1 across
// the shortlist so the workload stays spread out rather than everyone
// getting the same two.
type Phase2TaskId = 1 | 2 | 3

const PHASE2_TASKS: Record<Phase2TaskId, { title: string; html: string; text: string }> = {
  1: {
    title: 'Payment Reconciliation System',
    html: `
      <h3 style="margin:18px 0 6px;color:#0f172a;">Task 1: Payment Reconciliation System</h3>
      <p><strong>Objective:</strong> Design and develop a prototype that helps reconcile payment transactions with bookings on a travel platform like Beacon.</p>
      <p>Your solution should address:</p>
      <ul>
        <li>Matching payment transactions with their corresponding bookings.</li>
        <li>Identifying successful, pending, failed, duplicate, and unmatched transactions.</li>
        <li>Handling cases where a payment succeeds but the booking status is not updated correctly.</li>
        <li>Displaying transaction and reconciliation statuses in a clear dashboard.</li>
        <li>Generating a basic reconciliation summary or report.</li>
      </ul>
      <p><strong>Expected outcome:</strong> A working prototype, a functional module, or a well-demonstrated proof of concept showing how payment reconciliation would work.</p>
    `,
    text:
      'Task 1: Payment Reconciliation System\n' +
      'Objective: Design and develop a prototype that helps reconcile payment transactions with bookings on a travel platform like Beacon.\n' +
      'Your solution should address:\n' +
      '- Matching payment transactions with their corresponding bookings.\n' +
      '- Identifying successful, pending, failed, duplicate, and unmatched transactions.\n' +
      '- Handling cases where a payment succeeds but the booking status is not updated correctly.\n' +
      '- Displaying transaction and reconciliation statuses in a clear dashboard.\n' +
      '- Generating a basic reconciliation summary or report.\n' +
      'Expected outcome: A working prototype, a functional module, or a well-demonstrated proof of concept showing how payment reconciliation would work.\n',
  },
  2: {
    title: 'Multi-Firm Architecture & Role-Based Access Control',
    html: `
      <h3 style="margin:18px 0 6px;color:#0f172a;">Task 2: Multi-Firm Architecture & Role-Based Access Control</h3>
      <p><strong>Objective:</strong> Design and develop a prototype that supports multiple travel businesses or firms on the same platform while keeping their data secure and separate.</p>
      <p>Your solution should address:</p>
      <ul>
        <li>Creating or representing multiple firms within the platform.</li>
        <li>Defining roles such as Firm Owner, Admin, Manager, Sales Executive, and Staff.</li>
        <li>Providing different permissions based on each user's role.</li>
        <li>Ensuring that users from one firm cannot access another firm's private data.</li>
        <li>Demonstrating how access restrictions are enforced in the application or backend.</li>
      </ul>
      <p><strong>Expected outcome:</strong> A working prototype demonstrating firm-level data isolation and role-based permissions, with a clear explanation of your architecture.</p>
    `,
    text:
      'Task 2: Multi-Firm Architecture & Role-Based Access Control\n' +
      'Objective: Design and develop a prototype that supports multiple travel businesses or firms on the same platform while keeping their data secure and separate.\n' +
      'Your solution should address:\n' +
      '- Creating or representing multiple firms within the platform.\n' +
      '- Defining roles such as Firm Owner, Admin, Manager, Sales Executive, and Staff.\n' +
      "- Providing different permissions based on each user's role.\n" +
      "- Ensuring that users from one firm cannot access another firm's private data.\n" +
      '- Demonstrating how access restrictions are enforced in the application or backend.\n' +
      'Expected outcome: A working prototype demonstrating firm-level data isolation and role-based permissions, with a clear explanation of your architecture.\n',
  },
  3: {
    title: 'Advanced CRM & Lead-to-Booking Pipeline',
    html: `
      <h3 style="margin:18px 0 6px;color:#0f172a;">Task 3: Advanced CRM &amp; Lead-to-Booking Pipeline</h3>
      <p><strong>Objective:</strong> Improve the existing CRM concept to manage customer leads from their initial enquiry through conversion into a booking.</p>
      <p>Your solution should address:</p>
      <ul>
        <li>Managing leads through stages such as New, Contacted, Interested, Follow-up, Converted, and Lost.</li>
        <li>Assigning leads to team members.</li>
        <li>Recording follow-up activities, notes, and status updates.</li>
        <li>Demonstrating how a lead can be converted into an enquiry or booking.</li>
        <li>Identifying duplicate leads and providing basic pipeline insights.</li>
      </ul>
      <p><strong>Expected outcome:</strong> A working CRM prototype or functional module that demonstrates an organised lead-management and conversion workflow.</p>
    `,
    text:
      'Task 3: Advanced CRM & Lead-to-Booking Pipeline\n' +
      'Objective: Improve the existing CRM concept to manage customer leads from their initial enquiry through conversion into a booking.\n' +
      'Your solution should address:\n' +
      '- Managing leads through stages such as New, Contacted, Interested, Follow-up, Converted, and Lost.\n' +
      '- Assigning leads to team members.\n' +
      '- Recording follow-up activities, notes, and status updates.\n' +
      '- Demonstrating how a lead can be converted into an enquiry or booking.\n' +
      '- Identifying duplicate leads and providing basic pipeline insights.\n' +
      'Expected outcome: A working CRM prototype or functional module that demonstrates an organised lead-management and conversion workflow.\n',
  },
}

export async function sendPhase2ShortlistEmail({
  applicantName,
  applicantEmail,
  taskIds,
}: {
  applicantName: string
  applicantEmail: string
  taskIds: [Phase2TaskId, Phase2TaskId]
}): Promise<void> {
  const safeName = escapeHtml(applicantName)
  const [taskA, taskB] = taskIds.map(id => PHASE2_TASKS[id])

  const taskText = taskIds.map(id => PHASE2_TASKS[id].text).join('\n')

  await transporter.sendMail({
    from: `"Beacon Team" <${process.env.GMAIL_USER}>`,
    to: applicantEmail,
    subject: "You've been shortlisted for Phase 2 — Beacon Winter Internship (Product & Technology)",
    text:
      `Dear ${applicantName},\n\n` +
      `Congratulations!\n\n` +
      `You have been shortlisted for Phase 2 of the Beacon Winter Internship Program under the Product & Technology track.\n\n` +
      `In this phase, we want to evaluate your practical problem-solving ability, technical understanding, approach to real-world product development, and ability to work independently.\n\n` +
      `Deadline: Within 24 hours of receiving this email\n\n` +
      `You are required to complete one of the two technical tasks below (your choice) and one mandatory product-audit task.\n\n` +
      `PART A: TECHNICAL TASK - CHOOSE ONE\n\n` +
      taskText +
      `\nImportant: Work on only ONE of the two tasks above. You need to build a real, working prototype - not just a design document, wireframe, or written explanation. It doesn't need to be production-ready, but it must actually run and demonstrate the functionality described above.\n\n` +
      `PART B: MANDATORY TASK - BEACON PRODUCT AUDIT\n\n` +
      `Objective: Explore our existing product, Beacon - Life Beyond Routine (https://www.beaconlbr.com), and identify loopholes, weaknesses, bugs, usability problems, and opportunities for improvement. This task is mandatory regardless of which technical task you chose above.\n\n` +
      `Your audit should cover: UI/UX, functional issues, user journeys, performance and reliability, security and access control, and product improvements.\n\n` +
      `For every issue identified, provide: 1) Issue title, 2) Location, 3) Steps to reproduce, 4) Expected behaviour, 5) Actual behaviour, 6) Severity (Critical/High/Medium/Low with reason), 7) Suggested solution, 8) Evidence (screenshots or recording).\n\n` +
      `Please distinguish between confirmed bugs, suspected risks, and general improvement suggestions. Do not report an issue as a confirmed bug unless you have been able to reproduce it or otherwise substantiate it.\n\n` +
      `SUBMISSION REQUIREMENTS\n\n` +
      `Submit the following within 24 hours, to BOTH:\n` +
      `- Email: beaconlbr@gmail.com\n` +
      `- WhatsApp: 9766820696\n\n` +
      `1. Technical task: Source code or prototype link, with a short explanation of your approach.\n` +
      `2. Product audit: A report in PDF, document, or spreadsheet format.\n` +
      `3. Demo: A short screen recording or brief live demonstration, if possible.\n` +
      `4. README or documentation: Setup instructions, key features, assumptions, known limitations, and technologies used.\n\n` +
      `You may use your preferred technology stack. You can use sample or mock data where necessary, but clearly mention any assumptions. If you use AI tools, you should be able to explain the code, design decisions, and implementation.\n\n` +
      `Need help? Feel free to contact us anytime at 9766820696.\n\n` +
      `EVALUATION CRITERIA\n\n` +
      `Problem-solving and logical thinking; functionality and quality of the prototype; code quality and system design; practical understanding of the problem; depth and accuracy of the product audit; quality of documentation and demonstration; ability to prioritise issues and explain decisions.\n\n` +
      `What's next: This is Phase 2 of the selection process. Candidates who successfully complete this task will move on to the final round - a one-on-one interview with the Beacon team.\n\n` +
      `We understand that 24 hours is a limited time. We are not expecting a fully production-ready application. We are looking for a thoughtful, working proof of concept and evidence of your ability to analyse real product problems.\n\n` +
      `Please reply to this email confirming your participation.\n\n` +
      `All the best!\n\n` +
      `Team Beacon\nLife Beyond Routine`,
    html: `
      <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        <p>Dear ${safeName},</p>
        <p><strong>Congratulations! 🎉</strong></p>
        <p>You have been <strong>shortlisted for Phase 2 of the Beacon Winter Internship Program</strong> under the Product &amp; Technology track.</p>
        <p>In this phase, we want to evaluate your practical problem-solving ability, technical understanding, approach to real-world product development, and ability to work independently. Instead of evaluating you only through theoretical questions, we want you to work on a practical challenge related to real product requirements.</p>
        <p><strong>⏳ Deadline: Within 24 hours of receiving this email</strong></p>
        <p>You are required to complete <strong>one of the two technical tasks below (your choice)</strong> and <strong>one mandatory product-audit task</strong>.</p>

        <h2 style="color:#0f172a;">Part A: Technical Task — Choose One</h2>
        ${taskA.html}
        ${taskB.html}
        <p><strong>Important:</strong> Work on only ONE of the two tasks above — whichever you choose. <strong>You need to build a real, working prototype</strong> — not just a design document, wireframe, or written explanation. It doesn't need to be production-ready, but it must actually run and demonstrate the functionality described above. Focus on functionality, sound logic, and a clear demonstration rather than trying to build a complete production-ready system in 24 hours.</p>

        <h2 style="color:#0f172a;">Part B: Mandatory Task — Beacon Product Audit</h2>
        <p><strong>Objective:</strong> Explore our existing product, <a href="https://www.beaconlbr.com">Beacon – Life Beyond Routine</a>, and identify loopholes, weaknesses, bugs, usability problems, and opportunities for improvement. This task is mandatory regardless of which technical task you chose above.</p>
        <p>You are expected to examine the existing product from a real user's perspective and identify issues that could affect usability, reliability, security, performance, or the overall user experience.</p>
        <p>Your audit should cover areas such as:</p>
        <ul>
          <li><strong>UI/UX:</strong> Confusing navigation, inconsistent layouts, unclear buttons, poor responsiveness, or unnecessary steps.</li>
          <li><strong>Functional issues:</strong> Broken links, buttons that do not work, incomplete flows, unexpected errors, or inconsistent data.</li>
          <li><strong>User journeys:</strong> Difficulties a traveller or travel planner might face while discovering packages, exploring details, submitting enquiries, or using available features.</li>
          <li><strong>Performance and reliability:</strong> Slow-loading pages, rendering issues, or problems encountered during navigation.</li>
          <li><strong>Security and access control:</strong> Potentially exposed information, improper access restrictions, or other observable security concerns. Do not attempt destructive testing or access data that is not yours.</li>
          <li><strong>Product improvements:</strong> Missing features, inefficient workflows, and practical changes that could make Beacon more useful.</li>
        </ul>
        <p>For every issue identified, provide:</p>
        <ol>
          <li><strong>Issue title</strong> — A short, clear description.</li>
          <li><strong>Location</strong> — The page, section, or feature where it occurs.</li>
          <li><strong>Steps to reproduce</strong> — How someone can observe the issue.</li>
          <li><strong>Expected behaviour</strong> — What should happen.</li>
          <li><strong>Actual behaviour</strong> — What happened instead, if it is a functional issue.</li>
          <li><strong>Severity</strong> — Critical, High, Medium, or Low, with a brief reason.</li>
          <li><strong>Suggested solution</strong> — Your recommended fix or improvement.</li>
          <li><strong>Evidence</strong> — Screenshots or a short recording wherever possible.</li>
        </ol>
        <p>Please distinguish between confirmed bugs, suspected risks, and general improvement suggestions. Do not report an issue as a confirmed bug unless you have been able to reproduce it or otherwise substantiate it.</p>
        <p><strong>Expected outcome:</strong> A structured product-audit report containing your findings and prioritised recommendations. You do not need to fix every issue you identify.</p>

        <h2 style="color:#0f172a;">Submission Requirements</h2>
        <p>Submit the following <strong>within 24 hours</strong>, to <strong>both</strong>:</p>
        <ul>
          <li>Email: <a href="mailto:beaconlbr@gmail.com">beaconlbr@gmail.com</a></li>
          <li>WhatsApp: <strong>9766820696</strong></li>
        </ul>
        <ol>
          <li><strong>Technical task:</strong> Source code or prototype link, along with a short explanation of your approach.</li>
          <li><strong>Product audit:</strong> A report in PDF, document, or spreadsheet format listing the issues and recommended improvements.</li>
          <li><strong>Demo:</strong> A short screen recording or a brief live demonstration, if possible.</li>
          <li><strong>README or documentation:</strong> Setup instructions, key features, assumptions, known limitations, and technologies used.</li>
        </ol>
        <p>You may use your preferred technology stack. You can use sample or mock data where necessary, but clearly mention any assumptions. If you use AI tools, you should be able to explain the code, design decisions, and implementation.</p>
        <p><strong>Need help?</strong> Feel free to contact us anytime at <strong>9766820696</strong>.</p>

        <h2 style="color:#0f172a;">Evaluation Criteria</h2>
        <p>Your submission will be evaluated on:</p>
        <ul>
          <li>Problem-solving and logical thinking.</li>
          <li>Functionality and quality of the prototype.</li>
          <li>Code quality and system design, where applicable.</li>
          <li>Practical understanding of the problem.</li>
          <li>Depth and accuracy of the Beacon product audit.</li>
          <li>Quality of documentation and demonstration.</li>
          <li>Ability to prioritise issues and explain decisions.</li>
        </ul>
        <p><strong>What's next:</strong> This is Phase 2 of the selection process. Candidates who successfully complete this task will move on to the <strong>final round — a one-on-one interview</strong> with the Beacon team.</p>
        <p>We understand that 24 hours is a limited time. We are not expecting a fully production-ready application. We are looking for a thoughtful, working proof of concept and evidence of your ability to analyse real product problems.</p>
        <p>Please reply to this email confirming your participation.</p>
        <p>All the best!</p>
        <p><strong>Team Beacon</strong><br />Life Beyond Routine</p>
      </div>
    `,
  })
}

export async function sendPhase2ReminderEmail({
  applicantName,
  applicantEmail,
}: {
  applicantName: string
  applicantEmail: string
}): Promise<void> {
  const safeName = escapeHtml(applicantName)

  await transporter.sendMail({
    from: `"Beacon Team" <${process.env.GMAIL_USER}>`,
    to: applicantEmail,
    subject: 'Reminder: Phase 2 Submission Deadline — Beacon Winter Internship',
    text:
      `Dear ${applicantName},\n\n` +
      `This is a quick reminder regarding your Phase 2 shortlist task for the Beacon Winter Internship Program (Product & Technology track), sent to you yesterday.\n\n` +
      `Your submission window will be closing by tonight.\n\n` +
      `Please send everything as soon as possible to:\n` +
      `- Email: beaconlbr@gmail.com\n` +
      `- WhatsApp: 9766820696\n\n` +
      `Required submission:\n` +
      `1. Technical task - source code or prototype link, with a short explanation of your approach.\n` +
      `2. Product audit report.\n` +
      `3. A short demo/screen recording, if possible.\n` +
      `4. README or documentation.\n\n` +
      `If you need any help or are stuck on something, message us on WhatsApp at 9766820696.\n\n` +
      `All the best!\n\n` +
      `Team Beacon\nLife Beyond Routine`,
    html: `
      <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        <p>Dear ${safeName},</p>
        <p>This is a quick reminder regarding your <strong>Phase 2 shortlist task</strong> for the Beacon Winter Internship Program (Product &amp; Technology track), sent to you yesterday.</p>
        <p><strong>Your submission window will be closing by tonight.</strong></p>
        <p>Please send everything as soon as possible to:</p>
        <ul>
          <li>Email: <a href="mailto:beaconlbr@gmail.com">beaconlbr@gmail.com</a></li>
          <li>WhatsApp: <strong>9766820696</strong></li>
        </ul>
        <p>Required submission:</p>
        <ol>
          <li>Technical task — source code or prototype link, with a short explanation of your approach.</li>
          <li>Product audit report.</li>
          <li>A short demo/screen recording, if possible.</li>
          <li>README or documentation.</li>
        </ol>
        <p>If you need any help or are stuck on something, message us on WhatsApp at <strong>9766820696</strong>.</p>
        <p>All the best!</p>
        <p><strong>Team Beacon</strong><br />Life Beyond Routine</p>
      </div>
    `,
  })
}

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
