'use client'

import { useMemo, useState } from 'react'
import { Search, MessageCircle, Plus } from 'lucide-react'
import type { Product } from '@/lib/content'
import { useProductDialog } from './product-dialog-context'

export default function CatalogueClient({ products, whatsappNumber }: { products: Product[]; whatsappNumber: string }) {
  const { open } = useProductDialog()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const whatsappLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  const categories = useMemo(() => ['Tous', ...Array.from(new Set(products.map((p) => p.category)))], [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCategory = category === 'Tous' || p.category === category
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [products, query, category])

  return (
    <div className="catalogue">
      <div className="catalogue-controls">
        <div className="catalogue-search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Rechercher un produit…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un produit"
          />
        </div>
        <div className="catalogue-filters" role="tablist" aria-label="Filtrer par catégorie">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`catalogue-filter ${cat === category ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="catalogue-empty">Aucun produit ne correspond à votre recherche.</p>
      ) : (
        <div className="catalogue-grid">
          {filtered.map((product) => (
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
      )}
    </div>
  )
}
