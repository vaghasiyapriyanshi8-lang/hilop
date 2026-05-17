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
import { Check, CreditCard, Smartphone, Wallet, Building2, Clock, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/utils/format'
import paymentsService from '@/services/api/payments'
import { ordersService, CreateOrderData } from '@/services/api/orders'
import { useAuthStore } from '@/store/auth'
import { authService } from '@/services/api/auth'
import { MapPin, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

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
  saveAddress: z.boolean(),
  paymentMethod: z.enum(['card', 'upi', 'googlepay', 'applepay', 'netbanking', 'wallet', 'cod'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),
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
  const { items, total, clearCart } = useCartStore()
  const { user, login } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      saveAddress: false,
    }
  })

  const handleAddressSelect = (address: any) => {
    setSelectedAddressId(address.id)
    const [firstName, ...lastNameParts] = address.name.split(' ')
    setValue('firstName', firstName || '')
    setValue('lastName', lastNameParts.join(' ') || '')
    setValue('phone', address.phone)
    setValue('address', address.street)
    setValue('city', address.city)
    setValue('state', address.state)
    setValue('zipCode', address.zipCode)
    setValue('country', address.country)
    setValue('email', user?.email || '')
  }

  const handleAddNewAddress = async () => {
    try {
      setIsProcessing(true)
      const newAddress = {
        ...addressFormData,
        id: Math.random().toString(36).substr(2, 9),
      }
      
      const updatedAddresses = user?.addresses ? [...user.addresses, newAddress] : [newAddress]
      
      if (newAddress.isDefault) {
        updatedAddresses.forEach(addr => {
          if (addr.id !== newAddress.id) addr.isDefault = false
        })
      }

      const updatedUser = await authService.updateProfile({ addresses: updatedAddresses })
      login(updatedUser)
      setIsAddressDialogOpen(false)
      handleAddressSelect(newAddress)
      toast({
        title: 'Success',
        description: 'Address added and selected!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to add address',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

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

  const createOrderInDatabase = async (data: CheckoutFormData, paymentStatus: 'paid' | 'pending' = 'paid') => {
    try {
      // If user checked "Save this address" and it's a new address
      if (data.saveAddress && !selectedAddressId) {
        const newAddress = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'home' as const,
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          isDefault: false
        }
        const updatedAddresses = user?.addresses ? [...user.addresses, newAddress] : [newAddress]
        await authService.updateProfile({ addresses: updatedAddresses })
        const updatedUser = await authService.getCurrentUser()
        login(updatedUser)
      }

      // Create order payload with product details
      const orderPayload: CreateOrderData = {
        items: items.map(item => ({
          productId: item.productId,
          productName: item.name || 'Unknown Product',
          productImage: item.image || '',
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: total,
        tax: Math.round(total * 0.1 * 100) / 100,
        shipping: 0,
        total: Math.round(total * 1.1 * 100) / 100,
        shippingAddress: {
          line1: data.address,
          city: data.city,
          country: data.country,
          postalCode: data.zipCode,
          phone: data.phone,
        },
        status: data.paymentMethod === 'cod' ? 'pending' : 'processing',
        paymentMethod: mapPaymentMethod(data.paymentMethod),
        paymentStatus,
      }

      console.log('🔄 Sending order to backend...')
      console.log('📦 Payload:', orderPayload)

      // Create order in database
      const result = await ordersService.createOrder(orderPayload)
      
      console.log('✅ Order created successfully:', result)

      // Clear cart after successful order creation
      clearCart()

      return result
    } catch (err: any) {
      console.error('❌ Failed to create order:', err)
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to create order'
      throw new Error(errorMessage)
    }
  }

  const mapPaymentMethod = (method: string): 'stripe' | 'razorpay' | 'cod' => {
    if (method === 'cod') return 'cod'
    return 'razorpay' // All online payment methods use Razorpay
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)
    try {
      // Handle Cash on Delivery
      if (data.paymentMethod === 'cod') {
        try {
          // Create order with pending payment status
          await createOrderInDatabase(data, 'pending')
          toast({ title: 'Success', description: 'Order placed successfully. Pay at delivery.' })
          router.push('/profile?tab=orders')
          return
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to place order'
          console.error('COD error:', err)
          toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
          return
        }
      }

      // For online payments, create Razorpay order
      const finalTotal = Math.round((total * 1.1) * 100) // paise
      const resp = await paymentsService.createRazorpayOrder({ amount: finalTotal, currency: 'INR', receipt: `order_${Date.now()}` })
      const order = resp.data
      const keyId = resp.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      // load Razorpay script
      await new Promise<void>((resolve, reject) => {
        if (typeof window === 'undefined') return reject()
        if ((window as any).Razorpay) return resolve()
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Razorpay SDK failed to load'))
        document.body.appendChild(script)
      })

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Hilop',
        description: 'Order payment',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await paymentsService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            
            // Create order in database after payment verification
            await createOrderInDatabase(data, 'paid')
            
            toast({ title: 'Success', description: 'Payment verified and order placed.' })
            router.push('/profile?tab=orders')
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Payment verification failed'
            console.error('Payment handler error:', err)
            toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
          method: data.paymentMethod === 'card' ? 'card' : 
                  ['upi', 'googlepay', 'applepay'].includes(data.paymentMethod) ? 'upi' : 
                  data.paymentMethod === 'netbanking' ? 'netbanking' : 
                  data.paymentMethod === 'wallet' ? 'wallet' : undefined
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false)
          }
        },
        theme: { color: '#10b981' },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order'
      console.error('Checkout error:', error)
      toast({
        title: 'Error',
        description: errorMessage,
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
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
                      className={`h-1 w-24 mx-4 ${
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Shipping Address</h2>
                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm" className="font-semibold">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Address Type</Label>
                              <Select 
                                value={addressFormData.type} 
                                onValueChange={(value: any) => setAddressFormData({ ...addressFormData, type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="home">Home</SelectItem>
                                  <SelectItem value="work">Work</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input 
                                placeholder="Recipient Name" 
                                value={addressFormData.name}
                                onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <Input 
                                placeholder="Phone Number" 
                                value={addressFormData.phone}
                                onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Street Address</Label>
                              <Input 
                                placeholder="House No, Street, Area" 
                                value={addressFormData.street}
                                onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input 
                                placeholder="City" 
                                value={addressFormData.city}
                                onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input 
                                placeholder="State" 
                                value={addressFormData.state}
                                onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Zip Code</Label>
                              <Input 
                                placeholder="Zip Code" 
                                value={addressFormData.zipCode}
                                onChange={(e) => setAddressFormData({ ...addressFormData, zipCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Country</Label>
                              <Input 
                                placeholder="Country" 
                                value={addressFormData.country}
                                onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="default" 
                              checked={addressFormData.isDefault}
                              onCheckedChange={(checked) => setAddressFormData({ ...addressFormData, isDefault: checked as boolean })}
                            />
                            <Label htmlFor="default" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Set as default address
                            </Label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => setIsAddressDialogOpen(false)}>Cancel</Button>
                          <Button 
                            type="button"
                            className="bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold"
                            onClick={handleAddNewAddress}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Saving...' : 'Save & Select'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.addresses.map((address: any) => (
                        <div 
                          key={address.id} 
                          onClick={() => handleAddressSelect(address)}
                          className={`cursor-pointer border rounded-xl p-4 transition-all ${
                            selectedAddressId === address.id 
                              ? 'border-hilop-green bg-hilop-green/5 ring-1 ring-hilop-green' 
                              : 'hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{address.type}</span>
                            {selectedAddressId === address.id && <Check className="w-4 h-4 text-hilop-green" />}
                          </div>
                          <div className="font-bold text-sm">{address.name}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

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

                  {!selectedAddressId && (
                    <div className="mt-6 flex items-center space-x-2">
                      <Checkbox 
                        id="saveAddress" 
                        {...register('saveAddress')}
                        onCheckedChange={(checked) => setValue('saveAddress', checked as boolean)}
                      />
                      <Label htmlFor="saveAddress" className="text-sm text-gray-600">
                        Save this address to my profile for future orders
                      </Label>
                    </div>
                  )}
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    {/* Credit/Debit Card */}
                    <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-hilop-green transition">
                      <input
                        type="radio"
                        value="card"
                        {...register('paymentMethod')}
                        className="mt-1 mr-4 w-4 h-4 accent-hilop-green"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-hilop-green" />
                          <p className="font-semibold">Credit/Debit Card</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Visa, Mastercard, RuPay, American Express</p>
                      </div>
                    </label>

                    {/* UPI - Real time */}
                    <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-hilop-green transition">
                      <input
                        type="radio"
                        value="upi"
                        {...register('paymentMethod')}
                        className="mt-1 mr-4 w-4 h-4 accent-hilop-green"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-hilop-green" />
                          <p className="font-semibold">UPI (Real-time)</p>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Instant</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Google Pay, PhonePe, Paytm, WhatsApp Pay</p>
                      </div>
                    </label>

                    {/* Google Pay */}
                    <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-hilop-green transition">
                      <input
                        type="radio"
                        value="googlepay"
                        {...register('paymentMethod')}
                        className="mt-1 mr-4 w-4 h-4 accent-hilop-green"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-hilop-green" />
                          <p className="font-semibold">Google Pay</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Quick checkout with saved cards</p>
                      </div>
                    </label>

                    {/* Apple Pay */}
                    <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-hilop-green transition">
                      <input
                        type="radio"
                        value="applepay"
                        {...register('paymentMethod')}
                        className="mt-1 mr-4 w-4 h-4 accent-hilop-green"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-hilop-green" />
                          <p className="font-semibold">Apple Pay</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Secure payment on Apple devices</p>
                      </div>
                    </label>

                    {/* Net Banking */}
                    <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-hilop-green transition">
                      <input
                        type="radio"
                        value="netbanking"
                        {...register('paymentMethod')}
                        className="mt-1 mr-4 w-4 h-4 accent-hilop-green"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-hilop-green" />
                          <p className="font-semibold">Net Banking</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Direct bank transfer (Real-time)</p>
                      </div>
                    </label>

                    {/* Digital Wallet */}
                    <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-hilop-green transition">
                      <input
                        type="radio"
                        value="wallet"
                        {...register('paymentMethod')}
                        className="mt-1 mr-4 w-4 h-4 accent-hilop-green"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-hilop-green" />
                          <p className="font-semibold">Digital Wallet</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Paytm, FreeCharge, Amazon Pay, Mobikwik</p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-hilop-green transition">
                      <input
                        type="radio"
                        value="cod"
                        {...register('paymentMethod')}
                        className="mt-1 mr-4 w-4 h-4 accent-hilop-green"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-hilop-green" />
                          <p className="font-semibold">Cash on Delivery (COD)</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Pay when your order is delivered</p>
                      </div>
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-600 text-sm mt-4">{errors.paymentMethod.message}</p>
                  )}
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Review Order</h2>
                  <div className="space-y-4">
                    {/* Items */}
                    <div className="border rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <p className="text-sm font-semibold text-gray-700">Order Items ({items.length})</p>
                      </div>
                      <div className="divide-y">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 px-4 py-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-hilop-green">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Totals */}
                    <div className="border rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span><span className="text-hilop-green font-medium">Free</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (10%)</span><span>₹{(total * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t">
                        <span>Total</span><span className="text-hilop-green">₹{(total * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                      ⚠️ Please review your order carefully. Once placed, orders cannot be modified.
                    </div>
                  </div>
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
                    onClick={async () => {
                      // Validate current step before moving to next
                      if (currentStep === 1) {
                        const isValid = await trigger([
                          'firstName',
                          'lastName',
                          'email',
                          'phone',
                          'address',
                          'city',
                          'state',
                          'zipCode',
                          'country',
                        ])
                        if (isValid) {
                          setCurrentStep(currentStep + 1)
                        }
                      } else if (currentStep === 2) {
                        const isValid = await trigger(['paymentMethod'])
                        if (isValid) {
                          setCurrentStep(currentStep + 1)
                        }
                      } else {
                        setCurrentStep(currentStep + 1)
                      }
                    }}
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