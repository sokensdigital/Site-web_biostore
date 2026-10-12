-- AlterTable
ALTER TABLE "SiteContent" ADD COLUMN     "benefitsCaption" TEXT NOT NULL DEFAULT 'La qualité n''est pas un détail. C''est notre point de départ.',
ADD COLUMN     "benefitsImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1100&q=85',
ADD COLUMN     "benefitsText" TEXT NOT NULL DEFAULT 'Parce que bien manger commence par savoir ce que l''on met dans son assiette.',
ADD COLUMN     "benefitsTitle" TEXT NOT NULL DEFAULT 'Du bon, sans compromis.',
ALTER COLUMN "founderName" SET DEFAULT 'Ruth Rudy';

-- CreateTable
CREATE TABLE "HeroImage" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroImage_position_idx" ON "HeroImage"("position");
