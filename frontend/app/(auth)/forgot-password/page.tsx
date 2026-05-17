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
import { useToast } from '@/hooks/use-toast'
import { authService } from '@/services/api/auth'
import { CheckCircle2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword({ email: data.email })
      setSent(true)
    } catch {
      // Always show success to prevent email enumeration
      setSent(true)
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
            <div className="w-12 h-12 bg-hilop-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-gray-600 mt-2 text-sm">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-hilop-green/10">
                <CheckCircle2 className="w-8 h-8 text-hilop-green" />
              </div>
              <p className="text-gray-700 font-medium">Check your inbox</p>
              <p className="text-sm text-gray-500">
                If an account exists for that email, a password reset link has been sent.
              </p>
              <Link href="/login">
                <Button className="w-full bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold mt-2">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <Input type="email" placeholder="your@email.com" {...register('email')} />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold h-11"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/login" className="text-hilop-green font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
