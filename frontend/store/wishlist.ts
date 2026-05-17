import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'
import { usersService } from '@/services/api/users'

export interface WishlistEntry {
  id: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  productSlug: string
  productBrand?: string
  addedAt: string
}

interface WishlistState {
  items: WishlistEntry[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  clearWishlist: () => void
  hasItem: (productId: string) => boolean
  replaceWishlist: (items: WishlistEntry[]) => void
}

const createWishlistEntry = (product: Product): WishlistEntry => ({
  id: `${product.id}-${Date.now()}-${Math.random()}`,
  productId: product.id,
  productName: product.name,
  productImage: product.images?.[0] || '/images/watch-elegance.svg',
  productPrice: product.price,
  productSlug: product.slug || product.id,
  productBrand: product.brand,
  addedAt: new Date().toISOString(),
})

const syncWishlistToServer = async (items: WishlistEntry[]) => {
  if (typeof window === 'undefined' || !localStorage.getItem('accessToken')) {
    return
  }

  try {
    await usersService.syncWishlist(items)
  } catch {
    // Ignore sync failures; local state still works and will retry on next mutation.
  }
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.some((item) => item.productId === product.id)

        if (exists) return

        const nextItems = [...get().items, createWishlistEntry(product)]
        set({ items: nextItems })
        void syncWishlistToServer(nextItems)
      },

      removeItem: (productId) => {
        const nextItems = get().items.filter((item) => item.productId !== productId)
        set({ items: nextItems })
        void syncWishlistToServer(nextItems)
      },

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.productId === product.id)

        if (exists) {
          get().removeItem(product.id)
          return
        }

        get().addItem(product)
      },

      clearWishlist: () => {
        set({ items: [] })
        void syncWishlistToServer([])
      },

      hasItem: (productId) => get().items.some((item) => item.productId === productId),

      replaceWishlist: (items) => set({ items }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
)