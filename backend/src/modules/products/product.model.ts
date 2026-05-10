import { Schema, model, Document } from 'mongoose';

export interface ProductDocument extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  brand: string;
  category: string;
  variants: Array<{ name: string; value: string; stock: number; priceAdjustment: number }>;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  rating: number;
  reviewsCount: number;
  inventory: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    stock: { type: Number, default: 0 },
    priceAdjustment: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true, trim: true, text: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    brand: { type: String, index: true, required: true },
    category: { type: String, index: true, required: true },
    variants: { type: [variantSchema], default: [] },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    specs: { type: Object, default: {} },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    inventory: { type: Number, default: 0, index: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', brand: 'text', category: 'text' });
productSchema.index({ isFeatured: 1, inventory: 1 });

export const ProductModel = model<ProductDocument>('Product', productSchema);
