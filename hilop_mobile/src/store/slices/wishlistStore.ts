import { create } from 'zustand';
import { Product } from '../../types';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  addItem: product =>
    set(state => ({ items: [...state.items, product] })),
  removeItem: productId =>
    set(state => ({ items: state.items.filter(i => i._id !== productId) })),
  isWishlisted: productId => get().items.some(i => i._id === productId),
}));