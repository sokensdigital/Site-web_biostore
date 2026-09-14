'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/content'
import { useProductDialog } from './product-dialog-context'

export default function HeroProductCard({ product }: { product: Product }) {
  const { open } = useProductDialog()

  return (
    <motion.div
      className="hero-product-card"
      role="button"
      tabIndex={0}
      aria-label={`Voir les détails de ${product.name}`}
      onClick={() => open(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') open(product)
      }}
      style={{ cursor: 'pointer' }}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.03, boxShadow: '0 18px 38px rgba(28,60,47,.2)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mini-product-image"><img src={product.image} alt={product.name} /></div>
      <div>
        <span className="small-label">Le favori du moment</span>
        <strong>{product.name}</strong>
        <span className="price">{product.price}</span>
      </div>
      <motion.span
        aria-hidden="true"
        style={{ display: 'grid', placeItems: 'center', marginLeft: 'auto', width: 30, height: 30, borderRadius: '50%', background: 'var(--sage)', color: 'var(--primary)' }}
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowRight size={18} />
      </motion.span>
    </motion.div>
  )
}
