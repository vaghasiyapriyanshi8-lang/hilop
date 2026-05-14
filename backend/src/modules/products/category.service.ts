import { FilterQuery } from 'mongoose';
import { CategoryDocument, CategoryModel } from './category.model';
import { ProductModel } from './product.model';

function normalizeSlug(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export class CategoryService {
  static async list(query: { page?: number; limit?: number; search?: string; parent?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const filter: FilterQuery<CategoryDocument> = { isActive: true };

    if (query.parent) {
      filter.parent = query.parent;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    const categories = await CategoryModel.find(filter)
      .sort({ order: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await CategoryModel.countDocuments(filter);

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await ProductModel.countDocuments({ category: cat.slug });
        return {
          ...cat,
          id: cat._id.toString(), // Map _id to id for frontend compatibility
          productCount,
        };
      })
    );

    return { data: categoriesWithCount, count, page, limit };
  }

  static async getById(id: string) {
    const category = await CategoryModel.findById(id).lean();
    if (!category) return null;

    const productCount = await ProductModel.countDocuments({ category: category.slug });
    return {
      ...category,
      id: category._id.toString(), // Map _id to id for frontend compatibility
      productCount,
    };
  }

  static async create(payload: Partial<CategoryDocument>) {
    const slug = payload.slug || normalizeSlug(payload.name || '');
    
    const existingCategory = await CategoryModel.findOne({ slug });
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = new CategoryModel({
      ...payload,
      slug,
    });

    const savedCategory = await category.save();
    const productCount = await ProductModel.countDocuments({ category: savedCategory.slug });
    return {
      ...savedCategory.toObject(),
      id: savedCategory._id.toString(), // Map _id to id for frontend compatibility
      productCount,
    };
  }

  static async update(id: string, payload: Partial<CategoryDocument>) {
    if (payload.name && !payload.slug) {
      const newSlug = normalizeSlug(payload.name);
      // Only update slug if it actually changed to avoid duplicate key error
      const existing = await CategoryModel.findById(id).lean();
      if (existing && existing.slug !== newSlug) {
        payload.slug = newSlug;
      } else {
        delete payload.slug;
      }
    }

    const category = await CategoryModel.findByIdAndUpdate(id, payload, {
      new: true,
    }).lean();

    if (!category) return null;

    const productCount = await ProductModel.countDocuments({ category: category.slug });
    return {
      ...category,
      id: category._id.toString(),
      productCount,
    };
  }

  static async delete(id: string) {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) return null;

    // Delete subcategories
    await CategoryModel.deleteMany({ parent: id });

    return category;
  }

  static async getAllCategories() {
    const categories = await CategoryModel.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    return Promise.all(
      categories.map(async (cat) => {
        const productCount = await ProductModel.countDocuments({ category: cat.slug });
        return {
          id: cat._id.toString(), // Map _id to id and convert to string
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          image: cat.image,
          parent: cat.parent,
          productCount,
        };
      })
    );
  }
}
