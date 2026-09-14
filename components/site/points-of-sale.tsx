'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Store } from 'lucide-react'

type Outlet = { name: string; city: string }

const outlets: Outlet[] = [
  { name: 'MBOLO', city: 'Libreville, Gabon' },
  { name: 'SUPER CKDO', city: 'Libreville, Gabon' },
  { name: 'PRIX IMPORT', city: 'Libreville, Gabon' },
  { name: 'Geant CKDO', city: 'Libreville, Gabon' },
]

export default function PointsOfSale() {
  const [selected, setSelected] = useState(0)
  const active = outlets[selected]

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
                key={outlet.name}
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
                key={active.name}
                className="pos-panel-inner"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <motion.span
                  className="pos-icon"
                  initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Store size={28} />
                </motion.span>
                <strong className="pos-name">{active.name}</strong>
                <span className="pos-city"><MapPin size={14} /> {active.city}</span>
                <span className="pos-note">Disponible en rayon</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
