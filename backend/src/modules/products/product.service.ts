import { FilterQuery } from 'mongoose';
import { ProductDocument, ProductModel } from './product.model';

export class ProductService {
  static async list(query: { page?: number; limit?: number; search?: string; category?: string; sort?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const filter: FilterQuery<ProductDocument> = { status: 'active' };

    if (query.category) filter.category = query.category;
    if (query.search) filter.$text = { $search: query.search };

    const sort = query.sort === 'price_asc' ? { price: 1 as const } : query.sort === 'price_desc' ? { price: -1 as const } : { createdAt: -1 as const };

    const products = await ProductModel.find(filter)
      .sort(sort as any)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await ProductModel.countDocuments(filter);

    return { products, count, page, limit };
  }

  static async adminList(query: { page?: number; limit?: number; search?: string; category?: string; sort?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const filter: FilterQuery<ProductDocument> = {};

    if (query.category) filter.category = query.category;
    if (query.search) filter.$text = { $search: query.search };

    const sort = query.sort === 'price_asc' ? { price: 1 as const } : query.sort === 'price_desc' ? { price: -1 as const } : { createdAt: -1 as const };

    const products = await ProductModel.find(filter)
      .sort(sort as any)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await ProductModel.countDocuments(filter);

    return { products, count, page, limit };
  }

  static async getById(id: string) {
    return ProductModel.findById(id).lean();
  }

  static async getBySlug(slug: string) {
    return ProductModel.findOne({ slug, status: 'active' }).lean();
  }

  static async create(payload: Partial<ProductDocument>) {
    if (!payload.slug && payload.name) {
      payload.slug = payload.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    return ProductModel.create(payload);
  }

  static async update(id: string, payload: Partial<ProductDocument>) {
    return ProductModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  }

  static async delete(id: string) {
    return ProductModel.findByIdAndDelete(id);
  }

  static async getCategories() {
    const categories = await ProductModel.distinct('category');
    return categories.map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      slug: cat,
    }));
  }
}
