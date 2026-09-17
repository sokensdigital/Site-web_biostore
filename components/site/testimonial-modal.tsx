'use client'

import { useActionState, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, MessageSquarePlus, Star, X } from 'lucide-react'
import { submitTestimonial, type SubmitTestimonialState } from '@/app/actions'

const initialState: SubmitTestimonialState = {}

export default function TestimonialModal() {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [state, formAction, pending] = useActionState(submitTestimonial, initialState)

  function close() {
    setOpen(false)
  }

  return (
    <>
      <button type="button" className="testimonial-cta" onClick={() => setOpen(true)}>
        <MessageSquarePlus size={17} /> Laisser un témoignage
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="dialog-backdrop"
            role="presentation"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="testimonial-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="testimonial-modal-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <button className="dialog-close" onClick={close} aria-label="Fermer"><X size={20} /></button>

              {state.success ? (
                <motion.div
                  className="testimonial-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span className="testimonial-success-icon"><Check size={28} /></span>
                  <h3>Merci !</h3>
                  <p>Votre témoignage a bien été envoyé. Il sera publié après vérification.</p>
                  <button type="button" className="button button-primary" onClick={close}>Fermer</button>
                </motion.div>
              ) : (
                <>
                  <span className="eyebrow"><span className="eyebrow-line" /> Partagez votre expérience</span>
                  <h3 id="testimonial-modal-title">Laisser un témoignage</h3>
                  <form action={formAction} className="testimonial-form">
                    <div className="testimonial-rating">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <motion.button
                          key={value}
                          type="button"
                          aria-label={`${value} étoile${value > 1 ? 's' : ''}`}
                          onClick={() => setRating(value)}
                          whileTap={{ scale: 0.85 }}
                          whileHover={{ scale: 1.15 }}
                        >
                          <Star size={22} fill={value <= rating ? 'currentColor' : 'none'} />
                        </motion.button>
                      ))}
                    </div>
                    <input type="hidden" name="rating" value={rating} />
                    <label>
                      Votre nom
                      <input type="text" name="name" required maxLength={80} placeholder="Ex. Aïcha M." />
                    </label>
                    <label>
                      Votre ville
                      <input type="text" name="city" required maxLength={80} placeholder="Ex. Libreville" />
                    </label>
                    <label>
                      Votre témoignage
                      <textarea name="quote" required maxLength={600} rows={4} placeholder="Partagez votre expérience avec nos produits…" />
                    </label>
                    {state.error && <p className="form-error">{state.error}</p>}
                    <button className="button button-primary" type="submit" disabled={pending}>
                      {pending ? 'Envoi…' : 'Envoyer mon témoignage'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
