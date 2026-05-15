'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, Heart, Loader2, Star, Sparkles, ArrowRight, Watch, Shield, Clock } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
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

// Placeholder component when no featured products exist
function FeaturedPlaceholder() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-6 sm:py-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-hilop-green rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-hilop-green rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-hilop-green/20 backdrop-blur-sm"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Sparkles className="h-10 w-10 text-hilop-green" />
        </motion.div>

        <motion.h2
          className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Featured Collection Coming Soon
        </motion.h2>

        <motion.p
          className="mb-8 text-lg text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          We're curating our finest luxury timepieces for you. 
          Stay tuned for an exclusive selection of premium watches.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
            <Watch className="h-6 w-6 text-hilop-green" />
            <span className="text-sm text-gray-300">Premium Quality</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
            <Shield className="h-6 w-6 text-hilop-green" />
            <span className="text-sm text-gray-300">2-Year Warranty</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
            <Clock className="h-6 w-6 text-hilop-green" />
            <span className="text-sm text-gray-300">Timeless Design</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button asChild size="lg" className="mt-8 bg-hilop-green text-black hover:bg-hilop-green/90">
            <Link href="/products" className="flex items-center gap-2">
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')
  const [collectionInfo, setCollectionInfo] = useState({
    title: 'Featured Collection',
    description: 'Discover our handpicked collection of the finest luxury timepieces.',
  })

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productsService.getFeaturedProducts()
      setProducts(data)
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
      generateCollectionInfo(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const generateCollectionInfo = (prods: Product[]) => {
    if (prods.length === 0) return

    const brands = prods.map((p) => p.brand).filter(Boolean)
    const uniqueBrands = [...new Set(brands)].slice(0, 2)
    const brandText = uniqueBrands.join(' & ')

    const avgPrice = prods.reduce((sum, p) => sum + (p.price || 0), 0) / prods.length
    const priceRange = avgPrice > 50000 ? 'Premium' : 'Luxury'

    const hasDeal = prods.some((p) => p.originalPrice && p.originalPrice > p.price)

    let title = 'Featured Collection'
    let description = 'Discover our handpicked collection of the finest luxury timepieces.'

    if (brandText) {
      title = `Featured: ${brandText} & More`
      description = `Explore our curated selection of ${priceRange.toLowerCase()} watches from renowned brands. ${
        hasDeal ? 'Special pricing available on selected pieces.' : 'Premium craftsmanship at its finest.'
      }`
    }

    setCollectionInfo({ title, description })
  }

  useEffect(() => {
    fetchProducts()

    // Real-time updates: refetch every 30 seconds
    const interval = setInterval(fetchProducts, 30000)
    return () => clearInterval(interval)
  }, [fetchProducts])

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
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">{collectionInfo.title}</h2>
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            {collectionInfo.description}
          </p>
          {lastUpdated && (
            <p className="mt-2 text-xs text-gray-400">Last updated: {lastUpdated}</p>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-hilop-green" />
          </div>
        ) : products.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
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
          <FeaturedPlaceholder />
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
