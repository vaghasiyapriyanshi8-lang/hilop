'use client'

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/footer'

const HIDE_FOOTER_PATHS = ['/login', '/signup', '/complete-profile', '/forgot-password']

export function ConditionalFooter() {
  const pathname = usePathname()
  if (HIDE_FOOTER_PATHS.includes(pathname)) return null
  return <Footer />
}
