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
    image: '/images/watch-urban.svg',
    timeLeft: '02:45:30',
    sold: 12,
    total: 50,
  },
  {
    id: '2',
    name: 'Ocean Depth Pro',
    price: 699,
    originalPrice: 999,
    image: '/images/watch-stellar.svg',
    timeLeft: '03:15:45',
    sold: 28,
    total: 40,
  },
  {
    id: '3',
    name: 'Forest Black Edition',
    price: 549,
    originalPrice: 799,
    image: '/images/watch-elegance.svg',
    timeLeft: '01:30:20',
    sold: 35,
    total: 50,
  },
]

export function FlashSale() {
  return (
    <section className="bg-[#f8faf9] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-red-600">LIMITED TIME</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">Flash Sale</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              Exclusive deals available for limited time only.
            </p>
          </div>
          <Link href="/flash-sales">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Deals
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6"
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
              <Card className="group h-full overflow-hidden transition-all hover:border-red-200 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={sale.image}
                    alt={sale.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                    -{Math.round(((sale.originalPrice - sale.price) / sale.originalPrice) * 100)}%
                  </div>

                  <motion.div
                    className="absolute left-3 top-3 rounded-lg bg-black/80 px-3 py-2 font-mono text-xs text-white"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {sale.timeLeft}
                  </motion.div>
                </div>

                <div className="p-4">
                  <h3 className="mb-3 line-clamp-2 text-lg font-semibold">{sale.name}</h3>

                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">${sale.price}</span>
                    <span className="text-sm text-gray-400 line-through">${sale.originalPrice}</span>
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Sold out soon</span>
                      <span className="text-xs font-semibold">
                        {sale.sold}/{sale.total}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <motion.div
                        className="h-2 rounded-full bg-red-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(sale.sold / sale.total) * 100}%` }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>

                  <Link href={`/products/${sale.id}`} className="w-full">
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700">
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
