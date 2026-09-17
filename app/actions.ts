'use server'

import { prisma } from '@/lib/db'

export type SubmitTestimonialState = { error?: string; success?: boolean }

export async function submitTestimonial(_prev: SubmitTestimonialState, formData: FormData): Promise<SubmitTestimonialState> {
  const name = String(formData.get('name') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const quote = String(formData.get('quote') ?? '').trim()
  const rating = Number(formData.get('rating') ?? 5)

  if (!name || !city || !quote) {
    return { error: 'Merci de remplir tous les champs.' }
  }
  if (quote.length > 600) {
    return { error: 'Votre témoignage est un peu long (600 caractères max).' }
  }

  await prisma.testimonial.create({
    data: {
      name,
      city,
      quote,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
    },
  })

  return { success: true }
}
