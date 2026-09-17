'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle, Plus } from 'lucide-react'
import type { Product } from '@/lib/content'
import { useProductDialog } from './product-dialog-context'

export default function ProductGallery({ products, whatsappNumber }: { products: Product[]; whatsappNumber: string }) {
  const { open } = useProductDialog()
  const whatsappLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(0)
  const itemCount = products.length + 1 // + "voir plus" card

  // Track which card is nearest the center of the scroller, to light up the matching dot.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    function onScroll() {
      if (!el) return
      const center = el.scrollLeft + el.clientWidth / 2
      let closest = 0
      let closestDist = Infinity
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(cardCenter - center)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })
      setActive(closest)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [itemCount])

  // Nudge the row once, on arrival, so it's obvious there's more to scroll.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        el.scrollTo({ left: 130, behavior: 'smooth' })
        const timer = setTimeout(() => el.scrollTo({ left: 0, behavior: 'smooth' }), 700)
        return () => clearTimeout(timer)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function scrollToCard(index: number) {
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <>
      <div className="products-scroller" ref={scrollerRef}>
        {products.map((product, index) => (
          <article
            className="product-card"
            key={product.id}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            onClick={() => open(product)}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <span className="product-category">{product.category}</span>
              <button
                className="product-plus"
                aria-label={`Voir les détails de ${product.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  open(product)
                }}
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="product-info">
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <div className="product-bottom">
                <strong>{product.price}</strong>
                <a
                  href={whatsappLink(`Bonjour Biostore, je souhaite commander : ${product.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MessageCircle size={16} /> Commander
                </a>
              </div>
            </div>
          </article>
        ))}
        <Link
          className="product-card product-more"
          ref={(el) => {
            cardRefs.current[products.length] = el
          }}
          href="/catalogue"
          prefetch
        >
          <span className="product-more-icon"><ArrowRight size={22} /></span>
          <strong>Voir plus</strong>
          <span>Tout le catalogue</span>
        </Link>
      </div>
      <div className="scroll-dots" role="tablist" aria-label="Position dans la liste des produits">
        {Array.from({ length: itemCount }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={`scroll-dot ${index === active ? 'active' : ''}`}
            aria-label={`Aller à l’élément ${index + 1}`}
            onClick={() => scrollToCard(index)}
          />
        ))}
      </div>
    </>
  )
}
