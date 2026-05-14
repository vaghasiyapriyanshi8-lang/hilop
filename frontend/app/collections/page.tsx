'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { productsService } from '@/services/api/products'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, ArrowRight } from 'lucide-react'

interface Collection {
  id: string
  name: string
  slug: string
  image?: string
  description?: string
  productCount?: number
}

// Fallback images for collections
const COLLECTION_IMAGES: Record<string, string> = {
  'luxury': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000',
  'sport': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000',
  'classic': 'https://images.unsplash.com/photo-1508685096489-7aac291ba59e?auto=format&fit=crop&q=80&w=1000',
  'vintage': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=1000',
  'default': 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1000'
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await productsService.getCategories()
        setCollections(data || [])
      } catch (error) {
        console.error('Failed to fetch collections:', error)
        // Set some default collections if API fails
        setCollections([
          { id: '1', name: 'Luxury Edition', slug: 'luxury', description: 'Experience the pinnacle of horological excellence.' },
          { id: '2', name: 'Sport Series', slug: 'sport', description: 'Precision and durability for the active lifestyle.' },
          { id: '3', name: 'Classic Heritage', slug: 'classic', description: 'Timeless designs that never go out of style.' },
          { id: '4', name: 'Vintage Selection', slug: 'vintage', description: 'Rare and iconic timepieces from history.' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Explore Our Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover the perfect timepiece across our curated series of luxury watches.
          </motion.p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-hilop-green" />
            <p className="text-gray-500">Curating collections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/products?category=₹{collection.slug}`}>
                  <Card className="group relative h-[400px] overflow-hidden cursor-pointer border-0 shadow-xl">
                    <Image
                      src={COLLECTION_IMAGES[collection.slug] || COLLECTION_IMAGES.default}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <h2 className="text-3xl font-bold text-white mb-3">{collection.name}</h2>
                      <p className="text-gray-200 mb-6 line-clamp-2 max-w-md">
                        {collection.description || 'Explore our exclusive range of high-end timepieces crafted for excellence.'}
                      </p>
                      <div className="flex items-center text-hilop-green font-semibold gap-2">
                        View Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
