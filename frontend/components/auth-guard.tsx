'use client'

import type React from 'react'
import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/hooks/use-toast'

const PUBLIC_ROUTES = ['/', '/login', '/signup']

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname)
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const { toast } = useToast()

  const isPublic = useMemo(() => isPublicRoute(pathname), [pathname])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && !isPublic) {
      const nextPath = `${pathname}${window.location.search}`
      toast({
        title: 'Login required',
        description: 'You have to login first.',
        variant: 'destructive',
      })
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`)
      return
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, isPublic, pathname, router, toast])

  if (isLoading && !isPublic) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-hilop-green" />
      </div>
    )
  }

  if (!isAuthenticated && !isPublic) {
    return null
  }

  return <>{children}</>
}
