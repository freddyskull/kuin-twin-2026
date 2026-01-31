/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ServiceUnit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abbreviation]` on the table `ServiceUnit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ServiceUnit_name_key" ON "ServiceUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceUnit_abbreviation_key" ON "ServiceUnit"("abbreviation");
