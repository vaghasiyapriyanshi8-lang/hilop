import api from '@/lib/api'
import { Product, ApiResponse, PaginationParams, SearchFilters } from '@/types'

export interface ProductsResponse extends ApiResponse<Product[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const productsService = {
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    filters?: SearchFilters
  }): Promise<ProductsResponse> {
    const response = await api.get('/products', { params })
    return response.data
  },

  async searchProducts(query: string, filters?: SearchFilters): Promise<Product[]> {
    const response = await api.get('/products/search', {
      params: { q: query, ...filters },
    })
    return response.data.data
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`)
    return response.data.data
  },

  async getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
    const response = await api.get('/products/categories')
    return response.data.data
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get('/products/featured')
    return response.data.data
  },

  async getNewArrivals(): Promise<Product[]> {
    const response = await api.get('/products/new-arrivals')
    return response.data.data
  },
}