'use client'

import { motion } from 'motion/react'

export default function FounderSection({
  photo,
  quote,
  text,
  name,
  role,
}: {
  photo: string
  quote: string
  text: string
  name: string
  role: string
}) {
  return (
    <section className="founder-section section">
      <div className="container founder-grid">
        <motion.div
          className="founder-photo"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img src={photo} alt={name} />
          <div className="founder-badge">Fondatrice</div>
        </motion.div>
        <motion.div
          className="founder-copy"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="eyebrow"><span className="eyebrow-line" /> Le mot de la fondatrice</div>
          <span className="founder-quote-mark">“</span>
          <p className="founder-quote">{quote}</p>
          <p>{text}</p>
          <div className="founder-identity">
            <strong>{name}</strong>
            <span>{role}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
