-- AlterTable
ALTER TABLE "SiteContent" ALTER COLUMN "missionText2" SET DEFAULT 'Pas d''additifs, pas de raccourcis : chaque produit qui porte notre nom est préparé avec la même rigueur que le tout premier pot de piment vendu en 2021.';

-- Update existing content only if it was never customized from the admin
UPDATE "SiteContent"
SET "missionText2" = 'Pas d''additifs, pas de raccourcis : chaque produit qui porte notre nom est préparé avec la même rigueur que le tout premier pot de piment vendu en 2021.'
WHERE "missionText2" = 'Pas d''additifs, pas de raccourcis : chaque produit qui porte notre nom est préparé avec la même rigueur que le tout premier pot de miel vendu en 2021.';
