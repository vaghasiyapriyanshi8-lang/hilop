'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Eye } from 'lucide-react'
import { useState } from 'react'

const NEW_ARRIVALS = [
  {
    id: '1',
    name: 'Aurora Moonlight',
    price: 1499,
    image: 'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    rating: 5.0,
    reviews: 45,
    badge: 'New',
  },
  {
    id: '2',
    name: 'Midnight Urban',
    price: 999,
    originalPrice: 1199,
    image: 'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    rating: 4.9,
    reviews: 67,
    badge: 'Trending',
  },
  {
    id: '3',
    name: 'Stellar Prime',
    price: 1199,
    image: 'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    rating: 4.8,
    reviews: 32,
    badge: 'New',
  },
  {
    id: '4',
    name: 'Midnight Glow',
    price: 849,
    image: 'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    rating: 4.7,
    reviews: 89,
    badge: 'Popular',
  },
]

function ProductCard({ product }: { product: (typeof NEW_ARRIVALS)[0] }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Badge */}
          <div className="absolute top-4 left-4 bg-hilop-green text-black px-3 py-1 rounded-full text-sm font-semibold">
            {product.badge}
          </div>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discount}%
            </div>
          )}

          {/* Actions */}
          <motion.div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Link href={`/products/${product.id}`}>
              <Button size="icon" className="rounded-full bg-hilop-green hover:bg-hilop-green/90">
                <Eye className="w-5 h-5 text-black" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-hilop-green">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* CTA */}
          <Link href={`/products/${product.id}`} className="w-full">
            <Button variant="outline" className="w-full hover:bg-hilop-green hover:text-black hover:border-hilop-green">
              View Details
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}

export function NewArrivals() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest additions to our exclusive collection.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {NEW_ARRIVALS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}