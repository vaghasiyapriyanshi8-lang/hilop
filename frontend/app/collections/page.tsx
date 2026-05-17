'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { productsService } from '@/services/api/products'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/utils/format'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'

interface Collection {
  id: string
  name: string
  slug: string
  image?: string
  description?: string
  productCount?: number
}

interface CategoryWithProducts {
  category: Collection
  products: Product[]
  loading: boolean
}

export default function CollectionsPage() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categories = await productsService.getCategories()
        
        // Fetch products for each category
        const categoriesData: CategoryWithProducts[] = await Promise.all(
          (categories || []).map(async (category) => {
            try {
              const response = await productsService.getProducts({
                category: category.slug,
                limit: 12
              })
              return {
                category,
                products: response.data || [],
                loading: false
              }
            } catch (error) {
              console.error(`Failed to fetch products for ${category.slug}:`, error)
              return {
                category,
                products: [],
                loading: false
              }
            }
          })
        )
        
        setCategoriesWithProducts(categoriesData)
      } catch (error) {
        console.error('Failed to fetch collections:', error)
        setCategoriesWithProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesAndProducts()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
           Our  Collections
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our curated collections of luxury timepieces — organized by style, complication, and craftsmanship.
          </p>
        </div>
      </section>

      {/* Products by Category Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-hilop-green" />
            <p className="text-gray-500">Loading collections...</p>
          </div>
        ) : categoriesWithProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-gray-500 text-lg">No collections available</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categoriesWithProducts.map((item, categoryIndex) => (
              <motion.div
                key={item.category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.05 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
                      {item.category.name}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.products.length} {item.products.length === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </div>

                {/* Products Grid */}
                {item.products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No products found for this Collection</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {item.products.map((product, productIndex) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: productIndex * 0.02 }}
                        viewport={{ once: true }}
                      >
                        <Card className="group h-full overflow-hidden border border-gray-200 transition-shadow duration-200 hover:shadow-md">
                            {/* Product Image */}
                            <div className="relative h-56 bg-gray-100 overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <ShoppingCart className="w-8 h-8 text-gray-300" />
                                </div>
                              )}
                              
                              {/* Sale Badge */}
                              {product.originalPrice && product.originalPrice > product.price && (
                                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                  Sale
                                </div>
                              )}

                              {/* Out of Stock Overlay */}
                              {!product.inStock && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">Out of Stock</span>
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="p-3 space-y-2">
                              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                                {product.name}
                              </h3>

                              {/* Rating */}
                              {product.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <div className="flex text-yellow-400 text-xs">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i}>{i < Math.round(product.rating || 0) ? '★' : '☆'}</span>
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    ({product.reviewCount || 0})
                                  </span>
                                </div>
                              )}

                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-hilop-green">
                                  {formatPrice(product.price || 0)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>

                              {/* Stock Status */}
                              <div className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </div>
                            </div>

                            <div className="px-3 pb-3 space-y-2">
                              <Button asChild variant="outline" className="w-full hover:border-hilop-green hover:bg-hilop-green hover:text-black">
                                <Link href={`/products/${product.slug}`}>
                                  View Details
                                </Link>
                              </Button>
                              <AddToCartButton
                                product={product}
                                label="Add to Cart"
                                className="bg-hilop-green text-black hover:bg-hilop-green/90"
                              />
                            </div>
                          </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
