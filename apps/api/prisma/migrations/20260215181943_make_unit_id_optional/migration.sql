-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_unitId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "unitId" DROP NOT NULL,
ALTER COLUMN "basePrice" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "ServiceUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
