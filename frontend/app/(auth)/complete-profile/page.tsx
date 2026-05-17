'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/api/auth'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

const completeProfileSchema = z.object({
  phone: z.string().min(10, 'Mobile number must be at least 10 digits'),
})

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>

export default function CompleteProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
  })

  const onSubmit = async (data: CompleteProfileFormData) => {
    setIsLoading(true)
    try {
      const updatedUser = await authService.updateProfile({ phone: data.phone })
      login(updatedUser as any)
      useCartStore.getState().replaceCart((updatedUser as any).cartItems || [])
      useWishlistStore.getState().replaceWishlist((updatedUser as any).wishlistItems || [])
      sessionStorage.removeItem('pendingPhone')
      toast({ title: 'Success', description: 'Logged in successfully!' })
      const nextPath = new URLSearchParams(window.location.search).get('next')
      router.push(nextPath || '/')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">Please provide your mobile number to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Mobile Number</label>
              <Input
                type="tel"
                placeholder="1234567890"
                {...register('phone')}
                className="w-full"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold h-11"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Continue'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
