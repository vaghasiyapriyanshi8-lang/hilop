import api from '@/lib/api'
import { User, Address, CartItem, WishlistItem } from '@/types'

export interface UpdateProfileData {
  name?: string
  avatar?: string
  cartItems?: CartItem[]
  wishlistItems?: WishlistItem[]
}

export interface AddAddressData {
  type: 'home' | 'work' | 'other'
  name: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export const usersService = {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch('/users/me', data)
    return response.data.data
  },

  async addAddress(data: AddAddressData): Promise<Address> {
    const response = await api.post('/users/me/addresses', data)
    return response.data.data
  },

  async updateAddress(addressId: string, data: Partial<AddAddressData>): Promise<Address> {
    const response = await api.patch(`/users/me/addresses/${addressId}`, data)
    return response.data.data
  },

  async deleteAddress(addressId: string): Promise<void> {
    await api.delete(`/users/me/addresses/${addressId}`)
  },

  async syncCart(items: CartItem[]): Promise<User> {
    const response = await api.patch('/users/me', { cartItems: items })
    return response.data.data
  },

  async syncWishlist(items: WishlistItem[]): Promise<User> {
    const response = await api.patch('/users/me', { wishlistItems: items })
    return response.data.data
  },

  async getAddresses(): Promise<Address[]> {
    const response = await api.get('/users/me/addresses')
    return response.data.data
  },
}