'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="w-8 h-8 bg-hilop-green rounded-full flex items-center justify-center mb-4">
              <span className="text-black font-bold text-lg">H</span>
            </div>
            <h3 className="text-lg font-bold mb-4">Hilop</h3>
            <p className="text-gray-400 text-sm">
              Luxury meets modern design. Discover timeless elegance with every tick.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <nav className="space-y-2">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                Careers
              </Link>
              <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                Blog
              </Link>
              <Link href="/press" className="text-gray-400 hover:text-white transition-colors text-sm">
                Press
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <nav className="space-y-2">
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                FAQ
              </Link>
              <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">
                Shipping
              </Link>
              <Link href="/returns" className="text-gray-400 hover:text-white transition-colors text-sm">
                Returns
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for updates and exclusive offers.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-900 border-gray-800 text-white"
              />
              <Button size="icon" className="bg-hilop-green hover:bg-hilop-green/90">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-hilop-green flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold mb-1">Phone</h5>
                <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-hilop-green flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold mb-1">Email</h5>
                <p className="text-gray-400 text-sm">support@hilop.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-hilop-green flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold mb-1">Address</h5>
                <p className="text-gray-400 text-sm">123 Luxury Lane, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social */}
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-gray-400 hover:text-hilop-green transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-hilop-green transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-hilop-green transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © 2024 Hilop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}