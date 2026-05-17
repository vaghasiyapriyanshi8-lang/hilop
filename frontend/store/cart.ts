import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { usersService } from '@/services/api/users'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string, variant?: CartItem['variant']) => void
  updateQuantity: (productId: string, quantity: number, variant?: CartItem['variant']) => void
  clearCart: () => void
  getItem: (productId: string, variant?: CartItem['variant']) => CartItem | undefined
  replaceCart: (items: CartItem[]) => void
}

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

const syncCartToServer = async (items: CartItem[]) => {
  if (typeof window === 'undefined' || !localStorage.getItem('accessToken')) {
    return
  }

  try {
    await usersService.syncCart(items)
  } catch {
    // Ignore sync failures; local state still works and will retry on next mutation.
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (item) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            JSON.stringify(i.variant) === JSON.stringify(item.variant)
        )

        let newItems: CartItem[]
        if (existingItemIndex >= 0) {
          newItems = [...items]
          newItems[existingItemIndex].quantity += item.quantity
        } else {
          newItems = [
            ...items,
            {
              ...item,
              id: `${item.productId}-${Date.now()}-${Math.random()}`,
            },
          ]
        }

        const { total, itemCount } = calculateTotals(newItems)
        set({ items: newItems, total, itemCount })
        void syncCartToServer(newItems)
      },

      removeItem: (productId, variant) => {
        const { items } = get()
        const newItems = items.filter(
          (item) =>
            !(
              item.productId === productId &&
              JSON.stringify(item.variant) === JSON.stringify(variant)
            )
        )
        const { total, itemCount } = calculateTotals(newItems)
        set({ items: newItems, total, itemCount })
        void syncCartToServer(newItems)
      },

      updateQuantity: (productId, quantity, variant) => {
        const { items } = get()
        const newItems = items.map((item) =>
          item.productId === productId &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter((item) => item.quantity > 0)

        const { total, itemCount } = calculateTotals(newItems)
        set({ items: newItems, total, itemCount })
        void syncCartToServer(newItems)
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 })
        void syncCartToServer([])
      },

      getItem: (productId, variant) => {
        const { items } = get()
        return items.find(
          (item) =>
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
        )
      },

      replaceCart: (items) => {
        const { total, itemCount } = calculateTotals(items)
        set({ items, total, itemCount })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)