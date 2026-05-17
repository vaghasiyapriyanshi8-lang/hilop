import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => {
        useCartStore.getState().clearCart()
        useWishlistStore.getState().clearWishlist()
        set({ user: null, isAuthenticated: false, isLoading: false })
      },
      setLoading: (isLoading) => set({ isLoading }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)