-- CreateTable
CREATE TABLE "_CompanyToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToService_B_index" ON "_CompanyToService"("B");

-- AddForeignKey
ALTER TABLE "_CompanyToService" ADD CONSTRAINT "_CompanyToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToService" ADD CONSTRAINT "_CompanyToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
