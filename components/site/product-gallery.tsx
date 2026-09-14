'use client'

import { useState } from 'react'
import { MessageCircle, Plus, X } from 'lucide-react'
import type { Product } from '@/lib/content'

export default function ProductGallery({ products, whatsappLink }: { products: Product[]; whatsappLink: (message: string) => string }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <>
      <div className="products-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id} onClick={() => setSelectedProduct(product)}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <span className="product-category">{product.category}</span>
              <button
                className="product-plus"
                aria-label={`Voir les détails de ${product.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setSelectedProduct(product)
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

      {selectedProduct && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}>
          <div className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button className="dialog-close" onClick={() => setSelectedProduct(null)} aria-label="Fermer"><X size={20} /></button>
            <div className="dialog-image"><img src={selectedProduct.image} alt={selectedProduct.name} /></div>
            <div className="dialog-content">
              <span className="product-category">{selectedProduct.category}</span>
              <h2 id="product-dialog-title">{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="detail-row"><span>Format</span><strong>{selectedProduct.format}</strong></div>
              <div className="detail-row"><span>Ingrédients</span><strong>{selectedProduct.ingredients}</strong></div>
              <div className="detail-row"><span>Conservation</span><strong>{selectedProduct.conservation}</strong></div>
              <div className="dialog-footer">
                <strong>{selectedProduct.price}</strong>
                <a
                  className="button button-primary"
                  href={whatsappLink(`Bonjour Biostore, je souhaite commander : ${selectedProduct.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={17} /> Commander
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
