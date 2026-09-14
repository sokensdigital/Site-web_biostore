import {
  ArrowRight,
  Check,
  ChevronDown,
  Leaf,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import { prisma, withRetry } from '@/lib/db'
import { formatPhoneNumber } from '@/lib/utils'
import MobileNav from '@/components/site/mobile-nav'
import ProductGallery from '@/components/site/product-gallery'
import HeroProductCard from '@/components/site/hero-product-card'
import ProductDialogProvider from '@/components/site/product-dialog-context'

const values = [
  { icon: Leaf, title: 'Naturel par choix', text: 'Des ingrédients bruts, sélectionnés avec exigence et sans superflu.' },
  { icon: ShieldCheck, title: 'Sûr et transparent', text: 'Une transformation soignée, une hygiène rigoureuse et une traçabilité claire.' },
  { icon: Sparkles, title: 'Fait avec soin', text: 'Chaque produit est préparé en petites quantités pour préserver ses qualités.' },
]

const testimonials = [
  { quote: 'Le miel est exceptionnel, on sent vraiment la différence avec les produits industriels.', name: 'Aïcha M.', place: 'Douala' },
  { quote: 'J’ai découvert Biostore par une amie et depuis, l’huile de coco ne quitte plus ma cuisine.', name: 'Nadine T.', place: 'Yaoundé' },
  { quote: 'Un service chaleureux, des produits propres et une livraison toujours ponctuelle.', name: 'Franck E.', place: 'Bafoussam' },
]

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [content, products] = await withRetry(() =>
    Promise.all([
      prisma.siteContent.findUniqueOrThrow({ where: { id: 1 } }),
      prisma.product.findMany({ orderBy: { position: 'asc' } }),
    ])
  )

  const whatsappLink = (message: string) => `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(message)}`
  const formattedWhatsappNumber = formatPhoneNumber(content.whatsappNumber)
  const featuredProduct = products[1] ?? products[0]

  return (
    <main className="site-shell">
    <ProductDialogProvider whatsappNumber={content.whatsappNumber}>
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="#accueil" className="brand" aria-label="Biostore, accueil">
            <span className="brand-mark"><Leaf size={18} strokeWidth={2.5} /></span>
            <span>bio<span>store</span></span>
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
            <div className="hero-image-wrap">
              <img src={content.heroImage} alt="Plantes vertes et produits naturels Biostore" />
            </div>
            {featuredProduct && <HeroProductCard product={featuredProduct} />}
            <div className="hero-stamp"><span>100%</span><small>naturel</small></div>
          </div>
        </div>
        <a className="scroll-cue" href="#histoire"><ChevronDown size={18} /> Faire défiler</a>
      </section>

      <section className="trust-strip"><div className="container trust-items"><span>Du champ à votre table</span><span className="trust-dot" /><span>Qualité locale</span><span className="trust-dot" /><span>Conseil personnalisé</span><span className="trust-dot" /><span>Livraison disponible</span></div></section>

      <section className="story-section section" id="histoire">
        <div className="container story-grid">
          <div className="story-collage"><div className="story-main-image"><img src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1000&q=85" alt="Récolte de feuilles fraîches" /></div><div className="story-small-image"><img src="https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?auto=format&fit=crop&w=700&q=85" alt="Mains tenant une jeune plante" /></div><div className="story-badge"><Leaf size={18} /><span>Depuis<br /><strong>2021</strong></span></div></div>
          <div className="story-copy"><div className="eyebrow"><span className="eyebrow-line" /> Notre histoire</div><h2>{content.storyTitle}</h2><p>{content.storyText}</p><a className="text-link" href="#contact">Découvrir notre démarche <ArrowRight size={16} /></a></div>
        </div>
      </section>

      <section className="values-section section"><div className="container"><div className="section-heading centered"><div className="eyebrow"><span className="eyebrow-line" /> Ce qui nous guide <span className="eyebrow-line" /></div><h2>Simplement <em>bon.</em></h2><p>Des choix qui font toute la différence, de la sélection à votre panier.</p></div><div className="values-grid">{values.map(({ icon: Icon, title, text }) => <div className="value-card" key={title}><div className="value-icon"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <section className="products-section section" id="produits">
        <div className="container">
          <div className="section-heading product-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> La sélection Biostore</div><h2>{content.productsTitle}</h2></div>
            <p>Des produits authentiques, préparés en petites quantités et pensés pour s’intégrer naturellement dans votre quotidien.</p>
          </div>
          <ProductGallery products={products} whatsappNumber={content.whatsappNumber} />
        </div>
      </section>

      <section className="benefits-section section"><div className="container benefits-grid"><div className="benefits-copy"><div className="eyebrow"><span className="eyebrow-line" /> Votre tranquillité d’esprit</div><h2>Du bon,<br /><em>sans compromis.</em></h2><p>Parce que bien manger commence par savoir ce que l’on met dans son assiette.</p><div className="benefits-list"><div><PackageCheck size={21} /><span><strong>Des matières premières choisies</strong><small>Auprès de producteurs passionnés et engagés.</small></span></div><div><ShieldCheck size={21} /><span><strong>Une transformation maîtrisée</strong><small>Dans le respect des bonnes pratiques d’hygiène.</small></span></div><div><Truck size={21} /><span><strong>Un service qui vous ressemble</strong><small>Commande simple, conseil humain et livraison fiable.</small></span></div></div></div><div className="benefits-image"><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1100&q=85" alt="Légumes frais et panier de produits naturels" /><div className="image-caption"><span className="caption-mark">“</span><p>La qualité n’est pas un détail.<br /><strong>C’est notre point de départ.</strong></p></div></div></div></section>

      <section className="testimonials-section section"><div className="container"><div className="section-heading centered"><div className="eyebrow"><span className="eyebrow-line" /> Ils nous font confiance <span className="eyebrow-line" /></div><h2>Des mots qui<br /><em>nous nourrissent.</em></h2></div><div className="testimonials-grid">{testimonials.map((testimonial) => <figure className="testimonial" key={testimonial.name}><div className="stars">{[1,2,3,4,5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><blockquote>“{testimonial.quote}”</blockquote><figcaption><span className="avatar">{testimonial.name.charAt(0)}</span><span><strong>{testimonial.name}</strong><small>{testimonial.place}</small></span></figcaption></figure>)}</div></div></section>

      <section className="final-cta" id="contact"><div className="container final-cta-inner"><div><div className="eyebrow light"><span className="eyebrow-line" /> Parlons de vos envies</div><h2>{content.ctaTitle}</h2><p>Une question, une commande ou simplement envie d’échanger ? Notre équipe vous répond avec plaisir.</p></div><a className="button button-light button-large" href={whatsappLink('Bonjour Biostore, je souhaite échanger avec vous.')} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Écrire sur WhatsApp</a></div></section>

      <footer className="site-footer"><div className="container footer-grid"><div><a href="#accueil" className="brand footer-brand"><span className="brand-mark"><Leaf size={18} strokeWidth={2.5} /></span><span>bio<span>store</span></span></a><p>Le naturel, avec intention.<br />Des produits vrais, pour une vie plus saine.</p></div><div><h3>Explorer</h3><a href="#produits">Nos produits</a><a href="#histoire">Notre histoire</a><a href="#contact">Nous contacter</a></div><div><h3>Nous trouver</h3><p>Douala, Cameroun</p><p>Lun – Sam · 8h – 18h</p><a className="footer-whatsapp" href={whatsappLink('Bonjour Biostore, je souhaite vous contacter.')} target="_blank" rel="noreferrer"><MessageCircle size={15} /> {formattedWhatsappNumber}</a></div></div><div className="container footer-bottom"><span>© 2024 Biostore. Tous droits réservés.</span><span>Fait avec soin au Cameroun</span></div></footer>

      <a className="floating-whatsapp" href={whatsappLink('Bonjour Biostore, je souhaite passer une commande.')} target="_blank" rel="noreferrer" aria-label="Contacter Biostore sur WhatsApp"><MessageCircle size={25} /></a>
    </ProductDialogProvider>
    </main>
  )
}
