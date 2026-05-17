'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/features', '/forgot-password']

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '?'))
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const [pendingPhone, setPendingPhone] = useState(false)

  useEffect(() => {
    setPendingPhone(sessionStorage.getItem('pendingPhone') === '1')
  }, [pathname])

  const isPublic = isPublicPath(pathname)
  // Allow /complete-profile only when pendingPhone flag is set
  const isCompleteProfile = pathname === '/complete-profile' || pathname.startsWith('/complete-profile?')

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && !isPublic && !isCompleteProfile) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    // Authenticated user on /complete-profile without the flag → send home
    if (isAuthenticated && isCompleteProfile && !pendingPhone) {
      router.replace('/')
      return
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, isPublic, isCompleteProfile, pendingPhone, pathname, router])

  if (isLoading && !isPublic && !isCompleteProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-hilop-green" />
      </div>
    )
  }

  if (!isAuthenticated && !isPublic && !isCompleteProfile) {
    return null
  }

  return <>{children}</>
}