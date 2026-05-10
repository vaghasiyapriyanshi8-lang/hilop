export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Category;
  brand: string;
  stock: number;
  ratings: number;
  numReviews: number;
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  _id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
}

export interface Category {
  _id: string;
  name: string;
  image?: string;
  slug: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface Order {
  _id: string;
  user: User;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}