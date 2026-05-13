import api from '@/lib/api'
import { AuthTokens, User } from '@/types'

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface VerifyOtpData {
  email: string
  otp: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
}

export const authService = {
  async login(data: LoginData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  async signup(data: SignupData): Promise<{ user: User; accessToken?: string; refreshToken?: string; tokens?: AuthTokens; message?: string }> {
    const response = await api.post('/auth/signup', data)
    return response.data
  },

  async refreshToken(): Promise<AuthTokens> {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async verifyOtp(data: VerifyOtpData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post('/auth/verify-otp', data)
    return response.data
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', data)
    return response.data
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me')
    return response.data.data
  },
}
