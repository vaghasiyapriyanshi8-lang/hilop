'use client'

import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { AuthInitializer } from '@/components/auth-initializer'
import { AuthGuard } from '@/components/auth-guard'
import { PageLoader } from '@/components/page-loader'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <PageLoader />
      <AuthGuard>{children}</AuthGuard>
    </QueryClientProvider>
  )
}
