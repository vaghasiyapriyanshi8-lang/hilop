'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/api/auth'
import { useToast } from '@/hooks/use-toast'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    if (!agreedToTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      toast({
        title: 'Success',
        description: 'Account created! Please check your email to verify.',
      })
      router.push('/auth/login')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Signup failed',
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-hilop-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-gray-600 mt-2">Join Hilop and discover luxury watches</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                {...register('name')}
                className="w-full"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-hilop-green hover:underline">
                  Terms & Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-hilop-green hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold h-11"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-hilop-green font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  )
}