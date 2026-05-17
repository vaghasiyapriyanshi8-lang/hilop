"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Star, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function Testimonials() {
  const { data, isLoading } = useQuery({
    queryKey: ['latest-testimonials'],
    queryFn: async () => {
      const res = await api.get('/reviews/latest', { params: { limit: 4 } })
      return res.data.data || []
    },
  })

  const items: any[] = data || []

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
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Customer Testimonials</h2>
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            Hear from verified customers about their experiences — authenticity, service, and long-term value.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {isLoading ? (
            <div>Loading testimonials...</div>
          ) : (
            items.map((t: any, index: number) => (
              <motion.div
                key={t._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 transition-all hover:border-hilop-green/30 hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-white">
                        {/* Placeholder initials */}
                        <span className="font-semibold text-lg text-gray-700">{(t.userName || 'U').charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{t.userName || 'Customer'}</h3>
                          <CheckCircle2 className="h-4 w-4 text-hilop-green" />
                        </div>
                        <p className="text-xs text-gray-500">{t.productName || ''}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < (t.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="mb-4 text-sm leading-6 text-gray-700">{t.content || t.title}</p>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Purchased: {t.productName || '—'}</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  )
}
