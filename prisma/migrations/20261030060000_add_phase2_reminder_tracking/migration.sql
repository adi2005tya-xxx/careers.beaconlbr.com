-- Phase 2 reminder email tracking (see /api/admin/applications/send-phase2-reminder).
-- Set once sent, so the batch endpoint can be safely re-triggered without
-- re-reminding anyone who already got theirs.
ALTER TABLE "Application" ADD COLUMN "phase2ReminderSentAt" TIMESTAMP(3);
