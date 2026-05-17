'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, CheckCircle2, Wrench, ArrowRight, Clock, Phone } from 'lucide-react'

const COVERAGE = [
  'All mechanical and electronic movement defects',
  'Case and bracelet manufacturing faults',
  'Crown and pusher malfunctions',
  'Dial and hands defects under normal use',
  'Water resistance failure (within rated depth)',
  'Free annual service in the first year',
]

const NOT_COVERED = [
  'Physical damage from drops or impacts',
  'Scratches on crystal or case from daily wear',
  'Battery replacement (quartz models)',
  'Damage from improper use or modifications',
  'Strap wear and tear',
  'Damage from exposure beyond rated water resistance',
]

const PROCESS = [
  { step: '01', title: 'Contact Us', desc: 'Reach out via email or phone with your order number and a description of the issue.' },
  { step: '02', title: 'Ship to Service Centre', desc: 'We send you a prepaid label. Pack your watch securely and ship it to our authorised service centre.' },
  { step: '03', title: 'Diagnosis & Repair', desc: 'Our certified watchmakers inspect and repair your timepiece, typically within 10–14 business days.' },
  { step: '04', title: 'Returned to You', desc: 'Your watch is quality-checked, re-sealed, and shipped back to you fully insured at no cost.' },
]

export default function WarrantyPage() {
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
            <Shield className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">WARRANTY POLICY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            2-Year <span className="text-hilop-green">Warranty</span> on Every Watch
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Every Hilop timepiece is backed by a comprehensive 2-year international warranty. We stand behind the quality of every watch we sell.
          </p>
        </motion.div>
      </section>

      {/* Coverage */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">What's Covered</h2>
            <p className="text-gray-500">Our warranty covers all manufacturing defects for 2 full years.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-green-50 rounded-2xl p-6 border border-green-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-hilop-green" /> Covered Under Warranty
              </h3>
              <ul className="space-y-3">
                {COVERAGE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-hilop-green flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="bg-gray-100 rounded-2xl p-6 border border-gray-200"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-gray-500" /> Not Covered
              </h3>
              <ul className="space-y-3">
                {NOT_COVERED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Claim Process */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">How to Claim Warranty</h2>
            <p className="text-gray-500">A straightforward process from start to finish.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROCESS.map((s, i) => (
              <motion.div
                key={s.step}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
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

      {/* CTA */}
      <section className="py-16 px-4 bg-black text-center">
        <motion.div
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Clock className="w-10 h-10 text-hilop-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Need to Make a Claim?</h2>
          <p className="text-gray-400 mb-6 text-sm">Our service team is available Mon–Sat, 10am–7pm IST.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold gap-2">
                <Phone className="w-4 h-4" /> Contact Support
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-transparent border border-white/40 text-white hover:bg-white hover:text-black transition-colors gap-2 font-semibold">
                Shop Watches <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
