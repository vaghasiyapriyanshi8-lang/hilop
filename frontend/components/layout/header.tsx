'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

const baseNavItems = [
  { href: '/products', label: 'Products' },
  { href: '/collections', label: 'Collections' },
]

const authenticatedNavItems = [
  { href: '/orders', label: 'My Orders' },
]

const allNavItems = [
  { href: '/about', label: 'About' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { itemCount } = useCartStore()
  const wishlistCount = useWishlistStore((state) => state.items.length)

  const getNavItems = () => {
    return [...baseNavItems, ...(isAuthenticated ? authenticatedNavItems : []), ...allNavItems]
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-hilop-green text-lg font-bold text-black">
              H
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-950">Hilop</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {getNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-hilop-green"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">

            <Button asChild variant="ghost" size="icon" className="relative" aria-label="Wishlist">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button asChild variant="ghost" size="icon" className="relative" aria-label="Cart">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-hilop-green px-1 text-xs font-bold text-black">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <Button asChild variant="ghost" size="icon" aria-label="Profile">
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/login">Sign In</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.nav
            className="grid gap-1 border-t border-gray-100 py-3 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {getNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="rounded-lg px-3 py-3 text-sm font-semibold text-hilop-green hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </motion.nav>
        )}
      </div>
    </header>
  )
}
