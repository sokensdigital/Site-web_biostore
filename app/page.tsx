import {
  ArrowRight,
  Check,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { prisma, withRetry } from '@/lib/db'
import { formatPhoneNumber } from '@/lib/utils'
import MobileNav from '@/components/site/mobile-nav'
import ProductGallery from '@/components/site/product-gallery'
import HeroCarousel from '@/components/site/hero-carousel'
import HeroProductCard from '@/components/site/hero-product-card'
import ProductDialogProvider from '@/components/site/product-dialog-context'
import StatsSection from '@/components/site/stats-section'
import StoryCollage from '@/components/site/story-collage'
import PointsOfSale from '@/components/site/points-of-sale'
import ValuesSection from '@/components/site/values-section'
import FounderSection from '@/components/site/founder-section'
import MissionSection from '@/components/site/mission-section'
import TestimonialsMarquee from '@/components/site/testimonials-marquee'
import TestimonialModal from '@/components/site/testimonial-modal'

const foundingYear = 2021

const testimonials: { quote: string; name: string; place: string }[] = []

export const revalidate = 3600

export default async function Page() {
  const [content, products, outlets, heroImages] = await withRetry(() =>
    Promise.all([
      prisma.siteContent.findUniqueOrThrow({ where: { id: 1 } }),
      prisma.product.findMany({ orderBy: { position: 'asc' } }),
      prisma.pointOfSale.findMany({ orderBy: { position: 'asc' } }),
      prisma.heroImage.findMany({ orderBy: { position: 'asc' } }),
    ])
  )

  const heroCarouselImages = [content.heroImage, ...heroImages.map((h) => h.image)]

  const whatsappLink = (message: string) => `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(message)}`
  const formattedWhatsappNumber = formatPhoneNumber(content.whatsappNumber)
  const featuredProduct = products[1] ?? products[0]
  const stats = [
    { value: new Date().getFullYear() - foundingYear, suffix: '+', label: 'Années d’expérience' },
    { value: products.length, suffix: '', label: products.length > 1 ? 'Produits artisanaux' : 'Produit artisanal' },
    { value: 100, suffix: '%', label: 'Naturel' },
  ]

  return (
    <main className="site-shell">
    <ProductDialogProvider whatsappNumber={content.whatsappNumber}>
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="#accueil" className="brand" aria-label="Biostore, accueil">
            <img src="/logo_biostore-removebg-preview.png" alt="Biostore" className="brand-logo" />
          </a>
          <MobileNav whatsappNumber={content.whatsappNumber} />
        </div>
      </header>

      <section className="hero" id="accueil">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> {content.heroEyebrow}</div>
            <h1>{content.heroTitle}</h1>
            <p className="hero-text">{content.heroText}</p>
            <div className="hero-actions">
              <a className="button button-primary button-large" href="#produits">Découvrir nos produits <ArrowRight size={18} /></a>
              <a className="text-link" href="#histoire">En savoir plus <ArrowRight size={16} /></a>
            </div>
            <div className="hero-note"><Check size={16} /> Produits locaux · Transformés avec soin</div>
          </div>
          <div className="hero-visual">
            <HeroCarousel images={heroCarouselImages} alt="Plantes vertes et produits naturels Biostore" />
            {featuredProduct && <HeroProductCard product={featuredProduct} />}
            <div className="hero-stamp"><span>100%</span><small>naturel</small></div>
          </div>
        </div>
      </section>

      <StatsSection stats={stats} locationLabel="Libreville, Gabon" />

      <section className="story-section section" id="histoire">
        <div className="container story-grid">
          <StoryCollage foundingYear={foundingYear} image={content.storyImage} />
          <div className="story-copy"><div className="eyebrow"><span className="eyebrow-line" /> Notre histoire</div><h2>{content.storyTitle}</h2><p>{content.storyText}</p><Link className="text-link" href="/a-propos">Découvrir notre démarche <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <FounderSection
        photo={content.founderPhoto}
        quote={content.founderQuote}
        text={content.founderText}
        name={content.founderName}
        role={content.founderRole}
      />

      <ValuesSection />

      <section className="products-section section" id="produits">
        <div className="container">
          <div className="section-heading product-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> La sélection Biostore</div><h2>{content.productsTitle}</h2></div>
            <p>Des produits authentiques, préparés en petites quantités et pensés pour s’intégrer naturellement dans votre quotidien.</p>
          </div>
          <ProductGallery products={products.slice(0, 3)} whatsappNumber={content.whatsappNumber} />
        </div>
      </section>

      <MissionSection
        title={content.missionTitle}
        text1={content.missionText1}
        text2={content.missionText2}
        image={content.missionImage}
        quote={content.missionQuote}
        ctaHref="#produits"
      />

      <PointsOfSale outlets={outlets} />

      <section className="benefits-section section"><div className="container benefits-grid"><div className="benefits-copy"><div className="eyebrow"><span className="eyebrow-line" /> Votre tranquillité d’esprit</div><h2>{content.benefitsTitle}</h2><p>{content.benefitsText}</p><div className="benefits-list"><div><PackageCheck size={21} /><span><strong>Des matières premières choisies</strong><small>Auprès de producteurs passionnés et engagés.</small></span></div><div><ShieldCheck size={21} /><span><strong>Une transformation maîtrisée</strong><small>Dans le respect des bonnes pratiques d’hygiène.</small></span></div><div><Truck size={21} /><span><strong>Un service qui vous ressemble</strong><small>Commande simple, conseil humain et livraison fiable.</small></span></div></div></div><div className="benefits-image"><img src={content.benefitsImage} alt="Légumes frais et panier de produits naturels" /><div className="image-caption"><span className="caption-mark">“</span><p>{content.benefitsCaption}</p></div></div></div></section>

      <section className="testimonials-section section"><div className="container"><div className="section-heading centered"><div className="eyebrow"><span className="eyebrow-line" /> Ils nous font confiance <span className="eyebrow-line" /></div><h2>Des mots qui<br /><em>nous nourrissent.</em></h2></div><TestimonialsMarquee testimonials={testimonials} /><div className="testimonial-cta-wrap"><TestimonialModal /></div></div></section>

      <section className="final-cta" id="contact"><div className="container final-cta-inner"><div><div className="eyebrow light"><span className="eyebrow-line" /> Parlons de vos envies</div><h2>{content.ctaTitle}</h2><p>Une question, une commande ou simplement envie d’échanger ? Notre équipe vous répond avec plaisir.</p></div><a className="button button-light button-large" href={whatsappLink('Bonjour Biostore, je souhaite échanger avec vous.')} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Écrire sur WhatsApp</a></div></section>

      <footer className="site-footer"><div className="container footer-grid"><div><a href="#accueil" className="brand footer-brand"><img src="/logo_biostore-removebg-preview.png" alt="Biostore" className="brand-logo" /></a><p>Le naturel, avec intention.<br />Des produits vrais, pour une vie plus saine.</p></div><div><h3>Explorer</h3><a href="#produits">Nos produits</a><a href="#histoire">Notre histoire</a><a href="#contact">Nous contacter</a></div><div><h3>Nous trouver</h3><p>Libreville, Gabon</p><p>Lun – Sam · 8h – 18h</p><a className="footer-whatsapp" href={whatsappLink('Bonjour Biostore, je souhaite vous contacter.')} target="_blank" rel="noreferrer"><MessageCircle size={15} /> {formattedWhatsappNumber}</a></div></div><div className="container footer-bottom"><span>© 2024 Biostore. Tous droits réservés.</span><span>Développé par <a href="https://www.sokensdigital.com">SOKEN'S DIGITAL</a></span></div></footer>

      <a className="floating-whatsapp" href={whatsappLink('Bonjour Biostore, je souhaite passer une commande.')} target="_blank" rel="noreferrer" aria-label="Contacter Biostore sur WhatsApp"><MessageCircle size={25} /></a>
    </ProductDialogProvider>
    </main>
  )
}
