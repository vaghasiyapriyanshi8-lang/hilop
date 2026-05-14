'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-hilop-green" />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hilop-green text-lg font-bold text-black">
            H
          </span>
        </div>
        <p className="text-sm font-medium text-gray-400 tracking-wide">Loading...</p>
      </div>
    </div>
  )
}
