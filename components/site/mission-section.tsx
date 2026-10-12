'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

export default function MissionSection({
  title,
  text1,
  text2,
  image,
  quote,
  ctaHref,
}: {
  title: string
  text1: string
  text2: string
  image: string
  quote: string
  ctaHref: string
}) {
  return (
    <section className="mission-section section">
      <div className="container mission-grid">
        <motion.div
          className="mission-copy"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="eyebrow"><span className="eyebrow-line" /> Notre mission</div>
          <h2>{title}</h2>
          <p>{text1}</p>
          <p>{text2}</p>
          <a className="text-link" href={ctaHref}>Découvrir nos produits <ArrowRight size={16} /></a>
        </motion.div>
        <motion.div
          className="mission-image"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          <img src={image} alt="Ingrédients naturels et produits Biostore" />
          <div className="image-caption">
            <span className="caption-mark">“</span>
            <p>{quote}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
