'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, Heart, Loader2, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { productsService } from '@/services/api/products'
import { Product } from '@/types'
import { formatPrice } from '@/utils/format'

function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const image = product.images?.[0] || '/images/watch-elegance.svg'
  const productHref = `/products/₹{product.slug || product.id}`
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="group h-full overflow-hidden transition-all hover:border-hilop-green/30 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {discount > 0 && (
            <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              -{discount}%
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-semibold text-white">Out of Stock</span>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-5 w-5 ₹{isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button asChild size="icon" className="rounded-full bg-hilop-green hover:bg-hilop-green/90" aria-label="View product">
              <Link href={productHref}>
                <Eye className="h-5 w-5 text-black" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{product.name}</h3>

          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ₹{
                    i < Math.floor(product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl font-bold text-hilop-green">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <Button asChild variant="outline" className="w-full hover:border-hilop-green hover:bg-hilop-green hover:text-black">
            <Link href={productHref}>View Details</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getFeaturedProducts()
        setProducts(data)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section id="featured" className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Featured Collection</h2>
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            Explore the latest watches added by the Hilop admin team.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-hilop-green" />
          </div>
        ) : products.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {products.map((product, index) => (
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
        ) : (
          <p className="text-center text-gray-500">No products available yet.</p>
        )}

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button asChild size="lg" variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
