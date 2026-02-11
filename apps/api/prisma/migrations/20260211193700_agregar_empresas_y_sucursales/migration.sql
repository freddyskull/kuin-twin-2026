-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "companyId" TEXT;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "rfc" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "fiscalRegime" TEXT NOT NULL,
    "taxAddress" TEXT NOT NULL,
    "taxAddressZip" TEXT NOT NULL,
    "taxAddressCity" TEXT NOT NULL,
    "taxAddressState" TEXT NOT NULL,
    "taxAddressCounty" TEXT,
    "isSatVerified" BOOLEAN NOT NULL DEFAULT false,
    "satVerifiedAt" TIMESTAMP(3),
    "satCertificateUrl" TEXT,
    "satVerificationDoc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "county" TEXT,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'México',
    "location" geography(Point, 4326),
    "addressNotes" TEXT,
    "businessHours" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_rfc_key" ON "Company"("rfc");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
