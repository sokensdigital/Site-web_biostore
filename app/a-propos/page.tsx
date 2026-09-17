import Link from 'next/link'
import { ArrowLeft, ArrowRight, Leaf, MessageCircle, ShieldCheck, Sprout, Users } from 'lucide-react'
import { prisma, withRetry } from '@/lib/db'
import { formatPhoneNumber } from '@/lib/utils'
import MobileNav from '@/components/site/mobile-nav'
import StatsSection from '@/components/site/stats-section'
import FounderSection from '@/components/site/founder-section'

export const revalidate = 3600

const foundingYear = 2021

const commitmentIcons = [Sprout, ShieldCheck, Users]

export default async function AboutPage() {
  const [content, products, outlets] = await withRetry(() =>
    Promise.all([
      prisma.siteContent.findUniqueOrThrow({ where: { id: 1 } }),
      prisma.product.findMany({ select: { id: true } }),
      prisma.pointOfSale.findMany({ select: { id: true } }),
    ])
  )

  const whatsappLink = (message: string) => `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(message)}`
  const formattedWhatsappNumber = formatPhoneNumber(content.whatsappNumber)

  const stats = [
    { value: new Date().getFullYear() - foundingYear, suffix: '+', label: 'Années d’expérience' },
    { value: products.length, suffix: '', label: products.length > 1 ? 'Produits artisanaux' : 'Produit artisanal' },
    { value: outlets.length, suffix: '+', label: 'Points de vente partenaires' },
  ]

  const commitments = [
    { title: content.commitment1Title, text: content.commitment1Text },
    { title: content.commitment2Title, text: content.commitment2Text },
    { title: content.commitment3Title, text: content.commitment3Text },
  ]

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand" aria-label="Biostore, accueil">
            <img src="/logo_biostore-removebg-preview.png" alt="Biostore" className="brand-logo" />
          </Link>
          <MobileNav whatsappNumber={content.whatsappNumber} />
        </div>
      </header>

      <section className="catalogue-hero about-hero section">
        <div className="container">
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Retour à l’accueil</Link>
          <div className="section-heading about-heading">
            <div className="eyebrow"><span className="eyebrow-line" /> Notre histoire</div>
            <h1>{content.aboutHeroTitle}</h1>
            <p>{content.aboutHeroText}</p>
          </div>
        </div>
      </section>

      <StatsSection stats={stats} locationLabel="Libreville, Gabon" />

      <FounderSection
        photo={content.founderPhoto}
        quote={content.founderQuote}
        text={content.founderText}
        name={content.founderName}
        role={content.founderRole}
      />

      <section className="mission-section section">
        <div className="container mission-grid">
          <div className="mission-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Notre mission</div>
            <h2>{content.missionTitle}</h2>
            <p>{content.missionText1}</p>
            <p>{content.missionText2}</p>
            <a className="text-link" href="#produits-cta">Découvrir nos produits <ArrowRight size={16} /></a>
          </div>
          <div className="mission-image">
            <img src={content.missionImage} alt="Ingrédients naturels et produits Biostore" />
            <div className="image-caption">
              <span className="caption-mark">“</span>
              <p>{content.missionQuote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section section">
        <div className="container">
          <div className="section-heading centered">
            <div className="eyebrow"><span className="eyebrow-line" /> Notre engagement <span className="eyebrow-line" /></div>
            <h2>Plus qu’une <em>marque.</em></h2>
            <p>Trois engagements qui guident chacune de nos décisions, du champ jusqu’à votre table.</p>
          </div>
          <div className="values-journey">
            <div className="values-grid">
              {commitments.map(({ title, text }, index) => {
                const Icon = commitmentIcons[index]
                return (
                  <div className={`value-card value-card-${index % 2 === 1 ? 'raised' : 'base'}`} key={title}>
                    <span className="value-index">{String(index + 1).padStart(2, '0')}</span>
                    <div className="value-icon"><Icon size={22} /></div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta" id="produits-cta">
        <div className="container final-cta-inner">
          <div>
            <div className="eyebrow light"><span className="eyebrow-line" /> Envie de nous découvrir</div>
            <h2>{content.ctaTitle}</h2>
            <p>Parcourez notre catalogue ou écrivez-nous directement, notre équipe vous répond avec plaisir.</p>
          </div>
          <Link className="button button-light button-large" href="/catalogue">
            <Leaf size={18} /> Voir le catalogue
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link href="/" className="brand footer-brand"><img src="/logo_biostore-removebg-preview.png" alt="Biostore" className="brand-logo" /></Link>
            <p>Le naturel, avec intention.<br />Des produits vrais, pour une vie plus saine.</p>
          </div>
          <div>
            <h3>Explorer</h3>
            <Link href="/#produits">Nos produits</Link>
            <Link href="/a-propos">Notre histoire</Link>
            <Link href="/#contact">Nous contacter</Link>
          </div>
          <div>
            <h3>Nous trouver</h3>
            <p>Libreville, Gabon</p>
            <p>Lun – Sam · 8h – 18h</p>
            <a className="footer-whatsapp" href={whatsappLink('Bonjour Biostore, je souhaite vous contacter.')} target="_blank" rel="noreferrer"><MessageCircle size={15} /> {formattedWhatsappNumber}</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2024 Biostore. Tous droits réservés.</span>
          <span>Fait avec soin au Gabon</span>
        </div>
      </footer>

      <a className="floating-whatsapp" href={whatsappLink('Bonjour Biostore, je souhaite passer une commande.')} target="_blank" rel="noreferrer" aria-label="Contacter Biostore sur WhatsApp"><MessageCircle size={25} /></a>
    </main>
  )
}
