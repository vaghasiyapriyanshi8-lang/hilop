'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PromoBanner() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-black px-8 py-10 sm:px-12 sm:py-14 flex flex-col sm:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Background accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,222,128,0.15),transparent_60%)]" />

          <div className="relative z-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-hilop-green/30 bg-hilop-green/10 px-3 py-1 mb-3">
              <Tag className="h-3 w-3 text-hilop-green" />
              <span className="text-xs font-semibold text-hilop-green">LIMITED TIME OFFER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Free Shipping on All Orders
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Plus a complimentary polishing cloth and gift box with every purchase.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link href="/products">
              <Button size="lg" className="bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
