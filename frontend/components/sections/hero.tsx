'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-hilop-green/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="px-4 py-2 bg-hilop-green/10 border border-hilop-green/20 rounded-full">
              <span className="text-hilop-green text-sm font-semibold">NEW COLLECTION 2024</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Timeless
            <br />
            <span className="text-hilop-green">Elegance</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover luxury watches that blend modern design with timeless craftsmanship. Every timepiece tells a story of excellence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/products">
              <Button size="lg" className="bg-hilop-green hover:bg-hilop-green/90 text-black">
                Explore Collection
              </Button>
            </Link>
            <Link href="#featured">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch Features
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-hilop-green/10 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 bg-hilop-green/10 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </section>
  )
}