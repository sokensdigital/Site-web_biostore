'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'motion/react'
import { MapPin } from 'lucide-react'

type Stat = { value: number; suffix: string; label: string }

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1200
    const start = performance.now()
    let frame: number
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <span className="stat-number" ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export default function StatsSection({ stats, locationLabel }: { stats: Stat[]; locationLabel: string }) {
  return (
    <section className="stats-section">
      <div className="container stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            className="stat-card"
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
          >
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: stats.length * 0.1, ease: 'easeOut' }}
        >
          <span className="stat-number stat-number-icon"><MapPin size={26} /></span>
          <span className="stat-label">{locationLabel}</span>
        </motion.div>
      </div>
    </section>
  )
}
