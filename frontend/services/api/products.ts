import api from '@/lib/api'
import { Product, ApiResponse, SearchFilters } from '@/types'

export interface ProductsResponse extends ApiResponse<Product[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type BackendProduct = Product & {
  _id?: string
  oldPrice?: number
  salePrice?: number
  specs?: Record<string, string>
  reviewsCount?: number
  stock?: number
  inventory?: number
}

interface BackendProductsResponse {
  products?: BackendProduct[]
  count?: number
  page?: number
  limit?: number
  data?: BackendProduct[]
  pagination?: ProductsResponse['pagination']
}

function specsArrayToRecord(specs?: Array<{ key: string; value: string }> | Record<string, string>) {
  if (!specs) return {}
  if (!Array.isArray(specs)) return specs

  return specs.reduce<Record<string, string>>((acc, spec) => {
    if (spec?.key) acc[spec.key] = spec.value
    return acc
  }, {})
}

function specsRecordToArray(specs?: Record<string, string> | Array<{ key: string; value: string }>) {
  if (!specs) return []
  if (Array.isArray(specs)) return specs

  return Object.entries(specs).map(([key, value]) => ({ key, value }))
}

function normalizeProduct(product: BackendProduct): Product {
  const stockQuantity = product.stockQuantity ?? product.stock ?? product.inventory ?? 0
  const originalPrice = product.originalPrice ?? product.oldPrice
  const specifications = specsArrayToRecord(product.specifications || product.specs || {})
  const specs = specsRecordToArray(product.specs || product.specifications || {})

  return {
    ...product,
    id: product.id || product._id || product.slug,
    originalPrice,
    price: product.salePrice ?? product.price,
    images: product.images || [],
    brand: product.brand || 'Hilop',
    specifications,
    specs,
    rating: product.rating || 0,
    reviewCount: product.reviewCount ?? product.reviewsCount ?? 0,
    inStock: product.inStock ?? stockQuantity > 0,
    stockQuantity,
    tags: product.tags || product.features || [],
  }
}

function normalizeProductsResponse(response: BackendProductsResponse): ProductsResponse {
  const rawProducts = response.data || response.products || []
  const page = response.pagination?.page ?? response.page ?? 1
  const limit = response.pagination?.limit ?? response.limit ?? rawProducts.length
  const total = response.pagination?.total ?? response.count ?? rawProducts.length

  return {
    success: true,
    data: rawProducts.map(normalizeProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: response.pagination?.totalPages ?? Math.max(1, Math.ceil(total / Math.max(1, limit || 1))),
    },
  }
}

export const productsService = {
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sort?: string
    filters?: SearchFilters
  }): Promise<ProductsResponse> {
    const response = await api.get('/products', { params })
    return normalizeProductsResponse(response.data)
  },

  async searchProducts(query: string, filters?: SearchFilters): Promise<Product[]> {
    const response = await api.get('/products/search', {
      params: { q: query, ...filters },
    })
    return normalizeProductsResponse(response.data).data
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`)
    return normalizeProduct(response.data.data)
  },

  async getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
    const response = await api.get('/products/categories/list')
    return response.data.data
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get('/products/featured', { params: { limit: 8 } })
    return normalizeProductsResponse(response.data).data
  },

  async getNewArrivals(): Promise<Product[]> {
    const response = await api.get('/products', { params: { limit: 4, sort: 'newest' } })
    return normalizeProductsResponse(response.data).data
  },
}
