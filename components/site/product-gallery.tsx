'use client'

import { MessageCircle, Plus } from 'lucide-react'
import type { Product } from '@/lib/content'
import { useProductDialog } from './product-dialog-context'

export default function ProductGallery({ products, whatsappNumber }: { products: Product[]; whatsappNumber: string }) {
  const { open } = useProductDialog()
  const whatsappLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="products-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id} onClick={() => open(product)}>
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
    </div>
  )
}
