'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const { itemCount } = useCartStore()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-hilop-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-black">Hilop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-hilop-green transition-colors"
            >
              Products
            </Link>
            <Link
              href="/collections"
              className="text-gray-700 hover:text-hilop-green transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-hilop-green transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.div
              className="relative"
              initial={false}
              animate={{ width: isSearchOpen ? 250 : 40 }}
            >
              <Input
                type="search"
                placeholder="Search..."
                className={`w-full pr-10 ${!isSearchOpen && 'border-0'}`}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </motion.div>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-hilop-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            className="md:hidden pb-4 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Products
            </Link>
            <Link
              href="/collections"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Collections
            </Link>
            <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              About
            </Link>
          </motion.nav>
        )}
      </div>
    </header>
  )
}