'use client'

import { useEffect } from 'react'
import { useInitializeAuth } from '@/hooks/use-initialize-auth'
import { useAuthStore } from '@/store/auth'

export function AuthInitializer() {
  useInitializeAuth()
  const { isLoading } = useAuthStore()

  if (isLoading) {
    return null
  }

  return null
}