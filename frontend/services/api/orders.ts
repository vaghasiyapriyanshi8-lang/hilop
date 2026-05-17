import api from '@/lib/api'
import { Order, OrderItem, ApiResponse } from '@/types'

export interface CreateOrderData {
  items: Array<{
    productId: string
    productName?: string
    productImage?: string
    quantity: number
    price: number
    variant?: string
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: {
    line1: string
    city: string
    country: string
    postalCode: string
    phone: string
  }
  status?: string
  paymentMethod: string
  paymentStatus?: string
  notes?: string
}

export const ordersService = {
  async getOrders(params?: { page?: number; limit?: number }): Promise<ApiResponse<Order[]>> {
    try {
      const response = await api.get('/orders', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  async getOrder(id: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  },

  async createOrder(data: CreateOrderData): Promise<any> {
    try {
      console.log('Creating order with data:', JSON.stringify(data, null, 2))
      const response = await api.post('/orders', data)
      console.log('Order creation response:', response)
      
      // Handle both response structures
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }
      
      throw new Error('Invalid response structure from server')
    } catch (error: any) {
      console.error('Error creating order:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      if (status === 'cancelled') {
        const response = await api.patch(`/orders/${orderId}/cancel`)
        return response.data
      }
      const response = await api.patch(`/orders/${orderId}/status`, { status })
      return response.data
    } catch (error: any) {
      console.error('Error updating order status:', error)
      throw error
    }
  },

  async requestReturn(orderId: string, payload: { reason: string; type: 'return' | 'exchange' }): Promise<any> {
    const response = await api.post(`/orders/${orderId}/return`, payload)
    return response.data
  },
}