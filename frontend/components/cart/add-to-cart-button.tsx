'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { useCartStore } from '@/store/cart'
import { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  variantData?: {
    size?: string
    color?: string
  }
  className?: string
  label?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  fullWidth?: boolean
  showRemoveAction?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  variantData,
  className = '',
  label = 'Add to Cart',
  size = 'default',
  variant = 'default',
  fullWidth = true,
  showRemoveAction = true,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const cartItem = useCartStore((state) =>
    state.items.find(
      (item) =>
        item.productId === product.id &&
        JSON.stringify(item.variant) === JSON.stringify(variantData)
    )
  )
  const { toast } = useToast()

  const image = product.images?.[0] || '/images/watch-elegance.svg'
  const isInCart = Boolean(cartItem)
  const quantityInCart = cartItem?.quantity || 0

  const buttonLabel = useMemo(() => {
    if (!product.inStock) return 'Out of Stock'
    if (isAdding) return 'Adding...'
    if (isInCart) return quantityInCart > 1 ? `In Cart (${quantityInCart})` : 'In Cart'
    return label
  }, [isAdding, isInCart, label, product.inStock, quantityInCart])

  const handleAddToCart = async () => {
    if (!product.inStock) return

    setIsAdding(true)

    try {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image,
        quantity,
        variant: variantData,
      })

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
        action: (
          <ToastAction altText="View cart" onClick={() => router.push('/cart')}>
            View cart
          </ToastAction>
        ),
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveFromCart = () => {
    removeItem(product.id, variantData)
    toast({
      title: 'Removed from cart',
      description: `${product.name} has been removed from your cart.`,
      action: (
        <ToastAction altText="View cart" onClick={() => router.push('/cart')}>
          View cart
        </ToastAction>
      ),
    })
  }

  return (
    <div className={fullWidth ? 'flex w-full items-center gap-2' : 'inline-flex items-center gap-2'}>
      <Button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock || isAdding}
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        {buttonLabel}
      </Button>

      {showRemoveAction && isInCart && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleRemoveFromCart}
          className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          aria-label={`Remove ${product.name} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}