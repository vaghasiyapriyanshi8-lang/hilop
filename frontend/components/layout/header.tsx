'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

const navItems = [
  { href: '/products', label: 'Products' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { itemCount } = useCartStore()

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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-hilop-green"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/orders"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-hilop-green"
              >
                My Orders
              </Link>
            )}
          </nav>

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <motion.div
              className="relative hidden sm:block"
              initial={false}
              animate={{ width: isSearchOpen ? 260 : 170 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                type="search"
                placeholder="Search watches"
                className="h-10 rounded-lg border-gray-200 bg-gray-50 pl-10 pr-3"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </motion.div>

            <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Search">
              <Search className="h-5 w-5" />
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/orders"
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Orders
              </Link>
            )}
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
