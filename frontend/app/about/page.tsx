'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Shield, Clock, Award, Users, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

const stats = [
  { label: 'Years of Excellence', value: '15+', icon: Clock },
  { label: 'Luxury Brands', value: '50+', icon: Award },
  { label: 'Happy Clients', value: '10k+', icon: Users },
  { label: 'Certified Authentic', value: '100%', icon: Shield },
]

const certifications = [
  'ISO 9001:2015 Certified',
  'Authentication Experts',
  'Authorized Dealer Network',
  'Insured Shipments',
  'Multi-Point Inspection',
  '2-Year Warranty Program',
]

const reasons = [
  {
    title: 'Authenticity Guaranteed',
    description: 'Every timepiece is authenticated by certified horologists with 15+ years of experience'
  },
  {
    title: 'Premium Selection',
    description: 'Curated collection from top 50+ international luxury watch brands'
  },
  {
    title: 'Expert Support',
    description: '24/7 customer support team ready to help with any queries or concerns'
  },
  {
    title: 'Secure Transactions',
    description: 'Bank-level encryption and secure payment gateway for complete peace of mind'
  },
  {
    title: 'Fast Delivery',
    description: 'Same-day dispatch with insured courier service across India'
  },
  {
    title: 'Hassle-Free Returns',
    description: '30-day return policy with full refund guarantee, no questions asked'
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/watch-hero.svg"
            alt="Luxury Watch"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold md:text-7xl"
          >
            The Art of Time
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-xl font-light md:text-2xl"
          >
            Hilop is more than a watch store. It is a sanctuary for horological excellence and timeless luxury.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 text-4xl font-bold">Our Heritage</h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-600">
              <p>
                Founded in 2011, Hilop began with a single vision: to bring the world&apos;s most
                extraordinary timepieces to connoisseurs who appreciate the intricate
                craftsmanship behind every tick. Today, we are recognized as India&apos;s leading
                authority in luxury watches.
              </p>
              <p>
                We believe that a watch is more than just a tool for telling time. It is a legacy,
                an investment, and a masterpiece of engineering that you carry with you.
                Our collection is carefully curated from the most prestigious watchmakers
                across Switzerland, Germany, Japan, and beyond.
              </p>
              <p>
                Every timepiece in our collection undergoes a rigorous 27-point inspection
                by our master watchmakers and certified horologists to ensure absolute authenticity,
                mechanical perfection, and pristine condition. We stand behind every watch
                with our industry-leading 2-year comprehensive warranty.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] overflow-hidden rounded-lg shadow-2xl"
          >
            <Image
              src="/images/watch-elegance.svg"
              alt="Watchmaking"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Track Record</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center">
                  <stat.icon className="mx-auto mb-4 h-8 w-8 text-hilop-green" />
                  <div className="mb-2 text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Customers Trust Hilop</h2>
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-hilop-green flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900">{reason.title}</h3>
                  </div>
                  <p className="text-gray-600">{reason.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Certifications & Standards</h2>
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
            viewport={{ once: true }}
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 rounded-lg bg-white p-4"
              >
                <Shield className="h-5 w-5 text-hilop-green flex-shrink-0" />
                <span className="font-medium text-gray-700">{cert}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="mb-8 text-4xl font-bold">Our Philosophy</h2>
          <p className="text-xl italic leading-relaxed text-gray-600">
            We do not just sell watches; we curate moments that last a lifetime.
            In an era of fleeting trends, we celebrate the enduring beauty of
            classical horology and the craftsmanship that defines luxury.
          </p>
          <div className="mt-8">
            <p className="text-lg font-semibold">The Hilop Team</p>
            <p className="mt-2 text-gray-600">
              Dedicated to bringing you the finest timepieces with uncompromising quality standards.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
