'use client'

import { useEffect, useState } from 'react'
import { useInitializeAuth } from '@/hooks/use-initialize-auth'
import { useAuthStore } from '@/store/auth'

export function AuthInitializer() {
  const [mounted, setMounted] = useState(false)
  useInitializeAuth()
  const { isLoading } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render nothing - this prevents hydration mismatch
  if (!mounted) {
    return null
  }

  return null
}