import { Schema, model, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  sku: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  stock: number;
  variants: Array<{ name: string; options: string }>;
  images: string[];
  features: string[];
  specs: Array<{ key: string; value: string }>;
  brand?: string;
  salePrice?: number;
  rating: number;
  reviewsCount: number;
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema(
  {
    name: { type: String, required: true },
    options: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true, text: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    sku: { type: String, required: true, unique: true, index: true },
    category: { type: String, index: true, required: true },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    stock: { type: Number, default: 0 },
    variants: { type: [variantSchema], default: [] },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    specs: [{
      key: String,
      value: String
    }],
    brand: { type: String, index: true },
    salePrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    inventory: { type: Number, default: 0, index: true },
    
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

export const ProductModel = model<ProductDocument>('Product', productSchema);
