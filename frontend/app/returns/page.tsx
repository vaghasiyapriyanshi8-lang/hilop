'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle2, XCircle, ArrowRight, Package, Mail } from 'lucide-react'

const STEPS = [
  { step: '01', title: 'Initiate Return', desc: 'Go to My Orders, find your delivered order, and click "Return / Exchange" within 7 days of delivery.' },
  { step: '02', title: 'Get Approval', desc: 'Our team reviews your request within 24 hours and sends a prepaid return shipping label to your email.' },
  { step: '03', title: 'Ship It Back', desc: 'Pack the watch securely in its original box with all accessories and drop it off at any courier partner.' },
  { step: '04', title: 'Refund Processed', desc: 'Once we receive and inspect the watch, your refund is processed within 5–7 business days to your original payment method.' },
]

const ELIGIBLE = [
  'Unworn watches in original condition',
  'All original packaging, tags, and accessories included',
  'Certificate of authenticity present',
  'Return initiated within 7 days of delivery',
  'Manufacturing defects or wrong item received',
]

const NOT_ELIGIBLE = [
  'Watches showing signs of wear or use',
  'Missing original box, tags, or accessories',
  'Customised or engraved watches',
  'Returns initiated after 7 days',
  'Damage caused by misuse or accidents',
]

export default function ReturnsPage() {
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
            <RefreshCw className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">RETURNS & EXCHANGES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Hassle-Free <span className="text-hilop-green">7-Day Returns</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Not completely satisfied? Submit a return or exchange request directly from your orders page within 7 days of delivery.
          </p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">How to Return</h2>
            <p className="text-gray-500">Four simple steps to a full refund.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <span className="text-4xl font-black text-hilop-green/20">{s.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-6">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligible / Not Eligible */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Return Eligibility</h2>
            <p className="text-gray-500">Please review the conditions before initiating a return.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-green-50 rounded-2xl p-6 border border-green-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-hilop-green" /> Eligible for Return
              </h3>
              <ul className="space-y-3">
                {ELIGIBLE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-hilop-green flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="bg-red-50 rounded-2xl p-6 border border-red-100"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" /> Not Eligible for Return
              </h3>
              <ul className="space-y-3">
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
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
          <Package className="w-10 h-10 text-hilop-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Return?</h2>
          <p className="text-gray-400 mb-6 text-sm">Go to My Orders and click "Return / Exchange" on any delivered order within 7 days.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold gap-2">
                <RefreshCw className="w-4 h-4" /> My Orders
              </Button>
            </Link>
            <Link href="/orders" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-transparent border border-white/40 text-white hover:bg-white hover:text-black transition-colors gap-2 font-semibold">
                Track My Order <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
