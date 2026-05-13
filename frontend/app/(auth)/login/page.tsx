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
import { useAuthStore } from '@/store/auth'
import { authService } from '@/services/api/auth'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await authService.login(data) as any
      const accessToken = result.accessToken || result.tokens?.accessToken
      const refreshToken = result.refreshToken || result.tokens?.refreshToken
      const role = result.user?.role

      if (role && role !== 'user') {
        throw new Error('Please use the admin portal for admin accounts.')
      }

      if (accessToken) localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

      login(result.user)
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      })
      const nextPath = new URLSearchParams(window.location.search).get('next')
      router.push(nextPath || '/')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Login failed',
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
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your Hilop account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold">Password</label>
                <Link href="/auth/forgot-password" className="text-sm text-hilop-green hover:underline">
                  Forgot?
                </Link>
              </div>
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

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold h-11"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">Google</Button>
            <Button variant="outline">Apple</Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-600">
             Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-hilop-green font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
