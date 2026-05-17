'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gift, Star, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'

const DENOMINATIONS = [
  { amount: '₹2,500', popular: false },
  { amount: '₹5,000', popular: true },
  { amount: '₹10,000', popular: false },
  { amount: '₹25,000', popular: false },
]

const PERKS = [
  'Valid for 12 months from date of purchase',
  'Redeemable on any Hilop watch or accessory',
  'Delivered instantly via email',
  'Can be used in multiple transactions',
  'No expiry on unused balance within validity',
  'Beautifully designed digital card included',
]

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-20 px-4 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 mb-6">
            <Gift className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">HILOP GIFT CARDS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The Gift of <span className="text-hilop-green">Time</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Give someone the freedom to choose their perfect Hilop timepiece. Our gift cards are the most thoughtful present for any occasion.
          </p>
        </motion.div>
      </section>

      {/* Denominations */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Choose Your Amount</h2>
            <p className="text-gray-500">Select a denomination that suits your budget and occasion.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {DENOMINATIONS.map((d, i) => (
              <motion.div
                key={d.amount}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl border-2 p-6 text-center cursor-pointer transition-all hover:shadow-md ${
                  d.popular ? 'border-hilop-green bg-white shadow-md' : 'border-gray-200 bg-white'
                }`}
              >
                {d.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hilop-green text-black text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="flex justify-center mb-3">
                  <div className={`p-2 rounded-full ${d.popular ? 'bg-hilop-green/10' : 'bg-gray-100'}`}>
                    <Star className={`w-5 h-5 ${d.popular ? 'text-hilop-green' : 'text-gray-400'}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{d.amount}</p>
                <p className="text-xs text-gray-400 mt-1">Gift Card</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button size="lg" className="bg-hilop-green text-black hover:bg-hilop-green/90 gap-2">
                Browse Watches Instead <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-500">Simple, flexible, and always appreciated.</p>
          </motion.div>
          <motion.div
            className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <ul className="space-y-4">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-gray-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-hilop-green flex-shrink-0 mt-0.5" />
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-black text-center">
        <motion.div
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Shield className="w-10 h-10 text-hilop-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Need Help Choosing?</h2>
          <p className="text-gray-400 mb-6 text-sm">Our team is happy to help you pick the perfect gift for your loved one.</p>
          <Link href="/contact">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black">
              Contact Us
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
