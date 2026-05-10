'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Shield, Clock, Award, Users } from 'lucide-react'

const stats = [
  { label: 'Years of Excellence', value: '15+', icon: Clock },
  { label: 'Luxury Brands', value: '50+', icon: Award },
  { label: 'Happy Clients', value: '10k+', icon: Users },
  { label: 'Certified Authentic', value: '100%', icon: Shield },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Watch"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            The Art of Time
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto font-light"
          >
            Hilop is more than a watch store. It's a sanctuary for horological excellence and timeless luxury.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Our Heritage</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                Founded in 2011, Hilop began with a single vision: to bring the world's most 
                extraordinary timepieces to connoisseurs who appreciate the intricate 
                craftsmanship behind every tick.
              </p>
              <p>
                We believe that a watch is more than just a tool for telling time—it's a legacy, 
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
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=1000"
              alt="Watchmaking"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-sm"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-hilop-green" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8">Our Philosophy</h2>
          <p className="text-xl text-gray-600 italic leading-relaxed">
            "We don't just sell watches; we curate moments that last a lifetime. 
            In an era of fleeting trends, we celebrate the enduring beauty of 
            classical horology."
          </p>
          <div className="mt-8 font-semibold text-lg">— The Hilop Team</div>
        </motion.div>
      </section>
    </div>
  )
}
