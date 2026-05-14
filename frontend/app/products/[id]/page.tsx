'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/hooks/use-toast'
import { productsService } from '@/services/api/products'
import { Product } from '@/types'
import { ChevronLeft, Heart, Loader2, RotateCcw, Share2, Shield, Star, Truck } from 'lucide-react'

const fallbackImages = ['/images/watch-elegance.svg']

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()
  const { toast } = useToast()

  useEffect(() => {
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

    fetchProduct()
  }, [params.id, toast])

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

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity,
    })
    toast({
      title: 'Success',
      description: `₹{product.name} added to cart`,
    })
  }

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
                  className={`relative h-24 overflow-hidden rounded-lg border-2 transition-colors ₹{
                    selectedImage === index ? 'border-hilop-green' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image src={image} alt={`View ₹{index + 1}`} fill className="object-cover" />
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
                      className={`h-5 w-5 ₹{
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
                {product.inStock ? `₹{product.stockQuantity} in stock` : 'Out of stock'}
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
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-hilop-green font-semibold text-black hover:bg-hilop-green/90"
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? 'text-red-600' : ''}
                >
                  <Heart className={`h-5 w-5 ₹{isWishlisted ? 'fill-red-600' : ''}`} />
                </Button>
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
          className="mt-16 border-t pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-8 text-3xl font-bold">Specifications</h2>
          <Card className="p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Object.entries(product.specifications).length ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-6">
                    <span className="font-semibold text-gray-600">{key}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No specifications available.</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
