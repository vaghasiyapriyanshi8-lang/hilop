'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { useWishlistStore } from '@/store/wishlist'
import { formatPrice } from '@/utils/format'

export default function WishlistPage() {
  const router = useRouter()
  const { toast } = useToast()
  const items = useWishlistStore((state) => state.items)
  const removeItem = useWishlistStore((state) => state.removeItem)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId)
    toast({
      title: 'Removed from wishlist',
      description: `${productName} has been removed from your wishlist.`,
      action: (
        <ToastAction altText="View wishlist" onClick={() => router.push('/wishlist')}>
          View wishlist
        </ToastAction>
      ),
    })
  }

  const handleClearWishlist = () => {
    clearWishlist()
    toast({
      title: 'Wishlist cleared',
      description: 'All saved products have been removed.',
    })
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-8 flex items-center justify-between gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Button asChild variant="ghost" className="mb-4 gap-2 px-0 hover:bg-transparent">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>
            </Button>
            <h1 className="text-4xl font-bold tracking-tight">Wishlist</h1>
            <p className="mt-2 text-gray-600">Your saved products, ready when you are.</p>
          </div>

          {items.length > 0 && (
            <Button variant="outline" onClick={handleClearWishlist} className="shrink-0">
              Clear all
            </Button>
          )}
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
            <p className="mt-3 text-gray-600">Tap the heart on any product to save it here.</p>
            <Button asChild className="mt-6 bg-hilop-green text-black hover:bg-hilop-green/90">
              <Link href="/products">Browse products</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
          >
            {items.map((item) => (
              <motion.div key={item.productId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="group h-full overflow-hidden transition-all hover:border-hilop-green/30 hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute right-3 top-3 rounded-full text-red-600 shadow-md"
                      onClick={() => handleRemove(item.productId, item.productName)}
                      aria-label={`Remove ${item.productName} from wishlist`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 p-4">
                    {item.productBrand && (
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        {item.productBrand}
                      </p>
                    )}
                    <h2 className="line-clamp-2 text-lg font-semibold">{item.productName}</h2>
                    <p className="text-xl font-bold text-hilop-green">{formatPrice(item.productPrice)}</p>

                    <Button asChild variant="outline" className="w-full hover:border-hilop-green hover:bg-hilop-green hover:text-black">
                      <Link href={`/products/${item.productSlug}`}>View product</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}