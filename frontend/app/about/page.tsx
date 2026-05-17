'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Award, Users, CheckCircle2, Star, Package, ShoppingBag, Loader2, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

const reasons = [
  { title: 'Authenticity Guaranteed', description: 'Every timepiece is authenticated by certified horologists with 15+ years of experience.' },
  { title: 'Expert Curation', description: 'Hand-picked selections from top global luxury watch brands.' },
  { title: 'Customer Care', description: 'Fast, insured delivery and responsive support Mon–Sat.' },
  { title: 'Secure Transactions', description: 'Bank-level encryption and secure payment gateway for complete peace of mind.' },
  { title: 'Same-Day Dispatch', description: 'Orders placed before 3pm IST are dispatched the same day.' },
  { title: 'Hassle-Free Returns', description: '7-day return policy with full refund guarantee, no questions asked.' },
]

export default function AboutPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      const res = await api.get('/analytics/public-stats')
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const stats = [
    { icon: Clock,       label: 'Years of Excellence',  value: '15+' },
    { icon: Package,     label: 'Products Available',   value: data?.totalProducts  ? `${data.totalProducts.toLocaleString()}+`  : null },
    { icon: ShoppingBag, label: 'Orders Delivered',     value: data?.totalOrders    ? `${data.totalOrders.toLocaleString()}+`    : null },
    { icon: Users,       label: 'Happy Customers',      value: data?.totalUsers     ? `${data.totalUsers.toLocaleString()}+`     : null },
    { icon: Star,        label: 'Average Rating',       value: data?.avgRating      ? `${data.avgRating} / 5`                   : null },
    { icon: Award,       label: 'Customer Reviews',     value: data?.totalReviews   ? `${data.totalReviews.toLocaleString()}+`  : null },
    { icon: Shield,      label: 'Certified Authentic',  value: '100%' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-black pb-20">
        <Image
            src="/images/watch-hero.svg"
            alt="Hilop luxury watch"
            fill
            priority
            className="object-cover opacity-50"
          />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-hilop-green" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white">Est. 2011 · Mumbai, India</span>
            </div>
            <h1 className="mb-5 text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              Curators of<br />
              <span className="text-hilop-green">Fine Timepieces</span>
            </h1>
            <p className="max-w-xl text-lg font-light leading-relaxed text-gray-300">
              Authentic luxury watches, verified by experts and backed by a 2‑year warranty. Trusted by collectors across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── LIVE STATS STRIP ── */}
      <section className="bg-hilop-green">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-black/10 sm:grid-cols-4">
            {[
              { label: 'Orders Delivered', value: data?.totalOrders ? `${data.totalOrders.toLocaleString()}+` : '—' },
              { label: 'Happy Customers',  value: data?.totalUsers   ? `${data.totalUsers.toLocaleString()}+`  : '—' },
              { label: 'Avg. Rating',      value: data?.avgRating    ? `${data.avgRating} / 5`                 : '—' },
              { label: 'Authentic',        value: '100%' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="py-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <p className="text-2xl font-black text-black sm:text-3xl">
                  {isLoading && s.value === '—' ? (
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-black/50" />
                  ) : s.value}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-black/60">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERITAGE ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-hilop-green">Our Story</p>
            <h2 className="mb-6 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
              A Decade of<br />Horological Excellence
            </h2>
            <div className="space-y-5 text-base leading-8 text-gray-500">
              <p>
                Since 2011, Hilop has sourced and authenticated premium watches from leading global maisons.
                What started as a passion project has grown into India's most trusted luxury watch platform.
              </p>
              <p>
                Each piece passes a 27‑point inspection and is covered by a 2‑year warranty. We've delivered
                over <span className="font-semibold text-gray-900">{data?.totalOrders ? data.totalOrders.toLocaleString() : '50,000'}</span> watches
                across 30+ cities, serving <span className="font-semibold text-gray-900">{data?.totalUsers ? data.totalUsers.toLocaleString() : '10,000+'}</span> happy customers.
              </p>
              <p>
                Our team of certified horologists brings decades of combined expertise to ensure every
                timepiece that leaves our warehouse is exactly as described — authentic, pristine, and perfect.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-hilop-green hover:text-black"
            >
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[560px] overflow-hidden rounded-3xl shadow-2xl">
              <Image src="/images/watch-hero.svg" alt="Hilop timepiece" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            {/* floating badge */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
              <p className="text-3xl font-black text-hilop-green">15+</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">Years of Excellence</p>
            </div>
            <div className="absolute -top-6 -right-6 rounded-2xl bg-black p-5 shadow-xl">
              <p className="text-3xl font-black text-hilop-green">100%</p>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">Certified Authentic</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRACK RECORD ── */}
      <section className="bg-gray-950 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-hilop-green">By the Numbers</p>
            <h2 className="text-4xl font-black text-white sm:text-5xl">Our Track Record</h2>
            <p className="mt-3 text-gray-400 text-sm">Live numbers pulled directly from our platform.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="group rounded-2xl border border-white/5 bg-white/5 p-5 text-center transition-all hover:border-hilop-green/40 hover:bg-hilop-green/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 inline-flex rounded-xl bg-hilop-green/10 p-2.5">
                  <stat.icon className="h-5 w-5 text-hilop-green" />
                </div>
                <p className="text-2xl font-black text-white">
                  {isLoading && !stat.value ? (
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-hilop-green" />
                  ) : (stat.value ?? '—')}
                </p>
                <p className="mt-1 text-xs text-gray-400 leading-4">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST US ── */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-hilop-green">Our Promise</p>
            <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">Why Customers Trust Hilop</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:border-hilop-green/30 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-hilop-green/5 transition-all group-hover:bg-hilop-green/10" />
                <div className="mb-4 inline-flex rounded-xl bg-hilop-green/10 p-2.5">
                  <CheckCircle2 className="h-5 w-5 text-hilop-green" />
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900">{reason.title}</h3>
                <p className="text-sm leading-6 text-gray-500">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEW BAR ── */}
      <section className="bg-black px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            {[
              {
                value: isLoading ? null : (data?.avgRating ?? '4.9'),
                suffix: '/ 5',
                label: 'Average Rating',
                stars: true,
                rating: data?.avgRating ?? 4.9,
              },
              {
                value: isLoading ? null : (data?.totalReviews ? `${data.totalReviews.toLocaleString()}+` : '—'),
                label: 'Verified Reviews',
                stars: false,
              },
              {
                value: isLoading ? null : (data?.totalOrders ? `${data.totalOrders.toLocaleString()}+` : '—'),
                label: 'Orders Delivered',
                stars: false,
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-hilop-green mb-2" />
                ) : (
                  <p className="text-5xl font-black text-hilop-green sm:text-6xl">
                    {item.value}
                    {item.suffix && <span className="text-2xl text-gray-400 ml-1">{item.suffix}</span>}
                  </p>
                )}
                {item.stars && (
                  <div className="mt-2 flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${j < Math.round(item.rating as number) ? 'fill-hilop-green text-hilop-green' : 'text-gray-700'}`}
                      />
                    ))}
                  </div>
                )}
                <p className="mt-2 text-sm font-medium text-gray-400">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY / CTA ── */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-hilop-green">Our Philosophy</p>
            <h2 className="mb-6 text-4xl font-black text-gray-900 sm:text-5xl">
              Time is the Only<br />True Luxury
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-500">
              We curate lasting value through quality, authenticity, and service. Every watch we sell is a
              promise — to the craft, to the customer, and to the timeless pursuit of excellence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-hilop-green px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-hilop-green/90"
              >
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-8 py-3.5 text-sm font-bold text-gray-700 transition-all hover:border-gray-400"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
