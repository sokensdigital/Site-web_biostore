'use client'

import { motion } from 'motion/react'
import { Leaf } from 'lucide-react'

export default function StoryCollage({ foundingYear }: { foundingYear: number }) {
  return (
    <div className="story-collage">
      <motion.div
        className="story-main-image"
        style={{ transformPerspective: 1000 }}
        initial={{ opacity: 0, rotateY: -90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1000&q=85" alt="Récolte de feuilles fraîches" />
      </motion.div>
      <motion.div
        className="story-small-image"
        style={{ transformPerspective: 1000 }}
        initial={{ opacity: 0, rotateY: 90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
      >
        <img src="https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?auto=format&fit=crop&w=700&q=85" alt="Mains tenant une jeune plante" />
      </motion.div>
      <motion.div
        className="story-badge"
        style={{ transformPerspective: 1000 }}
        initial={{ opacity: 0, rotateX: -90 }}
        whileInView={{ opacity: 1, rotateX: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      >
        <Leaf size={18} />
        <span>Depuis<br /><strong>{foundingYear}</strong></span>
      </motion.div>
    </div>
  )
}
