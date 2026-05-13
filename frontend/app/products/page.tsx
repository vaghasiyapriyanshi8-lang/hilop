'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sliders, ArrowUpDown, Heart, Eye, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { productsService } from '@/services/api/products'
import { Product } from '@/types'

function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden group">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={product.images?.[0] || '/images/watch-elegance.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discount}%
            </div>
          )}
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
            <Button
              asChild
              size="icon"
              className="rounded-full bg-hilop-green hover:bg-hilop-green/90"
            >
              <Link href={`/products/${product.slug || product.id}`}>
                <Eye className="w-5 h-5 text-white" />
              </Link>
            </Button>
          </motion.div>
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.brand}</div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-hilop-green">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <Button
            asChild
            variant="outline"
            className="w-full hover:bg-hilop-green hover:text-white hover:border-hilop-green"
          >
            <Link href={`/products/${product.slug || product.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('trending')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await productsService.getProducts({
          search: searchQuery,
          sort:
            sortBy === 'price-low'
              ? 'price_asc'
              : sortBy === 'price-high'
                ? 'price_desc'
                : 'newest',
        })
        setProducts(response.data || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, sortBy])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.section
        className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-hilop-green/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
          <p className="text-gray-600">Explore our complete range of luxury watches</p>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Toolbar */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Search */}
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />

            {/* Filters & Sort */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                Filters
              </Button>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                  suppressHydrationWarning
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="trending">Trending</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <span className="text-sm text-gray-600">
              {products.length} products
            </span>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-hilop-green" />
              <p className="text-gray-500">Loading collection...</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {products.length === 0 && (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-gray-500 text-lg">No products found</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
