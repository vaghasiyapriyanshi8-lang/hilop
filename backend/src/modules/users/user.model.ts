import { Schema, model, Document } from 'mongoose';

export interface CartItemRecord {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface WishlistItemRecord {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  productSlug: string;
  productBrand?: string;
  addedAt: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  googleId?: string;
  roles: string[];
  avatar?: string;
  cartItems: CartItemRecord[];
  wishlistItems: WishlistItemRecord[];
  addresses: Array<{
    id: string;
    type: 'home' | 'work' | 'other';
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cartVariantSchema = new Schema(
  {
    size: { type: String },
    color: { type: String },
  },
  { _id: false }
);

const cartItemSchema = new Schema(
  {
    id: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    variant: { type: cartVariantSchema, required: false },
  },
  { _id: false }
);

const wishlistItemSchema = new Schema(
  {
    id: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productSlug: { type: String, required: true },
    productBrand: { type: String },
    addedAt: { type: String, required: true },
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: false, select: false },
    phone: { type: String, required: false },
    googleId: { type: String, required: false, unique: true, sparse: true },
    roles: { type: [String], default: ['user'] },
    avatar: { type: String },
    cartItems: { type: [cartItemSchema], default: [] },
    wishlistItems: { type: [wishlistItemSchema], default: [] },
    addresses: { type: [addressSchema], default: [] },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ name: 'text' });

export const UserModel = model<UserDocument>('User', userSchema);
