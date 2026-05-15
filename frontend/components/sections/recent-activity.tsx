'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CheckCircle2, ShoppingBag, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

const recentActivities = [
  {
    id: 1,
    type: 'purchase',
    customer: 'Rahul K.',
    location: 'Delhi',
    product: 'Rolex Submariner Gold',
    time: '2 mins ago'
  },
  {
    id: 2,
    type: 'delivery',
    customer: 'Meera S.',
    location: 'Bangalore',
    product: 'TAG Heuer Aquaracer',
    time: '15 mins ago'
  },
  {
    id: 3,
    type: 'purchase',
    customer: 'Vikas M.',
    location: 'Mumbai',
    product: 'Omega Seamaster',
    time: '28 mins ago'
  },
  {
    id: 4,
    type: 'purchase',
    customer: 'Isha P.',
    location: 'Pune',
    product: 'Breitling Navitimer',
    time: '45 mins ago'
  },
  {
    id: 5,
    type: 'delivery',
    customer: 'Arjun R.',
    location: 'Hyderabad',
    product: 'Cartier Tank',
    time: '1 hour ago'
  },
]

export function RecentActivity() {
  const [activities, setActivities] = useState(recentActivities)

  useEffect(() => {
    // Simulate new activities
    const activityInterval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'purchase' : 'delivery',
        customer: `Customer ${Math.floor(Math.random() * 1000)}`,
        location: ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
        product: ['Rolex Submariner', 'TAG Heuer', 'Omega Seamaster', 'Breitling', 'Cartier'][Math.floor(Math.random() * 5)],
        time: 'just now'
      }
      setActivities(prev => [newActivity, ...prev.slice(0, 4)])
    }, 8000)

    return () => clearInterval(activityInterval)
  }, [])

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Real-Time Activity</h2>
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            Join our growing community of watch enthusiasts. See what others are purchasing right now.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${activity.type === 'purchase' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {activity.type === 'purchase' ? (
                      <ShoppingBag className="h-5 w-5 text-green-600" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{activity.customer}</h3>
                      {activity.type === 'purchase' && (
                        <span className="text-xs font-medium text-green-600">Purchased</span>
                      )}
                      {activity.type === 'delivery' && (
                        <span className="text-xs font-medium text-blue-600">Received</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{activity.product}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400">{activity.time}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
