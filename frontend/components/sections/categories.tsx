'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Watch } from 'lucide-react'
import api from '@/lib/api'

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api
      .get('/products/categories/all')
      .then((res) => setCategories(res.data?.data ?? []))
      .catch(() => {})
  }, [])

  return (
    <section className="bg-gray-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Shop by Category</h2>
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            Find the perfect watch for every moment and lifestyle.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products?category=₹{category.slug}`}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                  <Card className="group h-full cursor-pointer p-5 transition-all hover:-translate-y-1 hover:border-hilop-green/40 hover:shadow-xl sm:p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-hilop-green/10 text-hilop-green">
                      <Watch className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold sm:text-xl">{category.name}</h3>
                    <p className="min-h-10 text-sm leading-6 text-gray-600">
                      {category.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-hilop-green">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
