export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  variants?: ProductVariant[]
  specifications: Record<string, string>
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  size?: string
  color?: string
  price?: number
  stockQuantity: number
  sku: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  subcategories?: Category[]
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  addresses?: Address[]
  createdAt: string
}

export interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  variant?: ProductVariant
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: ProductVariant
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  productId: string
  rating: number
  title: string
  comment: string
  images?: string[]
  verified: boolean
  createdAt: string
}

export interface WishlistItem {
  id: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  addedAt: string
}

export interface SearchFilters {
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  inStock?: boolean
  tags?: string[]
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}