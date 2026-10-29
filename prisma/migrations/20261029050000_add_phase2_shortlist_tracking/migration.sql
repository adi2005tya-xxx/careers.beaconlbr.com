-- Phase 2 shortlist email tracking (see /api/admin/applications/send-phase2).
-- phase2EmailSentAt lets the batch-send endpoint be safely re-triggered
-- without re-emailing anyone who already got theirs. phase2TaskIds
-- records which 2 of the 3 technical tasks this candidate was offered.
ALTER TABLE "Application" ADD COLUMN "phase2EmailSentAt" TIMESTAMP(3);
ALTER TABLE "Application" ADD COLUMN "phase2TaskIds" TEXT;
