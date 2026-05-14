'use client'

import type React from 'react'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

// Only the homepage, auth pages, and features page are accessible without login
const PUBLIC_PATHS = ['/', '/login', '/signup', '/features']

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '?'))
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  const isPublic = isPublicPath(pathname)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && !isPublic) {
      router.replace(`/login?next=₹{encodeURIComponent(pathname)}`)
      return
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, isPublic, pathname, router])

  // Still initializing auth state — show spinner for protected pages only
  if (isLoading && !isPublic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-hilop-green" />
      </div>
    )
  }

  // Block render of protected page until redirect fires
  if (!isAuthenticated && !isPublic) {
    return null
  }

  return <>{children}</>
}
