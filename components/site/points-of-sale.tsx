'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin } from 'lucide-react'
import type { PointOfSale } from '@/lib/content'

export default function PointsOfSale({ outlets }: { outlets: PointOfSale[] }) {
  const [selected, setSelected] = useState(0)
  const active = outlets[selected]
  if (!active) return null
  const fit = active.imageFit === 'cover' ? 'cover' : 'contain'

  return (
    <section className="pos-section section">
      <div className="container">
        <div className="section-heading centered">
          <div className="eyebrow"><span className="eyebrow-line" /> Où nous trouver <span className="eyebrow-line" /></div>
          <h2>Près de chez <em>vous.</em></h2>
          <p>Nos produits sont disponibles dans les meilleures enseignes de Libreville.</p>
        </div>

        <div className="pos-layout">
          <div className="pos-list">
            {outlets.map((outlet, index) => (
              <button
                key={outlet.id}
                className={`pos-item ${index === selected ? 'active' : ''}`}
                onClick={() => setSelected(index)}
              >
                {index === selected && (
                  <motion.span className="pos-item-highlight" layoutId="pos-highlight" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <span className="pos-item-label">{outlet.name}</span>
              </button>
            ))}
          </div>

          <div className="pos-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className={`pos-panel-inner ${fit}`}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.06 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <div className={`pos-bg-wrap ${fit}`}>
                  <img className="pos-bg" src={active.image} alt="" />
                </div>
                {fit === 'cover' && <div className="pos-overlay" />}
                <motion.div
                  className="pos-text"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                >
                  <strong className="pos-name">{active.name}</strong>
                  <span className="pos-city"><MapPin size={14} /> {active.city}</span>
                  <span className="pos-note">Disponible en rayon</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
