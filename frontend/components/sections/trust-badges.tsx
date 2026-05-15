'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Award, Truck, Clock } from 'lucide-react'

const trustBadges = [
  {
    icon: Shield,
    title: '100% Authentic',
    description: '27-point inspection guarantee',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    icon: Lock,
    title: 'Secure Payment',
    description: 'Bank-level encryption',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    icon: Award,
    title: 'Certified Expert',
    description: 'ISO 9001 certified',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day dispatch available',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    icon: Clock,
    title: '2-Year Warranty',
    description: 'Comprehensive coverage',
    color: 'bg-red-50 border-red-200 text-red-700'
  },
]

export function TrustBadges() {
  return (
    <section className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:shadow-md ${badge.color}`}
            >
              <badge.icon className="h-6 w-6" />
              <h3 className="text-center font-semibold text-sm">{badge.title}</h3>
              <p className="text-center text-xs opacity-80">{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
