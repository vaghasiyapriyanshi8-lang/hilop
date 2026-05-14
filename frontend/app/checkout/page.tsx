'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/utils/format'

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zipCode: z.string().min(5, 'ZIP code required'),
  country: z.string().min(2, 'Country required'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const steps = [
  { id: 1, name: 'Shipping', description: 'Delivery address' },
  { id: 2, name: 'Payment', description: 'Payment method' },
  { id: 3, name: 'Review', description: 'Order review' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, total } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button className="bg-hilop-green hover:bg-hilop-green/90">Continue Shopping</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: 'Success',
        description: 'Order placed successfully!',
      })
      router.push('/profile?tab=orders')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Steps */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id}>
                <div className="flex items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ₹{
                      step.id <= currentStep
                        ? 'bg-hilop-green text-black'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.id < currentStep ? <Check className="w-6 h-6" /> : step.id}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 w-24 mx-4 ₹{
                        step.id < currentStep ? 'bg-hilop-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className="font-semibold">{step.name}</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name</label>
                      <Input {...register('firstName')} />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name</label>
                      <Input {...register('lastName')} />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <Input type="email" {...register('email')} />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <Input {...register('phone')} />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <Input {...register('address')} />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City</label>
                      <Input {...register('city')} />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">State</label>
                      <Input {...register('state')} />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">ZIP Code</label>
                      <Input {...register('zipCode')} />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Country</label>
                      <Input {...register('country')} />
                      {errors.country && (
                        <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border-2 border-hilop-green rounded-lg cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="mr-3" />
                      <div>
                        <p className="font-semibold">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-hilop-green">
                      <input type="radio" name="payment" className="mr-3" />
                      <div>
                        <p className="font-semibold">PayPal</p>
                        <p className="text-sm text-gray-600">Fast and secure</p>
                      </div>
                    </label>
                  </div>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Review Order</h2>
                  <p className="text-gray-600">Please review your order details below</p>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    className="bg-hilop-green hover:bg-hilop-green/90 text-black ml-auto"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-hilop-green hover:bg-hilop-green/90 text-black ml-auto"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                )}
              </div>
            </motion.form>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-hilop-green">₹{(total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                ✓ Secure checkout. Your data is protected.
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}