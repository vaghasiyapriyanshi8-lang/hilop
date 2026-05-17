'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Droplets, Sun, Wind, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react'

const TIPS = [
  {
    icon: Droplets,
    title: 'Water & Moisture',
    color: 'bg-cyan-50 text-cyan-600',
    points: [
      'Rinse with fresh water after saltwater exposure',
      'Avoid hot showers — steam can damage seals over time',
      'Never operate the crown underwater',
      'Have water resistance re-tested annually',
    ],
  },
  {
    icon: Sun,
    title: 'Heat & Sunlight',
    color: 'bg-amber-50 text-amber-600',
    points: [
      'Avoid leaving your watch in direct sunlight for extended periods',
      'Keep away from extreme heat sources like saunas',
      'Store at room temperature (15–25°C)',
      'UV exposure can fade leather straps over time',
    ],
  },
  {
    icon: Sparkles,
    title: 'Cleaning & Polishing',
    color: 'bg-purple-50 text-purple-600',
    points: [
      'Wipe the case with a soft, lint-free cloth daily',
      'Use a damp cloth for stubborn dirt on steel bracelets',
      'Avoid chemical cleaners, solvents, or abrasives',
      'Use the included polishing cloth for the crystal',
    ],
  },
  {
    icon: Wind,
    title: 'Storage',
    color: 'bg-emerald-50 text-emerald-600',
    points: [
      'Store in the original Hilop box when not wearing',
      'Keep away from strong magnetic fields (speakers, phones)',
      'Use a watch winder for automatic models',
      'Avoid storing multiple watches loose together',
    ],
  },
]

const DOS = [
  'Wind automatic watches gently every 1–2 days if not worn',
  'Have your watch serviced every 3–5 years by a professional',
  'Replace leather straps every 1–2 years for hygiene',
  'Check crown is fully pushed in before any water exposure',
  'Use the original Hilop box for long-term storage',
]

const DONTS = [
  'Don\'t expose to strong magnetic fields',
  'Don\'t use ultrasonic cleaners at home',
  'Don\'t attempt to open the case yourself',
  'Don\'t wear during contact sports or heavy manual work',
  'Don\'t ignore a fogged crystal — it means moisture has entered',
]

export default function CareGuidePage() {
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
            <Sparkles className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">WATCH CARE GUIDE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Keep Your Hilop <span className="text-hilop-green">Pristine</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            A well-cared-for watch lasts a lifetime. Follow these simple guidelines to keep your Hilop timepiece looking and performing its best.
          </p>
        </motion.div>
      </section>

      {/* Care Tips */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Care by Category</h2>
            <p className="text-gray-500">Everything you need to know to protect your investment.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${tip.color}`}>
                  <tip.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{tip.title}</h3>
                <ul className="space-y-2">
                  {tip.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-hilop-green flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Quick Do's & Don'ts</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-green-50 rounded-2xl p-6 border border-green-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-hilop-green" /> Do's
              </h3>
              <ul className="space-y-3">
                {DOS.map((item) => (
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
                <AlertTriangle className="w-5 h-5 text-red-500" /> Don'ts
              </h3>
              <ul className="space-y-3">
                {DONTS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
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
          <h2 className="text-2xl font-bold text-white mb-3">Have a Question About Your Watch?</h2>
          <p className="text-gray-400 mb-6 text-sm">Our expert team is always happy to help with care and servicing advice.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold">
                Contact Our Experts
              </Button>
            </Link>
            <Link href="/warranty" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-transparent border border-white/40 text-white hover:bg-white hover:text-black transition-colors gap-2 font-semibold">
                Warranty Info <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
