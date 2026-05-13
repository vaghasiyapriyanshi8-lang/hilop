import { Schema, model, Document } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  parent?: string; // For subcategories
  order: number;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    icon: { type: String },
    image: { type: String },
    parent: { type: String, ref: 'Category' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1, isActive: 1 });

export const CategoryModel = model<CategoryDocument>('Category', categorySchema);
