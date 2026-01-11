
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50" />
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Date Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Today in Drone Wars • {currentDate}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="bg-gradient-to-r from-blue-400 via-white to-blue-300 bg-clip-text text-transparent">
              DroneWire
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-curated intelligence on drone warfare and counter-unmanned systems. 
            Stay ahead of the rapidly evolving threats and countermeasures shaping modern defense.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/articles">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Shield className="w-5 h-5 mr-2" />
                Explore Intelligence
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/explainers">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
                <Target className="w-5 h-5 mr-2" />
                View Explainers
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <Shield className="w-6 h-6 mr-3 text-blue-400" />
              <span className="font-medium">Real-time Defense News</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <Zap className="w-6 h-6 mr-3 text-blue-400" />
              <span className="font-medium">AI-Powered Analysis</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <Target className="w-6 h-6 mr-3 text-blue-400" />
              <span className="font-medium">Contract Intelligence</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-16">
          <path
            d="M0,64 C300,100 600,20 1200,64 L1200,120 L0,120 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  )
}
