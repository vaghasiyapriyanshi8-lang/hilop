'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Zap,
  Droplets,
  Watch,
  Sparkles,
  Clock,
  Award,
  Wrench,
  Heart,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: '2-Year Warranty',
    description:
      'Every Hilop watch comes with a comprehensive 2-year manufacturer warranty covering all mechanical and electronic defects. Our dedicated service team ensures your timepiece stays in perfect condition.',
    highlights: ['Full parts & labour coverage', 'Authorised service centres', 'Free annual servicing in year one'],
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Droplets,
    title: 'Water Resistance',
    description:
      'Engineered with precision-sealed cases and screw-down crowns, Hilop watches offer water resistance up to 100 metres — perfect for swimming, snorkelling, and everyday splashes.',
    highlights: ['Up to 100m water resistance', 'Screw-down crown technology', 'Pressure-tested gaskets'],
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: Zap,
    title: 'Precision Movement',
    description:
      'Powered by Swiss-grade quartz and automatic movements, Hilop timepieces deliver accuracy within ±10 seconds per month. Our automatic models self-wind with every wrist movement.',
    highlights: ['Swiss-grade quartz accuracy', 'Self-winding automatic option', '±10 sec/month precision'],
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Sparkles,
    title: 'Sapphire Crystal Glass',
    description:
      'Our watches feature scratch-resistant sapphire crystal glass — the same material used in premium luxury brands. Rated 9 on the Mohs hardness scale, it withstands daily wear without a mark.',
    highlights: ['Scratch-resistant sapphire', 'Anti-reflective coating', 'Crystal-clear visibility'],
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Award,
    title: 'Premium Materials',
    description:
      'From 316L stainless steel cases to genuine leather and stainless steel bracelets, every Hilop watch is crafted from materials that age beautifully and resist corrosion.',
    highlights: ['316L surgical-grade steel', 'Genuine leather straps', 'Hypoallergenic materials'],
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Clock,
    title: 'Luminous Hands & Markers',
    description:
      'Super-LumiNova® coated hands and hour markers glow brilliantly in the dark, ensuring perfect readability in any lighting condition — day or night.',
    highlights: ['Super-LumiNova® coating', 'Up to 8 hours glow time', 'Visible in all conditions'],
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Wrench,
    title: 'Easy Strap Adjustment',
    description:
      'All Hilop watches feature quick-release spring bars, allowing you to swap straps in seconds without any tools. Personalise your look to match any outfit or occasion.',
    highlights: ['Tool-free strap swap', 'Universal 20mm/22mm lugs', 'Wide strap collection available'],
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Heart,
    title: 'Gift Ready Packaging',
    description:
      'Every Hilop watch arrives in a premium gift box with a polishing cloth, extra links, and a certificate of authenticity — making it the perfect gift straight out of the box.',
    highlights: ['Premium gift box included', 'Certificate of authenticity', 'Polishing cloth & extra links'],
    color: 'bg-rose-50 text-rose-600',
  },
]

const SPECS = [
  { label: 'Case Material', value: '316L Stainless Steel' },
  { label: 'Crystal', value: 'Sapphire Crystal (AR Coated)' },
  { label: 'Water Resistance', value: '100 Metres' },
  { label: 'Movement', value: 'Quartz / Automatic' },
  { label: 'Strap Options', value: 'Leather, Steel, Silicone' },
  { label: 'Lug Width', value: '20mm / 22mm' },
  { label: 'Warranty', value: '2 Years International' },
  { label: 'Luminosity', value: 'Super-LumiNova®' },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-20 px-4 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 mb-6">
            <Watch className="h-4 w-4 text-hilop-green" />
            <span className="text-sm font-semibold text-white">HILOP WATCH FEATURES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Built for <span className="text-hilop-green">Excellence</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Every Hilop timepiece is engineered with precision, crafted with premium materials,
            and designed to last a lifetime. Discover what sets us apart.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-hilop-green text-black hover:bg-hilop-green/90 gap-2">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Every Hilop Watch Includes</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From the movement inside to the box it arrives in — no detail is overlooked.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className={`inline-flex p-3 rounded-xl mb-5 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-7 mb-5">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-hilop-green flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Standard Specifications</h2>
            <p className="text-gray-500">Core specs shared across the Hilop collection.</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {SPECS.map((spec, index) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between px-6 py-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <span className="text-sm font-semibold text-gray-600">{spec.label}</span>
                <span className="text-sm font-bold text-gray-900">{spec.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-black text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Own a <span className="text-hilop-green">Hilop</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Browse our full collection and find the timepiece that speaks to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-hilop-green text-black hover:bg-hilop-green/90 gap-2 w-full sm:w-auto">
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="bg-transparent border border-white/40 text-white hover:bg-white hover:text-black transition-colors gap-2 w-full sm:w-auto">
                View Collections
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
