import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { authService } from '@/services/api/auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

export function useInitializeAuth() {
  const { login, logout, setLoading } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
          setLoading(false)
          return
        }

        const user = await authService.getCurrentUser()
        login(user)
        useCartStore.getState().replaceCart(user.cartItems || [])
        useWishlistStore.getState().replaceWishlist(user.wishlistItems || [])
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        logout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [login, logout, setLoading])
}