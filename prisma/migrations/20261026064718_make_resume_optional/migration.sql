-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "resumeBlobPath" DROP NOT NULL,
ALTER COLUMN "resumeOriginalName" DROP NOT NULL,
ALTER COLUMN "resumeSizeBytes" DROP NOT NULL;
