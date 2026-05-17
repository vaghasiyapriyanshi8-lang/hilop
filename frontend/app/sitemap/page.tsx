'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Map, ShoppingBag, Info, HeadphonesIcon, FileText, ChevronRight } from 'lucide-react'

const SITEMAP = [
  {
    title: 'Shop',
    icon: ShoppingBag,
    links: [
      { label: 'All Watches', href: '/products' },
      { label: 'Collections', href: '/collections' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Watch Features', href: '/features' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'Account',
    icon: Info,
    links: [
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/signup' },
      { label: 'My Profile', href: '/profile' },
      { label: 'My Orders', href: '/orders' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'Support',
    icon: HeadphonesIcon,
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'Warranty Policy', href: '/warranty' },
      { label: 'Watch Care Guide', href: '/care' },
      { label: 'Track My Order', href: '/orders' },
    ],
  },
  {
    title: 'Company',
    icon: Info,
    links: [
      { label: 'About Hilop', href: '/about' },
      { label: 'Watch Features', href: '/features' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'Legal',
    icon: FileText,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Warranty', href: '/warranty' },
      { label: 'Returns Policy', href: '/returns' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-black py-20 px-4 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 mb-6">
            <Map className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">SITEMAP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Site <span className="text-hilop-green">Map</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            A complete overview of all pages on the Hilop website.
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SITEMAP.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-hilop-green/10">
                    <section.icon className="w-4 h-4 text-hilop-green" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-hilop-green transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-hilop-green transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
