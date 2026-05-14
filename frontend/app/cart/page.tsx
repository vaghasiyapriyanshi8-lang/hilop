'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { formatPrice } from '@/utils/format'

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some luxury watches to get started!</p>
          <Link href="/products">
            <Button size="lg" className="bg-hilop-green hover:bg-hilop-green/90">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{items.length} item(s) in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-4 flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{formatPrice(item.price)}</p>
                      {item.variant && (
                        <div className="mt-2 flex gap-4 text-xs">
                          {item.variant.size && <span>{item.variant.size}</span>}
                          {item.variant.color && <span>{item.variant.color}</span>}
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-hilop-green">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeItem(item.productId, item.variant)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-hilop-green">
                  ₹{(total * 1.1).toFixed(2)}
                </span>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input placeholder="Coupon code" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              {/* CTA */}
              <Link href="/checkout" className="w-full block mb-3">
                <Button className="w-full bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold">
                  Proceed to Checkout
                </Button>
              </Link>

              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}