'use client'

import { motion } from 'motion/react'
import { HandHeart, ShieldCheck, Sprout } from 'lucide-react'

const values = [
  { icon: Sprout, title: 'Naturel par choix', text: 'Des ingrédients bruts, sélectionnés avec exigence et sans superflu.' },
  { icon: ShieldCheck, title: 'Sûr et transparent', text: 'Une transformation soignée, une hygiène rigoureuse et une traçabilité claire.' },
  { icon: HandHeart, title: 'Fait avec soin', text: 'Chaque produit est préparé en petites quantités pour préserver ses qualités.' },
]

export default function ValuesSection() {
  return (
    <section className="values-section section">
      <div className="container">
        <div className="section-heading centered">
          <div className="eyebrow"><span className="eyebrow-line" /> Ce qui nous guide <span className="eyebrow-line" /></div>
          <h2>Simplement <em>bon.</em></h2>
          <p>Des choix qui font toute la différence, de la sélection à votre panier.</p>
        </div>
        <div className="values-journey">
          <motion.div
            className="values-connector"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
          <div className="values-grid">
            {values.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                className={`value-card value-card-${index % 2 === 1 ? 'raised' : 'base'}`}
                key={title}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -8 }}
              >
                <span className="value-index">{String(index + 1).padStart(2, '0')}</span>
                <motion.div className="value-icon" whileHover={{ scale: 1.1, rotate: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
                  <Icon size={22} />
                </motion.div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
