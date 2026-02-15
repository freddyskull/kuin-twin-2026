/*
  Warnings:

  - You are about to drop the `_CompanyToService` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `slug` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToService" DROP CONSTRAINT "_CompanyToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToService" DROP CONSTRAINT "_CompanyToService_B_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "commentsBox" JSONB,
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "location" geography(Point, 4326),
ADD COLUMN     "reviewsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "showPrice" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "starsRate" DECIMAL(3,2) NOT NULL DEFAULT 0,
ALTER COLUMN "slug" SET NOT NULL;

-- DropTable
DROP TABLE "_CompanyToService";

-- CreateIndex
CREATE INDEX "Service_companyId_idx" ON "Service"("companyId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
