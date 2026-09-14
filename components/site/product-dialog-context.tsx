'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'
import type { Product } from '@/lib/content'

type ProductDialogContextValue = {
  open: (product: Product) => void
}

const ProductDialogContext = createContext<ProductDialogContextValue | null>(null)

export function useProductDialog() {
  const context = useContext(ProductDialogContext)
  if (!context) throw new Error('useProductDialog must be used within a ProductDialogProvider')
  return context
}

export default function ProductDialogProvider({ whatsappNumber, children }: { whatsappNumber: string; children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const whatsappLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <ProductDialogContext.Provider value={{ open: setSelectedProduct }}>
      {children}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="dialog-backdrop"
            role="presentation"
            onClick={() => setSelectedProduct(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="product-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-dialog-title"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProductDialogContext.Provider>
  )
}
