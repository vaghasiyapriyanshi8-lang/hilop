import api from '@/lib/api'
import { Order, OrderItem, ApiResponse } from '@/types'

export interface CreateOrderData {
  items: OrderItem[]
  shippingAddress: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  notes?: string
}

export const ordersService = {
  async getOrders(params?: { page?: number; limit?: number }): Promise<ApiResponse<Order[]>> {
    const response = await api.get('/orders', { params })
    return response.data
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`)
    return response.data.data
  },

  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', data)
    return response.data.data
  },
}