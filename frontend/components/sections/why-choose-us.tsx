'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Truck, RefreshCw, Award, Clock, Headphones } from 'lucide-react'

const REASONS = [
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    desc: 'Every watch is verified by certified experts before dispatch.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'Complimentary insured shipping on all orders across India.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: RefreshCw,
    title: '7-Day Returns',
    desc: 'Not satisfied? Return or exchange within 7 days, no questions asked.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Award,
    title: '2-Year Warranty',
    desc: 'Comprehensive manufacturer warranty on every Hilop timepiece.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Clock,
    title: 'Same-Day Dispatch',
    desc: 'Orders placed before 3pm IST are dispatched the same day.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    desc: 'Our watch specialists are available Mon–Sat, 10am–7pm IST.',
    color: 'bg-cyan-50 text-cyan-600',
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-gray-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Why Choose Hilop?</h2>
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            We go beyond selling watches — we deliver trust, quality, and an experience worth remembering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.title}
              className="flex items-start gap-4 rounded-2xl bg-white p-6 border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
            >
              <div className={`p-3 rounded-xl flex-shrink-0 ${reason.color}`}>
                <reason.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{reason.title}</h3>
                <p className="text-sm text-gray-500 leading-6">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
