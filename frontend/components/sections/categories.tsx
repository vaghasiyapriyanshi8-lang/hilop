'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const CATEGORIES = [
  {
    id: '1',
    name: 'Dress Watches',
    slug: 'dress-watches',
    icon: '👔',
    description: 'Elegant timepieces for formal occasions',
  },
  {
    id: '2',
    name: 'Sport Watches',
    slug: 'sport-watches',
    icon: '⚽',
    description: 'Durable watches for active lifestyles',
  },
  {
    id: '3',
    name: 'Digital Watches',
    slug: 'digital-watches',
    icon: '⌚',
    description: 'Modern tech-integrated timepieces',
  },
  {
    id: '4',
    name: 'Luxury Collection',
    slug: 'luxury-collection',
    icon: '👑',
    description: 'Premium handcrafted masterpieces',
  },
]

export function Categories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect watch for every moment and lifestyle.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products?category=${category.slug}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                    <div className="mt-4 inline-block text-hilop-green font-semibold text-sm hover:underline">
                      Explore →
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