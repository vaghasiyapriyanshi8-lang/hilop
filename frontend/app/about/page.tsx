'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Shield, Clock, Award, Users } from 'lucide-react'
import Image from 'next/image'

const stats = [
  { label: 'Years of Excellence', value: '15+', icon: Clock },
  { label: 'Luxury Brands', value: '50+', icon: Award },
  { label: 'Happy Clients', value: '10k+', icon: Users },
  { label: 'Certified Authentic', value: '100%', icon: Shield },
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
                craftsmanship behind every tick.
              </p>
              <p>
                We believe that a watch is more than just a tool for telling time. It is a legacy,
                an investment, and a masterpiece of engineering that you carry with you.
                Our collection is carefully curated from the most prestigious watchmakers
                across Switzerland and beyond.
              </p>
              <p>
                Every timepiece in our collection undergoes a rigorous multi-point inspection
                by our master watchmakers to ensure absolute authenticity and perfect
                mechanical condition.
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
            classical horology.
          </p>
          <div className="mt-8 text-lg font-semibold">The Hilop Team</div>
        </motion.div>
      </section>
    </div>
  )
}
