'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { productsService } from '@/services/api/products'
import { Product } from '@/types'
import { ChevronLeft, Loader2, RotateCcw, Share2, Shield, Star, Truck } from 'lucide-react'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { WishlistToggleButton } from '@/components/wishlist/wishlist-toggle-button'
import { ReviewForm } from '@/components/reviews/review-form'
import { ReviewsDisplay } from '@/components/reviews/reviews-display'
import { useAuthStore } from '@/store/auth'

const fallbackImages = ['/images/watch-elegance.svg']

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewsKey, setReviewsKey] = useState(0)
  const { toast } = useToast()
  const { user } = useAuthStore()

  const fetchProduct = async () => {
    if (!params.id) return

    setLoading(true)
    try {
      const data = await productsService.getProduct(params.id)
      setProduct(data)
      setSelectedImage(0)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Product not found.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-hilop-green" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold">Product not found</h1>
        <p className="mb-6 text-gray-600">The product you are looking for is unavailable.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  const images = product.images.length ? product.images : fallbackImages
  const originalPrice = product.originalPrice
  const discount = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0
  const specificationItems =
    product.specs?.length
      ? product.specs
      : Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value }))

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/products">
              <ChevronLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative mb-6 h-96 overflow-hidden rounded-lg bg-gray-100 lg:h-[500px]">
              <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <motion.button
                  key={image}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? 'border-hilop-green' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image src={image} alt={`View ${index + 1}`} fill className="object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="mb-2 text-sm font-semibold text-hilop-green">{product.category}</div>
              <h1 className="mb-2 text-4xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating || 0} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <span className="text-4xl font-bold text-hilop-green">
                  ₹{product.price.toLocaleString()}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-600">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <p className={product.inStock ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
                {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </p>
            </div>

            <p className="text-lg leading-8 text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2">{quantity}</span>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  size="lg"
                  className="flex-1 bg-hilop-green font-semibold text-black hover:bg-hilop-green/90"
                />
                <WishlistToggleButton product={product} size="lg" variant="outline" />
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Truck className="mx-auto mb-2 h-8 w-8 text-hilop-green" />
                  <p className="text-sm font-semibold">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2 h-8 w-8 text-hilop-green" />
                  <p className="text-sm font-semibold">2 Year Warranty</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="mx-auto mb-2 h-8 w-8 text-hilop-green" />
                  <p className="text-sm font-semibold">Easy Returns</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 border-t pt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Specifications</h2>
            <p className="mt-2 text-gray-500">Product details and features</p>
          </div>

          {specificationItems.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="divide-y divide-gray-200">
                {specificationItems.map((spec, index) => (
                  <div key={`${spec.key}-${index}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-600">{spec.key}</span>
                    <span className="font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <p className="text-gray-500">No specifications available for this product</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-20 border-t pt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
            <p className="mt-2 text-gray-500">See what our customers think about this product</p>
          </div>

          {user ? (
            <div className="mb-12">
              <ReviewForm
                productId={product._id}
                onSuccess={async () => {
                  setReviewsKey((prev) => prev + 1)
                  await fetchProduct()
                }}
              />
            </div>
          ) : (
            <div className="mb-12 rounded-lg border border-gray-200 bg-gray-50 px-6 py-8 text-center">
              <p className="mb-4 text-gray-600">Please <Link href="/login" className="font-semibold text-hilop-green hover:underline">login</Link> to write a review</p>
            </div>
          )}

          <ReviewsDisplay 
            key={reviewsKey}
            productId={product._id} 
            currentUserId={user?._id}
          />
        </motion.div>
      </div>
    </div>
  )
}
