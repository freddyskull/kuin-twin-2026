-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "dynamicAttributes" JSONB,
ADD COLUMN     "imageGallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
