'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Shield, Award, RefreshCw, Truck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const TRUST_BADGES = [
  { icon: Shield, label: '2-Year Warranty', sub: 'On every watch' },
  { icon: Truck, label: 'Free Shipping', sub: 'Orders over ₹29' },
  { icon: RefreshCw, label: '7-Day Returns', sub: 'Hassle-free policy' },
  { icon: Award, label: 'Certified Authentic', sub: '100% genuine products' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }
  return (
    <footer className="bg-black text-white mt-20">

      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-hilop-green/10 flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-hilop-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{badge.label}</p>
                  <p className="text-xs text-gray-400">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Brand Story */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-hilop-green rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold tracking-wide">Hilop</span>
            </div>
            <p className="text-gray-400 text-sm leading-6 mb-5">
              Founded with a passion for precision, Hilop crafts luxury timepieces that blend Swiss-inspired engineering with contemporary design. Every watch is a statement of elegance and reliability.
            </p>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-hilop-green text-hilop-green" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-400 ml-2">4.9 / 5 — 2,400+ reviews</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Shop</h4>
            <nav className="space-y-3">
              {[
                { label: 'All Watches', href: '/products' },
                { label: 'Collections', href: '/collections' },
                { label: 'New Arrivals', href: '/products?sort=newest' },
                { label: 'Watch Features', href: '/features' },
                { label: 'Gift Cards', href: '/gift-cards' },
              ].map((link) => (
                <div key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-hilop-green transition-colors text-sm">
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Support</h4>
            <nav className="space-y-3">
              {[
                { label: 'Track My Order', href: '/orders' },
                { label: 'Returns & Exchanges', href: '/returns' },
                { label: 'Warranty Policy', href: '/warranty' },
                { label: 'Watch Care Guide', href: '/care' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <div key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-hilop-green transition-colors text-sm">
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4 leading-6">
              Get early access to new collections, exclusive offers, and watch care tips — straight to your inbox.
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-hilop-green"
              />
              <Button size="icon" onClick={handleSubscribe} className="bg-hilop-green hover:bg-hilop-green/90 flex-shrink-0">
                <Mail className="w-4 h-4 text-black" />
              </Button>
            </div>
            {subscribed && (
              <p className="text-xs text-hilop-green mb-2">✓ You're subscribed! Thank you.</p>
            )}
            <p className="text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Contact + Certifications */}
        <div className="border-t border-gray-800 pt-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-hilop-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-0.5">Customer Support</p>
                <p className="text-gray-400 text-sm">+91 98765 43210</p>
                <p className="text-gray-500 text-xs">Mon–Sat, 10am–7pm IST</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-hilop-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-0.5">Email Us</p>
                <Link href="/contact?subject=Support+Enquiry" className="text-gray-400 hover:text-hilop-green transition-colors text-sm">support@hilop.com</Link>
                <p className="text-gray-500 text-xs">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-hilop-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-0.5">Our Store</p>
                <p className="text-gray-400 text-sm">Hilop Flagship, Mumbai, India</p>
                <p className="text-gray-500 text-xs">Visit us by appointment</p>
              </div>
            </div>
          </div>

          {/* Brand trust line */}
          <div className="bg-gray-900 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              🏆 <span className="text-white font-semibold">Hilop</span> — India's trusted luxury watch brand since 2020. Over <span className="text-hilop-green font-semibold">50,000 watches</span> delivered across 30+ cities.
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs bg-hilop-green/10 text-hilop-green border border-hilop-green/20 px-3 py-1 rounded-full font-medium">ISO Certified</span>
              <span className="text-xs bg-hilop-green/10 text-hilop-green border border-hilop-green/20 px-3 py-1 rounded-full font-medium">100% Authentic</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <Link href="#" className="text-gray-500 hover:text-hilop-green transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-hilop-green transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-hilop-green transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/warranty" className="hover:text-white transition-colors">Warranty</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>

            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Hilop. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
