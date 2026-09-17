import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroEyebrow: 'Le goût du vrai',
      heroTitle: 'Le naturel, avec intention.',
      heroText:
        'Nous transformons les richesses de notre terroir en produits simples, sains et savoureux. Pour prendre soin de vous, naturellement.',
      heroImage: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85',
      storyTitle: 'Faire mieux, naturellement.',
      storyText:
        'Biostore est né d’une conviction simple : les meilleurs produits sont ceux qui respectent à la fois la nature, ceux qui la cultivent et ceux qui les consomment.',
      storyImage: 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1000&q=85',
      productsTitle: 'Nos essentiels du quotidien.',
      ctaTitle: 'Prêt à goûter la différence ?',
      whatsappNumber: '24177000000',
    },
  })

  const products = [
    {
      name: 'Huile de coco vierge',
      category: 'Huiles végétales',
      description: 'Extraite à froid de noix fraîches, douce et polyvalente.',
      price: '4 500 FCFA',
      format: '250 ml',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85',
      ingredients: '100% noix de coco vierge',
      conservation: 'À conserver à température ambiante, à l’abri de la lumière.',
      position: 0,
    },
    {
      name: 'Miel pur des collines',
      category: 'Douceurs naturelles',
      description: 'Un miel ambré et floral récolté avec soin auprès de nos apiculteurs.',
      price: '5 000 FCFA',
      format: '350 g',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
      ingredients: '100% miel de fleurs',
      conservation: 'À conserver dans un endroit sec. Ne pas réfrigérer.',
      position: 1,
    },
    {
      name: 'Poudre de gingembre',
      category: 'Épices & infusions',
      description: 'Une poudre intense et parfumée pour relever vos recettes et infusions.',
      price: '2 500 FCFA',
      format: '100 g',
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=900&q=85',
      ingredients: '100% gingembre séché et moulu',
      conservation: 'À conserver au sec, bien refermé après ouverture.',
      position: 2,
    },
    {
      name: 'Noix de cajou grillées',
      category: 'En-cas sains',
      description: 'Des noix croquantes, grillées doucement sans huile ni additif.',
      price: '3 500 FCFA',
      format: '200 g',
      image: 'https://images.unsplash.com/photo-1536591375667-f7a8b5a6c3b1?auto=format&fit=crop&w=900&q=85',
      ingredients: '100% noix de cajou, une pincée de sel marin',
      conservation: 'À conserver dans un endroit frais et sec.',
      position: 3,
    },
  ]

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } })
    if (!existing) await prisma.product.create({ data: product })
  }

  const outlets = [
    { name: 'MBOLO', city: 'Libreville, Gabon', image: '/points-of-sale/mbolo.jpg', imageFit: 'cover', position: 0 },
    { name: 'SUPER CKDO', city: 'Libreville, Gabon', image: '/points-of-sale/super-ckdo.png', imageFit: 'contain', position: 1 },
    { name: 'PRIX IMPORT', city: 'Libreville, Gabon', image: '/points-of-sale/prix-import.png', imageFit: 'contain', position: 2 },
    { name: 'Geant CKDO', city: 'Libreville, Gabon', image: '/points-of-sale/geant-ckdo.png', imageFit: 'contain', position: 3 },
  ]

  for (const outlet of outlets) {
    const existing = await prisma.pointOfSale.findFirst({ where: { name: outlet.name } })
    if (!existing) await prisma.pointOfSale.create({ data: outlet })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
