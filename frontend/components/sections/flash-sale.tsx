'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'

const FLASH_SALES = [
  {
    id: '1',
    name: 'Sunset Gold Limited',
    price: 799,
    originalPrice: 1299,
    image: 'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    timeLeft: '02:45:30',
    sold: 12,
    total: 50,
  },
  {
    id: '2',
    name: 'Ocean Depth Pro',
    price: 699,
    originalPrice: 999,
    image: 'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    timeLeft: '03:15:45',
    sold: 28,
    total: 40,
  },
  {
    id: '3',
    name: 'Forest Black Edition',
    price: 549,
    originalPrice: 799,
    image: 'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    timeLeft: '01:30:20',
    sold: 35,
    total: 50,
  },
]

export function FlashSale() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-hilop-green/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-red-600">LIMITED TIME</span>
            </div>
            <h2 className="text-4xl font-bold">Flash Sale</h2>
            <p className="text-gray-600 mt-2">Exclusive deals available for limited time only</p>
          </div>
          <Link href="/flash-sales">
            <Button variant="outline">View All Deals</Button>
          </Link>
        </motion.div>

        {/* Sales Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {FLASH_SALES.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden group">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={sale.image}
                    alt={sale.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{Math.round(((sale.originalPrice - sale.price) / sale.originalPrice) * 100)}%
                  </div>

                  {/* Time Left */}
                  <motion.div
                    className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {sale.timeLeft}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-3 line-clamp-2">{sale.name}</h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-red-600">${sale.price}</span>
                    <span className="text-sm text-gray-400 line-through">${sale.originalPrice}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Sold out soon</span>
                      <span className="text-xs font-semibold">
                        {sale.sold}/{sale.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-red-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(sale.sold / sale.total) * 100}%` }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href={`/products/${sale.id}`} className="w-full">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Grab Now
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}