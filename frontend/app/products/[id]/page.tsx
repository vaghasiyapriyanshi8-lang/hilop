'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/hooks/use-toast'
import { Heart, Share2, Truck, Shield, RotateCcw, Star, ChevronLeft } from 'lucide-react'

// Mock product data
const MOCK_PRODUCT = {
  id: '1',
  name: 'Elegance Pro Automatic Watch',
  price: 1299,
  originalPrice: 1599,
  rating: 4.8,
  reviews: 124,
  inStock: true,
  stockQuantity: 15,
  images: [
    'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
    'https://www.rolex.com/content/dam/rolex/en-us/world-of-rolex/about-rolex-header.jpg',
  ],
  description: 'Experience luxury with the Elegance Pro. Handcrafted with premium materials and Swiss precision.',
  specifications: {
    'Case Diameter': '42mm',
    'Case Material': 'Stainless Steel',
    'Water Resistance': '100m',
    'Movement': 'Automatic',
    'Power Reserve': '48 hours',
    'Crystal': 'Sapphire',
    'Band': 'Leather Strap',
  },
  category: 'Dress Watches',
  brand: 'Hilop',
  tags: ['luxury', 'automatic', 'leather', 'swiss'],
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()
  const { toast } = useToast()

  const discount = Math.round(((MOCK_PRODUCT.originalPrice - MOCK_PRODUCT.price) / MOCK_PRODUCT.originalPrice) * 100)

  const handleAddToCart = () => {
    addItem({
      productId: MOCK_PRODUCT.id,
      name: MOCK_PRODUCT.name,
      price: MOCK_PRODUCT.price,
      image: MOCK_PRODUCT.images[0],
      quantity,
    })
    toast({
      title: 'Success',
      description: `${MOCK_PRODUCT.name} added to cart`,
    })
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Main Image */}
            <div className="mb-6 relative h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={MOCK_PRODUCT.images[selectedImage]}
                alt={MOCK_PRODUCT.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {MOCK_PRODUCT.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-hilop-green' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={image}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {MOCK_PRODUCT.category && (
                  <span className="text-sm text-hilop-green font-semibold">
                    {MOCK_PRODUCT.category}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{MOCK_PRODUCT.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(MOCK_PRODUCT.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {MOCK_PRODUCT.rating} ({MOCK_PRODUCT.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-hilop-green">
                  ${MOCK_PRODUCT.price}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${MOCK_PRODUCT.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-green-600 font-semibold">
                {MOCK_PRODUCT.stockQuantity} in stock
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg">{MOCK_PRODUCT.description}</p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 pt-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold"
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? 'text-red-600' : ''}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-hilop-green mx-auto mb-2" />
                  <p className="text-sm font-semibold">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-hilop-green mx-auto mb-2" />
                  <p className="text-sm font-semibold">2 Year Warranty</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-hilop-green mx-auto mb-2" />
                  <p className="text-sm font-semibold">Easy Returns</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <motion.div
          className="mt-16 border-t pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Specifications</h2>
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(MOCK_PRODUCT.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 font-semibold">{key}</span>
                  <span className="text-gray-900 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          className="mt-16 border-t pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-semibold">Excellent Product</span>
                </div>
                <p className="text-gray-600 mb-3">
                  Amazing quality and craftsmanship. Exceeded my expectations!
                </p>
                <p className="text-sm text-gray-500">John Doe • Verified Purchase</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}