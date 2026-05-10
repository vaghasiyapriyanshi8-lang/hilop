import { create } from 'zustand';
import { CartItem, Product, ProductVariant } from '../../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity = 1, variant) => {
    set(state => {
      const existing = state.items.find(i => i.product._id === product._id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { _id: product._id, product, quantity, variant }],
      };
    });
  },
  removeItem: productId =>
    set(state => ({ items: state.items.filter(i => i.product._id !== productId) })),
  updateQuantity: (productId, quantity) =>
    set(state => ({
      items: state.items.map(i =>
        i.product._id === productId ? { ...i, quantity } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () =>
    get().items.reduce(
      (sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity,
      0
    ),
}));