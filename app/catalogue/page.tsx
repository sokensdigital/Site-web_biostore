import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma, withRetry } from '@/lib/db'
import ProductDialogProvider from '@/components/site/product-dialog-context'
import CatalogueClient from '@/components/site/catalogue-client'
import MobileNav from '@/components/site/mobile-nav'

export const revalidate = 3600

export default async function CataloguePage() {
  const [content, products] = await withRetry(() =>
    Promise.all([
      prisma.siteContent.findUniqueOrThrow({ where: { id: 1 } }),
      prisma.product.findMany({ orderBy: { position: 'asc' } }),
    ])
  )

  return (
    <main className="site-shell">
      <ProductDialogProvider whatsappNumber={content.whatsappNumber}>
        <header className="site-header">
          <div className="container nav-wrap">
            <Link href="/" className="brand" aria-label="Biostore, accueil">
              <img src="/logo_biostore-removebg-preview.png" alt="Biostore" className="brand-logo" />
            </Link>
            <MobileNav whatsappNumber={content.whatsappNumber} />
          </div>
        </header>

        <section className="catalogue-hero section">
          <div className="container">
            <Link href="/" className="back-link"><ArrowLeft size={16} /> Retour à l’accueil</Link>
            <div className="section-heading">
              <div className="eyebrow"><span className="eyebrow-line" /> Catalogue complet</div>
              <h2>Tous nos <em>produits.</em></h2>
              <p>Recherchez par nom ou filtrez par catégorie pour trouver votre essentiel du quotidien.</p>
            </div>
            <CatalogueClient products={products} whatsappNumber={content.whatsappNumber} />
          </div>
        </section>
      </ProductDialogProvider>
    </main>
  )
}
