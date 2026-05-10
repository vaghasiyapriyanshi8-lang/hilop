import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { authService } from '@/services/api/auth'

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