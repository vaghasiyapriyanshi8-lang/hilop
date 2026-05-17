'use client'

import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { Product } from '@/types'
import { useWishlistStore } from '@/store/wishlist'

interface WishlistToggleButtonProps {
  product: Product
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export function WishlistToggleButton({
  product,
  className = '',
  size = 'icon',
  variant = 'secondary',
}: WishlistToggleButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isWishlisted = useWishlistStore((state) => state.items.some((item) => item.productId === product.id))
  const toggleItem = useWishlistStore((state) => state.toggleItem)

  const handleToggle = () => {
    const wasWishlisted = isWishlisted
    toggleItem(product)

    toast({
      title: wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: wasWishlisted
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been saved to your wishlist.`,
      action: (
        <ToastAction altText="View wishlist" onClick={() => router.push('/wishlist')}>
          View wishlist
        </ToastAction>
      ),
    })
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleToggle}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={`${className} ${isWishlisted ? 'text-red-600' : ''}`.trim()}
    >
      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
    </Button>
  )
}