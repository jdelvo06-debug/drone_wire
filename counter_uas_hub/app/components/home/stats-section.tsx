
'use client'

import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Activity, FileText, DollarSign, Target } from 'lucide-react'

interface StatsData {
  articles: number
  contracts: number
  explainers: number
}

interface StatsSectionProps {
  initialStats?: StatsData
}

const getStats = (data?: StatsData) => [
  {
    label: 'Articles Analyzed',
    value: data?.articles || 0,
    icon: FileText,
    suffix: '+',
  },
  {
    label: 'Defense Contracts',
    value: data?.contracts || 0,
    icon: DollarSign,
    suffix: '',
  },
  {
    label: 'Systems Explained',
    value: data?.explainers || 0,
    icon: Target,
    suffix: '+',
  },
  {
    label: 'Daily Updates',
    value: 24,
    icon: Activity,
    suffix: '/7',
  },
]

function AnimatedCounter({ 
  value, 
  duration = 2000 
}: { 
  value: number
  duration?: number 
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Eased animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration, isInView])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function StatsSection({ initialStats }: StatsSectionProps) {
  const [statsData, setStatsData] = useState<StatsData | undefined>(initialStats)

  useEffect(() => {
    if (!initialStats) {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => setStatsData(data))
        .catch(() => {})
    }
  }, [initialStats])

  const stats = getStats(statsData)

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
