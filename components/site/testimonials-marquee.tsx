'use client'

import { Star } from 'lucide-react'

type Testimonial = { quote: string; name: string; place: string }

export default function TestimonialsMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const duration = Math.max(testimonials.length * 7, 20)

  function renderTrack(copy: number) {
    return testimonials.map((testimonial) => (
      <figure className="testimonial" key={`${copy}-${testimonial.name}`}>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} fill="currentColor" />
          ))}
        </div>
        <blockquote>“{testimonial.quote}”</blockquote>
        <figcaption>
          <span className="avatar">{testimonial.name.charAt(0)}</span>
          <span>
            <strong>{testimonial.name}</strong>
            <small>{testimonial.place}</small>
          </span>
        </figcaption>
      </figure>
    ))
  }

  return (
    <div className="testimonials-marquee">
      <div className="testimonials-track" style={{ animationDuration: `${duration}s` }}>
        {renderTrack(0)}
        {renderTrack(1)}
      </div>
    </div>
  )
}
