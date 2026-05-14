import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: {
    size?: string
    color?: string
  }
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string, variant?: CartItem['variant']) => void
  updateQuantity: (productId: string, quantity: number, variant?: CartItem['variant']) => void
  clearCart: () => void
  getItem: (productId: string, variant?: CartItem['variant']) => CartItem | undefined
}

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
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
              id: `₹{item.productId}-₹{Date.now()}-₹{Math.random()}`,
            },
          ]
        }

        const { total, itemCount } = calculateTotals(newItems)
        set({ items: newItems, total, itemCount })
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
      },

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),

      getItem: (productId, variant) => {
        const { items } = get()
        return items.find(
          (item) =>
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
        )
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)