'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Star, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Arjun Sharma',
    role: 'Investment Advisor',
    location: 'Mumbai, India',
    image: '/images/avatar-1.svg',
    rating: 5,
    text: 'The Submariner I purchased from Hilop is absolutely stunning. The authentication process was thorough, and the delivery was incredibly quick. Best luxury watch investment ever!',
    verified: true,
    purchaseDate: '2 months ago',
    productName: 'Rolex Submariner'
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Entrepreneur',
    location: 'Bangalore, India',
    image: '/images/avatar-2.svg',
    rating: 5,
    text: 'Hilop\'s customer service is exceptional. They helped me find the perfect watch within my budget. The warranty coverage gives me complete peace of mind.',
    verified: true,
    purchaseDate: '1 month ago',
    productName: 'TAG Heuer Aquaracer'
  },
  {
    id: 3,
    name: 'Rajesh Nair',
    role: 'Luxury Collector',
    location: 'Delhi, India',
    image: '/images/avatar-3.svg',
    rating: 5,
    text: 'Been collecting watches for 10 years, and Hilop consistently offers the finest selection. Their experts really know their craft. Highly recommended!',
    verified: true,
    purchaseDate: '3 weeks ago',
    productName: 'Omega Seamaster'
  },
  {
    id: 4,
    name: 'Sanjana Gupta',
    role: 'Corporate Executive',
    location: 'Hyderabad, India',
    image: '/images/avatar-4.svg',
    rating: 5,
    text: 'Perfect gift for my husband\'s milestone birthday. The presentation was elegant, and the watch arrived in pristine condition. Hilop exceeded all expectations!',
    verified: true,
    purchaseDate: '3 days ago',
    productName: 'Breitling Navitimer'
  },
]

export function Testimonials() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Trusted by Watch Enthusiasts</h2>
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            Join thousands of satisfied customers who have found their perfect timepiece at Hilop.
            Read verified reviews from our community.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 transition-all hover:border-hilop-green/30 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <CheckCircle2 className="h-4 w-4 text-hilop-green" title="Verified Purchase" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="mb-4 text-sm leading-6 text-gray-700">{testimonial.text}</p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Purchased: {testimonial.productName}</span>
                    <span>{testimonial.purchaseDate}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
