-- CreateEnum
CREATE TYPE "Portfolio" AS ENUM ('PRODUCT_TECHNOLOGY', 'SPONSORSHIP_EVENTS', 'MARKETING_GROWTH', 'RESEARCH_LEAD_GENERATION', 'SOCIAL_MEDIA_CONTENT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "YearOfStudy" AS ENUM ('FIRST_YEAR', 'SECOND_YEAR', 'THIRD_YEAR', 'FOURTH_YEAR', 'FINAL_YEAR', 'POST_GRADUATE', 'OTHER');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "yearOfStudy" "YearOfStudy" NOT NULL,
    "degreeBranch" TEXT NOT NULL,
    "primaryPortfolio" "Portfolio" NOT NULL,
    "secondaryPortfolio" "Portfolio",
    "availableStartDate" TIMESTAMP(3) NOT NULL,
    "availableEndDate" TIMESTAMP(3) NOT NULL,
    "skills" TEXT NOT NULL,
    "resumeBlobPath" TEXT NOT NULL,
    "resumeOriginalName" TEXT NOT NULL,
    "resumeSizeBytes" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "emailStatus" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "emailError" TEXT,
    "emailSentAt" TIMESTAMP(3),
    "ipHash" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_email_idx" ON "Application"("email");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_primaryPortfolio_idx" ON "Application"("primaryPortfolio");

-- CreateIndex
CREATE INDEX "Application_submittedAt_idx" ON "Application"("submittedAt");

-- CreateIndex
CREATE INDEX "Application_ipHash_submittedAt_idx" ON "Application"("ipHash", "submittedAt");
