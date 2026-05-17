'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Sparkles, Watch, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Hero() {
  const [lastUpdated, setLastUpdated] = useState('Just now')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setLastUpdated(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[480px] overflow-hidden bg-black sm:min-h-[640px] md:min-h-[700px]">
      <Image
        src="/images/watch-hero.svg"
        alt="Luxury Hilop watch"
        fill
        priority
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.58),rgba(0,0,0,.2))]" />

      <div className="relative mx-auto flex items-center min-h-[480px] md:min-h-[640px] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">NEW COLLECTION 2026</span>
          </motion.div>

         

          <motion.h1
            className="mb-6 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Timeless
            <br />
            <span className="text-hilop-green">Elegance</span>
          </motion.h1>

          <motion.p
            className="mb-8 max-w-xl text-base leading-7 text-gray-200 sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover luxury watches that blend modern design with timeless craftsmanship.
            Every timepiece tells a story of excellence. Trusted by 10,000+ collectors worldwide.
          </motion.p>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/products">
              <Button size="lg" className="w-full gap-2 bg-hilop-green text-black hover:bg-hilop-green/90 sm:w-auto">
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="w-full border-white/70 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
                Watch Features
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 grid max-w-xl grid-cols-1 gap-3 text-sm text-white/85 sm:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <div className="flex items-center gap-2">
              <Watch className="h-4 w-4 text-hilop-green" />
              Premium builds
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-hilop-green" />
              2-year warranty
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-hilop-green" />
              Gift ready
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
