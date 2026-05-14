export const API_BASE_URL = 'http://localhost:5000/api'; // Android emulator
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/₹{id}`,
  FEATURED: '/products/featured',
  NEW_ARRIVALS: '/products/new-arrivals',
  CATEGORIES: '/categories',
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  REMOVE_FROM_CART: (id: string) => `/cart/remove/₹{id}`,
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/₹{id}`,
  // Wishlist
  WISHLIST: '/wishlist',
  // User
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  ADDRESSES: '/users/addresses',
};